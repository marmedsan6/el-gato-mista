// Prueba ciega de voces: genera el mismo texto con cada candidata, iguala la sonoridad (-16 LUFS, pico -2 dBTP),
// las renombra al azar como A, B, C… y deja una página para escucharlas sin saber de quién es cada una.
// Uso: node voz/prueba-ciega.mjs --candidatas voz/candidatas.json --texto voz/texto-prueba.txt [--simular]
// Salida: <RUNTIME_DIR>/voz/prueba-ciega/{A.wav, B.wav, …, escuchar.html} y .mapa.json (la clave del sorteo: no abrir
// hasta que Mario vote). El orden sale de una semilla guardada en el mapa, así que se puede rehacer igual.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const AQUI = dirname(fileURLToPath(import.meta.url));
const RUNTIME = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const simular = process.argv.includes("--simular");
const candidatas = JSON.parse(readFileSync(resolve(arg("candidatas", join(AQUI, "candidatas.json"))), "utf8"));
const texto = resolve(arg("texto", join(AQUI, "texto-prueba.txt")));
const semilla = Number(arg("semilla", "20261029"));
const dir = join(RUNTIME, "voz", "prueba-ciega");
mkdirSync(join(dir, "crudo"), { recursive: true });

function mulberry32(s) { let a = s >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const azar = mulberry32(semilla);
const orden = candidatas.map((c, i) => ({ c, k: azar(), i })).sort((a, b) => a.k - b.k);

const mapa = {};
const filas = [];
orden.forEach(({ c }, n) => {
  const letra = String.fromCharCode(65 + n);
  const crudo = join(dir, "crudo", `${c.proveedor}-${c.voz.replace(/[^\w-]/g, "_")}.wav`);
  const args = [join(AQUI, "generar.mjs"), "--proveedor", c.proveedor, "--voz", c.voz, "--texto", texto, "--salida", crudo];
  if (c.modelo) args.push("--modelo", c.modelo);
  if (simular) args.push("--simular");
  const info = JSON.parse(execFileSync("node", args, { encoding: "utf8" }).trim().split("\n").pop());
  const final = join(dir, `${letra}.wav`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", crudo, "-af", "loudnorm=I=-16:TP=-2:LRA=7", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", final]);
  mapa[letra] = { ...c, duracion_s: info.duracion_s, caracteres: info.caracteres, marcas_de_tiempo: info.marcas };
  filas.push(`<div class="voz"><b>${letra}</b><audio controls preload="none" src="${letra}.wav"></audio></div>`);
});
writeFileSync(join(dir, ".mapa.json"), JSON.stringify({ semilla, texto, simulada: simular, mapa }, null, 2));
writeFileSync(join(dir, "escuchar.html"), `<!doctype html><meta charset="utf-8"><title>Prueba ciega de voces</title>
<style>body{margin:0;background:#111;color:#ddd;font:15px system-ui;padding:20px}.voz{display:flex;gap:12px;align-items:center;margin:10px 0}b{width:24px;font-size:20px}</style>
<h1>Prueba ciega · voz española masculina</h1><p>Mismo texto y misma sonoridad (-16 LUFS). Escucha todas y dime tu orden de preferencia (p. ej. «C, A, F»).</p>
${filas.join("\n")}
<p style="color:#888">Texto: ${readFileSync(texto, "utf8").trim()}</p>`);
console.log(JSON.stringify({ voces: Object.keys(mapa).length, carpeta: dir, simulada: simular }));
