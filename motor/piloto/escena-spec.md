# Piloto de motor · especificación de la escena de prueba

Misma escena en las 3 candidatas: `hyperframes/`, `propio/` (Playwright + FFmpeg) y `remotion/`.
Objetivo: medir, no pulir el estilo (los valores visuales son provisionales hasta la calibración).

## Escena «piloto-01» (25 s, texto neutro)
- Lienzo base **480×270** (largo) y **270×480** (short), escalado **×4 exacto** → 1920×1080 y
  1080×1920. `image-rendering: pixelated`; posiciones y tamaños enteros en el lienzo base.
- **60 fps** → 1.500 fotogramas por formato.
- Paleta provisional de 8 colores (hex fijos en un `paleta.json` común).
- Elementos, todos en función de `t` (segundos):
  1. Fondo con cuadrícula de 16 px que se desplaza 1 px cada 4 fotogramas (snapping entero).
  2. Sprite de 16×16 (gato provisional dibujado con rectángulos) que cruza el lienzo de 0 a 12 s
     con un easing escalonado (posición redondeada a píxel).
  3. Titular pixel «PRUEBA DE MOTOR» que se escribe letra a letra de 2 a 6 s (texto neutro).
  4. Barra que crece de 0 a 100 % de 8 a 20 s, con etiqueta numérica.
  5. 30 partículas con generador de semilla fija (`mulberry32(42)`) de 12 a 25 s.
  6. Cambio de composición en t = 15 s (algo nuevo cada 2-4 s se cumple con 1-5).
- Fuente pixel provisional: una OFL local en `motor/piloto/comun/fuentes/` (nunca CDN ni del
  sistema). Hasta que se descargue con permiso, se dibuja texto con un mapa de bits propio de 5×7.
- Sin audio (el audio se mide aparte).

## Contrato
`seek(t)` pinta exactamente el fotograma de `t`. Prohibido en render: CSS transitions/animations
con reloj, `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now()`, `performance.now()`.

## Medidas (script común `motor/piloto/medir.mjs` + `motor/piloto/escalado.py`)
| # | Medida | Cómo | Aprueba si |
|---|---|---|---|
| a | Determinismo | Dos renders completos; SHA-256 de los fotogramas en t = 0; 7,5; 15; 24,99. Además, seek en orden 24,99 → 0 → 15 | Hashes idénticos |
| b | Tiempo de render | Tiempo real de 25 s × 2 formatos; extrapolado a 60 s y a 10 min | Se anota; comparativa |
| c | Escalado entero | Cada bloque 4×4 del PNG de salida es de un solo color | 0 bloques mixtos |
| d | Reanudación | Matar el render a mitad y relanzar: ¿sigue desde el último fotograma o escena? | Sí / no / cuánto rehace |
| e | Escritura | Líneas de código de la escena, errores al escribirla y tiempo del agente | Se anota |
| f | Salida | `ffprobe`: resolución, 60 fps, 25,00 s, códec | Exacto |

Resultados en `motor/piloto/resultados.md` (tabla por candidata con comando y salida).
Recomendación → `docs/decisiones/0004-motor.md` (borrador hasta que Mario confirme).

## Instalaciones (se piden en 🛑 P1)
- FFmpeg en el PATH (`winget install --id Gyan.FFmpeg --scope user`).
- `hyperframes/`: `npm i hyperframes` + plugin oficial de Claude Code (scope project; lo ejecuta Mario).
- `propio/`: `npm i playwright pngjs` (se reutiliza el Chromium de Playwright que ya hay en la máquina, si la versión coincide).
- `remotion/`: `npm i remotion @remotion/cli @remotion/renderer react react-dom` (licencia gratis
  para particulares; se revisa el cambio de Remotion 5.0 antes de elegirlo).
