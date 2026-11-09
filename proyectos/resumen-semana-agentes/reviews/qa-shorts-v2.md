# QA · resumen-semana-agentes · shorts A v2, B v3 y C v3 · 2026-11-06
| Comprobación | A v2 | B v3 | C v3 | Umbral | OK/FALLA |
|---|---|---|---|---|---|
| Resolución y fps | 1080×1920, 60 | 1080×1920, 60 | 1080×1920, 60 | 1080×1920, 60 fps | OK |
| Duración | 47,9 s | 49,4 s | 51,2 s | ≤ 120 s | OK |
| Sonoridad integrada (mezcla.mjs) | -14,29 LUFS | -14,10 LUFS | -14,01 LUFS | -14 ±1 | OK |
| Pico real (mezcla.mjs; ebur128 en la v1: -2,4) | -2,5 dBTP | -2,5 dBTP | -2,5 dBTP | < -2 | OK |
| Congelados > 2 s y negros | ninguno | ninguno | ninguno | ninguno | OK |
| Cierre que remite al largo | sí | sí | sí | con largo, sí | OK |

## Audio
Voz continua: las pausas de más de 0,4 s se quedan en 0,3 s con `apretar-pausas.mjs`. Efectos a -24 dB (12, 10 y 11) y música a -13 dB.

## Crítica visual
`reviews/critica-shorts-v1.md`: los tres bloqueantes de la v1 están arreglados y comprobados con fotogramas de la escena.

## Bloqueantes
Ninguno.
