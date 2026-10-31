# 0005 · Estilo v1

- Fecha: 2026-10-29
- Estado: aceptada (Mario: «Me gusta, aprobado», sobre el clip C5b v2)

## Contexto
El estilo se calibró con el método de `docs/calibracion.md`:
- **Referencias:** 3, analizadas en `docs/estilo/analisis/`.
- **Puntos comunes:** `docs/estilo/analisis-comun.md`.
- **Preguntas:** 24, respondidas en `docs/estilo/respuestas.md`.
- **Vueltas:** 2, con crítica Opus (`reviews/calibracion/`).
  - C5a: 6 fotogramas fijos.
  - C5b: clip de 18 s en los dos formatos.

## Decisión
Estilo v1 = **pixel art de interfaz de videojuego sobre fondo oscuro**:
- **Narrador:** sin personaje.
- **Letras:** titulares en Press Start 2P (con tildes pixel propias) y cifras en JetBrains Mono.
- **Diálogo:** caja de diálogo JRPG sin avatar en el short, con la palabra clave en caja de selección pixel.
- **Paleta:** con roles fijos y como mucho 2 acentos por escena.
- **Movimiento:** a saltos, con destello pixelado entre bloques, travelling lento y postproceso determinista (desenfoque, *bloom*).
- **Render:** modo «nítido» (×4 en el navegador).

Fuente única:
- `docs/estilo.md`: reglas.
- `marca/tokens.json`: valores, versión `v1`.
- `motor/estilo/`: implementación.
- `.claude/skills/estilo/`: comprobaciones.

## Consecuencias
- Cada vídeo parte del estilo v1. `proyectos/<slug>/style_guide.md` solo recoge desviaciones.
- Cualquier cambio de regla es un estilo v2 con aprobación de Mario.
- El sonido (chiptune y *bleeps*) está decidido como intención, pero depende de los pilotos de voz y música (tareas 5 y 6).
- Pendiente de comprobar en un vídeo real: el texto de la caja de diálogo (12 px base) es el más pequeño de la pantalla.
