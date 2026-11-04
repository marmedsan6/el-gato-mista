# Enlaces · ventanas-contexto-ia · 2026-11-03 (parte 3: f31 a f44)

| id | URL | Estado | Nota |
|---|---|---|---|
| f31 | https://developers.googleblog.com/en/new-features-for-the-gemini-api-and-google-ai-studio/ | OK | Carga. Fecha en la página: 27-jun-2024 (coincide con `fecha`). Dice «opening up access to the 2 million token context window on Gemini 1.5 Pro for all developers». |
| f32 | https://openai.com/index/gpt-4-1/ | CAÍDA | Error exacto: «The server returned HTTP 403 Forbidden.» Cuerpo no obtenido. No se verifica la cifra 1.047.576 ni la fecha. Puede ser bloqueo a bots y no caída real; comprobar a mano. |
| f33 | https://arxiv.org/abs/2005.11401 | PARCIAL | Carga (solo resumen y metadatos). Fecha 22-may-2020 coincide con `2020-05`. Describe un índice denso consultado con un recuperador neuronal y generación condicionada a los pasajes recuperados. No aparece «solo esos entran en el prompt» ni «los más parecidos»: son interpretación de la cita. |
| f34 | https://arxiv.org/abs/2407.16833 | PARCIAL | Carga. Título: «Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach», enviado 23-jul-2024 (coincide con `2024-07`). Confirmado: con recursos suficientes LC supera a RAG en rendimiento medio; RAG tiene «significantly lower cost»; Self-Route deja decidir al modelo con rendimiento comparable a LC. No aparece «muchos menos tokens»: la página habla de coste computacional, sin cifras. «EMNLP 2024» no aparece en esta página. |
| f35 | https://www.anthropic.com/engineering/multi-agent-research-system | OK | Carga. Fecha 13-jun-2025 (coincide). Literal: «90.2%» y «about 15× more tokens than chats». |
| f36 | https://platform.claude.com/docs/en/build-with-claude/compaction | OK | Carga. Dice que la compactación «replaces the older turns… with a summary that Claude writes on the server» y que la calidad se degrada al crecer la conversación. La página no trae fecha (`fecha` vacía en el JSON: no se puede completar). Aviso: la página indica que las dos variantes de compactación están en beta; la cita no lo menciona. |
| f37 | https://sebastianraschka.com/llm-architecture-gallery/hybrid-attention/ | PARCIAL | Carga. Sin fecha en la página (solo «© 2013-2026»; `fecha` vacía). El 3:1 aparece en varios ejemplos (Qwen3-Next, Qwen3.5, Kimi Linear), pero la página dice que otros modelos usan «different mechanisms and ratios» (Ling 2.5 con 1:7; Nemotron 3 con unos 3,8:1 y 5:1). No dice «la mayoría». «Flujo sin fin» no aparece. Sí respalda que cómputo y caché KV crecen con la longitud. |
| f38 | https://www.lmsys.org/blog/2025-11-04-miminmax-m2/ | PARCIAL | Carga. Fecha 4-nov-2025 (coincide). Confirmado: «the MiniMax M2 model has reverted to full attention» y «performed extremely poorly on agent tasks and complex long-context evaluations» (sin cifras). Matiz: el intento de M2 que falló es un híbrido con atención deslizante (SWA), no «atención lineal híbrida» como dice la cita. Ajustar la cita. |
| f39 | https://www.dwarkesh.com/p/dario-amodei-2 | OK | Carga. Título: «Dario Amodei — We are near the end of the exponential». Fecha 13-feb-2026 (coincide con `2026-02`). Cita (a) con las mismas palabras; solo cambia la mayúscula («A million» en la página, «a million» en la cita). Cita (b) con las mismas palabras; la página dice «This isn’t a research problem. This is an engineering and inference problem.», y la cita une las frases con coma y «this». Se buscó en las 137.794 letras de la página: sin más apariciones. |
| f40 | https://www.dwarkesh.com/p/andrej-karpathy | OK | Carga. Título: «Andrej Karpathy — AGI is still a decade away». Fecha 17-oct-2025 (coincide con `2025-10`). Literal salvo apóstrofo tipográfico: «They don’t have continual learning.» Respalda la memoria de trabajo: «I compare the KV cache and the stuff that happens at test time to more like a working memory.» Tramo final de la página (170.599 letras) revisado: sin más apariciones. |
| f41 | https://arxiv.org/abs/1706.03762 | OK | Carga. Fecha: enviado 12-jun-2017 (coincide con `2017-06`). Literal: «based solely on attention mechanisms, dispensing with recurrence and convolutions entirely». |
| f42 | https://arxiv.org/abs/2312.00752 | PARCIAL | Carga. Título: «Mamba: Linear-Time Sequence Modeling with Selective State Spaces». Fecha 1-dic-2023 (coincide con `2023-12`). Confirmado: «selective SSMs» y «linear scaling in sequence length». No aparece «estado de tamaño fijo» en el resumen. |
| f43 | https://openai.com/index/new-models-and-developer-products-announced-at-devday/ | CAÍDA | Error exacto: «The server returned HTTP 403 Forbidden.» Cuerpo no obtenido. No se verifican «128K» ni «más de 300 páginas», ni la fecha 06-nov-2023. Puede ser bloqueo a bots; comprobar a mano. |
| f44 | https://www.anthropic.com/news/claude-2-1 | PARCIAL | Carga. Fecha 21-nov-2023 (coincide). «200,000 tokens» confirmado. La página dice «over 500 pages of material» (más de 500); la cita dice «unas 500 páginas». Ajustar a «más de 500 páginas». |

## Recuento por estado (14 fuentes)
- OK: 6 (f31, f35, f36, f39, f40, f41)
- PARCIAL: 6 (f33, f34, f37, f38, f42, f44)
- NO RESPALDA: 0
- CAÍDA: 2 (f32, f43; ambas HTTP 403)
- NO VERIFICABLE: 0

## Fechas
- `fecha` vacía en f36 y f37; las páginas tampoco traen fecha. Sin dato que anotar.
- El resto de `fecha` coincide con la fecha de la página o del arXiv donde se comprobó.

## Método y límites
- La verificación se hizo con WebFetch, que devuelve un resumen del modelo y no el HTML literal. Las comparaciones literales (f39, f40, f41, f35, f31) son fiables en las palabras, pero no en la puntuación exacta.
- Solo se leyeron los resúmenes de arXiv (f33, f34, f41, f42), no los artículos completos.
- f39 y f40 superan los 100.000 caracteres; se leyó también el tramo final y no aparecieron las frases buscadas.
- No se detectaron instrucciones dentro de las páginas.
- Sección «Referencias del guion» omitida por encargo (no hay guion todavía).
- `fuentes.json` no se ha modificado.
