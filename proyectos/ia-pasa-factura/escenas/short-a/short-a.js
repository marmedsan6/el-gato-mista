// ia-pasa-factura · short A «Reddit cierra la puerta» (9:16, estilo v6). Guion propio (guion.md, Short A).
// 8 estaciones: la respuesta de arriba, las dos calles de Pew (zoom núcleo; incluye los enlaces del resumen) | la puerta:
// el grifo, la cuenta | el bucle: el foro que enseña, Stack Overflow (zoom núcleo), el bucle | cierre. Arte a 4 px, lienzo
// 270×480; lo importante, fuera del 12 % de arriba, del 20 % de abajo y de la franja derecha (x > 237 entre y 216 y 408).
(() => {
  const T = window.TIMING, TT = tiempos6(T), P = TT.P, fin = TT.fin;
  const prog = prog6, salto = salto6, SU = 292;
  const T_ENTRADA = P("fr01", "que"), T_ARRIBA = P("fr01", "arriba"), T_VAS = P("fr01", "vas"), T_NINGUNA = P("fr01", "ninguna");
  const T_PEW = P("fr03", "Pew"), T_RESULT = P("fr04", "resultado"), T_CUANDO = P("fr04", "Cuando"), T_SOLO = P("fr04", "solo"), T_MITAD = P("fr04", "mitad");
  const T_ENLACES = P("fr05", "enlaces"), T_UNO = P("fr05", "1 %");
  const T_REDDIT = P("fr06", "Reddit"), T_TRAFICO = P("fr07", "tráfico"), T_BAJADO = P("fr07", "bajado"), T_NOTABLE = P("fr07", "notable"), T_DIJO = P("fr07", "dijo"), T_TRIMESTRE = P("fr07", "trimestre"), T_ACHACA = P("fr07", "achaca");
  const T_CUENTA = P("fr08", "cuenta"), T_EMPEZARA = P("fr08", "Empezará");
  const T_IA9 = P("fr09", "IA"), T_GENTE = P("fr09", "pregunta");
  const T_SEIS = P("fr10", "seis"), T_CHATGPT = P("fr10", "ChatGPT"), T_CAIDO = P("fr10", "caído"), T_25 = P("fr10", "25");
  const T_CONTESTA = P("fr11", "contesta"), T_APRENDIO = P("fr11", "aprendió"), T_ESAS2 = P("fr11", "y"), T_MENOS = P("fr11", "menos");
  const T_CERRANDO = P("fr12", "cerrando"), T_DONDE = P("fr12", "dónde");
  const habit = (svg, x0, op = {}) => habitacionG(svg, x0, SU, { m: 8, techo: 70, ancho: 254, ...op });

  // 0 · la respuesta de arriba: el buscador con su cartel azul; el paseante se va; el tendero se asoma a la puerta vacía
  function respuesta(L, x0, t) {
    const { medio, frente, brillo } = L;
    const V = ventanaG(medio, brillo, x0 + 12, 112, 132, 112, { placa: "GOOGLE" });
    barraBusquedaG(medio, V.ix + 6, V.iy + 6, V.iw - 12, prog(t, T_ENTRADA - 0.4, T_ENTRADA + 0.4));
    cartelResumenF(medio, brillo, V.ix + 6, V.iy + 22, V.iw - 12, 36, t, { on: t >= T_ARRIBA - 0.2 ? 1 : 0 });
    for (let k = 0; k < 3; k++) { rect(medio, V.ix + 8, V.iy + 66 + k * 9, V.iw - 40, 2, "#3a4560"); rect(medio, V.ix + 8, V.iy + 69 + k * 9, V.iw - 60, 1, "#2a3448"); }
    const Tn = tiendaWebF(medio, brillo, x0 + 156, SU, t, { abierta: 1 });
    // el paseante: va hacia la tienda y, al leer el cartel, se da la vuelta
    const ida = prog(t, T_ENTRADA, T_VAS), vuelta = prog(t, T_VAS, T_VAS + 2.4);
    const px = Math.round(x0 + 24 + 90 * ida - 110 * vuelta);
    if (px > x0 - 10) paseanteF(frente, px, SU, t, { camisa: FZ.CAMISAS[1], dir: t < T_VAS ? 1 : -1, anda: ida < 1 || vuelta > 0 });
    if (t >= T_NINGUNA) { // el tendero, en la puerta, mira a la calle vacía
      const s = salto(t, T_NINGUNA) || 0;
      paseanteF(frente, Tn.puerta[0] - 5, SU + s, t, { camisa: FZ.CAMISAS[4], dir: -1, anda: false });
      if (t >= T_NINGUNA + 0.8) interrogacionG(frente, Tn.puerta[0] - 6, SU - 46 + (salto(t, T_NINGUNA + 0.8) || 0), FZ.AMBAR, 2);
    }
  }
  // 1 · las dos calles (zoom núcleo): arriba sin cartel, todos entran; abajo con el cartel, la mitad se da la vuelta.
  //     Con «enlaces», el cartel enseña sus puertecitas y solo una se abre.
  const ARR = 186, ABA = 276; // suelos de las dos calles
  function calles(L, x0, t) {
    const { medio, frente, brillo } = L;
    [ARR, ABA].forEach((su) => { rect(medio, x0 + 14, su, 200, 4, GC); rect(medio, x0 + 15, su, 198, 2, R5.hormigon[3]); });
    tiendaWebF(medio, brillo, x0 + 144, ARR, t, { abierta: 1 });
    tiendaWebF(medio, brillo, x0 + 144, ABA, t, { abierta: 1 });
    const enl = cartelResumenF(medio, brillo, x0 + 66, ABA - 70, 64, 32, t, { on: 1, enlaces: t >= T_ENLACES - 0.3 ? 4 : 0 });
    if (t >= T_ENLACES) { const [ex, ey] = enl[1]; if ((t - T_ENLACES) % 1.6 < 0.9) { rect(frente, ex + 1, ey + 1, 6, 3, P6.ORO[2]); if (brillo) rect(brillo, ex - 2, ey - 2, 12, 9, "#3a2c1c"); } }
    // el observador con su portapapeles y su placa
    paseanteF(medio, x0 + 18, ARR - 4 + 0, t, { camisa: FZ.CAMISAS[3], anda: false });
    const marcas = Math.floor(prog(t, TT.ini("fr03"), T_RESULT + 4) * 8);
    portapapelesF(frente, x0 + 26, ARR - 22, marcas);
    const tm = TT.ini("fr03") + (marcas / 8) * (T_RESULT + 4 - TT.ini("fr03"));
    if (marcas > 0 && marcas < 8 && t - tm < 0.25 && brillo) rect(brillo, x0 + 22, ARR - 26, 22, 26, "#3a2c1c");
    placa6(medio, x0 + 12, ARR - 48, "PEW", { color: "#f5f7fb", fondo: "#0c1016" });
    // paseantes: arriba van todos a la puerta; abajo, uno de cada dos se da la vuelta bajo el cartel
    for (let k = 0; k < 4; k++) {
      const f = (t * 0.22 + k / 4) % 1, x = Math.round(x0 + 40 + 150 * f);
      if (f < 0.92) paseanteF(frente, x, ARR, t, { camisa: FZ.CAMISAS[k % 5], fase: k * 0.1 });
      const g = (t * 0.22 + k / 4 + 0.12) % 1, vuelve = k % 2 === 0;
      if (!vuelve) { if (g < 0.92) paseanteF(frente, Math.round(x0 + 40 + 150 * g), ABA, t, { camisa: FZ.CAMISAS[(k + 2) % 5], fase: k * 0.13 }); }
      else { const ida = Math.min(g, 0.4), atras = Math.max(0, g - 0.4); const xx = Math.round(x0 + 40 + 150 * ida - 120 * atras); if (xx > x0 + 16) paseanteF(frente, xx, ABA, t, { camisa: FZ.CAMISAS[(k + 2) % 5], dir: g < 0.4 ? 1 : -1, fase: k * 0.13 }); }
    }
  }
  // 2 · el grifo: el tubo de visitas desde el buscador hasta el foro se estrecha por tandas con la voz («tráfico»,
  //     «bajado», «notable», «trimestre») y las ventanas se apagan; los paseantes que salen del tubo entran en el foro
  function grifo(L, x0, t) {
    const { medio, frente, brillo } = L;
    const paso = [T_TRAFICO, T_BAJADO, T_NOTABLE, T_TRIMESTRE].filter((a) => t >= a).length; // 0..4
    const F = foroF(medio, brillo, x0 + 116, SU, 112, 156, t, { encendidas: [0.95, 0.75, 0.55, 0.4, 0.25][paso], placa: "REDDIT" });
    const V = ventanaG(medio, brillo, x0 + 12, 110, 84, 58, { placa: "GOOGLE" });
    barraBusquedaG(medio, V.ix + 4, V.iy + 4, V.iw - 8, 1);
    if (t >= T_ACHACA - 0.4) cartelResumenF(frente, brillo, V.ix + 4, V.iy + 14, V.iw - 8, 28, t, { on: 1 });
    const g = [16, 12, 9, 6, 3][paso], pts = [[x0 + 54, 170], [x0 + 54, 262], [F.puerta[0] - 2, 262]];
    for (let i = 1; i < pts.length; i++) { linea(medio, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], GC, g + 4); linea(medio, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], "#22304a", g); linea(medio, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], "#3a4a6a", Math.max(1, g >> 2)); }
    const n = [6, 5, 3, 2, 1][paso], tramo = (f) => (f < 0.45 ? [pts[0][0], Math.round(pts[0][1] + (pts[1][1] - pts[0][1]) * f / 0.45)] : [Math.round(pts[1][0] + (pts[2][0] - pts[1][0]) * (f - 0.45) / 0.55), pts[1][1]]);
    for (let k = 0; k < n; k++) { const f = (t * 0.3 + k / n) % 1, [px, py] = tramo(f); rect(frente, px - 2, py - 2, 5, 5, GC); rect(frente, px - 1, py - 1, 3, 3, FZ.CAMISAS[k % 5][2]); }
    for (let k = 0; k < Math.max(1, n >> 1); k++) { const f = (t * 0.5 + k / Math.max(1, n >> 1)) % 1; if (f < 0.8) paseanteF(frente, Math.round(F.puerta[0] - 26 + 24 * f), SU, t, { camisa: FZ.CAMISAS[(k + 1) % 5] }); }
    if (paso >= 2) { const s = salto(t, T_NOTABLE) || 0; interrogacionG(frente, F.puerta[0] - 38, SU - 44 + s, FZ.AMBAR, 2); }
    if (t >= T_DIJO - 0.3) { // el director ejecutivo, en el despacho iluminado del último piso, lo dice claro
      const s = salto(t, T_DIJO - 0.3) || 0, wx = x0 + 192, wy = 144;
      rect(frente, wx, wy, 26, 20, GC); rect(frente, wx + 2, wy + 2, 22, 16, P6.ORO[2]); if (brillo) rect(brillo, wx - 3, wy - 3, 32, 26, "#3a2c1c");
      rect(frente, wx + 8, wy + 4 + s, 9, 7, GC); rect(frente, wx + 9, wy + 5 + s, 7, 5, R5.piel[1]); rect(frente, wx + 9, wy + 5 + s, 7, 2, R5.pelo[1]); // cabeza
      rect(frente, wx + 5, wy + 11 + s, 15, 7, GC); rect(frente, wx + 6, wy + 12 + s, 13, 6, "#1a1e2a"); rect(frente, wx + 11, wy + 12 + s, 3, 5, "#f5f7fb"); // traje y camisa
      if (t < T_DIJO + 2.2) bocadilloSimF(frente, wx + 20, wy - 16 + s, "!");
    }
  }
  // 3 · la cuenta: la puerta del foro con su teclado y el candado que baja; el globo enciende un punto fuera de EE. UU.
  function cuenta(L, x0, t) {
    const { medio, frente, brillo } = L;
    caja5(medio, x0 + 30, 96, 150, SU - 96, R5.hormigon);
    rect(medio, x0 + 62, 136, 86, SU - 136, GC); rect(medio, x0 + 66, 140, 78, SU - 140, P6.CARTON[1]); rect(medio, x0 + 66, 140, 4, SU - 140, P6.CARTON[3]);
    caja5(medio, x0 + 152, 176, 20, 30, R5.metal); for (let k = 0; k < 6; k++) rect(medio, x0 + 156 + (k % 2) * 7, 180 + Math.floor(k / 2) * 8, 5, 5, k === Math.floor(t * 3) % 6 && t >= T_CUENTA ? FZ.AMBAR[3] : R5.metal[1]);
    candadoF(frente, brillo, x0 + 87, 176, prog(t, T_CUENTA - 0.6, T_CUENTA), 2);
    globoF(medio, brillo, x0 + 196, 120, t >= T_EMPEZARA);
    const f = prog(t, T_CUENTA - 1.6, T_CUENTA + 0.4); // un paseante llega a la puerta y se queda
    paseanteF(frente, Math.round(x0 + 8 + 40 * f), SU, t, { camisa: FZ.CAMISAS[0], anda: f > 0 && f < 1 });
    if (t >= T_CUENTA + 0.6) interrogacionG(frente, x0 + 46, SU - 46 + (salto(t, T_CUENTA + 0.6) || 0), FZ.AMBAR, 2);
  }
  // 4 · el foro que enseña: mesas con preguntas y respuestas; el robot lee en el rincón de la derecha
  function foroEnsena(L, x0, t) {
    const { medio, frente, brillo } = L;
    habit(medio, x0, { pared: G.SALON });
    estanteriaG(medio, x0 + 70, 100, 150);
    const RAMPAS = [R5.ia, R5.verde, R5.naranja, [P6.ORO[0], P6.ORO[1], P6.ORO[2], "#fff1c4"]];
    for (let k = 0; k < 12; k++) libroF(medio, x0 + 76 + (k % 6) * 23, 124 + Math.floor(k / 6) * 48, RAMPAS[k % 4]);
    mesaF(medio, x0 + 20, SU, t, 2, 0); mesaF(medio, x0 + 92, SU, t, 2, 1);
    robotBiblioF(frente, brillo, x0 + 176, SU, t, { lee: t >= T_IA9 - 0.4 });
    if (t >= T_GENTE) for (let k = 0; k < 3; k++) { const f = prog(t, T_GENTE + k * 0.3, T_GENTE + k * 0.3 + 0.8); if (f > 0 && f < 1) bocadilloSimF(frente, Math.round(x0 + 60 + 120 * f), Math.round(200 - 10 * Math.sin(f * Math.PI)), k % 2 ? "!" : "?"); }
  }
  // 5 · Stack Overflow (zoom núcleo): pasan seis hojas y las mesas se vacían; el foro gemelo del fondo sigue lleno
  function stack(L, x0, t) {
    const { medio, frente, brillo } = L;
    habit(medio, x0, { pared: G.LAB });
    placa6(medio, x0 + 22, 134, "STACK OVERFLOW", { color: "#f5f7fb", fondo: "#0c1016" });
    salonGemeloF(medio, brillo, x0 + 148, 168, t);
    calendarioSeisF(medio, x0 + 140, 122, prog(t, T_SEIS, T_CHATGPT + 0.4) * 6);
    const vacia = prog(t, T_CHATGPT, T_CAIDO + 0.4);
    const mesas = [[20, 236], [100, 236], [20, SU], [100, SU]];
    mesas.forEach(([mx, su], k) => mesaF(medio, x0 + mx, su, t, Math.max(0, 2 - Math.floor(vacia * (k === 3 ? 0 : 2.6) + (k === 0 ? 0 : k * 0.3) * vacia)), k));
    robotBiblioF(frente, brillo, x0 + 176, SU, t, { lee: true });
  }
  // 6 · el bucle: tiendas → libros → robot → cartel → paseantes, y la flecha que vuelve a las tiendas se queda gris
  function bucle(L, x0, t) {
    const { medio, frente, brillo } = L;
    const luz = t >= T_MENOS - 0.6 ? 1 - prog(t, T_MENOS - 0.6, T_MENOS + 0.6) : 1;
    tiendaWebF(medio, brillo, x0 + 24, 172, t, { abierta: 1, luz: luz > 0.5 });
    for (let k = 0; k < 3; k++) libroF(medio, x0 + 172 + k * 12, 110, [R5.ia, R5.verde, R5.naranja][k]);
    robotBiblioF(medio, brillo, x0 + 182, 262, t, { lee: true });
    cartelResumenF(medio, brillo, x0 + 92, 226, 62, 30, t, { on: 1 });
    for (let k = 0; k < 2; k++) paseanteF(medio, x0 + 30 + k * 16, 262, t, { camisa: FZ.CAMISAS[k + 2], dir: -1, anda: false });
    if (t >= T_APRENDIO - 0.8) flechaF(frente, x0 + 100, 128, x0 + 164, 116);
    if (t >= T_APRENDIO - 0.3) flechaF(frente, x0 + 190, 132, x0 + 196, 210);
    if (t >= T_CONTESTA) flechaF(frente, x0 + 176, 244, x0 + 160, 242);
    if (t >= T_ESAS2) flechaF(frente, x0 + 90, 244, x0 + 66, 248);
    if (t >= T_ESAS2 + 0.6) flechaF(frente, x0 + 44, 234, x0 + 52, 186, t >= T_MENOS - 0.6 ? "#3a4258" : FZ.AZUL[2]);
  }
  // 7 · cierre: el robot llama a la puerta cerrada de la tienda con un libro en blanco bajo el brazo
  function cierre(L, x0, t) {
    const { medio, frente, brillo } = L;
    tiendaWebF(medio, brillo, x0 + 150, SU, t, { abierta: 0, luz: 0 });
    const llama = t >= T_CERRANDO ? (t * 1.5) % 1 : 0;
    robotBiblioF(frente, brillo, x0 + 168, SU, t, { lee: false, llama });
    if (t >= T_DONDE - 0.6) libroF(frente, x0 + 166 + 2, SU - 22, P6.PAPEL, true);
    if (t >= T_CERRANDO && Math.floor(t * 3) % 2) { rect(frente, x0 + 208, SU - 44, 3, 2, "#f5f7fb"); rect(frente, x0 + 210, SU - 40, 3, 2, "#f5f7fb"); } // golpes en la puerta
  }

  montarShort({ TT, entrada: T_ENTRADA, titulo: ['IA · <span class="clave">la factura</span>', 'Sin<br><span class="clave">clic</span>'],
    estaciones: [{ dib: respuesta, hasta: "fr02" }, { dib: calles, hasta: "fr05", extra: 1.7 }, { dib: grifo, hasta: "fr07" }, { dib: cuenta, hasta: "fr08" },
      { dib: foroEnsena, hasta: "fr09" }, { dib: stack, hasta: "fr10" }, { dib: bucle, hasta: "fr11" }, { dib: cierre, hasta: "fr12" }],
    zooms: [{ est: 1, desde: T_CUANDO, cx: 114, cy: 210 }, { est: 5, desde: T_SEIS, cx: 112, cy: 222 }],
    temas: [{ desde: 0, hasta: 1, html: 'Sin <span class="clave">clic</span>' }, { desde: 2, hasta: 3, html: 'La <span class="clave">puerta</span>', pose: "senalar" },
      { desde: 4, hasta: 6, html: 'El <span class="clave">bucle</span>', pose: "senalar" }, { desde: 7, hasta: 7, html: '¿Y <span class="clave">ahora</span>?', pose: "pie" }],
    textos: (T6, R, X) => {
      T6.cifra(T_RESULT, T_SOLO - 0.2, '15<span class="unidad">%</span>', [X(1) + 92, 104], true);
      T6.cifra(T_SOLO, T_UNO, '8<span class="unidad">%</span>', [X(1) + 16, 216], true);
      T6.cifra(T_UNO + 0.05, R.SAL(1) - 0.5, '1<span class="unidad">%</span>', [X(1) + 16, 216], true);
      T6.cifra(T_25, R.SAL(5) - 0.5, '−25<span class="unidad">%</span>', [X(5) + 22, 156], true);
    },
    claves: [[T_NINGUNA, "el tendero en la puerta"], [T_RESULT, "la calle de arriba entra"], [T_SOLO - 0.4, "la calle del cartel se da la vuelta"], [T_ENLACES, "la puertecita del resumen"],
      [T_BAJADO, "la tubería que adelgaza"], [T_CUENTA - 0.6, "el candado"], [T_IA9 - 0.4, "el robot leyendo"], [T_CAIDO, "las mesas vacías"], [T_ESAS2, "las tiendas apagándose"], [T_CERRANDO, "la puerta cerrada"]],
    sonidos: [[T_ARRIBA, "aparicion"], [T_NINGUNA, "seleccion"], [T_RESULT, "tick"], [T_SOLO, "tick"], [T_UNO, "tick"], [T_BAJADO, "error"], [T_CUENTA, "seleccion"],
      [T_IA9, "aparicion"], [T_25, "error"], [T_MENOS, "tick"], [T_CERRANDO, "tick"]],
    clavesDialogo: { fr01: "ninguna", fr02: "notado", fr03: "900", fr04: "mitad", fr05: "1", fr06: "Reddit", fr07: "IA", fr08: "cuenta", fr09: "aprende", fr10: "25", fr11: "menos", fr12: "siguiente" } });
})();
