# Verificación · anthropic-fable-5-2

- Nivel: N2 (ver docs/editorial.md §3)
- Fecha de la última revisión: 2026-11-10. Fuentes leídas directamente (Anthropic: anuncio, familia Mythos, anuncio de Opus 5.5, anuncio de Fable 5.1 y documentación de la plataforma). Pendiente: pasada de `verificador-enlaces` y revisión de fechas antes de la PUERTA 2.
- Nota: el **precio de Fable 5.1** no aparece en ninguna página que haya podido leer (la ficha de modelo heredada se corta antes de las cifras y la tabla de precios no lo incluye). **No entra en el guion**: el vídeo no compara el precio de Fable 5.2 con el de Fable 5.1.

| # | Hecho (tal como sale en el guion) | Fuentes (id) | Primaria | Estado | Matiz que hay que decir |
|---|---|---|---|---|---|
| 1 | Anthropic lanzó Fable 5.2 el 9 de noviembre de 2026 | f1, f4 | Sí | verificado | Salieron a la vez Fable 5.2 y Mythos 5.2 |
| 2 | Fable 5.2 cuesta 8 $ por millón de tokens de entrada y 40 $ de salida | f1, f2, f7 | Sí | verificado | Modo rápido: 16 $ / 80 $ |
| 3 | Opus 5.5 cuesta 4 $ / 20 $ por millón de tokens | f2, f3 | Sí | verificado | |
| 4 | El modelo nuevo cuesta el doble por token que Opus 5.5 | f1, f2 | f2 | verificado | 8/4 y 40/20 |
| 5 | Genera salida hasta un 30 % más rápido que Fable 5.1 | f1 | Sí | verificado | «up to 30 %»: es un techo, no una media |
| 6 | A esfuerzo High empata con Opus 5.5 a Max (45,3 % frente a 45,5 % en FrontierCode) por la mitad de coste por tarea | f1 | Sí | verificado | Pruebas de Anthropic; el coste por tarea es una estimación suya |
| 7 | A esfuerzo máximo (Xhigh) llega al 49,1 % en FrontierCode 2.0, la puntuación más alta de un modelo lanzado que han probado | f1 | Sí | verificado | Compara con GPT-6 Astra (42,8 %) y Gemini 4 Carbon (41,1 %) |
| 8 | Fable 5.1 sacaba 32,4 % en FrontierCode 2.0 y Opus 5.5, 45,5 % | f1 | Sí | verificado | Opus 5.5 sin indicar esfuerzo en la tabla; Fable 5.1 a Xhigh |
| 9 | En código (FrontierSWE v2) 69,9 % frente a 56,3 % de Fable 5.1 y 62,3 % de Opus 5.5 | f1 | Sí | verificado | |
| 10 | En ciencia (Terminal-Bench-Science) 74,6 % frente a 52,6 % y 58,7 % | f1 | Sí | verificado | |
| 11 | En automatización de oficina (AutomationBench) 51,4 % frente a 31,4 % y 42,5 % | f1 | Sí | verificado | AutomationBench lo corre Zapier |
| 12 | En búsqueda con agentes (WANDR) 82,1 % frente a 68,7 % y 72,3 % | f1 | Sí | verificado | |
| 13 | En uso del ordenador (OSWorld 2.1) 89,3 % frente a 83,5 % y 87,2 % | f1 | Sí | verificado | Conjunto parcial y sin conexión |
| 14 | En robótica simulada (RoboDojo) 64,9 % frente a 27,6 % y 39,4 % | f1 | Sí | verificado | Prueba interna de Anthropic |
| 15 | En trabajo remoto (Remote Labor Index) 41,3 % frente a 17,9 % y 21,3 % | f1 | Sí | verificado | Fable 5.2 a esfuerzo High |
| 16 | En razonamiento (Humanity's Last Exam con herramientas) 74,2 % frente a 65,6 % y 67,7 % | f1 | Sí | verificado | |
| 17 | En gráficos (Chartography, sin herramientas) 73,4 % frente a 44,8 % y 64,4 % | f1 | Sí | verificado | |
| 18 | En ciberseguridad (CyScenarioBench) 76,3 % (Mythos 5.2) frente a 61,7 % (Mythos 5.1) y 67,6 % (Opus 5.5 sin salvaguardas) | f1, f4 | Sí | verificado | Es Mythos 5.2, no Fable; cada laboratorio con sus tareas |
| 19 | En redescubrir fallos conocidos (CVE Rediscovery) 89,6 % frente a 78,3 % y 81,3 % | f1, f4 | Sí | verificado | Mythos 5.2 |
| 20 | En diseño de proteínas (binder design) 85,1 % frente a 79,1 % y 82,6 % | f1, f4 | Sí | verificado | Mythos 5.2 |
| 21 | Fable y Mythos son el mismo modelo; Mythos solo para organizaciones verificadas | f1, f4, f7 | Sí | verificado | La diferencia en las pruebas es por las salvaguardas |
| 22 | Anthropic recomienda empezar por Opus 5.5 y subir a Fable cuando no llegue | f1, f6, f8 | Sí | verificado | Texto literal en la documentación |
| 23 | 1 M de tokens de contexto y hasta 128k de salida | f6, f7 | Sí | verificado | |
| 24 | Cuatro cambios que rompen código respecto a Fable 5.1 | f6 | Sí | verificado | |
| 25 | Hazañas de prelanzamiento: migraciones, tres dispositivos electrónicos, dos problemas de agujeros negros y el último teorema de Fermat formalizado en 30 horas | f1 | Sí | verificado | Lo cuenta Anthropic de sus propias pruebas: se dice «según Anthropic» |
| 26 | Opus 5.5 salió el 22 de septiembre de 2026 y se presentó como «al nivel de Fable 5.1 en la mayoría del trabajo» | f3 | Sí | verificado | |
| 27 | Fable 5.1 salió en septiembre de 2026 | f5 | Sí | verificado | La página no da el día |
| 28 | Opus 5.5 supera a Fable 5.1 en varias pruebas de código y ciencia (Terminal-Bench 4.0 66,4 % frente a 55,8 %; CursorBench 57,8 % frente a 51,8 %) | f3, f5 | Sí | verificado | Pruebas distintas de las de f1: no se mezclan en la misma tabla del vídeo |

Estado: verificado | parcial (explicar) | sin fuente (no entra en el guion).

Fuera del guion por falta de fuente: el **precio de Fable 5.1**; el detalle de qué pruebas de f1 son «sin salvaguardas» en Opus 5.5 (la tabla lo marca solo en ciberseguridad y biología); la fecha exacta del lanzamiento de Fable 5.1.
