# QA · ventanas-contexto-ia · shorts v4 · 2026-11-03

| Comprobación | A | B | C | Umbral | OK/FALLA |
|---|---|---|---|---|---|
| Resolución y fps | 1080×1920, 60 | 1080×1920, 60 | 1080×1920, 60 | 1080×1920, 60 fps | OK |
| Duración | 45,82 s | 56,87 s | 60,25 s | ≤ 120 s | OK |
| Sonoridad integrada | -14,3 LUFS | -14,1 LUFS | -14,3 LUFS | -15 a -13 | OK |
| Pico real (`mezcla.mjs`) | -2,5 dBTP | -2,5 dBTP | -2,5 dBTP | < -2 | OK |
| Congelados > 2 s | 0 | 0 | 0 | 0 | OK |
| Negros | 0 | 0 | 0 | 0 | OK |
| Cierre que remite al largo | sí | sí | sí | con largo | OK |

## Audio
- **Mezcla:** la misma voz y los mismos ajustes que en la v1 (música -13 dB, efectos -24 dB). Detalle de la v1 en `qa-audio-v1.md`.
- **Silencios:** ninguno de más de 0,4 s. El C tiene una pausa de 0,32 s tras la primera pregunta (`apretar-pausas` deja 0,3 s). Es el mismo criterio que en alien-isolation-ia.

## Congelados y negros
Medidos sobre la v4 con `freezedetect=n=-60dB:d=2` y `blackdetect=d=0.1`: ninguno.

## Crítica visual
Tres pasadas del crítico: `critica-shorts-v1.md`, `-v2.md` y `-v3.md`.
- **v3:** A y B pasan. C no pasa por un solo motivo: «8K» se leía «SK».
- **Arreglos de la v4:**
  - Todas las cifras de las etiquetas en JetBrains Mono (`cifrasMono`).
  - Cuatro retoques menores de posición.
- **Comprobación de la v4:** la hizo el orquestador con fotogramas a tamaño completo en los puntos señalados (no hubo cuarta pasada del crítico, para no gastar cupo de Opus en cambios de posición).

## Bloqueantes
Ninguno.
