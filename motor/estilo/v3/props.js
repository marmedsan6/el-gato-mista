// Estilo v3 · objetos a 12 px (1 unidad del lienzo v3 = 12 px de salida), sombreados a mano: luz arriba a la izquierda,
// sombra abajo a la derecha, contorno oscuro. Deterministas (t y semillas). (x, y) = esquina superior izquierda en unidades.
// Necesita pixel.js (rect, linea, mulberry32).
const P3 = {
  contorno: "#1a1420", vidrio: "#9fd8e0", vidrioLuz: "#e4f7f9", vidrioSombra: "#5f9aa6",
  verde: "#1fd69a", verdeSombra: "#13936a", azul: "#5b8cff", azulSombra: "#3a5fc0", naranja: "#ff8a3d", naranjaSombra: "#c25e22",
  rojo: "#e0454f", dorado: "#f2c14e", crema: "#f4d3a1", blanco: "#f5f7fb", gris: "#8a93a6",
  metal: "#3a4166", metalLuz: "#5a6390", metalSombra: "#262b48",
  madera: "#6b4a32", maderaLuz: "#8a6242", maderaSombra: "#4a3526",
  papel: "#efe6d2", papelLuz: "#fbf6ea", papelSombra: "#d6cbb2",
};
const SOMBRA_DE = { [P3.verde]: P3.verdeSombra, [P3.azul]: P3.azulSombra, [P3.naranja]: P3.naranjaSombra };

// Matraz 7×11 unidades, dibujado a media unidad (6 px) para tener detalle: vidrio con reflejo, cuello con boca,
// líquido con menisco y fondo más oscuro; burbujas de media unidad que suben (más si activo)
function matraz3(svg, x, y, t, { color = P3.verde, activo = false, semilla = 1 } = {}) {
  const sombra = SOMBRA_DE[color] || color;
  escalado(svg, x, y, 0.5, (g) => {
    const C = P3.contorno;
    rect(g, 4, 0, 6, 1, C); rect(g, 4, 1, 6, 1, P3.vidrioLuz); rect(g, 4, 2, 6, 1, C); // boca
    rect(g, 5, 3, 1, 6, C); rect(g, 8, 3, 1, 6, C); rect(g, 6, 3, 2, 6, P3.vidrio); rect(g, 6, 3, 1, 5, P3.vidrioLuz);
    // cuerpo cónico: [inicio, ancho] por fila, filas 9-20
    const filas = [[4, 6], [4, 6], [3, 8], [3, 8], [2, 10], [2, 10], [1, 12], [1, 12], [0, 14], [0, 14], [0, 14], [0, 14]];
    filas.forEach(([a, w], j) => {
      const yy = 9 + j, liquido = j >= 4;
      rect(g, a, yy, w, 1, C);
      rect(g, a + 1, yy, w - 2, 1, liquido ? color : P3.vidrio);
      if (liquido) rect(g, a + w - 3, yy, 2, 1, sombra);
      if (j === 4) rect(g, a + 1, yy, w - 2, 1, P3.vidrioLuz); // menisco
      if (j >= 9 && liquido) rect(g, a + 1, yy, w - 2, 1, sombra);
      if (j >= 1 && j <= 9) rect(g, a + 1, yy, 1, 1, P3.vidrioLuz); // reflejo del vidrio a la izquierda
    });
    rect(g, 0, 21, 14, 1, C);
    const azar = mulberry32(semilla), n = activo ? 4 : 2, v = activo ? 9 : 4;
    for (let k = 0; k < n; k++) {
      const fase = azar(), bx = 4 + Math.floor(azar() * 6), by = 19 - Math.floor((t * v + fase * 18) % 20);
      if (by >= -4 && by !== 13) rect(g, bx, by, 1, 1, by < 13 ? P3.blanco : P3.vidrioLuz);
    }
  });
}
// Matraz mínimo 3×4 (iconos dentro de una tarjeta)
function matrazMini(svg, x, y, color) {
  rect(svg, x + 1, y, 1, 1, P3.vidrioSombra); rect(svg, x, y + 1, 3, 1, P3.vidrio); rect(svg, x, y + 2, 3, 2, color);
  rect(svg, x + 2, y + 2, 1, 2, SOMBRA_DE[color] || color); rect(svg, x, y + 1, 1, 1, P3.vidrioLuz);
}

// Microscopio 10×11 unidades, a media unidad: base con brillo, brazo curvo, platina, tubo con ocular y objetivo,
// rueda de enfoque y destello en la lente; si activo, luz verde bajo el objetivo
function microscopio3(svg, x, y, { activo = false } = {}) {
  escalado(svg, x, y, 0.5, (g) => {
    const C = P3.contorno, L = "#9aa4cc", M = "#59628f", S = P3.metal; // más claro que el resto del metal: se separa del fondo
    rect(g, 0, 18, 20, 4, C); rect(g, 1, 18, 18, 2, M); rect(g, 1, 18, 18, 1, L); rect(g, 2, 21, 16, 1, S); // base
    rect(g, 12, 6, 4, 13, C); rect(g, 13, 6, 2, 12, M); rect(g, 13, 6, 1, 12, L); // brazo
    rect(g, 14, 4, 3, 3, C); rect(g, 15, 5, 1, 1, L);
    rect(g, 2, 13, 13, 2, C); rect(g, 3, 13, 11, 1, L); // platina
    rect(g, 6, 15, 3, 1, P3.vidrio); // portaobjetos
    for (let k = 0; k < 7; k++) rect(g, 3 + k, 2 + k, 4, 4, C); // tubo inclinado: primero el contorno…
    for (let k = 0; k < 7; k++) rect(g, 4 + k, 3 + k, 2, 2, k < 3 ? L : M); // …luego el relleno, para que se lea el tubo
    rect(g, 0, 0, 6, 3, C); rect(g, 1, 1, 4, 1, L); rect(g, 1, 1, 1, 1, P3.blanco); // ocular con brillo
    rect(g, 9, 9, 3, 4, C); rect(g, 10, 10, 1, 2, P3.vidrioLuz); // objetivo con destello
    rect(g, 16, 10, 3, 3, C); rect(g, 17, 11, 1, 1, L); // rueda de enfoque
    if (activo) { rect(g, 9, 12, 3, 1, P3.verde); rect(g, 10, 13, 1, 1, "#9fffd8"); }
  });
}

// Bote de reactivo 3×5 unidades, a media unidad: tapón, etiqueta y brillo
function bote3(svg, x, y, color) {
  escalado(svg, x, y, 0.5, (g) => {
    const C = P3.contorno;
    rect(g, 0, 0, 6, 10, C); rect(g, 1, 1, 4, 2, P3.metalLuz); rect(g, 1, 3, 4, 6, color);
    rect(g, 4, 3, 1, 6, SOMBRA_DE[color] || color); rect(g, 1, 5, 4, 2, P3.papel); rect(g, 1, 3, 1, 2, P3.blanco);
  });
}

// Corchera: marco de madera y corcho moteado con semilla
function corcho3(svg, x, y, w, h) {
  rect(svg, x, y, w, h, P3.maderaSombra); rect(svg, x, y, w, 1, P3.maderaLuz); rect(svg, x, y, 1, h, P3.maderaLuz);
  rect(svg, x + 1, y + 1, w - 2, h - 2, "#a7764a");
  const azar = mulberry32(17);
  for (let k = 0; k < (w * h) / 9; k++) rect(svg, x + 1 + Math.floor(azar() * (w - 2)), y + 1 + Math.floor(azar() * (h - 2)), 1, 1, azar() < 0.5 ? "#8f6238" : "#b98a58");
}
// Tarjeta de papel con sombra plana, luz arriba y sombra abajo, fibra del papel y esquina doblada; chincheta roja
function tarjeta3(svg, x, y, w, h) {
  rect(svg, x + 1, y + 1, w, h, "#0a0806");
  rect(svg, x, y, w, h, P3.papel); rect(svg, x, y, w, 1, P3.papelLuz); rect(svg, x, y + h - 1, w, 1, P3.papelSombra); rect(svg, x + w - 1, y, 1, h, P3.papelSombra);
  escalado(svg, x, y, 0.5, (g) => { // fibra del papel, a media unidad
    const azar = mulberry32(w * 31 + h);
    for (let k = 0; k < (w * h) / 6; k++) rect(g, 2 + Math.floor(azar() * (w * 2 - 4)), 2 + Math.floor(azar() * (h * 2 - 4)), 1, 1, azar() < 0.6 ? "#e6dcc6" : "#f7f0e0");
  });
  rect(svg, x + w - 2, y + h - 2, 2, 2, "#0a0806"); rect(svg, x + w - 3, y + h - 2, 1, 1, P3.papelSombra); rect(svg, x + w - 2, y + h - 3, 1, 1, P3.papelSombra); // esquina doblada
  const cx = x + Math.floor(w / 2);
  rect(svg, cx - 1, y - 1, 2, 2, "#8a1f28"); rect(svg, cx - 1, y - 1, 1, 1, P3.rojo);
}

// Monitor con bisel sombreado y pie; dibujo(svg, x, y, w, h) pinta la pantalla. Encima: líneas de barrido a media
// unidad, reflejo en la esquina y piloto encendido
function monitor3(svg, x, y, w, h, { dibujo = null } = {}) {
  rect(svg, x, y, w, h, P3.contorno);
  rect(svg, x + 1, y + 1, w - 2, h - 2, P3.metal); rect(svg, x + 1, y + 1, w - 2, 1, P3.metalLuz); rect(svg, x + 1, y + h - 2, w - 2, 1, P3.metalSombra);
  rect(svg, x + 2, y + 2, w - 4, h - 4, "#0e1a24");
  rect(svg, x + 2, y + 2, w - 4, 1, "#16283a");
  const cx = x + Math.floor(w / 2);
  rect(svg, cx - 1, y + h, 2, 2, P3.contorno); rect(svg, cx - 4, y + h + 2, 8, 1, P3.contorno);
  if (dibujo) dibujo(svg, x + 2, y + 2, w - 4, h - 4);
  escalado(svg, x + 2, y + 2, 0.5, (g) => {
    for (let k = 1; k < (h - 4) * 2; k += 2) rect(g, 0, k, (w - 4) * 2, 1, "#00000022"); // barrido
    for (let k = 0; k < 4; k++) rect(g, 1 + k, 4 - k, 2, 1, "#ffffff18"); // reflejo
  });
  rect(svg, x + w - 3, y + h - 2, 1, 1, P3.verde); // piloto
}

// Caja de cartón 12×9 con cinta y textura de cartón; si activo, salta 1 unidad
function caja3(svg, x, y, t, { activo = false } = {}) {
  const dy = activo && Math.floor(t / 0.15) % 2 === 0 ? -1 : 0, C = P3.contorno;
  rect(svg, x, y + dy, 12, 9, C);
  rect(svg, x + 1, y + 1 + dy, 10, 7, "#b07a46"); rect(svg, x + 1, y + 1 + dy, 10, 2, "#c88c52"); rect(svg, x + 9, y + 3 + dy, 2, 5, "#8e5f34");
  rect(svg, x + 5, y + 1 + dy, 2, 7, "#d9b07a");
  escalado(svg, x, y + dy, 0.5, (g) => {
    const azar = mulberry32(5);
    for (let k = 0; k < 14; k++) rect(g, 2 + Math.floor(azar() * 18), 6 + Math.floor(azar() * 10), 1, 1, azar() < 0.5 ? "#9c6a3c" : "#c08a55");
    rect(g, 10, 2, 1, 14, "#efd3a0"); // brillo de la cinta
  });
}

// Documento 8×11; si activo, flota con vaivén; sello opcional
function papel3(svg, x, y, t, { activo = false, sello = null } = {}) {
  const dy = activo ? -Math.floor((t * 4) % 3) : 0, dx = activo ? Math.floor(t * 3) % 2 : 0, C = P3.contorno;
  rect(svg, x + dx, y + dy, 8, 11, C);
  rect(svg, x + 1 + dx, y + 1 + dy, 6, 9, P3.papel); rect(svg, x + 6 + dx, y + 1 + dy, 1, 9, P3.papelSombra);
  for (let k = 0; k < 3; k++) rect(svg, x + 2 + dx, y + 3 + k * 2 + dy, 4 - (k % 2), 1, P3.gris);
  if (sello) { rect(svg, x + 4 + dx, y + 7 + dy, 2, 2, sello); }
}

// Libros apilados (3 lomos de colores)
function libros3(svg, x, y) {
  [["#c0504a", "#8e3530"], ["#4a6fb0", "#34508a"], ["#4a9a6a", "#33704b"]].forEach(([c, s], k) => {
    rect(svg, x + k % 2, y + k * 2, 11, 2, P3.contorno); rect(svg, x + 1 + k % 2, y + k * 2, 9, 1, c); rect(svg, x + 8 + k % 2, y + k * 2, 2, 1, s);
  });
}
// Taza con vapor que sube a escalones
function taza3(svg, x, y, t) {
  rect(svg, x, y, 5, 4, P3.contorno); rect(svg, x + 1, y + 1, 3, 2, P3.blanco); rect(svg, x + 5, y + 1, 1, 2, P3.contorno);
  const f = Math.floor(t * 3) % 3;
  rect(svg, x + 1 + (f % 2), y - 2 - f, 1, 1, "#cfd6e4"); rect(svg, x + 2 + ((f + 1) % 2), y - 4 - (f % 2), 1, 1, "#aeb6c8");
}
// Lupa: aro de 9 unidades (hueco) y mango de madera
function lupa3(svg, x, y) {
  const C = P3.contorno;
  for (const [dx, dy, w, h] of [[2, 0, 5, 1], [1, 1, 1, 1], [7, 1, 1, 1], [0, 2, 1, 5], [8, 2, 1, 5], [1, 7, 1, 1], [7, 7, 1, 1], [2, 8, 5, 1]]) rect(svg, x + dx, y + dy, w, h, C);
  rect(svg, x + 2, y + 2, 1, 1, P3.blanco);
  for (let k = 0; k < 4; k++) rect(svg, x + 7 + k, y + 7 + k, 2, 2, k < 1 ? C : P3.madera);
}

// Ratón de laboratorio 6×4; si activo, corre en el sitio
function raton3(svg, x, y, t, { activo = false } = {}) {
  const f = activo ? Math.floor(t / 0.12) % 2 : 0, dy = f ? -1 : 0, C = P3.contorno;
  rect(svg, x + 1, y + dy, 4, 3, C); rect(svg, x + 2, y + dy, 3, 2, P3.crema); rect(svg, x, y + 1 + dy, 1, 1, "#e8919c");
  rect(svg, x + 5, y + 1 + dy + (f ? 0 : 1), 2, 1, "#e8919c");
  rect(svg, x + 1 + f, y + 3, 1, 1, C); rect(svg, x + 4 - f, y + 3, 1, 1, C);
}
// Jaula 30×22 con barrotes, rueda que gira a pasos y dos ratones
function jaula3(svg, x, y, t, { activo = true } = {}) {
  const C = P3.contorno;
  rect(svg, x, y + 20, 30, 2, P3.maderaSombra); rect(svg, x, y + 20, 30, 1, P3.maderaLuz);
  rect(svg, x + 1, y + 1, 28, 19, "#2a2238"); rect(svg, x + 1, y + 17, 28, 3, "#8a7440"); // fondo opaco y paja: los ratones se leen
  rect(svg, x, y, 30, 1, C);
  for (let bx = x; bx < x + 30; bx += 3) rect(svg, bx, y, 1, 20, P3.metalLuz);
  const cx = x + 22, cy = y + 13, r = 6, a0 = activo ? (Math.floor(t / 0.15) % 2) * (Math.PI / 4) : 0;
  for (let a = 0; a < 16; a++) { const ang = (a / 16) * Math.PI * 2; rect(svg, Math.round(cx + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r), 1, 1, P3.gris); }
  for (const g of [a0, a0 + Math.PI / 2]) linea(svg, Math.round(cx - Math.cos(g) * r), Math.round(cy - Math.sin(g) * r), Math.round(cx + Math.cos(g) * r), Math.round(cy + Math.sin(g) * r), P3.gris);
  raton3(svg, cx - 3, cy + 2, t, { activo });
  raton3(svg, x + 3, y + 16, t + 0.06, {});
}

// Check y aspa de 3×3 (a 12 px)
function check3(svg, x, y, color) { rect(svg, x, y + 1, 1, 1, color); rect(svg, x + 1, y + 2, 1, 1, color); rect(svg, x + 2, y, 1, 2, color); }
function aspa3(svg, x, y, color) { for (let i = 0; i < 3; i++) { rect(svg, x + i, y + i, 1, 1, color); rect(svg, x + 2 - i, y + i, 1, 1, color); } }
