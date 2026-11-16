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
style_guide.md, publicacion.json, timing.*.json, piezas/ (lista.json, meta.json, tandas/), escenas/ (vacía: la escena sale de `plantillas/escenas/v7/`), render/,
reviews/ y salida/; y `grep -l "<slug>" proyectos/<slug>/*.md`
no devuelve ningún fichero.

## El flujo completo
Es el del diagrama «Flujo de ElGatoMista». Antes de generar cada pieza, pregunta a Mario con `AskUserQuestion` las dudas que tengas
y genera con sus respuestas. Las dudas son las que cambian el vídeo: no adivines, y no repitas lo que ya esté en el brief,
en `memoria/decisiones.md` o en el estilo. Si no tienes ninguna, sigue sin preguntar.

| Paso | Quién y con qué | Sale | Dudas típicas antes de generar |
|---|---|---|---|
| Fuentes y hechos | Opus; subagente `verificador-enlaces` | `fuentes.json`, `verificacion.md`, `reviews/enlaces.md` | Qué fuente manda si se contradicen |
| Guion | Opus | `guion.md`, cada párrafo con sus `[fN]` (de ahí sale la fuente de la caja); el short, con su duración estimada | Enfoque, gancho, qué matices cuentan, tono |
| **PUERTA 1** | Mario | `reviews/puerta-1.md` con la SHA-256 del guion | Se le pide aprobar o cambiar |
| Storyboard y estilo | Opus; skill `estilo` | `shotlist.md`, `style_guide.md` y la lista de piezas (`piezas/lista.json`: del set o nuevas) | Escenarios, qué se dibuja para cada dato, cambios de tema, zooms core |
| Voz | `motor/voz/generar.mjs` (largo: `por-bloques.mjs`), Orus **con** el `--estilo` de siempre (el último en `.runtime/cache/voz/gemini-*.meta.json`); en el short, `apretar-pausas.mjs` | audio en `.runtime/voz/<slug>/` | Ritmo, pronunciación de nombres; gasto, si lo hay |
| Alineación | `motor/voz/alinear.py`, `escrito.mjs` y `revisar-alineacion.mjs --corregir` | `timing.<formato>.json` con los límites de frase en los silencios | |
| Piezas (v7) | Opus; `motor/piezas/` (pasos abajo) | `piezas/` (tandas, `lista.json`, `meta.json`, `contactos.png`), `escenas/comun/piezas.js`, `reviews/piezas.md` | La hoja de piezas del vídeo: Mario la aprueba o tacha piezas |
| Escenas | Opus; skill `estilo`; plantilla de `plantillas/escenas/v7/`; `motor/timing-a-js.mjs --guion` | `escenas/<formato>/` | Enséñale fotogramas si hay una idea visual nueva |
| Lint | `node motor/revisar.mjs … --estricto` | 0 errores antes de renderizar entero | |
| Render | `motor/render.mjs` (un tramo: `--desde/--hasta`) | `render/<formato>/` | |
| Mezcla | `motor/eventos.mjs`, `motor/mezcla.mjs` | `salida/<formato>-vN.mp4` | Música y efectos, si no están decididos |
| QA | skill `qa` | `reviews/qa-vN.md`, `critica-vN-NN.md`, `publicacion.json` | Título, portada, contenido sintético, frases de la descripción |
| **PUERTA 2** | Mario ve el máster: pide cambios o da la orden de subir | | Si pide cambios, se vuelve a Escenas y se anota en `reviews/iter-NN.md` |
| Exportar y publicar | skill `publicar` | URLs en `memoria/videos.md` | Ninguna: su orden se ejecuta sin más preguntas |

## Piezas (estilo v7, ADR 0011)
Todo lo que tiene silueta sale de Codex; el código solo mueve, tiñe y pinta cielo, suelo y paredes. Comandos en `motor/README.md`.
1. **Lista** (`proyectos/<slug>/piezas/lista.json`), desde el storyboard: cada pieza `{"nombre", "de": "set" | "<tanda>"}`.
   Reutiliza del set (`motor/estilo/v7/set/catalogo.md`) lo que encaje en tipo, papel y escala; las personas, siempre.
2. **Tandas** (`piezas/tandas/NN-nombre.json`): hasta 3-4 piezas parecidas por hoja, con `tipo` de `motor/piezas/escala.json`
   y `pide` (qué es, sin estilo: eso lo pone `peticion.md`). Lo grande y plano (edificios altos, interfaces, estanterías),
   una pieza por hoja con «píxel MUY pequeño… debe medir de verdad N píxeles». Si Codex añade contexto, «SOLO el X».
3. **Generar:** `node motor/piezas/generar.mjs --tanda <tanda.json>` (las de tandas distintas pueden ir en paralelo). Pasa
   el set como referencia, pide un 25 % de más y convierte a la altura de la escala.
4. **Revisar en hoja** cada intento (`.runtime/piezas/<slug>/<tanda>/intento-N/contactos.png`), no pieza a pieza: lo que
   salga con píxel grueso («AVISO: … se queda en lo que trae»), con otra luz, con contexto de más o fuera de escala se
   pide de nuevo; lo bueno se acepta con `--aceptar N`. Tonos sueltos que desentonan se igualan por paleta (`igualar`).
5. **Meta** (`piezas/meta.json`): anclas internas medidas sobre la regla (`intento-N/regla/`), estados por paleta, `igualar`.
6. **Montar:** `node motor/piezas/montar.mjs <slug>` → `escenas/comun/piezas.js` y `piezas/contactos.png`.
7. **Puerta de estilo:** Mario ve **una hoja por vídeo** y aprueba o tacha; queda en `reviews/piezas.md`. Sin ella no se
   escriben escenas.
8. **Al cerrar el vídeo:** `node motor/piezas/promover.mjs <slug> a,b,c` sube al set lo que sirva a otros vídeos (con su meta).

Duración del short: la decides tú al escribir su guion. Que la explicación quede clara y sin ambigüedad manda;
el tope es 120 s y no hay que apretar hacia los 60 s. Si un punto no cabe bien explicado, alarga o quítalo entero,
pero no lo dejes a medias. Estima con caracteres/17 (Orus con el estilo de siempre) o caracteres/13 (estilo lento: thriller,
miedo) y anota la duración y el porqué en el comentario del `## Short`. Todos los comandos, en `motor/README.md`.

Cierre del short: si el vídeo tiene largo, la última frase de MISTA remite a él, adaptada al tema y con la misma idea
(«¿Te interesa saber más? Tengo un vídeo largo en YouTube que lo explica entero»), en voz y en la caja de diálogo
(Mario, 2026-11-02). Sin largo, el short termina con el dato.

Enlaces: los pone la subida, no se escriben a mano. Cada short sale en YouTube con «Vídeo completo» y el largo recibe
después los enlaces de sus shorts; Instagram y TikTok llevan el enlace al largo en YouTube (skill `publicar`).

Las dudas se resuelven antes de la orden de subir: esa orden no debe encontrarse con ninguna pregunta pendiente.
Al cerrar cada vuelta, actualiza `memoria/`.
