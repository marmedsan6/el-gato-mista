// Monta las piezas de un vídeo (estilo v7): lee proyectos/<slug>/piezas/ (lista.json, meta.json y las tandas aceptadas),
// copia las que vienen del set, valida anclas, colores y escala, y escribe:
//   proyectos/<slug>/escenas/comun/piezas.js   window.PIEZAS, lo que cargan las escenas (no se edita a mano)
//   proyectos/<slug>/piezas/contactos.png      la hoja del vídeo para la puerta de estilo (las del set, en verde)
// Las piezas del set se copian: el set puede crecer o cambiar sin alterar un vídeo ya montado.
//
// Uso: node motor/piezas/montar.mjs <slug | set | carpeta> [--salida <piezas.js>] [--contactos <png>] [--regla] [--set <set.json>]
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { SET_JSON, carpetaFuente, hoja, idDe, leerJSON, personaReferencia, rel, resolver, validar } from "./comun.mjs";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? undefined : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const dir = carpetaFuente(args[0]);
const set = leerJSON(typeof arg("set") === "string" ? resolve(arg("set")) : SET_JSON, { piezas: {} });

const { piezas, errores } = resolver(dir, { set });
errores.push(...validar(piezas));
if (errores.length) {
  console.error(`No se monta ${rel(dir)}: ${errores.length} error(es)\n- ` + errores.join("\n- "));
  process.exit(1);
}

// El set no es un vídeo: solo saca su hoja, salvo que se pida --salida
const esSet = idDe(dir) === "set";
const salida = typeof arg("salida") === "string" ? resolve(arg("salida")) : esSet ? null : join(dirname(dir), "escenas", "comun", "piezas.js");
const contactos = typeof arg("contactos") === "string" ? resolve(arg("contactos")) : join(dir, "contactos.png");

if (salida) {
  const lineas = Object.entries(piezas).map(([n, p]) => {
    const { set: _s, ...limpia } = p;
    return `  ${JSON.stringify(n)}: ${JSON.stringify(limpia)}`;
  });
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, `// Generado por motor/piezas/montar.mjs desde ${rel(dir)}/ (lista.json, meta.json y tandas/). No se edita a mano:\n` +
    `// cambia la fuente y vuelve a montar. Cada pieza: filas y paleta (sprite5), w, h, tipo y lo medido (base, ancla, anclas, estados).\n` +
    `window.PIEZAS = {\n${lineas.join(",\n")}\n};\n`);
}

const lista = Object.entries(piezas).map(([n, p]) => ({ ...p, nombre: n, etiqueta: `${p.w}×${p.h} · ${p.tipo}` }));
hoja(lista, contactos, {
  referencia: personaReferencia(piezas),
  titulo: `${idDe(dir)} · ${lista.length} piezas (${lista.filter((p) => p.set).length} del set)`,
  regla: arg("regla") ? join(dirname(contactos), "regla") : null,
});
console.log(JSON.stringify({ piezas: lista.length, del_set: lista.filter((p) => p.set).length, salida: salida && rel(salida), contactos: rel(contactos) }));
