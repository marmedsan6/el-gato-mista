// Cliente mínimo de la API v2 de PixelLab para el piloto de piezas generadas (2026-11-14). Sin dependencias.
// La clave se lee de .runtime/claves/pixellab.txt y nunca se imprime. Cada llamada de pago se anota en el registro.
//   node motor/piloto/piezas-generadas/pixellab.mjs saldo
//   node motor/piloto/piezas-generadas/pixellab.mjs <endpoint> <peticion.json> <salida-base>
//     (la petición puede llevar rutas de PNG en "@ruta" donde la API espera { type: "base64", base64 })
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
// La clave: de la variable PIXELLAB_API_KEY o, si no está, de .runtime/claves/pixellab.txt
const CLAVE = (process.env.PIXELLAB_API_KEY || readFileSync(join(RAIZ, ".runtime/claves/pixellab.txt"), "utf8")).trim();
const BASE = "https://api.pixellab.ai/v2";
const DIR = join(RAIZ, ".runtime/piloto-piezas/pixellab");
const REGISTRO = join(DIR, "registro.json");
const TOPE = 30;
mkdirSync(DIR, { recursive: true });

const registro = existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, "utf8")) : [];
const guardar = () => writeFileSync(REGISTRO, JSON.stringify(registro, null, 1));
const cabeceras = { Authorization: `Bearer ${CLAVE}`, "Content-Type": "application/json" };

async function pedir(metodo, ruta, cuerpo) {
  const r = await fetch(BASE + ruta, { method: metodo, headers: cabeceras, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const texto = await r.text();
  let json; try { json = JSON.parse(texto); } catch { json = { crudo: texto.slice(0, 500) }; }
  return { estado: r.status, json };
}

// Sustituye "@ruta.png" por la imagen en base64 que espera la API
function conImagenes(v) {
  if (typeof v === "string" && v.startsWith("@")) return { type: "base64", base64: "data:image/png;base64," + readFileSync(resolve(RAIZ, v.slice(1))).toString("base64") };
  if (Array.isArray(v)) return v.map(conImagenes);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, conImagenes(x)]));
  return v;
}

// Guarda todas las imágenes base64 que haya en la respuesta como PNG numerados
function guardarImagenes(json, base) {
  const salida = [];
  const recorrer = (v) => {
    if (!v || typeof v !== "object") return;
    if (typeof v.base64 === "string" && v.base64.length > 100) {
      const b64 = v.base64.replace(/^data:image\/\w+;base64,/, "");
      const ruta = `${base}-${salida.length}.png`;
      writeFileSync(ruta, Buffer.from(b64, "base64")); salida.push(ruta); return;
    }
    Object.values(v).forEach(recorrer);
  };
  recorrer(json);
  return salida;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const [orden, peticion, salidaBase] = process.argv.slice(2);

if (orden === "saldo") {
  const { estado, json } = await pedir("GET", "/balance");
  console.log(JSON.stringify({ estado, saldo: json }, null, 1));
} else if (orden === "get") { // node pixellab.mjs get /characters/<id> <salida.json>: consulta sin coste y guarda la respuesta
  const { estado, json } = await pedir("GET", peticion);
  writeFileSync(resolve(RAIZ, salidaBase), JSON.stringify(json, null, 1));
  console.log(JSON.stringify({ estado, claves: Object.keys(json) }));
} else if (orden === "bajar") { // node pixellab.mjs bajar <url> <salida.png>: descarga una imagen de PixelLab
  const r = await fetch(peticion, { headers: peticion.startsWith(BASE) ? { Authorization: `Bearer ${CLAVE}` } : {} });
  writeFileSync(resolve(RAIZ, salidaBase), Buffer.from(await r.arrayBuffer()));
  console.log(JSON.stringify({ estado: r.status, bytes: Number(r.headers.get("content-length")) || null }));
} else {
  if (registro.length >= TOPE) { console.error(`Tope de ${TOPE} llamadas alcanzado`); process.exit(2); }
  const cuerpo = conImagenes(JSON.parse(readFileSync(resolve(RAIZ, peticion), "utf8")));
  const ini = Date.now();
  let { estado, json } = await pedir("POST", "/" + orden, cuerpo);
  const entrada = { endpoint: orden, peticion, hora: new Date().toISOString(), estado, usage: json.usage ?? null,
    character_id: json.character_id ?? null, object_id: json.object_id ?? null, background_job_id: json.background_job_id ?? null };
  registro.push(entrada); guardar();
  if (estado === 202 || (json.background_job_id && !json.image && !json.images)) {
    const id = json.background_job_id;
    for (let i = 0; i < 90; i++) {
      await espera(5000);
      const r = await pedir("GET", `/background-jobs/${id}`);
      if (r.json.status === "completed" || r.json.status === "failed") { estado = r.estado; json = r.json; break; }
    }
    entrada.estado_final = json.status; entrada.usage = entrada.usage ?? json.usage ?? null; guardar();
  }
  if (Array.isArray(json.background_job_ids) && json.background_job_ids.length) { // animaciones: un trabajo por dirección
    entrada.background_job_ids = json.background_job_ids; entrada.animation_group_id = json.animation_group_id ?? null; guardar();
    const resultados = [];
    for (const id of json.background_job_ids) {
      for (let i = 0; i < 120; i++) {
        await espera(5000);
        const r = await pedir("GET", `/background-jobs/${id}`);
        if (r.json.status === "completed" || r.json.status === "failed") { resultados.push(r.json); estado = r.estado; break; }
      }
    }
    json = { trabajos: resultados, status: resultados.some((r) => r.status === "failed") ? "failed" : "completed" };
    entrada.estado_final = json.status; entrada.usage = resultados.map((r) => r.usage ?? null); guardar();
  }
  entrada.segundos = Math.round((Date.now() - ini) / 100) / 10; guardar();
  if (estado >= 300 || json.status === "failed") {
    console.error(`Fallo HTTP ${estado}:`, JSON.stringify(json.detail ?? json.last_response?.detail ?? json).slice(0, 800));
    process.exit(1);
  }
  const pngs = guardarImagenes(json, resolve(RAIZ, salidaBase));
  entrada.pngs = pngs.length; guardar();
  console.log(JSON.stringify({ estado, segundos: entrada.segundos, usage: entrada.usage, pngs }, null, 1));
}
