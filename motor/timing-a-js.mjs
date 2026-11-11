// Convierte timing.<formato>.json en un script que la escena puede cargar desde file:// (window.TIMING = {...}).
// Uso: node motor/timing-a-js.mjs <timing.json> <salida.js> [--guion <guion.md> --seccion <Short|Maestro>] [--fuentes <fuentes.json>]
//   --guion y --seccion  añaden a cada frase sus fuentes (las marcas [fN] de su párrafo del guion): frases[].fuentes
//   --fuentes            añade TIMING.fuentes = { f1: "NVIDIA", … } con el nombre que se enseña en la caja de diálogo
import { readFileSync, writeFileSync } from "node:fs";
import { fuentesPorFrase, nombresCortos } from "./fuentes-frases.mjs";

const VALOR = new Set(["--guion", "--seccion", "--fuentes"]);
const flags = {}, pos = [];
for (let i = 2; i < process.argv.length; i++) { const a = process.argv[i]; if (VALOR.has(a)) flags[a] = process.argv[++i]; else pos.push(a); }
const [entrada, salida] = pos;
if (!entrada || !salida) { console.error("Uso: node motor/timing-a-js.mjs <timing.json> <salida.js> [--guion <guion.md> --seccion <Short|Maestro>] [--fuentes <fuentes.json>]"); process.exit(2); }
const t = JSON.parse(readFileSync(entrada, "utf8"));
let conFuente = 0;
if (flags["--guion"]) {
  const reparto = fuentesPorFrase(readFileSync(flags["--guion"], "utf8"), flags["--seccion"] || (t.formato === "largo" ? "Maestro" : "Short"), t.frases);
  t.frases.forEach((f, k) => { f.fuentes = reparto[k]; if (reparto[k].length) conFuente++; });
}
if (flags["--fuentes"]) t.fuentes = nombresCortos(JSON.parse(readFileSync(flags["--fuentes"], "utf8")));
writeFileSync(salida, `// Generado por motor/timing-a-js.mjs desde ${entrada.replace(/\\/g, "/").split("/").slice(-2).join("/")}. No editar a mano.\nwindow.TIMING = ${JSON.stringify(t)};\n`);
console.log(JSON.stringify({ salida, frases: t.frases.length, palabras: t.frases.reduce((n, f) => n + f.palabras.length, 0), duracion_s: t.audio.duracion_s,
  ...(flags["--guion"] ? { frases_con_fuente: conFuente } : {}) }));
