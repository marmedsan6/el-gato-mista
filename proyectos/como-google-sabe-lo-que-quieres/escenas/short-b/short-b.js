// como-google-sabe-lo-que-quieres · short B «Tu visita se subasta mientras carga la página» (9:16, estilo v6).
// 7 estaciones: la subasta, la ficha con tus datos | la lista de la tienda, gana la tienda, el plazo, cientos de empresas |
// cierre. Arte a 4 px, lienzo 270×480; lo importante, fuera de las zonas tapadas del short.
(() => {
  const T = window.TIMING, TT = tiempos6(T), P = TT.P, fin = TT.fin;
  const prog = prog6, salto = salto6, SU = 292;
  const T_ENTRADA = P("fr01", "termine"), T_PUJADO = P("fr01", "pujado");
  const T_CARGA = P("fr02", "carga"), T_HUECO = P("fr02", "hueco"), T_PUJAN = P("fr02", "pujan");
  const T_FICHA = P("fr03", "ficha"), T_DATOS = ["ip", "cookies", "dispositivo", "ubicacion", "idioma", "grupos"].map((w) => P("fr03", w));
  const T_ROBOT4 = P("fr04", "robot"), T_ETIQUETA = P("fr04", "etiqueta"), T_SEGUNDOS = P("fr04", "segundos"), T_LISTA = P("fr04", "lista");
  const T_TREINTA = P("fr05", "treinta"), T_540 = P("fr05", "540");
  const T_PUJAR = P("fr06", "pujar"), T_GANA = P("fr06", "gana"), T_ROBOT = P("fr06", "robot");
  const T_TARDA = P("fr07", "tarda"), T_80 = P("fr07", "80"), T_RESP = P("fr07", "responder");
  const T_REGULADOR = P("fr08", "regulador"), T_VISITA = P("fr08", "visita"), T_CIENTOS = P("fr08", "cientos");

  // la casa de subastas, compuesta en vertical: el atril con la web arriba a la izquierda, la grada a la derecha
  function casaSubastas(L, x0, t, { carga, hueco, robot, pujan, tienda, gana }) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e", "#8a4a38"], m: 8, techo: 70, ventanas: [] });
    barraCargaG(medio, x0 + 16, 80, 238, carga);
    caja5(medio, x0 + 24, 190, 104, 102, P6.CARTON);
    const V = ventanaG(medio, brillo, x0 + 16, 96, 120, 90);
    for (let k = 0; k < 7; k++) rect(medio, V.ix + 6, V.iy + 6 + k * 9, V.iw - 12 - (k * 13) % 30, 2, "#3a4560");
    const hy = V.iy + 32;
    if (hueco) { rect(medio, V.ix + 8, hy - 1, V.iw - 16, 26, GC); rect(medio, V.ix + 9, hy, V.iw - 18, 24, robot ? "#26304a" : "#141a26"); if (!robot && Math.floor(t * 3) % 2) rect(medio, V.ix + 9, hy, V.iw - 18, 1, R5.naranja[2]); }
    if (robot) robotG(frente, brillo, V.ix + V.iw / 2 - 15, hy + 9, t);
    mazoG(frente, x0 + 132, 176, gana);
    caja5(medio, x0 + 146, 140, 84, 8, P6.CARTON); caja5(medio, x0 + 146, 196, 84, 8, P6.CARTON);
    [[148, 108, R5.ia], [176, 108, R5.verde], [204, 108, P6.ORO.concat(["#fff1c4"])], [148, 164, R5.labLuz], [176, 164, null], [204, 164, ["#5a1e4a", "#8a2e6a", "#c04a90", "#e070b0"]]].forEach(([x, y, c], k) => {
      const esTienda = c === null;
      pujadorG(medio, x0 + x, y, t, { sube: esTienda ? tienda : pujan * (gana > 0 ? 0.2 : 1), color: c || R5.naranja, robot: esTienda });
    });
    return V;
  }
  // 0 · se subasta: la página carga, el hueco del anuncio se pone a la venta y suben las paletas
  function subasta(L, x0, t) {
    casaSubastas(L, x0, t, { carga: prog(t, T_CARGA - 0.4, 20), hueco: t >= T_HUECO, robot: false, pujan: prog(t, T_PUJAN, T_PUJAN + 0.4), tienda: 0, gana: 0 });
    if (t >= T_PUJADO) destello5(L.frente, L.brillo, x0 + 190, 120, t, T_PUJADO, P6.ORO.concat(["#fff1c4", "#ffffff"]));
  }
  // 1 · la ficha con tus datos, en grande: seis dibujos que se encienden al nombrarlos
  function ficha(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e", "#8a4a38"], m: 8, techo: 70, ventanas: [] });
    const fx = x0 + 18, fy = 92 + (salto(t, T_FICHA) || 0);
    caja5(medio, fx, fy, 210, 150, G.PAPEL); rect(medio, fx + 6, fy + 6, 198, 6, "#4a5774");
    const celda = (k) => [fx + 8 + (k % 2) * 102, fy + 18 + Math.floor(k / 2) * 42];
    const on = (k) => t >= T_DATOS[k];
    T_DATOS.forEach((_, k) => { const [cx, cy] = celda(k); caja5(medio, cx, cy, 94, 38, on(k) ? ["#141c2c", "#1a2438", "#22304a", "#2c3c5c"] : ["#0a0d14", "#10141e", "#161b28", "#1c2232"]); if (on(k)) destello5(frente, brillo, cx + 47, cy + 19, t, T_DATOS[k], R5.ia); });
    // IP: placa de dirección de una casa
    { const [cx, cy] = celda(0); rect(medio, cx + 30, cy + 8, 34, 22, GC); rect(medio, cx + 31, cy + 9, 32, 20, on(0) ? R5.ia[1] : "#1a2236"); placa6(medio, cx + 38, cy + 13, "IP", { color: on(0) ? "#f5f7fb" : "#33405a", fondo: on(0) ? R5.ia[0] : "#141a26" }); }
    { const [cx, cy] = celda(1); galletaG(medio, cx + 33, cy + 10); galletaG(medio, cx + 49, cy + 14); }
    { const [cx, cy] = celda(2); movilG(medio, on(2) ? brillo : null, cx + 38, cy + 3, 18, 32, { on: on(2) }); }
    { const [cx, cy] = celda(3); disco(medio, cx + 47, cy + 14, 9, GC); disco(medio, cx + 47, cy + 14, 8, on(3) ? R5.naranja[2] : "#3a2416"); disco(medio, cx + 45, cy + 12, 3, on(3) ? R5.naranja[3] : "#4a2e1c"); rect(medio, cx + 46, cy + 22, 3, 12, GC); }
    { const [cx, cy] = celda(4); elipse5(medio, cx + 47, cy + 17, 24, 12, GC); elipse5(medio, cx + 47, cy + 17, 23, 11, on(4) ? "#f5f7fb" : "#8a8f9c"); rect(medio, cx + 30, cy + 26, 5, 6, GC); rect(medio, cx + 31, cy + 26, 3, 4, on(4) ? "#f5f7fb" : "#8a8f9c");
      placa6(medio, cx + 33, cy + 11, "ABC", { color: "#0c1016", fondo: null }); }
    { const [cx, cy] = celda(5); for (let k = 0; k < 3; k++) pujadorG(medio, cx + 18 + k * 22, cy + 8, t, { sube: 0, color: on(5) ? [R5.verde, R5.ia, P6.ORO.concat(["#fff1c4"])][k] : R5.metal }); }
  }
  // 2 · la lista: la pegatina de la tienda clava tu ficha en el tablón en segundos; treinta días… o 540
  function lista(L, x0, t) {
    const { medio, frente, brillo } = L;
    const Tn = tiendaG(medio, brillo, x0 + 10, SU, t, { pegatina: true, avisa: t >= T_ETIQUETA && t < T_SEGUNDOS + 0.4 });
    const Tb = tablonG(medio, brillo, x0 + 150, 84, t >= T_SEGUNDOS ? 8 : 7, prog(t, T_SEGUNDOS, T_SEGUNDOS + 0.5));
    const f = prog(t, T_ETIQUETA + 0.2, T_SEGUNDOS + 0.4), h = Tb.hueco(7);
    if (f > 0 && f < 1) { const [px, py] = Tn.pegatina; fichaG(frente, Math.round(px + (h[0] - px) * f), Math.round(py + (h[1] - py) * f - Math.sin(f * Math.PI) * 24)); }
    if (t >= T_LISTA) rect(brillo, h[0] - 4, h[1] - 4, 24, 21, R5.naranja[0]);
    if (t >= T_TREINTA - 0.3) {
      const rapido = t >= T_540 && t < T_540 + 1.4, pasa = rapido ? ((t - T_540) % 0.14) / 0.14 : t < T_540 ? ((t - T_TREINTA) % 0.6) / 0.6 : 0;
      calendarioG(frente, x0 + 110, 126 + (t >= T_540 ? salto(t, T_540) || 0 : 0), pasa);
    }
  }
  // 3 · gana la tienda: su paleta sube, cae el mazo y el robot ocupa el hueco
  function gana(L, x0, t) {
    casaSubastas(L, x0, t, { carga: prog(t, T_PUJAR - 1, T_ROBOT), hueco: true, robot: t >= T_ROBOT, pujan: 1, tienda: prog(t, T_PUJAR, T_PUJAR + 0.3), gana: t < T_GANA ? 0 : prog(t, T_GANA, T_GANA + 0.15) });
    if (t >= T_GANA) destello5(L.frente, L.brillo, x0 + 190, 150, t, T_GANA, P6.ORO.concat(["#fff1c4", "#ffffff"]));
  }
  // 4 · el plazo: el cronómetro y la barra de carga
  function plazo(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e", "#8a4a38"], m: 8, techo: 70, ventanas: [] });
    const v = prog(t, T_TARDA, T_RESP + 0.6);
    cronometroG(medio, brillo, x0 + 26, 150, v * 0.9);
    const V = ventanaG(medio, brillo, x0 + 80, 120, 160, 96);
    barraCargaG(medio, V.ix + 8, V.iy + 8, V.iw - 16, v);
    for (let k = 0; k < 5; k++) rect(medio, V.ix + 10, V.iy + 26 + k * 10, V.iw - 30 - (k * 17) % 40, 2, v >= 1 ? "#3a4560" : "#1a2236");
  }
  // 5 · cientos de empresas: la ficha se copia a las ventanas de la ciudad; el sello del regulador
  function cientos(L, x0, t) {
    const { medio, frente, brillo } = L;
    const enc = prog(t, T_VISITA, T_CIENTOS + 0.8) * 0.85;
    [[96, 120, 48, 3], [148, 100, 44, 5], [196, 130, 48, 7]].forEach(([x, y, w, s]) => edificioVentanasG(medio, brillo, x0 + x, y, w, SU, enc, s));
    fichaPujaG(medio, brillo, x0 + 8, 220, 6);
    if (t >= T_VISITA) for (let k = 0; k < 6; k++) { const f = (t * 0.6 + k / 6) % 1, tx = x0 + 110 + k * 22, ty = 140 + (k * 23) % 60; fichaG(frente, Math.round(x0 + 50 + (tx - x0 - 50) * f), Math.round(226 + (ty - 226) * f - Math.sin(f * Math.PI) * 30)); }
    if (t >= T_REGULADOR) selloG(frente, x0 + 24, 110 + (salto(t, T_REGULADOR) || 0), "ICO");
  }
  // 6 · cierre: la web ya cargada con el robot en su hueco
  function cierre(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e", "#8a4a38"], m: 8, techo: 70, ventanas: [] });
    tabletaNoticiasG(medio, brillo, x0 + 70, 100, 180, 120, t, { hueco: { visible: true, robot: true, y: 150, h: 32 } });
    cursorG(frente, Math.round(x0 + 150 + Math.sin(t * 1.3) * 40), Math.round(176 + Math.cos(t * 0.9) * 22));
  }

  montarShort({ TT, entrada: T_ENTRADA, titulo: ['Algoritmos · <span class="clave">Google</span>', 'Tu visita<br>se <span class="clave">subasta</span>'],
    estaciones: [{ dib: subasta, hasta: "fr02", extra: 0.4 }, { dib: ficha, hasta: "fr03" }, { dib: lista, hasta: "fr05", extra: 0.4 }, { dib: gana, hasta: "fr06", extra: 0.8 },
      { dib: plazo, hasta: "fr07" }, { dib: cientos, hasta: "fr08" }, { dib: cierre, hasta: "fr09" }],
    zooms: [],
    temas: [{ desde: 0, hasta: 1, html: 'Se <span class="clave">subasta</span>' }, { desde: 2, hasta: 3, html: 'Tu <span class="clave">lista</span>', pose: "senalar" },
      { desde: 4, hasta: 5, html: 'La <span class="clave">puja</span>', pose: "senalar" },
      { desde: 6, hasta: 6, html: 'En <span class="clave">resumen</span>', pose: "pie" }],
    textos: (T6, R) => {
      T6.cifra(T_540, R.SAL(2), '540<span class="unidad">días</span>', [24, 100]);
      T6.cifra(T_80, R.SAL(4), '80 ms a 1 s', [80, 86]);
    },
    claves: [[T_HUECO, "el hueco del anuncio a la venta"], [T_DATOS[0], "la ficha con tus datos"], [T_SEGUNDOS, "la ficha se clava en el tablón"], [T_GANA, "cae el mazo"],
      [T_80, "el cronómetro"], [T_VISITA, "la ciudad que se enciende"]],
    sonidos: [[T_HUECO, "aparicion"], [T_PUJAN, "aparicion"], ...T_DATOS.map((t) => [t, "tick"]), [T_SEGUNDOS, "tick"], [T_540, "aparicion"], [T_GANA, "acierto"], [T_80, "tick"], [T_CIENTOS, "aparicion"]],
    etiquetas: { fr06: "Google Ads · ICO" },
    clavesDialogo: { fr01: "pujado", fr02: "hueco", fr03: "ficha", fr04: "etiqueta", fr05: "540", fr06: "gana", fr07: "segundo", fr08: "cientos", fr09: "largo" } });
})();
