# Motor

Motor de render propio (ADR 0004): Playwright 1.64.1 + chrome-headless-shell-1243 + FFmpeg 9.0.2. Todos los comandos se
lanzan desde la raíz del repo. No lances nada pesado mientras corre un render: con 8 navegadores la máquina se satura.

## De la voz al máster, en orden
```bash
# 1 · voz (Orus con el estilo de siempre) y, en el short, pausas cortas
node motor/voz/generar.mjs --proveedor gemini --voz Orus --estilo "<estilo>" --texto <voz.txt> --salida <voz.wav>
node motor/voz/por-bloques.mjs --texto <bloques.txt> --salida <voz.wav> --sin-clips <wav> --guion <txt>   # largos, por tramos
node motor/voz/apretar-pausas.mjs --entrada <voz.wav> --salida <voz.wav>
# 2 · alineación, nombres escritos y límites de frase en los silencios reales
<venv>/python motor/voz/alinear.py --audio <voz.wav> --guion <voz.txt> --salida <timing.json> --formato short
node motor/voz/escrito.mjs <timing.json> <voz-escrito.json>
node motor/voz/revisar-alineacion.mjs <timing.json> <voz.wav> --corregir <timing.json>
# 3 · timing de la escena, con la fuente de cada frase (marcas [fN] del guion)
node motor/timing-a-js.mjs <timing.json> <escena>/timing.js --guion <guion.md> --seccion Short --fuentes <fuentes.json>
# 4 · puerta antes del render: errores de seek(t) y lint de textos y sincronía
node motor/revisar.mjs <html> 270 480 <duración> 0.05 <carpeta de capturas> [t1,t2] --estricto
# 5 · render (un tramo para previsualizar: --desde 10 --hasta 14)
node motor/render.mjs --escena <html> --ancho 270 --alto 480 --duracion <s> --incluir motor/estilo,motor/estilo/v5,motor/estilo/v6 --salida <mp4>
# 6 · efectos y mezcla (falla si el máster no queda en -14 ± 1 LUFS y < -2 dBTP)
node motor/eventos.mjs --escena <html> --ancho 270 --alto 480 --salida <eventos.json>
node motor/mezcla.mjs --video <mp4> --voz <wav> --musica <mp3> --eventos <eventos.json> --sfx-dir <dir> --musica-db -13 --sfx-db -24 --salida <máster>
# 7 · QA mecánico: medidas, fotogramas para el crítico y borrador de reviews/qa-vN.md
node motor/qa.mjs --proyecto <slug> --formato short --version <N> --escena <html>
```

## Piezas
| Fichero | Qué hace |
|---|---|
| `render.mjs` | Captura por `window.seek(t)` y codifica H.264 (crf 18, bt709). Caché por fotograma en `<RUNTIME_DIR>/render-cache/<clave>/` (la clave incluye la escena, `--incluir`, los parámetros y el propio `render.mjs`). Con `window.claveFotograma(t)` captura una vez cada tramo igual. Falla si la escena usa reloj. `--fotogramas t1,t2` deja PNG sueltos; `--desde/--hasta`, solo un tramo |
| `revisar.mjs` | Recorre `seek(t)` cada `paso` s, junta errores, pasa el lint y saca capturas ×2. `--estricto` sale con 1. `--consulta "formato=largo"` |
| `lint-textos.mjs` | Lógica del lint: solapes, fuera de pantalla, zona tapada, texto sobre la caja, permanencia, textos simultáneos, saltos, transcripción de la voz, fuente visible, piezas clave y rótulo frente a la llegada. Lee `window.TIMING` y `window.revision` |
| `voz/revisar-alineacion.mjs` | Compara los límites de frase con `silencedetect`, avisa de duraciones imposibles y ajusta |
| `timing-a-js.mjs`, `fuentes-frases.mjs` | `window.TIMING` para la escena, con `frases[].fuentes` y nombres cortos |
| `eventos.mjs` | `window.eventosSonido()` de la escena → JSON |
| `mezcla.mjs` | Voz + música (sidechain) + efectos, `loudnorm` en dos pasadas, limitador con sobremuestreo ×4 y medida del máster con `ebur128` |
| `qa.mjs`, `qa-medidas.mjs` | QA de un máster: ficha, huella, sonoridad, silencios, congelados, negros, último instante de cada frase (completo y a tamaño de móvil), hojas a 2 fps y tiras de los movimientos de cámara |
| `huellas.mjs` | `--generar` guarda las huellas de las escenas publicadas en `huellas/publicados.json`; sin argumentos, compara |
| `estilo/` | `v6/` vigente (ADR 0010) sobre `v5/dibujo.js`; raíz (v2), `v3/`, `v3/congelado/` y `v5/` solo reproducen lo publicado |
| `biblioteca/` | Catálogo pixel v1 (investigación del 2026-11-06); no lo usa ninguna escena |

## Tests (`npm test`, en `motor/`)
- `lint-escena`: sin reloj, animaciones CSS, `Math.random` ni red en escenas, biblioteca y plantillas.
- `determinismo`: dos renders dan PNG y MP4 idénticos; una escena con reloj se rechaza.
- `publicados`: las escenas ya publicadas conservan sus huellas.
- `lint-textos`, `revisar`, `alineacion`, `fuentes-frases`, `qa-medidas`: las herramientas de la v6.
- Se ejecutan solos al cerrar cada turno si hay cambios en `motor/` o en escenas (`.claude/hooks/verify-on-stop.sh`).

## Carpetas
- `calibracion/v6/`: clip de la calibración vigente. `v5/`, `v4/` y `v3/gato-hoja.html`, historial. Las anteriores están en la
  etiqueta git `archivo/pre-limpieza-2026-11-09`.
- `piloto/`: `resultados.md` y `escena-spec.md`, la evidencia del ADR 0004.
- `node_modules/` aquí mismo, ignorado por git (`npm ci` la primera vez).
