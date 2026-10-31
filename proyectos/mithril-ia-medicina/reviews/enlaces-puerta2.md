# Enlaces · mithril-ia-medicina · 2026-10-30

Segunda verificación, antes de PUERTA 2. Fuentes: `fuentes.json` (f1 a f5) y `guion.md`. Las URL de x.com se consultan vía `api.fxtwitter.com`. Las comprobaciones son con WebFetch, que resume cada página con un modelo pequeño: las frases entre comillas son del resumen, no una copia literal verificada a mano. No se buscó nada fuera de las URL dadas, así que la ausencia de correcciones se refiere solo a esas páginas.

| id | URL | Estado | Nota |
|---|---|---|---|
| f1 | https://www.anthropic.com/research/early-progress-drug-development | OK | Carga. Publicada el 27-oct-2026 (sin fecha de última actualización). Confirma: compra de Mithril Medicine; Tranbarger usó Claude para contratos, logística y experimentos con 11 laboratorios externos; de la idea a resultados prometedores en ratones en menos de 18 meses; investigación en fase temprana y sobre todo preclínica; ensayos en humanos "as soon as late 2028", condicionado a que los candidatos sigan dando buenos resultados. Sin nota de corrección ni de actualización. |
| f2 | https://thenextweb.com/news/anthropic-mithril-acquisition-claude-drug-development | OK | Carga. Autora Ana Maria Constantin, publicada el 28-oct-2026. Confirma "The report has not been peer reviewed". Matiz: el artículo dice "It did not disclose the terms" y atribuye los términos de la compra a The Information, no a un comunicado de Anthropic. Sin nota de corrección. |
| f3 | https://medlineplus.gov/genetics/condition/lama2-related-muscular-dystrophy/ | OK | Carga. Última actualización 1-oct-2018. Confirma: hereditaria (patrón autosómico recesivo), debilita y atrofia los músculos, la forma temprana aparece al nacer o en los primeros meses. La página no dice que sea "la más grave" (ver Referencias del guion). |
| f4 | https://api.fxtwitter.com/Prof_Oak_/status/2115185849424048564 | PARCIAL | Carga (post del 27-oct-2026, 20:56 UTC, cuenta verificada, sin indicación de edición). Confirma que la cuenta es de Cody Tranbarger ("Professor Oak") y que el proyecto fue "a single operator + a bunch of Claude (+ a stellar bench of part-time consultants)". Pero el post limita la descripción a la forma "primordial" de Mithril ("virtual, decentralized, & ultra-lean"); la cita de fuentes.json la presenta como rasgo de toda la operación ("llevó Mithril como una operación pequeña y casi virtual"). El uso en guion ("no lo hizo del todo solo: consultores a tiempo parcial") sí se sostiene. |
| f5 | https://api.fxtwitter.com/ErickSky/status/2115439892540821925 | OK | Carga (post del 28-oct-2026, 13:45 UTC; cita un post de Prof_Oak_). Resume la compra de Mithril por Anthropic y el uso de Claude con 11 laboratorios externos; la cifra de 11 aparece en el propio post de Erick, no en el post citado. Fuente sin uso en el guion. |

## Recuento por estado
- OK: 4 (f1, f2, f3, f5)
- PARCIAL: 1 (f4)
- NO RESPALDA: 0
- CAÍDA: 0
- NO VERIFICABLE: 0

Total: 5 fuentes. No hay entradas de tipo «material»; no se comprobaron licencias.

## Referencias del guion
- Todas las referencias del guion apuntan a ids existentes en `fuentes.json`: [f1] (líneas 9, 11, 15, 17, 19, 23, 25), [f2] (línea 23), [f3] (línea 13), [f4] (línea 21). No hay [fN] sin fuente.
- Línea 13: "en su forma más grave, desde el nacimiento o los primeros meses de vida" cita [f3]. La página respalda que la forma temprana aparece al nacer o en los primeros meses, pero no dice que sea la más grave, y la cita de `fuentes.json` tampoco lo dice. Conviene quitar "en su forma más grave" o buscar una fuente que lo diga.
- fuentes sin usar: f5 (tipo «hecho», uso declarado "origen del tema (no se cita en pantalla)"). La regla del verificador exige que cada fuente de tipo «hecho» se use al menos una vez. Opciones: cambiar su tipo, o quitarla de `fuentes.json` si no entra en el guion.

## Para Mario (no modificado)
- Revisar la cita de f4 en `fuentes.json` (limitación a la forma primordial) y el "más grave" de la línea 13 del guion. No he tocado ni `fuentes.json` ni `guion.md`.
- Conviene una comprobación manual de f1 antes de PUERTA 2, porque las frases de f1 llegan por resumen y no por copia literal.
- Si se quiere reflejar esta consulta en `fuentes.json`, la fecha de consulta sería 2026-10-30.

## Nota del orquestador (2026-10-30)
- «En su forma más grave» (f3) sí está respaldado: MedlinePlus distingue la forma temprana, *severe, early-onset* (al nacer o en los primeros meses), de la tardía, más leve. El guion no cambia; se precisa la cita de f3.
- f4: se precisa la cita (forma inicial de Mithril). El uso en el guion («no lo hizo del todo solo») se sostiene.
- Las entradas m1-m6 (música y efectos) se añadieron después de esta verificación. Sus licencias se comprobaron en la página de cada una al descargarlas (Freesound: «Creative Commons 0»; Pixabay: «Pixabay Content License», sin mención a Content ID ni a IA).
