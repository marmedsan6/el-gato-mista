// alien-isolation-ia · dibujo compartido por el largo y los shorts (mapa del director, cerebros, clips en un CRT,
// conos de visión, árbol de decisiones, micrófono y perro). Determinista: todo desde t. Necesita pixel.js, props.js y alien.js.

const C_ALIEN = { tu: "#ff8a3d", alien: "#e0454f", pista: "#f2c14e", pared: "#13402a", fondo: "#06120c", verde: "#1fd69a" };

// Mapa de la estación visto por el director: pasillos, tu punto (parpadea) y la ficha del alien.
// op: { alien: [fx, fy] en 0..1, tu: [fx, fy], zona: bool, flecha: bool, niebla: bool, grosor }
function mapaEstacion(e, x, y, w, h, t, { alien = [0.15, 0.2], tu = [0.85, 0.8], zona = false, flecha = false, niebla = false, grosor = 2, verTu = true } = {}) {
  e.panel(x, y, w, h, C_ALIEN.fondo);
  const P = (fx, fy) => [Math.round(x + 8 + fx * (w - 16)), Math.round(y + 8 + fy * (h - 16))];
  for (const [a, b, c, d] of [[0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 1, 1], [0, 1, 1, 1], [0.3, 0, 0.3, 0.45], [0.3, 0.45, 0.8, 0.45], [0.6, 0.45, 0.6, 1]]) {
    const [x0, y0] = P(a, b), [x1, y1] = P(c, d);
    rect(e.frente, Math.min(x0, x1) - 1, Math.min(y0, y1) - 1, Math.abs(x1 - x0) + 3, Math.abs(y1 - y0) + 3, C_ALIEN.pared);
  }
  const [tx, ty] = P(...tu), [ax, ay] = P(...alien);
  if (zona) { rect(e.frente, tx - 22, ty - 16, 44, 30, "#16301c"); marcoSeleccion(e.frente, tx - 22, ty - 16, 44, 30, C_ALIEN.pista); }
  if (niebla) for (let j = y + 3; j < y + h - 3; j += 2) for (let i = x + 3 + ((j / 2) % 2) * 2; i < x + w - 3; i += 4) rect(e.frente, i, j, 2, 1, "#0d1f16");
  if (verTu && (niebla ? false : true) && Math.floor(t / 0.4) % 2 === 0) rect(e.frente, tx - 2, ty - 2, 5, 5, C_ALIEN.tu);
  if (verTu && !niebla) marcoSeleccion(e.frente, tx - 6, ty - 6, 13, 13, C_ALIEN.tu);
  rect(e.frente, ax - 2, ay - 2, 5, 5, C_ALIEN.alien);
  if (flecha) { linea(e.frente, ax + 4, ay + 2, tx - 26, ty - 10, C_ALIEN.pista, grosor); puntaFlecha(e.frente, tx - 26, ty - 10, "der", C_ALIEN.pista, 3 + grosor); }
  return { tu: [tx, ty], alien: [ax, ay], P };
}

// Cerebro pixel 22×16 (con color para distinguir director y alien)
function cerebro(svg, x, y, color = "#e8919c") {
  const C = PROP.contorno;
  for (const [dx, dy, r] of [[7, 7, 7], [14, 7, 7], [10, 5, 6]]) disco(svg, x + dx, y + dy + 1, r + 1, C);
  for (const [dx, dy, r] of [[7, 7, 7], [14, 7, 7], [10, 5, 6]]) disco(svg, x + dx, y + dy + 1, r, color);
  rect(svg, x + 10, y + 2, 1, 12, C);
  for (const [dx, dy, w] of [[3, 5, 4], [14, 5, 4], [4, 10, 5], [13, 10, 5], [7, 3, 2]]) rect(svg, x + dx, y + dy, w, 1, "#8a3a4a");
}

// Clip oficial dentro de un monitor CRT: el fotograma sale de .runtime (no va a git). Devuelve la promesa de decodificación.
const RUTA_FOTOGRAMAS = "../../../../.runtime/clips/alien-isolation-ia/frames/";
const CLIPS_N = { k1: 95, k2: 97, k3: 91 };
function clipCRT(e, x, y, clave, t, desde, { credito = true } = {}) {
  propMonitor(e.frente, x, y, 128, 76, { marco: "#2b3038" });
  const n = Math.min(CLIPS_N[clave], 1 + Math.floor((t - desde) * 30));
  const img = document.createElement("img");
  img.src = `${RUTA_FOTOGRAMAS}${clave}-${String(Math.max(1, n)).padStart(3, "0")}.png`;
  img.style.cssText = `position:absolute; left:${x + 4}px; top:${y + 4}px; width:120px; height:68px; image-rendering:pixelated;`;
  document.getElementById("textos").appendChild(img);
  if (credito) { e.tx("fuente-dato con-fondo", "Imagen: SEGA /", x, y + 82, desde); e.tx("fuente-dato con-fondo", "Creative Assembly", x, y + 94, desde); }
  return img.decode().catch(() => {});
}

// Rejilla de líneas de barrido sobre el CRT (encima del <img>, en un div)
function barridoCRT(x, y) {
  const d = document.createElement("div");
  d.style.cssText = `position:absolute; left:${x + 4}px; top:${y + 4}px; width:120px; height:68px; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 2px);`;
  document.getElementById("textos").appendChild(d);
}

// Conos de visión desde la cabeza (cx, cy) hacia la izquierda: largo, ancho (mitad) y color, en filas pixel
function cono(svg, cx, cy, largo, ancho, color) {
  for (let k = 0; k < largo; k += 2) {
    const a = Math.round((ancho * k) / largo);
    rect(svg, cx - k - 2, cy - a, 2, a * 2 + 1, color);
  }
}

// Nodo del árbol de decisiones con candado opcional
function nodo(e, x, y, w, texto, { desde = 0, candado = null, color = "#f5f7fb", fondo = "#151b30" } = {}) {
  if (e.t < desde) return false;
  e.panel(x, y, w, 16, fondo);
  e.tx("etiqueta", texto, x + (candado === null ? 5 : 18), y + 4, desde, `color:${color}`);
  if (candado !== null) propCandado(e.frente, x + 3, y + 2, { abierto: candado, color: PROP.dorado });
  return true;
}

// Micrófono de mesa 10×18 y perro sentado 20×16 (ladra: boca abierta y ondas)
function propMicrofono(svg, x, y, { activo = false } = {}) {
  const C = PROP.contorno;
  rect(svg, x + 2, y, 6, 9, C); rect(svg, x + 3, y + 1, 4, 7, activo ? "#5a6390" : "#3a4166");
  for (let k = 0; k < 3; k++) rect(svg, x + 3, y + 2 + k * 2, 4, 1, "#22283e");
  rect(svg, x + 4, y + 9, 2, 6, C); rect(svg, x, y + 15, 10, 3, C);
}
function propPerro(svg, x, y, t, { ladra = false } = {}) {
  const C = PROP.contorno, B = "#a8743e", O = "#6b4a32", boca = ladra && Math.floor(t / 0.15) % 2 === 0;
  rect(svg, x + 6, y + 6, 12, 10, C); rect(svg, x + 7, y + 7, 10, 8, B);
  rect(svg, x, y, 10, 9, C); rect(svg, x + 1, y + 1, 8, 7, B); rect(svg, x + 1, y + 1, 2, 5, O); rect(svg, x + 7, y + 1, 2, 5, O);
  rect(svg, x + 3, y + 3, 1, 1, C); rect(svg, x, y + 5, 3, 2, C);
  if (boca) rect(svg, x, y + 7, 3, 2, "#b84a5a");
  rect(svg, x + 17, y + 5, 3, 2, C); rect(svg, x + 8, y + 15, 2, 1, C); rect(svg, x + 14, y + 15, 2, 1, C);
}

// Claqueta 14×12 (escena de vídeo)
function propClaqueta(svg, x, y) {
  const C = PROP.contorno;
  rect(svg, x, y + 4, 14, 8, C); rect(svg, x + 1, y + 5, 12, 6, "#3a414c");
  rect(svg, x, y, 14, 4, C); for (let k = 0; k < 4; k++) rect(svg, x + 1 + k * 3, y + 1, 2, 2, PROP.blanco);
}

// Rejilla de conducto 24×10
function propRejilla(svg, x, y, { tachada = false } = {}) {
  rect(svg, x, y, 24, 10, PROP.contorno); rect(svg, x + 1, y + 1, 22, 8, "#0a0c11");
  for (let k = 0; k < 4; k++) rect(svg, x + 3 + k * 5, y + 3, 3, 4, "#2c3544");
  if (tachada) { linea(svg, x - 2, y - 2, x + 25, y + 11, PROP.rojo, 2); }
}

// Nube de tormenta con lluvia 28×22 (a escalones)
function propTormenta(svg, x, y, t) {
  for (const [dx, dy, r] of [[8, 8, 7], [17, 6, 8], [23, 10, 5]]) disco(svg, x + dx, y + dy, r, "#3a4558");
  for (let k = 0; k < 6; k++) { const f = (Math.floor(t / 0.1) + k * 3) % 6; rect(svg, x + 3 + k * 4 - f, y + 15 + f, 1, 3, "#8a96b0"); }
  if ((t % 2.3) < 0.15) linea(svg, x + 16, y + 12, x + 12, y + 22, PROP.dorado, 2);
}
