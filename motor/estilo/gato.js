// Estilo v2 · MISTA, el gato narrador (ADR 0007). Pixel art por código, determinista (sin reloj; todo desde t).
// gato(svg, x, y, { pose, t, hablando, parpadeo, mirar }, escala)  → dibuja el gato sentado; (x, y) = esquina sup. izq.
// retratoGato(svg, x, y, { t, hablando, parpadeo }, escala)       → solo la cabeza (caja de diálogo).
// Poses: "pie" · "senalar" · "pensar" · "sorpresa" · "celebrar" · "tocar". Necesita pixel.js (rect).

// Diseño a partir del boceto de Mario (.runtime/marca/gato-referencia-mario.webp): atigrado naranja con rayas,
// pecho, hocico y patas crema, ojos ámbar verdosos, nariz e interior de las orejas rosas, punta de la cola crema.
const GATO_COLOR = {
  o: "#2b1a10", // contorno (marrón oscuro)
  b: "#dc8a3e", // pelaje naranja
  s: "#b4622a", // rayas
  c: "#f4d3a1", // crema (pecho, hocico, patas, punta de la cola)
  r: "#f3ad62", // brillo del pelaje
  e: "#d8c94a", // ojos ámbar verdosos
  p: "#1d140a", // pupila
  n: "#e8919c", // nariz e interior de las orejas
  m: "#2b1a10", // boca cerrada
  k: "#b84a5a", // boca abierta (interior)
  h: "#fff1c4", // brillo del ojo
};

// Cabeza 16×13 (orejas incluidas). Filas de ojos y boca se sustituyen según el estado.
const GATO_CABEZA = [
  ".oo..........oo.",
  ".obo........obo.",
  ".obno......onbo.",
  ".obnboooooobnbo.",
  "orbbbsbssbsbbbbo", // 4 · la «M» del atigrado
  "obbbbbsbbsbbbbbo",
  "obbepebbbbepebbo", // 6 · ojos (pupila vertical)
  "obbepebbbbepebbo", // 7 · ojos
  "osbbbccnnccbbbso", // 8 · nariz, hocico crema y rayas de las mejillas
  "obbbbccmmccbbbbo", // 9 · boca
  ".obbbbccccbbbbo.", // 10
  "..obbbbccbbbbo..",
  "...oooooooooo...",
];
const OJOS = {
  abiertos: ["obbepebbbbepebbo", "obbepebbbbepebbo"],
  cerrados: ["obbbbbbbbbbbbbbo", "obbooobbbbooobbo"],
  felices: ["obbbobbbbbbobbbo", "obbobobbbbobobbo"],
  sorpresa: ["obbhpebbbbhpebbo", "obbepebbbbepebbo"],
  arriba: ["obbppebbbbppebbo", "obbeeebbbbeeebbo"], // mira hacia arriba (pensar)
};
const BOCA = {
  cerrada: ["obbbbccmmccbbbbo", ".obbbbccccbbbbo."],
  abierta: ["obbbbcckkccbbbbo", ".obbbbckkcbbbbo."],
  grande: ["obbbbckkkkcbbbbo", ".obbbbkkkkbbbbo."],
};
// Cuerpo sentado 18×14: pecho crema, rayas en los costados, patas crema
const GATO_CUERPO = [
  "...obbbbbbbbbbo...",
  "..osbbbcccbbbbso..",
  ".osbbbcccccbbbbso.",
  ".orsbbcccccbbbsbo.",
  "orbsbbcccccbbbsbbo",
  "osbbbbcccccbbbbbso",
  "obbsbbbcccbbbbsbbo",
  "osbbbbbcccbbbbbbso",
  "obbsbbbbbbbbbsbbbo",
  "osbbsbbbbbbbbsbbso",
  "obbbsbbbbbbbbsbbbo",
  "obbbobbbbbbbbobbbo",
  "obcccobbbbbbocccbo",
  ".ooooo.oooo.ooooo.",
];

function gatoFilas(svg, x, y, filas, e) {
  filas.forEach((f, j) => [...f].forEach((ch, i) => { if (GATO_COLOR[ch]) rect(svg, x + i * e, y + j * e, e, e, GATO_COLOR[ch]); }));
}

// Pata: segmento grueso con contorno, de (x0,y0) a (x1,y1) en px del sprite, con almohadilla al final.
function gatoPata(svg, ox, oy, x0, y0, x1, y1, e) {
  const pasos = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (const [grosor, color] of [[4, GATO_COLOR.o], [2, GATO_COLOR.b]]) {
    for (let k = 0; k <= pasos; k++) {
      const px = Math.round(x0 + ((x1 - x0) * k) / pasos), py = Math.round(y0 + ((y1 - y0) * k) / pasos);
      rect(svg, ox + (px - grosor / 2 + 1) * e, oy + (py - grosor / 2 + 1) * e, grosor * e, grosor * e, color);
    }
  }
  // Almohadilla crema (2×2) al final de la pata
  rect(svg, ox + x1 * e, oy + y1 * e, 2 * e, 2 * e, GATO_COLOR.c);
}

// Cola: curva de 3 fotogramas en bucle (cambia cada 0,25 s).
function gatoCola(svg, ox, oy, t, e) {
  const f = Math.floor(t / 0.25) % 4; // 0,1,2,1
  const fase = [0, 1, 2, 1][f];
  const puntos = [];
  // Sale por detrás, abajo a la izquierda, y se curva hacia arriba (no debe parecer un brazo)
  for (let k = 0; k <= 11; k++) puntos.push([7 - Math.round(k * 0.55), 30 - Math.round(k * 0.75) + (k > 6 ? Math.round(Math.sin(k / 2 + fase) * 1.5) : 0)]);
  // Contorno, y después el relleno: rayas cada 3 puntos y punta crema (los 2 últimos)
  puntos.forEach(([px, py]) => rect(svg, ox + (px - 1) * e, oy + (py - 1) * e, 4 * e, 4 * e, GATO_COLOR.o));
  puntos.forEach(([px, py], k) => {
    const color = k >= puntos.length - 2 ? GATO_COLOR.c : k % 3 === 2 ? GATO_COLOR.s : GATO_COLOR.b;
    rect(svg, ox + px * e, oy + py * e, 2 * e, 2 * e, color);
  });
}

function gatoCabeza(svg, x, y, estado, e) {
  const { ojos = "abiertos", boca = "cerrada" } = estado;
  const filas = GATO_CABEZA.slice();
  [filas[6], filas[7]] = OJOS[ojos];
  [filas[9], filas[10]] = BOCA[boca];
  gatoFilas(svg, x, y, filas, e);
}

// Estado de la cara a partir de t: parpadeo cada ~3,1 s (0,1 s), boca alternando cada 0,1 s mientras habla.
function gatoCara(pose, t, hablando, parpadeo) {
  let ojos = pose === "sorpresa" ? "sorpresa" : pose === "celebrar" ? "felices" : pose === "pensar" ? "arriba" : "abiertos";
  const ciclo = t % 3.1;
  if ((parpadeo !== false && ciclo > 3.0) && ojos !== "felices") ojos = "cerrados";
  let boca = pose === "sorpresa" ? "grande" : "cerrada";
  if (hablando && pose !== "sorpresa") boca = Math.floor(t / 0.1) % 2 === 0 ? "abierta" : "cerrada";
  return { ojos, boca };
}

function gato(svg, x, y, { pose = "pie", t = 0, hablando = false, parpadeo = true, espejo = false } = {}, e = 2) {
  // espejo: mira hacia la izquierda (se dibuja en un grupo volteado en horizontal)
  if (espejo) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${x + 32 * e} ${y}) scale(-1 1)`);
    svg.appendChild(g);
    return gato(g, 0, 0, { pose, t, hablando, parpadeo, espejo: false }, e);
  }
  // Sprite de 32×32: cuerpo en (7,16), cabeza en (8,4); cola detrás.
  gatoCola(svg, x, y, t, e);
  gatoFilas(svg, x + 7 * e, y + 17 * e, GATO_CUERPO, e);
  const salto = pose === "celebrar" && Math.floor(t / 0.2) % 2 === 0 ? -1 : 0; // da saltitos al celebrar
  gatoCabeza(svg, x + 8 * e, y + (5 + salto) * e, gatoCara(pose, t, hablando, parpadeo), e);
  // Patas delanteras según la pose (coordenadas del sprite)
  if (pose === "senalar") gatoPata(svg, x, y, 22, 22, 29, 13, e);
  else if (pose === "tocar") gatoPata(svg, x, y, 22, 23, 31, 22, e);
  else if (pose === "pensar") gatoPata(svg, x, y, 20, 24, 18, 19, e); // pata bajo la barbilla
  else if (pose === "celebrar") { gatoPata(svg, x, y, 9, 21, 4, 12, e); gatoPata(svg, x, y, 23, 21, 28, 12, e); }
  else if (pose === "sorpresa") { gatoPata(svg, x, y, 9, 22, 6, 17, e); gatoPata(svg, x, y, 23, 22, 26, 17, e); }
}

function retratoGato(svg, x, y, { t = 0, hablando = false, parpadeo = true } = {}, e = 1) {
  gatoCabeza(svg, x, y, gatoCara("pie", t, hablando, parpadeo), e);
}
