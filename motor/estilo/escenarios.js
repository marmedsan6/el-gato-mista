// Estilo v2 · escenarios pixel ilustrados por bloque (ADR 0007). Deterministas (t + semillas fijas).
// escenario(nombre, capas, t, { W, H, suelo }) pinta en capas = { fondo, medio, brillo } (cada una un <svg>):
//   fondo  → plano lejano (la capa lleva desenfoque en CSS), medio → plano nítido, brillo → luces (bloom).
// Nombres: "laboratorio" · "servidores" · "despacho" · "azotea". `suelo` = y del suelo (px base).
// Necesita pixel.js (rect, bandas, disco, linea, mulberry32) y props.js.

function escenarioLaboratorio({ fondo, medio, brillo }, t, { W, H, suelo, estante = true }) {
  bandas(fondo, 0, suelo, ["#13232b", "#162a33", "#1a313b", "#1e3742"]);
  // Azulejos en la pared
  for (let y = 24; y < suelo - 40; y += 16) rect(fondo, 0, y, W, 1, "#21404b");
  for (let x = 0; x < W; x += 16) rect(fondo, x, 24, 1, suelo - 64, "#1c3842");
  // Ventana con la ciudad de noche (lejos, desenfocada)
  const vx = W - 96, vy = 112;
  rect(fondo, vx, vy, 80, 70, "#0b1022");
  const azar = mulberry32(31);
  for (let k = 0; k < 9; k++) {
    const bw = 6 + Math.floor(azar() * 8), bh = 14 + Math.floor(azar() * 34), bx = vx + 2 + k * 9;
    rect(fondo, bx, vy + 70 - bh, bw, bh, "#1b2142");
    for (let j = 0; j < bh / 6; j++) if (azar() < 0.5) rect(fondo, bx + 2, vy + 72 - bh + j * 6, 2, 2, "#f2c14e");
  }
  rect(medio, vx - 3, vy - 3, 86, 3, "#0d1418"); rect(medio, vx - 3, vy + 70, 86, 3, "#0d1418");
  rect(medio, vx - 3, vy, 3, 70, "#0d1418"); rect(medio, vx + 80, vy, 3, 70, "#0d1418"); rect(medio, vx + 39, vy, 2, 70, "#0d1418");
  // Estante con matraces a la izquierda
  // Estantería de reactivos de colores bajo la ventana (color y vida en la pared)
  if (estante) {
    rect(medio, vx - 4, vy + 92, 88, 3, PROP.maderaOscura); rect(medio, vx - 4, vy + 120, 88, 3, PROP.maderaOscura);
    const colores = ["#1fd69a", "#ff8a3d", "#5b8cff", "#e0454f", "#f2c14e", "#c07ad8", "#1fd69a", "#ff8a3d", "#5b8cff"];
    colores.forEach((c, k) => { propBote(medio, vx + k * 9, vy + 80, c); if (k % 2 === 0) propBote(medio, vx + 2 + k * 9, vy + 106, colores[(k + 3) % 9], { alto: 14 }); });
    // Una burbuja sube por cada bote de la fila de arriba, desfasadas
    colores.forEach((c, k) => {
      const sube = Math.floor(((t + k * 0.37) % 1.6) / 0.2); // 0..7
      if (sube < 6) rect(medio, vx + k * 9 + 3 + (sube % 2), vy + 80 + 10 - sube, 1, 1, "#f5f7fb");
    });
  }
  // Lámpara de techo con luz; se balancea 1 px a pasos (v3: más movimiento de fondo)
  const vaiven = [0, 1, 0, -1][Math.floor(t / 0.7) % 4], lx = Math.floor(W / 2) + vaiven;
  rect(medio, Math.floor(W / 2) - 1, 0, 2, 22, "#0d1418");
  rect(medio, lx - 10, 22, 20, 5, "#2b3b44");
  disco(brillo, lx, 34, 34, "#ffb35c"); // luz cálida
  disco(medio, lx, 30, 4, "#fff1c4");
  motas(medio, t, lx, 32, 40, 24, 77); // solo en el cono de la lámpara, por encima de los rótulos (y < 56)
  // Avión que cruza la ventana una vez cada 12 s, con luz roja intermitente
  const ax = vx + Math.floor(((t % 12) / 12) * 120) - 20;
  if (ax >= vx && ax < vx + 77) {
    rect(fondo, ax, vy + 14, 3, 1, "#c9d2ff");
    if (Math.floor(t / 0.4) % 2 === 0) rect(fondo, ax + 3, vy + 14, 1, 1, "#e0454f");
  }
  // Mesa de laboratorio
  rect(medio, 0, suelo - 40, W, 5, PROP.madera); rect(medio, 0, suelo - 35, W, 2, PROP.maderaOscura);
  for (const x of [10, W - 16]) rect(medio, x, suelo - 33, 6, 33, PROP.maderaOscura);
  // Suelo de baldosas
  rect(medio, 0, suelo, W, H - suelo, "#0f1a20");
  for (let y = suelo; y < H; y += 12) for (let x = ((y - suelo) / 12) % 2 ? 0 : 12; x < W; x += 24) rect(medio, x, y, 12, 12, "#132229");
}

function escenarioServidores({ fondo, medio, brillo }, t, { W, H, suelo }) {
  bandas(fondo, 0, suelo, ["#0f1326", "#12172d", "#151b34", "#181f3b"]);
  // Fila de racks al fondo
  for (let k = 0; k < Math.ceil(W / 30); k++) propServidor(fondo, k * 30 + 3, 70, t, { alto: suelo - 90, semilla: 50 + k });
  // Barrido lento de luz sobre los racks del fondo (v3)
  const barrido = Math.floor((t * 24) % (W + 60)) - 30;
  rect(brillo, barrido, 70, 8, suelo - 90, "#3d68ba");
  // Tiras de luz en el techo y cable con paquetes de datos que corren
  for (let x = 10; x < W; x += 60) { rect(medio, x, 14, 36, 3, "#cdd8ff"); rect(brillo, x - 4, 10, 44, 10, "#5b8cff"); }
  rect(medio, 0, 6, W, 1, "#2a3a6a");
  for (let k = 0; k < 3; k++) { const px = Math.floor((t * 46 + k * 97) % W); rect(medio, px, 5, 3, 3, "#9fd8e0"); rect(brillo, px - 2, 3, 7, 7, "#5b8cff"); }
  // Racks cercanos a los lados, con ventilador que gira
  propServidor(medio, 2, suelo - 120, t, { alto: 120, semilla: 7 });
  propServidor(medio, W - 26, suelo - 120, t, { alto: 120, semilla: 9 });
  for (const fx of [14, W - 14]) ventilador(medio, fx, suelo - 14, t);
  // Acento cálido: baliza naranja y franja de aviso en el borde del suelo
  rect(medio, Math.floor(W / 2) - 6, 26, 12, 6, "#2b2420");
  if (Math.floor(t / 0.5) % 2 === 0) { rect(medio, Math.floor(W / 2) - 4, 27, 8, 4, "#ff8a3d"); disco(brillo, Math.floor(W / 2), 29, 14, "#ff8a3d"); }
  for (let x = 0; x < W; x += 12) rect(medio, x, suelo - 4, 6, 4, "#f2c14e");
  for (let x = 6; x < W; x += 12) rect(medio, x, suelo - 4, 6, 4, "#1a1f33");
  // Suelo técnico con reflejo azul
  rect(medio, 0, suelo, W, H - suelo, "#0c1020");
  for (let x = 0; x < W; x += 20) rect(medio, x, suelo, 1, H - suelo, "#151b34");
  for (let y = suelo + 10; y < H; y += 20) rect(medio, 0, y, W, 1, "#151b34");
  // Cables por el suelo, con paquetes que los recorren
  const yCable = (x) => suelo + 4 + Math.round(Math.sin(x / 9) * 2);
  for (let x = 30; x < W - 30; x++) rect(medio, x, yCable(x), 1, 1, "#2a3a6a");
  for (let k = 0; k < 2; k++) { const px = 30 + Math.floor((t * 34 + k * 105) % (W - 62)); rect(medio, px, yCable(px) - 1, 2, 2, "#1fd69a"); }
}

function escenarioDespacho({ fondo, medio, brillo }, t, { W, H, suelo }) {
  bandas(fondo, 0, suelo, ["#241a16", "#291e19", "#2e221c", "#33261f"]);
  // Estanterías con libros de colores
  const colores = ["#c0504a", "#4a6fb0", "#4a9a6a", "#c9a84a", "#8a5ab0", "#d07a3a"];
  const azar = mulberry32(61);
  for (const [x0, ancho] of [[6, 86], [W - 92, 86]]) {
    for (let fila = 0; fila < 4; fila++) {
      const yb = 60 + fila * 44;
      rect(fondo, x0, yb + 36, ancho, 4, "#4a3526");
      for (let x = x0 + 2; x < x0 + ancho - 4;) {
        const w = 4 + Math.floor(azar() * 4), h = 22 + Math.floor(azar() * 12);
        rect(fondo, x, yb + 36 - h, w, h, colores[Math.floor(azar() * colores.length)]);
        x += w + 1;
      }
    }
  }
  // Mesa con lámpara
  rect(medio, 0, suelo - 40, W, 5, "#7a5236"); rect(medio, 0, suelo - 35, W, 3, "#5a3b26");
  const lx = W - 60;
  rect(medio, lx, suelo - 44, 14, 4, "#2b2420"); rect(medio, lx + 6, suelo - 70, 2, 26, "#2b2420");
  rect(medio, lx - 2, suelo - 78, 18, 8, "#c9a84a");
  disco(brillo, lx + 7, suelo - 66, 24, "#f2c14e");
  motas(medio, t, lx + 7, suelo - 62, 40, 36, 66);
  // Ventilador de techo (aspas a pasos de 22,5°) y reloj de pared con segundero (v3)
  const cx = Math.floor(W / 2);
  rect(medio, cx - 1, 0, 2, 10, "#2b2420"); rect(medio, cx - 3, 10, 6, 3, "#4a3526");
  const giro = (Math.floor(t / 0.06) % 8) * (Math.PI / 8);
  for (const a of [giro, giro + Math.PI]) linea(medio, cx, 12, cx + Math.round(Math.cos(a) * 22), 12 + Math.round(Math.sin(a) * 3), "#5a3b26", 2);
  const ry = 38;
  disco(medio, cx, ry, 8, "#2b2420"); disco(medio, cx, ry, 7, "#e9e1cf");
  for (let h = 0; h < 12; h++) { const a = (h / 12) * Math.PI * 2; rect(medio, cx + Math.round(Math.sin(a) * 6), ry - Math.round(Math.cos(a) * 6), 1, 1, "#6b5a48"); }
  linea(medio, cx, ry, cx + 3, ry - 2, "#2b1a10");
  const s = (Math.floor(t) % 60) / 60 * Math.PI * 2;
  linea(medio, cx, ry, cx + Math.round(Math.sin(s) * 6), ry - Math.round(Math.cos(s) * 6), "#e0454f");
  // Suelo de madera
  rect(medio, 0, suelo, W, H - suelo, "#1e1511");
  for (let y = suelo + 8; y < H; y += 8) rect(medio, 0, y, W, 1, "#2a1d16");
}

function escenarioAzotea({ fondo, medio, brillo }, t, { W, H, suelo }) {
  bandas(fondo, 0, suelo, ["#0e1534", "#121a3d", "#171f46", "#1d2350", "#262558", "#30285e"]);
  const azar = mulberry32(71);
  for (let k = 0; k < 50; k++) {
    const x = azar() * W, y = azar() * (suelo - 120), fase = azar();
    if (Math.floor(t * 2 + fase * 8) % 5 !== 0) rect(fondo, x, y, 1, 1, azar() < 0.3 ? "#f2c14e" : "#c9d2ff");
  }
  // Estrella fugaz cada 5 s (dura 0,4 s) y avión lejano con luz intermitente (v3)
  const fase = t % 5;
  if (fase < 0.4) {
    // Cabeza 2×2 blanca y estela que se acorta a escalones (nítida: en el fondo desenfocado se perdía)
    const p = Math.floor(fase / 0.05), sx = 70 + p * 8, sy = 18 + p * 4, estela = 5 - Math.floor(p / 2);
    rect(medio, sx, sy, 2, 2, "#f5f7fb");
    for (let k = 1; k <= estela; k++) rect(medio, sx - k * 2, sy - k, 2, 1, k < 3 ? "#c9d2ff" : "#6a74a8");
  }
  // Avión lejano 6×2 con luz que alterna roja (cola) y blanca (morro)
  const avx = W + 10 - Math.floor(((t % 20) / 20) * (W + 30));
  rect(medio, avx, 30, 6, 1, "#8a93c6"); rect(medio, avx + 2, 29, 2, 1, "#8a93c6"); rect(medio, avx + 1, 31, 4, 1, "#5a6390");
  if (Math.floor(t / 0.5) % 2 === 0) rect(medio, avx + 6, 30, 1, 1, "#e0454f"); else rect(medio, avx - 1, 30, 1, 1, "#f5f7fb");
  // Luna, con nubes que pasan despacio por delante
  disco(brillo, W - 54, 70, 26, "#f5f7fb");
  disco(medio, W - 54, 70, 12, "#e9e6d8"); disco(medio, W - 50, 66, 3, "#cfcbbb");
  for (const [y, vel, desfase] of [[58, 5, 0], [44, 3, 140]]) {
    const nx = Math.floor((t * vel + desfase) % (W + 70)) - 50;
    // nube iluminada por la luna: borde superior claro, cuerpo medio y base oscura (contrasta con el cielo)
    rect(medio, nx + 6, y - 3, 18, 3, "#5a6098"); rect(medio, nx, y, 34, 4, "#3e4580"); rect(medio, nx + 4, y + 4, 26, 2, "#2c3266");
  }
  // Ciudad: capa lejana (desenfocada) y capa cercana con ventanas que se encienden
  for (const [capa, base, color, sem, luz] of [[fondo, suelo - 40, "#1c2448", 72, "#8a6a3a"], [medio, suelo - 10, "#0e1224", 73, "#f2c14e"]]) {
    const a = mulberry32(sem);
    for (let x = -4; x < W;) {
      const w = 14 + Math.floor(a() * 18), h = 30 + Math.floor(a() * 70);
      rect(capa, x, base - h, w, h + 10, color);
      for (let yy = base - h + 4; yy < base - 4; yy += 7) for (let xx = x + 3; xx < x + w - 3; xx += 5) {
        const fase = a();
        if (fase < 0.45 && Math.floor(t / 2 + fase * 9) % 6 !== 0) rect(capa, xx, yy, 2, 3, luz);
      }
      x += w + 2;
    }
  }
  // Cornisa de la azotea con antena
  rect(medio, 0, suelo, W, H - suelo, "#151a2c");
  rect(medio, 0, suelo, W, 4, "#262d48");
  rect(medio, W - 40, suelo - 50, 2, 50, "#262d48"); rect(medio, W - 48, suelo - 46, 18, 2, "#262d48");
  if (Math.floor(t / 0.8) % 2 === 0) { rect(medio, W - 40, suelo - 52, 2, 2, "#e0454f"); rect(brillo, W - 44, suelo - 56, 10, 10, "#e0454f"); }
  // Murciélago que cruza la ciudad aleteando, una vez cada 14 s
  const mx = Math.floor(((t % 14) / 9) * (W + 20)) - 10, my = suelo - 70 + Math.round(Math.sin(t * 3) * 4);
  if (mx < W + 10) {
    const arriba = Math.floor(t / 0.12) % 2 === 0;
    rect(medio, mx + 2, my, 2, 2, "#0a0c18");
    if (arriba) { rect(medio, mx, my - 1, 2, 1, "#0a0c18"); rect(medio, mx + 4, my - 1, 2, 1, "#0a0c18"); }
    else { rect(medio, mx, my + 1, 2, 1, "#0a0c18"); rect(medio, mx + 4, my + 1, 2, 1, "#0a0c18"); }
  }
}

// v3 · movimiento de fondo compartido
// Motas de polvo que flotan en el cono de una luz (cx, y0, ancho w, alto h), deterministas por semilla
function motas(svg, t, cx, y0, w, h, semilla) {
  const azar = mulberry32(semilla);
  for (let k = 0; k < 8; k++) {
    const bx = azar() * w - w / 2, fase = azar(), vel = 3 + azar() * 3;
    const y = y0 + h - ((t * vel + fase * h) % h);
    rect(svg, cx + bx + Math.round(Math.sin(t * 0.8 + fase * 6)), y, 1, 1, "#ffe3a8");
  }
}

// Ventilador de rack 9×9 con dos aspas que giran a pasos de 45°
function ventilador(svg, cx, cy, t) {
  rect(svg, cx - 4, cy - 4, 9, 9, "#14121c"); rect(svg, cx - 3, cy - 3, 7, 7, "#262d48");
  const a = (Math.floor(t / 0.05) % 4) * (Math.PI / 4);
  for (const g of [a, a + Math.PI / 2]) linea(svg, cx - Math.round(Math.cos(g) * 3), cy - Math.round(Math.sin(g) * 3), cx + Math.round(Math.cos(g) * 3), cy + Math.round(Math.sin(g) * 3), "#8a93a6");
}

function escenario(nombre, capas, t, opciones) {
  ({ laboratorio: escenarioLaboratorio, servidores: escenarioServidores, despacho: escenarioDespacho, azotea: escenarioAzotea })[nombre](capas, t, opciones);
}
