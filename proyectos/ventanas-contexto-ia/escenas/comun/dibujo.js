// ventanas-contexto-ia · dibujos compuestos que comparten el largo y los shorts (unidades v3 de 12 px; textos en px CSS
// con e.tx). Necesita base.js (e), objetos.js y v3/props.js.

// Gorro de fiesta a rayas (se pone sobre la cabeza de MISTA: x = g.x + 11, y = g.y)
function gorro3(svg, x, y) {
  for (let k = 0; k < 6; k++) rect(svg, x + 3 - Math.floor(k / 2), y + k, 1 + 2 * Math.floor(k / 2), 1, k % 2 ? P3.dorado : P3.rojo);
  rect(svg, x + 3, y - 1, 1, 1, P3.blanco);
}

// Corro de invitados (tokens) con todos los saludos como resplandor y los del invitado de turno nítidos (cada 0,5 s).
// n invitados en una elipse de centro (cx, cy) y radios (rx, ry); `lineas` = false para enseñarlos sin saludar aún.
function corro3(e, t, cx, cy, rx, ry, n, { lineas = true, turnoCada = 0.5 } = {}) {
  const colores = [P3.papel, HOJA.oculto.c, P3.azul, P3.verde, P3.naranja];
  const pos = Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    return [Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry)];
  });
  if (lineas && n > 1) {
    pos.forEach((a, i) => pos.forEach((b, j) => { if (j > i) linea(e.capas.brillo, a[0] + 2, a[1] + 2, b[0] + 2, b[1] + 2, "#c9a4ff"); }));
    const turno = Math.floor(t / turnoCada) % n;
    pos.forEach((b, j) => { if (j !== turno) linea(e.capas.medio, pos[turno][0] + 2, pos[turno][1] + 2, b[0] + 2, b[1] + 2, "#e9dcff"); });
  }
  pos.forEach(([x, y], k) => token3(e.frente, x, y, colores[k % 5], t, { semilla: k, saluda: k % 3 === 0 }));
}

// Nube de muchos invitados (1.000 o un millón): puntos de colores que titilan a escalones
function nube3(e, t, x, y, w, h, n, semilla = 7) {
  const azar = mulberry32(semilla), colores = [P3.papel, "#9aa0b0", P3.azul, P3.verde, P3.naranja];
  for (let k = 0; k < n; k++) {
    const px = x + Math.floor(azar() * w), py = y + Math.floor(azar() * h), c = colores[Math.floor(azar() * 5)], f = azar();
    if (Math.floor(t * 4 + f * 9) % 7 !== 0) rect(e.frente, px, py, 1, 1, c);
  }
  rect(e.capas.brillo, x, y, w, h, "#3a2a60");
}

// Fila de barras verticales de una prueba (alturas de 0 a 1), con línea opcional al 50 %; aparecen de una en una
function barrasPrueba3(e, t, x, yBase, alto, valores, { desde = 0, cada = 0.08, color = P3.azul, malo = P3.rojo, umbral = null, ancho = 3 } = {}) {
  valores.forEach((v, k) => {
    if (t < desde + k * cada) return;
    const h = Math.max(1, Math.round(alto * v)), bx = x + k * (ancho + 1);
    const c = umbral !== null && v < umbral ? malo : color;
    rect(e.frente, bx, yBase - h, ancho, h, P3.contorno); rect(e.frente, bx, yBase - h + 1, ancho - 1, h - 1, c);
  });
  if (umbral !== null) for (let px = x - 1; px < x + valores.length * (ancho + 1); px += 2) rect(e.frente, px, yBase - Math.round(alto * umbral), 1, 1, P3.dorado);
  rect(e.frente, x - 1, yBase, valores.length * (ancho + 1) + 1, 1, P3.contorno);
}

// Muro de ladrillos w×h con su número (los cuatro muros del tope)
function muro3(svg, x, y, w, h, encendido) {
  rect(svg, x, y, w, h, P3.contorno);
  for (let fy = 0; fy < h - 1; fy += 3) {
    const off = (fy / 3) % 2 ? 2 : 0;
    for (let fx = -off; fx < w - 1; fx += 5) {
      const bx = Math.max(x + 1, x + 1 + fx), bw = Math.min(4, x + w - 1 - bx);
      if (bw > 0) { rect(svg, bx, y + 1 + fy, bw, 2, encendido ? "#b85a3a" : "#5a3a3a"); rect(svg, bx, y + 1 + fy, bw, 1, encendido ? "#d8805a" : "#6a4848"); }
    }
  }
}

// Disquete 9×9 (punto de guardado)
function disquete3(svg, x, y) {
  rect(svg, x, y, 9, 9, P3.contorno); rect(svg, x + 1, y + 1, 7, 7, P3.azul); rect(svg, x + 2, y + 1, 5, 3, P3.blanco);
  rect(svg, x + 5, y + 1, 1, 2, P3.contorno); rect(svg, x + 2, y + 5, 5, 3, "#2c4790"); rect(svg, x + 1, y + 1, 7, 1, "#9fb6ff");
}

// Libro abierto 16×9 (el diario de la conversación): pasa páginas a escalones si `hojea`
function diario3(svg, x, y, t, hojea = false) {
  rect(svg, x, y, 16, 9, P3.contorno);
  rect(svg, x + 1, y + 1, 7, 7, P3.papel); rect(svg, x + 8, y + 1, 7, 7, P3.papelLuz);
  for (let r = 0; r < 3; r++) { rect(svg, x + 2, y + 3 + r * 2, 5, 1, P3.gris); rect(svg, x + 9, y + 3 + r * 2, 5, 1, P3.gris); }
  if (hojea) { const f = Math.floor(t / 0.15) % 3; rect(svg, x + 8 - f * 2, y, 2, 9, P3.papelSombra); }
}

// Tarjeta de opinión: marco dorado con «OPINIÓN» fijo y el nombre (textos en px CSS)
function opinion3(e, x, y, w, h, nombre, frase, desde, fuente = "") {
  if (e.s1(e.t, desde) === null) return;
  const dy = e.s1(e.t, desde);
  panel3(e.frente, x, y + dy, w, h, "#1e1a10");
  rect(e.frente, x, y + dy, w, 1, P3.dorado); rect(e.frente, x, y + dy + h - 1, w, 1, P3.dorado);
  rect(e.frente, x, y + dy, 1, h, P3.dorado); rect(e.frente, x + w - 1, y + dy, 1, h, P3.dorado);
  e.tx("insignia", "Opinión", x * 3 + 6, y * 3 + 6, desde, "background:var(--dorado)");
  e.tx("etiqueta", nombre, x * 3 + 6, y * 3 + 22, desde, "color:var(--dorado)");
  e.tx("etiqueta", frase, x * 3 + 6, y * 3 + 36, desde);
  if (fuente) e.tx("fuente-dato", fuente, x * 3 + 6, y * 3 + 50, desde);
}
