# Calibración v6 · vuelta 01 · 2026-11-10

Estado: **aprobada por Mario el 2026-11-11** («Me gusta, sigue»). Reglas: ADR 0010 (sus respuestas del 2026-11-10). El crítico pasa las dos piezas en la
segunda vuelta, sin bloqueantes.

## Qué se enseña
| Pieza | Fichero | Para comparar con |
|---|---|---|
| Short interno v4 de NVIDIA (9:16, 71,2 s) | `proyectos/nvidia-huang-espionaje/salida/short-v4.mp4` | La v3 publicada: `salida/comparativa-v3-v4.mp4` (lado a lado, con el audio de la v4) |
| Clip v6 en 16:9 (21,6 s) | `motor/calibracion/v6/clip-v6-largo.mp4` | El clip v5: `motor/calibracion/v6/comparativa-clip-v5-v6.mp4` (v5 arriba, v6 abajo) |

Los MP4 están fuera de git (ignorados). El short v4 es interno: no se republica sin la orden de Mario.

## Qué cambia frente a la v5
| Tema | v5 | v6 |
|---|---|---|
| Textos del short de NVIDIA | 51 que no eran diálogo | 8: título, 4 rótulos y 2 identificadores |
| Fuente del dato | Cartela junto al dato (2 fuera de pantalla) | Pestaña de la caja de diálogo, toda la frase |
| Nombres | Etiquetas en filas fijas | Placas dentro del dibujo |
| Rótulo | Uno por estación, cambia al salir | Uno por tema, cambia al llegar |
| Cámara | Sale 0,05 s tras el fin anotado; zoom de un fotograma | Sale 0,15 s tras el fin real; acercamiento de 0,4 s |
| Piezas clave | Algunas, 0,85 s en pantalla | 2 s o más (lo comprueba el lint) |
| Estación del matiz | Titular de texto «NVIDIA ¿confirma? → investiga» y sello | Tarjeta sin texto con insignia (check → interrogación), periódicos bajo la lupa, caja fuerte y China |

## Evidencia
| Qué | Resultado |
|---|---|
| `node motor/revisar.mjs … --estricto` en el short v4 | 8 textos, máximo 2 a la vez, 0 errores (la v3: 51 textos y 51 errores) |
| Lo mismo en el clip 16:9 y en las dos plantillas | 0 errores |
| `node motor/qa.mjs` en `short-v4.mp4` | -14,3 LUFS, -2,8 dBTP, 0 silencios de 0,4 s, 0 congelados de 2 s, 1 tramo casi quieto (la v3 tenía 4) |
| `node motor/qa.mjs` en el clip | -14,1 LUFS, -2,9 dBTP, 0 tramos casi quietos |
| `cd motor && npm test` | 33 de 33 |
| Huellas de lo publicado | 16 escenas, 128 de 128 idénticas antes y después de la v6 |
| Render del short v4 | 2.400 capturas de 4.272; 3 min (la v5, unos 6) |
| Crítico | v3 publicada: no pasa (`critica-03.md`). v6, primera vuelta: no pasa (`critica-04.md`, `critica-v6-01.md`). Segunda: **pasa** (`critica-05.md`, `critica-v6-02.md`) |

## Lo que el crítico deja sin bloquear (para que Mario decida si entra ya o en la siguiente)
- Short: la estación del matiz se entiende a medias sin leer (propone usar el periódico en lugar del tuit); sujetos
  pequeños y medio lienzo vacío; tramos quietos en 58,5-61,5 s y en el cierre; detalles (la carpeta parece un lingote,
  el check sobre la antena).
- Clip: franja negra bajo el zoom de la oficina y la IA como bolita azul (los dos vienen de la v5); «GEN LAMA2» y
  «NACIMIENTO» coinciden con la voz.

## Decisiones que tomó el agente y Mario puede cambiar
- El tuit del matiz ya no lleva titular (el plan decía que se quedaba): el crítico lo bloqueó por copiar la voz.
- «(Huang Le)» ya no sale en pantalla.
- Rótulos del short: «El caso», «El domingo», «Ojo», «Por ahora».
- El rótulo de tema se queda fijo durante su tema y la pestaña de fuente cuelga bajo la caja en el short.

## Respuesta de Mario
2026-11-11 · «Me gusta, sigue». La v6 queda como estilo vigente (ADR 0010 aceptado). No pidió cambios sobre las cuatro
decisiones del agente ni sobre lo que el crítico dejó sin bloquear: eso sigue en `docs/hoja-de-ruta.md`.
