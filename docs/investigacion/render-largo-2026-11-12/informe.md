# Por qué el largo tardó 14,5 h en renderizar y cómo bajarlo sin perder calidad

Fecha: 2026-11-12. Pedido de Mario: «mide lo del largo para hacer un análisis exhaustivo sobre cómo reducir ese tiempo
sin que pierda calidad el vídeo». Escena medida: `proyectos/como-google-sabe-lo-que-quieres/escenas/largo/largo.html`
(8:13, 29.586 fotogramas a 60 fps, 15.804 distintos con `claveFotograma`), abierta exactamente como `motor/render.mjs`
(480×270 ×4 = 1920×1080, chrome-headless-shell, captura por CDP). Banco y comparador en [banco/](banco/).

## 1. Conclusión

**La escena no es lenta. El portátil se durmió.** Con el equipo despierto, el largo entero se captura en
**~14 min** con el `render.mjs` actual y en **~10 min** con la captura PNG rápida, que deja los píxeles idénticos.
Las 14,5 h del render v1 fueron casi todas horas con el equipo en espera o frenado.

| Configuración (8 navegadores, equipo despierto) | s por captura | Largo entero (15.804 capturas) |
|---|---|---|
| `render.mjs` actual | 0,051-0,054 | ~14 min |
| + PNG rápido (`optimizeForSpeed`) | 0,038-0,039 | **~10 min** |
| + PNG rápido + `--num-raster-threads=1` | 0,041 | ~11 min (no mejora) |
| 6 / 10 / 12 navegadores con PNG rápido | 0,042 / 0,036 / 0,035 | 11 / 9,5 / 9 min |
| Render v1 real (2026-11-11/12) | 3,31 | 14,5 h |

La codificación con FFmpeg suma 152 s (registro del v1: `total` 52.448 s − `captura` 52.296 s).
**Render completo previsto: ~13 min en vez de 14,5 h.**

## 2. La prueba: el render v1, hora a hora

Hora de cada fotograma en la caché del v1 (`.runtime/render-cache/85a19393a80ae811`), cruzada con el registro de sistema
de Windows (Kernel-Power 506/507):

| Tramo | Capturas | Ritmo | Qué pasaba |
|---|---|---|---|
| 11-11 17:40-17:50 | 6.986 | ~0,09 s | recién lanzado, equipo en uso |
| 17:50-18:46 | ~2.400 | ~1,3 s | sin evento de espera; frenado (ver §5) |
| 18:46 → 08:08 | ~2.900, solo en despertares breves | casi 0 | **«entrando en el modo de espera moderno, motivo: Lid»**: tapa cerrada |
| 11-12 08:08-08:14 | 3.383 | ~0,11 s | «saliendo… motivo: Lid»: tapa abierta; el render acaba a las 08:14:50 |

El equipo admite solo la espera moderna (S0), y con corriente apaga la pantalla y entra en espera a los **10 min sin
uso** (`VIDEOIDLE` y `STANDBYIDLE` = 600 s). En espera, los procesos de escritorio casi no avanzan. El
`TimeoutNegativeWarning` que aparece en el registro del render es el reloj de Node saltando al despertar.

Hoy se reprodujo: dos entradas en espera por inactividad (17:44 y 17:58) coinciden con tandas del banco que se hundieron.

## 3. El arreglo principal: que el render no deje dormir al equipo

Con una petición de «mantener despierto» activa (`SetThreadExecutionState` con
`ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED`, ver [banco/despierto.ps1](banco/despierto.ps1)):

- **0 entradas en espera** y **0 atascos** en 30 tandas de 90 s seguidas (más de 45 min de carga continua), con hasta
  38 min sin tocar el equipo.
- Es una petición del proceso que muere con él. No cambia ningún ajuste de energía.

Propuesta para `render.mjs`: lanzar ese ayudante al empezar y cerrarlo al acabar.

**Lo que no cubre: la tapa.** Cerrar la tapa manda a espera aunque haya petición. Para renderizar con la tapa cerrada,
Mario tendría que poner «Al cerrar la tapa (con corriente): No hacer nada» en Opciones de energía. Es un ajuste del
sistema, así que lo decide y lo cambia él. La alternativa es dejar la tapa abierta los ~13 min que dura.

## 4. Mejoras sin pérdida de calidad (medidas)

1. **PNG rápido.** `Page.captureScreenshot` con `optimizeForSpeed: true` comprime menos pero sigue siendo PNG sin
   pérdida. Captura con 1 navegador: de 244 a 114 ms. Con 8: de 0,052 a 0,038 s por captura (**−27 %**).
   **Píxeles idénticos en 300 de 300 fotogramas** repartidos por todo el vídeo (comparación descodificada, diferencia
   máxima 0). Contrapartidas:
   - cada PNG pesa el doble (≈550 KB frente a 280 KB): ~8,6 GB de caché por render completo en vez de ~4,4 GB;
   - cambiar `render.mjs` invalida todas las cachés (su contenido entra en la clave). Los tests no se ven afectados:
     `huellas.mjs` captura por su cuenta y `determinismo` compara dos renders hechos con el mismo motor.
2. **Quedarse en 8 navegadores.** 10-12 ganan un 5-8 % más y dejan el equipo sin margen para Mario. 6 pierde un 8 %.
3. **Descartado:** `--num-raster-threads=1` (no mejora con el equipo despierto), quitar desenfoques u ocultar capas
   (sí cambian la imagen).
4. **Registro con hora en `render.mjs`.** Hoy imprime «300/15804» sin hora, y así el frenazo pasó inadvertido. Con hora
   y ritmo cada 300 capturas se vería al momento.

## 5. Lo que no sé

- **El tramo 17:50-18:46 del v1 y el de hoy 18:15-18:40 fueron lentos sin entrar en espera.** El de hoy, además, con
  la petición de mantener despierto activa. En esos tramos el servicio `LenovoProcessManagement` dejó de responder
  20 veces (Service Control Manager 7011). Descarté:
  - el contenido: los mismos tramos van rápidos aislados;
  - la memoria: quedaban 7-9 GB libres;
  - escribir los PNG en disco: A/B sin diferencia;
  - el modo eficiencia (EcoQoS) de Windows: A/B sin diferencia;
  - el número de hilos de rasterizado.

  No he podido reproducirlo después de las 19:11: 45 min de carga continua sin un atasco. Puede ser carga de otros
  programas o el software de Lenovo. **No lo sé.** El registro con hora del §4.4 lo dejaría a la vista en el próximo
  render.
- Las medidas del 2026-11-10 que llevaron al punto 5 de la hoja de ruta («mundo por tema o virtualizado»: 0,27 s por
  captura con 2 pantallas y 1,62 s con 32) y a «nada pesado durante un render multiplica ×5-10» se tomaron sin
  controlar la espera. Con el equipo despierto, el largo entero va a ~0,05 s por captura. **Hay que volver a medirlas
  antes de invertir en virtualizar el mundo.**

## 6. Para repetir menos (cuando el render ya dura minutos)

- **Caché por bloque:** hoy tocar cualquier fichero invalida el largo entero. Renderizar cada bloque con su clave y
  empalmar convertiría un arreglo en un render de 1-2 min. Con 13 min de render completo, pasa a ser secundario.
- **Recortar capas a lo visible:** el fondo lejano y el de delante redibujan unos 16.000 elementos SVG por fotograma a
  lo ancho de todo el mundo del bloque. Diagnóstico (1 navegador): sin esas capas, la captura baja de 0,34 a 0,20 s.
  Recortarlas al tramo que ve la cámara podría ahorrar un 30-40 %, pero toca `motor/estilo/v6`, que usa un vídeo
  publicado, y exigiría comprobar la identidad de píxeles. Ya no compensa con renders de ~13 min.

## 7. Datos

- Máquina: portátil con i7-13620H (6P+4E, 16 hilos), 32 GB, espera moderna S0, plan «Equilibrado», con corriente.
  El navegador sin interfaz rasteriza y compone **por software** (SwiftShader; `rasterization: disabled_software`).
- La caché de render ocupa **170 GB** en `.runtime/render-cache` (272 carpetas).
- Comandos: `node banco/bench.mjs --n 15804 --workers 8 --max-s 90 [--opt] [--save dir]` y
  `node banco/cmp.mjs dirA dirB`. Las capturas de las pruebas están en `.runtime/bench-render/` (3,8 GB).
