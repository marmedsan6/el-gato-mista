# Crítica · calibración v7 (short A 9:16 + clip 16:9) · 2026-11-15 · vuelta 01

`critico-visual` (Opus) sobre las hojas a 2 fps y los `_360` de `.runtime/qa/ia-pasa-factura-short-a-v7-v8/`, el publicado
(`…-short-a-v4/`), el clip (`…-clip-v7-v9/`) y la hoja de piezas. 17 imágenes abiertas.

## 3 peores defectos
1. **[46,8-47,9 · fr09 · la estantería]** Los bocadillos salen ~1 s antes del travelling, flotan a media pared lejos de las
   cabezas y el «!» verde es una mancha a 360. Sin ellos la estación son ~5 s quietos. Rompe la permanencia (2 s) y la idea
   «la IA aprende de lo que la gente pregunta y contesta» depende de la caja. Arreglo: desde «La IA aprende» (~43,5 s), un
   bocadillo pegado a cada cabeza, alternando «?» y «!», que vuelen hacia el robot; «!» con fondo claro y signo oscuro.
   **BLOQUEANTE: sí.**
2. **[28,5-42,5 · fr07 · Reddit]** El despacho es una pegatina (sobresale de la silueta, 4 plantas, persona a escala de calle);
   la puerta del foro mide ~15 frente a 35 de la escala; la tubería por código es plana, sin contorno ni sombreado, y su
   adelgazamiento no se ve a 360. Arreglo: foro con el despacho dentro de la silueta y puerta de ~35; tubería con contorno,
   3 tonos de `R5` y luz arriba a la izquierda, de 8 a 2 px, con paquetes cada vez más espaciados. **No bloquea** la
   calibración, pero hay que arreglarlo antes de aceptar la v7.
3. **[clip 16:9 · 12,7-17 s]** No aparece el «15 %»; el «8 %» flota en el centro del cielo sin anclarse a su calle. Arreglo:
   «15 %» sobre la calle izquierda y «8 %»/«1 %» sobre la derecha, pegadas a su tienda o al cartel. **No bloquea.**

## Otros
- Stack Overflow: la fila de mesas de arriba flota sobre la pared; la pantalla del foro es papilla a 360; el calendario se
  pega a la placa; ~9 s con poco cambio (los sentados son pequeños y oscuros).
- Bucle: las flechas son de código y se notan; la flecha de subida oscura casi no se ve; los libros son una mancha; las dos
  personas oscuras se pierden contra la ciudad.
- Puerta: el portal (~3,5 personas) rompe la escala, aunque se lee como metáfora; el globo flota sin anclaje.
- Lo pequeño: los «?» se leen; el portapapeles del observador es una mancha de 3-4 px (lo salva «PEW»); el botón del cartel vale.
- Presupuesto de texto heredado de la v6 (igual que el publicado): placas que se apilan con el rótulo.
- Zona segura: en el zoom, la tienda de abajo llega a x ≈ 259 (límite 237).
- Ruido de conversión: no se ven píxeles sueltos ni escalados no enteros.

## Conservar
Personas con silueta y paso (por fin sujetos); la tienda y su apagado por paleta; puerta con candado y teclado; mesas que
se vacían; el cierre con el robot; las dos calles lado a lado en 16:9; la escala persona 28 / tienda 67. Por código, solo
cielo, suelo y paredes lisas: la tubería y las flechas, o se generan, o llevan contorno y 3 tonos.

## Veredicto
**No pasa** (pasaría con el defecto 1 arreglado y la tubería y el despacho rehechos). **Como base del canal, la v7 es mejor
que la v6**: los sujetos se reconocen sin texto. Riesgos nuevos: lo que queda por código se nota, y la escala se rompe
dentro de las composiciones. En 16:9, al nivel del short en dibujo y por debajo en dirección (sujetos pequeños en el plano
general, falta el 15 %).
