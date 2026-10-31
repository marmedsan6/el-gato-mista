# Motor

Motor de render propio (ADR 0004): Playwright 1.64.1 + chrome-headless-shell-1243 + FFmpeg 9.0.2.

## Uso
```bash
node render.mjs --escena <html> --ancho <px base> --alto <px base> --duracion <s> --salida <mp4> \
  [--consulta "formato=short"] [--incluir dir1,dir2] [--fps 60] [--escala 4] [--workers 8] [--fotogramas t1,t2]
```
- La escena expone `window.seek(t)` (contrato de `docs/criterios.md` §1). Opcional: `window.claveFotograma(t)`, para
  capturar una sola vez cada tramo de fotogramas iguales.
- Salida: H.264 yuv420p, crf 18, bt709, a `ancho×escala` por `alto×escala`. `--fotogramas` deja `t_<t>.png` junto al MP4.
- Reanudación por fotograma: caché en `<RUNTIME_DIR>/render-cache/<clave>/`. La clave incluye la escena, las carpetas
  de `--incluir`, los parámetros y el propio `render.mjs`. La caché no se borra.
- Guardas en tiempo de ejecución: si la escena usa `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now`
  o `performance.now`, el render falla.

## Tests (`npm test`)
- `tests/lint-escena.test.mjs`: prohíbe reloj, animaciones CSS, `Math.random` y recursos de red en
  `motor/calibracion/**` y `proyectos/*/escenas/**`. Reglas en `tests/reglas-escena.mjs`.
- `tests/determinismo.test.mjs`: dos renders con los fotogramas en distinto orden dan PNG y MP4 idénticos, y una escena
  con reloj se rechaza.
- Se ejecutan solos al cerrar cada turno si hay cambios en `motor/` o en escenas (`.claude/hooks/verify-on-stop.sh`).

## Carpetas
- `calibracion/c5a/`: fotogramas fijos de la calibración y `comun.css` / `comun.js` (tokens y dibujo pixel).
- `calibracion/c5b/`: clip de prueba de 18 s (short y largo).
- `piloto/`: el piloto de las 3 candidatas (`resultados.md`); se conserva como referencia.
- `node_modules/` aquí mismo, ignorado por git.
