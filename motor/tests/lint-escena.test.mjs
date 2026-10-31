// Lint del contrato de escena (docs/criterios.md §1): nada de reloj, animaciones CSS, azar sin semilla
// ni recursos de red en las escenas. Recorre motor/calibracion/**, motor/estilo/**, plantillas/**/escena(s)/**
// y proyectos/*/escenas/**.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { infracciones } from "./reglas-escena.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const EXT = /\.(html|css|js|mjs)$/;

function ficheros(dir, dentro) {
  let lista = [];
  let nombres = [];
  try { nombres = readdirSync(dir); } catch { return lista; }
  for (const n of nombres) {
    if (n === "node_modules" || n.startsWith(".")) continue;
    const ruta = join(dir, n);
    if (statSync(ruta).isDirectory()) lista = lista.concat(ficheros(ruta, dentro));
    else if (EXT.test(n) && dentro(ruta)) lista.push(ruta);
  }
  return lista;
}

test("las reglas detectan lo prohibido y dejan pasar lo permitido", () => {
  for (const malo of [".a{transition: left 1s}", "@keyframes x{}", "setTimeout(f,1)", "requestAnimationFrame(f)",
    "Math.random()", '<link href="https://fonts.googleapis.com/css">', "const d = new Date()"]) {
    assert.ok(infracciones(malo).length > 0, `no detecta: ${malo}`);
  }
  for (const bueno of ["rect(svg, x, y)", 'url("../marca/f.ttf")', "// setTimeout está prohibido", 'xmlns="http://www.w3.org/2000/svg"']) {
    assert.equal(infracciones(bueno).length, 0, `falso positivo: ${bueno}`);
  }
});

test("las escenas no usan reloj, animaciones, azar sin semilla ni red", () => {
  const lista = [
    ...ficheros(join(RAIZ, "motor", "calibracion"), () => true),
    ...ficheros(join(RAIZ, "motor", "estilo"), () => true),
    ...ficheros(join(RAIZ, "plantillas"), (r) => r.includes(`${sep}escenas${sep}`) || r.includes(`${sep}escena${sep}`)),
    ...ficheros(join(RAIZ, "proyectos"), (r) => r.includes(`${sep}escenas${sep}`)),
  ];
  assert.ok(lista.length > 0, "no se encontró ninguna escena que revisar");
  const fallos = lista.flatMap((f) => infracciones(readFileSync(f, "utf8")).map((x) => `${relative(RAIZ, f)}:${x.linea} · ${x.nombre}`));
  assert.deepEqual(fallos, [], "Infracciones del contrato de escena:\n" + fallos.join("\n"));
});
