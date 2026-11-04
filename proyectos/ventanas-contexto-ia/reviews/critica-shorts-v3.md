# Crítica · shorts v3 de ventanas-contexto-ia · 2026-11-03

Crítico: `critico-visual` (Opus), tercera pasada. Medidas técnicas en verde. El crítico solo lee; guarda el texto el orquestador.

| Short | Bloqueantes de la v2 | Bloqueantes de la v3 | Veredicto |
|---|---|---|---|
| A | No tenía | Ninguno | **pasa** |
| B | Resueltos («100 %» entero y cifras de Gemini y Opus en JetBrains) | Ninguno | **pasa** |
| C | Resueltos (fuente sobre la caja y «516 GB» unos 3,3 s) | **«8K» se lee «SK» (≈ 46 s)** | **no pasa** |

Lo que no bloquea:
- **A:**
  - «Su respuesta» roza la franja tapada.
  - El marco de selección roza el candado y el clip.
  - El remate se queda quieto unos 9 s.
- **B:**
  - La fuente de Anthropic tapa las orejas de MISTA.
  - Las cifras de Chroma y NoLiMa siguen en Press Start.
  - La columna de Gemini va pegada al rótulo.
- **C:**
  - La fuente del detalle entra en la franja tapada.
  - «×2 → ×4» tapa una ficha.
  - La fuente de la chuleta la corta.

Patrón: pasar a JetBrains todas las cifras de las etiquetas de los shorts.

## Arreglos para la v4
- **Cifras:**
  - Opción `cifrasMono` en `escenaV3`, activa en los tres shorts: todas las cifras de etiquetas, insignias, tarjetas y fuentes van en JetBrains Mono.
  - Comprobado: «8K» y «128K» se leen.
- **A:** etiquetas 2 unidades a la izquierda.
- **B:** fuente de Anthropic 8 px más arriba.
- **C:**
  - Fuente del detalle a x = 60.
  - Fuente de la chuleta en dos líneas.
