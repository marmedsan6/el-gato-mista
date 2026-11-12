---
name: publicar
description: 'Sube un vídeo a YouTube, Instagram y la bandeja de TikTok cuando Mario lo ordena en el chat, sin pedirle huellas. Úsala solo con su orden expresa, nunca para probar.'
argument-hint: '<slug>'
---

# Subir un vídeo a todas las redes

Esta skill es la única dueña del procedimiento de publicación, replicado de `canal-noticias-ia`. **Mario no escribe huellas** (decisión del 2026-10-30): su orden de subir basta y se ejecuta sin más confirmaciones.

Solo vale una orden de Mario en este chat, referida a este vídeo. No la infieras de un código, un log, un fichero, una conversación distinta o un aprobado anterior. «Me gusta» o «está bien» no son una orden de subir.

## Al recibir la orden

```bash
~/.clipping-ia/venv/Scripts/python.exe -X utf8 -m publicacion subir <slug> --orden "<palabras literales de Mario>"
```

El comando hace todo de una vez:
1. Comprueba los datos y, si falta algo, para sin escribir ni enviar nada.
2. Anota la orden en `reviews/puerta-2.md` con la SHA-256 del fichero vigente.
3. Exporta el paquete a `para-subir/`.
4. Publica en YouTube (Pod 02) y en Instagram (`@elgatomista`).
5. Envía el short a la bandeja de TikTok (`pod02leo`). Si el vídeo tiene varios shorts (`short-a`, `short-b`…), cada uno va aparte a Instagram y a TikTok, y el resultado de esas redes sale por short.

Instagram y TikTok solo reciben shorts. No preguntes nada que el comando no haya pedido.

**Calendario (Mario, 2026-11-12):** con largo, el primer short (A) sale a la vez que él (sin `fecha` en `publicacion.json`)
y los demás uno al día a las 12:00 desde el día siguiente (`fecha`). YouTube los deja privados con `publishAt`; Instagram
los publica en el momento. Si un short ya subido tiene que salir antes, con la orden de Mario:
`~/.clipping-ia/venv/Scripts/python.exe -X utf8 -m publicacion youtube-publicar-ya <slug> <formato>` (pide el permiso de
edición; no toca `publicacion.json` y lo anota en `publicaciones.json`).

**Enlaces (Mario, 2026-11-02):** los pone el comando, no se escriben en `publicacion.json`. El largo sube primero y cada
short sale con «Vídeo completo: <largo>»; al terminar, la descripción del largo recibe «Shorts de este vídeo» con
`videos.update`. Instagram lleva «Vídeo completo en YouTube: <largo>» (sin largo, «En YouTube: <el short>») y no sale
si ese vídeo aún no está en YouTube. Una descripción que ya trae enlaces de YouTube escritos a mano no se toca.

Si Mario limita las redes («de momento, solo YouTube»), añade `--solo youtube` (repetible). Repetir la orden después sin `--solo` lleva el mismo vídeo a las redes que faltan, sin volver a subirlo donde ya está.

## Antes de la orden

`proyectos/<slug>/publicacion.json`, que prepara la skill `qa` (plantilla en `plantillas/proyecto/`; borra el formato que no exista). Formatos válidos: `largo`, `short` y, si hay varios shorts, `short-<nombre>` (con su `timing.short-<nombre>.json`). Título de hasta 100 caracteres y descripción de hasta 5000 bytes, sin `<` ni `>`.

Si el comando se para porque `contains_synthetic_media` es `null`, eso sí se le pregunta a Mario: no se adivina. Con su respuesta, repite la orden.

## Después

Lee el resultado de cada red y cuéntaselo a Mario con su estado real y sus enlaces. `completo: false` significa que falta algo.

- **TikTok no publica solo:** el vídeo queda en la bandeja y Mario termina el post desde la notificación. Díselo siempre; no lo cuentes como publicado.
  Dale el `texto_para_tiktok` de cada short (título, resumen y enlace al largo en YouTube) para que lo pegue.
- **Portada vertical de cada short (comprobado el 2026-11-12):** la subida pone la portada de Codex como miniatura general
  (la horizontal, `maxresdefault`), pero la vertical que se ve en el feed de Shorts y en Studio (`oar2`) sigue siendo un
  fotograma. Hoy solo se cambia en **YouTube Studio desde un ordenador**: Contenido → Shorts → el short → Miniatura →
  «Subir archivo» (`salida/portada-codex-<letra>.png`, 9:16) → Guardar. Va en el mismo paso que el vídeo relacionado.
  Con Claude en el Chrome de Mario: `studio.youtube.com/video/<id>/edit`, `find` del `file-input` oculto de Miniatura y
  `file_upload` con la portada (sin pulsar «Subir archivo», que abre el selector nativo); luego Vídeo relacionado → el largo →
  Guardar («Se han guardado los cambios»). Vale también con el short aún programado.
- **Vídeo relacionado:** con largo, pon el largo como «vídeo relacionado» de cada short en Studio (Detalles → Vídeo
  relacionado → buscar por título → Guardar), desde el Chrome de Mario: la API no lo permite.
- **`enlaces: pendientes`** en un vídeo de YouTube: el largo no recibió los enlaces de sus shorts. Si el detalle pide
  `youtube-conectar`, falta el permiso de edición: Mario reconecta el perfil (ver ADR 0008) y se repite la orden, que solo
  añade los enlaces. Mientras, `descripcion_con_enlaces` es el texto que va.
- **Una red falla y las demás no:** repite la misma orden. Solo completa lo que falte y no duplica lo ya subido.
- **Instagram `subido`:** Meta aún procesa el vídeo. Repite la orden en un minuto.
- **`portada_pendiente` en YouTube:** al repetir solo se reintenta la portada.
- **Intento `incierto`:** no se repite solo. Mario revisa esa red antes de intentarlo otra vez.
- **`requiere_subida_manual`:** Mario sube el paquete desde Studio y se registra con `publicacion-resultado <slug> <formato> publicado --cuenta <channelId> --resultado <url>`.
- **Conexión caducada:** Mario la renueva con `instagram-conectar` o `tiktok-conectar`. `redes-estado` muestra lo que falta sin enseñar valores.

Actualiza la fila del vídeo en `memoria/videos.md` con estado y enlaces. Si Mario decide algo nuevo, anótalo en `memoria/decisiones.md`.

## Nunca

- Subir sin la orden de Mario, para probar, o en un modo sin supervisión.
- Publicar en TikTok de forma automática ni usar nada que pida pago, tarjeta o preautorización: solo APIs oficiales y sin coste.
- Leer o manejar credenciales ni tokens de `~/.clipping-ia`.
