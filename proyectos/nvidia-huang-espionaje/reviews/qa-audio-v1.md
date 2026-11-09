# QA audio · nvidia-huang-espionaje · short-v1

## Audio

Fecha: 2026-11-09. Fichero medido: `salida/short-v1.mp4` (71,20 s, 9:16).

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | I = -14,2 LUFS (LRA 2,6 LU) | -14 LUFS ±1 (criterios §4) | OK |
| Pico real | TPK = -2,1 dBTP (-2,1 y -2,2 por canal) | < -2 dBTP (criterios §4) | OK (margen 0,1 dB, ver nota 2) |
| Silencios | 0 silencios ≥ 0,3 s bajo -35 dB; ninguno > 0,4 s | Short: ninguno, voz continua (estilo.md) y > 0,4 s con voz (pedido de Mario) | OK |
| Voz domina a la música | Voz (stem) I = -20,4 LUFS; música (stem) I = -14,0 LUFS con `musica_db` -13 → ≈ -27,0 LUFS en mezcla; diferencia ≈ 6,6 LU | Sin umbral documentado. Propuesta: voz ≥ 6 LU por encima de la música | OK (según propuesta, pendiente de confirmar por Mario) |

Notas:
1. Estimación de la última fila: asume que `musica_db: -13` es una ganancia aplicada tal cual al stem de música, y que la pasada de normalización (+~6 dB) afecta a voz y música por igual, así que la diferencia se conserva. Es una estimación a partir de stems, no una medida sobre el máster (no hay stems separados en el máster).
2. El pico real medido en el máster (-2,1 dBTP) es 0,4 dB más alto que el de `short-v1.mp4.mezcla.json` (`pasada2.output_tp` = -2,50). Causa probable, no comprobada: la codificación AAC del MP4 sube los picos. Con 0,1 dB de margen, cualquier re-codificación podría pasar de -2 dBTP.
3. Sonoridad: la medida del máster (-14,2 LUFS) coincide con `pasada2.output_i` (-14,19).

Comandos usados (desde `salida/`):

- Sonoridad, LRA y pico real: `ffmpeg -hide_banner -i short-v1.mp4 -af ebur128=peak=true -f null -`
- Silencios: `ffmpeg -hide_banner -i short-v1.mp4 -af silencedetect=noise=-35dB:d=0.3 -f null -` (sin líneas `silence_start`)
- Volumen medio y máximo: `ffmpeg -hide_banner -i short-v1.mp4 -af volumedetect -f null -` → mean -16,5 dB, max -2,2 dB
- Stem de voz: `ffmpeg -hide_banner -i C:/Users/mario/proyectos/canal-videos/.runtime/voz/nvidia-huang-espionaje/short.wav -af ebur128 -f null -` → I -20,4 LUFS
- Stem de música: `ffmpeg -hide_banner -i C:/Users/mario/proyectos/canal-videos/.runtime/audio/musica-alien.mp3 -af ebur128 -f null -` → I -14,0 LUFS
