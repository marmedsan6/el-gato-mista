// Huellas de las escenas ya publicadas (y de las aprobadas como referencia): captura por seek(t) varios instantes de
// cada una y guarda el SHA-256 de cada PNG. Prueba que un cambio en motor/ no altera lo que ya está subido.
//
// Uso: node motor/huellas.mjs --generar   → escribe motor/huellas/publicados.json (ANTES de tocar la biblioteca)
//      node motor/huellas.mjs             → compara con ese fichero; sale con 1 si alguna huella difiere
//      [--solo <trozo de ruta>] [--n 8]
// Las capturas van a escala 1 (270×480 o 480×270): bastan para detectar cualquier cambio de dibujo y son rápidas.
import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const MOTOR = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(MOTOR, "..");
const FICHERO = join(MOTOR, "huellas", "publicados.json");
const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const generar = process.argv.includes("--generar");
const solo = arg("solo", "");
const N = Number(arg("n", "8"));
const NAVEGADOR = "chromium_headless_shell-1243";
const executablePath = process.env.CHROMIUM_PATH ||
  join(homedir(), `AppData/Local/ms-playwright/${NAVEGADOR}/chrome-headless-shell-win64/chrome-headless-shell.exe`);
if (!existsSync(executablePath)) { console.error(`No encuentro el navegador: ${executablePath}`); process.exit(2); }

// Escenas: todas las de proyectos/*/escenas/*/ menos plantillas y muestras.
function descubrir() {
  const lista = [];
  const proyectos = join(RAIZ, "proyectos");
  for (const slug of readdirSync(proyectos).sort()) {
    const escenas = join(proyectos, slug, "escenas");
    if (!existsSync(escenas)) continue;
    for (const formato of readdirSync(escenas).sort()) {
      const dir = join(escenas, formato);
      if (!statSync(dir).isDirectory() || formato === "muestras" || formato === "comun") continue;
      for (const f of readdirSync(dir).filter((n) => n.endsWith(".html") && !n.includes("plantilla")).sort()) {
        lista.push(relative(RAIZ, join(dir, f)).replace(/\\/g, "/"));
      }
    }
  }
  return lista;
}

const navegador = await chromium.launch({ executablePath, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"] });
async function capturar(escena, previa) {
  const contexto = await navegador.newContext({ viewport: { width: 270, height: 480 }, deviceScaleFactor: 1 });
  const pagina = await contexto.newPage();
  const errores = [];
  pagina.on("pageerror", (e) => errores.push(e.message));
  const url = pathToFileURL(join(RAIZ, escena)).href;
  await pagina.goto(url);
  const largo = previa ? previa.ancho > previa.alto : await pagina.evaluate(() => document.body.classList.contains("largo"));
  const [ancho, alto] = largo ? [480, 270] : [270, 480];
  if (largo) { await pagina.setViewportSize({ width: ancho, height: alto }); await pagina.goto(url); }
  await pagina.evaluate(() => document.fonts.ready);
  if (!(await pagina.evaluate(() => typeof window.seek === "function"))) throw new Error(`${escena}: no expone window.seek(t)`);
  const duracion = await pagina.evaluate(() => (window.TIMING && window.TIMING.audio && window.TIMING.audio.duracion_s) || 30);
  const tiempos = previa ? previa.tiempos : Array.from({ length: N }, (_, k) => Math.round(((k + 0.5) / N) * duracion * 1000) / 1000);
  const cdp = await contexto.newCDPSession(pagina);
  const huellas = [];
  for (const t of tiempos) {
    await pagina.evaluate(async (s) => { await window.seek(s); await document.fonts.ready; }, t);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: ancho, height: alto, scale: 1 } });
    huellas.push(createHash("sha256").update(Buffer.from(data, "base64")).digest("hex"));
  }
  await contexto.close();
  return { escena, ancho, alto, tiempos, huellas, errores: errores.slice(0, 3) };
}

let salida = 0;
try {
  if (generar) {
    const escenas = [];
    for (const e of descubrir().filter((e) => e.includes(solo))) {
      const r = await capturar(e, null);
      if (r.errores.length) console.error(`aviso · ${e}: ${r.errores.join(" | ")}`);
      escenas.push({ escena: r.escena, ancho: r.ancho, alto: r.alto, tiempos: r.tiempos, huellas: r.huellas });
      console.error(`${e}: ${r.huellas.length} huellas`);
    }
    mkdirSync(dirname(FICHERO), { recursive: true });
    writeFileSync(FICHERO, JSON.stringify({ navegador: NAVEGADOR, escenas }, null, 1) + "\n");
    console.log(JSON.stringify({ fichero: relative(RAIZ, FICHERO).replace(/\\/g, "/"), escenas: escenas.length, huellas: escenas.reduce((n, e) => n + e.huellas.length, 0) }));
  } else {
    if (!existsSync(FICHERO)) { console.error(`Falta ${FICHERO}: genera las huellas con --generar`); process.exit(2); }
    const base = JSON.parse(readFileSync(FICHERO, "utf8"));
    const distintas = [];
    let total = 0;
    for (const previa of base.escenas.filter((e) => e.escena.includes(solo))) {
      const r = await capturar(previa.escena, previa);
      r.huellas.forEach((h, k) => { total++; if (h !== previa.huellas[k]) distintas.push(`${previa.escena} t=${previa.tiempos[k]}`); });
    }
    console.log(JSON.stringify({ escenas: base.escenas.filter((e) => e.escena.includes(solo)).length, huellas: total, iguales: total - distintas.length, distintas }));
    if (distintas.length) salida = 1;
  }
} finally {
  await navegador.close();
}
process.exit(salida);
