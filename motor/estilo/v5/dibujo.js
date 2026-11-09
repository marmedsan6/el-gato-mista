// Estilo v5 · dibujo pixel «HD» a 4 px de salida por píxel de arte (aprobado el 2026-11-09, ADR 0009).
// Necesita pixel.js (rect, linea, disco, mulberry32). Todo en unidades de arte; (x, y) = esquina superior izquierda.
// Contrato seek(t): nada depende del reloj; el azar sale de mulberry32 con semilla.

// Rampas de material (oscuro → claro). Luz arriba a la izquierda.
const R5 = {
  contorno: "#0b0e14",
  hormigon: ["#161b26", "#222a3a", "#2f3a4f", "#43506a", "#5b6a86"],
  labLuz: ["#173a40", "#22545a", "#2f6f72", "#4b9a92", "#9fe0cf"],   // laboratorio encendido (luz fría)
  labApagado: ["#0c141b", "#111c25", "#16242f"],
  oficina: ["#2a1d1c", "#41291f", "#5c3a26", "#7c5232", "#f2c14e"],  // luz cálida
  metal: ["#262b48", "#3a4166", "#5a6390", "#8a93c0"],
  cielo: ["#0a0d1a", "#0e1224", "#131830", "#191e3b", "#1f2445"],
  ciudad: ["#0d1122", "#121831", "#181f3d"],
  ventana: ["#f2c14e", "#ffd98a"],
  ia: ["#1d2f6b", "#3a5fc0", "#5b8cff", "#9fc4ff", "#f5f7fb"],
  naranja: ["#7a3a14", "#c25e22", "#ff8a3d", "#ffb37a"],
  verde: ["#0d5a42", "#13936a", "#1fd69a", "#8ff0c8"],
  piel: ["#a8674a", "#d8946c", "#f2c4a0"],
  pelo: ["#2a1810", "#4a2c1a"],
};

// Sprite de rejilla de caracteres: cada carácter es una clave de la paleta; «.» es transparente.
function sprite5(svg, x, y, filas, paleta, espejo = false) {
  filas.forEach((fila, j) => {
    let k = 0;
    while (k < fila.length) {
      const c = fila[k];
      let n = 1;
      while (k + n < fila.length && fila[k + n] === c) n++;
      if (c !== "." && paleta[c]) {
        const xx = espejo ? x + fila.length - k - n : x + k;
        rect(svg, xx, y + j, n, 1, paleta[c]);
      }
      k += n;
    }
  });
}

// Caja con bisel: cara con rampa vertical en bandas, luz arriba e izquierda y sombra abajo y derecha.
function caja5(svg, x, y, w, h, rampa, { contorno = true } = {}) {
  const n = rampa.length;
  if (contorno) rect(svg, x, y, w, h, R5.contorno);
  const ix = contorno ? x + 1 : x, iy = contorno ? y + 1 : y, iw = contorno ? w - 2 : w, ih = contorno ? h - 2 : h;
  rect(svg, ix, iy, iw, ih, rampa[Math.min(2, n - 1)]);
  rect(svg, ix, iy, iw, 1, rampa[n - 1]);
  rect(svg, ix, iy, 1, ih, rampa[Math.min(3, n - 1)]);
  rect(svg, ix, iy + ih - 1, iw, 1, rampa[0]);
  rect(svg, ix + iw - 1, iy, 1, ih, rampa[1]);
}

// Bandas verticales en escalera (pared iluminada desde arriba): de claro arriba a oscuro abajo.
function pared5(svg, x, y, w, h, rampa) {
  const n = rampa.length, alto = Math.ceil(h / n);
  for (let i = 0; i < n; i++) rect(svg, x, y + i * alto, w, Math.min(alto, h - i * alto), rampa[n - 1 - i]);
}

// Tramado 50 % (ajedrez) para transiciones suaves entre dos tonos sin degradado continuo.
function tramado5(svg, x, y, w, h, color, fase = 0) {
  for (let j = 0; j < h; j++) for (let i = (j + fase) % 2; i < w; i += 2) rect(svg, x + i, y + j, 1, 1, color);
}

// Matraz pequeño (5×7) con líquido y burbuja que sube.
function matraz5(svg, x, y, t, color, sombra, semilla = 1) {
  const C = R5.contorno, V = "#9fd8e0", L = "#e4f7f9";
  rect(svg, x + 1, y, 3, 1, C); rect(svg, x + 2, y + 1, 1, 2, V); rect(svg, x + 1, y + 1, 1, 2, C); rect(svg, x + 3, y + 1, 1, 2, C);
  rect(svg, x, y + 3, 5, 4, C); rect(svg, x + 1, y + 3, 3, 1, V); rect(svg, x + 1, y + 4, 3, 2, color); rect(svg, x + 3, y + 4, 1, 2, sombra);
  rect(svg, x + 1, y + 3, 1, 1, L);
  const fase = (t * 2 + semilla * 0.37) % 1;
  if (fase < 0.75) rect(svg, x + 2, y + 5 - Math.floor(fase * 4), 1, 1, L);
}

// Monitor (w×h) con una gráfica que avanza con t.
function monitor5(svg, x, y, w, h, t, color, semilla = 1) {
  caja5(svg, x, y, w, h, R5.metal);
  rect(svg, x + 2, y + 2, w - 4, h - 4, "#0b1622");
  const azar = mulberry32(semilla), avance = Math.floor(t * 6);
  for (let i = 0; i < w - 4; i++) {
    const v = Math.floor(azar() * (h - 5)), visible = (i + avance) % (w + 2) < w - 3;
    if (visible) rect(svg, x + 2 + i, y + h - 3 - v, 1, 1, color);
  }
  rect(svg, x + Math.floor(w / 2) - 1, y + h, 2, 2, R5.metal[0]);
}

// Brazo robótico de laboratorio: base, dos segmentos y pinza; ángulos en función de t (se mueve siempre).
function brazo5(svg, x, y, t, { largo = 6, fase = 0, color = R5.naranja } = {}) {
  const a1 = -1.2 + Math.sin(t * 1.7 + fase) * 0.35, a2 = 0.9 + Math.sin(t * 2.3 + fase * 1.3) * 0.45;
  const x1 = Math.round(x + Math.cos(a1) * largo), y1 = Math.round(y + Math.sin(a1) * largo);
  const x2 = Math.round(x1 + Math.cos(a1 + a2) * largo), y2 = Math.round(y1 + Math.sin(a1 + a2) * largo);
  caja5(svg, x - 3, y, 7, 3, R5.metal);
  linea(svg, x, y, x1, y1, R5.contorno, 2); linea(svg, x, y, x1, y1, color[2], 1);
  linea(svg, x1, y1, x2, y2, R5.contorno, 2); linea(svg, x1, y1, x2, y2, color[3], 1);
  rect(svg, x1 - 1, y1 - 1, 2, 2, R5.metal[2]);
  rect(svg, x2 - 1, y2, 1, 2, R5.metal[3]); rect(svg, x2 + 1, y2, 1, 2, R5.metal[3]);
}

// Orbe de la IA: núcleo con anillos que giran a escalones y halo en la capa de brillo.
function orbe5(medio, brillo, cx, cy, r, t) {
  disco(brillo, cx, cy, r + 4, R5.ia[1]);
  disco(medio, cx, cy, r, R5.contorno);
  disco(medio, cx, cy, r - 1, R5.ia[2]);
  disco(medio, cx - 1, cy - 1, Math.max(1, r - 3), R5.ia[3]);
  rect(medio, cx - Math.floor(r / 2), cy - Math.floor(r / 2), 2, 2, R5.ia[4]);
  const paso = Math.floor(t * 8) % 8;
  for (let k = 0; k < 3; k++) {
    const a = ((paso + k * 8 / 3) / 8) * Math.PI * 2, rx = r + 3;
    rect(medio, Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * (rx * 0.45)), 2, 1, R5.ia[3]);
  }
}

// Enlace de datos de la IA: línea en escalera de (x0,y0) a (x1,y1) con un paquete que viaja (0..1 = progreso).
function enlace5(medio, brillo, x0, y0, x1, y1, t, fase, encendido) {
  const color = encendido ? R5.ia[2] : R5.ia[0];
  linea(medio, x0, y0, x1, y0, color); linea(medio, x1, y0, x1, y1, color);
  if (!encendido) return;
  const largo = Math.abs(x1 - x0) + Math.abs(y1 - y0), p = ((t * 0.9 + fase) % 1) * largo;
  const dx = Math.abs(x1 - x0), px = p < dx ? x0 + Math.sign(x1 - x0) * p : x1, py = p < dx ? y0 : y0 + Math.sign(y1 - y0) * (p - dx);
  rect(medio, Math.round(px) - 1, Math.round(py) - 1, 2, 2, R5.ia[4]);
  rect(brillo, Math.round(px) - 2, Math.round(py) - 2, 4, 4, R5.ia[3]);
}

// Ruta de datos en escalera por los puntos pts: crece de 0 a 1 desde el primero y, entera, lleva un paquete que la
// recorre en bucle (fase desfasa paquetes de rutas vecinas). Línea en medio; brillo del paquete en la capa de brillo.
function ruta5(medio, brillo, pts, t, fase, crece, color = R5.ia) {
  const segs = [];
  let largo = 0;
  for (let i = 1; i < pts.length; i++) { const s = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); segs.push(s); largo += s; }
  const punto = (d) => { for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) { const f = segs[i] ? d / segs[i] : 0; return [Math.round(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f), Math.round(pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f), i]; } d -= segs[i]; } return [...pts[pts.length - 1], segs.length - 1]; };
  const hasta = Math.round(crece * largo);
  if (hasta <= 0) return;
  const [ex, ey, ei] = punto(hasta);
  for (let i = 0; i < ei; i++) linea(medio, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], color[1]);
  linea(medio, pts[ei][0], pts[ei][1], ex, ey, color[1]);
  if (crece < 1) { rect(medio, ex - 1, ey - 1, 2, 2, color[4]); return; }
  const [px, py] = punto(((t * 0.7 + fase) % 1) * largo);
  rect(medio, px - 1, py - 1, 2, 2, color[4]); rect(brillo, px - 2, py - 2, 4, 4, color[3]);
}

// Destello de aparición a la rejilla (sustituye a los efectos de pixelfx, más finos que el píxel de 4 px): anillo que se
// abre a escalones de 0,075 s y 8 rayos de 2×2; dura 0,45 s desde t0. Devuelve si se ha dibujado.
function destello5(frente, brillo, cx, cy, t, t0, color = R5.ia) {
  const e = t - t0;
  if (e < 0 || e >= 0.45) return false;
  const paso = Math.floor(e / 0.075), rr = 6 + paso * 3, col = paso < 3 ? color[4] : color[3];
  for (let a = 0; a < 24; a++) { const ang = (a / 24) * Math.PI * 2; rect(frente, Math.round(cx + Math.cos(ang) * rr) - 1, Math.round(cy + Math.sin(ang) * rr) - 1, 2, 2, col); }
  for (let a = 0; a < 8; a++) { const ang = (a / 8) * Math.PI * 2 + Math.PI / 8, d = rr + 4; rect(frente, Math.round(cx + Math.cos(ang) * d) - 1, Math.round(cy + Math.sin(ang) * d) - 1, 2, 2, color[2]); }
  rect(brillo, cx - rr - 2, cy - rr - 2, 2 * rr + 4, 2 * rr + 4, color[1]);
  return true;
}

// Elipse rellena por filas (coordenadas enteras): para cabezas, macetas y sombras.
function elipse5(svg, cx, cy, rx, ry, color, desde = -Infinity, hasta = Infinity) {
  for (let dy = -ry; dy <= ry; dy++) {
    const yy = cy + dy;
    if (yy < desde || yy > hasta) continue;
    const dx = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))));
    rect(svg, cx - dx, yy, dx * 2 + 1, 1, color);
  }
}

// Persona de busto (26 unidades de ancho, ~34 de alto; la parte baja queda tras la mesa): pelo, cara sombreada con la
// luz arriba a la izquierda, ojos con brillo y parpadeo, cejas, nariz, boca y camisa con cuello.
function persona5(svg, x, y, t, { piel = ["#a8674a", "#d8946c", "#f2c4a0"], pelo = ["#24140c", "#3a2216", "#5c3826"], camisa = ["#1d2f6b", "#3a5fc0", "#5b8cff"] } = {}) {
  const C = R5.contorno, cx = x + 13;
  // hombros y camisa (trapecio que se ensancha), con pliegues
  for (let j = 0; j < 13; j++) {
    const a = Math.min(13, 6 + j), yy = y + 21 + j;
    rect(svg, cx - a - 1, yy, 2 * a + 3, 1, C);
    rect(svg, cx - a, yy, 2 * a + 1, 1, camisa[1]);
    rect(svg, cx - a, yy, Math.max(1, Math.floor(a * 0.45)), 1, camisa[2]);
    rect(svg, cx + Math.floor(a * 0.55), yy, a - Math.floor(a * 0.55) + 1, 1, camisa[0]);
  }
  rect(svg, cx - 3, y + 21, 7, 1, C);
  for (let j = 0; j < 4; j++) { rect(svg, cx - 4 + j, y + 21 + j, 2, 1, "#e8ecf5"); rect(svg, cx + 3 - j, y + 21 + j, 2, 1, "#c9d0e0"); } // cuello en V
  rect(svg, cx - 7, y + 27, 1, 5, camisa[0]); rect(svg, cx + 6, y + 28, 1, 4, camisa[0]);
  // cuello y orejas
  rect(svg, cx - 3, y + 17, 7, 5, C); rect(svg, cx - 2, y + 17, 5, 4, piel[0]); rect(svg, cx - 2, y + 17, 2, 4, piel[1]);
  // pelo por detrás y cara
  elipse5(svg, cx, y + 9, 10, 10, C); elipse5(svg, cx, y + 9, 9, 9, pelo[1]);
  elipse5(svg, cx, y + 11, 7, 8, C, y + 5); elipse5(svg, cx, y + 11, 6, 7, piel[1], y + 5);
  elipse5(svg, cx - 2, y + 10, 3, 4, piel[2], y + 5); // luz en la mejilla izquierda y la frente
  for (let yy = y + 8; yy <= y + 17; yy++) rect(svg, cx + 4, yy, 2, 1, piel[0]); // sombra a la derecha
  rect(svg, cx - 9, y + 10, 2, 4, C); rect(svg, cx - 8, y + 11, 1, 2, piel[0]); rect(svg, cx + 8, y + 10, 2, 4, C); rect(svg, cx + 8, y + 11, 1, 2, piel[0]);
  // flequillo con borde irregular y brillo del pelo
  rect(svg, cx - 8, y + 1, 17, 5, pelo[1]);
  [[-7, 6, 3], [-4, 6, 2], [-1, 7, 2], [2, 6, 3], [5, 6, 2]].forEach(([dx, yy, w]) => rect(svg, cx + dx, y + yy, w, 1, pelo[0]));
  rect(svg, cx - 5, y + 2, 5, 1, pelo[2]); rect(svg, cx - 6, y + 3, 2, 1, pelo[2]);
  // cejas, ojos (parpadean cada ~3 s a escalones), nariz y boca
  rect(svg, cx - 5, y + 8, 3, 1, pelo[0]); rect(svg, cx + 2, y + 8, 3, 1, pelo[0]);
  const parpadea = (t % 3.1) < 0.12;
  for (const ox of [cx - 5, cx + 2]) {
    if (parpadea) rect(svg, ox, y + 11, 3, 1, C);
    else { rect(svg, ox, y + 10, 3, 2, "#f5f7fb"); rect(svg, ox + 1, y + 10, 2, 2, C); rect(svg, ox + 1, y + 10, 1, 1, "#f5f7fb"); }
  }
  rect(svg, cx, y + 12, 1, 3, piel[0]); rect(svg, cx - 1, y + 15, 2, 1, piel[0]);
  rect(svg, cx - 2, y + 17, 5, 1, "#9c4a3c"); rect(svg, cx - 1, y + 18, 3, 1, piel[0]);
}

// Sprite de 16×16 recoloreado (atlas): { w, h, px: ["#rrggbb" | null, …] } fila a fila.
function atlas5(svg, x, y, s) {
  if (!s) return;
  for (let j = 0; j < s.h; j++) {
    let i = 0;
    while (i < s.w) {
      const c = s.px[j * s.w + i];
      let n = 1;
      while (i + n < s.w && s.px[j * s.w + i + n] === c) n++;
      if (c) rect(svg, x + i, y + j, n, 1, c);
      i += n;
    }
  }
}
