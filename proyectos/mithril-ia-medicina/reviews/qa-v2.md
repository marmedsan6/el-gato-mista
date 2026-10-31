# QA · mithril-ia-medicina · short v2 (estilo v2, MISTA) · 2026-10-30 · tras la iteración 02 (retrato quieto, 16 efectos)

- Máster: `proyectos/mithril-ia-medicina/salida/short-v2.mp4`, SHA-256 `368c32dd86b474a22036cab9c43f3bf73eb08ef0d926c015ba6fd811d3f216ae`.
- Escena: `escenas/short-v2/short.{html,js}` + `motor/estilo/{estilo.css,pixel.js,props.js,escenarios.js,gato.js}`.
- Medido con FFmpeg 9.0.2 sobre el máster final (los mismos umbrales que en la v1, `reviews/qa.md`).

| Comprobación | Medida | Umbral | Resultado |
|---|---|---|---|
| Resolución · fps · fotogramas | 1080×1920 · 60/1 · 3.498 | short 1080×1920 a 60 fps | OK |
| Duración | 58,300 s | ≤ 120 s | OK |
| Sonoridad integrada (`ebur128`) | -14,1 LUFS · LRA 3,2 LU | -14 ±1 | OK |
| Pico real (`ebur128`) | -2,4 dBTP | < -2 dBTP | OK |
| Silencios (`silencedetect` -35 dB, 0,3 s) | 0 | short sin pausas | OK |
| Congelados (`freezedetect` 2 s) | 0 | ninguno no intencionado | OK |
| Negros (`blackdetect` 0,1 s) | 0 | ninguno no intencionado | OK (en la v1 había uno intencionado) |
| Contrato de escena | `npm test` 4/4 · render sin violaciones | sin reloj ni animaciones | OK |
| Caja de diálogo | 165/165 finales de página en ≤ 2 líneas, sin desbordar (medido en Chromium) | el texto cabe en la caja | OK |
| Retrato del diálogo (iteración 02) | boca cerrada en 6/6 fotogramas sin pérdida mientras MISTA habla (3,00-3,25 s); solo cambia el parpadeo (3,05 s); el gato de la escena sí mueve la boca | sin mover la boca, con parpadeo | OK |
| Voz frente al guion aprobado | misma voz y alineación que la v1 (165/165 palabras) | lee el guion de la PUERTA 1 | OK |
| Fuentes | las de la v1 (`reviews/enlaces-puerta2.md`); el contenido no cambia | noticia reverificada | OK |
| Visual (crítico Opus, 2 pasadas) | 1.ª no pasa (1 bloqueante: «distroñas»); 2.ª **pasa**; sus 3 defectos menores, arreglados (`reviews/critica-v2-01.md`) | sin bloqueantes | OK |

## Audio
- Voz: Gemini «Orus», ritmo ágil (ADR 0006), 57,8 s. Es la misma pista que la v1.
- Música: «Morning Coffee» (Pixabay, m1) a -14 dB, con sidechain bajo la voz.
- Efectos: **16** eventos, solo en los momentos clave (iteración 02, «Solo lo clave»), colocados 1 fotograma después de la imagen:
  - 9 blips de selección en las palabras clave (m7, Freesound CC0, Greenhourglass);
  - 1 acierto en «comprado» (sustituye a su blip), 1 error en el «NO» de la revisión por pares y 1 tick al completarse cada contador (2);
  - 3 destellos.
  - Ningún par de efectos a menos de 0,3 s.
- Normalización: `loudnorm` dinámico en dos pasadas.

## Bloqueantes
Ninguno.

## Pendiente de Mario (no bloquea el QA)
- Transparencia en la descripción: ¿decir que el canal se produce con Claude, de Anthropic?
