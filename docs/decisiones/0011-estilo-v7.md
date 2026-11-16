# 0011 · Estilo v7: arte generado con Codex

- Fecha: 2026-11-15
- Estado: **aceptada**. Plan de integración aprobado por Mario el 2026-11-15; set de referencia aprobado el mismo día
  (`reviews/calibracion/set-v7-01.md`); calibración aprobada el 2026-11-16 («Aprobado»; `reviews/calibracion/iter-v7-01.md`):
  short A de `ia-pasa-factura` entero y clip en 16:9, internos, tras dos vueltas de crítico (`critica-v7-01.md`, `-02.md`).
- Sustituye en parte: ADR 0010 (v6) en la regla «Fuentes de arte: dibujo propio por código». Todo lo demás de la v6
  (diorama a 4 px, casi sin texto, fuente en la caja, cámara, lint obligatorio) no cambia.

## Contexto
- Las piezas v6 son cajas: el crítico las da por flojas como sujetos (personas de 2-3 px a 360, tienda sin detalle).
- Investigación del 2026-11-14 (`docs/investigacion/herramientas-pixel-2026-11-14/informe.md`): ni biblioteca ajena (impone
  su vista y su píxel; se abandonó el 2026-11-13) ni generador de pago. `codex exec` genera una hoja de sprites en ~1 min
  dentro de la suscripción y un conversor la deja en rejilla exacta y en la paleta `R5`, que pinta `sprite5`.
- Piloto del mismo día (`piloto.md`): los 26 primeros segundos del short A con tienda y personas de Codex. El crítico lo da
  por **mejor base que la v6 para los sujetos**, con tres condiciones: todo el vídeo generado o nada (se nota la mezcla),
  cuidar lo pequeño a 360 px y cambiar esta regla con un ADR. PixelLab se probó y Mario lo descartó (2026-11-15).
- Coste medido: 6 imágenes, menos del 1-2 % de una semana del plan Plus de Codex. Sin dinero extra.

## Decisión (Mario, 2026-11-15)
1. **Versión nueva, v7.** Un vídeo es v6 (todo por código) o v7 (todo generado): nunca mezcla.
2. **Todo lo que tenga silueta sale de Codex:** edificios, personas, objetos, muebles, vehículos, robots, marcos de
   interfaz y partes fijas de los mecanismos. El código solo mueve, ilumina, tiñe por paleta (estados, camisas), pinta
   cielo y suelo, las placas (`placa6`) y las partes que se mueven por dentro, escritas como rejilla de letras con la
   paleta del canal. MISTA (sprite v3) y la caja de diálogo no cambian.
3. **Escala fija** en píxeles de arte (`motor/piezas/escala.json`): persona de pie 28, persona sujeto 44-48, hueco de puerta
   35, tienda de una planta 67, farola 70… El conversor fuerza la altura de cada pieza (Codex no la mantiene entre hojas).
4. **Set de referencia** (10-20 piezas aprobadas por Mario) que se pasa siempre a Codex como referencia de estilo y escala.
5. **Puerta de estilo:** el agente filtra y regenera tanda a tanda; Mario aprueba **una hoja por vídeo** con todas sus
   piezas antes de escribir las escenas (`proyectos/<slug>/reviews/piezas.md`).
6. **Lo pequeño:** signos y objetos de mano de 10 píxeles de arte o más, con contorno, claros y sobre superficie lisa u
   oscura, nunca sobre rayas o textura.

## Consecuencias
- Herramientas en `motor/piezas/` (fuera de `motor/calibracion/`, que `npm test` trata como escenas): `convertir.py`
  (con `--alto`), `generar.mjs` (petición → `codex exec` → conversión → hoja de contactos), `montar.mjs` (piezas del vídeo
  → `escenas/comun/piezas.js` y hoja para la puerta de estilo), `promover.mjs` (al set) y `hoja.py`.
- Biblioteca `motor/estilo/v7/` (`generado.js`, `short-motor.js` y el set en `set/`) sobre la v6 y la v5, que no se tocan.
- Cada vídeo lleva **copia** de sus piezas (también las del set) en `escenas/comun/piezas.js`: el set puede crecer sin
  alterar lo publicado. `npm test` compara las huellas de todo lo publicado, ahora también los dos vídeos en v6.
- Solo se envía a Codex arte propio (piezas del set, fotogramas de nuestros vídeos), nunca material de terceros.
- El «v7» de la prueba con packs de Kenney del 2026-11-13 (`docs/investigacion/biblioteca-pixel-2026-11-13/prueba-v7.md`)
  era otra cosa y se abandonó: no tiene que ver con esta versión.
- Lo que siga siendo código y tenga forma (tuberías, flechas) lleva el mismo tratamiento que una pieza: contorno, 3 tonos
  de `R5` y luz arriba a la izquierda (crítico, vuelta 02). Si no, se nota la otra mano.
- Codex no respeta la escala en piezas compuestas (la puerta de un edificio alto, un portal): el conversor fuerza la
  altura total, no la de sus partes. Se revisa en la puerta de estilo y, si choca, se recompone la escena (nadie entra por
  una puerta fuera de escala).
- Coste medido en la calibración: un short entero (21 piezas nuevas y 5 repuestos) movió el contador semanal de Codex
  un 1 %.
- Lo que no arregla: las vueltas de crítica por dirección de escena (zooms, solapes, tramos quietos), que no dependen
  del dibujo.
