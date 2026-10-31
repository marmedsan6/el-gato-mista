# elgatomista: producción de vídeos

Vídeos explicativos y de noticias en español con voz sintética (videojuegos, curiosidades,
noticias, IA, series; enganche narrativo). Largo 16:9 de 8-10 min y short 9:16 de ~60 s
(máx. 120 s): mismo guion y estilo, compuestos por separado, nunca recortando uno del otro.

## Lee antes de trabajar
- memoria/decisiones.md (siempre) y, si tocas un vídeo, proyectos/<slug>/brief.md.
- Estilo vigente (v2 con los cambios del 2026-10-31): antes de tocar escenas, skill `estilo`.
- Calidad y contrato de escena: docs/criterios.md. Diseño: docs/arquitectura.md.
- Calibración de estilo: docs/calibracion.md. Pendiente y orden: docs/hoja-de-ruta.md.

## Flujo
brief → fuentes y verificación → guion → [PUERTA 1] → storyboard y estilo → voz → alineación
→ escenas → render por escena → montaje y mezcla → QA → [PUERTA 2] → exportar → publicar.
- Paso a paso: skill `nuevo-video`. Mario y su diagrama mandan si algo no cuadra.
- **Dudas:** antes de generar cada pieza (guion, voz, escenas, máster), pregunta a Mario lo que no esté decidido
  y sirva para refinar el vídeo, y genera con sus respuestas. No adivines ni preguntes lo ya decidido.
- Una puerta solo se pasa con aprobación explícita de Mario, anotada en reviews/.
- Nada se publica sin la orden expresa de Mario en el chat. Esa orden basta y no se le piden huellas: skill `publicar` (ADR 0008).

## Reglas
- Español siempre. Cada hecho, con fuente en fuentes.json; sin fuente no entra.
- Material de terceros: solo público, registrado en fuentes.json (URL, autor, licencia, tramo) y acreditado.
- Escenas: contrato seek(t) de docs/criterios.md, sin excepciones en modo render.
- Claves solo en .runtime/claves/: nunca las leas, imprimas ni copies. Usa .env.example.
  Excepción: las credenciales de las redes están en ~/.clipping-ia (ADR 0008), con la misma regla.
- Pesados en .runtime/, render/ y salida/ (ignorados). Nada pesado en git.
- Sin borrado permanente: Papelera con ~/odd/scripts/recycle.ps1 y confirmación de Mario.
- Remoto: GitHub marmedsan6/el-gato-mista, PÚBLICO: nada privado en git. El push lo hace Mario.
  Commits convencionales, sin atribución de IA, solo cuando Mario lo pida.
- Si algo falla dos veces con el mismo error, para y enséñalo.
- Nada se da por terminado sin evidencia (comando y resultado).
- No instales nada sin decirlo antes. No gastes dinero (APIs, suscripciones, servicios) sin
  consultar antes a Mario qué, cuánto y para qué, y esperar su sí.

## Agentes
- Orquesta Opus. Tareas pequeñas y cerradas (extraer fotogramas, medir audio, comprobar
  enlaces, hojas de contactos) → subagente con el último modelo barato de frontera (hoy, Haiku).
  El crítico visual no es tarea pequeña.
- Avisa antes de un paso de esfuerzo alto (análisis, calibración): gasta cupo.

## Memoria
Al cerrar una tarea, actualiza memoria/: decisiones.md (qué y por qué), videos.md (estado
de cada vídeo), aprendizajes.md (qué funcionó y qué no).
