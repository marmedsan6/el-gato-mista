---
name: estilo
description: Estilo visual vigente de ElGatoMista (pixel art de interfaz de videojuego con el gato MISTA como narrador). Úsala antes de escribir o revisar cualquier escena, storyboard o shotlist, y al preparar el QA visual de un vídeo.
---

# Estilo vigente: v6 (diorama animado a 4 px, casi sin texto, fuente en la caja; ADR 0009 y 0010)

No copies valores aquí: léelos siempre de la fuente, que es la única que vale.
1. `docs/estilo.md`: su bloque «Estilo vigente» es lo que manda.
2. `docs/decisiones/0010-estilo-v6.md` y `0009-estilo-v5.md`, y `memoria/decisiones.md`: el porqué de cada regla.
3. Implementación v6:
   - `motor/estilo/v6/escena.js` (`tiempos6`, `lienzos6`, `ruta6`, `crearTextos6`, `crearDialogo6`, `mista6`, `clave6`);
   - `motor/estilo/v6/piezas.js` (piezas reutilizables, `fondoNoche6`, `placa6`) y `estilo-v6.css`;
   - motores (subidos de como-google): `motor/estilo/v6/short.js` (`montarShort6`: el short entero; la escena solo pone
     estaciones, temas, textos y claves; nombres de fuente de ≤ 17 caracteres con `corto_short` en `fuentes.json` o
     `cortos`) y `motor/estilo/v6/largo.js` (`montarLargo6`: un mundo por bloque; `desfase6`; `?hasta=N`);
   - debajo, sin cambios: `motor/estilo/v5/dibujo.js`, `motor/estilo/{estilo.css, pixel.js, camara.js}` y `v3/gato.js`.
   - No se editan: los ficheros v2 de `motor/estilo/`, `v3/`, `v3/congelado/` y `v5/`. Reproducen lo ya publicado y
     `npm test` compara sus huellas. Lo que un vídeo dibuje y sirva a otro se sube a `v6/piezas.js`.
4. Ejemplos: `proyectos/como-google-sabe-lo-que-quieres/` (el estándar: largo y tres shorts, con los motores en su versión
   de proyecto), `proyectos/nvidia-huang-espionaje/escenas/short-v4/` (9:16) y `motor/calibracion/v6/clip.{html,js}` (16:9).
5. Plantillas: `plantillas/escenas/v6/short/` (con `montarShort6`) y `plantillas/escenas/v6/largo/` (con `montarLargo6`):
   copia `escena-plantilla.html` a `escenas/<formato>/`. Un vídeo nuevo parte de ahí, no de copiar otro proyecto.
6. Si el vídeo se desvía del estilo, lo dice `proyectos/<slug>/style_guide.md` (solo las desviaciones).

## Al escribir el storyboard
- Una **estación-diorama por idea**: un sujeto grande y con detalle delante; lo contado, en el fondo. Nunca casillas iguales.
- Para cada dato, decide **qué se dibuja** (un objeto que cambia). Si sin texto no se entiende, rehaz el dibujo.
- **Texto, casi ninguno:** título, un rótulo por tema y, como mucho, 1 identificador o 1 cifra por estación. Los nombres
  propios, dentro del dibujo (`placa6`). Nada que repita la voz: la caja de diálogo ya la escribe.
- **Pieza clave** de cada estación: que entre 2 s o más antes del final de su frase (si caía en la última palabra, adelántala).
- **Gancho:** el título dura 2 s; que la primera frase no nombre nada que haya que ver antes.
- **MISTA:** entrada de tema, cambios de tema (de pie 1-2 s) y cierre; pregunta a Mario cuáles son los cambios de tema.
- **Zooms core:** pregunta a Mario cuáles son las explicaciones core. El zoom tiene que encuadrar entero lo que explica.

## Comprobaciones antes de dar una escena por buena
- [ ] **Lint, antes del render completo:** `node motor/revisar.mjs <html> <ancho> <alto> <duración> 0.05 <carpeta> [t1,t2] --estricto`
  da 0 errores (solapes, textos fuera de pantalla o en zona tapada, permanencia, textos a la vez, saltos, transcripción
  de la voz, fuente visible, piezas clave, rótulo al llegar). La escena declara `window.revision`.
- [ ] **Contrato:** `seek(t)` pinta todo desde `t`, sin reloj ni animaciones CSS: `cd motor && npm test`.
- [ ] **Alineación:** `node motor/voz/revisar-alineacion.mjs` sin desfases; la escena usa el timing ajustado.
- [ ] **Fuentes tipográficas:** solo las de `marca/fuentes/`. Press Start 2P a 8 o 16 px y en mayúsculas, con `tildes6()`.
- [ ] **Paleta:** rampas de `R5` y los colores del canal; 3-4 acentos por escena; rojo nunca en texto pequeño.
- [ ] **Dinamismo:** algo nuevo cada 1-2 s y 3-4 cosas siempre en movimiento (`qa.mjs` lista los tramos casi quietos).
- [ ] **Píxel:** todo el arte a 4 px, con contorno y 3 tonos incluso en los iconos. Solo MISTA va a 12 px.
- [ ] **MISTA:** nunca cortado por la caja ni encima de la pieza clave; fuera de cuadro en los zooms.
- [ ] **Cámara:** `ruta6` (sale tras el fin real de la frase; zoom de 0,4 s; corte y 0,5 s de general antes de viajar).
  Mira las tiras de movimiento de `qa.mjs`: nada cortado en los bordes dentro de un zoom.
- [ ] **Legibilidad:** los `_360` de `qa.mjs` se leen (placas del dibujo incluidas).
- [ ] **Crítico:** sobre el máster final, antes de enseñarlo a Mario (`critico-visual`, Opus: avisa de que gasta cupo).
  Dale la voz de cada frase y revisa las imágenes en hojas, no una a una.

Un cambio de regla → aprobación de Mario, decisión en `memoria/decisiones.md` y entrada en `docs/estilo.md`.
