# Iteración 04 · short v4 (prueba de cámara dinámica) · 2026-11-03

- Qué se enseña: el short v3 publicado (`salida/short-v3.mp4`).
- Petición de Mario: vídeos más dinámicos, con dos cambios:
  - que el gato desaparezca a veces;
  - que el vídeo haga zoom o cambie de plano para mostrar la explicación cuando convenga.
- Qué es la v4: una **versión interna de prueba**, que no se republica. Sirve de referencia para los próximos vídeos. Respuesta de Mario: «Mithril v4 de prueba».

## Me gustó (se conserva)
- Todo lo de la v3: desplazamiento lateral, efectos atados a la pantalla a -18 dB y fondos vivos.

## No me gustó
- Le falta dinamismo: un único plano general fijo por escenario, con MISTA siempre en pantalla.

## Cambia exactamente (qué · dónde · cómo)
- **Cámara** (`escenas/short-v4/short.js`, lista `PLANOS`). Respuesta de Mario: «Mezcla zoom + corte».
  - Hay un **plano general** (×1) y **planos de detalle** hacia el objeto que se explica.
  - Al plano de detalle se llega con **zoom a escalones** (×0,25 cada 0,075 s) o con **corte seco** en los datos más fuertes: el contador de meses, la fecha y la pregunta final.
  - El zoom es siempre múltiplo de ×0,25: a ×4 de salida, cada píxel base mide 5, 6, 7 u 8 px enteros, así que el pixel art sigue nítido.
  - El punto que se explica queda en (135, 180) base: por encima de la caja de diálogo y fuera de las zonas que tapa la interfaz de Shorts.
  - Los rótulos de cabecera y la caja de diálogo son interfaz: no se mueven con la cámara.
- **MISTA:** solo aparece en el plano general; en los planos de detalle queda fuera de cuadro. Su voz y su retrato siguen en la caja de diálogo. Al volver al plano general reaparece con un saltito. Respuesta de Mario: «En los planos de detalle».
- **Ritmo:** 20 cambios de plano en 58 s, uno cada ~3-5 s. Respuesta de Mario: «Cambio cada 4-6 s».
  - Siempre se vuelve al plano general antes de cada desplazamiento entre bloques.
  - El plano general se mantiene en los gags de MISTA: toca las cajas, celebra «comprado» y mira la jaula al final.
