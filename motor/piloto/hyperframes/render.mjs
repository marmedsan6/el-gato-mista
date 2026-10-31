// Candidata «hyperframes» del piloto de motor. Contrato de motor/piloto/comun/medir.mjs:
//   node render.mjs --formato <largo|short> --salida <dir> --fotogramas <t1,t2,...>
//   → <dir>/piloto-<f>.mp4 (H.264, 60 fps, 1920×1080 o 1080×1920)
//   → <dir>/t_<t>.png por cada t, en el orden recibido (1920×1080 / 1080×1920).
// Cómo: 1) preparar.mjs genera el proyecto HyperFrames (index.html + fuente local) en .runtime;
//       2) `hyperframes render --resolution landscape|portrait` (lienzo 480×270 pintado a DPR 4);
//       3) `hyperframes snapshot --at ... --zoom 0,0,W,H --zoom-scale 4` (mismo DPR 4) para los PNG sueltos.
// Sin red ni telemetría: ver variables de entorno de abajo.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { preparar } from "./preparar.mjs";

const aqui = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, a) => (v.startsWith("--") ? [...acc, [v.slice(2), a[i + 1]]] : acc), []));
const formato = args.formato;
if (!["largo", "short"].includes(formato) || !args.salida || !args.fotogramas) {
  console.error("Uso: node render.mjs --formato <largo|short> --salida <dir> --fotogramas <t1,t2,...>");
  process.exit(2);
}
const salida = resolve(args.salida);
const tiempos = args.fotogramas.split(",").map((s) => Number(s.trim()));
if (tiempos.some((t) => !Number.isFinite(t))) { console.error("--fotogramas: lista de números"); process.exit(2); }
mkdirSync(salida, { recursive: true });

const NAV = process.env.HYPERFRAMES_BROWSER_PATH
  || "C:/Users/mario/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe";
if (!existsSync(NAV)) { console.error(`No encuentro el navegador: ${NAV}`); process.exit(1); }
const env = {
  ...process.env,
  HYPERFRAMES_NO_TELEMETRY: "1", DO_NOT_TRACK: "1", HYPERFRAMES_NO_UPDATE_CHECK: "1", HYPERFRAMES_SKIP_SKILLS: "1",
  HYPERFRAMES_BROWSER_PATH: NAV, PRODUCER_HEADLESS_SHELL_PATH: NAV,
};
const BIN = join(aqui, "node_modules", "hyperframes", "bin", "hyperframes.mjs");
const hf = (argv) => {
  const r = spawnSync(process.execPath, [BIN, ...argv], { cwd: aqui, env, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`hyperframes ${argv[0]} falló (${r.status}):\n${((r.stdout || "") + (r.stderr || "")).slice(-3000)}`);
  return r.stdout;
};

const dir = await preparar(formato);
const [W, H] = formato === "largo" ? [480, 270] : [270, 480];

// 1) MP4 completo
const mp4 = join(salida, `piloto-${formato}.mp4`);
hf(["render", dir, "-o", mp4, "-f", "60", "--resolution", formato === "largo" ? "landscape" : "portrait", "--quiet"]);

// 2) PNG sueltos, todos en una sola llamada y en el orden pedido
// Carpeta temporal única (no se borra nada: se queda en .runtime/piloto/hyperframes/tmp-snap-*)
const raizRuntime = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const tmp = join(raizRuntime, "piloto", "hyperframes", `tmp-snap-${formato}-${new Date().toISOString().replace(/[:.]/g, "-")}-${process.pid}`);
mkdirSync(tmp, { recursive: true });
hf(["snapshot", dir, "--at", tiempos.join(","), "--no-end", "--zoom", `0,0,${W},${H}`, "--zoom-scale", "4", "-o", tmp]);
const fichas = readdirSync(tmp).filter((f) => /^frame-\d+-.*\.png$/.test(f)).sort();
if (fichas.length !== tiempos.length) throw new Error(`snapshot devolvió ${fichas.length} PNG, esperaba ${tiempos.length}: ${fichas.join(", ")}`);
tiempos.forEach((t, i) => renameSync(join(tmp, fichas[i]), join(salida, `t_${t}.png`)));
console.log(JSON.stringify({ formato, salida, mp4, png: tiempos.map((t) => `t_${t}.png`) }));
