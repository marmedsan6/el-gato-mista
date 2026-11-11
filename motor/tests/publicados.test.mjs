// Lo publicado no cambia: las escenas de los vídeos ya subidos (y las aprobadas como referencia) pintan hoy los mismos
// fotogramas que cuando se guardaron sus huellas (motor/huellas/publicados.json). Si falla, un cambio en motor/ ha
// alterado un vídeo publicado: congela la versión que usaba (como motor/estilo/v3/congelado/) en vez de regenerar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");

test("las escenas publicadas conservan sus huellas", { timeout: 170000 }, () => {
  const r = spawnSync("node", [join(MOTOR, "huellas.mjs")], { encoding: "utf8" });
  const fin = r.stdout.trim().split("\n").pop() || "";
  assert.equal(r.status, 0, `huellas distintas o error:\n${fin}\n${r.stderr.slice(-1500)}`);
  const datos = JSON.parse(fin);
  assert.ok(datos.huellas >= 100, `pocas huellas comparadas: ${datos.huellas}`);
  assert.deepEqual(datos.distintas, []);
});
