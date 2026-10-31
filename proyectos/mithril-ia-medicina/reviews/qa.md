# QA · mithril-ia-medicina · short · 2026-10-30

- Máster: `proyectos/mithril-ia-medicina/salida/short.mp4` (v2, tras la crítica), SHA-256 `a7146cc9de151829b496dfe43ccd7becee4aa48e1a0e794449e17bed46cacd3a`.
- Medido con FFmpeg 9.0.2 sobre el máster final (comandos de la skill `qa`).

| Comprobación | Medida | Umbral | Resultado |
|---|---|---|---|
| Resolución · fps · fotogramas | 1080×1920 · 60/1 · 3.498 | short 1080×1920 a 60 fps | OK |
| Duración | 58,300 s | ≤ 120 s | OK |
| Sonoridad integrada (`ebur128`) | -14,1 LUFS · LRA 3,1 LU | -14 ±1 | OK |
| Pico real (`ebur128`) | -2,4 dBTP | < -2 dBTP | OK |
| Silencios (`silencedetect` -35 dB, 0,3 s) | 0 | short sin pausas (estilo v1, P15) | OK |
| Congelados (`freezedetect` 2 s) | 0 | ninguno no intencionado | OK |
| Negros (`blackdetect` 0,1 s) | 20,07-20,33 s | ninguno no intencionado | **Intencionado**: inicio del bloque B con «CLAUDE» y 11 nodos sobre el fondo azul-negro (1,5 % de píxeles claros, medido); el crítico lo da por aceptable |
| Contrato de escena | 0 violaciones en el render · `npm test` 4/4 | sin reloj ni animaciones | OK |
| Voz frente al guion aprobado | 165/165 palabras (con pista) · 97,6 % a ciegas (solo diferencias de formato) | lee el guion de la PUERTA 1 | OK |
| Fuentes (segunda verificación) | 4 OK + 1 parcial precisado (`reviews/enlaces-puerta2.md`) | noticia reverificada antes de la PUERTA 2 | OK |
| Visual (crítico Opus) | Pasa; 3 defectos no bloqueantes y menores, arreglados en la v2 (`reviews/critica-01.md`) | sin bloqueantes | OK |

## Audio
- Voz: Gemini «Orus», ritmo ágil (ADR 0006), 57,8 s.
- Música: «Morning Coffee» (Pixabay, m1) a -14 dB, apartándose bajo la voz (sidechain) y con fundido final de 1,5 s.
- Efectos: 42 eventos (12 apariciones, 22 ticks, 4 aciertos, 1 error, 3 destellos), Freesound CC0 (m2-m6), 1 fotograma después de la imagen.
- La normalización usó el modo dinámico de `loudnorm` (con el lineal se habría pasado del pico). LRA final de 3,1 LU.

## Bloqueantes
Ninguno.

## Pendiente de Mario (no bloquea el QA)
- Barra «1 PERSONA + IA» al ~80 % de «EMPRESA ENTERA» (52-58 s): cuantifica la opinión «se acerca».
- Transparencia en la descripción: ¿decir que el canal se produce con Claude, de Anthropic?
