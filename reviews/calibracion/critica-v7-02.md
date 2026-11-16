# Crítica · calibración v7 · vuelta 02 · 2026-11-15

`critico-visual` (Opus) sobre `.runtime/qa/ia-pasa-factura-short-a-v7-v10/` y `…-clip-v7-v11/` (10 imágenes).

## Defectos de la vuelta 01
1. Estantería: **resuelto** (un bocadillo por cabeza ~3 s antes de volar al robot; el «!» se lee a 360; se entiende sin leer).
2. Reddit: **resuelto en lo principal** (sin pegatina; la tubería adelgaza a la vista y ya no desentona; el peatón espera en la
   esquina). La puerta del foro sigue fuera de escala. La ventana dorada no se distingue a 360; el «!» sí.
3. Clip 16:9: **resuelto** (15 % a la izquierda, 8 % y 1 % a la derecha; zoom entre las dos calles).

## 3 peores defectos
1. **[13,0-24,3 · fr04, zoom de las dos calles]** El nuevo encuadre corta la placa «PEW» y medio observador por la izquierda.
   **BLOQUEANTE: sí.** → *Arreglado después*: observador y placa 10 px hacia dentro (comprobado en la captura de 19 s).
2. **[57,8-63,0 · fr11, bucle]** Las flechas de código, planas; los libros, mancha; las dos personas oscuras se pierden. No
   bloquea. → *Arreglado después*: flechas con contorno, dos tonos y luz. Libros y personas, sin tocar.
3. **[48-57,5 · fr10, Stack Overflow]** La pantalla del foro es papilla verde y naranja a 360: la sala se lee como oficina. No
   bloquea. Sin tocar (propuesta: monitor de 40 px o más con filas de bocadillos «?»/«!»).

## Otros
Paquetes de la tubería en 4 colores parecen confeti (→ *arreglado*: azul y dorado). El «?» de Reddit y el globo flotan sin
anclaje. La puerta del foro y el portal, fuera de `escala.json`: falta un vigilante de escala para las piezas compuestas.

## Veredicto
**No pasa solo por el bloqueante 1; corregido, pasa.** Los defectos 2 y 3 se pueden arreglar sin otra vuelta. La v7 sigue
siendo **mejor base que la v6, con más margen** que en la vuelta 01. Conservar: «todo lo que tenga silueta se genera»; el
tratamiento de la tubería (contorno, 3 tonos, luz arriba a la izquierda) como norma para lo que siga siendo código; los
bocadillos de 10 px o más con fondo claro; persona de 28; las dos calles en paralelo en 16:9.
