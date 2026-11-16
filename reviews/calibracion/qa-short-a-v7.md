# QA · ia-pasa-factura · short-a-v7 v12

Máster: `salida/short-a-v7-v12.mp4`, SHA-256 `7dbcee0392262287c46d47b0e622e0e5111f6a4fdbf3abcf6f3f338d8da7d4f2`. Medidas de `node motor/qa.mjs` en `.runtime/qa/ia-pasa-factura-short-a-v7-v12/`.

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1080×1920, 60 | 1080×1920, 60 fps | OK |
| Duración | 66.52 s | short ≤ 120 s | OK |
| Sonoridad integrada | -14.2 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2.9 dBTP | < -2 dBTP | OK |
| Silencios ≥ 0,4 s (-35 dB) | 0 | short sin pausas | OK |
| Congelados ≥ 2 s | 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 1 | informativo (algo nuevo cada 1-2 s) | OK |
| Negros | 0 | 0 | OK |

## Audio
-14.2 LUFS integrados, LRA 2.8 LU, pico real -2.9 dBTP. Silencios de 0,2 s o más: 0.00-0.23.

## Congelados y negros
Tramos casi quietos de 1 s o más: 54.67 (1.40 s). Negros: ninguno.

## Lint de textos y sincronía
Pendiente: pega aquí el resumen de `node motor/revisar.mjs … --estricto`.

## Crítica visual
Pendiente: `critica-NN.md`.

## Bloqueantes
Ninguno en las medidas. Falta la crítica visual.
