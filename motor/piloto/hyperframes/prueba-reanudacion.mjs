// Métrica d: ¿HyperFrames reanuda un render cortado?
// Uso: node prueba-reanudacion.mjs <normal|segmentado> [segundos_antes_de_matar=50] [formato=short]
//   normal:     render por defecto; se mata a mitad y se relanza igual.
//   segmentado: HF_SEGMENTED_CAPTURE=true y `--resume` en el relanzamiento (única vía de reanudación que documenta el CLI).
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { preparar } from "./preparar.mjs";

const [modo = "normal", espera = "50", formato = "short"] = process.argv.slice(2);
const aqui = dirname(fileURLToPath(import.meta.url));
const NAV = "C:/Users/mario/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe";
const env = {
  ...process.env, HYPERFRAMES_NO_TELEMETRY: "1", DO_NOT_TRACK: "1", HYPERFRAMES_NO_UPDATE_CHECK: "1", HYPERFRAMES_SKIP_SKILLS: "1",
  HYPERFRAMES_BROWSER_PATH: NAV, PRODUCER_HEADLESS_SHELL_PATH: NAV,
  ...(modo === "segmentado" ? { HF_SEGMENTED_CAPTURE: "true" } : {}),
};
const BIN = join(aqui, "node_modules", "hyperframes", "bin", "hyperframes.mjs");
// Sin borrados: cada prueba usa un proyecto y una salida con nombre único (no se reutilizan segmentos de otra prueba).
const sello = new Date().toISOString().replace(/[:.]/g, "-");
const dir = await preparar(formato, `-reanudacion-${modo}-${sello}`);
const out = join(dir, "..", `reanudacion-${modo}-${sello}`);
mkdirSync(out, { recursive: true });
const rendersDir = join(dir, "renders");
const base = ["render", dir, "-o", join(out, "x.mp4"), "-f", "60", "--resolution", formato === "largo" ? "landscape" : "portrait"];

const listar = (d) => (existsSync(d) ? readdirSync(d, { recursive: true }).map(String) : []);
const instantanea = (etiqueta) => console.log(JSON.stringify({ etiqueta, renders: listar(rendersDir).slice(0, 30), salida: listar(out) }));

// Ejecución 1: se mata a mitad
const t0 = Date.now();
const hijo = spawn(process.execPath, [BIN, ...base], { cwd: aqui, env, stdio: ["ignore", "pipe", "pipe"] });
let log1 = "";
hijo.stdout.on("data", (d) => { log1 += d; });
hijo.stderr.on("data", (d) => { log1 += d; });
await new Promise((r) => setTimeout(r, Number(espera) * 1000));
const ultima = [...log1.matchAll(/"code":"(\w+)","done":(\d+),"total":(\d+)/g)].pop();
spawnSync("taskkill", ["/F", "/T", "/PID", String(hijo.pid)]);
await new Promise((r) => setTimeout(r, 3000));
console.log(JSON.stringify({ ejecucion: 1, muerta_a_s: Number(((Date.now() - t0) / 1000).toFixed(1)), ultimo_progreso: ultima ? ultima.slice(1) : null }));
instantanea("tras matar");

// Ejecución 2: relanzar (con --resume en modo segmentado)
const t1 = Date.now();
const r = spawnSync(process.execPath, [BIN, ...base, ...(modo === "segmentado" ? ["--resume"] : [])], { cwd: aqui, env, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const s2 = Number(((Date.now() - t1) / 1000).toFixed(1));
const log2 = (r.stdout || "") + (r.stderr || "");
const pistas = log2.split(/\r?\n/).filter((l) => /resum|reus|skip|segment/i.test(l)).slice(0, 15);
console.log(JSON.stringify({ ejecucion: 2, estado: r.status, tiempo_s: s2, pistas_log: pistas }));
instantanea("tras relanzar");
const mp4 = join(out, "x.mp4");
if (existsSync(mp4)) console.log(JSON.stringify({ mp4_bytes: statSync(mp4).size }));
