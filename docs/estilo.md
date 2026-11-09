# Estilo visual de elgatomista

## Estilo vigente (manda sobre lo que sigue)
Lo vigente es el **estilo v3** (calibración aprobada por Mario el 2026-11-03, `reviews/calibracion/iter-v3-01.md`) **con la iteración de detalle v4** (aprobada el 2026-11-06, `reviews/calibracion/iter-v4-01.md`: cámara de ref-01 con paralaje, detalle en los objetos y efectos de pixelfx; ejemplo: `motor/calibracion/v4/clip.{html,js}`), que parte de la v2 con los cambios del 2026-10-31 y la cámara de la v5. Ejemplo completo: `proyectos/mithril-ia-medicina/escenas/short-v6/`; biblioteca: `motor/estilo/v3/` (la v2 queda en `motor/estilo/` para reproducir lo ya publicado). Decisiones de Mario en `memoria/decisiones.md`; ADR 0007.
| Tema | Regla vigente | Sustituye a |
|---|---|---|
| Personaje | **Gato MISTA de narrador**: atigrado naranja, en escena, con poses, parpadeo, boca y cola; la voz es suya | «Sin personaje» |
| Caja de diálogo | Con su retrato y la etiqueta «MISTA». El retrato no mueve la boca, solo parpadea. **Opaca** (`panel`). **Cifras en JetBrains Mono 600** (en Pixelify el 5 se lee como S; Mario, 2026-11-03) | «Sin avatar», fondo translúcido, cifras en Pixelify |
| Color | Escenarios pixel ilustrados por bloque, paleta ampliada, **3-4 acentos por escena** y objetos temáticos que reaccionan | «Máximo 2 acentos» |
| Píxel (v3) | **Un solo tamaño de píxel, 12 px de salida**, en escenario, objetos y MISTA: el arte se dibuja en unidades de un lienzo de 90×160 (short) o 160×90 (largo), 1 unidad = 3 px CSS. Retrato del diálogo a 6 px (la mitad). El texto conserva su tipografía (más fino), como la referencia ref-01 | Personaje y objetos ×2, escenario ×1 |
| Detalle de objetos (v4) | Dentro de los objetos principales, **detalle a media unidad (6 px)** como textura bajo el píxel de 12 px: reflejo y menisco en el vidrio, fibra y esquina doblada en el papel, barrido y reflejo en las pantallas, textura del cartón, etiquetas. La silueta y el contorno siguen a 12 px. Nunca un objeto entero a ×2 (sus detalles quedan más gruesos que todo lo demás). Implementación: `motor/estilo/v3/props.js` (mismas firmas) | Objetos lisos de 3-4 tonos |
| MISTA (v4) | **Tal cual (sprite v3 de 32×32 a 12 px)**. El rediseño a 64×64 y 6 px queda para más adelante (Mario, 2026-11-06): ojos ámbar o amarillos, nunca verdes | |
| Profundidad y luz (v3) | Solo el plano medio nítido (objetos, datos y MISTA); plano lejano y suelo cercano muy desenfocados; conos de luz de foco y polvo en la luz (capa de brillo) | Fondo ligeramente desenfocado |
| Dibujo (v3) | Escenas simples con pocos objetos grandes. Objetos y MISTA sombreados a mano (3-4 tonos: luz arriba a la izquierda, sombra abajo a la derecha, contorno interior) | Rectángulos planos |
| Transición entre bloques | **Desplazamiento lateral de 0,4 s**, sin pantalla blanca. MISTA sale con su escenario y reaparece con un saltito | «Destello pixelado» |
| Fondos | Vivos pero tranquilos: 3-4 cosas siempre en movimiento en cada escenario, sin tapar los datos | |
| Efectos visuales (v4) | **pixelfx** (MIT, github.com/patch-gg/pixelfx) para momentos puntuales (una carga, un destello, chispas), a media unidad (`efecto(svg, nombre, t, t0, x, y, 0.5)`, `motor/estilo/v3/fx.js`; hojas con `node motor/fx-exportar.mjs`), anclados a lo que los provoca (la pata de MISTA, el objeto) y lejos de los datos y de la cara de MISTA. **Nunca un efecto con cifras o texto propio** (se lee como un dato sin fuente). Lo que es interfaz de juego (escaneos, marcos, barras) se dibuja a mano a 12 px. Pendiente del crítico: las chispas y anillos finos de pixelfx quedan por debajo de 12 px; si molestan, cuantizar el efecto a la rejilla | |
| Efectos de sonido | A **-18 dB**, atados a lo que pasa en pantalla (un objeto aparece o reacciona, se completa un contador, una transición), nunca al ritmo del diálogo. El marco de la palabra clave del diálogo no suena. No suena nada que la cámara deje fuera de cuadro | Blip en cada palabra clave del diálogo |
| Mundo y cámara (v4) | Cámara de ref-01 (`docs/estilo/analisis/ref-01-camara.md`): **un mundo de varias pantallas con una estación por idea** (dentro de un bloque) y **paralaje por capas** con `CAM.aplicarCapas`: fondo d = 0,6, plano medio 1, primer plano desenfocado 1,35 (estanterías o columnas que solo cruzan en los travellings; en reposo, fuera de cuadro). Movimientos: acercamiento lento, **travelling** entre estaciones (1,1 s, con aceleración y frenada) y **revelar** (travelling y alejamiento a la vez, desde un zoom core hasta la siguiente estación, ~1,3 s). MISTA se queda en su estación y reaparece con un saltito en otra. El zoom core encuadra el tablero entero (×1,25 si es ancho) y su última línea se ve quieta ≥ 1,5 s antes de moverse. Los tableros quedan ≥ 2 unidades bajo el rótulo y los pies de MISTA sobre la caja en todos los planos. Las cartelas de fuente van en su propia capa, encima del primer plano; el texto de los tableros, con su papel. Entre bloques sigue el desplazamiento lateral | Una pantalla por idea, sin paralaje |
| Cámara | **Acercamiento lento** continuo (12 → 13 px, anclado para no tapar rótulo ni caja) en los tramos sin zoom; vuelve suave al general antes de cada desplazamiento. **Plano general** con MISTA y **plano de detalle solo en las explicaciones core** (3 en el short de Mithril). Entra con zoom a escalones (×0,25 cada 0,075 s; k múltiplo de 0,25) y sale con corte seco. MISTA queda fuera de cuadro en el detalle y vuelve al general con un saltito. Rótulos de cabecera y caja de diálogo fijos. En el detalle, el mundo se recorta en la línea de la caja, los marcos de selección solo se dibujan si su objeto se ve entero y las etiquetas de fuente no crecen. Siempre plano general antes de un desplazamiento entre bloques. Implementación: `motor/estilo/camara.js`; ejemplo: `proyectos/mithril-ia-medicina/escenas/short-v6/` | Un plano fijo por escenario |

Pendiente: integrar estos cambios en el texto de abajo y en `marca/tokens.json`, que siguen en v1.

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
