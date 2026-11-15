# Prompt para integrar en el proyecto el arte hecho con Codex

Pedido de Mario (2026-11-15): un prompt para pasarlo a otro chat y que allí se integre en el proyecto que el arte
pixel de los vídeos se haga con Codex. PixelLab queda descartado. El texto que se pega va entre las dos rayas.

---

Trabajas en `C:\Users\mario\proyectos\canal-videos` (canal ElGatoMista). Quiero integrar en el proyecto que **el arte
pixel de los vídeos se genere con Codex** en lugar de dibujarlo pieza a pieza por código. Primero **haz un plan** (modo
plan) y pregúntame lo que no esté decidido; no implementes nada hasta que lo apruebe.

**Lee antes:** `AGENTS.md`, `memoria/decisiones.md`, la skill `estilo`, `docs/estilo.md`, `docs/criterios.md`,
`docs/calibracion.md` y, sobre todo, `docs/investigacion/herramientas-pixel-2026-11-14/` (`informe.md` y `piloto.md`).
El piloto está en la rama `prueba/piezas-generadas`: si sus ficheros no están confirmados, mira `git status` y
pregúntame antes de cambiar de rama o confirmar nada.

**Qué se sabe ya (piloto del 2026-11-14):**
- Vía probada: `codex exec -i <ref1.png> -i <ref2.png> -C <carpeta> -s workspace-write "<petición>"` genera una hoja
  de sprites sobre fondo magenta (~1 min). El conversor `motor/piloto/piezas-generadas/convertir.py` la pasa a filas de
  letras y paleta `R5`, que pinta `sprite5` (`motor/estilo/v5/dibujo.js`). No cambia el motor ni el render.
- Escenas de ejemplo: `motor/calibracion/piezas-generadas/` (`short-a-codex.html`, `short-a-piloto.js`,
  `piezas-gen.js` con `spriteG`, `andarG`, estados por paleta y `puertaG`).
- El crítico lo da por **mejor base que la v6 para los sujetos**, con condiciones:
  - **todo el vídeo generado o nada**: mezclar con piezas por código se nota;
  - cuidar lo pequeño: la «?» se perdía sobre el toldo y el portapapeles del observador no se veía a 360 px;
  - cambiar la regla «Fuentes de arte: dibujo propio por código» con un ADR.
- **Lecciones técnicas:**
  - Codex **no mantiene la escala** entre hojas: pedirle «más pequeño» afina el píxel. Se arregla forzando el píxel al
    convertir (`--pixel`); conviene una opción que lo calcule desde la altura final deseada.
  - Agrupar en 12-16 tonos antes de la paleta (`--tonos`) quita el moteado; el borde con el magenta da morados que el
    conversor descarta.
  - Repite el personaje entre poses (quieta y a mitad de paso), a veces con otro tono de pelo: se iguala por paleta.
  - Estados por paleta (luz encendida y apagada, camisas de colores) sin regenerar nada.
  - Lo que la pieza no trae (una puerta que se cierra) va escrito a mano como rejilla.
  - Las coordenadas internas de cada pieza (hueco de la puerta, escaparate) se miden sobre su rejilla.
  - Las herramientas de línea de comandos no pueden vivir en `motor/calibracion/`: `npm test` lo trata como escenas.
- **Coste:** plan Plus de Codex; 6 imágenes gastaron menos del 1-2 % de la semana. Estimado: un par de shorts ≤ 7 % de
  una semana; un largo con 3 shorts ≤ 17 %. Sin dinero extra.

**Lo que tiene que cubrir el plan:**
1. **Decisión de estilo:** ADR nuevo (`docs/decisiones/0011-…`), cambio en `docs/estilo.md` y en la skill `estilo`.
   Propón si es una versión nueva (v7) o un añadido a la v6, y cómo se mantienen intactos los vídeos publicados (cada uno
   carga su biblioteca; `npm test` compara huellas).
2. **Herramientas en su sitio definitivo** (fuera de `motor/calibracion/`):
   - el conversor, con el cálculo del píxel desde la altura deseada;
   - un comando que lance `codex exec` con las referencias de estilo y una plantilla de petición (fondo magenta, vista
     lateral, contorno, 3-4 tonos, luz arriba a la izquierda, sin texto), convierta y saque una hoja de contactos;
   - las funciones de escena de `piezas-gen.js` en la biblioteca.
3. **Coherencia:** un set de referencia de estilo (10-20 piezas aprobadas por mí) que se pase siempre como referencia,
   una escala fija (alturas de persona, puertas, edificios en píxeles de arte) y una puerta de estilo (hoja de contactos
   de cada tanda revisada antes de usarla).
4. **Catálogo y reutilización:** dónde se guardan las piezas generadas de cada vídeo (con sus coordenadas internas),
   cómo pasan a un set común al cerrar el vídeo y cómo se elige qué reutilizar.
5. **Flujo:** qué cambia en las skills `nuevo-video` (paso Escenas: lista de piezas desde el storyboard, generación por
   tandas, revisión en hoja, conversión), `estilo` y `qa` (que el crítico mire la mezcla de manos y la lectura de lo
   pequeño a 360 px).
6. **Calibración antes de usarlo en un vídeo real**, como pide `docs/calibracion.md`: qué clip se hace, qué mira el
   crítico y qué tengo que aprobar yo.
7. **Qué hacer con lo de PixelLab** que quedó del piloto (`motor/piloto/piezas-generadas/pixellab.mjs`,
   `piezas-pixellab.js`, `short-a-pixellab.html`): conservarlo como registro o enviarlo a la Papelera (con mi
   confirmación).

**Reglas:** español; contrato `seek(t)` sin excepciones; `node motor/revisar.mjs … --estricto` antes de renderizar
entera una escena; lo publicado no se toca; nada pesado mientras corre un render; sin borrado permanente (Papelera con
`~/odd/scripts/recycle.ps1` y mi confirmación); commits convencionales solo cuando yo lo pida y sin `git push`; sin
gastar dinero. Terminado = evidencia (`npm test`, lint, render).

---
