# Iteración v3-01 · calibración del estilo v3 · 2026-11-03

- **Origen:** Mario pasa otra vez la referencia ref-01 (reel `De-F4riBJ1K`). Quiere que los vídeos se parezcan más a ella en cómo muestran las cosas y en la definición de los píxeles; si no se consigue, se queda el estilo actual.
- **Análisis (Opus):** comparación a resolución completa de ref-01 con el short v5.
  - La referencia usa un solo tamaño de píxel (~11 px) en todo. Nosotros mezclamos 8 px (MISTA y objetos) y 4 px (escenario).
  - Escenas simples con pocos objetos grandes.
  - Profundidad de campo fuerte: solo el plano medio nítido, con conos de luz.
  - Sprites sombreados a mano (3-4 tonos).
  - Cámara con acercamiento lento continuo y travelling por una galería, en el que el personaje sale de cuadro.
  - **Herramienta:** el reel trata de la skill HyperFrames; no sé con qué se hizo. La diferencia viene del dibujo y del desenfoque, no de un programa.
- **Respuestas de Mario:**
  - «Todo a ×3, 12 px» · «Sí, como la referencia» (profundidad e iluminación).
  - Formas de mostrar: «Escenas simples y grandes», «Acercamiento lento continuo», «Travelling por una pared de cuadros» y «Sprites sombreados a mano».
  - Largo: «Misma composición en 16:9».

## Qué se enseña
- **Clip de 15,4 s:** `.runtime/calibracion/v3/clip/clip-v3.mp4`, con escena en `motor/calibracion/v3/clip.{html,js}`. Es el tramo real de los matices de Mithril (35,0-50,4 s), con su voz.
  - Galería con un cuadro por idea: consultores, revisión por pares y 2028.
  - Rejilla de arte de 90×160 (12 px por píxel).
  - Pared y suelo desenfocados, conos de luz y polvo en la luz.
  - Acercamiento lento (de 12 a 13 px por píxel).
  - Travelling entre cuadros; MISTA se queda en el primero y reaparece en el tercero.
  - Zoom core en el «NO» y cartelas de fuente junto a cada cuadro.
- **Hoja de MISTA v3:** `.runtime/calibracion/v3/gato/t_0.png` (`motor/estilo/v3/gato.js`). Mismo diseño, ahora sombreado a mano.
- **Cámara:** `motor/estilo/camara.js` admite un mundo más ancho que la pantalla y el tipo «mover» (travelling o acercamiento continuo). La v5 sale idéntica (14/14 fotogramas).

## Me gustó (se conserva)
- (pendiente de Mario)

## No me gustó
- (pendiente de Mario)

## Cambia exactamente (qué · dónde · cómo)
- (pendiente de Mario)
