# Crítica · short interno v4 nvidia-huang-espionaje (estilo v6), primera vuelta · 2026-11-10

Subagente `critico-visual` (Opus) sobre `.runtime/qa/nvidia-huang-espionaje-short-v4/` (primer render de la v4: 3 hojas,
13 tiras de movimiento, último instante de las 12 frases y 12 instantes más). Guardada por el orquestador. La misma
pasada juzgó el clip v6 en 16:9: su parte está en `reviews/calibracion/critica-v6-01.md`.

## 3 peores defectos
1. **[t=54,0-67,5] La estación «OJO» sigue siendo una tarjeta de texto.** El panel «NVIDIA ¿CONFIRMA?» → «NO CONFIRMA»
   copia la voz (regla 1 de la v6) y, con el sello «MATIZ» y «CHINA», hay 5 textos a la vez. El sello es texto rojo
   pequeño. El panel viaja vacío en los dos desplazamientos. El bocadillo de China es un «…» que no cuenta nada.
   - Arreglo: quitar el panel y el sello; contar fr09-fr11 con dibujo; único texto, el rótulo. **BLOQUEANTE: sí.**
2. **[t=24,5-29,8 y 33,0-37,9] Los acercamientos cortan lo que explican.** En Megaspeed, la torre derecha toca el borde
   y la fachada se sale por la izquierda; en el objetivo, el plano del chip llega al borde. No bloquea.
3. **[t≈8,5-12,9, 24,5-28 y 66-71] Tramos de 3-4 s sin nada nuevo** (frontera, Megaspeed antes de las cajas y cierre).
   No bloquea.

## Otros
- Alice Huang sigue siendo una silueta oscura; su identificador tenía 2 líneas y 4 palabras.
- Jensen Huang sigue diminuto; la rotativa se lee como un magnetófono; el despacho del correo no tiene a nadie.
- En fr01 el marco de la palabra clave separa «jefe» de su «?».
- El diorama ocupa un tercio de la altura: el sujeto podría crecer hacia arriba.
- La pestaña de fuente termina en el 78,6 % de la altura: dentro de la zona segura, con poco margen.

## Lo que funciona
Las placas dentro del dibujo (NVIDIA, CHINA, MEGASPEED, NEW YORK TIMES) se leen a 360 px y se entienden como parte del
objeto. La pestaña «Fuente:» está en las 12 frases y no molesta. Los rótulos cambian al llegar y la cámara sale después
de la frase. El gancho dura 2,4 s. Desaparecen los bloques de etiquetas y el «NVIDIA INVESTIGA CHINA».

## Frente a la v3 (`critica-03.md`)
- Defecto 1 (MATIZ): resuelto a medias. Defecto 2 (etiquetas como segundo subtítulo): resuelto, salvo el panel.
  Defecto 3 (cámara y rótulo): resuelto en rótulo y gancho; los zooms seguían cortando.
- Igual: Alice casi invisible, Jensen pequeño, cierre con poco movimiento.
- Peor: con menos etiquetas se ven más los tramos quietos y los dibujos que no se explican solos (fr03, fr05).

## Veredicto: no pasa
Bloquea solo el defecto 1. Lo aplicado está en `iter-03.md`; la segunda vuelta, en `critica-05.md`.
