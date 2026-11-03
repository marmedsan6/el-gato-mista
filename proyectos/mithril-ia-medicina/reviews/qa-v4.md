# QA · mithril-ia-medicina · short v4 (prueba de cámara dinámica, interna) · 2026-11-03

- Máster: `proyectos/mithril-ia-medicina/salida/short-v4.mp4`, SHA-256 `4429f9b993f734922e75b3a3cda75a4db1960b07326a2d273e4843a3f1e89709`.
- Qué es: una versión interna, que no se republica. Sus cambios están en `reviews/iter-04.md` y `reviews/critica-v4-01.md`.
- Escena: `escenas/short-v4/short.{html,js}` (la v3 publicada sigue en `escenas/short-v2/`) + `motor/estilo/`.

| Comprobación | Medida | Umbral | Resultado |
|---|---|---|---|
| Resolución · fps · fotogramas | 1080×1920 · 60/1 · 3.498 | short 1080×1920 a 60 fps | OK |
| Duración | 58,300 s | ≤ 120 s | OK |
| Sonoridad integrada (`ebur128`) | -14,1 LUFS · LRA 2,9 LU | -14 ±1 | OK |
| Pico real (`ebur128`) | -2,4 dBTP | < -2 dBTP | OK |
| Silencios (`silencedetect` -35 dB, 0,3 s) | 0 | short sin pausas | OK |
| Congelados (`freezedetect` 2 s) | 0 | ninguno no intencionado | OK |
| Negros (`blackdetect` 0,1 s) | 0 | ninguno no intencionado | OK |
| Contrato de escena | `npm test` 4/4 · render sin violaciones | sin reloj ni animaciones | OK |
| Caja de diálogo | 165/165 finales de página en ≤ 2 líneas (medido en Chromium) | el texto cabe en la caja | OK |
| Cámara | 20 planos en 58 s; zoom a escalones de ×0,25 cada 0,075 s (comprobado en 16 fotogramas seguidos); vuelve a ×1 antes de cada desplazamiento | píxel entero, ritmo de 4-6 s | OK |
| Efectos | 14 a -18 dB, atados a la pantalla (como la v3) | | OK |
| Visual (crítico Opus) | **pasa**; sus 3 defectos, arreglados y comprobados en 12 fotogramas (`reviews/critica-v4-01.md`) | sin bloqueantes | OK |

## Bloqueantes
Ninguno.
