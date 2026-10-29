# 0001 · Esqueleto del proyecto

- Fecha: 2026-10-29
- Estado: aceptada

## Contexto
Proyecto nuevo, sin reutilizar nada de otros proyectos, para producir vídeos largos y shorts
en español con voz sintética e imágenes por código.

## Decisión
- Ubicación `C:\Users\mario\proyectos\canal-videos`, fuera de OneDrive. Git solo local, rama `main`
  (sustituido por el ADR 0002: remoto en GitHub).
- `AGENTS.md` es la fuente única de instrucciones; `CLAUDE.md` solo la importa.
- Pesados en `.runtime/` (ignorada); `render/` y `salida/` de cada vídeo, ignoradas.
- `node_modules` en `motor/node_modules/`, no en `.runtime/` (Node lo busca junto a `package.json`).
- Dos formatos por vídeo con `timing`, `escenas` y `render` separados por formato.
- Estilo con una sola fuente: `docs/estilo.md` + `marca/tokens.json`.
- Plantilla de vídeo en `plantillas/proyecto/`.
- Historial: `memoria/` en el repo y nota resumen por hito en `HermesVault/canal-videos/`.

## Consecuencias
- Los vídeos generados no ocupan git; si se borra `.runtime/` se pierden cachés y renders.
- Las claves viven en `.runtime/claves/` con lectura denegada a los agentes.
