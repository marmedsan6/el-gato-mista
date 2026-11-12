# 0010 · Estilo v6: casi sin texto, fuente en la caja y puerta automática

- Fecha: 2026-11-10
- Estado: **aceptada y estándar completo**. Reglas de Mario del 2026-11-10 (`memoria/decisiones.md`) y prueba aprobada el
  2026-11-11 («Me gusta, sigue»; `reviews/calibracion/iter-v6-01.md`): short interno v4 de NVIDIA y clip v6 en 16:9.
  Primer vídeo completo (largo con tres shorts), `como-google-sabe-lo-que-quieres`, publicado el 2026-11-12; Mario lo fija
  como versión estándar y completa ese día, con portadas de Codex para el largo y cada short y el short A saliendo con el largo.
- Sustituye en parte: ADR 0009 (v5) en textos, fuente del dato, rótulos, zoom core y tiempos de cámara. El diorama a
  4 px, MISTA solo en los temas, la paleta y la caja de diálogo no cambian.

## Contexto
Diagnóstico del short de NVIDIA (primer vídeo v5, publicado), en `docs/investigacion/diagnostico-2026-11-10/informe.md`:
- 51 textos que no eran diálogo en 71 s; 17 transcribían la voz y el 34 % del tiempo había 4 o más a la vez.
- 2 de 11 cartelas «Fuente:» quedaban fuera de pantalla y 10 de 40 textos duraban menos de 2 s.
- En pantalla se leía «NVIDIA INVESTIGA CHINA» (dos textos pegados): el crítico lo dio por bloqueante a posteriori.
- La cámara cortaba antes de que acabara la frase (alineación mal en un límite), el rótulo cambiaba al salir y el
  «zoom a escalones» a ×1,25 era un salto de un fotograma.
- Nada de eso lo vio el QA: se revisaba a ojo y con el crítico, tarde.

## Decisión
1. **Presupuesto de texto.** Además de la caja de diálogo, en pantalla solo puede haber:
   - el **título** en la entrada de tema y un **rótulo por tema** (los momentos en que sale MISTA, cierre incluido);
   - como mucho **1 identificador** a la vez: 1-3 palabras pegadas a lo que nombran, nunca en filas fijas;
   - la **cifra**, grande y sola, cuando el dato es una cifra.

   Ningún texto repite lo que dice la voz. Los nombres propios van, si se puede, **dentro del dibujo** (placa del
   edificio, cabecera del periódico): son arte y se mueven con él. Lo que no se entienda sin etiqueta se redibuja.
2. **Fuente del dato en la caja de diálogo.** Una pestaña de la caja enseña la fuente mientras suena la frase. Sale sola
   de las marcas `[fN]` del guion (`motor/timing-a-js.mjs --guion`) y del nombre corto de `fuentes.json` (campo `corto`
   o el autor). Sustituye a «fuente pequeña junto a la cifra». La descripción sigue sin fuentes (Mario, 2026-11-02).
3. **Rótulo de tema.** Cambia cuando llega la cámara, no cuando sale. El título de entrada dura 2 s como mínimo (o
   0,35 s por palabra): o el gancho no nombra nada hasta entonces, o la voz entra con desfase.
4. **Permanencia.** Todo texto y toda pieza clave del dibujo están 2 s o más en pantalla antes de que salga la cámara.
   Si una pieza entraba con la última palabra de la frase, se adelanta.
5. **Cámara.** Sale 0,15 s después del fin real de la frase (límites ajustados a los silencios de la voz). El zoom core
   es un acercamiento continuo de 0,4 s hasta ×1,25; se sale con corte y 0,5 s de plano general antes de viajar. El
   zoom encuadra entero lo que explica.
6. **Puerta automática.** Ninguna escena se renderiza entera sin pasar `node motor/revisar.mjs … --estricto`, y ningún
   máster va al crítico sin `node motor/qa.mjs`. La escena declara sus movimientos y piezas clave en `window.revision`.

## Consecuencias
- Biblioteca nueva en `motor/estilo/v6/`, sobre las primitivas de `v5/dibujo.js` (que no se tocan):
  - `escena.js`: `tiempos6`, `lienzos6`, `ruta6` (reglas 3-5), `crearTextos6`, `crearDialogo6` (pestaña de fuente),
    `mista6` y `clave6` (30 capturas por segundo en reposo, 60 en los movimientos);
  - `piezas.js`: chip, caja fuerte, lupa, silueta, farola, persona con chaqueta, `fondoNoche6` y `placa6`;
  - `estilo-v6.css`: solo las clases nuevas.
- Herramientas: `motor/lint-textos.mjs` (dentro de `revisar.mjs`), `motor/qa.mjs`, `motor/voz/revisar-alineacion.mjs`,
  limitador y medida final en `motor/mezcla.mjs`, `--desde/--hasta` en `motor/render.mjs` y `motor/huellas.mjs`.
- Ejemplos: `proyectos/nvidia-huang-espionaje/escenas/short-v4/` (9:16, interno) y `motor/calibracion/v6/clip.{html,js}`
  (16:9). Plantillas: `plantillas/escenas/v6/{short,largo}/` (ya no se copian a cada proyecto).
- Los vídeos publicados conservan su biblioteca (v2, v3, `v3/congelado/` o v5). `npm test` comprueba sus huellas
  (`motor/huellas/publicados.json`): la v6 no se aplica hacia atrás.
- El público ve la fuente solo en la caja de diálogo. En un vídeo sin caja (si llegara a haberlo), habría que decidir
  de nuevo dónde va.
- Pendiente para la siguiente iteración: mundo virtualizado para el largo, catálogo de dioramas por concepto, línea
  de tiempo declarativa y sujetos más grandes (Jensen Huang y la silueta siguen pequeños en el short interno).
