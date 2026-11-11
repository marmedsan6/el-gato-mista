// nvidia-huang-espionaje · short v4, versión INTERNA en estilo v6 (2026-11-10; no se republica). Misma voz, guion,
// música y dioramas que la v3 publicada (escenas/short/, estilo v5), con las reglas del ADR 0010:
//   - casi sin texto: título, 4 rótulos (3 temas y el cierre) y 2 identificadores; los demás nombres son placas del dibujo;
//   - la fuente de cada frase va en la pestaña de la caja de diálogo (marcas [fN] del guion);
//   - la cámara sale tras el fin real de cada frase (timing corregido con motor/voz/revisar-alineacion.mjs), el rótulo
//     cambia al llegar, el zoom core es un acercamiento de 0,4 s y toda pieza clave está 2 s en pantalla.
// Arte a 4 px (1 unidad = 1 px CSS), lienzo 270×480. Mundo de 9 estaciones, de noche, con paralaje:
//   1 torre de NVIDIA · 2 frontera de los chips · 3 rotativa y la ejecutiva · 4 Megaspeed (zoom core) · 5 el objetivo (zoom core)
//   6 el correo · 7 el consejo · 8 MATIZ · 9 cierre
// MISTA: entrada de tema, cambios de tema en fr06 y fr09 (de pie 1-2 s) y cierre. Personas reales genéricas; la ejecutiva,
// siempre en silueta (Mario). Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  document.body.className = "short";
  const W = 270, H = 480, N = 9;
  const T = window.TIMING, TT = tiempos6(T), P = TT.P;
  const lim = lim6, prog = prog6, pasos = pasos6, salto = salto6;
  const DURACION = TT.DURACION;
  const M = { rotulo: [16, 64], suelo: 292, SX: 135, SY: 200, caja: 300, titular: [16, 116], gato: [20, 196], asoma: [6, 195] };
  const SU = M.suelo;
  const { L, ANCHO, MW, G12, CAPAS, X, limpiar } = lienzos6({ W, H, N });

  // ---------- tiempos (de la voz alineada) ----------
  const T_ENTRADA = P("fr01", "no"); // el título dura hasta aquí (2,3 s) y entra la torre
  const T_FALTA = P("fr01", "falta"), T_ROBAR = P("fr01", "robarlos"), T_SINO = P("fr01", "sino"), T_JEFE = P("fr01", "jefe");
  const T_AVANZ = P("fr02", "avanzados"), T_NO = P("fr02", "no"), T_CHINA2 = P("fr02", "china"), T_RESTR = P("fr02", "restringe");
  const T_NYT = P("fr03", "newyorktimes"), T_FUNC = P("fr03", "funcionarios"), T_ALICE = P("fr03", "alice"), T_TRABAJA = P("fr03", "trabajaba");
  const T_SING = P("fr04", "singapur"), T_INVEST = P("fr04", "investigada"), T_2024 = P("fr04", "2024"), T_DESVIO = P("fr04", "desvio"), T_POSIBLE = P("fr04", "posible");
  const T_OBJ = P("fr05", "objetivo"), T_JENSEN = P("fr05", "jensen"), T_SABER = P("fr05", "saber");
  const T_CORREO = P("fr06", "correo"), T_PLANTILLA = P("fr06", "plantilla"), T_INFIEL = P("fr06", "infiel");
  const T_PRENSA = P("fr07", "prensa"), T_MUJER = P("fr07", "mujer"), T_SENALAN = P("fr07", "senalan");
  const T_ABRIO = P("fr08", "abrio"), T_INDEP = P("fr08", "independiente");
  const T_CONF = P("fr09", "confirma"), T_INV10 = P("fr10", "investiga"), T_SECR = P("fr10", "secretos");
  const T_CHINA11 = TT.ini("fr11"), T_ESPEC = P("fr11", "especulacion");
  const T_CONFIANZA = P("fr12", "confianza");

  // ---------- recorrido de la cámara (reglas v6) ----------
  const R = ruta6({ W, M, fin: TT.fin, entrada: T_ENTRADA,
    saltos: [["fr01", "viaje", 0.3], ["fr02", "viaje"], ["fr03", "viaje", 0.3], ["fr04", "viaje"], ["fr05", "tema"], ["fr07", "viaje"], ["fr08", "tema", 0.2], ["fr11", "viaje"]],
    zooms: [{ est: 3, desde: T_INVEST, frase: "fr04", cx: 126, cy: 220 },   // zoom core: Megaspeed y el desvío
      { est: 4, desde: T_JENSEN, frase: "fr05", cx: 124, cy: 220 }] });      // zoom core: el objetivo
  const T_SLIDE = T_ENTRADA, T_SLIDE_FIN = R.LLE(0);
  const T_CHIP = Math.max(T_AVANZ, R.LLE(1)), T_PORTADA = Math.max(T_NYT, R.LLE(2)), T_MARCO = Math.max(T_OBJ, R.LLE(4));
  const T_CONSEJO = Math.max(P("fr08", "consejo"), R.LLE(6));
  const MISTA6_FIN = R.LLE(5) + 1.7, MISTA8_FIN = R.LLE(7) + 1.6;

  // piezas clave: tienen que estar 2 s en pantalla antes de que salga la cámara (lo comprueba motor/revisar.mjs)
  const CLAVES = [];
  const clave = (t, nombre) => { CLAVES.push({ t: Math.round(t * 1000) / 1000, nombre }); return t; };
  clave(T_SINO, "ruta hacia el despacho del jefe"); clave(T_NO, "barrera de la frontera"); clave(T_PORTADA, "portada del periódico");
  clave(T_TRABAJA, "dosier de la ejecutiva"); clave(T_INVEST, "lupa sobre Megaspeed"); clave(T_POSIBLE, "cajas que salen hacia China");
  clave(T_SABER, "diana sobre el plano del chip"); clave(T_CORREO, "correo que se abre"); clave(T_MUJER, "hilo de la carta a la silueta");
  clave(T_ABRIO, "lupa del consejo"); clave(T_CONF, "la insignia del tuit pasa a interrogación"); clave(T_INV10, "lupa sobre los periódicos");
  clave(T_SECR, "caja fuerte con el check"); clave(T_CHINA11, "bocadillo de China");
  window.revision = { movimientos: R.movimientos, salidas: R.salidas, llegadas: R.llegadas, claves: CLAVES };

  // ---------- paletas y alias de las piezas de la biblioteca ----------
  const C = C6, { CARTON, ORO, ROJO, PAPEL, CUERO, CANAS } = P6, NARANJA5 = P6.NARANJA;
  const silueta = silueta6, chip = chip6, cajaChips = cajaChips6, boveda = boveda6, lupa = lupa6, cheque = cheque6, conChaqueta = conChaqueta6;
  const farola = (svg, brillo, x, t) => farola6(svg, brillo, x, t, SU);
  const F = fondoNoche6({ L, ANCHO, W, H, N, SU, SX: M.SX, lunas: [0, 8] });

  // ---------- textos: título, 4 rótulos (temas y cierre) y 2 identificadores ----------
  const T6 = crearTextos6({ interfaz: document.getElementById("textos"), mundo: document.getElementById("textos-mundo") });
  T6.titulo(0, T_ENTRADA, 'Noticia · <span class="clave">NVIDIA</span>', '¿Espiar<br>al jefe de<br><span class="clave">NVIDIA</span>?', M);
  T6.rotulo(R.LLE(0), R.SAL(4), 'El <span class="clave">caso</span>', M.rotulo);
  T6.rotulo(R.LLE(5), R.SAL(6), 'El <span class="clave">domingo</span>', M.rotulo);
  T6.rotulo(R.LLE(7), R.SAL(7), '<span class="clave">Ojo</span>', M.rotulo);
  T6.rotulo(R.LLE(8), DURACION + 1, 'Por <span class="clave">ahora</span>', M.rotulo); // cierre
  T6.identificador(T_ALICE, R.SAL(2), "Alice Huang", [X(2) + 8, 206]);
  T6.identificador(T_JENSEN, R.SAL(4), "Jensen<br>Huang", [X(4) + 34, 178]);
  tildes6();

  // ---------- 1 · la torre de NVIDIA (también en el cierre) ----------
  function torre(n, t, { caja = true, sala = false, jefeApagado = false } = {}) {
    const { medio, brillo, frente } = L, x = X(n) + 118, w = 132, top = 156, h = SU - top;
    rect(medio, x - 1, top - 1, w + 2, h + 1, C);
    rect(medio, x, top, w, h, "#1d304e"); rect(medio, x, top, 2, h, "#2a4266"); rect(medio, x + w - 2, top, 2, h, "#101a2c");
    for (let xx = x + 6; xx < x + w - 4; xx += 8) rect(medio, xx, top + 46, 1, h - 106, "#16243c");
    placa6(medio, x + 30, top - 13, "NVIDIA"); // el nombre, en la azotea (placa del dibujo, sin logotipo)
    // antena con luz roja que parpadea
    rect(medio, x + 118, top - 18, 2, 18, R5.metal[2]);
    if (Math.floor(t / 0.6) % 2 === 0) { rect(medio, x + 117, top - 20, 4, 3, ROJO[2]); rect(brillo, x + 115, top - 22, 8, 7, ROJO[1]); }
    // despacho del jefe (planta alta): ventanal cálido con una persona genérica de chaqueta oscura
    const vx = x + 10, vy = top + 6, vw = w - 20, vh = 36;
    rect(medio, vx - 1, vy - 1, vw + 2, vh + 2, C);
    const luzJefe = !jefeApagado || (t >= T_JEFE && !(t < T_JEFE + 0.15 && Math.floor((t - T_JEFE) / 0.05) % 2)); // se enciende con «jefe»
    pared5(medio, vx, vy, vw, vh, luzJefe ? R5.oficina.slice(1, 5) : ["#120e10", "#1a1416", "#221a1a", "#2a201e"]);
    if (luzJefe) rect(brillo, vx - 3, vy - 3, vw + 6, vh + 6, "#5c3a26");
    for (let k = 1; k < 4; k++) rect(medio, vx + Math.round(vw * k / 4), vy, 1, vh, C);
    conChaqueta(frente, vx + 46, vy + 2, t);
    rect(frente, vx, vy + vh - 6, vw, 6, R5.oficina[0]);
    // ventanas de las plantas de en medio (unas encendidas, otras no; alguna cambia)
    const az = mulberry32(31 + n);
    for (let fy = top + 50; fy < SU - 70; fy += 12) for (let fx = x + 6; fx < x + w - 12; fx += 16) {
      const r = az(), on = r < 0.25 || (r < 0.32 && Math.floor(t / 2 + fx) % 2 === 0);
      rect(medio, fx, fy, 12, 7, C); rect(medio, fx + 1, fy + 1, 10, 5, on ? R5.ventana[0] : "#101a2c");
      if (on) rect(medio, fx + 1, fy + 1, 10, 1, R5.ventana[1]);
    }
    if (sala) { // en el cierre: la sala del consejo encendida (planta de en medio)
      rect(medio, x + 6, SU - 104, w - 12, 22, C); pared5(medio, x + 7, SU - 103, w - 14, 20, R5.oficina.slice(1, 5));
      rect(brillo, x + 4, SU - 106, w - 8, 26, "#5c3a26");
      rect(frente, x + 14, SU - 88, w - 28, 3, "#8a6242");
      for (let k = 0; k < 5; k++) { const px = x + 22 + k * 20; rect(frente, px, SU - 98, 8, 10, C); rect(frente, px + 1, SU - 97, 6, 9, "#3d4454"); disco(frente, px + 4, SU - 100, 3, C); disco(frente, px + 4, SU - 100, 2, R5.piel[1]); rect(frente, px + 2, SU - 103, 5, 2, "#24140c"); }
    }
    // planta baja en corte: la cámara acorazada con los chips
    const bx = x + 6, by = SU - 62, bw = w - 12, bh = 60;
    rect(medio, bx - 1, by - 1, bw + 2, bh + 1, C); pared5(medio, bx, by, bw, bh, R5.hormigon.slice(1, 5));
    rect(medio, bx, by + bh - 4, bw, 4, R5.hormigon[0]);
    if (caja) {
      const enciende = t >= T_SLIDE_FIN;
      boveda(frente, brillo, bx + 70, by + 30, 22, t, { gira: enciende, luz: enciende ? R5.ia[0] : null });
      // estantes con chips a la izquierda de la puerta
      for (let k = 0; k < 2; k++) { rect(frente, bx + 6, by + 18 + k * 18, 34, 2, R5.metal[2]); for (let j = 0; j < 3; j++) chip(frente, brillo, bx + 9 + j * 11, by + 9 + k * 18, 7, t + j * 0.3 + k, t >= T_FALTA + (k * 3 + j) * 0.12); }
      if (enciende) destello5(frente, brillo, bx + 70, by + 30, t, T_SLIDE_FIN);
    }
  }
  function estacion1(t) {
    const { medio, frente, brillo } = L, x0 = X(0);
    farola(medio, brillo, x0 + 40, t);
    torre(0, t, { jefeApagado: true });
    // la silueta: quieta, pasa de largo la caja fuerte y va hacia el jefe
    const xs = Math.round(x0 + 8 + 74 * prog(t, T_ROBAR - 0.2, T_SINO));
    const anda = t > T_ROBAR - 0.2 && t < T_SINO;
    silueta(frente, xs, SU, t, anda);
    if (t >= T_SINO) { // ruta punteada que sube por fuera hasta el despacho del jefe
      const pts = [[xs + 22, SU - 30], [x0 + 112, SU - 30], [x0 + 112, 180], [x0 + 128, 180]];
      ruta5(medio, brillo, pts, t, 0, prog(t, T_SINO, T_SINO + 0.5), NARANJA5);
      if (prog(t, T_SINO, T_SINO + 0.5) >= 1) destello5(frente, brillo, x0 + 140, 180, t, T_SINO + 0.5, NARANJA5);
    }
  }

  // ---------- 2 · la frontera de los chips ----------
  function estacion2(t) {
    const { medio, frente, brillo } = L, x0 = X(1);
    // caseta con la puerta hacia China
    const gx = x0 + 190;
    rect(medio, gx - 1, SU - 52, 42, 52, C); pared5(medio, gx, SU - 51, 40, 51, R5.hormigon.slice(1, 5));
    rect(medio, gx - 4, SU - 56, 48, 5, C); rect(medio, gx - 3, SU - 55, 46, 3, ROJO[1]);
    rect(medio, gx + 8, SU - 42, 16, 12, C); rect(medio, gx + 9, SU - 41, 14, 10, R5.ventana[0]); rect(brillo, gx + 6, SU - 44, 20, 16, "#5c3a26");
    rect(medio, gx + 6, SU - 24, 22, 24, C); rect(medio, gx + 7, SU - 23, 20, 23, "#0c121c");
    placa6(medio, gx - 2, SU - 71, "CHINA"); // cartel sobre la caseta (placa del dibujo)
    // foco de la caseta que barre
    const a = Math.sin(t * 1.2) * 0.5;
    for (let j = 4; j < 60; j += 3) rect(brillo, Math.round(gx - j * Math.cos(a) * 0.9), Math.round(SU - 60 + j * (0.5 + Math.sin(a) * 0.3)), 4, 3, "#2a3550");
    // cinta transportadora
    const cx0 = x0 + 92, cw = 92, cy = SU - 14;
    rect(medio, cx0 - 1, cy - 1, cw + 2, 10, C); rect(medio, cx0, cy, cw, 8, R5.metal[1]); rect(medio, cx0, cy, cw, 1, R5.metal[3]);
    const av = Math.floor(t * 10) % 6;
    for (let k = 0; k < cw; k += 6) rect(medio, cx0 + ((k + av) % cw), cy + 3, 2, 2, R5.metal[0]);
    rect(medio, cx0 + 4, cy + 8, 3, SU - cy - 8, C); rect(medio, cx0 + cw - 7, cy + 8, 3, SU - cy - 8, C);
    // cajas de chips: avanzan a saltos hacia la caseta; con «restringe» se paran ante la barrera
    const barreraX = x0 + 176, parado = t >= T_NO + 0.23;
    for (let k = 0; k < 3; k++) {
      let px;
      if (!parado) px = cx0 + ((Math.floor(t * 8) * 2 + k * 30) % (cw - 14));
      else px = barreraX - 18 - k * 18 + (k === 0 && Math.floor((t - T_NO) / 0.3) % 3 === 0 ? 2 : 0); // la primera caja insiste contra la barrera
      cajaChips(frente, Math.round(px), cy - 12);
    }
    // barrera: baja en 3 escalones con «restringe» (objeto rojo y blanco)
    const paso = t < T_NO ? 0 : Math.min(3, Math.floor((t - T_NO) / 0.075) + 1);
    const px = barreraX + 4, py = SU - 30;
    rect(medio, px - 2, py, 5, 30, C); rect(medio, px - 1, py + 1, 3, 29, R5.metal[2]);
    const armPts = (k) => [Math.round(px - Math.sin((paso / 3) * Math.PI / 2) * k), Math.round(py - Math.cos((paso / 3) * Math.PI / 2) * k)];
    for (let k = 0; k <= 44; k++) { const [ax, ay] = armPts(k); rect(frente, ax - 1, ay - 1, 4, 4, C); }
    for (let k = 0; k <= 44; k++) { const [ax, ay] = armPts(k); rect(frente, ax, ay, 2, 2, Math.floor(k / 6) % 2 ? "#f5f7fb" : ROJO[2]); }
    if (t >= T_RESTR && Math.floor((t - T_RESTR) / 0.25) % 2 === 0 && t < T_RESTR + 1.5) rect(brillo, px - 46, py - 6, 52, 12, ROJO[1]);
    // el chip grande delante, a la izquierda
    chip(frente, brillo, x0 + 22, 196, 60, t, true);
    if (t >= T_CHIP) destello5(frente, brillo, x0 + 52, 226, t, T_CHIP);
    if (t >= T_CHINA2) destello5(frente, brillo, gx + 20, SU - 36, t, T_CHINA2, PAPEL.concat("#ffffff")); // la caseta reacciona con «China»
    const sc = salto(t, T_RESTR);
    if (sc !== null) { // candado sobre el chip: no se puede vender
      const cx = x0 + 43, cy = 222 + sc;
      rect(frente, cx + 2, cy - 10, 14, 11, C); rect(frente, cx + 3, cy - 9, 12, 10, R5.metal[3]); rect(frente, cx + 6, cy - 6, 6, 7, R5.ia[1]);
      rect(frente, cx - 1, cy, 20, 15, C); rect(frente, cx, cy + 1, 18, 13, ORO[1]); rect(frente, cx, cy + 1, 18, 1, ORO[2]); rect(frente, cx + 17, cy + 1, 1, 13, ORO[0]);
      rect(frente, cx + 8, cy + 5, 2, 5, C);
      destello5(frente, brillo, cx + 9, cy + 4, t, T_RESTR, NARANJA5);
    }
  }

  // ---------- 3 · la rotativa y la ejecutiva ----------
  function estacion3(t) {
    const { medio, frente, brillo } = L, x0 = X(2);
    // rotativa
    const rx = x0 + 112, ry = 214;
    caja5(medio, rx, ry, 116, SU - ry, R5.metal);
    rect(medio, rx + 6, ry + 6, 104, 20, "#1c2236");
    [[rx + 30, ry + 40], [rx + 86, ry + 40]].forEach(([dx, dy], k) => {
      disco(frente, dx, dy, 15, C); disco(frente, dx, dy, 14, R5.metal[2]); disco(frente, dx - 1, dy - 1, 10, R5.metal[3]); disco(frente, dx, dy, 4, C);
      const paso = Math.floor(t * 10 + k * 3) % 8;
      for (let j = 0; j < 4; j++) { const a = ((paso / 8) + j / 4) * Math.PI * 2; linea(frente, dx, dy, dx + Math.cos(a) * 12, dy + Math.sin(a) * 12, R5.metal[1], 2); }
    });
    rect(frente, rx + 16, ry + 25, 84, 2, PAPEL[3]); // banda de papel
    rect(medio, rx + 98, ry + 10, 8, 6, Math.floor(t * 4) % 2 ? R5.verde[2] : R5.verde[0]);
    // hojas que salen volando hacia la izquierda y se apilan
    for (let k = 0; k < 4; k++) {
      const f = (t * 0.9 + k / 4) % 1, hx = Math.round(rx - 4 - f * 26), hy = Math.round(SU - 34 - Math.sin(f * Math.PI) * 18);
      rect(frente, hx - 1, hy - 1, 10, 4, C); rect(frente, hx, hy, 8, 2, PAPEL[3]);
    }
    for (let k = 0; k < 4; k++) { rect(frente, rx - 30, SU - 4 - k * 3, 24, 3, C); rect(frente, rx - 29, SU - 3 - k * 3, 22, 2, k % 2 ? PAPEL[2] : PAPEL[1]); }
    // la portada que salta con «New York Times»
    const s = salto(t, T_PORTADA);
    if (s !== null) {
      const px = x0 + 112, py = 124 + s, pw = 116, ph = 50;
      rect(frente, px - 1, py - 1, pw + 2, ph + 2, C); rect(frente, px, py, pw, ph, PAPEL[2]); rect(frente, px, py, pw, 1, PAPEL[3]);
      const az = mulberry32(44);
      placa6(frente, px, py + 1, "NEW YORK TIMES", { color: "#1a1a1a", fondo: null }); // cabecera con su nombre (sin logotipo)
      rect(frente, px + 4, py + 11, pw - 8, 1, "#1a1a1a");
      rect(frente, px + 6, py + 15, pw - 12, 4, "#2a2a2a"); // titular
      const escritas = Math.floor(prog(t, T_PORTADA + 0.2, T_ALICE) * 24 + 1e-9); // las columnas se escriben línea a línea
      for (let c = 0; c < 4; c++) for (let l = 0; l < 6; l++) if (c * 6 + l < escritas && !(c === 2 && t >= T_ALICE)) rect(frente, px + 5 + c * 28, py + 23 + l * 4, 24 - (l === 5 ? 9 : 0), 1, "#7a7466");
      if (t >= T_ALICE) { // con «Alice», la foto: una silueta
        const sf = salto(t, T_ALICE) || 0;
        rect(frente, px + 60, py + 21 + sf, 26, 24, C); rect(frente, px + 61, py + 22 + sf, 24, 22, "#4a4a4a"); disco(frente, px + 73, py + 31 + sf, 5, "#1a1a1a"); rect(frente, px + 65, py + 37 + sf, 16, 7, "#1a1a1a");
      }
      destello5(frente, brillo, px + pw / 2, py + ph / 2, t, T_PORTADA, PAPEL.concat("#ffffff"));
    }
    // la silueta, quieta, y su dosier, que se abre con «espionaje»
    if (t >= T_FUNC) { // foco que la ilumina desde arriba
      for (let j = 0; j < 60; j += 2) rect(brillo, x0 + 32 - Math.floor(j * 0.4), SU - 90 + j, 1 + Math.floor(j * 0.8), 2, "#2a3550");
    }
    silueta(frente, x0 + 20, SU, t);
    const sd = salto(t, T_TRABAJA);
    if (sd !== null) {
      const dx = x0 + 56, dy = 226 + sd;
      rect(frente, dx - 1, dy - 1, 52, 40, C); rect(frente, dx, dy, 50, 38, ORO[1]); rect(frente, dx, dy, 50, 2, ORO[2]); rect(frente, dx + 48, dy, 2, 38, ORO[0]);
      rect(frente, dx + 4, dy + 6, 16, 18, C); rect(frente, dx + 5, dy + 7, 14, 16, "#1c2236"); disco(frente, dx + 12, dy + 13, 3, "#0d0f16"); rect(frente, dx + 7, dy + 17, 10, 6, "#0d0f16");
      for (let l = 0; l < 4; l++) rect(frente, dx + 24, dy + 8 + l * 4, 20 - (l % 2) * 6, 1, ORO[0]);
      const sello = Math.floor((t - T_TRABAJA) / 0.2) % 2 === 0 || t > T_TRABAJA + 0.8; // sello rojo (objeto)
      if (sello) { rect(frente, dx + 24, dy + 26, 22, 9, ROJO[2]); rect(frente, dx + 25, dy + 27, 20, 7, ORO[1]); rect(frente, dx + 27, dy + 29, 16, 3, ROJO[2]); }
      destello5(frente, brillo, dx + 25, dy + 19, t, T_TRABAJA, NARANJA5);
    }
  }

  // ---------- 4 · Megaspeed en Singapur ----------
  function estacion4(t) {
    const { medio, frente, brillo } = L, x0 = X(3);
    // agua de la bahía con reflejos que se mueven
    rect(medio, x0 + 152, SU - 18, 118, 18, "#0b1430");
    for (let k = 0; k < 10; k++) { const rx = x0 + 156 + ((k * 23 + Math.floor(t * 8) * 2) % 108); rect(medio, rx, SU - 14 + (k % 3) * 4, 6, 1, k % 2 ? "#2a4266" : R5.ventana[0]); }
    // tres torres unidas por una cubierta en lo alto (silueta del skyline de la bahía)
    [x0 + 160, x0 + 184, x0 + 208].forEach((bx, k) => {
      const top = 166, h = SU - 18 - top;
      rect(medio, bx - 1, top - 1, 20, h + 1, C); rect(medio, bx, top, 18, h, "#1d304e"); rect(medio, bx, top, 2, h, "#2a4266");
      rect(medio, bx - 3, SU - 30, 4, 12, C); rect(medio, bx + 17, SU - 30, 4, 12, C);
      const az = mulberry32(60 + k);
      for (let wy = top + 8; wy < SU - 22; wy += 4) for (let wx = bx + 3; wx < bx + 16; wx += 3) if (az() < 0.35 || Math.floor(t + wx + wy) % 9 === 0) rect(medio, wx, wy, 1, 1, R5.ventana[az() < 0.5 ? 0 : 1]);
    });
    rect(medio, x0 + 156, 158, 74, 9, C); rect(medio, x0 + 157, 159, 72, 6, R5.metal[2]); rect(medio, x0 + 157, 159, 72, 1, R5.metal[3]);
    for (let k = 0; k < 12; k++) if (Math.floor(t * 2 + k) % 4) rect(medio, x0 + 160 + k * 6, 161, 2, 1, "#9fe0cf");
    // centro de datos
    const dx = x0 + 26, dy = 204, dw = 132, dh = SU - dy;
    caja5(medio, dx, dy, dw, dh, R5.hormigon);
    for (let k = 0; k < 3; k++) { // ventiladores del tejado
      const fx = dx + 16 + k * 40;
      caja5(medio, fx - 9, dy - 10, 18, 10, R5.metal); disco(medio, fx, dy - 5, 4, C);
      const a = (Math.floor(t * 12 + k) % 4) / 4 * Math.PI; linea(medio, fx - Math.cos(a) * 3, dy - 5 - Math.sin(a) * 3, fx + Math.cos(a) * 3, dy - 5 + Math.sin(a) * 3, R5.metal[3], 1);
    }
    for (let k = 0; k < 3; k++) { // ventanales con armarios de servidores y LEDs
      const wx = dx + 8 + k * 40, wy = dy + 14, enc = t >= T_SING + k * 0.2; // se encienden uno a uno con «Singapur»
      rect(medio, wx - 1, wy - 1, 34, 50, C); rect(medio, wx, wy, 32, 48, "#0b1622"); if (enc) rect(brillo, wx - 2, wy - 2, 36, 52, "#13324a");
      for (let r = 0; r < 3; r++) {
        const sx = wx + 2 + r * 10; rect(frente, sx, wy + 4, 8, 42, "#1c2236"); rect(frente, sx, wy + 4, 1, 42, "#2a3550");
        for (let l = 0; l < 9; l++) { const on = enc && Math.floor(t * 5 + l * 3 + r * 7 + k * 11) % 5 !== 0; rect(frente, sx + 2 + (l % 2) * 3, wy + 7 + l * 4, 2, 1, on ? (l % 3 ? R5.verde[2] : R5.ia[3]) : R5.verde[0]); }
      }
    }
    placa6(medio, dx + 6, dy, "MEGASPEED", { color: R5.ia[3] }); // placa con el nombre, sin logotipo
    // puerta trasera: se abre con «desvío» y salen cajas por el muelle hacia la derecha (hacia China)
    const abre = t >= T_POSIBLE;
    rect(medio, dx + dw - 1, SU - 20, 10, 20, C); rect(medio, dx + dw, SU - 19, 8, 19, abre ? R5.ventana[0] : "#0c121c");
    if (abre) rect(brillo, dx + dw - 4, SU - 24, 18, 28, "#5c3a26");
    if (abre) {
      const desde = dx + dw + 8, hasta = x0 + 220;
      ruta5(medio, brillo, [[desde, SU - 3], [hasta, SU - 3]], t, 0, prog(t, T_POSIBLE, T_POSIBLE + 0.45), NARANJA5);
      puntaFlecha(frente, hasta + 4, SU - 3, "der", R5.naranja[2], 4);
      for (let k = 0; k < 3; k++) {
        const f = ((t - T_POSIBLE) * 0.5 + k / 3) % 1, cx = Math.round(desde + f * (hasta - desde - 10));
        if (t - T_POSIBLE > k * 0.4) cajaChips(frente, cx, SU - 12, 10, 9);
      }
    }
    // la lupa de EE. UU. entra con «investigada» y recorre el muelle
    const sl = salto(t, T_INVEST);
    if (sl !== null) lupa(frente, brillo, Math.round(x0 + 190 + Math.sin((t - T_INVEST) * 1.6) * 18), SU - 38 + sl, 11, t);
    const barrido = prog(t, T_2024, T_2024 + 1.2); // con «2024», un haz de la lupa recorre el centro de datos a escalones
    if (t >= T_2024 && barrido < 1) { const bx = dx + Math.floor((barrido * (dw - 6)) / 6) * 6; rect(brillo, bx, dy, 6, dh, R5.ia[1]); rect(frente, bx + 2, dy + 14, 2, 48, R5.ia[4]); } // el haz se ve pasar por los armarios
  }

  // ---------- 5 · el objetivo ----------
  function estacion5(t) {
    const { medio, frente, brillo } = L, x0 = X(4);
    // pizarra con el plano de un chip que se dibuja a escalones con «saber»
    const bx = x0 + 110, by = 156, bw = 110, bh = 96;
    caja5(medio, bx - 3, by - 3, bw + 6, bh + 6, R5.metal);
    rect(medio, bx, by, bw, bh, "#14244a");
    for (let k = 4; k < bw; k += 8) rect(medio, bx + k, by, 1, bh, "#1b2f5c");
    for (let k = 4; k < bh; k += 8) rect(medio, bx, by + k, bw, 1, "#1b2f5c");
    const p = t < T_SABER ? 0.5 * pasos(t, R.LLE(4), T_JENSEN, 8) : 0.5 + pasos(t, T_SABER, T_SABER + 1.2, 4) * 0.5;
    const cx = bx + bw / 2, cy = by + bh / 2, lado = 60;
    const seg = [ // contorno del encapsulado, núcleo, bloques internos y pistas (en orden de dibujo)
      [cx - lado / 2, cy - lado / 2, lado, 1], [cx - lado / 2, cy + lado / 2, lado, 1], [cx - lado / 2, cy - lado / 2, 1, lado], [cx + lado / 2, cy - lado / 2, 1, lado + 1],
      [cx - 16, cy - 16, 32, 1], [cx - 16, cy + 16, 32, 1], [cx - 16, cy - 16, 1, 32], [cx + 16, cy - 16, 1, 33],
      [cx - 12, cy - 12, 10, 10], [cx + 2, cy - 12, 10, 10], [cx - 12, cy + 2, 10, 10], [cx + 2, cy + 2, 10, 10],
      [cx - lado / 2, cy - 4, 14, 1], [cx + 16, cy + 4, 14, 1], [cx - 4, cy - lado / 2, 1, 14], [cx + 4, cy + 16, 1, 14],
    ];
    const n = Math.round(seg.length * p);
    seg.slice(0, n).forEach(([a, b, w, h], k) => rect(frente, Math.round(a), Math.round(b), w, h, k >= 8 && k < 12 ? R5.ia[2] : "#cfe0ff"));
    for (let k = 4; k < lado; k += 6) if (p > 0.4) { rect(frente, Math.round(cx - lado / 2 + k), Math.round(cy - lado / 2 - 3), 1, 3, "#cfe0ff"); rect(frente, Math.round(cx - lado / 2 + k), Math.round(cy + lado / 2 + 1), 1, 3, "#cfe0ff"); }
    if (t >= T_SABER) rect(brillo, bx, by, bw, bh, "#16306a");
    // atril delante y persona genérica de chaqueta de cuero (sin buscar parecido)
    conChaqueta(frente, x0 + 44, 206 + (Math.floor(t * 1.4) % 4 === 0 ? 1 : 0), t);
    caja5(frente, x0 + 28, 236, 58, SU - 236, R5.oficina.slice(0, 4));
    rect(frente, x0 + 24, 234, 66, 4, C); rect(frente, x0 + 25, 235, 64, 2, R5.oficina[3]);
    rect(frente, x0 + 52, 226, 2, 10, C); disco(frente, x0 + 53, 225, 2, R5.metal[2]); // micrófono
    for (let j = 0; j < 30; j += 2) rect(brillo, x0 + 57 - Math.floor(j * 0.5), 176 + j * 2, 1 + j, 2, "#3a2c1c"); // foco de escenario
    // con «objetivo», marco de selección sobre la persona; con «saber», diana sobre el plano del chip
    if (t >= T_MARCO && t < T_SABER && (Math.floor((t - T_MARCO) / 0.15) % 2 === 0 || t > T_MARCO + 0.6)) marcoSeleccion(frente, x0 + 41, 203, 32, 33, "#3d68ba");
    if (t >= T_SABER) { // la diana (objeto rojo), solo sobre el plano del chip
      const dxp = Math.round(cx), dyp = Math.round(cy) + (salto(t, T_SABER) || 0);
      const r = 12 + (Math.floor(t / 0.3) % 2);
      for (let k = 0; k < 24; k++) { const an = (k / 24) * Math.PI * 2; rect(frente, Math.round(dxp + Math.cos(an) * r) - 1, Math.round(dyp + Math.sin(an) * r) - 1, 2, 2, ROJO[2]); }
      rect(frente, dxp - r - 4, dyp, r - 2, 1, ROJO[3]); rect(frente, dxp + 6, dyp, r - 2, 1, ROJO[3]);
      rect(frente, dxp, dyp - r - 4, 1, r - 2, ROJO[3]); rect(frente, dxp, dyp + 6, 1, r - 2, ROJO[3]);
      rect(brillo, dxp - r - 2, dyp - r - 2, 2 * r + 4, 2 * r + 4, ROJO[0]);
    }
  }

  // ---------- 6 · el correo ----------
  function estacion6(t) {
    const { medio, frente, brillo } = L, x0 = X(5);
    // pared, ventana y corcho
    rect(medio, x0 + 4, 150, 262, SU - 150, C); pared5(medio, x0 + 5, 151, 260, SU - 152, R5.oficina.slice(0, 4));
    rect(medio, x0 + 20, 162, 56, 44, C); rect(medio, x0 + 21, 163, 54, 42, "#0e1630");
    const az = mulberry32(70); for (let k = 0; k < 18; k++) { const wx = x0 + 23 + Math.floor(az() * 50), wy = 180 + Math.floor(az() * 22); if (Math.floor(t + k) % 5) rect(medio, wx, wy, 2, 2, R5.ventana[0]); }
    rect(medio, x0 + 48, 163, 1, 42, C);
    const kx = x0 + 204, ky = 160;
    rect(medio, kx - 1, ky - 1, 58, 62, C); rect(medio, kx, ky, 56, 60, "#8a5a32"); tramado5(medio, kx, ky, 56, 60, "#7a4e2a", 0);
    // la mesa y el portátil
    rect(frente, x0 + 92, 252, 172, 4, C); rect(frente, x0 + 93, 252, 170, 2, "#8a6242"); rect(frente, x0 + 96, 256, 3, SU - 256, "#4a3526"); rect(frente, x0 + 257, 256, 3, SU - 256, "#4a3526");
    const lx = x0 + 112, ly = 196, lw = 84, lh = 52;
    caja5(frente, lx, ly, lw, lh, R5.metal); rect(frente, lx + 3, ly + 3, lw - 6, lh - 6, "#0e1a2e");
    rect(frente, lx - 6, ly + lh, lw + 12, 4, C); rect(frente, lx - 5, ly + lh, lw + 10, 2, R5.metal[2]);
    rect(brillo, lx - 2, ly - 2, lw + 4, lh + 4, "#16304a");
    const sc = { x: lx + 3, y: ly + 3, w: lw - 6, h: lh - 6 };
    if (t < T_CORREO) { // bandeja de entrada
      for (let l = 0; l < 6; l++) { rect(frente, sc.x + 4, sc.y + 4 + l * 7, 6, 4, R5.ia[1]); rect(frente, sc.x + 13, sc.y + 5 + l * 7, 40 - (l * 7) % 15, 1, "#5a6390"); }
      rect(frente, sc.x + 2, sc.y + 3 + (Math.floor(t * 2) % 6) * 7, sc.w - 4, 6, "#1d304e44");
    } else { // el sobre se abre y sale la carta, con firma
      const abierto = t >= T_CORREO + 0.45, s = salto(t, T_CORREO) || 0;
      const ex = sc.x + 20, ey = sc.y + 20 + s;
      if (abierto) {
        const sube = Math.round(14 * pasos(t, T_CORREO + 0.45, T_CORREO + 0.9, 4));
        rect(frente, ex + 4, ey - sube - 1, 30, 26, C); rect(frente, ex + 5, ey - sube, 28, 24, PAPEL[3]);
        const lineas = Math.floor(prog(t, T_CORREO + 0.9, T_INFIEL + 0.5) * 4 + 1e-9); // se escribe línea a línea
        for (let l = 0; l < lineas; l++) rect(frente, ex + 8, ey - sube + 4 + l * 4, 22 - (l === 3 ? 10 : 0), 1, "#7a7466");
        linea(frente, ex + 18, ey - sube + 20, ex + 22, ey - sube + 18, "#3a5fc0", 1); linea(frente, ex + 22, ey - sube + 18, ex + 27, ey - sube + 21, "#3a5fc0", 1);
      }
      rect(frente, ex - 1, ey + 8, 40, 18, C); rect(frente, ex, ey + 9, 38, 16, PAPEL[2]);
      if (!abierto) { linea(frente, ex, ey + 9, ex + 19, ey + 18, PAPEL[0], 1); linea(frente, ex + 37, ey + 9, ex + 19, ey + 18, PAPEL[0], 1); }
      else { linea(frente, ex, ey + 9, ex + 19, ey + 2, PAPEL[0], 1); linea(frente, ex + 37, ey + 9, ex + 19, ey + 2, PAPEL[0], 1); }
      destello5(frente, brillo, ex + 19, ey + 16, t, T_CORREO, PAPEL.concat("#ffffff"));
      // copias a la plantilla: sobres pequeños que salen del portátil cada 0,35 s y suben a escalones
      for (let k = 0; k < 8; k++) {
        const t0 = T_PLANTILLA + 0.3 + k * 0.35, e = t - t0;
        if (e < 0 || e >= 1.2) continue;
        const sx = lx + 10 + ((k * 23) % (lw - 20)) + Math.floor(e / 0.15) * (k % 2 ? 3 : -3), sy = ly - 4 - Math.floor(e / 0.15) * 6;
        rect(frente, sx - 1, sy - 1, 9, 7, C); rect(frente, sx, sy, 7, 5, PAPEL[3]); linea(frente, sx, sy, sx + 3, sy + 2, PAPEL[0], 1); linea(frente, sx + 6, sy, sx + 3, sy + 2, PAPEL[0], 1);
      }
    }
    // la prensa: llegan tres periódicos a la mesa y se clava en el corcho la silueta de la ejecutiva
    [[T_PRENSA, 0], [T_PRENSA + 0.3, 1], [T_PRENSA + 0.6, 2]].forEach(([t0, k]) => {
      const s = salto(t, t0);
      if (s === null) return;
      const px = x0 + 206 + k * 14, py = 240 - k * 3 + s;
      rect(frente, px - 1, py - 1, 30, 14, C); rect(frente, px, py, 28, 12, PAPEL[2]); rect(frente, px + 2, py + 2, 24, 2, "#1a1a1a");
      for (let l = 0; l < 2; l++) rect(frente, px + 2, py + 6 + l * 3, 20, 1, "#7a7466");
    });
    const sf = salto(t, T_PRENSA + 0.2);
    if (sf !== null) {
      const fx = kx + 14, fy = ky + 10 + sf;
      rect(frente, fx - 1, fy - 1, 30, 36, C); rect(frente, fx, fy, 28, 34, "#1c2236");
      disco(frente, fx + 14, fy + 12, 6, "#05070b"); rect(frente, fx + 5, fy + 20, 18, 14, "#05070b"); rect(frente, fx + 6, fy + 21, 2, 12, "#43506a");
      rect(frente, fx + 12, fy - 3, 4, 4, ROJO[2]); rect(frente, fx + 13, fy - 2, 1, 1, ROJO[3]); // chincheta
      if (t >= T_SENALAN && (Math.floor((t - T_SENALAN) / 0.15) % 2 === 0 || t > T_SENALAN + 0.6)) marcoSeleccion(frente, fx - 3, fy - 3, 34, 40, "#3d68ba");
    }
    if (t >= T_MUJER) { // hilo de puntos de la carta a la silueta
      ruta5(medio, brillo, [[lx + 60, ly + 10], [lx + 60, ky + 26], [kx + 14, ky + 26]], t, 0.3, prog(t, T_MUJER, T_MUJER + 0.5), NARANJA5);
    }
  }

  // ---------- 7 · el consejo ----------
  function estacion7(t) {
    const { medio, frente, brillo } = L, x0 = X(6);
    rect(medio, x0 + 4, 146, 262, SU - 146, C); pared5(medio, x0 + 5, 147, 260, SU - 148, ["#16120f", "#2a1d1c", "#41291f", "#5c3a26"]);
    rect(medio, x0 + 70, 160, 130, 48, C); rect(medio, x0 + 71, 161, 128, 46, "#0e1630"); // ventanal con la ciudad
    const az = mulberry32(80); let bx = x0 + 72;
    while (bx < x0 + 196) { const w = 8 + Math.floor(az() * 10), h = 12 + Math.floor(az() * 30); rect(medio, bx, 207 - h, w, h, "#16203e"); for (let wy = 209 - h; wy < 205; wy += 4) if (az() < 0.4) rect(medio, bx + 2, wy, 2, 2, R5.ventana[0]); bx += w + 2; }
    for (let k = 1; k < 4; k++) rect(medio, x0 + 70 + k * 32, 161, 1, 46, C);
    // cuatro consejeros independientes: se enciende la lámpara de cada uno y aparece, uno tras otro
    const PELOS = [["#2a1810", "#4a2c1a", "#6a4430"], CANAS, ["#3a2a1a", "#6a4a2a", "#8a6a4a"], ["#0d0d10", "#1c1c22", "#34343c"]];
    const PIELES = [R5.piel, ["#8a5a3a", "#b07a52", "#d8a07a"], ["#c08a6a", "#e8b08a", "#f8d4b4"], ["#6a4430", "#8a5a3a", "#b07a52"]];
    [x0 + 46, x0 + 94, x0 + 142, x0 + 190].forEach((px, k) => {
      const t0 = T_CONSEJO + k * 0.22, on = t >= t0;
      rect(medio, px + 12, 146, 1, 16, C); rect(medio, px + 6, 162, 14, 4, C); rect(medio, px + 7, 163, 12, 2, on ? R5.ventana[1] : R5.metal[1]);
      if (!on) return;
      for (let j = 0; j < 36; j += 2) rect(brillo, px + 12 - Math.floor(j * 0.45), 166 + j * 2, 1 + Math.floor(j * 0.9), 2, "#5c3a26");
      const s = salto(t, t0) || 0;
      persona5(frente, px, 204 + s + (Math.floor(t * 1.3 + k) % 5 === 0 ? 1 : 0), t + k * 0.7, { piel: PIELES[k], pelo: PELOS[k], camisa: ["#2a2f3a", "#3d4454", "#56607a"] });
    });
    // mesa larga y carpeta; con «investigación» la lupa se posa sobre la carpeta
    rect(frente, x0 + 22, 236, 226, 7, C); rect(frente, x0 + 23, 237, 224, 3, "#8a6242"); rect(frente, x0 + 23, 237, 224, 1, "#a87a52");
    rect(frente, x0 + 30, 243, 210, SU - 249, "#3a2418"); rect(frente, x0 + 30, 243, 210, 1, "#2a1810");
    for (let k = 0; k < 4; k++) rect(frente, x0 + 52 + k * 48, 233, 12, 3, PAPEL[3]);
    const sc = salto(t, T_ABRIO);
    rect(frente, x0 + 116, 230, 38, 7, C); rect(frente, x0 + 117, 231, 36, 5, ORO[1]); rect(frente, x0 + 117, 231, 36, 1, ORO[2]);
    if (sc !== null) {
      rect(brillo, x0 + 112, 224, 46, 16, "#5c3a26");
      lupa(frente, brillo, x0 + 132 + Math.round(Math.sin((t - T_ABRIO) * 2) * 6), 216 + sc, 9, t);
    }
    if (t >= T_INDEP) destello5(frente, brillo, x0 + 135, 233, t, T_INDEP, NARANJA5);
  }

  // ---------- 8 · MATIZ ----------
  // De izquierda a derecha, lo que dice cada frase: periódicos bajo la lupa (fr10: «investiga lo que ha publicado la
  // prensa»), la caja fuerte cerrada con su check («sin motivos para creer que se filtraran secretos») y el edificio
  // de China con su bocadillo (fr11). Arriba, el tuit de partida, que el sello corrige (fr09).
  function estacion8(t) {
    const { medio, frente, brillo } = L, x0 = X(7);
    // el tuit de partida, sin logotipos ni texto legible: tarjeta con avatar, renglones y una insignia de «confirmado»
    // (check verde). Con «no confirma» (fr09), la insignia pasa a una interrogación ámbar: nadie lo ha confirmado.
    const px = x0 + 14, py = 138, pw = 132, ph = 52;
    caja5(medio, px, py, pw, ph, ["#0f1420", "#151c2c", "#1c2438", "#262f48"]);
    disco(medio, px + 16, py + 15, 9, C); disco(medio, px + 16, py + 15, 8, "#3a4166"); disco(medio, px + 16, py + 12, 3, "#8a93c0"); rect(medio, px + 11, py + 17, 10, 4, "#8a93c0");
    for (let l = 0; l < 4; l++) rect(medio, px + (l < 2 ? 32 : 8), py + 10 + l * 9, (l < 2 ? 58 : 82) - (l % 2) * 16, 3, l === 0 ? "#8a93c0" : "#3a4166"); // renglones
    rect(brillo, px - 2, py - 2, pw + 4, ph + 4, "#121a30");
    const ix = px + pw - 30, iy = py + 8 + (salto(t, T_CONF) || 0), duda = t >= T_CONF;
    disco(medio, ix + 10, iy + 10, 12, C); disco(medio, ix + 10, iy + 10, 11, duda ? ORO[1] : R5.verde[1]); disco(medio, ix + 9, iy + 9, 9, duda ? ORO[2] : R5.verde[2]);
    if (!duda) check(frente, ix + 7, iy + 6, "#f5f7fb");
    else { // interrogación dibujada (no es texto): 2 unidades por punto
      ["0111110", "1100011", "0000011", "0000110", "0001100", "0001100", "0000000", "0001100"].forEach((fila, j) => [...fila].forEach((c, i) => { if (c === "1") rect(frente, ix + 3 + i * 2, iy + 2 + j * 2, 2, 2, C); }));
      destello5(frente, brillo, ix + 10, iy + 10, t, T_CONF, NARANJA5);
      if (t < T_CONF + 1.2) rect(brillo, ix - 6, iy - 6, 32, 32, ORO[0]);
    }
    // periódicos que llegan uno a uno y la lupa que los recorre
    [[T_INV10, 0], [T_INV10 + 0.25, 1], [T_INV10 + 0.5, 2]].forEach(([t0, k]) => {
      const s = salto(t, t0);
      if (s === null) return;
      const nx = x0 + 18 + k * 8, ny = 268 - k * 7 + s;
      rect(frente, nx - 1, ny - 1, 44, 16, C); rect(frente, nx, ny, 42, 14, PAPEL[2]); rect(frente, nx + 3, ny + 2, 36, 3, "#1a1a1a");
      for (let l = 0; l < 2; l++) rect(frente, nx + 3, ny + 7 + l * 3, 30 - l * 8, 1, "#7a7466");
    });
    const sl = salto(t, T_INV10 + 0.6);
    if (sl !== null) lupa(frente, brillo, Math.round(x0 + 46 + Math.sin((t - T_INV10) * 1.8) * 14), 248 + sl, 10, t);
    // la caja fuerte, cerrada: con «secretos» se enciende la luz verde y el check
    const vx = x0 + 100, vy = 226;
    rect(medio, vx - 1, vy - 1, 78, SU - vy + 1, C); pared5(medio, vx, vy, 76, SU - vy, R5.hormigon.slice(1, 5));
    const ok = t >= T_SECR;
    boveda(frente, brillo, vx + 38, vy + 34, 24, t, { gira: false, luz: ok ? R5.verde[0] : null });
    if (ok) { cheque(frente, vx + 32, vy + 4 + (salto(t, T_SECR) || 0)); destello5(frente, brillo, vx + 38, vy + 34, t, T_SECR, R5.verde.concat("#ffffff")); }
    rect(frente, vx + 66, vy + 5, 6, 6, C); rect(frente, vx + 67, vy + 6, 4, 4, ok ? R5.verde[2] : ROJO[1]);
    // edificio oficial (frontón, columnas y escalinata; bandera roja lisa, sin símbolos) con su nombre en el dintel:
    // con fr11 se ilumina y sale un bocadillo
    const gx = x0 + 186, gw = 46, gt = SU - 46;
    for (let k = 0; k < 3; k++) { rect(medio, gx - 4 + k * 2, SU - 4 - k * 3, gw + 8 - k * 4, 3, C); rect(medio, gx - 3 + k * 2, SU - 3 - k * 3, gw + 6 - k * 4, 2, R5.hormigon[4 - k]); }
    rect(medio, gx - 1, gt, gw + 2, SU - 9 - gt, C); rect(medio, gx, gt + 1, gw, SU - 10 - gt, R5.hormigon[1]);
    for (let k = 0; k < 4; k++) { const cx = gx + 4 + k * 11; rect(medio, cx, gt + 4, 5, SU - 14 - gt, C); rect(medio, cx + 1, gt + 4, 3, SU - 14 - gt, R5.hormigon[3]); rect(medio, cx + 1, gt + 4, 1, SU - 14 - gt, R5.hormigon[4]); }
    rect(medio, gx - 3, gt - 3, gw + 6, 4, C); rect(medio, gx - 2, gt - 2, gw + 4, 2, R5.hormigon[3]);
    for (let j = 0; j < 9; j++) { rect(medio, gx - 2 + j * 3, gt - 4 - j, gw + 4 - j * 6, 1, j % 2 ? R5.hormigon[2] : R5.hormigon[3]); } // frontón a escalones
    placa6(medio, gx + 1, gt + 2, "CHINA", { fondo: R5.hormigon[0], borde: R5.hormigon[0] });
    rect(medio, gx + gw / 2, gt - 26, 1, 14, R5.metal[3]); // mástil
    const ondea = Math.floor(t / 0.3) % 2;
    rect(medio, gx + gw / 2 + 1, gt - 26, 10, 6, C); rect(medio, gx + gw / 2 + 1, gt - 25 + ondea, 9, 4, ROJO[2]); rect(medio, gx + gw / 2 + 1, gt - 25 + ondea, 9, 1, ROJO[3]);
    if (t >= T_CHINA11) {
      rect(brillo, gx - 4, gt - 8, gw + 8, SU - gt + 8, "#5c3a26");
      const s = salto(t, T_CHINA11) || 0;
      rect(frente, gx + 4, gt - 46 + s, 30, 12, C); rect(frente, gx + 5, gt - 45 + s, 28, 10, PAPEL[3]);
      rect(frente, gx + 8, gt - 34 + s, 4, 3, PAPEL[3]); rect(frente, gx + 8, gt - 34 + s, 1, 4, C);
      rect(frente, gx + 9, gt - 43 + s, 14, 6, "#1c2438"); rect(frente, gx + 11, gt - 41 + s, 6, 1, "#8a93c0"); rect(frente, gx + 11, gt - 39 + s, 9, 1, "#3a4166"); // la tarjeta, en pequeño
      if (t >= T_ESPEC) { aspa(frente, gx + 24, gt - 44 + s + (salto(t, T_ESPEC) || 0), ROJO[2]); destello5(frente, brillo, gx + 19, gt - 40, t, T_ESPEC, PAPEL.concat("#ffffff")); }
    }
  }

  // ---------- 9 · cierre ----------
  function estacion9(t) {
    const { medio, frente, brillo } = L, x0 = X(8);
    farola(medio, brillo, x0 + 96, t);
    torre(8, t, { caja: false, sala: true });
    // la investigación sigue: una lupa recorre la fachada, del despacho a la sala del consejo; con «confianza», un check junto al despacho
    lupa(frente, brillo, x0 + 168 + Math.round(Math.sin(t * 1.4) * 34), 190 + Math.round(Math.cos(t * 0.9) * 12), 10, t);
    const mano = Math.floor(t / 0.45) % 5; // la carpeta de la investigación recorre la mesa del consejo
    rect(frente, x0 + 139 + mano * 20, SU - 91, 10, 4, C); rect(frente, x0 + 140 + mano * 20, SU - 90, 8, 2, ORO[2]);
    if (t >= T_CONFIANZA) { cheque(frente, x0 + 228, 148 + (salto(t, T_CONFIANZA) || 0)); destello5(frente, brillo, x0 + 234, 154, t, T_CONFIANZA, R5.verde.concat("#ffffff")); }
  }

  // ---------- MISTA ----------
  const MOMENTOS = [
    { desde: R.LLE(5), hasta: MISTA6_FIN, pose: "pie", luego: [0.6, "senalar"] },
    { desde: R.LLE(7), hasta: MISTA8_FIN, pose: "sorpresa", luego: [0.4, "senalar"] },
    { desde: R.LLE(8), hasta: DURACION + 1, pose: "pie", luego: [T_CONFIANZA - R.LLE(8), "pensar"] },
  ];

  // ---------- cámara ----------
  const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: MW, altoMundo: H, planos: R.planos });

  // ---------- caja de diálogo con la fuente de cada frase ----------
  const D6 = crearDialogo6({ T, ids: T.frases.map((f) => f.id), claves: { fr01: "jefe", fr02: "China", fr03: "espionaje", fr04: "Megaspeed",
    fr05: "Jensen Huang", fr06: "correo", fr07: "prensa", fr08: "investigación", fr09: "confirma", fr10: "secretos", fr11: "especulación", fr12: "confianza" },
    // lo que se enseña como fuente: el medio que se leyó (fuentes.json), con el NYT cuando la frase lo atribuye
    etiquetas: { fr03: "NYT vía AFP", fr04: "NYT vía AFP", fr05: "NYT vía AFP", fr06: "NVIDIA · 8 nov", fr07: "AFP" },
    maxc: 21, corto: true, dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"),
    retrato: document.getElementById("retrato"), fuente: document.getElementById("fuente") });
  tildes6();

  // ---------- sonido: atado a lo que pasa en pantalla ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    // solo lo clave (Mario, 2026-10-30): transiciones y lo que aparece o reacciona en los datos decisivos
    add(T_ENTRADA, "destello"); add(T_SINO + 0.5, "seleccion");
    R.salidas.forEach((a) => add(a, "destello"));
    add(T_NO, "error");
    add(T_PORTADA, "aparicion"); add(T_TRABAJA, "seleccion");
    add(T_INVEST, "aparicion");
    add(T_MARCO, "seleccion");
    add(T_CORREO, "aparicion"); add(T_MUJER, "seleccion");
    add(T_ABRIO, "aparicion");
    add(T_CONF, "error"); add(T_SECR, "acierto");
    add(T_CONFIANZA, "tick");
    return ev.sort((a, b) => a.t - b.t);
  };
  window.claveFotograma = clave6(R.moviendo);

  window.seek = (t) => {
    limpiar();
    const cam = CAM.en(t);
    CAM.aplicarCapas(cam, CAPAS);
    F.cielo(t);
    const enTema = t < T_SLIDE;
    ["p-medio", "p-delante"].forEach((id) => {
      const el = document.getElementById(id);
      el.style.visibility = enTema ? "hidden" : "visible";
      if (t >= T_SLIDE && t < T_SLIDE_FIN) el.style.transform = `translateX(${Math.round((1 - prog(t, T_SLIDE, T_SLIDE_FIN)) * W)}px)`;
    });
    if (!enTema) {
      F.suelo();
      // solo se dibujan las estaciones que pueden verse (la actual y sus vecinas)
      const n = lim(Math.round((M.SX - cam.tx) / cam.k / W - 0.5), 0, N - 1);
      const DIB = [estacion1, estacion2, estacion3, estacion4, estacion5, estacion6, estacion7, estacion8, estacion9];
      for (let k = Math.max(0, n - 1); k <= Math.min(N - 1, n + 1); k++) DIB[k](t);
      F.delante();
    }
    mista6(G12, t, { W, M, hablando: TT.hablando, entrada: [T_SLIDE, T_SLIDE_FIN], momentos: MOMENTOS });
    T6.ver(t);
    D6.pintar(t);
  };
  window.seek(0);
})();
