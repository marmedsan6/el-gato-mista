// Revisión rápida de una escena, antes del render completo: recorre seek(t) cada `paso` s, junta errores, pasa el lint de
// textos y sincronía (motor/lint-textos.mjs) y saca capturas ×2 en los instantes pedidos.
// Uso: node motor/revisar.mjs <html> <ancho> <alto> <duración> <paso> <carpeta de salida> [t1,t2,...]
//        [--estricto] [--sin-lint] [--desde a] [--hasta b] [--max-textos n] [--minimo s] [--consulta "formato=largo"] [--json]
//   --estricto   sale con 1 si seek(t) falla en algún instante o el lint da errores (puerta antes del render completo)
//   --desde/--hasta  recorre solo ese tramo (s)
// El lint mide los textos del DOM (.rotulo, .titular, .etiqueta, .identificador, .sello6, .fuente-dato, .dato, .insignia), la caja
// (#dialogo, #frase) y la pestaña de fuente (#fuente). Lee window.TIMING (frases y sus fuentes) y window.revision
// ({ movimientos: [[a, b]], salidas: [t], claves: [{ t, nombre }] }) si la escena los expone.
import { chromium } from "playwright";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { informeLint, lintTextos } from "./lint-textos.mjs";

const CON_VALOR = new Set(["--desde", "--hasta", "--max-textos", "--minimo", "--consulta"]);
const flags = {}, pos = [];
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) flags[a] = CON_VALOR.has(a) ? process.argv[++i] : true; else pos.push(a);
}
const [html, ancho, alto, dur, paso, salida, tiempos] = pos;
if (!html || !(+ancho > 0) || !(+alto > 0) || !(+dur > 0) || !(+paso > 0)) {
  console.error("Uso: node motor/revisar.mjs <html> <ancho> <alto> <duración> <paso> <carpeta de salida> [t1,t2,...] [--estricto] [--sin-lint] [--desde a] [--hasta b] [--max-textos n] [--minimo s] [--json]");
  process.exit(2);
}
const executablePath = process.env.CHROMIUM_PATH || join(homedir(), "AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe");
const b = await chromium.launch({ executablePath, args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"] });
const pg = await b.newPage({ viewport: { width: +ancho, height: +alto }, deviceScaleFactor: 2 });
const errores = [];
pg.on("pageerror", (e) => errores.push("pageerror " + e.message));
pg.on("console", (m) => { if (m.type() === "error") errores.push("console " + m.text()); });
await pg.goto(pathToFileURL(resolve(html)).href + (flags["--consulta"] ? `?${flags["--consulta"]}` : ""));
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);

const desde = flags["--desde"] ? +flags["--desde"] : 0, hasta = flags["--hasta"] ? Math.min(+dur, +flags["--hasta"]) : +dur;
const datos = await pg.evaluate(async ({ desde, hasta, paso, W, H, lint }) => {
  const fallos = [], instantes = [];
  const SEL = ".rotulo,.titular,.etiqueta,.identificador,.sello6,.fuente-dato,.dato,.insignia";
  const ids = new WeakMap(); let n = 0;
  const caja = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
  const seVe = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.right > 0 && r.left < W && r.bottom > 0 && r.top < H; // lo que queda entero fuera de cuadro no cuenta
  };
  const dialogo = () => {
    const d = document.getElementById("dialogo"), f = document.getElementById("frase");
    if (!d || !seVe(d)) return null;
    const lineas = []; // texto de cada línea, juntando los caracteres por su altura
    if (f) {
      const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT), rg = document.createRange();
      for (let nodo = w.nextNode(); nodo; nodo = w.nextNode()) {
        for (let k = 0; k < nodo.data.length; k++) {
          if (/\s/.test(nodo.data[k])) continue;
          rg.setStart(nodo, k); rg.setEnd(nodo, k + 1);
          const r = rg.getBoundingClientRect(); if (!r.width) continue;
          const medio = (r.top + r.bottom) / 2;
          let L = lineas.find((x) => Math.abs(x.y - medio) < 7);
          if (!L) { L = { y: medio, s: "" }; lineas.push(L); }
          L.s += nodo.data[k];
        }
      }
    }
    lineas.sort((a, c) => a.y - c.y);
    return { ...caja(d), lineas: lineas.length, huerfano: lineas.slice(1).some((x) => /^[.,;:!?)]/.test(x.s)) };
  };
  const pasos = Math.round((hasta - desde) / paso);
  for (let k = 0; k <= pasos; k++) {
    const t = Math.round((desde + k * paso) * 1000) / 1000;
    try { await window.seek(t); } catch (e) { fallos.push(t.toFixed(2) + " " + e.message); if (fallos.length > 15) break; continue; }
    if (!lint) continue;
    const textos = [];
    for (const el of document.querySelectorAll(SEL)) {
      if (el.closest("#dialogo") || !seVe(el)) continue;
      if (!ids.has(el)) ids.set(el, ++n);
      textos.push({ id: ids.get(el), clase: el.className, texto: el.textContent.replace(/\s+/g, " ").trim(), arte: el.dataset.arte === "1", ...caja(el) });
    }
    const fu = document.getElementById("fuente");
    instantes.push({ t, textos, dialogo: dialogo(), fuente: fu && seVe(fu) ? { texto: fu.textContent.trim(), ...caja(fu) } : null });
  }
  const T = window.TIMING;
  return { fallos, instantes, revision: window.revision || null,
    frases: T && T.frases ? T.frases.map((f) => ({ id: f.id, inicio: f.inicio, fin: f.fin, texto: f.texto || f.palabras.map((p) => p.p).join(" "), fuentes: f.fuentes || [] })) : [] };
}, { desde, hasta, paso: +paso, W: +ancho, H: +alto, lint: !flags["--sin-lint"] });

console.log(JSON.stringify({ errores: errores.slice(0, 10), fallos: datos.fallos }, null, 1));
let lint = null;
if (!flags["--sin-lint"]) {
  const opciones = {};
  if (flags["--max-textos"]) opciones.maxSimultaneos = +flags["--max-textos"];
  if (flags["--minimo"]) opciones.minimo = +flags["--minimo"];
  lint = lintTextos({ W: +ancho, H: +alto, corto: +alto > +ancho, paso: +paso, frases: datos.frases, revision: datos.revision, instantes: datos.instantes }, opciones);
  console.log(flags["--json"] ? JSON.stringify(lint) : informeLint(lint));
}
if (tiempos && salida) for (const t of tiempos.split(",")) { await pg.evaluate((t) => window.seek(t), +t); await pg.screenshot({ path: join(salida, `t_${(+t).toFixed(2).padStart(7, "0")}.png`) }); }
await b.close();
if (flags["--estricto"] && (datos.fallos.length || errores.length || (lint && lint.errores.length))) process.exit(1);
