# Shotlist · alien-isolation-ia

- Estilo v2 (skill `estilo`) con las desviaciones de `style_guide.md`: más oscuro, igual de vivo. Guion aprobado en la PUERTA 1 (`reviews/puerta-1.md`). Los tiempos definitivos salen de `timing.*.json`.
- Alien en sprite pixel detallado y director como sala de control (Mario, 2026-11-02).
- Entre bloques, desplazamiento lateral de 0,4 s; MISTA reaparece con un saltito (o asomándose desde una taquilla, en la estación).
- `CLIP` = tramo de 2-4 s de un vídeo oficial, en un monitor CRT dentro del escenario, con el crédito «IMAGEN: SEGA / CREATIVE ASSEMBLY». MISTA calla o reacciona mientras se ve. Tramos exactos en `fuentes.json` (c1-c5).

## Clips previstos (todos del canal oficial `UC47Gsn4F1U8eOS7J4YX2fDg`)
| Id | Vídeo | Para qué | Estado |
|---|---|---|---|
| c1 | «'How to' Official Guide - The Alien [EU]» (`bBhtydUBf3U`, 2:38) | El alien buscando y abriendo taquillas (bloques 1, 6 y 8) | Grabado el 2026-11-02 con la extensión de Chrome (2:39, 1280×720). Trae también el detector y el lanzallamas |
| c2 | «'How to' Official Guide - The Motion Tracker [EU]» (`QVBODwHcWg0`, 1:31) | El detector pitando (bloque 4) | Descartado: c1 ya lo trae |
| c3 | «#HowWillYouSurvive - Flared Up [INT]» (`pvg6UAgkVfk`, 1:15) | El lanzallamas y la huida del alien (bloque 8) | Descartado: c1 ya lo trae |
| c4 | «Alien: Isolation 2 Reveal Trailer \| Last Chance» (`t1-vUcw8CFc`, 1:44) | Kurosaki y la tormenta (bloque 10 y short B) | Descartado (Mario, 2026-11-02): Chrome retuvo la descarga; el bloque 10 y B1 van en pixel art |
| c5 | «Alien: Isolation 2 \| Dev Q&A» (`qk3WHXemQ-I`, 17:40) | Audio 04:57-05:01, «So now it will be even more intelligent» (bloque 11) | Libre, 149 MB a 1080p: necesita el permiso de Mario |

## Largo (1920×1080, 60 fps)
Algo nuevo cada 3-8 s; MISTA en escena, sin caja de diálogo; cada dato con su fuente pequeña debajo.

| Bloque | Escenario | Qué se ve | Qué cambia | Fuente |
|---|---|---|---|---|
| 1 · Gancho | Control → pasillo | Sala del director con el mapa de la estación: tu punto naranja, fijo y visible; el del alien, sin flecha hacia ti | «SABE DÓNDE ESTÁS» sobre la consola · corte al pasillo: «EL ALIEN, NO» · MISTA entra en una taquilla, el alien pasa de largo · segunda taquilla y la puerta se abre (CLIP c1) · tres «?» (¿TE VIO? ¿TRAMPA? ¿APRENDIÓ?) · dos siluetas de cerebro | f1, f2, f3, f4 |
| 2 · Un solo monstruo | Pasillo | Estación casi vacía, un único alien al fondo | Contador «ENEMIGOS: 1» · reloj de 12 a 18 h · balanza: «SIEMPRE TE ENCUENTRA = INJUSTO» / «NUNCA = PASILLO VACÍO» · zona «CERCA, PERO NO ENCIMA» | f1 |
| 3 · Dos cerebros | Control | Pantalla partida: el director (consola, sin cuerpo) y el alien (cuerpo, sin mapa) | El mapa marca tu punto · el alien solo ve una niebla · brazo mecánico que empuja su ficha hacia «TU ZONA», nunca a la taquilla · bocadillo «POR AQUÍ HACE CALOR» · MISTA señala la consola: «EL QUE SABE ES EL OTRO» | f1 |
| 4 · Lo que oye | Pasillo | Oreja pixel del alien con ondas | Pasos (andar / correr con onda mayor) · disparo con onda grande · detector con pitido y círculo de 1,5 m (CLIP c2) · «DISPARO > PASOS» · MISTA con el revólver y un sobre de «INVITACIÓN» | f1, f2 |
| 5 · Lo que ve | Pasillo | Cuatro conos de visión desde la cabeza del alien: normal, enfocado, periférico y cercano | Barra de señal que se llena a escalones mientras MISTA sigue en un cono · el alien duda y sigue · rayos cortos en la espalda · «OJOS EN LA NUCA» · MISTA se acerca por detrás y le pillan | f2, f1 |
| 6 · Cuando no sabe | Pasillo, vista cenital | Círculo de búsqueda alrededor del último sitio donde estabas | Rótulo «ACECHO» · el círculo se estrecha a escalones en cada pasada · el escondite pasa de verde a rojo | f2 |
| 7 · Medidor de amenaza | Control | Medidor grande en la consola | Sube por cercanía, por verlo y por el detector (tres iconos) · «NO SUBE POR ATACARTE» · al tope, orden «VETE» · el alien entra en una rejilla: «ENTRE BASTIDORES» · ficha por los conductos, por delante de ti · tres diales: espera, llenado y rondas | f1, f2 |
| 8 · El árbol que aprende | Control | Árbol de decisiones en pantalla, de más de cien nodos, con ramas con candado | Nodos SI OIGO / SI VEO / SI ME QUEMAN · el candado de «MIRAR EN TAQUILLAS» se abre tras tres escapadas · CLIP c3 con el lanzallamas · icono de memoria «LANZALLAMAS: SÍ» · «APRENDE DE TUS ESCAPADAS, NO DE TUS MUERTES» · candados con sello de guion: «A MEDIAS» | f1, f2 |
| 9 · ¿Hace trampas? | Pasillo | Acusación «¿TELETRANSPORTE?» | Sello «FALSO · ANDY BRAY» · contador de teletransportes en 2, con dos claquetas · tres piezas (empujón, oídos, árbol) que encajan en la silueta del alien | f1, f2 |
| 10 · Isolation 2 | Colonia | Exterior en tormenta: lluvia, granizo, relámpagos lejanos, torres mineras | titular con la cita de Al Hope en tres líneas (MÁS LISTO / MÁS DURO / MENOS OPCIONES) · rótulo «KUROSAKI STATION» · cuatro plataformas · «FECHA: ???» | f3 |
| 11 · Su nuevo cerebro | Colonia | Mapa del primero junto a uno diez veces mayor | Escala ×10 · CLIP c5 (audio) con la traducción · iconos de objetos y herramientas nuevos · el alien se oculta en la lluvia · «NO REPITAS TRUCOS» · el granizo tapa el sonido de los pasos · micrófono y perro: su ladrido viaja como onda al alien | f4, f5 |
| 12 · Especulación | Control | Marco con el rótulo fijo «ESPECULACIÓN DE MISTA» en todo el bloque | Árbol con más candados · cuaderno de trucos recordados · conductos que se borran y la tormenta ocupa su sitio · flecha del director más gruesa en el mapa ×10 · «¿MÁS JUSTO O MÁS CRUEL?» | f1, f2, f4 |
| 13 · Cierre | Pasillo → control | Consola con tu punto | «UN CEREBRO SABE, OTRO BUSCA» · «PROMESA: APRENDE MÁS» · «SOLO SUS PALABRAS» · la oreja del alien gira hacia el micrófono de la pantalla | f1, f4 |

## Short A · Dos cerebros (1080×1920, 60 fps)
Algo nuevo cada 2-4 s, caja de diálogo con retrato, sin llamada a la acción; nada en la zona tapada.

| Bloque | Escenario | Qué se ve | Fuente |
|---|---|---|---|
| A1 · Gancho | Control | Mapa con tu punto: «SABE DÓNDE ESTÁS» / «EL ALIEN, NO» | f1 |
| A2 · Dos cerebros | Control | Director y alien, uno sobre otro; brazo que empuja su ficha hacia tu zona | f1 |
| A3 · Sentidos | Pasillo | Oreja con pasos, disparo y detector; círculo de búsqueda que se estrecha | f1, f2 |
| A4 · Medidor | Control | Medidor que se llena por cercanía; el alien se mete en la rejilla, por delante de ti | f1 |
| A5 · Trampas | Pasillo | «TELETRANSPORTES: 2», con dos claquetas; «EL QUE SABE ES EL OTRO» | f1 |

## Short B · El alien de Alien: Isolation 2 (1080×1920, 60 fps)
| Bloque | Escenario | Qué se ve | Fuente |
|---|---|---|---|
| B1 · Gancho | Colonia | «AÚN MÁS INTELIGENTE» sobre la tormenta | f4 |
| B2 · El primero | Control | Árbol con el candado de las taquillas, que se abre tras varias escapadas | f1, f2 |
| B3 · Lo nuevo | Colonia | Iconos de aprender, cambiar en cada encuentro y objetos nuevos; escala ×10 | f3, f4 |
| B4 · Exteriores | Colonia | El alien expuesto y oculto por la lluvia | f4 |
| B5 · Micrófono | Colonia | Micrófono, perro que ladra y onda hacia el alien | f4 |
| B6 · Especulación | Colonia | Marco «ESPECULACIÓN»: los conductos se borran y la tormenta ocupa su sitio · «SIN FECHA» · MISTA mirando a un perro con desconfianza | f1, f3, f4 |
