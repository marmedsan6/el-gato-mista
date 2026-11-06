// Efectos de pixelfx (MIT, github.com/patch-gg/pixelfx) en las escenas: dibuja el fotograma de la hoja que toca en t,
// recortado con un <svg> anidado (viewBox = el fotograma) y pixelado. Determinista: el fotograma sale solo de t.
// Las hojas y fx-meta.js los genera `node motor/fx-exportar.mjs` en motor/estilo/v3/fx/. La escena carga antes
// motor/estilo/v3/fx/fx-meta.js y su seek espera a FX.listo (las hojas se decodifican una vez).
//   efecto(svg, nombre, t, t0, x, y, u)  → el efecto que empieza en t0, con su pivote en (x, y) unidades, a u unidades por
//   píxel del efecto (0,5 = 6 px de salida). Si no hace bucle, desaparece al acabar.
const FX = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const meta = window.FX_META || {};
  const listo = Promise.all(Object.keys(meta).map((n) => { const i = new Image(); i.src = window.FX_BASE + n + ".png"; return i.decode(); }));
  function dibujar(svg, nombre, t, t0, x, y, u = 0.5) {
    const m = meta[nombre];
    if (!m || t < t0) return false;
    let f = Math.floor((t - t0) * m.fps + 1e-6);
    if (m.loop) f %= m.frames; else if (f >= m.frames) return false;
    const fx = (f % m.cols) * m.w, fy = Math.floor(f / m.cols) * m.h;
    const caja = document.createElementNS(NS, "svg");
    Object.entries({ x: x - m.pivot[0] * u, y: y - m.pivot[1] * u, width: m.w * u, height: m.h * u, viewBox: `${fx} ${fy} ${m.w} ${m.h}`, overflow: "hidden" })
      .forEach(([k, v]) => caja.setAttribute(k, v));
    const im = document.createElementNS(NS, "image");
    Object.entries({ href: window.FX_BASE + nombre + ".png", x: 0, y: 0, width: m.cols * m.w, height: Math.ceil(m.frames / m.cols) * m.h })
      .forEach(([k, v]) => im.setAttribute(k, v));
    im.style.imageRendering = "pixelated";
    caja.appendChild(im); svg.appendChild(caja);
    return true;
  }
  return { listo, dibujar, meta };
})();
const efecto = FX.dibujar;
