# Crítica · shorts A v1, B v2 y C v2 · 2026-11-06

Subagente `critico-visual` (Opus) sobre las hojas y 18 fotogramas de `.runtime/qa/resumen-semana-agentes-shorts/`. Veredicto: **no pasa ninguno**. Lo copia aquí el orquestador.

## Bloqueantes y qué se hizo
| Short | Defecto | Arreglo (A v2, B v3, C v3) |
|---|---|---|
| A | En el detalle, la fuente estaba a media altura (y ≈ 206), lejos de su dato | La fuente va a y = 82 y la cronología baja: los hitos quedan a y 104, 146 y 188 |
| A y C | Cierre con un botón rojo que recuerda al logo de YouTube | Botón genérico: placa `panel` con el triángulo naranja (`comun/short.js`) |
| B | La placa de la fuente tapaba la extensión y el documento en «Qué hacía» | La extensión, el documento, la llave y el túnel pasan a la columna derecha (y ≥ 108) |
| C | El bucle no se leía como un bucle y la fuente tapaba un nodo | Redibujado: LEE → PIENSA → ACTÚA → MIRA en círculo, con un marcador que lo recorre y el núcleo en el centro; «Núcleo fijo» y «Cambiable» van bajo el bucle |
| C | La fuente tapaba el icono de herramientas | Los datos empiezan a y ≥ 104 y los objetos bajan |

## No bloqueantes
- **Arreglado:** las cifras de la caja de diálogo, que salían en letras («trescientos cuarenta millones»), ahora van en número (6.340 millones, 3.000 millones, 98 %, 5.000, 11 horas, 9 días) con `escrito.mjs`.
- **Arreglado:** en B, la fuente aparece desde el principio y las tres etiquetas de la cadena van a la misma altura.
- **Arreglado:** en C, el aviso ya no repite «Vista previa» y deja de ir en blanco sobre rojo (ahora naranja con marco rojo).
- **Sin cambios:**
  - El desplazamiento lateral oculta la caja y el rótulo (regla común del motor).
  - En A, las estrellas pasan por encima del texto.
  - En B se mantiene la jerga «túnel KO».
  - En C, las barras del techo no llevan leyenda.

Comprobado con fotogramas de la escena en `trabajo/revisar5-*` y `trabajo/revisar6-*`.
