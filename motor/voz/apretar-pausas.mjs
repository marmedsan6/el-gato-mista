// Acorta las pausas de una voz de short (el estilo pide voz continua): cada silencio de más de --max s se queda en
// --deja s, quitando el centro del silencio para no comerse el final ni el arranque de las palabras.
// Uso: node motor/voz/apretar-pausas.mjs --entrada <wav> --salida <wav> [--max 0.4] [--deja 0.3] [--umbral -40]
// Mide con silencedetect de FFmpeg; silenceremove dejaba los silencios en ~0,58 s (medido el 2026-11-02).
import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";

const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const entrada = resolve(arg("entrada", "")), salida = resolve(arg("salida", ""));
const MAX = Number(arg("max", "0.4")), DEJA = Number(arg("deja", "0.3")), UMBRAL = Number(arg("umbral", "-40"));

const r = spawnSync("ffmpeg", ["-v", "info", "-i", entrada, "-af", `silencedetect=n=${UMBRAL}dB:d=${MAX}`, "-f", "null", "-"], { encoding: "utf8" });
const inicios = [...r.stderr.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => Number(m[1]));
const finales = [...r.stderr.matchAll(/silence_end: ([0-9.]+)/g)].map((m) => Number(m[1]));
const total = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", entrada], { encoding: "utf8" }));

// Tramos que se conservan: todo menos el centro de cada silencio largo (los del principio y del final, enteros).
const tramos = [];
let desde = 0;
inicios.forEach((ini, k) => {
  const fin = finales[k];
  if (fin === undefined || ini <= 0.01 || fin >= total - 0.01) return;
  const quitar = fin - ini - DEJA;
  const corte = ini + DEJA / 2;
  tramos.push([desde, corte]);
  desde = corte + quitar;
});
tramos.push([desde, total]);

const filtro = tramos.map(([a, b], i) => `[0:a]atrim=${a.toFixed(4)}:${b.toFixed(4)},asetpts=PTS-STARTPTS[t${i}]`).join(";") +
  `;${tramos.map((_, i) => `[t${i}]`).join("")}concat=n=${tramos.length}:v=0:a=1[s]`;
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", entrada, "-filter_complex", filtro, "-map", "[s]", "-c:a", "pcm_s16le", salida]);
const nueva = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", salida], { encoding: "utf8" }));
console.log(JSON.stringify({ salida, pausas_acortadas: tramos.length - 1, antes_s: +total.toFixed(2), despues_s: +nueva.toFixed(2) }));
