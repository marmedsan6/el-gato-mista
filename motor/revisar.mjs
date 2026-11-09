// Revisión rápida de una escena: recorre seek(t) cada `paso` s, junta errores y saca capturas ×2 en los instantes pedidos.
// Uso: node motor/revisar.mjs <html> <ancho> <alto> <duración> <paso> <carpeta de salida> [t1,t2,...]
import { chromium } from "playwright";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const [html, ancho, alto, dur, paso, salida, tiempos] = process.argv.slice(2);
const executablePath = join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");
const b = await chromium.launch({ executablePath, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"] });
const pg = await b.newPage({ viewport: { width: +ancho, height: +alto }, deviceScaleFactor: 2 });
const errores = [];
pg.on("pageerror", (e) => errores.push("pageerror " + e.message));
pg.on("console", (m) => { if (m.type() === "error") errores.push("console " + m.text()); });
await pg.goto(pathToFileURL(resolve(html)).href);
await pg.waitForTimeout(800);
const fallos = await pg.evaluate(({ dur, paso }) => { const r = []; for (let t = 0; t <= dur; t += paso) { try { window.seek(t); } catch (e) { r.push(t.toFixed(2) + " " + e.message); if (r.length > 15) break; } } return r; }, { dur: +dur, paso: +paso });
console.log(JSON.stringify({ errores: errores.slice(0, 10), fallos }, null, 1));
if (tiempos) for (const t of tiempos.split(",")) { await pg.evaluate((t) => window.seek(t), +t); await pg.screenshot({ path: join(salida, `t_${(+t).toFixed(2).padStart(7, "0")}.png`) }); }
await b.close();
