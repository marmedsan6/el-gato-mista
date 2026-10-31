# Candidata «hyperframes» · notas del piloto (2026-10-29)

HyperFrames 0.8.158 (instalado, sin actualizar). Escena «piloto-01» de `motor/piloto/escena-spec.md`.

## Ficheros
| Fichero | Qué es | Líneas |
|---|---|---|
| `plantilla.html` | La composición (HTML + CSS + script con su «timeline»). `__W__/__H__/__FORMATO__` se rellenan por formato | 136 |
| `preparar.mjs` | Genera el proyecto HyperFrames de un formato en `.runtime/piloto/hyperframes/proyecto-<f>/` (index.html + fuente local + meta.json) e **incrusta `comun/escena.mjs` tal cual** (quita `export`) | 29 |
| `render.mjs` | Contrato de `medir.mjs` | 58 |
| `prueba-reanudacion.mjs` | Prueba de reanudación (métrica d) | 53 |
| `env.sh` | Variables de entorno para lanzar el CLI a mano | 3 |

Líneas de la escena (métrica e): 136 en `plantilla.html` (~33 CSS, ~30 HTML/gato, ~65 JS de pintado y timeline) + las 66 de `comun/escena.mjs`, que son compartidas y no se reescriben. Sin código de render propio más allá de los 58 de `render.mjs` (casi todo es llamar al CLI).

## Cómo funciona
- **Lienzo base y ×4 («nítido»)**: la composición mide 480×270 (largo) / 270×480 (short) con `data-width/height` y todo en px base. `hyperframes render --resolution landscape|portrait` mantiene la composición y hace que Chrome pinte a DPR 4 (`deviceScaleFactor`): texto vectorial a 4×, sin ampliar por vecino. El CLI exige que el factor sea entero y la proporción igual (ahí encaja justo).
- **Posiciones**: `seek(t)` llama a `estado(t, formato)` de `comun/escena.mjs` y asigna `left/top/width` enteros. Cuadrícula = `background-image` con `linear-gradient` duros de 1 px y `background-position` = desplazamiento. Gato = 11 `div` rectangulares. Partículas = pool de 30 `div` 2×2. Titular y etiqueta = Press Start 2P local (`@font-face` con `PressStart2P-Regular.ttf` copiada junto al HTML; `Fonts: 1 loaded` en el snapshot).
- **Timeline sin GSAP**: HyperFrames espera una timeline GSAP en `window.__timelines["main"]`, pero GSAP solo se carga desde CDN en sus plantillas (no viene en `node_modules`; CDN prohibido). El runtime acepta cualquier objeto con `play/pause/totalTime/duration` (se lee en `hyperframe.runtime.iife.js`: llama a `timeline.totalTime(t, suppressEvents)` o `seek`). Mi «timeline» es un objeto de 8 líneas cuyo `totalTime(t)` llama a `estado(t)`. Por eso la animación coincide con `estado(t)` por construcción (no hay doble implementación). Trampa: si el objeto expone `getChildren`, `hyperframes check` asume GSAP y falla con `timeline.globalTime is not a function`; sin `getChildren` pasa. Sin `Date.now`, `requestAnimationFrame`, `setTimeout` ni CSS animations.
- **Orden de `seek`**: cada fotograma se renderiza llamando a `totalTime(t)` en el navegador; al ser función pura de `t`, da igual el orden (confirmado: 24,99 → 0 → 7,5 → 15 en la pasada b da los mismos SHA que 0 → 7,5 → 15 → 24,99).
- **Fotogramas sueltos** (`t_<t>.png`): `hyperframes snapshot <dir> --at t1,t2,… --no-end --zoom 0,0,W,H --zoom-scale 4 -o <tmp>` (el `--zoom` con región = captura a DPR 4: da 1920×1080 / 1080×1920). Respeta el orden pedido y el `t` exacto (no se ajusta a fotograma; `estado` redondea a fotograma). `render.mjs` renombra `frame-NN-at-<t>s.png` → `t_<t>.png`. Comprobado: el fotograma 450 del mp4 y `t_7.5.png` coinciden (PSNR 46,7 dB; la diferencia es la compresión H.264), así que snapshot y render pintan lo mismo. No hace falta ffmpeg para extraer.
- **MP4**: `hyperframes render <dir> -o <mp4> -f 60 --resolution … --quiet` (calidad por defecto «looks», CRF 16; H.264). 5 workers de Chrome, modo captura «screenshot», GPU «hardware» (Intel UHD detectada sola).

## Comandos
```
# desde motor/piloto/hyperframes (env.sh pone las variables de abajo)
node preparar.mjs short                                   # → .runtime/piloto/hyperframes/proyecto-short
node render.mjs --formato short --salida <dir> --fotogramas 0,7.5,15,24.99
npx hyperframes lint  <proyecto> --verbose
npx hyperframes check <proyecto>
cd ../comun && node medir.mjs hyperframes short ; node medir.mjs hyperframes largo
```
Variables (render.mjs las pone solo): `HYPERFRAMES_NO_TELEMETRY=1`, `DO_NOT_TRACK=1`, `HYPERFRAMES_NO_UPDATE_CHECK=1`, `HYPERFRAMES_SKIP_SKILLS=1`, `HYPERFRAMES_BROWSER_PATH` y `PRODUCER_HEADLESS_SHELL_PATH` = `chrome-headless-shell.exe` de Playwright (no se descargó ningún navegador). Dos `render` y `snapshot` por formato tardan ~80 s cada pasada (render ~60 s + snapshot ~12 s + preparación).

## Lint / check (nº 3)
- `hyperframes lint --verbose` (largo): 0 errores, 0 avisos.
- `hyperframes check` (largo y short): Lint 0/0, Runtime 0/0, Layout 0 problemas en 9 muestras, Motion 0/0, Contrast 9/9 AA → «Check passed». (Primera vez falló por la trampa de `getChildren` explicada arriba; corregido.)

## Resultados de `medir.mjs` (JSON de `.runtime/piloto/hyperframes/medidas-<f>.json`)
Salida de consola:
```
{"candidata":"hyperframes","formato":"short","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":81.2,"b":83.4},"salida":{"codec_name":"h264","width":1080,"height":1920,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
{"candidata":"hyperframes","formato":"largo","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":75.9,"b":82.5},"salida":{"codec_name":"h264","width":1920,"height":1080,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
```
- a Determinismo: 4/4 PNG idénticos en ambos formatos (pasada b con orden inverso). Además el **MP4 es idéntico bit a bit** entre las dos pasadas (`mp4_igual: true`), con GPU de hardware y 5 workers.
  SHA-256 short: t=0 `11ee5694…fa8d`, 7,5 `9fc1e8d8…1dbe`, 15 `5ecdcd28…33ad`, 24,99 `d8d4a470…4e0d`. Largo: 0 `0403ee8d…6c1b`, 7,5 `1c32dd49…7cf0`, 15 `d7bf1ae6…7b3f`, 24,99 `71bf7ba5…4b8b`.
- b Tiempo (incluye preparar + render + snapshot de 4 PNG): short 81,2 / 83,4 s; largo 75,9 / 82,5 s. Extrapolado de `medir.mjs` (lineal): 60 s → 195 / 182 s; 10 min → ~1950 / ~1820 s (≈ 30 min). Un render suelto sin snapshots: 108 s la primera vez (con la máquina menos fría), ~60-70 s después. Referencia: 1500 fotogramas ≈ 14-24 fps efectivos.
- c Escalado entero: no medido aquí (lo hace `escalado.py`). En modo nítido el texto de Press Start 2P y los bordes se suavizan al ×4 (esperable); rectángulos y cuadrícula caen en rejilla de 4 px.
- f Salida: h264, 1920×1080 / 1080×1920, 60/1, 1500 paquetes, 25,00 s. Exacto.

## Reanudación (nº 4, métrica d)
Probado con `prueba-reanudacion.mjs` (mata el árbol de procesos con `taskkill /F /T` y relanza; cada prueba en un proyecto con nombre único). Formato short, 25 s.
1. **Por defecto: NO reanuda.** Matado a los 54 s (captura 1335/1500), el relanzamiento rehízo todo desde cero: 122 s. Solo queda una carpeta `.x.hf-transaction-*` con `owner.json` junto al mp4 de destino; no hay fotogramas ni segmentos reutilizables.
2. **Modo segmentado** (único que documenta el CLI): `HF_SEGMENTED_CAPTURE=true` + `--resume` en el relanzamiento. Guarda segmentos en `<proyecto>/renders/.hf-segments/<hash>/segment_NNNNN.mp4` y `segments.json`. Con el tamaño por defecto (`HF_SEGMENT_FRAMES` = 3000 fotogramas = 50 s) un clip de 25 s es **un solo segmento**: matado y relanzado rehízo todo (195,6 s, más lento que sin segmentar). Con `HF_SEGMENT_FRAMES=300` (5 s por segmento): matado a 31 s, el relanzamiento escribió «resuming», saltó 4 segmentos completos («skipped 4») y rehízo solo el 5.º: **42,9 s** en total (≈ 12 s de arranque de Chrome + 1 segmento + unión). Con kill a 48 y 94 s (todos los segmentos listos) solo unió: 5,5 y 14,4 s. El MP4 resultante tiene el mismo tamaño en las tres pruebas de 300 fotogramas (1.051.124 B); no comparé su hash con el de un render normal.
   Conclusión: reanuda **a granularidad de segmento** (configurable, mín. 30 fotogramas), solo si se activa por variable de entorno + `--resume`; es una función marcada «segmented capture only». Para un largo de 10 min convendría `HF_SEGMENT_FRAMES` ≈ 600-1800.

## Carpetas temporales que deja el render (nada se borra)
En `C:\Users\mario\proyectos\canal-videos\.runtime\piloto\hyperframes\`:
- `proyecto-largo/`, `proyecto-short/`: proyecto generado (se sobrescribe `index.html` en cada render, no se vacía). Dentro, `.hyperframes/` (informes de `check`, estado) y, tras las pruebas, `renders/.hf-segments/` vacío.
- `tmp-snap-<formato>-<fecha>-<pid>/`: una por llamada a `render.mjs` (snapshots ya renombrados; queda `contact-sheet.jpg`).
- `largo-a/ largo-b/ short-a/ short-b/`: salidas de `medir.mjs` (mp4 + t_*.png). Los mp4/PNG se sobrescriben si se repite.
- Pruebas: `proyecto-short-reanudacion-*`, `reanudacion-*/` (con `x.mp4` y una carpeta `.x.hf-transaction-*` por render matado), `reanudacion-*.log`, `prueba-snap/`, `prueba-render/`, `f450.png`, `medir-*.log`, `medidas-*.json`.
- Fuera de `.runtime`: HyperFrames escribe en `C:\Users\mario\.hyperframes\config.json` (contador de comandos, renders recientes; la telemetría figura desactivada por `HYPERFRAMES_NO_TELEMETRY`) y su caché de frames en `%TEMP%\hyperframes-extract-cache-*` (doctor la menciona; no se usó vídeo). Antes de la prueba de reanudación ejecuté `rmSync` en las primeras versiones de los scripts (ya eliminado; los scripts finales no borran nada).
- Los directorios de trabajo internos de cada render (`.x.hf-transaction`) se quedan tras un render matado; los renders completos los limpian solos.

## Problemas
1. GSAP no disponible sin CDN → timeline propia (ver arriba). Si se quisiera la timeline nativa con `gsap.to()`, habría que vendorizar `gsap.min.js` (licencia GreenSock «Standard», no OFL) y mantener dos fuentes de verdad; no lo hice.
2. `check` falla si la timeline expone `getChildren` y no es GSAP (mensaje críptico).
3. `doctor --json` consulta npm para el «Version» (red); lo ejecuté una sola vez al inicio. El resto no se ejecuta. `~/.hyperframes/auto-update.log` (28-oct) muestra que HyperFrames ya intentó autoactualizarse antes de mi sesión; con `HYPERFRAMES_NO_UPDATE_CHECK=1` no lo intenta. En `lint/check/render/snapshot` no vi ninguna llamada de red (no hay forma de afirmarlo al 100 % sin un monitor de red; el HTML solo referencia ficheros locales).
4. Los nombres de fichero de `snapshot` llevan índice (`frame-00-at-24.99s.png`): hay que renombrar (hecho en `render.mjs`).
5. El render por defecto cae en captura «screenshot» + GPU hardware de la máquina; al probar `--no-browser-gpu` (SwiftShader) no medí diferencias: no probado. El determinismo bit a bit del MP4 se cumple en esta máquina; en otra GPU puede variar (el propio CLI recomienda `--docker` para determinismo entre máquinas).
6. Sin audio (no pedido).

## Valoración
- **Escribir escenas (agente)**: fácil en lo básico (HTML + CSS + un `seek`), y el `lint`/`check` dan feedback rápido y útil (layout, contraste, runtime). Pero el modelo mental de HyperFrames es GSAP + `data-start/data-duration`; nuestro contrato `seek(t)` puro encaja pasando por un objeto-timeline a medida, que es una ruta no documentada (descubierta leyendo el runtime). La documentación local trae skills pensadas para el flujo de HeyGen (guiones, briefs, TTS) con mucho ruido para nuestro caso.
- **Encaje con pixel art**: bueno. Composición a la resolución base + `--resolution` a DPR 4 da el modo «nítido» sin tocar nada; rectángulos y rejillas quedan en la rejilla. El modo «píxel» (render a ×1 y ampliar por vecino) no tiene equivalente directo en el CLI (habría que renderizar a 480×270 y ampliar con ffmpeg `scale=…:flags=neighbor`).
- **Determinismo y velocidad**: determinista (MP4 idéntico), ~60-80 s por 25 s de vídeo en esta máquina (≈ 2,5-3× tiempo real); extrapolado ~30 min para 10 min de vídeo. Reanudación solo con segmentos por variable de entorno.
- **Red/telemetría**: tiene telemetría anónima (`HYPERFRAMES_NO_TELEMETRY`/`DO_NOT_TRACK` la apagan; `telemetry status` → disabled), comprobación/autoactualización de versión (`HYPERFRAMES_NO_UPDATE_CHECK`), `doctor` consulta npm y sus plantillas cargan GSAP de jsDelivr; `publish`, `capture`, `catalog/add`, `cloud` y TTS/transcripción descargan o suben (no usados). No descargó navegadores: usó el headless shell indicado.
