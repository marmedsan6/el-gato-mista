# Estilo v1 · historial (2026-10-29)

Texto completo del estilo v1 tal como estaba en `docs/estilo.md` hasta el 2026-11-10. **No está vigente**: lo vigente es el
bloque «Estilo vigente» de `docs/estilo.md`. Se conserva porque explica de dónde viene cada regla (P1-P24, ADR 0005).
Varias reglas de aquí están sustituidas: «sin personaje», «máximo 2 acentos», «destello pixelado», «sin avatar» y los ritmos.

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
