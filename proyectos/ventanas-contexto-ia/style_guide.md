# Guía de estilo · ventanas-contexto-ia

- Estilo base: **estilo v3** (docs/estilo.md, bloque «Estilo vigente»; referencia `proyectos/mithril-ia-medicina/escenas/short-v6/`).
- Primer **largo en v3**: lienzo de 160×90 unidades (1 unidad = 12 px de salida) con la plantilla `plantillas/proyecto/escenas/largo/escena-plantilla.html`. MISTA en el tercio izquierdo, la idea en el centro-derecha, rótulo arriba a la izquierda y caja de diálogo abajo.
- Desviaciones de este vídeo (solo lo que cambia):

## La mesa de MISTA (Mario, 2026-11-03)
- Metáfora central: la **mesa de trabajo** del despacho. Lo que está encima es la ventana; lo que MISTA «sabe» va en un bocadillo de pensamiento sobre su cabeza, que no cambia.
- Los papeles son de colores fijos según lo que son: **tú** = crema (`papel`), **instrucciones ocultas** = gris con candado, **herramientas** = azul, **archivos** = verde, **respuesta de la IA** = naranja. Así el ojo los sigue de un bloque a otro.
- Barra de ocupación de la mesa sobre el canto, en escalones, como una barra de inventario. Cuando se llena, el papel más antiguo cae por el borde izquierdo a saltos (truncado).

## Escenarios nuevos (en `proyectos/ventanas-contexto-ia/escenas/comun/`, 160×90 y 90×160)
- `despacho` (horizontal): versión de 160×90 del despacho v3, con una mesa larga que cruza el plano.
- `fiesta`: sala con guirnaldas y una lámpara de bola; los invitados son fichas pixel (los tokens) unidas por líneas de saludo.
- `sala de servidores`, `laboratorio` y `azotea`: versiones de 160×90 de los de `motor/estilo/v3/escenarios.js` para el largo; en los shorts, los originales.

## Objetos nuevos
- **Token**: ficha cuadrada de 3×3 con borde, en los colores de su papel.
- **Contador de saludos**: marcador de juego que sube a escalones (curva escalonada) y tiembla 1 unidad cuando salta de orden de magnitud.
- **Chuleta**: hoja que se alarga hacia abajo y se sale del cuadro, con el contador de gigas.
- **Tabla de modelos**: menú de selección de personaje de videojuego (una fila por empresa, con la barra de su ventana a escala logarítmica); en el plano de detalle, la fila elegida lleva marco de selección.
- **Barra de acierto**: barra de vida que cae a escalones del 84,9 % al 26,3 % con el efecto de error.
- **Opinión**: tarjeta con el rótulo fijo «OPINIÓN» en `acento_dorado` y el nombre debajo, durante toda la frase (como «ESPECULACIÓN» en alien-isolation-ia).

## Cámara (Mario, 2026-11-03)
- Largo: plano de detalle solo en «lo oculto en la mesa» (bloque 3) y en la tabla de modelos y la caída de Gemini (bloques 8-9).
- Shorts: uno por short (A: lo oculto en la mesa, B: la caída de Gemini, C: la fiesta de saludos).
- El resto, en plano general con acercamiento lento.

## Sonido
- Chiptune suave de siempre (Pixabay/Freesound CC0) y efectos a **-24 dB** (Mario, 2026-11-03).
