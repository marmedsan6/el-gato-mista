# Estilo visual de elgatomista

## Estilo vigente: v7
La v6 (reglas de Mario del 2026-11-10, ADR 0010, sobre la v5 del ADR 0009) con el **arte generado con Codex** (ADR 0011):
todo lo que tiene silueta es una pieza generada, convertida a la rejilla de 4 px y a la paleta `R5`. Plan aprobado por
Mario el 2026-11-15; set de referencia aprobado ese día (`reviews/calibracion/set-v7-01.md`); calibración aprobada el
2026-11-16 («Aprobado»; `reviews/calibracion/iter-v7-01.md`). Un vídeo es v6 (todo por código) o v7 (todo generado):
nunca mezcla.
- **Ejemplos:** `proyectos/ia-pasa-factura/escenas/short-a-v7/` (9:16, calibración interna, con sus piezas en
  `proyectos/ia-pasa-factura/piezas/`) y `motor/calibracion/v7/clip.{html,js}` (16:9). De la v6, lo de siempre:
  `proyectos/como-google-sabe-lo-que-quieres/` (estándar v6, publicado el 2026-11-12).
- **Biblioteca:** `motor/estilo/v7/` (`generado.js`: `sprite7`, `punto7`, `andar7`, `camisa7`, `luces7`, `apagarLuces7`,
  `puerta7`, `interior7`; `short-motor.js`; el set en `set/`) sobre `motor/estilo/v6/` y `motor/estilo/v5/dibujo.js`, que no
  cambian. Herramientas de las piezas en `motor/piezas/` (`motor/README.md`).
- **Plantillas:** `plantillas/escenas/v7/{short,largo}/escena-plantilla.html`.
- **Vídeos ya publicados:** se reproducen con su biblioteca de entonces (v2 en `motor/estilo/`, v3 en `motor/estilo/v3/`,
  la v3.0 congelada en `motor/estilo/v3/congelado/`, la v5 en `motor/estilo/v5/` y los v6 con `motor/estilo/v6/`). No se
  editan: `npm test` compara sus huellas (`motor/huellas/publicados.json`, 24 escenas desde el 2026-11-15).

| Tema | Regla vigente |
|---|---|
| Presentación | **Diorama animado.** Cada idea es una ilustración pixel grande que se mueve para explicarla: un sujeto grande y con detalle delante y lo contado en el fondo. Nunca muchas casillas iguales. Lo que depende del texto se arregla dibujando el objeto |
| Texto en pantalla (v6) | **Casi sin texto.** Además de la caja: el título de entrada, un rótulo por tema y, como mucho, **1 identificador** a la vez (1-3 palabras pegadas a lo que nombran, nunca en filas fijas) o la **cifra**, grande y sola. Ninguno repite la voz. Los nombres propios, mejor **dentro del dibujo** (`placa6`: placa, cartel, cabecera) |
| Fuente del dato (v6) | En una **pestaña de la caja de diálogo**, mientras suena la frase. Sale sola de las marcas `[fN]` del guion (`motor/timing-a-js.mjs --guion`). En el short cuelga bajo la caja; en el largo va dentro, en la línea del nombre |
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
| Arte (v7) | **Todo lo que tiene silueta, generado con Codex** (edificios, personas, objetos, muebles, vehículos, robots, marcos de interfaz, partes fijas de los mecanismos), convertido con `motor/piezas/` y pintado con `sprite7`. Por código solo: mover, teñir por paleta (estados de la pieza, `camisa7`), cielo y suelo, paredes de los interiores (`interior7`), placas (`placa6`), cifras, destellos y lo que se mueve por dentro de una pieza escrito como rejilla (`puerta7`). MISTA y la caja no cambian |
| Lo que sigue siendo código (v7) | Si tiene forma (una tubería, una flecha), lleva el tratamiento de una pieza: **contorno, 3 tonos de `R5` y luz arriba a la izquierda**. Plano y de un tono se nota la otra mano |
| Escala (v7) | Fija, en píxeles de arte (`motor/piezas/escala.json`): **persona de pie 28**, sentada 24, persona sujeto 44-48, robot 34, hueco de puerta 35, tienda de una planta 67, edificio 60-200, vehículo 30-50, objeto de mano 10 como mínimo. `montar.mjs` rechaza lo que se sale. En piezas compuestas (la puerta de un edificio alto) Codex no la respeta: nadie entra por una puerta fuera de escala |
| Lo pequeño (v7) | Signos y objetos de mano de **10 píxeles de arte o más**, con contorno, claros y sobre superficie lisa u oscura, nunca sobre rayas o textura. Bocadillos: fondo claro y signo oscuro |
| Puerta de estilo (v7) | Las piezas de cada vídeo se aprueban **antes de escribir las escenas**: el agente filtra y regenera tanda a tanda y **Mario aprueba una hoja por vídeo** (`piezas/contactos.png` → `reviews/piezas.md`) |
| Fuentes de arte | Codex (suscripción, sin coste extra) con el **set** (`motor/estilo/v7/set/`: 36 piezas, las 18 de referencia aprobadas por Mario y 18 del short A de la calibración; las marcadas «referencia» se pasan siempre como estilo y escala). Solo se le envía arte propio. Bibliotecas y generadores ajenos, no (ADR 0011; el set ajeno, con el atlas de Krea y los packs de Kenney, se abandonó el 2026-11-13) |

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
- **v7 · 2026-11-15/16** (ADR 0011): arte generado con Codex, escala fija, set de referencia y puerta de estilo.
