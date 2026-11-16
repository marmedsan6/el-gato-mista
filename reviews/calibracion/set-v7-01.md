# Set de referencia v7 · 2026-11-15

Primera puerta del plan de integración del arte generado (ADR 0011, en propuesta).

## Qué se aprueba
- **Set:** 18 piezas en `motor/estilo/v7/set/` (`set.json`, `catalogo.md`, `contactos.png`), de la fuente
  `motor/estilo/v7/set/fuente/`: 5 del piloto reconvertidas (tienda, paseante quieto y a mitad de paso, tendero,
  observador con portapapeles marrón) y 13 nuevas de Codex en 5 tandas.
- **Observador:** el de portapapeles blanco grande (`observador`); el del piloto queda como `observador-piloto`.
- **Escala:** `motor/piezas/escala.json` (persona de pie 28, sentada 24, persona sujeto 44-48, robot 34, hueco de puerta
  35, tienda 67, edificio 60-200, vehículo 30-50, objeto de mano 10 como mínimo).
- **Referencia para Codex:** `motor/piezas/referencia/estilo.png` y `escala.png` con quieto, robot, tienda, sede, rack y
  ventana.

## Decisión de Mario
**Aprobado** tal cual («Aprobado tal cual»), con observador2 como observador y la escala «Sí, así» (en el chat, 2026-11-15).

## Cómo se hizo (evidencia)
| Qué | Resultado |
|---|---|
| Prueba de referencia (tanda 01, misma petición) | Fotogramas del vídeo: píxel 16,0-18,6, 40.511 tokens, robot blanquecino. Hoja de piezas sobre magenta: píxel 16,7-17,5, 13.925 tokens, colores del set. Gana la hoja |
| Llamadas a Codex | 6 (01 ×2, 02, 03, 04, 05), 47-67 s cada una, 13.616-40.511 tokens; registro en `.runtime/piezas/set/registro.jsonl` |
| Arreglos sin regenerar | Centro de datos y camión: tonos cálidos sueltos pasados a hormigón por `igualar` en `fuente/meta.json` |
| Lo aprendido | Codex dibuja un 12-17 % más pequeño de lo pedido: `generar.mjs` pide un 25 % de más y el conversor reduce |
| `node motor/piezas/montar.mjs set` | 18 piezas, sin errores de anclas, paleta ni escala |
