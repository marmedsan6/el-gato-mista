# Estilo visual de elgatomista

## Estilo vigente (manda sobre lo que sigue)
Lo vigente es la **v2 con los cambios del 2026-10-31**, el estilo del short publicado. Decisiones de Mario en `memoria/decisiones.md`; ADR 0007.
| Tema | Regla vigente | Sustituye a |
|---|---|---|
| Personaje | **Gato MISTA de narrador**: atigrado naranja, en escena, con poses, parpadeo, boca y cola; la voz es suya | «Sin personaje» |
| Caja de diálogo | Con su retrato y la etiqueta «MISTA». El retrato no mueve la boca, solo parpadea | «Sin avatar» |
| Color | Escenarios pixel ilustrados por bloque, paleta ampliada, **3-4 acentos por escena** y objetos temáticos que reaccionan | «Máximo 2 acentos» |
| Escala | Personaje y objetos a ×2; escenario y texto a ×1 | |
| Transición entre bloques | **Desplazamiento lateral de 0,4 s**, sin pantalla blanca. MISTA sale con su escenario y reaparece con un saltito | «Destello pixelado» |
| Fondos | Vivos pero tranquilos: 3-4 cosas siempre en movimiento en cada escenario, sin tapar los datos | |
| Efectos | A **-18 dB**, atados a lo que pasa en pantalla, nunca al ritmo del diálogo. Blip propio en cada palabra clave | Efectos en apariciones y contadores |

Pendiente: integrar estos cambios en el texto de abajo y en `marca/tokens.json`, que siguen en v1.

---

Estado de lo que sigue: **estilo v1**, aprobado por Mario el 2026-10-29 tras la calibración (docs/calibracion.md, C0-C7).
- Valores numéricos: `marca/tokens.json`. Implementación: `motor/estilo/estilo.css` y `motor/estilo/pixel.js`.
- Ejemplos aprobados: `motor/calibracion/c5a/` (fotogramas fijos) y `motor/calibracion/c5b/` (clip de 18 s).
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
- Fuente del dato pequeña bajo la cifra («FUENTE: [fN]») y también en la descripción.
- Las ideas se cuentan con **interfaz de videojuego**: barras de progreso, menús con cursor ▶, contadores, checks y aspas, insignias.

## Sonido (pendiente de los pilotos de voz y música)
- Música: chiptune suave continuo bajo la voz.
- Efectos: *bleeps* de 8 bits en apariciones, checks, aspas y contadores, 1 fotograma después de la imagen.
- Mezcla: -14 LUFS integrados, pico real < -2 dBTP.

## Qué sí (aprobado por Mario)
- Pixel art con postproceso (P1), modo nítido, fondo violeta para el contexto y azul-negro para la explicación (P7).
- Titular pixel pesado, cifras en monoespaciada, caja de diálogo con caja de selección.
- Movimiento a saltos, destello pixelado, travelling lento, interfaz de juego como lenguaje base.
- Cierre del short con el dato, sin llamada a la acción (P23).

## Qué no (rechazado por Mario)
- Narrador o personaje visible (P5).
- Neón chillón o degradados arcoíris; sonidos estridentes o *jumpscares* (P24).
- Fundidos de entrada (P18); etiquetas o contadores en las esquinas (P17).
- Por defecto (criterios.md): título centrado sobre degradado.

## Historial de versiones
- **v1 · 2026-10-29**: calibración con 3 referencias (análisis en `docs/estilo/`), 24 respuestas de Mario, 2 vueltas con
  crítica Opus (`reviews/calibracion/`). Aprobado por Mario («Me gusta, aprobado»). ADR 0005.
