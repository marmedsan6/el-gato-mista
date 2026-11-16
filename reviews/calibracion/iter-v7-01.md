# Calibración v7 · vuelta 01 · 2026-11-15

Estado: **aprobada por Mario el 2026-11-16** («Aprobado», en el chat). Reglas: ADR 0011 (aceptada con esta aprobación) sobre la v6 (ADR 0010). Set de referencia aprobado en
`set-v7-01.md`; piezas del vídeo aprobadas en `proyectos/ia-pasa-factura/reviews/piezas.md`.

## Qué se enseña
| Pieza | Fichero (fuera de git) | Para comparar con |
|---|---|---|
| Short A de ia-pasa-factura en v7 (9:16, 66,5 s, interno) | `.runtime/calibracion/v7/short-a-v7.mp4` | El publicado (v6): `.runtime/calibracion/v7/comparativa-short-a-v6-v7.mp4` (izquierda v6, derecha v7, con el audio) |
| Clip 16:9 en v7 (26,4 s): estaciones 0 y 1 del short A en apaisado | `.runtime/calibracion/v7/clip-v7.mp4` | No hay versión publicada en 16:9 |

Escenas: `proyectos/ia-pasa-factura/escenas/short-a-v7/` y `motor/calibracion/v7/clip.{html,js}`. El short publicado
(`escenas/short-a/`) no se ha tocado.

## Qué cambia frente a la v6
| Tema | v6 publicada | v7 |
|---|---|---|
| Arte | Dibujo por código (cajas con 3 tonos) | 28 piezas generadas con Codex (21 nuevas y 7 del set), convertidas a la rejilla de 4 px y a `R5` |
| Por código | Todo | Cielo, suelo, paredes (`interior7`), tubería, flechas, destellos, marcas del portapapeles y lo escrito en la barra |
| Personas | Pastillas de 10×24 | Figuras de 28 de alto con pelo, ropa y paso; camisas por paleta |
| Estación 0 | El tendero se asoma | Del piloto: el tendero sale, mira la calle vacía y la tienda se apaga y cierra |
| Observador | Paseante con portapapeles dibujado aparte | Investigadora con portapapeles blanco grande (set) |
| Foro de Reddit | Fachada con ventanas al azar | Bloque generado que apaga sus ventanas una a una (`apagarLuces7`) |

## Evidencia
| Qué | Resultado |
|---|---|
| `node motor/revisar.mjs …/short-a-v7.html 270 480 66.52 0.05 … --estricto` | 10 textos, máximo 2 a la vez, 0 errores |
| `node motor/revisar.mjs motor/calibracion/v7/clip.html 480 270 26.4 0.05 … --estricto` | 5 textos, 0 errores (tras bajar las cifras, que caían en la franja de arriba durante el zoom) |
| Render del short A | 3.991 fotogramas (2.207 distintos), 137 s |
| `node motor/qa.mjs` en el short A v7 (`qa-short-a-v7.md`) | −14,2 LUFS, −2,9 dBTP, sin negros; casi quietos: 54,7 s (1,4 s, Stack Overflow antes de vaciarse) y 60,0 s (1,1 s, también en el publicado) |
| `node motor/qa.mjs` en el clip (`qa-clip-v7.md`) | −14,2 LUFS, −2,9 dBTP, 0 casi quietos; la «duración» sale en rojo porque es un fragmento de 26 s (esperado) |
| Codex para el vídeo | 12 llamadas (7 tandas y 5 repuestos), 43-101 s y 16.795-39.487 tokens cada una, 284.129 en total; registro en `.runtime/piezas/ia-pasa-factura/registro.jsonl`. Con el set (6 llamadas, 124.269 tokens), 18 en el día. Cupo de Codex tras las 18 (registro de sesión de la CLI): **semana 2 %**, ventana de 5 h 3 % (antes del día, semana 1 %): un short entero cuesta ~1 % de la semana, muy por debajo del ≤ 7 % estimado para dos |
| `cd motor && npm test` | 45 de 45 (24 escenas publicadas con sus huellas iguales) |

## Crítica
**Primera pasada** (`critica-v7-01.md`): **no pasa**, pero la v7 es **mejor base que la v6** («los sujetos se reconocen sin
texto»). Bloqueante: los bocadillos de la estantería, tarde y lejos de las cabezas, con el «!» ilegible. No bloqueantes: en
Reddit, el despacho pegado, la puerta del foro pequeña y la tubería plana de código; en el clip faltaba el «15 %».

**Arreglos** (decisiones del agente):
- Estantería: un bocadillo sobre cada cabeza desde «La IA aprende» que vuela al robot con «pregunta»; el «!» pasa a signo
  oscuro por paleta (`igualar` en `piezas/meta.json`).
- Reddit: sin el despacho; una ventana alta del foro se enciende y de ella sale el «!»; los paseantes llegan a la esquina
  (no entran por la puerta pequeña); tubería con contorno, 3 tonos de metal y luz arriba a la izquierda, de 8 a 2 px. Un
  foro nuevo con la puerta a escala no salió (Codex lo dio con píxel grueso, 33×68).
- Clip: cifras sobre su calle y zoom centrado entre las dos.
- Stack Overflow: mesas en una fila sobre el suelo y calendario lejos de la placa; tienda de abajo dentro de la zona
  segura en el zoom; flecha de subida más clara.
- Tras los arreglos: lint 0 errores en las dos escenas; QA del short (`qa-short-a-v7.md`) y del clip en verde salvo la
  duración del fragmento; queda un tramo casi quieto de 1,4 s en Stack Overflow (54,7 s; el umbral es 2 s).

**Segunda pasada** (`critica-v7-02.md`): los tres defectos de la vuelta 01, resueltos; un bloqueante nuevo (el zoom cortaba
«PEW» y el observador), **arreglado** después junto con las flechas (contorno y volumen) y los paquetes (dos colores).
Veredicto del crítico: corregido ese bloqueante, **pasa**; la v7 es mejor base que la v6 «con más margen». Render final:
lint 0 errores, QA en verde (−14,2 LUFS, −2,9 dBTP, sin negros; un tramo casi quieto de 1,1 s a los 60 s, como en el
publicado).

**Queda sin tocar** (no bloquea, decidir si se hace antes de aceptar la v7): la pantalla del foro de Stack Overflow se lee
como papilla a 360; los libros del bucle son una mancha; el «?» de Reddit y el globo flotan sin anclaje; la puerta del
foro y el portal no respetan `escala.json` (Codex no mantiene la escala en piezas compuestas).

## Me gustó (se conserva)
Mario aprueba sin comentarios: se conserva todo lo de la vuelta y lo que el crítico pide conservar.
## No me gustó
Nada señalado por Mario.
## Cambia exactamente (qué · dónde, con marca de tiempo · cómo)
Nada. Lo no bloqueante de `critica-v7-02.md` queda como mejora para el siguiente vídeo en v7.
