// Montaje y mezcla (docs/arquitectura.md §8-9, marca/tokens.json `sonido`):
// voz delante, música de fondo que se aparta bajo la voz (sidechain), efectos 1 fotograma después de la imagen,
// y normalización final en dos pasadas a -14 LUFS integrados con pico real < -2 dBTP. El vídeo se copia sin recodificar.
//
// Uso: node motor/mezcla.mjs --video <mp4 sin audio> --voz <wav> --salida <mp4> [--musica <fichero>]
//        [--eventos <json [{t, tipo}]> --sfx-dir <carpeta con sfx-<tipo>.*>] [--fps 60] [--musica-db -22] [--sfx-db -10]
//        [--voz-desfase 0]
// Deja también <salida>.mezcla.json con los parámetros y las medidas de las dos pasadas.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const video = resolve(arg("video", "")), voz = resolve(arg("voz", "")), salida = resolve(arg("salida", ""));
const musica = arg("musica") && resolve(arg("musica"));
const eventos = arg("eventos") ? JSON.parse(readFileSync(resolve(arg("eventos")), "utf8")) : [];
const sfxDir = arg("sfx-dir") && resolve(arg("sfx-dir"));
const FPS = Number(arg("fps", "60"));
const MUSICA_DB = Number(arg("musica-db", "-22")), SFX_DB = Number(arg("sfx-db", "-10"));
const VOZ_DESFASE = Number(arg("voz-desfase", "0"));
for (const f of [video, voz]) if (!existsSync(f)) { console.error(`No existe: ${f}`); process.exit(2); }

const durVideo = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video], { encoding: "utf8" }));
const sfx = {};
if (sfxDir) for (const f of readdirSync(sfxDir)) { const m = f.match(/^sfx-([a-z]+)\./); if (m) sfx[m[1]] = join(sfxDir, f); }
const usados = eventos.filter((e) => sfx[e.tipo]);
const sinFichero = [...new Set(eventos.filter((e) => !sfx[e.tipo]).map((e) => e.tipo))];

// --- grafo de filtros ---
const entradas = ["-i", video, "-i", voz];
let n = 2;
const partes = [];
const fmt = "aformat=sample_rates=48000:channel_layouts=stereo";
partes.push(`[1:a]${fmt},adelay=${Math.round(VOZ_DESFASE * 1000)}:all=1,apad=whole_dur=${durVideo},asplit=2[voz][vozsc]`);
let mezclaEntradas = ["[voz]"];
if (musica && existsSync(musica)) {
  entradas.push("-stream_loop", "-1", "-i", musica);
  const im = n++;
  // Música: nivel base, fundido de salida de 1,5 s al final, y compresión sidechain con la voz (baja ~6-8 dB al hablar)
  partes.push(`[${im}:a]${fmt},atrim=0:${durVideo},volume=${MUSICA_DB}dB,afade=t=out:st=${(durVideo - 1.5).toFixed(3)}:d=1.5[mus0]`);
  partes.push(`[mus0][vozsc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[mus]`);
  mezclaEntradas.push("[mus]");
} else {
  partes.push(`[vozsc]anullsink`);
}
const porTipo = {};
for (const e of usados) (porTipo[e.tipo] ||= []).push(e.t + 1 / FPS); // 1 fotograma después de la imagen
for (const [tipo, tiempos] of Object.entries(porTipo)) {
  entradas.push("-i", sfx[tipo]);
  const ie = n++;
  const copias = tiempos.map((_, k) => `[s${ie}_${k}]`).join("");
  partes.push(`[${ie}:a]${fmt},volume=${SFX_DB}dB,asplit=${tiempos.length}${copias}`);
  tiempos.forEach((t, k) => {
    partes.push(`[s${ie}_${k}]adelay=${Math.round(t * 1000)}:all=1[d${ie}_${k}]`);
    mezclaEntradas.push(`[d${ie}_${k}]`);
  });
}
partes.push(`${mezclaEntradas.join("")}amix=inputs=${mezclaEntradas.length}:duration=first:normalize=0,atrim=0:${durVideo}[premezcla]`);
const grafoBase = partes.join(";");

// --- pasada 1: medir la premezcla ---
const medir = spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...entradas, "-filter_complex",
  `${grafoBase};[premezcla]loudnorm=I=-14:TP=-2.5:LRA=11:print_format=json[o]`, "-map", "[o]", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const json = medir.stderr.slice(medir.stderr.lastIndexOf("{"), medir.stderr.lastIndexOf("}") + 1);
if (medir.status !== 0 || !json) { console.error(medir.stderr.slice(-2000)); process.exit(1); }
const m1 = JSON.parse(json);

// --- pasada 2: normalización lineal con las medidas y codificación ---
const ln = `loudnorm=I=-14:TP=-2.5:LRA=11:measured_I=${m1.input_i}:measured_TP=${m1.input_tp}:measured_LRA=${m1.input_lra}:measured_thresh=${m1.input_thresh}:offset=${m1.target_offset}:linear=true:print_format=json`;
const r = spawnSync("ffmpeg", ["-y", "-hide_banner", "-nostats", ...entradas, "-filter_complex", `${grafoBase};[premezcla]${ln},aresample=48000[a]`,
  "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest",
  "-map_metadata", "-1", "-fflags", "+bitexact", "-flags:a", "+bitexact", "-movflags", "+faststart", salida], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
if (r.status !== 0) { console.error(r.stderr.slice(-2000)); process.exit(1); }
const j2 = r.stderr.slice(r.stderr.lastIndexOf("{"), r.stderr.lastIndexOf("}") + 1);
const m2 = j2 ? JSON.parse(j2) : null;

const info = { video, voz, musica: musica || null, eventos: eventos.length, efectos_usados: usados.length, efectos_sin_fichero: sinFichero,
  musica_db: MUSICA_DB, sfx_db: SFX_DB, fps: FPS, pasada1: m1, pasada2: m2 && { output_i: m2.output_i, output_tp: m2.output_tp, normalization_type: m2.normalization_type } };
writeFileSync(salida + ".mezcla.json", JSON.stringify(info, null, 2));
console.log(JSON.stringify({ salida, efectos: usados.length, efectos_sin_fichero: sinFichero, premezcla_lufs: m1.input_i, final_lufs: m2?.output_i, final_tp: m2?.output_tp, tipo: m2?.normalization_type }));
