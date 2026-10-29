# Calibración de estilo

Procedimiento fijo para definir el estilo visual, iterarlo y guardarlo para reutilizarlo.
Basado en la receta del reel de santiremedio (nota de la bóveda
`canal-videos/transcripcion-reel-estilo-edicion-2026-10-29.md`). **Todavía no se ha ejecutado.**

Coste: esfuerzo alto solo en C2, C3, C4 y en las síntesis de C6. C1 y las medidas, con
subagente Haiku. El agente avisa del gasto de cupo antes de cada paso caro.

## C0. Referencias
- Tres vídeos elegidos con Mario. Punto de partida: reel `De-F4riBJ1K` (pixel art, línea
  preferida) y reel `DehA1hgonRL` (alternativa).
- Mario los deja en `referencias/ref-01.mp4` … `ref-03.mp4`, o autoriza su descarga uno a uno.
- `referencias/README.md` anota URL y qué gusta de cada uno.

## C1. Extracción (Haiku, sin coste de API)
Por referencia, con FFmpeg, salida en `.runtime/referencias/<ref>/`:
- 1 fotograma cada 0,5 s (`-vf fps=2`).
- Cambios de plano: `select='gt(scene,0.3)',showinfo` → intervalos entre cambios
  (media, mediana, p90).
- Silencios: `silencedetect` (número, duración, posición). Sonoridad: `ebur128`.
- Paleta: cuantización por fotograma (Pillow) → hex dominantes y frecuencia.
- Hojas de contactos (`tile`) cada 15 s.
- Resultado numérico en `docs/estilo/analisis/<ref>.json`. Ningún fotograma entra en git.

## C2. Análisis visual (Opus, esfuerzo alto)
Sobre hojas de contactos y métricas: composición, tipografía (categoría, peso, caja, tamaño
relativo; equivalentes de licencia libre, sobre todo fuentes pixel), movimiento (duraciones,
curvas, snapping), transiciones, textura (grano, contornos, dithering), densidad de texto,
subtítulos, pistas de sonido.
**Solo lenguaje visual**: nunca sujetos, logos ni textos de terceros.

## C3. Puntos comunes
`docs/estilo/analisis-comun.md`: tabla «común / diverge» y primer borrador de
`marca/tokens.json` (paleta limitada, fuentes, tamaños por formato, duraciones, curvas, ritmo
y silencios objetivo).

## C4. Preguntas antes de crear nada
De 10 a 30 preguntas con opciones, por bloques: paleta, tipografía, mascota (gato: sí/no,
cómo), ritmo largo frente a short, silencios, movimiento, transiciones, textura, subtítulos,
sonido, qué no quiere nunca. Respuestas en `docs/estilo/respuestas.md`.

## C5. Primera pieza de prueba
El movimiento necesita motor y el motor se elige en el piloto, así que va en dos pasos:
- **5a. Fotogramas fijos** (sin motor): 3 en 16:9 y 3 en 9:16; HTML capturado con
  Playwright a PNG.
- **5b. Clip de 15-20 s** en ambos formatos con el motor del piloto, sobre un texto neutro de
  prueba (no un guion real).

## C6. Iteración
Cada vuelta deja `reviews/calibracion/iter-NN.md`:
```markdown
# Iteración NN · fecha
## Me gustó (se conserva)
## No me gustó
## Cambia exactamente (qué · dónde, con marca de tiempo · cómo)
## Cambios aplicados a tokens
```
Termina cuando Mario dice «aprobado». Si a la 5.ª vuelta no converge, se revisan las
referencias en vez de seguir puliendo.

## C7. Guardar como estilo v1
- `docs/estilo.md`: reglas legibles, qué sí y qué no.
- `marca/tokens.json` y `marca/fuentes/` (solo licencias libres).
- Plantillas de escena en `plantillas/`.
- Skill `.claude/skills/estilo/SKILL.md`: carga esos ficheros (no copia valores) y lista las
  comprobaciones: fuentes, silencios, velocidad, paleta y movimiento.
- Entradas en `memoria/aprendizajes.md` y ADR en `docs/decisiones/`.
- Cualquier cambio posterior → estilo v2, con aprobación de Mario.

## C8. Uso en cada vídeo
`proyectos/<slug>/style_guide.md` = «estilo vN» + solo las desviaciones de ese vídeo.
