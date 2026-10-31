# 0007 · Estilo v2

- Fecha: 2026-10-30
- Estado: **aceptada** (fotogramas aprobados por Mario el 2026-10-30; short v3 con este estilo publicado por su orden el 2026-10-31)
- Sustituye en parte: ADR 0005 (estilo v1)

## Contexto
Mario revisó el primer short (v1, `proyectos/mithril-ia-medicina/reviews/iter-01.md`). Le gusta como primer vídeo y quiere
seguir iterando:
- **Se conserva:** el cambio de planos con destello, las palabras recalcadas con sonido y la caja de diálogo de videojuego pixel.
- **Pide más:** un vídeo más vívido, con más pixel art y color, con el gato para explicar, y con objetos que rodeen la
  explicación e interactúen con ella.

## Decisión (propuesta)
Sobre el estilo v1 cambia lo siguiente; el resto se mantiene.
1. **Gato narrador «MISTA»** (deja sin efecto P5): gato **atigrado naranja** según el boceto de Mario (rayas y «M» en la
   frente, crema en pecho, hocico, patas y punta de la cola, ojos ámbar verdosos con pupila vertical), sprite de ~32×32 base, en escena.
   - **Animación:** poses (de pie, señalar, pensar, sorpresa, celebrar, tocar), parpadeo, boca sincronizada con las palabras
     alineadas y cola en bucle, todo a saltos.
   - **Voz:** es la suya (Gemini «Orus»).
   - **Caja de diálogo:** lleva su retrato y la etiqueta «MISTA» en naranja.
2. **Escenarios pixel ilustrados** por bloque, como ref-01 (laboratorio, sala de servidores, ciudad de noche, despacho…).
   - **Color:** fondos con color y profundidad (capas, desenfoque lejano y *bloom* en luces).
3. **Paleta ampliada:** 3-4 acentos por escena, con roles fijos para los datos (azul = dato, rojo = no/error, verde = sí/correcto).
   - **Lo que sigue prohibido:** neón chillón y degradados arcoíris (P24).
4. **Props temáticos que reaccionan:** objetos del tema que rodean la explicación y responden cuando el gato los señala o toca,
   o cuando se dice la palabra (se encienden, saltan, burbujean, corren).
5. **Sonido:** «blip» de selección propio en cada palabra clave que entra en la caja de selección.

## Consecuencias
- Nueva vuelta de calibración (C5a v2: fotogramas fijos con gato y escenario; C5b v2: clip) con crítica Opus antes de
  enseñarla. Si Mario la aprueba, `docs/estilo.md` y `marca/tokens.json` pasan a v2 y este ADR a «aceptada».
- Producir cada vídeo cuesta más (sprites y escenarios). Se crea una biblioteca reutilizable en `motor/estilo/` (gato,
  escenarios, props) para no dibujar desde cero cada vez.
- La regla de máx. 2 acentos queda sustituida por 3-4 con roles fijos. La crítica la sigue vigilando.
