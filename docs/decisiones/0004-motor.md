# 0004 · Motor de render

- Fecha: 2026-10-29
- Estado: **aceptada** (Mario, 2026-10-29: «Sí», tras ver los 3 vídeos del piloto). «Estamos iterando»: se puede revisar con datos nuevos.

## Contexto
Hacía falta un motor que pinte escenas HTML con el contrato `seek(t)` (docs/criterios.md §1) a 1080p y 60 fps en los dos
formatos, de forma determinista, reanudable y sin coste. Se probaron tres candidatas con la misma escena de 25 s y las
mismas medidas (`motor/piloto/resultados.md`).

## Decisión
Motor **propio**: Playwright 1.64.1 + chrome-headless-shell-1243 + FFmpeg 9.0.2, código en `motor/`.
- Captura por CDP (`Page.captureScreenshot` con `clip.scale` 4) y PNG por tubería a FFmpeg (H.264, yuv420p, crf 18, bt709).
- Caché por fotograma en `.runtime/` para reanudar; solo se capturan los fotogramas cuyo estado cambia.
- Varios navegadores en paralelo (8 por defecto).
- Guardas en tiempo de ejecución que detectan reloj o animaciones (`setTimeout`, rAF, `Date.now`…).

## Por qué
- Determinista en las 6 pasadas (PNG y MP4 idénticos byte a byte), igual que las otras dos.
- El más rápido con el equipo libre:
  - 25 s de largo en 22-24 s (~9 min por cada 10 min de vídeo);
  - Remotion tarda ~37 s (~15 min por 10 min);
  - HyperFrames tarda ~80 s (~32 min por 10 min).
- Es el único que reanuda por fotograma, de forma nativa.
- Sin red, sin telemetría, sin licencias de terceros que vigilar; el contrato es `seek(t)` sin capas intermedias.

## Consecuencias
- El render, la caché y el paralelismo los mantenemos nosotros (unas 155 líneas hoy).
- Hay que añadir un *lint* de escena en `motor/tests/` que falle si una escena usa animaciones CSS o temporizadores,
  y el test de determinismo de `motor/README.md`.
- Remotion queda como alternativa documentada si el código propio crece demasiado.
- Las carpetas `motor/piloto/hyperframes/` y `motor/piloto/remotion/` (y sus `node_modules`) quedan como referencia del
  piloto. Si Mario quiere liberar espacio, van a la Papelera.
