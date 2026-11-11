// Revisión de la alineación con los datos reales del short de NVIDIA (timing.short.json y silencedetect de short.wav).
import { test } from "node:test";
import assert from "node:assert/strict";
import { revisarAlineacion } from "../voz/alineacion.mjs";

const w = (p, i, f) => ({ p, i, f });
const timing = () => ({ frases: [
  { id: "fr04", inicio: 21.2, fin: 29.98, palabras: [w("Megaspeed,", 21.2, 21.8), w("de", 28.92, 29.08), w("NVIDIA", 29.08, 29.44), w("a", 29.44, 29.92), w("China.", 29.92, 29.98)] },
  { id: "fr05", inicio: 29.98, fin: 38.24, palabras: [w("Y", 29.98, 30.84), w("su", 30.84, 30.96), w("objetivo,", 30.96, 31.36), w("avanzados.", 37.5, 38.24)] },
  { id: "fr06", inicio: 38.6, fin: 43.22, palabras: [w("El", 38.6, 38.7), w("domingo,", 38.7, 39.3), w("mujer.", 42.8, 43.22)] },
] });
const SILENCIOS = [[27.334, 27.538], [29.645, 29.818], [30.244, 30.544], [31.459, 31.669], [38.331, 38.631], [43.361, 43.661]].map(([inicio, fin]) => ({ inicio, fin }));

test("fr04→fr05: avisa del desfase y lleva el límite al silencio largo, no al más cercano", () => {
  const { avisos, fronteras, timing: t } = revisarAlineacion(timing(), SILENCIOS);
  assert.ok(avisos.some((a) => a.tipo === "desfase" && a.donde === "fr04→fr05"));
  assert.ok(avisos.some((a) => a.tipo === "palabra-corta" && a.donde.includes("China")));
  assert.ok(avisos.some((a) => a.tipo === "palabra-larga" && a.donde.includes("«Y»")));
  assert.deepEqual(fronteras[0], { entre: "fr04→fr05", fin: [29.98, 30.244], inicio: [29.98, 30.544] });
  assert.equal(t.frases[0].fin, 30.244);
  assert.equal(t.frases[0].palabras.at(-1).f, 30.244);
  assert.equal(t.frases[1].inicio, 30.544);
  assert.deepEqual(t.frases[1].palabras[0], w("Y", 30.544, 30.84));
});

test("un límite que ya cae en su silencio se ajusta sin aviso de desfase, y el original no cambia", () => {
  const original = timing();
  const { avisos, timing: t } = revisarAlineacion(original, SILENCIOS);
  assert.ok(!avisos.some((a) => a.tipo === "desfase" && a.donde === "fr05→fr06"));
  assert.equal(t.frases[1].fin, 38.331);
  assert.equal(t.frases[2].inicio, 38.631);
  assert.equal(original.frases[0].fin, 29.98);
});

test("sin silencio entre dos frases: avisa y no toca el límite", () => {
  const { avisos, timing: t } = revisarAlineacion(timing(), SILENCIOS.filter((s) => s.inicio < 35));
  assert.ok(avisos.some((a) => a.tipo === "sin-silencio" && a.donde === "fr05→fr06"));
  assert.equal(t.frases[1].fin, 38.24);
});
