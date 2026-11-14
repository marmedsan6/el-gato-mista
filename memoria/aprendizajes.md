# Aprendizajes vigentes

Lo que sigue sirviendo, por temas. El historial completo (con las medidas y el día de cada cosa) está en
`memoria/historial/aprendizajes-hasta-2026-11-10.md`. Lo nuevo se añade al final de su tema, con fecha.

## Entorno (Windows, Git Bash, hooks)
- FFmpeg 9.0.2 de winget: sin `-vsync` (usa `-fps_mode passthrough`), sin `-pattern_type glob`; para escribir una sola imagen, `-frames:v 1 -update 1`.
- En Git Bash: un PATH con `C:/…` se parte por los dos puntos (usa `/c/…`); `$PWD` da `/c/…`, que Python no entiende (`pwd -W`); `${var//a/b}` no funciona.
- `node --test` necesita un patrón: `node --test "tests/*.test.mjs"`. `npm install playwright` no baja navegadores: se usa el `chrome-headless-shell-1243` ya instalado. `main` no tiene `motor/node_modules`: `npm ci`.
- El hook `guard.js` bloquea comandos cuyo texto contenga `rmSync`, «.env» o un heredoc con «del » y parecidos: para textos largos, Write/Edit o un script en el scratchpad.
- El scratchpad tiene una ruta tan larga que un paquete dentro supera los 260 caracteres de Windows.
- GPU AMD: Whisper va por CPU. Docker no corre por defecto.

## Git, worktrees y sesiones
- Un worktree puede nacer de `origin/main` y no de `main`; se reapunta con `git checkout -B <rama> main`. Un hook impide escribir en otro worktree desde una sesión: `EnterWorktree` con `path`.
- Los subagentes y skills se cargan del directorio donde arrancó la sesión: una sesión abierta en el checkout principal (con `main` atrasado) usa reglas viejas. Arranca en el worktree o fusiona antes.
- Cambiar una pieza de la biblioteca cambia los vídeos publicados que la cargan: se congela la versión que usó cada uno y `npm test` compara sus huellas (`motor/huellas.mjs`).
- `git ls-files --others --exclude-standard` lista lo que habría que versionar sin arrastrar `render/`, `salida/` ni `trabajo/`.
- 2026-11-10 · Dos sesiones pueden trabajar a la vez en el mismo worktree (la v6 y el short de Fable 5.2): antes de reescribir `memoria/` o docs, mira `git status` y `git diff` y conserva las líneas ajenas. Los ficheros de memoria cambian bajo tus pies: vuelve a leerlos antes de escribir.
- 2026-11-10 · Más de 20 imágenes en el historial bloquean la sesión («Total number of images exceeds the maximum allowed of 20») y ni «sigue» la desbloquea. Revisa escenas en hojas (una imagen por tanda, montadas con `ffmpeg hstack`) y deja los fotogramas sueltos al crítico, que tiene su propio contexto.

## Render y motor
- El motor captura por CDP (`Page.captureScreenshot` con `clip.scale`), unos 65 ms frente a 174 ms de `page.screenshot()`.
- `claveFotograma` ahorra capturas: con 30 por segundo en reposo y 60 en los movimientos (`clave6`), el short v4 de NVIDIA baja de 4.272 a 2.400 y tarda 3 min; la v5 sin clave tardaba unos 6. El largo v3, 13 min.
- 2026-11-10 · **Nada pesado mientras corre un render.** Con 8 navegadores, un lint o un `qa.mjs` a la vez multiplican los tiempos por 5-10 (un render de 3 min tardó 28; un QA de 12 s, más de 5 min).
- 2026-11-10 · Una capa HTML del ancho del mundo dentro de un plano con transformación (un `div` con `inset: 0` en `#p-medio`, 2.430 px a ×4) ahoga el render con 8 navegadores: 60 fotogramas en 107 s frente a 30 s al dejarla sin tamaño. Los contenedores de textos del mundo no llevan tamaño propio.
- 2026-11-10 · `render.mjs --desde/--hasta` renderiza solo un tramo (2 s en unos 20-30 s): sirve para ver un cambio sin el render entero. Tocar `render.mjs` invalida todas las cachés (su contenido entra en la clave).
- 2026-11-11 · **Mundo por bloque** en un largo (`proyectos/como-google-sabe-lo-que-quieres/escenas/largo/largo.js`): cada bloque tiene su `ruta6`, su `crearCamara` y su `lienzos6`, que se rehace solo al cambiar de bloque; el mundo del bloque b empieza con una copia de la última estación del b-1, así el cambio de tema es el salto «tema» de siempre. Los textos del mundo usan coordenadas locales de su bloque. `window.revision` junta movimientos, salidas y llegadas de todos (sin la llegada artificial en 0 de los bloques > 1). Con `?hasta=N` se revisa por tramos.
- 2026-11-11 · `fuentes-frases.mjs` contaba el título `### 4. …` como palabras del párrafo siguiente y rompía el reparto con títulos de 4+ palabras; ahora los ignora (test en `tests/fuentes-frases.test.mjs`).
- 2026-11-11 · Una frase de menos de 2,5 s no da para estación propia: la pieza clave no llega a sus 2 s antes de que salga la cámara. Se junta con la estación vecina.
- 2026-11-12 · **Las 14,5 h del largo eran el portátil dormido, no la escena** ([informe](../docs/investigacion/render-largo-2026-11-12/informe.md)): a los 10 min sin uso entra en espera moderna y con la tapa cerrada (18:46-08:08) no avanza. Despierto, el largo entero (15.804 capturas) va a ~0,05 s por captura con 8 navegadores: ~14 min, ~10 min con `optimizeForSpeed` (píxeles idénticos). `render.mjs` ya pide que no se duerma y usa el PNG rápido; la tapa tiene que quedar abierta. Un hijo que espera a que muera el padre necesita `unref()`, o el render no termina nunca. La caché va por la huella de los ficheros: tocar una escena ya renderizada la invalida entera. Para arreglar un tramo se renderiza solo ese tramo con `--desde/--hasta` (de la salida de cámara anterior a la llegada siguiente, para que los bordes coincidan) y se empalma en el MP4.
- 2026-11-13 · `npm test` dio otra vez «Unable to capture screenshot» en determinismo con la máquina cargada (solo pasa 4/4 y la batería 5/5). `render.mjs` reintenta esa captura hasta 2 veces: un fallo pasajero ya no tumba un render largo.
- 2026-11-13 · **Selector de piezas** (idea abandonada por Mario el mismo día; prueba con Haiku sobre el short A de ia-pasa-factura): 22 de 23 objetos con pieza del catálogo y ningún nombre inventado, en 37 s; pero 8 de las 20 piezas eran de estilos viejos y sus metáforas, más literales que las dibujadas. El catálogo necesita el estilo de cada pieza y la metáfora la decide quien escribe la escena.
- `render.mjs --fotogramas` guarda los PNG y luego renderiza todo: para ver fotogramas sueltos, `revisar.mjs` con tiempos.
- Clips con fotogramas en la escena: `seek` puede devolver la promesa de `img.decode()`.
- Medir motores o variantes en paralelo falsea los tiempos: en serie y con la máquina libre.
- 2026-11-10 · Mundo ancho en 16:9 (plantilla con `?n=`, una página): 2 pantallas, 0,27 s por captura; 8, 0,80 s; 16, 0,99 s; 32, 1,62 s. Un largo necesita un mundo por tema o virtualizado. (2026-11-12: medido sin controlar la espera del portátil; hay que repetirlo antes de fiarse.)

## Escenas y texto en pantalla
- 2026-11-10 · **El lint ve lo que el ojo no:** en el short publicado de NVIDIA había 2 cartelas de fuente fuera de pantalla (x = 268 de 270) y 10 textos de menos de 2 s; ni el QA ni el crítico los vieron. `node motor/revisar.mjs … --estricto` antes de cada render completo.
- 2026-11-10 · Las etiquetas que entran con la última palabra de la frase duran menos de 1 s porque el viaje se las lleva: la pieza clave se adelanta (a «no se pueden», no a «restringe») y la cámara sale tras el fin real de la frase.
- 2026-11-10 · Una regla que aparta etiquetas por filas puede sacar de pantalla a la que empuja (el sello «MATIZ» echó a las fuentes). Los textos del mundo van dentro del plano medio y se mueven con él: no hay que recolocarlos.
- 2026-11-10 · Dos textos en la misma línea se leen como una frase («NVIDIA INVESTIGA» + «CHINA»). Los nombres van como placas dentro del dibujo (`placa6`) y se leen a 360 px.
- 2026-11-10 · Un titular de texto como sujeto de una estación (el tuit) acaba copiando la voz o afirmando más que ella. Se cuenta con dibujo: una tarjeta sin texto con una insignia que pasa de check a interrogación.
- 2026-11-10 · Con menos etiquetas se ven más los tramos quietos y los dibujos que no se explican solos: al quitar texto hay que dar movimiento y sujeto (candado sobre el chip, carpeta que recorre la mesa).
- El texto en pantalla se relee fuera de la voz: el crítico caza sobre todo texto que afirma más que ella (pídeselo y dale la voz de cada frase). Las cifras dibujadas también se comprueban (un «×10» que medía 28 veces el área).
- Lo que el crítico marca como «depende del texto» se arregla dibujando el objeto. Un icono plano sin contorno se lee como una letra: contorno y 3 tonos. 11 celdas iguales se leen como una hoja de cálculo.
- Press Start 2P: ÁÉÍÓÚ se leen como minúsculas (`tildesPixel()` / `tildes6()`, que dejan la letra sin tilde en el DOM); a 360 px el 8 y el 5 se leen como S (cifras en JetBrains Mono). Pixelify Sans: ligadura «fi» que se lee como «ñ» (desactivadas en `*`).
- 2026-11-12 · En 9:16 la pestaña de fuente va bajo la caja, alineada a la derecha y en una línea: con más de ~17 caracteres («Pan et al., PoPETs 2018») se sale por la izquierda y el lint da «la fuente se ve 0,00 s». Nombres cortos para el short (en `short-motor.js` de como-google). Y el lint no ve las placas del dibujo: una placa bajo el rótulo o tapada por una cifra solo sale en la hoja de contactos.
- Caja de diálogo: paginar simulando el ajuste de línea (21 caracteres × 2 líneas en el short) y medir el DOM; el signo de puntuación pegado a la palabra clave (`.nw`) para que no caiga solo a la línea siguiente.
- `P(frase, "palabra")` busca en el timing ya pasado por `escrito.mjs`: las cifras del guion en dígitos se buscan en dígitos. Si falla, falla al pintar ese bloque: `revisar.mjs` lo caza sin renderizar.
- 2026-11-12 · `P()` devuelve la **primera palabra que contiene** el trozo: `P("fr11", "a")` cogió «sea» y no la «a» que se buscaba, sin error. Busca trozos que solo estén en la palabra que quieres.
- 2026-11-12 · `habitacionG` (piezas de como-google) mide 464 de ancho si no se le da `ancho`: en un short se mete en la estación siguiente. Pásale `ancho: 254`.
- 2026-11-12 · Whisper oye «va a aprobar» donde la voz dice «va a probar», con pista y a ciegas: dos «a» seguidas se funden. Una sustitución que cambia el sentido se recorta (`ffmpeg -ss … -to …`) para que Mario la escuche; no se da por buena ni por mala sin oírla.
- En una base de escena que une estilos por texto, un `;` que falta hace que el navegador descarte en silencio lo que sigue.
- `blackdetect` marca negro con más del 98 % de píxeles oscuros: las escenas arrancan con contenido. `freezedetect` no ve la boca del gato ni un marco que parpadea: hace falta algo de más superficie que se mueva.
- 2026-11-10 · El QA de congelados caza lo que el lint de textos no ve: tramos de 2 s donde solo cambia la caja de MISTA. Se arregla con algo que se mueva en el dibujo (un recibo que se imprime línea a línea), no con más texto.

## Cámara
- Píxel nítido con zoom: escalar el contenedor en múltiplos de ×0,25 (a 4 px, ×1,25 deja el píxel en 5 px). Con ×1,25 un «zoom a escalones» es un solo escalón, o sea un salto: se hace con un acercamiento continuo de 0,4 s (`mover`).
- Con zoom, lo que estaba fuera de cuadro aparece bajo la caja: recorte en la línea de la caja. El zoom tiene que encuadrar entero lo que explica: con ×1,25 caben 216 de 270 unidades, así que el grupo no puede pasar de unas 200.
- Desplazamiento lateral entre escenarios: cada bloque en un `<g>` recortado a su lienzo. El movimiento fino en la capa desenfocada desaparece.
- 2026-11-10 · El rótulo cambia cuando llega la cámara. El título de entrada necesita 2 s: o el gancho no nombra nada hasta entonces, o la voz entra con desfase (`--voz-desfase`).

## Voz y alineación
- Orus con el estilo «Profesor cercano de España explicando algo a un amigo: ritmo ágil y natural, cálido y con energía, como un vídeo explicativo de YouTube, pausas breves entre frases, sin atropellarse.» Sin `--estilo` suena a otra voz. Cada `.runtime/cache/voz/gemini-*.meta.json` guarda el estilo usado.
- Velocidad: unos 17 caracteres por segundo con ese estilo y unos 13 con uno lento (miedo, thriller). Para estimar, caracteres/17 o /13.
- El cupo gratuito de Gemini TTS se acaba tras unas 10 peticiones al día: en un largo, agrupar tramos (`por-bloques.mjs` guarda en caché y sigue donde iba).
- faster-whisper: decodificar con FFmpeg y pasar el array (PyAV rompe `decode_audio`). Dar el guion como pista puede forzar la coincidencia: comprobar también a ciegas (`--sin-pista`).
- 2026-11-10 · Un 97,9 % de alineación puede esconder un límite de frase mal puesto (0,56 s en NVIDIA: «China.» 0,06 s y «Y» 0,86 s). `node motor/voz/revisar-alineacion.mjs` lo compara con los silencios y lo ajusta: se elige el silencio más largo entre las dos frases, no el más cercano.
- 2026-11-11 · Los textos de voz se generan desde el guion con un script de ida y vuelta (reescribir nombres y cifras, y comprobar que al deshacerlo sale el guion párrafo a párrafo): 93 de 93 sin diferencias. `alinear.py` pone `formato: short` por defecto: en un largo, pásale `--formato largo` o corrige el campo.
- 2026-11-11 · Un largo de 8.734 caracteres son 8 peticiones a Gemini (una por bloque) y tres shorts, 3 más: las 11 salieron el mismo día con el cupo gratuito. Con el estilo de explicativo, el largo fue a 17,8 caracteres/s y el short B a 20.
- `ffmpeg silenceremove` deja los silencios en ~0,58 s; recortar los tramos medidos con `silencedetect` sí funciona (`apretar-pausas.mjs`).

## Audio
- Lo que anuncia `loudnorm` no basta: el AAC sube el pico unas décimas (de -2,5 a -2,1 dBTP en NVIDIA; hasta -1,0 en un largo). `mezcla.mjs` limita con sobremuestreo ×4 (techo -3 dBFS → -2,8 dBTP en el máster) y mide el máster con `ebur128`.
- Sacar los tiempos de los efectos de la propia escena (`window.eventosSonido()`) mantiene sonido e imagen sincronizados.
- Una llamada en estéreo con cada voz en un canal: `pan=mono|c0=c1` aísla una.

## QA y crítico
- El crítico (Opus) encuentra lo que las medidas no ven y merece la pasada **sobre el máster final**: la v3 de NVIDIA se publicó con la crítica de la v2 y llevaba un defecto bloqueante. No puede escribir: su crítica se copia a `reviews/`.
- 2026-11-12 · Con varios formatos, `qa.mjs` escribe `reviews/qa-vN.md` solo para el primero y no pisa los demás: el informe se completa a mano por formato (`qa-largo-vN.md`, `qa-shorts-vN.md`). En un largo con `--voz-desfase`, pásale `--timing` con las frases desplazadas (sin eso, los fotogramas de frase caen antes de tiempo). El crítico puede medir la zona segura del short en la escala de 360×640 con los límites de 270×480: comprueba sus «en la franja derecha» antes de tocar nada.
- Dale el último instante de cada frase (no tiempos fijos), tiras de cada movimiento y los reducidos a 360×640: lo saca todo `node motor/qa.mjs` en unos 12 s.
- El verificador de enlaces barato da falsos «no respaldado»: sus «parcial» y «no respalda» se comprueban en la fuente antes de tocar un guion aprobado.
- Al sacar código de una escena a la biblioteca, comparar huellas de fotogramas por `seek(t)` antes y después prueba que nada cambia, sin renderizar.

## Publicación
- YouTube: tras subir, `processing` unos 3 min antes de ver etiquetas. `containsSyntheticMedia: false` no vuelve por la API. El «vídeo relacionado» de un Short no está en la API: se pone en Studio. `videos.update` reemplaza el snippet entero.
- Studio en el Chrome de Mario abre por defecto «mariobox»: cambiar a «El Gato Mista». La foto de perfil no se cambia por API en ninguna red.
- TikTok: sandbox, solo a la bandeja. Instagram no sale sin el enlace a YouTube en el texto.
- 2026-11-12 · **Portada de un Short:** `thumbnails.set` con la imagen 9:16 la deja como miniatura general (en `maxresdefault`, recortada a 16:9 con los lados desenfocados), pero la miniatura vertical del feed de Shorts y de Studio (`oar2`, 1080×1920) sigue siendo un fotograma elegido por YouTube. Según la ayuda de YouTube (support.google.com/youtube/answer/72431), la vertical solo se sube desde Studio en un ordenador (Miniatura → Subir archivo), con la cuenta verificada; se comprueba con `https://i.ytimg.com/vi/<id>/oar2.jpg` cuando el short es público.
- 2026-11-12 · La subida sí manda la portada de cada short (`thumbnails.set`, huella en `publicaciones.json`, la jpg 1080×1920 de Codex en `para-subir/`), pero Mario no la veía en YouTube Studio mientras los shorts seguían privados y programados. La del largo público sí se sirve (`i.ytimg.com/vi/<id>/maxresdefault.jpg`); la de un short solo se puede comprobar desde fuera cuando es público.
- 2026-11-12 · Con shorts programados (`fecha`), YouTube los deja para su día pero **Instagram los publica en el momento** (como-google: los reels de B y C salieron el 12, sus shorts de YouTube el 14 y el 15). Repetir la orden no duplica nada (TikTok devuelve los mismos `publish_id`). Instagram puede fallar con «HTTP 400 ProcessingFailedError» en un short concreto dos veces seguidas (short A de como-google, como anthropic-fable-5-2): no es la conexión, porque los otros salen.
- `publicacion/` admite varios shorts; si cambian los metadatos tras subir, no vuelve a subir.
- Portada con Codex: `codex exec -i ref1.png -i ref2.png -C <carpeta> -s workspace-write "<prompt>"` (unos 8 min).
- 2026-11-12 · En `codex exec` las `-i` van **antes** de `-C`/`-s`: `-i` admite varios ficheros y, si va justo antes del prompt, se lo traga («No prompt provided via stdin»). Cuatro portadas en paralelo tardan lo que una (~8 min); salen a 941×1672 o 1672×941 y se escalan a 1080×1920 o 1280×720.
- 2026-11-10 · YouTube genera sus subtítulos automáticos con la voz («envidia», «Megaspited»): subir los propios desde el timing está pendiente (necesita `youtube.force-ssl`).

## Navegador, descargas e investigación
- x.com sin sesión: `api.fxtwitter.com/<usuario>/status/<id>` o el navegador integrado (`get_page_text`). openai.com da 403 a WebFetch; developers.openai.com sí carga.
- yt-dlp con `--js-runtimes node:<ruta>`; subtítulos con `--skip-download --write-subs` (o `--write-auto-subs --sub-langs es-orig`). Los vídeos con restricción de edad no se bajan sin sesión, y no se usan las cookies de Mario.
- Pixabay bloquea curl en la página de la pista, pero el enlace del CDN sí descarga. Freesound da la vista previa HQ de los CC0.
- El navegador integrado no abre `file://`: para ver una escena, `revisar.mjs` con capturas; para ver un máster publicado, YouTube.
- Investigación a fondo con subagentes en paralelo: unos 600 mil tokens; lo que citan de memoria se verifica antes del guion.
- 2026-11-11 · WebFetch no lee PDF (devuelve el binario), pero lo guarda en `tool-results/`; `pdftotext -layout` (en `/mingw64/bin`) lo pasa a texto y se busca con Grep. El Read de PDF falla sin `pdftoppm`.
- 2026-11-11 · En las fuentes, leer el artículo y no la nota de prensa: la de Northeastern dice «17.000 apps» y «ninguna activó el micrófono»; el artículo dice 17.260 analizadas, 9.100 probadas en marcha y avisa de que no detectaría audio pasado a texto.
- 2026-11-11 · Comillas rectas dentro de una cita en `fuentes.json` rompen el JSON: escápalas o usa «».
- 2026-11-11 · Investigar un vídeo de YouTube: `yt-dlp --dump-json` da título, métricas y pista de subtítulos, pero el canal no tiene subtítulos del autor; con faster-whisper (`small`) sobre el audio decodificado con ffmpeg (`-f f32le -ac 1 -ar 16000`) salen 128 segmentos en ~4 min de CPU. faster-whisper 1.2.1 con av 19 rompe (`metadata_errors`): se le pasa el numpy directamente, sin fichero.
- 2026-11-11 · Reddit bloquea la búsqueda (403/429) y `old.reddit` pide cuenta; lo que sí responde es el RSS de subreddit (`/r/<sub>/.rss`) y el de hilo (`/r/<sub>/comments/<id>/.rss`, con los comentarios), con esperas de 10-15 s. DuckDuckGo devuelve «anomaly» a las pocas consultas; Google sirve página sin resultados y Bing ignora el `site:`. X no se lee sin sesión. Hacker News, por su API de Algolia, es de donde sale la discusión de verdad.
- 2026-11-11 · Google Noticias da los titulares fiables pero no las URLs: las de Reuters (401) y las construidas a mano en CNBC, The Verge y Tom's Hardware (404) no abren. Un titular de Google Noticias no basta para citar: o se abre el artículo, o se marca «URL por confirmar».
- En temas de salud, las búsquedas de detalle biológico pueden activar salvaguardas: el guion se queda en la noticia y la divulgación general.

## Diagnóstico de gancho (2026-11-10; otra sesión, en el checkout principal)
- 2026-11-10 · Instagram se baja sin sesión con yt-dlp 2026.08.19 del venv de `~/.clipping-ia`, pero **hay que llamarlo como módulo** (`python -m yt_dlp`): el `yt-dlp.exe` del venv sale con código 1 y sin mensaje. La web (`instagram.com/reels/<id>/`) devuelve HTML vacío a WebFetch; el MP4 sí baja.
- 2026-11-10 · Un reel de Instagram sin subtítulos no tiene transcripción: el guion se reconstruye desde los rótulos en pantalla con hojas de contactos (`fps=1,tile=7x2`). En los reels que ponen la voz palabra a palabra en el rótulo, eso da el texto completo; en los que no, solo los rótulos clave.
- 2026-11-10 · En ffmpeg 9.0.2, `select` con `showinfo` **solo imprime la primera selección** (parece que `fps_mode passthrough` no basta para que el filtro emita todas). Para medir cortes, `select='gte(scene,0)',metadata=mode=print:file=…` escribe **todas** las puntuaciones; `file=` con ruta absoluta da «No option name near 'C:/…'» y hay que ejecutar desde la carpeta con nombre relativo. Capturar la salida de ffmpeg desde PowerShell pierde líneas: se usa `cmd /c … 2>&1`.
- 2026-11-10 · Medido con ese método: el reel de «Suppose So» (410 s) tiene 12 cortes en 30 s, pero cada corte cambia de **escena con significado**, no de elemento decorativo; el de «Cuarto 404» (44 s) tiene 4 cortes. Nuestro estilo ya pide «algo nuevo cada 2-4 s»; el ritmo no es el problema, lo es la primera frase.
- 2026-11-10 · El repo `Jakeschincariol/youtube-agent-skill` (MIT) es útil como **referencia de ideas**, no como código: sus heurísticas están en inglés y su `/yt-shorts` choca con la regla de guion propio. Lo que merece la pena es el «eslabón más débil» del veredicto (60 % media + 40 % la peor propiedad) y la idea de leer el CSV de retención de Studio. Diagnóstico en `docs/investigacion/diagnostico-canal-2026-11-10/diagnostico.md`.

## ia-pasa-factura (2026-11-13)
- 2026-11-13 · El crítico tardó cuatro vueltas en dar «pasa» a dos shorts nuevos (v1: 5 bloqueantes; v2: 1; v3 y v4: 0). Lo que más bloqueó: placas tapadas por el rótulo o por el zoom (el lint no ve las placas), una pieza del zoom cortada por el borde, una estación de 6 s donde solo se movían detalles diminutos y la geometría de un objeto que se mueve (la balanza). Antes de renderizar, mira en la hoja el **primer y el último fotograma de cada zoom** y el **estado final de cada objeto animado**.
- 2026-11-13 · El crítico caza lecturas delicadas que no son errores de dibujo: una figura de pie al borde de un tejado de noche se leía como alguien a punto de saltar. Las personas, dentro de edificios o en la calle, nunca en bordes.
- 2026-11-13 · Dos estaciones seguidas con el mismo objeto (dos cajas registradoras) se leen como un duplicado de montaje: si la idea continúa, una sola estación más larga.
- 2026-11-13 · Instagram «HTTP 400 ProcessingFailedError» ya pasa en el tercer vídeo seguido (anthropic-fable-5-2, como-google A y ahora los dos shorts de ia-pasa-factura), con YouTube bien y en la misma tanda: no es un short concreto. Hay que investigar la causa (formato del MP4, tamaño, el proceso de subida) antes de la siguiente publicación, en vez de repetir la orden.
