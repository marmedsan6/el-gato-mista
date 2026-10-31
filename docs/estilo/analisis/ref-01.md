# C2 · ref-01 · análisis visual

- Fuente: reel de Instagram De-F4riBJ1K (9:16, 1080×1920, 30 fps, 77,9 s). Métricas en `ref-01.json`.
- Material revisado: las 6 hojas de contactos (1 fotograma/s) y recortes ampliados de f_00004, f_00010 y f_00030.
- Solo lenguaje visual. No se copian sujetos, personajes, logotipos ni textos.
- Fecha: 2026-10-29 · Opus a esfuerzo alto.

## En una frase
Pixel art de **JRPG narrativo**: un avatar narrador recorre escenarios temáticos, la narración va en una caja de diálogo de videojuego y cada idea se ilustra con un elemento de interfaz de juego (barra de progreso, menú, contador, insignia). Encima lleva postproceso moderno: desenfoque de fondo, brillo y rayos de luz.

## Composición (9:16)
- Tres franjas fijas:
  - **arriba**, el titular o rótulo (hasta ~25 % de la altura);
  - **centro**, la escena con el personaje a ras de suelo, en el tercio izquierdo o central;
  - **abajo**, la caja de diálogo, de ~65 % a ~73 % de la altura, a todo el ancho con margen lateral de ~1/40.
- La franja inferior (~25 % final) queda vacía o con fondo desenfocado. Probablemente es la zona segura de la interfaz de Instagram/TikTok.
- Personaje grande (~1/4 de la altura). Los objetos de la idea (carteles, monitores, menús) van a media altura, cerca del personaje.
- Un escenario por bloque temático: habitación de noche con ciudad, carretera en el desierto al atardecer, galería con focos, laboratorio azul, biblioteca. El fondo cambia con el tema, no con cada frase.

## Tipografía
- **Titulares:** pixel *display* muy pesado, mayúsculas, con espaciado ancho y contorno o sombra oscura. Dos colores: blanco en la parte neutra y **una palabra clave en color** (naranja o verde).
- **Rótulos de idea:** caja negra con borde blanco de 2 px y mayúsculas pixel. Llevan una palabra en color o un icono (aspa roja, check).
- **Diálogo:** sans redondeada de aspecto retro (no estrictamente pixel), en minúsculas y de tamaño medio. Encima, la etiqueta del hablante en mayúsculas pequeñas naranjas.
- Equivalentes de licencia libre (OFL) a probar: Press Start 2P o Silkscreen (titulares y etiquetas) y Pixelify Sans (diálogo). Se comprueban a 360×640 en C5.

## Subtítulos
- La caja de diálogo **es el subtítulo**: retrato del narrador a la izquierda, nombre arriba y texto que se escribe **palabra a palabra** sincronizado con la voz.
- Cada frase reinicia la caja. Siempre está visible.
- Densidad: 1-2 líneas cortas, unas 6-10 palabras como máximo antes de reiniciar.

## Movimiento
- El personaje cambia de pose (brazo alzado, señalar). El parpadeo y el «habla» se resuelven con cambios de sprite, no con interpolación suave.
- Los objetos aparecen con un pequeño salto o destello: estrellas, partículas de brillo, check verde.
- Hay contadores que suben (unos 5 → 17), barras que se llenan y un selector de menú que baja de opción en opción.
- Cámara: un ligero desplazamiento lateral en la galería (*travelling*). Casi sin zoom.

## Transiciones
- Entre escenarios, un **destello blanco con retícula de puntos** que pixela la imagen (f_00010, a 4,5 s).
- Dentro de un escenario, cambios de rótulo y de objeto sin transición visible.
- Cortes detectados con umbral 0,1: 11 planos, mediana 6,2 s. El ritmo visual real es mayor: cada frase añade un objeto o un rótulo (cada 1-3 s).

## Textura
- Sprites con píxeles grandes (estimación a ojo en un recorte ampliado: unos 10 px de salida por píxel de sprite). Bordes nítidos y paleta corta por sprite.
- **No es pixel-perfect puro:** los fondos llevan desenfoque de profundidad de campo, *bloom* en luces y pantallas, rayos de luz y viñeteado.
  Conviven escalas de píxel distintas (sprites, iconos y texto).
- Fondo dominante violeta y azul noche; acentos naranja (insignias, etiqueta del nombre), verde (OK) y rojo (aspa).

## Sonido
- -14,1 LUFS, LRA 2,3 LU, pico -3,3 dBTP. **Sin silencios** (0 tramos de ≥0,3 s por debajo de -35 dB): la voz es continua sobre una cama musical.

## Qué podemos tomar (lenguaje, no contenido)
1. La caja de diálogo como subtítulo del short, con un avatar propio (¿el gato?).
2. Rótulo con palabra clave en color y titular pixel pesado arriba.
3. Ideas convertidas en elementos de interfaz de juego (barra, menú, contador, check o aspa).
4. Escenario por bloque temático y destello pixelado entre bloques.
5. Postproceso suave (desenfoque y brillo) sobre pixel art: rompe la hipótesis de «×4 exacto sin suavizado». **Hay que decidirlo en C4.**
