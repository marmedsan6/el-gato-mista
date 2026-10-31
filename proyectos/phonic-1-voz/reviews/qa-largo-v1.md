# QA · phonic-1-voz · largo v1 · 2026-10-31

- Máster: `salida/largo-v1.mp4`, SHA-256 `37aea46590087b819f3f2affe9064e74953a09c7b7ca95edc740dc41252ad6b2`.
- Medido con FFmpeg 9.0.2 sobre este fichero final.

| Comprobación | Medida | Umbral | Resultado |
|---|---|---|---|
| Resolución · fps · fotogramas | 1920×1080 · 60/1 · 28.932 | largo 1920×1080 a 60 fps | OK |
| Duración | 482,200 s (8:02) | 8-10 min | OK |
| Sonoridad integrada (`ebur128`) | -14,2 LUFS | -14 ±1 | OK |
| Pico (`ebur128`) | -2,3 dBFS de pico real | < -2 dBTP | OK |
| Silencios (`silencedetect` -35 dB, 0,8 s) | 0 | pausas de 0,3-0,8 s | OK |
| Congelados (`freezedetect` -60 dB, 2 s) | 0 | ninguno no intencionado | OK |
| Negros (`blackdetect` 0,1 s) | 0 | ninguno no intencionado | OK |
| Contrato de escena | `npm test` 4/4 · render sin violaciones | sin reloj ni animaciones | OK |
| Voz frente al guion | 89,9 % casado; 51 diferencias, casi todas de formato (cifras, «Fónic» y «Phonic») | lee el guion de la PUERTA 1 | OK, sin oír |
| Fuentes | `reviews/enlaces-puerta2.md`: ninguna respalda de menos; f3 y f19 comprobadas en el navegador | noticia verificada | OK |
| Registro de la demo | Repetido hoy: 123 = 114 + 8 + 1; `RT-4842` solo en la fila 16:04; 0 menciones en las 371 filas de texto; sin cancelación | sin cambios | OK |

## Audio
- Voz: Gemini «Orus», ritmo ágil, ralentizada al 96 % con `atempo` para llegar a 8 min sin regenerarla.
- Clips: 3, con la voz del modelo aislada en el canal derecho.
- Música: «Morning Coffee» (m2) a -13 dB en bucle, con sidechain bajo la voz.
- Efectos: 50, a -18 dB, atados a la pantalla.

## Crítica visual (`critica-largo-v1-01.md`)
- **Pasada 1:** no pasa, 2 bloqueantes de texto. Corregidos.
- **Pasada 2, acotada:** no pasa, 1 bloqueante («En toda la llamada»). Corregido.
- **Tras eso no hay otra pasada de Opus.** He revisado yo el último instante de cada panel en el máster anterior a los dos últimos solapes, y estos en el máster final. No es lo mismo que un crítico independiente.

## Sin comprobar
- Nadie ha visto el vídeo en movimiento ni ha oído la mezcla completa: voz, clips, música y efectos. Eso lo juzga Mario.
- Pronunciación: solo por transcripción. Hay tres dudas de Whisper que conviene oír: «cambias» («cambies»), «oyes» («hoy es») y «el agente» («a la gente»).
- Traducción de los clips: comparada con su transcripción, no de oído.

## Defectos menores que quedan
- Bastantes paneles de texto tapan el escenario: es menos vívido que el short.
- Las sillas de la mesa se leen algo como cuadros.
- GPT-Live lleva tres colores en la comparación (rótulo, barra y cifra).

## Nota para Mario
La voz dice «Por fin alguien lo ha resuelto», del guion aprobado. El tweet literal es «por fin alguien resolvió el problema», que es lo que sale en pantalla entre comillas. Decisión mía: no regenerar la voz para no tocar el guion aprobado sin él.

## Bloqueantes
Ninguno conocido tras las correcciones.
