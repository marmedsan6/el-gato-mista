# QA · ia-pasa-factura · shorts v3 (A y B)

Arreglos de la segunda crítica (`critica-shorts-v2.md`), con la regla de QA de como-google. Medidas de
`node motor/qa.mjs … --version 3` (2026-11-13).

| Comprobación | Short A | Short B | Umbral | OK/FALLA |
|---|---|---|---|---|
| Máster | `salida/short-a-v3.mp4`, SHA-256 `0c8fd0df…0b13` | `salida/short-b-v3.mp4`, SHA-256 `c9b6d3db…167f` | | |
| Resolución, fps y duración | 1080×1920, 60, 67,12 s | 1080×1920, 60, 76,80 s | ≤ 120 s | OK |
| Sonoridad / pico real | -14,2 LUFS / -2,9 dBTP | -14,3 LUFS / -2,7 dBTP | -14 ± 1 / < -2 | OK |
| Silencios ≥ 0,4 s | 0 | 0 | short sin pausas | OK |
| Congelados ≥ 2 s / negros | 0 / 0 | 0 / 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 2 | 4 (v1: 10) | informativo | OK |
| Lint estricto | 0 errores | 0 errores | 0 | OK |
| Efectos | 19 | 24 | -24 dB | OK |

## Qué cambió
- **A:** los cuatro pasos del tubo se notan (el primero con «tráfico») y una figura genérica se asoma al tejado con un «!»
  en «lo dijo claro»; sin segunda placa REDDIT; «1 %» con su palabra (estación de Pew 1,7 s más larga); «?» junto a la
  puerta; el observador de Pew marca con un destello.
- **B:** balanza con cuerdas doradas largas, la nave bajo el brazo y un vaso pequeño, y temblor en «casi nada»; una sola
  caja registradora para el flujo de caja y el negativo (placa y negativo sin viajar, cajón y visor en «le queda»); las
  cinco gotas dentro del zoom; todas las cifras con «millones $»; título de más de 2 s; cierre con mostrador y visor «−»;
  móvil con pantalla clara.

## Crítica visual
Tercera pasada sobre la v3: `critica-shorts-v3.md`.

## Pendiente
La escucha de «va a probar» (37,8-40,6 s del A; `salida/comprobar-probar.wav`).
