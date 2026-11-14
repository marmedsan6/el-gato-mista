// como-google-sabe-lo-que-quieres · piezas propias del vídeo (estilo v6, 4 px). Script clásico (funciones globales).
// Necesita: motor/estilo/pixel.js, v5/dibujo.js y v6/piezas.js. Las usan el largo y los tres shorts.
// Todo en unidades de arte (1 unidad = 1 px CSS = 4 px de salida), luz arriba a la izquierda, contorno y 3 tonos.
// Contrato seek(t): nada depende del reloj; el azar sale de mulberry32 con semilla.
// Sin logotipos: YouTube, Google y Chrome son ventanas propias con su nombre en una placa (placa6).

const GC = R5.contorno;
const G = {
  GRIS: ["#2a2f3c", "#4a5163", "#7a8296", "#b4bccb", "#e4e8f0"],      // carcasa del robot
  SALON: ["#2a1d1c", "#3b2a24", "#4f382c", "#6a4a34", "#8a6440"],     // pared cálida del salón
  SUELO: ["#24170f", "#3a2616", "#54381f"],                           // parqué
  LAB: ["#10232a", "#173640", "#22545a", "#2f6f72", "#4b9a92"],       // laboratorio (luz fría)
  LADRILLO: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e"],
  PANTALLA: ["#0b1622", "#12233a", "#1d3557"],
  PAPEL: ["#8f8676", "#b8ad96", "#d8ceb6", "#efe6d2"],
  SOFA: ["#1a2440", "#26345c", "#34477a", "#4a62a0"],
  TEXTO_GRIS: "#6b7385",
};

// ---------- el robot aspirador: el hilo del vídeo (disco gris, franja naranja y piloto verde) ----------
// Visto de lado y algo desde arriba: unas 30×10 unidades; (x, y) = esquina superior izquierda. e = escala entera.
function robotG(svg, brillo, x, y, t, { mueve = false, e = 1, piloto = true } = {}) {
  const W = 30 * e, cx = x + Math.round(W / 2), rx = 14 * e, ry = 3 * e;
  elipse5(svg, cx, y + 10 * e, rx + e, Math.max(1, e + 1), "#05070b");                     // sombra
  rect(svg, x + e, y + 3 * e, W - 2 * e, 5 * e, GC);                                       // costado
  rect(svg, x + 2 * e, y + 3 * e, W - 4 * e, 4 * e, G.GRIS[1]);
  rect(svg, x + 2 * e, y + 5 * e, W - 4 * e, e, R5.naranja[2]);                            // franja naranja
  rect(svg, x + 2 * e, y + 3 * e, Math.round(W * 0.3), e, G.GRIS[2]);
  rect(svg, x + W - 6 * e, y + 3 * e, 3 * e, 4 * e, G.GRIS[0]);                            // sombra a la derecha
  elipse5(svg, cx, y + 3 * e, rx, ry, GC); elipse5(svg, cx, y + 3 * e, rx - 1, ry - (e > 1 ? 1 : 0), G.GRIS[3]);
  elipse5(svg, cx - 3 * e, y + 2 * e, Math.round(rx * 0.45), Math.max(1, ry - 1), G.GRIS[4]); // brillo arriba a la izquierda
  disco(svg, cx + 2 * e, y + 3 * e, Math.max(1, e + 1), G.GRIS[1]);                         // botón
  if (piloto) {
    const on = Math.floor(t * 2) % 2 === 0;
    rect(svg, cx + 7 * e, y + 2 * e, e + 1, e, on ? R5.verde[3] : R5.verde[1]);
    if (on && brillo) rect(brillo, cx + 6 * e, y + e, e + 3, e + 2, R5.verde[0]);
  }
  rect(svg, x + 4 * e, y + 8 * e, 3 * e, e, GC); rect(svg, x + W - 7 * e, y + 8 * e, 3 * e, e, GC); // ruedas
  if (mueve) { // cepillo lateral que gira a escalones
    const f = Math.floor(t * 10) % 3;
    const bx = x - e, by = y + 8 * e;
    [[-3, 0], [-2, -1], [-3, 1]].forEach(([dx, dy], k) => { if (k !== f) rect(svg, bx + dx * e, by + dy * e, 2 * e, e, G.GRIS[3]); });
  }
}
// Miniatura del robot (para pantallas y miniaturas): 12×6
function miniRobotG(svg, x, y) {
  rect(svg, x, y + 2, 12, 3, GC); rect(svg, x + 1, y + 2, 10, 2, G.GRIS[1]); rect(svg, x + 1, y + 3, 10, 1, R5.naranja[2]);
  elipse5(svg, x + 6, y + 2, 5, 1, GC); rect(svg, x + 2, y + 1, 8, 1, G.GRIS[3]); rect(svg, x + 2, y + 1, 3, 1, G.GRIS[4]);
  rect(svg, x + 9, y + 1, 1, 1, R5.verde[3]);
}

// Rastro de huellas del robot: pares de marcas cada 7 unidades por la polilinea pts; crece de 0 a 1 y brilla la punta.
function rastroG(svg, brillo, pts, t, crece = 1, color = R5.naranja) {
  let largo = 0; const segs = [];
  for (let i = 1; i < pts.length; i++) { const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(s); largo += s; }
  const hasta = crece * largo;
  let d = 0, n = 0;
  for (let i = 0; i < segs.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    for (let s = (7 - (d % 7)) % 7; s <= segs[i]; s += 7) {
      if (d + s > hasta) return;
      const f = segs[i] ? s / segs[i] : 0, px = Math.round(x0 + (x1 - x0) * f), py = Math.round(y0 + (y1 - y0) * f);
      const punta = hasta - (d + s) < 14;
      const c = punta && Math.floor(t * 4 + n) % 2 === 0 ? color[3] : color[1];
      rect(svg, px - 2, py - 1, 2, 1, c); rect(svg, px + 1, py, 2, 1, c);
      if (punta && brillo) rect(brillo, px - 3, py - 2, 7, 4, color[0]);
      n++;
    }
    d += segs[i];
  }
}

// ---------- habitación en corte (diorama): pared del fondo con ventanas por las que se ve el cielo lejano ----------
// x0 = inicio de la estación; ocupa de x0 + m a x0 + 480 - m. ventanas: [[x, y, w, h], …] relativas a x0 (huecos sin pintar).
function habitacionG(svg, x0, su, { pared = G.SALON, suelo = G.SUELO, techo = 22, m = 14, ventanas = [], zocalo = true, desde = null, ancho = null } = {}) {
  const x = x0 + (desde ?? m), w = ancho ?? 480 - 2 * m, alto = su - techo;
  const huecos = ventanas.map(([vx, vy, vw, vh]) => [x0 + vx, vy, vw, vh]);
  // pared en bandas (luz arriba), recortada por filas alrededor de las ventanas
  for (let yy = techo; yy < su; yy++) {
    const banda = Math.min(pared.length - 1, Math.floor(((su - yy) / alto) * pared.length));
    const color = pared[banda];
    let cx = x;
    huecos.filter(([, vy, , vh]) => yy >= vy && yy < vy + vh).sort((a, b) => a[0] - b[0]).forEach(([vx, , vw]) => {
      if (vx > cx) rect(svg, cx, yy, vx - cx, 1, color);
      cx = Math.max(cx, vx + vw);
    });
    if (cx < x + w) rect(svg, cx, yy, x + w - cx, 1, color);
  }
  huecos.forEach(([vx, vy, vw, vh]) => { // marco de ventana con cruz
    rect(svg, vx - 2, vy - 2, vw + 4, 2, GC); rect(svg, vx - 2, vy + vh, vw + 4, 3, GC); rect(svg, vx - 2, vy, 2, vh, GC); rect(svg, vx + vw, vy, 2, vh, GC);
    rect(svg, vx - 1, vy + vh, vw + 2, 1, pared[pared.length - 1]);
    rect(svg, vx + Math.floor(vw / 2) - 1, vy, 2, vh, GC); rect(svg, vx, vy + Math.floor(vh / 2) - 1, vw, 2, GC);
  });
  rect(svg, x - 3, techo - 3, w + 6, 3, GC); rect(svg, x - 3, techo, 3, alto, GC); rect(svg, x + w, techo, 3, alto, GC); // corte del diorama
  rect(svg, x, techo, w, 1, pared[pared.length - 1]);
  if (zocalo) { rect(svg, x, su - 5, w, 5, suelo[0]); rect(svg, x, su - 5, w, 1, suelo[2]); }
  rect(svg, x - 3, su, w + 6, 6, suelo[1]); for (let k = x; k < x + w; k += 18) rect(svg, k, su + 2, 10, 1, suelo[0]);
}

// Lámpara de pie con su cono de luz cálida
function lamparaG(svg, brillo, x, su, t) {
  rect(svg, x + 5, su - 58, 2, 56, GC); rect(svg, x + 6, su - 58, 1, 56, R5.metal[2]);
  rect(svg, x, su - 3, 12, 3, GC); rect(svg, x + 1, su - 3, 10, 1, R5.metal[2]);
  for (let j = 0; j < 9; j++) { const a = 4 + Math.floor(j / 2); rect(svg, x + 6 - a, su - 70 + j, 2 * a, 1, j === 8 ? GC : j < 2 ? P6.ORO[2] : P6.ORO[1]); }
  rect(svg, x + 1, su - 70, 10, 1, GC);
  if (brillo) for (let j = 0; j < 36; j += 2) rect(brillo, x + 6 - 3 - Math.floor(j * 0.5), su - 61 + j * 1.5, 6 + j, 2, "#3a2c1c");
}
// Sofá visto de frente (unos 120×44)
function sofaG(svg, x, su, w = 120) {
  const h = 44, y = su - h;
  caja5(svg, x, y, w, 26, G.SOFA);                                      // respaldo
  caja5(svg, x - 6, y + 14, 14, h - 14, G.SOFA); caja5(svg, x + w - 8, y + 14, 14, h - 14, G.SOFA); // brazos
  caja5(svg, x + 6, y + 24, w - 12, 14, G.SOFA);                        // asiento
  rect(svg, x + Math.floor(w / 2), y + 25, 1, 12, G.SOFA[0]);
  rect(svg, x + 2, su - 4, 4, 4, GC); rect(svg, x + w - 6, su - 4, 4, 4, GC);
  caja5(svg, x + 14, y + 12, 22, 14, R5.naranja.slice(0, 4));           // cojín naranja
}

// ---------- pantallas genéricas (sin logotipos) ----------
// Tele con peana; pinta el contenido con dentro(x, y, w, h). Devuelve el rectángulo de la pantalla.
function teleG(svg, brillo, x, y, w, h, t, { on = true, dentro = null, placa = null } = {}) {
  caja5(svg, x, y, w, h, ["#0e1018", "#171a24", "#20242f", "#2c3140"]);
  const sx = x + 4, sy = y + 4, sw = w - 8, sh = h - 10;
  rect(svg, sx - 1, sy - 1, sw + 2, sh + 2, GC);
  rect(svg, sx, sy, sw, sh, on ? G.PANTALLA[0] : "#05070b");
  if (on && dentro) dentro(sx, sy, sw, sh);
  if (on && brillo) rect(brillo, sx - 6, sy - 6, sw + 12, sh + 12, "#14233a");
  rect(svg, x + Math.floor(w / 2) - 10, y + h, 20, 4, GC); rect(svg, x + Math.floor(w / 2) - 18, y + h + 4, 36, 3, GC);
  rect(svg, x + Math.floor(w / 2) - 17, y + h + 4, 34, 1, R5.metal[1]);
  rect(svg, x + w - 9, y + h - 4, 2, 1, on ? R5.verde[2] : R5.naranja[1]);
  if (placa) placa6(svg, x + 6, y + h - 4 - 12 + 6, placa, { color: "#f5f7fb", fondo: "#0c1016" });
  return { sx, sy, sw, sh };
}
// Reproductor genérico dentro de una pantalla: barra de búsqueda y rejilla de miniaturas. elegida = índice resaltado.
function reproductorG(svg, brillo, sx, sy, sw, sh, t, { cuantas = 8, desde = 0, elegida = -1, robot = 5, escoba = -1, semilla = 7 } = {}) {
  rect(svg, sx, sy, sw, 7, "#0f1a2b"); rect(svg, sx + 4, sy + 2, Math.round(sw * 0.45), 3, "#22324c");
  rect(svg, sx + sw - 10, sy + 2, 6, 3, R5.naranja[1]);
  const cols = 4, gx = 4, cw = Math.floor((sw - gx * (cols + 1)) / cols), ch = Math.round(cw * 0.56);
  const az = mulberry32(semilla), fondos = [R5.ia, R5.verde, P6.ORO, R5.naranja, R5.labLuz, R5.metal];
  for (let k = 0; k < cuantas; k++) {
    const c = k % cols, f = Math.floor(k / cols), x = sx + gx + c * (cw + gx), y = sy + 10 + f * (ch + 8);
    if (y + ch > sy + sh) break;
    const rampa = fondos[Math.floor(az() * fondos.length)];
    if (k < desde) { az(); continue; }
    rect(svg, x - 1, y - 1, cw + 2, ch + 2, GC);
    rect(svg, x, y, cw, ch, rampa[0]); rect(svg, x, y + Math.floor(ch / 2), cw, Math.ceil(ch / 2), rampa[1]);
    if (k === robot) { rect(svg, x, y, cw, ch, "#2a3550"); rect(svg, x, y + ch - 4, cw, 4, G.SUELO[2]); miniRobotG(svg, x + Math.floor(cw / 2) - 6, y + ch - 9); }
    else if (k === escoba) { rect(svg, x, y, cw, ch, "#24324a"); linea(svg, x + 6, y + 2, x + cw - 8, y + ch - 4, P6.CARTON[3], 1); rect(svg, x + cw - 11, y + ch - 5, 7, 3, P6.ORO[2]); }
    else { rect(svg, x + 2 + Math.floor(az() * (cw - 8)), y + 2 + Math.floor(az() * 3), 4, 3, rampa[3]); }
    rect(svg, x, y + ch + 2, Math.round(cw * 0.8), 1, "#2c3a54"); rect(svg, x, y + ch + 4, Math.round(cw * 0.5), 1, "#22304a");
    if (k === elegida) { marcoSeleccion(svg, x - 3, y - 3, cw + 6, ch + 6); if (brillo) rect(brillo, x - 4, y - 4, cw + 8, ch + 8, R5.ia[1]); }
  }
}
// Móvil (vertical): marco, pantalla y botón; devuelve la pantalla
function movilG(svg, brillo, x, y, w, h, { on = true, dentro = null } = {}) {
  caja5(svg, x, y, w, h, ["#0e1018", "#171a24", "#232838", "#343a4e"]);
  const sx = x + 3, sy = y + 6, sw = w - 6, sh = h - 12;
  rect(svg, sx, sy, sw, sh, on ? G.PANTALLA[0] : "#05070b");
  rect(svg, x + Math.floor(w / 2) - 3, y + 2, 6, 1, GC);
  if (on && dentro) dentro(sx, sy, sw, sh);
  if (on && brillo) rect(brillo, sx - 3, sy - 3, sw + 6, sh + 6, "#12203a");
  return { sx, sy, sw, sh };
}
// Ficha de producto de la tienda (dentro de una pantalla): foto del robot, precio en barras y botón de comprar
function fichaTiendaG(svg, sx, sy, sw, sh, { boton = false } = {}) {
  rect(svg, sx, sy, sw, sh, "#1a2236");
  rect(svg, sx + 3, sy + 3, sw - 6, Math.round(sh * 0.45), "#2a3550");
  rect(svg, sx + 3, sy + 3 + Math.round(sh * 0.45) - 4, sw - 6, 4, G.SUELO[2]);
  miniRobotG(svg, sx + Math.floor(sw / 2) - 6, sy + 3 + Math.round(sh * 0.45) - 10);
  const y = sy + Math.round(sh * 0.55);
  rect(svg, sx + 3, y, sw - 10, 2, "#4a5774"); rect(svg, sx + 3, y + 4, Math.round(sw * 0.4), 3, P6.ORO[2]);
  rect(svg, sx + 3, y + 9, sw - 6, 1, "#33405a"); rect(svg, sx + 3, y + 11, sw - 12, 1, "#33405a");
  caja5(svg, sx + 3, sy + sh - 9, sw - 6, 6, boton ? R5.naranja : ["#3a2416", "#4a2e1c", "#5c3a22", "#6a4428"]);
}
// Carrito vacío (14×12)
function carritoG(svg, x, y, color = G.GRIS) {
  linea(svg, x, y, x + 3, y, GC, 2); linea(svg, x + 3, y, x + 5, y + 8, GC, 2);
  rect(svg, x + 4, y + 2, 10, 6, GC); rect(svg, x + 5, y + 3, 8, 4, "#05070b");
  for (let k = 6; k < 13; k += 2) rect(svg, x + k, y + 3, 1, 4, color[2]);
  rect(svg, x + 5, y + 8, 9, 1, color[3]);
  disco(svg, x + 6, y + 11, 1, color[3]); disco(svg, x + 12, y + 11, 1, color[3]);
}
// Tableta horizontal con una web de noticias; hueco = { visible, robot } (el anuncio en mitad del artículo)
function tabletaNoticiasG(svg, brillo, x, y, w, h, t, { scroll = 0, hueco = null } = {}) {
  caja5(svg, x, y, w, h, ["#0e1018", "#171a24", "#232838", "#343a4e"]);
  const sx = x + 5, sy = y + 4, sw = w - 10, sh = h - 8;
  rect(svg, sx, sy, sw, sh, G.PAPEL[2]);
  rect(svg, sx, sy, sw, 7, G.PAPEL[3]); rect(svg, sx + 4, sy + 2, 30, 3, "#3a3f4c");
  const off = Math.round(scroll) % 12;
  for (let yy = sy + 10 - off; yy < sy + sh - 2; yy += 4) {
    if (yy < sy + 9) continue;
    const enHueco = hueco && hueco.visible && yy > hueco.y - 2 && yy < hueco.y + hueco.h + 2;
    if (!enHueco) { rect(svg, sx + 4, yy, sw - 8 - ((yy * 7) % 23), 1, G.PAPEL[0]); }
  }
  if (hueco && hueco.visible) {
    const hx = sx + 6, hw = sw - 12;
    rect(svg, hx - 1, hueco.y - 1, hw + 2, hueco.h + 2, GC); rect(svg, hx, hueco.y, hw, hueco.h, "#26304a");
    rect(svg, hx, hueco.y + hueco.h - 5, hw, 5, G.SUELO[2]);
    if (hueco.robot) robotG(svg, brillo, hx + Math.floor(hw / 2) - 15, hueco.y + hueco.h - 15, t, { piloto: true });
    rect(svg, hx + hw - 6, hueco.y + 2, 4, 3, "#5b8cff");
  }
  if (brillo) rect(brillo, sx - 4, sy - 4, sw + 8, sh + 8, "#1c1a14");
  return { sx, sy, sw, sh };
}
// Calendario de pared (34×40) con anillas; hoja que cae (0..1)
function calendarioG(svg, x, y, cae = 0) {
  caja5(svg, x, y, 34, 40, G.PAPEL);
  rect(svg, x + 1, y + 1, 32, 9, R5.naranja[1]); rect(svg, x + 1, y + 1, 32, 1, R5.naranja[3]);
  rect(svg, x + 7, y - 2, 2, 5, GC); rect(svg, x + 25, y - 2, 2, 5, GC);
  for (let f = 0; f < 4; f++) for (let c = 0; c < 5; c++) rect(svg, x + 4 + c * 6, y + 14 + f * 6, 4, 4, f === 1 && c === 2 ? R5.naranja[2] : G.PAPEL[0]);
  if (cae > 0 && cae < 1) { // la hoja cae girando a escalones
    const k = Math.floor(cae * 4), dx = k * 6, dy = Math.round(cae * cae * 60);
    rect(svg, x + dx, y + dy + 4, 30 - k * 4, 32 - k * 5, GC); rect(svg, x + dx + 1, y + dy + 5, 28 - k * 4, 30 - k * 5, G.PAPEL[3]);
  }
}
// Signo de interrogación pixel (9×14) con contorno
function interrogacionG(svg, x, y, color = R5.naranja, e = 1) {
  const filas = ["..ooooo..", ".oaaaaao.", "oaabbbaao", "oab...oao", ".o...oaao", "....oaao.", "...oaao..", "...oao...", "...oao...", "....o....", "...ooo...", "...oao...", "...oao...", "...ooo..."];
  const pal = { o: GC, a: color[2], b: color[3] };
  filas.forEach((f, j) => [...f].forEach((c, i) => { if (pal[c]) rect(svg, x + i * e, y + j * e, e, e, pal[c]); }));
}
// Puerta con marco y pomo (22×40); abierta 0..1 (la hoja se estrecha a escalones)
function puertaG(svg, x, su, { abierta = 0, rampa = P6.CARTON } = {}) {
  const y = su - 40;
  rect(svg, x - 2, y - 2, 26, 42, GC); rect(svg, x, y, 22, 40, "#05070b");
  const w = Math.max(3, Math.round(22 * (1 - pasos6(abierta, 0, 1, 4) * 0.8)));
  caja5(svg, x, y, w, 40, rampa);
  if (w > 8) rect(svg, x + w - 5, y + 20, 2, 2, P6.ORO[2]);
}

// ---------- el estudio del micrófono ----------
// Edificio universitario de ladrillo (fondo) con su placa
function facultadG(svg, x, y, w, su, { placa = "NORTHEASTERN" } = {}) {
  caja5(svg, x, y, w, su - y, G.LADRILLO);
  for (let yy = y + 4; yy < su; yy += 4) for (let xx = x + 2 + ((yy / 4) % 2) * 4; xx < x + w - 4; xx += 8) rect(svg, xx, yy, 6, 1, G.LADRILLO[1]);
  for (let yy = y + 30; yy < su - 16; yy += 22) for (let xx = x + 10; xx < x + w - 16; xx += 24) { rect(svg, xx - 1, yy - 1, 12, 16, GC); rect(svg, xx, yy, 10, 14, R5.ventana[0]); rect(svg, xx, yy + 7, 10, 1, GC); }
  // frontón con la placa
  rect(svg, x - 4, y - 6, w + 8, 6, GC); rect(svg, x - 3, y - 5, w + 6, 4, "#8a7a66");
  if (placa) placa6(svg, x + Math.floor(w / 2) - Math.round((placa.length * 8 + 4) / 2), y + 8, placa, { color: "#f5f7fb", fondo: "#2a1618" });
}
// Banco de pruebas: fila de n móviles conectados a un ordenador; activo = índice del móvil que el dedo toca
function bancoMovilesG(svg, brillo, x, y, n, t, { activo = -1, paquetes = 0, w = 22, h = 38, gx = 10 } = {}) {
  caja5(svg, x - 8, y + h + 2, n * (w + gx) + 8, 8, R5.metal);                     // mesa
  for (let k = 0; k < n; k++) {
    const mx = x + k * (w + gx);
    const ilum = k === activo;
    movilG(svg, ilum ? brillo : null, mx, y, w, h, { dentro: (sx, sy, sw, sh) => {
      rect(svg, sx + 2, sy + 2, sw - 4, 4, ilum ? R5.ia[2] : R5.ia[0]);
      for (let j = 0; j < 3; j++) rect(svg, sx + 2 + (j % 2) * 8, sy + 9 + j * 7, 6, 5, ilum ? [R5.verde[2], P6.ORO[2], R5.naranja[2]][j] : "#1a2a40");
    } });
    // cable hasta la mesa
    rect(svg, mx + Math.floor(w / 2), y + h, 1, 3, GC);
  }
}
// Dedo mecánico que baja a tocar una pantalla (brazo articulado desde arriba); toca = 0..1
function dedoMecanicoG(svg, x, yTope, yPunta, toca) {
  const yy = Math.round(yTope + (yPunta - yTope) * (0.75 + 0.25 * toca));
  rect(svg, x - 6, yTope - 4, 12, 4, GC); rect(svg, x - 5, yTope - 3, 10, 2, R5.metal[2]);
  rect(svg, x - 1, yTope, 3, yy - yTope, GC); rect(svg, x, yTope, 1, yy - yTope, R5.metal[3]);
  rect(svg, x - 3, yy, 7, 4, GC); rect(svg, x - 2, yy, 5, 3, R5.naranja[2]); rect(svg, x - 2, yy, 2, 1, R5.naranja[3]);
}
// Paquete de datos (cajita de color con contorno, 8×7); tipo: imagen | texto | audio
function paqueteG(svg, x, y, tipo = "imagen") {
  const c = tipo === "audio" ? R5.naranja : tipo === "texto" ? G.PAPEL : R5.ia;
  rect(svg, x, y, 8, 7, GC); rect(svg, x + 1, y + 1, 6, 5, c[2]); rect(svg, x + 1, y + 1, 3, 1, c[3]); rect(svg, x + 6, y + 1, 1, 5, c[1]);
  if (tipo === "imagen") rect(svg, x + 2, y + 4, 3, 1, R5.verde[2]); else if (tipo === "texto") { rect(svg, x + 2, y + 3, 4, 1, G.TEXTO_GRIS); rect(svg, x + 2, y + 5, 3, 1, G.TEXTO_GRIS); }
}
// Nube de internet (40×18)
function nubeG(svg, brillo, x, y) {
  elipse5(svg, x + 12, y + 10, 11, 7, GC); elipse5(svg, x + 26, y + 8, 12, 8, GC); elipse5(svg, x + 20, y + 13, 18, 5, GC);
  elipse5(svg, x + 12, y + 10, 10, 6, R5.metal[2]); elipse5(svg, x + 26, y + 8, 11, 7, R5.metal[3]); elipse5(svg, x + 20, y + 13, 17, 4, R5.metal[2]);
  elipse5(svg, x + 23, y + 5, 6, 3, "#c4cae0");
  if (brillo) rect(brillo, x - 2, y - 2, 44, 22, R5.ia[0]);
}
// Micrófono de estudio sobre un filtro-embudo; los paquetes caen por el embudo a tres cajones (imagen, texto, audio).
// Unas 184×150 unidades desde (x, y). Devuelve la boca del embudo y el centro de cada cajón.
function filtroMicrofonoG(svg, brillo, x, y, t, { piloto = false, parpadeo = false } = {}) {
  const cx = x + 92;
  // micrófono grande arriba, con rejilla, brillo a la izquierda y su piloto
  rect(svg, cx - 19, y, 38, 50, GC); rect(svg, cx - 18, y + 1, 36, 48, R5.metal[2]);
  elipse5(svg, cx, y + 2, 18, 4, GC); elipse5(svg, cx, y + 2, 17, 3, R5.metal[3]);
  for (let j = 8; j < 46; j += 4) { rect(svg, cx - 15, y + j, 30, 1, R5.metal[1]); for (let i = -13; i < 14; i += 4) rect(svg, cx + i, y + j + 2, 1, 1, R5.metal[0]); }
  rect(svg, cx - 18, y + 4, 5, 44, R5.metal[3]); rect(svg, cx + 13, y + 4, 5, 44, R5.metal[1]);
  rect(svg, cx - 4, y + 50, 8, 10, GC); rect(svg, cx - 3, y + 50, 6, 10, R5.metal[1]); rect(svg, cx - 12, y + 58, 24, 4, GC);
  rect(svg, cx + 8, y + 10, 6, 5, GC); rect(svg, cx + 9, y + 11, 4, 3, piloto ? R5.naranja[3] : "#2a1d1c"); // piloto: apagado
  if (piloto && brillo) rect(brillo, cx + 6, y + 8, 10, 9, R5.naranja[0]);
  // embudo
  const ey = y + 64, alto = 34;
  for (let j = 0; j < alto; j++) {
    const a = 88 - Math.floor(j * 2.3), c = parpadeo && Math.floor(t * 6) % 2 === 0 ? P6.ORO[j < 4 ? 2 : 1] : R5.metal[j < 4 ? 3 : j < 20 ? 2 : 1];
    rect(svg, cx - a - 1, ey + j, 2 * a + 2, 1, GC); rect(svg, cx - a, ey + j, 2 * a, 1, j === 0 ? GC : c);
    if (j > 3 && j % 6 === 0) rect(svg, cx - a + 4, ey + j, 6, 1, R5.metal[3]);
  }
  if (parpadeo && brillo && Math.floor(t * 6) % 2 === 0) rect(brillo, cx - 92, ey - 4, 184, alto + 8, "#4a3a14");
  rect(svg, cx - 9, ey + alto, 18, 6, GC); rect(svg, cx - 8, ey + alto, 16, 5, R5.metal[1]);
  // cajones con su icono: imagen, texto y audio
  const cajones = [R5.ia, G.PAPEL, R5.naranja], cw = 52, cyy = ey + alto + 14;
  cajones.forEach((c, k) => {
    const bx = x + k * (cw + 14);
    caja5(svg, bx, cyy, cw, 38, ["#0e1018", "#171a24", "#232838", "#343a4e"]);
    rect(svg, bx + 4, cyy + 4, cw - 8, 4, c[1]); rect(svg, bx + 4, cyy + 4, cw - 8, 1, c[3]);
    rect(svg, bx + 4, cyy + 10, cw - 8, 24, "#05070b");
    rect(svg, bx + cw / 2 - 4, cyy + 34, 8, 2, R5.metal[2]); // tirador
  });
  linea(svg, cx, ey + alto + 6, x + cw / 2, cyy, GC, 2); linea(svg, cx, ey + alto + 6, cx, cyy, GC, 2); linea(svg, cx, ey + alto + 6, x + 2 * (cw + 14) + cw / 2, cyy, GC, 2);
  return { boca: [cx, ey + alto + 4], cajon: (k) => [x + k * (cw + 14) + cw / 2, cyy + 22] };
}
// Bocadillo de voz que se convierte en hoja de texto (morf 0 → bocadillo, 1 → hoja)
function bocadilloHojaG(svg, x, y, morf) {
  if (morf < 0.5) {
    elipse5(svg, x + 14, y + 9, 14, 9, GC); elipse5(svg, x + 14, y + 9, 13, 8, "#f5f7fb");
    rect(svg, x + 4, y + 16, 4, 4, GC); rect(svg, x + 5, y + 16, 2, 3, "#f5f7fb");
    // ondas de sonido dentro
    [[8, 6], [12, 4], [16, 7], [20, 5]].forEach(([dx, hh]) => rect(svg, x + dx, y + 9 - Math.floor(hh / 2), 2, hh, R5.naranja[2]));
  } else {
    caja5(svg, x + 4, y, 22, 26, G.PAPEL);
    for (let j = 5; j < 23; j += 4) rect(svg, x + 7, y + j, 14 - (j % 3) * 2, 1, G.TEXTO_GRIS);
  }
}
// Cámara pequeña que fotografía la pantalla (18×13) y la foto que sale volando (16×13)
function camaritaG(svg, brillo, x, y, t, dispara = false) {
  rect(svg, x + 4, y, 6, 3, GC); rect(svg, x + 5, y + 1, 4, 2, R5.metal[2]);
  caja5(svg, x, y + 2, 18, 11, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]);
  disco(svg, x + 9, y + 7, 4, GC); disco(svg, x + 9, y + 7, 3, R5.metal[1]); disco(svg, x + 9, y + 7, 2, R5.ia[1]); rect(svg, x + 8, y + 6, 1, 1, R5.ia[4]);
  rect(svg, x + 14, y + 4, 2, 2, dispara ? R5.naranja[3] : R5.naranja[1]);
  if (dispara && brillo) rect(brillo, x - 4, y - 2, 26, 18, "#3a3f4c");
}
function fotoG(svg, x, y) {
  rect(svg, x, y, 16, 13, GC); rect(svg, x + 1, y + 1, 14, 11, "#f5f7fb"); rect(svg, x + 2, y + 2, 12, 7, "#13362a");
  rect(svg, x + 3, y + 3, 6, 1, "#f5f7fb"); rect(svg, x + 3, y + 5, 3, 2, R5.naranja[2]); rect(svg, x + 7, y + 6, 6, 1, "#4a5774");
}
// Moto de reparto pixel (dentro de una app): 14×8
function motoG(svg, x, y) {
  disco(svg, x + 3, y + 6, 2, GC); disco(svg, x + 11, y + 6, 2, GC);
  rect(svg, x + 2, y + 3, 10, 2, R5.naranja[2]); rect(svg, x + 5, y, 4, 3, R5.verde[2]); rect(svg, x + 9, y + 1, 3, 2, GC);
}
// Edificio de oficinas de otra empresa (fondo), con placa
function oficinasG(svg, x, y, w, su, placa) {
  caja5(svg, x, y, w, su - y, R5.hormigon);
  for (let yy = y + 8; yy < su - 8; yy += 12) for (let xx = x + 6; xx < x + w - 8; xx += 12) rect(svg, xx, yy, 7, 7, (xx + yy) % 3 ? "#16243c" : R5.ventana[0]);
  if (placa) placa6(svg, x + Math.floor(w / 2) - Math.round((placa.length * 8 + 4) / 2), y - 16, placa, { color: "#f5f7fb", fondo: "#0c1016" });
}
// Miga que brilla (pista del rastro): 7×6
function migaG(svg, brillo, x, y, t, on, fase = 0) {
  rect(svg, x + 1, y, 5, 6, GC); rect(svg, x, y + 1, 7, 4, GC);
  rect(svg, x + 1, y + 1, 5, 4, on ? P6.ORO[1] : P6.CARTON[1]); rect(svg, x + 1, y + 1, 3, 2, on ? P6.ORO[2] : P6.CARTON[2]);
  if (on && Math.floor(t * 3 + fase) % 3 === 0) rect(svg, x + 2, y + 1, 1, 1, "#fff1c4");
  if (on && brillo) rect(brillo, x - 3, y - 3, 13, 12, "#4a3a14");
}
// Persona sentada genérica (busto sobre un banco): reutiliza persona5 con colores propios
function personaSentadaG(svg, x, y, t, { camisa = R5.ia, pelo = ["#24140c", "#3a2216", "#5c3826"] } = {}) {
  persona5(svg, x, y, t, { camisa: [camisa[0], camisa[1], camisa[2]], pelo });
}
// Banco de parque (80×20)
function bancoParqueG(svg, x, su, w = 80) {
  const y = su - 20;
  for (let k = 0; k < 3; k++) { rect(svg, x, y + k * 4, w, 3, GC); rect(svg, x + 1, y + k * 4, w - 2, 2, P6.CARTON[2]); rect(svg, x + 1, y + k * 4, w - 2, 1, P6.CARTON[3]); }
  rect(svg, x + 4, y + 12, 3, 8, GC); rect(svg, x + w - 7, y + 12, 3, 8, GC);
}
// Bocadillo con el dibujo del robot dentro (habla de algo): 44×26
function bocadilloRobotG(svg, x, y, cola = "izq") {
  rect(svg, x + 1, y - 1, 42, 26, GC); rect(svg, x - 1, y + 1, 46, 22, GC);
  rect(svg, x + 1, y + 1, 42, 22, "#f5f7fb"); rect(svg, x + 1, y + 1, 42, 2, "#ffffff"); rect(svg, x + 1, y + 20, 42, 3, "#d8dde8");
  const cx = cola === "izq" ? x + 6 : x + 32;
  rect(svg, cx - 1, y + 25, 7, 3, GC); rect(svg, cx, y + 25, 5, 2, "#d8dde8"); rect(svg, cx + 1, y + 28, 3, 2, GC);
  rect(svg, x + 6, y + 15, 32, 3, G.SUELO[2]);
  robotG(svg, null, x + 7, y + 5, 0, { piloto: false });
}
