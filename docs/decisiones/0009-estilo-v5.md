# 0009 · Estilo v5: diorama animado a 4 px

- Fecha: 2026-11-09
- Estado: **aceptada**. Calibración aprobada por Mario («Me gusta, sigue»; `reviews/calibracion/iter-v5-02.md`).
- Sustituye en parte: la v3 y la iteración v4 del bloque «Estilo vigente» de `docs/estilo.md`. Los ADR 0005 y 0007 siguen siendo el historial.

## Contexto
A Mario le gustan:
- la voz;
- que MISTA esté;
- la caja de diálogo pixel;
- los fondos.

Pero no le convence cómo se presenta la información (2026-11-09):
- cada idea iba en un tablero de corcho con texto;
- MISTA la señalaba y ocupaba media pantalla;
- el píxel de 12 px dejaba poco detalle.

Pide que la explicación se vea dibujada, con mucho más detalle y más dinamismo, y que MISTA salga poco.

## Decisión
1. **Diorama animado.** Cada idea es una ilustración pixel grande que se mueve para explicarla, con poco texto: rótulo, cifra con fuente y caja de diálogo.
   - Un sujeto grande y con detalle delante; lo contado, en el fondo. Nunca muchas casillas iguales (se leen como una hoja de cálculo).
   - Lo que el crítico marca como «depende del texto» se arregla dibujando el objeto, no añadiendo etiquetas.
2. **Arte a 4 px de salida por píxel** (lienzo de 270×480 o 480×270 unidades; 1 unidad = 1 px CSS). Los iconos, también con contorno y 3 tonos.
3. **MISTA** sale en tres momentos, siempre a su píxel de 12 px (excepción deliberada):
   - en la entrada de tema, entero, con el título;
   - en cada cambio de tema, de pie 1-2 s, con un saltito;
   - en el cierre.

   Fuera de esos momentos no está en escena. El retrato de la caja se queda.
4. **Dinamismo.** El diorama reacciona a la voz y hay algo nuevo cada 1-2 s.
   - La cámara viaja por un mundo ancho con estaciones y paralaje (lejos 0,6 · medio 1 · delante 1,35).
   - Zoom core a escalones hasta ×1,25 (5 px enteros) y salida con corte seco.
   - Entre temas, desplazamiento lateral de 0,4 s.
5. **Efectos.** Se dibujan a la rejilla (`destello5`). Los de pixelfx quedan fuera de la v5, porque tienen detalle más fino que 4 px.
6. **Fuentes de arte.** Dibujo propio por código. El atlas `Angais/pixel-art-atlas-1.4m` (16×16, CC0, generado con Krea) solo vale como atrezo pequeño, y no en un vídeo publicado hasta leer la licencia de Krea §2.3.
7. **Lo que no cambia:** caja de diálogo opaca con retrato, rótulo arriba a la izquierda, fuente junto a la cifra, zona tapada del short, paleta del canal y sin texto rojo pequeño.

## Consecuencias
- Biblioteca nueva en `motor/estilo/v5/`:
  - `dibujo.js`: rampas `R5`, sprites, cajas, persona, orbe, rutas y destello;
  - `escena.js`: entradas a saltos, etiquetas ancladas que se ajustan a la pantalla y a la franja tapada, y caja de diálogo sin huérfanas.
- Ejemplo completo: `motor/calibracion/v5/clip.{html,js}`. Plantillas: `plantillas/proyecto/escenas/{short,largo}/escena-plantilla.html`.
- Cada vídeo cuesta más dibujo, porque cada idea necesita su diorama. Lo reutilizable se sube a la biblioteca, y un catálogo con etiquetas por concepto (`motor/biblioteca/`) está pendiente de decidir con Mario.
- Los vídeos publicados conservan su biblioteca (v2, v3 o `v3/congelado/`). La v5 no se aplica hacia atrás.
- `marca/tokens.json` y el texto v1 de `docs/estilo.md` siguen sin actualizar: Mario no los eligió en la limpieza del 2026-11-09.
