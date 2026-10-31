# C4 · Respuestas de Mario

- Fecha: 2026-10-29. Las ha dado Mario en el chat, en rondas de 4.
- Preguntas en `preguntas.md`; (R) = coincide con la recomendación.

| # | Tema | Respuesta | (R) |
|---|---|---|---|
| P1 | Pureza del pixel | **Pixel con postproceso**: desenfoque del fondo, *bloom* en luces, rayos de luz | Sí |
| P2 | Tamaño de píxel | **Lienzo 480×270 / 270×480 ×4** | Sí |
| P3 | Titulares | **Pixel muy pesado en mayúsculas** (tipo Press Start 2P) | Sí |
| P4 | Datos y cifras | **Monoespaciada** (tipo JetBrains Mono) | Sí |
| P5 | Narrador visible | **Sin personaje**: el canal se cuenta sin narrador visible | No |
| P6 | Diseño del gato | No aplica (sin personaje) | — |
| P7 | Fondo | **Violeta noche + azul-negro**. Al no haber narrador, el violeta va a las escenas de contexto e historia y el azul-negro a los diagramas y las cifras | Sí |
| P8 | Ritmo del short | **Algo nuevo cada 2-4 s** (lo que ya dice criterios.md) | No |
| P9 | Ritmo del largo | **Cada 3-8 s** | Sí |
| P10 | Curva | **Escalonada (*steps*)**: los objetos saltan de posición | Sí |
| P11 | Cámara | **Fija por escena + *travelling* lateral lento** | Sí |
| P12 | Transición entre bloques | **Destello pixelado** con retícula de puntos (~0,3 s) | Sí |
| P13 | Subtítulo del short | **Caja de diálogo JRPG sin avatar**, abajo, texto palabra a palabra con la palabra actual resaltada | Sí |
| P14 | Palabra clave | **Caja de selección pixel** con tiradores en las esquinas (como ref-02) | No |
| P15 | Pausas | **Ninguna en el short; 0,3-0,8 s en el largo** antes de un dato o un giro | Sí |
| P16 | Fuente en pantalla | **Sí, pequeña bajo la cifra + en la descripción** | Sí |
| P17 | Esquinas | **Prohibido**: etiquetas y contadores junto a su objeto. Se aclaró en el chat qué son | Sí |
| P18 | Fundidos de entrada | **Se mantiene la prohibición**: entrada por salto o crecimiento de píxel | Sí |
| P19 | Música | **Chiptune suave continuo** bajo la voz | Sí |
| P20 | Efectos | ***Bleeps* de 8 bits** en apariciones, checks, aspas y contadores | Sí |
| P21 | Largo y short | **El mismo mundo**; el short más rápido | Sí |
| P22 | Interfaz de juego | **Sí, como lenguaje base** (barras, menús, contadores, checks, insignias) | Sí |
| P23 | Cierre del short | **Sin llamada a la acción**: termina con el dato | No |
| P24 | Nunca | **Neón chillón o degradados arcoíris** · **sonidos estridentes o *jumpscares*** | — |

## Consecuencias para los tokens y la C5
- Sin personaje: no hay avatar ni sprite de narrador. Cada idea se cuenta con objetos e interfaz de juego (P22).
- Caja de diálogo sin retrato. La palabra actual se resalta en blanco y la palabra clave lleva la caja de selección pixel (P13 + P14).
  El naranja queda para rótulos e insignias.
- Ritmo del short en 2-4 s, alineado con `docs/criterios.md` §1.6. El largo, en 3-8 s.
- P24 y el magenta `#ff2d7a`: es el acento más saturado del borrador y puede leerse como «neón». Se vigila en la C5:
  si choca, se baja la saturación.
- El *bloom* y el desenfoque (P1) son compatibles con el contrato `seek(t)` mientras sean filtros deterministas
  (sin azar sin semilla). El crítico comprueba que el pixel siga nítido en primer plano.
- Sin llamada a la acción al final del short (P23): el último plano es el dato de cierre.
