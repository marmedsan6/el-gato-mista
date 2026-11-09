// Estilo v3 (calibración, 2026-11-03) · MISTA sombreado a mano: mismo diseño y API que motor/estilo/gato.js, con
// sombreado de 3-4 tonos por zona (luz arriba a la izquierda, sombra abajo a la derecha), crema con sombra, contorno
// interior más claro y brillo en los ojos. Pensado para dibujarse a 1 unidad de lienzo v3 por píxel (12 px de salida).
// gato(svg, x, y, { pose, t, hablando, parpadeo, espejo }, escala) · retratoGato(svg, x, y, { t, hablando, parpadeo }, escala)
const GATO_COLOR = {
  o: "#2b1a10", // contorno exterior
  i: "#7a3f1c", // contorno interior (separa zonas sin línea negra dura)
  l: "#f6b46a", // luz del pelaje
  b: "#dc8a3e", // pelaje naranja
  d: "#b0602a", // sombra del pelaje
  s: "#9c4f1e", // rayas
  c: "#f4d3a1", // crema
  q: "#d4a874", // crema en sombra
  e: "#d8c94a", // ojos ámbar verdosos
  p: "#1d140a", // pupila
  h: "#fff7dc", // brillo del ojo
  n: "#e8919c", // nariz e interior de las orejas
  m: "#2b1a10", // boca cerrada
  k: "#b84a5a", // boca abierta (interior)
};

// Cabeza 16×13 (orejas incluidas). Filas 6-7 (ojos) y 9-10 (boca) se sustituyen según el estado.
const GATO_CABEZA = [
  ".oo..........oo.",
  ".olo........odo.",
  ".olno......ondo.",
  ".olnloooooodndo.",
  "ollllsbssbsbbbdo", // 4 · la «M» del atigrado, con luz arriba a la izquierda
  "olllbbsbbsbbbbdo",
  "olbhpebbbbhpebdo", // 6 · ojos con brillo
  "olbepebbbbepebdo", // 7
  "osbbbccnnccbbdso", // 8 · nariz, hocico crema y rayas de las mejillas
  "obbbbccmmccbbddo", // 9 · boca
  ".obbbqccccqbbdo.", // 10
  "..oddbbqqbbddo..",
  "...oooooooooo...",
];
const OJOS = {
  abiertos: ["olbhpebbbbhpebdo", "olbepebbbbepebdo"],
  cerrados: ["olbbbbbbbbbbbbdo", "olbiiibbbbiiibdo"],
  felices: ["olbbibbbbbbibbdo", "olbibibbbbibibdo"],
  sorpresa: ["olbhpebbbbhpebdo", "olbeeebbbbeeebdo"],
  arriba: ["olbppebbbbppebdo", "olbeeebbbbeeebdo"], // mira hacia arriba (pensar)
};
const BOCA = {
  cerrada: ["obbbbccmmccbbddo", ".obbbqccccqbbdo."],
  abierta: ["obbbbcckkccbbddo", ".obbbqckkcqbbdo."],
  grande: ["obbbbckkkkcbbddo", ".obbbqkkkkqbbdo."],
};
// Cuerpo sentado 18×14: pecho crema con sombra, rayas en los costados, patas crema; luz a la izquierda
const GATO_CUERPO = [
  "...olbbbbbbbbbo...",
  "..olbbbcccbbbbdo..",
  ".olsbbcccccbbbsdo.",
  ".olsbbcccccqbbsdo.",
  "olbsbbcccccqbbsbdo",
  "olbbbbcccccqbbbbdo",
  "olbsbbbcccqbbbsbdo",
  "olbbbbbcqqbbbbbddo",
  "obbsbbbbbbbbbsbbdo",
  "obbbsbbbbbbbbsbddo",
  "obbbsbbbbbbbdsdddo",
  "obbbibbbbbbbdiddo.",
  "occqqoibbbbioqqcdo",
  ".ooooo.oooo.ooooo.",
];

function gatoFilas(svg, x, y, filas, e) {
  filas.forEach((f, j) => [...f].forEach((ch, i) => { if (GATO_COLOR[ch]) rect(svg, x + i * e, y + j * e, e, e, GATO_COLOR[ch]); }));
}

// Pata: segmento grueso con contorno y una línea de luz, de (x0,y0) a (x1,y1) en px del sprite; almohadilla crema
function gatoPata(svg, ox, oy, x0, y0, x1, y1, e, contorno = GATO_COLOR.o) {
  const pasos = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  const punto = (k) => [Math.round(x0 + ((x1 - x0) * k) / pasos), Math.round(y0 + ((y1 - y0) * k) / pasos)];
  for (const [grosor, color] of [[4, contorno], [2, GATO_COLOR.b]]) {
    for (let k = 0; k <= pasos; k++) { const [px, py] = punto(k); rect(svg, ox + (px - grosor / 2 + 1) * e, oy + (py - grosor / 2 + 1) * e, grosor * e, grosor * e, color); }
  }
  for (let k = 0; k < pasos; k++) { const [px, py] = punto(k); rect(svg, ox + px * e, oy + py * e, e, e, GATO_COLOR.l); }
  rect(svg, ox + x1 * e, oy + y1 * e, 2 * e, 2 * e, GATO_COLOR.c);
  rect(svg, ox + (x1 + 1) * e, oy + (y1 + 1) * e, e, e, GATO_COLOR.q);
}

// Cola: curva de 3 fotogramas en bucle (cambia cada 0,25 s), con rayas, sombra y punta crema
function gatoCola(svg, ox, oy, t, e) {
  const fase = [0, 1, 2, 1][Math.floor(t / 0.25) % 4];
  const puntos = [];
  for (let k = 0; k <= 11; k++) puntos.push([7 - Math.round(k * 0.55), 30 - Math.round(k * 0.75) + (k > 6 ? Math.round(Math.sin(k / 2 + fase) * 1.5) : 0)]);
  puntos.forEach(([px, py]) => rect(svg, ox + (px - 1) * e, oy + (py - 1) * e, 4 * e, 4 * e, GATO_COLOR.o));
  puntos.forEach(([px, py], k) => {
    const punta = k >= puntos.length - 2, raya = k % 3 === 2;
    rect(svg, ox + px * e, oy + py * e, 2 * e, 2 * e, punta ? GATO_COLOR.c : raya ? GATO_COLOR.s : GATO_COLOR.b);
    rect(svg, ox + (px + 1) * e, oy + (py + 1) * e, e, e, punta ? GATO_COLOR.q : GATO_COLOR.d);
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
  if (parpadeo !== false && t % 3.1 > 3.0 && ojos !== "felices") ojos = "cerrados";
  let boca = pose === "sorpresa" ? "grande" : "cerrada";
  if (hablando && pose !== "sorpresa") boca = Math.floor(t / 0.1) % 2 === 0 ? "abierta" : "cerrada";
  return { ojos, boca };
}

function gato(svg, x, y, { pose = "pie", t = 0, hablando = false, parpadeo = true, espejo = false } = {}, e = 1) {
  if (espejo) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${x + 32 * e} ${y}) scale(-1 1)`);
    svg.appendChild(g);
    return gato(g, 0, 0, { pose, t, hablando, parpadeo, espejo: false }, e);
  }
  // Sombra en el suelo (elipse escalonada) para asentar al gato
  rect(svg, x + 7 * e, y + 30 * e, 19 * e, e, "#00000040"); // sombra centrada bajo el cuerpo, en 2 tonos
  rect(svg, x + 9 * e, y + 31 * e, 15 * e, e, "#00000059");
  gatoCola(svg, x, y, t, e);
  gatoFilas(svg, x + 7 * e, y + 17 * e, GATO_CUERPO, e);
  const salto = pose === "celebrar" && Math.floor(t / 0.2) % 2 === 0 ? -1 : 0;
  gatoCabeza(svg, x + 8 * e, y + (5 + salto) * e, gatoCara(pose, t, hablando, parpadeo), e);
  if (pose === "senalar") gatoPata(svg, x, y, 22, 22, 29, 13, e);
  else if (pose === "tocar") gatoPata(svg, x, y, 22, 23, 31, 22, e);
  else if (pose === "pensar") gatoPata(svg, x, y, 20, 24, 18, 19, e, GATO_COLOR.d); // sobre el pecho: perfil en tono medio, no en negro
  else if (pose === "celebrar") { gatoPata(svg, x, y, 9, 21, 4, 12, e); gatoPata(svg, x, y, 23, 21, 28, 12, e); }
  else if (pose === "sorpresa") { gatoPata(svg, x, y, 9, 22, 6, 17, e); gatoPata(svg, x, y, 23, 22, 26, 17, e); }
}

function retratoGato(svg, x, y, { t = 0, hablando = false, parpadeo = true } = {}, e = 1) {
  gatoCabeza(svg, x, y, gatoCara("pie", t, hablando, parpadeo), e);
}
