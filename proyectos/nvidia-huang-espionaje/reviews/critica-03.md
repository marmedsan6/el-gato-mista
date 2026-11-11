# Crítica · máster publicado short v3 nvidia-huang-espionaje (estilo v5) · 2026-11-10

Subagente `critico-visual` (Opus), pasada de línea base antes de la iteración v6, sobre
`.runtime/qa/nvidia-huang-espionaje-short-v3/` (`node motor/qa.mjs`: 3 hojas a 2 fps, 11 tiras de movimiento, último
instante de las 12 frases y 12 instantes más, a tamaño completo y a 360×640). Guardada por el orquestador. Es la primera
pasada del crítico sobre la v3: `qa-v3.md` la dio por buena con la hoja a 1 fps.

## 3 peores defectos
1. **[t=53,2-65,1] La estación «OJO: MATIZ» es una tarjeta de texto, no un diorama, y desde t≈63 se lee «NVIDIA INVESTIGA CHINA».**
   - La etiqueta «CHINA» queda dentro del panel del tuit, pegada a la A de «INVESTIGA», y su bocadillo pisa el borde del panel.
   - «NVIDIA INVESTIGA» a secas afirma más que la voz («investiga lo que ha publicado la prensa»).
   - Ninguno de los tres datos lleva «Fuente:» visible («no confirma», «sin motivos para creer», «China lo llama especulación»).
   - «¿CONFIRMA?» tachado no se lee; el panel se queda vacío en los travellings; en 12 s solo cambian textos.
   - Arreglo: dibujar a NVIDIA con una lupa sobre un periódico, mantener la caja fuerte con el check, dar a China su
     edificio separado con el bocadillo, y «CHINA» a 8 unidades o más de cualquier otro texto.
   - **BLOQUEANTE: sí.**
2. **[todo el vídeo; peor en t=12,8, 20,6 y 27,5] Las etiquetas funcionan como un segundo subtítulo.** Copian la voz y se
   apilan en bloques que se leen como una frase; en fr02 la fuente queda entre dos etiquetas; en fr03 hay tres
   atribuciones a la vez y la «Fuente» pisa la rotativa; en fr04 el rótulo y tres líneas forman un bloque de 4 renglones;
   «JENSEN HUANG» está pegado al rótulo, lejos de la persona.
   - Arreglo: una etiqueta de 1-3 palabras pegada al objeto y nunca la frase que dice la voz. No bloquea en lo publicado;
     bloquearía en una versión nueva.
3. **[los 11 movimientos] Cámara y rótulo descoordinados, y arranque vacío.** El rótulo cambia al empezar el travelling y
   nombra 0,5-1 s lo que aún no se ve; el gancho dura 1,5 s y después hay 1,5 s sin rótulo con una silueta diminuta; los
   zooms cortan el edificio de Megaspeed y el atril por los bordes y el bloque de etiquetas salta de sitio.
   - Arreglo: rótulo al llegar, gancho de unos 2,5 s, recentrar los zooms y etiquetas ancladas a su objeto. No bloquea.

## Otros
- Tramos casi quietos: 24,5-29,9 s (solo la lupa), 56-65 s (solo textos) y 66-71 s (cierre).
- Sujetos: Jensen Huang, diminuto en «EL OBJETIVO»; Alice Huang, silueta oscura sobre fondo oscuro, casi invisible a 360 px.
- NVIDIA y China solo se identifican por la etiqueta (edificios genéricos).
- Cierre: la barra toca la caja de «FUENTE: NVIDIA» y se lee como parte del texto; el consejo son bloques grises.
- MISTA en «OJO» se superpone a la caja fuerte y sus orejas tocan el panel.
- Caja de diálogo: el texto ya dicho va justo de contraste a 360 px.
- Sin defecto: zonas tapadas del short, ortografía y píxel (nítido y uniforme a 4 px).

## Textos de presentación
- **Se tocan o se leen juntos:** fr11 (panel + «CHINA» + bocadillo + sello), fr02 (fuente entre dos etiquetas; «CHIPS MÁS
  AVANZADOS» toca el chip), fr03 (fuente sobre la rotativa; línea a 25 px del borde derecho), fr04 y fr05 (bloque pegado
  al rótulo), fr08 (fuente toca las lámparas), fr12 (barra toca la fuente).
- **Repiten la caja en el mismo instante:** prácticamente todos (literal en fr08, fr10 y fr11).
- **Fuente:** se lee donde existe (justa en fr02 y fr03, unos 1,5 s); en fr09-fr11 no hay ninguna.
- **El dibujo se entiende sin leer:** Megaspeed y Singapur, el consejo con la lupa, el correo, el chip y la frontera.
  **Depende del texto:** NVIDIA (fr01), China (fr02, fr11), Alice Huang (fr03), el MATIZ (fr09-fr11) y el cierre (fr12).
- **Movimientos:** rótulo adelantado en todos los travellings, panel vacío en dos, etiquetas que saltan en los zooms.

## Lo que funciona
Megaspeed con las torres y la lupa; el consejo de 4 personas; el despacho con el correo y los sobres; el chip con la cinta
y la barrera; la paleta nocturna, el paralaje con farolas y la caja opaca; la cartela «FUENTE: NVIDIA · 8 NOV 2026».

## Veredicto: no pasa
Bloquea el defecto 1. El lint nuevo (`node motor/revisar.mjs`) confirma con medidas las dos fuentes fuera de pantalla
(x = 268 de 270) y los textos de menos de 2 s. El máster ya está publicado: qué hacer con él lo decide Mario.
