# C3 · Puntos comunes de las 3 referencias

- Fecha: 2026-10-29 · Opus a esfuerzo alto.
- Base: `analisis/ref-0{1,2,3}.md` (C2), `analisis/ref-0{1,2,3}.json` (C1) y `herramientas/c3_acentos.py`.
- Solo lenguaje visual. El borrador numérico está en `marca/tokens.json` (estado: borrador, sin aprobar).

## Qué es cada una
| | ref-01 | ref-02 | ref-03 |
|---|---|---|---|
| Técnica | Pixel art JRPG + postproceso (desenfoque, brillo) | Vectorial de aspecto 3D | Diagrama plano por código |
| Formato | 9:16 · 30 fps · 78 s | 9:16 · 60 fps · 87 s | 16:9 · 30 fps · 412 s |
| Subtítulo | Caja de diálogo con avatar, palabra a palabra | Karaoke arriba, palabra clave «seleccionada» | Ninguno quemado |
| Letra | Pixel *display* + sans redondeada | Sans geométrica | Monoespaciada |

## Común (lo que se queda casi seguro)
| Rasgo | Evidencia | Propuesta para ElGatoMista |
|---|---|---|
| **Fondo muy oscuro** | Paleta global: dominan #110d1b, #24282e/#101010 y #0c1016 | Fondo base azul-negro y una variante violeta noche |
| **Acento escaso** | El acento saturado ocupa el 6,45 %, el 2,02 % y el 2,12 % de la imagen | Acento ≤ 8 % del encuadre; 1-2 colores por escena |
| **Colores con significado** | Verde = OK y rojo = error (ref-01); verde = dato y magenta = resultado (ref-03); dorado = energía (ref-02) | Un rol fijo por color (ver tokens) |
| **Palabra clave resaltada** | Palabra en color (ref-01), caja de selección (ref-02), cifra grande (ref-03) | Una palabra clave por frase, siempre con el mismo gesto |
| **Una idea = un objeto** | Interfaz de juego (ref-01), corte transversal (ref-02), objeto geométrico (ref-03) | Cada frase con hecho tiene su objeto visual |
| **Texto corto en pantalla** | 1-2 líneas, ~6-10 palabras | Tope de palabras visibles por formato |
| **Sonoridad -14 LUFS** | -14,1 / -14,1 / -14,3 LUFS integrados; LRA 2,3-3,0 | Ya es nuestro criterio; con pico < -2 dBTP (ref-02 llega a +0,6) |
| **Etiquetas pegadas al objeto** | Línea guía al punto (ref-02); rótulo junto al objeto (ref-01) | Etiquetas con línea guía, no en las esquinas |

## Diverge (hay que elegir → preguntas C4)
| Rasgo | ref-01 | ref-02 | ref-03 | Pregunta |
|---|---|---|---|---|
| Pureza del pixel | Píxel grande + desenfoque y brillo | No es pixel | No es pixel | P1, P2 |
| Movimiento | Poses y saltos de sprite | Zoom continuo suave a 60 fps | Transformación lenta | P10, P11 |
| Transición | Destello pixelado entre bloques | Zoom / fundido corto | Fundido encadenado | P12 |
| Subtítulo del short | Caja de diálogo | Karaoke arriba | — | P13, P14 |
| Narrador visible | Avatar en escena | No | No | P5, P6 |
| Ritmo | Algo nuevo cada 1-3 s; planos de mediana 6,2 s | Cambio continuo; planos de mediana 9,7 s | Cambio cada 3-8 s; casi sin cortes | P8, P9 |
| Silencios | 0 | 3 (1,8 s) | 3 (2,1 s en 7 min) | P15 |
| Tipografía | Pixel *display* + sans | Sans | Mono | P3, P4 |
| fps | 30 | 60 | 30 | P2 (60 fps ya decidido) |
| Fuente del dato en pantalla | No | Sí, pequeña | No | P16 |

## Encaje con lo ya decidido
- 60 fps (decisión de Mario): con pixel art y *snapping*, la mitad de los fotogramas repiten posición. No es un problema, pero el piloto de motor debe medir el coste.
- «Etiquetas en las esquinas» está prohibido por defecto: ref-03 pone un contador en la esquina. Se propone mantener la prohibición (P17).
- «Todo entrando con fundido» está prohibido por defecto: ref-03 lo hace a menudo. Se propone entradas por salto o crecimiento de píxel y fundido solo entre ideas (P12).

## Primera hipótesis de estilo (para C5, a confirmar en C4)
«Pixel art de interfaz de videojuego sobre fondo oscuro»:
- avatar gato como narrador en una caja de diálogo, en el short;
- en el largo, un objeto por idea en diagrama pixel;
- paleta corta con roles fijos y palabra clave en color;
- destello pixelado entre bloques;
- la limpieza de ref-03 para cifras y diagramas.
