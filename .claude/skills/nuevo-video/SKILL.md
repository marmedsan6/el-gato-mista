---
name: nuevo-video
description: Crea un vídeo nuevo de ElGatoMista en proyectos/<slug>/ a partir de plantillas/proyecto/ y lo lleva por todo el flujo, preguntando a Mario las dudas antes de generar cada pieza. Úsala cuando Mario proponga un tema, cuando toque empezar el siguiente vídeo o para saber qué paso sigue.
---

# Nuevo vídeo

## Empezar
1. Lee `AGENTS.md` y `memoria/decisiones.md`.
2. Elige un `slug` en minúsculas con guiones (sin tildes, ≤ 40 caracteres). Si `proyectos/<slug>/`
   existe, para y pregunta.
3. Copia la plantilla: `cp -r plantillas/proyecto proyectos/<slug>`.
4. Pregunta a Mario las dudas del brief y rellena `proyectos/<slug>/brief.md` (todos los campos). Formatos: largo + short
   salvo que Mario diga otra cosa; si es solo uno, anótalo en el brief con la fecha y el motivo.
5. Pon el título en `guion.md`, `shotlist.md` y `style_guide.md` (sustituye `<slug>`).
6. Añade la fila del vídeo a `memoria/videos.md` (etapa: brief).

Comprobación: `ls proyectos/<slug>` muestra brief.md, fuentes.json, verificacion.md, guion.md, shotlist.md,
style_guide.md, publicacion.json, timing.*.json, escenas/, render/, reviews/ y salida/; y `grep -l "<slug>" proyectos/<slug>/*.md`
no devuelve ningún fichero.

## El flujo completo
Es el del diagrama «Flujo de ElGatoMista». Antes de generar cada pieza, pregunta a Mario con `AskUserQuestion` las dudas que tengas
y genera con sus respuestas. Las dudas son las que cambian el vídeo: no adivines, y no repitas lo que ya esté en el brief,
en `memoria/decisiones.md` o en el estilo. Si no tienes ninguna, sigue sin preguntar.

| Paso | Quién y con qué | Sale | Dudas típicas antes de generar |
|---|---|---|---|
| Fuentes y hechos | Opus; subagente `verificador-enlaces` | `fuentes.json`, `verificacion.md`, `reviews/enlaces.md` | Qué fuente manda si se contradicen |
| Guion | Opus | `guion.md`, cada frase con su `[fN]`; el short, con su duración estimada | Enfoque, gancho, qué matices cuentan, tono |
| **PUERTA 1** | Mario | `reviews/puerta-1.md` con la SHA-256 del guion | Se le pide aprobar o cambiar |
| Storyboard y estilo | Opus; skill `estilo` | `shotlist.md`, `style_guide.md` | Escenarios, objetos, si se aparta del estilo |
| Voz | `motor/voz/generar.mjs`, Orus **con** el `--estilo` de siempre (el último en `.runtime/cache/voz/gemini-*.meta.json`) | audio en `.runtime/voz/<slug>/` | Ritmo, pronunciación de nombres; gasto, si lo hay |
| Alineación | `motor/voz/alinear.py` | `timing.<formato>.json` | |
| Escenas | Opus; skill `estilo`, `motor/timing-a-js.mjs` | `escenas/<formato>/` | Enséñale fotogramas si hay una idea visual nueva |
| Render | `motor/render.mjs` | `render/<formato>/` | |
| Mezcla | `motor/eventos.mjs`, `motor/mezcla.mjs` | `salida/<formato>-vN.mp4` | Música y efectos, si no están decididos |
| QA | skill `qa` | `reviews/qa-vN.md`, `critica-vN-NN.md`, `publicacion.json` | Título, portada, contenido sintético, frases de la descripción |
| **PUERTA 2** | Mario ve el máster: pide cambios o da la orden de subir | | Si pide cambios, se vuelve a Escenas y se anota en `reviews/iter-NN.md` |
| Exportar y publicar | skill `publicar` | URLs en `memoria/videos.md` | Ninguna: su orden se ejecuta sin más preguntas |

Duración del short: la decides tú al escribir su guion. Que la explicación quede clara y sin ambigüedad manda;
el tope es 120 s y no hay que apretar hacia los 60 s. Si un punto no cabe bien explicado, alarga o quítalo entero,
pero no lo dejes a medias. Estima con caracteres/13 y anota la duración y el porqué en el comentario del `## Short`.

Cierre del short: si el vídeo tiene largo, la última frase de MISTA remite a él, adaptada al tema y con la misma idea
(«¿Te interesa saber más? Tengo un vídeo largo en YouTube que lo explica entero»), en voz y en la caja de diálogo
(Mario, 2026-11-02). Sin largo, el short termina con el dato.

Enlaces: los pone la subida, no se escriben a mano. Cada short sale en YouTube con «Vídeo completo» y el largo recibe
después los enlaces de sus shorts; Instagram y TikTok llevan el enlace al largo en YouTube (skill `publicar`).

Las dudas se resuelven antes de la orden de subir: esa orden no debe encontrarse con ninguna pregunta pendiente.
Al cerrar cada vuelta, actualiza `memoria/`.
