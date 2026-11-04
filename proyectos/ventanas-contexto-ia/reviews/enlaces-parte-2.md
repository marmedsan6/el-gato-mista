# Enlaces · ventanas-contexto-ia · 2026-11-03

Parte 2: fuentes f16 a f30. Sección «Referencias del guion» omitida por encargo (aún no hay guion). `fuentes.json` no modificado.

| id | URL | Estado | Nota |
|---|---|---|---|
| f16 | https://arxiv.org/abs/2407.21783 | PARCIAL | El resumen no trae las cifras; se verificó con la versión HTML (arxiv.org/html/2407.21783, v3). Aparecen: cómputo de self-attention que crece cuadráticamente (sec. 3.4.2); 15.6T tokens a contexto de 8K (sec. 2); seis etapas y ~800B tokens (sec. 3.4.2); 126 capas y 8 KV heads (Tabla 3). No aparece «dimensión 128 por cabeza»: el texto da 128 cabezas de atención y dimensión de representación 16.384 (128 = 16.384 / 128, cálculo mío). El texto dice «Llama 3 405B», que el artículo usa para referirse a 3.1. El PDF llegó como binario y no se pudo leer. Fecha 2024-07 coherente con la página (envío 31-jul-2024; v3 23-nov-2024). |
| f17 | https://platform.claude.com/docs/en/about-claude/pricing | PARCIAL | Cifras y frases presentes: «A 900k-token request is billed at the same per-token rate as a 9k-token request»; Haiku 5.5 pasa de $0,10 a $0,50 por MTok por encima de 100.000 tokens (x5). Falta una excepción: la página dice «Claude 4.6 and later models (except Claude Haiku 5.5)» para el millón a tarifa estándar, y la cita lo presenta sin ese «excepto Haiku 5.5». Hay que acotar la frase. Sin fecha de publicación en la página. |
| f18 | https://developers.openai.com/api/docs/pricing | OK | Página carga. «Short context: ≤272K input tokens. Long context: >272K input tokens»; la entrada se duplica por encima de 272K (p. ej. gpt-5.5: $5 a $10). Sin fecha de publicación; la más reciente citada es 30-jul-2026. |
| f19 | https://developers.openai.com/api/docs/models | OK | Las cuatro fichas (GPT-6 Astra, GPT-6.1 Sol, GPT-6.1 Terra, GPT-6 Luna) dan «1.05M» de contexto y «128K tokens» de salida. Sin fecha de publicación; solo hay fechas de corte de conocimiento (30-abr a 1-jun-2026). |
| f20 | https://aistudio.google.com/docs/models | OK | docs/models no trae la frase de las 8 novelas ni 1M para Gemini 3.8 Flash. Según lo pedido, se consultó https://aistudio.google.com/llms-full.txt: «1M+ token context window (~50,000 lines of code or 8 novels)» (en inglés; la cita en español es paráfrasis válida), Gemini 4 Argon «Context 1M tokens» y Gemini 3.8 Flash «Context 1M tokens». Conviene que la cita apunte a llms-full.txt. Sin fecha de publicación (solo «as of June 2026»). Se leyeron los primeros 100.000 caracteres de unos 6,3 M. |
| f21 | https://docs.x.ai/developers/grok-4-7 | PARCIAL | Grok 4.7: «Context window | 500,000 tokens» en «At a glance», cifra correcta. «Grok 4.3 tenía 1M» no aparece: la página solo habla de Grok 4.7 y 4.7 Fast. Esa parte necesita otra fuente (p. ej. la ficha de Grok 4.3). La página no trae fecha de publicación (solo «Knowledge cutoff May 2026»); la fecha 2026-09-21 de fuentes.json no está confirmada. |
| f22 | https://arxiv.org/abs/2606.19348 | OK | Resumen: «a context length of one million tokens» con «Compressed Sparse Attention (CSA)»; «27% of single-token inference FLOPs and 10% of KV cache» frente a DeepSeek-V3.2. Solo se leyó el resumen, no el PDF. Discrepancia de fecha: la página indica «Submitted on 26 Apr 2026» (v1), pero el identificador 2606 corresponde a junio y fuentes.json pone 2026-06. No lo resuelvo; revisar a mano. |
| f23 | https://ai.meta.com/blog/llama-4-multimodal-intelligence/ | OK | Scout «the first open-weight natively multimodal models with unprecedented context length support»; «industry-leading context window of 10M» y «10 million tokens». Fecha 2025-04-05 confirmada. El texto también dice que Scout se preentrenó con 256K; no contradice la cita. |
| f24 | https://epoch.ai/trends | OK | «LLM context windows have grown by 30× per year since 2023»; intervalo del 90 %: «10× to 50×». Fecha de la página: «Updated Feb. 5, 2026». fuentes.json tiene fecha vacía: anotar 2026-02-05 (actualización del panel). |
| f25 | https://epoch.ai/data-insights/context-windows | OK | «the input length where top models reach 80% accuracy has risen by over 250x in the past 9 months». Coincide con la cita (más de 250 veces, nueve meses). Fecha de la página: «Jun. 25, 2025»; fuentes.json vacía: anotar 2025-06-25. |
| f26 | https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf | NO VERIFICABLE | El PDF carga, pero WebFetch lo recibe como binario comprimido (FlateDecode) sin texto extraíble. No aparece «512» ni variante. No es muro de pago. Intento alternativo https://openai.com/index/language-unsupervised/: «The server returned HTTP 403 Forbidden.» Hay que comprobar «512 tokens» a mano en el PDF o pegar el texto. Fecha no legible. |
| f27 | https://arxiv.org/abs/2005.14165 | OK | El resumen no trae 2.048. Versión HTML de arXiv (v4, 22-jul-2020): «All models use a context window of n_ctx=2048 tokens» (sec. 2.1). Few-shot sin pesos: «GPT-3 is applied without any gradient updates or fine-tuning» (resumen) y «but no weight updates are allowed» (sec. 2). La cifra aparece como «2048» (sin separador de miles). Fecha de envío de v1 en la ficha: 28-may-2020, coincide con fuentes.json. |
| f28 | https://openai.com/index/gpt-4-research/ | CAÍDA | Error exacto: «The server returned HTTP 403 Forbidden. The response body was not retrieved. If this URL requires authentication, use an authenticated tool (e.g. gh for GitHub, or an MCP-provided fetch tool) instead of WebFetch.» No se pudo comprobar 8.192, 32.768 ni la fecha 2023-03-14. No sé si es un bloqueo al cliente automático o una página retirada. |
| f29 | https://www.anthropic.com/news/100k-context-windows | OK | «We've expanded Claude's context window from 9K to 100K tokens, corresponding to around 75,000 words!»; demostración con The Great Gatsby (72K tokens). Fecha 2023-05-11 confirmada. |
| f30 | https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/ | OK | «Gemini 1.5 Pro comes with a standard 128,000 token context window»; 1M para «a limited group of developers and enterprise customers»; «up to 10 million tokens» en investigación. Fecha 2024-02-15 confirmada. |

## Recuento por estado (f16 a f30, 15 fuentes)
- OK: 10 (f18, f19, f20, f22, f23, f24, f25, f27, f29, f30)
- PARCIAL: 3 (f16, f17, f21)
- NO RESPALDA: 0
- CAÍDA: 1 (f28)
- NO VERIFICABLE: 1 (f26)

## Avisos para la revisión
- Fechas que fuentes.json deja vacías y la página sí trae: f24 (2026-02-05, actualización), f25 (2025-06-25).
- Fechas de fuentes.json que la página no confirma: f21 (2026-09-21), f22 (2026-06, la página dice 26-abr-2026).
- Sin fecha de publicación en la página: f17, f18, f19, f20, f21.
- No se detectaron instrucciones dentro de las páginas. No se envió ningún dato a formularios.
