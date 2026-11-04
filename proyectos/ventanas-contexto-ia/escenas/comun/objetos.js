// ventanas-contexto-ia · objetos v3 a 12 px (unidades del lienzo v3), sombreados a mano como motor/estilo/v3/props.js.
// Deterministas: dependen de t y de semillas. Necesita pixel.js y v3/props.js (P3, rect, linea).

// Colores fijos de lo que hay en la mesa (style_guide.md): el ojo los sigue de un bloque a otro
const HOJA = {
  tu: { c: P3.papel, luz: P3.papelLuz, sombra: P3.papelSombra, raya: P3.gris },
  oculto: { c: "#9aa0b0", luz: "#c3c8d4", sombra: "#6c7286", raya: "#5a6072" },
  herramienta: { c: P3.azul, luz: "#9fb6ff", sombra: P3.azulSombra, raya: "#2c4790" },
  archivo: { c: P3.verde, luz: "#8af0c8", sombra: P3.verdeSombra, raya: "#0f6e50" },
  respuesta: { c: P3.naranja, luz: "#ffc08a", sombra: P3.naranjaSombra, raya: "#9a4612" },
};

// Candado 4×5 (instrucciones ocultas)
function candado3(svg, x, y, color = "#2b2f3c") {
  rect(svg, x + 1, y, 2, 1, color); rect(svg, x, y + 1, 1, 2, color); rect(svg, x + 3, y + 1, 1, 2, color);
  rect(svg, x, y + 2, 4, 3, color); rect(svg, x + 1, y + 3, 2, 1, "#f2c14e");
}
// Llave inglesa 5×5 (herramientas)
function llave3(svg, x, y, color = "#1c2c5a") {
  rect(svg, x, y, 2, 1, color); rect(svg, x, y + 1, 1, 1, color); rect(svg, x + 2, y + 1, 1, 1, color);
  for (let k = 0; k < 3; k++) rect(svg, x + 1 + k, y + 2 + k, 1, 1, color);
}
// Clip 3×5 (archivos)
function clip3(svg, x, y, color = "#0f4e3a") {
  rect(svg, x, y, 3, 1, color); rect(svg, x, y + 1, 1, 4, color); rect(svg, x + 2, y + 1, 1, 3, color); rect(svg, x, y + 4, 2, 1, color);
}
// Bocadillo 5×4 (respuesta de la IA)
function bocadillo3(svg, x, y, color = "#6a2a08") {
  rect(svg, x, y, 5, 3, color); rect(svg, x + 1, y + 1, 3, 1, "#ffc08a"); rect(svg, x + 1, y + 3, 1, 1, color);
}

// Hoja vista desde arriba sobre la mesa, w×h, con sombra y renglones; icono según el tipo
function hoja3(svg, x, y, w, h, tipo = "tu") {
  const k = HOJA[tipo];
  rect(svg, x + 1, y + 1, w, h, "#00000055");
  rect(svg, x, y, w, h, P3.contorno);
  rect(svg, x + 1, y + 1, w - 2, h - 2, k.c); rect(svg, x + 1, y + 1, w - 2, 1, k.luz); rect(svg, x + w - 2, y + 1, 1, h - 2, k.sombra);
  for (let r = y + 3; r < y + h - 2; r += 2) rect(svg, x + 2, r, Math.max(2, w - 5 - ((r / 2) % 2) * 2), 1, k.raya);
  const ix = x + w - 7, iy = y + 2;
  if (tipo === "oculto") candado3(svg, ix, iy);
  else if (tipo === "herramienta") llave3(svg, ix, iy);
  else if (tipo === "archivo") clip3(svg, ix + 1, iy);
  else if (tipo === "respuesta") bocadillo3(svg, ix, iy);
}

// Pila de papeles vista de frente: cada papel es una tira de 2 unidades de su color, con un leve desorden
function pila3(svg, x, yBase, tipos, ancho = 14, semilla = 3) {
  const azar = mulberry32(semilla);
  tipos.forEach((tipo, k) => {
    const dx = Math.floor(azar() * 3) - 1, y = yBase - 2 * (k + 1), c = HOJA[tipo];
    rect(svg, x + dx, y, ancho, 2, P3.contorno);
    rect(svg, x + dx + 1, y, ancho - 2, 1, c.c); rect(svg, x + dx + ancho - 3, y, 2, 1, c.sombra);
  });
}

// Token-invitado: cubito 5×5 con dos ojos que parpadean a destiempo (semilla) y, si saluda, una pata levantada
function token3(svg, x, y, color, t, { semilla = 1, saluda = false } = {}) {
  const sombra = SOMBRA_DE[color] || "#3a3046";
  rect(svg, x, y, 5, 5, P3.contorno); rect(svg, x + 1, y + 1, 3, 3, color); rect(svg, x + 1, y + 1, 3, 1, "#ffffff66");
  rect(svg, x + 3, y + 2, 1, 2, sombra);
  const parpadea = (t + semilla * 0.37) % 2.7 > 2.6;
  if (!parpadea) { rect(svg, x + 1, y + 2, 1, 1, P3.contorno); rect(svg, x + 3, y + 2, 1, 1, P3.contorno); }
  if (saluda && Math.floor((t + semilla * 0.2) / 0.2) % 2 === 0) rect(svg, x + 5, y - 1, 1, 2, P3.contorno);
}

// Barra a escalones dentro de un marco (ocupación de la mesa, barras de acierto): frac de 0 a 1
function barra3(svg, x, y, w, h, frac, color, fondo = "#141a26") {
  rect(svg, x, y, w, h, P3.contorno);
  rect(svg, x + 1, y + 1, w - 2, h - 2, fondo);
  const lleno = Math.round((w - 2) * Math.max(0, Math.min(1, frac)));
  if (lleno > 0) { rect(svg, x + 1, y + 1, lleno, h - 2, color); rect(svg, x + 1, y + 1, lleno, 1, "#ffffff55"); }
}

// Bocadillo de pensamiento w×h con tres burbujas hacia (bx, by): lo que MISTA «sabe» (pesos), que no cambia
function pensamiento3(svg, x, y, w, h, bx, by) {
  rect(svg, x + 1, y, w - 2, h, P3.contorno); rect(svg, x, y + 1, w, h - 2, P3.contorno);
  rect(svg, x + 1, y + 1, w - 2, h - 2, "#e9e1cf"); rect(svg, x + 1, y + 1, w - 2, 1, "#fbf6ea");
  [[bx, by, 2], [bx + 2, by - 3, 3]].forEach(([cx, cy, r]) => { rect(svg, cx, cy, r, r, P3.contorno); rect(svg, cx, cy, r - 1, r - 1, "#e9e1cf"); });
}

// Chuleta que se alarga hacia abajo (la memoria que guarda el modelo): largo en unidades, con renglones apretados
function chuleta3(svg, x, y, w, largo, t) {
  rect(svg, x + 1, y + 1, w, largo, "#00000055");
  rect(svg, x, y, w, largo, P3.contorno);
  rect(svg, x + 1, y + 1, w - 2, largo - 2, "#f4ecc8"); rect(svg, x + w - 2, y + 1, 1, largo - 2, "#d4c89a");
  for (let r = y + 2; r < y + largo - 1; r += 2) rect(svg, x + 2, r, w - 5 - (r % 3), 1, "#5b8cff");
  rect(svg, x + 1, y + largo - 2, w - 2, 1, "#d4c89a");
}

// Panel tipo menú de juego (tabla de modelos, marcadores): marco con esquinas y fondo azul noche
function panel3(svg, x, y, w, h, fondo = "#151b30") {
  rect(svg, x + 1, y + 1, w, h, "#05060c");
  rect(svg, x, y, w, h, P3.contorno); rect(svg, x + 1, y + 1, w - 2, h - 2, fondo);
  rect(svg, x + 1, y + 1, w - 2, 1, "#262d48");
}

// Línea de puntos (un píxel sí y dos no): muchas líneas juntas se siguen leyendo como líneas, no como una mancha
function punteada3(svg, x0, y0, x1, y1, color) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let k = 0; k <= n; k += 3) rect(svg, Math.round(x0 + ((x1 - x0) * k) / n), Math.round(y0 + ((y1 - y0) * k) / n), 1, 1, color);
}
