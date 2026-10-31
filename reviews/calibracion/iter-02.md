# Iteración 02 · 2026-10-29

- Qué se enseña: C5b, clip de prueba de 18 s a 60 fps con texto neutro, en short (1080×1920) y largo (1920×1080),
  renderizado con el motor propio (ADR 0004). Sin audio: la voz y la música llegan con sus pilotos.
  - Vídeos: `.runtime/calibracion/c5b-v2/short-a/clip-short.mp4` y `largo-a/clip-largo.mp4` (visor: `c5b-v2/ver.html`).
  - Escena: `motor/calibracion/c5b/clip.html` + `clip.js` (reutiliza `c5a/comun.css` y `comun.js`).
- Estructura: tres bloques de 6 s separados por un destello pixelado en t = 6 y t = 12.
  - A: contexto, fondo violeta.
  - B: dato (short) o diagrama con travelling (largo).
  - C: cierre (short) o menú de juego (largo).
- Revisión interna antes de enseñarlo: crítica Opus en `critica-02.md`, que no pasaba porque las hojas no mostraban el destello. Correcciones:
  - Destello comprobado en el MP4 fotograma a fotograma (los 4 casos). Sube a escalones desde 5,90 s, pico entre 5,97 y 6,03 s
    (luminancia media 130/255, al 85 %: se intuye la imagen) y vuelve en 6,10 s. Las hojas estaban mal muestreadas
    (`fps=2`); ahora se hacen con fotogramas exactos (`select=not(mod(n,30))`).
  - Barra «ESCANEANDO LUZ» hasta el 100 % con un check; etiquetas pequeñas sin rojo; la palabra clave sin el punto dentro de la caja;
    interior de las barras en el color `fondo`; caja de diálogo alineada con los paneles; cada frase solo dentro de su bloque.
  - Movimiento escalonado medido a 60 fps: la barra del short crece a saltos de 12 px de salida (3 px base) y la del largo a saltos de 16 px.
  - Determinismo: MP4 y 4 PNG idénticos entre dos renders con los fotogramas en orden distinto, en los dos formatos.
- Pendiente de revisar en el vídeo real (no es de estilo): en el diagrama del largo, el rojo y el azul llegan los dos al ojo.
- Posible ajuste: el texto de la caja de diálogo (12 px base) es el más pequeño de la pantalla. Se lee a 360 px, pero podría subir a 14.

## Me gustó (se conserva)
- Todo el clip: «Me gusta, aprobado» (Mario, 2026-10-29). Se cierra la calibración como estilo v1.

## No me gustó
- Nada señalado.

## Cambia exactamente (qué · dónde, con marca de tiempo · cómo)
- Nada.

## Cambios aplicados a tokens
- `.dialogo` de 208 px de ancho (alineado con los paneles), en `motor/calibracion/c5a/comun.css`.
