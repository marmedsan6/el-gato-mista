// Estilo v1 · dibujo pixel determinista en SVG (coordenadas enteras del lienzo base).
// Script clásico (file:// no carga módulos ES): funciones globales.
// Contrato de escena: nada depende del reloj; el azar sale de mulberry32 con semilla fija.

function mulberry32(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lienzo(id) {
  const svg = document.getElementById(id);
  const ancho = document.body.clientWidth;
  const alto = document.body.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
  svg.setAttribute("width", ancho);
  svg.setAttribute("height", alto);
  return svg;
}

function rect(svg, x, y, w, h, color) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", Math.round(x));
  r.setAttribute("y", Math.round(y));
  r.setAttribute("width", Math.round(w));
  r.setAttribute("height", Math.round(h));
  r.setAttribute("fill", color);
  svg.appendChild(r);
  return r;
}

// Disco pixel (sol, nodos): filas de rectángulos.
function disco(svg, cx, cy, radio, color) {
  for (let dy = -radio; dy <= radio; dy++) {
    const dx = Math.floor(Math.sqrt(radio * radio - dy * dy));
    rect(svg, cx - dx, cy + dy, dx * 2 + 1, 1, color);
  }
}

// viewBox del lienzo; vale también para un <g> dentro del lienzo (p. ej. una capa desplazada)
const cajaLienzo = (svg) => (svg.viewBox ? svg : svg.ownerSVGElement).viewBox.baseVal;

// Bandas de cielo en escalera (sin degradado continuo).
function bandas(svg, y0, alto, colores) {
  const h = Math.ceil(alto / colores.length);
  colores.forEach((c, i) => rect(svg, 0, y0 + i * h, cajaLienzo(svg).width, h, c));
}

// Silueta de montañas en escalera con semilla.
function montanas(svg, semilla, yBase, amplitud, paso, color) {
  const azar = mulberry32(semilla);
  const ancho = cajaLienzo(svg).width;
  let y = yBase - amplitud / 2;
  for (let x = 0; x < ancho; x += paso) {
    y = Math.max(yBase - amplitud, Math.min(yBase, y + Math.round((azar() - 0.5) * paso * 1.6)));
    rect(svg, x, y, paso, cajaLienzo(svg).height - y, color);
  }
}

// Grupo desplazado dx px en horizontal dentro de un lienzo (transiciones de cámara), recortado a su propio lienzo
// para que nada de un escenario (p. ej. un edificio que empieza en x<0) invada al vecino durante el desplazamiento
function capaDesplazada(svg, dx) {
  const NS = "http://www.w3.org/2000/svg", id = `recorte-${svg.id}`;
  if (!svg.querySelector(`#${id}`)) {
    const caja = cajaLienzo(svg), cp = document.createElementNS(NS, "clipPath"), r = document.createElementNS(NS, "rect");
    cp.setAttribute("id", id); cp.setAttribute("clipPathUnits", "userSpaceOnUse");
    Object.entries({ x: 0, y: 0, width: caja.width, height: caja.height }).forEach(([k, v]) => r.setAttribute(k, v));
    cp.appendChild(r); svg.appendChild(cp);
  }
  const g = document.createElementNS(NS, "g");
  g.setAttribute("transform", `translate(${Math.round(dx)} 0)`);
  g.setAttribute("clip-path", `url(#${id})`);
  svg.appendChild(g);
  return g;
}

// Onda pixel continua: en cada columna rellena el tramo vertical hasta la siguiente muestra.
function onda(svg, x0, y0, largo, periodo, amplitud, color, grosor = 1) {
  const yEn = (x) => Math.round(y0 + Math.sin((x / periodo) * Math.PI * 2) * amplitud);
  for (let x = 0; x < largo; x++) {
    const a = yEn(x), b = yEn(x + 1);
    rect(svg, x0 + x, Math.min(a, b), 1, Math.abs(b - a) + grosor, color);
  }
}

// Nube de partículas con semilla.
function particulas(svg, semilla, n, x, y, w, h, colores) {
  const azar = mulberry32(semilla);
  for (let i = 0; i < n; i++) {
    rect(svg, x + azar() * w, y + azar() * h, 1, 1, colores[Math.floor(azar() * colores.length)]);
  }
}

// Línea pixel (Bresenham) para flechas y líneas guía.
function linea(svg, x0, y0, x1, y1, color, grosor = 1) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    rect(svg, x0, y0, grosor, grosor, color);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function puntaFlecha(svg, x, y, dir, color, tam = 4) {
  // dir: "der" | "izq" | "arr" | "aba"
  for (let i = 0; i < tam; i++) {
    if (dir === "der") rect(svg, x - i, y - i, 1, i * 2 + 1, color);
    if (dir === "izq") rect(svg, x + i, y - i, 1, i * 2 + 1, color);
    if (dir === "arr") rect(svg, x - i, y + i, i * 2 + 1, 1, color);
    if (dir === "aba") rect(svg, x - i, y - i, i * 2 + 1, 1, color);
  }
}

// Check y aspa pixel de 7×7.
function check(svg, x, y, color) {
  [[0, 3], [1, 4], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]].forEach(([dx, dy]) => rect(svg, x + dx, y + dy, 1, 2, color));
}
function aspa(svg, x, y, color) {
  for (let i = 0; i < 7; i++) { rect(svg, x + i, y + i, 2, 1, color); rect(svg, x + 6 - i, y + i, 2, 1, color); }
}

// Press Start 2P dibuja las mayúsculas con tilde en la misma celda que la letra (se leen como
// minúsculas). Sustituye ÁÉÍÓÚÑ por la letra base + tilde pixel encima (rejilla de 1/8 em).
function tildesPixel(selector = ".titular, .rotulo, .etiqueta, .insignia, .fuente-dato, .tarjeta-texto, .nombre") {
  const mapa = { "Á": ["A", "agudo"], "É": ["E", "agudo"], "Í": ["I", "agudo"], "Ó": ["O", "agudo"], "Ú": ["U", "agudo"], "Ñ": ["N", "virgulilla"] };
  document.querySelectorAll(selector).forEach((el) => {
    const nodos = [];
    const paseo = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (paseo.nextNode()) nodos.push(paseo.currentNode);
    nodos.forEach((nodo) => {
      const texto = nodo.textContent.toUpperCase();
      if (!/[ÁÉÍÓÚÑ]/.test(texto)) { nodo.textContent = texto; return; }
      const frag = document.createDocumentFragment();
      for (const ch of texto) {
        if (mapa[ch]) {
          const s = document.createElement("span");
          s.className = `ac ${mapa[ch][1]}`;
          s.textContent = mapa[ch][0];
          frag.appendChild(s);
        } else {
          frag.appendChild(document.createTextNode(ch));
        }
      }
      nodo.replaceWith(frag);
    });
  });
}

// Grupo escalado: dibuja con las mismas funciones a ×e (regla v2: personaje y objetos a ×2, escenario y texto a ×1).
function escalado(svg, x, y, e, dibujar) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x} ${y}) scale(${e})`);
  svg.appendChild(g);
  dibujar(g);
  return g;
}

// Marco de selección pixel alrededor de un objeto que «reacciona» (como la caja de la palabra clave)
function marcoSeleccion(svg, x, y, w, h, color = "#3d68ba") {
  rect(svg, x, y, w, 1, color); rect(svg, x, y + h - 1, w, 1, color); rect(svg, x, y, 1, h, color); rect(svg, x + w - 1, y, 1, h, color);
  for (const [cx, cy] of [[x - 1, y - 1], [x + w - 2, y - 1], [x - 1, y + h - 2], [x + w - 2, y + h - 2]]) {
    rect(svg, cx, cy, 3, 3, color); rect(svg, cx + 1, cy + 1, 1, 1, "#f5f7fb");
  }
}
