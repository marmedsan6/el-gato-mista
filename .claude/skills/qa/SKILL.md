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
9. Prepara `publicacion.json` (fichero, título, descripción con fuentes y créditos de `fuentes.json`, etiquetas y portada mirando el
   fotograma) y pregunta a Mario lo que falte: `contains_synthetic_media` y cualquier duda del texto. Así su orden de subir no se
   encuentra con preguntas.
10. Enséñale el máster. Si pide cambios, se vuelve a Escenas (`reviews/iter-NN.md`); si da la orden de subir, skill `publicar`.
