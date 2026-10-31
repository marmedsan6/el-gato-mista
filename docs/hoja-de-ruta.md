# Hoja de ruta

Estado a 2026-10-29: esqueleto hecho (commit `1bdb0f3`), método definido, nada instalado.
Este fichero es la lista viva de lo pendiente: se tacha lo hecho con fecha y evidencia.

## Hecho
- 2026-10-29 · Esqueleto, AGENTS.md, docs/, memoria/, plantilla de vídeo (commit `1bdb0f3`).
- 2026-10-29 · Dudas resueltas: voz española masculina, 1080p a 60 fps, subtítulos en el short,
  SRT en el largo, publicación por API, música y efectos por IA, gasto siempre consultado.
- 2026-10-29 · Plan de ejecución aprobado (decisiones en memoria/decisiones.md, «Plan de ejecución»). Tanda A:
  - Rama del worktree reapuntada a `main` (`git log` → `e8cf679`).
  - Tarea 7 (parcial): 4 subagentes en `.claude/agents/` (3 haiku + `critico-visual` opus) y skills
    `nuevo-video` y `qa`; frontmatter validado. Falta que se carguen (reiniciar sesión) y probarlos con FFmpeg.
    El hook se hace cuando `motor/` tenga código.
  - Tarea 0 (local): rama `gh-pages` = `e9ffddd` y ADR 0003. Falta el push y activar Pages (Mario).
  - Tarea 8 (borrador): `docs/editorial.md` + `plantillas/proyecto/verificacion.md`. Faltan las respuestas.
  - Tarea 9 (inicio): `proyectos/mithril-ia-medicina/` (solo short) con brief, fuentes, verificación y guion
    (160 palabras, ~58-64 s, todas las `[fN]` existen). Falta la PUERTA 1.
  - Tarea 9: **PUERTA 1 aprobada** por Mario el 2026-10-29 (`proyectos/mithril-ia-medicina/reviews/puerta-1.md`, con la SHA-256
    del guion). `shotlist.md` (10 escenas en 4 bloques, tiempos provisionales; el hueco visual más largo es de 3,5 s, en el cierre)
    y `style_guide.md` (estilo v1 + desviaciones). Siguiente: piloto de voz (gasto y claves de Mario) → timing → escenas.
  - Tarea 5 (preparada): Mario elige Chirp 3 HD + Gemini + Inworld en planes gratuitos, y Pixabay/Freesound CC0 para la música.
    `motor/voz/generar.mjs` (3 proveedores, caché por huella, claves leídas por el script sin mostrarlas, marcas de Inworld)
    y `motor/voz/prueba-ciega.mjs` (8 candidatas, -16 LUFS, sorteo A-H con semilla, `escuchar.html`). Probado en modo
    `--simular`: 8 WAV a -15,9 LUFS.
  - Tarea 5 (en curso): `generar.mjs` lee claves en UTF-8/UTF-16 y, para Chirp, usa la credencial de gcloud con OAuth.
    Chirp 3 HD funciona: 16 voces masculinas es-ES y 3 candidatas sintetizadas (WAV 48 kHz mono, 26,8-27,2 s para 360
    caracteres, -18/-20 LUFS en bruto). Gemini e Inworld: el fichero de claves no tiene líneas `NOMBRE=valor` (lo arregla Mario).
    Dato: a ~13 caracteres/s, el guion del short (986 caracteres) duraría ~74 s, no 60.
  - Prueba ciega generada: 8 voces (3 Chirp 3 HD, 3 Gemini 3.8 Flash TTS, 2 Inworld TTS-2 castellanas) con el mismo texto,
    sorteadas como A-H en `.runtime/voz/prueba-ciega/` (-16,5 a -17,2 LUFS, 23,8-27,2 s; las 2 de Inworld con marcas por palabra).
    ~2.880 caracteres, todos en planes gratuitos.
  - **Tarea 5: voz elegida** en la prueba ciega: C = Gemini «Orus» (principal) y F = Gemini «Charon» (secundaria). ADR 0006.
    Velocidad: Mario elige «ritmo ágil» (indicación de estilo de Gemini).
  - Voz del short: `voz-short.txt` (991 caracteres) con Orus y estilo ágil → 57,8 s, -17,6 LUFS, 4 pausas de más de 0,5 s (la
    normal duraba 62,4 s, con 9 pausas). Alineación con faster-whisper 1.2.1 + large-v3-turbo (con permiso: entorno de 249 MB y
    modelo de 1,6 GB en `.runtime/`) → `timing.short.json`: 165/165 palabras casadas, sin solapes, y a ciegas (sin pista) un
    97,6 % (solo cifras y «Trambarger»): la voz leyó el guion aprobado. Siguiente: escenas.
  - Escenas del short: `proyectos/mithril-ia-medicina/escenas/short/` (`short.html` + `short.js` + `timing.js`, generado con
    `motor/timing-a-js.mjs`): 10 escenas en 4 bloques, cada elemento entra en su palabra alineada; destellos en las pausas
    de la voz. Render con `motor/render.mjs`: 1080×1920, 60 fps, 3.498 fotogramas, 58,3 s, sin violaciones del contrato (~5-6 min).
    QA previo: sin congelados; el `blackdetect` de 20,07-20,33 s era el inicio del bloque B casi vacío (1,2 % de píxeles
    claros) → ahora entra con los 11 laboratorios apagados.
  - Sonido: Mario elige la música M1 «Morning Coffee» (Pixabay) y los 5 efectos CC0 de Freesound, que acaba descargando el agente con permiso de Mario («si puedes hacerlo tú, hazlo»)
    (`docs/investigacion/musica-efectos-2026-10.md`). `motor/eventos.mjs` saca de la escena 42 efectos con sus tiempos y
    `motor/mezcla.mjs` mezcla voz + música (sidechain) + efectos (+1 fotograma) a -14 LUFS / -2,5 dBTP (probado con audio sintético).
  - Máster del short (v2): `salida/short.mp4`, 58,3 s, 1080×1920, 60 fps, -14,1 LUFS, -2,4 dBTP, 0 silencios, 0 congelados
    (el «negro» de 20,07-20,33 s es intencionado y está medido). Crítica Opus: pasa, sin bloqueantes; sus 3 defectos y los
    menores se arreglaron (línea de tiempo hasta finales de 2028, caja de diálogo por frases, arranques no vacíos). Fuentes
    reverificadas (`reviews/enlaces-puerta2.md`). QA en `reviews/qa.md`. PUERTA 2: Mario la deja como versión interna v1
    (`salida/short-v1.mp4`, `a7146cc9…cd3a`) y pide iterar al estilo v2.
  - Short v2 (2026-10-30), con el estilo v2 (ADR 0007) sobre el mismo guion y la misma voz:
    - Escena: `escenas/short-v2/`; máster: `salida/short-v2.mp4`, 58,3 s, -14,1 LUFS, -2,4 dBTP, 0 silencios, 0 congelados y 0 negros.
    - Diálogo: 165/165 páginas caben en 2 líneas (medido en Chromium).
    - Sonido: 50 efectos, con un blip de selección (m7) en cada palabra clave.
    - Crítico Opus: la 1.ª pasada no pasa por «distroñas» (ligadura «fi» de Pixelify Sans, ya corregida en `estilo.css`); la 2.ª pasa.
    - QA en `reviews/qa-v2.md`.
    - Iteración 02 (Mario): el retrato del diálogo no mueve la boca y los efectos pasan de 50 a 16, solo en los momentos clave (`reviews/iter-02.md`).
    - Iteración 03 (Mario, 2026-10-31):
      - desplazamiento lateral en lugar del destello blanco;
      - 14 efectos atados a la pantalla, a -18 dB;
      - fondos con movimiento.
    - Crítico Opus: pasa. Sale `salida/short-v3.mp4` (`reviews/qa-v3.md`, `reviews/iter-03.md`).
    - PUERTA 2 aprobada sobre la v3 (SHA-256 `43213645…1040`) con la orden de subir de Mario. **Publicada el 2026-10-31**: https://www.youtube.com/watch?v=Zte7Fyd7H4c (público y procesado, leído de la API de YouTube y de oEmbed). También en Instagram (https://www.instagram.com/reel/DfKAJ76E3qZ/) y enviada a la bandeja de TikTok, donde la termina Mario.
  - Tarea 3 (preparación): `motor/piloto/escena-spec.md`.
  - Tarea 2 (C0): 3 candidatas para ref-03 en `referencias/README.md` (metadatos con `yt-dlp --simulate`).
    ref-01 y ref-02 se listan sin sesión.
  - Tareas 5 y 6 (preparación): `docs/investigacion/precios-licencias-2026-10.md` con la propuesta de gasto.
  - Fuentes del short verificadas: `reviews/enlaces.md` da 4 OK y 1 PARCIAL (corregido en fuentes y guion).
  - Tarea 2 (C0 cerrado): ref-01, ref-02 y ref-03 (1Bit1Pixel, elegida por Mario) descargadas con permiso en
    `C:\Users\mario\proyectos\canal-videos\referencias\`; ffprobe: 77,9 s, 87,1 s y 411,8 s.
  - Tarea 2 (C1 cerrado): 3 subagentes haiku (siguiendo `extractor-fotogramas.md`) → fotogramas a 2 fps y hojas
    de contactos en `.runtime/referencias/<ref>/` del checkout principal (156, 174 y 824 fotogramas; 6, 6 y 28 hojas).
    `docs/estilo/analisis/ref-0{1,2,3}.json` recalculados con `herramientas/c1_recalculo.py`: planos con umbral
    0,1 → 11, 7 y 1 (ref-03 encadena con fundidos, puntuación máxima 0,093: su recuento no es fiable); paleta
    global que suma el 100 %. Sonoridad -14,1 / -14,1 / -14,3 LUFS.
  - Tarea 2 (C2 cerrado, Opus alto): `docs/estilo/analisis/ref-0{1,2,3}.md`. Revisadas 6/6, 4/6 y 4/28 hojas más
    recortes ampliados de ref-01. Hallazgos: ref-01 = pixel art de JRPG con caja de diálogo como subtítulo y postproceso
    (desenfoque, brillo); ref-02 = vectorial de aspecto 3D con karaoke y palabra «seleccionada» (no pixel); ref-03 =
    diagrama matemático mono con 2 acentos, sin cortes. La hipótesis «×4 exacto sin suavizado» queda en duda para C4.
  - Tarea 2 (C3 cerrado, Opus alto): `docs/estilo/analisis-comun.md` (8 rasgos comunes y 10 divergencias) y
    `marca/tokens.json` en borrador (12 colores con rol; JSON válido; escala entera ×4 comprobada; contraste del texto
    17,8:1 y de los acentos ≥ 4,7:1 sobre el fondo). Acento medido con `herramientas/c3_acentos.py`: 6,45 / 2,02 / 2,12 % del encuadre.
  - Tarea 2 (C4 cerrado): 24 preguntas respondidas por Mario en 6 rondas → `docs/estilo/respuestas.md`;
    `marca/tokens.json` pasa a `borrador-c4` (JSON válido). Siguiente: C5a, fotogramas fijos.
  - Preparación de C5a (con permiso de Mario): fuentes OFL en `marca/fuentes/` (Press Start 2P, JetBrains Mono y Pixelify
    Sans, cada una con su OFL.txt, descargadas de github.com/google/fonts; cabecera TTF válida). `playwright@1.64.1` y
    `pngjs@7.0.0` en `motor/piloto/propio/` (19 MB, sin descargar navegador; usa chrome-headless-shell-1243).
    `motor/piloto/propio/captura.mjs`: captura de prueba de 270×480 ×4 → 1080×1920, fuentes `loaded`, `seek(2)` coloca
    el objeto en x = 120 px base (esperado 120); Press Start 2P con 0 bloques 4×4 mixtos y JetBrains Mono con 432 (suavizado).
  - Tarea 4 (C5a, vuelta interna 01 → 02): 6 fotogramas fijos (3 short, 3 largo) en `motor/calibracion/c5a/` con texto neutro.
    Crítica Opus en `reviews/calibracion/critica-01.md`: no pasa, 3 bloqueantes (acentos, desbordes, tildes de P2P).
    Corregido en la iteración 02 (`.runtime/calibracion/iter-02/`, modos «nitido» y «pixel»): tildes pixel propias, 2 acentos
    por escena con `acento_azul` #5b8cff (6.03:1 sobre el fondo), paneles dentro de la zona segura (0 píxeles en la
    franja derecha de short-2) y modo pixel con 0 bloques 4×4 mezclados. Mario elige el modo «nitido» y da los fotogramas por buenos.
  - Tarea 3 (piloto de motor, medido): con permiso de Mario, `hyperframes@0.8.158` (110 MB) y `remotion` /
    `@remotion/cli` / `@remotion/renderer` 4.0.535 + react 18.3.1 (247 MB), versiones de más de 2 semanas, en
    `motor/piloto/<candidata>/`. npm 11 bloqueó el postinstall de esbuild, pero esbuild 0.25/0.28 funciona (prueba de
    transformación). Escena común pura en `motor/piloto/comun/escena.mjs` y medidas en `motor/piloto/comun/medir.mjs`.
    3 subagentes Sonnet implementaron propio, HyperFrames y Remotion. `motor/piloto/resultados.md`: las 3 son deterministas
    (PNG y MP4 idénticos byte a byte en 6 pasadas). En serie con el equipo libre, 25 s de largo tardan 22-24 s en propio,
    ~37 s en Remotion y ~80 s en HyperFrames. Solo propio reanuda por fotograma. ADR `0004-motor.md` en propuesta:
    motor propio. **Aceptado por Mario** el 2026-10-29.
  - Motor general `motor/render.mjs` (cualquier escena con `seek(t)`, reanudable, guardas de reloj) y `npm test` en `motor/`:
    4 tests en verde (lint del contrato con prueba de sus reglas, determinismo con PNG y MP4 idénticos, rechazo de una escena
    con `setTimeout`). Tarea 7: hook `.claude/hooks/verify-on-stop.sh` registrado en `.claude/settings.json`; probado
    con tests en verde (exit 0), primer fallo (exit 2) y segundo fallo (systemMessage).
  - Tarea 4 (C5b): clip de 18 s en `motor/calibracion/c5b/` (3 bloques con destello pixelado, caja de diálogo palabra a
    palabra, travelling). Render a 1080×1920 y 1920×1080, 60 fps, 1080 fotogramas, 18,000 s, en 32-43 s por formato.
    Determinista: MP4 y 4 PNG idénticos entre dos renders en orden distinto. Sin congelados de más de 2 s (freezedetect).
    Crítica Opus (`reviews/calibracion/critica-02.md`): no pasaba porque las hojas no mostraban el destello. Corregido en la v2
    (`.runtime/calibracion/c5b-v2/`): destello medido en el MP4 a 60 fps (pico en 5,97-6,03 s, luminancia 130/255), barra al 100 %
    con check, sin rojo en texto pequeño, movimiento escalonado medido (saltos de 12 y 16 px), determinista (MP4 y 4/4 PNG iguales).
    Mario: «Me gusta, aprobado» (`reviews/calibracion/iter-02.md`).
  - **Tarea 4 cerrada (C7, estilo v1):** `docs/estilo.md`, `marca/tokens.json` en `v1`, `marca/fuentes/` (3 OFL), estilo común
    en `motor/estilo/` (el traslado deja el clip idéntico: 4/4 PNG por formato), plantillas `plantillas/proyecto/escenas/`
    (renderizan y pasan el lint), skill `.claude/skills/estilo/` y ADR 0005. Tarea 2 cerrada.
  - Tarea 1: FFmpeg 9.0.2 (Gyan, full build) instalado con `winget install --id Gyan.FFmpeg -e --scope user`.
    PATH de usuario actualizado (hace falta reiniciar el shell). `ffmpeg -version` y `ffprobe -version` dan 9.0.2,
    están los filtros ebur128, loudnorm, silencedetect, freezedetect, blackdetect, tile y showinfo, y la prueba
    testsrc2 de 1 s a 60 fps (h264 + aac) la mide bien ffprobe.
- 2026-10-30 · Exportar y publicar, replicados de `canal-noticias-ia` en `publicacion/` (commits `3564968` y `bd83aa0`, ADR 0008):
  `subir` sube con la orden de Mario, sin huellas, a YouTube e Instagram y a la bandeja de TikTok. 96 tests en verde, sin red.
  Primeras subidas reales el 2026-10-31 (short v3): YouTube e Instagram publicados; TikTok, en la bandeja.

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
| 10 | Más adelante: miniaturas, mascota o logo | Decisiones | — |

Paralelizable: 2 (C0-C4) y 3 no dependen entre sí; 5, 6 y 8 tampoco. Lo que siempre espera a
Mario: instalaciones, gasto, elección de referencias, feedback de calibración y puertas.

## Repo remoto
Decidido en ADR 0002: `origin` = `marmedsan6/el-gato-mista` (público), sobrescribiendo la web
legal anterior. Los agentes no hacen `git push` (deny global); el push lo hace Mario.

## Dudas abiertas
- Miniaturas: quién las diseña y con qué estilo.
- Cupo de Opus en la calibración: se mide en C2.
- Legibilidad de fuentes pixel a 360×640: se resuelve en C4-C5.

## Segundo vídeo (2026-10-31)
- `proyectos/phonic-1-voz/`: primer largo de punta a punta (8:02) y su short (54,8 s), con PUERTA 1 aprobada y QA en `reviews/qa-*-v1.md`. Herramientas nuevas: `motor/voz/por-bloques.mjs` y `motor/voz/escrito.mjs`. Publicados el 2026-10-31 con la orden de Mario; TikTok queda en la bandeja. Enlaces en `memoria/videos.md`.
