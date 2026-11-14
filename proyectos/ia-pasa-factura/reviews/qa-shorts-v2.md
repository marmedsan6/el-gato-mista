# QA · ia-pasa-factura · shorts v2 (A y B)

Arreglos de la crítica de la v1 (`critica-shorts-v1.md`), con la regla de QA de como-google: se arreglan los bloqueantes
y lo barato, no los redibujos grandes (decisión del agente, 2026-11-13). Medidas de `node motor/qa.mjs … --version 2`.

| Comprobación | Short A | Short B | Umbral | OK/FALLA |
|---|---|---|---|---|
| Máster | `salida/short-a-v2.mp4`, SHA-256 `2727f869…0677d` | `salida/short-b-v2.mp4`, SHA-256 `b264253c…a3360` | | |
| Resolución, fps y duración | 1080×1920, 60, 67,12 s | 1080×1920, 60, 76,80 s | ≤ 120 s | OK |
| Sonoridad / pico real | -14,2 LUFS / -2,8 dBTP | -14,3 LUFS / -2,7 dBTP | -14 ± 1 / < -2 | OK |
| Silencios ≥ 0,4 s | 0 | 0 | short sin pausas | OK |
| Congelados ≥ 2 s / negros | 0 / 0 | 0 / 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 2 (v1: 3) | 6 (v1: 10) | informativo | OK |
| Lint estricto | 0 errores | 0 errores | 0 | OK |
| Efectos | 19 | 25 | -24 dB | OK |

## Qué cambió
- **A:** el tubo de visitas se estrecha por tandas con la voz y el foro apaga ventanas por tandas (bloqueante 1); el foro
  gemelo es un salón visto por una ventana dentro del zoom (bloqueante 2); «1 %» entra con su palabra y la estación de Pew
  dura 1,4 s más; espacio duro en las cifras con «%»; placa PEW junto al observador; placa REDDIT sobre el tejado; el
  robot del cierre pegado a la puerta.
- **B:** balanza nueva, grande y sombreada, con una acción por tramo de voz (bloqueante 1); placa GEMINI en el rack e
  impresora pequeña fuera del zoom, vaso que sube una rayita por gota (bloqueante 2); caja sobre mostrador con la placa
  ALPHABET fuera de las monedas (bloqueante 3), salidas distintas, visor «−» y pagaré distinto del sobre; «+200.000» y
  «millones $»; móvil, cable y chispa más legibles; rótulo del cierre «En resumen».
- Sin cambiar: la fuente de la caja (la «C» a 360 px es general del canal), el tendero de A1 y el globo de A5.

## Crítica visual
Segunda pasada sobre la v2: `critica-shorts-v2.md`.

## Pendiente
La escucha de «va a probar» (37,8-40,6 s del A; `salida/comprobar-probar.wav`).
