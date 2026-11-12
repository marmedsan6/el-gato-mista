# QA · como-google-sabe-lo-que-quieres · largo v1

Máster: `salida/largo-v1.mp4`, SHA-256 `4dc7fb0ed250d78c59157112ffbe40c1b8fdbf9c3d7c06afb5ffec67a4ba0129`. Medidas de `node motor/qa.mjs` en `.runtime/qa/como-google-sabe-lo-que-quieres-largo-v1/`.

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1920×1080, 60 | 1920×1080, 60 fps | OK |
| Duración | 493.10 s | largo 8-10 min | OK |
| Sonoridad integrada | -14.4 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2.7 dBTP | < -2 dBTP | OK |
| Silencios ≥ 0,4 s (-35 dB) | 3 | informativo en el largo | OK |
| Congelados ≥ 2 s | 2 | 0 | FALLA |
| Tramos casi quietos ≥ 1 s | 84 | informativo (algo nuevo cada 1-2 s) | OK |
| Negros | 0 | 0 | OK |

## Audio
-14.4 LUFS integrados, LRA 3.7 LU, pico real -2.7 dBTP. Silencios de 0,2 s o más: 98.31-98.75; 148.96-149.19; 301.54-301.97; 303.63-303.94; 304.98-305.52; 306.13-306.35; 458.12-458.35.

## Congelados y negros
Tramos casi quietos de 1 s o más: 1.17 (1.03 s); 5.17 (1.13 s); 9.63 (1.07 s); 17.37 (1.07 s); 18.70 (1.72 s); 25.47 (1.30 s); 27.60 (1.10 s); 31.47 (1.13 s); 40.70 (1.27 s); 80.00 (1.13 s); 84.27 (1.03 s); 104.33 (1.10 s); 105.90 (1.13 s); 107.87 (1.03 s); 108.90 (1.03 s); 112.63 (1.10 s); 114.30 (1.30 s); 125.23 (1.23 s); 127.43 (1.23 s); 131.63 (1.53 s); 135.17 (1.07 s); 147.50 (1.00 s); 158.40 (1.20 s); 159.60 (1.10 s); 169.20 (1.13 s); 189.50 (2.13 s); 196.10 (1.23 s); 197.33 (1.03 s); 205.40 (1.10 s); 210.30 (1.00 s); 212.93 (1.52 s); 218.30 (1.00 s); 222.73 (1.13 s); 227.00 (1.07 s); 230.60 (1.23 s); 266.33 (1.23 s); 275.80 (1.32 s); 303.73 (1.72 s); 306.55 (1.58 s); 311.43 (1.07 s); 313.10 (1.00 s); 326.00 (1.03 s); 327.33 (1.00 s); 330.00 (1.07 s); 347.50 (1.50 s); 360.63 (1.47 s); 367.40 (1.13 s); 372.37 (1.87 s); 374.93 (1.10 s); 382.67 (1.63 s); 384.63 (1.50 s); 387.93 (1.77 s); 390.30 (1.83 s); 392.13 (1.23 s); 393.37 (1.30 s); 397.00 (1.00 s); 407.37 (1.30 s); 413.10 (1.23 s); 414.33 (1.87 s); 416.20 (1.40 s); 417.60 (1.20 s); 418.80 (1.03 s); 419.83 (1.00 s); 420.83 (1.30 s); 422.13 (1.03 s); 425.53 (1.27 s); 427.40 (1.20 s); 428.60 (1.37 s); 431.37 (2.20 s); 439.97 (1.47 s); 443.80 (1.10 s); 454.53 (1.03 s); 456.07 (1.53 s); 459.50 (1.10 s); 460.60 (1.30 s); 463.57 (1.23 s); 464.83 (1.03 s); 467.40 (1.07 s); 471.23 (1.50 s); 474.43 (1.37 s); 476.47 (1.55 s); 481.50 (1.27 s); 486.40 (1.10 s); 489.47 (1.03 s). Negros: ninguno.

## Lint de textos y sincronía
Pendiente: pega aquí el resumen de `node motor/revisar.mjs … --estricto`.

## Crítica visual
Pendiente: `critica-NN.md`.

## Bloqueantes
- Congelados ≥ 2 s: 2 (umbral: 0)
