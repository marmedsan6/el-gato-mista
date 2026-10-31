# Candidata Remotion · notas del piloto (2026-10-29)

Remotion 4.0.535, licencia gratuita para particulares, React 18.3.1. Sin instalar nada nuevo.

## Ficheros
- `src/index.jsx` (24 líneas): `registerRoot` con las composiciones `piloto-largo` (1920×1080) y `piloto-short` (1080×1920), 60 fps, 1500 fotogramas.
- `src/Escena.jsx` (78 líneas): la escena. Llama a `estado(frame / fps, formato)` de `../comun/escena.mjs` y pinta divs de coordenadas enteras en un contenedor base 480×270 / 270×480 con `transform: scale(4)` (modo «nítido»: Chromium rasteriza a ×4). Fuente Press Start 2P local: `publicDir` del bundle apunta a `marca/fuentes/press-start-2p/` (sin copiarla al repo), `staticFile()` + `FontFace` + `delayRender/continueRender`.
- `render.mjs` (65 líneas): API de `@remotion/bundler` + `@remotion/renderer` (sin CLI). Bundle cacheado en `.runtime/piloto/remotion/bundle` (se rehace solo si cambian `src/`, `comun/` o `render.mjs`). `selectComposition` → `renderStill` por cada t (frame = round(t*60), PNG `t_<t>.png`, en el orden recibido) → `renderMedia` (h264, crf 18, yuv420p, sin audio) a `piloto-<f>.mp4`. Todas las llamadas llevan `browserExecutable` = chrome-headless-shell de Playwright (no se descarga nada).
- Opciones extra de `render.mjs`: `--solo-mp4`, `--solo-stills`, `--rango <ini-fin>`, `--nombre <fichero.mp4>`.
- Total: 167 líneas (escena 78 + registro 24 + render 65). Solo la escena y el registro son «código de vídeo»: 102 líneas.

## Comandos
```
cd motor/piloto/comun
node medir.mjs remotion short
node medir.mjs remotion largo
# render suelto
cd ../remotion && node render.mjs --formato short --salida <dir> --fotogramas 0,7.5,15,24.99
```

## Salida de medir.mjs (dos ejecuciones; el equipo estaba compartido con otras candidatas, los tiempos varían mucho)
Ejecución 1:
```
{"candidata":"remotion","formato":"short","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":132.1,"b":149.9},"salida":{"codec_name":"h264","width":1080,"height":1920,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
{"candidata":"remotion","formato":"largo","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":142.4,"b":67.4},"salida":{"codec_name":"h264","width":1920,"height":1080,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
```
Ejecución 2 (la que deja `.runtime/piloto/remotion/medidas-*.json`; la 1 está en `medidas-*-run1.json`):
```
{"candidata":"remotion","formato":"short","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":103.9,"b":97.7},"salida":{"codec_name":"h264","width":1080,"height":1920,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
{"candidata":"remotion","formato":"largo","deterministas":true,"mp4_igual":true,"tiempo_s":{"a":58.2,"b":99.9},"salida":{"codec_name":"h264","width":1920,"height":1080,"r_frame_rate":"60/1","nb_read_packets":"1500","duracion":25}}
```
- Determinismo: PNG de t = 0; 7,5; 15; 24,99 idénticos en las dos pasadas (la segunda en orden inverso) y también el MP4 byte a byte, en los dos formatos y las dos ejecuciones.
- Tiempo: rango 42–150 s por 25 s de vídeo según carga del equipo. Un render suelto del short con la máquina más libre: 42 s (≈ 36 fps; 1,7× tiempo real). Con los números de la ejecución 2 (a): 60 s ≈ 250 s (short) / 140 s (largo), 10 min ≈ 41 min / 23 min, pero la dispersión es enorme; hace falta repetir en equipo libre para comparar. Concurrencia por defecto de Remotion (mitad de los núcleos); no se ha tocado. La primera ejecución incluye ~20 s de empaquetado del bundle (después cacheado).
- Escalado entero (métrica c, comprobación propia con ffmpeg: reducir ×4 y ampliar ×4 por vecino y comparar con el PNG): PSNR = inf en largo t=7,5 y 15 y en short t=7,5 y 24,99, es decir 0 bloques 4×4 mezclados, texto incluido (Press Start 2P a 8 px base = 32 px es pixel perfect). No es el script oficial `escalado.py` (no existe aún / sin Python).
- Salida (f): h264, 1920×1080 y 1080×1920, 60/1, 1500 paquetes, 25,000 s.

## Reanudación (métrica d)
- Remotion **no reanuda** un render cortado. Probado: `renderMedia` envía los fotogramas por tubería a su ffmpeg interno y solo escribe el MP4 al final: matado a los 20 s (árbol de procesos) no quedó ningún MP4 parcial ni fotogramas; en %TEMP% solo una carpeta `remotion-v4.0.535-assets…` vacía (y no se limpia). Relanzar rehace los 1500 fotogramas (41,8 s, igual que uno limpio). Rehace el 100 %.
- Alternativa que sí funciona: renderizar por tramos con `frameRange` y concatenar. Probado con 3 tramos (`--rango 0-499`, `500-999`, `1000-1499`) + `ffmpeg -f concat -c copy`: 1080×1920, 60 fps, 1500 fotogramas, 25,000 s. Los fotogramas decodificados no son idénticos bit a bit al render único (el codificador arranca por tramo), pero PSNR entre ambos = 64,6 dB de media (mín. 57 dB). Coste: cada tramo paga el arranque de Chromium + selectComposition (~10-15 s), y la unión sin recodificar exige mismos parámetros. Es reanudación manual por tramos (el script orquestador debería guardar qué tramos ya existen), no automática; la unidad de reanudación sería un tramo, no un fotograma.

## Red y telemetría
- No hubo descargas: con `browserExecutable` Remotion no intentó bajar Chrome Headless Shell; compositor (binarios ffmpeg/ffprobe) ya venía en `node_modules/@remotion/compositor-win32-x64-msvc`.
- Telemetría: revisado el código (`@remotion/renderer` 4.0.535 y `@remotion/licensing`): solo se envía un «usage event» a `https://www.remotion.pro` cuando se pasa `licenseKey` (modo cloud/Lambda). Sin licenseKey, `renderMedia` resuelve sin llamar a nada. No hay opción de telemetría que desactivar. No se ha capturado tráfico de red real; la conclusión es por lectura de código.
- Aviso a vigilar: el modelo de licencia (no verificado aquí; la spec pide revisar el cambio de Remotion 5.0 antes de elegirlo). Para uso individual es gratis.

## Problemas encontrados
- Tooling: un heredoc con comillas falló en Git Bash; se usó la herramienta Write.
- `taskkill /T` desde un `&` de bash no mata el proceso correcto (PID de subshell); hay que usar el PID de Windows (se resolvió con un script en node).
- `%TEMP%` acumula carpetas `remotion-*assets*` y `remotion-webpack-bundle-*` de ejecuciones (y de otras versiones: 4.0.534); Remotion no las borra siempre.
- Tiempos ruidosos por carga compartida; ninguna otra incidencia: 0 fallos de render.

## Valoración
- Facilidad para que un agente escriba escenas: alta. Una escena es un componente React función de `useCurrentFrame()`; ningún reloj real que evitar, el contrato seek(t) se cumple por diseño (cada fotograma lo renderiza una página independiente con su `frame`). La escena piloto salió a la primera (0 errores de ejecución). Coste: ecosistema React/JSX + bundler webpack (cacheable), `delayRender` para fuentes, y la API de render con muchas opciones.
- Encaje con pixel art: bueno en modo nítido (contenedor base + `scale(4)` con divs enteros y fuente a múltiplos de 8 px da 0 bloques mezclados). Modo «pixel» (render a ×1 y ampliar) se haría con `scale` de `renderMedia`/`renderStill` o con post-ffmpeg; no probado. El postproceso (bloom, desenfoque) sería CSS/SVG filter dentro del navegador: determinista si no usa reloj.
- Velocidad: aceptable pero no brillante (1,7–6× tiempo real según carga, con unos 60-90 divs por fotograma). Sin reanudación nativa.
- Requisitos externos: ninguno más (ffmpeg interno propio; el ffmpeg del PATH solo lo usa medir.mjs).
