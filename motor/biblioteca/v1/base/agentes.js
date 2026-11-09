// resumen-semana-agentes · objetos propios del vídeo en estilo v3 (unidades de 12 px, sombreado a mano: luz arriba a la
// izquierda, sombra abajo a la derecha, contorno oscuro). Deterministas: solo t y semillas.
// Decisiones de Mario (2026-11-06): agentes = robots pixel pequeños; skills = cartuchos de videojuego; sello «MATIZ».
// Necesita pixel.js (rect, linea) y v3/props.js (P3).

const ROBOT = { azul: ["#5b8cff", "#3a5fc0", "#8fb0ff"], verde: ["#1fd69a", "#13936a", "#7af0c4"], naranja: ["#ff8a3d", "#c25e22", "#ffb27a"],
  dorado: ["#f2c14e", "#b8902e", "#ffe08a"], gris: ["#8a93a6", "#5d6478", "#b8bfcf"], rojo: ["#e0454f", "#a32e37", "#ff8a92"] };

// Robot agente 8×11: cabeza con pantalla-cara, antena, cuerpo y piernas. cara: feliz | pensar | error | dormido.
// trabaja: da saltitos de 1 unidad; jefe: gorra y portapapeles, sin herramientas.
function robot3(svg, x, y, t, { color = "azul", cara = "feliz", trabaja = false, jefe = false, semilla = 0, herramienta = false } = {}) {
  const [c, s, l] = ROBOT[color] || ROBOT.azul, C = P3.contorno;
  const dy = trabaja && Math.floor(t / 0.2 + semilla) % 2 === 0 ? -1 : 0;
  const yy = y + dy;
  // antena (parpadea la luz)
  rect(svg, x + 4, yy, 1, 2, C); rect(svg, x + 3, yy - 1, 3, 1, C);
  rect(svg, x + 4, yy - 1, 1, 1, Math.floor(t / 0.5 + semilla) % 2 ? P3.rojo : P3.dorado);
  // cabeza 8×6 con bisel
  rect(svg, x, yy + 2, 8, 6, C);
  rect(svg, x + 1, yy + 3, 6, 4, c); rect(svg, x + 1, yy + 3, 6, 1, l); rect(svg, x + 6, yy + 4, 1, 3, s);
  rect(svg, x + 2, yy + 4, 4, 2, "#0e1a24");
  const ojo = cara === "error" ? P3.rojo : cara === "dormido" ? "#3a4a5a" : P3.verde;
  if (cara === "error") { rect(svg, x + 2, yy + 4, 1, 1, ojo); rect(svg, x + 5, yy + 4, 1, 1, ojo); rect(svg, x + 3, yy + 5, 2, 1, ojo); }
  else if (cara === "pensar") { rect(svg, x + 2, yy + 4, 1, 1, ojo); rect(svg, x + 5, yy + 4, 1, 1, ojo); rect(svg, x + 4, yy + 5, 1, 1, ojo); }
  else if (cara === "dormido") { rect(svg, x + 2, yy + 5, 1, 1, ojo); rect(svg, x + 5, yy + 5, 1, 1, ojo); }
  else { rect(svg, x + 2, yy + 4, 1, 1, ojo); rect(svg, x + 5, yy + 4, 1, 1, ojo); rect(svg, x + 3, yy + 5, 2, 1, ojo); }
  // cuerpo 6×3 y piernas
  rect(svg, x + 1, yy + 8, 6, 3, C); rect(svg, x + 2, yy + 8, 4, 2, s); rect(svg, x + 2, yy + 8, 4, 1, c);
  rect(svg, x + 2, y + 11, 1, 1, C); rect(svg, x + 5, y + 11, 1, 1, C);
  if (jefe) { // gorra y portapapeles
    rect(svg, x, yy + 1, 8, 2, C); rect(svg, x + 1, yy + 1, 6, 1, P3.rojo); rect(svg, x + 6, yy + 2, 3, 1, C);
    rect(svg, x - 3, yy + 7, 3, 4, C); rect(svg, x - 2, yy + 8, 1, 2, P3.papel);
  }
  if (herramienta) { rect(svg, x + 8, yy + 7, 1, 3, C); rect(svg, x + 8, yy + 6, 2, 1, P3.metalLuz); } // llave inglesa
}

// Cerebro 9×7 (el modelo): rosa sombreado con surcos
function cerebro3(svg, x, y, t = 0, { brilla = false } = {}) {
  const C = P3.contorno;
  rect(svg, x + 1, y, 7, 1, C); rect(svg, x, y + 1, 9, 5, C); rect(svg, x + 1, y + 6, 7, 1, C);
  rect(svg, x + 1, y + 1, 7, 5, "#e8919c"); rect(svg, x + 1, y + 1, 6, 1, "#f6b8c0"); rect(svg, x + 7, y + 2, 1, 4, "#b8606c");
  rect(svg, x + 4, y + 1, 1, 5, "#b8606c"); rect(svg, x + 2, y + 3, 2, 1, "#c46e7a"); rect(svg, x + 5, y + 4, 2, 1, "#c46e7a");
  if (brilla && Math.floor(t / 0.3) % 2 === 0) rect(svg, x + 2, y + 2, 1, 1, P3.blanco);
}

// Bucle del agente 9×9: cuatro flechas en círculo (lee → piensa → actúa → mira); paso = cuál se ilumina
function bucle3(svg, x, y, t, { color = P3.naranja, gira = true, roto = false } = {}) {
  const C = P3.contorno, paso = gira ? Math.floor(t / 0.25) % 4 : 0;
  const seg = [[2, 0, 5, 1], [8, 2, 1, 5], [2, 8, 5, 1], [0, 2, 1, 5]];
  rect(svg, x + 1, y + 1, 7, 7, "#141a26");
  seg.forEach(([dx, dy, w, h], k) => rect(svg, x + dx, y + dy, w, h, roto && k === 3 ? "#3a3f52" : k === paso ? P3.blanco : color));
  [[1, 1], [7, 1], [7, 7], [1, 7]].forEach(([dx, dy]) => rect(svg, x + dx, y + dy, 1, 1, C));
  rect(svg, x + 7, y + 0, 1, 1, color); rect(svg, x + 8, y + 7, 1, 1, color); rect(svg, x + 1, y + 8, 1, 1, color); rect(svg, x, y + 1, 1, 1, color); // puntas
  rect(svg, x + 3, y + 3, 3, 3, C); rect(svg, x + 4, y + 4, 1, 1, color);
}

// Cartucho de videojuego 7×9 (una skill): etiqueta de color y muescas
function cartucho3(svg, x, y, color = P3.azul) {
  const C = P3.contorno, s = SOMBRA_DE[color] || "#2c3550";
  rect(svg, x, y, 7, 9, C);
  rect(svg, x + 1, y + 1, 5, 7, "#4a5068"); rect(svg, x + 1, y + 1, 5, 1, "#6a7090"); rect(svg, x + 5, y + 2, 1, 6, "#2e3346");
  rect(svg, x + 1, y + 2, 4, 4, color); rect(svg, x + 1, y + 2, 4, 1, P3.blanco); rect(svg, x + 4, y + 3, 1, 3, s);
  for (let k = 0; k < 3; k++) rect(svg, x + 1 + k * 2, y + 8, 1, 1, P3.dorado); // contactos
}

// Moneda 5×5 dorada
function moneda3(svg, x, y) {
  const C = P3.contorno;
  rect(svg, x + 1, y, 3, 1, C); rect(svg, x, y + 1, 5, 3, C); rect(svg, x + 1, y + 4, 3, 1, C);
  rect(svg, x + 1, y + 1, 3, 3, P3.dorado); rect(svg, x + 1, y + 1, 2, 1, "#ffe08a"); rect(svg, x + 3, y + 2, 1, 2, "#b8902e");
  rect(svg, x + 2, y + 2, 1, 1, "#b8902e");
}

// Caja fuerte 16×14 con rueda; abierta: la puerta se ve de canto y el interior vacío
function cajaFuerte3(svg, x, y, t, { abierta = false, alarma = false } = {}) {
  const C = P3.contorno;
  rect(svg, x, y, 16, 14, C);
  rect(svg, x + 1, y + 1, 14, 12, P3.metal); rect(svg, x + 1, y + 1, 14, 1, P3.metalLuz); rect(svg, x + 14, y + 2, 1, 11, P3.metalSombra);
  if (!abierta) {
    rect(svg, x + 3, y + 3, 10, 8, P3.metalSombra); rect(svg, x + 3, y + 3, 10, 1, P3.metalLuz);
    rect(svg, x + 7, y + 6, 3, 3, C); rect(svg, x + 8, y + 7, 1, 1, P3.dorado);
  } else {
    rect(svg, x + 3, y + 3, 10, 8, "#0b0f18"); rect(svg, x + 3, y + 3, 10, 1, "#141a26");
    rect(svg, x + 13, y + 2, 2, 10, P3.metalLuz); rect(svg, x + 15, y + 3, 1, 8, C);
  }
  if (alarma && Math.floor(t / 0.3) % 2 === 0) rect(svg, x + 6, y - 2, 4, 2, P3.rojo);
}

// Ingeniero 6×12 (persona): pelo, cara crema, camiseta de color y portátil delante si lleva
function ingeniero3(svg, x, y, t, { camiseta = P3.azul, portatil = true, pillado = false, semilla = 0 } = {}) {
  const C = P3.contorno;
  rect(svg, x + 1, y, 4, 2, "#3a2a20"); rect(svg, x + 1, y + 2, 4, 3, P3.crema); rect(svg, x + 1, y + 2, 4, 1, "#3a2a20");
  rect(svg, x + 2, y + 3, 1, 1, C); rect(svg, x + 4, y + 3, 1, 1, C);
  rect(svg, x, y + 5, 6, 5, C); rect(svg, x + 1, y + 5, 4, 4, camiseta); rect(svg, x + 4, y + 6, 1, 3, SOMBRA_DE[camiseta] || "#2c3550");
  rect(svg, x + 1, y + 10, 1, 2, C); rect(svg, x + 4, y + 10, 1, 2, C);
  if (portatil) {
    rect(svg, x + 4, y + 6, 6, 4, C); rect(svg, x + 5, y + 7, 4, 2, pillado && Math.floor(t / 0.2 + semilla) % 2 === 0 ? P3.rojo : "#2a6a8a");
    rect(svg, x + 3, y + 10, 8, 1, C);
  }
}

// Extensión 14×10: un paquete con piezas de puzle y una puertecita que se abre (puerta trasera)
function extension3(svg, x, y, t, { puerta = 0 } = {}) {
  const C = P3.contorno;
  rect(svg, x, y, 14, 10, C);
  rect(svg, x + 1, y + 1, 12, 8, "#2f6fd0"); rect(svg, x + 1, y + 1, 12, 1, "#5b8cff"); rect(svg, x + 12, y + 2, 1, 7, "#22508f");
  rect(svg, x + 6, y - 2, 3, 2, C); rect(svg, x + 7, y - 2, 1, 2, "#5b8cff"); // pieza de puzle
  rect(svg, x + 3, y + 3, 4, 4, "#e9eef8"); rect(svg, x + 4, y + 4, 2, 2, "#5b8cff"); // icono
  // puerta trasera al lado derecho: 0 cerrada, 1 entreabierta, 2 abierta con luz roja
  rect(svg, x + 9, y + 3, 3, 5, puerta ? "#0b0f18" : "#22508f");
  if (puerta >= 1) rect(svg, x + 12, y + 3, 1, 5, P3.metalLuz);
  if (puerta >= 2) { rect(svg, x + 10, y + 5, 1, 1, P3.rojo); if (Math.floor(t / 0.25) % 2 === 0) rect(svg, x + 13, y + 4, 2, 3, "#5a1a20"); }
}

// Llave 7×3 (clave SSH del atacante), en rojo
function llaveRoja3(svg, x, y) {
  const C = P3.contorno;
  rect(svg, x, y, 3, 3, C); rect(svg, x + 1, y + 1, 1, 1, P3.rojo); rect(svg, x + 3, y + 1, 4, 1, C);
  rect(svg, x + 5, y + 2, 1, 1, C); rect(svg, x + 6, y + 2, 1, 1, C);
  rect(svg, x, y, 2, 1, "#ff8a92");
}

// Reloj de pared 9×9 con aguja que avanza a escalones
function reloj3(svg, x, y, t, { color = P3.blanco, velocidad = 1 } = {}) {
  const C = P3.contorno;
  rect(svg, x + 2, y, 5, 1, C); rect(svg, x + 1, y + 1, 7, 7, C); rect(svg, x + 2, y + 8, 5, 1, C); rect(svg, x, y + 2, 9, 5, C);
  rect(svg, x + 2, y + 2, 5, 5, color); rect(svg, x + 1, y + 3, 7, 3, color);
  const paso = Math.floor(t * velocidad * 2) % 8, dirs = [[0, -2], [1, -2], [2, 0], [1, 2], [0, 2], [-1, 2], [-2, 0], [-1, -2]];
  const [dx, dy] = dirs[paso];
  rect(svg, x + 4, y + 4, 1, 1, C); rect(svg, x + 4 + Math.sign(dx), y + 4 + Math.sign(dy), 1, 1, C); rect(svg, x + 4 + dx, y + 4 + dy, 1, 1, P3.rojo);
}

// Calendario 7×8 con la cabecera roja; el número va en HTML encima
function calendario3(svg, x, y) {
  const C = P3.contorno;
  rect(svg, x, y, 7, 8, C); rect(svg, x + 1, y + 1, 5, 2, P3.rojo); rect(svg, x + 1, y + 3, 5, 4, P3.papel); rect(svg, x + 5, y + 3, 1, 4, P3.papelSombra);
  rect(svg, x + 2, y - 1, 1, 2, C); rect(svg, x + 4, y - 1, 1, 2, C);
}

// Gafas 13×4 con módulo de radar en la patilla; ondas que salen hacia la cara si emite
function gafas3(svg, x, y, t, { emite = false } = {}) {
  const C = P3.contorno;
  rect(svg, x, y, 5, 4, C); rect(svg, x + 1, y + 1, 3, 2, "#2a4a6a"); rect(svg, x + 1, y + 1, 1, 1, "#8fd0ff");
  rect(svg, x + 5, y + 1, 2, 1, C);
  rect(svg, x + 7, y, 5, 4, C); rect(svg, x + 8, y + 1, 3, 2, "#2a4a6a"); rect(svg, x + 8, y + 1, 1, 1, "#8fd0ff");
  rect(svg, x + 12, y + 1, 3, 1, C); rect(svg, x + 13, y, 2, 1, P3.verde); // radar
  if (emite) for (let k = 0; k < 3; k++) { const f = (Math.floor(t / 0.15) + k) % 3; rect(svg, x + 14 + f * 2, y + 2 + f, 1, 2 + f, f === 0 ? P3.verde : "#127a58"); }
}

// Auricular 3×6 blanco; con ondas de movimiento de la mandíbula
function auricular3(svg, x, y, t, { mueve = false } = {}) {
  const C = P3.contorno;
  rect(svg, x, y, 3, 3, C); rect(svg, x + 1, y + 1, 1, 1, P3.blanco); rect(svg, x + 1, y + 3, 1, 3, C); rect(svg, x, y, 2, 1, "#ffffff");
  if (mueve) { const f = Math.floor(t / 0.2) % 2; rect(svg, x + 4, y + 1 + f, 1, 2, P3.azul); rect(svg, x + 6, y + f, 1, 4, "#3a5fc0"); }
}

// Chip cerebral 5×5 dorado con patitas
function chip3(svg, x, y, t) {
  const C = P3.contorno;
  rect(svg, x, y, 5, 5, C); rect(svg, x + 1, y + 1, 3, 3, "#2a2f45"); rect(svg, x + 2, y + 2, 1, 1, Math.floor(t / 0.4) % 2 ? P3.verde : P3.dorado);
  for (let k = 0; k < 3; k++) { rect(svg, x + 1 + k, y - 1, 1, 1, P3.dorado); rect(svg, x + 1 + k, y + 5, 1, 1, P3.dorado); }
}

// Terminal 12×8 con líneas de texto que se escriben a escalones (una pestaña de agente)
function terminal3(svg, x, y, t, { color = P3.verde, semilla = 0, titulo = P3.metalLuz } = {}) {
  const C = P3.contorno;
  rect(svg, x, y, 12, 8, C); rect(svg, x + 1, y + 1, 10, 1, titulo); rect(svg, x + 1, y + 2, 10, 5, "#0b1218");
  const n = 1 + (Math.floor(t / 0.3 + semilla) % 4);
  for (let k = 0; k < n; k++) rect(svg, x + 2, y + 3 + k, 2 + ((k * 3 + semilla) % 7), 1, k === n - 1 ? P3.blanco : color);
}

// Gráfico de barras grande (en unidades): valores 0-1, la última barra en otro color; crecen a escalones desde `desde`
function barrasDato3(svg, x, yBase, alto, valores, t, desde, { ancho = 5, sep = 2, colores = [P3.azul], ultimo = P3.rojo } = {}) {
  const C = P3.contorno;
  rect(svg, x - 1, yBase, valores.length * (ancho + sep) + 1, 1, C);
  valores.forEach((v, k) => {
    const crece = Math.min(1, Math.max(0, (t - desde - k * 0.12) / 0.3));
    const h = Math.max(v > 0 ? 1 : 0, Math.round(Math.floor(crece * 4) / 4 * v * alto));
    if (!h) return;
    const color = k === valores.length - 1 ? ultimo : colores[k % colores.length];
    rect(svg, x + k * (ancho + sep), yBase - h, ancho, h, C);
    rect(svg, x + k * (ancho + sep) + 1, yBase - h + 1, ancho - 2, h - 1, color);
    rect(svg, x + k * (ancho + sep) + 1, yBase - h + 1, ancho - 2, 1, P3.blanco);
  });
}

// Flecha horizontal 1 unidad de grosor con punta, de x0 a x1 (a escalones hasta frac)
function flecha3(svg, x0, y, x1, color = P3.blanco, frac = 1) {
  frac = Math.max(0, Math.min(1, frac));
  const xf = Math.round(x0 + (x1 - x0) * Math.floor(frac * 6) / 6);
  if (xf <= x0) return;
  rect(svg, x0, y, xf - x0, 1, color);
  if (frac >= 1) { rect(svg, x1 - 1, y - 1, 1, 3, color); rect(svg, x1 - 2, y - 2, 1, 5, color); }
}

// ---------- textos HTML del vídeo ----------
// Bocadillo de post viral (sin nombre de cuenta): panel oscuro con la frase entre comillas
function bocadilloPost(e, txt, x, y, desde, ancho = 180) {
  return e.tx("etiqueta", `«${txt}»`, x, y, desde,
    `white-space:normal;width:${ancho}px;line-height:12px;background:#1c2236;border:1px solid #5a6390;padding:5px 6px;color:#f5f7fb`);
}
// Sello «MATIZ» (Mario, 2026-11-06): rojo a 16 px (nunca rojo en texto pequeño), recuadro doble; aparece con salto
function selloMatiz(e, x, y, desde) {
  return e.tx("titular", "MATIZ", x, y, desde,
    "color:var(--rojo);border:3px solid var(--rojo);outline:1px solid #000;padding:4px 6px 2px;background:rgba(12,16,22,0.85)");
}
