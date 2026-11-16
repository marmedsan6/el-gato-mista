// ia-pasa-factura · short A en estilo v7 (calibración interna, ADR 0011). Mismo guion, voz, timing, cámara, rótulos,
// cifras y claves que el publicado (../short-a/short-a.js); todo lo que tiene silueta es una pieza generada de
// window.PIEZAS. Por código solo: mover, teñir (estados, camisas), cielo y suelo, interiores (interior7), placas, la
// tubería que adelgaza, las flechas del bucle, los destellos y las marcas del portapapeles.
// Del piloto (2026-11-14) se queda la acción de la estación 0: el tendero sale, mira la calle y la tienda se apaga y cierra.
(() => {
  const PZ = window.PIEZAS;
  const T = window.TIMING, TT = tiempos6(T), P = TT.P;
  const prog = prog6, salto = salto6, SU = 292, GC = R5.contorno;
  const T_ENTRADA = P("fr01", "que"), T_ARRIBA = P("fr01", "arriba"), T_VAS = P("fr01", "vas"), T_NINGUNA = P("fr01", "ninguna");
  const T_RESULT = P("fr04", "resultado"), T_CUANDO = P("fr04", "Cuando"), T_SOLO = P("fr04", "solo");
  const T_ENLACES = P("fr05", "enlaces"), T_UNO = P("fr05", "1 %");
  const T_TRAFICO = P("fr07", "tráfico"), T_BAJADO = P("fr07", "bajado"), T_NOTABLE = P("fr07", "notable"), T_DIJO = P("fr07", "dijo"), T_TRIMESTRE = P("fr07", "trimestre"), T_ACHACA = P("fr07", "achaca");
  const T_CUENTA = P("fr08", "cuenta"), T_EMPEZARA = P("fr08", "Empezará");
  const T_IA9 = P("fr09", "IA"), T_GENTE = P("fr09", "pregunta");
  const T_SEIS = P("fr10", "seis"), T_CHATGPT = P("fr10", "ChatGPT"), T_CAIDO = P("fr10", "caído"), T_25 = P("fr10", "25");
  const T_CONTESTA = P("fr11", "contesta"), T_APRENDIO = P("fr11", "aprendió"), T_ESAS2 = P("fr11", "y"), T_MENOS = P("fr11", "menos");
  const T_CERRANDO = P("fr12", "cerrando"), T_DONDE = P("fr12", "dónde");
  const C = CAMISAS7, LUZ = "#3a2c1c";
  const camina = (svg, x, su, t, op = {}) => andar7(svg, { quieto: PZ.quieto, paso: PZ.paso }, x, su, t, op);
  // pieza flotante por su esquina de arriba a la izquierda
  const arriba = (svg, s, x, y, op = {}) => sprite7(svg, s, x, y + s.h, { izq: true, ...op });
  // la tienda: luz encendida o apagada por estado, brillo sobre el escaparate y la hoja de la puerta (rejilla) al cerrar
  function tienda(L, x, su, { luz = 1, cierre = 0 } = {}) {
    const Tn = sprite7(L.medio, PZ.tienda, x, su, { izq: true, estado: luz ? null : "apagada" });
    const e = punto7(Tn, "escaparate"), d = punto7(Tn, "puerta");
    if (luz && L.brillo) rect(L.brillo, e.x - 3, e.y - 3, e.w + 6, e.h + 6, LUZ);
    puerta7(L.medio, d, cierre);
    return d;
  }
  function cartel(L, s, x, y, t, s0 = null) {
    const dy = s0 === null ? 0 : salto(t, s0) || 0;
    const pos = arriba(L.frente, s, x, y + dy);
    if (L.brillo) rect(L.brillo, x - 3, y - 3 + dy, s.w + 6, s.h + 6, Math.floor(t * 2) % 2 ? "#1d2f6b" : "#16285a");
    return pos;
  }
  // persona sentada con su portátil; la luz de la pantalla parpadea por turnos (cada una con su fase): siempre hay algo vivo
  function sentada(L, x, su, t, k, { camisa = null, vacia = false } = {}) {
    const s = vacia ? PZ["mesa-vacia"] : PZ.sentada;
    const pos = sprite7(L.medio, s, x, su, { izq: true, cambios: camisa ? camisa7(camisa) : null });
    if (!vacia && L.brillo && Math.floor(t * 4 + k * 1.7) % 3 !== 0) rect(L.brillo, pos.x0 + s.w - 12, pos.y0 + 2, 12, 10, "#16285a");
    return pos;
  }
  // flecha con el tratamiento de la tubería: contorno, cuerpo de dos tonos de azul y la luz arriba a la izquierda
  function flecha(svg, x0, y0, x1, y1, color = "#4f7ee8") {
    const sombra = color === "#4f7ee8" ? "#2c4c9c" : "#3a4166", luz = color === "#4f7ee8" ? "#9fc4ff" : "#8a93c0";
    const a = Math.atan2(y1 - y0, x1 - x0), p = (d, s) => [Math.round(x1 - Math.cos(a + s) * d), Math.round(y1 - Math.sin(a + s) * d)];
    const [ax, ay] = p(10, 0.6), [bx, by] = p(10, -0.6);
    for (const [w, c] of [[7, GC], [4, sombra], [2, color]]) { linea(svg, x0, y0, x1, y1, c, w); linea(svg, x1, y1, ax, ay, c, w - 1); linea(svg, x1, y1, bx, by, c, w - 1); }
    linea(svg, x0 - 1, y0 - 1, x1 - 1, y1 - 1, luz, 1);
  }

  // 0 · la respuesta de arriba: el buscador con su cartel azul; el paseante va hacia la tienda y, al leer el cartel, se
  //     da la vuelta; el tendero se asoma a la puerta, mira la calle vacía y la tienda se apaga y cierra tras él
  function respuesta(L, x0, t) {
    const { medio, frente } = L;
    const B = arriba(medio, PZ.buscador, x0 + 10, 112);
    placa6(medio, B.x0 + PZ.buscador.w - 54, B.y0 - 15, "GOOGLE", { color: "#f5f7fb", fondo: "#0c1016" });
    const barra = punto7(B, "barra"), escrito = prog(t, T_ENTRADA - 0.4, T_ENTRADA + 0.4);
    for (let k = 0; k < Math.round(escrito * 10); k++) rect(medio, barra.x + 10 + k * 5, barra.y + 2, 3, 3, "#43506a");
    if (t >= T_ARRIBA - 0.2) { const r = punto7(B, "resultados"); cartel(L, PZ["cartel-resumen"], r.cx - 35, r.y - 2, t, T_ARRIBA - 0.2); }
    const apaga = T_NINGUNA + 1.3;
    const d = tienda(L, x0 + 146, SU, { luz: t < apaga ? 1 : 0, cierre: prog(t, apaga, apaga + 0.4) });
    const ida = prog(t, T_ENTRADA, T_VAS), vuelta = prog(t, T_VAS, T_VAS + 2.4);
    const px = Math.round(x0 + 30 + 84 * ida - 120 * vuelta);
    if (px > x0 - 14) camina(frente, px, SU, t, { camisa: C[1], dir: t < T_VAS ? 1 : -1, anda: ida < 1 || vuelta > 0 });
    if (t >= T_NINGUNA) { // el tendero sale a la puerta, mira a la calle vacía y se queda fuera
      const s = salto(t, T_NINGUNA) || 0;
      sprite7(frente, PZ.tendero, d.x - 8, SU + s, { dir: -1 });
      if (t >= T_NINGUNA + 0.6) sprite7(frente, PZ.pregunta, d.x - 14, SU - 32 + (salto(t, T_NINGUNA + 0.6) || 0));
    }
  }
  // 1 · las dos calles (zoom núcleo): arriba sin cartel, todos entran; abajo con el cartel, la mitad se da la vuelta.
  //     Con «enlaces», el cartel enseña sus botones y solo uno se enciende.
  const ARR = 186, ABA = 276; // suelos de las dos calles
  function calles(L, x0, t) {
    const { medio, frente, brillo } = L;
    [ARR, ABA].forEach((su) => { rect(medio, x0 + 10, su, 210, 4, GC); rect(medio, x0 + 11, su, 208, 2, R5.hormigon[3]); });
    const A = tienda(L, x0 + 118, ARR), B = tienda(L, x0 + 118, ABA);
    const conEnlaces = t >= T_ENLACES - 0.3;
    const K = cartel(L, PZ[conEnlaces ? "cartel-enlaces" : "cartel-resumen"], x0 + 64, ABA - 78, t); // delante de la tienda
    if (t >= T_ENLACES && (t - T_ENLACES) % 1.6 < 0.9) {
      const e = punto7(K, "enlace");
      rect(frente, e.x, e.y, e.w, e.h, P6.ORO[2]); if (brillo) rect(brillo, e.x - 3, e.y - 3, e.w + 6, e.h + 6, LUZ);
    }
    // el observador con su portapapeles: cada marca, una raya en el papel y un destello
    const ob = sprite7(medio, PZ.observador, x0 + 28, ARR, { izq: true }), papel = punto7(ob, "papel");
    const marcas = Math.floor(prog(t, TT.ini("fr03"), T_RESULT + 4) * 6);
    for (let k = 0; k < Math.min(marcas, 6); k++) rect(frente, papel.x + 1 + (k % 2) * 3, papel.y + 1 + Math.floor(k / 2) * 2, 2, 1, GC);
    const tm = TT.ini("fr03") + (marcas / 6) * (T_RESULT + 4 - TT.ini("fr03"));
    if (marcas > 0 && marcas < 6 && t - tm < 0.25 && brillo) rect(brillo, papel.x - 3, papel.y - 3, papel.w + 6, papel.h + 6, LUZ);
    placa6(medio, x0 + 24, ARR - PZ.observador.h - 18, "PEW", { color: "#f5f7fb", fondo: "#0c1016" });
    // paseantes: arriba van todos a la puerta; abajo, uno de cada dos se da la vuelta bajo el cartel
    const xa = x0 + 54;
    for (let k = 0; k < 4; k++) {
      const f = (t * 0.2 + k / 4) % 1;
      if (f < 0.96) camina(frente, Math.round(xa + (A.cx - xa) * f), ARR, t, { camisa: C[k % 5], fase: k * 0.1 });
      const g = (t * 0.2 + k / 4 + 0.12) % 1, vuelve = k % 2 === 0;
      if (!vuelve) { if (g < 0.96) camina(frente, Math.round(xa + (B.cx - xa) * g), ABA, t, { camisa: C[(k + 2) % 5], fase: k * 0.13 }); }
      else { const ida = Math.min(g, 0.4), atras = Math.max(0, g - 0.4); const xx = Math.round(xa + (B.cx - xa) * ida - 140 * atras); if (xx > x0 + 14) camina(frente, xx, ABA, t, { camisa: C[(k + 2) % 5], dir: g < 0.4 ? 1 : -1, fase: k * 0.13 }); }
    }
  }
  // 2 · el grifo: la tubería del buscador al foro adelgaza; el foro se apaga ventana a ventana y su director habla
  function grifo(L, x0, t) {
    const { medio, frente, brillo } = L;
    const paso = [T_TRAFICO, T_BAJADO, T_NOTABLE, T_TRIMESTRE].filter((a) => t >= a).length;
    const B = arriba(medio, PZ.buscador, x0 + 8, 100);
    placa6(medio, B.x0 + PZ.buscador.w - 54, B.y0 - 15, "GOOGLE", { color: "#f5f7fb", fondo: "#0c1016" });
    if (t >= T_ACHACA - 0.4) { const r = punto7(B, "resultados"); cartel(L, PZ["cartel-resumen"], r.cx - 35, r.y - 2, t, T_ACHACA - 0.4); }
    const F = sprite7(medio, PZ.foro, x0 + 160, SU, { izq: true });
    const LUCES_FORO = ["#f0a83a", "#ffd486", "#b0701c"];
    apagarLuces7(medio, F, [0.95, 0.75, 0.55, 0.4, 0.25][paso], { colores: LUCES_FORO });
    placa6(medio, F.x0 + Math.round(PZ.foro.w / 2) - 26, F.y0 - 18, "REDDIT", { color: "#f5f7fb", fondo: "#0c1016" });
    // la tubería del buscador al foro: de 8 a 2 píxeles, con contorno y tres tonos; los paquetes, cada vez más separados
    const g = [8, 6, 4, 3, 2][paso], esquina = F.x0 - 2, pts = [[x0 + 48, B.y0 + PZ.buscador.h], [x0 + 48, 262], [esquina, 262]];
    tuberia(medio, pts, g);
    const n = [6, 5, 3, 2, 1][paso], tramo = (f) => (f < 0.45 ? [pts[0][0], Math.round(pts[0][1] + (pts[1][1] - pts[0][1]) * f / 0.45)] : [Math.round(pts[1][0] + (pts[2][0] - pts[1][0]) * (f - 0.45) / 0.55), pts[1][1]]);
    const lado = Math.max(3, g);
    for (let k = 0; k < n; k++) { const f = (t * 0.3 + k / n) % 1, [px, py] = tramo(f); rect(frente, px - (lado >> 1) - 1, py - (lado >> 1) - 1, lado + 2, lado + 2, GC); const pq = k % 2 ? ["#c2862e", "#f2c14e"] : ["#3a5fc0", "#5b8cff"]; rect(frente, px - (lado >> 1), py - (lado >> 1), lado, lado, pq[1]); rect(frente, px - (lado >> 1), py - (lado >> 1), lado, 1, pq[0]); }
    // cada vez menos gente llega a la esquina del foro
    for (let k = 0; k < Math.max(1, n >> 1); k++) { const f = (t * 0.5 + k / Math.max(1, n >> 1)) % 1; if (f < 0.85) camina(frente, Math.round(esquina - 44 + 40 * f), SU, t, { camisa: C[(k + 1) % 5] }); }
    if (paso >= 2) sprite7(frente, PZ.pregunta, esquina - 56, SU - 32 + (salto(t, T_NOTABLE) || 0));
    // el director habla: una ventana alta del foro se enciende dorada y de ella sale el «!»
    if (t >= T_DIJO - 0.3) {
      const v = luces7(PZ.foro, LUCES_FORO).filter((c) => c.y < PZ.foro.h * 0.3).sort((a, b) => b.x - a.x || a.y - b.y)[0];
      if (v) {
        const vx = F.x0 + v.x, vy = F.y0 + v.y;
        rect(frente, vx, vy, v.w, v.h, Math.floor(t * 4) % 2 ? "#ffd486" : "#f2c14e");
        if (brillo) rect(brillo, vx - 4, vy - 4, v.w + 8, v.h + 8, LUZ);
        if (t < T_DIJO + 2.2) arriba(frente, PZ["bocadillo-exclamacion"], vx + v.w - 2, vy - 16 + (salto(t, T_DIJO - 0.3) || 0));
      }
    }
  }
  // tubería de tramos rectos (verticales u horizontales): contorno, cuerpo de metal, luz arriba/izquierda y sombra
  function tuberia(svg, pts, g) {
    const M = R5.metal;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], h = a => a >> 1;
      if (ax === bx) {
        const y0 = Math.min(ay, by), alto = Math.abs(by - ay) + h(g) + 1;
        rect(svg, ax - h(g) - 1, y0, g + 2, alto, GC); rect(svg, ax - h(g), y0, g, alto - 1, M[1]);
        rect(svg, ax - h(g), y0, 1, alto - 1, M[3]); if (g > 2) rect(svg, ax - h(g) + g - 1, y0, 1, alto - 1, M[0]);
      } else {
        const x0 = Math.min(ax, bx) - h(g), ancho = Math.abs(bx - ax) + h(g);
        rect(svg, x0 - 1, ay - h(g) - 1, ancho + 2, g + 2, GC); rect(svg, x0, ay - h(g), ancho, g, M[1]);
        rect(svg, x0, ay - h(g), ancho, 1, M[3]); if (g > 2) rect(svg, x0, ay - h(g) + g - 1, ancho, 1, M[0]);
      }
    }
  }
  // 3 · la cuenta: el portal con su candado, que se cierra; el teclado parpadea y entra el globo
  function cuenta(L, x0, t) {
    const { medio, frente, brillo } = L;
    const Po = sprite7(medio, PZ.portal, x0 + 30, SU, { izq: true }), d = punto7(Po, "puerta");
    const cerrado = t >= T_CUENTA - 0.3, cand = PZ[cerrado ? "candado-cerrado" : "candado-abierto"];
    sprite7(frente, cand, d.cx, d.y + 52 + (cerrado ? salto(t, T_CUENTA - 0.3) || 0 : 0));
    const Te = arriba(medio, PZ.teclado, x0 + 146, 178);
    const botones = luces7(PZ.teclado, ["#b8ad96", "#efe6d2"]);
    if (t >= T_CUENTA && botones.length) { const b = botones[Math.floor(t * 3) % botones.length]; rect(medio, Te.x0 + b.x, Te.y0 + b.y, b.w, b.h, "#ffd486"); }
    if (t >= T_EMPEZARA) {
      const s = salto(t, T_EMPEZARA) || 0, G = arriba(medio, PZ.globo, x0 + 196, 120 + s);
      if (brillo) rect(brillo, G.x0 - 3, G.y0 - 3, PZ.globo.w + 6, PZ.globo.h + 6, "#16285a");
    }
    const f = prog(t, T_CUENTA - 1.6, T_CUENTA + 0.4);
    camina(frente, Math.round(x0 + 8 + 30 * f), SU, t, { camisa: C[0], anda: f > 0 && f < 1 });
    if (t >= T_CUENTA + 0.6) sprite7(frente, PZ.pregunta, x0 + 38, SU - 32 + (salto(t, T_CUENTA + 0.6) || 0));
  }
  // 4 · el foro que enseña: la sala con su estantería, la gente preguntando y el robot que lee
  function foroEnsena(L, x0, t) {
    const { medio, frente } = L;
    interior7(medio, x0 + 8, 70, 254, SU, { pared: PARED7.calida });
    arriba(medio, PZ.estanteria, x0 + 49, 100);
    const RX = x0 + 206, cabezas = [];
    [[18, 2], [48, 0], [100, 4], [130, 1]].forEach(([dx, c], k) => { const p = sentada(L, x0 + dx, SU, t, k, { camisa: C[c] }); cabezas.push([p.x0 + 2, p.y0 - 16]); });
    sprite7(frente, PZ[t >= T_IA9 - 0.4 ? "robot-lee" : "robot"], RX, SU);
    // con «La IA aprende», cada persona pregunta o contesta (un bocadillo sobre su cabeza); con «pregunta», los
    // bocadillos vuelan al robot, que los lee
    cabezas.forEach(([cx, cy], k) => {
      const sale = T_IA9 - 0.3 + k * 0.25, vuela = T_GENTE + k * 0.15;
      if (t < sale) return;
      const f = prog(t, vuela, vuela + 0.7);
      if (f >= 1) return;
      const x = Math.round(cx + (RX - 8 - cx) * f), y = Math.round(cy + (SU - 52 - cy) * f - 18 * Math.sin(f * Math.PI)) + (salto(t, sale) || 0);
      arriba(frente, PZ[k % 2 ? "bocadillo-exclamacion" : "bocadillo-pregunta"], x, y);
    });
  }
  // 5 · Stack Overflow (zoom núcleo): las mesas se vacían; en la pantalla, el foro parecido sigue lleno
  function stack(L, x0, t) {
    const { medio, frente } = L;
    interior7(medio, x0 + 8, 70, 254, SU, { pared: PARED7.fria });
    placa6(medio, x0 + 22, 134, "STACK OVERFLOW", { color: "#f5f7fb", fondo: "#0c1016" });
    arriba(medio, PZ["ventana-foro"], x0 + 150, 168);
    const meses = Math.floor(prog(t, T_SEIS, T_CHATGPT + 0.4) * 6);
    const Ca = arriba(medio, PZ.calendario, x0 + 166, 102 + (meses > 0 ? salto(t, T_SEIS + (meses / 6) * (T_CHATGPT + 0.4 - T_SEIS)) || 0 : 0));
    for (let k = 0; k < meses; k++) rect(medio, Ca.x0 + 4 + (k % 3) * 5, Ca.y0 + 11 + Math.floor(k / 3) * 5, 3, 3, "#e0454f");
    const vacia = prog(t, T_CHATGPT, T_CAIDO + 0.4);
    [[14, 0.15], [46, 0.45], [78, 0.7], [110, 2]].forEach(([mx, umbral], k) =>
      sentada(L, x0 + mx, SU, t, k, { camisa: C[k % 5], vacia: vacia > umbral }));
    sprite7(frente, PZ["robot-lee"], x0 + 206, SU);
  }
  // 6 · el bucle: la IA aprendió de la gente, contesta con el resumen y las webs se apagan
  function bucle(L, x0, t) {
    const { medio, frente } = L;
    const luz = t < T_MENOS ? 1 : 0;
    tienda(L, x0 + 16, 172, { luz });
    arriba(medio, PZ.libros, x0 + 174, 108);
    sprite7(medio, PZ["robot-lee"], x0 + 190, 262);
    cartel(L, PZ["cartel-resumen"], x0 + 88, 222, t);
    for (let k = 0; k < 2; k++) camina(medio, x0 + 30 + k * 16, 262, t, { camisa: C[k + 2], dir: -1, anda: false });
    if (t >= T_APRENDIO - 0.8) flecha(frente, x0 + 108, 128, x0 + 166, 116);
    if (t >= T_APRENDIO - 0.3) flecha(frente, x0 + 190, 130, x0 + 194, 214);
    if (t >= T_CONTESTA) flecha(frente, x0 + 176, 248, x0 + 164, 246);
    if (t >= T_ESAS2) flecha(frente, x0 + 86, 248, x0 + 66, 252);
    if (t >= T_ESAS2 + 0.6) flecha(frente, x0 + 44, 236, x0 + 52, 186, t >= T_MENOS - 0.6 ? "#5a6390" : "#4f7ee8");
  }
  // 7 · cierre: la tienda cerrada y el robot llamando a su puerta; se le cae el libro
  function cierre(L, x0, t) {
    const { frente } = L;
    const d = tienda(L, x0 + 148, SU, { luz: 0, cierre: 1 });
    const llama = t >= T_CERRANDO && Math.floor(t * 3) % 2 === 0;
    sprite7(frente, PZ[llama ? "robot-llama" : "robot"], d.x - 12, SU);
    if (t >= T_DONDE - 0.6) sprite7(frente, PZ["libro-abierto"], d.x - 34, SU + (salto(t, T_DONDE - 0.6) || 0));
    if (llama) { rect(frente, d.x - 3, SU - 30, 2, 2, "#f5f7fb"); rect(frente, d.x - 1, SU - 26, 2, 2, "#f5f7fb"); }
  }

  montarShort({ TT, entrada: T_ENTRADA, titulo: ['IA · <span class="clave">la factura</span>', 'Sin<br><span class="clave">clic</span>'],
    estaciones: [{ dib: respuesta, hasta: "fr02" }, { dib: calles, hasta: "fr05", extra: 1.7 }, { dib: grifo, hasta: "fr07" }, { dib: cuenta, hasta: "fr08" },
      { dib: foroEnsena, hasta: "fr09" }, { dib: stack, hasta: "fr10" }, { dib: bucle, hasta: "fr11" }, { dib: cierre, hasta: "fr12" }],
    zooms: [{ est: 1, desde: T_CUANDO, cx: 124, cy: 210 }, { est: 5, desde: T_SEIS, cx: 112, cy: 222 }],
    temas: [{ desde: 0, hasta: 1, html: 'Sin <span class="clave">clic</span>' }, { desde: 2, hasta: 3, html: 'La <span class="clave">puerta</span>', pose: "senalar" },
      { desde: 4, hasta: 6, html: 'El <span class="clave">bucle</span>', pose: "senalar" }, { desde: 7, hasta: 7, html: '¿Y <span class="clave">ahora</span>?', pose: "pie" }],
    textos: (T6, R, X) => {
      T6.cifra(T_RESULT, T_SOLO - 0.2, '15<span class="unidad">%</span>', [X(1) + 60, 120], true);
      T6.cifra(T_SOLO, T_UNO, '8<span class="unidad">%</span>', [X(1) + 18, 214], true);
      T6.cifra(T_UNO + 0.05, R.SAL(1) - 0.5, '1<span class="unidad">%</span>', [X(1) + 18, 214], true);
      T6.cifra(T_25, R.SAL(5) - 0.5, '−25<span class="unidad">%</span>', [X(5) + 22, 156], true);
    },
    claves: [[T_NINGUNA, "el tendero en la puerta"], [T_RESULT, "la calle de arriba entra"], [T_SOLO - 0.4, "la calle del cartel se da la vuelta"], [T_ENLACES, "el botón del resumen"],
      [T_BAJADO, "la tubería que adelgaza"], [T_CUENTA - 0.6, "el candado"], [T_IA9 - 0.3, "los bocadillos sobre las cabezas"], [T_CAIDO, "las mesas vacías"], [T_ESAS2, "las tiendas apagándose"], [T_CERRANDO, "la puerta cerrada"]],
    sonidos: [[T_ARRIBA, "aparicion"], [T_NINGUNA, "seleccion"], [T_RESULT, "tick"], [T_SOLO, "tick"], [T_UNO, "tick"], [T_BAJADO, "error"], [T_CUENTA, "seleccion"],
      [T_IA9, "aparicion"], [T_25, "error"], [T_MENOS, "tick"], [T_CERRANDO, "tick"]],
    clavesDialogo: { fr01: "ninguna", fr02: "notado", fr03: "900", fr04: "mitad", fr05: "1", fr06: "Reddit", fr07: "IA", fr08: "cuenta", fr09: "aprende", fr10: "25", fr11: "menos", fr12: "siguiente" } });
})();
