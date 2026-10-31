// Estilo v2 · objetos pixel que reaccionan (ADR 0007). Deterministas: todo depende de t y de semillas fijas.
// Cada función dibuja en un <svg> con rect() de pixel.js; (x, y) = esquina superior izquierda en px base.
// `activo` (0..1 o booleano) marca la reacción: se enciende, burbujea más, corre, salta…

const PROP = {
  contorno: "#14121c", vidrio: "#9fd8e0", vidrioOscuro: "#5f9aa6", verde: "#1fd69a", azul: "#5b8cff",
  naranja: "#ff8a3d", rojo: "#e0454f", dorado: "#f2c14e", crema: "#f4d3a1", blanco: "#f5f7fb", gris: "#8a93a6",
  madera: "#6b4a32", maderaOscura: "#4a3526", metal: "#3a4166", metalClaro: "#5a6390", papel: "#e9e1cf",
};

// Matraz con líquido; burbujas que suben (más rápidas y numerosas si activo)
function propMatraz(svg, x, y, t, { color = PROP.verde, activo = false, semilla = 1 } = {}) {
  const C = PROP.contorno;
  rect(svg, x + 3, y, 4, 1, C); rect(svg, x + 3, y + 1, 1, 4, C); rect(svg, x + 6, y + 1, 1, 4, C);
  rect(svg, x + 4, y + 1, 2, 4, PROP.vidrio);
  for (let j = 0; j < 7; j++) {
    const a = Math.min(j + 1, 5);
    rect(svg, x + 5 - a, y + 5 + j, 1, 1, C); rect(svg, x + 4 + a, y + 5 + j, 1, 1, C);
    rect(svg, x + 6 - a, y + 5 + j, a * 2 - 2, 1, j >= 2 ? color : PROP.vidrio);
  }
  rect(svg, x, y + 12, 10, 1, C);
  const azar = mulberry32(semilla);
  const n = activo ? 4 : 2, v = activo ? 6 : 3;
  for (let k = 0; k < n; k++) {
    const fase = azar(), bx = x + 3 + Math.floor(azar() * 4);
    const by = y + 11 - Math.floor(((t * v + fase * 10) % 12));
    if (by >= y - 6) rect(svg, bx, by, 1, 1, by < y + 2 ? PROP.blanco : PROP.vidrio);
  }
}

// Ratón de laboratorio de perfil; si activo, corre en el sitio (patas alternas y salto de 1 px)
function propRaton(svg, x, y, t, { activo = false, color = PROP.crema } = {}) {
  const f = activo ? Math.floor(t / 0.12) % 2 : 0;
  const dy = activo && f ? -1 : 0, C = PROP.contorno;
  const filas = ["....oo......", "...oxxo.oo..", ".ooxxxxoxxo.", "oxxxxxxxxxxo", "oexxxxxxxxxo", ".oxxxxxxxxo.", "..o.o..o.o.."];
  filas.forEach((r, j) => [...r].forEach((ch, i) => {
    const c = ch === "o" ? C : ch === "x" ? color : ch === "e" ? C : null;
    if (c) rect(svg, x + i, y + j + dy, 1, 1, c);
  }));
  rect(svg, x + 1, y + 3 + dy, 1, 1, "#e8919c"); // nariz
  // cola
  for (let k = 0; k < 5; k++) rect(svg, x + 12 + k, y + 4 + dy + (k % 2 === f ? 0 : -1), 1, 1, "#e8919c");
  if (f) { rect(svg, x + 3, y + 6, 1, 1, C); rect(svg, x + 8, y + 6, 1, 1, C); }
}

// Rack de servidor con LED que parpadean con semilla (más rápido si activo)
function propServidor(svg, x, y, t, { alto = 60, activo = false, semilla = 3 } = {}) {
  rect(svg, x, y, 24, alto, PROP.contorno);
  rect(svg, x + 1, y + 1, 22, alto - 2, PROP.metal);
  const azar = mulberry32(semilla);
  for (let fila = 0; fila * 6 + 4 < alto - 2; fila++) {
    const yy = y + 3 + fila * 6;
    rect(svg, x + 3, yy, 18, 4, PROP.metalClaro);
    rect(svg, x + 4, yy + 1, 10, 1, PROP.contorno);
    for (let k = 0; k < 3; k++) {
      const fase = azar(), c = [PROP.verde, PROP.azul, PROP.naranja][Math.floor(azar() * 3)];
      const encendido = Math.floor(t * (activo ? 8 : 3) + fase * 7) % 3 !== 0;
      rect(svg, x + 15 + k * 2, yy + 1, 1, 2, encendido ? c : PROP.contorno);
    }
  }
}

// Monitor con pantalla; dibujo(svg, x, y, w, h) pinta el contenido de la pantalla
function propMonitor(svg, x, y, w, h, { encendido = true, dibujo = null, marco = PROP.metal } = {}) {
  rect(svg, x, y, w, h, PROP.contorno);
  rect(svg, x + 1, y + 1, w - 2, h - 2, marco);
  rect(svg, x + 3, y + 3, w - 6, h - 6, encendido ? "#0e1a24" : "#07090d");
  rect(svg, x + Math.floor(w / 2) - 3, y + h, 6, 3, PROP.contorno);
  rect(svg, x + Math.floor(w / 2) - 8, y + h + 3, 16, 2, PROP.contorno);
  if (encendido && dibujo) dibujo(svg, x + 3, y + 3, w - 6, h - 6);
}

// Calendario de pared; la hoja muestra un número (los meses que pasan)
function propCalendario(svg, x, y, { arriba = "MES", activo = false } = {}) {
  rect(svg, x, y, 30, 30, PROP.contorno);
  rect(svg, x + 1, y + 1, 28, 8, PROP.rojo);
  rect(svg, x + 1, y + 9, 28, 20, PROP.papel);
  rect(svg, x + 7, y - 2, 2, 4, PROP.contorno); rect(svg, x + 21, y - 2, 2, 4, PROP.contorno);
  if (activo) rect(svg, x + 24, y + 24, 4, 4, PROP.gris); // esquina doblada al pasar la hoja
}

// Caja de cartón (logística); si activo, salta 2 px
function propCaja(svg, x, y, t, { activo = false } = {}) {
  const dy = activo && Math.floor(t / 0.15) % 2 === 0 ? -2 : 0;
  rect(svg, x, y + dy, 18, 14, PROP.contorno);
  rect(svg, x + 1, y + 1 + dy, 16, 12, "#b07a46");
  rect(svg, x + 1, y + 1 + dy, 16, 3, "#c88c52");
  rect(svg, x + 8, y + 1 + dy, 2, 12, "#d9b07a");
}

// Documento (contrato); si activo, flota hacia arriba con un leve vaivén
function propPapel(svg, x, y, t, { activo = false, sello = null } = {}) {
  const dy = activo ? -Math.floor((t * 6) % 6) : 0, dx = activo ? (Math.floor(t * 4) % 2) : 0;
  rect(svg, x + dx, y + dy, 14, 18, PROP.contorno);
  rect(svg, x + 1 + dx, y + 1 + dy, 12, 16, PROP.papel);
  for (let k = 0; k < 4; k++) rect(svg, x + 3 + dx, y + 4 + k * 3 + dy, 8 - (k % 2) * 3, 1, PROP.gris);
  if (sello) rect(svg, x + 8 + dx, y + 12 + dy, 4, 4, sello);
}

// Lupa; si activo, el cristal brilla
function propLupa(svg, x, y, { activo = false } = {}) {
  for (let dy = -6; dy <= 6; dy++) {
    const dx = Math.floor(Math.sqrt(36 - dy * dy)), di = Math.abs(dy) <= 4 ? Math.floor(Math.sqrt(16 - dy * dy)) : -1;
    if (di < 0) rect(svg, x + 7 - dx, y + 7 + dy, dx * 2 + 1, 1, PROP.contorno);
    else { rect(svg, x + 7 - dx, y + 7 + dy, dx - di, 1, PROP.contorno); rect(svg, x + 8 + di, y + 7 + dy, dx - di, 1, PROP.contorno); }
  }
  // El cristal es transparente (se ve lo que amplía); solo un reflejo
  for (let dy = -4; dy <= 4; dy++) {
    const dx = Math.floor(Math.sqrt(16 - dy * dy));
    rect(svg, x + 7 - dx, y + 7 + dy, dx * 2 + 1, 1, "transparent");
  }
  // Recorta el interior del aro para que no quede relleno
  rect(svg, x + 4, y + 4, 2, 1, activo ? "#ffffff" : "#cdeff4"); rect(svg, x + 4, y + 5, 1, 1, activo ? "#ffffff" : "#cdeff4");
  for (let k = 0; k < 7; k++) rect(svg, x + 11 + k, y + 11 + k, 3, 3, k < 2 ? PROP.contorno : PROP.madera);
}

// Microscopio
function propMicroscopio(svg, x, y, { activo = false } = {}) {
  const C = PROP.contorno;
  rect(svg, x, y + 22, 18, 3, C); rect(svg, x + 1, y + 23, 16, 1, PROP.metalClaro);
  rect(svg, x + 12, y + 6, 3, 17, C); rect(svg, x + 13, y + 7, 1, 15, PROP.metalClaro);
  for (let k = 0; k < 6; k++) rect(svg, x + 4 + k, y + 2 + k, 3, 3, C);
  rect(svg, x + 3, y, 4, 3, C);
  rect(svg, x + 2, y + 15, 10, 2, C);
  if (activo) rect(svg, x + 6, y + 13, 2, 2, PROP.verde);
}

// Corchera con una tarjeta clavada
function propCorcho(svg, x, y, w, h) {
  rect(svg, x, y, w, h, PROP.maderaOscura);
  rect(svg, x + 2, y + 2, w - 4, h - 4, "#a7764a");
  const azar = mulberry32(17);
  for (let k = 0; k < (w * h) / 40; k++) rect(svg, x + 2 + Math.floor(azar() * (w - 4)), y + 2 + Math.floor(azar() * (h - 4)), 1, 1, "#8f6238");
}

// Chincheta (para fijar tarjetas)
function propChincheta(svg, x, y, color = PROP.rojo) {
  rect(svg, x, y, 3, 3, PROP.contorno); rect(svg, x + 1, y + 1, 1, 1, color);
}

// Jaula de laboratorio con rueda que gira (a pasos) y ratones dentro; w×h en px de la jaula
function propJaula(svg, x, y, t, { w = 44, h = 30, activo = true } = {}) {
  rect(svg, x, y + h, w, 3, PROP.contorno); rect(svg, x + 1, y + h, w - 2, 2, PROP.madera);
  rect(svg, x, y, w, 2, PROP.contorno);
  for (let bx = x; bx <= x + w - 1; bx += 4) rect(svg, bx, y, 1, h, PROP.metalClaro);
  // Rueda: 8 radios que giran 45° cada 0,15 s si activo
  const cx = x + w - 12, cy = y + h - 11, r = 9, paso = activo ? Math.floor(t / 0.15) % 2 : 0;
  for (let a = 0; a < 16; a++) { const ang = (a / 16) * Math.PI * 2; rect(svg, Math.round(cx + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r), 1, 1, PROP.gris); }
  for (let k = 0; k < 4; k++) { const ang = (k / 4) * Math.PI + (paso * Math.PI) / 8; linea(svg, Math.round(cx - Math.cos(ang) * r), Math.round(cy - Math.sin(ang) * r), Math.round(cx + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r), PROP.gris); }
  propRaton(svg, cx - 6, cy - 3, t, { activo });
  propRaton(svg, x + 4, y + h - 7, t + 0.06, { activo: false });
}

// Bote de reactivo (para estanterías): cuerpo de color y tapón
function propBote(svg, x, y, color, { alto = 12 } = {}) {
  rect(svg, x, y, 8, alto, PROP.contorno); rect(svg, x + 1, y + 3, 6, alto - 4, color); rect(svg, x + 2, y + 1, 4, 2, PROP.metalClaro);
  rect(svg, x + 2, y + 4, 1, alto - 7, "#ffffff55");
}
