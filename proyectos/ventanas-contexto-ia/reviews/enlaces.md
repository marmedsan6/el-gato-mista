# Enlaces · ventanas-contexto-ia · 2026-11-03

Verificación en tres tandas con `verificador-enlaces`: `enlaces-parte-1.md` (f1-f15), `enlaces-parte-2.md` (f16-f30) y `enlaces-parte-3.md` (f31-f44). Lo que no pasó se corrigió así:

| id | Problema en la tanda | Arreglo |
|---|---|---|
| f4 | OpenAI Help: 403 | Fuera. El tamaño del token se explica con f5 (555.000 palabras por millón, cálculo propio) |
| f10 | PARCIAL: no todos los modelos están en cada experimento | Comprobado a mano: «performance consistently degrades across all models». Guion: «todos rindieron peor» |
| f11 | PARCIAL: «below 50%» | Guion: «menos de la mitad que con textos cortos» |
| f13 | PARCIAL: el 56,1 % no está en el resumen | El guion solo usa la curva en U, que sí está |
| f15 | Columna dudosa | Comprobado a mano: columna 1 = Gemini 3.1 Pro Thinking (High): 84,9 % a 128K y 26,3 % a 1M |
| f16 | PARCIAL: no pone «128 por cabeza» | 16.384 / 128 cabezas = 128 (cálculo propio, anotado) |
| f17 | Falta la excepción de Haiku 5.5 | Añadida a la cita; el guion no la contradice |
| f18 | — | Fuera (no se usa) |
| f20 | La frase de las 8 novelas está en llms-full.txt | URL cambiada a https://aistudio.google.com/llms-full.txt |
| f21 | «Grok 4.3 tenía 1M» no está en la página | Nueva fuente f45 (docs.x.ai, Grok 4.3: «1,000,000 tokens»), comprobada a mano |
| f26 | PDF ilegible y blog con 403 | URL cambiada a la documentación de Hugging Face: `n_positions` = 512 en la configuración de GPT-1, comprobada a mano |
| f28 | openai.com: 403 | URL cambiada a developers.openai.com/api/docs/models/gpt-4: «8,192 context window», instantánea gpt-4-0314 (comprobada a mano) |
| f32 | openai.com: 403 | URL cambiada a developers.openai.com/api/docs/models/gpt-4.1: «1,047,576 context window», gpt-4.1-2025-04-14 (comprobada a mano) |
| f33, f34, f37, f38, f42, f44 | PARCIAL por matices | Citas reescritas a lo que dice la página; el guion se ajustó (RAG sin «si se equivoca», «varias» mezclas 3:1, MiniMax sin «lineal», Mamba con «coste lineal») |
| f43 | openai.com: 403 | Fuera: GPT-4 Turbo se quita del guion |
| f39, f40 | — | Comprobado a mano cómo se presentan: Amodei «running a 2,500 person company», Karpathy «the early OpenAI that I was a part of» |
| f6 | — | Comprobado a mano: autocompactación «summarizes conversation history when approaching context limits» |

## Referencias del guion
- [fN] sin fuente: ninguna
- fuentes sin usar: ninguna
