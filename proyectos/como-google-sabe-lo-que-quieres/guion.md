# Guion · como-google-sabe-lo-que-quieres

Cada párrafo con hechos acaba con sus fuentes entre corchetes: [f1] [f3]. De ahí sale la fuente que enseña la caja de
diálogo mientras suena cada frase (`motor/timing-a-js.mjs --guion`): si dos frases de un párrafo tienen fuentes
distintas, sepáralas en dos párrafos. `[E]` marca un ejemplo ilustrativo (no es un hecho; lo dice MISTA como ejemplo).
Gancho: el título de entrada dura 2 s; que la primera frase no nombre nada que haya que ver antes de ese momento.
Tienda genérica: la voz dice «una tienda online» y nunca nombra Amazon (Mario, 2026-11-11).

## Maestro (largo)
<!-- Estimación: 8.601 caracteres de voz / 17 → ~8 min 25 s (medido el 2026-11-11). Bloques del brief en orden; MISTA de pie en cada ###. -->

### 1. Gancho
Imagina que abres YouTube y lo primero que ves es un vídeo de ese robot aspirador que estuviste mirando ayer en una tienda online.

No lo compraste. No se lo contaste a nadie.

Luego entras a leer las noticias, y ahí está otra vez. Un anuncio del mismo robot, en mitad del artículo.

¿Cómo lo sabe?

Hoy vamos a seguir a ese robot aspirador desde que lo miras hasta que te persigue por internet. Y al final te enseño dónde ver lo que Google cree que te gusta, y cómo cambiarlo.

### 2. ¿Me está escuchando?
Lo primero que piensa casi todo el mundo es que el móvil le escucha. Hablas de algo y, al rato, te sale un anuncio de eso.

En 2018, un equipo de la Universidad Northeastern, en Boston, decidió comprobarlo. [f1]

Analizaron 17.260 apps de Android. A 9.100 las pusieron a funcionar en móviles de verdad, con un programa que tocaba la pantalla como lo haría una persona, y registraron todo lo que enviaban a internet. [f1]

Buscaban audio: grabaciones del micrófono saliendo del teléfono. [f1]

¿Y qué encontraron? Ninguna app enviaba audio. Ni una. [f1]

Ojo, los propios autores avisan de un límite: si una app convirtiera lo que oye en texto antes de enviarlo, su sistema no lo habría visto. No es una prueba absoluta, pero es el primer estudio a gran escala sobre esto, y salió vacío. [f1]

Lo que sí encontraron fue otra cosa. Algunas apps grababan la pantalla mientras las usabas y mandaban esas imágenes a otra empresa. [f1]

Una app de reparto a domicilio, GoPuff, enviaba capturas a Appsee, una empresa de analítica, sin que el usuario lo supiera. [f2]

Y aquí está la clave: no les hace falta escucharte. Tú ya les das pistas de sobra. Vamos a ver cuáles.

### 3. El rastro
Volvamos al robot aspirador. Antes de llegar a la tienda, lo más probable es que lo buscaras en Google.

Esa búsqueda se guarda en tu cuenta si tienes activado un ajuste que se llama «Actividad en la Web y en Aplicaciones». Guarda lo que buscas y lo que haces en productos de Google como el buscador o Maps. También el idioma, el tipo de dispositivo y, más o menos, desde dónde te conectas. [f3]

Dentro de ese ajuste hay una casilla que va más allá. Si está marcada, se guarda también tu historial de Chrome, siempre que hayas iniciado sesión en el navegador y lo sincronices. [f3]

Y tu actividad en webs y apps que usan servicios de Google, incluidas las que están asociadas con Google para mostrar anuncios. [f3]

Con todo eso, Google puede deducir qué te interesa. Lo dice en su propia ayuda. [f3]

Pero ojo: esto no significa que Google lo vea todo. Lo que le llega es lo que pasa por sus servicios: el buscador, YouTube, Chrome si lo sincronizas, y las webs que llevan algo de Google dentro. [f3] [f8]

Y aquí vuelve la tienda. Muchas webs llevan una etiqueta de Google: un trocito de código invisible que el dueño pone para sus campañas de anuncios. Enseguida vemos qué hace. [f8]

### 4. Lo que te recomiendan
Primero, YouTube. ¿Cómo decide qué vídeos salen en tu portada?

YouTube puede usar la actividad de tu cuenta de Google para elegir lo que te recomienda. Así que esa búsqueda del robot aspirador ya cuenta. [f4]

En 2016, tres ingenieros de Google publicaron cómo lo hacía YouTube. Y es un embudo en dos pasos. [f5]

El primer paso coge millones de vídeos y se queda con unos cientos que podrían interesarte. Para elegirlos mira lo que has visto, lo que has buscado, tu región, tu dispositivo y datos como tu edad. [f5]

El segundo paso ordena esos cientos y se queda con unas docenas: las que acaban en tu pantalla. [f5]

¿Y con qué criterio las ordena? Aquí está lo curioso. No por la probabilidad de que hagas clic, sino por cuánto tiempo esperan que veas el vídeo. [f5]

La razón la explican ellos mismos: si ordenas por clics, premias los vídeos engañosos, esos que la gente abre y deja a medias. El famoso clickbait. [f5]

En 2021, YouTube contó cómo llegaron ahí. En 2011 vieron que un clic no significaba que vieras el vídeo. En 2012 empezaron a contar el tiempo de visionado, y las visualizaciones cayeron un 20 %. Lo asumieron. [f6]

Hoy mezclan más señales: clics, tiempo de visionado, encuestas, compartidos, me gusta y no me gusta. Según YouTube, más de 80.000 millones de señales. [f6]

Las encuestas son esas que a veces te salen debajo de un vídeo, de una a cinco estrellas. [f6]

Y comparan tus hábitos con los de gente parecida a ti. [f6]

Por ejemplo: si mucha gente que vio el robot aspirador vio después un vídeo de trucos de limpieza, es probable que ese vídeo te salga a ti. [E]

Y esto pesa mucho, porque según YouTube, las recomendaciones generan más visionado que las suscripciones o las búsquedas. [f6]

Con los artículos que te salen en el móvil, en la app de Google, sin que busques nada, pasa algo parecido. Eso se llama Discover. [f7]

Discover usa información de tu dispositivo, de otros productos de Google y de lo que guarda tu cuenta: la actividad que acabamos de ver y tu ubicación, si la tienes activada. [f7]

Así que, si ayer buscaste robots aspiradores, no te extrañe que hoy te salga una comparativa de robots aspiradores. [E]

### 5. El anuncio que te persigue
Y ahora, lo que más inquieta: el anuncio del robot en la web de noticias. Eso no es una recomendación. Es publicidad, y funciona distinto.

¿Recuerdas la etiqueta de Google de la tienda? Cuando entras a la página del robot, la etiqueta avisa. Y en segundos entras en una lista de esa tienda: gente que ha visto este robot. [f8]

Google antes lo llamaba remarketing. Ahora lo llama, sin más, «tus datos». [f8]

La tienda puede usar esa lista para enseñarte anuncios en el buscador, en YouTube y en webs que muestran anuncios de Google. [f8]

Y te quedas en esa lista treinta días, si la tienda no lo cambia. Puede alargarlo hasta 540. Casi año y medio. [f8]

Pero ¿cómo acaba ese anuncio justo en la web de noticias que estás leyendo? Con una subasta.

Mientras la página termina de cargar, la web de noticias pone a la venta el hueco del anuncio, y varios anunciantes pujan por él. [f9]

Para pujar, reciben una ficha con datos tuyos: tu dirección IP, identificadores de tus cookies, tu tipo de dispositivo, tu ubicación, tu idioma… y en qué grupos de audiencia estás. [f9]

Si la tienda te tiene en su lista, puede pujar por ti. Y si gana, ahí está el robot. [f8] [f9]

¿Cuánto dura todo esto? En el sistema de Google, quien puja tiene entre 80 milésimas y un segundo para responder. Antes de que termines de leer el titular. [f10]

Y hay algo que el regulador británico de protección de datos señaló en 2019: en una sola visita a una web, tus datos pueden acabar viéndolos cientos de empresas. A ese regulador le pareció desproporcionado, intrusivo e injusto. [f9]

### 6. El giro de las cookies
Para que esto funcione entre webs distintas, hay una pieza clásica: las cookies de terceros.

Una cookie es un archivo que crea una web en tu navegador. Las de terceros las crea otra web distinta de la que visitas, por ejemplo la de un anuncio metido en la página. Y sirven para personalizar anuncios y saber qué haces en otras webs. [f11]

Google tenía previsto quitar las cookies de terceros de Chrome y sustituirlas por otro sistema, que llamó Privacy Sandbox. [f12]

Pero en julio de 2024 cambió de idea: en vez de quitarlas, dejaría elegir a cada usuario. [f12]

En abril de 2025, ni eso: confirmó que no habría ningún aviso para elegir. Las cookies de terceros se quedan, y quien quiera las bloquea en los ajustes de Chrome. En modo incógnito ya vienen bloqueadas. [f13]

Y en octubre de 2025 retiró casi todo el sistema que iba a sustituirlas. ¿El motivo? Que casi nadie lo usaba. [f14]

O sea: la cookie que iba a desaparecer sigue ahí. [f14]

### 7. Cómo verlo y cambiarlo
Vale, ¿y qué puedes hacer tú? Bastante, la verdad.

Lo primero: en Mi centro de anuncios, Google te enseña qué datos usa para tus anuncios. Tu rango de edad, tu idioma, tu actividad y las zonas desde donde usas Google. [f15]

Ahí tienes interruptores para que no use tu actividad en webs y apps, tu historial de YouTube o tus zonas. Un detalle: apagar la actividad para los anuncios no apaga las recomendaciones. Son ajustes separados. [f15]

Y si desactivas los anuncios personalizados del todo, seguirás viendo anuncios. Solo que menos relevantes, según Google. [f16]

Para las recomendaciones, en YouTube puedes marcar «No me interesa» o «No recomendar el canal». Y puedes pausar o borrar tu historial de reproducciones y de búsquedas. [f4]

En Discover, puedes seguir temas o decir que uno no te interesa. [f7]

Y si no quieres que tu actividad se guarde en tu cuenta, el ajuste es «Actividad en la Web y en Aplicaciones», con su casilla de Chrome. Se puede apagar o borrar cuando quieras. [f3]

Una última cosa. Google asegura que nunca vende tu información personal, y que no usa tus correos de Gmail, ni Drive, ni Fotos para anuncios. Es lo que dice Google. [f16]

### 8. Cierre
Así que nadie escuchó tu conversación.

Buscaste el robot. La tienda llevaba una etiqueta. Entraste en una lista. Y mientras cargaba la web de noticias, esa tienda pujó por ti y ganó.

Google no te lee la mente. Te lee el rastro.

## Short A · ¿Tu móvil te escucha?
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1. Subida: 1.º.
     Estimación (caracteres/17): 1.098 caracteres de voz → ~65 s · por qué esa duración: hay que dar el estudio con su
     límite honesto (el audio convertido en texto), lo que sí encontraron y la explicación de por qué no hace falta
     escuchar; sin el límite, el short afirmaría más que la fuente. -->
Seguro que te ha pasado: hablas de algo con alguien y, al rato, te sale un anuncio justo de eso. Y piensas: el móvil me escucha.

En 2018, unos investigadores de la Universidad Northeastern lo comprobaron. [f1]

Analizaron 17.260 apps de Android, pusieron a funcionar 9.100 en móviles de verdad y registraron todo lo que enviaban a internet. [f1]

Buscaban audio del micrófono saliendo del teléfono. ¿Resultado? Ninguna app enviaba audio. [f1]

Con un límite que ellos mismos avisan: si una app pasara lo que oye a texto antes de enviarlo, no lo habrían visto. [f1]

Lo que sí encontraron fue otra cosa: apps que grababan la pantalla mientras las usabas y mandaban las imágenes a otra empresa. [f1]

Entonces, ¿de dónde sale el anuncio? De tu rastro. Lo que buscas en Google se guarda en tu cuenta si tienes activada la actividad web, y con ella Google deduce qué te interesa. [f3]

Y muchas webs llevan una etiqueta de Google que te mete, en segundos, en una lista para enseñarte anuncios. [f8]

No les hace falta escucharte. Ya les das pistas de sobra.

¿Quieres ver el viaje completo? Tengo un vídeo largo en YouTube que lo explica entero.

## Short B · Tu visita se subasta mientras carga la página
<!-- Guion propio. Subida: 2.º.
     Estimación (caracteres/17): 988 caracteres → ~58 s · por qué esa duración: la subasta solo se entiende con sus
     tres piezas (la lista de la tienda, la ficha con tus datos y el plazo) y el aviso del regulador; con menos, «pujan
     por ti» suena a exageración. -->
La próxima vez que abras una web, antes de que termine de cargar, alguien habrá pujado por ti.

Mientras la página carga, la web pone a la venta el hueco del anuncio, y varios anunciantes pujan por él. [f9]

Para pujar reciben una ficha con datos tuyos: tu IP, identificadores de tus cookies, tu dispositivo, tu ubicación, tu idioma y en qué grupos de audiencia estás. [f9]

¿Y por qué te sale justo el robot aspirador que miraste ayer? Porque esa tienda lleva una etiqueta de Google, y en segundos te metió en su lista de gente que lo vio. [f8]

Te quedas ahí treinta días, o hasta 540 si la tienda quiere. [f8]

Si te tiene en su lista, puede pujar por ti. Y si gana, ahí está el robot. [f8] [f9]

¿Cuánto tarda? En el sistema de Google, quien puja tiene entre 80 milésimas y un segundo para responder. [f10]

Y el regulador británico de protección de datos avisó en 2019: en una sola visita, tus datos pueden verlos cientos de empresas. [f9]

¿Quieres ver de dónde sale todo eso? Tengo un vídeo largo en YouTube que lo explica entero.

## Short C · Dónde ver lo que Google cree que te gusta
<!-- Guion propio. Subida: 3.º.
     Estimación (caracteres/17): 922 caracteres → ~54 s · por qué esa duración: son cuatro sitios (Mi centro de anuncios,
     la actividad de la cuenta, YouTube y Discover) y dos avisos que evitan malentendidos (apagar anuncios no apaga
     recomendaciones; sin personalizar sigue habiendo anuncios). -->
Google tiene una lista de lo que cree que te gusta. Y la puedes ver.

Está en Mi centro de anuncios. Ahí te enseña qué datos usa para tus anuncios: tu rango de edad, tu idioma, tu actividad y las zonas desde donde usas Google. [f15]

Tiene interruptores para que no use tu actividad en webs y apps, tu historial de YouTube o tus zonas. Pero apagar eso no apaga las recomendaciones: son ajustes separados. [f15]

Y si quitas los anuncios personalizados, seguirás viendo anuncios, pero menos relevantes, según Google. [f16]

Lo que se guarda en tu cuenta está en «Actividad en la Web y en Aplicaciones». Tiene una casilla que añade tu historial de Chrome, si lo sincronizas. Se puede apagar o borrar. [f3]

En YouTube, «No me interesa», «No recomendar el canal», o pausar el historial. [f4]

Y en Discover, seguir temas o quitar los que no te interesan. [f7]

¿Quieres saber cómo llega todo eso a tu pantalla? Tengo un vídeo largo en YouTube que lo explica entero.
