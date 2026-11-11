# canal-videos · elgatomista

Producción de vídeos explicativos y de noticias en español con voz sintética e imágenes
generadas por código (pixel art a 4 px con el gato MISTA de narrador). Formatos:

- **Largo**: 16:9, 8-10 min (YouTube).
- **Short**: 9:16, hasta 120 s, lo que pida la explicación para quedar clara (YouTube Shorts, TikTok, Instagram).

Estado: en producción. Vídeos publicados y su estado, en `memoria/videos.md`; lo pendiente, en `docs/hoja-de-ruta.md`.

## Dónde está cada cosa
| Ruta | Qué es | ¿En git? |
|---|---|---|
| `AGENTS.md` | Instrucciones para los agentes (fuente única) | Sí |
| `CLAUDE.md` | Solo importa `AGENTS.md` | Sí |
| `docs/arquitectura.md` | Diseño del sistema y flujo por etapas | Sí |
| `docs/criterios.md` | Contrato de escena, fuentes, puertas y QA | Sí |
| `docs/estilo.md` | Estilo visual vigente (v6) | Sí |
| `docs/calibracion.md` | Método de calibración de estilo | Sí |
| `docs/hoja-de-ruta.md` | Qué está hecho y qué falta, en orden | Sí |
| `docs/decisiones/` | Registros de decisión (ADR) | Sí |
| `memoria/` | Decisiones, estado de vídeos y aprendizajes | Sí |
| `marca/` | Nombre, tokens y fuentes de la marca | Sí |
| `referencias/` | Vídeos de referencia de estilo | Solo el README |
| `motor/` | Render, voz, mezcla, lint, QA y bibliotecas de estilo (`motor/README.md`) | Sí (sin `node_modules/`) |
| `publicacion/` | Subir a YouTube, Instagram y la bandeja de TikTok (skill `publicar`, ADR 0008) | Sí |
| `plantillas/proyecto/` | Plantilla para un vídeo nuevo (se copia entera) | Sí |
| `plantillas/escenas/v6/` | Plantillas de escena del short y del largo (no se copian solas) | Sí |
| `proyectos/<slug>/` | Un vídeo; `render/`, `salida/`, `para-subir/` y `trabajo/` ignoradas | Parcial |
| `.runtime/` | Claves, caché de voz, fotogramas, temporales | No |

## Empezar un vídeo
Skill `nuevo-video`: copia `plantillas/proyecto/` a `proyectos/<slug>/`, rellena `brief.md` y sigue el flujo de `AGENTS.md`.

## Claves
Las variables necesarias están en `.env.example`. Los valores van en `.runtime/claves/.env`,
fuera de git y con lectura denegada a los agentes.

Historial resumido por hitos: `C:\Users\mario\HermesVault\canal-videos\`.
