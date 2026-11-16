// Set común del arte generado (estilo v7): motor/estilo/v7/set/set.json. Al cerrar un vídeo, sus piezas reutilizables
// pasan aquí con su meta (anclas, estados) y quedan para los siguientes. Regenera además:
//   set/catalogo.md            la tabla que se mira en el storyboard para elegir qué reutilizar
//   set/contactos.png          todas las piezas a tamaño de salida y de móvil
//   motor/piezas/referencia/   estilo.png y escala.png: las piezas marcadas «referencia», lo que se pasa a Codex con -i
//
// Uso: node motor/piezas/promover.mjs <slug | set | carpeta> nombre1,nombre2 [--como viejo=nuevo,…]
//      node motor/piezas/promover.mjs --referencia nombre1,nombre2     marca piezas del set como referencia
//      node motor/piezas/promover.mjs --quitar-referencia nombre1      desmarca
//      node motor/piezas/promover.mjs --regenerar                      solo catálogo, hoja y referencias
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PIEZAS, SET_DIR, SET_JSON, carpetaFuente, escala, hoja, leerJSON, personaReferencia, rel, resolver, validar } from "./comun.mjs";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? undefined : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const fallo = (m) => { console.error(m); process.exit(1); };
const set = leerJSON(SET_JSON, { nota: "Set común del arte generado (estilo v7). Lo escribe motor/piezas/promover.mjs: no se edita a mano.", piezas: {} });
const guardar = () => { mkdirSync(SET_DIR, { recursive: true }); writeFileSync(SET_JSON, JSON.stringify(set, null, 1) + "\n"); };

function marcar(nombres, valor) {
  for (const n of nombres) {
    if (!set.piezas[n]) fallo(`${n}: no está en el set`);
    if (valor) set.piezas[n].referencia = true; else delete set.piezas[n].referencia;
  }
}

if (arg("referencia")) marcar(String(arg("referencia")).split(","), true);
else if (arg("quitar-referencia")) marcar(String(arg("quitar-referencia")).split(","), false);
else if (!arg("regenerar")) {
  const dir = carpetaFuente(args[0]);
  if (!args[1] || args[1].startsWith("--")) fallo("Faltan los nombres de las piezas que se promueven (a,b,c)");
  const nombres = args[1].split(",");
  const como = Object.fromEntries((typeof arg("como") === "string" ? arg("como").split(",") : []).map((x) => x.split("=")));
  const { piezas, errores } = resolver(dir, { set });
  const elegidas = {};
  for (const n of nombres) {
    if (!piezas[n]) errores.push(`${n}: no está en ${rel(dir)}/lista.json`);
    else if (piezas[n].set) errores.push(`${n}: ya viene del set`);
    else elegidas[como[n] || n] = piezas[n];
  }
  for (const n of Object.keys(elegidas)) if (set.piezas[n]) errores.push(`${n}: ya hay una pieza con ese nombre en el set (usa --como ${n}=otro)`);
  errores.push(...validar(elegidas));
  if (errores.length) fallo(`No se promueve nada:\n- ${errores.join("\n- ")}`);
  for (const [n, p] of Object.entries(elegidas)) { delete p.estacion; set.piezas[n] = p; }
}
guardar();

// ---------- catálogo, hoja y referencias ----------
const todas = Object.entries(set.piezas).map(([n, p]) => ({ ...p, nombre: n, etiqueta: `${p.w}×${p.h} · ${p.tipo}` }));
const celda = (o) => (o && Object.keys(o).length ? Object.keys(o).join(", ") : "—");
const filas = todas.map((p) => `| ${p.nombre} | ${p.tipo} | ${p.w}×${p.h} | ${(p.etiquetas || []).join(", ") || "—"} | ${celda(p.anclas)} | ${celda(p.estados)} | ${p.origen || "—"} | ${p.referencia ? "sí" : ""} |`);
writeFileSync(join(SET_DIR, "catalogo.md"), [
  "# Set común del arte generado (estilo v7)",
  "",
  "Lo escribe `motor/piezas/promover.mjs`: no se edita a mano. Las piezas están en `set.json`; la hoja, en `contactos.png`.",
  "Para reutilizar una en un vídeo: `{\"nombre\": …, \"de\": \"set\"}` en su `piezas/lista.json`. Las personas salen siempre de aquí",
  "con otra camisa por paleta (`camisa7`). Las marcadas como referencia son las que se pasan a Codex con `-i`.",
  "",
  `${todas.length} piezas. Escala: \`motor/piezas/escala.json\`.`,
  "",
  "| Pieza | Tipo | Tamaño | Etiquetas | Anclas | Estados | Origen | Referencia |",
  "|---|---|---|---|---|---|---|---|",
  ...filas,
  "",
].join("\n"));

const salida = { piezas: todas.length, catalogo: rel(join(SET_DIR, "catalogo.md")) };
if (todas.length) {
  salida.contactos = rel(hoja(todas, join(SET_DIR, "contactos.png"), { referencia: personaReferencia(set.piezas), titulo: `set v7 · ${todas.length} piezas` }));
  const refs = todas.filter((p) => p.referencia);
  if (refs.length) {
    const dirRef = join(PIEZAS, "referencia");
    mkdirSync(dirRef, { recursive: true });
    hoja(refs, join(dirRef, "estilo.png"), { paraCodex: true });
    // escala: la persona de referencia y una pieza de cada tipo, de menor a mayor, sobre la misma línea
    const persona = escala().referencia || "quieto";
    const porTipo = Object.values(Object.fromEntries(refs.filter((p) => p.nombre !== persona).map((p) => [p.tipo, p])));
    const conPersona = [...todas.filter((p) => p.nombre === persona), ...porTipo.sort((a, b) => a.h - b.h)];
    hoja(conPersona, join(dirRef, "escala.png"), { paraCodex: true });
    salida.referencias = refs.map((p) => p.nombre);
  }
}
console.log(JSON.stringify(salida));
