// Estilo v6 · piezas reutilizables (ADR 0010). Script clásico; necesita ../pixel.js y ../v5/dibujo.js.
// Vienen del short de NVIDIA (proyectos/nvidia-huang-espionaje/escenas/short/short.js), copiadas tal cual: lo que un
// vídeo dibuja y puede servir a otro se sube aquí en vez de quedarse en su escena.
const C6 = R5.contorno;
const P6 = {
  CARTON: ["#3a2416", "#5c3a22", "#8a5a32", "#b07a46", "#d8a066"],
  ORO: ["#7a5a1a", "#c2862e", "#f2c14e"],
  ROJO: ["#6e1c22", "#a82a33", "#e0454f", "#f27a82"],
  PAPEL: ["#b8ad96", "#d8ceb6", "#efe6d2", "#fbf6ea"],
  CUERO: ["#08090d", "#16181f", "#2a2d38"],
  CANAS: ["#1c1c20", "#34343a", "#5a5a62"],
  NARANJA: [...R5.naranja, "#fff1c4"],
};

// silueta en sombra con su dosier (unos 24×46; pies en yPie): la ejecutiva, siempre sin rasgos (Mario)
function silueta6(svg, x, yPie, t, anda = false) {
  const paso = anda ? Math.floor(t / 0.18) % 2 : 0, y = yPie - 46 + (anda && paso ? -1 : 0), cx = x + 12;
  const O = "#05070b", PELO = "#161a26", ABRIGO = "#232a3c", BORDE = "#8a93c0", CARA = "#2a3040";
  if (!paso) { rect(svg, cx - 5, y + 38, 4, 8, O); rect(svg, cx - 4, y + 38, 2, 7, PELO); rect(svg, cx + 1, y + 38, 4, 8, O); rect(svg, cx + 2, y + 38, 2, 7, PELO); }
  else { linea(svg, cx - 2, y + 38, cx - 6, y + 45, O, 3); linea(svg, cx + 2, y + 38, cx + 6, y + 45, O, 3); }
  for (let j = 0; j < 26; j++) { const a = 6 + Math.floor((j * 4) / 25), yy = y + 13 + j; rect(svg, cx - a - 1, yy, 2 * a + 3, 1, O); rect(svg, cx - a, yy, 2 * a + 1, 1, ABRIGO); rect(svg, cx - a, yy, 1, 1, BORDE); }
  rect(svg, cx - 8, y + 26, 17, 1, PELO);
  rect(svg, cx - 2, y + 10, 5, 4, O); rect(svg, cx - 1, y + 10, 3, 4, CARA);
  elipse5(svg, cx, y + 6, 6, 7, O); elipse5(svg, cx, y + 6, 5, 6, PELO); elipse5(svg, cx + 1, y + 7, 3, 4, CARA);
  rect(svg, cx - 6, y + 7, 2, 8, PELO); rect(svg, cx + 5, y + 7, 2, 8, PELO); rect(svg, cx - 5, y + 2, 1, 8, BORDE);
  rect(svg, cx + 6, y + 18, 9, 13, O); rect(svg, cx + 7, y + 19, 7, 11, P6.ORO[1]); rect(svg, cx + 7, y + 19, 7, 1, P6.ORO[2]); rect(svg, cx + 13, y + 19, 1, 11, P6.ORO[0]);
  rect(svg, cx + 4, y + 15, 3, 13, O); rect(svg, cx + 5, y + 15, 1, 12, ABRIGO);
}
// chip GPU visto desde arriba: patillas doradas, encapsulado de metal y núcleo de la IA que late
function chip6(svg, brillo, x, y, s, t, on = true) {
  for (let k = 3; k < s - 3; k += 3) {
    rect(svg, x + k, y - 3, 2, 3, P6.ORO[2]); rect(svg, x + k, y + s, 2, 3, P6.ORO[1]);
    rect(svg, x - 3, y + k, 3, 2, P6.ORO[2]); rect(svg, x + s, y + k, 3, 2, P6.ORO[1]);
  }
  caja5(svg, x, y, s, s, R5.metal);
  const m = Math.round(s * 0.22), d = s - 2 * m;
  rect(svg, x + m - 1, y + m - 1, d + 2, d + 2, C6);
  const late = on && Math.floor(t * 3) % 2 === 0;
  rect(svg, x + m, y + m, d, d, late ? R5.ia[2] : R5.ia[1]);
  for (let k = 3; k < d; k += 4) { rect(svg, x + m + k, y + m, 1, d, R5.ia[0]); rect(svg, x + m, y + m + k, d, 1, R5.ia[0]); }
  rect(svg, x + m, y + m, Math.round(d * 0.4), 1, R5.ia[4]); rect(svg, x + m, y + m, 1, Math.round(d * 0.4), R5.ia[3]);
  if (on) rect(brillo, x - 4, y - 4, s + 8, s + 8, late ? R5.ia[1] : R5.ia[0]);
}
function cajaChips6(svg, x, y, w = 14, h = 12) {
  caja5(svg, x, y, w, h, P6.CARTON);
  rect(svg, x + 1, y + Math.floor(h / 2) - 1, w - 2, 2, P6.CARTON[1]);
  const cx = x + Math.floor(w / 2) - 2, cy = y + 2;
  rect(svg, cx - 1, cy - 1, 6, 6, C6); rect(svg, cx, cy, 4, 4, R5.ia[2]); rect(svg, cx, cy, 2, 1, R5.ia[4]);
}
// caja fuerte: puerta redonda con pernos y volante que gira a escalones
function boveda6(svg, brillo, cx, cy, r, t, { gira = true, luz = null } = {}) {
  disco(svg, cx, cy, r + 2, C6); disco(svg, cx, cy, r + 1, R5.metal[1]); disco(svg, cx - 1, cy - 1, r, R5.metal[2]);
  disco(svg, cx, cy, r - 4, C6); disco(svg, cx, cy, r - 5, R5.metal[1]); disco(svg, cx - 1, cy - 1, r - 7, R5.metal[2]);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; rect(svg, Math.round(cx + Math.cos(a) * (r - 2)) - 1, Math.round(cy + Math.sin(a) * (r - 2)) - 1, 2, 2, R5.metal[3]); }
  const paso = gira ? Math.floor(t * 4) % 6 : 0;
  for (let k = 0; k < 3; k++) { const a = ((paso / 6) + k / 3) * Math.PI * 2; linea(svg, cx, cy, cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8), R5.metal[3], 2); }
  disco(svg, cx, cy, 3, C6); disco(svg, cx, cy, 2, R5.metal[3]);
  if (luz) { disco(brillo, cx, cy, r + 8, luz); }
}
function lupa6(svg, brillo, x, y, r, t) {
  disco(brillo, x, y, r + 3, R5.ia[1]);
  disco(svg, x, y, r + 1, C6); disco(svg, x, y, r, R5.metal[3]); disco(svg, x, y, r - 2, "#16243c");
  rect(svg, x - Math.floor(r / 2), y - Math.floor(r / 2), 3, 2, R5.ia[3]);
  linea(svg, x + r - 1, y + r - 1, x + r + 7, y + r + 7, C6, 4); linea(svg, x + r, y + r, x + r + 6, y + r + 6, P6.ORO[1], 2);
  if (Math.floor(t * 3) % 2 === 0) rect(svg, x + 1, y + 1, 2, 1, R5.ia[4]);
}
function cheque6(svg, x, y) { // check grande (contorno y 2 tonos)
  [[0, 6], [1, 7], [2, 8], [3, 9], [4, 8], [5, 7], [6, 6], [7, 5], [8, 4], [9, 3], [10, 2], [11, 1]].forEach(([dx, dy]) => {
    rect(svg, x + dx - 1, y + dy - 1, 3, 4, C6);
  });
  [[0, 6], [1, 7], [2, 8], [3, 9], [4, 8], [5, 7], [6, 6], [7, 5], [8, 4], [9, 3], [10, 2], [11, 1]].forEach(([dx, dy]) => {
    rect(svg, x + dx, y + dy, 1, 2, R5.verde[2]); rect(svg, x + dx, y + dy, 1, 1, R5.verde[3]);
  });
}
function farola6(svg, brillo, x, t, su) {
  rect(svg, x, su - 70, 3, 70, C6); rect(svg, x + 1, su - 70, 1, 70, R5.metal[1]);
  rect(svg, x - 4, su - 74, 12, 4, C6); rect(svg, x - 3, su - 73, 10, 2, R5.ventana[1]);
  for (let j = 0; j < 30; j += 2) rect(brillo, x - 3 - Math.floor(j * 0.6), su - 70 + j * 2, 9 + Math.floor(j * 1.2), 2, "#3a2c1c");
}
// persona genérica de busto con chaqueta oscura (Jensen Huang: chaqueta de cuero negra; sin buscar parecido)
function conChaqueta6(svg, x, y, t) {
  persona5(svg, x, y, t, { pelo: P6.CANAS, camisa: P6.CUERO });
  const cx = x + 13;
  for (let j = 0; j < 4; j++) { rect(svg, cx - 4 + j, y + 21 + j, 2, 1, "#101116"); rect(svg, cx + 3 - j, y + 21 + j, 2, 1, "#101116"); }
  for (let j = 0; j < 9; j++) { rect(svg, cx - 5 - Math.floor(j / 2), y + 24 + j, 1, 1, "#4a4e5c"); rect(svg, cx + 5 + Math.floor(j / 2), y + 24 + j, 1, 1, "#2a2d38"); } // solapas con brillo del cuero
}

// ---------- fondo de noche de un mundo ancho: cielo con estrellas, luna y nubes, ciudad lejana, suelo y primer plano ----------
//   const F = fondoNoche6({ L, ANCHO, W, H, N, SU, SX, lunas: [0, 8] });   F.cielo(t); F.suelo(); …estaciones…; F.delante();
// lunas: estaciones sobre las que hay luna. Entre cada par de estaciones, una farola en primer plano que solo cruza en los viajes.
function fondoNoche6({ L, ANCHO, W, H, N, SU, SX, lunas = [0] }) {
  const MW = N * W;
  function cielo(t) {
    const { lejos } = L, AL = ANCHO.lejos;
    const bandas = [...R5.cielo].reverse(), alto = Math.ceil(SU / bandas.length);
    bandas.forEach((c, i) => { rect(lejos, 0, i * alto, AL, alto, c); if (i) tramado5(lejos, 0, i * alto, AL, 2, bandas[i - 1], i); });
    const az = mulberry32(3);
    for (let k = 0; k < 260; k++) {
      const x = Math.floor(az() * AL), y = Math.floor(az() * SU * 0.4), f = az();
      if (Math.floor(t * 2 + f * 7) % 7 !== 0) rect(lejos, x, y, 1, 1, f < 0.3 ? "#f5f7fb" : "#8a93c0");
    }
    lunas.forEach((n) => {
      const lx = Math.round(0.6 * n * W + 60), ly = 92;
      disco(lejos, lx, ly, 10, "#d8d0b4"); disco(lejos, lx - 1, ly - 1, 8, "#f2ecd4"); disco(lejos, lx + 3, ly - 2, 2, "#d8d0b4");
    });
    for (let k = 0; k < 6; k++) { // nubes que cruzan despacio
      const nx = Math.round(((t * 3 + k * 260) % (AL + 80)) - 40), ny = 70 + (k * 37) % 60;
      rect(lejos, nx, ny + 3, 34, 4, "#232848"); rect(lejos, nx + 6, ny, 20, 3, "#232848");
    }
    const azc = mulberry32(21);
    let x = -4;
    while (x < AL) {
      const w = Math.round(10 + azc() * 18), h = Math.round(SU * (0.18 + azc() * 0.3));
      rect(lejos, x, SU - h, w, h, R5.ciudad[1]); rect(lejos, x, SU - h, 1, h, R5.ciudad[2]);
      for (let wy = SU - h + 3; wy < SU; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) if (azc() < 0.16) rect(lejos, wx, wy, 2, 2, R5.ventana[0]);
      x += w + Math.round(1 + azc() * 4);
    }
    rect(lejos, 0, SU, AL, H - SU, "#10131c");
  }
  function suelo() {
    const { medio } = L;
    rect(medio, 0, SU, MW, H - SU, "#141824"); rect(medio, 0, SU, MW, 1, "#2f3a4f");
    for (let x = 0; x < MW; x += 24) rect(medio, x, SU + 3, 12, 1, "#1c2232");
  }
  function delante() {
    const { delante } = L;
    rect(delante, 0, SU + 6, ANCHO.delante, H, "#07090f");
    const az = mulberry32(9);
    for (let x = -4; x < ANCHO.delante; x += 9) disco(delante, x, SU + 8, Math.round(4 + az() * 4), "#05070b");
    for (let n = 0; n < N - 1; n++) { // farola entre cada par de estaciones: solo cruza en los viajes (d = 1,35)
      const x = Math.round(1.35 * (n + 0.5) * W + SX), top = Math.round(SU * 0.32);
      rect(delante, x, top, 6, SU - top, "#04060a"); rect(delante, x - 8, top, 22, 5, "#04060a");
    }
  }
  return { cielo, suelo, delante };
}

// ---------- texto dentro del dibujo: una placa, un cartel o una cabecera con su nombre (es arte, no una etiqueta) ----------
// Press Start 2P a 8 px (1 px de fuente = 1 unidad del lienzo), en mayúsculas. Va en un lienzo SVG del mundo, así que se
// mueve, se amplía y se recorta como cualquier objeto. Con fondo: caja con contorno; sin fondo (fondo: null), solo las letras.
//   placa6(svg, x, y, "MEGASPEED", { color, fondo, borde })  →  ancho total en unidades
function placa6(svg, x, y, texto, { color = "#f5f7fb", fondo = "#0c1016", borde = R5.contorno } = {}) {
  const NS = "http://www.w3.org/2000/svg", MAPA = { "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U" };
  const letras = [...texto.toUpperCase()], ancho = letras.length * 8;
  if (fondo) { rect(svg, x - 1, y - 1, ancho + 6, 14, borde); rect(svg, x, y, ancho + 4, 12, fondo); }
  const t = document.createElementNS(NS, "text");
  t.setAttribute("x", x + 2); t.setAttribute("y", y + 10); t.setAttribute("fill", color);
  t.setAttribute("font-family", "P2P"); t.setAttribute("font-size", "8");
  t.textContent = letras.map((c) => MAPA[c] || c).join("");
  svg.appendChild(t);
  letras.forEach((c, i) => { if (MAPA[c]) { rect(svg, x + 2 + i * 8 + 3, y, 2, 1, color); rect(svg, x + 2 + i * 8 + 2, y + 1, 2, 1, color); } }); // tilde pixel
  return ancho + 4;
}
