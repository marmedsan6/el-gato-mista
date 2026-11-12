// Banco de medida del render del largo: abre la escena igual que motor/render.mjs y cronometra seek y captura.
// node bench.mjs --n 64 --workers 8 [--css "..."] [--js "..."] [--opt] [--escala 4] [--save dir] [--frames 1,2,3] [--stats]
import { chromium } from "file:///C:/Users/mario/proyectos/canal-videos/motor/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync, renameSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : d; };
const flag = (n) => process.argv.includes(`--${n}`);
const ESCENA = arg("escena", "C:/Users/mario/proyectos/canal-videos/proyectos/como-google-sabe-lo-que-quieres/escenas/largo/largo.html");
const W = Number(arg("ancho", 480)), H = Number(arg("alto", 270)), FPS = 60, ESCALA = Number(arg("escala", 4));
const N = Number(arg("n", 64)), WORKERS = Number(arg("workers", 8)), MAXS = Number(arg("max-s", 0));
const CSS = arg("css", ""), JS = arg("js", ""), OPT = flag("opt"), SAVE = arg("save"), STATS = flag("stats");
const exe = "C:/Users/mario/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe";
const extraArgs = (arg("args", "") || "").split(" ").filter(Boolean);
const ns = () => Number(process.hrtime.bigint()) / 1e6;

const abrir = async () => {
  const b = await chromium.launch({ executablePath: exe, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none", ...extraArgs] });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: ESCALA });
  const p = await ctx.newPage();
  await p.goto(pathToFileURL(ESCENA).href);
  await p.evaluate(() => document.fonts.ready);
  if (CSS) await p.addStyleTag({ content: CSS });
  if (JS) await p.evaluate(JS);
  p.cdp = await ctx.newCDPSession(p);
  return { b, p };
};

const t0 = ns();
const pags = await Promise.all(Array.from({ length: WORKERS }, abrir));
const tAbrir = ns() - t0;
let frames;
const info = await pags[0].p.evaluate(({ fps }) => {
  // duración: último evento de sonido o, si no, 500 s
  const total = Math.round(493.1 * fps);
  const claves = Array.from({ length: total }, (_, f) => String(window.claveFotograma(f / fps)));
  const inicios = []; for (let f = 0; f < total; f++) if (f === 0 || claves[f] !== claves[f - 1]) inicios.push(f);
  return { total, inicios };
}, { fps: FPS });
if (arg("frames")) frames = arg("frames").split(",").map(Number);
else if (arg("rango")) { const [a, b] = arg("rango").split(",").map(Number); const src = info.inicios.filter((f) => f >= a * FPS && f < b * FPS); const paso = src.length / N; frames = Array.from({ length: Math.min(N, src.length) }, (_, i) => src[Math.floor(i * paso)]); }
else { const paso = info.inicios.length / N; frames = Array.from({ length: N }, (_, i) => info.inicios[Math.floor(i * paso + paso / 2)]); }

const res = [];
let sig = 0;
if (SAVE) mkdirSync(SAVE, { recursive: true });
const tCap0 = ns();
await Promise.all(pags.map(async ({ p }) => {
  while (sig < frames.length && (!MAXS || ns() - tCap0 < MAXS * 1000)) {
    const f = frames[sig++];
    const a = ns();
    await p.evaluate(async (s) => { await window.seek(s); await document.fonts.ready; }, f / FPS);
    const b = ns();
    const { data } = await p.cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: W, height: H, scale: ESCALA }, ...(OPT ? { optimizeForSpeed: true } : {}) });
    const c = ns();
    const buf = Buffer.from(data, "base64");
    const r = { fin_s: +((c - tCap0) / 1000).toFixed(2), f, t: +(f / FPS).toFixed(3), seek: +(b - a).toFixed(1), shot: +(c - b).toFixed(1), kb: Math.round(buf.length / 1024), sha: createHash("sha1").update(buf).digest("hex").slice(0, 12) };
    if (STATS) Object.assign(r, await p.evaluate(() => {
      const o = {};
      for (const id of ["lejos", "medio", "brillo", "frente", "delante", "gato12"]) { const s = document.getElementById(id); o[id] = [Number(s.getAttribute("width")) || 0, s.getElementsByTagName("*").length]; }
      o.tf = document.getElementById("p-medio").style.transform; o.dom = document.getElementsByTagName("*").length;
      return o;
    }));
    if (SAVE) { const dst = join(SAVE, `f_${String(f).padStart(5, "0")}.png`); writeFileSync(dst + ".tmp", buf); renameSync(dst + ".tmp", dst); }
    res.push(r);
  }
}));
const wall = ns() - tCap0;
await Promise.all(pags.map(({ b }) => b.close()));
const avg = (k) => res.reduce((s, r) => s + r[k], 0) / res.length;
const out = { workers: WORKERS, n: res.length, distintos: info.inicios.length, total: info.total, abrir_s: +(tAbrir / 1000).toFixed(1),
  wall_s: +(wall / 1000).toFixed(1), s_por_captura_wall: +(wall / 1000 / res.length).toFixed(3),
  seek_ms: Math.round(avg("seek")), shot_ms: Math.round(avg("shot")), kb: Math.round(avg("kb")),
  estimado_h: +((wall / 1000 / res.length) * info.inicios.length / 3600).toFixed(2), frames: res.sort((a, b) => a.f - b.f) };
const dest = arg("out");
if (dest) writeFileSync(dest, JSON.stringify(out, null, 1));
const { frames: _, ...resumen } = out;
console.log(JSON.stringify(resumen));
