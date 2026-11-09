---
name: estilo
description: Estilo visual vigente de ElGatoMista (pixel art de interfaz de videojuego con el gato MISTA como narrador). Úsala antes de escribir o revisar cualquier escena, storyboard o shotlist, y al preparar el QA visual de un vídeo.
---

# Estilo vigente: v5 (diorama animado a 4 px; MISTA solo en los temas; aprobado el 2026-11-09, ADR 0009)

No copies valores aquí: léelos siempre de la fuente, que es la única que vale.
1. `docs/estilo.md`: empieza por su bloque «Estilo vigente», que manda sobre las reglas v1 que siguen debajo.
2. `docs/decisiones/0009-estilo-v5.md` y `memoria/decisiones.md`: el porqué de cada cambio. La v2, la v3 y la v4 son historial (ADR 0007).
3. `marca/tokens.json`: valores de la v1. Siguen valiendo salvo lo que cambie el bloque «Estilo vigente»; la paleta en rampas es `R5` de `motor/estilo/v5/dibujo.js`.
4. Implementación v5:
   - `motor/estilo/v5/dibujo.js` (rampas `R5`, sprites, cajas, persona, orbe, `ruta5`, `destello5`);
   - `motor/estilo/v5/escena.js` (`salto5`, `crearTextos5`, `crearDialogo5`);
   - además, `motor/estilo/{estilo.css, pixel.js, camara.js}` y `motor/estilo/v3/gato.js` (MISTA a 12 px).
   - No se editan: los ficheros v2 de `motor/estilo/`, `motor/estilo/v3/` y `motor/estilo/v3/congelado/`. Solo sirven para reproducir lo ya publicado.
5. Ejemplo de referencia: `motor/calibracion/v5/clip.{html,js}` (Mithril, fr01-fr03, en los dos formatos). El short publicado de Mithril sale de `escenas/short-v2/`.
6. Plantillas: `plantillas/proyecto/escenas/{short,largo}/escena-plantilla.html`.
7. Si el vídeo se desvía del estilo, lo dice `proyectos/<slug>/style_guide.md` (solo las desviaciones).

## Al escribir el storyboard
- Una **estación-diorama por idea**: un sujeto grande y con detalle delante; lo contado, en el fondo. Nunca casillas iguales en rejilla.
- Para cada dato, decide **qué se dibuja** (un objeto que cambia), no solo qué etiqueta lleva. Si sin la etiqueta no se entiende, rehaz el dibujo.
- **MISTA:** entrada de tema, cambios de tema (de pie 1-2 s) y cierre; pregunta a Mario cuáles son los cambios de tema.
- **Zooms core:** pregunta a Mario cuáles son las explicaciones core.

## Comprobaciones antes de dar una escena por buena
- [ ] **Contrato:** `seek(t)` pinta todo desde `t`, sin reloj ni animaciones CSS. Comprueba con `cd motor && npm test` (lint + determinismo) y con el render, que falla si hay temporizadores. Recorre la escena con `node motor/revisar.mjs` antes del render completo.
- [ ] **Fuentes:** solo las de `marca/fuentes/`. Press Start 2P a 8 o 16 px base y en mayúsculas, con `tildesPixel()` llamada después de crear el texto.
- [ ] **Paleta:** rampas de `R5` y los colores del canal; **3-4 acentos** por escena; `seleccion` solo en marcos; rojo nunca en texto pequeño.
- [ ] **Dinamismo:** algo nuevo cada 1-2 s y 3-4 cosas siempre en movimiento. Mide los huecos con una hoja muestreada con `select='not(mod(n,30))'`.
- [ ] **Movimiento:** entradas a saltos (`salto5`) o crecimiento, sin fundidos; desplazamiento lateral de 0,4 s entre temas; travellings de ~1,1 s. Mídelo con fotogramas seguidos a 60 fps.
- [ ] **Píxel:** todo el arte a 4 px (1 unidad = 1 px CSS), con contorno y 3 tonos incluso en los iconos. Solo MISTA va a 12 px, y el retrato a 6 px. Efectos dibujados a la rejilla (`destello5`), sin pixelfx.
- [ ] **MISTA:** nunca cortado por la caja; pies sobre su línea. Fuera de cuadro en los zooms.
- [ ] **Cámara:** zoom core a escalones hasta ×1,25, encuadrando el tablero entero con margen; corte seco al salir; plano general antes de cada travelling. Revisa cada zoom con fotogramas a tamaño completo.
- [ ] **Etiquetas:** junto a lo que nombran, con fondo oscuro y su fuente debajo; ninguna en la zona tapada ni cortada por el borde (`crearTextos5` las ajusta: créalas de izquierda a derecha); ninguna que afirme más que la voz.
- [ ] **Composición:** rótulo arriba a la izquierda. En el short, nada en la zona tapada (12 % arriba, 20 % abajo, franja derecha entre el 45 y el 85 %).
- [ ] **Legibilidad:** reduce a 360×640 (o 640×360) con `scale=...:flags=area` y léelo.
- [ ] **Crítico:** antes de enseñar a Mario, pasada de `critico-visual` (Opus: avisa de que gasta cupo).

Un cambio de regla → aprobación de Mario, decisión en `memoria/decisiones.md` y entrada en `docs/estilo.md`.
