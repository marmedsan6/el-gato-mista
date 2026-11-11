// Lectores de la salida de FFmpeg del QA: con texto real de FFmpeg 9 (máster del short de NVIDIA v3).
import { test } from "node:test";
import assert from "node:assert/strict";
import { leerCongelados, leerEbur128, leerNegros, leerSilencios, veredicto } from "../qa-medidas.mjs";

const EBUR = `[Parsed_ebur128_0 @ 000001] t: 71.1 TARGET:-23 LUFS M: -70.0 S: -15.1 I: -14.2 LUFS LRA: 2.6 LU FTPK: -70.0 dBFS TPK: -2.1 dBFS
[Parsed_ebur128_0 @ 000001] Summary:

  Integrated loudness:
    I:         -14.2 LUFS
    Threshold: -24.2 LUFS

  Loudness range:
    LRA:         2.6 LU
    Threshold: -34.2 LUFS
    LRA low:   -15.6 LUFS
    LRA high:  -13.0 LUFS

  True peak:
    Peak:       -2.1 dBFS
`;

test("ebur128: lee el resumen final, no las líneas de avance", () => {
  assert.deepEqual(leerEbur128(EBUR), { lufs: -14.2, lra: 2.6, pico: -2.1 });
  assert.deepEqual(leerEbur128("sin resumen"), { lufs: null, lra: null, pico: null });
});

test("silencedetect: tramos con fin y tramo abierto al final", () => {
  const s = leerSilencios(`[silencedetect @ 1] silence_start: 0
[silencedetect @ 1] silence_end: 0.271042 | silence_duration: 0.271042
[silencedetect @ 1] silence_start: 70.581`);
  assert.deepEqual(s, [{ inicio: 0, fin: 0.271042, duracion: 0.271042 }, { inicio: 70.581, fin: null, duracion: null }]);
  assert.deepEqual(leerSilencios("nada"), []);
});

test("freezedetect y blackdetect", () => {
  const c = leerCongelados(`[freezedetect @ 1] lavfi.freezedetect.freeze_start: 2.283
[freezedetect @ 1] lavfi.freezedetect.freeze_duration: 1.017
[freezedetect @ 1] lavfi.freezedetect.freeze_end: 3.3
[freezedetect @ 1] lavfi.freezedetect.freeze_start: 58.633`);
  assert.deepEqual(c, [{ inicio: 2.283, duracion: 1.017 }, { inicio: 58.633, duracion: null }]);
  assert.deepEqual(leerNegros("[blackdetect @ 1] black_start:20.07 black_end:20.33 black_duration:0.26"), [{ inicio: 20.07, fin: 20.33, duracion: 0.26 }]);
});

test("veredicto: el short de NVIDIA v3 pasa; un pico de -1,6 dBTP o un silencio de 0,5 s, no", () => {
  const base = { formato: "short", ancho: 1080, alto: 1920, fps: 60, duracion: 71.2, lufs: -14.2, pico: -2.1,
    silencios: [{ inicio: 0, fin: 0.27, duracion: 0.27 }], congelados: [{ inicio: 2.28, duracion: 1.02 }], negros: [] };
  assert.ok(veredicto(base).every((f) => f.ok));
  assert.deepEqual(veredicto({ ...base, pico: -1.6 }).filter((f) => !f.ok).map((f) => f.nombre), ["Pico real"]);
  assert.deepEqual(veredicto({ ...base, silencios: [{ inicio: 10, fin: 10.5, duracion: 0.5 }] }).filter((f) => !f.ok).map((f) => f.nombre), ["Silencios ≥ 0,4 s (-35 dB)"]);
  assert.deepEqual(veredicto({ ...base, congelados: [{ inicio: 42, duracion: 2.1 }] }).filter((f) => !f.ok).map((f) => f.nombre), ["Congelados ≥ 2 s"]);
  assert.ok(!veredicto({ ...base, formato: "largo", ancho: 1920, alto: 1080, duracion: 71 }).every((f) => f.ok)); // un largo de 71 s no pasa
});
