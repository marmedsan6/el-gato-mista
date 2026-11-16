// Conversor del arte generado (motor/piezas/convertir.py): una hoja sintética con «píxel falso» no entero sobre magenta,
// con el borde morado que deja el generador, vuelve a su rejilla y su paleta exactas; --alto deja la altura pedida.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");
const PYTHON = process.env.PYTHON || "C:/Users/mario/AppData/Local/Programs/Python/Python312/python.exe";
const BASE = join(process.env.RUNTIME_DIR || join(MOTOR, "..", ".runtime"), "tests", `conversor-${process.pid}-${process.hrtime.bigint()}`);
const sinPython = !existsSync(PYTHON) && "no encuentro Python con Pillow y NumPy";

// Pieza de 12×16 con contorno y cuatro colores de la paleta repartidos sin periodo corto (si el dibujo se repitiera cada
// 3 píxeles, el detector podría tomar ese periodo por el píxel)
const COLORES = ["#43506a", "#5b8cff", "#ff8a3d", "#ffd486"];
const W = 12, H = 16;
const original = Array.from({ length: H }, (_, j) => Array.from({ length: W }, (_, i) =>
  (i === 0 || j === 0 || i === W - 1 || j === H - 1) ? "#0b0e14" : COLORES[(i * 7 + j * 13 + ((i * j) % 5)) % 4]));
const rgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));

function hojaSintetica(ruta, p) {
  const M = 40, ancho = Math.round(W * p) + 2 * M, alto = Math.round(H * p) + 2 * M;
  const png = new PNG({ width: ancho, height: alto });
  const pon = (x, y, [r, g, b]) => { const k = (y * ancho + x) * 4; png.data[k] = r; png.data[k + 1] = g; png.data[k + 2] = b; png.data[k + 3] = 255; };
  for (let y = 0; y < alto; y++) for (let x = 0; x < ancho; x++) pon(x, y, [255, 0, 255]);
  const x0 = M, y0 = M, x1 = M + Math.round(W * p), y1 = M + Math.round(H * p);
  for (let y = y0 - 2; y < y1 + 2; y++) for (let x = x0 - 2; x < x1 + 2; x++) pon(x, y, [130, 10, 135]); // borde morado
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    for (let y = M + Math.round(j * p); y < M + Math.round((j + 1) * p); y++)
      for (let x = M + Math.round(i * p); x < M + Math.round((i + 1) * p); x++) pon(x, y, rgb(original[j][i]));
  }
  writeFileSync(ruta, PNG.sync.write(png));
}

function convertir(extra) {
  mkdirSync(BASE, { recursive: true });
  const hoja = join(BASE, "hoja.png"), salida = join(BASE, `piezas-${extra.join("")}.json`);
  if (!existsSync(hoja)) hojaSintetica(hoja, 11.3);
  const r = spawnSync(PYTHON, [join(MOTOR, "piezas", "convertir.py"), hoja, salida, "--nombres", "pieza", ...extra], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(readFileSync(salida, "utf8")).pieza;
}

test("una hoja con píxel falso de 11,3 px vuelve a su rejilla y su paleta", { skip: sinPython, timeout: 60000 }, () => {
  const p = convertir([]);
  assert.equal(p.w, W);
  assert.equal(p.h, H);
  assert.ok(Math.abs(p.pixel_falso - 11.3) < 0.3, `píxel detectado ${p.pixel_falso}`);
  const colores = p.filas.map((f) => [...f].map((c) => (c === "." ? "." : p.paleta[c])));
  assert.deepEqual(colores, original, "la rejilla no coincide con la original");
  assert.ok(!Object.values(p.paleta).some((c) => !["#0b0e14", ...COLORES].includes(c)), "el borde morado se ha colado como color");
});

test("--alto fuerza la altura final reduciendo el píxel", { skip: sinPython, timeout: 60000 }, () => {
  const p = convertir(["--alto", "8"]);
  assert.equal(p.h, 8);
  assert.ok(p.w >= 5 && p.w <= 7, `ancho ${p.w} (proporción 12:16)`);
});
