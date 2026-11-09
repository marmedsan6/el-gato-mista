# QA · nvidia-huang-espionaje · short v3 · 2026-11-09

Máster: `salida/short-v3.mp4`, SHA-256 `3c5e00263c2af63160faa699d750678516d71017fba058258febd65e649b29cd`. Historia: v1 (`critica-01.md`, no pasa: el tuit «NVIDIA CONFIRMA» sin tachar) → `iter-01.md` → v2 (`critica-02.md`, pasa) → `iter-02.md` → v3.

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1080×1920, 60/1 | 1080×1920, 60 fps | OK |
| Duración | 71,20 s | short ≤ 120 s | OK |
| Sonoridad integrada | -14,2 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2,1 dBTP | < -2 dBTP | OK (margen 0,1 dB) |
| Silencios > 0,4 s (−35 dB) | 0 | short sin pausas | OK |
| Congelados (freezedetect n=0.001, d=2) | 0 | 0 | OK |
| Negros (blackdetect d=0.1) | 0 | 0 | OK |
| Efectos | 21 a -24 dB, atados a la pantalla | solo lo clave | OK |
| Contrato seek(t) | `npm test` 4/4 (lint y determinismo) | sin fallos | OK |
| Enlaces | `reviews/enlaces.md` y `enlaces-puerta2.md`: f1-f5 responden y dicen lo citado; sin cargos ni cambios en el comunicado | — | OK |

Comandos: `ffprobe -show_entries stream=width,height,r_frame_rate -show_entries format=duration`; `ffmpeg -af ebur128=peak=true`; `-af silencedetect=noise=-35dB:d=0.4`; `-vf freezedetect=n=0.001:d=2,blackdetect=d=0.1`.

## Audio
Detalle de la v1 en `qa-audio-v1.md` (misma mezcla: voz, música y efectos sin cambios entre versiones; `mezcla.mjs` da -14,19 LUFS y -2,50 dBTP antes de AAC; medido en el máster, -14,2 y -2,1). Voz ≈ 6,6 LU por encima de la música (estimado por el subagente con las pistas sueltas; ese umbral no está documentado).

## Congelados y negros
Ninguno en la v3. La v1 tenía uno de 42 a 44 s (resuelto en iter-01).

## Crítica visual
- `critica-01.md` (v1): no pasa.
- `critica-02.md` (v2): pasa, sin bloqueantes.
- La v3 aplica lo barato de la segunda crítica (`iter-02.md`), revisado por el orquestador en la hoja `.runtime/qa/nvidia-huang-espionaje-short-v3/hoja_01.png` (1 fotograma por segundo), sin una tercera pasada de Opus.

## Bloqueantes
Ninguno.

Pendiente para Mario: la frase de Megaspeed («investigada por Estados Unidos desde 2024») no repite «según el NYT» en la voz; en pantalla va «Fuente: NYT vía AFP» y sigue a la frase atribuida al Times. Cambiarla obligaría a reaprobar el guion y regenerar la voz.
