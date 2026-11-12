# Investigación · «La IA empieza a pasar factura a las tecnológicas»  → posible vídeo

Fecha: 2026-11-11. Estado: **investigación y propuesta de narración; nada aprobado, nada producido**.
Este documento no cambia el estilo, no genera voz y no autoriza gasto. Si Mario da luz verde, el
siguiente paso es crear el proyecto con la skill `nuevo-video` (brief → fuentes → guion → [PUERTA 1]).

Pedido de Mario: «investigación sobre este vídeo, transcríbelo, saquemos más información de X, Reddit,
YouTube… y genera un doc de investigación con una posible narración para sacar un vídeo a futuro».

**Respuestas de Mario (2026-11-11):** 1) **se hace el largo** si hay información suficiente; 2) **ángulo A
con B como giro**; 3) de la explosión de la fábrica **no se nombra a nadie**; 4) **del vídeo de origen no se
añade nada de su autor**: se usa la información, la transcripción y las opiniones, y se dice «lo que dice»,
no quién lo dice. El guion está en [guion.md](guion.md).

---

## 0. Resumen en cinco líneas

1. El vídeo de midudev (9:53, 2026-11-10) cuenta tres desplomes de bolsa —Intel, Alphabet y Reddit—
   y los usa para preguntar si está estallando la burbuja de la IA.
2. **Los hechos son ciertos**, pero el vídeo los cuenta con cifras mezcladas (unas son del día, otras de
   la semana) y deja fuera el detonante que explica la segunda ola: **las elecciones de medio mandato del
   3 de noviembre y la vuelta del Nasdaq a corrección**.
3. La historia tiene un giro que el vídeo no explota: **la IA de Google se está comiendo el tráfico del
   propio Google y de Reddit**, y la primera respuesta de Reddit es **poner un muro de inicio de sesión**.
4. Para el canal, el ángulo más fuerte no es «¿burbuja sí o no?» (imposible de contestar y ya gastado),
   sino **«la IA ya está pasando factura, y la primera factura la paga internet»**: quién paga, quién cobra
   y qué cambia para el usuario.
5. Propuesta: **un largo de 8-10 min** (categoría IA/noticias, nivel de verificación N2) y **un short**
   centrado en el experimento mental del muro de pago para las máquinas. Narración completa en §7.

---

## 1. El vídeo analizado

| Campo | Dato |
|---|---|
| Título | La IA empieza a pasar factura a las tecnológicas |
| Canal | midudev ([@midudev](https://www.youtube.com/@midudev), `UC8LeXCWOalN8SxlrPcG-PaQ`) |
| URL | https://www.youtube.com/watch?v=VKq42hak7Ak |
| Publicado | 2026-11-10 · 9:53 (593 s) |
| Métricas al consultarlo (2026-11-11 13:20) | 114.913 visualizaciones · 1.876 me gusta · 177 comentarios |
| Descripción | «Intel, Google y Reddit se desploman en bolsa. ¿Está empezando a estallar la burbuja de la inteligencia artificial? Analizamos las fuertes caídas de las tecnológicas, el gasto millonario en IA, los problemas de rentabilidad y por qué los inversores empiezan a perder la paciencia. ¿Se avecina una crisis en el sector tecnológico?» |
| Etiquetas | frontend, desarrollo web, javascript, midudev |
| Capítulos | No tiene |
| Subtítulos | No hay subtítulos del autor; el vídeo sí tiene pista de subtítulos automáticos |

**Transcripción:** completa, por segmentos y con tiempos, en [transcripcion.md](transcripcion.md).
Hecha con faster-whisper (modelo `small`) sobre el audio descargado con yt-dlp; las cifras y los nombres
se han cotejado con la prensa (§4). Las citas que siguen son literales de la transcripción, con la
puntuación arreglada y sin cambiar palabras.

### Estructura del vídeo (lo que hace midudev)

| Tramo | Qué hace |
|---|---|
| 0:00-0:24 | Gancho con cifras: «La bolsa Intel Google Reddit, madre mía, la que se ha liado». Nasdaq −2,9 % el viernes 30, S&P 500 −1,8 %, Nasdaq un 8 % por debajo del máximo del 6 de octubre, «el peor mes desde marzo del 2025». |
| 0:24-1:39 | Los tres casos: Intel −28 % en un día, Google −12 % el jueves, Reddit «se perdió un cuarto del valor de la empresa en un día». |
| 1:39-3:15 | **Intel**: previsiones por debajo, CFO dice que no habrá flujo de caja positivo, demanda de PC floja por la RAM cara, el Estado de EE. UU. como mayor accionista, y la explosión de la fábrica de Israel (600 millones). |
| 3:15-5:32 | **Alphabet**: −500.000 millones de valor, la IA encima del buscador comiéndose la publicidad, el gasto sube hasta 200.000 millones, flujo de caja negativo. Explica qué es el flujo de caja. |
| 5:32-7:12 | **Reddit**: menos usuarios, dice que la IA de Google le quita visitas, «un millón de referencias en promedio por semana». Cita a un directivo: «el modo IA no genera tráfico ni para nosotros ni para nadie». |
| 7:12-8:47 | **Opinión**: Reddit acabará obligando a iniciar sesión; la IA intentará entrar igual; habrá demandas y páginas que cobren a los bots («el Pay Per Crawl de Cloudflare»). |
| 8:47-9:53 | **Cierre**: Meta, Alphabet, Oracle, Amazon y Microsoft se han comprometido a gastar 800.000 millones en 2026; el mercado ya no aplaude; «¿dónde está el dinero?». |

### Cómo está contado (para el diagnóstico del canal)

- **Voz en primera persona, muy de desarrollador**: «madre mía», «esto es una pasada», «no os voy a engañar».
- **Lo fuerte:** no se queda en el titular; explica el mecanismo (por qué sube la RAM y por qué eso frena
  los PC; qué es un flujo de caja negativo) y **pronostica** (el muro de inicio de sesión, el pago por rastreo).
- **Lo débil:** las cifras se mezclan sin decir a qué día corresponden («hoy está bajando en 5,54», «hoy
  está subiendo ya un 141»); no hay fechas en pantalla ni fuentes citadas; el tramo de Intel mete la
  explosión de la fábrica sin ordenar antes y después; y **no menciona las elecciones del 3 de noviembre**,
  que es el detonante de la segunda ola (§3).
- **Para nosotros:** su tono cercano y su «explicar el mecanismo» encajan con el canal; sus cifras sin
  fecha, no. Nuestro formato (fuente en la caja de diálogo, una idea por escena) arregla justo eso.

---

## 2. Línea de tiempo de la historia (cronología verificada)

| Fecha | Qué pasó | Fuente |
|---|---|---|
| 2026-10-15 | Explosión en la fábrica **Fab 28** de Intel en Kiryat Gat (Israel). **Dos trabajadores muertos** y un tercero grave; la policía sospecha un fallo de una bombona de gas y hubo una fuga de trifluoruro de nitrógeno (NF3). | [DCD](https://www.datacenterdynamics.com/en/news/two-workers-killed-third-injured-in-explosion-at-intels-kiryat-gat-fab-in-israel/), [Jerusalem Post](https://www.jpost.com/israel-news/article-880000) |
| 2026-10-28 | **Resultados de Alphabet (Q3 2026)**: ingresos de 127.580 M $ (por debajo de lo esperado), beneficio neto 26.170 M $, **flujo de caja libre de −9.070 M $**, gasto de capital de 51.360 M $ y **deuda a largo plazo de 125.100 M $** (frente a 21.600 M $ un año antes). Mantiene el gasto anual en 195.000-205.000 M $. La acción cae más del 10 %; se borran unos 500.000 M $ de capitalización. | [CNBC](https://www.cnbc.com/2026/10/28/alphabet-googl-earnings-q3-2026.html), [The Guardian](https://www.theguardian.com/technology/2026/oct/28/alphabet-google-earnings-q3-2026) |
| 2026-10-29 | **Resultados de Reddit (Q3 2026)**: ingresos de 895 M $ y beneficio por acción de 1,40 $ (por encima de lo esperado), pero **previsión del Q4 floja** y **130,3 M de usuarios activos diarios** (se esperaban 133,7 M; en EE. UU., 50,7 M, un 2 % menos). Huffman: el tráfico de búsqueda de Google «bajó de forma significativa en este trimestre» por «el cambio a AI mode y AI overviews». Anuncia **probar el inicio de sesión obligatorio** en el Q4, fuera de EE. UU. La acción cae más del 15 % ese día y **más del 29 %** al día siguiente. | [CNBC](https://www.cnbc.com/2026/10/29/reddit-rddt-q3-2026.html), [Yahoo Finance](https://finance.yahoo.com/news/reddit-shares-plunge-26-despite-earnings-2026-10-30.html) |
| 2026-10-29 | **Resultados de Intel (Q3 2026)**: supera las estimaciones del trimestre pero la previsión del Q4 decepciona (la debilidad del PC y los problemas de suministro); la acción cae más del 20 % ese día. | [CNBC](https://www.cnbc.com/2026/10/29/intel-stock-plunges-21percent-as-chipmaker-blames-pc-slowdown-for-weak-guidance.html), [Quartz](https://qz.com/intel-stock-falls-q3-2026-earnings-weak-outlook) |
| 2026-10-30 (viernes) | **Intel −28 %**, su peor día desde los años 70; unos 130.000 M $ de valor borrados y unos 12.000 M $ de pérdida en la participación del Estado. El resto de chips cae en cadena. **Nasdaq −2,9 %**, S&P 500 −1,8 %; octubre cierra como **el peor mes del Nasdaq desde marzo de 2025**. | [CNBC](https://www.cnbc.com/2026/10/30/intel-stock-worst-day-since-1970s-wiping-12-billion-off-governments-stake.html), [Reuters](https://www.reuters.com/business/intel-warning-sparks-chip-rout-pc-weakness-clouds-turnaround-2026-10-29/), [CNN](https://www.cnn.com/2026/10/30/investing/nasdaq-worst-month-ai-selloff) |
| 2026-10-30 | Intel confirma que la parada de Fab 28 será de **dos semanas** y que le costará **600 M $ en ventas**, con el suministro de Xeon afectado. | [Tom's Hardware](https://www.tomshardware.com/pc-components/cpus/deadly-intel-fab-28-explosion-causes-two-week-shutdown-to-cost-dollar600-million-and-severely-disrupt-server-chip-manufacturing-for-six-months) |
| 2026-11-03 | **Elecciones de medio mandato en EE. UU.**: victoria holgada de los demócratas, que recuperan el Congreso. | [Reuters](https://www.reuters.com/world/us/) (en directo, 2026-11-04), [NYT](https://www.nytimes.com/live/2026/11/04/us/midterm-elections) |
| 2026-11-04/05 | **Segunda ola**: el Nasdaq cae un 5 % en un día y entra en corrección; se habla de **2,5 billones de dólares** borrados en la semana; el índice del miedo marca «miedo extremo». | [WSJ](https://www.wsj.com/livecoverage/stock-market-today-dow-sp-500-nasdaq-11-05-2026), [CNN](https://www.cnn.com/2026/11/05/investing/tech-heavy-nasdaq-plunges) |
| 2026-11-09/11 | Los opositores a los centros de datos celebran el resultado electoral; Reuters cuenta que el Congreso recibe su primera ley de permisos para centros de datos tras la «ola azul». | [CNN](https://www.cnn.com/2026/11/11/tech/data-center-midterms), [Reuters](https://www.reuters.com/) |
| 2026-11-09/10 | **NVIDIA entra en mercado bajista**; la acción cae un 3 % más tras las informaciones sobre el supuesto vínculo de Jensen Huang con una presunta espía china (ya tratado en el vídeo `nvidia-huang-espionaje`). | [BeInCrypto](https://beincrypto.com/nvidia-bear-market-jensen-huang/), [r/technology](https://www.reddit.com/r/technology/comments/1xsqesa/nvidia_stock_drops_3_extending_decline_on_report/) |

> **Aviso de fecha:** la línea de tiempo se cierra el 2026-11-11. Si el vídeo sale más tarde, las cifras de
> bolsa hay que releerlas (regla N2: revisar fuentes si han pasado más de 3 días).

---

## 3. Qué es cierto, qué es matizable y qué falta

### 3.1 Verificación de las cifras de midudev

| Lo que dice el vídeo | Estado | Matiz que hay que decir |
|---|---|---|
| Nasdaq −2,9 % y S&P 500 −1,8 % el viernes 30 | **Verificado** | Es el día, no el mes. |
| Nasdaq un 8 % por debajo del máximo del 6 de octubre y «peor mes desde marzo de 2025» | **Verificado** | El −8 % es a cierre del 30 de octubre. |
| Intel −28 % en un día; 130.000 M $ de valor | **Verificado** | Fue el 30 de octubre; el peor día desde los años 70. |
| Intel «ha perdido en tres días un tercio del valor» | **Matizable** | Lo que dicen las crónicas es que la acción cayó más del 40 % desde los resultados (Morningstar, 6 nov). «Un tercio en tres días» no lo he podido confirmar tal cual. |
| Google −12 % en un día | **Matizable** | CNBC habla de «más del 10 %» el 28 de octubre; otras crónicas, de un 13 % intradía. Decir «en torno al 10-13 %». |
| Google pierde «más de 500.000 millones» | **Verificado** | Unas 500.000 M $ de capitalización, el 28 de octubre. |
| Reddit «se perdió un cuarto del valor en un día» | **Verificado** | −29,2 % el 30 de octubre (Infobae); CNBC y Yahoo dicen «más del 26 %». |
| Reddit «un millón de referencias en promedio por semana» | **Parcial** | La cifra aparece en titulares de varios medios (Dealroom, Search Engine Journal) atribuida al CEO, pero **no he podido abrir el artículo original**. Si entra, con la cita directa de Huffman y su fecha; si no, se dice «el CEO habla de una caída semanal de enlaces desde Google» sin cifra. |
| Reddit: «el modo IA no genera tráfico ni para nosotros ni para nadie» | **Parcial** | La frase la recoge la prensa como cita de un directivo de Reddit, pero no he leído la entrevista original. La versión **verificada** es la de Huffman a CNBC: el tráfico de búsqueda «bajó de forma significativa» por «el cambio a AI mode y AI overviews». Usar esa. |
| Intel: el Estado de EE. UU. es el mayor accionista con más del 10 % | **Verificado** | La participación se formalizó en 2025; con el desplome del 30 de octubre, el Estado perdió unos 12.000 M $ en un día. |
| Intel: gasto de capital previsto de 16.000 M $ frente a 17.000 esperados | **Parcial** | No he encontrado la fuente que lo confirme para el Q4 2026. **No entra** sin fuente. |
| «Este año no habrá flujo de caja positivo» (CFO de Intel) | **Parcial** | Coherente con la prensa («el CFO avisa del flujo de caja»), pero no he leído la transcripción de la llamada. Si entra, con fuente de la llamada de resultados. |
| Explosión de Fab 28: 600 M $, dos semanas cerrada | **Verificado** | Y **dos trabajadores muertos**: el vídeo dice «accidente» y se lo salta. Nosotros lo diremos con respeto y sin sensacionalismo. |
| Alphabet: gasto de 200.000 M $ este año | **Verificado** | Guía de 195.000-205.000 M $; «más de 200.000 M $» y más de 300.000 M $ en 2027. |
| Meta, Alphabet, Oracle, Amazon y Microsoft: 800.000 M $ en 2026 | **Parcial** | La cifra de 800.000 M $ aparece en estimaciones de analistas (Morgan Stanley) y en la prensa; las guías oficiales sumadas son del orden de 690.000-700.000 M $ a principios de año y han subido. **Decir «del orden de» y con fuente de las guías, no de un titular.** |
| «La caída se acerca al billón de dólares» | **Parcial** | El titular de NBC («1 billón en valor de acciones tecnológicas») está en el buscador de noticias, pero no he podido abrir el artículo. Para el 5 de noviembre, la cifra citada por WSJ y CNN es de 2,5 billones. Usar la del 5 de noviembre con WSJ/CNN, o ninguna. |

### 3.2 Lo que el vídeo deja fuera y sí es noticia (nuestro valor añadido)

1. **Las elecciones del 3 de noviembre.** La segunda ola (Nasdaq −5 %, corrección, 2,5 billones) llega
   **después** de los comicios; en Hacker News y en la prensa se relaciona con el resultado (victoria
   demócrata, freno a los centros de datos, iniciativas locales contra su construcción). Un vídeo grabado
   el 10 de noviembre que no lo menciona se queda a medias. → [WSJ](https://www.wsj.com/livecoverage/stock-market-today-dow-sp-500-nasdaq-11-05-2026), [Le Monde](https://www.lemonde.fr/economie/article/2026/11/06/on-wall-street-democrats-midterm-victory-bursts-the-ai-bubble_...)
2. **La deuda.** Alphabet pasa de 21.600 a 125.100 M $ de deuda a largo plazo en un año (+479 %). Alphabet
   no es una empresa que se endeude por capricho: es la señal de que el gasto ya no lo paga la caja.
   → [CNBC](https://www.cnbc.com/2026/10/28/alphabet-googl-earnings-q3-2026.html)
3. **El mercado de bonos.** Moody's avisó en julio de que el gasto «sin precedentes» en IA amenaza la
   calidad crediticia de Amazon, Meta y Alphabet; Goldman proyecta el gasto de los hiperescaladores en
   1,2 billones para 2027. → [CNBC](https://www.cnbc.com/2026/07/24/moodys-ai-spending-credit-quality-amazon-meta-alphabet.html), [Bloomberg](https://www.bloomberg.com/news/articles/2026/09/25/goldman-sees-hyperscaler-ai-capex-rising-50-to-1-2-trillion)
4. **El muro de Reddit ya está pasando.** Desde agosto de 2026, `old.reddit.com` pide cuenta en muchos
   países; el 29 de octubre, el CEO (u/spez) lo anunció a toda la comunidad. → [Reddit](https://www.reddit.com/user/spez/comments/1xiupm0/about_that_login_screen/), [HN](https://news.ycombinator.com/item?id=50295893)
5. **El otro lado del muro: los publicadores.** La caída de clics por los resúmenes de IA no es solo de
   Reddit: la prensa especializada documenta caídas de tráfico de medios de salud y de noticias. → [Press Gazette](https://pressgazette.co.uk/media-audience-and-business-data/ai-overviews-publisher-traffic/)

---

## 4. Lo que dicen X, Reddit, Hacker News y YouTube

> **Límite honesto:** X no se puede leer sin sesión (el navegador sin cuenta no carga los tuits), y Reddit
> ha bloqueado las búsquedas desde esta máquina (403/429) y no se usan las cookies de Mario. Lo de Reddit
> es lo que se ha podido leer por sus canales públicos (RSS de subreddit y de hilo); lo de X, lo que citan
> las crónicas. Hacker News se ha leído entero por su API.

### 4.1 Hacker News (lo más útil: la discusión técnica de verdad)

| Hilo | Fecha | Puntos / comentarios | Idea que se puede usar |
|---|---|---|---|
| [Intel stock collapse worsens as $3.5T chip rout spreads](https://news.ycombinator.com/item?id=50346153) | 2026-11-03 | 236 / 227 | «Estoy acostumbrado a que “la acción se hunde” sea un 2 % diario. Esto es un −50 % en un mes… y un +50 % en un año». También: Intel sigue a un PER de 31, como AMD y muy por encima de Nvidia. |
| [Intel plunges 25 %, triggers global chip rout](https://news.ycombinator.com/item?id=50303791) | 2026-10-30 | 88 / 101 | La cadena de suministro: la debilidad del PC y la escasez de memoria. |
| [Nasdaq sinks 5 % as investors retreat from AI trade after election](https://news.ycombinator.com/item?id=50382179) | 2026-11-05 | 163 / 193 | «44 de 45 iniciativas electorales contra centros de datos pasaron». Es el dato que enlaza la política con la bolsa. |
| [Reddit will require an account to access](https://news.ycombinator.com/item?id=50295893) | 2026-10-29 | 64 / 17 | «Culpa a Google y a sus resúmenes de IA. No es tan fácil para el resto de nosotros poner nuestra web detrás de un inicio de sesión». |
| [I'm not convinced the AI bubble exists](https://news.ycombinator.com/item?id=50418975) | 2026-11-08 | 569 / 962 | El contraargumento, bien argumentado: amortizar las GPU a 5-6 años en vez de 20 multiplica por cuatro los ingresos necesarios. Sirve para dar la otra cara. |
| [Alphabet Q3 2026 results](https://news.ycombinator.com/item?id=50280197) | 2026-10-28 | 82 / 57 | «Alphabet pasó de 100.000 M $ de flujo de caja libre a negativo en meses». |

**Patrón de la comunidad:** en HN hay tres bandos. Los que dicen «esto es el pinchazo» (Intel como Cisco
del 2000: la tecnología gana, la acción no), los que dicen «la tecnología es real, la valoración no» y los
que dicen «llevamos tres años diciendo que estalla y no estalla». **Los tres caben en el vídeo** y es lo que
lo hace justo.

### 4.2 Reddit (r/technology, por RSS público)

| Hilo | Fecha | Idea |
|---|---|---|
| [Nvidia stock drops 3 %…](https://www.reddit.com/r/technology/comments/1xsqesa/nvidia_stock_drops_3_extending_decline_on_report/) | 2026-11-10 | «Reddit dice que la burbuja ha estallado cada vez que alguien estornuda» frente a «es el cisne negro que se esperaba». La tensión burbuja/evento. |
| [Anthropic sets IPO price range…](https://www.reddit.com/r/technology/comments/1xt2n58/anthropic_sets_ipo_price_range_of_70_to_78_per/) | 2026-11-10 | La IA como valoración: 1,404 billones de dólares implícitos, en plena semana de desplome. |
| [All 7 Anthropic founders will each cash out about $250M in IPO](https://www.reddit.com/r/technology/comments/1xt1vrf/all_7_anthropic_founders_will_each_cash_out_about/) | 2026-11-10 | El contraste: los que construyen cobran ahora; los inversores esperan la rentabilidad. |

### 4.3 X (lo que citan las crónicas)

- El hilo de [@kouhxp](https://twitter.com/kouhxp/status/2116218737237840261) sobre la admisión del CEO
  de Reddit (enlazado en HN el 2026-10-30).
- Las cuentas financieras de la prensa (Reuters, CNBC, WSJ) son la fuente real de los movimientos; no hay
  un hilo viral de X que haya marcado la narrativa, lo cual ya es un dato: **esto se ha contado desde la
  prensa económica, no desde la red**.

### 4.4 YouTube

- El propio vídeo de midudev: 114.913 visualizaciones en 24 horas con 177 comentarios (ratio de comentarios
  bajo: es un vídeo de consumo, no de debate).
- El tema está muy cubierto en inglés (canales de finanzas y de IA) y **poco en español con tono de
  divulgación tecnológica**. Ahí está el hueco del canal.

---

## 5. Ángulos posibles para el vídeo (y recomendación)

| # | Ángulo | Gancho | Riesgo | Veredicto |
|---|---|---|---|---|
| A | **«La IA pasa factura»**: quién paga el gasto y qué se rompe primero | «Google acaba de gastar más dinero del que gana. Y no es el único.» | Es el del vídeo original; hay que darle vuelta | **Base recomendada** |
| B | **«La IA se come el internet que la alimenta»**: resúmenes → menos clics → Reddit se cierra → ¿y si las webs cobran a los bots? | «Reddit va a cerrar su puerta. Y la llave se la ha dado Google.» | Es opinión futura; hay que separar hecho y predicción | **El mejor para el short** |
| C | **«¿Burbuja o no?»** | «Tres expertos, tres respuestas» | Imposible de cerrar; ya muy gastado | **No** como tema principal; sí como matiz dentro de A |
| D | **«Intel, el Cisco del 2026»** | «La empresa que hizo los chips del mundo acaba de vivir su peor día en 50 años» | Muy técnico; se queda corto para un largo | Sección dentro de A |

**Recomendación:** un largo con el ángulo **A**, que usa **B** como giro en el minuto 5 y **C** como
matiz en el cierre, más un short con el ángulo **B**.

- Categoría: IA / noticias · Nivel: **N2** (noticia) · Duración objetivo: 8-10 min.
- Público: el mismo del canal (gente curiosa con algo de tecnología, no inversora). **Sin consejos de
  inversión** (regla N3 aplicada por prudencia: dinero).
- Fecha límite: es noticia; si no sale esta semana, el cierre cambia a «qué ha pasado desde entonces».

---

## 6. Hechos que entrarían en el guion (borrador de `verificacion.md`)

| # | Hecho (tal como saldría) | Fuentes | Estado |
|---|---|---|---|
| 1 | El 30 de octubre Intel cayó un 28 % en un día, su peor jornada desde los años 70 | CNBC, Reuters | verificado |
| 2 | Intel anunció el 29 de octubre unos resultados por encima de lo esperado pero una previsión del Q4 floja por la debilidad del PC | CNBC, Quartz | verificado |
| 3 | La explosión del 15 de octubre en su fábrica Fab 28 (Israel) mató a dos trabajadores; Intel calcula 600 M $ en ventas perdidas y dos semanas de parada | DCD, Tom's Hardware | verificado |
| 4 | Alphabet presentó el 28 de octubre un flujo de caja libre de −9.070 M $ y una deuda a largo plazo de 125.100 M $ (21.600 M $ un año antes) | CNBC | verificado |
| 5 | Alphabet mantiene un gasto de capital de 195.000-205.000 M $ en 2026 y prevé «un aumento significativo» en 2027 | CNBC | verificado |
| 6 | La acción de Alphabet cayó más del 10 % y se borraron unos 500.000 M $ de capitalización | CNBC, The Guardian | verificado |
| 7 | Reddit perdió el 30 de octubre más del 26 % de su valor en un día, tras una previsión del Q4 floja | CNBC, Yahoo Finance | verificado |
| 8 | Reddit tuvo 130,3 M de usuarios activos diarios en el Q3 (se esperaban 133,7 M); en EE. UU. bajó un 2 % | CNBC | verificado |
| 9 | El CEO de Reddit atribuye la caída del tráfico de búsqueda a «AI mode y AI overviews» de Google | CNBC | verificado |
| 10 | Reddit probará el inicio de sesión obligatorio en el Q4, fuera de EE. UU. | CNBC, Reddit (spez) | verificado |
| 11 | El Nasdaq cerró octubre como su peor mes desde marzo de 2025 y el 5 de noviembre cayó un 5 % en un día | CNN, WSJ | verificado |
| 12 | Las elecciones del 3 de noviembre y las iniciativas locales contra centros de datos se citan como detonante de la segunda ola | WSJ, CNN, HN | **parcial** (relación causal, no probada) |
| 13 | Los hiperescaladores gastarán del orden de 800.000 M $ en 2026 | Estimaciones de analistas | **parcial** (decir «del orden de» y «según estimaciones») |
| 14 | Moody's avisó de que el gasto en IA amenaza la calidad crediticia de Amazon, Meta y Alphabet | CNBC | verificado |
| 15 | Intel: gasto de 16.000 M $ frente a 17.000 esperados | sin fuente | **no entra** |

---

## 7. Posible narración (largo, 8-10 min)

> Voz de MISTA, tono de explicación tranquila con un punto de tensión. Cada bloque indica su duración
> aproximada y **la fuente que iría en la caja de diálogo**. No es el guion definitivo: es la narración de
> trabajo para decidir ángulo y ritmo.

### Bloque 0 · Gancho (0:00-0:25)

> «El 30 de octubre, Intel vivió su peor día en bolsa desde los años setenta. Perdió el 28 % de su valor
> en una sola jornada. Ese mismo mes, Google borró medio billón de dólares de su valor. Y Reddit, la web
> que millones de personas usan para decidir qué comprar, qué ver o qué creer, se dejó un cuarto de sí
> misma en un día. Nadie ha dejado de usar la IA. Y aun así, las empresas que la construyen se están
> cayendo. ¿Qué está pasando?»

*[f1] CNBC · [f2] CNBC · [f7] CNBC*

### Bloque 1 · La cuenta que nadie mira (0:25-2:10)

> «Para entenderlo hay que mirar una línea de los resultados que casi nadie lee: el flujo de caja libre.
> Es lo que queda cuando una empresa paga todo lo que cuesta funcionar. Si es positivo, le sobra dinero.
> Si es negativo, se está financiando con deuda o con lo que tenía ahorrado.
> Alphabet acaba de presentar el suyo: menos 9.070 millones de dólares en un trimestre. Y su deuda a
> largo plazo pasó de 21.600 millones a 125.100 millones en un año. Casi seis veces más.
> Google no está en problemas: gana 26.000 millones en el trimestre y su nube duplica ingresos. El
> problema es otro. Está gastando 200.000 millones al año en construir centros de datos y chips, y el
> dinero que gana con eso todavía no llega. El mercado no pregunta si la IA funciona. Pregunta cuándo
> devuelve el dinero.»

*[f4] CNBC · [f5] CNBC*

### Bloque 2 · Intel: el aviso (2:10-3:40)

> «Intel es el caso más brutal y, a la vez, el más engañoso. Cayó un 28 % en un día, sí, pero no por la
> IA: por los ordenadores. Sus resultados del trimestre estuvieron bien; el problema fue lo que dijo del
> siguiente. La gente compra menos PC, y una de las razones es que la memoria RAM se ha encarecido
> porque los centros de datos de IA se la están llevando toda.
> Y encima, una explosión en una de sus fábricas la dejó parada dos semanas. La empresa calcula 600 millones
> de dólares en ventas perdidas. (Decisión de Mario, 2026-11-11: de la explosión no se nombra a nadie.)
> La lección: cuando la IA se lleva los recursos, no solo se los quita a sus rivales. Se los quita
> también a la vieja informática.»

*[f1] CNBC · [f2] CNBC · [f3] DCD / Tom's Hardware*

### Bloque 3 · El giro: la IA de Google se come a Google (3:40-5:40)

> «Y aquí llega la parte que da un poco de vértigo. ¿Cómo gana dinero Google? Con anuncios en el buscador.
> ¿Qué ha puesto Google encima del buscador? Resúmenes de IA que contestan la pregunta sin que tengas que
> entrar en ninguna web.
> Funciona de maravilla para el usuario. Y es un problema para el negocio: cada respuesta que se queda en
> Google es una visita que no llega a la web de al lado. Y cada visita que no llega es una página menos
> que ve anuncios.
> La primera víctima famosa es Reddit. Su director ejecutivo lo dijo sin rodeos: el tráfico que le manda
> Google bajó de forma significativa este trimestre por el cambio a la búsqueda con IA. Y Reddit ya ha
> decidido qué hacer: cerrar la puerta. A partir del próximo trimestre va a probar pedir una cuenta para
> entrar.»

*[f9] CNBC · [f10] CNBC / Reddit*

### Bloque 4 · El experimento mental (5:40-7:00)

> «Piensa un momento en lo que eso significa. Reddit no cierra el grifo a las personas. Se lo cierra a los
> robots. Porque la IA que le quita el tráfico es la misma que le lee el contenido para entrenarse y para
> dar respuestas.
> Y aquí está la pregunta que va a definir los próximos años: ¿qué pasa cuando la web entera ponga la
> puerta? Ya hay tiendas que bloquean a los agentes de IA. Si el contenido es el que alimenta a la IA, y
> la IA se lleva a los lectores, alguien tendrá que pagar el contenido. La pregunta es quién, cuánto y con
> qué reglas. Y eso no es un hecho: es la apuesta de este vídeo.»

*[f10] Reddit · [f8] CNBC*

### Bloque 5 · La otra cara: ¿es una burbuja? (7:00-8:30)

> «Y ahora la pregunta del millón, la que todos hacen: ¿es una burbuja? La respuesta honesta es que nadie
> lo sabe, y quien te diga que sí con seguridad, está adivinando.
> Los que dicen que sí se fijan en la historia: en el año 2000, Cisco era la empresa que hacía funcionar
> internet. Internet ganó. Cisco perdió. La tecnología puede ser real y la acción, un desastre.
> Los que dicen que no se fijan en el uso: cada vez más gente paga por usar IA, cada vez más empresas la
> meten en su trabajo, y la demanda de cómputo no para de crecer.
> Puede que los dos tengan razón. La IA puede ser el futuro y, a la vez, que las empresas que la
> construyen hayan gastado más de lo que pueden recuperar a tiempo.»

*[f11] HN · [f12] HN*

### Bloque 6 · Cierre (8:30-9:30)

> «La semana pasada, además, pasó algo que cambia el tablero: las elecciones de medio mandato en Estados
> Unidos. El Nasdaq cayó un 5 % en un día y entró en corrección. Y los que se oponen a los centros de
> datos están celebrando el resultado: los votantes castigaron a los candidatos que los defendían.
> Así que la IA ya no es solo un tema de ingenieros. Es un tema de dinero, de energía, de política y de
> quién puede leer qué. La próxima vez que uses un resumen de IA para no entrar en una web, acuérdate:
> ese clic que no das es el que alguien está echando de menos en su cuenta de resultados.»

*[f11] WSJ · [f19] Reuters · [f20] CNN*

### Short (9:16, hasta 120 s) · «Reddit va a cerrar la puerta»

> «Reddit va a pedirte una cuenta para poder leerlo. Y la culpa no es tuya: es de la IA de Google.
> Su CEO lo dijo esta semana: el tráfico que le manda Google ha caído porque la búsqueda con IA ya
> contesta sin que tengas que entrar en ningún sitio. Menos clics, menos anuncios, menos dinero.
> Y la solución que han elegido es cerrar la puerta. Pero ojo al detalle: la puerta no es para ti.
> Es para los robots. Porque la IA que le roba las visitas es la misma que le lee el contenido.
> Y aquí está la pregunta del año: si todas las webs hacen lo mismo, ¿quién alimenta a la IA?
> ¿Y quién paga el contenido que la IA se lleva gratis? La respuesta, en el vídeo completo.»

*[f8] CNBC · [f9] Reddit · [f9b] The Verge*

---

## 8. Decisiones de Mario (2026-11-11)

1. **El largo se hace** si hay información suficiente. → La hay: 15 hechos verificados con fuente.
2. **Ángulo A** (la factura) **con B como giro** (el internet que se cierra).
3. **De la explosión, no se nombra a nadie**: ni a los trabajadores ni a la fábrica por su nombre.
4. **Del vídeo de origen, nada de su autor**: se usa su información, su transcripción y sus opiniones, sin
   nombrarlo. En el guion se dice «lo que dice la prensa» o «una opinión muy repetida», nunca «un vídeo dice».

### Preguntas que siguen abiertas

1. **¿Se menciona la explosión, aunque sea sin nombres?** En el guion la he dejado como «una explosión en una
   de sus fábricas» y sin imagen de impacto. Si prefieres que no aparezca en absoluto, se quita en una línea.
2. **¿La cifra de los 800.000 millones?** Es estimación de analistas, no guía oficial. En el guion la he
   quitado y he puesto la de Alphabet, que sí es oficial. ¿Te vale así?
3. **¿Nombre del vídeo?** Propuesta: «La IA ya está pasando factura (y la primera factura la paga internet)».
4. **¿Duración?** El guion de abajo va a unos 9 minutos de voz. Si lo quieres más corto, el bloque 5
   (¿burbuja sí o no?) es el que menos pesa.

---

## 8 bis. Datos de mercado al cierre del 2026-11-10 (Yahoo Finance, consultados el 2026-11-11)

Son la foto que el vídeo de origen no da, porque mezcla días. Sirven para el guion y para los gráficos.

| Valor | Cierre | Día | 1 mes | 1 año | Máx./mín. 52 semanas |
|---|---|---|---|---|---|
| Intel (INTC) | 58,13 $ | −2,09 % | **−44,48 %** | +51,18 % | 32,89 / *máximo no leído* |
| Alphabet (GOOGL) | 287,38 $ | −0,27 % | **−18,28 %** | −0,94 % | — |
| Reddit (RDDT) | 98,67 $ | −2,10 % | **−38,30 %** | −51,68 % | 89,28 / 263,50 |
| NVIDIA (NVDA) | 168,89 $ | **−5,47 %** | −26,34 % | −15,15 % | — |
| Nasdaq Composite | 25.065,88 | −0,74 % | **−8,41 %** | +6,54 % | 20.690,25 / 27.722,75 |

**Lo que dicen estos números y es más honesto que «se hunde»:** Intel ha caído un 44 % en un mes, pero
**sube un 51 % en un año**. Reddit, en cambio, está en **mínimos de 52 semanas** (89,28 $) y ha perdido más
de la mitad en un año. Y el Nasdaq, con todo el ruido, **sube un 6,5 % en un año**. La historia no es «todo
se hunde»: es que **el mercado está separando a las empresas que pagan la factura de las que la cobran**.

## 9. Fuentes registradas

| id | Medio | Título | URL | Fecha |
|---|---|---|---|---|
| f0 | YouTube · midudev | La IA empieza a pasar factura a las tecnológicas | https://www.youtube.com/watch?v=VKq42hak7Ak | 2026-11-10 |
| f1 | CNBC | Intel stock has worst day since 1970s, wiping about $12 billion off government's stake | https://www.cnbc.com/2026/10/30/intel-stock-worst-day-since-1970s-wiping-12-billion-off-governments-stake.html | 2026-10-30 |
| f2 | CNBC | Intel stock plunges 21 % as chipmaker blames PC slowdown for weak guidance | https://www.cnbc.com/2026/10/29/intel-stock-plunges-21percent-as-chipmaker-blames-pc-slowdown-for-weak-guidance.html | 2026-10-29 |
| f3 | Data Center Dynamics | Two workers killed, third injured, in explosion at Intel's Kiryat Gat fab in Israel | https://www.datacenterdynamics.com/en/news/two-workers-killed-third-injured-in-explosion-at-intels-kiryat-gat-fab-in-israel/ | 2026-10-15 |
| f4 | CNBC | Alphabet (GOOGL) earnings Q3 2026 | https://www.cnbc.com/2026/10/28/alphabet-googl-earnings-q3-2026.html | 2026-10-28 |
| f5 | The Guardian | Google owner Alphabet loses $500bn in market value after profit disappoints Wall Street | *titular del buscador de noticias; URL por confirmar* | 2026-10-28 |
| f6 | Reuters | Intel plunges 25 %, triggers global chip rout on bleak outlook | *titular en HN (id 50303791); Reuters devuelve 401, URL por confirmar* | 2026-10-30 |
| f7 | Yahoo Finance | Reddit shares plunge 26 % despite earnings beat as user growth and outlook disappoint | *titular del buscador de noticias; URL por confirmar* | 2026-10-30 |
| f8 | CNBC | Reddit (RDDT) Q3 2026 earnings report | https://www.cnbc.com/2026/10/29/reddit-rddt-q3-2026.html | 2026-10-29 |
| f9 | Reddit (u/spez) | About that login screen | https://www.reddit.com/user/spez/comments/1xiupm0/about_that_login_screen/ | 2026-10-29 |
| f9b | The Verge | Reddit's CEO says Google's AI Mode 'does not drive traffic' | *titular del buscador de noticias; URL por confirmar* | 2026-10-29 |
| f10 | CNN Business | Nasdaq suffers worst month in over a year as AI nerves roil markets | *titular del buscador de noticias; URL por confirmar* | 2026-10-30 |
| f11 | WSJ | Nasdaq sinks 5 % as investors retreat from AI trade after election | https://www.wsj.com/livecoverage/stock-market-today-dow-sp-500-nasdaq-11-05-2026 | 2026-11-05 |
| f12 | Hacker News | Intel stock collapse worsens as $3.5T chip rout spreads | https://news.ycombinator.com/item?id=50346153 | 2026-11-03 |
| f13 | Hacker News | I'm not convinced the AI bubble exists | https://news.ycombinator.com/item?id=50418975 | 2026-11-08 |
| f14 | Tom's Hardware | Deadly Intel Fab 28 explosion causes two-week shutdown, to cost $600 million | *titular del buscador de noticias; URL por confirmar* | 2026-10-30 |
| f15 | CNBC | Moody's says 'unprecedented' AI spending threatens credit quality | *titular del buscador de noticias; URL por confirmar* | 2026-07-24 |
| f16 | Bloomberg | Goldman sees hyperscaler AI capex rising 50 % to $1.2 trillion | *titular del buscador de noticias; URL por confirmar* | 2026-09-25 |
| f17 | NBC News | Tech stocks wipe out $1 trillion in value as concerns deepen about the AI boom | *titular del buscador de noticias; URL por confirmar* | 2026-10-30 |
| f18 | Press Gazette | AI Overviews and publisher traffic | *titular del buscador de noticias; URL por confirmar* | 2026-05-15 |
| f19 | Reuters | Democrats secure resounding US midterms victory | *titular del buscador de noticias; URL por confirmar* | 2026-11-04 |
| f20 | CNN | AI data center opponents are cheering midterm results | *titular del buscador de noticias; URL por confirmar* | 2026-11-11 |
| f21 | Yahoo Finance | Cotización INTC | https://finance.yahoo.com/quote/INTC/ | 2026-11-10 |
| f22 | Yahoo Finance | Cotización GOOGL | https://finance.yahoo.com/quote/GOOGL/ | 2026-11-10 |
| f23 | Yahoo Finance | Cotización RDDT | https://finance.yahoo.com/quote/RDDT/ | 2026-11-10 |
| f24 | Yahoo Finance | Cotización NVDA | https://finance.yahoo.com/quote/NVDA/ | 2026-11-10 |
| f25 | Yahoo Finance | Cotización ^IXIC (Nasdaq Composite) | https://finance.yahoo.com/quote/%5EIXIC/ | 2026-11-10 |

**Qué se ha abierto entero y qué no.** Leídos enteros: f0 (vídeo y transcripción), f3 (DCD), f4 (CNBC
Alphabet), f8 (CNBC Reddit), f9 (Reddit/spez, vía HN), f12 y f13 (hilos de HN), f11 (titular de WSJ en HN).
El resto son **titulares del buscador de Google Noticias**: la cifra es de fiar, pero la URL no está
confirmada (Reuters devuelve 401; The Verge, CNBC y Tom's Hardware dan 404 en las URLs construidas a mano).

> **Pendiente antes de la PUERTA 1:** abrir una a una las fuentes marcadas con *URL por confirmar* y las
> marcadas como *parcial* en §3.1. No entra en el guion ninguna cifra que no se haya leído entera.