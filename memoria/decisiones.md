# Decisiones vigentes

Lo que está en vigor, por temas. Cada línea lleva la fecha en que se decidió; «Mario» = lo dijo él. El historial completo,
con sus citas y lo que quedó sustituido, está en `memoria/historial/decisiones-hasta-2026-11-10.md` (léelo solo si
necesitas el porqué de algo antiguo). Lo nuevo se añade al final de su tema o en una sección con fecha.

## Canal y contenido
- Explicativos y noticias en español con voz sintética; temas: videojuegos, curiosidades, noticias, IA y series, con enganche narrativo — Mario (2026-10-29).
- Formatos: largo 16:9 de 8-10 min y short 9:16, compuestos por separado. El short dura lo que pida su explicación, hasta 120 s; lo decide quien escribe su guion — Mario (2026-11-02). Puede haber varios shorts (`short-a`, `short-b`…) o solo short si Mario lo dice.
- Resolución 1080p a 60 fps en los dos formatos — Mario (2026-10-29).
- Cuentas: YouTube «El Gato Mista» (canal `UCA76YezyGjv7spjOfRqAKNA`, compartido con `canal-noticias-ia`; identificador todavía @Pod02-leo), Instagram @elgatomista y TikTok @el_gato_mista (no se puede renombrar hasta el 2026-12-02) — Mario (2026-10-30, 2026-11-02).
- Logo: cabeza y pecho de MISTA sobre fondo oscuro con aro naranja; ojos verde lima **solo en el logo** (`marca/logo/generar.py`) — Mario (2026-11-02).
- Presupuesto: suscripciones de Claude y Codex más 10 $/mes. Ningún gasto sin consultarlo antes (qué, cuánto, para qué). La voz de cada vídeo la ha autorizado Mario sin tope, informando del coste real (2026-10-29, 2026-11-02).

## Flujo, puertas y git
- PUERTA 1 (guion) con la SHA-256 en `reviews/puerta-1.md`. PUERTA 2: la orden de subir de Mario basta, sin pedirle huellas; `subir` anota la huella — Mario (2026-10-30).
- Antes de generar cada pieza se le preguntan a Mario las dudas que cambian el vídeo; la orden de subir no debe encontrarse con ninguna — Mario (2026-10-31).
- Commits convencionales, sin atribución de IA y solo con su orden; el push lo hace Mario. Repo público `marmedsan6/el-gato-mista`; web legal en `gh-pages` (ADR 0002, 0003).
- Se trabaja en el worktree `elgatomista-execution-plan-c8445b` (rama `claude/elgatomista-execution-plan-c8445b`). La fusión con `main` se hace al cerrar la v6: comandos para Mario — Mario (2026-11-10).
- Sin borrado permanente: Papelera con `~/odd/scripts/recycle.ps1` y su confirmación.

## Voz y sonido
- Voz: Gemini «Orus» (ADR 0006) **con** la indicación de estilo; la de los explicativos es «Profesor cercano de España…» (texto en `memoria/aprendizajes.md`). Cada vídeo puede pedir otro tono (tensión en Alien, thriller en NVIDIA) — Mario (2026-10-30, 2026-11-06).
- Nombres en inglés reescritos para la voz en `voz-escrito.json`, con el nombre real en pantalla («Clod», «Yensen Juang», «Envidia»…) — Mario (2026-11-02, 2026-11-03).
- Short: voz continua; las pausas de más de 0,4 s se acortan a 0,3 s (`apretar-pausas.mjs`) — decisión del agente (2026-11-02).
- Efectos solo en los momentos clave y atados a lo que pasa en pantalla, nunca al ritmo del diálogo. Nivel: -24 dB en los últimos vídeos — Mario (2026-10-30, 2026-10-31, 2026-11-02).
- Música bajo la voz a -13 dB: chiptune «Morning Coffee» o «Bitcrushed Ambience» (la oscura, usada en Alien, NVIDIA y Fable); se decide en cada vídeo. Mezcla a -14 LUFS y menos de -2 dBTP.
- Música y efectos de Pixabay y Freesound (CC0 o licencia de Pixabay), con permiso por cada descarga — Mario (2026-10-29).

## Estilo (vigente: v6; reglas en `docs/estilo.md`, ADR 0009 y 0010)
- MISTA: gato atigrado naranja según el boceto de Mario, narrador; su sprite v3 de 32×32 se queda **tal cual** (ojos amarillos, nunca verdes); el rediseño a 64×64 queda para más adelante — Mario (2026-10-30, 2026-11-06).
- Caja de diálogo pixel con retrato (solo parpadea) y la etiqueta «MISTA», opaca, con las cifras en JetBrains Mono — Mario (2026-10-30, 2026-11-03).
- v5: diorama animado a 4 px, poco texto, algo nuevo cada 1-2 s; MISTA solo en la entrada de tema, en los cambios de tema (de pie 1-2 s) y en el cierre; cámara que viaja por un mundo ancho con paralaje — Mario («Me gusta, sigue», 2026-11-09).
- **v6 — Mario (2026-11-10), tras el diagnóstico del short de NVIDIA:**
  - **Etiquetas:** casi sin texto. Fuera las que repiten la voz; los nombres, dentro del dibujo o 1 identificador por estación pegado a su objeto.
  - **Fuente del dato:** en la caja de diálogo, automática por frase desde los `[fN]` del guion. Sustituye a «fuente junto a la cifra».
  - **Rótulos:** solo en la entrada y en los cambios de tema (los momentos de MISTA).
  - **Zoom core:** acercamiento continuo de 0,4 s hasta ×1,25; salida con corte.
  - **Sistema:** lint de textos, QA y audio en un comando, render barato y andamiaje, y limpieza de docs y memoria.
  - **Prueba:** NVIDIA interna en 9:16 (no se republica) y clip de 20 s en 16:9. **Aprobada** — Mario («Me gusta, sigue», 2026-11-11; `reviews/calibracion/iter-v6-01.md`). La v6 es el estilo vigente.
- Cierre del short con largo: la última frase de MISTA remite a él, adaptada al tema; sin largo, termina con el dato — Mario (2026-11-02).
- Personas reales: figuras pixel genéricas, sin buscar parecido; quien no deba reconocerse, en silueta — Mario (2026-11-09).
- Nunca: neón chillón, sonidos estridentes, fundidos de entrada, etiquetas en las esquinas, título centrado sobre degradado — Mario (2026-10-29).

## Fuentes y material de terceros
- Cada hecho, con fuente en `fuentes.json`; sin fuente no entra. Fuente primaria si existe.
- Material de terceros: solo público, registrado (URL, autor, licencia, tramo) y acreditado; el que aporta Mario se da por libre de reclamaciones y, si llega alguna, la gestiona él (2026-10-29).
- Descargas, una a una y con permiso. No se usan las cookies del navegador de Mario.

## Publicación
- Nada se sube sin su orden expresa en el chat; esa orden sale a todas las redes de una vez (skill `publicar`, ADR 0008).
- Descripción mínima: solo el resumen y los enlaces entre el largo y sus shorts; ni fuentes ni música ni la frase de voz sintética — Mario (2026-11-02).
- La subida enlaza sola largo y shorts; el «vídeo relacionado» de cada short se pone en Studio desde el Chrome de Mario (canal «El Gato Mista», no «mariobox»). Instagram y TikTok llevan el enlace a YouTube — Mario (2026-11-02).
- Contenido sintético: hasta ahora siempre «sin declarar»; se le pregunta en cada vídeo.
- Portada generada con Codex a partir de fotogramas (`portada_imagen`) — Mario (2026-11-09).
- TikTok va a la bandeja y Mario termina el post.

## Sistema y agentes
- Motor de render propio (ADR 0004). Orquesta Opus; lo mecánico, al modelo barato de frontera; el crítico visual es Opus y se avisa antes de cada pasada.
- Lo publicado se conserva reproducible: cada vídeo carga la biblioteca que usó (v2, v3, `v3/congelado/`, v5) y `npm test` compara sus huellas — Mario (2026-11-09, 2026-11-10).
- Render (2026-11-12): `render.mjs` pide que el equipo no se duerma mientras renderiza, captura con PNG rápido (`optimizeForSpeed`, píxeles idénticos) y registra hora y ritmo — Mario («Sí, aplícalos», tras el [informe](../docs/investigacion/render-largo-2026-11-12/informe.md)). Se quedan 8 navegadores; `--num-raster-threads=1` y el mundo virtualizado, descartados — decisión del agente.
- Para revisar escenas, hojas de contactos (una imagen por tanda), nunca fotogramas sueltos acumulados: más de 20 imágenes en el historial bloquean la sesión — decisión del agente (2026-11-10).
- Biblioteca pixel reutilizable: Mario quiere «un set enorme de imágenes pixel con animaciones»; la propuesta (`docs/investigacion/biblioteca-pixel-2026-11-06/`) sigue por concretar. El atlas de Krea no entra en nada publicado hasta leer su licencia (2026-11-06, 2026-11-09).
- **Set de pixel art con selector y estilo adaptado a un set ajeno: abandonado** — Mario (2026-11-13, «abandonamos la idea, borra todo lo que hayas hecho y simplemente déjalo documentado»). Se probó un set propio con selector por árbol, adaptar el estilo a un set generado (PixelLab, sin llegar a usarlo) y a packs CC0 de Kenney, hasta rehacer el short A de ia-pasa-factura; el código y los renders van a la Papelera y queda [prueba-v7.md](../docs/investigacion/biblioteca-pixel-2026-11-13/prueba-v7.md). Se sigue con el dibujo propio por código de la v6.

## Por vídeo (lo propio de cada uno; el estado está en `memoria/videos.md`)
- mithril-ia-medicina: solo short; la v3 es la publicada; la v6 del short quedó como referencia del estilo v3.
- phonic-1-voz: clips solo con la voz del modelo; sin enlaces entre largo y short (Mario: «déjalo»).
- alien-isolation-ia: 70 % sobre el original y 30 % sobre Isolation 2, con la especulación marcada; dos shorts; estilo más oscuro.
- ventanas-contexto-ia: metáfora de la mesa de MISTA; tres shorts con título en pregunta.
- resumen-semana-agentes: hilo «la semana de los agentes»; shorts programados en YouTube en días distintos.
- nvidia-huang-espionaje: solo short; noticia con matiz (NVIDIA investiga, no confirma); Alice Huang y Megaspeed, siempre atribuidos; la v4 es interna (estilo v6).
- como-google-sabe-lo-que-quieres (2026-11-11), primer vídeo completo en v6: largo con tres shorts producidos con él y subidos en días distintos (A micrófono, B subasta, C dónde verlo); enfoque «el viaje de la Roomba» (un caso que recorre actividad, recomendaciones y anuncios); tono de curiosidad con cierre práctico; entran el mito del micrófono, el giro de las cookies y cómo verlo y cambiarlo, y queda fuera el juicio por monopolio; gancho en «imagina que…» con el espectador dentro; tienda genérica, sin nombrar Amazon (no hay fuente de qué comparte) — Mario. Decisión del agente: la subasta se cuenta con el plazo documentado por Google (de 80 ms a 1 s), no con los «100 ms» de las webs comerciales. Storyboard — Mario (2026-11-11): MISTA de pie con rótulo en los 7 bloques del largo; zoom núcleo en el estudio del micrófono, la etiqueta y la lista, el embudo de YouTube y la subasta; música «Morning Coffee»; YouTube, Google y Chrome como pantallas genéricas con placa, sin logotipos. Decisión del agente: un mundo por bloque (8) en lugar de uno ancho. Escenas, decisiones del agente (2026-11-11): «No lo compraste» (2,2 s) va en la estación de la tele y el «0» y el límite del estudio comparten la estación del filtro (dos filtros seguidos se leían repetidos); la voz entra 1,2 s después para que el título dure 2 s; las placas de las fuentes llevan un nombre corto (`corto` en `fuentes.json`). QA (Mario, 2026-11-12): tras la crítica se arreglan los bloqueantes y lo barato (solapes, cifras, cierres quietos, iconos que engañan), no los redibujos grandes; shorts un día cada uno a las 12:00 tras el largo (A, B, C); `contains_synthetic_media: false` como en los anteriores. Decisión del agente: los arreglos del largo se renderizan por tramos y se empalman (el render entero son 14,5 h).
- Estándar (Mario, 2026-11-12, tras ver como-google publicado): la v6 tal como se usó en ese vídeo es la versión estándar y completa (ADR 0010). Portadas **siempre con Codex**, del largo y de **cada** short (skill `qa`). Con largo, el **short A sale a la vez que el largo** y los demás uno al día a las 12:00 (skills `qa` y `publicar`); en como-google, el A se adelanta con el comando nuevo `youtube-publicar-ya` (pide el permiso de edición de YouTube).
- midudev-ia-pasa-factura (2026-11-11): **investigación + guion de trabajo** para la PUERTA 1, sin proyecto creado ni piezas generadas. Mario decidió: se hace el largo (hay información suficiente), ángulo A (la factura de la IA) con B (el internet que se cierra) como giro, **de la explosión de la fábrica no se nombra a nadie** y **del vídeo de origen no se añade nada de su autor** (solo su información, transcripción y opiniones, dichas sin atribuir). Mario pide **abrir con una historieta** que meta al espectador desde la primera frase («usas la IA todos los días…»): escrita como secuencia de estaciones del diorama (10 pasos, ~25-30 s), no como viñetas de cómic, porque el estilo v6 no las usa. Doc en `docs/investigacion/midudev-ia-pasa-factura-2026-11-11/` con la transcripción del vídeo de midudev («La IA empieza a pasar factura a las tecnológicas», 2026-11-10), la verificación de sus cifras y una narración de trabajo de 9-10 min más un short. Ángulo propuesto: la factura de la IA la paga internet (Google y Reddit). Pendiente de las respuestas de Mario (§8 del doc).
  - **2026-11-12 — sustituye a «se hace el largo»:** proyecto `proyectos/ia-pasa-factura/`, **solo 2 shorts, sin largo**
    (Mario: «¿Hacemos mejor únicamente 1 o 2 shorts? Valóralo» → eligió la recomendación de 2), cada uno sobre un estudio:
    A «Reddit cierra la puerta» (Pew Research y PNAS Nexus 2024 sobre Stack Overflow) y B «Lo que cuesta tu pregunta»
    (paper de Google sobre Gemini y la deuda de Alphabet). Motivo: el guion de trabajo daba ~4 min 20 s, no 9 (el «≈ 29
    min» del doc era un error de cálculo), y la mitad de las fuentes eran titulares sin abrir. Enfoque explicativo con la
    noticia como caso; Intel y la explosión, fuera; ganchos «la respuesta de arriba» (A) e historieta corta (B); voz de
    siempre — Mario. Decisión del agente: «la puerta es para los robots» no entra (CNBC da como motivo los usuarios
    fieles y el post de u/spez no se pudo abrir: Reddit bloquea curl, RSS y el navegador integrado).
  - 2026-11-12 · PUERTA 1 aprobada («Aprobado»; `reviews/puerta-1.md`, SHA `ade282fb…761a`), con el cierre del A en
    pregunta. Storyboard — Mario: Pew como «dos calles y una tienda» con las cifras 15 % y 8 % una tras otra; cambios de
    tema A ×2 («Por ejemplo, Reddit» y «lo raro») y B ×1 (antes de las cuentas); zooms núcleo en Pew, Stack Overflow y
    las cinco gotas; música «Bitcrushed Ambience». Decisión del agente: hilos visuales (cartel azul del resumen en el A,
    sobre de la factura en el B), robot-bibliotecario como la IA y marcas como placas sin logotipo.
  - 2026-11-13 · Publicación — Mario: títulos «¿Por qué Reddit te va a pedir una cuenta?» (A) y «Google gasta más de lo
    que le entra» (B); sin largo, A sale al dar la orden y B al día siguiente a las 12:00; sin declarar contenido
    sintético. Decisiones del agente en el QA: cuatro vueltas de crítico hasta «pasa» en los dos (v4); el director de
    Reddit, en un despacho iluminado y no al borde del tejado (lectura delicada); portadas de Codex con «¿REDDIT CON
    CUENTA?» y «LA FACTURA».
- anthropic-fable-5-2 (otra sesión, 2026-11-10): solo short en estilo v5; música «Bitcrushed Ambience» y efectos a -24 dB; subido con la orden «Aprobado, lo subimos» a YouTube (https://www.youtube.com/shorts/Khdv6jail5M) y a la bandeja de TikTok; Instagram falló dos veces (HTTP 400 ProcessingFailedError) y se paró para enseñárselo a Mario; sin portada de Codex (se subió con el fotograma).

## Iteración v6 (2026-11-10)
- 2026-11-10 · El tuit de la estación del matiz de NVIDIA no se queda como titular: el crítico lo bloqueó por copiar la voz y se sustituye por una tarjeta sin texto con una insignia que pasa de check a interrogación — decisión del agente, la revisa Mario (el plan decía «el tuit se queda»).
- 2026-11-10 · En la v4 interna se pierde «(Huang Le)», que solo estaba en pantalla: el identificador se queda en «Alice Huang» (regla de 1-3 palabras) — decisión del agente, la revisa Mario.
- 2026-11-10 · Rótulos de la v4 interna: «El caso», «El domingo», «Ojo» y «Por ahora» (cierre) — decisión del agente, la revisa Mario.
- 2026-11-10 · El título de entrada necesita 2 s: en el clip 16:9 la voz entra 1,2 s después (`--voz-desfase`); en un vídeo nuevo lo resuelve el guion (un gancho que no nombre nada antes) — decisión del agente.

- 2026-11-11 · Con la prueba aprobada quedan como están las cuatro decisiones del agente de arriba (tuit sin titular, sin «(Huang Le)», rótulos y título de 2 s): Mario no pidió cambiarlas.

## Diagnóstico de gancho y herramientas (2026-11-10; otra sesión, en el checkout principal)
- 2026-11-10 · Mario pide un diagnóstico del canal sobre el repo `youtube-agent-skill` (vía un tuit de @dopamine_crypto) y dos reels de Instagram, para mejorar el sistema «sin hacer ruido en exceso». Respuestas de Mario: los reels se descargan y se analizan con ffmpeg; el gancho debe ser **las dos cosas** (situación del espectador en la primera frase **y** sostenida 5-8 s); **solo el diagnóstico escrito** por ahora; el repo de terceros **solo como referencia, sin copiar código**.
- 2026-11-10 · Diagnóstico en `docs/investigacion/diagnostico-canal-2026-11-10/diagnostico.md`. Conclusión: nuestro gancho empieza por el sujeto o por una cifra sin dueño; el de referencia («Suppose So», reel `DfgwuIqsFS0`) empieza por el espectador y demora el primer dato. Del repo se descartan `/yt-shorts` (choca con la regla de guion propio) y `/yt-edit`; se adopta la idea del «eslabón más débil» y la de leer el CSV de retención de Studio. **Nada implementado**: las fases 0.1-0.4 y 1.1-1.3 esperan el sí de Mario.

## Pendiente de que Mario decida
- Qué hacer con el short publicado de NVIDIA: el crítico, a posteriori, lo da por no apto (se lee «NVIDIA INVESTIGA CHINA» 2,6 s y tres frases no llevan fuente visible). Hay una v4 interna.
- Si lo siguiente se hace ya en v6 (anthropic-fable-5-2 salió en v5).
- Instagram de anthropic-fable-5-2 (falló al subir).
- Las fases 0.1-0.4 y 1.1-1.3 del diagnóstico de gancho (`docs/investigacion/diagnostico-canal-2026-11-10/diagnostico.md`): nada implementado.
