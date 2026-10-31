# QA · mithril-ia-medicina · short v3 · 2026-10-31

- Máster: `proyectos/mithril-ia-medicina/salida/short-v3.mp4`, SHA-256 `43213645b7b36178020eb99be9152fb6500ff2dd1ff78d9b09a88ccb792b1040`.
- Cambios respecto a la v2: los de `reviews/iter-03.md`.
  - Desplazamiento lateral en lugar del destello blanco.
  - 14 efectos atados a la pantalla, a -18 dB.
  - Fondos con movimiento.
- Escena: `escenas/short-v2/short.{html,js}` + `motor/estilo/{estilo.css,pixel.js,props.js,escenarios.js,gato.js}`.
- Medido con FFmpeg 9.0.2 sobre el máster final, con los mismos umbrales que la v1 y la v2.

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
| Transiciones | 3 desplazamientos de 0,4 s a mitad de camino exacta (19,95 · 34,92 · 50,50 s); costura limpia con `clipPath` | sin blanco, huecos ni elementos que se queden atrás | OK |
| Efectos | 14 a -18 dB (`short-v3.mp4.mezcla.json`: `sfx_db -18`, 14/14 colocados) | atados a la pantalla, más bajos que en la v2 | OK |
| Voz frente al guion aprobado | misma voz y alineación que la v1 (165/165 palabras) | lee el guion de la PUERTA 1 | OK |
| Fuentes | las de la v1 (`reviews/enlaces-puerta2.md`); el contenido no cambia | noticia reverificada | OK |
| Visual (crítico Opus) | **pasa**; sus 3 defectos no bloqueantes, arreglados y comprobados (`reviews/critica-v3-01.md`) | sin bloqueantes | OK |

## Audio
- Voz: Gemini «Orus», ritmo ágil (ADR 0006). Es la misma pista que en la v1 y la v2.
- Música: «Morning Coffee» (Pixabay, m1) a -14 dB, con sidechain bajo la voz.
- Efectos: 14, colocados 1 fotograma después de la imagen. Cada uno suena cuando algo aparece o reacciona en pantalla:
  - 3 desplazamientos entre bloques;
  - 2 apariciones: la primera tarjeta y el ratón;
  - 3 ticks: el undécimo matraz, el undécimo nodo y la flecha que llega a 2028;
  - 4 marcas: el matraz, el microscopio, las cajas y la jaula;
  - 1 acierto: «ADQUIRIDA»;
  - 1 error: la lupa que llega al «NO».

## Bloqueantes
Ninguno.

## Pendiente de Mario (no bloquea el QA)
- Transparencia en la descripción: ¿decir que el canal se produce con Claude, de Anthropic?
