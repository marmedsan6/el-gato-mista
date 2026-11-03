# QA largo v1: alien-isolation-ia

## Audio

Fecha: 2026-11-02. Fichero: `proyectos/alien-isolation-ia/salida/largo-v1.mp4` (9:43).

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,5 LUFS | -14 ±1 (-15 a -13) | OK |
| Pico real | -1,0 dBTP (sample peak -1,2 dBFS) | < -2 dBTP | FALLA |
| LRA | 3,3 LU | Sin umbral en `docs/criterios.md` §4 (informativo) | n/a |
| Silencios > 0,9 s a -40 dB | 0 tramos | Estilo: pausas de 0,3-0,8 s en el largo | OK |
| Clip en inglés hacia 7:09 (7:09-7:13) | -12,6 LUFS integrados en 4 s, LRA 0,3 LU (+1,9 LU sobre el programa) | Sin umbral por tramo; ±1 LU sobre el global | Observación: fuera de ±1 localmente |

Silencios de 0,3 s o más a -40 dB (`silencedetect`): solo 2 tramos, 84,63 s (0,58 s) y 338,54 s (0,33 s). El resto de pausas de voz no llega a -40 dB.

Comandos:
- `ffmpeg -hide_banner -i "proyectos/alien-isolation-ia/salida/largo-v1.mp4" -af ebur128=peak=true -f null -` → I -14,5 LUFS, LRA 3,3 LU, true peak -1,0 dBFS
- `ffmpeg -hide_banner -i "proyectos/alien-isolation-ia/salida/largo-v1.mp4" -af silencedetect=noise=-40dB:d=0.9 -f null -` → sin líneas `silence_start`
- `ffmpeg -hide_banner -i "proyectos/alien-isolation-ia/salida/largo-v1.mp4" -af volumedetect -f null -` → mean -16,7 dB, max -1,2 dB
- `ffmpeg -hide_banner -ss 429 -t 4 -i "proyectos/alien-isolation-ia/salida/largo-v1.mp4" -af ebur128=peak=true -f null -` → I -12,6 LUFS (tramo 7:09-7:13)
- `ffmpeg -hide_banner -i "proyectos/alien-isolation-ia/salida/largo-v1.mp4" -af silencedetect=noise=-40dB:d=0.3 -f null -` → 2 tramos (control de que la detección funciona)

Veredicto de audio: FALLA. El pico real (-1,0 dBTP) supera el límite de -2 dBTP. Hay que bajar el máster o limitar el pico antes de la PUERTA 2.
