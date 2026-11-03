# Crítica · máster short v6 (estilo v3) · 2026-11-03

Crítico visual (Opus) sobre 14 fotogramas a 1080×1920 y 360×640 y la hoja de contactos del primer máster v6
(SHA-256 `815b0c90…28c7`, ya sustituido). Veredicto: **no pasa** (2 bloqueantes). Todo corregido y comprobado en 11 fotogramas.

## Lo que funciona (conservar)
- Píxel de ~12 px y profundidad coherentes en los 4 escenarios: lejos desenfocado, plano medio nítido y conos de luz.
- MISTA aparece en todos los planos generales y queda fuera en los tres zooms core; nunca hay dos gatos.
- Rótulo y caja de diálogo fijos; cartelas que no crecen con el zoom; zonas tapadas libres.
- Todo se lee a 360×640; ortografía sin regresiones; un cambio cada segundo o menos.

## Defectos y qué se hizo
1. **BLOQUEANTE · Cierre en la azotea:** el acercamiento lento llevaba la jaula y su marco al borde izquierdo, y los ratones se confundían con las ventanas.
   - En la azotea ya no hay acercamiento.
   - La jaula tiene fondo interior opaco y paja.
   - El panel de la pregunta se ajusta a su contenido y la luna se aparta.
2. **BLOQUEANTE · El rótulo volvía a quedar pegado al cuadro durante el acercamiento** (regresión de la calibración).
   - Acercamiento anclado en cy=175: deja ~24 px de salida bajo el rótulo en todo momento.
3. **La doble hélice junto a la barra «Fuerza» se leía como un glifo roto.** Se quita.

## Otros, también arreglados
- En los zooms core, los objetos de la mesa y del suelo (que no son el tema) se ocultan, como MISTA, y ya no asoman cortados sobre la caja.
- La pantalla de la sala de servidores mide 2 unidades más: «Experimentos» y «Anthropic → Mithril» ya no tocan el bisel.
- La mesa del laboratorio baja 2 unidades y el microscopio es más compacto, para que el marco no choque con la fuente.
- Las cartelas del despacho se apartan de la lámpara y de la sombra de la tarjeta.
- La flecha «▶ Se acerca» se ve completa.
- **Sin cambio:** el nodo gris de 24,5 s es el undécimo laboratorio, que aún no se ha encendido.
