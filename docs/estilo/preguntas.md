# C4 · Preguntas antes de crear nada

- Fecha: 2026-10-29 · Base: `analisis-comun.md` y `marca/tokens.json` (borrador).
- 24 preguntas en 14 bloques. Cada una tiene opciones; **(R)** marca mi recomendación y el motivo, en una línea.
- Respuestas → `respuestas.md`. Se pueden contestar aquí mismo o en rondas de 4 en el chat.

## A · Textura y lienzo
**P1. ¿Qué pureza de pixel art?**
- a) **Pixel puro**: escalado entero, sin desenfoque ni brillo, todo a la misma escala.
- b) **Pixel con postproceso** como ref-01: desenfoque del fondo, *bloom* en luces y rayos de luz. **(R)** Es lo que te gustó de ref-01 y da profundidad.
- c) Pixel solo en personajes e iconos; diagramas y cifras limpios, tipo ref-03.

**P2. ¿Qué tamaño de píxel?**
- a) Lienzo 480×270 / 270×480 ×4: píxel de 4 px, más detalle. **(R)** Deja espacio para diagramas y texto legible.
- b) 320×180 / 180×320 ×6: píxel de 6 px, más «gordo» y retro.
- c) Mixto como ref-01: sprites a píxel grande (8-10 px) y texto/interfaz más fino.

## B · Tipografía (todas OFL; se prueban a 360×640)
**P3. ¿Titulares?**
- a) Pixel muy pesado en mayúsculas (tipo Press Start 2P). **(R)** Es el gesto más reconocible de ref-01.
- b) Pixel más fino y legible (tipo Silkscreen).
- c) Sin pixel: sans geométrica como ref-02.

**P4. ¿Texto de datos y cifras?**
- a) Monoespaciada limpia (tipo JetBrains Mono), como ref-03. **(R)** Contrasta con la pixel y se lee bien a tamaño pequeño.
- b) La misma pixel de los titulares.
- c) Sans redondeada (tipo Pixelify Sans), como el diálogo de ref-01.

## C · Mascota
**P5. ¿Un gato como narrador visible?**
- a) Sí, en el short y en el largo.
- b) Sí en el short (avatar en la caja de diálogo y personaje en escena); en el largo solo el avatar en cortinillas. **(R)** El short gana cercanía; el largo deja sitio a los diagramas.
- c) No: el canal se cuenta sin personaje.

**P6. Si hay gato, ¿cómo es?**
- a) Gato negro con un detalle de color de acento (collar o ojos naranjas). **(R)** Encaja con «mista» (misterio) y con el fondo oscuro.
- b) Gato atigrado naranja: cálido, contrasta con el fondo.
- c) Lo diseñas tú o me das una referencia; yo lo pixelo.

## D · Paleta
**P7. ¿Qué fondo base?**
- a) Azul-negro `#0c1016` en todo.
- b) Violeta noche `#1e1727` en todo.
- c) Violeta noche en escenas con narrador y azul-negro en diagramas y cifras. **(R)** Separa «contar» de «explicar» sin salir de la paleta.

## E · Ritmo
**P8. Short: ¿cada cuánto pasa algo nuevo?**
- a) Cada 1-2 s, frenético.
- b) Cada 1-3 s, como ref-01. **(R)** Va con la retención del short sin agotar.
- c) Cada 2-4 s, lo que dice hoy `docs/criterios.md`.

**P9. Largo: ¿cada cuánto?**
- a) Cada 2-4 s, igual que el short.
- b) Cada 3-8 s, como ref-03. **(R)** Un largo de 8-10 min necesita respirar.
- c) Variable: rápido en el gancho (0-30 s) y luego 3-8 s.

## F · Movimiento
**P10. ¿Qué curva de animación?**
- a) Escalonada (*steps*), muy pixel: los objetos saltan de posición. **(R)** Es coherente con el pixel art y lo hace más «juego».
- b) Suave a 60 fps, como ref-02.
- c) Escalonada en sprites y suave en la cámara y los diagramas.

**P11. ¿Cámara?**
- a) Fija por escena.
- b) Fija con *travelling* lateral lento entre objetos, como la galería de ref-01. **(R)**
- c) Zoom continuo hacia lo interno, como ref-02.

## G · Transiciones
**P12. ¿Entre bloques del vídeo?**
- a) Destello pixelado con retícula de puntos (~0,3 s), como ref-01. **(R)** Es una firma visual barata de producir.
- b) Fundido encadenado, como ref-03.
- c) Corte seco y nada más.

## H · Subtítulos
**P13. ¿Subtítulo del short?**
- a) Caja de diálogo JRPG con avatar del gato y texto palabra a palabra. **(R)** Es el rasgo más fuerte de tu referencia preferida.
- b) Karaoke arriba, como ref-02.
- c) Caja de diálogo, pero con la palabra actual resaltada como en el karaoke.

**P14. ¿Cómo se resalta la palabra clave?**
- a) Solo en color de acento (naranja). **(R)** Es simple y legible.
- b) Caja de selección con tiradores en pixel, como ref-02.
- c) Las dos: color en el subtítulo y caja en los rótulos.

## I · Silencios
**P15. ¿Pausas en la voz?**
- a) Ninguna en el short; en el largo, pausas de 0,3-0,8 s antes de un dato o un giro. **(R)**
- b) Ninguna en ningún formato.
- c) Pausas también en el short (1-2 por vídeo, de dramatismo).

## J · Fuentes en pantalla
**P16. ¿La fuente del dato sale en pantalla?**
- a) Sí, pequeña bajo la cifra (como ref-02) y además en la descripción. **(R)** Refuerza la credibilidad y va con nuestra regla de fuentes.
- b) Solo en la descripción.
- c) Solo en el largo.

## K · Reglas actuales que chocan con las referencias
**P17. Etiquetas y contadores en las esquinas (prohibido por defecto; ref-03 lo hace).**
- a) Se mantiene la prohibición. **(R)** Las esquinas del short las tapa la interfaz de las plataformas.
- b) Se permite solo un contador en el largo.

**P18. Fundidos de entrada (prohibidos por defecto; ref-03 los usa).**
- a) Se mantiene: los objetos entran por salto o crecimiento de píxel. **(R)**
- b) Se permite el fundido en diagramas del largo.

## L · Sonido
**P19. ¿Música?**
- a) Cama continua de estilo chiptune suave, bajo la voz. **(R)** Une el pixel art con el sonido.
- b) Ambiente sintetizado sin melodía clara.
- c) Música solo en el gancho y el cierre.

**P20. ¿Efectos de sonido?**
- a) *Bleeps* de 8 bits en cada aparición, check, aspa o contador. **(R)** Refuerza la interfaz de juego.
- b) Sutiles (*whoosh*, clic).
- c) Casi ninguno.

## M · Largo frente a short
**P21. ¿Cuánto se parecen los dos formatos?**
- a) El mismo mundo: el gato, la paleta y las cajas, con el short más rápido. **(R)**
- b) El short tipo JRPG y el largo tipo diagrama (ref-03), unidos solo por la paleta y las letras.

**P22. ¿Las ideas se ilustran con interfaz de videojuego (barras, menús, contadores, checks o aspas, insignias), como ref-01?**
- a) Sí, como lenguaje base. **(R)**
- b) A veces, para cifras y pasos.
- c) No, mejor objetos y diagramas.

## N · Cierre y límites
**P23. ¿Cierre del short?**
- a) Pantalla de «fin de nivel» con el gato e invitación a seguir el canal. **(R)**
- b) Cierre diegético que imita la interfaz de la red social, como ref-02.
- c) Sin llamada a la acción: termina con el dato.

**P24. ¿Qué no quieres nunca?** (varias)
- a) Caras realistas o fotos de personas.
- b) Texto de más de 2 líneas en pantalla.
- c) Colores neón chillones o degradados arcoíris.
- d) Sonidos estridentes o *jumpscares*.
- e) Otra (dímela).
