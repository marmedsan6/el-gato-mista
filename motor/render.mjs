// Motor de render de ElGatoMista (ADR 0004): Playwright (chrome-headless-shell) + FFmpeg.
// Generaliza la candidata «propio» del piloto a cualquier escena HTML con contrato seek(t).
//
// Uso:
//   node render.mjs --escena <html> --ancho <px base> --alto <px base> --duracion <s> --salida <mp4>
//                   [--consulta "formato=short"] [--incluir dir1,dir2] [--fps 60] [--escala 4] [--workers 8] [--fotogramas t1,t2]
//   → <mp4> (H.264 yuv420p crf 18 bt709, ancho×escala × alto×escala, fps) y <dir del mp4>/t_<t>.png por cada t.
//
// La escena expone window.seek(t). Opcional: window.claveFotograma(t) → texto que cambia si y solo si cambia
// la imagen; con ella se captura una vez cada tramo igual. Prohibido en render: timers, rAF, Date.now,
// performance.now (guardas en tiempo de ejecución) y animaciones CSS (lint en tests/lint-escena.test.mjs).
//
// Reanudación: cada fotograma se guarda en <RUNTIME_DIR>/render-cache/<clave>/ con escritura atómica; al relanzar
// con los mismos argumentos solo se rehacen los que faltan. La caché no se borra (sin borrado permanente).
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const arg = (nombre, por = undefined) => {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 ? process.argv[i + 1] : por;
};
const escena = arg("escena") && resolve(arg("escena"));
const W = Number(arg("ancho")), H = Number(arg("alto"));
const DURACION = Number(arg("duracion"));
const mp4 = arg("salida") && resolve(arg("salida"));
const consulta = arg("consulta", "");
const FPS = Number(arg("fps", "60"));
const ESCALA = Number(arg("escala", "4"));
const trabajadores = Math.max(1, Number(arg("workers", "8")));
const listaT = (arg("fotogramas", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!escena || !existsSync(escena) || !(W > 0) || !(H > 0) || !(DURACION > 0) || !mp4 || listaT.some((s) => !Number.isFinite(Number(s)))) {
  console.error("Uso: node render.mjs --escena <html> --ancho <px> --alto <px> --duracion <s> --salida <mp4> [--consulta k=v] [--fps 60] [--escala 4] [--workers 8] [--fotogramas t1,t2]");
  process.exit(2);
}
const TOTAL = Math.round(DURACION * FPS);
const runtime = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const executablePath = process.env.CHROMIUM_PATH ||
  join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");
if (!existsSync(executablePath)) { console.error(`No encuentro el navegador: ${executablePath}`); process.exit(1); }

const url = pathToFileURL(escena).href + (consulta ? `?${consulta}` : "");
const guardas = `window.__violaciones = [];
for (const [o, n, nombre] of [[window, "setTimeout", "setTimeout"], [window, "setInterval", "setInterval"],
  [window, "requestAnimationFrame", "requestAnimationFrame"], [Date, "now", "Date.now"], [performance, "now", "performance.now"]]) {
  o[n] = () => { window.__violaciones.push(nombre); throw new Error("prohibido en render: " + nombre); };
}`;

// Clave de caché: ficheros de la carpeta de la escena y de las carpetas de --incluir (css/js comunes),
// parámetros y este fichero.
const carpetas = [dirname(escena), ...(arg("incluir", "") || "").split(",").filter(Boolean).map((d) => resolve(d))];
const huella = createHash("sha256");
for (const dir of carpetas) {
  for (const f of readdirSync(dir).filter((n) => /\.(html|css|js|mjs)$/.test(n)).sort()) {
    huella.update(join(dir, f)).update(readFileSync(join(dir, f)));
  }
}
huella.update([consulta, W, H, DURACION, FPS, ESCALA, mp4].join("\0")).update(readFileSync(fileURLToPath(import.meta.url)));
const clave = huella.digest("hex").slice(0, 16);
const cache = join(runtime, "render-cache", clave);
const ficheroCache = (f) => join(cache, `f_${String(f).padStart(5, "0")}.png`);
mkdirSync(cache, { recursive: true });
mkdirSync(dirname(mp4), { recursive: true });

const inicioMs = Date.now();
const navegadores = [];
const violaciones = [];
let inicios = [], tramo = [], rehechos = 0, yaHechos = 0;
try {
  const abrirPagina = async () => {
    const n = await chromium.launch({ executablePath, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"] });
    navegadores.push(n);
    const contexto = await n.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: ESCALA });
    const pagina = await contexto.newPage();
    await pagina.addInitScript(guardas);
    await pagina.goto(url);
    await pagina.evaluate(() => document.fonts.ready);
    if (!(await pagina.evaluate(() => typeof window.seek === "function"))) throw new Error("La escena no expone window.seek(t)");
    pagina.cdp = await contexto.newCDPSession(pagina);
    return pagina;
  };
  const foto = async (pagina, t) => {
    await pagina.evaluate(async (s) => { await window.seek(s); await document.fonts.ready; }, t);
    const { data } = await pagina.cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: W, height: H, scale: ESCALA } });
    return Buffer.from(data, "base64");
  };
  const paginas = await Promise.all(Array.from({ length: trabajadores }, abrirPagina));

  // Tramos de fotogramas iguales (solo si la escena da claveFotograma).
  const claves = await paginas[0].evaluate(({ total, fps }) =>
    typeof window.claveFotograma === "function" ? Array.from({ length: total }, (_, f) => String(window.claveFotograma(f / fps))) : null,
  { total: TOTAL, fps: FPS });
  for (let f = 0; f < TOTAL; f++) {
    if (!claves || f === 0 || claves[f] !== claves[f - 1]) inicios.push(f);
    tramo[f] = inicios[inicios.length - 1];
  }
  const pendientes = inicios.filter((f) => !(existsSync(ficheroCache(f)) && statSync(ficheroCache(f)).size > 0));
  yaHechos = inicios.length - pendientes.length;
  console.error(`[render] ${inicios.length} fotogramas distintos de ${TOTAL}; en caché ${yaHechos}, por hacer ${pendientes.length}`);

  for (const s of listaT) writeFileSync(join(dirname(mp4), `t_${s}.png`), await foto(paginas[0], Number(s)));

  let siguiente = 0;
  await Promise.all(paginas.map(async (pagina) => {
    while (siguiente < pendientes.length) {
      const f = pendientes[siguiente++];
      const png = await foto(pagina, f / FPS);
      const tmp = ficheroCache(f) + ".tmp";
      writeFileSync(tmp, png);
      renameSync(tmp, ficheroCache(f));
      rehechos++;
      if (rehechos % 300 === 0) console.error(`  ${rehechos}/${pendientes.length}`);
    }
  }));
  for (const p of paginas) violaciones.push(...(await p.evaluate(() => window.__violaciones)));
} finally {
  await Promise.all(navegadores.map((n) => n.close()));
}
if (violaciones.length) { console.error("Violaciones del contrato seek(t): " + [...new Set(violaciones)].join(", ")); process.exit(1); }
console.error(`captura: ${((Date.now() - inicioMs) / 1000).toFixed(1)} s`);

const parcial = mp4.replace(/\.mp4$/i, "") + ".parcial.mp4";
const ff = spawn("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "pipe:0",
  "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-colorspace", "bt709", "-color_primaries", "bt709",
  "-color_trc", "bt709", "-color_range", "tv", "-frames:v", String(TOTAL),
  "-map_metadata", "-1", "-fflags", "+bitexact", "-flags:v", "+bitexact", "-movflags", "+faststart", parcial],
  { stdio: ["pipe", "ignore", "inherit"] });
const cerrado = new Promise((res, rej) => { ff.on("error", rej); ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg salió con ${c}`)))); });
ff.stdin.on("error", () => {});
let actual = -1, buffer = null;
for (let f = 0; f < TOTAL; f++) {
  if (tramo[f] !== actual) { actual = tramo[f]; buffer = readFileSync(ficheroCache(actual)); }
  if (!ff.stdin.write(buffer)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await cerrado;
renameSync(parcial, mp4);
console.error(`total: ${((Date.now() - inicioMs) / 1000).toFixed(1)} s`);
console.log(JSON.stringify({ mp4, fotogramas: TOTAL, distintos: inicios.length, reutilizados_de_cache: yaHechos, rehechos, pngs: listaT.length, cache }));
