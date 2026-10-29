# Decisiones

## Tomadas antes de empezar (2026-10-29)
- 2026-10-29 · Contenido: explicativos y noticias, solo en español, voz sintética. Sin metraje propio ni edición de crudos.
- 2026-10-29 · Temas: videojuegos, curiosidades, noticias, IA y series, con enganche narrativo.
- 2026-10-29 · Formatos: largo 16:9 de 8-10 min y short 9:16 de ~60 s (máx. 120 s); mismo guion y estilo, compuestos por separado — nunca se recorta uno del otro.
- 2026-10-29 · Plataformas: YouTube (largo y Shorts); Instagram y TikTok, solo shorts.
- 2026-10-29 · Canal: «elgatomista». Línea visual de partida: pixel art — se calibra con referencias.
- 2026-10-29 · Imágenes por código (HTML/SVG/GSAP, formas 2D, etiquetas, diagramas, paleta fija). Vídeo por IA y Blender, solo opcionales más adelante.
- 2026-10-29 · Material público de terceros permitido, registrado en fuentes.json y acreditado.
- 2026-10-29 · Cada hecho se verifica con fuente antes de producir. Nada se publica sin aprobación de Mario sobre la huella exacta.
- 2026-10-29 · Flujo con PUERTA 1 (guion) y PUERTA 2 (vídeo) — ver AGENTS.md.
- 2026-10-29 · Presupuesto: suscripciones de Claude y Codex (20 $ cada una) + hasta 10 $/mes en APIs o suscripciones.
- 2026-10-29 · Proveedores de voz a probar: ElevenLabs, Gemini (Google AI Studio); Inworld según precio.
- 2026-10-29 · Sin decidir hasta el piloto: motor de render (HyperFrames / Claude libre con Playwright+FFmpeg / Remotion), voz, alineación (WhisperX), música y efectos.
- 2026-10-29 · Agentes: solo Claude por ahora. Opus a esfuerzo alto orquesta; subagentes Haiku para tareas pequeñas y definidas.
- 2026-10-29 · ~~Ubicación C:\Users\mario\proyectos\canal-videos; git solo local, sin GitHub.~~ Sustituida: ver «Repo remoto».
- 2026-10-29 · Historial: memoria/ y reviews/ en el repo + nota resumen por hito en HermesVault/canal-videos.
- 2026-10-29 · Pesados en .runtime/ dentro del repo (ignorada). Resultados se revisan como ficheros MP4/PNG sueltos.
- 2026-10-29 · Seguridad extra: deny de lectura de .runtime/claves/ y .env en .claude/settings.json del proyecto.
- 2026-10-29 · FFmpeg se añadirá al PATH por la vía más sencilla, preguntando a Mario cuando toque.
- 2026-10-29 · Calibración de estilo según docs/calibracion.md, antes de producir el primer vídeo.

## Respuestas a las dudas abiertas (2026-10-29)
- 2026-10-29 · Voz: española (de España), masculina — define la prueba ciega del piloto de voz.
- 2026-10-29 · Resolución 1080p a 60 fps en los dos formatos (1920×1080 y 1080×1920) — elección de Mario.
- 2026-10-29 · Short con subtítulos en pantalla — se ven sin sonido.
- 2026-10-29 · Largo con fichero SRT aparte, generado desde timing.largo.json, sin subtítulos en pantalla — confirmado por Mario.
- 2026-10-29 · Publicación por API — se diseña más adelante; la PUERTA 2 sigue siendo obligatoria antes de cualquier subida.
- 2026-10-29 · Música y efectos generados por IA (ElevenLabs, Google u otra plataforma similar) — falta comprobar que el plan permita uso comercial.
- 2026-10-29 · Material de terceros: el que aporte Mario se considera libre de reclamaciones; si se cuela algo con derechos, lo gestiona Mario — la responsabilidad final es suya.
- 2026-10-29 · Legibilidad de fuentes pixel a 360×640 — se resolverá en la calibración.
- 2026-10-29 · Nombre del proyecto: ElGatoMista.
- 2026-10-29 · Gasto: no se gasta dinero en APIs, suscripciones ni servicios de pago sin consultarlo antes con Mario (qué, cuánto y para qué).

## Repo remoto (2026-10-29)
- 2026-10-29 · Carpeta local C:\Users\mario\proyectos\canal-videos; remoto origin = github.com/marmedsan6/el-gato-mista (público) — decisión de Mario, aceptando que se sobrescribe la web legal anterior (GitHub Pages con privacidad y condiciones de la app de publicación) y que el proyecto queda público. ADR 0002.
- 2026-10-29 · Copia del contenido anterior del repo en la rama local `web-antigua` (no se sube).
- 2026-10-29 · El push lo hace Mario; los agentes no hacen git push (deny global).
