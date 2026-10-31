# Enlaces · phonic-1-voz · 2026-10-31

Nota del orquestador, tras leer este informe:
- **f3:** comprobado en el navegador el 2026-10-31: 84 filas, suma 123 = 114 + 8 + 1, 114 a `api.example.com`, `RT-4842` confirmada solo en 16:04 y sin herramientas de cancelación. Las notas de «Tara» y de las latencias, en `reviews/analisis-demo.md`.
- **f19:** WebFetch recibe la página vacía; el mismo día se leyeron en el navegador los art. 50.1 y 113 en EUR-Lex.
- **f6, f7, f10, f11, f15, f16:** leídos en el navegador el mismo día.

Alcance: solo entradas de `fuentes.json` con `tipo: hecho` (19). Los `material` (m1 a m8) no se comprueban aquí.
Consulta: `WebFetch` de cada URL. No se ha tocado `fuentes.json` ni `guion.md`.

| id | URL | Estado | Nota |
|---|---|---|---|
| f1 | https://phonic.ai/blog/phonic-1 | PARCIAL | Carga. Confirma: cascada de tres modelos; Phonic-1 como único que actúa mientras se habla; 61,5 % a 32 % y 57 % a 32 %; Ashby con entrevistas en 25 países; sectores; seis continentes. Desajuste: la cita pone el conserje del hotel en la «demo de viaje», pero la página lo sitúa en la llamada de 44 minutos. Los 1,1 s frente a 15,7 s aparecen solo en el texto alternativo de una imagen. «Evita la transcripción» es inferencia, no dicho literalmente. Corregir la cita. |
| f2 | https://phonic.ai/ | OK | Dice que es «the only speech-to-speech model that can call tools and take action while the caller is speaking» y que usa «frontier models as supervisor agents» sin nombrarlos. |
| f3 | https://phonic.ai/demo | PARCIAL | Carga. Visible: «Duration 44:18», transcripción con marcas de tiempo y latencia por turno en ms (p. ej. 2651 ms en 16:15, 781 ms en 18:07). No visible: la sección Tools solo muestra «Loading». RT-4842 y api.example.com no aparecen en el texto visible, que llega hasta 23:17 y se trunca en 23:24. «Tara» no aparece; sí «Sarah Quinn and Ava Walsh» (07:51). La alergia a frutos secos aparece en 06:27. En 16:15 la asistente dice que no hay mesa a las 20:30 y ofrece 19:45 o 21:30; no hay confirmación visible en la transcripción. Pendiente de tu comprobación: panel de herramientas (RT-4842, 123 llamadas, api.example.com, 114 y 11). |
| f4 | https://docs.phonic.ai/docs/build/tools/tools_overview | OK | Confirmado: «Phonic normally executes tools as soon as possible to cut latency»; «Require speech before tool call»; «If the user speaks while the tool is executing, the tool call is interrupted». No describe confirmación previa ni corrección, como dice la cita. |
| f6 | https://x.com/moinnadeem/status/2115830871014183088 | NO COMPROBABLE AQUÍ | x.com no se abre con WebFetch. |
| f7 | https://x.com/moinnadeem/status/2115830873841184907 | NO COMPROBABLE AQUÍ | x.com no se abre con WebFetch. |
| f8 | https://artificialanalysis.ai/speech-to-speech | OK | Confirmado: índice 87,1 (Phonic 1 High) frente a 86,9 (Grok Voice 3.0); τ-Voice 79,9 % frente a 74,5 % (GPT-Live-1 Astra); primer audio 0,61 s; Elo 1012 con 6 modelos por encima. Ver nota de f9. |
| f9 | https://alphasignal.ai/news/mit-founded-phonic-beats-grok-and-gpt-with-fastest-voice-ai-response | OK | Confirmado: «it debuts eighth of 30 models on preference Elo with a score of 1012». Discrepancia menor con f8 (7.º de 25 en su tabla frente a 8.º de 30). El guion («fuera de los cinco primeros») vale con ambas. |
| f10 | https://x.com/Jiler830219/status/2115865718818234838 | NO COMPROBABLE AQUÍ | x.com no se abre con WebFetch. |
| f11 | https://x.com/ErickSky/status/2115850611258208548 | NO COMPROBABLE AQUÍ | x.com no se abre con WebFetch. |
| f12 | https://developers.openai.com/api/docs/guides/voice-agents | OK | Confirmado: «Your application manages three stages» para la cadena; «Use the chained path when you want to inspect or transform text»; «run policy checks before the text agent responds». |
| f14 | https://www.boe.es/buscar/act.php?id=BOE-A-2025-26698 | OK | Es la Ley 10/2025, de 26 de diciembre (atención a la clientela). Art. 2: servicios básicos sin umbral; resto por umbrales (250 personas, 50 M€ de volumen de negocios o 43 M€ de balance). Art. 8, apartado 2: pedir atención personalizada «en cualquier momento de la interacción, desde su inicio». Disposición transitoria única: doce meses desde la entrada en vigor (28/12/2025 según la página; el 28/12/2026 es cálculo mío). La página se leyó hasta el carácter 100.000 de 150.517; los artículos citados están dentro. |
| f15 | https://x.com/moinnadeem/status/2115830879474036943 | NO COMPROBABLE AQUÍ | x.com no se abre con WebFetch. |
| f16 | https://x.com/btrenchard/status/2115832143960289653 | NO COMPROBABLE AQUÍ | x.com no se abre con WebFetch. |
| f17 | https://www.iana.org/help/example-domains | OK | Confirmado: «A number of domains such as example.com and example.org are maintained for documentation purposes». |
| f18 | https://www.nanpa.com/numbering/555-line-numbers | OK | Confirmado: «The fictitious, non-working numbers, 555-0100 through 555-0199, will remain reserved for entertainment/advertising». |
| f19 | https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689 | CAÍDA | Sin contenido. WebFetch devuelve la página vacía (solo dos separadores «---»), sin código HTTP. La variante ELI (https://eur-lex.europa.eu/eli/reg/2024/1689/oj/spa) también devuelve vacío. No se han podido verificar el art. 50.1 ni el art. 113. Comprobación manual necesaria. El guion (línea 143) cita f19 y f20 juntas. |
| f20 | https://www.economistjurist.es/zbloque-1/reglamento-europeo-de-ia-tras-el-omnibus-que-obligaciones-y-sanciones-ya-son-exigibles-en-agosto-de-2026/ | OK | Confirmado: «Los apartados 1, 3, 4 y 5 ya resultan aplicables desde el 2 de agosto»; la transición solo afecta al marcado del apartado 2. Matiz: el apartado 1 incluye «agentes de voz» «según el caso». Artículo de 10/08/2026. Es fuente secundaria: no sustituye a f19. |
| f21 | https://soniox.com/wiki/speech-to-speech-models-vs-pipelines | OK | Confirmado: «by the time the model sees text, the user's tone, hesitation, and emotion are gone»; «It is controllable»; «Every stage produces inspectable text». |

## Recuento por estado (19 hechos)
- OK: 10 (f2, f4, f8, f9, f12, f14, f17, f18, f20, f21)
- PARCIAL: 2 (f1, f3)
- CAÍDA: 1 (f19)
- NO COMPROBABLE AQUÍ: 6 (f6, f7, f10, f11, f15, f16; todas x.com)
- NO RESPALDA: 0

## Referencias del guion
- [fN] sin fuente: ninguna. Todas las referencias [fN] del guion (maestro y short) apuntan a un `id` existente en `fuentes.json`. Los ids f5 y f13 no existen y no se usan.
- fuentes sin usar: ninguna. Las 19 fuentes de tipo `hecho` aparecen al menos una vez en el guion.
- Afirmaciones del guion atribuidas a f3 que no se pueden comprobar aquí (requieren el panel de herramientas o el registro completo): 0,58 s como respuesta típica (línea 77); 38 a 64 s por restaurante (79); «más de veinticinco minutos» (69); 123 llamadas, 8 de no hablar y 1 de colgar, 114 restantes (86); api.example.com (88); unas 11 de 114 actuando mientras se habla (100); RT-4842 y «confirmada» (107); «Tara» (125); ausencia de cancelación (117). Solo he visto el texto visible, hasta 23:17.
- Orden de la reserva (líneas 105 a 109): la transcripción visible muestra que la asistente rechaza las 20:30 en 16:15, tras la propuesta de la clienta en 16:04. No veo la confirmación previa ni el código en el texto visible. El orden «confirmada y once segundos después no hay sitio» depende del panel de herramientas.
