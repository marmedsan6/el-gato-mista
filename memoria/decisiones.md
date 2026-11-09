# Decisiones

## Tomadas antes de empezar (2026-10-29)
- 2026-10-29 · Contenido: explicativos y noticias, solo en español, voz sintética. Sin metraje propio ni edición de crudos.
- 2026-10-29 · Temas: videojuegos, curiosidades, noticias, IA y series, con enganche narrativo.
- 2026-10-29 · Formatos: largo 16:9 de 8-10 min y short 9:16 de ~60 s (máx. 120 s); mismo guion y estilo, compuestos por separado — nunca se recorta uno del otro. La duración del short cambió el 2026-11-02: ver «Duración del short».
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

## Duración del short (2026-11-02)
- 2026-11-02 · El short ya no apunta a ~60 s: dura lo que necesite su explicación para quedar clara y sin ambigüedad, con tope de 120 s. Lo decide quien escribe el guion del short, mientras lo escribe, y anota en el `## Short` la duración estimada (caracteres/13) y el porqué — Mario («a veces, al tener duración pequeña, las explicaciones son un poco ambiguas o no se explica del todo bien»). Sustituye a «~60 s» de los formatos; el máximo de 120 s se mantiene.

## Logo de las redes (2026-11-02)
- 2026-11-02 · Logo nuevo para YouTube, Instagram y TikTok: MISTA tal cual sale en los vídeos (cabeza y pecho del sprite de `motor/estilo/gato.js`, a ×2) sobre fondo `fondo`/`panel` con aro `acento_naranja`, sin texto ni manos. Ojos verde lima `#8ccf3f` **solo en el logo**; en los vídeos siguen los amarillos del sprite (`#d8c94a`) — Mario («lo más fiel posible al que sale luego por los vídeos», «sin la palabra gato», «sin las manos», «esos no son verdes son amarillos», «Solo en el logo»). Sustituye al robot de la etapa Pod 02. Se genera con `marca/logo/generar.py` (lee el sprite: si cambia el gato, se regenera).
- 2026-11-02 · Logo puesto como foto de perfil en YouTube (canal `UCA76YezyGjv7spjOfRqAKNA`), Instagram (@elgatomista) y TikTok (@pod02leo) desde el Chrome de Mario — Mario («Cámbialas tú si tienes acceso»). YouTube y TikTok son las cuentas compartidas con `canal-noticias-ia`: allí también sale el gato.
- 2026-11-02 · Nombre de las cuentas: «El Gato Mista» y fuera «Pod02 Leo» — Mario. Hecho: nombre de YouTube y de Instagram (usuario @elgatomista sin cambios) y usuario de TikTok @el_gato_mista (`elgatomista` estaba cogido; elegido por Mario; no se puede volver a cambiar hasta el 2026-12-02). Pendiente: el identificador de YouTube sigue @Pod02-leo (Studio da «Vaya, se ha producido un error» al publicar @elgatomista, dos veces) y el apodo de TikTok sigue «pod02» (se confirma y no se aplica, dos veces).

## alien-isolation-ia (2026-11-02)
- 2026-11-02 · Tercer vídeo: la IA del xenomorfo de *Alien: Isolation* y qué podría cambiar en *Alien: Isolation 2*. Largo con un **70 % sobre el original y un 30 % sobre Isolation 2**, con la especulación marcada como tal — Mario.
- 2026-11-02 · **Dos shorts** con guion propio: A «el alien tiene dos cerebros» y B «qué cambia en Alien: Isolation 2» — Mario. Formatos `short-a` y `short-b` (escenas/, render/, timing.*.json). El motor no necesita cambios; queda por resolver cómo publica dos shorts `publicacion.json` antes de la PUERTA 2.
- 2026-11-02 · Clips breves del tráiler y del gameplay oficiales de SEGA/Creative Assembly, con crédito y en fuentes.json; el resto, en pixel art — Mario.
- 2026-11-02 · Fuente de Isolation 2: la cuenta oficial https://x.com/AlienIsolation, que se lee con Claude in Chrome si hace falta — Mario.
- 2026-11-02 · Guion: gancho «El juego siempre sabe dónde estás. El alien, no.», MISTA asustado y fascinado, y la especulación pegada a lo que dijo el estudio, sin hablar de «IA moderna» ni de aprendizaje automático — Mario.
- 2026-11-02 · Fuente primaria de Isolation 2: el vídeo oficial «Dev Q&A» (YouTube `qk3WHXemQ-I`, enlazado por @AlienIsolation el 30 de octubre), leído por sus subtítulos oficiales, que se bajaron con permiso de Mario. En X no hay un tuit con el texto «más inteligente»: está en el vídeo y en sus clips — comprobado.
- 2026-11-02 · PUERTA 1 de alien-isolation-ia aprobada («Aprobado»), sobre la SHA-256 del guion en reviews/puerta-1.md.
- 2026-11-02 · alien-isolation-ia, storyboard: alien en **sprite pixel detallado** (Mario lo prefiere a la silueta recomendada), director como **sala de control** con mapa y brazo mecánico, y estilo **más oscuro, igual de vivo** (luces de emergencia, detector y linterna), anotado en `style_guide.md` — Mario.
- 2026-11-02 · Gasto de la voz de alien-isolation-ia autorizado sin tope fijo («Sí, lo que necesites»); se informa de lo que cueste de verdad — Mario. Vale para esta voz; otros gastos se siguen consultando.
- 2026-11-02 · alien-isolation-ia: c4 («Last Chance») descartado, porque Chrome retuvo la descarga; el bloque 10 y B1 van en pixel art — Mario («Sigue sin c4»). c1 (guía oficial del alien) trae taquillas, detector y lanzallamas, así que c2 y c3 sobran (decisión del agente). c5: 2,6 s de audio del Dev Q&A, bajados con yt-dlp (`--download-sections`, 128 KB) al no tener restricción de edad.
- 2026-11-02 · Voz de alien-isolation-ia: «Alien: Isolation» y los nombres propios en inglés, reescritos para la voz («Éilien Aisoléishon»; en pantalla, el nombre real con `voz-escrito.json`), y estilo «narrador con tensión» con `--estilo` de Gemini — Mario.
- 2026-11-02 · Con el estilo de tensión, el largo dio 10:11; se deja en 9:43 con `--tempo 1.05` desde la caché, sin pagar de nuevo. En los shorts, las pausas de más de 0,4 s se acortan a 0,3 s con `motor/voz/apretar-pausas.mjs` (el short pide voz continua) — decisión del agente.
- 2026-11-02 · alien-isolation-ia: muestras del estilo oscuro aprobadas («Aprobado, produce»): escenarios pasillo, control y colonia, alien pixel con luz en el lomo y MISTA «asustado».
- 2026-11-02 · Música de alien-isolation-ia: «Bitcrushed Ambience» de Lusit_Sven (Pixabay Content License), más oscura que el chiptune de siempre — Mario.
- 2026-11-02 · alien-isolation-ia: al largo se le aplica un limitador con sobremuestreo después de mezcla.mjs para cumplir < -2 dBTP; la categoría de YouTube propuesta es 20 (Videojuegos) — decisión del agente, la revisa Mario.
- 2026-11-02 · alien-isolation-ia: sin declarar contenido sintético, títulos aprobados tal cual y se adapta `publicacion/` para subir dos shorts (short-a y short-b) — Mario.
- 2026-11-02 · alien-isolation-ia: efectos pixel a -24 dB (antes -18) en los tres formatos, porque se oían demasiado — Mario. La flexibilidad de duración del short (commit 2b94e06) ya estaba aplicada: los shorts duran lo que pide su explicación.
- 2026-11-02 · alien-isolation-ia: largo y dos shorts publicados con la orden de Mario («…procedemos a subir los vídeos»), tras comprobar que los dos commits pendientes ya estaban en origin/main.
- 2026-11-02 · alien-isolation-ia: los dos shorts (KSFhhGrM3os, dboKMvcuSM4) llevan el largo (w8Z7xCj_8tc) como «vídeo relacionado» en YouTube — Mario («enlacemos los vídeos largos con los cortos»). Puesto en Studio desde su Chrome.
- 2026-11-02 · alien-isolation-ia: la descripción del largo enlaza a los dos shorts (bloque «Shorts de este vídeo», añadido en Studio) — Mario.

## Descripciones mínimas (2026-11-02)
- 2026-11-02 · **A partir de ahora**, la descripción de los vídeos (YouTube e Instagram) lleva solo el resumen del vídeo y los enlaces entre el largo y sus shorts: ni fuentes, ni música, ni efectos, ni la frase de voz sintética — Mario («que no tenga ni la fuente ni la música… solamente eso. Y el enlace…», «Quitarlo todo», «A partir de ahora»). Las fuentes siguen en `fuentes.json` y en pantalla, y el material de terceros, acreditado en pantalla (docs/criterios.md: «crédito en pantalla o descripción»). Sustituye a «fuente del dato… también en la descripción» (docs/estilo.md) y a «la descripción dice que la voz es sintética».
- 2026-11-02 · Aplicado ya a los tres vídeos de alien-isolation-ia en YouTube Studio y en los dos reels de Instagram. En el short B, de paso, «usará la tormenta para ocultarse» pasa a «usará el clima para ocultar sus movimientos», fiel a la fuente.

## Enlaces y cierre del short (2026-11-02)
- 2026-11-02 · **A partir de ahora** la subida enlaza sola el largo y sus shorts: cada short sale en YouTube con «Vídeo completo: <largo>» y el largo recibe después «Shorts de este vídeo» — Mario («si no lo hace, me gustaría que a partir de ahora se hiciese eso»). `publicacion.json` lleva solo el resumen. El «vídeo relacionado» de cada short se sigue poniendo en Studio (no está en la API).
- 2026-11-02 · Instagram y TikTok llevan en el texto el enlace al vídeo de YouTube: el largo si lo hay y, si no, el mismo short — Mario. Instagram no sale sin ese enlace; TikTok no admite texto en la bandeja, así que la subida da `texto_para_tiktok` para que Mario lo pegue.
- 2026-11-02 · Se amplía el permiso de YouTube con `youtube.force-ssl` para editar la descripción del largo — Mario («Por mí ampliamos permisos»). Falta que Mario reconecte el perfil (ADR 0008); hasta entonces la subida funciona y el largo queda con `enlaces: pendientes`.
- 2026-11-02 · **Cierre del short con largo:** la última frase de MISTA remite al largo, adaptada al tema y con la misma idea («¿Te interesa saber más? Tengo un vídeo largo en YouTube que lo explica entero») — Mario («Adaptada, misma idea»). Sustituye a «sin llamada a la acción final» (P23) cuando hay largo; sin largo, el short sigue terminando con el dato.
- 2026-11-02 · phonic-1-voz se queda sin enlaces entre su largo y su short — Mario («No, déjalo»). Lo nuevo vale para los vídeos siguientes.
- 2026-11-02 · Duración del short comprobada: la regla flexible (lo que pida la explicación, máx. 120 s) está en AGENTS.md, `nuevo-video`, `qa` y las plantillas, y ya se aplicó en alien-isolation-ia (54,0 s y 69,8 s). Ni el motor ni la publicación limitan a 60 s.

## Cámara dinámica y estilo v3 (2026-11-03)
- 2026-11-03 · Vídeos más dinámicos con cámara: plano general y planos de detalle hacia lo que se explica, a los que se llega con zoom a escalones (múltiplos de ×0,25, para que el píxel siga entero a ×4) o con corte seco en los datos fuertes. Un cambio cada 4-6 s. MISTA queda fuera de cuadro en los planos de detalle y vuelve con un saltito al plano general. Rótulos y caja de diálogo no se mueven con la cámara — Mario («Mezcla zoom + corte», «En los planos de detalle», «Cambio cada 4-6 s»). Se prueba en Mithril v4, versión interna que no se republica.
- 2026-11-03 · La cámara cambia de plano **solo en las explicaciones core** (en Mithril: 11 laboratorios, ficha de Mithril y red de Claude), no cada 4-6 s. Entra con zoom a escalones y sale con corte seco; el resto del vídeo va en plano general con MISTA — Mario («cambia demasiado de zoom… solo en las explicaciones core», «Zoom al entrar, corte al salir»). Sustituye al ritmo «cada 4-6 s» de la decisión anterior del mismo día.
- 2026-11-03 · La cámara de la v5 de Mithril pasa a ser **estilo vigente** para los próximos vídeos — Mario («Sí, como estilo»). Las reglas están en `docs/estilo.md`, la implementación en `motor/estilo/camara.js` y el ejemplo en `escenas/short-v5/`. La caja de diálogo opaca también queda como regla.
- 2026-11-03 · **Estilo v3**, a partir de la referencia ref-01 que vuelve a pasar Mario: todo a un solo tamaño de píxel de 12 px; profundidad de campo con conos de luz; escenas simples con objetos grandes; acercamiento lento continuo; MISTA y objetos sombreados a mano. El largo, con la misma composición en 16:9 — Mario («Todo a ×3, 12 px», «Sí, como la referencia», las 4 formas de mostrar, «Misma composición en 16:9»; calibración: «Me gusta, sigue»). Para Mithril, los 4 escenarios de antes redibujados («Los 4 de antes redibujados»); la galería queda como calibración.
- 2026-11-03 · El short v6 de Mithril (primer vídeo completo en estilo v3) queda aprobado y como referencia del estilo — Mario («Me gusta»). No se publica ni sustituye a la v3 publicada sin su orden.

## Ventanas de contexto (2026-11-03)
- 2026-11-03 · Siguiente vídeo: las ventanas de contexto en la IA (qué es, para qué sirve, cómo se usa, su límite, cómo se resolvería y qué cambiaría si fuese ilimitada, y si haría falta cambiar la arquitectura). De momento solo investigación, sin vídeo — Mario.
- 2026-11-03 · La investigación va a la bóveda Obsidian `HermesVault/Investigación/` (fuera del repo público), nivel «riguroso pero explicado», con tabla de modelos actuales, ejemplos cotidianos, historia e ideas para el vídeo — Mario.
- 2026-11-03 · ventanas-contexto-ia: vídeo completo con el estilo v3 (la «V6» de Mario = short v6 de Mithril, ya en origin/main). Gancho del PDF de 300 páginas, nivel general con 2-3 ideas internas (tokens, fiesta de saludos, memoria por usuario), tabla comparativa de modelos solo con cifras oficiales, metáfora de la mesa de trabajo de MISTA, MISTA profe cercano, efectos a -24 dB y gasto de voz sin tope (se informa del coste real) — Mario. Shorts: «los que puedas sacar abriendo y cerrando un mismo tema» — Mario; el agente propone tres (A «se relee todo», B «cabe pero no lo lee», C «por qué no es infinita»).
- 2026-11-03 · ventanas-contexto-ia: las páginas de openai.com dan 403 a WebFetch; se usan sus fichas de developers.openai.com (GPT-4, GPT-4.1) y, para GPT-1, la configuración de Hugging Face. GPT-4 Turbo y la regla «1 token ≈ 4 caracteres» quedan fuera por no poder leerse — decisión del agente.
- 2026-11-03 · PUERTA 1 de ventanas-contexto-ia aprobada («Aprobado»), sobre la SHA-256 del guion en reviews/puerta-1.md.
- 2026-11-03 · ventanas-contexto-ia, cámara: plano de detalle en el largo solo en «lo oculto en la mesa» (bloque 3) y en la tabla de modelos y la caída de Gemini (bloques 8-9); un detalle por short (A: lo oculto, B: la caída de Gemini, C: la fiesta de saludos) — Mario.
- 2026-11-03 · ventanas-contexto-ia, voz: «ChatGPT» y «GPT» con letras en español («chat ge pe te»), «Claude» = «Clod», «Gemini» = «Yémini», «tokens» = «tóquens», reescritos en `voz-escrito.json` — Mario.
- 2026-11-03 · ventanas-contexto-ia: muestras del primer largo en v3 aprobadas («Aprobado, produce»): despacho horizontal con la mesa, detalle de lo oculto, fiesta de saludos y tabla de modelos tipo selección de personaje, tras una pasada del crítico (no pasaba: fuente del short en la franja tapada y el 5 del diálogo).
- 2026-11-03 · **Estilo:** las cifras de la caja de diálogo van en JetBrains Mono 600 (clase `.cifra` de `motor/estilo/estilo.css`), porque en Pixelify el 5 se lee como S — Mario («Sí, cifras en mono»), regla para todos los vídeos. Anotada en docs/estilo.md.
- 2026-11-03 · ventanas-contexto-ia, publicación: título del largo «Un millón de tokens no es memoria: así funciona (y falla) la ventana de contexto de la IA»; shorts con títulos en pregunta (A «¿Sabías que tu IA relee todo cada vez que le escribes?», B «¿De verdad tu IA lee un millón de tokens?», C «¿Por qué tu IA no puede leer infinito?»); sin declarar contenido sintético — Mario.
- 2026-11-04 · ventanas-contexto-ia: PUERTA 2 aprobada con la orden de subir («Aprobados, súbelos») sobre el largo v3 y los shorts v4 (huellas en reviews/puerta-2.md).
- 2026-11-04 · ventanas-contexto-ia: enlaces del largo a sus shorts y «vídeo relacionado» de los tres shorts puestos en Studio desde el Chrome de Mario, sin reconectar youtube-conectar — Mario («Sí, hazlo tú»). En Chrome hubo que cambiar la sesión de YouTube de la cuenta «mariobox» al canal «El Gato Mista».

## Iteración de detalle (2026-11-04/06)
- 2026-11-06 · MISTA se queda **exactamente como estaba** (sprite v3 de 32×32 a 12 px); el rediseño se deja para más adelante — Mario («Lo ajustamos más adelante… dejarlo como estaba», «MISTA tal cual; detalle al resto»). Se probaron y descartaron: un gato procedural nuevo (chibi), uno fiel al boceto en 3/4, la hoja de poses pasada a píxel y una mezcla del MISTA con la referencia («una mezcla del que teníamos y ese»); la mezcla queda en `motor/calibracion/v4/gato/` para retomarla. Resolución elegida para el futuro rediseño: 64×64 a 6 px. Ojos: ámbar o amarillos, nunca verdes.
- 2026-11-06 · El detalle de esta iteración va a objetos, efectos (pixelfx, MIT) y cámara — Mario.
- 2026-11-06 · **Calibración v4 aprobada** («Me gusta, sigue»; `reviews/calibracion/iter-v4-01.md`). Entra al estilo vigente:
  - **Mundo y cámara:** un mundo de varias pantallas con una estación por idea y paralaje por capas (`CAM.aplicarCapas`: fondo 0,6, plano medio 1, primer plano 1,35). Movimientos: acercamiento lento, travelling y «revelar» (travelling y alejamiento a la vez). MISTA se queda en su estación. Es la cámara de ref-01, que no habíamos conseguido.
  - **Objetos:** detalle interior a media unidad (6 px) y silueta a 12 px. Ningún objeto a ×2.
  - **Efectos:** de pixelfx, solo puntuales y anclados a su causa. Ninguno con cifras o texto propio: el escáner de pixelfx pintaba un «40 %» que se leía como un dato sin fuente. La interfaz de juego (escaneos, marcos, barras) se dibuja a mano a 12 px.
  - Reglas en el bloque «Estilo vigente» de `docs/estilo.md` y en la skill `estilo`. Crédito de pixelfx en `NOTICE.md`.

## Resumen semanal: la semana de los agentes (2026-11-06)
- 2026-11-06 · Siguiente idea: resumen de la semana (29 oct - 5 nov) en un largo, con shorts de los temas con más contenido. De momento solo un documento de información, sin guion, en `HermesVault/Investigación/reports/` y las transcripciones en `research_notes/` — Mario.
- 2026-11-06 · Temas: los 5 enlaces de Mario (harness y Super-agent de DeepSeek, skill teardown, skill de seguridad de Cloudflare, app de Herdr y la semana de Fazt), más «Meta compra Conductor». Del vídeo de Fazt entran todas sus noticias (Binance, Reddit/Google, Microsoft, Neuralink y Subvocal). Fuera: OpenAI y los 948 fallos de Linux, el S-1 de Anthropic y los videojuegos (GTA 6, Ocarina) — Mario.
- 2026-11-06 · El largo, con hilo conductor «la semana de los agentes» (por dentro → orquestadores → skills → lado oscuro → impacto → interfaces), y no como un noticiero por bloques — Mario.
- 2026-11-06 · Binance y «qué es un harness» darían para un largo propio, pero van dentro del resumen semanal, como bloques con más peso — Mario («Dentro del resumen»). Se pueden retomar más adelante.
- 2026-11-06 · resumen-semana-agentes: largo y **3 shorts** (A Binance, B la extensión de Claude Code con puerta trasera, C el harness), gancho de **repaso rápido** con 5 titulares, MISTA **curioso y escéptico** que corrige lo exagerado, sin guiño a cómo se hace el canal, pieza única (no es una serie) y gasto de voz sin tope (se informa del coste real) — Mario.
- 2026-11-06 · **Publicación escalonada**: el largo hoy (viernes 6), un short el sábado, otro el domingo y otro el lunes. En YouTube se programan con `fecha` en `publicacion.json`; Instagram y TikTok, con la orden de Mario el día que toque — Mario («Hoy el video largo, mañana un short, domingo otro short y lunes otro short»). El orden de los shorts (A, B, C) y la hora (12:00 de Madrid) los propone el agente y se confirman en el QA.
- 2026-11-06 · PUERTA 1 de resumen-semana-agentes aprobada («Aprobado» y, tras cuatro correcciones de precisión del comprobador de enlaces, «Aprobado con los cambios»), sobre la SHA-256 del guion en reviews/puerta-1.md.
- 2026-11-06 · resumen-semana-agentes: YouTube programa cada short en su día (sábado, domingo y lunes), e Instagram y TikTok reciben **los tres shorts el sábado** — Mario («IG y TikTok, todo el sábado»). Así no hace falta tocar la subida, que manda a esas redes todos los shorts de `publicacion.json` a la vez.
- 2026-11-06 · resumen-semana-agentes, voz: los nombres en inglés se reescriben como antes («Dipsik», «Jérder», «Cláudfler», «Báinans», «Niúralink», «Kérsor», «Éirpods»; Claude = «Clod»), con el nombre real en pantalla — Mario.
- 2026-11-06 · resumen-semana-agentes, storyboard: los agentes son robots pixel pequeños, las skills son cartuchos de videojuego, un sello «MATIZ» marca cada exageración corregida, y hay 4 planos de detalle en el largo (el bucle del harness, las barras del Super-agent, la cronología de Binance y Stack Overflow) y uno por short — Mario.
- 2026-11-06 · resumen-semana-agentes, publicación: largo «La semana de los agentes de IA: robo récord a Binance, puertas traseras y jefes que no trabajan»; shorts con título en pregunta (A «¿Cómo robaron 6.340 millones a Binance con una oferta de trabajo?», B «¿La extensión oficial de Claude Code con una puerta trasera?», C «¿Por qué el mismo modelo de IA da agentes distintos?»); sin declarar contenido sintético; shorts programados en YouTube a las 12:00 de Madrid — Mario.
- 2026-11-06 · resumen-semana-agentes: la voz se regenera con el estilo «profesor cercano» de ventanas-contexto-ia, porque la primera tirada salió sin `--estilo` — Mario («usa la misma que has usado en otros videos»). Por defecto, la voz de los vídeos es Orus **con** ese estilo.

## Biblioteca pixel reutilizable (2026-11-06)
- 2026-11-06 · Mario quiere «un set enorme de imágenes pixel con animaciones» para fondos y explicaciones, no un único plató. Se estudia el reel de SpriteForge `DfUurtvD7Jd`. Propuesta en `docs/investigacion/biblioteca-pixel-2026-11-06/propuesta.md`: fondos por capas, objetos por estados y escenas explicativas reutilizables. Es una dirección solicitada y una propuesta pendiente de concretar; no cambia el estilo v3 ni autoriza gasto o instalaciones. El repositorio externo que Mario recuerda de la v6 sigue sin identificar.

## Repaso y nueva dirección (2026-11-09)
- 2026-11-09 · Lo publicado se conserva reproducible: ventanas-contexto-ia y resumen-semana-agentes cargan `motor/estilo/v3/congelado/props-v3.0.js` (el `props.js` de antes de la v4). resumen-semana-agentes, `motor/biblioteca/` y la investigación de la biblioteca pixel pasan del checkout principal a la rama — plan aprobado por Mario.
- 2026-11-09 · Nueva forma de presentar (calibración v5, por probar): **diorama animado** (la idea se ve dibujada y se mueve, con poco texto), MISTA en pantalla solo en el inicio, en los cambios de tema y en el cierre (el retrato de la caja se queda), detalle a **6 px y 4 px** en fijos para elegir, y arte propio más los iconos del atlas `Angais/pixel-art-atlas-1.4m` (16×16, CC0, hechos con Krea; falta leer la licencia de Krea §2.3) y packs CC0, con permiso en cada descarga — Mario. Si la demo gusta, un sistema que elija el recurso (o que lo elija Opus).
- 2026-11-09 · Limpieza aprobada por Mario fila a fila y hecha (37 elementos a la Papelera, etiqueta local `archivo/pre-limpieza-2026-11-09` antes):
  - Mithril: short v1, v4 y v5 (citas repuntadas a short-v6) y `escenas/largo/`.
  - Calibraciones c5a, c5b, v2 y el clip de v3. Queda `v3/gato-hoja.html`, porque `gato_mezcla.py` lee su render.
  - Pruebas del gato, menos la mezcla. `gato_procedural.py` y `c3_acentos.py`.
  - Pilotos de HyperFrames, Remotion y propio, con sus node_modules. Quedan `resultados.md` y `escena-spec.md`.
  - Las 11 copias de `escena-plantilla.html` y `.claude/skills/.gitkeep`.
  - Plugin `hyperframes` fuera de `.claude/settings.json`.
  - `motor/.revisar-tmp.mjs` pasa a `motor/revisar.mjs`.
  - Docs, memoria y biblioteca, sin tocar por ahora (Mario no las eligió).
- 2026-11-09 · Más dinamismo en la v5: **el diorama se mueve** (lo que se explica reacciona a la voz: piezas que entran, se encienden, trabajan) y **la cámara viaja** por un mundo ancho con paralaje; **algo nuevo cada 1-2 s** — Mario. No se piden cortes rápidos ni transiciones con juego.
- 2026-11-09 · Descargas aprobadas para la prueba v5: `validation-000.parquet` del atlas (1,3 MB, 4.096 sprites) y `scifitiles-sheet.png` de Buch (OpenGameArt, CC0, 13 KB), en `.runtime/v5/` — Mario («Sí, los dos»). La hoja de Buch es cenital y no sirve para el diorama lateral.
- 2026-11-09 · Densidad de la v5: **4 px** de salida por píxel de arte (lienzo de 270×480 / 480×270 unidades) — Mario («4 px»). El clip v5 (`motor/calibracion/v5/clip.{html,js}`) queda a la espera de su revisión (`reviews/calibracion/iter-v5-02.md`).
- 2026-11-09 · **Calibración v5 aprobada** («Me gusta, sigue»; `reviews/calibracion/iter-v5-02.md`). Pasa a estilo vigente (ADR 0009) y sustituye a la v3/v4 en los vídeos nuevos:
  - **Presentación:** diorama animado (la idea se ve dibujada y se mueve), poco texto y algo nuevo cada 1-2 s.
  - **Arte:** a 4 px.
  - **MISTA:** solo en la entrada de tema, en los cambios de tema (de pie, 1-2 s) y en el cierre, a su píxel de 12 px. El retrato de la caja se queda.
  - **Cámara:** viaja por un mundo ancho con paralaje y hace zooms core a ×1,25.
  - **Lo que no cambia:** las reglas de la caja, del rótulo, de la fuente junto a la cifra y de la zona tapada. Los vídeos publicados conservan su biblioteca (v2, v3 o v3.0 congelada).

## nvidia-huang-espionaje (2026-11-09)
- 2026-11-09 · Siguiente vídeo: **solo short**, primera prueba del estilo v5, sobre la investigación de NVIDIA a Jensen Huang (tuit de @ErickSky como punto de partida) — Mario («no da para más sobre este tema»).
- 2026-11-09 · Enfoque de noticia con matiz: el tuit dice que NVIDIA «confirma», pero el comunicado solo abre una investigación por las informaciones de prensa; sello MATIZ — Mario.
- 2026-11-09 · La infidelidad que admite Huang en su correo entra en una frase breve y neutra; Alice Huang (Huang Le) y Megaspeed se nombran, siempre atribuidos a la prensa y a funcionarios de EE. UU. — Mario.
- 2026-11-09 · MISTA narrador de thriller; gancho «¿Y si para conseguir los secretos de NVIDIA no hiciera falta robarlos, sino acercarse a su jefe?»; voz «Yensen Juang», «Envidia» — Mario.
- 2026-11-09 · Se trabaja en el worktree `elgatomista-execution-plan-c8445b` (HEAD f85916c, con el estilo v5), porque el `main` del checkout principal no lo tiene — decisión del agente.
- 2026-11-09 · PUERTA 1 de nvidia-huang-espionaje aprobada («Aprobado»), sobre la SHA-256 del guion en reviews/puerta-1.md.
- 2026-11-09 · nvidia-huang-espionaje, storyboard: personas genéricas (Jensen Huang, figura pixel con chaqueta de cuero sin buscar parecido; Alice Huang, silueta en sombra con dosier); MISTA en la entrada, en «El domingo…», en «Pero ojo…» y en el cierre; zoom core en el desvío de chips y en el objetivo — Mario.
- 2026-11-09 · nvidia-huang-espionaje, sonido: Orus con estilo de narrador de thriller (gasto de voz aprobado, < 0,05 $), música «Bitcrushed Ambience» de Alien y efectos a -24 dB — Mario.
- 2026-11-09 · nvidia-huang-espionaje: «Produce sin muestras» (sin fotogramas previos); título «¿Espiaron al jefe de NVIDIA para llegar a sus chips?» y sin declarar contenido sintético — Mario.
- 2026-11-09 · Portada: Mario propone generarla con Codex/ChatGPT y, si le gusta, hacerlo siempre así. Prueba hecha con `codex exec` (generación de imágenes de su plan, sin gasto aparte) a partir de dos fotogramas del vídeo.
- 2026-11-09 · **Portada con Codex, a partir de ahora** — Mario («Sí, portada Codex», tras haber dicho «si me gusta lo hacemos siempre así»). La subida admite `portada_imagen` (una imagen directamente en `salida/`, con su huella en el lote) en lugar del fotograma de `portada_segundo` (`publicacion/story_publication.py`, 2 pruebas nuevas, 116/116). Cómo se genera: skill `qa`, paso 9. Queda por ver si YouTube muestra la portada propia en el feed de Shorts o solo en el canal y la búsqueda.
