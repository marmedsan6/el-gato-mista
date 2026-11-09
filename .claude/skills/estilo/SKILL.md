---
name: estilo
description: Estilo visual vigente de ElGatoMista (pixel art de interfaz de videojuego con el gato MISTA como narrador). Úsala antes de escribir o revisar cualquier escena, storyboard o shotlist, y al preparar el QA visual de un vídeo.
---

# Estilo vigente: v3 (12 px, profundidad, luz y sombreado; aprobado el 2026-11-03) + iteración v4 (cámara de ref-01 con paralaje, detalle de objetos a 6 px y efectos de pixelfx; aprobada el 2026-11-06)

No copies valores aquí: léelos siempre de la fuente, que es la única que vale.
1. `docs/estilo.md`: empieza por su bloque «Estilo vigente», que manda sobre las reglas v1 que siguen debajo.
2. `docs/decisiones/0007-estilo-v2.md` y `memoria/decisiones.md`: el porqué de cada cambio.
3. `marca/tokens.json`: valores de la v1; siguen valiendo salvo lo que cambie el bloque «Estilo vigente».
4. Implementación v3: `motor/estilo/v3/` (`gato.js`, `props.js`, `escenarios.js`, `fx.js` + `fx/` generado con `node motor/fx-exportar.mjs`) más `motor/estilo/{estilo.css, pixel.js, camara.js}` (`aplicarCapas` para el paralaje). Los ficheros v2 de `motor/estilo/` y `motor/estilo/v3/congelado/` solo sirven para reproducir lo ya publicado: no se editan.
5. Ejemplo de referencia: `proyectos/mithril-ia-medicina/escenas/short-v6/` (estilo v3 completo). Calibración: para la cámara con paralaje, estaciones y efectos, `motor/calibracion/v4/clip.{html,js}`. El short publicado (v3 del vídeo) sale de `escenas/short-v2/`.
6. Plantillas: `plantillas/proyecto/escenas/{short,largo}/escena-plantilla.html`.
7. Si el vídeo se desvía del estilo, lo dice `proyectos/<slug>/style_guide.md` (solo las desviaciones).

## Comprobaciones antes de dar una escena por buena
- [ ] **Contrato:** `seek(t)` pinta todo desde `t`, sin reloj ni animaciones CSS. Comprueba con `cd motor && npm test`
  (lint + determinismo) y con el render, que falla si hay temporizadores.
- [ ] **Fuentes:** solo las de `marca/fuentes/`. Press Start 2P a 8 o 16 px base y en mayúsculas, con `tildesPixel()`
  llamada después de crear el texto (si no, ÁÉÍÓÚÑ se ven como minúsculas).
- [ ] **Paleta:** colores solo de los tokens; **3-4 acentos** por escena; `seleccion` solo en marcos; rojo nunca en texto pequeño.
- [ ] **Silencios y velocidad:** short con algo nuevo cada 2-4 s y sin pausas de voz; largo cada 3-8 s, con pausas de 0,3-0,8 s.
  Mide los tramos sin novedad en una hoja de contactos muestreada con `select='not(mod(n,30))'`.
- [ ] **Movimiento:** escalonado y en enteros del lienzo base; entradas por salto o crecimiento, sin fundidos;
  desplazamiento lateral de 0,4 s entre bloques. Mídelo con fotogramas seguidos a 60 fps, no con la hoja.
- [ ] **Píxel único:** todo el arte en unidades del lienzo v3 (12 px); nada dibujado a otra escala salvo el texto, el retrato y el detalle interior de los objetos y los efectos de pixelfx (6 px). Ningún objeto a ×2.
- [ ] **Efectos:** de pixelfx solo los puntuales, anclados a su causa y sin cifras ni texto propio; la interfaz de juego (escaneos, marcos, barras), dibujada a 12 px.
- [ ] **Paralaje y estaciones:** en reposo, el primer plano fuera de cuadro; cartelas de fuente nunca tapadas; texto de los tableros con su papel (nada flota sobre el primer plano).
- [ ] **Cámara:** plano de detalle solo en las explicaciones core (pregunta a Mario cuáles); zoom al entrar y corte al salir;
  en cada detalle, nada cortado en los bordes, en la zona tapada ni bajo la caja; fuentes a tamaño fijo. Mídelo con
  fotogramas a tamaño completo de cada plano de detalle.
- [ ] **Composición:** titular arriba a la izquierda; etiquetas junto a su objeto, nunca en esquinas; fuente del dato
  bajo la cifra; en el short, nada en la zona tapada (12 % arriba, 20 % abajo, franja derecha entre el 45 y el 85 %).
- [ ] **Legibilidad:** reduce a 360×640 (o 640×360) con `scale=...:flags=area` y léelo.
- [ ] **Crítico:** antes de enseñar a Mario, pasada de `critico-visual` (Opus: avisa de que gasta cupo).

Un cambio de regla → aprobación de Mario, decisión en `memoria/decisiones.md` y entrada en `docs/estilo.md`.
