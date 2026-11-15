// Piloto de piezas generadas (2026-11-14): cómo se dibujan y se animan en una escena seek(t) las piezas que llegan
// como rejilla de letras (convertir.py) en lugar de como código. Necesita sprite5 (motor/estilo/v5/dibujo.js).
//  - spriteG: pinta una pieza con su ancla horizontal en x y los pies en yPie; dir -1 la voltea.
//  - Estados por paleta: `cambios` sustituye colores (luz encendida/apagada, camisa de otro color) sin regenerar.
//  - andarG: ciclo de dos poses (quieta y a mitad de paso) con fotograma = f(t).
//  - Lo que se mueve por dentro y no trae la pieza (la hoja de la puerta) va escrito a mano como rejilla.
// Contrato seek(t): nada depende del reloj.

// Ancla horizontal: el centro de la fila de arriba (la cabeza en las personas, el tejado en los edificios)
function anclaG(s) {
  if (s._ancla === undefined) {
    const f = s.filas[0], i0 = f.search(/[^.]/), i1 = f.length - 1 - [...f].reverse().join("").search(/[^.]/);
    s._ancla = Math.round((i0 + i1) / 2);
  }
  return s._ancla;
}
function paletaG(pal, cambios) {
  if (!cambios) return pal;
  const o = {};
  for (const k in pal) o[k] = cambios[pal[k]] || pal[k];
  return o;
}
function spriteG(svg, s, x, yPie, { dir = 1, cambios = null, ancla = null } = {}) {
  const a = ancla ?? anclaG(s), ax = dir > 0 ? a : s.w - 1 - a;
  sprite5(svg, Math.round(x - ax), Math.round(yPie - s.h), s.filas, paletaG(s.paleta, cambios), dir < 0);
  return { x0: Math.round(x - ax), y0: Math.round(yPie - s.h) };
}
// Caja que ocupan los píxeles de ciertos colores (p. ej. las luces), en coordenadas de la pieza
function cajaColoresG(s, colores) {
  const clave = colores.join();
  s._cajas = s._cajas || {};
  if (!s._cajas[clave]) {
    const letras = Object.keys(s.paleta).filter((k) => colores.includes(s.paleta[k]));
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    s.filas.forEach((f, j) => [...f].forEach((c, i) => { if (letras.includes(c)) { x0 = Math.min(x0, i); y0 = Math.min(y0, j); x1 = Math.max(x1, i); y1 = Math.max(y1, j); } }));
    s._cajas[clave] = x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }
  return s._cajas[clave];
}

// Camisa: los tonos claros de la ropa del personaje generado pasan a una rampa [oscuro, medio, claro]
const ROPA_G = ["#b8ad96", "#efe6d2", "#f5f7fb", "#5b6a86"];
const camisaG = (c) => (c ? { [ROPA_G[0]]: c[1], [ROPA_G[1]]: c[2], [ROPA_G[2]]: c[2], [ROPA_G[3]]: c[0] } : null);
// Iguala los colores de una pose a los de otra (el generador no siempre repite el mismo marrón de pelo)
function igualarG(s, cambios) { for (const k in s.paleta) s.paleta[k] = cambios[s.paleta[k]] || s.paleta[k]; }

// Paseante: con `ciclo` (lista de fotogramas de andar, p. ej. los 6 de PixelLab), uno cada 0,12 s; si no, dos poses
// alternas (quieta y a mitad de paso, las de Codex) cada 0,25 s. Quieto, la pose quieta.
function andarG(svg, set, x, yPie, t, { dir = 1, anda = true, fase = 0, camisa = null } = {}) {
  let s = set.quieto;
  if (anda && set.ciclo) s = set.ciclo[Math.floor((t + fase) / 0.12) % set.ciclo.length];
  else if (anda && Math.floor((t + fase) / 0.25) % 2 === 1) s = set.paso;
  spriteG(svg, s, x, yPie, { dir, cambios: camisaG(camisa) }); // ancla: la cabeza, que apenas se mueve al andar
}

// Luces apagadas: los ámbares y dorados de una fachada pasan a marrones oscuros
const APAGAR_G = { "#ffd486": "#41291f", "#f0a83a": "#2a1d1c", "#f2c14e": "#2a1d1c", "#b0701c": "#1a1612", "#ffb37a": "#41291f",
  "#efe6d2": "#5c3a26", "#6a4210": "#1a1612", "#7c5232": "#2a1d1c", "#c25e22": "#41291f", "#ff8a3d": "#41291f" };
const LUCES_G = ["#ffd486", "#f0a83a", "#f2c14e", "#ffb37a"];

// Hoja de puerta escrita a mano (rejilla de letras, paleta del canal): madera con rampa, cuarterones y pomo
function hojaPuertaG(w, h) {
  const filas = [];
  for (let j = 0; j < h; j++) {
    let f = "";
    for (let i = 0; i < w; i++) {
      const borde = i === 0 || i === w - 1 || j === 0 || j === h - 1;
      const cuarteron = (j > 2 && j < Math.floor(h / 2) - 1) || (j > Math.floor(h / 2) + 1 && j < h - 3);
      const dentro = i > 1 && i < w - 2;
      if (borde) f += "o";
      else if (i === w - 3 && j === Math.floor(h / 2)) f += "p";      // pomo
      else if (cuarteron && dentro && (i === 2 || j === 3 || j === Math.floor(h / 2) + 2)) f += "c";
      else if (cuarteron && dentro) f += "b";
      else f += i === 1 ? "d" : "a";
    }
    filas.push(f);
  }
  return filas;
}
const PAL_PUERTA_G = { o: "#0b0e14", a: "#5c3a26", b: "#41291f", c: "#7c5232", d: "#7c5232", p: "#f2c14e" };
// Puerta que se cierra: la hoja entra desde el marco izquierdo hasta tapar el hueco (cierre 0..1)
function puertaG(svg, x, y, w, h, cierre) {
  const ancho = Math.round(w * cierre);
  if (ancho < 2) return;
  const filas = hojaPuertaG(w, h).map((f) => f.slice(w - ancho));
  sprite5(svg, x, y, filas, PAL_PUERTA_G);
}
