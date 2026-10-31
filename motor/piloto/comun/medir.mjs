// Medidas comunes del piloto de motor. Ejecuta el render de una candidata dos veces y compara.
// Uso: node medir.mjs <candidata> <formato>
//   candidata: carpeta en motor/piloto/ con un render.mjs que cumple el contrato de abajo.
//   formato: largo | short
//
// Contrato de render.mjs (lo cumple cada candidata):
//   node render.mjs --formato <f> --salida <dir> --fotogramas <t1,t2,...>
//   → <dir>/piloto-<f>.mp4 (25 s, 60 fps, 1920×1080 o 1080×1920)
//   → <dir>/t_<t>.png para cada t pedido, generados en el orden recibido
//
// Salida: .runtime/piloto/<candidata>/medidas-<formato>.json (en el checkout principal).
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [candidata, formato] = process.argv.slice(2);
if (!candidata || !["largo", "short"].includes(formato)) {
  console.error("Uso: node medir.mjs <candidata> <largo|short>");
  process.exit(2);
}
const aqui = dirname(fileURLToPath(import.meta.url));
const carpeta = resolve(aqui, "..", candidata);
const runtime = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const base = join(runtime, "piloto", candidata);
const TIEMPOS = [0, 7.5, 15, 24.99];

const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");

function render(dir, orden) {
  mkdirSync(dir, { recursive: true });
  const inicio = process.hrtime.bigint();
  const r = spawnSync("node", ["render.mjs", "--formato", formato, "--salida", dir, "--fotogramas", orden.join(",")],
    { cwd: carpeta, encoding: "utf8", shell: false, maxBuffer: 64 * 1024 * 1024 });
  const segundos = Number(process.hrtime.bigint() - inicio) / 1e9;
  if (r.status !== 0) throw new Error(`render.mjs falló (${r.status}):\n${(r.stderr || "").slice(-2000)}`);
  return segundos;
}

function probe(mp4) {
  const json = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_packets",
    "-show_entries", "stream=width,height,r_frame_rate,codec_name,nb_read_packets:format=duration", "-of", "json", mp4], { encoding: "utf8" });
  const j = JSON.parse(json);
  return { ...j.streams[0], duracion: Number(j.format.duration) };
}

const dirA = join(base, `${formato}-a`);
const dirB = join(base, `${formato}-b`);
const tA = render(dirA, TIEMPOS);
const tB = render(dirB, [...TIEMPOS].reverse()); // seek fuera de orden

const fotogramas = TIEMPOS.map((t) => {
  const a = join(dirA, `t_${t}.png`), b = join(dirB, `t_${t}.png`);
  const ha = existsSync(a) ? sha(a) : null, hb = existsSync(b) ? sha(b) : null;
  return { t, igual: ha !== null && ha === hb, sha_a: ha, sha_b: hb };
});
const mp4A = join(dirA, `piloto-${formato}.mp4`), mp4B = join(dirB, `piloto-${formato}.mp4`);
const salida = existsSync(mp4A) ? probe(mp4A) : null;

const medidas = {
  candidata, formato, fecha: new Date().toISOString(),
  determinismo: { fotogramas_iguales: fotogramas.every((f) => f.igual), fotogramas,
    mp4_igual: existsSync(mp4A) && existsSync(mp4B) && sha(mp4A) === sha(mp4B) },
  tiempo_render_s: { a: Number(tA.toFixed(1)), b: Number(tB.toFixed(1)) },
  extrapolado_s: { "60s": Number((tA / 25 * 60).toFixed(0)), "10min": Number((tA / 25 * 600).toFixed(0)) },
  salida,
};
mkdirSync(base, { recursive: true });
writeFileSync(join(base, `medidas-${formato}.json`), JSON.stringify(medidas, null, 2));
console.log(JSON.stringify({ candidata, formato, deterministas: medidas.determinismo.fotogramas_iguales,
  mp4_igual: medidas.determinismo.mp4_igual, tiempo_s: medidas.tiempo_render_s, salida }, null, 0));
