# QA audio · largo-v1 · resumen-semana-agentes

- Fecha: 2026-11-06
- Fichero: `proyectos/resumen-semana-agentes/salida/largo-v1.mp4` (16:9, duración 00:09:32.56)
- Medidor: subagente de medición de audio (solo mide, no modifica el fichero)

## Resultado

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Sonoridad integrada | -14,1 LUFS | -14 ±1 LUFS (-15 a -13) | OK |
| Pico real | -2,2 dBTP | < -2 dBTP | OK (margen 0,2 dB) |
| Silencios > 1 s | Ninguno (máximo 0,57 s) | Pausas de 0,3-0,8 s (`docs/estilo.md`) | OK |
| Silencios fuera de 0,3-0,8 s | Ninguno por encima de 0,8 s; los de 0,30 s y 0,34 s cumplen | 0,3-0,8 s | OK |

Información adicional (sin umbral): LRA 4,3 LU; mean_volume -17,0 dB; max_volume -2,2 dB.

## Silencios detectados (-35 dB, mínimo 0,3 s)

| # | Inicio | Fin | Duración | Estado |
|---|---|---|---|---|
| 1 | 00:01:38,61 | 00:01:38,95 | 0,34 s | OK |
| 2 | 00:02:29,90 | 00:02:30,20 | 0,30 s | OK |
| 3 | 00:04:11,12 | 00:04:11,70 | 0,57 s | OK |
| 4 | 00:05:04,21 | 00:05:04,72 | 0,51 s | OK |
| 5 | 00:05:05,68 | 00:05:06,14 | 0,46 s | OK |
| 6 | 00:09:17,53 | 00:09:17,88 | 0,35 s | OK |

Ningún silencio supera 1 s.

## Comandos

```
ffmpeg -hide_banner -nostats -i largo-v1.mp4 -af ebur128=peak=true -f null -
ffmpeg -hide_banner -nostats -i largo-v1.mp4 -af silencedetect=noise=-35dB:d=0.3 -f null -
ffmpeg -hide_banner -nostats -i largo-v1.mp4 -af volumedetect -f null -
```

(Ejecutados desde `proyectos/resumen-semana-agentes/salida/`.)

## Veredicto

Audio dentro de umbral en sonoridad, pico y silencios. Sin defectos bloqueantes de audio.
