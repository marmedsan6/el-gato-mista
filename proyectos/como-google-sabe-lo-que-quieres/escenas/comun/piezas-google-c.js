// como-google-sabe-lo-que-quieres · piezas de los bloques 5-8 (el anuncio, las cookies, los controles y el cierre).
// Estilo v6 a 4 px. Necesita piezas-google.js y piezas-google-b.js. Contrato seek(t): todo desde t.

// Moneda dorada (10×10)
function monedaG(svg, x, y) { disco(svg, x + 5, y + 5, 5, GC); disco(svg, x + 5, y + 5, 4, P6.ORO[1]); disco(svg, x + 4, y + 4, 2, P6.ORO[2]); rect(svg, x + 5, y + 3, 1, 5, P6.ORO[0]); }
// Fachada de la tienda (unos 150×130): toldo naranja, escaparate con el robot, puerta y la pegatina de Google junto a la puerta
function tiendaG(svg, brillo, x, su, t, { pegatina = false, avisa = false } = {}) {
  const y = su - 130;
  caja5(svg, x, y + 20, 150, 110, ["#2a1d1c", "#3b2a24", "#4f382c", "#6a4a34", "#8a6440"]);
  for (let k = 0; k < 8; k++) { rect(svg, x - 4 + k * 20, y + 8, 20, 14, GC); rect(svg, x - 3 + k * 20, y + 9, 18, 12, k % 2 ? R5.naranja[2] : "#f5f7fb"); rect(svg, x - 3 + k * 20, y + 18, 18, 3, k % 2 ? R5.naranja[1] : "#c4cae0"); }
  // escaparate con el robot en su peana y luz cálida
  rect(svg, x + 10, y + 36, 80, 60, GC); rect(svg, x + 12, y + 38, 76, 56, "#2a2236"); rect(svg, x + 12, y + 80, 76, 14, P6.CARTON[2]);
  robotG(svg, brillo, x + 34, y + 68, t); if (brillo) rect(brillo, x + 10, y + 36, 80, 60, "#3a2c1c");
  rect(svg, x + 12, y + 38, 2, 40, "#4a4060");
  // puerta
  rect(svg, x + 102, y + 44, 38, 86, GC); caja5(svg, x + 104, y + 46, 34, 84, P6.CARTON); rect(svg, x + 106, y + 52, 30, 34, "#3a3550"); rect(svg, x + 132, y + 90, 3, 3, P6.ORO[2]);
  if (pegatina) { // la etiqueta de Google: una pegatina azul que parpadea al avisar
    const on = avisa ? Math.floor(t * 6) % 2 === 0 : Math.floor(t * 1.5) % 2 === 0;
    rect(svg, x + 92, y + 56, 10, 10, GC); rect(svg, x + 93, y + 57, 8, 8, on ? R5.ia[3] : R5.ia[2]); rect(svg, x + 94, y + 58, 3, 3, "#f5f7fb");
    if (brillo && on) rect(brillo, x + 86, y + 50, 22, 22, R5.ia[1]);
  }
  return { pegatina: [x + 97, y + 61], puerta: [x + 121, su] };
}
// Tablón de corcho con fichas clavadas (la lista del anunciante): n fichas; la última entra con «nueva» (0..1)
function tablonG(svg, brillo, x, y, n, nueva = 1) {
  caja5(svg, x, y, 96, 70, P6.CARTON); rect(svg, x + 4, y + 4, 88, 62, "#8a5a32"); tramado5(svg, x + 4, y + 4, 88, 62, "#7a4e2a", 0);
  for (let k = 0; k < n; k++) {
    const c = k % 4, f = Math.floor(k / 4), fx = x + 8 + c * 21, fy = y + 8 + f * 18;
    const dentro = k < n - 1 || nueva >= 1;
    if (!dentro) continue;
    rect(svg, fx, fy, 16, 13, GC); rect(svg, fx + 1, fy + 1, 14, 11, G.PAPEL[3]); rect(svg, fx + 3, fy + 4, 10, 1, G.TEXTO_GRIS); rect(svg, fx + 3, fy + 7, 7, 1, G.TEXTO_GRIS);
    rect(svg, fx + 7, fy - 1, 2, 2, k === n - 1 ? R5.naranja[2] : R5.ia[2]);
    if (k === n - 1) miniRobotG(svg, fx + 2, fy + 6);
  }
  return { hueco: (k) => [x + 8 + (k % 4) * 21, y + 8 + Math.floor(k / 4) * 18] };
}
// Reloj de pared (20×20) con la aguja de los segundos
function relojParedG(svg, x, y, t) {
  disco(svg, x + 10, y + 10, 10, GC); disco(svg, x + 10, y + 10, 9, "#e4e8f0"); disco(svg, x + 9, y + 9, 6, "#f5f7fb");
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; rect(svg, Math.round(x + 10 + Math.cos(a) * 7), Math.round(y + 10 + Math.sin(a) * 7), 1, 1, GC); }
  const s = Math.floor(t) % 60, a = (s / 60) * Math.PI * 2 - Math.PI / 2;
  linea(svg, x + 10, y + 10, Math.round(x + 10 + Math.cos(a) * 7), Math.round(y + 10 + Math.sin(a) * 7), R5.naranja[2], 1);
  rect(svg, x + 10, y + 5, 1, 5, GC);
}
// Ficha de puja con seis iconos (IP, cookie, móvil, chincheta, globo, grupo) que se encienden con encendidos (0..6)
function fichaPujaG(svg, brillo, x, y, encendidos) {
  caja5(svg, x, y, 86, 44, G.PAPEL); rect(svg, x + 4, y + 4, 78, 4, "#4a5774");
  ["ip", "cookie", "movil", "chincheta", "globo", "grupo"].forEach((ic, k) => iconoG(svg, x + 6 + (k % 3) * 26, y + 12 + Math.floor(k / 3) * 15, ic, k < encendidos));
  if (brillo && encendidos > 0) rect(brillo, x - 4, y - 4, 94, 52, "#3a3420");
}
// Barra de carga de la página (w×8), progreso 0..1
function barraCargaG(svg, x, y, w, p) {
  rect(svg, x, y, w, 8, GC); rect(svg, x + 1, y + 1, w - 2, 6, "#141a26");
  rect(svg, x + 1, y + 1, Math.round((w - 2) * p), 6, R5.ia[2]); rect(svg, x + 1, y + 1, Math.round((w - 2) * p), 2, R5.ia[3]);
}
// Anunciante en la grada: silueta de busto con su paleta (sube 0..1); color de la paleta; robot = la de la tienda
function pujadorG(svg, x, y, t, { sube = 0, color = R5.ia, robot = false, semilla = 0 } = {}) {
  const O = "#05070b";
  elipse5(svg, x + 8, y + 6, 6, 7, O); elipse5(svg, x + 8, y + 6, 5, 6, "#232a3c");
  for (let j = 0; j < 14; j++) { const a = 6 + Math.floor(j / 3); rect(svg, x + 8 - a, y + 12 + j, 2 * a + 1, 1, O); rect(svg, x + 9 - a, y + 12 + j, 2 * a - 1, 1, "#2a3246"); }
  const py = y - 4 - Math.round(sube * 16);
  rect(svg, x + 18, py + 12, 2, 16, GC); rect(svg, x + 13, py, 14, 13, GC); rect(svg, x + 14, py + 1, 12, 11, color[2]); rect(svg, x + 14, py + 1, 12, 2, color[3]);
  if (robot) { rect(svg, x + 14, py + 1, 12, 11, "#f5f7fb"); rect(svg, x + 15, py + 7, 10, 2, R5.naranja[2]); rect(svg, x + 16, py + 5, 8, 2, G.GRIS[2]); }
}
// Mazo del subastador (golpe 0..1: 0 arriba, 1 abajo)
function mazoG(svg, x, y, golpe) {
  const a = -0.9 + golpe * 0.9, hx = Math.round(x + Math.cos(a) * 18), hy = Math.round(y + Math.sin(a) * 18);
  linea(svg, x, y, hx, hy, GC, 3); linea(svg, x, y, hx, hy, P6.CARTON[3], 1);
  rect(svg, hx - 6, hy - 4, 12, 8, GC); rect(svg, hx - 5, hy - 3, 10, 6, P6.CARTON[2]); rect(svg, hx - 5, hy - 3, 10, 2, P6.CARTON[3]);
}
// Cronómetro grande (40×46) con la aguja (vuelta 0..1)
function cronometroG(svg, brillo, x, y, vuelta) {
  rect(svg, x + 16, y, 8, 5, GC); rect(svg, x + 17, y + 1, 6, 3, R5.metal[3]);
  disco(svg, x + 20, y + 26, 20, GC); disco(svg, x + 20, y + 26, 18, R5.metal[2]); disco(svg, x + 20, y + 26, 15, "#f5f7fb"); disco(svg, x + 18, y + 24, 9, "#ffffff");
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; rect(svg, Math.round(x + 20 + Math.cos(a) * 12) - (k % 3 ? 0 : 1), Math.round(y + 26 + Math.sin(a) * 12), k % 3 ? 1 : 2, 1, GC); }
  const a = vuelta * Math.PI * 2 - Math.PI / 2;
  linea(svg, x + 20, y + 26, Math.round(x + 20 + Math.cos(a) * 13), Math.round(y + 26 + Math.sin(a) * 13), R5.naranja[2], 2);
  disco(svg, x + 20, y + 26, 2, GC);
  if (brillo) rect(brillo, x - 4, y + 2, 48, 48, "#14233a");
}
// Edificio con ventanas que se encienden (para «cientos de empresas»): w×h, encendidas 0..1, semilla para el orden
function edificioVentanasG(svg, brillo, x, y, w, su, encendidas, semilla = 1) {
  caja5(svg, x, y, w, su - y, R5.hormigon);
  const az = mulberry32(semilla);
  for (let yy = y + 6; yy < su - 6; yy += 9) for (let xx = x + 4; xx < x + w - 6; xx += 8) { const on = az() < encendidas; rect(svg, xx, yy, 5, 5, on ? R5.ventana[0] : "#141a26"); if (on && brillo) rect(brillo, xx - 1, yy - 1, 7, 7, "#2a2414"); }
}
// Sello redondo con su placa (ICO): el regulador
function selloG(svg, x, y, placa) {
  disco(svg, x + 18, y + 18, 18, GC); disco(svg, x + 18, y + 18, 17, "#1d2f6b"); disco(svg, x + 18, y + 18, 13, "#2a4290");
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; rect(svg, Math.round(x + 18 + Math.cos(a) * 15), Math.round(y + 18 + Math.sin(a) * 15), 1, 1, "#9fc4ff"); }
  placa6(svg, x + 18 - Math.round((placa.length * 8 + 4) / 2), y + 12, placa, { color: "#f5f7fb", fondo: null });
}
// Galleta (12×12) y tarro de cristal (34×40) con n galletas dentro
function galletaG(svg, x, y) {
  disco(svg, x + 6, y + 6, 6, GC); disco(svg, x + 6, y + 6, 5, P6.CARTON[3]); disco(svg, x + 5, y + 5, 3, P6.CARTON[4]);
  [[3, 4], [7, 3], [5, 8], [8, 7]].forEach(([dx, dy]) => rect(svg, x + dx, y + dy, 2, 2, P6.CARTON[0]));
}
function tarroG(svg, brillo, x, y, n, { gafas = false } = {}) {
  rect(svg, x + 6, y, 22, 6, GC); rect(svg, x + 7, y + 1, 20, 4, R5.naranja[1]); rect(svg, x + 7, y + 1, 20, 1, R5.naranja[3]);
  rect(svg, x, y + 6, 34, 34, GC); rect(svg, x + 1, y + 7, 32, 32, "#1e2c3c"); rect(svg, x + 2, y + 8, 3, 28, "#4a6a8a");
  for (let k = 0; k < n; k++) galletaG(svg, x + 4 + (k % 2) * 14, y + 26 - Math.floor(k / 2) * 9);
  if (gafas) { rect(svg, x - 2, y + 12, 38, 10, GC); rect(svg, x, y + 13, 14, 8, "#05070b"); rect(svg, x + 20, y + 13, 14, 8, "#05070b"); rect(svg, x + 2, y + 14, 4, 2, "#3a4258"); rect(svg, x + 22, y + 14, 4, 2, "#3a4258"); }
  if (brillo) rect(brillo, x - 4, y - 2, 42, 46, "#1c2430");
}
// Estantería (w×60) de madera con dos baldas
function estanteriaG(svg, x, y, w) {
  rect(svg, x, y, 4, 92, GC); rect(svg, x + w - 4, y, 4, 92, GC);
  [y + 40, y + 88].forEach((yy) => { rect(svg, x, yy, w, 5, GC); rect(svg, x + 1, yy, w - 2, 3, P6.CARTON[3]); rect(svg, x + 1, yy + 3, w - 2, 1, P6.CARTON[1]); });
}
// Caja de cartón con su placa (el recambio), con polvo y telarañas (sucia 0..1)
function cajaPlacaG(svg, x, y, w, h, placa, sucia = 0) {
  caja5(svg, x, y, w, h, P6.CARTON); rect(svg, x + 1, y + 8, w - 2, 2, P6.CARTON[1]);
  if (placa) placa6(svg, x + 4, y + 14, placa, { color: "#f5f7fb", fondo: "#3a2416" });
  if (sucia > 0) {
    const az = mulberry32(9); for (let k = 0; k < Math.round(sucia * 40); k++) rect(svg, x + Math.floor(az() * w), y + Math.floor(az() * h), 1, 1, "#8a8476");
    if (sucia > 0.5) { linea(svg, x, y, x + 10, y + 10, "#c4cae0", 1); linea(svg, x + 10, y, x, y + 10, "#c4cae0", 1); linea(svg, x, y + 5, x + 6, y, "#c4cae0", 1); }
  }
}
// Mano (de lado, 18×12) que agarra
function manoG(svg, x, y) {
  rect(svg, x, y + 2, 14, 9, GC); rect(svg, x + 1, y + 3, 12, 7, R5.piel[1]); rect(svg, x + 1, y + 3, 12, 2, R5.piel[2]);
  rect(svg, x + 12, y, 5, 6, GC); rect(svg, x + 13, y + 1, 3, 4, R5.piel[1]); rect(svg, x - 10, y + 4, 11, 6, GC); rect(svg, x - 9, y + 5, 10, 4, "#26345c");
}
// Papelera (24×28)
function papeleraG(svg, x, su) {
  const y = su - 28; rect(svg, x, y, 24, 4, GC); rect(svg, x + 1, y + 1, 22, 2, R5.metal[3]);
  for (let j = 4; j < 28; j++) { const a = 11 - Math.floor((j - 4) / 8); rect(svg, x + 12 - a - 1, y + j, 2 * a + 2, 1, GC); rect(svg, x + 12 - a, y + j, 2 * a, 1, j % 4 ? R5.metal[1] : R5.metal[2]); }
}
// Interruptor grande (18×30): on = verde arriba; off = naranja abajo; con su icono debajo
function interruptorG(svg, brillo, x, y, on, icono) {
  rect(svg, x, y, 18, 30, GC); rect(svg, x + 1, y + 1, 16, 28, "#141a26");
  rect(svg, x + 3, on ? y + 3 : y + 15, 12, 12, GC); rect(svg, x + 4, on ? y + 4 : y + 16, 10, 10, on ? R5.verde[2] : R5.naranja[2]); rect(svg, x + 4, on ? y + 4 : y + 16, 10, 2, on ? R5.verde[3] : R5.naranja[3]);
  if (on && brillo) rect(brillo, x - 2, y - 2, 22, 20, R5.verde[0]);
  if (icono) iconoG(svg, x + 4, y + 33, icono, on);
}
// Vitrina (90×70) con un sobre, una carpeta y una foto dentro; candado (cerrado 0..1)
function vitrinaG(svg, brillo, x, y, cerrado) {
  caja5(svg, x, y + 60, 90, 14, P6.CARTON);
  rect(svg, x + 2, y, 86, 60, GC); rect(svg, x + 3, y + 1, 84, 58, "#16202e"); rect(svg, x + 5, y + 3, 3, 52, "#3a5068"); rect(svg, x + 10, y + 3, 1, 30, "#2a3a50");
  // sobre (correo), carpeta y foto
  rect(svg, x + 10, y + 32, 22, 16, GC); rect(svg, x + 11, y + 33, 20, 14, "#f5f7fb"); linea(svg, x + 11, y + 33, x + 21, y + 41, R5.naranja[2], 1); linea(svg, x + 31, y + 33, x + 21, y + 41, R5.naranja[2], 1);
  rect(svg, x + 36, y + 30, 22, 18, GC); rect(svg, x + 37, y + 33, 20, 14, P6.ORO[1]); rect(svg, x + 37, y + 31, 9, 3, P6.ORO[2]);
  rect(svg, x + 62, y + 30, 18, 18, GC); rect(svg, x + 63, y + 31, 16, 16, "#f5f7fb"); rect(svg, x + 64, y + 32, 14, 10, R5.ia[1]); rect(svg, x + 66, y + 37, 6, 4, R5.verde[2]);
  if (brillo) rect(brillo, x - 2, y - 2, 94, 64, "#14233a");
  // candado delante, en la cerradura
  const cy = y + 62, ab = Math.round((1 - cerrado) * 5);
  rect(svg, x + 40, cy - 9 - ab, 10, 2, GC); rect(svg, x + 40, cy - 9 - ab, 2, 9 + ab, GC); rect(svg, x + 48, cy - 9 - ab, 2, cerrado >= 1 ? 9 : 4, GC);
  rect(svg, x + 37, cy, 16, 12, GC); rect(svg, x + 38, cy + 1, 14, 10, P6.ORO[1]); rect(svg, x + 38, cy + 1, 14, 2, P6.ORO[2]); rect(svg, x + 44, cy + 4, 2, 4, GC);
}
// Botón de pausa (14×14) y avatar de canal tachado (14×14)
function pausaG(svg, x, y) { rect(svg, x, y, 14, 14, GC); rect(svg, x + 1, y + 1, 12, 12, "#f5f7fb"); rect(svg, x + 4, y + 3, 2, 8, GC); rect(svg, x + 8, y + 3, 2, 8, GC); }
function canalTachadoG(svg, x, y, rampa = R5.verde) { disco(svg, x + 7, y + 7, 7, GC); disco(svg, x + 7, y + 7, 6, rampa[1]); disco(svg, x + 7, y + 5, 2, rampa[3]); linea(svg, x + 1, y + 1, x + 13, y + 13, R5.naranja[2], 2); }
// Taza genérica (anuncio sin personalizar): 14×12
function tazaG(svg, x, y) { rect(svg, x, y, 12, 12, GC); rect(svg, x + 1, y + 1, 10, 10, "#f5f7fb"); rect(svg, x + 1, y + 1, 10, 2, "#ffffff"); rect(svg, x + 11, y + 3, 4, 6, GC); rect(svg, x + 12, y + 4, 2, 4, "#f5f7fb"); rect(svg, x + 3, y + 5, 6, 3, R5.ia[2]); }
