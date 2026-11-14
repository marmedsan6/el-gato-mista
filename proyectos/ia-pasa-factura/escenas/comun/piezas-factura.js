// ia-pasa-factura · piezas propias de los dos shorts (estilo v6: arte a 4 px, contorno y 3 tonos, luz arriba a la izquierda).
// Se apoyan en R5 (v5/dibujo.js), P6 (v6/piezas.js) y GC/G (piezas-google.js, copia de como-google). Coordenadas en
// unidades de arte; (x, y) = esquina superior izquierda salvo que se diga otra cosa. Sin reloj: todo depende de t.
const FZ = {
  AZUL: ["#16285a", "#2c4c9c", "#4f7ee8", "#9fc4ff"],         // el resumen de IA y las pantallas
  AMBAR: ["#6a4210", "#b0701c", "#f0a83a", "#ffd486"],        // candado, pagarés, ojo del robot
  BILLETE: ["#1f4a34", "#2f6e4c", "#4f9a6c", "#9fd6b0"],
  CRUZ: ["#0d5a42", "#13936a", "#1fd69a", "#8ff0c8"],         // cruz de farmacia (verde, como en España)
  CAMISAS: [["#1d2f6b", "#3a5fc0", "#5b8cff"], ["#0d5a42", "#13936a", "#1fd69a"], ["#7a3a14", "#c25e22", "#ff8a3d"],
    ["#4a2a5c", "#6e4488", "#9a6ab8"], ["#5c4a1a", "#8a6e2a", "#c29c3e"]],
};

// Paseante genérico (unos 10×24; pies en yPie). dir 1 = mira a la derecha. anda: alterna piernas cada 0,2 s.
function paseanteF(svg, x, yPie, t, { camisa = FZ.CAMISAS[0], dir = 1, anda = true, fase = 0 } = {}) {
  const paso = anda ? Math.floor((t + fase) / 0.2) % 2 : 0, y = yPie - 24, O = GC;
  if (paso) { rect(svg, x + 2, y + 18, 3, 6, O); rect(svg, x + 6, y + 17, 3, 6, O); rect(svg, x + 3, y + 18, 1, 5, "#2a3246"); rect(svg, x + 7, y + 17, 1, 5, "#2a3246"); }
  else { rect(svg, x + 3, y + 17, 4, 7, O); rect(svg, x + 4, y + 17, 2, 6, "#2a3246"); }
  rect(svg, x + 1, y + 8, 9, 10, O); rect(svg, x + 2, y + 9, 7, 8, camisa[1]); rect(svg, x + 2, y + 9, 2, 8, camisa[2]); rect(svg, x + 8, y + 9, 1, 8, camisa[0]);
  rect(svg, x + 2, y + 1, 7, 7, O); rect(svg, x + 3, y + 2, 5, 5, R5.piel[1]); rect(svg, x + 3, y + 2, 5, 2, R5.pelo[0]);
  rect(svg, dir > 0 ? x + 7 : x + 3, y + 4, 1, 1, O);
}

// El resumen de IA: cartel luminoso azul con una estrella de cuatro puntas y tres líneas (sin texto). Devuelve sus enlaces.
function cartelResumenF(svg, brillo, x, y, w, h, t, { on = 1, enlaces = 0 } = {}) {
  caja5(svg, x, y, w, h, FZ.AZUL);
  rect(svg, x + 3, y + 3, w - 6, h - 6, on ? "#1b3570" : "#121a30");
  const sx = x + 9, sy = y + 10, b = on ? FZ.AZUL[3] : FZ.AZUL[1];
  rect(svg, sx - 1, sy - 5, 3, 11, b); rect(svg, sx - 5, sy - 1, 11, 3, b); rect(svg, sx, sy - 2, 1, 5, "#f5f7fb");
  for (let k = 0; k < 3; k++) rect(svg, x + 20, y + 7 + k * 6, Math.round((w - 28) * (k === 2 ? 0.6 : 1)), 2, on ? "#9fc4ff" : "#3a4a6a");
  const pts = [];
  for (let k = 0; k < enlaces; k++) { const ex = x + 6 + k * 12, ey = y + h - 9; rect(svg, ex, ey, 8, 5, GC); rect(svg, ex + 1, ey + 1, 6, 3, "#22304a"); pts.push([ex, ey]); }
  if (on && brillo) rect(brillo, x - 3, y - 3, w + 6, h + 6, Math.floor(t * 2) % 2 ? "#1d2f6b" : "#16285a");
  return pts;
}

// Tienda-web pequeña (unos 70×74; suelo en su): toldo, escaparate con luz cálida y puerta que se abre (0..1).
function tiendaWebF(svg, brillo, x, su, t, { abierta = 1, luz = 1, placa = null } = {}) {
  const y = su - 74;
  caja5(svg, x, y + 12, 70, 62, G.SALON);
  for (let k = 0; k < 6; k++) { rect(svg, x - 3 + k * 13, y + 4, 13, 10, GC); rect(svg, x - 2 + k * 13, y + 5, 11, 8, k % 2 ? P6.ORO[1] : "#efe6d2"); rect(svg, x - 2 + k * 13, y + 10, 11, 3, k % 2 ? P6.ORO[0] : "#b8ad96"); }
  rect(svg, x + 6, y + 22, 30, 26, GC); rect(svg, x + 8, y + 24, 26, 22, luz ? "#4a3a24" : "#1a1612");
  if (luz) { rect(svg, x + 8, y + 24, 26, 3, P6.ORO[2]); if (brillo) rect(brillo, x + 4, y + 20, 34, 30, "#3a2c1c"); }
  rect(svg, x + 44, y + 28, 20, 46, GC); rect(svg, x + 46, y + 30, 16, 44, "#120e0c");
  const a = Math.round(16 * (1 - abierta)); if (a > 0) { rect(svg, x + 46, y + 30, a, 44, P6.CARTON[1]); rect(svg, x + 46, y + 30, 1, 44, P6.CARTON[3]); }
  if (placa) placa6(svg, x + 4, y - 12, placa, { color: "#f5f7fb", fondo: "#0c1016" });
  return { puerta: [x + 54, su] };
}

// Edificio del foro (unos w×h): fachada con ventanas que se encienden (0..1), placa con su nombre y una puerta.
function foroF(svg, brillo, x, su, w, h, t, { encendidas = 1, placa = null, semilla = 4 } = {}) {
  const y = su - h;
  caja5(svg, x, y, w, h, R5.hormigon);
  rect(svg, x - 4, y - 4, w + 8, 6, GC); rect(svg, x - 3, y - 3, w + 6, 4, R5.hormigon[3]);
  const az = mulberry32(semilla);
  for (let yy = y + 10; yy < su - 34; yy += 14) for (let xx = x + 8; xx < x + w - 14; xx += 14) {
    const on = az() < encendidas; rect(svg, xx, yy, 8, 8, GC); rect(svg, xx + 1, yy + 1, 6, 6, on ? R5.ventana[0] : "#141a26");
    if (on) { rect(svg, xx + 1, yy + 1, 6, 2, R5.ventana[1]); if (brillo) rect(brillo, xx - 1, yy - 1, 10, 10, "#2a2414"); }
  }
  const px = x + Math.round(w / 2) - 12; rect(svg, px, su - 30, 24, 30, GC); rect(svg, px + 2, su - 28, 20, 28, "#1a1410");
  if (placa) placa6(svg, x + Math.round(w / 2) - 4 * placa.length - 2, y - 22, placa, { color: "#f5f7fb", fondo: "#0c1016" });
  return { puerta: [px, su - 30] };
}

// Candado ámbar (unos 18×22 por e): arco abierto o cerrado (0..1). e = escala entera.
function candadoF(svg, brillo, x, y, cierre, e = 1) {
  const r = (a, b, w, h, c) => rect(svg, x + a * e, y + b * e, w * e, h * e, c), d = Math.round(6 * (1 - cierre));
  r(3, -d, 12, 3, GC); r(3, -d, 3, 11, GC); r(12, -d, 3, 11 - (d ? 4 : 0), GC);
  r(4, 1 - d, 1, 8, R5.metal[3]); r(13, 1 - d, 1, 6, R5.metal[3]);
  r(0, 9, 18, 13, GC); r(1, 10, 16, 11, FZ.AMBAR[1]); r(1, 10, 16, 3, FZ.AMBAR[2]); r(1, 10, 2, 11, FZ.AMBAR[3]); r(14, 13, 3, 8, FZ.AMBAR[0]);
  r(8, 13, 3, 5, GC);
  if (cierre >= 1 && brillo) rect(brillo, x - 3 * e, y + 6 * e, 24 * e, 19 * e, FZ.AMBAR[0]);
}

// Globo terráqueo pequeño (unos 22×28) con un punto que se enciende fuera de América (on).
function globoF(svg, brillo, x, y, on) {
  disco(svg, x + 11, y + 11, 11, GC); disco(svg, x + 11, y + 11, 10, "#1d3a6a"); disco(svg, x + 8, y + 8, 5, "#2c4c9c");
  rect(svg, x + 4, y + 6, 6, 9, R5.verde[1]); rect(svg, x + 5, y + 7, 3, 4, R5.verde[2]); // América
  rect(svg, x + 13, y + 5, 5, 6, R5.verde[1]); rect(svg, x + 14, y + 12, 4, 6, R5.verde[1]); // Europa y África
  rect(svg, x + 10, y + 22, 2, 3, GC); rect(svg, x + 6, y + 25, 10, 3, GC); rect(svg, x + 7, y + 25, 8, 2, R5.metal[2]);
  if (on) { rect(svg, x + 13, y + 5, 5, 5, GC); rect(svg, x + 14, y + 6, 3, 3, FZ.AMBAR[3]); if (brillo) rect(brillo, x + 10, y + 2, 11, 11, FZ.AMBAR[1]); }
}

// La IA: robot-bibliotecario (unos 26×40; pies en yPie), cabeza cuadrada, antena, un ojo ámbar. lee: libro abierto.
function robotBiblioF(svg, brillo, x, yPie, t, { lee = true, llama = 0 } = {}) {
  const y = yPie - 40, O = GC, M = R5.metal;
  rect(svg, x + 12, y, 2, 5, O); disco(svg, x + 13, y, 2, FZ.AMBAR[2]);
  caja5(svg, x + 4, y + 5, 18, 14, M);
  const parp = Math.floor(t * 0.7) % 5 === 0 && (t * 0.7) % 1 < 0.15;
  rect(svg, x + 10, y + 10, 6, parp ? 1 : 4, FZ.AMBAR[2]); if (!parp) rect(svg, x + 11, y + 11, 2, 1, "#fff1c4");
  if (brillo) rect(brillo, x + 8, y + 8, 10, 8, FZ.AMBAR[0]);
  caja5(svg, x + 2, y + 20, 22, 14, M);
  rect(svg, x + 6, y + 34, 4, 6, O); rect(svg, x + 16, y + 34, 4, 6, O);
  if (lee) { // libro abierto en las manos; la página pasa cada 1,5 s
    rect(svg, x - 2, y + 22, 30, 10, O); rect(svg, x - 1, y + 23, 13, 8, P6.PAPEL[2]); rect(svg, x + 14, y + 23, 13, 8, P6.PAPEL[3]);
    for (let k = 0; k < 3; k++) { rect(svg, x + 1, y + 25 + k * 2, 9, 1, P6.PAPEL[0]); rect(svg, x + 16, y + 25 + k * 2, 9, 1, P6.PAPEL[0]); }
    if ((t % 1.5) < 0.3) rect(svg, x + 12, y + 21, 3, 11, P6.PAPEL[1]);
  } else { // brazo que llama
    const a = Math.round(Math.abs(Math.sin(llama * Math.PI)) * 3);
    rect(svg, x + 23, y + 20 - a, 8, 4, O); rect(svg, x + 24, y + 21 - a, 6, 2, M[2]);
  }
}

// Libro (unos 10×14) de color; en blanco: sin líneas.
function libroF(svg, x, y, rampa, blanco = false) {
  rect(svg, x, y, 10, 14, GC); rect(svg, x + 1, y + 1, 8, 12, rampa[1]); rect(svg, x + 1, y + 1, 2, 12, rampa[2]); rect(svg, x + 8, y + 1, 1, 12, rampa[0]);
  if (!blanco) { rect(svg, x + 4, y + 4, 4, 1, rampa[3] || "#efe6d2"); rect(svg, x + 4, y + 7, 3, 1, rampa[3] || "#efe6d2"); }
}

// Bocadillo con un símbolo pixel dibujado (no letra): "?" pregunta, "!" respuesta. (unos 14×14)
function bocadilloSimF(svg, x, y, tipo) {
  rect(svg, x, y, 14, 11, GC); rect(svg, x + 1, y + 1, 12, 9, "#efe6d2"); rect(svg, x + 3, y + 11, 3, 3, GC); rect(svg, x + 4, y + 10, 1, 2, "#efe6d2");
  const c = tipo === "?" ? R5.ia[1] : R5.verde[1];
  if (tipo === "?") { rect(svg, x + 5, y + 2, 4, 1, c); rect(svg, x + 8, y + 3, 1, 2, c); rect(svg, x + 6, y + 5, 2, 1, c); rect(svg, x + 6, y + 8, 2, 1, c); }
  else { rect(svg, x + 6, y + 2, 2, 5, c); rect(svg, x + 6, y + 8, 2, 1, c); }
}

// Mesa del foro (unos 40×22; suelo en su) con hasta dos personas sentadas (ocupada 0..2) y su bocadillo.
function mesaF(svg, x, su, t, ocupada, fase = 0) {
  const y = su - 14;
  rect(svg, x, y, 40, 4, GC); rect(svg, x + 1, y + 1, 38, 2, P6.CARTON[3]); rect(svg, x + 3, y + 4, 3, 10, GC); rect(svg, x + 34, y + 4, 3, 10, GC);
  for (let k = 0; k < ocupada; k++) {
    const px = x + (k ? 26 : 2), c = FZ.CAMISAS[(k + fase) % FZ.CAMISAS.length];
    rect(svg, px, y - 14, 10, 12, GC); rect(svg, px + 1, y - 13, 8, 10, c[1]); rect(svg, px + 1, y - 13, 2, 10, c[2]);
    rect(svg, px + 1, y - 22, 8, 8, GC); rect(svg, px + 2, y - 21, 6, 6, R5.piel[1]); rect(svg, px + 2, y - 21, 6, 2, R5.pelo[k % 2]);
    if (Math.floor((t + fase * 0.7 + k) / 1.4) % 2 === 0) bocadilloSimF(svg, px - 2, y - 40 + (Math.floor(t * 2 + k) % 2), k % 2 ? "!" : "?");
  }
}

// Caja registradora grande (unos 92×70). lleno 0..1 en el cajón; negativo: el cajón vacío con su marcador abajo.
function cajaRegistradoraF(svg, brillo, x, y, t, { lleno = 0.6, abierto = 1, visor = 0 } = {}) {
  caja5(svg, x + 10, y, 72, 30, R5.metal);
  rect(svg, x + 16, y + 6, 44, 14, GC); rect(svg, x + 17, y + 7, 42, 12, "#0e2a1e");
  if (visor < 0) { rect(svg, x + 30, y + 12, 16, 3, FZ.AMBAR[2]); if (brillo) rect(brillo, x + 26, y + 9, 24, 9, FZ.AMBAR[0]); } // el visor en negativo: solo un «−»
  else if (visor > 0) for (let k = 0; k < 3; k++) rect(svg, x + 22 + k * 10, y + 10, 6, 6, R5.verde[2]);
  for (let k = 0; k < 6; k++) rect(svg, x + 64 + (k % 2) * 7, y + 6 + Math.floor(k / 2) * 7, 5, 5, k === 5 ? FZ.AMBAR[2] : R5.metal[3]);
  caja5(svg, x, y + 30, 92, 30, R5.metal);
  const cy = y + 46 + Math.round(10 * abierto);
  rect(svg, x + 6, cy, 80, 14, GC); rect(svg, x + 7, cy + 1, 78, 12, "#1a1e2a");
  for (let k = 0; k < 4; k++) { rect(svg, x + 8 + k * 19, cy + 2, 1, 10, GC); }
  const n = Math.round(lleno * 16);
  for (let k = 0; k < n; k++) { const c = k % 4, f = Math.floor(k / 4); monedaG(svg, x + 10 + c * 19, cy + 2 - f * 3); }
  return { boca: [x + 46, y - 2], salidaIzq: [x - 2, y + 40], salidaDer: [x + 94, y + 40], cajon: [x + 46, cy + 7] };
}

// Factura (sobre cerrado o abierto con su papel), unos 24×16.
function sobreF(svg, x, y, abierto = 0) {
  if (abierto > 0) { const h = Math.round(14 * abierto); rect(svg, x + 3, y - h, 18, h + 2, GC); rect(svg, x + 4, y - h + 1, 16, h + 1, P6.PAPEL[3]); for (let k = 0; k < Math.floor(h / 4); k++) rect(svg, x + 6, y - h + 3 + k * 4, 12, 1, P6.PAPEL[0]); }
  rect(svg, x, y, 24, 16, GC); rect(svg, x + 1, y + 1, 22, 14, P6.PAPEL[2]);
  linea(svg, x + 1, y + 1, x + 12, y + 9, P6.PAPEL[0], 1); linea(svg, x + 23, y + 1, x + 12, y + 9, P6.PAPEL[0], 1);
  rect(svg, x + 1, y + 13, 22, 2, P6.PAPEL[1]);
}

// Pagaré (unos 20×14): papel con sello ámbar.
// Pagaré (unos 28×12): papel alargado ámbar claro con firma y sello ámbar; distinto del sobre de la factura.
function pagareF(svg, x, y) {
  rect(svg, x, y, 28, 12, GC); rect(svg, x + 1, y + 1, 26, 10, "#f3e2b8"); rect(svg, x + 1, y + 1, 26, 2, "#fff4d6"); rect(svg, x + 1, y + 9, 26, 2, "#d8c08a");
  linea(svg, x + 4, y + 7, x + 8, y + 5, R5.ia[1], 1); linea(svg, x + 8, y + 5, x + 11, y + 8, R5.ia[1], 1); linea(svg, x + 11, y + 8, x + 15, y + 5, R5.ia[1], 1);
  disco(svg, x + 22, y + 6, 4, GC); disco(svg, x + 22, y + 6, 3, FZ.AMBAR[1]); rect(svg, x + 21, y + 4, 2, 2, FZ.AMBAR[3]);
}
// Montón de pagarés (n hojas apiladas, 3 unidades por hoja; base en su)
function montonF(svg, x, su, n) {
  for (let k = 0; k < n; k++) { const y = su - 3 - k * 3, dx = (k * 7) % 3 - 1; rect(svg, x + dx, y, 30, 3, GC); rect(svg, x + dx + 1, y, 28, 2, k % 2 ? P6.PAPEL[2] : P6.PAPEL[1]); }
  if (n > 0) { const y = su - 3 - (n - 1) * 3; disco(svg, x + 24, y, 3, FZ.AMBAR[1]); }
}

// Rack de servidores (unos 40×h) con luces que parpadean y un ventilador que gira; placa opcional.
function rackF(svg, brillo, x, y, h, t, { placa = null, semilla = 2 } = {}) {
  caja5(svg, x, y, 40, h, ["#0e1018", "#1a1e2a", "#262b3a", "#3a4258"]);
  const az = mulberry32(semilla);
  for (let yy = y + 5; yy < y + h - 14; yy += 8) {
    rect(svg, x + 4, yy, 32, 6, GC); rect(svg, x + 5, yy + 1, 30, 4, "#161a26");
    for (let k = 0; k < 3; k++) { const on = Math.floor(t * (2 + az() * 4) + az() * 10) % 2 === 0; rect(svg, x + 7 + k * 4, yy + 2, 2, 2, on ? (k ? R5.verde[3] : FZ.AZUL[3]) : "#2a3246"); if (on && brillo) rect(brillo, x + 6 + k * 4, yy + 1, 4, 4, R5.verde[0]); }
  }
  const fx = x + 20, fy = y + h - 9, g = Math.floor(t * 8) % 2;
  disco(svg, fx, fy, 6, GC); disco(svg, fx, fy, 5, "#2a3246");
  if (g) { rect(svg, fx - 4, fy - 1, 9, 2, R5.metal[3]); rect(svg, fx - 1, fy - 4, 2, 9, R5.metal[2]); } else { linea(svg, fx - 3, fy - 3, fx + 3, fy + 3, R5.metal[3], 2); linea(svg, fx - 3, fy + 3, fx + 3, fy - 3, R5.metal[2], 2); }
  if (placa) placa6(svg, x + 20 - 4 * placa.length - 2, y - 14, placa, { color: "#f5f7fb", fondo: "#0c1016" });
}
// Ondas de calor que suben (columna de 3 líneas que ondulan).
function calorF(svg, x, y, t) {
  for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) { const dx = Math.round(Math.sin(t * 3 + j + k) * 2); rect(svg, x + k * 8 + dx, y - j * 6 - ((t * 12) % 6), 2, 3, "#4a2c24"); }
}

// Pila (unos 18×32 por e) con nivel 0..1 y polo; las rayitas marcan cuartos.
function pilaF(svg, brillo, x, y, nivel, e = 1) {
  const r = (a, b, w, h, c) => rect(svg, x + a * e, y + b * e, w * e, h * e, c);
  r(6, 0, 6, 3, GC); r(7, 1, 4, 2, R5.metal[3]);
  r(0, 3, 18, 29, GC); r(1, 4, 16, 27, R5.metal[1]); r(1, 4, 3, 27, R5.metal[3]); r(15, 4, 2, 27, R5.metal[0]);
  r(4, 6, 10, 23, GC); r(5, 7, 8, 21, "#0e1018");
  const h = Math.max(1, Math.round(21 * nivel)); r(5, 28 - h, 8, h, R5.verde[2]); r(5, 28 - h, 2, h, R5.verde[3]);
  for (let k = 1; k < 4; k++) r(5, 28 - Math.round(21 * k / 4), 8, 1, "#2a3246");
  if (brillo) rect(brillo, x + 3 * e, y + (26 - h) * e, 12 * e, (h + 4) * e, R5.verde[0]);
}
// Gota de agua (unos 6×9)
function gotaF(svg, x, y) { rect(svg, x + 2, y, 2, 2, GC); rect(svg, x + 1, y + 2, 4, 2, GC); rect(svg, x, y + 4, 6, 4, GC); rect(svg, x + 1, y + 8, 4, 1, GC); rect(svg, x + 2, y + 2, 2, 2, FZ.AZUL[2]); rect(svg, x + 1, y + 4, 4, 4, FZ.AZUL[2]); rect(svg, x + 1, y + 4, 1, 2, FZ.AZUL[3]); }
// Vaso de cristal (unos 36×46) con n gotas dentro: el agua sube un poco por gota.
function vasoF(svg, x, y, n) {
  rect(svg, x, y, 36, 46, GC); rect(svg, x + 2, y, 32, 44, "#1c2a44"); rect(svg, x + 2, y, 32, 2, "#9fc4ff");
  rect(svg, x + 3, y + 3, 2, 36, "#5b8cff"); rect(svg, x + 30, y + 3, 2, 38, "#16203a");
  for (let k = 1; k <= 5; k++) rect(svg, x + 26, y + 44 - k, 4, 1, "#3a4a6a");                      // rayitas del fondo
  const h = n; if (h > 0) { rect(svg, x + 2, y + 44 - h, 32, h, FZ.AZUL[2]); rect(svg, x + 2, y + 44 - h, 32, 1, FZ.AZUL[3]); }
  rect(svg, x - 2, y, 40, 2, GC);
}

// Grúa (torre de unos 100 de alto; suelo en su) con su gancho que sube una pieza (carga 0..1).
function gruaF(svg, x, su, t, carga) {
  const top = su - 110;
  for (let yy = top; yy < su; yy += 8) { rect(svg, x, yy, 10, 8, GC); rect(svg, x + 1, yy + 1, 8, 6, FZ.AMBAR[1]); linea(svg, x + 1, yy + 1, x + 8, yy + 6, FZ.AMBAR[0], 1); }
  rect(svg, x - 20, top - 6, 90, 6, GC); rect(svg, x - 19, top - 5, 88, 4, FZ.AMBAR[2]);
  rect(svg, x - 22, top - 4, 10, 10, GC); rect(svg, x - 21, top - 3, 8, 8, R5.metal[2]);
  const gx = x + 54, gy = su - 30 - Math.round(carga * 50);
  rect(svg, gx, top, 1, gy - top, GC); rect(svg, gx - 2, gy, 5, 3, GC);
  caja5(svg, gx - 10, gy + 3, 22, 14, ["#0e1018", "#1a1e2a", "#262b3a", "#3a4258"]);
  rect(svg, gx - 6, gy + 7, 2, 2, R5.verde[3]); rect(svg, gx - 2, gy + 7, 2, 2, FZ.AZUL[3]);
}
// Nave de servidores (unos w×56; suelo en su): se ilumina por tramos (encendida 0..1).
function naveF(svg, brillo, x, su, w, encendida) {
  const y = su - 56;
  caja5(svg, x, y, w, 56, ["#11141c", "#1a1e2a", "#262b3a", "#3a4258"]);
  rect(svg, x - 2, y - 4, w + 4, 6, GC); rect(svg, x - 1, y - 3, w + 2, 4, R5.metal[2]);
  const n = Math.floor((w - 8) / 10);
  for (let k = 0; k < n; k++) { const on = k / n < encendida; rect(svg, x + 5 + k * 10, y + 12, 6, 30, GC); rect(svg, x + 6 + k * 10, y + 13, 4, 28, on ? "#1b3570" : "#121620");
    if (on) { rect(svg, x + 7 + k * 10, y + 16, 2, 2, R5.verde[3]); rect(svg, x + 7 + k * 10, y + 24, 2, 2, FZ.AZUL[3]); if (brillo) rect(brillo, x + 4 + k * 10, y + 11, 8, 32, "#16285a"); } }
}
// Camión con una caja de chips (unos 60×30; suelo en su)
function camionF(svg, brillo, x, su, t) {
  const y = su - 30;
  caja5(svg, x, y, 40, 22, R5.hormigon); cajaChips6(svg, x + 12, y + 5);
  caja5(svg, x + 40, y + 6, 18, 16, FZ.AMBAR); rect(svg, x + 46, y + 9, 9, 6, GC); rect(svg, x + 47, y + 10, 7, 4, "#22304a");
  const g = Math.floor(t * 6) % 2;
  [x + 8, x + 30, x + 50].forEach((cx) => { disco(svg, cx, su - 4, 4, GC); disco(svg, cx, su - 4, 2, R5.metal[g ? 3 : 2]); });
}

// Farmacia lejana: fachada con la cruz verde que se enciende (on).
function farmaciaF(svg, brillo, x, su, t, on = true) {
  const y = su - 70;
  caja5(svg, x, y, 60, 70, ["#1f1a24", "#2a2330", "#362c3c", "#45384a"]);
  const cx = x + 30, cy = y + 18, c = on ? FZ.CRUZ : ["#0d1a14", "#14261e", "#1a3328", "#1f3d30"];
  rect(svg, cx - 5, cy - 13, 10, 26, GC); rect(svg, cx - 13, cy - 5, 26, 10, GC);
  rect(svg, cx - 4, cy - 12, 8, 24, c[2]); rect(svg, cx - 12, cy - 4, 24, 8, c[2]); rect(svg, cx - 4, cy - 12, 3, 24, c[3]);
  if (on && brillo) { rect(brillo, cx - 15, cy - 15, 30, 30, R5.verde[0]); }
  rect(svg, x + 8, y + 38, 44, 32, GC); rect(svg, x + 10, y + 40, 40, 30, on ? "#2a3a30" : "#151a18"); rect(svg, x + 10, y + 40, 40, 3, on ? "#8ff0c8" : "#1a2420");
}

// Bocadillo con un reloj dibujado (la respuesta «hasta las...» sin texto), unos 30×26.
function bocadilloRelojF(svg, x, y, t) {
  rect(svg, x, y, 30, 22, GC); rect(svg, x + 1, y + 1, 28, 20, "#efe6d2"); rect(svg, x + 4, y + 22, 4, 4, GC); rect(svg, x + 5, y + 21, 2, 3, "#efe6d2");
  disco(svg, x + 15, y + 11, 8, GC); disco(svg, x + 15, y + 11, 7, "#f5f7fb");
  rect(svg, x + 15, y + 5, 1, 6, GC); rect(svg, x + 15, y + 11, 5, 1, GC);
}

// Chispa de luz (la pregunta que viaja), unos 9×9.
function chispaF(svg, brillo, x, y, t, e = 1) {
  const g = Math.floor(t * 10) % 2, r = (a, b, w, h, c) => rect(svg, x + a * e, y + b * e, w * e, h * e, c);
  r(3, 0, 3, 9, GC); r(0, 3, 9, 3, GC); r(3, 1, 3, 7, FZ.AZUL[3]); r(1, 3, 7, 3, FZ.AZUL[3]); r(3, 3, 3, 3, "#f5f7fb");
  if (g) { r(1, 1, 1, 1, "#f5f7fb"); r(7, 7, 1, 1, "#f5f7fb"); }
  if (brillo) rect(brillo, x - 4 * e, y - 4 * e, 17 * e, 17 * e, FZ.AZUL[1]);
}

// Portapapeles del observador (unos 14×18) con marcas que se tachan.
function portapapelesF(svg, x, y, marcas) {
  rect(svg, x, y + 2, 14, 16, GC); rect(svg, x + 1, y + 3, 12, 14, P6.PAPEL[2]); rect(svg, x + 4, y, 6, 4, GC); rect(svg, x + 5, y + 1, 4, 2, R5.metal[3]);
  for (let k = 0; k < Math.min(marcas, 8); k++) rect(svg, x + 3 + (k % 4) * 2, y + 6 + Math.floor(k / 4) * 5, 1, 4, R5.ia[1]);
}

// Calendario de seis hojas (unos 30×34): pasan (0..6) desde la hoja de partida.
function calendarioSeisF(svg, x, y, pasadas) {
  rect(svg, x, y, 30, 34, GC); rect(svg, x + 1, y + 1, 28, 7, R5.ia[1]);
  rect(svg, x + 8, y - 3, 3, 6, GC); rect(svg, x + 19, y - 3, 3, 6, GC);
  rect(svg, x + 1, y + 8, 28, 25, "#efe6d2");
  const n = Math.min(6, Math.floor(pasadas));
  for (let k = 0; k < 6; k++) { const cx = x + 4 + (k % 3) * 8, cy = y + 12 + Math.floor(k / 3) * 9; rect(svg, cx, cy, 6, 6, k < n ? R5.ia[1] : P6.PAPEL[1]); if (k < n) rect(svg, cx + 1, cy + 1, 4, 4, R5.ia[2]); }
}

// Flecha gruesa pixel de (x0, y0) a (x1, y1) con punta (para el bucle).
function flechaF(svg, x0, y0, x1, y1, color = FZ.AZUL[2]) {
  linea(svg, x0, y0, x1, y1, GC, 6); linea(svg, x0, y0, x1, y1, color, 3);
  const a = Math.atan2(y1 - y0, x1 - x0), p = (d, s) => [Math.round(x1 - Math.cos(a + s) * d), Math.round(y1 - Math.sin(a + s) * d)];
  const [ax, ay] = p(9, 0.6), [bx, by] = p(9, -0.6);
  linea(svg, x1, y1, ax, ay, GC, 5); linea(svg, x1, y1, bx, by, GC, 5); linea(svg, x1, y1, ax, ay, color, 2); linea(svg, x1, y1, bx, by, color, 2);
}

// Bombilla (unos 10×14): «lo que cuesta funcionar» (la luz)
function bombillaF(svg, x, y) {
  disco(svg, x + 5, y + 5, 5, GC); disco(svg, x + 5, y + 5, 4, P6.ORO[2]); rect(svg, x + 3, y + 3, 2, 2, "#fff1c4");
  rect(svg, x + 3, y + 9, 5, 5, GC); rect(svg, x + 4, y + 10, 3, 3, R5.metal[2]);
}
// Billete (unos 18×10): la nómina
function billeteF(svg, x, y) {
  rect(svg, x, y, 18, 10, GC); rect(svg, x + 1, y + 1, 16, 8, FZ.BILLETE[2]); rect(svg, x + 1, y + 1, 16, 2, FZ.BILLETE[3]);
  disco(svg, x + 9, y + 5, 2, FZ.BILLETE[0]); rect(svg, x + 2, y + 7, 3, 1, FZ.BILLETE[1]); rect(svg, x + 13, y + 7, 3, 1, FZ.BILLETE[1]);
}
// Balanza grande (unos 190 de ancho; base en su), sombreada, con los platos colgados de cuerdas. inclina 0..1 baja el
// plato derecho. Devuelve el centro de la superficie de cada plato.
function balanzaGrandeF(svg, brillo, x, su, inclina) {
  const cx = x + 95, top = su - 150, d = Math.round(inclina * 22), O = P6.ORO;
  caja5(svg, cx - 34, su - 14, 68, 14, R5.metal);                                            // peana
  rect(svg, cx - 5, top, 10, su - 14 - top, GC); rect(svg, cx - 4, top, 8, su - 14 - top, O[1]); rect(svg, cx - 4, top, 3, su - 14 - top, O[2]); rect(svg, cx + 2, top, 2, su - 14 - top, O[0]);
  const ax = cx - 80, ay = top + 6 - d, bx = cx + 80, by = top + 6 + d;                        // brazo
  linea(svg, ax, ay, bx, by, GC, 8); linea(svg, ax, ay, bx, by, O[1], 5); linea(svg, ax, ay - 1, bx, by - 1, O[2], 2);
  disco(svg, cx, top + 6, 8, GC); disco(svg, cx, top + 6, 6, O[1]); disco(svg, cx - 2, top + 4, 3, O[2]);
  const plato = (px, py) => {
    disco(svg, px, py, 3, GC); disco(svg, px, py, 2, O[2]);
    [-26, 26].forEach((dx) => { linea(svg, px, py, px + dx, py + 90, GC, 3); linea(svg, px, py, px + dx, py + 90, O[2], 1); });
    const sy = py + 90; rect(svg, px - 32, sy, 64, 6, GC); rect(svg, px - 31, sy + 1, 62, 3, O[2]); rect(svg, px - 31, sy + 4, 62, 1, O[0]);
    rect(svg, px - 24, sy + 6, 48, 3, GC); rect(svg, px - 23, sy + 6, 46, 2, O[1]);
    return [px, sy];
  };
  return { izq: plato(ax, ay), der: plato(bx, by) };
}
// Salón gemelo visto por una ventana (unos 64×52): otro foro que sigue lleno, con cabezas y bocadillos que salen.
function salonGemeloF(svg, brillo, x, y, t) {
  caja5(svg, x, y, 64, 52, R5.metal);
  rect(svg, x + 4, y + 4, 56, 44, "#123a2c"); rect(svg, x + 4, y + 36, 56, 12, "#0d5a42");
  if (brillo) rect(brillo, x + 2, y + 2, 60, 48, R5.verde[0]);
  for (let k = 0; k < 6; k++) {
    const hx = x + 8 + (k % 3) * 18, hy = y + 26 + Math.floor(k / 3) * 10, c = FZ.CAMISAS[k % 5];
    rect(svg, hx, hy, 8, 8, GC); rect(svg, hx + 1, hy + 1, 6, 6, c[1]); rect(svg, hx + 1, hy - 5, 6, 5, GC); rect(svg, hx + 2, hy - 4, 4, 3, R5.piel[1]);
  }
  for (let k = 0; k < 2; k++) { const f = (t * 0.6 + k * 0.5) % 1; if (f < 0.7) bocadilloSimF(svg, x + 10 + k * 26, Math.round(y + 14 - f * 8), k ? "!" : "?"); }
  rect(svg, x + 31, y + 4, 2, 44, R5.metal[1]); rect(svg, x + 4, y + 24, 56, 2, R5.metal[1]);       // cruz de la ventana
}

// Vaso pequeño (unos 16×20) con n gotas: casi nada de agua
function vasitoF(svg, x, y, n) {
  rect(svg, x, y, 16, 20, GC); rect(svg, x + 1, y, 14, 19, "#1c2a44"); rect(svg, x + 1, y, 14, 1, "#9fc4ff"); rect(svg, x + 2, y + 2, 1, 15, "#5b8cff");
  if (n > 0) { rect(svg, x + 1, y + 19 - Math.min(6, n), 14, Math.min(6, n), FZ.AZUL[2]); rect(svg, x + 1, y + 19 - Math.min(6, n), 14, 1, FZ.AZUL[3]); }
}
