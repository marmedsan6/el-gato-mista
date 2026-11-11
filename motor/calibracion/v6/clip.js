// Calibración v6 · clip (2026-11-10, ADR 0010). El clip v5 de Mithril (fr01-fr03) con las reglas v6, para comparar en 16:9:
//   - casi sin texto: título, un rótulo por tema, la cifra «11» y un identificador por estación;
//   - la fuente de cada frase, en la caja de diálogo (marcas [fN] del guion de Mithril);
//   - la voz entra 1,2 s después (DESFASE) para que el título dure 2 s; el zoom core es un acercamiento de 0,4 s;
//     la cámara sale tras el fin real de la frase y el rótulo cambia al llegar.
// Arte a 4 px (1 unidad = 1 px CSS). Mundo de dos pantallas: A = la oficina con la ciudad y los 11 laboratorios;
// B = uno de esos laboratorios por dentro. Paralaje con CAM.aplicarCapas (lejos 0,6 · medio 1 · delante 1,35).
// Los dibujos son los del clip v5 (motor/calibracion/v5/clip.js), sin cambios.
// Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  const Q = new URLSearchParams(location.search);
  const FORMATO = Q.get("formato") || "short";
  document.body.className = FORMATO;
  const CORTO = FORMATO === "short";
  const W = CORTO ? 270 : 480, H = CORTO ? 480 : 270, MW = 2 * W, DESFASE = 1.2, DURACION = 19.9 + DESFASE + 0.5;

  const T = window.TIMING;
  // la voz entra DESFASE s después (en la mezcla, --voz-desfase): el título de entrada tiene así sus 2 s
  T.frases.forEach((f) => { f.inicio += DESFASE; f.fin += DESFASE; f.palabras.forEach((w) => { w.i += DESFASE; w.f += DESFASE; }); });
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const PALABRAS = T.frases.flatMap((f) => f.palabras);
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  const P = (fr, trozo) => { const p = FR[fr].palabras.find((w) => norm(w.p).includes(norm(trozo))); if (!p) throw new Error(`No encuentro «${trozo}» en ${fr}`); return p.i; };
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const hablando = (t) => PALABRAS.some((p) => t >= p.i && t <= p.f);
  const salto = salto6;

  // ---------- tiempos ----------
  const T_PERSONA = P("fr01", "persona"), T_ONCE = P("fr01", "once"), T_LABS = P("fr01", "laboratorios"), T_IA = P("fr01", "ia");
  const T_SLIDE = T_PERSONA, T_SLIDE_FIN = T_SLIDE + 0.4;
  const T_CODY = P("fr02", "tranbarger"), T_MITHRIL = P("fr02", "mithril"), T_BIO = P("fr02", "biotecnologica");
  const T_EMPLEADO = P("fr02", "empleado"), T_BUSCAR = P("fr02", "buscar"), T_DOS = P("fr02", "dos"), T_DISTROFIAS = P("fr02", "distrofias");
  const ZOOM = 0.4, T_ZOOM_A = FR.fr02.inicio, T_VIAJE = FR.fr02.fin + 0.15 + 0.3, T_CORTE = T_VIAJE - 0.5, T_LLEGA = T_VIAJE + 1.1; // sale tras el fin real de la frase
  const T_LAMA = P("fr03", "lama2"), T_ZOOM_B = T_LAMA + 0.55, T_DEBILITA = P("fr03", "debilita"), T_GRAVE = P("fr03", "grave");
  const T_NACIMIENTO = P("fr03", "nacimiento"), T_MESES = P("fr03", "meses"), T_PRIMEROS = P("fr03", "primeros");
  const T_MISTA = T_LLEGA, T_MISTA_FIN = T_ZOOM_B - 0.05;

  // ---------- lienzos (unidades = px CSS) ----------
  const ANCHO = { lejos: MW, medio: MW, brillo: MW, frente: MW, delante: Math.round(MW * 1.25) };
  const L = {};
  for (const id of Object.keys(ANCHO)) {
    const s = document.getElementById(id);
    s.setAttribute("viewBox", `0 0 ${ANCHO[id]} ${H}`); s.setAttribute("width", ANCHO[id]); s.setAttribute("height", H);
    s.style.width = `${ANCHO[id]}px`; s.style.height = `${H}px`;
    L[id] = s;
  }
  ["p-lejos", "p-medio", "p-delante"].forEach((id) => { const d = document.getElementById(id); d.style.width = `${id === "p-delante" ? ANCHO.delante : MW}px`; d.style.height = `${H}px`; });
  const G12 = document.getElementById("gato12");
  G12.setAttribute("viewBox", `0 0 ${W / 3} ${H / 3}`); G12.setAttribute("width", W); G12.setAttribute("height", H);

  // ---------- maqueta (px CSS) ----------
  const M = CORTO ? {
    rotulo: [16, 64], etiqueta: [16, 86], fuente: [16, 97], suelo: 292, SX: 135, SY: 200, caja: 300,
    oficina: { x: 14, y: 182, w: 222, h: 110 },
    edificios: [[-6, 118, 70, "ladrillo"], [60, 132, 56, "cristal"], [112, 112, 64, "hormigon"], [172, 124, 58, "ladrillo"], [226, 104, 54, "cristal"],
      [276, 96, 64, "hormigon"], [470, 110, 70, "ladrillo"]],
    lab: { x: W + 10, y: 108, w: 250, h: 184 }, pantalla: { x: W + 34, y: 128, w: 196, h: 84 },
    titular: [16, 120], gato: [20, 196], asoma: [6, 195], // asoma: MISTA de pie sobre la línea de la caja (pies en y ≈ 291)
  } : {
    rotulo: [16, 16], etiqueta: [252, 40], fuente: [252, 52], suelo: 198, SX: 240, SY: 100, caja: 200, // la cifra, sobre los laboratorios y lejos de la luna
    oficina: { x: 14, y: 98, w: 236, h: 100 },
    edificios: [[236, 44, 58, "ladrillo"], [290, 60, 50, "cristal"], [336, 34, 60, "hormigon"], [392, 52, 52, "ladrillo"], [440, 40, 50, "cristal"],
      [-10, 58, 60, "hormigon"], [46, 70, 56, "cristal"], [100, 50, 60, "ladrillo"], [156, 64, 50, "hormigon"], [200, 46, 44, "cristal"],
      [490, 40, 60, "hormigon"], [900, 50, 70, "ladrillo"]],
    lab: { x: W + 40, y: 30, w: 400, h: 168 }, pantalla: { x: W + 150, y: 44, w: 220, h: 84 },
    titular: [176, 76], gato: [60, 104], asoma: [336, 99],
  };
  const VENT = { w: 18, h: 15, gx: 22, gy: 20 };
  const RAMPA_FACHADA = {
    ladrillo: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e"],
    hormigon: ["#1a2030", "#252d40", "#323c54", "#45516c"],
    cristal: ["#101a2c", "#16243c", "#1d304e", "#2a4266"],
  };

  // oficina: posiciones derivadas (las usan el dibujo, los enlaces, el holograma y las etiquetas)
  const O = (() => {
    const o = M.oficina, muro = 4, ix = o.x + muro, iw = o.w - 2 * muro, iy = o.y, ih = o.h;
    const suelo = iy + Math.round(ih * 0.7), mx = ix + Math.round(iw * 0.3), mw = Math.round(iw * 0.42), my = suelo - 10;
    const cx = mx + Math.floor(mw / 2) - 13, ox = cx - 16, oy = my - 30;
    const vx = ix + Math.round(iw * 0.08), vw = 46;
    const holo = { x: vx + vw + 6, y: iy + 6, w: cx - (vx + vw + 6) + 34, h: Math.max(24, oy - iy - 16) };
    return { muro, ix, iw, iy, ih, suelo, mx, mw, my, cx, ox, oy, vx, vy: iy + Math.round(ih * 0.12), vw, vh: 34, holo };
  })();
  const ZOOM_A = { k: 1.25, cx: O.cx + 6, cy: CORTO ? 232 : 140 }; // ×1,25: el píxel pasa de 4 a 5 px y se ve más detalle
  // zoom a la pantalla: su fila de etiquetas queda bajo el rótulo y su fuente, sobre la caja
  const S = M.pantalla, ZOOM_B = CORTO ? { k: 1.25, cx: S.x + S.w / 2, cy: 208 } : { k: 1.25, cx: S.x + S.w / 2, cy: 84 }; // la pantalla entera, con su marco

  // ventanas de los edificios de A y los once laboratorios
  const VENTANAS = [];
  M.edificios.forEach(([x, y, w, tipo], n) => {
    const cols = Math.floor((w - 6) / VENT.gx);
    for (let fy = y + 10; fy + VENT.h < M.suelo - 4; fy += VENT.gy) for (let c = 0; c < cols; c++) VENTANAS.push({ x: x + 5 + c * VENT.gx, y: fy, n, tipo });
  });
  const visible = (v) => !(v.x + VENT.w > M.oficina.x - 2 && v.x < M.oficina.x + M.oficina.w + 2 && v.y + VENT.h > M.oficina.y - 6) && v.x >= 2 && v.x + VENT.w <= W - 2 && v.y > M.fuente[1] + 14;
  const candidatas = VENTANAS.filter(visible);
  const azarLab = mulberry32(5), LABS = [];
  while (LABS.length < 11 && candidatas.length) {
    const v = candidatas.splice(Math.floor(azarLab() * candidatas.length), 1)[0];
    if (LABS.every((l) => Math.abs(l.x - v.x) + Math.abs(l.y - v.y) > 30)) LABS.push(v);
  }
  // si la separación no deja meter los once (el short tiene menos fachada), se completan con las más alejadas
  const resto = VENTANAS.filter(visible).filter((v) => !LABS.includes(v));
  while (LABS.length < 11 && resto.length) {
    resto.sort((a, b) => Math.min(...LABS.map((l) => Math.abs(l.x - b.x) + Math.abs(l.y - b.y))) - Math.min(...LABS.map((l) => Math.abs(l.x - a.x) + Math.abs(l.y - a.y))));
    LABS.push(resto.shift());
  }
  if (LABS.length !== 11) throw new Error(`Solo caben ${LABS.length} laboratorios`);
  LABS.sort((a, b) => a.x - b.x);
  LABS.forEach((l, k) => { l.lab = true; l.enciende = T_ONCE + ((k * 7) % 11) / 10 * (T_LABS + 0.35 - T_ONCE); l.semilla = 20 + k; });

  // ---------- textos (v6): título, un rótulo por tema, la cifra y un identificador por estación ----------
  const T6 = crearTextos6({ interfaz: document.getElementById("textos"), mundo: document.getElementById("textos-mundo") });
  T6.titulo(0, T_SLIDE, 'IA · <span class="clave">medicina</span>', 'Mithril<br><span class="clave">Medicine</span>', M);
  T6.rotulo(T_SLIDE_FIN, T_VIAJE, 'Una <span class="clave">persona</span>', M.rotulo);
  T6.rotulo(T_LLEGA, DURACION + 1, 'Gen <span class="clave">LAMA2</span>', M.rotulo); // cambio de tema: al llegar
  // la cifra, grande y sola (la fuente va en la caja de diálogo)
  T6.cifra(T_LABS, T_ZOOM_A, "11", M.etiqueta);
  T6.identificador(T_CODY, T_CORTE, "C. Tranbarger", [O.mx + 6, O.my + 12]);
  // en el laboratorio: el gráfico se cuenta con dibujo; un solo identificador, pegado al inicio de la línea de tiempo
  const ax = S.x + 14, aw = S.w - 28; // eje de la línea de tiempo (lo usa también pantalla())
  T6.identificador(T_NACIMIENTO, DURACION + 1, "Nacimiento", [ax - 2, S.y + 4]);
  tildes6();

  // ---------- cielo y ciudad lejana ----------
  function cielo(t) {
    const { lejos } = L, SU = M.suelo;
    const bandas = [...R5.cielo].reverse(), alto = Math.ceil(SU / bandas.length);
    bandas.forEach((c, i) => { rect(lejos, 0, i * alto, MW, alto, c); if (i) tramado5(lejos, 0, i * alto, MW, 2, bandas[i - 1], i); });
    const azar = mulberry32(3);
    for (let k = 0; k < 90; k++) {
      const x = Math.floor(azar() * MW), y = Math.floor(azar() * SU * 0.45), f = azar();
      if (Math.floor(t * 2 + f * 7) % 7 !== 0) rect(lejos, x, y, 1, 1, f < 0.3 ? "#f5f7fb" : "#8a93c0");
    }
    const lx = Math.round(W * 0.8), ly = Math.round(H * (CORTO ? 0.155 : 0.1));
    disco(lejos, lx, ly, 10, "#d8d0b4"); disco(lejos, lx - 1, ly - 1, 8, "#f2ecd4"); disco(lejos, lx + 3, ly - 2, 2, "#d8d0b4");
    // nube que cruza despacio delante de la luna
    const nx = Math.round(((t * 4) % (W + 80)) - 40);
    rect(lejos, nx, ly + 4, 34, 4, "#2a2f52"); rect(lejos, nx + 6, ly + 1, 20, 3, "#2a2f52");
    const az = mulberry32(21);
    let x = -4;
    while (x < MW) {
      const w = Math.round(10 + az() * 18), h = Math.round(SU * (0.5 + az() * 0.3));
      rect(lejos, x, SU - h, w, h, R5.ciudad[1]);
      for (let wy = SU - h + 3; wy < SU; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) if (az() < 0.18) rect(lejos, wx, wy, 2, 2, R5.ventana[0]);
      x += w + Math.round(1 + az() * 4);
    }
    rect(lejos, 0, SU, MW, H - SU, "#10131c");
  }

  // ---------- edificios con ventanas (los 11 laboratorios incluidos) ----------
  function edificios(t) {
    const { medio, brillo } = L;
    M.edificios.forEach(([x, y, w, tipo], n) => {
      const h = M.suelo - y, r = RAMPA_FACHADA[tipo];
      rect(medio, x, y, w, h, R5.contorno);
      rect(medio, x + 1, y + 1, w - 2, h - 1, r[1]);
      rect(medio, x + 1, y + 1, 1, h - 1, r[3]); rect(medio, x + w - 2, y + 1, 1, h - 1, r[0]);
      if (tipo === "ladrillo") for (let yy = y + 3; yy < y + h; yy += 3) for (let xx = x + 2 + ((yy / 3) % 2 ? 0 : 2); xx < x + w - 3; xx += 5) rect(medio, xx, yy, 3, 1, r[2]);
      if (tipo === "cristal") for (let xx = x + 3; xx < x + w - 2; xx += 4) rect(medio, xx, y + 2, 1, h - 2, r[2]);
      if (tipo === "hormigon") for (let yy = y + VENT.gy - 2; yy < y + h; yy += VENT.gy) rect(medio, x + 2, yy, w - 4, 1, r[2]);
      rect(medio, x - 1, y - 1, w + 2, 2, r[3]); rect(medio, x - 1, y - 1, w + 2, 1, R5.contorno);
      if (n % 2 === 0) { const dx = x + Math.round(w * 0.55); rect(medio, dx, y - 9, 10, 7, R5.contorno); rect(medio, dx + 1, y - 8, 8, 5, R5.hormigon[2]); rect(medio, dx + 1, y - 8, 8, 1, R5.hormigon[4]); rect(medio, dx + 2, y - 2, 1, 2, R5.hormigon[1]); rect(medio, dx + 7, y - 2, 1, 2, R5.hormigon[1]); }
      else { const ax = x + Math.round(w * 0.3); rect(medio, ax, y - 14, 1, 13, R5.metal[2]); if (Math.floor(t / 0.6 + n) % 2 === 0) { rect(medio, ax - 1, y - 15, 3, 2, "#e0454f"); rect(brillo, ax - 2, y - 16, 5, 4, "#e0454f"); } }
    });
    VENTANAS.forEach((v) => (v.lab ? laboratorioVentana(v, t) : ventana(v)));
  }
  function ventana(v) {
    const { medio } = L, { x, y } = v, w = VENT.w, h = VENT.h;
    rect(medio, x, y, w, h, R5.contorno);
    const az = mulberry32(Math.round(v.x * 7 + v.y * 13)), luz = az() < 0.16;
    rect(medio, x + 1, y + 1, w - 2, h - 2, luz ? "#3a2c1c" : "#0c121c");
    if (luz) { rect(medio, x + 1, y + 1, w - 2, 1, "#5a4228"); rect(medio, x + 2, y + h - 3, 7, 1, "#5a4228"); }
    rect(medio, x + Math.floor(w / 2), y + 1, 1, h - 2, R5.contorno);
    if (!luz) rect(medio, x + 1, y + 1, 1, 5, "#1a2436");
  }
  function laboratorioVentana(v, t) {
    const { medio, brillo, frente } = L, { x, y } = v, w = VENT.w, h = VENT.h;
    const on = t >= v.enciende && !(t < v.enciende + 0.15 && Math.floor((t - v.enciende) / 0.05) % 2 === 1);
    rect(medio, x - 1, y - 1, w + 2, h + 2, R5.contorno);
    if (!on) { rect(medio, x, y, w, h, "#0c121c"); rect(medio, x + Math.floor(w / 2), y, 1, h, R5.contorno); return; }
    rect(brillo, x - 2, y - 2, w + 4, h + 4, R5.labLuz[2]);
    pared5(medio, x, y, w, h, R5.labLuz.slice(1, 5));
    rect(medio, x + 1, y, w - 2, 1, R5.labLuz[4]);
    const banco = y + h - 4, acento = [R5.verde, R5.naranja, R5.ia][v.semilla % 3];
    rect(frente, x, banco, w, y + h - banco, R5.metal[1]); rect(frente, x, banco, w, 1, R5.metal[3]);
    matraz5(frente, x + 1, banco - 7, t, acento[2], acento[1], v.semilla);
    rect(frente, x + 7, banco - 5, 5, 4, R5.contorno); rect(frente, x + 8, banco - 4, 3, 2, Math.floor(t * 4 + v.semilla) % 3 ? acento[3] : acento[2]);
    brazo5(frente, x + w - 4, banco - 3, t, { largo: 4, fase: v.semilla, color: acento });
    rect(frente, x + Math.floor(w / 2), y, 1, banco - y - 8, R5.contorno);
  }

  // ---------- la oficina ----------
  function oficina(t) {
    const { medio, brillo, frente } = L, o = M.oficina, { muro, ix, iw, iy, ih, suelo, mx, mw, my, cx } = O;
    rect(medio, o.x - 1, o.y - muro - 1, o.w + 2, o.h + muro + 1, R5.contorno);
    rect(medio, o.x, o.y - muro, o.w, muro, R5.hormigon[2]); rect(medio, o.x, o.y - muro, o.w, 1, R5.hormigon[4]); rect(medio, o.x, o.y - 1, o.w, 1, R5.hormigon[0]);
    rect(medio, o.x, iy, muro, ih, R5.hormigon[1]); rect(medio, o.x + o.w - muro, iy, muro, ih, R5.hormigon[1]); rect(medio, o.x, iy, 1, ih, R5.hormigon[3]);
    const banda = R5.oficina.slice(0, 4).reverse(), bh = Math.ceil(ih * 0.7 / banda.length);
    banda.forEach((c, i) => { rect(medio, ix, iy + i * bh, iw, bh, c); if (i) tramado5(medio, ix, iy + i * bh, iw, 1, banda[i - 1], i); });
    rect(medio, ix, suelo - 2, iw, 2, R5.oficina[0]);
    for (let j = 0; suelo + j < iy + ih; j += 3) { rect(medio, ix, suelo + j, iw, 3, j % 2 ? "#3a2418" : "#44291b"); for (let k = (j * 7) % 13; k < iw; k += 13) rect(medio, ix + k, suelo + j, 1, 3, "#2c1b12"); }
    // ventana con persiana
    const { vx, vy, vw, vh } = O;
    rect(medio, vx - 1, vy - 1, vw + 2, vh + 2, R5.contorno); rect(medio, vx, vy, vw, vh, "#0e1630");
    for (let k = 0; k < 6; k++) rect(medio, vx + 2 + k * 7, vy + vh - 2 - (k * 5) % 17, 5, (k * 5) % 17 + 2, "#141d3c");
    rect(medio, vx, vy, vw, 12, "#c9b48a"); for (let yy = vy + 1; yy < vy + 12; yy += 2) rect(medio, vx, yy, vw, 1, "#a8946c");
    rect(medio, vx + Math.floor(vw / 2), vy, 1, vh, R5.contorno); rect(medio, vx - 2, vy + vh + 1, vw + 4, 2, R5.oficina[3]);
    // logotipo de Mithril en la pared: se enciende con «Mithril» (una M pixel con hélice)
    const lgx = vx + 4, lgy = vy + vh + 8;
    if (t >= T_MITHRIL) {
      const s = salto(t, T_MITHRIL) || 0;
      rect(medio, lgx - 1, lgy - 1 + s, 16, 11, R5.contorno); rect(medio, lgx, lgy + s, 14, 9, "#1a1420");
      [[1, 1, 2, 7], [3, 2, 2, 2], [5, 3, 2, 2], [7, 2, 2, 2], [9, 1, 2, 7]].forEach(([a, b, c, d]) => rect(medio, lgx + a + 1, lgy + b + s, c, d, R5.naranja[2]));
      rect(brillo, lgx - 3, lgy - 3 + s, 20, 15, R5.naranja[1]);
    }
    // estantería
    const sx = ix + iw - 64, sw = 54, sy = iy + Math.round(ih * 0.08), sh = suelo - sy;
    rect(medio, sx - 1, sy - 1, sw + 2, sh + 1, R5.contorno); rect(medio, sx, sy, sw, sh, "#4a2e1e"); rect(medio, sx, sy, 1, sh, "#6b4430");
    const az = mulberry32(8), paso = Math.floor(sh / 3);
    for (let b = 0; b < 3; b++) {
      const by = sy + (b + 1) * paso - 2;
      rect(medio, sx, by, sw, 2, "#6b4430"); rect(medio, sx, by + 1, sw, 1, "#2c1b12");
      let bx = sx + 2;
      while (bx < sx + sw - 4) {
        const lw = 2 + Math.floor(az() * 3), lh = Math.min(paso - 4, 5 + Math.floor(az() * Math.max(3, paso - 8))), col = ["#8a3a3a", "#3a5fc0", "#1f7a5a", "#c2862e", "#5a3a7a", "#a85a2a"][Math.floor(az() * 6)];
        if (az() < 0.85) { rect(medio, bx, by - lh, lw, lh, col); rect(medio, bx, by - lh + 1, lw, 1, "#00000044"); }
        else { matraz5(medio, bx, by - 7, t, R5.verde[2], R5.verde[1], b + 3); bx += 3; }
        bx += lw + (az() < 0.2 ? 2 : 0);
      }
    }
    // planta
    const px0 = ix + Math.round(iw * 0.03), pyb = iy + ih - 2;
    rect(frente, px0, pyb - 8, 10, 8, R5.contorno); rect(frente, px0 + 1, pyb - 7, 8, 7, "#a85a2a"); rect(frente, px0 + 1, pyb - 7, 8, 1, "#d07a3a");
    const vaiven = [0, 1, 0, -1][Math.floor(t / 0.5) % 4];
    [[-6, -18], [-2, -24], [3, -21], [7, -15], [-8, -11], [9, -9]].forEach(([dx, dy], k) => {
      const lx = px0 + 5 + dx + (k % 2 ? vaiven : 0), ly = pyb - 8 + dy;
      linea(frente, px0 + 5, pyb - 8, lx, ly, "#13936a", 1); rect(frente, lx - 1, ly - 1, 3, 2, k % 2 ? "#1fd69a" : "#13936a");
    });
    // silla, persona, mesa, cajón y placa con el nombre
    rect(medio, cx, my - 34, 26, 32, R5.contorno); rect(medio, cx + 1, my - 33, 24, 30, "#262b48"); rect(medio, cx + 1, my - 33, 24, 1, "#3a4166"); rect(medio, cx + 1, my - 33, 1, 30, "#3a4166");
    persona5(frente, cx, my - 31 + (Math.floor(t * 1.6) % 5 === 0 ? 1 : 0), t);
    if (t >= T_EMPLEADO && t < T_EMPLEADO + 0.9) marcoSeleccion(frente, cx - 3, my - 35, 32, 36, "#3d68ba");
    const piso = suelo + Math.round((iy + ih - suelo) * 0.6);
    rect(frente, mx - 1, my - 1, mw + 2, 4, R5.contorno); rect(frente, mx, my, mw, 2, "#8a6242"); rect(frente, mx, my, mw, 1, "#a87a52");
    rect(frente, mx + 1, my + 3, 2, piso - my - 3, "#4a3526"); rect(frente, mx + mw - 3, my + 3, 2, piso - my - 3, "#4a3526");
    rect(frente, mx + 4, my + 3, 28, 6, "#6b4a32"); rect(frente, mx + 4, my + 3, 28, 1, "#8a6242");
    if (t >= T_CODY) { const s = salto(t, T_CODY) || 0; rect(frente, mx + 6, my + 4 + s, 24, 4, R5.contorno); rect(frente, mx + 7, my + 5 + s, 22, 2, "#c2862e"); rect(frente, mx + 7, my + 5 + s, 22, 1, "#f2c14e"); }
    // portátil y manos
    const lx = cx + 3, ly = my - 13;
    rect(frente, lx - 1, ly - 1, 22, 14, R5.contorno); rect(frente, lx, ly, 20, 13, "#5a6390"); rect(frente, lx, ly, 20, 1, "#8a93c0"); rect(frente, lx, ly, 1, 13, "#8a93c0");
    rect(frente, lx + 19, ly + 1, 1, 12, "#3a4166"); rect(frente, lx + 1, ly + 12, 19, 1, "#3a4166");
    rect(frente, lx + 8, ly + 5, 4, 3, t >= T_IA ? R5.ia[3] : "#3a4166"); if (t >= T_IA) rect(frente, lx + 9, ly + 5, 2, 1, R5.ia[4]);
    const tecla = Math.floor(t * 6) % 2;
    rect(frente, lx - 4, my - 3 - tecla, 4, 3, R5.contorno); rect(frente, lx - 3, my - 2 - tecla, 3, 2, "#e0a47c");
    rect(frente, lx + 20, my - 3 - (1 - tecla), 4, 3, R5.contorno); rect(frente, lx + 20, my - 2 - (1 - tecla), 3, 2, "#e0a47c");
    if (t >= T_IA) for (let j = 0; j < 8; j++) rect(brillo, lx - 3 - j, ly - 3 - j * 2, 26 + 2 * j, 2, R5.ia[1]);
    // flexo, taza y papeles
    const fx = mx + mw - 10;
    rect(frente, fx, my - 1, 6, 1, R5.contorno); linea(frente, fx + 3, my - 1, fx + 6, my - 9, R5.contorno, 1); linea(frente, fx + 6, my - 9, fx + 1, my - 13, R5.contorno, 1);
    rect(frente, fx - 2, my - 15, 5, 3, "#c2862e"); rect(frente, fx - 1, my - 12, 3, 1, "#fff1c4");
    for (let j = 0; j < 11; j++) rect(brillo, fx - 1 - Math.floor(j * 0.7), my - 11 + j, 3 + Math.floor(j * 1.4), 1, "#7a5a30");
    const tx = mx + 3; rect(frente, tx, my - 4, 4, 4, R5.contorno); rect(frente, tx + 1, my - 3, 2, 3, "#f5f7fb"); rect(frente, tx + 4, my - 3, 1, 2, R5.contorno);
    const v = Math.floor(t * 3) % 3; rect(frente, tx + 1 + (v % 2), my - 6 - v, 1, 1, "#c9d2e8"); rect(frente, tx + 2 - (v % 2), my - 8 - v, 1, 1, "#9aa4c0");
    const ppx = mx + mw - 26; rect(frente, ppx, my - 2, 9, 2, "#efe6d2"); rect(frente, ppx + 1, my - 3, 9, 1, "#fbf6ea");
  }

  // ---------- la IA: orbe, enlaces a los laboratorios y holograma ----------
  function ia(t) {
    if (t < T_IA) return;
    const { frente, brillo, medio } = L, { ox, oy } = O, techo = M.oficina.y - O.muro - 3;
    const r = 6 - (t < T_IA + 0.075 ? 2 : t < T_IA + 0.15 ? 1 : 0);
    if (t < T_ZOOM_A) { // en el plano general: enlaces que crecen desde el orbe hasta cada laboratorio
      LABS.forEach((l, k) => {
        const dest = [l.x + Math.floor(VENT.w / 2), l.y + VENT.h], pts = [[ox, oy], [ox, techo], [dest[0], techo], dest];
        ruta5(medio, brillo, pts, t, k * 0.13, prog(t, T_IA + 0.05 + k * 0.04, T_IA + 0.45 + k * 0.04));
      });
    }
    destello5(frente, brillo, ox, oy, t, T_IA); // aparición a la rejilla de 4 px
    orbe5(frente, brillo, ox, oy - (Math.floor(t * 2) % 2), r, t);
    holograma(t);
  }
  const BRAZO_MINI = [ // 14×11: puño arriba a la derecha, antebrazo, bíceps y manga
    "........oooo..",
    ".......oLLPPo.",
    ".......oPPPso.",
    "........oPso..",
    "........oPso..",
    "...oooo.oPso..",
    "..oLLPPooPso..",
    "oooLPPPPPPPso.",
    "oMMPPPPPPPPso.",
    "omMssssssssso.",
    "oooooooooooo..",
  ];
  function holograma(t) {
    if (t < T_BIO || t >= T_CORTE) return;
    const { frente, brillo } = L, h = O.holo, C = R5.ia;
    const abre = t < T_BIO + 0.075 ? 2 : t < T_BIO + 0.15 ? 1 : 0; // se abre a escalones
    const x = h.x, y = h.y + abre * 4, w = h.w, hh = h.h - abre * 8;
    // haz desde el orbe y marco con esquinas
    for (let j = 0; j < 6; j++) rect(brillo, O.ox - 1 - j, O.oy - 8 - j * 2, 3 + 2 * j, 2, C[1]);
    rect(brillo, x - 2, y - 2, w + 4, hh + 4, C[0]);
    [[x, y], [x + w - 3, y], [x, y + hh - 1], [x + w - 3, y + hh - 1]].forEach(([a, b]) => rect(frente, a, b, 3, 1, C[3]));
    [[x, y], [x + w - 1, y], [x, y + hh - 3], [x + w - 1, y + hh - 3]].forEach(([a, b]) => rect(frente, a, b, 1, 3, C[3]));
    const ly = y + 1 + (Math.floor(t * 12) % Math.max(1, hh - 2)); rect(frente, x + 1, ly, w - 2, 1, "#9fc4ff55"); // línea de barrido
    if (abre) return;
    const cx = x + Math.floor(w / 2), cy = y + Math.floor(hh / 2);
    if (t < T_BUSCAR) { // ADN que gira
      for (let i = 0; i < w - 8; i++) {
        const a = (i / 14) * Math.PI * 2 + t * 3, y1 = Math.round(cy + Math.sin(a) * (hh / 2 - 4)), y2 = Math.round(cy - Math.sin(a) * (hh / 2 - 4));
        rect(frente, x + 4 + i, y1, 1, 1, Math.cos(a) > 0 ? C[4] : C[2]); rect(frente, x + 4 + i, y2, 1, 1, Math.cos(a) > 0 ? C[2] : C[4]);
        if (i % 4 === 0) rect(frente, x + 4 + i, Math.min(y1, y2) + 1, 1, Math.max(0, Math.abs(y2 - y1) - 1), i % 8 ? R5.naranja[2] : R5.verde[2]);
      }
    } else if (t < T_DOS) { // buscar tratamientos: tres moléculas y una lupa que las recorre
      [0.2, 0.5, 0.8].forEach((f, k) => {
        const mx = x + Math.round(w * f), my = cy;
        [[0, -4], [4, -2], [4, 2], [0, 4], [-4, 2], [-4, -2]].forEach(([a, b], j, arr) => { const [c, d] = arr[(j + 1) % 6]; linea(frente, mx + a, my + b, mx + c, my + d, C[3]); });
        rect(frente, mx - 1, my - 1, 2, 2, k === Math.floor(prog(t, T_BUSCAR, T_DOS) * 3) ? R5.verde[2] : C[2]);
      });
      const lx = x + 4 + Math.round(prog(t, T_BUSCAR, T_DOS - 0.1) * (w - 16)), lyy = cy - 6;
      disco(frente, lx + 4, lyy + 4, 4, C[3]); disco(frente, lx + 4, lyy + 4, 3, "#0b1622"); linea(frente, lx + 7, lyy + 7, lx + 10, lyy + 10, C[3], 2);
    } else { // dos fichas, cada una con un músculo (las dos distrofias); entran a escalones con «dos» y «distrofias»
      [[T_DOS, 0], [T_DISTROFIAS, 1]].forEach(([t0, n]) => {
        const s = salto(t, t0);
        if (s === null) return;
        const fw = Math.floor((w - 10) / 2), fx = x + 4 + n * (fw + 2), fy = y + 3 + s, fh = hh - 6;
        rect(frente, fx, fy, fw, fh, C[3]); rect(frente, fx + 1, fy + 1, fw - 2, fh - 2, "#0b1622");
        // el mismo brazo que hace fuerza, en miniatura (contorno y 3 tonos); cada ficha con una manga de color distinto
        const on = Math.floor((t - t0) / 0.3 + n) % 2 === 0;
        if (on) rect(brillo, fx, fy, fw, fh, R5.naranja[1]);
        const manga = n === 0 ? ["#26408a", "#3a5fc0"] : ["#13936a", "#1fd69a"];
        sprite5(frente, fx + Math.floor((fw - 14) / 2), fy + Math.floor((fh - 11) / 2), BRAZO_MINI, { o: R5.contorno, L: "#f2c4a0", P: "#d8946c", s: "#a8674a", M: manga[1], m: manga[0] });
      });
    }
  }

  // ---------- el laboratorio por dentro (pantalla B) ----------
  function laboratorioB(t) {
    const { medio, brillo, frente } = L, b = M.lab, muro = 4;
    rect(medio, b.x - 1, b.y - muro - 1, b.w + 2, b.h + muro + 1, R5.contorno);
    rect(medio, b.x, b.y - muro, b.w, muro, R5.hormigon[2]); rect(medio, b.x, b.y - muro, b.w, 1, R5.hormigon[4]);
    rect(medio, b.x, b.y, muro, b.h, R5.hormigon[1]); rect(medio, b.x + b.w - muro, b.y, muro, b.h, R5.hormigon[1]);
    const ix = b.x + muro, iw = b.w - 2 * muro, iy = b.y, ih = b.h, suelo = iy + Math.round(ih * 0.82);
    const banda = R5.labLuz.slice(0, 4).reverse(), bh = Math.ceil((suelo - iy) / banda.length);
    banda.forEach((c, i) => { rect(medio, ix, iy + i * bh, iw, bh, c); if (i) tramado5(medio, ix, iy + i * bh, iw, 1, banda[i - 1], i); });
    for (let j = 0; suelo + j < iy + ih; j += 4) for (let k = (j / 4) % 2 ? 0 : 4; k < iw; k += 8) rect(medio, ix + k, suelo + j, 4, 4, "#1e3a40");
    rect(medio, ix, suelo, iw, 1, R5.labLuz[4]);
    // tubos de luz en el techo con su cono
    [0.2, 0.5, 0.8].forEach((f) => {
      const lx = ix + Math.round(iw * f);
      rect(medio, lx - 10, iy, 20, 2, R5.labLuz[4]);
      for (let j = 2; j < suelo - iy; j += 2) rect(brillo, lx - 8 - Math.floor(j * 0.3), iy + j, 16 + Math.floor(j * 0.6), 1, R5.labLuz[1]);
    });
    // pantalla grande
    caja5(medio, S.x - 3, S.y - 3, S.w + 6, S.h + 6, R5.metal);
    rect(medio, S.x, S.y, S.w, S.h, "#071018");
    for (let yy = S.y; yy < S.y + S.h; yy += 2) rect(medio, S.x, yy, S.w, 1, "#0a1620");
    rect(brillo, S.x - 4, S.y - 4, S.w + 8, S.h + 8, "#16343a");
    pantalla(t);
    // cartel del laboratorio
    rect(medio, ix + 6, iy + 8, 22, 9, R5.contorno); rect(medio, ix + 7, iy + 9, 20, 7, "#e8ecf5"); rect(medio, ix + 9, iy + 11, 3, 3, R5.verde[1]); rect(medio, ix + 14, iy + 11, 11, 1, R5.metal[1]); rect(medio, ix + 14, iy + 13, 8, 1, R5.metal[1]);
    // banco largo con cinta transportadora de tubos, dos brazos, centrífuga y nevera de muestras
    const by = suelo - 22, bx = ix + 6, bw = iw - 40;
    caja5(frente, bx, by, bw, 22, R5.metal); rect(frente, bx, by, bw, 1, R5.metal[3]);
    for (let k = 0; k < Math.floor(bw / 20); k++) { rect(frente, bx + 4 + k * 20, by + 8, 14, 10, R5.metal[0]); rect(frente, bx + 4 + k * 20, by + 8, 14, 1, R5.metal[2]); rect(frente, bx + 10 + k * 20, by + 12, 2, 1, R5.metal[3]); }
    const cinta = by - 3;
    rect(frente, bx + 4, cinta, bw - 8, 3, R5.contorno); rect(frente, bx + 5, cinta + 1, bw - 10, 1, "#2a2f42");
    const avance = Math.floor(t * 12) % 8;
    for (let k = 0; k < (bw - 10) / 8; k++) rect(frente, bx + 5 + ((k * 8 + avance) % (bw - 10)), cinta + 1, 2, 1, "#5a6390");
    for (let k = 0; k < 9; k++) {
      const tx = bx + 6 + ((k * Math.round((bw - 16) / 9) + Math.floor(t * 12)) % (bw - 16)), col = [R5.verde, R5.naranja, R5.ia][k % 3];
      rect(frente, tx, cinta - 8, 3, 8, R5.contorno); rect(frente, tx + 1, cinta - 7, 1, 7, "#9fd8e0"); rect(frente, tx + 1, cinta - 4, 1, 3, col[2]);
    }
    brazo5(frente, bx + Math.round(bw * 0.28), cinta - 2, t, { largo: 12, fase: 1, color: R5.naranja });
    brazo5(frente, bx + Math.round(bw * 0.7), cinta - 2, t, { largo: 12, fase: 2.4, color: R5.verde });
    // centrífuga que gira a escalones
    const cfx = bx + 12, cfy = cinta - 22;
    caja5(frente, cfx - 9, cfy - 2, 18, 12, R5.metal);
    disco(frente, cfx, cfy + 3, 4, R5.contorno); disco(frente, cfx, cfy + 3, 3, "#2a2f42");
    const a = (Math.floor(t * 16) % 8) / 8 * Math.PI * 2; rect(frente, Math.round(cfx + Math.cos(a) * 2), Math.round(cfy + 3 + Math.sin(a) * 2), 1, 1, R5.verde[3]);
    // nevera de muestras con LEDs
    const nx = ix + iw - 30, ny = suelo - 60;
    caja5(frente, nx, ny, 26, 60, R5.hormigon); rect(frente, nx + 3, ny + 4, 20, 24, "#0e2028"); rect(frente, nx + 3, ny + 32, 20, 24, "#0e2028");
    for (let k = 0; k < 4; k++) rect(frente, nx + 5 + k * 5, ny + 8, 3, 1, Math.floor(t * 3 + k) % 4 ? R5.verde[2] : R5.verde[0]);
    rect(frente, nx + 22, ny + 12, 1, 8, R5.metal[3]); rect(frente, nx + 22, ny + 40, 1, 8, R5.metal[3]);
  }
  // Brazo de perfil haciendo fuerza (hombro a la izquierda, codo, antebrazo arriba y puño). p = 0 fuerte … 1 débil:
  // el bíceps se desinfla y el puño tiembla. (x, yBase) = hombro abajo a la izquierda; w, h = caja disponible.
  function brazoFuerza(svg, x, yBase, w, h, p, t) {
    const C = R5.contorno, piel = ["#a8674a", "#d8946c", "#f2c4a0"], g = 12; // grosor del brazo
    const yb = yBase - g, ex = x + Math.round(w * 0.62), alto = Math.min(h - 18, 40);
    const tiembla = p >= 0.5 ? (Math.floor(t * 14) % 2) : 0;
    // manga en el hombro
    rect(svg, x - 1, yb - 3, 14, g + 6, C); rect(svg, x, yb - 2, 12, g + 4, "#3a5fc0"); rect(svg, x, yb - 2, 12, 2, "#5b8cff");
    // brazo y antebrazo con contorno y luz arriba a la izquierda
    rect(svg, x + 12, yb - 1, ex - x - 11, g + 2, C); rect(svg, x + 12, yb, ex - x - 12, g, piel[1]); rect(svg, x + 12, yb + g - 3, ex - x - 12, 3, piel[0]);
    rect(svg, ex - g - 1, yb - alto - 1, g + 2, alto + g + 2, C); rect(svg, ex - g, yb - alto, g, alto + g, piel[1]); rect(svg, ex - g, yb - alto, 3, alto + g, piel[2]); rect(svg, ex - 3, yb - alto, 3, alto, piel[0]);
    // puño
    const px = ex - g - 2 + tiembla, py = yb - alto - 12;
    rect(svg, px - 1, py - 1, g + 6, 14, C); rect(svg, px, py, g + 4, 12, piel[1]); rect(svg, px, py, g + 4, 3, piel[2]);
    for (let k = 1; k < 4; k++) rect(svg, px + k * 4, py + 3, 1, 5, piel[0]);
    // bíceps: una elipse sobre el brazo que se desinfla
    const bx = x + 12 + Math.round((ex - x - 12) * 0.45), ry = Math.max(1, Math.round(11 * (1 - p * 0.85))), rx = Math.round((ex - x) * 0.24);
    if (ry > 1) {
      elipse5(svg, bx, yb + 1, rx + 1, ry + 1, C, -Infinity, yb + 1);
      elipse5(svg, bx, yb + 1, rx, ry, piel[1], -Infinity, yb + 1);
      elipse5(svg, bx - 2, yb - Math.round(ry * 0.4), Math.round(rx * 0.5), Math.max(1, Math.round(ry * 0.4)), piel[2], -Infinity, yb);
    }
    // marcas de fuerza alrededor del bíceps cuando todavía es fuerte
    if (p === 0 && Math.floor(t / 0.2) % 2 === 0) [[-rx - 6, -ry - 2], [0, -ry - 7], [rx + 4, -ry - 2]].forEach(([dx, dy]) => rect(svg, bx + dx, yb + dy, 3, 2, R5.dorado || "#f2c14e"));
  }

  function pantalla(t) {
    const { medio, frente, brillo } = L, C = R5.ia, cy = S.y + Math.floor(S.h / 2);
    if (t < T_DEBILITA) { // ADN que pasa; con «LAMA2» se para y se marca un tramo
      const parado = t >= T_LAMA, off = Math.floor((parado ? T_LAMA : t) * 24);
      const a0 = Math.round(S.w * 0.55), a1 = Math.round(S.w * 0.75);
      for (let i = 4; i < S.w - 4; i++) {
        const a = ((i + off) / 22) * Math.PI * 2, y1 = Math.round(cy + Math.sin(a) * (S.h * 0.32)), y2 = Math.round(cy - Math.sin(a) * (S.h * 0.32));
        const marcado = parado && i >= a0 && i <= a1;
        rect(frente, S.x + i, y1, 1, 2, marcado ? R5.naranja[3] : C[3]); rect(frente, S.x + i, y2, 1, 2, marcado ? R5.naranja[2] : C[2]);
        if ((i + off) % 5 === 0) rect(frente, S.x + i, Math.min(y1, y2) + 2, 1, Math.max(0, Math.abs(y2 - y1) - 2), marcado ? R5.naranja[2] : (i + off) % 10 ? R5.verde[1] : C[1]);
      }
      if (parado && Math.floor((t - T_LAMA) / 0.15) % 2 === 0 || t > T_LAMA + 0.6) marcoSeleccion(frente, S.x + a0 - 3, S.y + 6, a1 - a0 + 7, S.h - 12, "#3d68ba");
      if (parado) rect(brillo, S.x + a0 - 4, S.y + 4, a1 - a0 + 8, S.h - 8, R5.naranja[1]);
    } else if (t < T_NACIMIENTO) { // un brazo que hace fuerza: el bíceps se desinfla a escalones y la barra cae
      const p = Math.floor(prog(t, T_DEBILITA + 0.2, T_GRAVE + 0.2) * 4) / 4;
      brazoFuerza(frente, S.x + 14, S.y + S.h - 12, Math.round(S.w * 0.6), S.h - 20, p, t);
      const bx = S.x + S.w - 34, bw = 16, bTop = S.y + 10, bH = S.h - 20, llena = 1 - p * 0.8;
      rect(frente, bx - 1, bTop - 1, bw + 2, bH + 2, R5.contorno); rect(frente, bx, bTop, bw, bH, "#14202a");
      const hb = Math.round(bH * llena), col = llena > 0.6 ? R5.verde[2] : llena > 0.35 ? R5.naranja[2] : "#e0454f";
      rect(frente, bx + 1, bTop + bH - hb, bw - 2, hb, col); rect(frente, bx + 1, bTop + bH - hb, 2, hb, "#ffffff33");
      for (let k = 1; k < 4; k++) rect(frente, bx - 3, bTop + Math.round(bH * k / 4), 2, 1, R5.metal[3]);
      if (t >= T_GRAVE && Math.floor((t - T_GRAVE) / 0.2) % 2 === 0) rect(brillo, bx - 4, bTop + bH - hb - 4, bw + 8, hb + 8, "#e0454f");
    } else { // línea de tiempo: nacimiento y primeros meses (0-12 meses)
      const ax = S.x + 14, aw = S.w - 28, ay = cy + 8;
      rect(frente, ax, ay, aw, 2, C[3]);
      for (let m = 0; m <= 12; m++) rect(frente, ax + Math.round(aw * m / 12), ay - (m % 6 === 0 ? 5 : 3), 1, m % 6 === 0 ? 5 : 3, C[3]);
      const s = salto(t, T_NACIMIENTO);
      if (s !== null) { // una cuna sobre el inicio del eje (el nacimiento)
        const cx0 = ax - 4, cy0 = ay - 26 + s, C0 = R5.contorno; // cuna de 28×22 con barrotes, bebé arropado y patas
        rect(frente, cx0 - 1, cy0 + 5, 30, 18, C0);
        rect(frente, cx0, cy0 + 6, 28, 2, R5.naranja[3]); rect(frente, cx0, cy0 + 18, 28, 3, R5.naranja[2]); rect(frente, cx0, cy0 + 20, 28, 1, R5.naranja[1]);
        for (let k = 0; k < 28; k += 4) rect(frente, cx0 + k, cy0 + 8, 2, 10, R5.naranja[2]);
        rect(frente, cx0 + 4, cy0 + 11, 20, 7, "#5b8cff"); rect(frente, cx0 + 4, cy0 + 11, 20, 2, "#9fc4ff"); // manta
        disco(frente, cx0 + 8, cy0 + 11, 3, "#f2c4a0"); rect(frente, cx0 + 6, cy0 + 9, 4, 2, "#d8946c"); // cabeza
        rect(frente, cx0, cy0 + 23, 3, 3, R5.naranja[1]); rect(frente, cx0 + 25, cy0 + 23, 3, 3, R5.naranja[1]);
        rect(brillo, cx0 - 4, cy0 + 2, 36, 26, R5.naranja[1]);
      }
      if (t >= T_PRIMEROS) {
        const hasta = Math.round(aw * 0.42 * (Math.floor(prog(t, T_PRIMEROS, T_MESES + 0.3) * 6) / 6));
        rect(frente, ax + 2, ay - 2, hasta, 6, R5.naranja[1]); rect(frente, ax + 2, ay - 2, hasta, 1, R5.naranja[3]);
      }
    }
  }

  // ---------- el paquete que la cámara sigue hasta el laboratorio ----------
  function paquete(t, cam) {
    if (t < T_VIAJE || t >= T_LLEGA + 0.1) return;
    const { frente, brillo } = L, cxm = (M.SX - cam.tx) / cam.k, py = CORTO ? 150 : 70;
    const px = Math.round(cxm + 18 - 18 * prog(t, T_LLEGA - 0.3, T_LLEGA + 0.1));
    for (let k = 1; k <= 5; k++) rect(frente, px - 2 - k * 5, py + 1, 4 - Math.floor(k / 2), 2, R5.ia[Math.max(1, 4 - k)]); // estela
    disco(frente, px + 2, py + 2, 4, R5.contorno); disco(frente, px + 2, py + 2, 3, R5.ia[3]); rect(frente, px + 1, py + 1, 2, 2, R5.ia[4]);
    rect(brillo, px - 6, py - 6, 16, 16, R5.ia[2]);
  }

  // ---------- primer plano desenfocado (cruza en el travelling) ----------
  function delante() {
    const { delante } = L;
    rect(delante, 0, M.suelo, ANCHO.delante, H, "#07090f");
    const az = mulberry32(9);
    for (let x = -4; x < ANCHO.delante; x += 9) disco(delante, x, M.suelo + 2, Math.round(4 + az() * 4), "#05070b");
    [1.08, 1.24].forEach((f) => { // farolas que solo se ven a mitad del travelling (d = 1,35)
      const x = Math.round(W * f), top = Math.round(M.suelo * 0.3);
      rect(delante, x, top, 6, M.suelo - top, "#04060a"); rect(delante, x - 8, top, 22, 5, "#04060a");
    });
  }

  // ---------- MISTA ----------
  function mista(t) {
    if (t < T_SLIDE_FIN) { // entrada de tema: entero, delante de la ciudad; sale con el desplazamiento lateral
      const [gx, gy] = M.gato;
      gato(G12, Math.round(gx / 3), Math.round(gy / 3), { pose: t > 0.45 ? "senalar" : "pie", t, hablando: hablando(t) }, 1);
      G12.style.transform = t < T_SLIDE ? "" : `translateX(${-Math.round(prog(t, T_SLIDE, T_SLIDE_FIN) * W)}px)`;
      return;
    }
    G12.style.transform = "";
    if (t >= T_MISTA && t < T_MISTA_FIN) { // al cambiar de tema aparece de pie en el suelo del laboratorio, con un saltito
      const [ax, ay] = M.asoma, s = salto(t, T_MISTA) || 0;
      gato(G12, Math.round(ax / 3), Math.round(ay / 3) + s, { pose: t > T_LAMA ? "senalar" : "pie", t, hablando: hablando(t), espejo: !CORTO }, 1);
    }
  }

  // ---------- cámara ----------
  const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: MW, altoMundo: H, planos: [
    [0, "corte", 1, M.SX, M.SY],
    [T_ZOOM_A, "mover", ZOOM_A.k, ZOOM_A.cx, ZOOM_A.cy, ZOOM], // zoom core a la oficina: acercamiento de 0,4 s
    [T_CORTE, "corte", 1, M.SX, M.SY], // corte seco al general
    [T_VIAJE, "mover", 1, M.SX + W, M.SY, T_LLEGA - T_VIAJE], // travelling con paralaje hasta el laboratorio
    [T_ZOOM_B, "mover", ZOOM_B.k, ZOOM_B.cx, ZOOM_B.cy, ZOOM], // zoom core a la pantalla
  ] });
  const CAPAS = [
    { el: document.getElementById("p-lejos"), d: 0.6 },
    { el: document.getElementById("p-medio"), d: 1 },
    { el: document.getElementById("p-delante"), d: 1.35 },
  ];

  // ---------- caja de diálogo ----------
  const D6 = crearDialogo6({ T, ids: ["fr01", "fr02", "fr03"], claves: { fr01: "persona", fr02: "Mithril", fr03: "LAMA2" },
    maxc: CORTO ? 21 : 52, corto: CORTO, dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"),
    retrato: document.getElementById("retrato"), fuente: document.getElementById("fuente") });
  tildes6();

  // ---------- para el lint y el render ----------
  const MOVIMIENTOS = [[T_SLIDE, T_SLIDE_FIN], [T_ZOOM_A, T_ZOOM_A + ZOOM], [T_CORTE, T_CORTE + 0.02], [T_VIAJE, T_LLEGA], [T_ZOOM_B, T_ZOOM_B + ZOOM]];
  window.revision = { movimientos: MOVIMIENTOS, salidas: [T_VIAJE], llegadas: [T_SLIDE_FIN, T_LLEGA],
    claves: [{ t: T_ONCE, nombre: "los once laboratorios" }, { t: T_IA, nombre: "el orbe de la IA" }, { t: T_BIO, nombre: "el holograma" }, { t: T_DOS, nombre: "las dos distrofias" }] };
  window.claveFotograma = clave6((t) => MOVIMIENTOS.some(([a, b]) => t >= a && t < b));

  // ---------- sonido: atado a la pantalla ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    add(T_SLIDE, "destello"); // desplazamiento lateral al diorama
    add(T_LABS + 0.35, "tick"); // se completan los once laboratorios
    add(T_IA, "aparicion"); // el orbe de la IA
    add(T_BIO, "aparicion"); // se abre el holograma
    add(T_VIAJE, "destello"); // travelling hasta el laboratorio
    add(T_MISTA, "aparicion"); // MISTA se asoma
    add(T_LAMA, "seleccion"); // se marca LAMA2
    add(T_GRAVE, "error"); // la fuerza cae a la forma grave
    return ev;
  };

  window.seek = (t) => {
    Object.values(L).forEach((s) => s.replaceChildren()); G12.replaceChildren();
    const cam = CAM.en(t);
    CAM.aplicarCapas(cam, CAPAS);
    cielo(t);
    const enTema = t < T_SLIDE;
    ["p-medio", "p-delante"].forEach((id) => {
      const el = document.getElementById(id);
      el.style.visibility = enTema ? "hidden" : "visible";
      if (t >= T_SLIDE && t < T_SLIDE_FIN) el.style.transform = `translateX(${Math.round((1 - prog(t, T_SLIDE, T_SLIDE_FIN)) * W)}px)`;
    });
    if (!enTema) { edificios(t); oficina(t); ia(t); laboratorioB(t); paquete(t, cam); delante(); }
    mista(t);
    T6.ver(t);
    D6.pintar(t);
  };
  window.seek(0);
})();
