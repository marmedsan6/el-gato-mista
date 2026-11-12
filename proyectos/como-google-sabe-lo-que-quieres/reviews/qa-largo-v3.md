# QA · como-google-sabe-lo-que-quieres · largo v3 · 2026-11-12

Máster: `salida/largo-v3.mp4`, SHA-256 `56035cd7808917600a0c89dadc9258636e58852899ab46a7452d8f32102b5042`. Medidas de
`node motor/qa.mjs` en `.runtime/qa/como-google-sabe-lo-que-quieres-largo-v3/` (con el timing desplazado 1,2 s, el desfase de
la voz, para que los fotogramas de frase caigan en su sitio).

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1920×1080, 60 | 1920×1080, 60 fps | OK |
| Duración | 493,10 s (8:13) | largo 8-10 min | OK |
| Sonoridad integrada | -14,4 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2,7 dBTP | < -2 dBTP | OK |
| Silencios ≥ 0,4 s (-35 dB) | 3 | informativo en el largo | OK |
| Congelados ≥ 2 s | 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 73 | informativo | OK |
| Negros | 0 | 0 | OK |

## Cómo se hizo el máster
- v1: render completo (`render/largo/largo-v1.mp4`, 15.804 capturas, 14,5 h). `qa.mjs` falló por 2 congelados (189,5 s y 431,4 s).
- v2: esos dos tramos se arreglaron en la escena (balanza que oscila; cursor y pulsos en Mi centro de anuncios), se renderizaron
  solos con `--desde/--hasta` y se empalmaron al fotograma (PSNR de los bordes frente al original: 53-55 dB).
- v3: arreglos de la crítica v2 en cinco tramos (10,2-12,7; 38,2-59,2; 149,5-156; 188-204; 288-345,9 s), renderizados aparte y
  empalmados sobre la v2 (PSNR de los bordes: 49-56 dB). Mezcla: voz con `--voz-desfase 1.2`, «Morning Coffee» a -13 dB y 117
  efectos a -24 dB.

## Lint de textos y sincronía
`node motor/revisar.mjs … 480 270 493.1 0.05 … --estricto`: vídeo entero con 0 errores (21 textos) antes del render v1; los
tramos cambiados, de nuevo con 0 errores antes de v3 (8-12,7; 36,5-59,2; 146-156; 187-204; 286-346 s).

## Crítica visual
- `critica-largo-v2.md`: un bloqueante («80 ms - 1 s» pisaba la ventana) y menores.
- `critica-largo-v3.md`: arreglos confirmados, sin empalmes visibles, **sin bloqueantes**. Dos pendientes no bloqueantes:
  «540 DÍAS» (4:56) y «17.260 APPS / 9.100 PROBADAS» (0:41) tapan parte del dibujo arriba a la derecha.

## Bloqueantes
Ninguno.

## v4 (2026-11-12)
Mario pidió arreglar los dos pendientes de la crítica v3. «17.260 / 9.100 APPS» van en la pared del laboratorio (en el mundo, viajan
con el zoom), «540 DÍAS» sobre la línea entre los calendarios y, de paso, «-20 % VISTAS» sin rozar la ventana. Lint estricto de
los tramos (41,5-58,2; 210-216,2; 301,5-307 s): 0 errores. Render de 42,2-58; 211,5-216,2 y 302,4-306,7 s, empalmado sobre la v3
(PSNR de los bordes: 53-55 dB). Máster `salida/largo-v4.mp4`, SHA-256 `f03b6bc628b929aeb1787bdef5e68e1cba7a55b5e63c4f80a19ddaac840cb5d8`:
1920×1080, 60 fps, 493,10 s, -14,4 LUFS, -2,7 dBTP, 0 congelados ≥ 2 s, 0 negros (`qa.mjs` OK).
