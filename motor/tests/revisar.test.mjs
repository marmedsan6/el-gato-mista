// revisar.mjs de extremo a extremo sobre una escena real: el short publicado de NVIDIA (estilo v5) tiene defectos de
// texto conocidos (diagnóstico del 2026-11-10) y el lint tiene que encontrarlos solo. Si este test deja de verlos, el
// lint se ha quedado ciego.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");
const ESCENA = join(MOTOR, "..", "proyectos", "nvidia-huang-espionaje", "escenas", "short", "short.html");
const revisar = (...extra) => spawnSync("node", [join(MOTOR, "revisar.mjs"), ESCENA, "270", "480", "71.17", "0.1", ".", "--json", ...extra], { encoding: "utf8" });

test("el lint encuentra las fuentes fuera de pantalla y los textos que no da tiempo a leer", { timeout: 120000 }, () => {
  const r = revisar("--desde", "55", "--hasta", "66");
  assert.equal(r.status, 0, r.stderr);
  const lint = JSON.parse(r.stdout.trim().split("\n").pop());
  const de = (regla) => lint.errores.filter((e) => e.regla === regla).map((e) => e.texto);
  assert.deepEqual(de("fuera").sort(), ["FUENTE: AFP", "FUENTE: NVIDIA"]);
  assert.ok(de("permanencia").includes("QUE SE FILTRARAN SECRETOS"));
  assert.ok(de("repite-voz").includes("ESPECULACION SIN FUNDAMENTO")); // tildesPixel() deja la letra sin tilde en el DOM
  assert.ok(lint.resumen.max_simultaneos >= 7);
});

test("--estricto sale con 1 cuando el lint da errores", { timeout: 120000 }, () => {
  assert.equal(revisar("--desde", "60", "--hasta", "64", "--estricto").status, 1);
});
