// Convierte timing.<formato>.json en un script que la escena puede cargar desde file:// (window.TIMING = {...}).
// Uso: node motor/timing-a-js.mjs <timing.json> <salida.js>
import { readFileSync, writeFileSync } from "node:fs";

const [entrada, salida] = process.argv.slice(2);
if (!entrada || !salida) { console.error("Uso: node motor/timing-a-js.mjs <timing.json> <salida.js>"); process.exit(2); }
const t = JSON.parse(readFileSync(entrada, "utf8"));
writeFileSync(salida, `// Generado por motor/timing-a-js.mjs desde ${entrada.replace(/\\/g, "/").split("/").slice(-2).join("/")}. No editar a mano.\nwindow.TIMING = ${JSON.stringify(t)};\n`);
console.log(JSON.stringify({ salida, frases: t.frases.length, palabras: t.frases.reduce((n, f) => n + f.palabras.length, 0), duracion_s: t.audio.duracion_s }));
