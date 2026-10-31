// Saca de una escena la lista de efectos de sonido: llama a window.eventosSonido() (si la escena la define) y la
// guarda como JSON [{ t, tipo }]. Los tiempos salen del mismo código que pinta la imagen, así que van sincronizados.
// Uso: node motor/eventos.mjs --escena <html> --ancho <px> --alto <px> --salida <json>
import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const escena = arg("escena") && resolve(arg("escena"));
const salida = arg("salida") && resolve(arg("salida"));
const W = Number(arg("ancho")), H = Number(arg("alto"));
if (!escena || !salida || !(W > 0) || !(H > 0)) { console.error("Uso: --escena <html> --ancho <px> --alto <px> --salida <json>"); process.exit(2); }
const executablePath = process.env.CHROMIUM_PATH ||
  join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");

const nav = await chromium.launch({ executablePath });
try {
  const pagina = await nav.newPage({ viewport: { width: W, height: H } });
  await pagina.goto(pathToFileURL(escena).href);
  const eventos = await pagina.evaluate(() => (typeof window.eventosSonido === "function" ? window.eventosSonido() : null));
  if (!eventos) throw new Error("La escena no define window.eventosSonido()");
  eventos.sort((a, b) => a.t - b.t);
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, JSON.stringify(eventos, null, 1) + "\n");
  const porTipo = eventos.reduce((m, e) => ((m[e.tipo] = (m[e.tipo] || 0) + 1), m), {});
  console.log(JSON.stringify({ salida, eventos: eventos.length, porTipo }));
} finally {
  await nav.close();
}
