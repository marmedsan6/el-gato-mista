# Candidata «propio» (Playwright + FFmpeg) · notas del piloto

Fecha: 2026-10-29. Playwright 1.64.1, chrome-headless-shell 1243 (el que ya había), FFmpeg 9.0.2 (PATH). Nada instalado.

## Ficheros
- `escena.html`: la escena (DOM con `div` posicionados en px enteros del lienzo base). Pinta `estado(t, formato)`.
- `render.mjs`: contrato de `medir.mjs` + reanudación. Inyecta `comun/escena.mjs` como script clásico (quita los `export`) con `addScriptTag`; `escena.html` solo lee `window.__escena`.
- Fuente: `marca/fuentes/press-start-2p/PressStart2P-Regular.ttf` por `@font-face` con ruta relativa (sin red). `render.mjs` comprueba `document.fonts.check` antes de capturar.

## Comandos
```
# render suelto (--workers por defecto 8 navegadores en paralelo)
cd motor/piloto/propio
node render.mjs --formato short --salida <dir> --fotogramas 0,7.5,15,24.99 [--workers N]
# medidas comunes
cd motor/piloto/comun
node medir.mjs propio short
node medir.mjs propio largo
```
Salida de `medir.mjs`: `.runtime/piloto/propio/medidas-<formato>.json` (más los PNG y mp4 de `short-a/`, `short-b/`, ...).

## Salida de `medir.mjs`
```
{"candidata":"propio","formato":"short","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":30.4,"b":35.4},"salida":{"codec_name":"h264","width":1080,"height":1920,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
{"candidata":"propio","formato":"largo","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":51.5,"b":24.6},"salida":{"codec_name":"h264","width":1920,"height":1080,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
```
- (a) Determinismo: los 4 PNG (t = 0; 7,5; 15; 24,99) idénticos en el render A y en el B (este último pide los t al revés: 24,99 → 15 → 7,5 → 0), y además **el mp4 es idéntico byte a byte** (también entre 1, 2, 4 y 8 trabajadores y entre un render limpio y uno reanudado; comprobado con SHA-256 y `framemd5`).
- (b) Tiempo, 25 s: short 30,4 s / 35,4 s; largo 51,5 s / 24,6 s. **Mucho ruido**: durante las pruebas había otras candidatas renderizando en la misma máquina (unos 40-60 procesos `chrome-headless-shell`), así que la dispersión entre A y B es de carga, no del motor. La mejor marca limpia es ~25-30 s por 25 s de vídeo (≈ 1:1). Extrapolación de `medir.mjs` con la pasada A: short 73 s / 731 s (60 s / 10 min); largo 124 s / 1237 s. Con la marca limpia saldría ~1,0-1,2 × duración (10 min ≈ 10-12 min) y escala linealmente con el nº de fotogramas distintos.
- (c) Escalado entero: comprobado con pngjs en los 8 PNG (4 t × 2 formatos): **0 bloques 4×4 mixtos** de 129 600 (incluido el texto, porque Press Start 2P a 16 px y 8 px base cae en la rejilla). Modo «nitido» (deviceScaleFactor 4); no he implementado el modo «pixel».
- (f) Salida (ffprobe): h264, yuv420p, 1920×1080 y 1080×1920, 60/1, 1500 paquetes, 25,000 s. Etiquetado bt709 limitado, `crf 18`, `preset medium`, `-fflags +bitexact`.

## (d) Reanudación (probada de verdad)
Cada fotograma distinto se guarda como PNG en `.runtime/piloto/propio/cache/<formato>-<hash>/f_NNNNN.png` (escritura atómica: `.tmp` + rename). La clave incluye formato, `--salida`, `escena.html`, `escena.mjs` y `render.mjs`, así que cambiar la escena invalida la caché. La caché **no se borra** (corrección del orquestador; regla del proyecto: sin borrado permanente). Como la clave incluye `--salida`, dos renders a carpetas distintas son independientes, que es lo que necesita la medida a/b. Para liberar espacio, Mario la manda a la Papelera.

Prueba (script de apoyo en el scratchpad de la sesión: lanza el render de short, `taskkill /T /F` a los N s, relanza con los mismos argumentos):
- 1.ª prueba: matado a los 17 s con 1000 de 1074 PNG en caché → relanzado: reutilizó 1000, **rehízo 74**.
- 2.ª prueba: matado a los 12,7 s con 412 de 1074 → relanzado: reutilizó 412, **rehízo 662**.
- El mp4 resultante de la reanudación es idéntico byte a byte al de un render limpio (SHA-256 `77ae40c0db9ccbaa…`).
Resultado: sí reanuda por fotograma; solo repite lo que no llegó a escribirse (a lo sumo los fotogramas en vuelo, hasta 8). El ensamblado con FFmpeg se rehace siempre entero (unos 8-10 s).
Granularidad: por fotograma, no por escena; con escenas reales conviene que la clave incluya el contenido de cada escena (hash de su estado/assets) en lugar de un hash global como aquí.

## (e) Escritura
- Escena: `escena.html` 89 líneas (≈10 de CSS y ≈68 de JS; 3 en blanco). Sin contar el `estado()` común, que ya venía hecho.
- Render: `render.mjs` 154 líneas (10 en blanco), incluyendo reanudación, caché, tubería a FFmpeg, guardas del contrato y argumentos.
- Errores al escribirla: ninguno de lógica en la escena (el primer render ya salió bien). Problemas de rendimiento y de entorno, abajo.
- Tiempo del agente: ~23 min de reloj de principio a fin (incluye optimizar la captura, las pruebas de reanudación y las dos mediciones).

## Hallazgos y problemas
1. **`page.screenshot()` de Playwright es lento** en esta máquina: ~174 ms/fotograma a 1080×1920 (4 m 19 s para 1074 fotogramas con 2 páginas). Con CDP directo, `Page.captureScreenshot` con `clip: {x:0,y:0,width:W,height:H,scale:4}`, ~65 ms/fotograma y **píxeles idénticos** (comprobado: 0 píxeles distintos en los 4 PNG). Sin `clip.scale` el CDP devuelve 270×480 (ignora el deviceScaleFactor), ojo.
2. **Varias páginas en un mismo navegador no escalan** (1 → 4 páginas: 54 s → 55 s). Un navegador por trabajador sí: 4 → 47 s, 8 → 30 s (16 núcleos). El cuello de botella es el rasterizado/lectura de píxeles de la captura, no el PNG (webp o PNG rápido tardan igual).
3. **Reutilización de fotogramas idénticos**: `estado()` es puro, así que se capturan solo los fotogramas cuyo estado (sin `f` ni `t`) cambia: 1074 de 1500 en short y 1144 de 1500 en largo. FFmpeg recibe el mismo PNG repetido. Es válido solo porque la escena pinta únicamente desde el estado.
4. `file://` no carga módulos ES (previsto): `escena.mjs` se inyecta como texto sin `export`. Para escenas con muchos módulos habría que servir por un servidor HTTP local o empaquetar.
5. Guardas del contrato: `addInitScript` sustituye `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now` y `performance.now` por funciones que lanzan y registran; al acabar el render comprueba que `window.__violaciones` está vacío (lo está). `escena.html` no usa transiciones/animaciones CSS.
6. Entorno: el hook `guard.js` bloquea `rm` desde Bash; usé directorios de salida distintos en las pruebas (quedan en `.runtime/piloto/propio/prueba*`, `reanudar-short`, ... para que Mario los mande a la Papelera si quiere). Un intento de listar procesos huérfanos con PowerShell fue denegado por el clasificador, así que no sé si la prueba de matar el render (`taskkill /T /F`) dejó navegadores huérfanos: cuando el padre muere, Playwright cierra normalmente su Chromium por la tubería, pero no lo comprobé.
7. El texto de 8 px (etiqueta del %) usa la misma fuente a 1× de la rejilla: es nítido (0 bloques mixtos) pero el glifo de 8 px es poco legible a 360×640; para el cálculo de legibilidad conviene subirlo a 16 px base.

## Valoración
- **Facilidad de escribir escenas**: alta. Una escena es HTML/CSS/JS normal; `seek(t)` es una función que reescribe estilos. Con el `estado()` puro, la escena entera ocupó ~70 líneas y salió a la primera. El agente puede iterar viendo un PNG con el mismo `captura.mjs`. Riesgo: nada impide usar un CSS animado o un `setTimeout`; la garantía depende de las guardas y de la disciplina (aquí las guardas lo detectan en tiempo de ejecución).
- **Encaje con pixel art**: bueno en modo «nitido» con deviceScaleFactor 4: texto de Press Start 2P a múltiplos de 8 px y rectángulos enteros dan 0 bloques mixtos. Hay que cuidar que todo vaya en px enteros (fracciones darían bloques mixtos). Los postprocesos de estilo (bloom, desenfoque de fondo, rayos) los da CSS `filter`/`backdrop-filter` o canvas; no los he probado y el modo «nitido» los dejará suaves.
- **Control**: total sobre captura, caché, reanudación y FFmpeg (bt709, bitexact). Coste: hay que mantener a mano el render, la caché y la paralelización (como las páginas no escalan, un navegador por trabajador consume memoria: unos 8 navegadores).
- **Rendimiento**: ~1 × tiempo real con 8 navegadores en esta máquina (limitado por el rasterizado de captura a 1080p por fotograma); depende del número de fotogramas distintos, no de su duración.
