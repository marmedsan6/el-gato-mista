# Estilo visual de elgatomista

## Estilo vigente (manda sobre lo que sigue)
Lo vigente es el **estilo v5** (calibración aprobada por Mario el 2026-11-09, `reviews/calibracion/iter-v5-02.md`; ADR 0009).
- **Ejemplo completo:** `motor/calibracion/v5/clip.{html,js}`.
- **Biblioteca:** `motor/estilo/v5/` (`dibujo.js` y `escena.js`), con `motor/estilo/{estilo.css, pixel.js, camara.js}` y `v3/gato.js`.
- **Plantillas:** `plantillas/proyecto/escenas/{short,largo}/escena-plantilla.html`.
- **Vídeos ya publicados:** se reproducen con su biblioteca de entonces (v2 en `motor/estilo/`, v3 en `motor/estilo/v3/` y la v3.0 congelada en `motor/estilo/v3/congelado/`). La v3 y la v4 quedan como historial (ADR 0007; `reviews/calibracion/iter-v3-01.md` e `iter-v4-01.md`).

| Tema | Regla vigente | Sustituye a |
|---|---|---|
| Presentación (v5) | **Diorama animado.** Cada idea es una ilustración pixel grande que se mueve para explicarla: un sujeto grande y con detalle delante y lo contado en el fondo (p. ej., la persona en su oficina delante y los 11 laboratorios como ventanas que se encienden). Nunca muchas casillas iguales (se lee como una hoja de cálculo). Lo que depende del texto se arregla dibujando el objeto. Poco texto: rótulo, cifra con su fuente y caja de diálogo | Tableros de corcho con texto que señala MISTA |
| Píxel (v5) | **4 px de salida por píxel de arte**: lienzo de 270×480 (short) o 480×270 (largo) unidades, 1 unidad = 1 px CSS. Objetos sombreados (luz arriba a la izquierda, contorno, 3-5 tonos por rampa `R5`); hasta los iconos pequeños llevan contorno y 3 tonos (si no, se leen como letras) | Un solo píxel de 12 px; detalle a 6 px |
| Personaje (v5) | **MISTA sale poco**, siempre a su píxel de 12 px (sprite v3 de 32×32; excepción deliberada a los 4 px): entero en la **entrada de tema** con el título; **de pie 1-2 s en cada cambio de tema**, con un saltito, sobre la línea de la caja (nunca cortado por ella); y en el **cierre**. Fuera de eso no está en escena. La voz sigue siendo suya. Rediseño a 64×64 y 6 px, más adelante | MISTA en escena en cada estación |
| Caja de diálogo | Con su retrato y la etiqueta «MISTA». El retrato no mueve la boca, solo parpadea. **Opaca** (`panel`). **Cifras en JetBrains Mono 600**. Páginas de 2 líneas como máximo, sin palabras huérfanas (`crearDialogo5`) | «Sin avatar», fondo translúcido, cifras en Pixelify |
| Ritmo y dinamismo (v5) | **Algo nuevo cada 1-2 s.** El diorama reacciona a la voz (piezas que entran a saltos, se encienden, trabajan, cambian) y siempre hay 3-4 cosas en movimiento | Short 2-4 s, largo 3-8 s |
| Mundo y cámara (v5) | Mundo ancho con **una estación por idea** y **paralaje** (`CAM.aplicarCapas`: lejos 0,6 · medio 1 · delante 1,35, con columnas o farolas que solo cruzan en los travellings). **Travelling** de ~1,1 s entre estaciones (un elemento, como un paquete de datos, puede guiarlo). **Zoom core a escalones hasta ×1,25** (5 px enteros), que encuadra el tablero entero con margen, y salida con corte seco; plano general antes de cada travelling. Rótulo y caja, fijos | Zooms a ×1,5 sobre tableros |
| Etiquetas (v5) | Junto a lo que nombran, con **fondo oscuro** (`.etiqueta.fondo`) y su fuente debajo. Ancladas al mundo, siguen a la cámara sin crecer, se ocultan en los travellings y se ajustan dentro de pantalla y fuera de la franja tapada del short (`crearTextos5`) | Texto sobre tarjetas de papel |
| Color | Paleta del canal ampliada en rampas (`R5`: hormigón, laboratorio, oficina, metal, cielo, IA, naranja, verde) y **3-4 acentos por escena**. Escenas nocturnas con luz cálida de interior y fría de laboratorio. Nunca rojo en texto pequeño | «Máximo 2 acentos» |
| Profundidad y luz | Solo el plano medio nítido; lejos y primer plano desenfocados; conos de luz y brillo (*bloom*) en luces y pantallas | Fondo ligeramente desenfocado |
| Efectos visuales (v5) | Dibujados a la rejilla de 4 px (`destello5`: anillo a escalones y rayos de 2×2). **pixelfx queda fuera** (sus chispas y anillos son más finos que el píxel). Nunca un efecto con cifras o texto propio | pixelfx a media unidad |
| Transición entre temas | **Desplazamiento lateral de 0,4 s**, sin pantalla blanca | «Destello pixelado» |
| Efectos de sonido | Atados a lo que pasa en pantalla (aparece o reacciona un objeto, se completa un contador, una transición), nunca al ritmo del diálogo. Regla de -18 dB; los últimos vídeos y el clip v5 van a -24 dB, por decisión de cada vídeo | Blip en cada palabra clave |
| Fuentes de arte (v5) | Dibujo propio por código. Atlas `Angais/pixel-art-atlas-1.4m` (16×16, CC0, hecho con Krea) solo como atrezo pequeño, y no en un vídeo publicado hasta leer la licencia de Krea §2.3 | |

Pendiente: llevar estas reglas al texto v1 de abajo y a `marca/tokens.json` (Mario no los eligió en la limpieza del 2026-11-09).

---

Estado de lo que sigue: **estilo v1**, aprobado por Mario el 2026-10-29 tras la calibración (docs/calibracion.md, C0-C7).
- Valores numéricos: `marca/tokens.json`. Implementación: `motor/estilo/estilo.css` y `motor/estilo/pixel.js`.
- Ejemplos aprobados de la v1: `motor/calibracion/c5a/` y `c5b/`, ya fuera del árbol: están en la etiqueta git `archivo/pre-limpieza-2026-11-09`.
- Origen de cada regla: `docs/estilo/respuestas.md` (P1-P24), `reviews/calibracion/` (críticas e iteraciones).

**En una frase:** pixel art de interfaz de videojuego sobre fondo oscuro, sin personaje, con titulares pixel pesados,
cifras en monoespaciada, movimiento a saltos y destello pixelado entre bloques.

## Paleta
Cada color tiene un papel fijo. **Máximo 2 acentos por escena**: el resto, en texto o texto suave. Acento ≤ 8 % del encuadre.
| Token | Hex | Uso |
|---|---|---|
| `fondo` | #0c1016 | Diagramas, cifras, explicación |
| `fondo_violeta` | #1e1727 | Escenas de contexto e historia |
| `panel` | #171e2a | Cajas, paneles, caja de diálogo |
| `linea` | #36373b | Estructura, cuadrícula, bordes de panel |
| `texto` | #f5f7fb | Texto principal, palabra actual, luz blanca |
| `texto_suave` | #8a93a6 | Lo ya dicho, etiquetas secundarias |
| `acento_naranja` | #ff8a3d | Palabra clave del titular, insignias, rótulos |
| `acento_azul` | #5b8cff | Azul de contenido: datos, objetos (6,0:1 sobre el fondo) |
| `acento_rojo` | #e0454f | Error, «no», objetos rojos; **nunca en texto pequeño** |
| `acento_verde` | #1fd69a | Dato correcto, OK |
| `acento_dorado` | #f2c14e | Sol, energía, brillo (solo en escenas de contexto) |
| `acento_magenta` | #ff2d7a | Énfasis fuerte; evitarlo si se lee como neón |
| `seleccion` | #3d68ba | **Solo marcos**: caja de selección de la palabra clave |

## Tipografía
Todas OFL y locales (`marca/fuentes/`), nunca de CDN ni del sistema.
| Uso | Fuente | Tamaño base (salida ×4) | Notas |
|---|---|---|---|
| Titular | Press Start 2P, mayúsculas | 16 px (64) · interlineado 24 | Píxel perfecto a múltiplos de 8; tildes con `tildesPixel()` |
| Rótulo, etiqueta, fuente del dato | Press Start 2P, mayúsculas | 8 px (32) | Se lee a 360×640 |
| Cifras y datos | JetBrains Mono 600 | 24 px (96) en el short | Suavizada (modo nítido) |
| Caja de diálogo | Pixelify Sans 500 | 12 px (48) | Palabra actual en `texto`, lo ya dicho en `texto_suave` |

## Lienzo y escala
- Lienzo base 480×270 (largo) y 270×480 (short), escalado ×4 a 1920×1080 y 1080×1920, 60 fps.
- Modo de render **nítido**: el navegador pinta a ×4. Los dibujos pixel van en SVG con `shape-rendering: crispEdges`
  y coordenadas enteras; el texto vectorial sale suave.
- Postproceso determinista: desenfoque del fondo lejano, *bloom* en luces y rayos. Primer plano y texto siempre nítidos.
- Zona segura del short: nada importante en el 12 % superior, en el 20 % inferior ni en la franja derecha
  (x > 237 base entre el 45 % y el 85 % de la altura).

## Ritmo
- Short: **algo nuevo cada 2-4 s** (en la práctica, cada 0,5-1 s con el diálogo).
- Largo: algo nuevo cada 3-8 s.
- Bloques temáticos de ~6 s en el short, cada uno con su fondo.

## Silencios
- Short: ninguno; voz continua.
- Largo: pausas de 0,3-0,8 s antes de un dato o un giro.

## Movimiento
- Curva **escalonada**: posiciones enteras, saltos de 2-4 px base, cada escalón de 2-4 fotogramas.
- Entradas por **salto** (−2, −1, 0 px en 0,15 s) o por **crecimiento** (recorte o tamaño a escalones). **Nunca fundido de entrada.**
- Cámara fija por escena + *travelling* lateral lento (1-2 px base por segundo, a saltos de 1 px).
- Contadores y barras suben a pasos (5 % / 0,2 ×), con los pasos contados en enteros.

## Transiciones
- Entre bloques: **destello pixelado**. Retícula de puntos sobre blanco, 0,3 s, intensidad a escalones con pico del 85 %,
  y el cambio de bloque en el pico.
- Dentro de un bloque: el objeto se transforma o se añade algo; no hay corte.

## Textura
- Fondos de cielo en bandas escalonadas, sin degradado continuo. Estrellas y partículas con semilla.
- Montañas y suelo en escalera con textura de partículas.
- Viñeta suave en los bordes.

## Texto en pantalla y subtítulos
- **Short:** caja de diálogo JRPG **sin avatar**, en el tercio inferior (y 300-362 base), texto palabra a palabra (0,3 s por
  palabra). Como máximo 2 líneas, y la caja se reinicia con cada frase. La palabra clave va en **caja de selección pixel**
  con tiradores, sin la puntuación dentro. ▼ al terminar la frase. Cada frase solo dentro de su bloque.
- **Largo:** sin subtítulos en pantalla; SRT aparte desde `timing.largo.json`.
- Titular arriba a la izquierda, con una palabra clave en naranja. Nada de título centrado sobre degradado.
- Etiquetas y contadores **junto a su objeto**, con línea guía si hace falta; **nunca en las esquinas**.
- Fuente del dato pequeña bajo la cifra («FUENTE: [fN]»). En la descripción, no: desde el 2026-11-02 solo lleva el resumen y los enlaces entre largo y shorts (Mario).
- Las ideas se cuentan con **interfaz de videojuego**: barras de progreso, menús con cursor ▶, contadores, checks y aspas, insignias.

## Sonido (pendiente de los pilotos de voz y música)
- Música: chiptune suave continuo bajo la voz.
- Efectos: *bleeps* de 8 bits en apariciones, checks, aspas y contadores, 1 fotograma después de la imagen.
- Mezcla: -14 LUFS integrados, pico real < -2 dBTP.

## Qué sí (aprobado por Mario)
- Pixel art con postproceso (P1), modo nítido, fondo violeta para el contexto y azul-negro para la explicación (P7).
- Titular pixel pesado, cifras en monoespaciada, caja de diálogo con caja de selección.
- Movimiento a saltos, destello pixelado, travelling lento, interfaz de juego como lenguaje base.
- Cierre del short: si el vídeo tiene largo, MISTA remite a él en la última frase, con una frase adaptada al tema que diga
  que hay un vídeo largo en YouTube que lo explica entero (Mario, 2026-11-02; sustituye a P23 en ese caso). Sin largo,
  termina con el dato, sin llamada a la acción (P23).

## Qué no (rechazado por Mario)
- Narrador o personaje visible (P5).
- Neón chillón o degradados arcoíris; sonidos estridentes o *jumpscares* (P24).
- Fundidos de entrada (P18); etiquetas o contadores en las esquinas (P17).
- Por defecto (criterios.md): título centrado sobre degradado.

## Historial de versiones
- **v1 · 2026-10-29**: calibración con 3 referencias (análisis en `docs/estilo/`), 24 respuestas de Mario, 2 vueltas con
  crítica Opus (`reviews/calibracion/`). Aprobado por Mario («Me gusta, aprobado»). ADR 0005.
