# canal-videos · elgatomista

Producción de vídeos explicativos y de noticias en español con voz sintética e imágenes
generadas por código (estilo pixel art, por calibrar). Cada tema sale en dos formatos:

- **Largo**: 16:9, 8-10 min (YouTube).
- **Short**: 9:16, ~60 s, máx. 120 s (YouTube Shorts, TikTok, Instagram).

Estado: **esqueleto**. Sin motor de render, sin voz y sin estilo calibrado todavía.

## Dónde está cada cosa
| Ruta | Qué es | ¿En git? |
|---|---|---|
| `AGENTS.md` | Instrucciones para los agentes (fuente única) | Sí |
| `CLAUDE.md` | Solo importa `AGENTS.md` | Sí |
| `docs/arquitectura.md` | Diseño del sistema (borrador) | Sí |
| `docs/criterios.md` | Contrato de escena, fuentes, puertas y QA | Sí |
| `docs/estilo.md` | Estilo visual (se rellena en la calibración) | Sí |
| `docs/calibracion.md` | Método de calibración de estilo | Sí |
| `docs/hoja-de-ruta.md` | Qué está hecho y qué falta, en orden | Sí |
| `docs/decisiones/` | Registros de decisión (ADR) | Sí |
| `memoria/` | Decisiones, estado de vídeos y aprendizajes | Sí |
| `marca/` | Nombre, tokens y fuentes de la marca | Sí |
| `referencias/` | Vídeos de referencia de estilo | Solo el README |
| `motor/` | Código de render y sus tests | Sí (sin `node_modules/`) |
| `publicacion/` | Subir a YouTube, Instagram y la bandeja de TikTok (skill `publicar`, ADR 0008) | Sí |
| `plantillas/proyecto/` | Plantilla para un vídeo nuevo | Sí |
| `proyectos/<slug>/` | Un vídeo; `render/`, `salida/`, `para-subir/` y `trabajo/` ignoradas | Parcial |
| `.runtime/` | Claves, caché de voz, fotogramas, temporales | No |

## Empezar un vídeo (cuando exista el motor)
1. Copiar `plantillas/proyecto/` a `proyectos/<slug>/`.
2. Rellenar `brief.md` y seguir el flujo de `AGENTS.md`.

## Claves
Las variables necesarias están en `.env.example`. Los valores van en `.runtime/claves/.env`,
fuera de git y con lectura denegada a los agentes.

Historial resumido por hitos: `C:\Users\mario\HermesVault\canal-videos\`.
