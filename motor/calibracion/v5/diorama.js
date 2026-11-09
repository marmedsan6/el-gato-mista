// Calibración v5 (2026-11-09): la idea se ve dibujada y se mueve; MISTA solo en los temas; más detalle.
// Diorama de fr01/fr04 de Mithril: delante, en grande, la oficina de la única persona (sujeto principal, con todo el
// detalle); detrás, la ciudad con los once laboratorios externos, que se encienden uno a uno entre «Once» y
// «laboratorios» como ventanas con su laboratorio dentro; con «IA» aparece un orbe junto al portátil que enlaza con
// cada laboratorio y les manda paquetes de datos.
// La maqueta se fija en px CSS (igual en las dos densidades) y se dibuja en unidades de arte (u = px/4 px CSS): en 4 px
// caben más píxeles en el mismo sitio; los objetos tienen tamaño fijo en píxeles de arte.
(() => {
  const Q = new URLSearchParams(location.search);
  const FORMATO = Q.get("formato") || "short", PX = Number(Q.get("px") || 4);
  const ESCENA = Q.get("escena") || "diorama", FUENTE = Q.get("fuente") || "propio";
  document.body.className = FORMATO;
  const W = FORMATO === "short" ? 270 : 480, H = FORMATO === "short" ? 480 : 270;
  const u = PX / 4, AW = Math.round(W / u), AH = Math.round(H / u);
  const U = (v) => Math.round(v / u); // px CSS → unidades de arte

  const T = window.TIMING;
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  const P = (fr, trozo) => FR[fr].palabras.find((w) => norm(w.p).includes(norm(trozo))).i;
  const T_PERSONA = P("fr01", "persona"), T_ONCE = P("fr01", "once"), T_LABS = P("fr01", "laboratorios"), T_IA = P("fr01", "ia");

  const L = {};
  for (const id of ["lejos", "medio", "brillo", "frente", "delante"]) {
    const s = document.getElementById(id);
    s.setAttribute("viewBox", `0 0 ${AW} ${AH}`); s.setAttribute("width", W); s.setAttribute("height", H);
    L[id] = s;
  }
  const G12 = document.getElementById("gato12");
  G12.setAttribute("viewBox", `0 0 ${W / 3} ${H / 3}`); G12.setAttribute("width", W); G12.setAttribute("height", H);

  // ---------- maqueta (px CSS) ----------
  const M = FORMATO === "short" ? {
    rotulo: [16, 64], etiqueta: [16, 86], fuente: [16, 97], suelo: 292,
    oficina: { x: 14, y: 182, w: 222, h: 110 },
    edificios: [ // x, y (techo), w, tipo
      [-6, 118, 70, "ladrillo"], [60, 132, 56, "cristal"], [112, 112, 64, "hormigon"], [172, 124, 58, "ladrillo"], [226, 104, 54, "cristal"],
    ],
    titular: [16, 120], gato: [20, 196],
  } : {
    rotulo: [16, 16], etiqueta: [16, 38], fuente: [16, 49], suelo: 198,
    oficina: { x: 14, y: 98, w: 236, h: 100 },
    edificios: [
      [236, 44, 58, "ladrillo"], [290, 60, 50, "cristal"], [336, 34, 60, "hormigon"], [392, 52, 52, "ladrillo"], [440, 40, 50, "cristal"],
      [-10, 58, 60, "hormigon"], [46, 70, 56, "cristal"], [100, 50, 60, "ladrillo"], [156, 64, 50, "hormigon"], [200, 46, 44, "cristal"],
    ],
    titular: [176, 76], gato: [60, 104],
  };
  const VENT = { w: 18, h: 15, gx: 22, gy: 20 }; // ventana y paso de la rejilla de fachada (px CSS)
  const RAMPA_FACHADA = {
    ladrillo: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e"],
    hormigon: ["#1a2030", "#252d40", "#323c54", "#45516c"],
    cristal: ["#101a2c", "#16243c", "#1d304e", "#2a4266"],
  };

  // ventanas de cada edificio (hasta el suelo) y los once laboratorios repartidos por la ciudad
  const VENTANAS = [];
  M.edificios.forEach(([x, y, w, tipo], n) => {
    const cols = Math.floor((w - 6) / VENT.gx);
    for (let fy = y + 10; fy + VENT.h < M.suelo - 4; fy += VENT.gy) for (let c = 0; c < cols; c++) VENTANAS.push({ x: x + 5 + c * VENT.gx, y: fy, n, tipo });
  });
  const visible = (v) => !(v.x + VENT.w > M.oficina.x - 2 && v.x < M.oficina.x + M.oficina.w + 2 && v.y + VENT.h > M.oficina.y - 6) && v.x >= 2 && v.x + VENT.w <= W - 2 && v.y > M.fuente[1] + 14;
  const candidatas = VENTANAS.filter(visible);
  const azarLab = mulberry32(5), LABS = [];
  while (LABS.length < 11 && candidatas.length) {
    const i = Math.floor(azarLab() * candidatas.length), v = candidatas.splice(i, 1)[0];
    if (LABS.every((l) => Math.abs(l.x - v.x) + Math.abs(l.y - v.y) > 30)) LABS.push(v);
  }
  LABS.sort((a, b) => a.x - b.x);
  LABS.forEach((l, k) => { l.lab = true; l.enciende = T_ONCE + ((k * 7) % 11) / 10 * (T_LABS + 0.35 - T_ONCE); l.semilla = 20 + k; });

  // ---------- textos ----------
  const caja = document.getElementById("textos");
  const nodos = [];
  function texto(desde, clase, html, [x, y], estilo = "") {
    const d = document.createElement("div");
    d.className = clase; d.innerHTML = html; d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`;
    d.dataset.desde = desde; d.dataset.y = y; caja.appendChild(d); nodos.push(d);
  }
  if (ESCENA === "diorama") {
    texto(T_PERSONA, "rotulo", 'Una <span class="clave">persona</span>', M.rotulo);
    texto(T_IA, "insignia", "+ IA", [M.rotulo[0] + 110, M.rotulo[1]], "border:1px solid var(--texto)");
    texto(T_LABS, "etiqueta", '<span style="font:600 12px/10px Mono;color:var(--verde)">11</span> laboratorios externos', M.etiqueta);
    texto(T_LABS, "fuente-dato con-fondo", "Fuente: Anthropic", M.fuente);
  } else {
    texto(0, "rotulo", 'Tema <span class="clave">1</span>', M.rotulo);
    texto(0, "titular grande", 'Mithril<br><span class="clave">Medicine</span>', M.titular);
  }
  tildesPixel();
  function verTextos(t) {
    nodos.forEach((d) => {
      const a = Number(d.dataset.desde), s = t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0;
      d.classList.toggle("oculto", s === null);
      if (s !== null) d.style.top = `${Number(d.dataset.y) + s}px`;
    });
  }

  // ---------- cielo y ciudad lejana (lejos, desenfocado) ----------
  function cielo(t) {
    const { lejos } = L, S = U(M.suelo);
    const bandas = [...R5.cielo].reverse(), alto = Math.ceil(S / bandas.length);
    bandas.forEach((c, i) => { rect(lejos, 0, i * alto, AW, alto, c); if (i) tramado5(lejos, 0, i * alto, AW, 2, bandas[i - 1], i); });
    const azar = mulberry32(3);
    for (let k = 0; k < 50; k++) {
      const x = Math.floor(azar() * AW), y = Math.floor(azar() * S * 0.45), f = azar();
      if (Math.floor(t * 2 + f * 7) % 7 !== 0) rect(lejos, x, y, 1, 1, f < 0.3 ? "#f5f7fb" : "#8a93c0");
    }
    const lx = U(W * 0.8), ly = U(H * (FORMATO === "short" ? 0.155 : 0.1));
    disco(lejos, lx, ly, U(10), "#d8d0b4"); disco(lejos, lx - 1, ly - 1, U(8), "#f2ecd4"); disco(lejos, lx + U(3), ly - U(2), U(2), "#d8d0b4");
    const az = mulberry32(21);
    let x = -U(4);
    while (x < AW) {
      const w = U(10 + az() * 18), h = U(M.suelo * (0.5 + az() * 0.3));
      rect(lejos, x, S - h, w, h, R5.ciudad[1]);
      for (let wy = S - h + U(3); wy < S; wy += U(5)) for (let wx = x + U(2); wx < x + w - U(2); wx += U(4)) if (az() < 0.18) rect(lejos, wx, wy, Math.max(1, U(2)), Math.max(1, U(2)), R5.ventana[0]);
      x += w + U(1 + az() * 4);
    }
  }

  // ---------- edificios del plano medio con sus ventanas (los 11 laboratorios incluidos) ----------
  function edificios(t) {
    const { medio, brillo } = L;
    M.edificios.forEach(([ex, ey, ew, tipo], n) => {
      const x = U(ex), y = U(ey), w = U(ew), h = U(M.suelo) - y, r = RAMPA_FACHADA[tipo];
      rect(medio, x, y, w, h, R5.contorno);
      rect(medio, x + 1, y + 1, w - 2, h - 1, r[1]);
      rect(medio, x + 1, y + 1, 1, h - 1, r[3]); rect(medio, x + w - 2, y + 1, 1, h - 1, r[0]);
      if (tipo === "ladrillo") for (let yy = y + 3; yy < y + h; yy += 3) for (let xx = x + 2 + ((yy / 3) % 2 ? 0 : 2); xx < x + w - 3; xx += 5) rect(medio, xx, yy, 3, 1, r[2]);
      if (tipo === "cristal") for (let xx = x + 3; xx < x + w - 2; xx += 4) rect(medio, xx, y + 2, 1, h - 2, r[2]);
      if (tipo === "hormigon") for (let yy = y + U(VENT.gy) - 2; yy < y + h; yy += U(VENT.gy)) rect(medio, x + 2, yy, w - 4, 1, r[2]);
      // azotea: cornisa, depósito de agua o antena con luz roja que parpadea
      rect(medio, x - 1, y - 1, w + 2, 2, r[3]); rect(medio, x - 1, y - 1, w + 2, 1, R5.contorno);
      if (n % 2 === 0) { const dx = x + Math.round(w * 0.55); rect(medio, dx, y - U(9), U(10), U(7), R5.contorno); rect(medio, dx + 1, y - U(9) + 1, U(10) - 2, U(7) - 2, R5.hormigon[2]); rect(medio, dx + 1, y - U(9) + 1, U(10) - 2, 1, R5.hormigon[4]); rect(medio, dx + 2, y - 2, 1, 2, R5.hormigon[1]); rect(medio, dx + U(10) - 3, y - 2, 1, 2, R5.hormigon[1]); }
      else { const ax = x + Math.round(w * 0.3); rect(medio, ax, y - U(14), 1, U(13), R5.metal[2]); if (Math.floor(t / 0.6 + n) % 2 === 0) { rect(medio, ax - 1, y - U(14) - 1, 3, 2, "#e0454f"); rect(brillo, ax - 2, y - U(14) - 2, 5, 4, "#e0454f"); } }
    });
    VENTANAS.forEach((v) => (v.lab ? laboratorio(v, t) : ventana(v, t)));
  }
  function ventana(v, t) {
    const { medio } = L, x = U(v.x), y = U(v.y), w = U(VENT.w), h = U(VENT.h);
    rect(medio, x, y, w, h, R5.contorno);
    const az = mulberry32(Math.round(v.x * 7 + v.y * 13)), luz = az() < 0.16;
    rect(medio, x + 1, y + 1, w - 2, h - 2, luz ? "#3a2c1c" : "#0c121c");
    if (luz) { rect(medio, x + 1, y + 1, w - 2, 1, "#5a4228"); rect(medio, x + 2, y + h - 3, Math.round(w * 0.4), 1, "#5a4228"); }
    rect(medio, x + Math.floor(w / 2), y + 1, 1, h - 2, R5.contorno);
    if (!luz) rect(medio, x + 1, y + 1, 1, Math.max(1, Math.floor(h / 3)), "#1a2436"); // reflejo
  }
  // Una ventana de laboratorio: apagada hasta su momento; luego parpadea y queda encendida con el laboratorio dentro
  function laboratorio(v, t) {
    const { medio, brillo, frente } = L, x = U(v.x), y = U(v.y), w = U(VENT.w), h = U(VENT.h);
    const on = t >= v.enciende && !(t < v.enciende + 0.15 && Math.floor((t - v.enciende) / 0.05) % 2 === 1);
    rect(medio, x - 1, y - 1, w + 2, h + 2, R5.contorno);
    if (!on) { rect(medio, x, y, w, h, "#0c121c"); rect(medio, x + Math.floor(w / 2), y, 1, h, R5.contorno); return; }
    rect(brillo, x - 2, y - 2, w + 4, h + 4, R5.labLuz[2]);
    pared5(medio, x, y, w, h, R5.labLuz.slice(1, 5));
    rect(medio, x + 1, y, w - 2, 1, R5.labLuz[4]); // tubo de luz
    const banco = y + h - Math.max(3, Math.round(h * 0.3)), acento = [R5.verde, R5.naranja, R5.ia][v.semilla % 3];
    rect(frente, x, banco, w, y + h - banco, R5.metal[1]); rect(frente, x, banco, w, 1, R5.metal[3]);
    // matraz o tubo y un brazo robótico que se mueve; en 4 px cabe además una pantalla
    matraz5(frente, x + 1, banco - 7, t, acento[2], acento[1], v.semilla);
    if (w >= 12) { const mx = x + 7, mh = 4; rect(frente, mx, banco - mh - 1, 5, mh, R5.contorno); rect(frente, mx + 1, banco - mh, 3, mh - 2, Math.floor(t * 4 + v.semilla) % 3 ? acento[3] : acento[2]); }
    brazo5(frente, x + w - 4, banco - 3, t, { largo: Math.max(3, Math.round(w / 4)), fase: v.semilla, color: acento });
    rect(frente, x + Math.floor(w / 2), y, 1, Math.max(1, banco - y - (h >= 12 ? 8 : 5)), R5.contorno); // parteluz arriba
  }

  // ---------- la oficina (sujeto principal) ----------
  function oficina(t) {
    const { medio, brillo, frente, delante } = L, o = M.oficina;
    const x = U(o.x), y = U(o.y), w = U(o.w), h = U(o.h), muro = Math.max(2, U(4));
    // caja del edificio en corte: losa superior gruesa con su canto y muros laterales
    rect(medio, x - 1, y - muro - 1, w + 2, h + muro + 1, R5.contorno);
    rect(medio, x, y - muro, w, muro, R5.hormigon[2]); rect(medio, x, y - muro, w, 1, R5.hormigon[4]); rect(medio, x, y - 1, w, 1, R5.hormigon[0]);
    const ix = x + muro, iy = y, iw = w - 2 * muro, ih = h;
    rect(medio, x, iy, muro, ih, R5.hormigon[1]); rect(medio, x + w - muro, iy, muro, ih, R5.hormigon[1]); rect(medio, x, iy, 1, ih, R5.hormigon[3]);
    // pared cálida en bandas con tramado entre bandas y zócalo
    const banda = R5.oficina.slice(0, 4).reverse(), bh = Math.ceil(ih * 0.7 / banda.length);
    banda.forEach((c, i) => { rect(medio, ix, iy + i * bh, iw, bh, c); if (i) tramado5(medio, ix, iy + i * bh, iw, 1, banda[i - 1], i); });
    const suelo = iy + Math.round(ih * 0.7);
    rect(medio, ix, suelo - 2, iw, 2, R5.oficina[0]);
    for (let j = 0; suelo + j < iy + ih; j += 3) { rect(medio, ix, suelo + j, iw, 3, j % 2 ? "#3a2418" : "#44291b"); for (let k = (j * 7) % 13; k < iw; k += 13) rect(medio, ix + k, suelo + j, 1, 3, "#2c1b12"); }
    // ventana con la noche y una persiana a medio bajar
    const vx = ix + Math.round(iw * 0.08), vy = iy + Math.round(ih * 0.12), vw = Math.max(16, U(46)), vh = Math.max(12, U(34));
    rect(medio, vx - 1, vy - 1, vw + 2, vh + 2, R5.contorno); rect(medio, vx, vy, vw, vh, "#0e1630");
    for (let k = 0; k < 6; k++) rect(medio, vx + 2 + k * Math.floor(vw / 6), vy + vh - 2 - (k * 5) % Math.floor(vh / 2), Math.max(2, Math.floor(vw / 8)), (k * 5) % Math.floor(vh / 2) + 2, "#141d3c");
    rect(medio, vx, vy, vw, Math.round(vh * 0.35), "#c9b48a"); for (let yy = vy + 1; yy < vy + Math.round(vh * 0.35); yy += 2) rect(medio, vx, yy, vw, 1, "#a8946c");
    rect(medio, vx + Math.floor(vw / 2), vy, 1, vh, R5.contorno); rect(medio, vx - 2, vy + vh + 1, vw + 4, 2, R5.oficina[3]);
    // estantería con libros y un bote de muestras
    const sx = ix + iw - Math.max(22, U(64)), sw = Math.max(18, U(54)), sy = iy + Math.round(ih * 0.08), sh = suelo - sy;
    rect(medio, sx - 1, sy - 1, sw + 2, sh + 1, R5.contorno); rect(medio, sx, sy, sw, sh, "#4a2e1e"); rect(medio, sx, sy, 1, sh, "#6b4430");
    const az = mulberry32(8), baldas = 3, paso = Math.floor(sh / baldas);
    for (let b = 0; b < baldas; b++) {
      const by = sy + (b + 1) * paso - 2;
      rect(medio, sx, by, sw, 2, "#6b4430"); rect(medio, sx, by + 1, sw, 1, "#2c1b12");
      let bx = sx + 2;
      while (bx < sx + sw - 4) {
        const lw = 2 + Math.floor(az() * 3), lh = Math.min(paso - 4, 5 + Math.floor(az() * Math.max(3, paso - 8))), col = ["#8a3a3a", "#3a5fc0", "#1f7a5a", "#c2862e", "#5a3a7a", "#a85a2a"][Math.floor(az() * 6)];
        if (az() < 0.85) { rect(medio, bx, by - lh, lw, lh, col); rect(medio, bx, by - lh, 1, lh, "#f5f7fb22"); rect(medio, bx, by - lh + 1, lw, 1, "#00000044"); }
        else { matraz5(medio, bx, by - 7, t, R5.verde[2], R5.verde[1], b + 3); bx += 3; }
        bx += lw + (az() < 0.2 ? 2 : 0);
      }
    }
    // planta grande con hojas que se mecen a escalones
    const px0 = ix + Math.round(iw * 0.03), pyb = iy + ih - 2;
    rect(frente, px0, pyb - 8, 10, 8, R5.contorno); rect(frente, px0 + 1, pyb - 7, 8, 7, "#a85a2a"); rect(frente, px0 + 1, pyb - 7, 8, 1, "#d07a3a");
    const vaiven = [0, 1, 0, -1][Math.floor(t / 0.5) % 4];
    [[-6, -18], [-2, -24], [3, -21], [7, -15], [-8, -11], [9, -9]].forEach(([dx, dy], k) => {
      const lx = px0 + 5 + dx + (k % 2 ? vaiven : 0), ly = pyb - 8 + dy;
      linea(frente, px0 + 5, pyb - 8, lx, ly, "#13936a", 1);
      rect(frente, lx - 1, ly - 1, 3, 2, k % 2 ? "#1fd69a" : "#13936a");
    });
    // mesa, flexo, portátil, taza y papeles; la persona detrás
    const mx = ix + Math.round(iw * 0.3), mw = Math.round(iw * 0.42), my = suelo - Math.max(4, U(10));
    const cx = mx + Math.floor(mw / 2) - 13;
    // silla (respaldo detrás de la persona)
    rect(medio, cx, my - 34, 26, 32, R5.contorno); rect(medio, cx + 1, my - 33, 24, 30, "#262b48"); rect(medio, cx + 1, my - 33, 24, 1, "#3a4166"); rect(medio, cx + 1, my - 33, 1, 30, "#3a4166");
    const cabeceo = Math.floor(t * 1.6) % 5 === 0 ? 1 : 0;
    persona5(frente, cx, my - 31 + cabeceo, t);
    rect(frente, mx - 1, my - 1, mw + 2, 4, R5.contorno); rect(frente, mx, my, mw, 2, "#8a6242"); rect(frente, mx, my, mw, 1, "#a87a52");
    rect(frente, mx + 1, my + 3, 2, suelo + Math.round((iy + ih - suelo) * 0.6) - my - 3, "#4a3526"); rect(frente, mx + mw - 3, my + 3, 2, suelo + Math.round((iy + ih - suelo) * 0.6) - my - 3, "#4a3526");
    rect(frente, mx + 4, my + 3, Math.round(mw * 0.3), 6, "#6b4a32"); rect(frente, mx + 4, my + 3, Math.round(mw * 0.3), 1, "#8a6242"); rect(frente, mx + 4 + Math.round(mw * 0.15) - 1, my + 5, 3, 1, "#c2862e");
    // portátil: tapa vista por detrás, con el logo que se ilumina con la IA; manos que teclean a escalones
    const lx = cx + 3, ly = my - 13;
    rect(frente, lx - 1, ly - 1, 22, 14, R5.contorno); rect(frente, lx, ly, 20, 13, "#5a6390"); rect(frente, lx, ly, 20, 1, "#8a93c0"); rect(frente, lx, ly, 1, 13, "#8a93c0");
    rect(frente, lx + 19, ly + 1, 1, 12, "#3a4166"); rect(frente, lx + 1, ly + 12, 19, 1, "#3a4166");
    rect(frente, lx + 8, ly + 5, 4, 3, t >= T_IA ? R5.ia[3] : "#3a4166"); if (t >= T_IA) rect(frente, lx + 9, ly + 5, 2, 1, R5.ia[4]);
    const tecla = Math.floor(t * 6) % 2;
    rect(frente, lx - 4, my - 3 - tecla, 4, 3, R5.contorno); rect(frente, lx - 3, my - 2 - tecla, 3, 2, "#e0a47c");
    rect(frente, lx + 20, my - 3 - (1 - tecla), 4, 3, R5.contorno); rect(frente, lx + 20, my - 2 - (1 - tecla), 3, 2, "#e0a47c");
    if (t >= T_IA) { for (let j = 0; j < 8; j++) rect(brillo, lx - 3 - j, ly - 3 - j * 2, 26 + 2 * j, 2, R5.ia[1]); }
    // flexo con su cono de luz cálida
    const fx = mx + mw - 10;
    rect(frente, fx, my - 1, 6, 1, R5.contorno); linea(frente, fx + 3, my - 1, fx + 6, my - 9, R5.contorno, 1); linea(frente, fx + 6, my - 9, fx + 1, my - 13, R5.contorno, 1);
    rect(frente, fx - 2, my - 15, 5, 3, "#c2862e"); rect(frente, fx - 1, my - 12, 3, 1, "#fff1c4");
    for (let j = 0; j < 11; j++) rect(brillo, fx - 1 - Math.floor(j * 0.7), my - 11 + j, 3 + Math.floor(j * 1.4), 1, "#7a5a30");
    // taza con vapor y papeles con una hélice de ADN dibujada
    const tx = mx + 3; rect(frente, tx, my - 4, 4, 4, R5.contorno); rect(frente, tx + 1, my - 3, 2, 3, "#f5f7fb"); rect(frente, tx + 4, my - 3, 1, 2, R5.contorno);
    const v = Math.floor(t * 3) % 3; rect(frente, tx + 1 + (v % 2), my - 6 - v, 1, 1, "#c9d2e8"); rect(frente, tx + 2 - (v % 2), my - 8 - v, 1, 1, "#9aa4c0");
    const ppx = mx + mw - 26; rect(frente, ppx, my - 2, 9, 2, "#efe6d2"); rect(frente, ppx + 1, my - 3, 9, 1, "#fbf6ea");
    // prueba de fuente: iconos del atlas (16×16, a su tamaño de píxel) en la mesa y encima de la estantería
    if (FUENTE === "atlas" && window.ATLAS) {
      atlas5(frente, ppx - 18, my - 16, window.ATLAS.microscope);
      atlas5(medio, sx + 2, sy - 16, window.ATLAS.dna);
      atlas5(medio, sx + sw - 18, sy - 16, window.ATLAS.robot);
    }
    // cuadro con una hélice de ADN en la pared
    const qx = ix + Math.round(iw * 0.46), qy = iy + Math.round(ih * 0.1);
    if (!(qx + 20 < cx || qx > cx + 26 || qy + 16 < my - 34)) { /* chocaría con la persona: sin cuadro */ } else {
    rect(medio, qx - 1, qy - 1, 20, 16, R5.contorno); rect(medio, qx, qy, 18, 14, "#efe6d2");
    for (let k = 0; k < 12; k++) { const a = Math.sin(k / 12 * Math.PI * 2) * 4; rect(medio, qx + 3 + k, Math.round(qy + 7 + a), 1, 1, "#e0454f"); rect(medio, qx + 3 + k, Math.round(qy + 7 - a), 1, 1, "#3a5fc0"); if (k % 3 === 0) rect(medio, qx + 3 + k, Math.round(qy + 7 - Math.abs(a)), 1, Math.round(Math.abs(a) * 2), "#8a93a6"); } }
    // la IA: orbe junto al portátil, con enlaces a los laboratorios encendidos
    if (t >= T_IA) {
      const ox = cx - Math.max(10, U(16)), oy = my - 30, r =Math.max(3, U(6)) - (t < T_IA + 0.075 ? 2 : t < T_IA + 0.15 ? 1 : 0);
      LABS.forEach((l, k) => {
        if (t < l.enciende) return;
        const destino = [U(l.x + VENT.w / 2), U(l.y + VENT.h)];
        ruta(L.medio, brillo, [[ox, oy], [ox, Math.min(oy, y - muro - 3)], [destino[0], Math.min(oy, y - muro - 3)], destino], t, k * 0.13, t >= T_IA + 0.2);
      });
      orbe5(frente, brillo, ox, oy - (Math.floor(t * 2) % 2), r, t);
    }
  }
  function ruta(medio, brillo, pts, t, fase, activo) {
    let largo = 0;
    for (let i = 1; i < pts.length; i++) largo += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
    // la línea se dibuja creciendo durante 0,4 s desde el orbe (no aparece de golpe)
    for (let i = 1; i < pts.length; i++) linea(medio, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], activo ? R5.ia[1] : R5.ia[0]);
    if (!activo) return;
    let d = ((t * 0.7 + fase) % 1) * largo;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
      if (d <= seg) {
        const f = seg ? d / seg : 0, px = Math.round(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f), py = Math.round(pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f);
        rect(medio, px - 1, py - 1, 2, 2, R5.ia[4]); rect(brillo, px - 2, py - 2, 4, 4, R5.ia[3]);
        return;
      }
      d -= seg;
    }
  }

  // ---------- primer plano desenfocado ----------
  function delante() {
    const { delante } = L;
    rect(delante, 0, U(M.suelo), AW, AH, "#07090f");
    const az = mulberry32(9);
    for (let x = -U(4); x < AW; x += U(9)) disco(delante, x, U(M.suelo) + U(2), U(4 + az() * 4), "#05070b");
  }

  // ---------- MISTA en la entrada de tema (12 px) ----------
  function tema(t) {
    L.medio.style.filter = "blur(1.5px)"; // los edificios se van atrás: MISTA es el único plano nítido
    edificios(t);
    const [gx, gy] = M.gato;
    rect(L.medio, 0, U(M.suelo), AW, AH - U(M.suelo), "#10131c");
    gato(G12, Math.round(gx / 3), Math.round(gy / 3), { pose: t > 0.6 ? "senalar" : "pie", t, hablando: true }, 1);
  }

  // ---------- caja de diálogo ----------
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  const MAXC = FORMATO === "short" ? 21 : 52;
  const PAGINAS = [];
  const nLineas = (ps) => ps.reduce((acc, p) => { const v = acc[acc.length - 1]; if (v && v.length + 1 + p.p.length <= MAXC) acc[acc.length - 1] = `${v} ${p.p}`; else acc.push(p.p); return acc; }, []).length;
  ["fr01", "fr02"].forEach((id) => {
    let actual = [];
    FR[id].palabras.forEach((p, k, todas) => {
      actual.push(p);
      if (k === todas.length - 1 || /[.:?!]$/.test(p.p) || nLineas([...actual, todas[k + 1]]) > 2) { PAGINAS.push({ fr: id, palabras: actual, i: actual[0].i }); actual = []; }
    });
  });
  const dialogo = document.getElementById("dialogo"), fraseEl = document.getElementById("frase");
  function pintarDialogo(t) {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    svgRetrato.replaceChildren(); retratoGato(svgRetrato, 5, 4.5, { t }, 1.5);
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length;
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,]$/, ""), c = ["laboratorios", "ia", "persona"].includes(norm(nucleo)) ? `<span class="sel">${nucleo}<i></i></span>${p.p.slice(nucleo.length)}` : p.p;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ");
  }

  window.seek = (t) => {
    Object.values(L).forEach((s) => s.replaceChildren()); G12.replaceChildren();
    cielo(t);
    if (ESCENA === "tema") tema(t);
    else { edificios(t); oficina(t); }
    delante();
    verTextos(t);
    pintarDialogo(t);
  };
  window.seek(0);
})();
