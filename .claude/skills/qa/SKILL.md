---
name: qa
description: QA de un máster de ElGatoMista antes de la PUERTA 2 (medidas con motor/qa.mjs, lint de textos y crítica visual) con informe en reviews/qa-vN.md. Úsala al terminar el montaje de un vídeo o tras arreglar defectos.
---

# QA de un máster

Umbrales: `docs/criterios.md` §4. Necesita FFmpeg en el PATH.

1. Entrada: `proyectos/<slug>/salida/<formato>-vN.mp4` (formato `largo` o `short`).
2. `node motor/qa.mjs --proyecto <slug> --formato <formato> --version <N> --escena <html de la escena>`: ficha, huella,
   sonoridad, pico, silencios, congelados y negros; último instante de cada frase a tamaño completo y a tamaño de móvil,
   hojas a 2 fps y tiras de cada movimiento de cámara, en `.runtime/qa/<slug>-<formato>-vN/`. Deja el borrador de
   `reviews/qa-vN.md` y sale con 1 si una medida falla. No lo lances mientras corre un render.
   Pega en el informe el resumen de `node motor/revisar.mjs … --estricto` (tiene que dar 0 errores).
3. Subagente `verificador-enlaces` otra vez, con fecha de consulta nueva, si es noticia o han pasado días desde la última
   comprobación. Deja `reviews/enlaces-puerta2.md`; comprueba en la fuente lo que marque como parcial antes de tocar el guion.
4. Aviso a Mario de que se gasta cupo de Opus y llamada al subagente `critico-visual` **sobre el máster final** (no sobre
   una versión anterior), con la carpeta de `qa.mjs` y la voz de cada frase. Pídele expresamente: textos que se tocan o
   se leen juntos, que repiten la caja o afirman más que la voz, estaciones que no se entienden sin leer y choques en
   los movimientos. La crítica va a `reviews/critica-NN.md` (el crítico no escribe: cópiala).
5. Tú no abras los fotogramas uno a uno: mira las hojas y, como mucho, 3-4 sueltos (más de 20 imágenes bloquean el chat).
6. Completa `reviews/qa-vN.md` (el borrador de `qa.mjs`):
   ```markdown
   # QA · <slug> · <formato> vN · AAAA-MM-DD
   | Comprobación | Medida | Umbral | OK/FALLA |
   ## Audio
   ## Congelados y negros
   ## Crítica visual (enlace a critica-NN.md)
   ## Bloqueantes
   ```
7. Si hay bloqueantes, no se pasa a la PUERTA 2: se arregla y se repite esta skill.
8. Sin bloqueantes: `sha256sum` del máster y nuevo bloque en `reviews/puerta-2.md` con la decisión `pendiente` (formato en criterios.md §3).
9. Prepara `publicacion.json` (fichero, título, descripción mínima: solo el resumen del vídeo, sin fuentes, música ni créditos (Mario, 2026-11-02), etiquetas y portada mirando el
   fotograma). No escribas enlaces: la subida añade los del largo y sus shorts (skill `publicar`). Comprueba que un short
   con largo termina remitiendo a él (skill `nuevo-video`, «Cierre del short») y pregunta a Mario lo que falte: `contains_synthetic_media` y cualquier duda del texto. Así su orden de subir no se
   encuentra con preguntas.
   **Portadas, siempre con Codex** (Mario, 2026-11-09 y 2026-11-12): una para el largo y una para **cada** short, a partir
   de 1-2 fotogramas del máster y de uno con MISTA, en pixel art con MISTA y el título del vídeo, sin logotipos ni caras
   reales. Largo: 16:9 con la esquina inferior derecha libre (la duración); short: 9:16 con la franja derecha y el 20 %
   inferior libres. Las `-i` van **antes** de `-C` (si no, `-i` se traga el prompt); las cuatro pueden ir en paralelo (~8 min):
   `codex exec --skip-git-repo-check -i <mista>.png -i <fotograma>.png -C <carpeta temporal> -s workspace-write "<instrucciones>"`.
   Codex no da el tamaño exacto: se escala a 1280×720 o 1080×1920 (menos de 2 MB) y se guarda en
   `salida/portada-codex-largo.png` y `salida/portada-codex-<letra>.png` (`-short.png` si hay uno solo). Se enseñan a Mario
   y van en `publicacion.json` como `portada_imagen` (la subida la usa en lugar del fotograma de `portada_segundo`, que
   sigue siendo obligatorio). Ejemplo: `proyectos/como-google-sabe-lo-que-quieres/`.
   **Calendario** (Mario, 2026-11-12): el primer short (A, o el único) **sale con el largo**: sin `fecha`. Los demás, uno al
   día a las 12:00 (Madrid) desde el día siguiente: `fecha` en ISO con zona (`2026-11-14T12:00:00+01:00`), puesta con el día
   de la orden de subir.
10. Enséñale el máster. Si pide cambios, se vuelve a Escenas (`reviews/iter-NN.md`); si da la orden de subir, skill `publicar`.
