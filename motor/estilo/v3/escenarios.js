// Estilo v3 · escenarios a 12 px (lienzo de 90×160 unidades por pantalla), simples y grandes, con profundidad de campo:
// capas = { lejos (desenfocada), medio (nítida), brillo (luces con bloom), delante (suelo cercano, desenfocado) }.
// escenario3(nombre, capas, t, { suelo, mesa }) · nombres: "laboratorio" · "servidores" · "despacho" · "azotea".
// Movimiento de fondo «vivo pero tranquilo» (3-4 cosas por escenario). Necesita pixel.js y v3/props.js.
const W3 = 90, H3 = 160;

// Cono de luz escalonado desde (cx, y0) hasta y1, que se abre a razón de `abre` unidades por fila (en la capa de brillo)
function cono3(brillo, cx, y0, y1, color, abre = 0.45) {
  for (let y = y0; y < y1; y += 2) { const a = Math.round(2 + (y - y0) * abre); rect(brillo, cx - a, y, a * 2, 2, color); }
}
// Motas de polvo en una luz (en la capa de brillo: se ven como polvo, no como píxeles sueltos)
function motas3(brillo, t, cx, y0, w, h, semilla, n = 5) {
  const azar = mulberry32(semilla);
  for (let k = 0; k < n; k++) {
    const bx = cx - w / 2 + azar() * w, fase = azar();
    rect(brillo, Math.round(bx + Math.sin(t * 0.8 + fase * 6)), Math.round(y0 + h - ((t * 2 + fase * h) % h)), 1, 1, "#ffe9b8");
  }
}

function laboratorio3({ lejos, medio, brillo, delante }, t, { suelo, mesa }) {
  // Pared de azulejos (lejos)
  bandas(lejos, 0, suelo, ["#17303a", "#1a3540", "#1d3b47", "#20414e"]);
  for (let y = 8; y < mesa; y += 6) rect(lejos, 0, y, W3, 1, "#24485a");
  for (let x = 3; x < W3; x += 6) rect(lejos, x, 8, 1, mesa - 8, "#1b3a46");
  // Ventana con la ciudad de noche y un avión que la cruza (lejos)
  const vx = 60, vy = 30;
  rect(lejos, vx, vy, 26, 24, "#0b1022");
  const azar = mulberry32(31);
  for (let k = 0; k < 5; k++) {
    const bh = 6 + Math.floor(azar() * 12), bx = vx + 1 + k * 5;
    rect(lejos, bx, vy + 24 - bh, 4, bh, "#1b2142");
    for (let j = 1; j < bh - 1; j += 3) if (azar() < 0.6) rect(lejos, bx + 1, vy + 24 - bh + j, 1, 1, "#f2c14e");
  }
  const ax = vx + Math.floor(((t % 12) / 12) * 40) - 7;
  if (ax >= vx && ax < vx + 25) { rect(lejos, ax, vy + 5, 2, 1, "#c9d2ff"); if (Math.floor(t / 0.4) % 2 === 0) rect(lejos, ax + 2, vy + 5, 1, 1, "#e0454f"); }
  rect(medio, vx - 1, vy - 1, 28, 1, "#0d1418"); rect(medio, vx - 1, vy + 24, 28, 1, "#0d1418");
  rect(medio, vx - 1, vy, 1, 24, "#0d1418"); rect(medio, vx + 26, vy, 1, 24, "#0d1418"); rect(medio, vx + 12, vy, 1, 24, "#0d1418");
  // Estante de reactivos bajo la ventana, con una burbuja que sube por cada bote
  rect(lejos, vx - 2, vy + 33, 30, 1, P3.maderaSombra);
  ["#1fd69a", "#ff8a3d", "#5b8cff", "#e0454f", "#f2c14e", "#c07ad8"].forEach((c, k) => {
    bote3(lejos, vx + k * 5, vy + 28, c);
    const sube = Math.floor(((t + k * 0.37) % 1.6) / 0.4);
    if (sube < 3) rect(lejos, vx + k * 5 + 1, vy + 31 - sube, 1, 1, "#f5f7fb");
  });
  // Lámpara de techo que se balancea, con cono de luz cálida y polvo
  const v = [0, 1, 0, -1][Math.floor(t / 0.9) % 4], lx = 45 + v;
  rect(medio, 45, 0, 1, 7, "#0d1418"); rect(medio, lx - 4, 7, 8, 2, "#2b3b44"); rect(medio, lx - 4, 7, 8, 1, "#3e5260");
  rect(medio, lx - 1, 9, 2, 1, "#fff1c4");
  cono3(brillo, lx, 10, suelo, "#5a4630", 0.32);
  motas3(brillo, t, lx, 12, 16, 14, 77);
  // Mesa de laboratorio (medio)
  rect(medio, 0, mesa, W3, 2, P3.maderaLuz); rect(medio, 0, mesa + 2, W3, 1, P3.maderaSombra);
  for (const x of [3, 84]) { rect(medio, x, mesa + 3, 3, suelo - mesa - 3, P3.maderaSombra); rect(medio, x, mesa + 3, 1, suelo - mesa - 3, P3.madera); }
  // Suelo de baldosas (delante, desenfocado)
  rect(delante, 0, suelo, W3, H3 - suelo, "#0f1a20");
  for (let y = suelo; y < H3; y += 4) for (let x = ((y - suelo) / 4) % 2 ? 0 : 4; x < W3; x += 8) rect(delante, x, y, 4, 4, "#14242c");
}

function servidores3({ lejos, medio, brillo, delante }, t, { suelo }) {
  bandas(lejos, 0, suelo, ["#0f1326", "#12172d", "#151b34", "#181f3b"]);
  // Racks del fondo con LED que parpadean y un barrido de luz lento
  for (let k = 0; k < 9; k++) {
    const x = 1 + k * 10;
    rect(lejos, x, 22, 8, suelo - 28, "#1f2540"); rect(lejos, x, 22, 1, suelo - 28, "#2b3358");
    const azar = mulberry32(50 + k);
    for (let y = 25; y < suelo - 8; y += 3) {
      rect(lejos, x + 2, y, 4, 1, "#2b3358");
      const fase = azar(), c = ["#1fd69a", "#5b8cff", "#ff8a3d"][Math.floor(azar() * 3)];
      if (Math.floor(t * 2.5 + fase * 7) % 3 !== 0) rect(lejos, x + 6, y, 1, 1, c);
    }
  }
  rect(brillo, Math.floor((t * 8) % (W3 + 20)) - 10, 22, 3, suelo - 28, "#3d68ba");
  // Techo: tiras de luz y cable con paquetes de datos; baliza naranja
  for (let x = 4; x < W3; x += 22) { rect(medio, x, 4, 12, 1, "#cdd8ff"); rect(brillo, x - 2, 2, 16, 5, "#5b8cff"); }
  rect(medio, 0, 1, W3, 1, "#2a3a6a");
  for (let k = 0; k < 3; k++) { const px = Math.floor((t * 15 + k * 31) % W3); rect(medio, px, 1, 2, 1, "#9fd8e0"); rect(brillo, px - 1, 0, 4, 3, "#5b8cff"); }
  rect(medio, 43, 8, 4, 2, "#2b2420");
  if (Math.floor(t / 0.5) % 2 === 0) { rect(medio, 44, 8, 2, 1, "#ff8a3d"); rect(brillo, 41, 6, 8, 6, "#ff8a3d"); }
  // Racks cercanos a los lados (medio) con ventilador que gira
  for (const x of [0, 82]) {
    rect(medio, x, suelo - 40, 8, 40, P3.contorno); rect(medio, x + 1, suelo - 39, 6, 38, P3.metal); rect(medio, x + 1, suelo - 39, 1, 38, P3.metalLuz);
    const f = Math.floor(t / 0.06) % 2;
    rect(medio, x + 2, suelo - 6, 4, 4, P3.metalSombra); rect(medio, x + 3 + f, suelo - 5, 1, 2, P3.gris); rect(medio, x + 2 + (1 - f) * 2, suelo - 4, 1, 1, P3.gris);
  }
  // Franja de aviso y suelo técnico (delante) con cable y paquetes verdes
  for (let x = 0; x < W3; x += 4) { rect(medio, x, suelo - 1, 2, 1, "#f2c14e"); rect(medio, x + 2, suelo - 1, 2, 1, "#1a1f33"); }
  rect(delante, 0, suelo, W3, H3 - suelo, "#0c1020");
  for (let x = 0; x < W3; x += 7) rect(delante, x, suelo, 1, H3 - suelo, "#151b34");
  for (let y = suelo + 3; y < H3; y += 7) rect(delante, 0, y, W3, 1, "#151b34");
  const px = 10 + Math.floor((t * 11) % 70); rect(delante, px, suelo + 2, 2, 1, "#1fd69a");
}

function despacho3({ lejos, medio, brillo, delante }, t, { suelo, mesa }) {
  bandas(lejos, 0, suelo, ["#2a1e19", "#30231c", "#36281f", "#3c2c22"]);
  // Estanterías con libros (lejos)
  const colores = ["#c0504a", "#4a6fb0", "#4a9a6a", "#c9a84a", "#8a5ab0", "#d07a3a"];
  const azar = mulberry32(61);
  for (const x0 of [1, 61]) {
    for (let fila = 0; fila < 5; fila++) {
      const yb = 16 + fila * 14;
      rect(lejos, x0, yb + 12, 28, 1, "#4a3526");
      for (let x = x0 + 1; x < x0 + 27;) { const w = 1 + Math.floor(azar() * 2), h = 7 + Math.floor(azar() * 4); rect(lejos, x, yb + 12 - h, w, h, colores[Math.floor(azar() * 6)]); x += w + (azar() < 0.2 ? 1 : 0); }
    }
  }
  // Ventilador de techo y reloj de pared con segundero
  rect(medio, 45, 0, 1, 3, "#2b2420"); rect(medio, 44, 3, 3, 1, "#4a3526");
  const g = (Math.floor(t / 0.08) % 4) * (Math.PI / 4);
  for (const a of [g, g + Math.PI]) linea(medio, 45, 4, 45 + Math.round(Math.cos(a) * 8), 4 + Math.round(Math.sin(a)), "#5a3b26");
  const ry = 12;
  rect(medio, 42, ry - 3, 7, 7, "#2b2420"); rect(medio, 43, ry - 2, 5, 5, "#e9e1cf");
  rect(medio, 45, ry - 1, 1, 2, "#2b1a10");
  const s = (Math.floor(t) % 4); rect(medio, 45 + [0, 1, 0, -1][s], ry + [-1, 0, 1, 0][s], 1, 1, "#e0454f");
  // Mesa (medio) y lámpara con luz cálida
  rect(medio, 0, mesa, W3, 2, "#7a5236"); rect(medio, 0, mesa + 2, W3, 1, "#5a3b26");
  const lx = 70;
  rect(medio, lx, mesa - 1, 5, 1, "#2b2420"); rect(medio, lx + 2, mesa - 9, 1, 8, "#2b2420"); rect(medio, lx - 1, mesa - 12, 7, 3, "#c9a84a"); rect(medio, lx - 1, mesa - 12, 7, 1, "#f2d27a");
  cono3(brillo, lx + 2, mesa - 9, mesa, "#5a4428", 0.9);
  rect(brillo, lx - 6, mesa - 2, 18, 2, "#6a5232");
  motas3(brillo, t, lx + 2, mesa - 12, 10, 10, 66, 3);
  // Suelo de madera (delante)
  rect(delante, 0, suelo, W3, H3 - suelo, "#1e1511");
  for (let y = suelo + 2; y < H3; y += 3) rect(delante, 0, y, W3, 1, "#2a1d16");
}

function azotea3({ lejos, medio, brillo, delante }, t, { suelo }) {
  bandas(lejos, 0, suelo, ["#0e1534", "#121a3d", "#171f46", "#1d2350", "#262558", "#30285e"]);
  const azar = mulberry32(71);
  for (let k = 0; k < 18; k++) { const x = Math.floor(azar() * W3), y = Math.floor(azar() * 40), fase = azar(); if (Math.floor(t * 1.5 + fase * 8) % 5 !== 0) rect(medio, x, y, 1, 1, azar() < 0.3 ? "#f2c14e" : "#c9d2ff"); }
  // Estrella fugaz cada 5 s
  const fase = t % 5;
  if (fase < 0.4) { const p = Math.floor(fase / 0.08), sx = 20 + p * 4, sy = 6 + p * 2; rect(medio, sx, sy, 1, 1, "#f5f7fb"); for (let k = 1; k <= 3 - Math.floor(p / 2); k++) rect(medio, sx - k, sy - Math.ceil(k / 2), 1, 1, "#8a93c6"); }
  // Luna con brillo y nubes que pasan por delante
  disco(brillo, 79, 12, 8, "#f5f7fb");
  disco(medio, 79, 12, 4, "#e9e6d8"); rect(medio, 80, 10, 1, 1, "#cfcbbb"); rect(medio, 77, 13, 1, 1, "#cfcbbb");
  for (const [y, vel, d] of [[20, 1.6, 0], [14, 1, 50]]) {
    const nx = Math.floor((t * vel + d) % (W3 + 24)) - 16;
    rect(medio, nx + 2, y - 1, 7, 1, "#5a6098"); rect(medio, nx, y, 12, 2, "#3e4580"); rect(medio, nx + 1, y + 2, 9, 1, "#2c3266");
  }
  // Avión con luz intermitente
  const avx = W3 + 3 - Math.floor(((t % 20) / 20) * (W3 + 10));
  rect(medio, avx, 10, 3, 1, "#8a93c6"); if (Math.floor(t / 0.5) % 2 === 0) rect(medio, avx + 3, 10, 1, 1, "#e0454f");
  // Ciudad lejana (desenfocada) y cercana con ventanas que se encienden
  for (const [capa, base, color, sem, luz] of [[lejos, suelo - 14, "#1c2448", 72, "#8a6a3a"], [medio, suelo - 3, "#0e1224", 73, "#f2c14e"]]) {
    const a = mulberry32(sem);
    for (let x = -1; x < W3;) {
      const w = 5 + Math.floor(a() * 6), h = 10 + Math.floor(a() * 24);
      rect(capa, x, base - h, w, h + 4, color);
      for (let yy = base - h + 2; yy < base - 1; yy += 3) for (let xx = x + 1; xx < x + w - 1; xx += 2) { const f = a(); if (f < 0.45 && Math.floor(t / 2 + f * 9) % 6 !== 0) rect(capa, xx, yy, 1, 1, luz); }
      x += w + 1;
    }
  }
  // Murciélago que cruza la ciudad
  const mx = Math.floor(((t % 14) / 9) * (W3 + 8)) - 4, my = suelo - 24 + Math.round(Math.sin(t * 3) * 2);
  if (mx < W3 + 4) { const up = Math.floor(t / 0.15) % 2 === 0; rect(medio, mx + 1, my, 1, 1, "#0a0c18"); rect(medio, mx, my + (up ? -1 : 1), 1, 1, "#0a0c18"); rect(medio, mx + 2, my + (up ? -1 : 1), 1, 1, "#0a0c18"); }
  // Cornisa con antena que parpadea (medio) y suelo de la azotea (delante)
  rect(medio, 75, suelo - 17, 1, 17, "#262d48"); rect(medio, 72, suelo - 15, 7, 1, "#262d48");
  if (Math.floor(t / 0.8) % 2 === 0) { rect(medio, 75, suelo - 18, 1, 1, "#e0454f"); rect(brillo, 73, suelo - 20, 5, 5, "#e0454f"); }
  rect(medio, 0, suelo, W3, 1, "#3a4366");
  rect(delante, 0, suelo + 1, W3, H3 - suelo, "#151a2c");
  for (let x = 0; x < W3; x += 9) rect(delante, x, suelo + 1, 1, H3 - suelo, "#1d2338");
}

function escenario3(nombre, capas, t, opciones) {
  ({ laboratorio: laboratorio3, servidores: servidores3, despacho: despacho3, azotea: azotea3 })[nombre](capas, t, opciones);
}
