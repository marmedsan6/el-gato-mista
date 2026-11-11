# QA · anthropic-fable-5-2 · short v1

Máster: `salida/short-v1.mp4`, SHA-256 `173b21420400c4efdfa1486a0730fc66973709af0a414d54499d75799621f043`. Medidas de `node motor/qa.mjs` en `.runtime/qa/anthropic-fable-5-2-short-v1/`.

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1080×1920, 60 | 1080×1920, 60 fps | OK |
| Duración | 90.90 s | short ≤ 120 s | OK |
| Sonoridad integrada | -14.1 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2.9 dBTP | < -2 dBTP | OK |
| Silencios ≥ 0,4 s (-35 dB) | 0 | short sin pausas | OK |
| Congelados ≥ 2 s | 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 10 | informativo (algo nuevo cada 1-2 s) | OK |
| Negros | 0 | 0 | OK |

## Audio
-14.1 LUFS integrados, LRA 2.8 LU, pico real -2.9 dBTP. Silencios de 0,2 s o más: ninguno.

## Congelados y negros
Tramos casi quietos de 1 s o más: 1.95 (1.55 s); 25.75 (1.43 s); 29.17 (1.17 s); 30.53 (1.17 s); 55.73 (1.07 s); 57.18 (1.15 s); 68.75 (1.08 s); 73.02 (1.20 s); 75.53 (1.18 s); 80.07 (1.37 s). Negros: ninguno.

## Lint de textos y sincronía
`node motor/revisar.mjs … --estricto`: 0 errores, 0 fallos. Lint de textos: 20 textos (10 son piezas del dibujo), máximo 2 a la vez, 0 errores.

## Crítica visual
Revisión visual por hojas de contactos de las 4 tandas (`.runtime/qa/anthropic-fable-5-2-short-v1/hojas/`) y de las 9 tiras de cámara (`mov/`), 2026-11-10:
- Las 8 estaciones tienen su dibujo propio y algo cambia cada 1-2 s; MISTA entra en el titular, aparece en el cambio de tema y en el cierre; la balanza del precio se ve en el plano de detalle.
- Textos dentro de pantalla, sin cortes ni solapes; las piezas del dibujo (etiquetas de barras, balanza, recibo) no compiten con la caja de diálogo.
- Sin defectos que bloqueen la PUERTA 2. Observaciones menores: en la estación 2 el velocímetro es algo más apagado que el resto; en la carrera de barras la cifra de Opus 5.5 queda baja junto a la de Fable 5.1. Ninguna afecta a lo que dice el vídeo.

## Bloqueantes
Ninguno. Medidas, lint, sincronía y crítica visual sin bloqueantes.