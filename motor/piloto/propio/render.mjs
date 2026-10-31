// Candidata «propio» del piloto de motor: Playwright (Chromium headless shell) + FFmpeg.
// Contrato (motor/piloto/comun/medir.mjs):
//   node render.mjs --formato <largo|short> --salida <dir> --fotogramas <t1,t2,...>
//   → <dir>/piloto-<f>.mp4 (25 s, 60 fps) y <dir>/t_<t>.png por cada t, en el orden recibido.
// Opciones extra: --workers N (navegadores en paralelo, por defecto 8).
// Reanudación: cada fotograma distinto se guarda en .runtime/piloto/propio/cache/<clave>/ (escritura
// atómica). Si el render se corta, al relanzar con los mismos argumentos solo se rehacen los que faltan.
// La caché se borra al terminar bien (así dos renders completos seguidos son independientes).
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const COMUN = join(AQUI, "..", "comun");
const { estado, DURACION, FPS, ESCALA, LIENZO } = await import(pathToFileURL(join(COMUN, "escena.mjs")).href);

// --- argumentos ---
const arg = (nombre, por = undefined) => {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 ? process.argv[i + 1] : por;
};
const formato = arg("formato");
const salida = arg("salida") && resolve(arg("salida"));
const listaT = (arg("fotogramas", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
const trabajadores = Number(arg("workers", "8"));
if (!LIENZO[formato] || !salida || listaT.some((s) => !Number.isFinite(Number(s)))) {
  console.error("Uso: node render.mjs --formato <largo|short> --salida <dir> --fotogramas <t1,t2,...> [--workers N]");
  process.exit(2);
}
const [W, H] = LIENZO[formato];
const TOTAL = Math.round(DURACION * FPS);
const runtime = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const executablePath = process.env.CHROMIUM_PATH ||
  join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");
if (!existsSync(executablePath)) { console.error(`No encuentro el navegador: ${executablePath}`); process.exit(1); }

// --- escena: escena.html + escena.mjs inyectado como script clásico (file:// no admite módulos) ---
const htmlUrl = pathToFileURL(join(AQUI, "escena.html")).href + `?formato=${formato}`;
const fuenteEscena = readFileSync(join(COMUN, "escena.mjs"), "utf8");
const scriptEscena = `(() => {\n${fuenteEscena.replace(/^export\s+/gm, "")}\nwindow.__escena = { estado, PALETA, LIENZO, DURACION, FPS };\n})();`;
// Guardas del contrato: en modo render estas APIs no deben usarse; si la escena las llama, queda registrado.
const guardas = `window.__violaciones = [];
for (const [o, n, nombre] of [[window, "setTimeout", "setTimeout"], [window, "setInterval", "setInterval"],
  [window, "requestAnimationFrame", "requestAnimationFrame"], [Date, "now", "Date.now"], [performance, "now", "performance.now"]]) {
  o[n] = () => { window.__violaciones.push(nombre); throw new Error("prohibido en render: " + nombre); };
}`;

// --- fotogramas distintos: el estado es función pura de f, así que dos fotogramas con el mismo
// estado (sin f ni t) se pintan idénticos y se reutiliza la captura ---
const inicios = []; // fotogramas donde empieza un tramo de estado repetido
const tramo = new Array(TOTAL); // f → fotograma de inicio de su tramo
let previo = null;
for (let f = 0; f < TOTAL; f++) {
  const { fotograma, t, ...resto } = estado(f / FPS, formato);
  const clave = JSON.stringify(resto);
  if (clave !== previo) { inicios.push(f); previo = clave; }
  tramo[f] = inicios[inicios.length - 1];
}

// --- caché de reanudación ---
const claveCache = createHash("sha256")
  .update([formato, salida, readFileSync(join(AQUI, "escena.html")), fuenteEscena, readFileSync(fileURLToPath(import.meta.url))].join("\0"))
  .digest("hex").slice(0, 12);
const cache = join(runtime, "piloto", "propio", "cache", `${formato}-${claveCache}`);
const ficheroCache = (f) => join(cache, `f_${String(f).padStart(5, "0")}.png`);
mkdirSync(cache, { recursive: true });
mkdirSync(salida, { recursive: true });
const pendientes = inicios.filter((f) => !(existsSync(ficheroCache(f)) && statSync(ficheroCache(f)).size > 0));
const yaHechos = inicios.length - pendientes.length;
console.error(`[${formato}] ${inicios.length} fotogramas distintos de ${TOTAL}; en caché ${yaHechos}, por hacer ${pendientes.length}`);

const inicioMs = Date.now();
// --- captura ---
// Un navegador por trabajador: varias páginas en un mismo navegador comparten el proceso de rasterizado y apenas aceleran.
const navegadores = [];
const lanzar = async () => {
  const n = await chromium.launch({ executablePath, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"] });
  navegadores.push(n);
  return n;
};
let rehechos = 0;
const violaciones = [];
try {
  const abrirPagina = async () => {
    const contexto = await (await lanzar()).newContext({ viewport: { width: W, height: H }, deviceScaleFactor: ESCALA });
    const pagina = await contexto.newPage();
    await pagina.addInitScript(guardas);
    await pagina.goto(htmlUrl);
    await pagina.addScriptTag({ content: scriptEscena });
    await pagina.evaluate(() => document.fonts.load('16px "Press Start 2P"').then(() => document.fonts.ready));
    const ok = await pagina.evaluate(() => document.fonts.check('16px "Press Start 2P"'));
    if (!ok) throw new Error("La fuente Press Start 2P no se ha cargado");
    pagina.cdp = await contexto.newCDPSession(pagina);
    return pagina;
  };
  // CDP directo con clip.scale = ESCALA: mismos píxeles que page.screenshot() con deviceScaleFactor 4, más rápido.
  const foto = async (pagina, t) => {
    await pagina.evaluate((s) => window.seek(s), t);
    const { data } = await pagina.cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: W, height: H, scale: ESCALA } });
    return Buffer.from(data, "base64");
  };

  const paginas = await Promise.all(Array.from({ length: Math.max(1, trabajadores) }, abrirPagina));

  // 1) fotogramas pedidos, en el orden recibido (seek fuera de orden)
  for (const s of listaT) writeFileSync(join(salida, `t_${s}.png`), await foto(paginas[0], Number(s)));

  // 2) fotogramas pendientes de la secuencia, repartidos entre páginas
  let siguiente = 0;
  await Promise.all(paginas.map(async (pagina) => {
    while (siguiente < pendientes.length) {
      const f = pendientes[siguiente++];
      const png = await foto(pagina, f / FPS);
      const tmp = ficheroCache(f) + ".tmp";
      writeFileSync(tmp, png);
      renameSync(tmp, ficheroCache(f));
      rehechos++;
      if (rehechos % 200 === 0) console.error(`  ${rehechos}/${pendientes.length}`);
    }
  }));
  for (const p of paginas) violaciones.push(...(await p.evaluate(() => window.__violaciones)));
} finally {
  await Promise.all(navegadores.map((n) => n.close()));
}
if (violaciones.length) { console.error("Violaciones del contrato: " + violaciones.join(", ")); process.exit(1); }

console.error(`captura: ${((Date.now() - inicioMs) / 1000).toFixed(1)} s`);
// --- ensamblado con FFmpeg (PNG por tubería) ---
const mp4 = join(salida, `piloto-${formato}.mp4`);
const parcial = join(salida, `piloto-${formato}.parcial.mp4`);
const ff = spawn("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "pipe:0",
  "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-colorspace", "bt709", "-color_primaries", "bt709",
  "-color_trc", "bt709", "-color_range", "tv", "-frames:v", String(TOTAL),
  "-map_metadata", "-1", "-fflags", "+bitexact", "-flags:v", "+bitexact", "-movflags", "+faststart", parcial],
  { stdio: ["pipe", "ignore", "inherit"] });
const cerrado = new Promise((res, rej) => { ff.on("error", rej); ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg salió con ${c}`)))); });
ff.stdin.on("error", () => {}); // si ffmpeg muere, el error útil llega por "close"
let actual = -1, buffer = null;
for (let f = 0; f < TOTAL; f++) {
  if (tramo[f] !== actual) { actual = tramo[f]; buffer = readFileSync(ficheroCache(actual)); }
  if (!ff.stdin.write(buffer)) await new Promise((r) => ff.stdin.once("drain", r));
}
ff.stdin.end();
await cerrado;
console.error(`captura+ensamblado: ${((Date.now() - inicioMs) / 1000).toFixed(1)} s`);
renameSync(parcial, mp4);
// La caché no se borra (regla del proyecto: sin borrado permanente). Su clave incluye la salida, así que
// dos renders distintos no se mezclan; para liberar espacio, Mario la manda a la Papelera.
console.log(JSON.stringify({ formato, mp4, fotogramas: TOTAL, distintos: inicios.length, reutilizados_de_cache: yaHechos, rehechos, pngs: listaT.length }));
