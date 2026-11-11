// Revisa la alineación de una voz contra sus silencios reales y, si se pide, escribe un timing con los límites de
// frase ajustados. Pásalo siempre después de alinear.py y de escrito.mjs, antes de escribir la escena.
// Uso: node motor/voz/revisar-alineacion.mjs <timing.json> <voz.wav> [--corregir <salida.json>] [--umbral -40] [--estricto]
//   --corregir  escribe el timing ajustado en <salida.json> (puede ser el mismo fichero si el vídeo no está publicado)
//   --estricto  sale con 1 si hay avisos de desfase
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { leerSilencios } from "../qa-medidas.mjs";
import { revisarAlineacion } from "./alineacion.mjs";

const pos = process.argv.slice(2).filter((a, i, v) => !a.startsWith("--") && !["--corregir", "--umbral"].includes(v[i - 1]));
const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const [fTiming, fVoz] = pos.map((p) => resolve(p));
if (!fTiming || !fVoz || !existsSync(fTiming) || !existsSync(fVoz)) {
  console.error("Uso: node motor/voz/revisar-alineacion.mjs <timing.json> <voz.wav> [--corregir <salida.json>] [--umbral -40] [--estricto]");
  process.exit(2);
}
const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", fVoz, "-af", `silencedetect=noise=${arg("umbral", "-40")}dB:d=0.15`, "-f", "null", "-"], { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr.slice(-1500)); process.exit(1); }
const silencios = leerSilencios(r.stderr);
const { avisos, fronteras, timing } = revisarAlineacion(JSON.parse(readFileSync(fTiming, "utf8")), silencios);
const salida = arg("corregir");
if (salida) {
  timing.alineacion = { ...(timing.alineacion || {}), limites_ajustados: fronteras.length, ajuste: "motor/voz/revisar-alineacion.mjs (silencedetect)" };
  writeFileSync(resolve(salida), JSON.stringify(timing, null, 1) + "\n");
}
for (const a of avisos) console.error(`${a.tipo} · ${a.donde}: ${a.detalle}`);
console.log(JSON.stringify({ silencios: silencios.length, avisos: avisos.length, desfases: avisos.filter((a) => a.tipo === "desfase").map((a) => a.donde),
  limites_ajustados: fronteras.length, mayor_ajuste_s: Math.max(0, ...fronteras.flatMap((f) => [Math.abs(f.fin[1] - f.fin[0]), Math.abs(f.inicio[1] - f.inicio[0])])).toFixed(3),
  corregido: salida ? resolve(salida).replace(/\\/g, "/") : null }));
if (process.argv.includes("--estricto") && avisos.some((a) => a.tipo === "desfase")) process.exit(1);
