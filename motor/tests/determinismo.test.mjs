// Determinismo del motor (ADR 0004): dos renders de la misma escena, con los fotogramas sueltos pedidos en
// órdenes distintos, dan PNG y MP4 idénticos byte a byte. Y una escena con reloj se rechaza.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIX = join(MOTOR, "tests", "fixtures");
// Carpeta única por ejecución (no se borra nada: regla del proyecto).
const BASE = join(process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime", "tests",
  `determinismo-${process.pid}-${process.hrtime.bigint()}`);
const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");

function render(escena, salida, fotogramas) {
  mkdirSync(dirname(salida), { recursive: true });
  return spawnSync("node", [join(MOTOR, "render.mjs"), "--escena", escena, "--ancho", "64", "--alto", "36",
    "--duracion", "0.5", "--workers", "2", "--salida", salida, "--fotogramas", fotogramas],
  { encoding: "utf8", env: { ...process.env, RUNTIME_DIR: BASE } });
}

test("mismo t → mismo fotograma, en cualquier orden, y MP4 idéntico", { timeout: 120000 }, () => {
  const a = join(BASE, "a", "prueba.mp4"), b = join(BASE, "b", "prueba.mp4");
  const ra = render(join(FIX, "determinista.html"), a, "0,0.2,0.45");
  assert.equal(ra.status, 0, ra.stderr);
  const rb = render(join(FIX, "determinista.html"), b, "0.45,0,0.2");
  assert.equal(rb.status, 0, rb.stderr);
  for (const t of ["0", "0.2", "0.45"]) {
    assert.equal(sha(join(BASE, "a", `t_${t}.png`)), sha(join(BASE, "b", `t_${t}.png`)), `t=${t} distinto`);
  }
  assert.equal(sha(a), sha(b), "los MP4 difieren");
  const r = JSON.parse(ra.stdout.trim().split("\n").pop());
  assert.equal(r.fotogramas, 30);
  assert.ok(r.distintos < 30, "claveFotograma debería agrupar fotogramas iguales");
});

test("una escena que usa setTimeout en seek(t) se rechaza", { timeout: 120000 }, () => {
  const r = render(join(FIX, "con-reloj.html"), join(BASE, "reloj", "prueba.mp4"), "");
  assert.notEqual(r.status, 0, "debería fallar");
  assert.match(r.stderr, /setTimeout/);
});
