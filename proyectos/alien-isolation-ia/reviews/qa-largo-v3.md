# QA · alien-isolation-ia · largo v3 · 2026-11-02
Máster: `salida/largo-v3.mp4` (582,98 s = 9:43, 1920×1080, 60 fps).

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1920×1080, 60 fps | 1920×1080, 60 | OK |
| Duración | 9:43 | 8-10 min | OK |
| Sonoridad integrada | -14,7 LUFS | -14 ±1 | OK |
| Pico real | -2,4 dBTP | < -2 dBTP | OK |
| Silencios > 0,9 s (-40 dB) | ninguno (v1, misma voz) | pausas de 0,3-0,8 s | OK |
| Congelados (n=-60 dB, d=2 s) | 0 | ninguno | OK |
| Negros | 0 | ninguno | OK |

## Audio
- v1 fallaba por el pico real: -1,0 dBTP (`qa-largo-v1.md`), aunque `mezcla.json` decía -2,5. Con un limitador normal seguía en -1,6 dBTP, a 5:47,8 en el canal derecho: la música bitcrushed da picos entre muestras.
- v2 y v3 llevan, después de `motor/mezcla.mjs`, `aresample=192000,alimiter=limit=0.70:attack=2:release=60:level=disabled,aresample=48000` (AAC 192k). Con eso: -14,7 LUFS y -2,4 dBTP.
- El clip en inglés (7:09-7:12) suena unos 1,9 LU por encima del programa; queda dentro de lo normal para un inserto corto.

## Congelados y negros
`freezedetect=n=-60dB:d=2` y `blackdetect=d=0.1` sobre la v3: ningún tramo.

## Crítica visual
`critica-02.md` (sobre la v2). El texto cortado y solapado se arregla en la v3. El «aprende, se adapta» queda como está porque lo dice el vídeo oficial (f4). Arreglos menores comprobados por el orquestador con capturas (`.runtime/revision/alien-isolation-ia/fix-largo3.png`). No se ha repetido la pasada del crítico Opus sobre la v3.

## Bloqueantes
Ninguno pendiente.
