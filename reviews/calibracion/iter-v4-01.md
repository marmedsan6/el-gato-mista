# Iteración v4-01 · detalle de píxel, efectos y cámara de ref-01 · 2026-11-06

- **Origen:** Mario pide más detalle en los píxeles (gato y objetos), pasa el repositorio pixelfx (MIT) y quiere replicar la cámara de ref-01, que no se había conseguido ni en los shorts ni en los largos.
- **MISTA:** se probaron 4 diseños nuevos a 64×64 y 6 px; ninguno convenció. Decisión de Mario: «MISTA tal cual; detalle al resto». La mezcla se guarda en `motor/calibracion/v4/gato/` para un rediseño futuro.
- **Análisis de cámara:** `docs/estilo/analisis/ref-01-camara.md`.

## Qué se enseña
- **Clip de 19,9 s:** `.runtime/calibracion/v4/clip2/clip-v4.mp4`, con la escena en `motor/calibracion/v4/clip.{html,js}`. Es el bloque A real de Mithril (0-19,9 s), con su voz, música y 5 efectos de sonido.
- **Mundo:** laboratorio de 3 pantallas de ancho con una estación por idea:
  - corcho con «1 persona · 11 laboratorios · + IA»;
  - ficha de Mithril;
  - microscopio y gen LAMA2.
- **Cámara:** `CAM.aplicarCapas`, nuevo en `motor/estilo/camara.js`.
  - Paralaje por capas: fondo a 0,6, plano medio a 1 y primer plano a 1,35, con estanterías desenfocadas que solo cruzan en los travellings.
  - Acercamiento lento y travelling entre estaciones.
  - Zoom core a ×1,25 en la ficha.
  - «Revelar»: travelling y alejamiento a la vez.
  - MISTA se queda en la primera estación y reaparece en la tercera.
- **Efectos:**
  - carga de energía de pixelfx en la pata de MISTA cuando la voz dice «IA» (`motor/estilo/v3/fx.js`, hojas generadas con `node motor/fx-exportar.mjs`);
  - escaneo dibujado a 12 px sobre el microscopio en «LAMA2». El escáner de pixelfx se descartó: pinta una silueta humana y un «40 %» que se leía como un dato sin fuente.
- **Objetos con más detalle** (`motor/estilo/v3/props.js`, mismas firmas, detalle a media unidad, 6 px):
  - matraz: reflejo, menisco y fondo oscuro;
  - microscopio: rueda, destello y metal más claro;
  - bote: etiqueta;
  - tarjeta: fibra y esquina doblada;
  - pantalla: barrido, reflejo y piloto;
  - caja: textura del cartón.

## Evidencia
- `cd motor && npm test`: 4/4 (lint del contrato, incluido `motor/calibracion/`, y determinismo).
- v5 idéntica tras el cambio de `camara.js`: 8/8 fotogramas iguales al píxel. La v6 cambia a propósito, porque usa los objetos nuevos; no está publicada.
- Audio: -14,0 LUFS y -2,5 dBTP. Sin silencios, congelados ni negros (ffmpeg).
- **Crítico visual:**
  - pasada 1: no pasa (escáner con cifra sin fuente; zoom que cortaba la ficha);
  - pasada 2: pasa.
- **Pendiente del crítico, no bloqueante:**
  - el rótulo de cabecera roza el marco del corcho en los acercamientos;
  - la carga de pixelfx tiene chispas y anillo finos, por debajo de 12 px;
  - el microscopio a 1× se lee mal a 360×640;
  - asoma un «FUE» suelto en t=12,9.

## Aprobación
- 2026-11-06 · Mario: «Me gusta, sigue». Calibración v4 aprobada; sus reglas pasan al bloque «Estilo vigente» de `docs/estilo.md`.
- Tras la aprobación se pulió lo que el crítico dejó pendiente, sin bloquear:
  - tableros 2 unidades por debajo del rótulo;
  - solo las cartelas de fuente quedan por encima del primer plano (fuera el «FUE» suelto);
  - microscopio con el tubo legible y el ocular con brillo;
  - cartela de la estación 3 sin tocar a MISTA.
  - Versión final: `.runtime/calibracion/v4/clip3/clip-v4.mp4`.

## Me gustó (se conserva)
- Todo lo enseñado («Me gusta»).

## No me gustó
- Nada señalado.

## Cambia exactamente (qué · dónde · cómo)
- Nada pedido: «sigue».
