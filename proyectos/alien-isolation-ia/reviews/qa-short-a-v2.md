# QA · alien-isolation-ia · short-a v2 · 2026-11-02
Máster: `salida/short-a-v2.mp4` (54,03 s, 1080×1920, 60 fps). La v2 corrige los bloqueantes de `critica-01.md`; el audio de voz y la mezcla son los de la v1.

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1080×1920, 60 fps | 1080×1920, 60 | OK |
| Duración | 54,03 s | ≤ 120 s | OK |
| Sonoridad integrada | -14,6 LUFS | -14 ±1 | OK |
| Pico real | -2,2 dBTP | < -2 dBTP | OK |
| Silencios de voz > 0,4 s | ninguno (v1, misma voz) | ninguno | OK |
| Congelados (n=-60 dB, d=2 s) | 0 | ninguno | OK |
| Negros | 0 | ninguno | OK |

## Audio
Medido con `ebur128=peak=true` sobre el máster v2. Detalle de silencios en `qa-short-a-v1.md` (la voz no cambia).

## Congelados y negros
`freezedetect=n=-60dB:d=2` y `blackdetect=d=0.1`: ningún tramo.

## Crítica visual
`critica-01.md` (sobre la v1): no pasaba, por 2 bloqueantes en cada short. Arreglos aplicados en la v2 (lista al final de `critica-01.md`), comprobados por el orquestador en la hoja de contactos de la v2 (`.runtime/qa/alien-isolation-ia-short-a-v2/hoja.png`). No se ha repetido la pasada del crítico Opus sobre la v2.

## Bloqueantes
Ninguno pendiente.
