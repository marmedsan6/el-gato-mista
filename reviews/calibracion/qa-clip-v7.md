# QA · ia-pasa-factura · clip-v7 v11

Máster: `salida/clip-v7-v11.mp4`, SHA-256 `67e20b3c26cac8d3cfeee38eef5ec0673115bea2e22a7600d4e16591b7144b6b`. Medidas de `node motor/qa.mjs` en `.runtime/qa/ia-pasa-factura-clip-v7-v11/`.

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1920×1080, 60 | 1920×1080, 60 fps | OK |
| Duración | 26.40 s | largo 8-10 min | FALLA |
| Sonoridad integrada | -14.2 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2.9 dBTP | < -2 dBTP | OK |
| Silencios ≥ 0,4 s (-35 dB) | 0 | informativo en el largo | OK |
| Congelados ≥ 2 s | 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 0 | informativo (algo nuevo cada 1-2 s) | OK |
| Negros | 0 | 0 | OK |

## Audio
-14.2 LUFS integrados, LRA 3 LU, pico real -2.9 dBTP. Silencios de 0,2 s o más: 0.00-0.23.

## Congelados y negros
Tramos casi quietos de 1 s o más: ninguno. Negros: ninguno.

## Lint de textos y sincronía
Pendiente: pega aquí el resumen de `node motor/revisar.mjs … --estricto`.

## Crítica visual
Pendiente: `critica-NN.md`.

## Bloqueantes
- Duración: 26.40 s (umbral: largo 8-10 min)
