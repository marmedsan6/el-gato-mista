# 0008 · Exportar y publicar en las redes

- Fecha: 2026-10-30
- Estado: aceptada (Mario: «replicarlo tal cual», canal Pod 02, app OAuth actual y «no me pida huellas»)
- Completa: la decisión pendiente «diseño de la publicación por API» de `docs/arquitectura.md`

## Contexto
Exportar y publicar eran los dos únicos pasos del flujo sin construir. `canal-noticias-ia` ya los tiene funcionando y ha
publicado por API en Pod 02, `@elgatomista` y la bandeja de `pod02leo`. Mario pide copiar esa parte, y que su orden de subir
baste para salir a todas las redes de una vez.

## Decisión
- Código en `publicacion/` (Python, como el original), con los mismos nombres de fichero para poder compararlos.
  `youtube_upload.py` y `tiktok.py` son idénticos; `youtube_profiles.py`, `redes.py` e `instagram.py` cambian pocas líneas;
  `story_publication.py` conserva la lógica.
- `publicacion/aprobado.py` sustituye a `stories.py` del original: lee `reviews/puerta-2.md`, `publicacion.json` y `fuentes.json`.
- **`subir <slug> --orden "<palabras de Mario>"`** es la única vía de uso: comprueba, anota la orden con la SHA-256 del fichero
  vigente, exporta, publica en YouTube e Instagram y envía a la bandeja de TikTok. **Mario no escribe huellas**: sustituye a la
  confirmación por huella del original. La huella sigue por dentro para vincular lo subido con lo exportado y evitar duplicados.
- Cada red va aparte: un fallo no detiene a las demás y repetir la orden solo completa lo que falte.
  `--solo <red>` limita la subida cuando Mario lo pide; repetirla sin límite lleva el mismo vídeo a las que faltan.
- **Canal Pod 02** (`UCA76YezyGjv7spjOfRqAKNA`) y la app OAuth «Canal noticias IA», en vez de un canal propio «elgatomista».
- Se comparten con el otro proyecto las credenciales (`~/.clipping-ia/{youtube,meta,tiktok}`) y el entorno de Python
  (`~/.clipping-ia/venv`). Es una excepción a «claves solo en `.runtime/claves/`»: el motor exige credenciales fuera del repo,
  y `.runtime/` es distinta en cada worktree.
- Añadido al original: se para antes de subir si el título o la descripción superan el límite de YouTube o llevan `<` o `>`.
  Un rechazo al crear la sesión deja el checkpoint en `creacion-incierta` y bloquea los reintentos.
- Fuera por ahora: Telegram, métricas e inglés.

## Consecuencias
- Una sola orden publica en abierto en dos redes, sin segunda comprobación. Si se vuelve a renderizar y se repite la orden, es
  un fichero nuevo: YouTube e Instagram lo publican como otro vídeo, y TikTok se niega hasta revisar la bandeja.
- **TikTok no publica solo:** la app (sandbox) solo tiene `video.upload`, así que Mario termina el post en la app. Publicar
  directo exigiría otro permiso de TikTok (`video.publish`) y, según lo recordado de su documentación, pasar su auditoría.
- `redes.json` y `publicaciones.json` se versionan: evitan publicar dos veces si se pierde un worktree. No llevan tokens.
- Recrear `~/.clipping-ia` afecta a los dos proyectos.
- Pod 02 recibe vídeos de dos proyectos con estilos distintos. La protección contra duplicados de YouTube va por canal + SHA.
- Las páginas legales de la app ya nombran este canal y esta app: no hay que reescribirlas para YouTube (ADR 0003).
- El largo solo va a YouTube y solo está probado con ficheros de prueba.
- Los tests de `publicacion/` no los lanza el hook de cierre: `~/.clipping-ia/venv/Scripts/python.exe -X utf8 -m pytest publicacion/tests`.
