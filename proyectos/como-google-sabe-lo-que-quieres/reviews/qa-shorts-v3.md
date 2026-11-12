# QA · como-google-sabe-lo-que-quieres · shorts A v3, B v3 y C v2 · 2026-11-12

Medidas de `node motor/qa.mjs` en `.runtime/qa/como-google-sabe-lo-que-quieres-short-{a-v3,b-v3,c-v2}/`.

| Máster | SHA-256 | Formato | Duración | Sonoridad | Pico real | Silencios ≥ 0,4 s | Congelados ≥ 2 s | Negros | OK |
|---|---|---|---|---|---|---|---|---|---|
| `salida/short-a-v3.mp4` | `64ee4fc677e1b0e6b285101eadc52c0d59558e59eca244a774ebdcb08ae853e4` | 1080×1920, 60 fps | 62,02 s | -14,1 LUFS | -2,9 dBTP | 0 | 0 | 0 | OK |
| `salida/short-b-v3.mp4` | `9c77166dbf1d521fdbacaa7ca04cfe49c2ab10f4d7bb06cd1e4c32fa12f3978d` | 1080×1920, 60 fps | 51,57 s | -14,3 LUFS | -2,8 dBTP | 0 | 0 | 0 | OK |
| `salida/short-c-v2.mp4` | `cb866ffbcecf834644433569b43da14460c2c9c1bf15029f8669ae18deb6ed10` | 1080×1920, 60 fps | 51,22 s | -14,5 LUFS | -2,8 dBTP | 0 | 0 | 0 | OK |

Umbrales (criterios §4): short ≤ 120 s, -14 ± 1 LUFS, < -2 dBTP, sin pausas, ningún congelado de 2 s o más, ningún negro.
Tramos casi quietos de 1 s o más (informativo): A 2, B 5, C 8 (en v1 eran 3, 6 y 11, más los cierres quietos).

## Audio
Voz Orus (`.runtime/voz/como-google-sabe-lo-que-quieres/short-{a,b,c}.wav`), «Morning Coffee» a -13 dB con sidechain y
efectos de la escena a -24 dB (`motor/mezcla.mjs`, loudnorm en dos pasadas y limitador). Cada short tiene un único silencio
corto (≤ 0,25 s).

## Congelados
El QA contaba como fallo el tramo quieto que llega al final del vídeo (`freezedetect` no le da duración). Se arregló en
`motor/qa-medidas.mjs` (un tramo abierto cuenta lo que dura hasta el final; test en `tests/qa-medidas.test.mjs`, 35 de 35):
los de v1 duraban 1,0, 1,5 y 1,2 s. Además, los cierres llevan ahora movimiento (robot en A, cursor en B y C).

## Lint de textos y sincronía
`node motor/revisar.mjs … 270 480 <dur> 0.05 … --estricto`: A 8 textos, B 8 y C 5, **0 errores** en los tres (también la
fuente visible 2 s en cada frase: en 9:16 los nombres largos se salían de la pestaña y se acortaron en `short-motor.js`).

## Crítica visual
- v1: `critica-shorts-v1.md` (A con un bloqueante: la cifra tapaba la placa NORTHEASTERN en el zoom).
- v2: `critica-shorts-v2.md` (arreglos confirmados; lo nuevo, arreglado en v3).
- Los tres terminan remitiendo al largo («Tengo un vídeo largo en YouTube que lo explica entero»).

## Bloqueantes
Ninguno. Quedan, decididos por Mario como no prioritarios: la ficha de B en rejilla, los iconos pequeños del panel de C, la
etiqueta de la tienda sin trayecto visible y la «LA PUJA» sobre la estación ICO.
