# QA · resumen-semana-agentes · largo v3 y shorts A v3, B v4, C v4 · 2026-11-06
Cambio respecto a la vuelta anterior: solo la voz (Gemini «Orus» con el `--estilo` de siempre), su alineación y los tiempos
de las escenas. El dibujo de las escenas es el mismo que pasó la crítica (`critica-largo-v1.md`, `critica-shorts-v1.md`) y sus arreglos.

| Comprobación | Largo v3 | Short A v3 | Short B v4 | Short C v4 | Umbral | OK/FALLA |
|---|---|---|---|---|---|---|
| Resolución y fps | 1920×1080, 60 | 1080×1920, 60 | 1080×1920, 60 | 1080×1920, 60 | según formato, 60 fps | OK |
| Duración | 563,2 s (9:23) | 50,9 s | 46,8 s | 53,4 s | largo 8-10 min; short ≤ 120 s | OK |
| Sonoridad integrada | −14,19 LUFS | −14,04 | −14,32 | −14,16 | −14 ± 1 | OK |
| Pico real | −2,50 dBTP | −2,50 | −2,50 | −2,50 | < −2 dBTP | OK |
| Alineación (palabras casadas) | 91 %, sin huecos | 97,7 % | 93 % | 98,9 % | sin frases colapsadas | OK |
| Congelados ≥ 4 s (freezedetect) | ninguno | ninguno | ninguno | ninguno | ninguno | OK |
| Negros ≥ 0,5 s (blackdetect) | ninguno | ninguno | ninguno | ninguno | ninguno | OK |
| Barrido de escenas (errores JS) | 0 | 0 | 0 | 0 | 0 | OK |

## Audio
Medidas de `motor/mezcla.mjs` (música −13 dB, efectos −24 dB, limitador dinámico).

## Congelados y negros
`ffmpeg -vf freezedetect=n=0.001:d=4,blackdetect=d=0.5:pix_th=0.05`: sin detecciones en ninguno.

## Crítica visual
No se repite: solo cambian los tiempos. Revisados a mano los fotogramas de portada (largo 377,4 s; A 6 s; B 14 s; C 40 s): sin cortes ni solapes.

## Bloqueantes
Ninguno.
