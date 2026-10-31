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

## Plan de ejecución de la hoja de ruta (2026-10-29)
- 2026-10-29 · Web legal en la rama `gh-pages` (desde `web-antigua`), y Pages sirve solo esa rama; `main` = proyecto — mantiene las URLs legales sin publicar los docs. ADR 0003.
- 2026-10-29 · Se trabaja en la rama `claude/elgatomista-execution-plan-c8445b` (worktree), reapuntada a `main`; Mario la fusiona al final.
- 2026-10-29 · 3.ª referencia: el agente propone 3 candidatas y Mario elige; descargas una a una con permiso.
- 2026-10-29 · Techo de gasto de los pilotos (voz, música, efectos): 5 $ en total, consultando cada gasto.
- 2026-10-29 · `critico-visual` con modelo opus — mejor juicio visual; se avisa antes de cada pasada.
- 2026-10-29 · Piloto de motor con las 3 candidatas: HyperFrames (plugin oficial, scope project), Playwright+FFmpeg propio y Remotion (skills `remotion:*`; licencia gratis para particulares, revisar el cambio de la 5.0) — «estamos iterando»: el ADR podrá revisarse.
- 2026-10-29 · Primer vídeo: **solo short**, sobre la compra de Mithril Medicine por Anthropic (IA en medicina) — prueba de punta a punta; se aparta de la regla de dos formatos por decisión de Mario.
- 2026-10-29 · Opus a esfuerzo alto (no Max) en C2-C4 de la calibración.
- 2026-10-29 · Commits solo al final del plan, con orden expresa de Mario.
- 2026-10-29 · ref-03 = 1Bit1Pixel «¿De dónde saca tu computadora un número al azar?» (youtube GLhWpKjFUzs) — en español y la más cercana a infografía por código con paleta fija.

## Estilo · respuestas de C4 (2026-10-29)
- 2026-10-29 · Pixel art con postproceso (desenfoque de fondo, bloom, rayos) sobre lienzo 480×270 / 270×480 ×4 — elección de Mario (P1, P2); detalle en docs/estilo/respuestas.md.
- 2026-10-29 · **Sin personaje ni narrador visible** — Mario (P5); las ideas se cuentan con interfaz de videojuego como lenguaje base (P22).
- 2026-10-29 · Short: caja de diálogo JRPG sin avatar con texto palabra a palabra; palabra clave en caja de selección pixel; algo nuevo cada 2-4 s; sin pausas; sin llamada a la acción final — Mario (P8, P13, P14, P15, P23).
- 2026-10-29 · Largo: algo nuevo cada 3-8 s, pausas de 0,3-0,8 s; el mismo mundo visual que el short — Mario (P9, P15, P21).
- 2026-10-29 · Titulares pixel pesados en mayúsculas, datos en monoespaciada; curva escalonada; cámara fija + travelling lento; destello pixelado entre bloques — Mario (P3, P4, P10, P11, P12).
- 2026-10-29 · Se mantienen las prohibiciones de etiquetas en esquinas y fundidos de entrada; fuente del dato pequeña en pantalla y en la descripción — Mario (P16, P17, P18).
- 2026-10-29 · Sonido: chiptune suave continuo + bleeps de 8 bits. Nunca neón chillón/arcoíris ni sonidos estridentes — Mario (P19, P20, P24).
- 2026-10-29 · Render en modo «nitido» (el navegador pinta a ×4: texto y cifras suaves, pixel art en los dibujos) y no «pixel» (×1 + vecino) — Mario: «el nítido se ve mejor».
- 2026-10-29 · C5a dado por bueno por Mario («Están bien, sigue») con modo nitido.
- 2026-10-29 · Motor de render: **propio** (Playwright + chrome-headless-shell + FFmpeg en motor/) — el más rápido, reanuda por fotograma, sin red ni licencias; Remotion como alternativa. Mario lo confirma tras ver los 3 vídeos («me parecen los 3 muy parecidos»). ADR 0004.
- 2026-10-29 · Clip C5b v2 aprobado por Mario («Me gusta, aprobado»): se cierra la calibración como **estilo v1** (C7).
- 2026-10-29 · PUERTA 1 del short mithril-ia-medicina aprobada por Mario («Aprobado»), sobre la SHA-256 del guion en reviews/puerta-1.md.
- 2026-10-29 · Piloto de voz con **Google Chirp 3 HD + Gemini TTS + Inworld**, en planes gratuitos por ahora; si sale bien, se pasa al de pago (consultándolo) — Mario. Chirp 3 HD exige cuenta de facturación con tarjeta aunque se use el millón de caracteres gratis al mes.
- 2026-10-29 · Música y efectos de Pixabay / Freesound (solo CC0), con permiso por cada descarga — Mario.
- 2026-10-30 · Voz: **Gemini 3.8 Flash TTS «Orus»** (principal) y «Charon» (secundaria), elegidas por Mario a ciegas entre 8 (Chirp 3 HD, Gemini, Inworld); plan gratuito por ahora. ADR 0006.

## Estilo v2 · opinión sobre el primer short (2026-10-30)
- 2026-10-30 · Short v1 de mithril-ia-medicina = versión interna, no se publica; se rehace como v2 con el estilo v2 — Mario.
- 2026-10-30 · Se conservan: cambios de plano con destello, palabras recalcadas con sonido y caja de diálogo de videojuego pixel — Mario («me gusta mucho»).
- 2026-10-30 · **Gato narrador** (sustituye a P5 «sin personaje»): negro con ojos naranjas, en escena, con poses, parpadeo, boca y cola; la voz es suya y la caja lleva su retrato y la etiqueta «MISTA» — Mario.
- 2026-10-30 · Más vívido: escenarios pixel ilustrados por bloque, paleta ampliada (3-4 acentos por escena) y props temáticos que reaccionan a la explicación y al gato — Mario.
- 2026-10-30 · Blip de selección propio en cada palabra clave — Mario.
- 2026-10-30 · ~~Gato negro con ojos naranjas~~ → **gato atigrado naranja** según el boceto de Mario (rayas y «M» en la frente, pecho, hocico, patas y punta de la cola crema, ojos ámbar verdosos con pupila vertical, nariz y orejas rosas); boceto en .runtime/marca/gato-referencia-mario.webp (fuera de git, repo público).
- 2026-10-30 · Fotogramas del estilo v2 aprobados por Mario («Me gusta, sigue»); regla de escala: personaje y objetos a ×2, escenario y texto a ×1. Se rehace el short como v2 con la misma voz y el mismo guion (PUERTA 1 vigente).
- 2026-10-30 · El retrato de MISTA en la caja de diálogo no mueve la boca; solo parpadea. La boca se mueve en el MISTA de la escena — Mario («Quieta con parpadeo»).
- 2026-10-30 · Efectos solo en los momentos clave: destellos, blip por palabra clave, acierto y error en los datos decisivos y 1 tick al completarse cada contador. Nada de ráfagas de ticks ni de sonido al aparecer cada tarjeta mientras MISTA habla (de 50 a 16 en el short) — Mario («Solo lo clave»).

## Exportar y publicar (2026-10-30)
- 2026-10-30 · Exportar y publicar se replican de `canal-noticias-ia` — Mario. ADR 0008.
- 2026-10-30 · **Sin huellas:** la orden de subir de Mario basta y sale a todas las redes de una vez — Mario («no me pida huellas… que lo suba ya directamente a todas las redes sociales del tirón»). Sustituye a «sobre la huella exacta» de las decisiones del 2026-10-29.
- 2026-10-30 · YouTube: **canal Pod 02** (`UCA76YezyGjv7spjOfRqAKNA`) y la app OAuth actual, no un canal «elgatomista» aparte — Mario (formulario del plan), aun avisado de que mezcla los dos proyectos en un canal.
- 2026-10-30 · Las credenciales y el entorno de Python se comparten con `canal-noticias-ia` en `~/.clipping-ia` — así no hay que reconectar ni instalar nada.
- 2026-10-31 · Efectos a -18 dB (antes -12) y atados a lo que pasa en pantalla: un objeto aparece o reacciona, un contador se completa o llega una transición. Nunca al ritmo del texto del diálogo (14 en el short) — Mario («Bastante: -18 dB», «Pasarlos a la pantalla»).
- 2026-10-31 · Sin pantalla blanca entre bloques: transición de desplazamiento lateral de 0,4 s, como pasar de pantalla en un juego de plataformas. MISTA sale con su escenario y reaparece con un saltito en el nuevo — Mario («Desplazamiento lateral»).
- 2026-10-31 · Fondos «vivos pero tranquilos»: 3-4 cosas que se mueven siempre en cada escenario (luces, polvo, paquetes de datos, ventiladores, nubes, animales), sin tapar los datos — Mario.
- 2026-10-31 · El short de Mithril sale en su v3 y, de momento, solo a YouTube — Mario («ese vamos a subir a youtube de momento»).
- 2026-10-31 · El short v3 se publica en público **sin declarar contenido sintético** y sin la frase «Este canal se produce con ayuda de Claude» — Mario («Sí, sin declarar»). La descripción sigue diciendo que la voz es sintética. Vale para este short; en los siguientes se vuelve a preguntar.
- 2026-10-31 · El short v3 también va a Instagram y a la bandeja de TikTok — Mario («Súbelo también a Instagram y TikTok»). Sustituye a «de momento, solo YouTube».
- 2026-10-31 · Las tareas mínimas y bien definidas las hace el último modelo barato de frontera (hoy, Haiku), no «Haiku» a secas — Mario.
- 2026-10-31 · **Dudas:** antes de generar cada pieza se le pregunta a Mario lo que no esté decidido y sirva para refinar el vídeo, y se genera con sus respuestas — Mario («que siempre me pregunte las dudas que tenga para refinar el vídeo»). La orden de subir sigue sin preguntas: las dudas se resuelven antes.
- 2026-10-31 · phonic-1-voz: largo y short, enfoque explicativo («oye mientras hablas»), gancho «no, la del martes», MISTA impresionado sin tragárselo, con los bloques «te pasará a ti» y clips de la llamada — Mario. Público general, sin jerga; la voz de Sofia queda fuera de los clips hasta saber si es una persona real.
- 2026-10-31 · PUERTA 1 de phonic-1-voz aprobada («Sí, me gusta el guión»). Producción de una tirada; Mario revisa los másteres y da la orden de subir: nada se sube antes — Mario («Te lo paso y ordenas tú»).
- 2026-10-31 · phonic-1-voz: clips solo con la voz del modelo, sin preguntar a Phonic por `RT-4842`, sin declarar contenido sintético y sin la frase de Claude — Mario. La descripción dice que la voz es sintética.
- 2026-10-31 · Mario activa la facturación de Gemini para terminar la voz del largo, tras avisarle de que costaría menos de 0,10 $ («listo, ya debería dejarte»). A partir de aquí, cualquier gasto nuevo se sigue consultando.
- 2026-10-31 · Voz del largo al 96 % con `atempo` para llegar a 8 min sin regenerarla: evita un gasto no aprobado. Sustituye a «ritmo normal» del plan — decisión del agente.
- 2026-10-31 · Medidor de la voz de MISTA bajo los paneles del largo: da movimiento continuo aunque el panel tape el fondo — decisión del agente, la revisa Mario.
- 2026-10-31 · phonic-1-voz: largo y short publicados con la orden de Mario («Súbelos»), sin pedir cambios sobre la v1.
- 2026-10-31 · Música a -13 dB en este vídeo (antes -14): con -14 quedaba un silencio de 0,31 s tras el gancho del short — decisión del agente, 1 dB.
