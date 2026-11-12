# Crítica de comprobación · shorts A, B y C v2 · 2026-11-12
Subagente `critico-visual` (Opus) sobre `salida/short-{a,b,c}-v2.mp4` (9 hojas y 15 fotogramas sueltos de
`.runtime/qa/como-google-sabe-lo-que-quieres-short-{a,b,c}-v2/`). Resumen de su informe y lo que se hizo.

## Arreglos de v1 confirmados
- A: la cifra viaja con el zoom y ya no pisa la placa; placa bajo la mesa; «apps»; «0 audio» a la izquierda del micrófono;
  placa GOOGLE separada del rótulo; el móvil no pisa los bocadillos; el robot del cierre se mueve.
- B: «IP» legible; idioma con «ABC», sin ondas; un solo calendario fuera del toldo; «80 ms a 1 s»; cursor en el cierre.
- C: panel separado del rótulo con cursor por dato; miniaturas que bajan por el cable; canal tachado en gris; cursor en el cierre.

## Lo nuevo que marcó y qué se hizo (v3)
- A [17,5-20,9] Al final del zoom la cifra quedaba a ~2 px (lienzo 270) bajo el rótulo y se leía con él. **Arreglado:** la cifra
  baja 10 unidades en el mundo (y = 136) y el carril del dedo baja a 164.
- B [26,5-30,0] Marcó como **bloqueante** el calendario «dentro de la franja derecha». Medido en el lienzo de 270×480 (el crítico
  usó la zona de 270 sobre coordenadas de 360×640), ocupaba x 204-238 e y 178-218: rozaba la franja 1-2 px. No bloqueaba, pero
  **se movió** a la pared de la izquierda, sobre el toldo y bajo «540 días» (x 110-144, y 126-166).
- B [27-30] «DíAS» con la Í de Press Start 2P: ahora pasa por `tildesPixel` como el resto de textos en píxel (también en el largo).
- C [15-23,6] y [45,8-51,2] Miniaturas y cursor «en la franja derecha»: medidos en 270×480 quedan en x ≤ 218, fuera de la franja.
  Sin cambios.
- Pendientes de v1 que se dejaron fuera a propósito: ficha de B sin rejilla, iconos grandes del panel de C, etiqueta de la tienda
  con trayecto, móvil como origen en el micrófono de A, salida del zoom de A por corte, «LA PUJA» sobre la estación ICO.

## Veredicto tras v3
A y B se rehacen en v3 (lint estricto 0 errores); C se queda en v2 (sin cambios visuales). Sin bloqueantes.
