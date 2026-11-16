// Genera una tanda de piezas con Codex (estilo v7): compone la petición desde motor/piezas/peticion.md y la escala,
// lanza `codex exec` con las referencias de estilo, convierte la hoja con convertir.py y saca la hoja de contactos.
// Todo lo pesado queda en .runtime/piezas/<vídeo>/<tanda>/intento-N/; al proyecto solo llega lo aceptado (--aceptar).
//
// Uso (desde la raíz del repo):
//   node motor/piezas/generar.mjs --tanda proyectos/<slug>/piezas/tandas/01-calle.json [--seco]
//   node motor/piezas/generar.mjs --tanda … --solo-convertir [N]     reconvierte el intento N (por defecto, el último)
//   node motor/piezas/generar.mjs --tanda … --aceptar N              copia su piezas.json a tandas/01-calle.piezas.json
//   [--referencias a.png,b.png]   en lugar de motor/piezas/referencia/{estilo,escala}.png
//
// La tanda (JSON): {"tipo"?, "mismoPersonaje"?, "extra"?, "referencias"?, "tonos"? (14), "limpiar"? (true),
//                   "piezas": [{"nombre", "pide", "tipo"?, "alto"?, "ancho"?}]}   (hasta 4 casillas por hoja)
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { PIEZAS, RAIZ, RUNTIME, escala, idDe, leerJSON, personaReferencia, python, rel } from "./comun.mjs";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? undefined : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const fallo = (m) => { console.error(m); process.exit(1); };

const rutaTanda = arg("tanda");
if (!rutaTanda || rutaTanda === true) fallo("Falta --tanda <ruta de la tanda .json>");
const TANDA = resolve(rutaTanda);
const tanda = leerJSON(TANDA) || fallo(`No encuentro ${rutaTanda}`);
const nombreTanda = basename(TANDA, ".json");
const fuente = dirname(dirname(TANDA)); // <fuente>/tandas/<tanda>.json
const id = idDe(fuente);
const base = join(RUNTIME, "piezas", id, nombreTanda);
const esc = escala();

if (!Array.isArray(tanda.piezas) || !tanda.piezas.length) fallo("La tanda no trae piezas");
if (tanda.piezas.length > 4) fallo("Hasta 4 casillas por hoja: Codex pierde el tamaño y la separación con más");
for (const p of tanda.piezas) {
  p.tipo ??= tanda.tipo;
  if (!p.nombre || !p.pide) fallo(`Cada pieza necesita «nombre» y «pide»: ${JSON.stringify(p)}`);
  if (!esc.tipos[p.tipo]) fallo(`${p.nombre}: tipo «${p.tipo}» que no está en motor/piezas/escala.json`);
  p.alto ??= esc.tipos[p.tipo].alto;
  p.ancho ??= esc.tipos[p.tipo].ancho;
}

// ---------- petición ----------
function referencias() {
  const dadas = arg("referencias");
  if (typeof dadas === "string") return dadas.split(",").map((r) => resolve(r));
  if (tanda.referencias) return tanda.referencias.map((r) => resolve(RAIZ, r));
  return ["estilo.png", "escala.png"].map((f) => join(PIEZAS, "referencia", f)).filter(existsSync);
}
// Codex dibuja un 12-17 % más pequeño de lo que se le pide (set v7, 2026-11-15) y ampliar no añade detalle: se le pide
// un 25 % de más, persona de referencia incluida, y el conversor reduce a la altura exacta.
const MARGEN = 1.25;
const de_mas = (n) => Math.round(n * MARGEN);
function peticion(refs) {
  const plantilla = readFileSync(join(PIEZAS, "peticion.md"), "utf8");
  const casillas = tanda.piezas.map((p, k) => `${k + 1}. ${p.pide.replace(/\.$/, "")}. Unos ${de_mas(p.alto)} píxeles lógicos de alto` +
    (p.ancho ? ` y ${de_mas(p.ancho)} de ancho` : "") + ".").join("\n");
  const extra = [
    tanda.mismoPersonaje ? "Todas las casillas son el MISMO personaje en distintas poses: misma ropa, colores, pelo y tamaño." : "",
    tanda.extra || "",
  ].filter(Boolean).join("\n");
  const textoRefs = refs.length
    ? `\nLas ${refs.length === 1 ? "imagen adjunta es" : `${refs.length} imágenes adjuntas son`} piezas aprobadas de mi vídeo y marcan el ESTILO y la ESCALA a imitar: mismo contorno, mismos tonos, misma luz y mismo tamaño de píxel. No copies sus objetos.\n`
    : "";
  return plantilla.replace("{REFERENCIAS}", textoRefs).replace("{N}", String(tanda.piezas.length))
    .replace("{PERSONA}", String(de_mas(esc.persona))).replace("{PIEZAS}", casillas).replace("{EXTRA}", extra).trim() + "\n";
}
// Las -i van antes de -C: -i admite varias imágenes y se tragaría lo que viniera detrás. La petición va por stdin («-»).
const ordenCodex = (refs, carpeta) => ["exec", "--skip-git-repo-check", ...refs.flatMap((r) => ["-i", r]), "-C", carpeta, "-s", "workspace-write", "-"];
const intentos = () => (existsSync(base) ? readdirSync(base).map((d) => Number(d.match(/^intento-(\d+)$/)?.[1])).filter(Boolean) : []);

// ---------- conversión ----------
function convertir(carpeta) {
  const hojaPng = join(carpeta, "hoja.png");
  if (!existsSync(hojaPng)) fallo(`No hay hoja.png en ${rel(carpeta)}: mira ${rel(join(carpeta, "codex.log"))}`);
  const ref = personaReferencia();
  const a = [join(PIEZAS, "convertir.py"), hojaPng, join(carpeta, "piezas.json"),
    "--nombres", tanda.piezas.map((p) => p.nombre).join(","),
    "--altos", tanda.piezas.map((p) => `${p.nombre}=${p.alto}`).join(","),
    "--tonos", String(tanda.tonos ?? 14), "--contactos", join(carpeta, "contactos.png"), "--regla", join(carpeta, "regla")];
  if (tanda.limpiar ?? true) a.push("--limpiar");
  if (ref) {
    const refJson = join(carpeta, "referencia.json");
    writeFileSync(refJson, JSON.stringify({ quieto: ref }));
    a.push("--referencia", `${refJson}#quieto`);
  }
  const r = python(a);
  process.stdout.write(r.stdout);
  if (r.status !== 0) fallo(`convertir.py falló:\n${r.stderr}`);
  const piezas = leerJSON(join(carpeta, "piezas.json"));
  for (const p of tanda.piezas) piezas[p.nombre].tipo = p.tipo;
  writeFileSync(join(carpeta, "piezas.json"), JSON.stringify(piezas, null, 1) + "\n");
  return piezas;
}

// ---------- órdenes ----------
if (arg("aceptar")) {
  const n = Number(arg("aceptar"));
  const origen = join(base, `intento-${n}`, "piezas.json");
  if (!existsSync(origen)) fallo(`No existe ${rel(origen)}`);
  const destino = join(dirname(TANDA), `${nombreTanda}.piezas.json`);
  copyFileSync(origen, destino);
  console.log(JSON.stringify({ aceptado: rel(origen), en: rel(destino) }));
  process.exit(0);
}

if (arg("solo-convertir")) {
  const v = arg("solo-convertir");
  const n = v === true ? Math.max(0, ...intentos()) : Number(v);
  if (!n) fallo(`No hay intentos en ${rel(base)}`);
  const carpeta = join(base, `intento-${n}`);
  convertir(carpeta);
  console.log(JSON.stringify({ intento: n, contactos: rel(join(carpeta, "contactos.png")) }));
  process.exit(0);
}

const refs = referencias();
for (const r of refs) if (!existsSync(r)) fallo(`No existe la referencia ${r}`);
const n = Math.max(0, ...intentos()) + 1;
const carpeta = join(base, `intento-${n}`);
const orden = ordenCodex(refs, carpeta);
const texto = peticion(refs);

if (arg("seco")) {
  console.log(JSON.stringify({ orden: ["codex", ...orden], carpeta: rel(carpeta), referencias: refs.map(rel), peticion: texto }, null, 1));
  process.exit(0);
}

mkdirSync(carpeta, { recursive: true });
writeFileSync(join(carpeta, "peticion.txt"), texto);
const t0 = Date.now();
// codex es un .cmd en Windows: hace falta el shell. Las rutas van entre comillas; la petición, por stdin.
const r = spawnSync(["codex", ...orden.map((a) => (/[\s&()]/.test(a) ? `"${a}"` : a))].join(" "), {
  shell: true, input: texto, encoding: "utf8", timeout: 15 * 60 * 1000, maxBuffer: 64 * 1024 * 1024,
});
const segundos = Math.round((Date.now() - t0) / 100) / 10;
const log = `${r.stdout || ""}\n${r.stderr || ""}`;
writeFileSync(join(carpeta, "codex.log"), log);
const tokens = Number((log.match(/tokens used\s*\n?\s*([\d.,]+)/) || [])[1]?.replace(/[.,]/g, "")) || null;
appendFileSync(join(RUNTIME, "piezas", id, "registro.jsonl"), JSON.stringify({
  fecha: new Date().toISOString(), tanda: nombreTanda, intento: n, segundos, tokens, estado: r.status, piezas: tanda.piezas.map((p) => p.nombre),
}) + "\n");
if (r.status !== 0 || !existsSync(join(carpeta, "hoja.png"))) fallo(`codex terminó con ${r.status} y sin hoja.png (${segundos} s). Últimas líneas:\n${log.trim().split("\n").slice(-15).join("\n")}`);
convertir(carpeta);
console.log(JSON.stringify({ intento: n, segundos, tokens, contactos: rel(join(carpeta, "contactos.png")), aceptar: `node motor/piezas/generar.mjs --tanda ${rel(TANDA)} --aceptar ${n}` }));
