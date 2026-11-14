// ia-pasa-factura · short B «Lo que cuesta tu pregunta» (9:16, estilo v6). Guion propio (guion.md, Short B).
// 10 estaciones: la habitación y el viaje de la pregunta, el centro de datos (zoom núcleo en las cinco gotas) | las
// cuentas: el edificio de Alphabet, la caja, en negativo, la deuda, la obra, el matiz, la balanza | cierre. Arte a 4 px,
// lienzo 270×480; lo importante, fuera del 12 % de arriba, del 20 % de abajo y de la franja derecha (x > 237, y 216-408).
(() => {
  const T = window.TIMING, TT = tiempos6(T), P = TT.P, fin = TT.fin;
  const prog = prog6, salto = salto6, SU = 292;
  const T_ENTRADA = P("fr02", "preguntas"), T_HORA = P("fr02", "hora"), T_SALE = P("fr03", "sale"), T_SERVIDORES = P("fr03", "servidores");
  const T_PAGA = P("fr04", "paga"), T_SEGUN = P("fr05", "Según"), T_024 = P("fr05", "0,24"), T_UNAS = P("fr05", "unas"), T_CINCO = P("fr05", "cinco");
  const T_ENTONCES = P("fr06", "Entonces"), T_ENDEUDA = P("fr06", "endeudando");
  const T_FLUJO = P("fr07", "flujo"), T_DINERO = P("fr07", "dinero"), T_QUEDA = P("fr07", "queda"), T_FUNCIONAR = P("fr07", "funcionar"), T_INVIERTE = P("fr07", "invierte");
  const T_MENOS = P("fr08", "menos");
  const T_21 = P("fr09", "21.600"), T_125 = P("fr09", "125.100"), T_SEIS = P("fr09", "seis");
  const T_CENTROS = P("fr10", "centros"), T_CHIPS = P("fr10", "chips"), T_200 = P("fr10", "200.000");
  const T_APUROS = P("fr11", "apuros"), T_26 = P("fr11", "26.170");
  const T_TU = P("fr12", "Tu"), T_CONTESTAR = P("fr12", "contestar"), T_MUNDO = P("fr12", "mundo"), T_CASI = P("fr12", "casi"), T_DEMAS = P("fr12", "demás"), T_CONSTRUIR = P("fr12", "construir");
  const T_CAJA = P("fr13", "caja"), T_DIFERENCIA = P("fr13", "diferencia");
  const OSCURO = ["#0e1018", "#141824", "#1a1e2a", "#202636", "#2a3042"];
  const habit = (svg, x0, op = {}) => habitacionG(svg, x0, SU, { m: 8, techo: 70, ancho: 254, ...op });
  const recorrido = (pts, f) => { // punto a lo largo de una polilínea, f 0..1
    let largo = 0; const segs = []; for (let i = 1; i < pts.length; i++) { const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(s); largo += s; }
    let d = f * largo; for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) { const g = segs[i] ? d / segs[i] : 0; return [Math.round(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * g), Math.round(pts[i][1] + (pts[i + 1][1] - pts[i][1]) * g)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  };
  const volar = (svg, dib, a, b, f, alto = 24) => { if (f <= 0 || f >= 1) return; dib(svg, Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f - Math.sin(f * Math.PI) * alto)); };

  // 0 · la habitación: el móvil contesta con un reloj (la farmacia, por la ventana); la pregunta sale por el cable
  function habitacion(L, x0, t) {
    const { medio, frente, brillo } = L;
    habit(medio, x0, { pared: G.SALON, ventanas: [[150, 100, 84, 70]] });
    const cx = x0 + 192, cy = 132; // la cruz de la farmacia de enfrente, por la ventana
    rect(frente, cx - 4, cy - 10, 8, 20, GC); rect(frente, cx - 10, cy - 4, 20, 8, GC); rect(frente, cx - 3, cy - 9, 6, 18, FZ.CRUZ[2]); rect(frente, cx - 9, cy - 3, 18, 6, FZ.CRUZ[2]);
    if (brillo && Math.floor(t * 1.5) % 2 === 0) rect(brillo, cx - 12, cy - 12, 24, 24, R5.verde[0]);
    lamparaG(medio, brillo, x0 + 22, SU, t);
    rect(medio, x0 + 48, SU - 44, 100, 5, GC); rect(medio, x0 + 49, SU - 43, 98, 3, P6.CARTON[3]); rect(medio, x0 + 56, SU - 39, 4, 39, GC); rect(medio, x0 + 136, SU - 39, 4, 39, GC);
    movilG(medio, brillo, x0 + 86, SU - 78, 18, 32, { on: true, dentro: (sx, sy, sw, sh) => { rect(medio, sx, sy, sw, sh, "#6f9fe8"); rect(medio, sx + 2, sy + 4, sw - 4, 2, "#f5f7fb"); rect(medio, sx + 2, sy + 9, sw - 6, 2, "#1d2f6b"); if (brillo) rect(brillo, sx - 3, sy - 3, sw + 6, sh + 6, FZ.AZUL[1]); } });
    if (t >= T_HORA - 0.3) bocadilloRelojF(frente, x0 + 110, 150 + (salto(t, T_HORA - 0.3) || 0), t);
    const pts = [[x0 + 95, SU - 46], [x0 + 95, SU - 6], [x0 + 268, SU - 6]], f = prog(t, T_SALE, T_SERVIDORES + 0.4);
    for (let i = 1; i < pts.length; i++) { linea(medio, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], GC, 5); linea(medio, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], f > 0 ? "#2c4c9c" : "#2a3246", 3); }
    if (f > 0 && f < 1) { for (let k = 3; k >= 1; k--) { const [qx, qy] = recorrido(pts, Math.max(0, f - k * 0.03)); rect(frente, qx - 2, qy - 2, 4, 4, FZ.AZUL[k > 1 ? 1 : 2]); } const [px, py] = recorrido(pts, f); chispaF(frente, brillo, px - 9, py - 9, t, 2); }
  }
  // 1 · el centro de datos (zoom núcleo): racks, calor, el contador que sube y la factura; la pila y las cinco gotas
  function datos(L, x0, t) {
    const { medio, frente, brillo } = L;
    habit(medio, x0, { pared: OSCURO });
    rackF(medio, brillo, x0 + 20, 140, 148, t, { semilla: 3 });
    placa6(medio, x0 + 14, 190, "GEMINI", { color: "#f5f7fb", fondo: "#0c1016" });
    rackF(medio, brillo, x0 + 216, 176, 112, t, { semilla: 5 });
    calorF(medio, x0 + 28, 132, t);
    const chispa = prog(t, TT.ini("fr04") - 1.2, TT.ini("fr04") - 0.2);
    if (chispa > 0 && chispa < 1) chispaF(frente, brillo, Math.round(x0 - 4 + 40 * chispa), 240, t);
    { const nv = prog(t, TT.ini("fr04") - 0.4, T_PAGA + 0.4); caja5(medio, x0 + 214, 116, 42, 38, R5.metal); rect(medio, x0 + 219, 121, 32, 12, GC); rect(medio, x0 + 220, 122, 30, 10, "#0e2a1e"); for (let k = 0; k < 3; k++) rect(medio, x0 + 222 + k * 9, 124 + (Math.floor(t * (5 - k)) % 2) * 2, 6, 4, R5.verde[2]); rect(medio, x0 + 219, 137, 32, 5, GC); rect(medio, x0 + 220, 138, Math.round(30 * nv), 3, R5.naranja[2]); rect(medio, x0 + 220, 150, 30, 3, GC); } // la impresora de la factura, fuera del zoom
    const s = prog(t, T_PAGA - 0.2, T_PAGA + 0.6);
    if (s > 0) sobreF(frente, x0 + 223, 154 + Math.round(s * 4), s >= 1 ? prog(t, T_PAGA + 0.6, T_PAGA + 1.2) : 0);
    pilaF(frente, brillo, x0 + 74, 214, t >= T_024 - 0.2 ? 0.05 + 0.08 * prog(t, T_024 - 0.2, T_024 + 0.6) : 0.05, 2);
    const n = Math.min(5, Math.max(0, Math.floor((t - T_UNAS + 0.25) / 0.25) + 1));
    vasoF(frente, x0 + 120, 236, t >= T_UNAS ? n : 0);
    for (let k = 0; k < 5; k++) { const f = prog(t, T_UNAS - 0.5 + k * 0.25, T_UNAS - 0.25 + k * 0.25); if (f > 0 && f < 1) gotaF(frente, x0 + 135, Math.round(176 + 58 * f)); }
  }
  // 2 · el edificio de Alphabet: le llega su propio sobre gigante y asoma un pagaré
  function edificio(L, x0, t) {
    const { medio, frente, brillo } = L;
    edificioVentanasG(medio, brillo, x0 + 96, 100, 130, SU, 0.55, 3 + (Math.floor(t * 1.2) % 2));
    placa6(medio, x0 + 128, 108, "ALPHABET", { color: "#f5f7fb", fondo: "#0c1016" });
    rect(medio, x0 + 146, SU - 34, 30, 34, GC); rect(medio, x0 + 148, SU - 32, 26, 32, "#1a1410");
    const f = prog(t, T_ENTONCES - 0.6, T_ENTONCES + 0.2);
    if (f > 0) { const y = Math.round(120 + (SU - 140) * f); rect(frente, x0 + 140, y, 44, 30, GC); rect(frente, x0 + 141, y + 1, 42, 28, P6.PAPEL[2]); linea(frente, x0 + 141, y + 1, x0 + 162, y + 16, P6.PAPEL[0], 1); linea(frente, x0 + 183, y + 1, x0 + 162, y + 16, P6.PAPEL[0], 1); }
    if (t >= T_ENDEUDA - 0.4) pagareF(frente, x0 + 186, SU - 26 + (salto(t, T_ENDEUDA - 0.4) || 0));
  }
  // 3 · la caja (una sola estación para B3 y B4): entra dinero arriba; salen billetes y bombillas (funcionar) a la izquierda
  //     y ladrillos y chips (invertir) a la derecha; con «le queda», el cajón se enciende y el visor marca barras; con
  //     «Alphabet» aparece la placa y empieza el negativo: salen más cosas, el cajón se vacía, el visor marca «−» y asoma el pagaré
  function caja(L, x0, t) {
    const { medio, frente, brillo } = L;
    const neg = t >= TT.ini("fr08");
    const lleno = neg ? 0.3 * (1 - prog(t, T_MENOS - 1.2, T_MENOS)) : 0.8 - 0.5 * prog(t, T_FUNCIONAR - 0.4, T_INVIERTE + 1);
    caja5(medio, x0 + 50, 222, 170, SU - 222, P6.CARTON); rect(medio, x0 + 46, 218, 178, 6, GC); rect(medio, x0 + 47, 219, 176, 3, P6.CARTON[4]);
    const visor = t >= T_MENOS ? -1 : t >= T_QUEDA && t < T_FUNCIONAR ? 1 : 0;
    const C = cajaRegistradoraF(medio, brillo, x0 + 86, 150, t, { lleno, abierto: 1, visor });
    if (neg) placa6(medio, x0 + 98, 236 + (salto(t, TT.ini("fr08")) || 0), "ALPHABET", { color: "#f5f7fb", fondo: "#0c1016" });
    if (!neg && t >= T_FLUJO && t < T_FUNCIONAR && brillo) rect(brillo, C.cajon[0] - 44, C.cajon[1] - 10, 88, 20, R5.verde[0]);
    if (t >= T_QUEDA && t < T_FUNCIONAR && Math.floor(t * 4) % 2) rect(frente, C.cajon[0] - 40, C.cajon[1] - 9, 80, 2, R5.verde[3]);
    const desde = TT.ini("fr07") + 0.8;
    for (let k = 0; k < (neg ? (t < T_MENOS - 0.3 ? 2 : 0) : 4); k++) { const f = ((t - desde) * 0.8 + k / 4) % 1; if (t >= desde) monedaG(frente, C.boca[0] - 5 + (k % 2) * 8, Math.round(84 + (C.boca[1] - 84) * f)); }
    const fuera = T_FUNCIONAR - 0.4, fuera2 = T_INVIERTE - 0.4, n = neg ? 4 : 2;
    for (let k = 0; k < n; k++) {
      const f = ((t - fuera) * 0.6 + k / n) % 1; if (t >= fuera) volar(frente, (sv, x, y) => (k % 2 ? bombillaF(sv, x, y) : billeteF(sv, x, y)), [C.salidaIzq[0] - 20, C.salidaIzq[1]], [x0 + 6, 206], f, 30);
      const g = ((t - fuera2) * 0.6 + k / n + 0.3) % 1; if (t >= fuera2) volar(frente, (sv, x, y) => (k % 2 ? cajaChips6(sv, x, y) : caja5(sv, x, y, 16, 10, ["#4a2018", "#6e3022", "#8f4430", "#b0603e"])), C.salidaDer, [x0 + 222, 206], g, 30);
    }
    if (t >= T_MENOS + 0.2) pagareF(frente, C.cajon[0] - 14, C.cajon[1] - 12 - Math.round(6 * prog(t, T_MENOS + 0.2, T_MENOS + 0.8)));
  }
  // 5 · la deuda: el montón de pagarés de hace un año y el de ahora, casi seis veces más alto; un banco al fondo
  function deuda(L, x0, t) {
    const { medio, frente, brillo } = L;
    caja5(medio, x0 + 164, 176, 64, SU - 176, R5.hormigon);
    for (let k = 0; k < 4; k++) { rect(medio, x0 + 170 + k * 15, 196, 6, SU - 200, GC); rect(medio, x0 + 171 + k * 15, 197, 4, SU - 202, R5.hormigon[4]); }
    for (let j = 0; j < 9; j++) { rect(medio, x0 + 158 + j * 4, 176 - j * 2, 76 - j * 8, 2, GC); if (j > 0 && j < 8) rect(medio, x0 + 160 + j * 4, 176 - j * 2, 72 - j * 8, 1, R5.hormigon[4]); } // frontón apoyado en la cornisa
    if (t >= P("fr09", "deuda") - 0.2) montonF(frente, x0 + 34, SU, 5);
    const n = Math.round(29 * prog(t, T_125 - 0.6, T_125 + 1.6));
    if (n > 0) montonF(frente, x0 + 96, SU, n);
    if (t >= T_SEIS - 0.3 && brillo) rect(brillo, x0 + 92, SU - 3 * n - 6, 40, 3 * n + 6, FZ.AMBAR[0]);
  }
  // 6 · la obra: grúas levantan naves de servidores que se encienden; llega un camión de chips
  function obra(L, x0, t) {
    const { medio, frente, brillo } = L;
    const e = prog(t, T_CENTROS - 0.4, T_200 + 2);
    naveF(medio, brillo, x0 + 40, SU, 90, e); naveF(medio, brillo, x0 + 146, SU, 76, Math.max(0, e * 1.4 - 0.4));
    gruaF(medio, x0 + 24, SU, t, (t * 0.25) % 1); gruaF(medio, x0 + 140, SU, t + 1.7, ((t + 1.7) * 0.25) % 1);
    const f = prog(t, T_CHIPS - 0.6, T_CHIPS + 2.2);
    if (f > 0 && f < 1) camionF(frente, brillo, Math.round(x0 - 60 + 170 * f), SU, t);
    else if (f >= 1) camionF(frente, brillo, x0 + 110, SU, 0);
  }
  // 7 · el matiz: siguen entrando monedas por la puerta de Alphabet a una bandeja verde
  function matiz(L, x0, t) {
    const { medio, frente, brillo } = L;
    edificioVentanasG(medio, brillo, x0 + 60, 132, 140, SU, 0.7, 6 + (Math.floor(t * 1.2) % 2));
    placa6(medio, x0 + 98, 140, "ALPHABET", { color: "#f5f7fb", fondo: "#0c1016" });
    rect(medio, x0 + 116, SU - 34, 30, 34, GC); rect(medio, x0 + 118, SU - 32, 26, 32, "#2a2414");
    const llen = prog(t, T_APUROS - 0.6, T_26 + 1.2);
    caja5(frente, x0 + 96, SU - 14, 70, 14, R5.verde);
    for (let k = 0; k < Math.round(llen * 10); k++) monedaG(frente, x0 + 100 + (k % 5) * 12, SU - 22 - Math.floor(k / 5) * 6);
    if (t >= T_APUROS - 0.6) for (let k = 0; k < 3; k++) { const f = ((t - T_APUROS) * 0.9 + k / 3) % 1; monedaG(frente, x0 + 126 + (k - 1) * 10, Math.round(SU - 40 + 20 * f)); }
    if (brillo && llen > 0) rect(brillo, x0 + 92, SU - 30, 78, 30, R5.verde[0]);
  }
  // 8 · el ritmo: balanza grande; con «tu pregunta» cae una gota en el vaso (el plato apenas se mueve), con «todo el
  //     mundo» llueven muchas, con «todo lo demás» entran chips en el otro plato y con «construir» baja una nave y el
  //     brazo se hunde
  function balanza(L, x0, t) {
    const { medio, frente, brillo } = L;
    const inc = -0.25 * prog(t, T_MUNDO, T_MUNDO + 1) + 0.3 * prog(t, T_DEMAS, T_DEMAS + 0.6) + 0.82 * prog(t, T_CONSTRUIR, T_CONSTRUIR + 0.8);
    const tiembla = t >= T_CASI && t < T_CASI + 1.2 ? 0.04 * Math.sin((t - T_CASI) * 18) : 0;
    const B = balanzaGrandeF(medio, brillo, x0 + 20, SU, inc + tiembla);
    const [lx, ly] = B.izq, [rx, ry] = B.der;
    const gotas = (t >= T_TU ? 1 : 0) + Math.floor(4 * prog(t, T_MUNDO, T_MUNDO + 1.2));
    vasitoF(frente, lx - 8, ly - 20, gotas);
    if (t >= T_CASI && t < T_CASI + 1.2 && brillo) rect(brillo, lx - 10, ly - 22, 20, 24, FZ.AZUL[1]);
    if (t >= T_TU - 0.6 && t < T_TU) gotaF(frente, lx - 3, Math.round(ly - 70 + 50 * prog(t, T_TU - 0.6, T_TU)));
    if (t >= T_MUNDO && t < T_MUNDO + 1.4) for (let k = 0; k < 6; k++) { const f = ((t - T_MUNDO) * 1.6 + k / 6) % 1; gotaF(frente, lx - 8 + k * 3, Math.round(ly - 80 + 60 * f)); }
    const chips = Math.floor(3 * prog(t, T_DEMAS, T_DEMAS + 0.9));
    for (let k = 0; k < chips; k++) cajaChips6(frente, rx - 22 + k * 15, ry - 12);
    if (t >= T_CONSTRUIR - 0.8) {
      const f = prog(t, T_CONSTRUIR - 0.8, T_CONSTRUIR);
      naveF(frente, brillo, rx - 24, Math.round(ry - 12 - 60 * (1 - f)), 48, f >= 1 ? 1 : 0.3);
    }
  }
  // 9 · cierre: la caja vacía y el pagaré que tapa el hueco
  function cierre(L, x0, t) {
    const { medio, frente, brillo } = L;
    caja5(medio, x0 + 84, 242, 170, SU - 242, P6.CARTON); rect(medio, x0 + 80, 238, 178, 6, GC); rect(medio, x0 + 81, 239, 176, 3, P6.CARTON[4]);
    const C = cajaRegistradoraF(medio, brillo, x0 + 120, 170, t, { lleno: 0, abierto: 1, visor: -1 });
    const f = prog(t, T_CAJA - 0.6, T_DIFERENCIA + 0.4);
    if (f < 1) volar(frente, pagareF, [x0 + 230, 110], [C.cajon[0] - 10, C.cajon[1] - 8], f, 30);
    else { pagareF(frente, C.cajon[0] - 10, C.cajon[1] - 8); if (brillo) rect(brillo, C.cajon[0] - 14, C.cajon[1] - 12, 28, 22, FZ.AMBAR[0]); }
  }

  montarShort({ TT, entrada: T_ENTRADA, titulo: ['IA · <span class="clave">la factura</span>', 'Lo que cuesta<br>tu <span class="clave">pregunta</span>'],
    estaciones: [{ dib: habitacion, hasta: "fr03" }, { dib: datos, hasta: "fr05" }, { dib: edificio, hasta: "fr06" }, { dib: caja, hasta: "fr08" }, { dib: deuda, hasta: "fr09" }, { dib: obra, hasta: "fr10" },
      { dib: matiz, hasta: "fr11" }, { dib: balanza, hasta: "fr12" }, { dib: cierre, hasta: "fr13" }],
    zooms: [{ est: 1, desde: T_SEGUN, cx: 100, cy: 230 }],
    temas: [{ desde: 0, hasta: 1, html: 'La <span class="clave">factura</span>' }, { desde: 2, hasta: 7, html: 'Las <span class="clave">cuentas</span>', pose: "senalar" },
      { desde: 8, hasta: 8, html: 'En <span class="clave">resumen</span>', pose: "pie" }],
    textos: (T6, R, X) => {
      T6.cifra(T_024, R.SAL(1) - 0.5, '0,24<span class="unidad">Wh</span>', [X(1) + 70, 150], true);
      T6.cifra(T_MENOS, R.SAL(3), '−9.070<span class="unidad">millones $</span>', [X(3) + 30, 90], true);
      T6.cifra(T_125, R.SAL(4), '125.100<span class="unidad">millones $</span>', [X(4) + 20, 110], true);
      T6.cifra(T_200, R.SAL(5), '+200.000<span class="unidad">millones $</span>', [X(5) + 20, 104], true);
      T6.cifra(T_26, R.SAL(6), '26.170<span class="unidad">millones $</span>', [X(6) + 30, 92], true);
    },
    claves: [[T_SALE, "la pregunta sale por el cable"], [T_PAGA - 0.2, "la factura impresa"], [T_024 - 0.2, "la pila"], [T_ENTONCES - 0.6, "el sobre gigante"],
      [T_QUEDA, "el cajón con lo que queda"], [T_MENOS - 1.2, "el cajón vacío"], [T_125 - 0.6, "el montón alto"], [T_CENTROS - 0.4, "las naves encendiéndose"],
      [T_APUROS - 0.6, "la bandeja llenándose"], [T_TU, "la gota en el vaso"], [T_CONSTRUIR - 0.8, "la nave hunde la balanza"], [T_CAJA - 0.6, "el pagaré en la caja"]],
    sonidos: [[T_HORA, "aparicion"], [T_SALE, "destello"], [T_PAGA, "tick"], [T_024, "seleccion"], [T_UNAS, "tick"], [T_ENTONCES, "error"], [T_QUEDA, "seleccion"],
      [T_MENOS, "error"], [T_125, "tick"], [T_CHIPS, "aparicion"], [T_26, "seleccion"], [T_TU, "tick"], [T_DEMAS, "aparicion"], [T_CONSTRUIR, "error"], [T_DIFERENCIA, "seleccion"]],
    clavesDialogo: { fr01: "IA", fr02: "farmacia", fr03: "servidores", fr04: "factura", fr05: "agua", fr06: "endeudando", fr07: "libre", fr08: "9.070", fr09: "125.100",
      fr10: "200.000", fr11: "26.170", fr12: "ritmo", fr13: "deuda" } });
})();
