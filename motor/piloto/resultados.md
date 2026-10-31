# Piloto de motor · resultados

- Fecha: 2026-10-29.
- Escena: «piloto-01», 25 s a 60 fps (1500 fotogramas) en largo 1920×1080 y short 1080×1920, modo «nitido».
  - La escena es la misma para todas: `comun/escena.mjs` es una función pura de `t` y cada motor la pinta a su manera.
  - Especificación: `escena-spec.md`.
- Medidas con `comun/medir.mjs`: dos renders completos, el segundo pidiendo los fotogramas sueltos en orden inverso.
  - Tiempos **en serie con el equipo libre** (16 núcleos, ningún otro navegador abierto) y `RUNTIME_DIR` nuevo, sin cachés:
    `.runtime/piloto-limpio-2026-10-29/`.
  - Las medidas en paralelo de los subagentes (más lentas e irregulares) están en cada `NOTAS.md`.
- Implementó cada candidata un subagente Sonnet. Detalle, comandos y problemas en `<candidata>/NOTAS.md`.

## Tabla
| Métrica | propio (Playwright + FFmpeg) | HyperFrames 0.8.158 | Remotion 4.0.535 |
|---|---|---|---|
| (a) Determinismo: 4 PNG iguales, también en orden inverso | **Sí** (short y largo) | **Sí** | **Sí** |
| (a) MP4 idéntico byte a byte entre pasadas | **Sí** | **Sí** | **Sí** |
| (b) Tiempo de 25 s, short (a / b) | **17,4 / 18,5 s** | 81,3 / 80,0 s | 75,2* / 38,1 s |
| (b) Tiempo de 25 s, largo (a / b) | **22,4 / 23,5 s** | 84,3 / 77,4 s | 36,7 / 36,9 s |
| (b) Extrapolado: 60 s de short | **~42 s** | ~195 s | ~91 s (en caliente) |
| (b) Extrapolado: 10 min de largo | **~9 min** | ~32 min | ~15 min |
| (c) Bloques 4×4 mezclados en los PNG | 0 (comprobado con pngjs) | No medido | PSNR inf en la prueba ×4 → ÷4 |
| (d) Reanudación | **Por fotograma**, nativa (caché en `.runtime`); MP4 reanudado idéntico | Por segmento y solo con `HF_SEGMENTED_CAPTURE=true` + `--resume` | No; solo a mano, por tramos `frameRange` + concat |
| (e) Líneas de código (escena + render) | 89 + 155 | 136 + 29 + 58 | 78 + 24 + 65 |
| (e) Facilidad para el agente | Alta: HTML normal; nada impide animaciones CSS (lo vigilan guardas en tiempo de ejecución) | Media: el `seek(t)` propio va por una ruta no documentada; `lint` y `check` muy útiles | Alta: componente React función de `useCurrentFrame()`; ecosistema React/webpack |
| (f) Salida (`ffprobe`) | h264 · 60/1 · 1500 · 25,000 s | Ídem | Ídem |
| Red / telemetría | Ninguna | Telemetría apagada por variables; escribe `~/.hyperframes/config.json`; el registro muestra un intento de autoactualización anterior | Sin `licenseKey` no llama a nada (leído en el código, sin captura de red) |
| Licencia | Propia + Playwright (Apache-2.0) | Apache-2.0 | Gratis para particulares; revisar la 5.0 |

\* La pasada «a» de Remotion short incluye construir el bundle por primera vez; en caliente tarda unos 37-38 s.

## Notas para interpretar
- Propio es más rápido en parte porque **solo captura los fotogramas que cambian**: 1074 de 1500 en short y 1144 en largo.
  Lo permite que `estado()` sea puro. Usa además 8 navegadores en paralelo.
  Remotion y HyperFrames podrían ganar algo con trucos parecidos, pero no lo traen de serie.
- El determinismo se ha comprobado en esta máquina. HyperFrames recomienda `--docker` para garantizarlo entre máquinas distintas.
  Aquí no aplica: renderizamos siempre en el mismo equipo.
- No se ha probado el postproceso (desenfoque, *bloom*) en movimiento con ningún motor; se probará en el clip C5b.

## Recomendación
**propio** (Playwright + FFmpeg en `motor/`):
- es entre 1,6 y 4,5 veces más rápido;
- reanuda por fotograma;
- no hace llamadas de red ni tiene telemetría ni licencia de terceros;
- su contrato es directamente `seek(t)`;
- ya es la herramienta de captura de la calibración (`captura.mjs`).

El coste es mantener nuestro propio render (caché, paralelismo, FFmpeg) y añadir un *lint* de escena que prohíba animaciones con reloj. Para eso podemos copiar la idea de `hyperframes check`.

Alternativa si el código propio se complica: **Remotion**, en caliente a 1,5× el tiempo real, con un modelo de escena muy cómodo, pero sin reanudación nativa y con licencia que vigilar.

HyperFrames queda tercero: es el más lento (~3,2× el tiempo real), usa una ruta no documentada para nuestro `seek(t)` y escribe fuera del proyecto.
