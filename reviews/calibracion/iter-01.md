# Iteración 01 · 2026-10-29

- Qué se enseña: C5a, 6 fotogramas fijos con texto neutro («¿Por qué el cielo es azul?»), en dos modos de render.
  - `.runtime/calibracion/iter-02/<fotograma>.nitido.png`: el navegador pinta a ×4. El texto de la caja y las cifras salen suaves.
  - `.runtime/calibracion/iter-02/<fotograma>.pixel.png`: se pinta a ×1 y se amplía ×4. Todo queda en la rejilla de píxel, incluido el desenfoque.
  - Versiones `_360` para comprobar la legibilidad en el móvil.
- Antes de enseñarlos pasó una revisión interna: crítica Opus en `critica-01.md` (no pasaba) y correcciones en la iteración 02:
  - Tildes de Press Start 2P dibujadas en pixel (QUÉ, CAPÍTULO, DISPERSIÓN, MOLÉCULAS).
  - Como mucho 2 acentos por escena; nuevo `acento_azul` #5b8cff (6,03:1 sobre el fondo). El azul de selección queda solo para marcos.
  - short-3 rehecho: paneles dentro de la zona segura y una barra por color en proporción 5,8 : 1.
  - short-2: onda continua, «frente a 700 nm» y nada en la franja derecha tapada (0 píxeles, medido).
  - largo-2: el haz y la flecha roja salen del punto de dispersión, ojo en almendra y líneas guía.
  - Fuente del dato en Press Start 2P a 8 px (legible a 360) en lugar de la mono de 6 px.
- Modo de render: **nitido** (decisión de Mario en esta vuelta).

## Me gustó (se conserva)
- Modo de render «nitido» frente a «pixel»: «el nítido se ve mejor» (Mario, 2026-10-29).

## No me gustó
<!-- Mario -->

## Cambia exactamente (qué · dónde · cómo)
<!-- Mario -->

## Cambios aplicados a tokens
- `render.elegido` = `nitido`.
- `acento_azul`, `regla_acentos`, `tipografia.fuente_dato`, `tipografia.tildes` y `render` (versión `borrador-c5a`).
