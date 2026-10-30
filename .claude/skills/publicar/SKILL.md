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
5. Envía el short a la bandeja de TikTok (`pod02leo`).

Instagram y TikTok solo reciben shorts. No preguntes nada que el comando no haya pedido.

## Antes de la orden

`proyectos/<slug>/publicacion.json` (plantilla en `plantillas/proyecto/`; borra el formato que no exista), con los datos de `descripcion.md`. Título de hasta 100 caracteres y descripción de hasta 5000 bytes, sin `<` ni `>`: quita los comentarios del borrador. Elige `portada_segundo` mirando el fotograma.

Si el comando se para porque `contains_synthetic_media` es `null`, eso sí se le pregunta a Mario: no se adivina. Con su respuesta, repite la orden.

## Después

Lee el resultado de cada red y cuéntaselo a Mario con su estado real y sus enlaces. `completo: false` significa que falta algo.

- **TikTok no publica solo:** el vídeo queda en la bandeja y Mario termina el post desde la notificación. Díselo siempre; no lo cuentes como publicado.
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
