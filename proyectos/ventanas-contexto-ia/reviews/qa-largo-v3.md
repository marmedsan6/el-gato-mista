# QA · ventanas-contexto-ia · largo v3 · 2026-11-03

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1920×1080, 60 fps | 1920×1080, 60 fps | OK |
| Duración | 9:04 (544,33 s) | 8-10 min | OK |
| Sonoridad integrada | -14,26 LUFS | -15 a -13 | OK |
| Pico real | -2,5 dBTP (`mezcla.mjs`; la v2 medía -2,2 con ebur128) | < -2 | OK |
| Silencios | 2: 0,63 s y 0,40 s (misma voz que la v2) | pausas de 0,3-0,8 s permitidas | OK |
| Congelados > 2 s | 0 | 0 | OK |
| Negros | 0 | 0 | OK |

## Audio
Misma voz y mismos ajustes de mezcla que en la v1 y la v2 (música -13 dB, efectos -24 dB). Detalle en `qa-audio-v1.md`.

## Crítica visual
- **Primera pasada (v1):** no pasa. La gráfica tenía etiquetas pisadas y había tramos sin nada nuevo (`critica-largo-v1.md`).
- **Segunda pasada (v2):** los bloqueantes de la v1 quedan resueltos. Hay uno nuevo: «≠ lo que lee bien» va encima de la barra (`critica-largo-v2.md`).
- **v3:** se arregla ese bloqueante y los menores (RULER, la fuente de Opus en el detalle, «Infinita:», «2026» y los solapes de la gráfica).
- **Comprobación de la v3:** con fotogramas a tamaño completo en 2:48, 4:55, 6:25, 6:48 y 8:26, incluidos los que pidió el crítico (4:55, 2:44 y 2:48).

## Bloqueantes
Ninguno.
