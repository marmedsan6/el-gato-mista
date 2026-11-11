# Hoja de ruta

Estado a 2026-11-11. Lo hecho hasta el 2026-11-09 (esqueleto, calibraciones v1-v5, pilotos, publicación y los seis
primeros vídeos) está en `docs/historial/hoja-de-ruta-hasta-2026-11-09.md`. El estado de cada vídeo, en `memoria/videos.md`.

## Dónde estamos
- **Vídeos:** 7 publicados (Mithril, Phonic-1, Alien: Isolation, ventanas de contexto, resumen semanal, NVIDIA y Fable 5.2).
- **Estilo:** v6 (ADR 0010) sobre la v5 (ADR 0009). Reglas de Mario del 2026-11-10 y prueba aprobada el 2026-11-11 («Me gusta, sigue»).
- **Sistema:** motor propio con lint, QA en un comando, limitador, render por tramo y huellas de lo publicado.
- **Git:** la rama `claude/elgatomista-execution-plan-c8445b` y el `main` local están en el mismo commit; falta el push de Mario.

## Iteración v6 (2026-11-10)
Diagnóstico: `docs/investigacion/diagnostico-2026-11-10/informe.md`. Decisiones: `memoria/decisiones.md`.

| Qué | Dónde | Evidencia |
|---|---|---|
| Reglas v6 | `docs/estilo.md`, ADR 0010 | Respuestas de Mario del 2026-11-10 |
| Biblioteca v6 | `motor/estilo/v6/` | Plantillas, short v4 y clip pasan `revisar.mjs --estricto` con 0 errores |
| Lint de textos y sincronía | `motor/lint-textos.mjs`, `motor/revisar.mjs` | Sobre la v3 publicada encuentra las 2 fuentes fuera de pantalla y los textos de menos de 2 s (`tests/revisar.test.mjs`) |
| Alineación | `motor/voz/revisar-alineacion.mjs` | NVIDIA: 4 desfases, 11 límites ajustados, el mayor de 0,56 s |
| Fuente por frase | `motor/timing-a-js.mjs --guion`, `motor/fuentes-frases.mjs` | 11 de 12 frases de NVIDIA con fuente; la pestaña se ve en todas |
| Mezcla | `motor/mezcla.mjs` | Short v4: -14,3 LUFS y -2,8 dBTP (la v3, -2,1) |
| QA en un comando | `motor/qa.mjs` | 12 s por máster; sustituye a dos subagentes |
| Render | `clave6`, `render.mjs --desde/--hasta` | Short v4: 2.400 capturas de 4.272, 3 min (la v5, unos 6) |
| Lo publicado no cambia | `motor/huellas.mjs`, `tests/publicados.test.mjs` | 16 escenas, 128 huellas idénticas antes y después |
| Tests | `cd motor && npm test` | 33 de 33 |
| Prueba 9:16 | `proyectos/nvidia-huang-espionaje/salida/short-v4.mp4` y `comparativa-v3-v4.mp4` | De 51 textos a 8; críticas en `reviews/critica-03.md`, `04` y `05` |
| Prueba 16:9 | `motor/calibracion/v6/clip-v6-largo.mp4` y `comparativa-clip-v5-v6.mp4` | `reviews/calibracion/iter-v6-01.md` |
| Docs y memoria | `docs/`, `memoria/`, skills y agentes | Texto v1 al historial; memoria en resumen vigente más historial |

## Pendiente, en orden
| # | Tarea | Necesita a Mario |
|---|---|---|
| 1 | Push de `main` y de la rama (el `main` local ya está en la punta de la rama desde el 2026-11-11; lo que había sin versionar en el checkout principal está en `.runtime/respaldo-main-2026-11-11/`) | Sí: el push |
| 2 | Decidir qué se hace con el short publicado de NVIDIA (el crítico lo da por no apto a posteriori) | Sí |
| 3 | Instagram de anthropic-fable-5-2, que falló al subir (HTTP 400 ProcessingFailedError) | Sí |
| 4 | Primer vídeo completo en v6 (un largo con sus shorts) | Tema y puertas |
| 5 | Mundo por tema o virtualizado para el largo: con 16 pantallas, cada captura cuesta 3,6 veces más que con 2 | No |
| 6 | Catálogo de dioramas por concepto (`motor/biblioteca/`) y quién elige el recurso | Decisión |
| 7 | Lo que el crítico dejó sin bloquear en la v6 (`reviews/calibracion/iter-v6-01.md`): la estación del matiz con el periódico en lugar del tuit, sujetos más grandes (Jensen Huang, la silueta, la rotativa), tramos quietos del matiz y del cierre, y la IA del clip. Rediseño de MISTA si Mario lo pide | Decisión |
| 8 | Línea de tiempo declarativa y un comando que encadene la producción | No |
| 9 | Subtítulos propios en YouTube (necesita reconectar con `youtube.force-ssl`); identificador @Pod02-leo; apodo de TikTok | Reconectar |
| 10 | Licencia de Krea §2.3 antes de usar el atlas en algo publicable | No |
| 11 | Franja negra bajo el zoom de la oficina en 16:9 (pendiente desde la v5) | No |

## Dudas abiertas
- Miniaturas del largo: hoy la portada se genera con Codex a partir de fotogramas.
- Si GitHub Pages sirve la rama `gh-pages` (ADR 0003): la rama está en origin; no se ha comprobado la web.
