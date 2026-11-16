// Estilo v7 · arte generado (ADR 0011). Script clásico; necesita ../v5/dibujo.js (sprite5) y, en la escena, las piezas
// del vídeo en window.PIEZAS (proyectos/<slug>/escenas/comun/piezas.js, que escribe motor/piezas/montar.mjs).
// Una pieza es una rejilla de letras con su paleta y lo medido sobre ella:
//   { filas, paleta, w, h, tipo, base?, ancla?, anclas?: { nombre: {x, y, w, h} }, estados?: { nombre: {"#de": "#a"} } }
// Aquí solo se colocan, se tiñen y se animan. Lo que la pieza no trae y se mueve por dentro (la hoja de una puerta) va
// escrito como rejilla con la paleta del canal (puerta7). Viene del piloto del 2026-11-14 (piezas-gen.js).
// Contrato seek(t): nada depende del reloj.

// Ancla horizontal: la de la meta o el centro de la fila de arriba (la cabeza en las personas, el tejado en los edificios)
function ancla7(s) {
  if (s.ancla !== undefined) return s.ancla;
  if (s._ancla === undefined) {
    const f = s.filas[0], i0 = f.search(/[^.]/), i1 = f.length - 1 - [...f].reverse().join("").search(/[^.]/);
    s._ancla = Math.round((i0 + i1) / 2);
  }
  return s._ancla;
}
// Paleta con colores sustituidos (sin tocar la de la pieza)
function paleta7(pal, cambios) {
  if (!cambios) return pal;
  const o = {};
  for (const k in pal) o[k] = cambios[pal[k]] || pal[k];
  return o;
}
// Pinta la pieza con su ancla en x y su base (la fila que pisa el suelo; por defecto la última) en yPie.
//   dir -1: volteada. estado: uno de s.estados («apagada», «cerrada»…). cambios: sustituciones sueltas (camisa7).
//   izq: x es el borde izquierdo de la pieza (para encajarla en una estación) en vez de su ancla.
// Devuelve la posición, para punto7: { x0, y0, dir, s }.
function sprite7(svg, s, x, yPie, { dir = 1, estado = null, cambios = null, izq = false } = {}) {
  const a = ancla7(s), ax = dir > 0 ? a : s.w - 1 - a;
  const x0 = Math.round(izq ? x : x - ax), y0 = Math.round(yPie - (s.base ?? s.h));
  let pal = s.paleta;
  if (estado) {
    if (!s.estados || !s.estados[estado]) throw new Error(`sprite7: la pieza no tiene el estado «${estado}»`);
    pal = paleta7(pal, s.estados[estado]);
  }
  sprite5(svg, x0, y0, s.filas, paleta7(pal, cambios), dir < 0);
  return { x0, y0, dir, s };
}
// Un ancla interna de la pieza (hueco de la puerta, escaparate, tablilla) en coordenadas del mundo, también volteada.
//   const T = sprite7(L.medio, P.tienda, x, SU); const d = punto7(T, "puerta"); → { x, y, w, h, cx, cy, pie }
function punto7(pos, nombre) {
  const r = pos.s.anclas && pos.s.anclas[nombre];
  if (!r) throw new Error(`punto7: la pieza no tiene el ancla «${nombre}»`);
  const w = r.w ?? 1, h = r.h ?? 1;
  const x = pos.dir > 0 ? pos.x0 + r.x : pos.x0 + pos.s.w - r.x - w, y = pos.y0 + r.y;
  return { x, y, w, h, cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2), pie: y + h };
}
// Caja que ocupan los píxeles de ciertos colores (p. ej. las luces), en coordenadas de la pieza
function caja7(s, colores) {
  const clave = colores.join();
  s._cajas = s._cajas || {};
  if (!(clave in s._cajas)) {
    const letras = Object.keys(s.paleta).filter((k) => colores.includes(s.paleta[k]));
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    s.filas.forEach((f, j) => [...f].forEach((c, i) => { if (letras.includes(c)) { x0 = Math.min(x0, i); y0 = Math.min(y0, j); x1 = Math.max(x1, i); y1 = Math.max(y1, j); } }));
    s._cajas[clave] = x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }
  return s._cajas[clave];
}

// Las luces de una pieza, una caja por cada zona unida de esos colores (las ventanas encendidas de una fachada), de
// arriba abajo y de izquierda a derecha, en coordenadas de la pieza. Se calcula una vez.
function luces7(s, colores = LUCES7) {
  const clave = "luces:" + colores.join();
  s._cajas = s._cajas || {};
  if (s._cajas[clave]) return s._cajas[clave];
  const letras = new Set(Object.keys(s.paleta).filter((k) => colores.includes(s.paleta[k])));
  const visto = s.filas.map((f) => [...f].map(() => false)), cajas = [];
  for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) {
    if (visto[j][i] || !letras.has(s.filas[j][i])) continue;
    const pila = [[i, j]];
    let x0 = i, y0 = j, x1 = i, y1 = j;
    visto[j][i] = true;
    while (pila.length) {
      const [x, y] = pila.pop();
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < s.w && ny < s.h && !visto[ny][nx] && letras.has(s.filas[ny][nx])) { visto[ny][nx] = true; pila.push([nx, ny]); }
      }
    }
    cajas.push({ x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
  }
  return (s._cajas[clave] = cajas);
}
// Apaga una fracción de las luces de una pieza ya pintada (pos de sprite7): cada caja, de su color oscuro, en un orden
// fijo por semilla (las que se apagan antes son siempre las mismas). encendidas 0..1.
function apagarLuces7(svg, pos, encendidas, { colores = LUCES7, oscuro = "#141a26", semilla = 4 } = {}) {
  const cajas = luces7(pos.s, colores), az = mulberry32(semilla);
  const orden = cajas.map((c, k) => [az(), k]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const apagadas = Math.round(cajas.length * (1 - encendidas));
  for (let n = 0; n < apagadas; n++) {
    const c = cajas[orden[n]];
    const x = pos.dir > 0 ? pos.x0 + c.x : pos.x0 + pos.s.w - c.x - c.w;
    rect(svg, x, pos.y0 + c.y, c.w, c.h, oscuro);
  }
  return cajas.length;
}

// Camisa: los tonos claros de la ropa de una persona generada pasan a una rampa [oscuro, medio, claro]
const ROPA7 = ["#b8ad96", "#efe6d2", "#f5f7fb", "#5b6a86"];
const camisa7 = (c) => (c ? { [ROPA7[0]]: c[1], [ROPA7[1]]: c[2], [ROPA7[2]]: c[2], [ROPA7[3]]: c[0] } : null);
// Rampas de camisa del canal (las de ia-pasa-factura): azul, verde, naranja, violeta y ocre
const CAMISAS7 = [["#1d2f6b", "#3a5fc0", "#5b8cff"], ["#0d5a42", "#13936a", "#1fd69a"], ["#7a3a14", "#c25e22", "#ff8a3d"],
  ["#4a2a5c", "#6e4488", "#9a6ab8"], ["#5c4a1a", "#8a6e2a", "#c29c3e"]];

// Andar: con `ciclo` (lista de poses), una cada 0,12 s; si no, dos poses alternas (quieto y paso) cada 0,25 s. Parado,
// la pose quieta. El ancla es la cabeza, que apenas se mueve al andar.
//   andar7(L.frente, { quieto: P.quieto, paso: P.paso }, x, SU, t, { dir, anda, fase, camisa })
function andar7(svg, poses, x, yPie, t, { dir = 1, anda = true, fase = 0, camisa = null, estado = null } = {}) {
  let s = poses.quieto;
  if (anda && poses.ciclo) s = poses.ciclo[Math.floor((t + fase) / 0.12) % poses.ciclo.length];
  else if (anda && poses.paso && Math.floor((t + fase) / 0.25) % 2 === 1) s = poses.paso;
  return sprite7(svg, s, x, yPie, { dir, estado, cambios: camisa7(camisa) });
}

// Luces apagadas: los ámbares y dorados de una fachada pasan a marrones oscuros (estado por defecto «apagada»)
const APAGAR7 = { "#ffd486": "#41291f", "#f0a83a": "#2a1d1c", "#f2c14e": "#2a1d1c", "#b0701c": "#1a1612", "#ffb37a": "#41291f",
  "#efe6d2": "#5c3a26", "#6a4210": "#1a1612", "#7c5232": "#2a1d1c", "#c25e22": "#41291f", "#ff8a3d": "#41291f" };
const LUCES7 = ["#ffd486", "#f0a83a", "#f2c14e", "#ffb37a"];

// Fondo de un interior (lo que en la calle son el cielo y el suelo): pared en bandas con la luz arriba, el corte del
// diorama y el suelo. Sin muebles: lo que tenga silueta son piezas. Rampas: PARED7.calida (salón) y PARED7.fria (laboratorio).
const PARED7 = { calida: ["#2a1d1c", "#3b2a24", "#4f382c", "#6a4a34", "#8a6440"], fria: ["#10232a", "#173640", "#22545a", "#2f6f72", "#4b9a92"] };
const SUELO7 = ["#24170f", "#3a2616", "#54381f"];
function interior7(svg, x, techo, w, su, { pared = PARED7.calida, suelo = SUELO7 } = {}) {
  const alto = su - techo;
  for (let yy = techo; yy < su; yy++) rect(svg, x, yy, w, 1, pared[Math.min(pared.length - 1, Math.floor(((su - yy) / alto) * pared.length))]);
  rect(svg, x - 3, techo - 3, w + 6, 3, R5.contorno); rect(svg, x - 3, techo, 3, alto, R5.contorno); rect(svg, x + w, techo, 3, alto, R5.contorno);
  rect(svg, x, techo, w, 1, pared[pared.length - 1]);
  rect(svg, x, su - 5, w, 5, suelo[0]); rect(svg, x, su - 5, w, 1, suelo[2]);
  rect(svg, x - 3, su, w + 6, 6, suelo[1]); for (let k = x; k < x + w; k += 18) rect(svg, k, su + 2, 10, 1, suelo[0]);
}

// Hoja de puerta escrita como rejilla (paleta del canal): madera con rampa, cuarterones y pomo
function hojaPuerta7(w, h) {
  const filas = [], mitad = Math.floor(h / 2);
  for (let j = 0; j < h; j++) {
    let f = "";
    for (let i = 0; i < w; i++) {
      const borde = i === 0 || i === w - 1 || j === 0 || j === h - 1;
      const cuarteron = (j > 2 && j < mitad - 1) || (j > mitad + 1 && j < h - 3);
      const dentro = i > 1 && i < w - 2;
      if (borde) f += "o";
      else if (i === w - 3 && j === mitad) f += "p";
      else if (cuarteron && dentro && (i === 2 || j === 3 || j === mitad + 2)) f += "c";
      else if (cuarteron && dentro) f += "b";
      else f += i === 1 ? "d" : "a";
    }
    filas.push(f);
  }
  return filas;
}
const PAL_PUERTA7 = { o: "#0b0e14", a: "#5c3a26", b: "#41291f", c: "#7c5232", d: "#7c5232", p: "#f2c14e" };
// Puerta que se cierra sobre un hueco (un ancla de la pieza): la hoja entra desde el marco izquierdo (cierre 0..1)
//   puerta7(L.medio, punto7(T, "puerta"), prog6(t, t0, t0 + 0.4))
function puerta7(svg, hueco, cierre) {
  const { x, y, w, h } = hueco, ancho = Math.round(w * cierre);
  if (ancho < 2) return;
  sprite5(svg, x, y, hojaPuerta7(w, h).map((f) => f.slice(w - ancho)), PAL_PUERTA7);
}
