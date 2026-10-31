# Crítica · C5a iteración 01 (6 fotogramas fijos) · 2026-10-29

- Revisor: subagente con Opus, siguiendo `.claude/agents/critico-visual.md`.
- Referencias usadas: `marca/tokens.json`, `docs/estilo/respuestas.md` y `docs/criterios.md` §1.
- Imágenes: `.runtime/calibracion/iter-01/` del checkout principal (6 PNG y sus versiones `_360`).
- Fuentes de las escenas: `motor/calibracion/c5a/*.html` y `comun.css` / `comun.js`.

## 3 peores defectos
1. **Demasiados acentos y el azul de `seleccion` usado como texto** (short-2, short-3, largo-2, largo-3). **Bloqueante.**
   - Hay 3-4 acentos por fotograma, frente al máximo de 2 de los tokens.
   - El azul de selección (3,1:1 sobre el panel) aparece en textos y contenidos, y no hay ningún azul de contenido.
   - El magenta «×5,8» se lee como neón (P24).
   - Arreglo: token `acento_azul` = #5b8cff, 2 acentos por escena y el resto en `texto` / `texto_suave`.
2. **short-3: la fuente se sale del panel** y el panel invade la franja derecha que tapa la interfaz. **Bloqueante.**
   - Arreglo: paneles más estrechos (x 64–477 y 517–930 de salida) y la fuente dentro del panel o debajo.
3. **Cifras grandes en JetBrains Mono suavizada**, fuera de la rejilla de píxeles. **No bloqueante (lo decide Mario).**
   - Arreglo: dibujarlas en el lienzo base y escalar ×4 por vecino más próximo, y enseñar las dos versiones.

## Por fotograma
- short-1: la caja de selección de «azul» está descompensada (sin aire a la derecha). No pasa por la «QUé».
- short-2: la onda corta sale rota en trazos y la línea guía tiene huecos (un punto por columna). No pasa.
- short-3: el defecto 2. No pasa.
- largo-1: franja negra vacía en el 21 % inferior. No pasa por la «CAPíTULO».
- largo-2: el haz blanco y la flecha roja no salen del punto de dispersión. No pasa («MOLéCULAS» y el defecto 1).
- largo-3: «×5,8» en magenta, junto al naranja y al rojo, se lee como neón. No pasa («DISPERSIóN»).

## Otros
- **Tildes de Press Start 2P en 5 de 6 fotogramas**: bloqueante para publicar. Arreglo: mayúsculas acentuadas dibujadas en la
  rejilla de 8 px con la tilde por encima, o cambiar la fuente del titular.
- short-3: la escalera de 6 barras no representa «×5,8», y el aspa junto a «ROJO» sugiere que está «mal».
- short-2: «vs 700» → «frente a 700 nm».
- Shorts: la caja de diálogo (x=40) y el resto del contenido (x=64) no están alineados.
- short-1: el titular a y≈265 va justo con la zona segura superior; mejor y ≥ 290.
- Fuente del dato ilegible a 360 px: subir a ~28 px de salida en el short y 26 px en el largo.
- largo-2: el «⁴» queda separado del λ, la fórmula no tiene línea guía y el ojo se lee como una diana.
- largo-3: el «AZUL» elegido en el menú necesita cursor ▶ o caja de selección.
- Pixelify Sans: posibles píxeles irregulares por escalado no entero (por confirmar al 400 %).

## Lo que funciona (conservar)
- Titulares alineados a la izquierda con la palabra clave y la insignia en naranja.
- Reparto de fondos de P7: violeta en contexto e historia, azul-negro en diagramas.
- Caja de diálogo JRPG: lo ya dicho en gris, la palabra actual en blanco y la caja de selección. Se lee a 360 px.
- Etiquetas junto al objeto con línea guía; ninguna en las esquinas.
- Fuente pequeña bajo la cifra (P16).
- Sol nítido con *bloom* sobre fondo desenfocado (P1).
- Cierre del short sin llamada a la acción (P23).

## Veredicto: no pasa
