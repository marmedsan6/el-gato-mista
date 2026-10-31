// Captura un HTML a PNG con el lienzo base escalado ×N (calibración C5a y piloto «propio»).
// Uso: node captura.mjs <html> <png> <ancho_base> <alto_base> [escala=4] [t=0] [modo=nitido]
//   modo «nitido»: el navegador pinta a escala ×N (texto vectorial suave, desenfoque fino).
//   modo «pixel»: pinta a escala 1 y amplía ×N por vecino más próximo (todo en la rejilla base).
// Si la página define window.seek(t), se llama antes de capturar (contrato de escena).
// Navegador: CHROMIUM_PATH o el chrome-headless-shell de Playwright que ya hay en la máquina.
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { existsSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [html, png, ancho, alto, escala = "4", t = "0", modo = "nitido"] = process.argv.slice(2);
if (!["nitido", "pixel"].includes(modo)) {
  console.error(`Modo desconocido: ${modo} (nitido | pixel)`);
  process.exit(2);
}

function ampliarVecino(buffer, factor) {
  const origen = PNG.sync.read(buffer);
  const destino = new PNG({ width: origen.width * factor, height: origen.height * factor });
  for (let y = 0; y < destino.height; y++) {
    for (let x = 0; x < destino.width; x++) {
      const o = ((Math.floor(y / factor) * origen.width) + Math.floor(x / factor)) * 4;
      const d = (y * destino.width + x) * 4;
      origen.data.copy(destino.data, d, o, o + 4);
    }
  }
  return PNG.sync.write(destino);
}
if (!html || !png || !ancho || !alto) {
  console.error("Uso: node captura.mjs <html> <png> <ancho_base> <alto_base> [escala] [t]");
  process.exit(2);
}

const porDefecto = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");
const executablePath = process.env.CHROMIUM_PATH || porDefecto;
if (!existsSync(executablePath)) {
  console.error(`No encuentro el navegador: ${executablePath}`);
  process.exit(1);
}

const navegador = await chromium.launch({ executablePath });
try {
  const pagina = await navegador.newPage({
    viewport: { width: Number(ancho), height: Number(alto) },
    deviceScaleFactor: modo === "pixel" ? 1 : Number(escala),
  });
  await pagina.goto(pathToFileURL(resolve(html)).href);
  await pagina.evaluate(() => document.fonts.ready);
  const fuentes = await pagina.evaluate(() => [...document.fonts].map((f) => `${f.family}:${f.status}`));
  await pagina.evaluate((segundos) => window.seek?.(segundos), Number(t));
  const captura = await pagina.screenshot({ omitBackground: false });
  writeFileSync(png, modo === "pixel" ? ampliarVecino(captura, Number(escala)) : captura);
  console.log(JSON.stringify({ png, base: [Number(ancho), Number(alto)], escala: Number(escala), t: Number(t), modo, fuentes }));
} finally {
  await navegador.close();
}
