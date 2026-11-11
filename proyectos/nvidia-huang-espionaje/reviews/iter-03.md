# Iteración 03 · nvidia-huang-espionaje · short v3 (publicado) → v4 interna en estilo v6 · 2026-11-10

Origen: diagnóstico del 2026-11-10 (`docs/investigacion/diagnostico-2026-11-10/informe.md`), `critica-03.md` (línea
base sobre la v3: no pasa) y las decisiones de Mario del mismo día (ADR 0010). Sin cambios de guion, voz, música ni
niveles. **La v4 es interna: no se republica sin su orden.** Escena: `escenas/short-v4/`; la publicada, `escenas/short/`.

## Primera vuelta (reglas v6)
| Antes (v3, estilo v5) | Ahora (v4, estilo v6) |
|---|---|
| 51 textos que no eran diálogo; 17 copiaban la voz | Título, 4 rótulos (3 temas y el cierre) y 2 identificadores |
| 11 cartelas «Fuente:», 2 fuera de pantalla y 4 de menos de 1,7 s | La fuente de cada frase, en una pestaña bajo la caja de diálogo, sacada de los `[fN]` del guion |
| «NVIDIA», «China», «Megaspeed» y «The New York Times» como etiquetas en filas fijas | Placas dentro del dibujo (`placa6`): azotea, caseta, fachada y cabecera |
| 9 rótulos de estación, que cambiaban al salir la cámara | Uno por tema, que cambia al llegar |
| Título de 1,4 s; la respuesta del gancho, dentro del viaje | Título de 2,3 s; la ruta al despacho del jefe entra con «sino» y se ve 2 s |
| Límite fr04→fr05 mal alineado (0,56 s) | Timing ajustado a los silencios (`escenas/short-v4/timing.short.json`, 11 límites) |
| La cámara salía 0,05 s después del fin anotado de la frase | Sale 0,15 s después del fin real; las piezas clave están 2 s o más |
| Zoom de un fotograma con las etiquetas saltando | Acercamiento de 0,4 s; corte y 0,5 s de general antes de viajar |
| Barrera con «restringe», dosier con «espionaje», lupa del consejo con «investigación» | Adelantados a «no (se pueden vender)», «trabajaba» y «abrió» |
| Cierre con una barra que iba y venía | Lupa sobre la fachada y un check con «confianza» |
| Pico de -2,1 dBTP | -2,8 dBTP con el limitador de `mezcla.mjs` |

## Segunda vuelta (tras `critica-04.md`)
| Observación | Cambio |
|---|---|
| **Bloqueante:** el tuit «NVIDIA ¿CONFIRMA? → NO CONFIRMA» y el sello «MATIZ» eran texto que copiaba la voz | Fuera. El tuit es una tarjeta sin texto legible con una insignia de «confirmado» (check verde) que pasa a interrogación ámbar con «no confirma». El bocadillo de China lleva la tarjeta en pequeño y un aspa con «especulación» |
| Los zooms cortaban Megaspeed y el plano del chip | Edificio, torres y muelle recolocados (26-230 u) y pizarra de 110 u: todo cabe con 6-8 u de margen |
| Tramos quietos en la frontera, en Megaspeed y en el cierre | La primera caja insiste contra la barrera, la caseta reacciona con «China» y un candado cae sobre el chip con «restringe»; las cajas de Megaspeed salen con «posible» y el haz se ve pasar por los armarios; una carpeta recorre la mesa del consejo |
| El identificador de Alice Huang tenía 4 palabras | «Alice Huang» (se pierde «Huang Le», que solo estaba en pantalla) |

Cambia respecto a lo que Mario aprobó en el plan: allí «el tuit del MATIZ se queda»; el crítico lo bloqueó por copiar
la voz y se ha sustituido por dibujo. Si lo prefiere con el titular, vuelve en una línea.

## No se aplica (queda para la siguiente iteración)
- Sujetos más grandes: Jensen Huang y la silueta de Alice siguen pequeños; la rotativa se lee como un aparato.
- El despacho del correo, sin nadie; el consejo, sin placa.
- El signo «?» separado de «jefe» por el marco de la palabra clave.
