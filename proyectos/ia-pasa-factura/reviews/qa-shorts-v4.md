# QA · ia-pasa-factura · shorts v4 (A y B) — candidatos a la PUERTA 2

Retoques recomendados por la tercera crítica (`critica-shorts-v3.md`). Medidas de `node motor/qa.mjs … --version 4`
(2026-11-13); `cd motor && npm test`: 35 de 35.

| Comprobación | Short A | Short B | Umbral | OK/FALLA |
|---|---|---|---|---|
| Máster | `salida/short-a-v4.mp4`, SHA-256 `6a2aa6ac81f0ea8609a3ff8a895de456e4375ae8e24a0c024a71869ec17f3833` | `salida/short-b-v4.mp4`, SHA-256 `2827d2b3c775799ede0c4b181cac2cc7d037b87a7150cdcc674bf1be96b908dc` | | |
| Resolución, fps y duración | 1080×1920, 60, 67,12 s | 1080×1920, 60, 76,80 s | ≤ 120 s | OK |
| Sonoridad / pico real | -14,2 LUFS / -2,9 dBTP | -14,3 LUFS / -2,7 dBTP | -14 ± 1 / < -2 | OK |
| Silencios ≥ 0,4 s | 0 | 0 | short sin pausas | OK |
| Congelados ≥ 2 s / negros | 0 / 0 | 0 / 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 2 | 4 | informativo | OK |
| Lint estricto | 0 errores | 0 errores | 0 | OK |
| Tests del motor | 35 de 35 | | todas las huellas iguales | OK |

## Qué cambió desde la v3
- A: el director ejecutivo, en un despacho iluminado del último piso con traje (antes, al borde del tejado); el punto del
  globo, más grande.
- B: frontón del banco apoyado; el plato del vaso baja con la lluvia de gotas; sin monedas sobre «−9.070».

## Crítica visual
Pasada final sobre la v4: `critica-shorts-v4.md`.

## Pendiente
La escucha de «va a probar» (37,8-40,6 s del A; `salida/comprobar-probar.wav`).
