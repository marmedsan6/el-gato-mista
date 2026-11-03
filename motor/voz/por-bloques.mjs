// Voz de un largo por tramos: sintetiza cada tramo con generar.mjs (caché por huella) y los une con pausas y clips.
// Uso: node motor/voz/por-bloques.mjs --texto <bloques.txt> --salida <voz.wav> --sin-clips <wav> --guion <txt>
//        --proveedor gemini --voz Orus [--estilo "<indicación>"] [--pausa 0.45] [--tempo 0.96] [--simular]
//
// bloques.txt: una frase por línea. Las líneas seguidas forman un tramo y son una sola petición al proveedor.
//   # comentario          corta el tramo
//   @pausa 0.7            corta el tramo y añade ese silencio
//   @clip <wav>           corta el tramo y coloca el fichero (en --sin-clips, un silencio de la misma duración)
//
// Salidas: --salida para la mezcla; --sin-clips para alinear (así Whisper no transcribe los clips); --guion, el texto
// limpio que pide alinear.py; <salida>.mapa.json, con el inicio y fin de cada clip.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const fuente = resolve(arg("texto")), salida = resolve(arg("salida")), sinClips = resolve(arg("sin-clips")), guion = resolve(arg("guion"));
const PAUSA = Number(arg("pausa", "0.45"));
const TEMPO = Number(arg("tempo", "1")); // ajusta la velocidad de la voz sin cambiar el tono ni volver a sintetizar; los clips no se tocan
const GENERAR = join(dirname(fileURLToPath(import.meta.url)), "generar.mjs");
const lineas = readFileSync(fuente, "utf8").split(/\r?\n/).map((l) => l.trim());

const tmp = mkdtempSync(join(tmpdir(), "voz-bloques-"));
const duracion = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
const a48 = (entrada, sal) => execFileSync("ffmpeg", ["-v", "error", "-y", "-i", entrada, "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", sal]);
const silencio = (seg, sal) => execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", seg.toFixed(3), "-c:a", "pcm_s16le", sal]);

// 1. Tramos y marcas
const piezas = [];
let actual = [];
const cerrar = () => { if (actual.length) { piezas.push({ tipo: "voz", frases: actual }); actual = []; } };
for (const l of lineas) {
  if (!l) continue;
  if (l.startsWith("#")) { cerrar(); continue; }
  if (l.startsWith("@pausa ")) { cerrar(); piezas.push({ tipo: "pausa", seg: Number(l.slice(7)) }); continue; }
  if (l.startsWith("@clip ")) { cerrar(); piezas.push({ tipo: "clip", fichero: resolve(l.slice(6)) }); continue; }
  actual.push(l);
}
cerrar();

// 2. Sintetizar (cada tramo sale de la caché si ya se pagó). Si el proveedor falla, se para; al relanzar sigue donde iba.
const conVoz = piezas.filter((p) => p.tipo === "voz");
let n = 0, caracteres = 0;
for (const p of conVoz) {
  n++;
  const txt = join(tmp, `t${n}.txt`), wav = join(tmp, `t${n}.wav`);
  writeFileSync(txt, p.frases.join("\n"));
  const args = [GENERAR, "--proveedor", arg("proveedor", "gemini"), "--voz", arg("voz", "Orus"), "--texto", txt, "--salida", wav];
  if (arg("estilo")) args.push("--estilo", arg("estilo"));
  if (process.argv.includes("--simular")) args.push("--simular");
  // Límite por minuto del plan gratuito: espera lo que pida la API y reintenta. Un límite diario para: no se paga.
  let r;
  for (let intento = 1; ; intento++) {
    r = spawnSync("node", args, { encoding: "utf8" });
    const espera = (r.stderr || "").match(/per minute[\s\S]*?retry in (\d+(?:\.\d+)?)s/i);
    if (r.status === 0 || !espera || intento > 8) break;
    console.error(`tramo ${n}/${conVoz.length}: límite por minuto, espero ${espera[1]} s`);
    await new Promise((listo) => setTimeout(listo, (Number(espera[1]) + 2) * 1000));
  }
  if (r.status !== 0) { console.error(`Tramo ${n}/${conVoz.length} falló: ${(r.stderr || "").slice(-600)}`); process.exit(1); }
  const info = JSON.parse(r.stdout.trim().split("\n").pop());
  caracteres += info.caracteres;
  console.error(`tramo ${n}/${conVoz.length}: ${info.duracion_s} s${info.desde_cache ? " (caché)" : ""}`);
  p.wav = join(tmp, `v${n}.wav`);
  if (TEMPO === 1) a48(wav, p.wav);
  else execFileSync("ffmpeg", ["-v", "error", "-y", "-i", wav, "-af", `atempo=${TEMPO}`, "-ac", "1", "-ar", "48000", "-c:a", "pcm_s16le", p.wav]);
}

// 3. Montar las dos pistas, con PAUSA entre tramos seguidos y entre un tramo y un clip
const conClips = [], huecos = [], mapa = [];
let t = 0, k = 0;
const pausaWav = (seg) => { const f = join(tmp, `p${++k}.wav`); silencio(seg, f); return f; };
piezas.forEach((p, i) => {
  if (i > 0 && p.tipo !== "pausa" && piezas[i - 1].tipo !== "pausa") { const f = pausaWav(PAUSA); conClips.push(f); huecos.push(f); t += PAUSA; }
  if (p.tipo === "pausa") { const f = pausaWav(p.seg); conClips.push(f); huecos.push(f); t += p.seg; }
  if (p.tipo === "voz") { conClips.push(p.wav); huecos.push(p.wav); t += duracion(p.wav); }
  if (p.tipo === "clip") {
    const f = join(tmp, `c${++k}.wav`); a48(p.fichero, f);
    const d = duracion(f);
    conClips.push(f); huecos.push(pausaWav(d));
    mapa.push({ fichero: p.fichero, inicio: Number(t.toFixed(3)), fin: Number((t + d).toFixed(3)) });
    t += d;
  }
});
const unir = (lista, sal) => {
  const f = join(tmp, `lista-${k++}.txt`);
  writeFileSync(f, lista.map((w) => `file '${w.replace(/\\/g, "/")}'`).join("\n"));
  mkdirSync(dirname(sal), { recursive: true });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f, "-c:a", "pcm_s16le", sal]);
};
unir(conClips, salida);
unir(huecos, sinClips);
writeFileSync(guion, piezas.filter((p) => p.tipo === "voz").flatMap((p) => p.frases).join("\n") + "\n");
writeFileSync(salida + ".mapa.json", JSON.stringify({ clips: mapa }, null, 1) + "\n");
console.log(JSON.stringify({ salida, tramos: conVoz.length, caracteres, duracion_s: Number(duracion(salida).toFixed(2)), clips: mapa }));
