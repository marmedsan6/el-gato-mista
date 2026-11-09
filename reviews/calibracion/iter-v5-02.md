# Calibración v5 · vuelta 02 (clip) · 2026-11-09

## Qué eligió Mario en la vuelta 01
- 4 px («4 px»).

## Qué se enseña
- Escena: `motor/calibracion/v5/clip.{html,js}` + `hd.js`, con `?formato=short|largo`.
- Tramo: real de Mithril, fr01-fr03, 19,9 s, con su voz.
- Mundo: de dos pantallas (oficina con la ciudad · laboratorio por dentro), con paralaje (lejos 0,6 · medio 1 · delante 1,35).

| Segundo | Qué pasa |
|---|---|
| 0-0,84 | Entrada de tema con MISTA (12 px) y «Mithril Medicine» |
| 0,84-1,24 | Desplazamiento lateral a la oficina |
| 1,6-2,2 | Se encienden los 11 laboratorios. Aparece la cifra con su fuente |
| 3,0 | El orbe de la IA, con su destello a la rejilla. Los enlaces crecen hasta cada laboratorio |
| 4,6 | Zoom a la oficina (×1,25) |
| 5,0 | Placa «C. Tranbarger» |
| 6,0 | Logotipo y rótulo de Mithril |
| 7,3 | Holograma: ADN |
| 8,5 | «Empleados: 1», con su fuente |
| 9,4 | Holograma: búsqueda de tratamientos |
| 10,6 | Holograma: dos fichas con un brazo |
| 12,15 | Corte seco |
| 12,25 | Un paquete sale y la cámara lo sigue hasta el laboratorio; las farolas cruzan delante |
| 13,35 | MISTA aparece de pie con un saltito |
| 14,1 | LAMA2 marcado en el ADN de la pantalla |
| 14,6 | Zoom a la pantalla (×1,25 en el short y en el largo) |
| 15,0 | Brazo que pierde el bíceps y medidor que cae |
| 17,0 | «Forma grave» |
| 17,7 | Línea de tiempo con la cuna |
| 18,9 | «Primeros meses» |

Sonido:
- 8 efectos atados a la pantalla, a -24 dB;
- música «Morning Coffee» a -14 dB;
- voz del tramo de Mithril.

## Evidencia
| Máster | Duración | Sonoridad | Pico | Congelados (2 s) | sha256 (16) |
|---|---|---|---|---|---|
| `.runtime/v5/clip/clip-v5-short.mp4` (1080×1920, 60 fps) | 19,9 s | -14,0 LUFS | -2,5 dBFS | 0 | 26ed0cdffe2e0011 |
| `.runtime/v5/clip/clip-v5-largo.mp4` (1920×1080, 60 fps) | 19,9 s | -14,0 LUFS | -2,5 dBFS | 0 | e1ffd19970023ec3 |

- `cd motor && npm test`: 4/4.
- `node motor/revisar.mjs` recorre el clip cada 0,25 s: 0 errores.
- Crítico visual:
  - vuelta 1: no pasa, 3 bloqueantes (`critica-v5-01.md`);
  - vuelta 2: los 3 resueltos, queda 1 bloqueante, la fuente de «Empleados: 1» (`critica-v5-02.md`);
  - vuelta 3: corregido. El crítico indicó que no hacía falta otra pasada completa.

## Lo que no se ha resuelto
- El cable de la IA pasa por encima de algunas ventanas en el largo.
- Bajo los zooms de la oficina queda una franja oscura.
- El bebé de la cuna es una mancha de color piel.
- En los zooms, el píxel crece a 5 px. El detalle fino de 4 px solo se ve en los planos generales.

## Respuesta de Mario
2026-11-09 · «Me gusta, sigue». La calibración v5 queda aprobada y pasa a estilo vigente (ADR 0009).
