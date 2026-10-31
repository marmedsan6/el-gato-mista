// Contrato de medir.mjs: node render.mjs --formato <largo|short> --salida <dir> --fotogramas <t1,t2,...>
// Opcionales: --solo-mp4 | --solo-stills | --rango <ini-fin> (tramo de fotogramas) | --nombre <fichero.mp4>
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(aqui, "..", "..", "..");
const RUNTIME = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const CACHE = join(RUNTIME, "piloto", "remotion", "bundle");
const CHROME = "C:/Users/mario/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe";
const FPS = 60;

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : undefined; };
const flag = (n) => args.includes("--" + n);
const formato = arg("formato");
const salida = arg("salida");
const tiempos = (arg("fotogramas") || "").split(",").filter(Boolean);
if (!["largo", "short"].includes(formato) || !salida) {
  console.error("Uso: node render.mjs --formato <largo|short> --salida <dir> --fotogramas <t1,...>");
  process.exit(2);
}
mkdirSync(salida, { recursive: true });

const ultimaMod = (d) => readdirSync(d, { withFileTypes: true }).reduce((m, e) => {
  const p = join(d, e.name);
  return Math.max(m, e.isDirectory() ? ultimaMod(p) : statSync(p).mtimeMs);
}, 0);

// Bundle cacheado en .runtime: se rehace solo si el codigo o la escena comun son mas nuevos.
async function serveUrl() {
  const fuentes = Math.max(ultimaMod(join(aqui, "src")), ultimaMod(join(aqui, "..", "comun")), statSync(join(aqui, "render.mjs")).mtimeMs);
  const marca = join(CACHE, "index.html");
  if (existsSync(marca) && statSync(marca).mtimeMs > fuentes) return CACHE;
  await bundle({
    entryPoint: join(aqui, "src", "index.jsx"),
    outDir: CACHE,
    publicDir: join(RAIZ, "marca", "fuentes", "press-start-2p"), // fuente local de la marca (sin copiarla al repo)
    enableCaching: false,
  });
  return CACHE;
}

const comun = { browserExecutable: CHROME, logLevel: "warn" };
const url = await serveUrl();
const composition = await selectComposition({ serveUrl: url, id: `piloto-${formato}`, ...comun });

if (!flag("solo-mp4")) {
  for (const t of tiempos) {
    const frame = Math.max(0, Math.min(composition.durationInFrames - 1, Math.round(parseFloat(t) * FPS)));
    await renderStill({ composition, serveUrl: url, frame, imageFormat: "png", output: join(salida, `t_${t}.png`), overwrite: true, ...comun });
  }
}
if (!flag("solo-stills")) {
  const rango = arg("rango"); // "ini-fin"
  await renderMedia({
    composition, serveUrl: url, codec: "h264", crf: 18, pixelFormat: "yuv420p", imageFormat: "png",
    outputLocation: join(salida, arg("nombre") || `piloto-${formato}.mp4`), overwrite: true, muted: true,
    frameRange: rango ? rango.split("-").map(Number) : null,
    ...comun,
  });
}
