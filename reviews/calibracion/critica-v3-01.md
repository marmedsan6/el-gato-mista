# Crítica · calibración v3, clip de 15,4 s · 2026-11-03

Crítico visual (Opus) sobre 8 fotogramas a 1080×1920 y 360×640, la hoja de contactos, la hoja de MISTA v3 y dos fotogramas de
ref-01. Veredicto de la primera pasada: **no pasa** (2 bloqueantes). Todo corregido y comprobado en 8 fotogramas antes de enseñarlo a Mario.

## Lo que funciona (conservar)
- La profundidad va bien encaminada: pared y suelo delantero desenfocados, plano medio nítido, cono de luz. Se lee como la galería de la referencia.
- MISTA v3 se reconoce bien y sus 6 poses se distinguen a 360×640.
- Todo se lee a 360×640.
- Las etiquetas de fuente no crecen con el zoom.
- Ritmo sin tramos estáticos; el travelling con MISTA saliendo de cuadro y volviendo se entiende.
- Los marcos dorados están bien sombreados.

## Defectos y qué se hizo
1. **BLOQUEANTE · El acercamiento lento metía a MISTA detrás de la caja y la cola salía por la izquierda.**
   - Arreglo: el acercamiento se ancla al suelo (cy=195) y MISTA se desplaza 3 unidades a la derecha.
2. **BLOQUEANTE · El rótulo quedaba pegado al marco del cuadro.**
   - Arreglo: cuadros más bajos (30 unidades en lugar de 40; les sobraba lienzo) y más abajo (y=38), con aire bajo el rótulo. El zoom core se ancla para que el marco no suba.
3. **La salida del zoom no era un corte seco y el rótulo cambiaba antes de tiempo.**
   - Arreglo: corte seco al plano general al acabar «por pares»; después, el travelling. El rótulo cambia a mitad del desplazamiento.

## Otros, también arreglados
- El retrato de la caja va a 6 px por píxel exactos (la mitad de 12).
- Las cartelas de fuente tienen ancho fijo y van alineadas al borde derecho de su cuadro.
- La pata de «pensar» se perfila en tono medio, no en negro, y ya no parece una correa.
- La sombra de MISTA es una mancha centrada de 2 tonos.
- La pared es más clara, con zócalo de paneles y moldura. Los conos de luz bajan hasta el suelo, con charco de luz.
- Hay cordón rojo entre los postes del primer plano.
- Bajo la caja, en los zooms, se ve el color del suelo.

## Pendiente de Mario
- **MISTA más grande y con más filas** (la referencia ocupa ~25 % del alto; MISTA, ~20 %). Exige redibujarlo.
- **Texto del mundo:** va a 4 px por píxel, y a 6 px en el zoom. La referencia también mezcla escalas en el texto.
- **Acercamiento lento:** comprobar en movimiento si se nota el «baile» de los píxeles de 12 a 13 px.
