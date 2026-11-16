// Lo común de las herramientas del arte generado (estilo v7): rutas, Python, la resolución de las piezas de un vídeo
// (o del set) y su validación. Lo usan generar.mjs, montar.mjs y promover.mjs.
//
// Una «fuente» de piezas es una carpeta con:
//   tandas/<tanda>.json          lo que se pide a Codex (generar.mjs)
//   tandas/<tanda>.piezas.json   el intento aceptado, ya convertido (generar.mjs --aceptar)
//   lista.json                   qué piezas usa el vídeo y de dónde salen: {"piezas": [{"nombre", "de": "<tanda>"|"set", "pieza"?}]}
//   meta.json                    lo medido a mano sobre cada pieza: {"<nombre>": {tipo, base, ancla, anclas, estados, igualar, …}}
// La de un vídeo es proyectos/<slug>/piezas/; la del set de referencia, motor/estilo/v7/set/fuente/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PIEZAS = dirname(fileURLToPath(import.meta.url));
export const RAIZ = resolve(PIEZAS, "..", "..");
export const SET_DIR = join(RAIZ, "motor", "estilo", "v7", "set");
export const SET_JSON = join(SET_DIR, "set.json");
export const RUNTIME = process.env.RUNTIME_DIR || join(RAIZ, ".runtime");
export const PYTHON = process.env.PYTHON || "C:/Users/mario/AppData/Local/Programs/Python/Python312/python.exe";

export const leerJSON = (ruta, porDefecto) => (existsSync(ruta) ? JSON.parse(readFileSync(ruta, "utf8")) : porDefecto);
export const rel = (ruta) => relative(RAIZ, ruta).replace(/\\/g, "/");
export const paleta = () => leerJSON(join(PIEZAS, "paleta.json")).rampas;
export const escala = () => leerJSON(join(PIEZAS, "escala.json"));
export const coloresPaleta = () => new Set(Object.values(paleta()).flat().map((c) => c.toLowerCase()));

// «ia-pasa-factura» → proyectos/ia-pasa-factura/piezas; «set» → la fuente del set; cualquier otra cosa, una ruta.
export function carpetaFuente(arg) {
  if (!arg) throw new Error("Falta el vídeo (slug), «set» o la carpeta de piezas");
  if (arg === "set") return join(SET_DIR, "fuente");
  const proyecto = join(RAIZ, "proyectos", arg, "piezas");
  if (!arg.includes("/") && !arg.includes("\\") && existsSync(join(RAIZ, "proyectos", arg))) return proyecto;
  return resolve(arg);
}

// Nombre corto de una fuente, para .runtime/piezas/<id>/ y el origen de cada pieza: el slug del vídeo, «set» o el
// nombre de la carpeta
export function idDe(fuente) {
  const r = rel(resolve(fuente));
  const m = r.match(/^proyectos\/([^/]+)\//);
  if (m) return m[1];
  if (r.startsWith("motor/estilo/v7/set")) return "set";
  const b = basename(resolve(fuente));
  return b === "piezas" ? basename(dirname(resolve(fuente))) : b;
}

export function python(args, opciones = {}) {
  const r = spawnSync(PYTHON, args, { encoding: "utf8", ...opciones });
  if (r.error) throw new Error(`No se pudo lanzar Python (${PYTHON}): ${r.error.message}`);
  return r;
}

const SIN_META = ["pixel_falso", "limpiados"];

// Las piezas de una fuente, con su meta aplicada (y el «igualar» ya hecho sobre la paleta), en el orden de la lista
export function resolver(dir, { set = leerJSON(SET_JSON, { piezas: {} }) } = {}) {
  const lista = leerJSON(join(dir, "lista.json"));
  if (!lista) throw new Error(`Falta ${rel(join(dir, "lista.json"))}`);
  const meta = leerJSON(join(dir, "meta.json"), {});
  const tandas = {}, piezas = {}, errores = [];
  for (const e of lista.piezas) {
    const origen = e.pieza || e.nombre;
    if (piezas[e.nombre]) { errores.push(`${e.nombre}: repetida en la lista`); continue; }
    let base;
    if (e.de === "set") {
      base = set.piezas[origen];
      if (!base) { errores.push(`${e.nombre}: no está en el set (${origen})`); continue; }
    } else {
      const ruta = join(dir, "tandas", `${e.de}.piezas.json`);
      tandas[e.de] ??= leerJSON(ruta);
      if (!tandas[e.de]) { errores.push(`${e.nombre}: falta ${rel(ruta)} (acepta un intento con generar.mjs --aceptar)`); continue; }
      base = tandas[e.de][origen];
      if (!base) { errores.push(`${e.nombre}: la tanda ${e.de} no trae «${origen}»`); continue; }
    }
    const p = { ...structuredClone(base), ...structuredClone(meta[e.nombre] || {}) };
    for (const k of SIN_META) delete p[k];
    if (p.igualar) {
      for (const k in p.paleta) p.paleta[k] = p.igualar[p.paleta[k]] || p.paleta[k];
      delete p.igualar;
    }
    p.origen = e.de === "set" ? (base.origen || `set:${origen}`) : `${idDe(dir)}:${e.de}`;
    if (e.de === "set") p.set = true;
    if (e.estacion !== undefined) p.estacion = e.estacion;
    piezas[e.nombre] = p;
  }
  return { piezas, errores, lista };
}

const dentro = (r, p) => r && Number.isFinite(r.x) && Number.isFinite(r.y) && r.x >= 0 && r.y >= 0 &&
  r.x + (r.w ?? 1) <= p.w && r.y + (r.h ?? 1) <= p.h;

// Errores que impiden montar: anclas fuera de la pieza, colores fuera de la paleta, altura fuera de la escala
export function validar(piezas, { colores = coloresPaleta(), esc = escala() } = {}) {
  const errores = [];
  for (const [n, p] of Object.entries(piezas)) {
    if (p.filas.length !== p.h || p.filas.some((f) => f.length !== p.w)) errores.push(`${n}: filas que no miden ${p.w}×${p.h}`);
    for (const [k, c] of Object.entries(p.paleta)) if (!colores.has(c.toLowerCase())) errores.push(`${n}: el color ${c} (${k}) no está en paleta.json`);
    for (const [a, r] of Object.entries(p.anclas || {})) if (!dentro(r, p)) errores.push(`${n}: el ancla «${a}» se sale de la pieza (${p.w}×${p.h})`);
    if (p.base !== undefined && (p.base < 1 || p.base > p.h)) errores.push(`${n}: base ${p.base} fuera de 1-${p.h}`);
    if (p.ancla !== undefined && (p.ancla < 0 || p.ancla >= p.w)) errores.push(`${n}: ancla ${p.ancla} fuera de 0-${p.w - 1}`);
    for (const [e, cambios] of Object.entries(p.estados || {})) {
      for (const [de, a] of Object.entries(cambios)) if (!/^#[0-9a-f]{6}$/i.test(de) || !/^#[0-9a-f]{6}$/i.test(a)) errores.push(`${n}: el estado «${e}» tiene un color mal escrito`);
    }
    if (!p.tipo) { errores.push(`${n}: sin tipo (persona, tienda, objeto…: motor/piezas/escala.json)`); continue; }
    const t = esc.tipos[p.tipo];
    if (!t) { errores.push(`${n}: el tipo «${p.tipo}» no está en escala.json`); continue; }
    const alto = p.base ?? p.h;
    if (!p.escalaLibre && (alto < t.min || alto > t.max)) errores.push(`${n}: mide ${alto} de alto y un ${p.tipo} va de ${t.min} a ${t.max} (o pon "escalaLibre": true en su meta)`);
  }
  return errores;
}

// Hoja de contactos de una lista de piezas, con hoja.py
export function hoja(lista, salida, { referencia = null, titulo = null, regla = null, paraCodex = false } = {}) {
  const tmp = join(RUNTIME, "piezas", "tmp");
  mkdirSync(tmp, { recursive: true });
  const entrada = join(tmp, `hoja-${process.pid}-${basename(salida, ".png")}.json`);
  writeFileSync(entrada, JSON.stringify({ piezas: lista, referencia }));
  const args = [join(PIEZAS, "hoja.py"), entrada, salida];
  if (titulo) args.push("--titulo", titulo);
  if (regla) args.push("--regla", regla);
  if (paraCodex) args.push("--para-codex");
  const r = python(args);
  if (r.status !== 0) throw new Error(`hoja.py: ${r.stderr}`);
  return salida;
}

// La persona de referencia de las hojas: la que escala.json nombra, del set si ya existe
export function personaReferencia(piezas = {}) {
  const nombre = escala().referencia || "quieto";
  return piezas[nombre] || leerJSON(SET_JSON, { piezas: {} }).piezas[nombre] || null;
}
