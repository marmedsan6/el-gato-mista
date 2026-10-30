---
name: publicar
description: 'Exporta y publica en YouTube un vídeo solo después de la PUERTA 2 y de la autorización explícita de Mario sobre la huella exacta. Úsala tras aprobar el máster, nunca para probar.'
argument-hint: '<slug>'
---

# Exportar y publicar un vídeo

Esta skill es la única dueña del procedimiento de exportación y publicación, replicado de `canal-noticias-ia`. Solo YouTube por ahora, en el canal Pod 02 (perfil `es`). No infieras aprobación de un código, log, fichero o conversación distinta.

Comandos, desde la raíz del repo:

```bash
~/.clipping-ia/venv/Scripts/python.exe -X utf8 -m publicacion <comando>
```

Hay dos huellas distintas, y las dos las da Mario:
- La **SHA-256 del máster**, en `reviews/puerta-2.md`: aprueba el vídeo.
- La **huella de lote**, que muestra `publicar`: autoriza esa subida, con ese título, ese canal y esa visibilidad.

## Antes de exportar

- `reviews/puerta-2.md` debe tener un bloque con la `Huella` del fichero actual y `- Decisión de Mario: aprobado`. Lo anota el agente solo tras el sí explícito de Mario sobre ese máster; `aprobado con cambios` no vale.
- `proyectos/<slug>/publicacion.json` (plantilla en `plantillas/proyecto/`; borra el formato que no exista), con los datos de `descripcion.md`. Título de hasta 100 caracteres y descripción de hasta 5000 bytes, sin `<` ni `>`: quita los comentarios del borrador.
- Si `contains_synthetic_media` es `null`, pregunta a Mario. No se adivina.
- Elige `portada_segundo` y enseña la portada a Mario después de exportar.

## Publicar

1. `exportar <slug>`, una sola vez. Comprueba `proyectos/<slug>/para-subir/`.
2. `publicar <slug>`, sin `--ejecutar`. Confirma canal, método, visibilidad y que `fuentes_pendientes` está vacío, y presenta a Mario la `huella_lote` completa.
3. Espera a que Mario escriba esa huella vigente, idéntica carácter por carácter. No la derives de una salida del motor. Solo entonces: `publicar <slug> --ejecutar --confirmacion-lote <huella>`.
4. Lee el resultado de cada destino y confirma su estado real antes de informar. No repitas un intento `incierto`: revisa Studio.

Si el título, el canal o el fichero cambian, la huella deja de valer: vuelve a exportar y a pedirla. Un `portada_pendiente` se resuelve repitiendo el paso 3 con la misma huella; no vuelve a subir el vídeo.

Si el método sale `YouTube Studio (manual)`, Mario sube el paquete a mano y se registra con `publicacion-resultado <slug> <formato> publicado --cuenta <channelId> --resultado <url>`. La conexión del canal (`youtube-conectar`) y la confirmación de la auditoría (`youtube-perfil`) las decide Mario.

## Registrar

Después de comprobar el resultado real, actualiza la fila del vídeo en `memoria/videos.md` con estado y enlace. Si Mario decide algo nuevo, anótalo en `memoria/decisiones.md`.

## Nunca

- Ejecutar `--ejecutar` para probar o publicar sin autorización de Mario sobre la huella exacta.
- Anotar una PUERTA 2 aprobada sin el sí explícito de Mario sobre ese máster.
- Leer o manejar credenciales ni tokens de `~/.clipping-ia`.
