# Estilo visual de elgatomista

## Estilo vigente: v6
Reglas de Mario del 2026-11-10 (ADR 0010) sobre la v5 (ADR 0009, aprobada el 2026-11-09). Prueba aprobada por Mario el
2026-11-11 («Me gusta, sigue»): short interno v4 de NVIDIA y clip en 16:9 (`reviews/calibracion/iter-v6-01.md`).
- **Ejemplos completos:** `proyectos/nvidia-huang-espionaje/escenas/short-v4/` (9:16) y `motor/calibracion/v6/clip.{html,js}` (16:9).
- **Biblioteca:** `motor/estilo/v6/` (`escena.js`, `piezas.js`, `estilo-v6.css`) sobre `motor/estilo/v5/dibujo.js`, con
  `motor/estilo/{estilo.css, pixel.js, camara.js}` y `v3/gato.js`.
- **Plantillas y motores:** `plantillas/escenas/v6/{short,largo}/escena-plantilla.html`, sobre los dos motores que subió
  como-google (2026-11-12): `motor/estilo/v6/short.js` (`montarShort6`: short de N estaciones; la escena solo pone sus
  estaciones, temas, textos y piezas clave) y `motor/estilo/v6/largo.js` (`montarLargo6`: un mundo por bloque del guion,
  cada uno con su `ruta6`, cámara y lienzos, que empieza con una copia de la última estación del anterior; `?hasta=N`).
- **Vídeos ya publicados:** se reproducen con su biblioteca de entonces (v2 en `motor/estilo/`, v3 en `motor/estilo/v3/`,
  la v3.0 congelada en `motor/estilo/v3/congelado/` y la v5 en `motor/estilo/v5/`). No se editan: `npm test` compara sus
  huellas (`motor/huellas/publicados.json`).

| Tema | Regla vigente |
|---|---|
| Presentación | **Diorama animado.** Cada idea es una ilustración pixel grande que se mueve para explicarla: un sujeto grande y con detalle delante y lo contado en el fondo. Nunca muchas casillas iguales. Lo que depende del texto se arregla dibujando el objeto |
| Texto en pantalla (v6) | **Casi sin texto.** Además de la caja: el título de entrada, un rótulo por tema y, como mucho, **1 identificador** a la vez (1-3 palabras pegadas a lo que nombran, nunca en filas fijas) o la **cifra**, grande y sola. Ninguno repite la voz. Los nombres propios, mejor **dentro del dibujo** (`placa6`: placa, cartel, cabecera) |
| Fuente del dato (v6) | En una **pestaña de la caja de diálogo**, mientras suena la frase. Sale sola de las marcas `[fN]` del guion (`motor/timing-a-js.mjs --guion`). En el short cuelga bajo la caja, en una línea de **17 caracteres como mucho** (`corto_short` en `fuentes.json`; el lint avisa si no cabe); en el largo va dentro, en la línea del nombre |
| Rótulos (v6) | Arriba a la izquierda, **solo en los temas** (los momentos de MISTA: entrada, cambios de tema y cierre). Cambian **al llegar** la cámara. El título de entrada dura 2 s como mínimo |
| Permanencia (v6) | Todo texto y toda pieza clave, **2 s o más** en pantalla antes de que salga la cámara |
| Píxel | **4 px de salida por píxel de arte**: lienzo de 270×480 (short) o 480×270 (largo) unidades, 1 unidad = 1 px CSS. Objetos sombreados (luz arriba a la izquierda, contorno, 3-5 tonos por rampa `R5`); hasta los iconos pequeños llevan contorno y 3 tonos |
| Personaje | **MISTA sale poco**, siempre a su píxel de 12 px (sprite v3 de 32×32): entero en la **entrada de tema** con el título; **de pie 1-2 s en cada cambio de tema**, con un saltito, sobre la línea de la caja; y en el **cierre**. La voz sigue siendo suya |
| Caja de diálogo | Con su retrato y la etiqueta «MISTA». El retrato solo parpadea. **Opaca**. **Cifras en JetBrains Mono 600**. Páginas de 2 líneas como máximo, sin palabras huérfanas ni signos sueltos (`crearDialogo6`) |
| Ritmo | **Algo nuevo cada 1-2 s.** El diorama reacciona a la voz y siempre hay 3-4 cosas en movimiento |
| Mundo y cámara (v6) | Mundo ancho con **una estación por idea** y **paralaje** (lejos 0,6 · medio 1 · delante 1,35). **Travelling** de ~1,1 s entre estaciones, que sale **0,15 s después del fin real de la frase** (`ruta6`). **Zoom core:** acercamiento continuo de **0,4 s** hasta ×1,25, que encuadra entero lo que explica; salida con corte y 0,5 s de plano general antes de viajar |
| Color | Paleta del canal ampliada en rampas (`R5`) y **3-4 acentos por escena**. Escenas nocturnas con luz cálida de interior y fría de laboratorio. Nunca rojo en texto pequeño |
| Profundidad y luz | Solo el plano medio nítido; lejos y primer plano desenfocados; conos de luz y brillo (*bloom*) en luces y pantallas |
| Efectos visuales | Dibujados a la rejilla de 4 px (`destello5`). Sin pixelfx. Nunca un efecto con cifras o texto propio |
| Transición entre temas | **Desplazamiento lateral de 0,4 s**, sin pantalla blanca |
| Efectos de sonido | Atados a lo que pasa en pantalla, nunca al ritmo del diálogo. A -24 dB en los últimos vídeos (la regla general es -18 dB; lo decide cada vídeo) |
| Fuentes de arte | Dibujo propio por código. El atlas `Angais/pixel-art-atlas-1.4m` solo como atrezo pequeño, y no en un vídeo publicado hasta leer la licencia de Krea §2.3 |

Antes de renderizar entero una escena: `node motor/revisar.mjs <html> <ancho> <alto> <duración> 0.05 . --estricto`
(lint de textos y sincronía). La escena declara sus movimientos y piezas clave en `window.revision`.

## Paleta
Cada color tiene un papel fijo. Acento ≤ 8 % del encuadre.
| Token | Hex | Uso |
|---|---|---|
| `fondo` | #0c1016 | Diagramas, cifras, fondo de identificadores |
| `fondo_violeta` | #1e1727 | Escenas de contexto e historia |
| `panel` | #171e2a | Cajas, paneles, caja de diálogo |
| `linea` | #36373b | Estructura, cuadrícula, bordes de panel |
| `texto` | #f5f7fb | Texto principal, palabra actual, luz blanca |
| `texto_suave` | #8a93a6 | Lo ya dicho, «Fuente:» |
| `acento_naranja` | #ff8a3d | Palabra clave del titular y del rótulo |
| `acento_azul` | #5b8cff | Azul de contenido: datos, objetos |
| `acento_rojo` | #e0454f | Error, «no», objetos rojos; **nunca en texto pequeño** |
| `acento_verde` | #1fd69a | Dato correcto, lo que sigue intacto |
| `acento_dorado` | #f2c14e | Luz cálida, brillo |
| `acento_magenta` | #ff2d7a | Énfasis fuerte; evitarlo si se lee como neón |
| `seleccion` | #3d68ba | **Solo marcos**: caja de selección de la palabra clave |

## Tipografía
Todas OFL y locales (`marca/fuentes/`), nunca de CDN ni del sistema.
| Uso | Fuente | Tamaño base (salida ×4) | Notas |
|---|---|---|---|
| Titular | Press Start 2P, mayúsculas | 16 px (64) · interlineado 24 | Tildes con `tildes6()` |
| Rótulo, identificador, fuente, placa del dibujo | Press Start 2P, mayúsculas | 8 px (32) | Se lee a 360×640 |
| Cifra | JetBrains Mono 600 | 24 px (96) | Las del diálogo, a 12 px |
| Caja de diálogo | Pixelify Sans 500 | 12 px (48) | Palabra actual en `texto`, lo ya dicho en `texto_suave` |

## Lienzo y zona segura
- Lienzo base 480×270 (largo) y 270×480 (short), escalado ×4 a 1920×1080 y 1080×1920, 60 fps. Modo de render nítido.
- Zona segura del short: nada importante en el 12 % superior, en el 20 % inferior ni en la franja derecha
  (x > 237 base entre el 45 % y el 85 % de la altura). El lint lo comprueba en los textos.

## Sonido
- Voz: Orus con el estilo de siempre (ADR 0006). Música continua bajo la voz. Efectos 1 fotograma después de la imagen.
- Mezcla: -14 LUFS integrados y pico real < -2 dBTP, con limitador y medida del máster en `motor/mezcla.mjs`.

## Qué no (rechazado por Mario)
- Neón chillón o degradados arcoíris; sonidos estridentes o *jumpscares*.
- Fundidos de entrada; etiquetas o contadores en las esquinas; título centrado sobre degradado.
- Etiquetas que repiten la voz y bloques de texto en filas fijas (2026-11-10).

## Historial de versiones
- **v1 · 2026-10-29** (ADR 0005): texto completo en `docs/estilo/historial-v1.md`.
- **v2 · 2026-10-30** (ADR 0007): gato narrador, escenarios ilustrados, 3-4 acentos.
- **v3 y v4 · 2026-11-03/06**: 12 px, profundidad y luz, cámara con paralaje (`reviews/calibracion/iter-v3-01.md`, `iter-v4-01.md`).
- **v5 · 2026-11-09** (ADR 0009): diorama animado a 4 px, MISTA solo en los temas.
- **v6 · 2026-11-10** (ADR 0010): casi sin texto, fuente en la caja, cámara tras la frase y lint obligatorio.
