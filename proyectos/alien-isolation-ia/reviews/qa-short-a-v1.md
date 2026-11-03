# QA · short-a-v1 · alien-isolation-ia

## Audio
- Fecha: 2026-11-02
- Máster: `proyectos/alien-isolation-ia/salida/short-a-v1.mp4` (54,03 s)

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,6 LUFS | -14 ±1 LUFS | OK |
| Pico real | -2,2 dBTP (ffmpeg: "True peak: -2.2 dBFS") | < -2 dBTP | OK |
| LRA | 2,3 LU | Sin umbral en `docs/criterios.md` | Informativo |
| Silencios > 0,4 s (-40 dB) | Ninguno | Short: ninguno (`docs/estilo.md`) | OK |
| Silencio al principio | 0,31 s (por debajo de 0,4 s, no computa) | Short: ninguno | OK (vigilar) |
| Silencio al final | Ninguno (-40 dB, d=0,1 s) | Short: ninguno | OK |

Comandos (cwd `C:/Users/mario/proyectos/canal-videos`):
- Sonoridad y pico: `ffmpeg -hide_banner -nostats -i proyectos/alien-isolation-ia/salida/short-a-v1.mp4 -af ebur128=peak=true -f null -`
- Silencios: `ffmpeg -hide_banner -nostats -i proyectos/alien-isolation-ia/salida/short-a-v1.mp4 -af silencedetect=noise=-40dB:d=0.4 -f null -`
- Control de silencios cortos: `... -af silencedetect=noise=-40dB:d=0.1 -f null -` (solo aparece silence_start 0 / silence_end 0,311854)
- Volumen: `ffmpeg -hide_banner -nostats -i proyectos/alien-isolation-ia/salida/short-a-v1.mp4 -af volumedetect -f null -` (mean -16,7 dB, max -2,2 dB)
- Duración: `ffprobe -v error -show_entries format=duration -of csv=p=0 proyectos/alien-isolation-ia/salida/short-a-v1.mp4`

Notas: el silencio de 0,31 s al inicio no llega al umbral de 0,4 s. Margen del pico: 0,2 dB.
