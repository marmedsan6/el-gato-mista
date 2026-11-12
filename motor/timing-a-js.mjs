// Convierte timing.<formato>.json en un script que la escena puede cargar desde file:// (window.TIMING = {...}).
// Uso: node motor/timing-a-js.mjs <timing.json> <salida.js> [--guion <guion.md> --seccion <Short|Maestro>] [--fuentes <fuentes.json>]
//   --guion y --seccion  añaden a cada frase sus fuentes (las marcas [fN] de su párrafo del guion): frases[].fuentes
//   --fuentes            añade TIMING.fuentes = { f1: "NVIDIA", … } con el nombre que se enseña en la caja de diálogo. En un
//                        short (formato "short" en el timing, o --short) usa `corto_short` de fuentes.json, o `corto` si falta,
//                        y avisa de los nombres de sus frases con más de 17 caracteres (no caben en la pestaña del 9:16)
import { readFileSync, writeFileSync } from "node:fs";
import { MAX_SHORT, avisosNombresShort, fuentesPorFrase, nombresCortos, nombresShort } from "./fuentes-frases.mjs";

const VALOR = new Set(["--guion", "--seccion", "--fuentes"]);
const flags = {}, pos = [];
for (let i = 2; i < process.argv.length; i++) { const a = process.argv[i]; if (VALOR.has(a)) flags[a] = process.argv[++i]; else if (a === "--short") flags[a] = true; else pos.push(a); }
const [entrada, salida] = pos;
if (!entrada || !salida) { console.error("Uso: node motor/timing-a-js.mjs <timing.json> <salida.js> [--guion <guion.md> --seccion <Short|Maestro>] [--fuentes <fuentes.json>] [--short]"); process.exit(2); }
const t = JSON.parse(readFileSync(entrada, "utf8"));
let conFuente = 0;
if (flags["--guion"]) {
  const reparto = fuentesPorFrase(readFileSync(flags["--guion"], "utf8"), flags["--seccion"] || (t.formato === "largo" ? "Maestro" : "Short"), t.frases);
  t.frases.forEach((f, k) => { f.fuentes = reparto[k]; if (reparto[k].length) conFuente++; });
}
const short = flags["--short"] || t.formato === "short";
let avisos = [];
if (flags["--fuentes"]) {
  const fuentes = JSON.parse(readFileSync(flags["--fuentes"], "utf8"));
  t.fuentes = short ? nombresShort(fuentes) : nombresCortos(fuentes);
  if (short) {
    const usadas = flags["--guion"] ? [...new Set(t.frases.flatMap((f) => f.fuentes || []))] : null;
    avisos = avisosNombresShort(fuentes, { usadas });
    for (const a of avisos) console.error(`aviso: la fuente ${a.id} («${a.nombre}», ${a.largo} caracteres) no cabe en la pestaña del short (máx. ${MAX_SHORT}): pon "corto_short" en fuentes.json`);
  }
}
writeFileSync(salida, `// Generado por motor/timing-a-js.mjs desde ${entrada.replace(/\\/g, "/").split("/").slice(-2).join("/")}. No editar a mano.\nwindow.TIMING = ${JSON.stringify(t)};\n`);
console.log(JSON.stringify({ salida, frases: t.frases.length, palabras: t.frases.reduce((n, f) => n + f.palabras.length, 0), duracion_s: t.audio.duracion_s,
  ...(flags["--guion"] ? { frases_con_fuente: conFuente } : {}), ...(avisos.length ? { fuentes_largas: avisos.map((a) => a.id) } : {}) }));
