# Verificación · ventanas-contexto-ia

- Nivel: N2 (ver docs/editorial.md §3)
- Fecha de la última revisión: 2026-11-03

| # | Hecho (tal como sale en el guion) | Fuentes (id) | Primaria | Estado | Matiz que hay que decir |
|---|---|---|---|---|---|
| 1 | La ventana es lo que el modelo tiene delante; incluye instrucciones ocultas, herramientas, archivos y su propia respuesta | f1 | Sí | verificado | |
| 2 | Hasta 600 páginas de PDF por petición | f1 | Sí | verificado | Son 600 «imágenes o páginas» en total, en los modelos de 1M |
| 3 | Con varios datos repartidos, la precisión baja | f2 | Sí | verificado | Con un solo dato suele acertar: el gancho dice «puede que uno te lo cambie» |
| 4 | 1M de tokens ≈ 555.000 palabras (Anthropic, tokenizador nuevo) → algo más de media palabra por token | f5 | Sí | verificado + cálculo | En inglés; depende del tokenizador |
| 5 | Según el idioma, el mismo texto puede gastar hasta 15 veces más tokens; el inglés sale más barato | f9 | Sí | verificado | El guion no da una cifra para el español (las fuentes no coinciden) |
| 6 | 1M ≈ 8 novelas | f20 | Sí | verificado | |
| 7 | La IA relee la conversación entera en cada mensaje | f6, f3 | Sí | verificado | |
| 8 | Cada token se relaciona con todos (n²) | f7 | Sí | verificado | Los saludos (45; 499.500; ~5·10¹¹) son cálculo propio con n(n-1)/2 |
| 9 | Truncado de lo más antiguo, resumen automático en Claude y en Claude Code | f1, f8, f6 | Sí | verificado | |
| 10 | Perdido en el medio (2023) | f13 | Sí | verificado | Histórico: hoy ha bajado (f10) |
| 11 | Consejo de chat nuevo al cambiar de tema | f3 | Sí | verificado | |
| 12 | Meta: el cálculo de la atención crece de forma cuadrática | f16 | Sí | verificado | |
| 13 | Más de 500 GB de caché para 1M de tokens con Llama 3.1 405B | f16, f37 | Sí | cálculo propio | 2 × 126 capas × 8 cabezas KV × 128 × 2 bytes (FP16) = 516.096 B/token → ~516 GB por 10⁶ tokens |
| 14 | Llama 3: preentreno a 8K y ampliación a 128K con ~5 % del total | f16 | Sí | verificado + cálculo | 800.000 M / 15,6 billones = 5,1 % |
| 15 | 900K cuesta 100 veces lo que 9K a precio por token plano | f17 | Sí | cálculo propio | Salvo Haiku 5.5, que cobra ×5 por encima de 100K |
| 16 | Cronología: GPT-1 512, GPT-3 2.048, GPT-4 8K, Claude 100K, Claude 2.1 200K, Gemini 1.5 1M y 2M, GPT-4.1 1M | f26-f32, f44 | Sí | verificado | De 512 a 1M ≈ 2.000 veces (cálculo) |
| 17 | Epoch: 30× al año desde 2023; 250× en nueve meses en longitud útil | f24, f25 | Sí | verificado | Estimación de Epoch, contrastada con la meseta |
| 18 | Noviembre de 2026: ~1M en Anthropic, OpenAI (1,05M), Google y DeepSeek; Grok 4.7 500K (Grok 4.3 1M); Llama 4 Scout 10M; Gemini gratis 32K | f5, f19, f20, f22, f21, f45, f23, f3 | Sí | verificado | Llama 4 Scout: afirmación de Meta |
| 19 | Chroma (18 modelos), RULER, NoLiMa (11 de 13 a 32K) | f10, f12, f11 | Sí | verificado | |
| 20 | Gemini 3.1 Pro 84,9 % a 128K y 26,3 % a 1M; Opus 4.6 76 % frente al 18,5 % de Sonnet 4.5 | f15, f14 | Sí (del fabricante) | verificado como afirmación | Cifras de las propias empresas: el guion lo dice |
| 21 | RAG, compactación, subagentes (90,2 %, ~15× tokens) | f33, f34, f36, f6, f7, f35 | Sí | verificado | Evaluación interna de Anthropic |
| 22 | DeepSeek V4 con atención dispersa; híbridos 3:1 (Qwen); Mamba lineal; MiniMax vuelve a la atención completa | f22, f37, f42, f38 | Sí | verificado | |
| 23 | Opiniones de Amodei y Karpathy | f39, f40 | Sí | verificado (cita literal) | Marcadas como opinión |
