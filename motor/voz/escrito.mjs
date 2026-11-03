// Pasa un timing de lo que se lee a lo que se escribe: la voz necesita «Fónic uno» y «cero coma cinco», pero el diálogo
// en pantalla y los subtítulos deben decir «Phonic-1» y «0,5». Une esas palabras en una, con el inicio de la primera y
// el final de la última, y conserva la puntuación final. El tiempo total no cambia.
// Uso: node motor/voz/escrito.mjs <timing.json> <cambios.json>
//   cambios.json: [["fónic uno", "Phonic-1"], ...]; gana la secuencia más larga. La comparación ignora tildes y mayúsculas.
import { readFileSync, writeFileSync } from "node:fs";

const [fichero, fCambios] = process.argv.slice(2);
if (!fichero || !fCambios) { console.error("Uso: node motor/voz/escrito.mjs <timing.json> <cambios.json>"); process.exit(2); }
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
const cambios = JSON.parse(readFileSync(fCambios, "utf8"))
  .map(([leido, escrito]) => ({ seq: leido.split(/\s+/).map(norm), escrito }))
  .sort((a, b) => b.seq.length - a.seq.length);
const t = JSON.parse(readFileSync(fichero, "utf8"));
const usados = {};
for (const f of t.frases) {
  const nuevas = [];
  for (let k = 0; k < f.palabras.length;) {
    const c = cambios.find(({ seq }) => seq.every((w, j) => f.palabras[k + j] && norm(f.palabras[k + j].p) === w));
    if (!c) { nuevas.push(f.palabras[k++]); continue; }
    const ini = f.palabras[k], fin = f.palabras[k + c.seq.length - 1];
    const antes = ini.p.match(/^[«¿¡"]*/)[0], despues = fin.p.match(/[.,;:?!»"…]*$/)[0];
    nuevas.push({ p: antes + c.escrito + despues, i: ini.i, f: fin.f });
    usados[c.escrito] = (usados[c.escrito] || 0) + 1;
    k += c.seq.length;
  }
  f.palabras = nuevas;
  f.texto = nuevas.map((p) => p.p).join(" ");
}
writeFileSync(fichero, JSON.stringify(t, null, 2) + "\n");
const sinUsar = cambios.filter((c) => !usados[c.escrito]).map((c) => c.escrito);
console.log(JSON.stringify({ fichero, usados, sinUsar }));
