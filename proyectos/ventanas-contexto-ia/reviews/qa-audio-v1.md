# QA audio · ventanas-contexto-ia · v1

Fecha: 2026-11-03. Solo medición: no se ha modificado ningún máster.
Umbrales: `docs/criterios.md` §4 (sonoridad -14 LUFS ±1; pico real < -2 dBTP) y `docs/estilo.md` (Silencios: short ninguno, voz continua; largo pausas de 0,3-0,8 s antes de un dato o un giro).

Comandos (`<f>` = ruta absoluta del máster):
- Sonoridad y pico real: `ffmpeg -hide_banner -i "<f>" -af ebur128=peak=true -f null -`
- Silencios: `ffmpeg -hide_banner -i "<f>" -af silencedetect=noise=-35dB:d=0.3 -f null -`
- Volumen medio y máximo: `ffmpeg -hide_banner -i "<f>" -af volumedetect -f null -`

## Audio · Largo (largo-v1.mp4)
Fichero: `C:/Users/mario/proyectos/canal-videos/proyectos/ventanas-contexto-ia/salida/largo-v1.mp4`

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,3 LUFS (ebur128) | -14 ±1 (de -15,0 a -13,0) | OK |
| Pico real | -2,2 dBTP (ebur128 true peak) | < -2 dBTP | OK (margen 0,2 dB) |
| Silencios | 2: 305,28-305,91 s (0,63 s) y 457,75-458,15 s (0,40 s) (silencedetect) | Pausas de 0,3-0,8 s | OK |
| Rango de sonoridad (LRA) | 3,9 LU | Sin umbral (informativo) | — |
| Volumen medio / máximo | -17,0 dB / -2,2 dB (volumedetect) | Sin umbral (informativo) | — |

## Audio · Short A (short-a-v1.mp4)
Fichero: `C:/Users/mario/proyectos/canal-videos/proyectos/ventanas-contexto-ia/salida/short-a-v1.mp4`

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,2 LUFS (ebur128) | -14 ±1 (de -15,0 a -13,0) | OK |
| Pico real | -2,4 dBTP (ebur128 true peak) | < -2 dBTP | OK |
| Silencios | Ninguno a -35 dB durante 0,3 s o más (silencedetect) | Ninguno (voz continua) | OK |
| Rango de sonoridad (LRA) | 2,7 LU | Sin umbral (informativo) | — |
| Volumen medio / máximo | -17,2 dB / -2,4 dB (volumedetect) | Sin umbral (informativo) | — |

## Audio · Short B (short-b-v1.mp4)
Fichero: `C:/Users/mario/proyectos/canal-videos/proyectos/ventanas-contexto-ia/salida/short-b-v1.mp4`

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,1 LUFS (ebur128) | -14 ±1 (de -15,0 a -13,0) | OK |
| Pico real | -2,4 dBTP (ebur128 true peak) | < -2 dBTP | OK |
| Silencios | Ninguno a -35 dB durante 0,3 s o más (silencedetect) | Ninguno (voz continua) | OK |
| Rango de sonoridad (LRA) | 2,8 LU | Sin umbral (informativo) | — |
| Volumen medio / máximo | -16,8 dB / -2,4 dB (volumedetect) | Sin umbral (informativo) | — |

## Audio · Short C (short-c-v1.mp4)
Fichero: `C:/Users/mario/proyectos/canal-videos/proyectos/ventanas-contexto-ia/salida/short-c-v1.mp4`

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,3 LUFS (ebur128) | -14 ±1 (de -15,0 a -13,0) | OK |
| Pico real | -2,4 dBTP (ebur128 true peak) | < -2 dBTP | OK |
| Silencios | 1: 2,286-2,609 s (0,32 s) (silencedetect) | Ninguno (voz continua) | FALLA (leve: una pausa de 0,32 s, justo por encima del umbral de detección de 0,3 s) |
| Rango de sonoridad (LRA) | 3,0 LU | Sin umbral (informativo) | — |
| Volumen medio / máximo | -16,9 dB / -2,4 dB (volumedetect) | Sin umbral (informativo) | — |

Nota: el umbral de short "ninguno" es literal en `docs/estilo.md`. Si Mario considera tolerable una pausa de 0,3 s en el short, la regla debe ajustarse en ese documento. Esta tabla no lo decide.
