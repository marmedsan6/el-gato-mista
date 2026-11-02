# Guía de estilo · alien-isolation-ia

- Estilo base: estilo v2 con los cambios del 2026-10-31 (docs/estilo.md, bloque «Estilo vigente»).
- Desviaciones de este vídeo (solo lo que cambia):

## Más oscuro, igual de vivo (Mario, 2026-11-02)
- Fondos de los escenarios casi negros (bandas por debajo de los de `servidores`), sobre `fondo` (#0c1016).
- Luz de ambiente con tres fuentes: luces de emergencia en `acento_rojo` que laten a escalones lentos (nunca parpadeo rápido), el verde del detector en `acento_verde` y el haz cálido de la linterna. Sigue habiendo 3-4 acentos por escena y el rojo nunca va en texto pequeño.
- Cada escenario mantiene 3-4 cosas siempre en movimiento: vapor, polvo en el haz, cables que se balancean, lluvia o granizo, relámpagos lejanos, el barrido del detector.
- MISTA conserva sus colores cálidos y, con el *bloom* del haz, es lo más luminoso del plano para no perderse en lo oscuro.

## Escenarios nuevos (en `motor/estilo/escenarios.js`)
- `pasillo`: corredor de la estación con tuberías, taquillas, rejilla de conducto en el techo y luz de emergencia.
- `control`: sala del director con una consola grande, el mapa de la estación y monitores CRT (los clips se ven en uno de ellos).
- `colonia`: exterior de Kurosaki en tormenta, con torres mineras, lluvia y granizo en diagonal, y relámpagos lejanos a escalones.

## Objetos y poses nuevos
- **Alien** (sprite detallado, a ×2 como los objetos): cabeza alargada con reflejo, dientes, tubos dorsales y cola. Poses: andar, olfatear, asomarse, abrir la taquilla, entrar en la rejilla, sisear y huir del fuego. Dibujo propio en pixel art, no calcado de capturas.
- **Objetos:** taquilla con puerta que se abre, detector de movimiento con barrido y puntos, medidor de amenaza, árbol de decisiones con candados (reutiliza `propCandado`), consola con el mapa, brazo mecánico, revólver, lanzallamas, claqueta, micrófono y perro.
- **MISTA:** se añaden las poses «asustado» (orejas atrás, pelo erizado y temblor de 1 px a escalones) y «escondido» (asomado por la rendija de la taquilla). Son añadidos en `motor/estilo/gato.js`: las poses de antes no cambian.

## Clips oficiales
- Se ven dentro de un monitor CRT del escenario, nunca a pantalla completa, con el crédito «IMAGEN: SEGA / CREATIVE ASSEMBLY» junto al monitor.
- Duran 2-4 s cada uno, unos 20 s en total en el largo. Llevan el crédito y su URL en la descripción.
- El audio de c5 va en inglés, con la traducción en el rótulo.

## Especulación
- Bloque 12 del largo y B6 del short B: marco con el rótulo fijo «ESPECULACIÓN DE MISTA» durante todo el tramo, en `acento_dorado`, para que no se confunda con lo que dijo el estudio.

## Implementación (2026-11-02)
- `motor/estilo/escenarios.js`: `pasillo`, `control` y `colonia`.
- `motor/estilo/alien.js` (nuevo): `alien(svg, x, y, { pose, t, espejo }, 2)`, con las poses andar, quieto, agachado, sisear y huir. Caja de 66×64 de sprite, con los pies siempre en y = 62.
- `motor/estilo/props.js`: `propTaquilla` y `propDetector`. `motor/estilo/gato.js`: pose «asustado», con temblor de 1 px, pelo erizado y patas encogidas.
- Muestras para aprobar: `escenas/muestras/` (render en `.runtime/muestras/alien-isolation-ia/`).
