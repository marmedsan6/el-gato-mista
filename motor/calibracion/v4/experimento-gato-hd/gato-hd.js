// MISTA con más detalle (iteración de detalle, 2026-11-06): el mismo diseño, poses y animación que motor/estilo/v3/gato.js,
// pero a 64×64 (6 px de salida por píxel en vez de 12). Mario: «dejarlo como estaba pero con más detalle»; el rediseño
// (mezcla con su hoja de referencia) queda para más adelante (motor/calibracion/v4/gato/).
// Cómo: gato() dibuja en una rejilla de 32×32 (no en el SVG) → Scale2x (EPX: dobla sin difuminar y suaviza diagonales) →
// detalle sin cambiar el diseño: rayas de 1 px, textura de pelo con semilla fija, brillo en los ojos, borde de luz y la
// línea del cuello más fina → se pinta a medio tamaño de unidad. Ocupa lo mismo que gato(): entra en las escenas tal cual.
// gatoHD(svg, x, y, opciones) · retratoGatoHD(svg, x, y, opciones, escala). Necesita pixel.js y v3/gato.js.

const HD = (() => {
  const T = 32;
  // Lienzo falso: gato() y retratoGato() llaman a rect(svg, …), que crea un <rect> y hace svg.appendChild(r).
  function capturar(dibujar, ancho = T, alto = T) {
    const rects = [];
    dibujar({ appendChild: (r) => { rects.push(r); return r; } });
    const g = Array.from({ length: alto }, () => Array(ancho).fill(null));
    let sombra = [];
    for (const r of rects) {
      const x = +r.getAttribute("x"), y = +r.getAttribute("y"), w = +r.getAttribute("width"), h = +r.getAttribute("height");
      const c = r.getAttribute("fill");
      if (/^#[0-9a-f]{8}$/i.test(c)) { sombra.push([x, y, w, h, c]); continue; } // sombra del suelo (semitransparente)
      for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (j >= 0 && j < alto && i >= 0 && i < ancho) g[j][i] = c;
    }
    return { g, sombra };
  }
  function scale2x(g) {
    const H = g.length, W = g[0].length, o = Array.from({ length: H * 2 }, () => Array(W * 2).fill(null));
    const at = (j, i) => (j >= 0 && j < H && i >= 0 && i < W ? g[j][i] : null);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const P = g[j][i], A = at(j - 1, i), B = at(j, i + 1), C = at(j, i - 1), D = at(j + 1, i);
      o[2 * j][2 * i] = C === A && C !== D && A !== B ? A : P;
      o[2 * j][2 * i + 1] = A === B && A !== C && B !== D ? B : P;
      o[2 * j + 1][2 * i] = D === C && D !== B && C !== A ? C : P;
      o[2 * j + 1][2 * i + 1] = B === D && B !== A && D !== C ? D : P;
    }
    return o;
  }
  // Detalle sobre la rejilla de 64: no cambia ni colores ni formas del diseño
  function detalle(g) {
    const H = g.length, W = g[0].length, C = GATO_COLOR;
    const vecinos = (j, i) => [[j - 1, i], [j + 1, i], [j, i - 1], [j, i + 1]].map(([a, b]) => (a >= 0 && a < H && b >= 0 && b < W ? g[a][b] : null));
    // 1) rayas de 1 px: de cada raya doblada se queda la fila de arriba
    for (let j = H - 1; j > 0; j--) for (let i = 0; i < W; i++) if (g[j][i] === C.s && g[j - 1][i] === C.s) g[j][i] = C.b;
    // 2) líneas interiores de contorno de 2 px de alto (cuello): la de abajo pasa a contorno interior
    for (let j = 1; j < H - 2; j++) for (let i = 0; i < W; i++) {
      if (g[j][i] === C.o && g[j + 1][i] === C.o && g[j - 1][i] && g[j - 1][i] !== C.o && g[j + 2][i] && g[j + 2][i] !== C.o) g[j + 1][i] = C.i;
    }
    // 3) textura de pelo: solo motas de luz, escasas y con semilla fija (no parpadean entre fotogramas)
    const azar = mulberry32(21);
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      const p = azar();
      if (g[j][i] === C.b && vecinos(j, i).every((v) => v === C.b) && p < 0.04) g[j][i] = C.r;
    }
    // 4) borde de luz: el pelo junto al contorno de arriba y de la izquierda se aclara (volumen)
    for (let j = 1; j < H; j++) for (let i = 1; i < W; i++) {
      if (g[j][i] === C.b && (g[j - 1][i] === C.o || g[j][i - 1] === C.o) && (j + i) % 2 === 0) g[j][i] = C.l;
    }
    // 5) contorno selectivo: junto a la luz, el contorno pasa al marrón cálido
    for (let j = 0; j < H - 1; j++) for (let i = 0; i < W - 1; i++) {
      if (g[j][i] === C.o && (g[j + 1][i] === C.l || g[j][i + 1] === C.l)) g[j][i] = C.i;
    }
    // 6) ojos: pupila en rendija de 1 px, iris en dos tonos (oscuro arriba) y brillo
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      if (g[j][i] === C.p && g[j][i - 1] === C.p && g[j][i + 1] !== C.p) g[j][i] = C.e;
    }
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      if (g[j][i] === C.e && g[j - 1][i] !== C.e && g[j - 1][i] !== C.h) g[j][i] = "#a99a32";
      if (g[j][i] === C.e && g[j][i + 1] === C.p && g[j - 1][i] !== C.e && g[j - 1][i] !== "#a99a32") g[j][i] = C.h;
    }
    // 8) zarpas: separación de los dedos en las zonas crema de las dos últimas filas con pelo
    for (let j = H - 6; j < H; j++) for (let i = 1; i < W - 1; i++) {
      if (g[j][i] === C.c && g[j][i - 1] === C.c && g[j][i + 1] === C.c && i % 3 === 0 && g[j - 1][i] !== C.c) g[j][i] = C.q;
    }
    // 9) bigotes finos desde la nariz (el rosa más bajo de la cabeza)
    let nariz = null;
    for (let j = 0; j < Math.min(34, H - 1) && !nariz; j++) for (let i = 0; i < W; i++) {
      // la nariz: el rosa que no es oreja (las orejas llegan hasta la fila ~17)
      if (j > 20 && g[j][i] === C.n && g[j + 1][i] !== C.n) { nariz = [j, i]; break; }
    }
    if (nariz) {
      const [nj, ni] = nariz, cx = ni + 1;
      for (const s of [-1, 1]) for (const [dy, pend] of [[1, -0.25], [3, 0.2]]) {
        for (let k = 0; k < 7; k++) {
          const i = cx + s * (10 + k), j = nj + dy + Math.round(k * pend);
          if (j >= 0 && j < H && i >= 0 && i < W && (!g[j][i] || k > 1)) g[j][i] = "#fff3dc";
        }
      }
    }
    return g;
  }
  function pintar(svg, x, y, g, u) {
    const H = g.length, W = g[0].length;
    for (let j = 0; j < H; j++) {
      let i = 0;
      while (i < W) { // tramos horizontales del mismo color: menos rect en el SVG
        const c = g[j][i];
        if (!c) { i++; continue; }
        let k = i + 1;
        while (k < W && g[j][k] === c) k++;
        rect(svg, x + i * u, y + j * u, (k - i) * u, u, c);
        i = k;
      }
    }
  }
  return { capturar, scale2x, detalle, pintar };
})();

function gatoHD(svg, x, y, { pose = "pie", t = 0, hablando = false, parpadeo = true, espejo = false } = {}, e = 1) {
  const { g, sombra } = HD.capturar((lienzo) => gato(lienzo, 0, 0, { pose, t, hablando, parpadeo, espejo: false }, 1), 34, 34);
  let fino = HD.detalle(HD.scale2x(g));
  // espejo como el de gato(): el píxel px va a 31 - px; la rejilla mide 34 (las patas pueden salir de 32) → 2 de margen
  if (espejo) fino = fino.map((fila) => fila.slice().reverse());
  for (const [sx, sy, w, h, c] of sombra) rect(svg, x + (espejo ? 32 - sx - w : sx) * e, y + sy * e, w * e, h * e, c);
  HD.pintar(svg, espejo ? x - 2 * e : x, y, fino, e / 2);
}

function retratoGatoHD(svg, x, y, { t = 0, hablando = false, parpadeo = true } = {}, e = 1) {
  const { g } = HD.capturar((lienzo) => retratoGato(lienzo, 0, 0, { t, hablando, parpadeo }, 1), 16, 13);
  HD.pintar(svg, x, y, HD.detalle(HD.scale2x(g)), e / 2);
}
