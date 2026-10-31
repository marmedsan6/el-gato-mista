# QA · phonic-1-voz · short v1 · 2026-10-31

- Máster: `salida/short-v1.mp4`, SHA-256 `980311b04be3f7171b1a6365368293f1339fb9b25c18c2ddf89a7dc7e17f83d1`. Último cambio: la cabecera «Toda la llamada» pasa a «Todo el registro», a raíz de la crítica del largo.
- Medido con FFmpeg 9.0.2 sobre este fichero final.

| Comprobación | Medida | Umbral | Resultado |
|---|---|---|---|
| Resolución · fps · fotogramas | 1080×1920 · 60/1 · 3.288 | short 1080×1920 a 60 fps | OK |
| Duración | 54,800 s | ≤ 120 s | OK |
| Sonoridad integrada (`ebur128`) | -14,1 LUFS | -14 ±1 | OK |
| Pico (`ebur128`) | -2,4 dBFS de pico real | < -2 dBTP | OK |
| Silencios (`silencedetect` -35 dB, 0,3 s) | 0 | short sin pausas | OK |
| Congelados (`freezedetect` -60 dB, 2 s) | 0 | ninguno no intencionado | OK |
| Negros (`blackdetect` 0,1 s) | 0 | ninguno no intencionado | OK |
| Contrato de escena | `npm test` 4/4 · render sin violaciones | sin reloj ni animaciones | OK |
| Voz frente al guion | 95,1 % casado; única diferencia, RT-4842 («RT4842» oído) | lee el guion de la PUERTA 1 | OK |
| Fuentes | `reviews/enlaces.md`, del mismo día, y `reviews/analisis-demo.md` | noticia verificada | OK; sin repetir tras este máster |

## Audio
- Voz: Gemini «Orus», ritmo ágil (ADR 0006).
- Música: «Morning Coffee» (m2) a -13 dB, con sidechain bajo la voz.
- Efectos: 15, a -18 dB, atados a lo que pasa en pantalla.

## Crítica visual
- **Pasada 1** (`critica-short-v1-01.md`): no pasa, 2 bloqueantes (cabecera del monitor y bloque de la mesa). Corregidos.
- **Pasada 2:** confirma lo anterior. No pasa por el solape de los candados. Señala además que el lunes tachado responde al gancho. Corregidos.
- **Pasada 3, acotada:** no pasa por dos defectos:
  - los textos con color no se desplazaban en la transición, por un fallo en `escenas/comun/base.js`;
  - «Solo con un sí» apenas se leía en reposo.
  Corregidos los dos, y también el margen de «FINAL».
- **Tras esas correcciones no hay una cuarta pasada de Opus.** Lo he comprobado yo con 8 fotogramas a 360×640 (5,2 · 5,65 · 48 · 48,8 · 49,1 · 49,3 · 49,45 · 54,5 s): todo viaja con su panel, conserva el color y «Solo con un sí» está en pantalla desde antes de los 48 s.

## Sin comprobar
- Ninguna revisión ha visto el vídeo en movimiento ni lo ha oído con voz, música y efectos juntos. Eso lo juzga Mario.
- La pronunciación solo se ha comprobado por transcripción, no de oído.

## Defectos menores que quedan
- La C mayúscula de la caja de diálogo parece una O a 360×640 (fuente Pixelify Sans).
- La caja se reinicia a mitad de frase en las frases largas, como en el short publicado.

## Bloqueantes
Ninguno conocido tras las correcciones.
