# elgatomista: producción de vídeos

Vídeos explicativos y de noticias en español con voz sintética (videojuegos, curiosidades,
noticias, IA, series; enganche narrativo). Largo 16:9 de 8-10 min y short 9:16 de ~60 s
(máx. 120 s): mismo guion y estilo, compuestos por separado, nunca recortando uno del otro.

## Lee antes de trabajar
- memoria/decisiones.md (siempre) y, si tocas un vídeo, proyectos/<slug>/brief.md.
- Estilo: docs/estilo.md + marca/tokens.json (skill `estilo` cuando exista).
- Calidad y contrato de escena: docs/criterios.md. Diseño: docs/arquitectura.md.
- Calibración de estilo: docs/calibracion.md.

## Flujo
brief → fuentes y verificación → guion → [PUERTA 1] → storyboard y estilo → voz → alineación
→ escenas → render por escena → montaje y mezcla → QA → [PUERTA 2] → exportar → publicar.
- Una puerta solo se pasa con aprobación explícita de Mario, anotada en reviews/.
- Nada se publica sin aprobación de Mario sobre la huella exacta (SHA-256) del fichero final.

## Reglas
- Español siempre. Cada hecho, con fuente en fuentes.json; sin fuente no entra.
- Material de terceros: solo público, registrado en fuentes.json (URL, autor, licencia, tramo) y acreditado.
- Escenas: contrato seek(t) de docs/criterios.md, sin excepciones en modo render.
- Claves solo en .runtime/claves/: nunca las leas, imprimas ni copies. Usa .env.example.
- Pesados en .runtime/, render/ y salida/ (ignorados). Nada pesado en git.
- Sin borrado permanente: Papelera con ~/odd/scripts/recycle.ps1 y confirmación de Mario.
- Git solo local. Commits convencionales, sin atribución de IA, solo cuando Mario lo pida.
- Si algo falla dos veces con el mismo error, para y enséñalo.
- Nada se da por terminado sin evidencia (comando y resultado).
- No instales nada sin decirlo antes. No gastes dinero (APIs, suscripciones, servicios) sin
  consultar antes a Mario qué, cuánto y para qué, y esperar su sí.

## Agentes
- Orquesta Opus. Tareas pequeñas y cerradas (extraer fotogramas, medir audio, comprobar
  enlaces, hojas de contactos) → subagente Haiku. El crítico visual no es tarea pequeña.
- Avisa antes de un paso de esfuerzo alto (análisis, calibración): gasta cupo.

## Memoria
Al cerrar una tarea, actualiza memoria/: decisiones.md (qué y por qué), videos.md (estado
de cada vídeo), aprendizajes.md (qué funcionó y qué no).
