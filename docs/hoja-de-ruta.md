# Hoja de ruta

Estado a 2026-10-29: esqueleto hecho (commit `1bdb0f3`), método definido, nada instalado.
Este fichero es la lista viva de lo pendiente: se tacha lo hecho con fecha y evidencia.

## Hecho
- 2026-10-29 · Esqueleto, AGENTS.md, docs/, memoria/, plantilla de vídeo (commit `1bdb0f3`).
- 2026-10-29 · Dudas resueltas: voz española masculina, 1080p a 60 fps, subtítulos en el short,
  SRT en el largo, publicación por API, música y efectos por IA, gasto siempre consultado.

## Pendiente, en orden
| # | Tarea | Necesita a Mario | Bloquea a |
|---|---|---|---|
| 0 | **GitHub**: push forzado a `el-gato-mista` y decidir qué hacer con GitHub Pages (ADR 0002) | Sí, el push y Pages | — |
| 1 | **FFmpeg al PATH** (`winget install Gyan.FFmpeg`, ámbito usuario) y comprobar `ffmpeg -version` | Permiso de instalación | 2, 3, 5 |
| 2 | **Calibración C0-C4** (docs/calibracion.md): 3.ª referencia, Mario deja los 3 vídeos en `referencias/`, extracción (Haiku), análisis y puntos comunes (Opus alto), 10-30 preguntas | Elegir referencias, responder preguntas, aviso de cupo | 4 |
| 3 | **Piloto de motor**: escena pixel art de 20-30 s a 60 fps en las 3 candidatas (HyperFrames, Playwright+FFmpeg propio, Remotion); medir determinismo, tiempo de render, escalado entero; ADR con la elección | Permiso de instalación por candidata | 4, 9 |
| 4 | **Calibración C5-C8**: fotogramas fijos, clip 15-20 s, iteraciones «me gustó / no me gustó / cambia», estilo v1, `marca/tokens.json`, `marca/fuentes/`, skill `estilo` | Feedback en cada vuelta | 9 |
| 5 | **Piloto de voz**: prueba ciega voz española masculina (ElevenLabs, Gemini; Inworld si el precio encaja), coste real por vídeo frente a 10 $/mes, alineación (marcas del proveedor o WhisperX en CPU); ADR | Aprobación de gasto, escucha ciega | 9 |
| 6 | **Música y efectos por IA**: plataforma, licencia comercial verificada, prueba | Aprobación de gasto | 9 |
| 7 | **Subagentes** en `.claude/agents/` con `model: haiku`: `extractor-fotogramas`, `qa-audio`, `verificador-enlaces`; `critico-visual` con modelo fuerte. Skills `nuevo-video` y `qa`. Hook de verificación al cerrar el turno cuando `motor/` tenga código | No | 2 (el extractor conviene antes de C1) |
| 8 | **Proceso editorial**: fuentes de temas por categoría, cadencia semanal, nivel de verificación, plantilla de verificación de hechos | Decisiones | 9 |
| 9 | **Primer vídeo de punta a punta** (largo + short) con PUERTA 1 y PUERTA 2 | Aprobaciones | — |
| 10 | Más adelante: miniaturas, publicación por API (YouTube, TikTok, Instagram, que exige cuenta profesional; **antes, rehacer páginas de privacidad y condiciones**, que se perdieron al sobrescribir el repo — copia en la rama local `web-antigua`), mascota o logo | Decisiones | — |

Paralelizable: 2 (C0-C4) y 3 no dependen entre sí; 5, 6 y 8 tampoco. Lo que siempre espera a
Mario: instalaciones, gasto, elección de referencias, feedback de calibración y puertas.

## Repo remoto
Decidido en ADR 0002: `origin` = `marmedsan6/el-gato-mista` (público), sobrescribiendo la web
legal anterior. Los agentes no hacen `git push` (deny global); el push lo hace Mario.

## Dudas abiertas
- Miniaturas: quién las diseña y con qué estilo.
- Cupo de Opus en la calibración: se mide en C2.
- Legibilidad de fuentes pixel a 360×640: se resuelve en C4-C5.
