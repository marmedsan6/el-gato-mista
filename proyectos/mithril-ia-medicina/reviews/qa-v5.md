# QA · mithril-ia-medicina · short v5 (cámara solo en lo core, interna) · 2026-11-03

- Máster: `proyectos/mithril-ia-medicina/salida/short-v5.mp4`, SHA-256 `43ae7f6038cfd51e27de651785a5c08d990b164abfa34d51d932c968ab126092`.
- Cambios respecto a la v4: los de `reviews/iter-05.md` (3 planos de detalle core, 6 cambios de plano y 13 efectos).

| Comprobación | Medida | Resultado |
|---|---|---|
| Resolución · fps · fotogramas | 1080×1920 · 60/1 · 3.498 · 58,300 s | OK |
| Sonoridad · pico real | -14,1 LUFS (LRA 3,0) · -2,4 dBTP | OK |
| Silencios (-35 dB, 0,3 s) · congelados (2 s) · negros | 0 · 0 · 0 | OK |
| Contrato de escena | `npm test` 4/4 · render sin violaciones | OK |
| Caja de diálogo | 165/165 páginas en ≤ 2 líneas | OK |
| Efectos | 13 a -18 dB, todos de objetos visibles | OK |
| Visual | Los 3 planos core son los de la v4 (crítico Opus: pasa, `critica-v4-01.md`), comprobados en fotogramas a 3,0 · 9,0 · 24,5 s. El resto, plano general, como la v3 | OK (sin nueva pasada del crítico: no hay planos nuevos) |

## Bloqueantes
Ninguno.
