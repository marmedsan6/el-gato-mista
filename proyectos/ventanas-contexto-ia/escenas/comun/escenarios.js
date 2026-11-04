// ventanas-contexto-ia · escenarios v3 a 12 px que no están en motor/estilo/v3/escenarios.js: versiones de 160×90 para el
// largo (despacho, servidores, laboratorio y azotea) y la fiesta, que vale para los dos formatos (mide su lienzo).
// Mismas capas que los de motor: { lejos (desenfocada), medio, brillo (bloom), delante (suelo cercano, desenfocado) }.
// 3-4 cosas siempre en movimiento, tranquilas. Necesita pixel.js, v3/props.js y v3/escenarios.js (cono3, motas3).

// Ancho y alto del lienzo (vale también para un grupo desplazado dentro de él)
const medidas = (svg) => { const c = cajaLienzo(svg); return [c.width, c.height]; };

// Despacho de 160×90: estanterías al fondo, reloj, ventilador y una mesa larga que cruza el plano. La mesa se ve un poco
// desde arriba (tablero de `fondoMesa` unidades) para que los papeles se lean encima. MISTA, en el tercio izquierdo.
function despachoH({ lejos, medio, brillo, delante }, t, { suelo, mesa, fondoMesa = 12, mesaX = 44 }) {
  const [W, H] = medidas(lejos);
  bandas(lejos, 0, suelo, ["#2a1e19", "#30231c", "#36281f", "#3c2c22"]);
  const colores = ["#c0504a", "#4a6fb0", "#4a9a6a", "#c9a84a", "#8a5ab0", "#d07a3a"];
  const azar = mulberry32(61);
  for (const x0 of [2, 52, 104]) {
    for (let fila = 0; fila < 3; fila++) {
      const yb = 6 + fila * 12;
      rect(lejos, x0, yb + 10, 50, 1, "#4a3526");
      for (let x = x0 + 1; x < x0 + 48;) { const w = 1 + Math.floor(azar() * 2), h = 6 + Math.floor(azar() * 4); rect(lejos, x, yb + 10 - h, w, h, colores[Math.floor(azar() * 6)]); x += w + (azar() < 0.2 ? 1 : 0); }
    }
  }
  // Ventilador de techo y reloj con segundero
  rect(medio, 80, 0, 1, 2, "#2b2420"); rect(medio, 79, 2, 3, 1, "#4a3526");
  const g = (Math.floor(t / 0.08) % 4) * (Math.PI / 4);
  for (const a of [g, g + Math.PI]) linea(medio, 80, 3, 80 + Math.round(Math.cos(a) * 9), 3 + Math.round(Math.sin(a)), "#5a3b26");
  const rx = 66, ry = 10;
  rect(medio, rx - 3, ry - 3, 7, 7, "#2b2420"); rect(medio, rx - 2, ry - 2, 5, 5, "#e9e1cf"); rect(medio, rx, ry - 1, 1, 2, "#2b1a10");
  const s = Math.floor(t) % 4; rect(medio, rx + [0, 1, 0, -1][s], ry + [-1, 0, 1, 0][s], 1, 1, "#e0454f");
  // Mesa: tablero visto desde arriba (claro), canto (oscuro) y patas
  const fin = W - 4;
  rect(medio, mesaX, mesa - fondoMesa, fin - mesaX, fondoMesa, "#8a5e3e");
  rect(medio, mesaX, mesa - fondoMesa, fin - mesaX, 1, "#a87650");
  for (let y = mesa - fondoMesa + 3; y < mesa; y += 4) rect(medio, mesaX + 2, y, fin - mesaX - 4, 1, "#7d5537"); // vetas
  rect(medio, mesaX, mesa, fin - mesaX, 3, "#5a3b26"); rect(medio, mesaX, mesa, fin - mesaX, 1, "#6b4a32");
  for (const x of [mesaX + 2, fin - 5]) { rect(medio, x, mesa + 3, 3, suelo - mesa - 3, "#4a3526"); rect(medio, x, mesa + 3, 1, suelo - mesa - 3, "#5a3b26"); }
  // Lámpara de pie a la derecha, con cono cálido sobre la mesa y polvo
  const lx = W - 16;
  rect(medio, lx, 10, 1, mesa - fondoMesa - 10, "#2b2420"); rect(medio, lx - 4, 7, 9, 3, "#c9a84a"); rect(medio, lx - 4, 7, 9, 1, "#f2d27a");
  cono3(brillo, lx, 10, mesa, "#5a4428", 0.9);
  motas3(brillo, t, lx, 12, 14, mesa - 16, 66, 4);
  // Suelo de madera (delante)
  rect(delante, 0, suelo, W, H - suelo, "#1e1511");
  for (let y = suelo + 2; y < H; y += 3) rect(delante, 0, y, W, 1, "#2a1d16");
}

// Fiesta: sala violeta con guirnaldas que se mecen, bola de espejos que reparte motas de luz y pista a cuadros.
// Los invitados (tokens) los dibuja la escena; aquí solo el sitio.
function fiesta({ lejos, medio, brillo, delante }, t, { suelo }) {
  const [W, H] = medidas(lejos);
  bandas(lejos, 0, suelo, ["#1d1430", "#221838", "#281c41", "#2d204a"]);
  // Ventanas con cortinas al fondo (lejos)
  for (let x = 8; x < W - 8; x += 40) { rect(lejos, x, 14, 18, 22, "#120d22"); rect(lejos, x - 2, 12, 4, 26, "#4a2a5a"); rect(lejos, x + 16, 12, 4, 26, "#4a2a5a"); }
  // Guirnaldas: banderines en catenaria que se mecen a escalones
  const colores = ["#ff8a3d", "#1fd69a", "#5b8cff", "#f2c14e", "#e0454f"];
  const v = [0, 1, 0, -1][Math.floor(t / 0.6) % 4];
  for (let x = W > 100 ? 98 : 0, k = 0; x < W; x += 5, k++) { // en 16:9, a la derecha del rótulo
    const y = 3 + Math.round(4 * Math.sin((x / W) * Math.PI)) + (k % 2 ? v : 0);
    rect(medio, x, y - 1, 5, 1, "#3a2a50");
    rect(medio, x + 1, y, 3, 2, colores[k % 5]); rect(medio, x + 2, y + 2, 1, 1, colores[k % 5]);
  }
  // Bola de espejos que gira (2 fases) y sus motas de luz por la pared
  const bx = Math.round(W / 2), f = Math.floor(t / 0.25) % 2;
  rect(medio, bx, 0, 1, 9, "#2b2238");
  disco(medio, bx, 12, 3, "#9aa6c8");
  for (let k = 0; k < 4; k++) rect(medio, bx - 2 + ((k + f) % 4), 10 + (k % 3), 1, 1, "#f5f7fb");
  disco(brillo, bx, 12, 5, "#8a93c6");
  const azar = mulberry32(91);
  for (let k = 0; k < 9; k++) {
    const x0 = azar() * W, y0 = 16 + azar() * (suelo - 22), vel = 2 + azar() * 3;
    const x = Math.round((x0 + t * vel) % W), c = colores[k % 5];
    rect(brillo, x, Math.round(y0), 2, 2, c);
  }
  // Pista a cuadros (delante) con focos de colores que cambian
  rect(delante, 0, suelo, W, H - suelo, "#140f1f");
  const paso = Math.floor(t / 0.5);
  for (let y = suelo; y < H; y += 4) for (let x = ((y - suelo) / 4) % 2 ? 0 : 4; x < W; x += 8) rect(delante, x, y, 4, 4, (x + y + paso * 4) % 24 === 0 ? "#3a2a5a" : "#1d1530");
  rect(medio, 0, suelo - 1, W, 1, "#3a2a50");
}

// Laboratorio de 160×90 (bancos de pruebas): azulejos, ventana con la ciudad, estante de reactivos y lámpara que se mece
function laboratorioH({ lejos, medio, brillo, delante }, t, { suelo, mesa }) {
  const [W, H] = medidas(lejos);
  bandas(lejos, 0, suelo, ["#17303a", "#1a3540", "#1d3b47", "#20414e"]);
  for (let y = 6; y < mesa; y += 6) rect(lejos, 0, y, W, 1, "#24485a");
  for (let x = 3; x < W; x += 6) rect(lejos, x, 6, 1, mesa - 6, "#1b3a46");
  const vx = 120, vy = 8;
  rect(lejos, vx, vy, 30, 20, "#0b1022");
  const azar = mulberry32(31);
  for (let k = 0; k < 6; k++) {
    const bh = 5 + Math.floor(azar() * 10), bx = vx + 1 + k * 5;
    rect(lejos, bx, vy + 20 - bh, 4, bh, "#1b2142");
    for (let j = 1; j < bh - 1; j += 3) if (azar() < 0.6) rect(lejos, bx + 1, vy + 20 - bh + j, 1, 1, "#f2c14e");
  }
  const ax = vx + Math.floor(((t % 12) / 12) * 44) - 7;
  if (ax >= vx && ax < vx + 29) { rect(lejos, ax, vy + 4, 2, 1, "#c9d2ff"); if (Math.floor(t / 0.4) % 2 === 0) rect(lejos, ax + 2, vy + 4, 1, 1, "#e0454f"); }
  rect(medio, vx - 1, vy - 1, 32, 1, "#0d1418"); rect(medio, vx - 1, vy + 20, 32, 1, "#0d1418");
  rect(medio, vx - 1, vy, 1, 20, "#0d1418"); rect(medio, vx + 30, vy, 1, 20, "#0d1418"); rect(medio, vx + 15, vy, 1, 20, "#0d1418");
  rect(lejos, 4, 26, 34, 1, P3.maderaSombra);
  ["#1fd69a", "#ff8a3d", "#5b8cff", "#e0454f", "#f2c14e", "#c07ad8"].forEach((c, k) => {
    bote3(lejos, 6 + k * 5, 21, c);
    const sube = Math.floor(((t + k * 0.37) % 1.6) / 0.4);
    if (sube < 3) rect(lejos, 7 + k * 5, 24 - sube, 1, 1, "#f5f7fb");
  });
  const v = [0, 1, 0, -1][Math.floor(t / 0.9) % 4], lx = 80 + v;
  rect(medio, 80, 0, 1, 5, "#0d1418"); rect(medio, lx - 4, 5, 8, 2, "#2b3b44"); rect(medio, lx - 4, 5, 8, 1, "#3e5260");
  rect(medio, lx - 1, 7, 2, 1, "#fff1c4");
  cono3(brillo, lx, 8, suelo, "#5a4630", 0.5);
  motas3(brillo, t, lx, 10, 22, 20, 77);
  rect(medio, 0, mesa, W, 2, P3.maderaLuz); rect(medio, 0, mesa + 2, W, 1, P3.maderaSombra);
  for (const x of [44, W - 6]) { rect(medio, x, mesa + 3, 3, suelo - mesa - 3, P3.maderaSombra); rect(medio, x, mesa + 3, 1, suelo - mesa - 3, P3.madera); }
  rect(delante, 0, suelo, W, H - suelo, "#0f1a20");
  for (let y = suelo; y < H; y += 4) for (let x = ((y - suelo) / 4) % 2 ? 0 : 4; x < W; x += 8) rect(delante, x, y, 4, 4, "#14242c");
}

// Azotea de noche en 160×90: estrellas, estrella fugaz, luna con nubes, avión, ciudad en dos planos y antena
function azoteaH({ lejos, medio, brillo, delante }, t, { suelo }) {
  const [W, H] = medidas(lejos);
  bandas(lejos, 0, suelo, ["#0e1534", "#121a3d", "#171f46", "#1d2350", "#262558", "#30285e"]);
  const azar = mulberry32(71);
  for (let k = 0; k < 30; k++) { const x = Math.floor(azar() * W), y = Math.floor(azar() * 30), fase = azar(); if (Math.floor(t * 1.5 + fase * 8) % 5 !== 0) rect(medio, x, y, 1, 1, azar() < 0.3 ? "#f2c14e" : "#c9d2ff"); }
  const fase = t % 5;
  if (fase < 0.4) { const p = Math.floor(fase / 0.08), sx = 40 + p * 4, sy = 4 + p * 2; rect(medio, sx, sy, 1, 1, "#f5f7fb"); for (let k = 1; k <= 3 - Math.floor(p / 2); k++) rect(medio, sx - k, sy - Math.ceil(k / 2), 1, 1, "#8a93c6"); }
  disco(brillo, 140, 10, 8, "#f5f7fb");
  disco(medio, 140, 10, 4, "#e9e6d8"); rect(medio, 141, 8, 1, 1, "#cfcbbb"); rect(medio, 138, 11, 1, 1, "#cfcbbb");
  for (const [y, vel, d] of [[16, 1.6, 0], [10, 1, 80]]) {
    const nx = Math.floor((t * vel + d) % (W + 24)) - 16;
    rect(medio, nx + 2, y - 1, 7, 1, "#5a6098"); rect(medio, nx, y, 12, 2, "#3e4580"); rect(medio, nx + 1, y + 2, 9, 1, "#2c3266");
  }
  const avx = W + 3 - Math.floor(((t % 20) / 20) * (W + 10));
  rect(medio, avx, 7, 3, 1, "#8a93c6"); if (Math.floor(t / 0.5) % 2 === 0) rect(medio, avx + 3, 7, 1, 1, "#e0454f");
  for (const [capa, base, color, sem, luz] of [[lejos, suelo - 10, "#1c2448", 72, "#8a6a3a"], [medio, suelo - 2, "#0e1224", 73, "#f2c14e"]]) {
    const a = mulberry32(sem);
    for (let x = -1; x < W;) {
      const w = 5 + Math.floor(a() * 6), h = 6 + Math.floor(a() * 16);
      rect(capa, x, base - h, w, h + 4, color);
      for (let yy = base - h + 2; yy < base - 1; yy += 3) for (let xx = x + 1; xx < x + w - 1; xx += 2) { const f = a(); if (f < 0.45 && Math.floor(t / 2 + f * 9) % 6 !== 0) rect(capa, xx, yy, 1, 1, luz); }
      x += w + 1;
    }
  }
  rect(medio, 150, suelo - 14, 1, 14, "#262d48"); rect(medio, 147, suelo - 12, 7, 1, "#262d48");
  if (Math.floor(t / 0.8) % 2 === 0) { rect(medio, 150, suelo - 15, 1, 1, "#e0454f"); rect(brillo, 148, suelo - 17, 5, 5, "#e0454f"); }
  rect(medio, 0, suelo, W, 1, "#3a4366");
  rect(delante, 0, suelo + 1, W, H - suelo, "#151a2c");
  for (let x = 0; x < W; x += 9) rect(delante, x, suelo + 1, 1, H - suelo, "#1d2338");
}

// Sala de servidores de 160×90: racks con LED al fondo, tiras de luz y paquetes por el techo, racks cercanos a los lados
function servidoresH({ lejos, medio, brillo, delante }, t, { suelo }) {
  const [W, H] = medidas(lejos);
  bandas(lejos, 0, suelo, ["#0f1326", "#12172d", "#151b34", "#181f3b"]);
  for (let k = 0; k < 16; k++) {
    const x = 1 + k * 10;
    rect(lejos, x, 12, 8, suelo - 16, "#1f2540"); rect(lejos, x, 12, 1, suelo - 16, "#2b3358");
    const azar = mulberry32(50 + k);
    for (let y = 15; y < suelo - 6; y += 3) {
      rect(lejos, x + 2, y, 4, 1, "#2b3358");
      const fase = azar(), c = ["#1fd69a", "#5b8cff", "#ff8a3d"][Math.floor(azar() * 3)];
      if (Math.floor(t * 2.5 + fase * 7) % 3 !== 0) rect(lejos, x + 6, y, 1, 1, c);
    }
  }
  rect(brillo, Math.floor((t * 10) % (W + 20)) - 10, 12, 3, suelo - 16, "#3d68ba");
  for (let x = 6; x < W; x += 26) { rect(medio, x, 4, 14, 1, "#cdd8ff"); rect(brillo, x - 2, 2, 18, 5, "#5b8cff"); }
  rect(medio, 0, 1, W, 1, "#2a3a6a");
  for (let k = 0; k < 4; k++) { const px = Math.floor((t * 15 + k * 41) % W); rect(medio, px, 1, 2, 1, "#9fd8e0"); rect(brillo, px - 1, 0, 4, 3, "#5b8cff"); }
  for (const x of [0, W - 8]) {
    rect(medio, x, suelo - 34, 8, 34, P3.contorno); rect(medio, x + 1, suelo - 33, 6, 32, P3.metal); rect(medio, x + 1, suelo - 33, 1, 32, P3.metalLuz);
    const f = Math.floor(t / 0.06) % 2;
    rect(medio, x + 2, suelo - 6, 4, 4, P3.metalSombra); rect(medio, x + 3 + f, suelo - 5, 1, 2, P3.gris); rect(medio, x + 2 + (1 - f) * 2, suelo - 4, 1, 1, P3.gris);
  }
  for (let x = 0; x < W; x += 4) { rect(medio, x, suelo - 1, 2, 1, "#f2c14e"); rect(medio, x + 2, suelo - 1, 2, 1, "#1a1f33"); }
  rect(delante, 0, suelo, W, H - suelo, "#0c1020");
  for (let x = 0; x < W; x += 7) rect(delante, x, suelo, 1, H - suelo, "#151b34");
  for (let y = suelo + 3; y < H; y += 7) rect(delante, 0, y, W, 1, "#151b34");
  const px = 10 + Math.floor((t * 11) % (W - 20)); rect(delante, px, suelo + 2, 2, 1, "#1fd69a");
}
