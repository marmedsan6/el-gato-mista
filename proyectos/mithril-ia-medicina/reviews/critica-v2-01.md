# Crítica · máster short v2 (1080×1920, 58,3 s) · 2026-10-30

Crítico visual (Opus, `.claude/agents/critico-visual.md`) sobre 16 fotogramas a 1080×1920 y 360×640 y la hoja de contactos
(1 fotograma por segundo) del primer máster v2 (SHA-256 `0b6bb771…80aa8`, ya sustituido). Veredicto: **no pasa** (1 bloqueante).

## 3 peores defectos y qué se hizo
1. **[≈10,5-12,5 s] «distrofias» se leía «distroñas» en la caja de diálogo** · BLOQUEANTE.
   - Causa medida en Chromium: la ligadura «fi» de Pixelify Sans. El atajo `font:` de `.dialogo` volvía a activar las ligaduras aunque el `body` las desactivara.
   - Arreglo: `font-variant-ligatures: none` y `font-feature-settings: "liga" 0, "clig" 0` en `*` y en `.dialogo` (`motor/estilo/estilo.css`).
   - Comprobado en el fotograma 11,0 s.
2. **[5-8 s y 13-15 s] Corcho vacío y papel en blanco** · no bloqueante.
   - La ficha de Mithril entra con la frase y muestra el fundador («C. TRANBARGER», con icono de persona).
   - «Gen LAMA2» va en el papel desde que entra.
3. **[49,8 s] Línea temporal mal compuesta** · no bloqueante.
   - Rótulo alineado a la izquierda y años centrados bajo su marca.
   - Marca final «2029» en texto suave, para que la flecha se lea como «finales de 2028».
   - «Si todo va bien» en texto oscuro.

## Otros, también arreglados
- El contador dice «1 mes» en singular.
- El panel verde es más ancho, para dar margen a «ANTHROPIC → MITHRIL».
- El marco de selección pasa a las cajas cuando MISTA las toca.
- La insignia «+ IA» lleva borde, como el rótulo.
- Las etiquetas de fuente llevan fondo opaco y están en la columna de los rótulos (x=16).
- «Biotecnológica» va en texto oscuro.
- MISTA piensa durante la pregunta del bloque D.

## Sin cambio (con motivo)
- **Destello A→B al 100 % en el pico:** es el diseño de la v1, aprobado por Mario. El fotograma de B→C de la hoja no caía en el pico.
- **Destello C→D:** el crítico no lo vio porque la hoja no tenía fotograma en 50,4-50,6 s. Se añade el fotograma 50,50 a la comprobación final.

## Segunda pasada (Opus, máster `6c8c9918…63ec1`) · veredicto: **pasa**
- Comprueba que se resuelven todos los puntos de la primera: «distrofias», corcho y papel, línea temporal, «1 mes», marco en las cajas,
  margen del panel, «+ IA», fuentes opacas, pose de MISTA en D y ritmo de D (algo nuevo en 51, 54, 56 y 57 s).
- 3 defectos no bloqueantes, arreglados antes de la PUERTA 2 (comprobados en fotogramas 11,0 · 13,5 · 16,5 · 19,0 · 49,8):
  1. «2026» y «2029» casi tocaban el borde del papel → marcas del eje en x = 60-204 (≥ 10 px de margen).
  2. «GEN LAMA2» repetido en rótulo y papel → el papel muestra desde la entrada la barra «Fuerza» llena (verde), que baja en rojo con «debilita».
  3. La etiqueta de fuente tapaba el borde superior del marco del matraz → etiquetas del bloque A en y=200.
- Sin cambio: corcho vacío < 1 s al empezar; rótulo sin tarjeta ~1 s en 46 s (transición); la luna roza el panel de la pregunta (tangencia menor).
- Pendiente de documentación: `docs/estilo.md` dice pico de destello al 85 %; los dos destellos (como en la v1 aprobada) llegan al 100 % en el pico. Se alinea al pasar el estilo a v2.
