# QA · resumen-semana-agentes · largo v2 · 2026-11-06
| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1920×1080, 60 fps | 1920×1080, 60 fps | OK |
| Duración | 9:32,6 (572,567 s) | 8-10 min | OK |
| Sonoridad integrada | -14,1 LUFS (ebur128) | -14 ±1 | OK |
| Pico real | -2,2 dBTP (ebur128); -2,5 en mezcla.mjs | < -2 | OK |
| Silencios | máximo 0,57 s a 04:11 (v1, misma voz y mezcla) | 0,3-0,8 s | OK |
| Congelados > 2 s | ninguno (freezedetect n=-60dB d=2, sobre la v2) | ninguno no intencionado | OK |
| Negros | ninguno (blackdetect d=0,1, sobre la v2) | ninguno | OK |
| Enlaces | `reviews/enlaces.md` (comprobados hoy, 2026-11-06) | sin caídas | OK |

## Audio
Detalle en `reviews/qa-audio-largo-v1.md`. La v2 solo cambia la imagen: la voz, los efectos (52, a -24 dB) y la música (-13 dB) son los mismos, y el resultado se ha vuelto a medir con ebur128: -14,1 LUFS y -2,2 dBTP.

## Congelados y negros
Sin detecciones ni en la v1 (`.runtime/qa/resumen-semana-agentes-largo/`) ni en la v2.

## Crítica visual
`reviews/critica-largo-v1.md`: la v1 no pasaba, con 3 bloqueantes (texto cortado en el cierre, placas desbordadas en el detalle del bucle y «≤» que se leía «$»). Los tres están arreglados en la v2, junto con el solape de la fuente del detalle de barras, las placas de la cronología de Binance y la insignia del gancho. Se comprobó con fotogramas de la escena en `trabajo/revisar4/`. Queda un defecto menor sin arreglar (el sello «MATIZ» no cae encima del bocadillo).

## Bloqueantes
Ninguno.
