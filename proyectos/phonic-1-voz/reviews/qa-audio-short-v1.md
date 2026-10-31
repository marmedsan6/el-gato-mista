# QA · phonic-1-voz · short-v1 (audio)

## Audio
- Fecha: 2026-10-31
- Fichero: `C:\Users\mario\proyectos\canal-videos\proyectos\phonic-1-voz\salida\short-v1.mp4` (54,80 s, 1080×1920, 60 fps, AAC 48 kHz estéreo)
- Formato: short (sin pausas, `docs/estilo.md` §Silencios)

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,1 LUFS | -14 LUFS ±1 (-15 a -13) | OK |
| Pico real | -2,3 dBTP | < -2 dBTP | OK |
| Silencios (-35 dB, 0,3 s) | 1 silencio: 2,706 s → 3,016 s (0,310 s) | Ninguno (short) | FALLA |

Datos de referencia (no son umbral): LRA 1,9 LU; mean_volume -16,9 dB; max_volume -2,3 dB.

Comandos (ruta `F` = fichero anterior):
- Sonoridad y pico real: `ffmpeg -hide_banner -i "F" -af ebur128=peak=true -f null -`
- Silencios: `ffmpeg -hide_banner -i "F" -af silencedetect=noise=-35dB:d=0.3 -f null -`
- Medias: `ffmpeg -hide_banner -i "F" -af volumedetect -f null -`

Veredicto: 2 de 3 comprobaciones OK. Falla el silencio: hay una pausa de 0,31 s en 2,7 s, y el short debe tener voz continua.
