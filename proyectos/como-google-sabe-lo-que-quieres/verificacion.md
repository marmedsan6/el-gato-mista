# Verificación · como-google-sabe-lo-que-quieres

- Nivel: N1 (atemporal), con fuente primaria para cada mecanismo. Las páginas de ayuda de Google cambian: se vuelven a
  consultar antes de la PUERTA 2 si han pasado más de 3 días.
- Fecha de la última revisión: 2026-11-11 (lectura directa de cada página; los PDF, con `pdftotext`).

| # | Hecho (tal como saldrá en el guion) | Fuentes (id) | Primaria | Estado | Matiz que hay que decir |
|---|---|---|---|---|---|
| 1 | Un estudio analizó 17.260 apps de Android y probó en marcha 9.100; en ninguna encontró audio enviado | f1, f2 | f1 | verificado | Solo Android (y Android 4.4); los autores no descartan una app que convierta el audio en texto antes de enviarlo |
| 2 | Lo que sí encontraron: bibliotecas que grababan la pantalla y la enviaban a terceros (GoPuff → Appsee) | f1, f2 | f1 | verificado | No había mala intención aparente; se usa para depurar apps |
| 3 | La cuenta guarda tus búsquedas y lo que haces en productos de Google | f3 | f3 | verificado | Si está activada «Actividad en la Web y en Aplicaciones» |
| 4 | Con una casilla aparte, guarda también el historial de Chrome y la actividad en webs asociadas con Google | f3 | f3 | verificado | Chrome solo si has iniciado sesión y sincronizas el historial |
| 5 | La actividad de tu cuenta de Google puede influir en lo que te recomienda YouTube | f4 | f4 | verificado | La página en español e inglés dice «cuenta de Google»; **no** se dice «Chrome» por separado (va por el n.º 4) |
| 6 | Google no ve lo que haces dentro de una tienda salvo que esa web use sus etiquetas o servicios | f3, f8 | f3, f8 | parcial | Se deduce de cómo se recoge (cuenta, Chrome sincronizado, etiqueta); se dice como «lo que llega a Google son…», no como afirmación sobre una tienda concreta. **No se nombra a Amazon** como cliente de las etiquetas de Google |
| 7 | YouTube elige en dos pasos: de millones de vídeos a cientos de candidatos, y luego los ordena | f5 | f5 | verificado | Es el artículo de 2016; el sistema actual es más complejo y no se ha publicado entero |
| 8 | Ordena por el tiempo que esperan que veas cada vídeo, no por los clics, para no premiar el «clickbait» | f5, f6 | f5 | verificado | |
| 9 | En 2012 YouTube pasó de contar clics a contar tiempo de visionado, y las visualizaciones cayeron un 20 % | f6 | f6 | verificado | Lo cuenta YouTube |
| 10 | Señales: clics, tiempo de visionado, encuestas, compartidos, me gusta y no me gusta | f6 | f6 | verificado | |
| 11 | Más de 80.000 millones de señales | f6 | f6 | verificado | «pieces of information»; se dice como cifra de YouTube |
| 12 | Las recomendaciones generan más visionado que las suscripciones o las búsquedas | f6 | f6 | verificado | Sin porcentaje |
| 13 | Compara lo que ves con lo que ven personas parecidas | f6 | f6 | verificado | |
| 14 | Discover te enseña artículos sin que busques nada, con la actividad de la cuenta y del dispositivo | f7 | f7 | verificado | |
| 15 | La web pone una etiqueta de Google y en segundos entras en la lista del anunciante; vale en Búsqueda, Display y YouTube | f8 | f8 | verificado | El nombre oficial es «tus datos» (antes «remarketing») |
| 16 | Te quedas en la lista 30 días por defecto y hasta 540 | f8 | f8 | verificado | Si no vuelves a la web |
| 17 | Mientras carga la página se subasta el hueco del anuncio | f9 | f9 | verificado | |
| 18 | El plazo para pujar va de 80 milésimas a un segundo | f10 | f10 | verificado | Es el plazo en el sistema de Google («typically»); otros sistemas pueden variar. Se dice «en menos de un segundo» |
| 19 | La petición lleva IP, identificadores de cookie, dispositivo, ubicación, idioma y segmentos de audiencia | f9 | f9 | verificado | «La mayoría incluyen»: puede variar |
| 20 | Los datos de una sola visita pueden verlos cientos de empresas | f9 | f9 | verificado | Según el regulador británico, 2019 |
| 21 | Una cookie de terceros la crea otro sitio distinto del que visitas | f11 | f11 | verificado | |
| 22 | En 2024 Google se echó atrás y no quitó las cookies de terceros de Chrome | f12 | f12 | verificado | Iba a dar a elegir |
| 23 | En abril de 2025 confirmó que ni siquiera mostraría ese aviso para elegir | f13 | f13 | verificado | Se eligen en los ajustes de Chrome; el incógnito ya las bloquea |
| 24 | En octubre de 2025 retiró casi todo su sustituto (Topics, Protected Audience…) por falta de uso | f14 | f14 | verificado | |
| 25 | En Mi centro de anuncios hay interruptores para la actividad, el historial de YouTube y las zonas | f15 | f15 | verificado | El de actividad no desactiva las recomendaciones |
| 26 | Si desactivas la personalización sigues viendo anuncios, pero menos relevantes | f16 | f16 | verificado | Lo dice Google |
| 27 | Google dice que no vende tus datos ni usa Gmail, Drive ni Fotos para anuncios | f16 | f16 | verificado | **Atribuido siempre:** «según Google» |
| 28 | En YouTube: «No me interesa», «No recomendar el canal», pausar o borrar el historial | f4 | f4 | verificado | |
| 29 | En Discover: seguir temas y «No me interesa» | f7 | f7 | verificado | |

Estado: verificado | parcial (explicar) | sin fuente (no entra en el guion).

## No entra (sin fuente primaria o no respaldado)
- Que Amazon compre anuncios en YouTube para perseguirte, o que use etiquetas de Google.
- «La subasta dura 100 ms»: solo lo dicen fuentes comerciales; Google documenta de 80 a 1000 ms.
- Que YouTube use el historial de Chrome de forma directa: la ayuda solo habla de la actividad de la cuenta.
- Cualquier cifra de cuánto gana Google con los anuncios (fuera del enfoque).
