---
name: qa
description: QA de un máster de ElGatoMista antes de la PUERTA 2 (audio, congelados, negros, hoja de contactos y crítica visual) con informe en reviews/qa.md. Úsala al terminar el montaje de un vídeo o tras arreglar defectos.
---

# QA de un máster

Umbrales: `docs/criterios.md` §4. Necesita FFmpeg en el PATH.

1. Entrada: `proyectos/<slug>/salida/<formato>-vN.mp4` (formato `largo` o `short`).
2. `ffprobe`: resolución (1920×1080 o 1080×1920), 60 fps, duración (largo 8-10 min; short ≤ 120 s).
3. Subagente `verificador-enlaces` otra vez, con fecha de consulta nueva, si es noticia o han pasado días desde la última
   comprobación. Deja `reviews/enlaces-puerta2.md`; comprueba en la fuente lo que marque como parcial antes de tocar el guion.
4. En paralelo:
   - subagente `qa-audio` sobre el máster, que escribe la sección `## Audio` de `reviews/qa.md`;
   - subagente `extractor-fotogramas` en modo QA, que deja medidas, congelados, negros y hojas en `.runtime/qa/<slug>-<formato>/`.
5. Aviso a Mario de que se gasta cupo de Opus y llamada al subagente `critico-visual` con las hojas, unos 12 fotogramas
   repartidos y sus versiones a 360×640 (`ffmpeg -i f.png -vf scale=360:-1 ...`). La crítica va a `reviews/critica-NN.md`.
6. Escribe `reviews/qa-vN.md`:
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
   Portada (Mario, 2026-11-09): se genera con Codex a partir de 1-2 fotogramas del máster, en pixel art 9:16 con MISTA y el
   título del vídeo, sin logotipos ni caras reales y con la franja derecha y el 20 % inferior libres:
   `codex exec --skip-git-repo-check -C <carpeta temporal> -s workspace-write -i <fotograma>.png "<instrucciones>"`.
   Se guarda en `salida/portada-codex-<letra>.png`, se enseña a Mario y va en `publicacion.json` como `portada_imagen`
   (la subida la usa en lugar del fotograma de `portada_segundo`, que sigue siendo obligatorio).
10. Enséñale el máster. Si pide cambios, se vuelve a Escenas (`reviews/iter-NN.md`); si da la orden de subir, skill `publicar`.
