# Calibración v5 · vuelta 01 (fijos) · 2026-11-09

## Qué pidió Mario
- Pide:
  - más detalle en el píxel;
  - que la información se vea dibujada (diorama animado);
  - MISTA solo en el inicio, en los cambios de tema y en el cierre (el retrato de la caja se queda);
  - más dinamismo: el diorama se mueve y la cámara viaja, con algo nuevo cada 1-2 s.
- Se conservan: la voz, la caja de diálogo y los fondos.
- Densidad: probar 6 y 4 px.
- Arte: propio, más el atlas `Angais/pixel-art-atlas-1.4m` y packs CC0.

## Qué se enseña
- Escena: `motor/calibracion/v5/diorama.{html,js}` + `hd.js`.
- Parámetros: `formato`, `px`, `escena` (`diorama` o `tema`) y `fuente` (`propio` o `atlas`).
- Tramo: fr01 de Mithril («Una sola persona. Once laboratorios. Y una IA de mano derecha.»). fr04 dice que los laboratorios son externos.
- Diorama:
  - delante, en grande, la oficina de la persona: estantería, planta que se mece, flexo, taza con vapor, persona que teclea y parpadea;
  - detrás, la ciudad con los 11 laboratorios, que se encienden uno a uno como ventanas con su laboratorio dentro (matraz con burbujas, pantalla y brazo robótico en movimiento);
  - con «IA», un orbe junto a la persona lanza enlaces con paquetes de datos a cada laboratorio.
- Tema: MISTA a su píxel de siempre (12 px) delante de la ciudad desenfocada, con el titular del tema.

Fijos en `.runtime/v5/fijos/` (1080×1920 y 1920×1080, render del motor). Hojas: `hoja-short.png`, `hoja-largo.png` y `recortes-4px-vs-6px.png`.

| Fijo | sha256 (16) |
|---|---|
| short 4 px · t 2,3 | bb83563733d49b77 |
| short 4 px · t 3,9 | d35db0dd675b1373 |
| short 6 px · t 2,3 | bcd6d4201b5ee1cc |
| short 6 px · t 3,9 | cef50c55aef7dab6 |
| largo 4 px · t 3,9 | 8648957042cb9590 |
| largo 6 px · t 3,9 | a55bd183c91ea6dd |
| tema short · t 1,5 | 5b1ed1ab15223af1 |
| tema largo · t 1,5 | 12053819ed912096 |
| atlas short 4 px · t 3,9 | 62a989f0cc70ade6 |
| atlas short 6 px · t 3,9 | c75f5c60bbee221d |

## Pruebas de fuente de arte
- Propio: todo lo de la escena.
- Atlas: microscopio en la mesa, y ADN y robot encima de la estantería. Son 16×16 a su tamaño de píxel, recoloreados a la paleta (`.runtime/v5/atlas/sprites.js`, fuera de git hasta leer la licencia de Krea §2.3). No caben en las ventanas sin reescalarlos, y eso rompería la rejilla.
- CC0 (Buch, OpenGameArt): descartado sin probarlo en escena. Es vista cenital (suelos y paredes desde arriba) y no encaja en un diorama lateral.

## Evidencia
- `cd motor && npm test`: 4/4 (incluye el lint del contrato en `motor/calibracion/**`).
- Render sin errores.

## Primera versión, descartada antes de enseñarla
- Tres edificios en corte con 11 celdas iguales.
- Se leía como una hoja de cálculo: muchos sujetos pequeños e iguales.

## Pendiente
- Que Mario elija densidad y fuente de arte.
- Después, el clip v5 (~20 s, 9:16 y 16:9) con la cámara que viaja, y la pasada del crítico visual antes de enseñarlo.

## Respuesta de Mario
(pendiente)
