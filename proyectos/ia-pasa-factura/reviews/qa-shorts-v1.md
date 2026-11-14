# QA · ia-pasa-factura · shorts v1 (A y B)

Medidas de `node motor/qa.mjs --proyecto ia-pasa-factura --formato short-{a,b} --version 1` (2026-11-13), en
`.runtime/qa/ia-pasa-factura-short-a-v1/` y `…-short-b-v1/`.

| Comprobación | Short A | Short B | Umbral | OK/FALLA |
|---|---|---|---|---|
| Máster | `salida/short-a-v1.mp4`, SHA-256 `358f8f79…cfc40` | `salida/short-b-v1.mp4`, SHA-256 `de8b4595…94706` | | |
| Resolución y fps | 1080×1920, 60 | 1080×1920, 60 | 1080×1920, 60 fps | OK |
| Duración | 67,12 s | 76,80 s | short ≤ 120 s | OK |
| Sonoridad integrada | -14,2 LUFS (LRA 2,8) | -14,3 LUFS (LRA 2,5) | -14 ± 1 LUFS | OK |
| Pico real | -2,8 dBTP | -2,7 dBTP | < -2 dBTP | OK |
| Silencios ≥ 0,4 s | 0 (solo 0,00-0,23 al arrancar) | 0 | short sin pausas | OK |
| Congelados ≥ 2 s | 0 | 0 | 0 | OK |
| Tramos casi quietos ≥ 1 s | 3 (54,67; 59,97; el final) | 10, el mayor de 1,43 s (42,03) | informativo | OK |
| Negros | 0 | 0 | 0 | OK |
| Lint de textos y sincronía (`revisar.mjs --estricto`) | 0 errores, 10 textos, máx. 2 a la vez | 0 errores, 10 textos, máx. 2 a la vez | 0 errores | OK |
| Tests del motor (`cd motor && npm test`) | 35 de 35 | | todas las huellas iguales | OK |

## Voz y alineación
- Voz Orus con el estilo de siempre: A 66,5 s (15 pausas acortadas), B 76,2 s. Alineación con pista: A 95,8 %, B 96,4 %;
  a ciegas: A 88,7 %, B 89,1 %; sin palabras que falten ni sobren en ninguna de las cuatro.
- `revisar-alineacion.mjs --corregir`: 11 límites ajustados en cada short (el mayor, 0,37 s).
- **Para que lo oiga Mario:** Whisper oye «va a *aprobar* a pedir una cuenta» donde el guion dice «va a probar», con
  pista y a ciegas. Puede ser solo la fusión de las dos «a»; no se ha podido oír desde aquí. Tramo: 37,8-40,6 s del
  short A (recorte en `salida/comprobar-probar.wav`). Si suena «aprobar», se regenera esa voz.

## Sonido
Música «Bitcrushed Ambience» (`.runtime/audio/musica-alien.mp3`) a -13 dB; efectos a -24 dB (A: 19, B: 23), sacados de
`window.eventosSonido()` de cada escena.

## Crítica visual
Pendiente: `critica-shorts-v1.md` (crítico Opus sobre los másteres finales).

## Bloqueantes
Ninguno en las medidas. Faltan la crítica visual y la escucha de «probar».
