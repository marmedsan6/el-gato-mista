// Biblioteca v7 del arte generado (motor/estilo/v7/generado.js): colocar por ancla y base, voltear, estados por paleta,
// anclas internas volteadas, andar por f(t) y la puerta que se cierra. Con sprite5 simulado (registra cada llamada).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");
function cargar() {
  const llamadas = [];
  const ctx = { sprite5: (svg, x, y, filas, paleta, espejo = false) => llamadas.push({ x, y, filas, paleta: { ...paleta }, espejo }) };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(join(MOTOR, "estilo", "v7", "generado.js"), "utf8") +
    "\n;Object.assign(globalThis, { ancla7, sprite7, punto7, caja7, camisa7, andar7, puerta7, APAGAR7 });", ctx);
  return { ctx, llamadas };
}
// Tienda de 10×6: fila de arriba de la columna 2 a la 7 (ancla 5 por defecto), luz ámbar y un hueco de puerta
const tienda = () => ({
  filas: ["..aaaaaa..", ".abbbbbba.", "abccbbddba", "abccbbddba", "abbbbbddba", "aaaaaaaaaa"],
  paleta: { a: "#0b0e14", b: "#43506a", c: "#ffd486", d: "#161b26" }, w: 10, h: 6, tipo: "tienda",
  anclas: { puerta: { x: 6, y: 2, w: 2, h: 3 } }, estados: { apagada: { "#ffd486": "#41291f" } },
});

test("sprite7 coloca por ancla y base, y voltea alrededor del ancla", () => {
  const { ctx, llamadas } = cargar();
  const s = tienda();
  assert.equal(ctx.ancla7(s), 5);
  const pos = ctx.sprite7(null, s, 100, 50);
  assert.deepEqual([llamadas[0].x, llamadas[0].y, llamadas[0].espejo], [95, 44, false]);
  const v = ctx.sprite7(null, s, 100, 50, { dir: -1 });
  assert.deepEqual([llamadas[1].x, llamadas[1].espejo], [96, true]); // ancla volteada: w-1-5 = 4
  s.base = 5; // una fila de acera por debajo del suelo
  ctx.sprite7(null, s, 100, 50);
  assert.equal(llamadas[2].y, 45);
  assert.deepEqual([pos.x0, v.x0], [95, 96]);
});

test("estados y camisas cambian la paleta sin tocar la pieza", () => {
  const { ctx, llamadas } = cargar();
  const s = tienda();
  ctx.sprite7(null, s, 0, 0, { estado: "apagada" });
  assert.equal(llamadas[0].paleta.c, "#41291f");
  assert.equal(s.paleta.c, "#ffd486");
  assert.throws(() => ctx.sprite7(null, s, 0, 0, { estado: "rota" }), /no tiene el estado «rota»/);
  const p = { filas: ["ab"], paleta: { a: "#efe6d2", b: "#0b0e14" }, w: 2, h: 1 };
  ctx.sprite7(null, p, 0, 0, { cambios: ctx.camisa7(["#0d5a42", "#13936a", "#1fd69a"]) });
  assert.equal(llamadas[1].paleta.a, "#1fd69a");
});

test("punto7 da el ancla interna en el mundo, también volteada", () => {
  const { ctx } = cargar();
  const s = tienda();
  const d = ctx.punto7(ctx.sprite7(null, s, 100, 50), "puerta");
  assert.deepEqual({ x: d.x, y: d.y, w: d.w, h: d.h, pie: d.pie }, { x: 101, y: 46, w: 2, h: 3, pie: 49 });
  const v = ctx.punto7(ctx.sprite7(null, s, 100, 50, { dir: -1 }), "puerta");
  assert.equal(v.x, 96 + 10 - 6 - 2); // el hueco pasa al otro lado
  assert.deepEqual({ ...ctx.caja7(s, ["#ffd486"]) }, { x: 2, y: 2, w: 2, h: 2 });
});

test("luces7 encuentra cada ventana encendida y apagarLuces7 apaga una fracción fija", () => {
  const rects = [];
  const { ctx } = cargar();
  ctx.rect = (svg, x, y, w, h, c) => rects.push([x, y, w, h, c]);
  ctx.mulberry32 = (s) => { let a = s; return () => ((a = (a * 16807) % 2147483647) / 2147483647); };
  const s = { filas: ["aaaaaaa", "allalla", "aaaaaaa", "allaaaa", "aaaaaaa"], paleta: { a: "#0b0e14", l: "#ffd486" }, w: 7, h: 5 };
  vm.runInContext("globalThis.luces7 = luces7; globalThis.apagarLuces7 = apagarLuces7;", ctx);
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.luces7(s))), [{ x: 1, y: 1, w: 2, h: 1 }, { x: 4, y: 1, w: 2, h: 1 }, { x: 1, y: 3, w: 2, h: 1 }]);
  const pos = { x0: 10, y0: 20, dir: 1, s };
  assert.equal(ctx.apagarLuces7(null, pos, 1), 3);
  assert.equal(rects.length, 0);
  ctx.apagarLuces7(null, pos, 0.34);
  const primeras = rects.splice(0);
  assert.equal(primeras.length, 2);
  ctx.apagarLuces7(null, pos, 0);
  assert.equal(rects.length, 3);
  assert.deepEqual(rects.slice(0, 2), primeras, "las que se apagan antes son siempre las mismas");
});

test("andar7 alterna quieto y paso con t, y la puerta entra con el cierre", () => {
  const { ctx, llamadas } = cargar();
  const quieto = { filas: ["q"], paleta: { q: "#0b0e14" }, w: 1, h: 1 }, paso = { filas: ["p"], paleta: { p: "#0b0e14" }, w: 1, h: 1 };
  ctx.andar7(null, { quieto, paso }, 0, 0, 0.1);
  ctx.andar7(null, { quieto, paso }, 0, 0, 0.3);
  ctx.andar7(null, { quieto, paso }, 0, 0, 0.3, { anda: false });
  assert.deepEqual(llamadas.map((l) => l.filas[0]), ["q", "p", "q"]);
  llamadas.length = 0;
  const hueco = { x: 10, y: 20, w: 8, h: 12 };
  ctx.puerta7(null, hueco, 0);
  assert.equal(llamadas.length, 0, "abierta: no se pinta hoja");
  ctx.puerta7(null, hueco, 0.5);
  ctx.puerta7(null, hueco, 1);
  assert.deepEqual(llamadas.map((l) => [l.x, l.filas[0].length, l.filas.length]), [[10, 4, 12], [10, 8, 12]]);
});
