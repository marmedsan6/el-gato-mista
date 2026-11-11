# Enlaces · anthropic-fable-5-2 · 2026-11-10

Verificación en paralelo de las 8 fuentes (un verificador por fuente, WebFetch). Fecha de consulta nueva antes de la PUERTA 2.

| id | URL | Estado | Nota |
|---|---|---|---|
| f1 | https://www.anthropic.com/claude-fable-and-mythos-5-2 | OK | Página del 9 nov 2026. Respalda: Fable y Mythos son el mismo modelo; salida hasta un 30 % más rápida; 8 $/40 $ (rápido 16 $/80 $); recomendación de empezar por Opus 5.5; toda la tabla de benchmarks coincide (FrontierCode 2.0 49,1 / 32,4 / 45,5; FrontierSWE v2 69,9 / 56,3 / 62,3; AutomationBench 51,4 / 31,4 / 42,5; Terminal-Bench-Science 74,6 / 52,6 / 58,7; WANDR 82,1 / 68,7 / 72,3; OSWorld 2.1 89,3 / 83,5 / 87,2; RoboDojo 64,9 / 27,6 / 39,4; RLI 41,3 / 17,9 / 21,3; HLE 74,2 / 65,6 / 67,7; Chartography 73,4 / 44,8 / 64,4; CyScenarioBench 76,3 Mythos 5.2 / 61,7 Mythos 5.1 / 67,6 Opus 5.5 sin salvaguardas; CVE Rediscovery 89,6 / 78,3 / 81,3; binder design 85,1 / 79,1 / 82,6); a High 45,3 % frente a 45,5 % de Opus 5.5 a Max por la mitad de coste por tarea; hazañas de prelanzamiento. El texto se corta tras FrontierCode: las secciones de seguridad y disponibilidad no se leyeron (no se usan). |
| f2 | https://platform.claude.com/docs/en/about-claude/pricing | OK | Fable 5.2 8 $ / 40 $ (caché 10 $ / 16 $ / 0,20 $); Opus 5.5 4 $ / 20 $ (caché 5 $ / 8 $ / 0,20 $); Mythos 5.2 8 $ / 40 $. La cita no mencionaba las cifras de caché de Mythos: corregida en `fuentes.json`. Fable 5.1 aparece con 10 $ / 50 $ en una fila cortada: no se usa. |
| f3 | https://www.anthropic.com/claude-opus-5-5 | OK | Opus 5.5 (22 sep 2026), «al nivel de Fable 5.1 en la mayoría del trabajo», 4 $ / 20 $ por millón de tokens, modo rápido 8 $ / 40 $; benchmarks frente a Fable 5.1 (Terminal-Bench 4.0 66,4 % / 55,8 %; CursorBench 57,8 % / 51,8 %; Terminal-Bench-Science 58,7 % / 52,6 %; AutomationBench 40,0 % / 31,4 %). |
| f4 | https://www.anthropic.com/claude/mythos | OK | Mythos 5.2 (9 nov 2026) para organizaciones verificadas; precio desde 8 $ / 40 $, modo rápido 16 $ / 80 $; «same underlying model»; la diferencia en las pruebas es por las salvaguardas; Mythos 5.1 el 1 sep 2026. |
| f5 | https://www.anthropic.com/claude-fable-and-mythos-5-1 | OK | Fable 5.1 y Mythos 5.1 (septiembre de 2026), mismo modelo con distintas salvaguardas; tabla frente a Fable 5 y Opus 5 (Terminal-Bench-Science 52,6 / 24,7 / 29,0; Terminal-Bench 4.0 55,8 / 42,0 / 52,3; AutomationBench 31,4 / 17,1 / 26,9; CursorBench 3.2.0 73,4 / 70,5 / 70,0). El 55,8 % de Terminal-Bench 4.0 es de Fable 5.1 (Mythos 5.1: 60,9 %). |
| f6 | https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2 | OK | Cuatro cambios que rompen código frente a Fable 5.1 (los cuatro listados); 1 M de contexto y 128k de salida; recomendación literal de empezar por el último Opus y pasar a Fable 5.2 cuando no llegue. Cuerpo cortado tras el primer cambio: no se usan las secciones posteriores. |
| f7 | https://platform.claude.com/docs/en/models/fable-5-2/migration-guide | OK (leído en la investigación) | Pensamiento adaptativo siempre activo (desactivarlo o presupuesto manual: error 400), High por defecto, 1 M de contexto, 128k de salida, 8 $ / 40 $. |
| f8 | https://platform.claude.com/docs/en/models/overview | OK | «start with Claude Opus 5.5 for most workloads. Use Claude Fable 5.2 for demanding reasoning and long-horizon agentic work, or when your evals on Claude Opus 5.5 at higher effort still fall short». |

## Referencias del guion

- `[fN]` sin fuente: ninguno. Los 8 identificadores existen en `fuentes.json` y todos se usan en el guion.
- Fuentes sin usar: ninguna.
- Fuera del guion: el precio de Fable 5.1 (no verificado en la lectura) y la fecha exacta de su lanzamiento.
