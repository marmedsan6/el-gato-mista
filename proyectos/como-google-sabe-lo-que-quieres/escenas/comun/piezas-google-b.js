// como-google-sabe-lo-que-quieres · piezas de los bloques 3-8 (el rastro, las recomendaciones, el anuncio, las cookies y
// los controles). Estilo v6 a 4 px. Necesita piezas-google.js (y lo que este necesita). Contrato seek(t): todo desde t.

// ---------- bloques 3-4: el rastro y las recomendaciones ----------
// Ventana genérica (buscador o navegador): barra de título con tres botones y, debajo, el contenido. Devuelve el interior.
function ventanaG(svg, brillo, x, y, w, h, { placa = null } = {}) {
  caja5(svg, x, y, w, h, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]);
  rect(svg, x + 1, y + 1, w - 2, 9, "#1d2433"); rect(svg, x + 1, y + 1, w - 2, 1, "#3a4258");
  [R5.naranja[2], P6.ORO[2], R5.verde[2]].forEach((c, k) => rect(svg, x + 4 + k * 5, y + 4, 3, 3, c));
  if (placa) placa6(svg, x + w - 8 * placa.length - 10, y - 15, placa, { color: "#f5f7fb", fondo: "#0c1016" });
  const ix = x + 3, iy = y + 12, iw = w - 6, ih = h - 15;
  rect(svg, ix, iy, iw, ih, G.PANTALLA[0]);
  if (brillo) rect(brillo, x - 4, y - 4, w + 8, h + 8, "#101c30");
  return { ix, iy, iw, ih };
}
// Barra de búsqueda con el dibujo del robot que se «escribe» (escrito 0..1) y la lupa
function barraBusquedaG(svg, x, y, w, escrito) {
  rect(svg, x - 1, y - 1, w + 2, 14, GC); rect(svg, x, y, w, 12, "#e4e8f0"); rect(svg, x, y + 11, w, 1, "#b4bccb");
  disco(svg, x + 7, y + 6, 3, GC); disco(svg, x + 7, y + 6, 2, "#e4e8f0"); rect(svg, x + 9, y + 8, 2, 2, GC);
  if (escrito > 0) { miniRobotG(svg, x + 14, y + 3); if (escrito > 0.5) for (let k = 0; k < Math.round((escrito - 0.5) * 8); k++) rect(svg, x + 30 + k * 4, y + 5, 3, 2, G.TEXTO_GRIS); }
}
// Icono de 10×10 con contorno
function iconoG(svg, x, y, tipo, on = true) {
  const a = on ? 2 : 1;
  rect(svg, x, y, 10, 10, GC); rect(svg, x + 1, y + 1, 8, 8, on ? "#1a2238" : "#10141e");
  const c = { lupa: R5.ia, mapa: R5.verde, globo: R5.ia, movil: R5.metal, chincheta: R5.naranja, reloj: P6.ORO, ojo: R5.ia, edad: P6.ORO,
    estrella: P6.ORO, play: R5.naranja, escoba: P6.ORO, flecha: R5.verde, pulgar: R5.verde, abajo: R5.naranja, clic: R5.metal, huellas: R5.naranja, ip: R5.ia, cookie: P6.CARTON, grupo: R5.verde }[tipo] || R5.ia;
  const k = c[a], l = c[Math.min(c.length - 1, a + 1)];
  switch (tipo) {
    case "lupa": disco(svg, x + 4, y + 4, 2, k); rect(svg, x + 4, y + 4, 1, 1, "#1a2238"); rect(svg, x + 6, y + 6, 2, 2, l); break;
    case "mapa": rect(svg, x + 2, y + 2, 6, 6, k); rect(svg, x + 4, y + 2, 1, 6, l); rect(svg, x + 2, y + 5, 6, 1, l); break;
    case "globo": disco(svg, x + 4, y + 4, 3, k); rect(svg, x + 1, y + 4, 7, 1, l); rect(svg, x + 4, y + 1, 1, 7, l); break;
    case "movil": rect(svg, x + 3, y + 1, 4, 8, k); rect(svg, x + 4, y + 2, 2, 5, "#5b8cff"); break;
    case "chincheta": disco(svg, x + 4, y + 3, 2, k); rect(svg, x + 4, y + 5, 1, 4, l); break;
    case "reloj": rect(svg, x + 2, y + 1, 6, 1, k); rect(svg, x + 2, y + 8, 6, 1, k); rect(svg, x + 3, y + 2, 4, 2, l); rect(svg, x + 4, y + 4, 2, 2, l); rect(svg, x + 3, y + 6, 4, 2, k); break;
    case "ojo": rect(svg, x + 2, y + 4, 6, 2, "#e4e8f0"); rect(svg, x + 3, y + 3, 4, 4, "#e4e8f0"); rect(svg, x + 4, y + 4, 2, 2, k); break;
    case "edad": rect(svg, x + 2, y + 4, 6, 4, k); rect(svg, x + 3, y + 2, 1, 2, l); rect(svg, x + 6, y + 2, 1, 2, l); break;
    case "estrella": rect(svg, x + 4, y + 1, 2, 8, k); rect(svg, x + 1, y + 4, 8, 2, k); rect(svg, x + 3, y + 3, 4, 4, l); break;
    case "play": for (let j = 0; j < 6; j++) rect(svg, x + 3, y + 2 + j, 1 + Math.min(j, 5 - j), 1, k); break;
    case "escoba": linea(svg, x + 2, y + 1, x + 6, y + 6, P6.CARTON[3], 1); rect(svg, x + 5, y + 6, 4, 3, k); break;
    case "flecha": rect(svg, x + 2, y + 5, 4, 2, k); rect(svg, x + 5, y + 3, 1, 6, l); rect(svg, x + 6, y + 4, 1, 4, l); rect(svg, x + 7, y + 5, 1, 2, l); break;
    case "pulgar": rect(svg, x + 2, y + 5, 2, 4, k); rect(svg, x + 4, y + 4, 4, 5, l); rect(svg, x + 5, y + 1, 2, 3, l); break;
    case "abajo": rect(svg, x + 2, y + 1, 2, 4, k); rect(svg, x + 4, y + 1, 4, 5, l); rect(svg, x + 5, y + 6, 2, 3, l); break;
    case "clic": rect(svg, x + 3, y + 1, 1, 7, "#f5f7fb"); rect(svg, x + 4, y + 2, 1, 5, "#f5f7fb"); rect(svg, x + 5, y + 3, 1, 4, "#f5f7fb"); rect(svg, x + 6, y + 5, 1, 1, "#f5f7fb"); break;
    case "huellas": rect(svg, x + 2, y + 6, 2, 2, k); rect(svg, x + 5, y + 4, 2, 2, k); rect(svg, x + 3, y + 2, 2, 1, l); rect(svg, x + 6, y + 1, 2, 1, l); break;
    case "ip": rect(svg, x + 2, y + 2, 1, 6, k); rect(svg, x + 4, y + 2, 1, 6, l); rect(svg, x + 5, y + 2, 2, 1, l); rect(svg, x + 7, y + 3, 1, 2, l); rect(svg, x + 5, y + 5, 2, 1, l); break;
    case "cookie": disco(svg, x + 4, y + 4, 3, k); rect(svg, x + 3, y + 3, 1, 1, P6.CARTON[0]); rect(svg, x + 5, y + 5, 1, 1, P6.CARTON[0]); break;
    case "grupo": rect(svg, x + 1, y + 5, 3, 3, k); rect(svg, x + 6, y + 5, 3, 3, k); rect(svg, x + 3, y + 2, 4, 5, l); break;
    default: rect(svg, x + 3, y + 3, 4, 4, k);
  }
}
// Archivador de la cuenta: n cajones con icono; abiertos = índices con su ficha; extra = 0..1 el cajón de la casilla
function archivadorG(svg, brillo, x, y, t, { iconos = [], abiertos = [], extra = 0 } = {}) {
  const n = iconos.length, ch = 18, w = 64, h = n * (ch + 3) + 8;
  caja5(svg, x, y, w, h + (extra > 0 ? ch + 3 : 0), R5.oficina.slice(0, 4));
  const cajon = (k, yy, rampa, ic, abierto) => {
    const sale = abierto ? 10 : 0;
    if (abierto) rect(svg, x + 4, yy, w - 8, ch, "#05070b");
    caja5(svg, x + 4 + sale, yy, w - 8, ch, rampa);
    rect(svg, x + w / 2 - 2 + sale, yy + ch - 5, 12, 2, P6.ORO[1]);
    if (ic) iconoG(svg, x + 8 + sale, yy + 4, ic, abierto);
    if (abierto) { fichaG(svg, x + 26 + sale, yy - 3); if (brillo) rect(brillo, x + 20 + sale, yy - 6, 26, 12, "#3a2c1c"); }
  };
  iconos.forEach((ic, k) => cajon(k, y + 5 + k * (ch + 3), R5.oficina.slice(1, 5), ic, abiertos.includes(k)));
  if (extra > 0) cajon(n, y + 5 + n * (ch + 3), ["#1d2f6b", "#3a5fc0", "#5b8cff", "#9fc4ff"], "huellas", extra >= 1);
  return { w, h, boca: [x + w / 2, y] };
}
// Casilla grande (24×24) que se marca
function casillaG(svg, brillo, x, y, marcada) {
  rect(svg, x, y, 24, 24, GC); rect(svg, x + 2, y + 2, 20, 20, "#e4e8f0"); rect(svg, x + 2, y + 2, 20, 2, "#ffffff"); rect(svg, x + 2, y + 20, 20, 2, "#b4bccb");
  if (marcada) { cheque6(svg, x + 6, y + 7); if (brillo) rect(brillo, x - 4, y - 4, 32, 32, R5.verde[0]); }
}
// Pestaña de navegador (20×10)
function pestanaG(svg, x, y, color = R5.ia) {
  rect(svg, x, y + 2, 20, 8, GC); rect(svg, x + 2, y, 16, 3, GC); rect(svg, x + 3, y + 1, 14, 2, color[2]); rect(svg, x + 1, y + 3, 18, 6, color[1]); rect(svg, x + 3, y + 5, 10, 1, color[3]);
}
// Ficha de papel (10×8) con dos rayas
function fichaG(svg, x, y, color = G.PAPEL) {
  rect(svg, x, y, 10, 8, GC); rect(svg, x + 1, y + 1, 8, 6, color[2]); rect(svg, x + 2, y + 2, 6, 1, G.TEXTO_GRIS); rect(svg, x + 2, y + 4, 4, 1, G.TEXTO_GRIS);
}
// Web pequeña al fondo (28×22) con o sin el puntito de Google
function webG(svg, brillo, x, y, { punto = false, luz = false, anuncio = false } = {}) {
  caja5(svg, x, y, 28, 22, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]);
  rect(svg, x + 2, y + 4, 24, 16, luz ? "#22304a" : "#141a26");
  rect(svg, x + 4, y + 7, 14, 1, "#3a4560"); rect(svg, x + 4, y + 10, 18, 1, "#3a4560");
  if (anuncio) rect(svg, x + 4, y + 13, 20, 5, luz ? R5.naranja[1] : "#2a1d1c");
  if (punto) { rect(svg, x + 21, y + 1, 5, 4, GC); rect(svg, x + 22, y + 2, 3, 2, luz ? R5.ia[3] : R5.ia[1]); if (luz && brillo) rect(brillo, x + 19, y - 1, 9, 8, R5.ia[1]); }
}
// Isla del mapa de internet: tipo buscador | reproductor | navegador | tienda | oscura
function islaG(svg, brillo, cx, cy, tipo, { luz = false, pegatina = false, t = 0 } = {}) {
  elipse5(svg, cx, cy + 6, 30, 9, GC); elipse5(svg, cx, cy + 6, 29, 8, luz ? "#22545a" : "#141c24"); elipse5(svg, cx - 4, cy + 4, 20, 5, luz ? "#2f6f72" : "#18222c");
  elipse5(svg, cx, cy + 14, 26, 2, "#05070b");
  if (tipo === "oscura") { caja5(svg, cx - 10, cy - 14, 20, 18, ["#0c0f16", "#121620", "#181d2a", "#20263a"]); return; }
  caja5(svg, cx - 16, cy - 20, 32, 24, luz ? ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"] : ["#0a0c12", "#10131c", "#181c28", "#20263a"]);
  rect(svg, cx - 13, cy - 16, 26, 16, luz ? G.PANTALLA[1] : "#0b0f16");
  if (tipo === "tienda") { rect(svg, cx - 13, cy - 16, 26, 4, luz ? R5.naranja[1] : "#2a1d1c"); miniRobotG(svg, cx - 6, cy - 9); }
  if (luz) {
    if (tipo === "reproductor") iconoG(svg, cx - 5, cy - 13, "play");
    else if (tipo === "buscador") iconoG(svg, cx - 5, cy - 13, "lupa");
    else if (tipo === "navegador") pestanaG(svg, cx - 10, cy - 14, R5.ia);
    if (brillo) rect(brillo, cx - 18, cy - 22, 36, 28, "#14233a");
  }
  if (pegatina) { const on = Math.floor(t * 3) % 2 === 0; rect(svg, cx + 10, cy - 26, 10, 10, GC); rect(svg, cx + 11, cy - 25, 8, 8, on ? R5.ia[3] : R5.ia[2]); rect(svg, cx + 12, cy - 24, 3, 3, "#f5f7fb"); if (brillo) rect(brillo, cx + 6, cy - 30, 18, 18, R5.ia[1]); }
}
// Faro central (Google) que barre con su luz
function faroG(svg, brillo, cx, base, t) {
  for (let j = 0; j < 60; j++) { const a = 8 - Math.floor(j / 12); rect(svg, cx - a - 1, base - j, 2 * a + 2, 1, GC); rect(svg, cx - a, base - j, 2 * a, 1, Math.floor(j / 8) % 2 ? "#e4e8f0" : R5.ia[2]); }
  rect(svg, cx - 7, base - 70, 14, 10, GC); rect(svg, cx - 6, base - 69, 12, 8, "#fff1c4"); rect(svg, cx - 8, base - 73, 16, 3, GC);
  if (brillo) { const dx = Math.floor(t * 1.5) % 2 ? 1 : -1; for (let k = 0; k < 18; k++) rect(brillo, cx + dx * (8 + k * 4) - (dx < 0 ? 4 : 0), base - 66 - Math.floor(k / 3), 4, 6 + Math.floor(k / 2), "#3a3420"); }
}
// Puente de luz de una isla al faro (crece 0..1)
function puenteG(svg, brillo, x0, y0, x1, y1, crece) {
  if (crece <= 0) return;
  const xe = Math.round(x0 + (x1 - x0) * crece), ye = Math.round(y0 + (y1 - y0) * crece);
  linea(svg, x0, y0, xe, ye, GC, 3); linea(svg, x0, y0, xe, ye, R5.ia[2], 1);
  if (brillo) linea(brillo, x0, y0, xe, ye, R5.ia[1], 5);
}
// Embudo de dos pisos (unos 150×110 desde x, y): lluvia de miniaturas, el primer piso deja pasar unas pocas, el segundo las ordena
function embudoDosPisosG(svg, brillo, x, y, t, { lluvia = 0, piso1 = 0, piso2 = 0, semilla = 3 } = {}) {
  const cx = x + 75;
  const embudo = (yy, a0, a1, alto, rampa) => { for (let j = 0; j < alto; j++) { const a = Math.round(a0 + (a1 - a0) * (j / alto)); rect(svg, cx - a - 1, yy + j, 2 * a + 2, 1, GC); rect(svg, cx - a, yy + j, 2 * a, 1, rampa[j < 3 ? 3 : 2]); if (j % 5 === 2) rect(svg, cx - a + 3, yy + j, 4, 1, rampa[3]); } };
  embudo(y + 30, 74, 14, 26, R5.metal); rect(svg, cx - 14, y + 56, 28, 8, GC); rect(svg, cx - 13, y + 56, 26, 7, R5.metal[1]);
  embudo(y + 70, 44, 10, 20, ["#1d2f6b", "#3a5fc0", "#5b8cff", "#9fc4ff"]); rect(svg, cx - 10, y + 90, 20, 6, GC); rect(svg, cx - 9, y + 90, 18, 5, R5.ia[1]);
  const az = mulberry32(semilla), cols = [R5.ia, R5.verde, P6.ORO, R5.naranja, R5.labLuz];
  for (let k = 0; k < 26; k++) { // miniaturas que caen sobre el primer piso
    const xx = x + Math.floor(az() * 150), ff = az(), c = cols[Math.floor(az() * cols.length)];
    if (k / 26 >= lluvia) continue;
    const yy = y + Math.round(((t * 0.7 + ff) % 1) * 34) - 4;
    rect(svg, xx, yy, 9, 6, GC); rect(svg, xx + 1, yy + 1, 7, 4, c[1]); rect(svg, xx + 1, yy + 1, 3, 1, c[3]);
  }
  if (piso1 > 0) for (let k = 0; k < 4; k++) { const f = (t * 0.9 + k / 4) % 1; rect(svg, cx - 4, y + 58 + Math.round(f * 12), 9, 6, GC); rect(svg, cx - 3, y + 59 + Math.round(f * 12), 7, 4, cols[k % 5][2]); }
  if (piso2 > 0) { // la fila ordenada que sale por abajo hacia la derecha
    rect(svg, cx - 1, y + 96, 2, 8, GC); rect(svg, cx - 1, y + 104, 92, 2, GC);
    const n = Math.round(piso2 * 6);
    for (let k = 0; k < n; k++) { rect(svg, cx + 8 + k * 14, y + 96, 12, 8, GC); rect(svg, cx + 9 + k * 14, y + 97, 10, 6, cols[k % 5][2]); rect(svg, cx + 9 + k * 14, y + 97, 10, 1, cols[k % 5][3]); }
  }
}
// Balanza (unos 110×70): inclina = -1 (gana el clic) … 1 (gana el reloj). Devuelve el centro de cada plato.
function balanzaG(svg, x, y, inclina) {
  const cx = x + 55, d = Math.round(inclina * 10);
  rect(svg, cx - 3, y + 10, 6, 54, GC); rect(svg, cx - 2, y + 10, 4, 54, P6.ORO[1]); rect(svg, cx - 2, y + 10, 1, 54, P6.ORO[2]);
  rect(svg, cx - 18, y + 62, 36, 6, GC); rect(svg, cx - 17, y + 62, 34, 4, P6.ORO[1]);
  linea(svg, cx - 44, y + 12 - d, cx + 44, y + 12 + d, GC, 4); linea(svg, cx - 44, y + 12 - d, cx + 44, y + 12 + d, P6.ORO[2], 2);
  disco(svg, cx, y + 12, 4, GC); disco(svg, cx, y + 12, 3, P6.ORO[2]);
  const plato = (px, py) => { linea(svg, px, py, px - 12, py + 18, GC, 1); linea(svg, px, py, px + 12, py + 18, GC, 1); rect(svg, px - 16, py + 18, 32, 4, GC); rect(svg, px - 15, py + 18, 30, 2, P6.ORO[2]); return [px, py + 18]; };
  return { izq: plato(cx - 44, y + 12 - d), der: plato(cx + 44, y + 12 + d) };
}
// Cursor de clic (10×15) y reloj de arena (14×20) que corre
function cursorG(svg, x, y) {
  const filas = ["o.........", "oo........", "obo.......", "obbo......", "obbbo.....", "obbbbo....", "obbbbbo...", "obbbbbbo..", "obbbbbbbo.", "obbbbbooo.", "obbobo....", "obo.obo...", "oo..obo...", "o....obo..", ".....oo..."];
  sprite5(svg, x, y, filas, { o: GC, b: "#f5f7fb" });
}
function relojArenaG(svg, x, y, t) {
  rect(svg, x, y, 14, 2, GC); rect(svg, x, y + 18, 14, 2, GC); rect(svg, x + 1, y, 12, 1, P6.CARTON[3]); rect(svg, x + 1, y + 18, 12, 1, P6.CARTON[3]);
  for (let j = 0; j < 8; j++) { const a = 6 - Math.floor(j * 0.7); rect(svg, x + 7 - a, y + 2 + j, 2 * a, 1, GC); rect(svg, x + 8 - a, y + 2 + j, 2 * a - 2, 1, "#9fd8e0"); rect(svg, x + 7 - a, y + 17 - j, 2 * a, 1, GC); rect(svg, x + 8 - a, y + 17 - j, 2 * a - 2, 1, "#9fd8e0"); }
  const f = (t * 0.25) % 1, arriba = Math.round((1 - f) * 6), abajo = Math.round(f * 6);
  for (let j = 0; j < arriba; j++) rect(svg, x + 4, y + 9 - j, 6, 1, P6.ORO[2]);
  for (let j = 0; j < abajo; j++) rect(svg, x + 3, y + 16 - j, 8, 1, P6.ORO[1]);
  if (Math.floor(t * 8) % 2) rect(svg, x + 7, y + 10, 1, 5, P6.ORO[2]);
}
// Contador mecánico de visualizaciones: rodillos que giran y barra de nivel 0..1
function contadorG(svg, x, y, nivel, t) {
  caja5(svg, x, y, 76, 44, R5.metal);
  for (let k = 0; k < 4; k++) { rect(svg, x + 7 + k * 16, y + 6, 13, 16, GC); rect(svg, x + 8 + k * 16, y + 7, 11, 14, "#e4e8f0"); const g = Math.floor(t * (6 - k)) % 3; rect(svg, x + 10 + k * 16, y + 9 + g * 3, 7, 2, G.TEXTO_GRIS); }
  rect(svg, x + 6, y + 28, 64, 10, GC); rect(svg, x + 7, y + 29, Math.round(62 * nivel), 8, R5.naranja[2]); rect(svg, x + 7, y + 29, Math.round(62 * nivel), 2, R5.naranja[3]);
}
// Palanca del tablero (12×30) con su icono debajo; arriba = 0..1
function palancaG(svg, x, y, arriba, icono, on) {
  rect(svg, x, y, 12, 30, GC); rect(svg, x + 1, y + 1, 10, 28, "#141a26");
  const py = y + 22 - Math.round(arriba * 16);
  rect(svg, x + 5, py, 2, y + 26 - py, R5.metal[3]); rect(svg, x + 2, py - 4, 8, 6, GC); rect(svg, x + 3, py - 3, 6, 4, on ? R5.naranja[2] : R5.metal[2]);
  iconoG(svg, x + 1, y + 32, icono, on);
}
// Persona genérica (busto sobre un cuerpo) con su tele pequeña al lado: para «gente parecida»
function personaTeleG(svg, brillo, x, su, t, { camisa = R5.ia, mini = null, semilla = 1 } = {}) {
  caja5(svg, x + 40, su - 26, 34, 26, P6.CARTON);
  teleG(svg, brillo, x + 36, su - 72, 44, 34, t, { dentro: (sx, sy, sw, sh) => {
    rect(svg, sx, sy, sw, sh, "#1a2236");
    if (mini === "robot") { rect(svg, sx, sy + sh - 6, sw, 6, G.SUELO[2]); miniRobotG(svg, sx + 12, sy + sh - 11); }
    else if (mini === "escoba") { rect(svg, sx, sy, sw, sh, "#24324a"); linea(svg, sx + 8, sy + 2, sx + 24, sy + sh - 6, P6.CARTON[3], 2); rect(svg, sx + 20, sy + sh - 8, 10, 5, P6.ORO[2]); }
  } });
  rect(svg, x + 1, su - 32, 24, 32, GC); rect(svg, x + 2, su - 32, 22, 31, camisa[0]); rect(svg, x + 2, su - 32, 7, 31, camisa[1]);
  persona5(svg, x, su - 66, t + semilla, { camisa });
}
// Tarjeta de artículo de Discover (dentro de un móvil), 28 de alto
function tarjetaG(svg, x, y, w, tipo, semilla = 1) {
  rect(svg, x - 1, y - 1, w + 2, 30, GC); rect(svg, x, y, w, 28, "#1a2236");
  const az = mulberry32(semilla), c = [R5.ia, R5.verde, P6.ORO, R5.labLuz][Math.floor(az() * 4)];
  rect(svg, x + 2, y + 2, w - 4, 14, c[0]); rect(svg, x + 2, y + 9, w - 4, 7, c[1]);
  if (tipo === "comparativa") { rect(svg, x + 2, y + 2, w - 4, 14, "#26304a"); miniRobotG(svg, x + 4, y + 8); miniRobotG(svg, x + w - 16, y + 8); rect(svg, x + Math.floor(w / 2) - 1, y + 4, 2, 10, P6.ORO[2]); }
  rect(svg, x + 2, y + 19, w - 10, 2, "#4a5774"); rect(svg, x + 2, y + 23, Math.round(w * 0.5), 2, "#33405a");
}
// Tubo neumático (horizontal y vertical) por el que viaja una ficha (f 0..1)
function tuboG(svg, brillo, pts, f) {
  for (let i = 1; i < pts.length; i++) { linea(svg, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], GC, 8); linea(svg, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], "#22304a", 6); linea(svg, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], "#3a4a6a", 1); }
  if (f <= 0 || f >= 1) return;
  let largo = 0; const segs = []; for (let i = 1; i < pts.length; i++) { const s = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); segs.push(s); largo += s; }
  let d = f * largo;
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) { const g = segs[i] ? d / segs[i] : 0, x = Math.round(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * g), y = Math.round(pts[i][1] + (pts[i + 1][1] - pts[i][1]) * g); fichaG(svg, x - 5, y - 4); if (brillo) rect(brillo, x - 8, y - 7, 16, 14, "#3a2c1c"); return; } d -= segs[i]; }
}
// Chorro (corriente de miniaturas) de grosor g que entra en una tele: para comparar recomendaciones con suscripciones y búsquedas
function chorroG(svg, x0, y, x1, g, t, rampa, fase = 0) {
  rect(svg, x0, y - Math.floor(g / 2) - 1, x1 - x0, g + 2, GC); rect(svg, x0, y - Math.floor(g / 2), x1 - x0, g, rampa[0]);
  for (let x = x0 + Math.round((t * 30 + fase) % 12); x < x1 - 6; x += 12) rect(svg, x, y - Math.floor(g / 2) + 1, 6, Math.max(1, g - 2), rampa[2]);
}
