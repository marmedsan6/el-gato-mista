# Diagnóstico del proyecto y del short de NVIDIA · 2026-11-10

Punto de partida: `a492db8` (rama `claude/elgatomista-execution-plan-c8445b`, subida a origin; `origin/main` iba 10
commits por detrás). Máster juzgado: `proyectos/nvidia-huang-espionaje/salida/short-v3.mp4` (publicado, estilo v5).

## Cómo se miró
- Textos: recorrido de la escena con Playwright (30 instantes por segundo, 2.136 en total) midiendo los rectángulos del DOM.
  Hoy lo hace `node motor/revisar.mjs` (lint).
- Audio y congelados: FFmpeg (`ebur128`, `silencedetect`, `freezedetect`). Hoy, `node motor/qa.mjs`.
- Vídeo: el publicado en YouTube a 1080p en 33 instantes y la hoja a 1 fps del QA; después, fotogramas de `qa.mjs`.
- Crítico visual sobre la v3: `proyectos/nvidia-huang-espionaje/reviews/critica-03.md` (no pasa).
- Sistema: lectura de `motor/`, `.claude/`, `publicacion/`, docs y memoria, con inventarios de subagentes baratos.

## Hallazgos del short, por impacto
| # | Hallazgo | Evidencia | Qué se hizo en la v6 |
|---|---|---|---|
| 1 | Los textos eran una segunda pista de subtítulos | 51 textos que no eran diálogo en 71 s: 17 copiaban la voz, 7 nombraban un objeto, 11 eran «Fuente:», 5 formaban el tuit y 11 eran rótulos o titular. El 34 % del tiempo había 4 o más; máximo 8 (63,4 s). Casi todos en filas fijas (`escenas/short/short.js:23`) | Presupuesto de texto: 8 textos en la v4 |
| 2 | La fuente junto al dato solo se cumplía en el papel | 2 de 11 cartelas fuera de pantalla (x = 268 de 270; 56,7-62,5 s y 63,4-65,1 s), empujadas por el sello (`motor/estilo/v5/escena.js:38-39`). Otras 4, menos de 1,7 s | Fuente en la caja de diálogo, toda la frase |
| 3 | Lo importante duraba menos de lo que se tarda en leerlo | 10 de 40 textos del mundo, menos de 2 s; «Espía para China, según EE. UU.» y su fuente, 0,87 s y 254 de 270 px. Título de entrada, 1,43 s | Regla de 2 s, comprobada por el lint |
| 4 | En pantalla se leía «NVIDIA INVESTIGA CHINA» | 62,5-65,1 s: la etiqueta «China» quedaba pegada al titular (crítico: bloqueante) | Sin titular; nombres como placas del dibujo |
| 5 | La cámara se adelantaba a la voz | Límite fr04→fr05: «China.» 0,06 s y «Y» 0,86 s en el timing; silencio real, 30,24-30,54 s. Corte, viaje, rótulo y página de la caja cambiaban en 30,0 s. La ruta al despacho del jefe (6,30 s) caía dentro del viaje (5,93 s) | `revisar-alineacion.mjs`; la cámara sale tras el fin real |
| 6 | El rótulo cambiaba al salir, no al llegar | 1,1 s de rótulo equivocado en cada uno de los 8 viajes (`short.js:88`) | Rótulo por tema, al llegar |
| 7 | El «zoom a escalones» era un salto | A ×1,25 solo cabe un escalón (`motor/estilo/camara.js:38`); el bloque de etiquetas saltaba de (16,128) a (6,85) | Acercamiento de 0,4 s |
| 8 | Tramos casi quietos | 4 de más de 1 s (2,3 · 35,0 · 53,8 · 58,6 s); la estación del matiz, 12 s con un titular como sujeto | 1 en la v4 |
| 9 | Audio correcto, sin red | -14,2 LUFS y -2,1 dBTP (margen de 0,1 dB). `mezcla.mjs` no limitaba ni medía el máster | Limitador y medida: -2,8 dBTP |
| 10 | El máster publicado no pasó por el crítico | `reviews/qa-v3.md:29`: la v3 se revisó con una hoja a 1 fps; la crítica era de la v2 | El crítico va sobre el máster final |

## Inventario de textos de la v3 que no eran diálogo
| Texto | Segundos | Dura | ¿Repetía voz o caja? | ¿Aportaba? |
|---|---|---|---|---|
| Rótulo y titular de entrada | 0-1,4 | 1,4 s | No | Sí, pero no daba tiempo |
| 9 rótulos de estación | todo | 4-12 s | La idea | Poco; cambiaban antes de llegar |
| «NVIDIA», «China» ×2, «The New York Times» | varios | 2,7-6,7 s | La caja ya los escribe | Identificaban el dibujo |
| «Alice Huang (Huang Le)» | 17,9-20,7 | 2,8 s | En parte | «Huang Le» |
| «EE. UU. restringe su venta» + fuente | 11,3-12,9 | 1,6 s | Literal | No |
| «Chips más avanzados» | 7,4-12,9 | 5,5 s | Literal | No |
| «Espía para China, según EE. UU.» + fuente | 19,8-20,7 | 0,87 s | Literal | No se llegaba a leer |
| «Megaspeed · Singapur», «Investigada desde 2024» + fuente | 21,8-30,0 | 5,4-8,2 s | Literal | Saltaban con el zoom |
| «Jensen Huang», «Fundador y CEO» + fuente, «Según el NYT: sus chips» + fuente | 33,1-38,3 | 1,7-3,0 s | Literal | Fuente de un dato obvio |
| «Correo a la plantilla» + «Fuente: NVIDIA · 8 nov 2026» | 40,8-44,1 | 3,3 s | Sí | La fecha |
| «Según la prensa» + fuente | 44,1-48,5 | 4,4 s | Literal | No |
| «Consejo de NVIDIA», «Investigación independiente» + fuente | 50,2-53,0 | 1,3-2,8 s | 4 veces | No |
| Tuit «NVIDIA ¿confirma? → investiga» y sello «MATIZ» | 53,4-65,1 | 11,7 s | No | La idea, pero afirmaba más que la voz |
| 5 etiquetas del matiz + 2 fuentes | 56,7-65,1 | 0,8-3,3 s | Literal | Fuentes fuera de pantalla |
| Cierre: 2 etiquetas + fuente | 66,2-71,2 | 3,4-5,0 s | Resumen | Poco |

## El sistema
| Área | Hallazgo | Evidencia | Estado tras la v6 |
|---|---|---|---|
| Revisión | `revisar.mjs` solo cazaba excepciones | 10 entradas de `memoria/aprendizajes.md` sobre texto solapado, cortado o tapado que encontró el crítico, tarde | Lint con 11 reglas |
| QA | Comandos sueltos y subagentes; sin último instante de cada frase | Skill `qa` antigua | `qa.mjs`: 12 s por máster |
| Mezcla | Sin limitador ni medida del máster; el AAC subía el pico | Aprendizajes del 2026-11-02 y 2026-11-09 | Hecho |
| Render | Sin `claveFotograma` en la v5 ni render por tramo | 4.272 capturas por short | 2.400 capturas; `--desde/--hasta` |
| Render | Una capa de texto del ancho del mundo ahogaba 8 navegadores | 60 fotogramas: 107 s frente a 30 s al quitarla | `#textos-mundo` sin tamaño |
| Biblioteca | ~120 líneas de andamiaje copiadas por vídeo; piezas dentro de cada escena | `clip.js`, plantilla y `short.js` | `motor/estilo/v6/` |
| Plantillas | La plantilla de escena se copiaba a cada proyecto | 2 copias sin versionar en NVIDIA | `plantillas/escenas/v6/` |
| Publicado | Sin prueba de que lo subido se reproduce igual | — | 16 escenas, 128 huellas en `npm test` |
| Docs | 31 contradicciones o caducados | Texto v1 de `docs/estilo.md`, `tokens.json`, `arquitectura.md`, hoja de ruta, READMEs, crítico con «cada 2-4 s», caracteres/13 | Puestos al día |
| Memoria | 79 KB leídos en cada sesión | `memoria/decisiones.md` y `aprendizajes.md` | Resumen vigente + historial |
| Git | La rama no estaba en `main`; el checkout principal cargaba las skills v3 | `git rev-list` (10 por delante) | Pendiente de Mario |
| Sesiones | Dos sesiones en el mismo worktree a la vez | `proyectos/anthropic-fable-5-2/` apareció a mitad de la iteración | Anotado en aprendizajes |

## Qué falta para un largo de 8-10 min en v6
- **Mundo ancho.** Medido en 16:9 con la plantilla (`?n=`), una página: 2 pantallas, 0,27 s por captura; 8, 0,80 s; 16,
  0,99 s; 32, 1,62 s, y `seek` pasa de 24 a 567 ms. Un largo de 60-70 estaciones necesita un mundo por tema (6-8
  estaciones) o un mundo virtualizado que solo dibuje lo visible.
- **Dibujo.** 60-70 estaciones a medida no son sostenibles: catálogo de dioramas por concepto (`motor/biblioteca/`).
- **Línea de tiempo.** Unas 300 constantes `T_…` a mano: hace falta declararla (estación, frases, piezas clave).
- **Sujetos.** Jensen Huang mide unos 26 de 270 px y la silueta de Alice es oscura sobre oscuro: sujetos más grandes.
- **Producción.** Unos 12 comandos por formato: un comando que los encadene.

## Arreglar ya / siguiente / descartar
| Arreglado en la v6 | Siguiente iteración | Descartado |
|---|---|---|
| Presupuesto de texto y fuente en la caja | Mundo por tema o virtualizado | Etiquetas que repiten la voz |
| Lint de textos y sincronía | Catálogo de dioramas por concepto | Filas fijas de etiquetas |
| Permanencia de 2 s y cámara tras la frase | Línea de tiempo declarativa | Fuente de datos obvios |
| Limitador y medida del máster | Un comando que encadene la producción | Rótulo por estación |
| QA en un comando y huellas de lo publicado | Subtítulos propios en YouTube | Titulares de texto como sujeto |
| `claveFotograma`, render por tramo y andamiaje | Sujetos más grandes; rediseño de MISTA | |
| Docs y memoria al día | | |
