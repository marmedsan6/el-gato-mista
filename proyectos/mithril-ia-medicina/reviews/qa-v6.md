# QA · mithril-ia-medicina · short v6 (estilo v3) · 2026-11-03

- Máster: `proyectos/mithril-ia-medicina/salida/short-v6.mp4`, SHA-256 `da30c0773b1f226d6d45d90bee2c1a0bfffe37fe6ee7997693413419438de367`.
- Escena: `escenas/short-v6/`; biblioteca: `motor/estilo/v3/` + `motor/estilo/{estilo.css, pixel.js, camara.js}`.

| Comprobación | Medida | Resultado |
|---|---|---|
| Resolución · fps · fotogramas | 1080×1920 · 60/1 · 3.498 · 58,300 s | OK |
| Sonoridad · pico real | -14,1 LUFS (LRA 3,0) · -2,4 dBTP | OK |
| Silencios (-35 dB, 0,3 s) · congelados (2 s) · negros | 0 · 0 · 0 | OK |
| Contrato de escena | `npm test` 4/4 · render sin violaciones | OK |
| Caja de diálogo | 165/165 páginas en ≤ 2 líneas (medido en Chromium) | OK |
| Efectos | 13 a -18 dB, atados a la pantalla | OK |
| Voz y fuentes | las del guion aprobado (PUERTA 1) y `reviews/enlaces-puerta2.md` | OK |
| Visual (crítico Opus) | 1.ª pasada: no pasa (2 bloqueantes: jaula al borde y rótulo pegado al cuadro durante el acercamiento); todo corregido y comprobado en 11 fotogramas y en la hoja del máster final (`reviews/critica-v6-01.md`) | OK |
| Biblioteca común | la v5 sale idéntica tras los cambios de `camara.js` (14/14 fotogramas) | OK |

## Bloqueantes
Ninguno.
