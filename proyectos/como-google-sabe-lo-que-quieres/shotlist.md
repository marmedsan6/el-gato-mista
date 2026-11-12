# Shotlist · como-google-sabe-lo-que-quieres

Estilo v6: una estación por idea. Para cada dato, qué se DIBUJA (no qué etiqueta lleva). Texto: solo el rótulo de tema,
como mucho 1 identificador o 1 cifra por estación, y los nombres dentro del dibujo. La fuente sale sola en la caja.

Decidido con Mario (2026-11-11): MISTA de pie con rótulo en los 7 bloques; zoom núcleo en el estudio del micrófono, la
etiqueta y la lista, el embudo de YouTube y la subasta; música «Morning Coffee»; YouTube, Google y Chrome como pantallas
genéricas con su nombre en una placa dentro del dibujo (`placa6`), sin logotipos. La tienda nunca se nombra.

**Hilo visual:** el mismo robot aspirador (disco gris con franja naranja y piloto verde) aparece en todas las estaciones
donde se habla de él: es el sujeto que el espectador sigue. Detrás de él, un rastro de huellas pixel que se va alargando
de bloque en bloque (de la búsqueda a la tienda, de la tienda a la lista, de la lista a la subasta).

**Mundos:** uno por bloque (resuelve el punto 5 de la hoja de ruta), de 3 a 5 pantallas cada uno; el desplazamiento
lateral de 0,4 s del cambio de tema hace de puerta entre mundos.

**Cambios al construir el largo (2026-11-11; la implementación manda: `escenas/largo/largo.js`).** Quedan 30 estaciones
en 8 mundos. Las frases de menos de 2,5 s no dan para estación propia (la pieza clave no llega a sus 2 s), así que se
juntan con la vecina:
- 1.2 va con 1.1 (el móvil y el carrito, en el salón);
- 2.3 y 2.4 comparten el filtro;
- 3.1 va con 3.2 y 3.4 con 3.3.

Se añade 5.0 «es publicidad»: la moneda que cae en el hueco del anuncio. La cifra de los 80.000 millones se quita (el
lint la da por transcripción) y la cuenta el mar de puntos de luz.

## Largo (~8 min 25 s · 8 bloques · 27 estaciones)
Frases: § = bloque del guion, p = párrafo dentro del bloque. Las frases exactas salen del timing tras la voz.

| Estación | Frases | Qué se ve (delante · fondo) | Qué cambia cada 1-2 s | Pieza clave (2 s en pantalla) | Texto, si lo hay |
|---|---|---|---|---|---|
| **— Entrada** | §1 p1 (inicio) | MISTA entero con el título · salón de noche, sofá y lámpara cálida | MISTA aparece con su saltito; el título se escribe; MISTA sale hacia el sofá | Título | Título «¿CÓMO LO SABE?» |
| 1.1 La portada | §1 p1 | Tele grande con una ventana de reproductor genérico; en la miniatura, el robot aspirador · salón | La tele se enciende; la portada se llena de miniaturas a saltos; la del robot se ilumina con un marco `seleccion` | Miniatura del robot | Placa «YOUTUBE» en el marco de la tele |
| 1.2 Ayer | §1 p2 | Móvil en la mano con la ficha de la tienda (robot, botón de comprar apagado) · calendario de pared que pasa una hoja hacia atrás | La hoja del calendario cae; el dedo pasa por la ficha y se va sin pulsar; el carrito sigue vacío | Carrito vacío | — |
| 1.3 Otra vez | §1 p3-p4 | Tablet con una web de noticias (columnas de texto gris pixelado) · salón | Scroll del artículo; en mitad aparece el hueco del anuncio y dentro el mismo robot; un signo de interrogación grande sobre el sofá | El robot dentro del artículo | — |
| 1.4 El viaje | §1 p5 | El robot aspirador arranca y deja huellas pixel por el suelo · tres puertas al fondo (las de los bloques) | El robot avanza; las huellas se encienden una a una; al final, un panel de interruptores asoma (la promesa del cierre) | El robot en marcha | — |
| **— Cambio de tema** | §2 p1 (inicio) | MISTA de pie 1-2 s, desconfiado | Desplazamiento lateral de 0,4 s | Rótulo | «¿TE ESCUCHA?» |
| 2.1 La sospecha | §2 p1 | Dos figuras pixel genéricas hablando en un banco; un móvil boca arriba entre ellas · parque | Bocadillos con el dibujo del robot; el móvil vibra y su pantalla muestra el anuncio del robot | El anuncio en el móvil | — |
| 2.2 El laboratorio · **zoom núcleo** | §2 p2-p4 | Banco de laboratorio con una fila de móviles conectados por cables a un ordenador · edificio universitario de ladrillo | Zoom de 0,4 s; un brazo-dedo mecánico toca las pantallas por turnos; por los cables suben paquetes (cajitas de colores) hacia una nube; la placa «NORTHEASTERN» en la fachada | Paquetes subiendo | Cifra «17.260» (sola, grande, al entrar en §2 p3) · placa «NORTHEASTERN» |
| 2.3 Sin audio | §2 p5 | Un micrófono grande sobre un filtro (embudo) por el que pasan los paquetes · el laboratorio desenfocado | Pasan paquetes de imagen y texto; el compartimento del audio sigue vacío; el piloto del micrófono se queda apagado | Compartimento vacío con piloto apagado | Cifra «0» |
| 2.4 El límite | §2 p6 | Un bocadillo que se convierte en una hoja de texto antes de entrar al filtro, y el filtro no la reconoce · laboratorio | Bocadillo → hoja (cambia de forma); el filtro parpadea en ámbar y la deja pasar sin marcarla | La hoja que pasa sin marcar | — |
| 2.5 La pantalla | §2 p7-p8 | Móvil con una app de reparto (moto pixel) y una cámara diminuta que hace fotos de la propia pantalla · edificio de otra empresa al fondo | Clic de captura (destello); la foto vuela hacia el edificio de la analítica; segunda captura | La foto volando | Placas «GOPUFF» (en la app) y «APPSEE» (en el edificio) |
| 2.6 Pistas de sobra | §2 p9 | El robot aspirador aparca junto a un montón de migas que brillan · las huellas del bloque 1 | Las migas se encienden una a una; MISTA no sale (es frase puente) | Las migas | — |
| **— Cambio de tema** | §3 p1 (inicio) | MISTA de pie 1-2 s | Desplazamiento lateral | Rótulo | «EL RASTRO» |
| 3.1 La búsqueda | §3 p1 | Ventana de buscador genérico con el dibujo del robot en la barra · escritorio con flexo | Se escribe la búsqueda (dibujo, no letras); salen resultados; la lupa se va a una carpeta | La carpeta recibe la búsqueda | Placa «GOOGLE» en la ventana |
| 3.2 El archivador | §3 p2 | Archivador de la cuenta con cajones (lupa, mapa, globo de idioma, móvil, chincheta de zona) · estantería | Cada cajón se abre y recibe su ficha al ritmo de la frase | El cajón de la lupa lleno | Identificador «ACTIVIDAD» en el archivador |
| 3.3 La casilla | §3 p3-p4 | Una casilla grande que se marca y abre un cajón extra; por él entran pestañas de navegador · webs pequeñas al fondo con un puntito de Google | Check en la casilla; entran pestañas; las webs del fondo se encienden | El cajón extra abierto | Placa «CHROME» en las pestañas |
| 3.4 Deduce | §3 p5 | Las fichas del archivador se ordenan solas y forman la silueta del robot · archivador | Fichas que vuelan y encajan | La silueta del robot hecha de fichas | — |
| 3.5 El muro · **zoom núcleo (etiqueta)** | §3 p6-p7 | Mapa de internet: islas (buscador, reproductor, navegador) unidas por puentes iluminados a un faro central; islas oscuras sin puente · en una isla, la tienda con una pegatina | Zoom de 0,4 s a la tienda; la pegatina se ilumina y sale un hilo de luz hacia el faro; las islas sin puente siguen oscuras | La pegatina de la tienda con su hilo | Identificador «ETIQUETA» junto a la pegatina |
| **— Cambio de tema** | §4 p1 (inicio) | MISTA de pie 1-2 s | Desplazamiento lateral | Rótulo | «TE RECOMIENDA» |
| 4.1 La cuenta cuenta | §4 p2 | El archivador del bloque 3 manda una ficha a la tele del bloque 1 · salón | La ficha viaja por un tubo; la tele la recibe y se enciende la miniatura del robot | La ficha entrando en la tele | — |
| 4.2 El embudo · **zoom núcleo** | §4 p3-p5 | Embudo gigante de dos pisos: arriba, una lluvia de miles de miniaturas; abajo, una bandeja con unas docenas que entran en una tele · sala de máquinas | Zoom de 0,4 s; las miniaturas caen; el primer piso deja pasar un puñado; el segundo las ordena en fila | La fila ordenada saliendo del embudo | Placa «2016» en la caldera del embudo |
| 4.3 Reloj contra clic | §4 p6-p7 | Balanza: en un plato, un cursor de clic; en el otro, un reloj de arena · miniaturas con caras de sorpresa (clickbait) que se caen al vacío | La balanza se inclina hacia el reloj; las miniaturas engañosas caen; la arena corre | La balanza inclinada | — |
| 4.4 El 20 % | §4 p8 | Contador mecánico de visualizaciones que baja · calendario 2011 → 2012 | Pasa la hoja; el contador baja de golpe; una figura pixel (genérica) se encoge de hombros y sigue | El contador bajando | Cifra «-20 %» |
| 4.5 Las señales | §4 p9-p10 | Tablero de mandos con seis palancas dibujadas (clic, reloj, estrella, flecha de compartir, pulgar arriba, pulgar abajo) · al fondo, un mar de puntitos de luz (las señales) | Cada palanca se mueve al nombrarla; la encuesta de estrellas se rellena hasta cinco | Las seis palancas | Cifra «80.000 M» |
| 4.6 Gente parecida | §4 p11-p13 | Tres siluetas genéricas en fila, cada una con su tele; las dos primeras ya ven «trucos de limpieza» (una escoba en la miniatura) · sala | La miniatura salta de tele en tele hasta la del espectador; un hilo une las tres | La escoba llegando a la tele del espectador | — |
| 4.7 Discover | §4 p14-p16 | Móvil en vertical con tarjetas de artículos que suben solas; la de arriba, una comparativa de robots · dormitorio, mañana | Las tarjetas suben; la ficha del archivador entra por arriba; la de la comparativa se queda | La tarjeta de la comparativa | Placa «DISCOVER» en la app |
| **— Cambio de tema** | §5 p1 (inicio) | MISTA de pie 1-2 s | Desplazamiento lateral | Rótulo | «EL ANUNCIO» |
| 5.1 La lista · **zoom núcleo** | §5 p2-p5 | La tienda con su pegatina; al entrar el espectador (silueta), la pegatina escribe su ficha en un tablón-lista · reloj de pared | Zoom de 0,4 s; la ficha se clava en el tablón en un segundo (manecilla); el tablón se copia a tres pantallas (buscador, reproductor, web) | La ficha clavada | Identificador «TUS DATOS» en el tablón |
| 5.2 30 días | §5 p5 | Calendario que pasa hojas; la ficha sigue clavada | Pasan hojas a saltos; al final se alarga una cinta hasta un segundo calendario | Los dos calendarios | Cifra «540» |
| 5.3 La subasta · **zoom núcleo** | §5 p6-p9 | Casa de subastas: la web de noticias como subastador con mazo; en las gradas, figuras-anunciante con paletas; sobre la mesa, una ficha con iconos (IP, cookie, móvil, chincheta, globo, grupo) · barra de carga de la página al fondo | Zoom de 0,4 s; la barra de carga avanza; la ficha se proyecta a las gradas; suben paletas; la de la tienda (con el robot pintado) sube la última y el mazo cae | El mazo cayendo y el robot en el hueco | — |
| 5.4 El plazo | §5 p10 | Cronómetro grande que corre mientras la barra de carga se llena · casa de subastas | La aguja da casi una vuelta; la barra llega al 100 %; el titular de la web se escribe en gris | El cronómetro | Cifra «80 ms - 1 s» |
| 5.5 Cientos | §5 p11 | La ficha se fotocopia y vuela a muchas ventanitas de edificios · ciudad de noche | Copias en abanico; se encienden ventanas a cientos (rejilla densa, no casillas iguales: edificios distintos) | La ciudad encendida | Placa «ICO» en un sello sobre el informe |
| **— Cambio de tema** | §6 p1 (inicio) | MISTA de pie 1-2 s | Desplazamiento lateral | Rótulo | «LAS COOKIES» |
| 6.1 La galleta | §6 p1-p2 | Navegador con una web y, incrustado, el hueco de un anuncio que deja una galleta pixel en un tarro · otras webs al fondo, cada una con el mismo hueco | La galleta cae al tarro; en la siguiente web el mismo hueco reconoce la galleta (se ilumina) | El tarro con la galleta | Identificador «DE TERCEROS» en el tarro |
| 6.2 Iban a quitarla | §6 p3-p5 | Estantería con el tarro y una caja de recambio («Privacy Sandbox», placa); una mano lleva el tarro hacia la papelera · calendario 2024 → 2025 | Julio de 2024: la mano se detiene; abril de 2025: el tarro vuelve a su sitio; el modo incógnito, una gafa oscura sobre el tarro que lo tapa | El tarro de vuelta | Placa «PRIVACY SANDBOX» en la caja |
| 6.3 Nadie la usaba | §6 p6-p7 | La caja de recambio cubierta de polvo y telarañas se va al trastero · el tarro sigue en la estantería | Polvo que cae; la caja sale; el tarro brilla | El tarro solo en la estantería | Cifra «2025» |
| **— Cambio de tema** | §7 p1 (inicio) | MISTA de pie 1-2 s, animado | Desplazamiento lateral | Rótulo | «TÚ MANDAS» |
| 7.1 Mi centro de anuncios | §7 p2-p3 | Panel grande con tres interruptores dibujados (huellas, play, chincheta) y una ficha con los datos que usa (edad, globo, huellas, chincheta) · el salón del bloque 1 | Los interruptores se apagan uno a uno; un cable aparte (recomendaciones) sigue encendido | El cable de las recomendaciones encendido | Placa «MI CENTRO DE ANUNCIOS» |
| 7.2 Sigue habiendo anuncios | §7 p4 | La web de noticias con un anuncio genérico (una taza) en vez del robot · salón | El robot del anuncio se cambia por la taza | La taza en el hueco | — |
| 7.3 YouTube y Discover | §7 p5-p6 | La tele con el menú de tres puntos abierto; al lado, el móvil de Discover · salón | Un vídeo se tacha («no me interesa», dibujado con una mano que lo aparta); el historial se pausa (botón de pausa); en el móvil, un tema se sigue (estrella) | La mano apartando el vídeo | — |
| 7.4 El archivador | §7 p7 | El archivador del bloque 3 con su casilla · salón | La casilla se desmarca; un cajón se vacía en la papelera | El cajón vaciándose | — |
| 7.5 Lo que dice Google | §7 p8 | Un sobre, una carpeta y una foto dentro de una vitrina con candado · al lado, una placa de atril | El candado se cierra; las piezas siguen dentro de la vitrina | La vitrina cerrada | Identificador «SEGÚN GOOGLE» en el atril |
| **— Cierre** | §8 | MISTA entero en el salón · el robot aspirador vuelve a la base | Recapitulación en cadena con las piezas de cada bloque (lupa → pegatina → ficha clavada → mazo); el robot entra en su base y el rastro de huellas se apaga | El robot en su base | Rótulo «EN RESUMEN» |

## Short A · ¿Tu móvil te escucha? (~65 s, 9:16)
Mundo vertical de 4 pantallas. Reutiliza el laboratorio, el filtro y la cámara de pantalla del largo, recompuestos a 270×480.

| Estación | Frases | Qué se ve (delante · fondo) | Qué cambia cada 1-2 s | Pieza clave (2 s en pantalla) | Texto, si lo hay |
|---|---|---|---|---|---|
| **— Entrada** | p1 | MISTA entero con el título · banco del parque | Saltito; título; MISTA se aparta | Título | «¿TE ESCUCHA?» |
| A1 La sospecha | p1 | Dos figuras en el banco y el móvil que se ilumina con el anuncio | Bocadillo con el robot → anuncio del robot en el móvil | El anuncio | — |
| A2 Laboratorio · **zoom núcleo** | p2-p3 | Columna de móviles conectados al ordenador · fachada «NORTHEASTERN» | Zoom; dedo mecánico; paquetes subiendo | Paquetes | Cifra «17.260» · placa «NORTHEASTERN» |
| A3 Sin audio | p4 | Micrófono sobre el filtro, compartimento vacío | Paquetes pasan; piloto apagado | Compartimento vacío | Cifra «0» |
| A4 El límite | p5 | Bocadillo → hoja que pasa sin marcar | Cambio de forma; parpadeo ámbar | La hoja | — |
| A5 La pantalla | p6 | Móvil con la cámara diminuta fotografiando la pantalla | Destello; la foto vuela | La foto volando | — |
| **— Cambio de tema** | p7 (inicio) | MISTA de pie 1-2 s | Desplazamiento lateral | Rótulo | «EL RASTRO» |
| A6 El archivador | p7 | Búsqueda que cae en el archivador de la cuenta | Cajón que se abre y recibe la ficha | El cajón lleno | Placa «GOOGLE» |
| A7 La etiqueta | p8 | La tienda con la pegatina que clava la ficha en el tablón | La ficha se clava en un segundo | La ficha clavada | — |
| **— Cierre** | p9-p10 | MISTA entero · migas brillantes alrededor del robot | Las migas se encienden; remisión al largo en voz y caja | El robot con las migas | — |

## Short B · Tu visita se subasta mientras carga la página (~58 s, 9:16)

| Estación | Frases | Qué se ve (delante · fondo) | Qué cambia cada 1-2 s | Pieza clave (2 s en pantalla) | Texto, si lo hay |
|---|---|---|---|---|---|
| **— Entrada** | p1 | MISTA entero con el título · barra de carga de una web vacía | Saltito; título; la barra arranca | Título | «SE SUBASTA» |
| B1 El hueco · **zoom núcleo** | p2 | Web de noticias como subastador con mazo; gradas con paletas | Zoom; la barra avanza; el hueco del anuncio se ilumina | El hueco | — |
| B2 La ficha | p3 | Ficha con seis iconos (IP, cookie, móvil, chincheta, globo, grupo) proyectada a las gradas | Cada icono se enciende al nombrarlo | La ficha completa | — |
| B3 La lista | p4-p5 | La tienda con su pegatina clavando tu ficha en el tablón; calendarios | Ficha clavada; pasan hojas | Los dos calendarios | Cifra «540» |
| B4 Gana la tienda | p6 | La paleta con el robot sube; el mazo cae; el robot ocupa el hueco | Paletas; mazo | El robot en el hueco | — |
| B5 El plazo | p7 | Cronómetro y barra de carga | La aguja corre; la barra llega al 100 % | El cronómetro | Cifra «80 ms - 1 s» |
| B6 Cientos | p8 | Ciudad vertical con ventanas que se encienden | Copias de la ficha en abanico | La ciudad encendida | Placa «ICO» |
| **— Cierre** | p9 | MISTA entero junto a la web ya cargada | Remisión al largo | La web cargada | — |

## Short C · Dónde ver lo que Google cree que te gusta (~54 s, 9:16)

| Estación | Frases | Qué se ve (delante · fondo) | Qué cambia cada 1-2 s | Pieza clave (2 s en pantalla) | Texto, si lo hay |
|---|---|---|---|---|---|
| **— Entrada** | p1 | MISTA entero con el título · una ficha de perfil con iconos de intereses (robot, escoba, balón) | Saltito; título; los iconos aparecen | La ficha de intereses | «TU LISTA» |
| C1 Mi centro de anuncios | p2 | Panel con la ficha de datos (edad, globo, huellas, chincheta) | Cada icono se enciende al nombrarlo | La ficha | Placa «MI CENTRO DE ANUNCIOS» |
| C2 Interruptores | p3 | Tres interruptores y, aparte, el cable de recomendaciones | Se apagan los tres; el cable sigue encendido | El cable encendido | — |
| C3 La taza | p4 | El hueco del anuncio: robot → taza genérica | Cambio del contenido del hueco | La taza | — |
| C4 El archivador | p5 | Archivador con la casilla de Chrome | La casilla se desmarca; un cajón se vacía | El cajón vaciándose | Identificador «ACTIVIDAD» |
| C5 YouTube | p6 | Tele con el menú de tres puntos; mano que aparta un vídeo; botón de pausa | Aparta; pausa | La mano | Placa «YOUTUBE» |
| C6 Discover | p7 | Móvil con tarjetas; una estrella sigue un tema y otra tarjeta se va | Estrella; tarjeta fuera | La estrella | Placa «DISCOVER» |
| **— Cierre** | p8 | MISTA entero junto al panel | Remisión al largo | El panel | — |
