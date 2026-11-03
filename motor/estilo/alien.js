// alien-isolation-ia · el alien en pixel art por código (sprite detallado, Mario 2026-11-02). Dibujo propio: cabeza
// alargada con reflejo, dientes, costillas, tubos dorsales, patas digitígradas y cola con punta. Determinista (todo desde t).
// alien(svg, x, y, { pose, t, espejo, luz }, escala) → (x, y) = esquina sup. izq. de una caja de 66×64 px de sprite; mira a la izquierda.
// Poses: "andar" · "quieto" · "agachado" · "sisear" (boca abierta y mandíbula interior) · "huir" (agachado y de espaldas al fuego).
// luz: color del contorno de luz de 1 px en el lomo, la cabeza y las patas (rojo de emergencia, relámpago…), para
// que la silueta no se pierda en lo oscuro. Necesita pixel.js (rect).

const ALIEN_COLOR = {
  o: "#04050a", // contorno
  c: "#1b212c", // cuerpo
  m: "#2b3341", // volúmenes
  f: "#121722", // extremidades lejanas
  l: "#46526a", // luz sobre el caparazón
  b: "#9fb0cc", // brillo especular de la cabeza
  d: "#d9d1b2", // dientes
  k: "#5c1f2b", // boca
  v: "#9fd8e0", // baba
};

// Trazo grueso de (x0,y0) a (x1,y1) en px de sprite: contorno y relleno
function alienTrazo(p, x0, y0, x1, y1, grosor, color, conContorno = true) {
  const pasos = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (const [g, c] of conContorno ? [[grosor + 2, ALIEN_COLOR.o], [grosor, color]] : [[grosor, color]]) {
    for (let k = 0; k <= pasos; k++) {
      const px = Math.round(x0 + ((x1 - x0) * k) / pasos), py = Math.round(y0 + ((y1 - y0) * k) / pasos);
      p(px - Math.floor(g / 2), py - Math.floor(g / 2), g, g, c);
    }
  }
}

function alienPierna(p, cadera, paso, lejana) {
  // Digitígrada y siempre con los dedos en el suelo (y = 62), aunque la cadera baje
  const [hx, hy] = cadera, c = lejana ? ALIEN_COLOR.f : ALIEN_COLOR.c, largo = 62 - hy;
  const rodilla = [hx - 6 + paso, hy + Math.round(largo * 0.4)], tobillo = [hx + 2 + paso, hy + Math.round(largo * 0.78)], dedos = [hx - 5 + paso * 2, 62];
  alienTrazo(p, hx, hy, ...rodilla, 5, c); alienTrazo(p, ...rodilla, ...tobillo, 3, c); alienTrazo(p, ...tobillo, ...dedos, 2, c);
  if (!lejana) p(rodilla[0] - 1, rodilla[1] - 1, 2, 2, ALIEN_COLOR.m);
}

function alienBrazo(p, hombro, alcance, lejana) {
  const [sx, sy] = hombro, c = lejana ? ALIEN_COLOR.f : ALIEN_COLOR.c;
  const codo = [sx - 8 + alcance, sy + 10], muneca = [sx - 10 + alcance * 2, sy + 20];
  alienTrazo(p, sx, sy, ...codo, 3, c); alienTrazo(p, ...codo, ...muneca, 3, c);
  for (let k = -1; k <= 1; k++) alienTrazo(p, ...muneca, muneca[0] - 2 + k * 2, muneca[1] + 5, 1, c);
}

function alien(svg, x, y, { pose = "quieto", t = 0, espejo = false, luz = null } = {}, e = 2) {
  if (espejo) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${x + 66 * e} ${y}) scale(-1 1)`);
    svg.appendChild(g);
    return alien(g, 0, 0, { pose, t, espejo: false, luz }, e);
  }
  const p = (sx, sy, w, h, c) => rect(svg, x + sx * e, y + sy * e, w * e, h * e, c);
  const bajo = pose === "agachado" || pose === "huir" ? 8 : 0;
  const respira = pose === "andar" ? 0 : Math.floor(t / 0.6) % 2;
  const fase = pose === "andar" ? [0, 2, 0, -2][Math.floor(t / 0.18) % 4] : 0;
  const cadera = [38, 36 + bajo], hombro = [25, 20 + bajo + respira];

  // Cola por detrás: sale de la cadera, ondula a escalones y acaba en punta
  const ondula = Math.floor(t / 0.2) % 6;
  const cola = [];
  for (let k = 0; k <= 18; k++) cola.push([cadera[0] + 2 + Math.round(k * 1.25), cadera[1] + 3 + Math.round(k * 0.7 + Math.sin(k / 3 + ondula) * 2)]);
  cola.forEach(([cx, cy], k) => alienTrazo(p, cx, cy, cx, cy, k < 8 ? 3 : 2, ALIEN_COLOR.m));
  const [px, py] = cola[cola.length - 1];
  p(px + 1, py - 1, 3, 1, ALIEN_COLOR.o); p(px + 2, py, 3, 1, ALIEN_COLOR.l); p(px + 4, py + 1, 2, 1, ALIEN_COLOR.o);

  // Extremidades lejanas (más oscuras)
  alienPierna(p, [cadera[0] + 2, cadera[1]], -fase, true);
  alienBrazo(p, [hombro[0] + 3, hombro[1] + 2], pose === "sisear" ? -2 : 1, true);

  // Torso: del hombro a la cadera, con costillas
  alienTrazo(p, ...hombro, ...cadera, 8, ALIEN_COLOR.c);
  for (let k = 0; k < 4; k++) {
    const rx = hombro[0] + 2 + k * 2, ry = hombro[1] + 2 + k * 3;
    p(rx - 3, ry, 5, 1, ALIEN_COLOR.m);
  }
  // Tubos dorsales
  for (let k = 0; k < 4; k++) alienTrazo(p, hombro[0] + 4 + k * 2, hombro[1] - 1 + k, hombro[0] + 10 + k * 3, hombro[1] - 7 + k * 2, 1, ALIEN_COLOR.m);

  // Cuello y cabeza alargada hacia atrás y arriba: estrecha en la cara, ancha en la cúpula y redonda en la nuca
  const cara = [9, 17 + bajo + respira], nuca = [44, 1 + bajo + respira];
  alienTrazo(p, hombro[0], hombro[1], cara[0] + 9, cara[1] + 2, 4, ALIEN_COLOR.c);
  const N = 30, punto = (k) => [Math.round(cara[0] + ((nuca[0] - cara[0]) * k) / N), Math.round(cara[1] + ((nuca[1] - cara[1]) * k) / N - Math.sin((k / N) * Math.PI) * 3)];
  const grosor = (k) => 5 + Math.round(4 * Math.sin(Math.min(1, (k + 3) / N) * Math.PI * 0.85));
  for (const [extra, color] of [[2, ALIEN_COLOR.o], [0, ALIEN_COLOR.c]]) for (let k = 0; k <= N; k++) {
    const [cx, cy] = punto(k), g = grosor(k) + extra;
    p(cx - Math.floor(g / 2), cy - Math.floor(g / 2), g, g, color);
  }
  for (let k = 2; k <= N - 2; k++) { const [cx, cy] = punto(k), g = grosor(k); p(cx - Math.floor(g / 2) + 1, cy, g - 2, Math.ceil(g / 2) - 1, ALIEN_COLOR.m); } // mitad baja en sombra
  for (let k = 2; k <= N - 1; k++) { const [cx, cy] = punto(k); p(cx, cy - Math.floor(grosor(k) / 2) - 1, 1, 1, luz || ALIEN_COLOR.l); } // filo de luz
  for (let k = 8; k <= 16; k++) { const [cx, cy] = punto(k); p(cx, cy - Math.floor(grosor(k) / 2) + 2, 2, 1, ALIEN_COLOR.b); } // reflejo
  // Labios y mandíbula bajo la cara
  alienTrazo(p, cara[0] + 1, cara[1] + 3, cara[0] + 11, cara[1] + 5, 2, ALIEN_COLOR.m);
  // Boca: dientes siempre a la vista; al sisear, la mandíbula baja y asoma la interior
  const [fx, fy] = cara;
  if (pose === "sisear") {
    p(fx - 3, fy + 1, 9, 6, ALIEN_COLOR.o); p(fx - 2, fy + 2, 7, 4, ALIEN_COLOR.k);
    for (let k = 0; k < 4; k++) { p(fx - 2 + k * 2, fy + 1, 1, 2, ALIEN_COLOR.d); p(fx - 2 + k * 2, fy + 5, 1, 1, ALIEN_COLOR.d); }
    const sale = [0, 1, 2, 3, 2][Math.floor(t / 0.12) % 5];
    p(fx - 3 - sale, fy + 3, 3 + sale, 2, ALIEN_COLOR.m); p(fx - 4 - sale, fy + 3, 2, 2, ALIEN_COLOR.d);
    if (Math.floor(t / 0.4) % 2 === 0) p(fx, fy + 6, 1, 3, ALIEN_COLOR.v);
  } else {
    p(fx - 3, fy + 1, 9, 4, ALIEN_COLOR.o); p(fx - 2, fy + 2, 7, 2, ALIEN_COLOR.k);
    for (let k = 0; k < 4; k++) { p(fx - 2 + k * 2, fy + 1, 1, 2, ALIEN_COLOR.d); p(fx - 1 + k * 2, fy + 3, 1, 1, ALIEN_COLOR.d); }
  }

  // Contorno de luz (por detrás de las extremidades cercanas)
  if (luz) {
    alienTrazo(p, hombro[0] + 5, hombro[1] - 3, cadera[0] + 5, cadera[1] - 3, 1, luz, false); // borde del lomo
    alienTrazo(p, cadera[0] + 2, cadera[1] + 1, cadera[0] - 2 + fase, cadera[1] + Math.round((62 - cadera[1]) * 0.4) - 1, 1, luz, false);
    cola.slice(0, 12).forEach(([cx, cy]) => p(cx, cy - 2, 1, 1, luz));
  }
  // Extremidades cercanas
  alienPierna(p, cadera, fase, false);
  alienBrazo(p, [hombro[0] + 1, hombro[1] + 3], pose === "sisear" ? -3 : pose === "andar" ? fase : 0, false);
}
