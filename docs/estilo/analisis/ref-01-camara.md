# ref-01 · análisis de la cámara · 2026-11-06

- **Fuente:** reel `De-F4riBJ1K` (`referencias/ref-01.mp4`, 77,9 s).
- **Medidas** (Haiku, `herramientas/camara_ref.py`): correlación de fase a 15 fps sobre 3 bandas (fondo, medio y suelo) × 2 mitades. Datos en `.runtime/qa/ref01-camara/` (`movimiento.csv`, `resumen.json` y tiras de 0-20 s a 3 fps).
- **Interpretación:** Opus, contrastando los números con las tiras.
- **Ruido:** las medidas tienen ruido donde dentro de una banda hay texto o personajes animados. Por eso los números se leen junto a las imágenes.

## Planos
7 planos, con cortes en 4,7 · 10,9 · 24,7 · 37,7 · 56,4 y 69,3 s (diferencia de luminancia > 25). El corte es el destello pixelado.

## Qué hace la cámara
1. **Acercamiento lento continuo** dentro del plano: en la habitación (0-4,7 s) el personaje crece de una celda a otra.
2. **Travelling lateral con paralaje.**
   - **Desierto** (5-9 s): la carretera y las cajas del primer plano corren más que el personaje, y las montañas, el cielo y el sol apenas se mueven.
   - **Medidas:**
     - En 21-22 s, el fondo se mueve a ~0,5-0,65 de la velocidad del plano medio.
     - En 40 s, a ~0,25.
     - En otros tramos (8, 30-31 y 35 s) fondo y medio van igual, porque son paneles planos.
3. **Travelling y alejamiento a la vez** (galería, 13-15 s):
   - la cámara se desplaza y se aleja;
   - los cuadros se hacen más pequeños y aparecen más, hasta mostrar la pared entera (plano que revela);
   - los postes desenfocados del primer plano pasan más rápido.
4. **El personaje se queda atrás:** la cámara no lo sigue; sale de cuadro cuando la cámara se va a la idea siguiente.
5. **Movimiento suave:** acelera y frena. No hay zooms a escalones.

## Por qué no se replicaba
- Los escenarios v3 miden una sola pantalla (90×160 unidades): no hay sitio para un travelling dentro de un bloque. Solo caben el acercamiento y los zooms core.
- La cámara movía todo el mundo como una sola capa, así que no había paralaje.
- El travelling solo se probó en la calibración de la galería; no llegó a los vídeos.

## Qué hace falta (prototipo, paso 4)
- **Profundidad por capa en `camara.js`:**
  - `lejos` se desplaza a ~0,5 y escala menos;
  - `medio` y `frente` a 1;
  - `delante` a ~1,4.
  - Cada capa en su propio contenedor.
- **Escenarios más anchos** (2-3 pantallas) con una «estación» por idea, para que la cámara viaje de una a otra dentro del bloque.
- **Tipo de plano «revelar»:** travelling con alejamiento.
- **MISTA:** se queda en su estación y sale de cuadro al viajar; reaparece en la siguiente estación o al volver.
