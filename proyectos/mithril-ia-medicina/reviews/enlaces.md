# Enlaces · mithril-ia-medicina · 2026-10-29

| id | URL | Estado | Nota |
|---|---|---|---|
| f1 | https://www.anthropic.com/research/early-progress-drug-development | OK | Carga; artículo de Anthropic fechado el 2026-10-27, coincide con `fecha`. Respalda la compra, la empresa de una persona, los 11 laboratorios, los menos de 18 meses hasta resultados en ratones, la fase temprana y preclínica. El dato de 2028 es una expectativa condicionada a que los candidatos sigan funcionando, no un calendario fijo. La cita "como pronto" es fiel; el guion debe mantener su "si todo va bien". |
| f2 | https://thenextweb.com/news/anthropic-mithril-acquisition-claude-drug-development | PARCIAL | Carga; autora Ana Maria Constantin, 2026-10-28, coincide con `fecha`. Confirma que el informe técnico no ha pasado revisión por pares. Sobre el precio solo dice que Anthropic no reveló los términos de la compra (según The Information); no menciona el precio de forma explícita. Ajustar la cita a "términos" o rebajar la afirmación. |
| f3 | https://medlineplus.gov/genetics/condition/lama2-related-muscular-dystrophy/ | OK | Carga. Confirma que es hereditaria (autosómica recesiva), que causa debilidad y atrofia muscular, y que la forma temprana aparece al nacer o en los primeros meses. Dos avisos: `fecha` está vacía en fuentes.json y la página indica última actualización el 2018-10-01; y la línea 13 del guion atribuye el inicio al nacimiento a toda la enfermedad, cuando la fuente solo lo dice de la forma temprana. |
| f4 | https://x.com/Prof_Oak_/status/2115185849424048564 | OK | x.com devolvió HTTP 402 Payment Required. Verificado con https://api.fxtwitter.com/Prof_Oak_/status/2115185849424048564 (created_at 2026-10-27, coincide con `fecha`). El tuit confirma que el autor es Cody Tranbarger y que trabajó con un único operador, Claude y consultores a tiempo parcial. Matiz: la descripción "casi virtual" se refiere a la etapa inicial, no a toda la operación. Verificación hecha sobre el resumen del JSON, no sobre el texto íntegro. |
| f5 | https://x.com/ErickSky/status/2115439892540821925 | OK | x.com devolvió HTTP 402 Payment Required. Verificado con https://api.fxtwitter.com/ErickSky/status/2115439892540821925 (created_at 2026-10-28, coincide con `fecha`). El tuit afirma la compra por Anthropic y que Claude coordinaba experimentos. La cifra de 11 laboratorios aparece solo en el tuit propio, no en el post que cita; f1 sí la confirma. Sin uso en pantalla. |

## Referencias del guion
- [fN] sin fuente: ninguna. Todas las etiquetas del guion (f1, f2, f3, f4) existen en fuentes.json, y todas las frases con hecho llevan su etiqueta.
- fuentes sin usar: f5 (tipo `hecho`, pero su `uso` indica que no se cita en pantalla). Según el criterio de que cada fuente de tipo `hecho` se use al menos una vez, conviene revisar su tipo.

## Recuento por estado
- OK: 4 (f1, f3, f4, f5)
- PARCIAL: 1 (f2)
- NO RESPALDA: 0
- CAÍDA: 0
- NO VERIFICABLE: 0
