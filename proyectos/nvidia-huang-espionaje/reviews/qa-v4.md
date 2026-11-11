# QA · nvidia-huang-espionaje · short v4 (interna, estilo v6) · 2026-11-10

Máster: `salida/short-v4.mp4`, SHA-256 `29863273f54894639f10fbecc7c28df60c0b3c26cc28491dd85b04b1bb074123`. **Versión interna:
no se republica sin la orden de Mario** (la publicada es la v3, `qa-v3.md`). Medidas de `node motor/qa.mjs` en
`.runtime/qa/nvidia-huang-espionaje-short-v4/`. Historia: `iter-03.md` (v3 → v4 en dos vueltas).

| Comprobación | Medida | Umbral | OK/FALLA |
|---|---|---|---|
| Resolución y fps | 1080×1920, 60 | 1080×1920, 60 fps | OK |
| Duración | 71,20 s | short ≤ 120 s | OK |
| Sonoridad integrada | -14,3 LUFS | -14 ± 1 LUFS | OK |
| Pico real | -2,8 dBTP | < -2 dBTP | OK (la v3, -2,1) |
| Silencios ≥ 0,4 s (-35 dB) | 0 | short sin pausas | OK |
| Congelados ≥ 2 s | 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 1 (35,00 s; 1,07 s) | informativo | OK (la v3 tenía 4) |
| Negros | 0 | 0 | OK |
| Lint de textos y sincronía | 8 textos, máximo 2 a la vez, 0 errores | 0 errores | OK (la v3: 51 textos, 51 errores) |
| Alineación | 4 desfases en el timing publicado; 11 límites ajustados | Sin desfases | OK (`escenas/short-v4/timing.short.json`) |
| Contrato seek(t) | `npm test` 33/33 | sin fallos | OK |
| Efectos | 21 a -24 dB, atados a la pantalla | solo lo clave | OK |

Comandos: `node motor/revisar.mjs proyectos/nvidia-huang-espionaje/escenas/short-v4/short.html 270 480 71.17 0.05 . --estricto`,
`node motor/mezcla.mjs …` (limitador y medida del máster) y `node motor/qa.mjs --proyecto nvidia-huang-espionaje --formato short --version 4 …`.

## Audio
-14,3 LUFS integrados, LRA 2,6 LU, pico real -2,8 dBTP. Misma voz, música («Bitcrushed Ambience» a -13 dB) y efectos que la v3.

## Congelados y negros
Ninguno. Un tramo casi quieto de 1,07 s en 35,0 s (zoom del objetivo, antes de la diana).

## Crítica visual
- `critica-03.md` (v3 publicada, línea base): no pasa.
- `critica-04.md` (v4, primera vuelta): no pasa por la estación del matiz.
- `critica-05.md` (v4, máster final): **pasa**, sin bloqueantes. Deja sin bloquear la estación del matiz (se entiende
  a medias sin leer), los sujetos pequeños y dos tramos quietos.

## Bloqueantes
Ninguno.
