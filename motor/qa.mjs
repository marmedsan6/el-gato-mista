// QA mecánico de un máster en un comando (docs/criterios.md §4; skill `qa`): medidas, fotogramas para el crítico y
// borrador del informe. Sustituye a los comandos sueltos y a los subagentes de extracción y audio.
//
// Uso: node motor/qa.mjs --proyecto <slug> --formato <short|largo|short-a…> --version <N>
//        [--master <mp4>] [--timing <json>] [--movimientos "a:dur,a:dur"] [--tiempos "t1,t2"] [--escena <html>]
//   --master       por defecto proyectos/<slug>/salida/<formato>-v<N>.mp4
//   --timing       por defecto proyectos/<slug>/timing.<formato>.json (último instante de cada frase)
//   --movimientos  tramos de cámara para las tiras a 20 fotogramas por segundo (viajes y zooms)
//   --escena       HTML de la escena: si expone window.revision.movimientos, se usan sin escribirlos a mano
//   --tiempos      instantes sueltos de más
// Deja en <RUNTIME>/qa/<slug>-<formato>-v<N>/ (con -<huella> si esa versión se ha vuelto a renderizar): medidas.json,
// frases/, extra/, mov/, hojas/ y, si no existe ya,
// el borrador proyectos/<slug>/reviews/qa-v<N>.md (nunca pisa un informe escrito).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { leerCongelados, leerEbur128, leerNegros, leerSilencios, veredicto } from "./qa-medidas.mjs";

const MOTOR = dirname(fileURLToPath(import.meta.url)), RAIZ = resolve(MOTOR, "..");
const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const slug = arg("proyecto"), formato = arg("formato"), version = arg("version");
if (!slug || !formato || !version) {
  console.error("Uso: node motor/qa.mjs --proyecto <slug> --formato <short|largo|…> --version <N> [--master <mp4>] [--timing <json>] [--movimientos a:dur,…] [--tiempos t1,…] [--escena <html>]");
  process.exit(2);
}
const proyecto = join(RAIZ, "proyectos", slug);
const master = resolve(arg("master", join(proyecto, "salida", `${formato}-v${version}.mp4`)));
const timing = resolve(arg("timing", join(proyecto, `timing.${formato}.json`)));
if (!existsSync(master)) { console.error(`No existe el máster: ${master}`); process.exit(2); }
const runtime = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
// Huella primero: si la carpeta de esta versión ya guarda las medidas de OTRO máster (se ha vuelto a renderizar), se usa una
// carpeta nueva con el principio de la huella, para no mezclar fotogramas de dos renders (aquí no se borra nada).
const sha256 = createHash("sha256").update(readFileSync(master)).digest("hex");
let dir = join(runtime, "qa", `${slug}-${formato}-v${version}`);
if (existsSync(join(dir, "medidas.json")) && JSON.parse(readFileSync(join(dir, "medidas.json"), "utf8")).sha256 !== sha256) dir += `-${sha256.slice(0, 8)}`;
for (const d of ["frases", "extra", "mov", "hojas"]) mkdirSync(join(dir, d), { recursive: true });
const corto = formato.startsWith("short");

const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0) { console.error(r.stderr.slice(-1500)); throw new Error(`ffmpeg falló: ${args.join(" ").slice(0, 200)}`); }
  return r.stderr;
};

// 1 · ficha y huella
const sonda = JSON.parse(spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate,nb_frames:format=duration", "-of", "json", master], { encoding: "utf8" }).stdout);
const [fn, fd] = sonda.streams[0].r_frame_rate.split("/").map(Number);
const ficha = { ancho: sonda.streams[0].width, alto: sonda.streams[0].height, fps: fn / (fd || 1), fotogramas: Number(sonda.streams[0].nb_frames), duracion: Number(sonda.format.duration) };

// 2 · medidas
const audio = leerEbur128(ff(["-i", master, "-af", "ebur128=peak=true", "-f", "null", "-"]));
const silencios = leerSilencios(ff(["-i", master, "-af", "silencedetect=noise=-35dB:d=0.2", "-f", "null", "-"]));
const imagen = ff(["-i", master, "-vf", "freezedetect=n=0.001:d=1,blackdetect=d=0.1", "-an", "-f", "null", "-"]);
const congelados = leerCongelados(imagen), negros = leerNegros(imagen);

// 3 · fotogramas: último instante de cada frase, a tamaño completo y reducido a tamaño de móvil
const reducido = corto ? "360:640" : "640:360";
const foto = (t, base) => ff(["-y", "-ss", String(t), "-i", master, "-filter_complex", `[0:v]split[a][b];[b]scale=${reducido}:flags=area[c]`,
  "-map", "[a]", "-frames:v", "1", "-update", "1", `${base}.png`, "-map", "[c]", "-frames:v", "1", "-update", "1", `${base}_360.png`]);
const frases = existsSync(timing) ? JSON.parse(readFileSync(timing, "utf8")).frases || [] : [];
for (const f of frases) {
  const t = Math.max(0, Math.min(ficha.duracion - 0.05, f.fin - 0.05));
  foto(t.toFixed(2), join(dir, "frases", `${f.id}_${t.toFixed(2)}`));
}
const extra = (arg("tiempos", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
for (const t of extra) foto(t, join(dir, "extra", `t${t}`));

// 4 · hojas de todo el vídeo a 2 por segundo (48 por hoja)
const mini = corto ? "270:480" : "480:270", rejilla = corto ? "8x6" : "6x8";
ff(["-y", "-i", master, "-vf", `fps=2,scale=${mini}:flags=area,tile=${rejilla}:padding=4:color=white`, "-fps_mode", "passthrough", join(dir, "hojas", "hoja_%02d.png")]);

// 5 · tiras de los movimientos de cámara: 1 de cada 3 fotogramas (20 por segundo)
let movimientos = (arg("movimientos", "") || "").split(",").map((s) => s.trim()).filter(Boolean).map((s) => s.split(":").map(Number));
const escena = arg("escena");
if (escena && !movimientos.length) {
  const { chromium } = await import("playwright");
  const exe = process.env.CHROMIUM_PATH || join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");
  const b = await chromium.launch({ executablePath: exe });
  const pg = await b.newPage();
  await pg.goto(pathToFileURL(resolve(escena)).href);
  const rev = await pg.evaluate(() => (window.revision && window.revision.movimientos) || []);
  await b.close();
  movimientos = rev.map(([a, c]) => [Math.max(0, a - 0.1), c - a + 0.3]);
}
movimientos.forEach(([a, d], k) => {
  const n = Math.ceil((d * 20) / (corto ? 7 : 5));
  ff(["-y", "-ss", String(a), "-t", String(d), "-i", master, "-vf",
    `select='not(mod(n\\,3))',scale=${mini}:flags=area,tile=${corto ? 7 : 5}x${Math.max(1, n)}:padding=4:color=white`,
    "-fps_mode", "passthrough", "-frames:v", "1", "-update", "1", join(dir, "mov", `mov${String(k + 1).padStart(2, "0")}_${a.toFixed(2)}.png`)]);
});

// 6 · veredicto, medidas.json y borrador del informe
const filas = veredicto({ formato, ...ficha, lufs: audio.lufs, pico: audio.pico, silencios, congelados, negros });
const medidas = { master: relative(RAIZ, master).replace(/\\/g, "/"), sha256, ...ficha, audio, silencios, congelados, negros,
  frases: frases.length, movimientos, carpeta: dir.replace(/\\/g, "/"), ok: filas.every((f) => f.ok) };
writeFileSync(join(dir, "medidas.json"), JSON.stringify(medidas, null, 1) + "\n");

const informe = join(proyecto, "reviews", `qa-v${version}.md`);
let borrador = false;
if (existsSync(join(proyecto, "reviews")) && !existsSync(informe)) {
  const lista = (ts, f) => (ts.length ? ts.map(f).join("; ") : "ninguno");
  writeFileSync(informe, [
    `# QA · ${slug} · ${formato} v${version}`,
    "",
    `Máster: \`salida/${formato}-v${version}.mp4\`, SHA-256 \`${sha256}\`. Medidas de \`node motor/qa.mjs\` en \`.runtime/qa/${slug}-${formato}-v${version}/\`.`,
    "",
    "| Comprobación | Medida | Umbral | OK/FALLA |",
    "|---|---|---|---|",
    ...filas.map((f) => `| ${f.nombre} | ${f.medida} | ${f.umbral} | ${f.ok ? "OK" : "FALLA"} |`),
    "",
    "## Audio",
    `${audio.lufs} LUFS integrados, LRA ${audio.lra} LU, pico real ${audio.pico} dBTP. Silencios de 0,2 s o más: ${lista(silencios, (s) => `${s.inicio.toFixed(2)}-${s.fin === null ? "fin" : s.fin.toFixed(2)}`)}.`,
    "",
    "## Congelados y negros",
    `Tramos casi quietos de 1 s o más: ${lista(congelados, (c) => `${c.inicio.toFixed(2)} (${c.duracion === null ? "hasta el final" : c.duracion.toFixed(2) + " s"})`)}. Negros: ${lista(negros, (n) => `${n.inicio.toFixed(2)}-${n.fin.toFixed(2)}`)}.`,
    "",
    "## Lint de textos y sincronía",
    "Pendiente: pega aquí el resumen de `node motor/revisar.mjs … --estricto`.",
    "",
    "## Crítica visual",
    "Pendiente: `critica-NN.md`.",
    "",
    "## Bloqueantes",
    filas.every((f) => f.ok) ? "Ninguno en las medidas. Falta la crítica visual." : filas.filter((f) => !f.ok).map((f) => `- ${f.nombre}: ${f.medida} (umbral: ${f.umbral})`).join("\n"),
    "",
  ].join("\n"));
  borrador = true;
}
console.log(JSON.stringify({ ok: medidas.ok, sha256, ...ficha, audio, silencios: silencios.length, casi_quietos: congelados.length, negros: negros.length,
  fotogramas_frase: frases.length, hojas: readdirSync(join(dir, "hojas")).length, tiras: movimientos.length, carpeta: medidas.carpeta,
  informe: borrador ? relative(RAIZ, informe).replace(/\\/g, "/") : "ya existía o no hay reviews/: no se toca",
  fallos: filas.filter((f) => !f.ok).map((f) => f.nombre) }));
process.exit(medidas.ok ? 0 : 1);
