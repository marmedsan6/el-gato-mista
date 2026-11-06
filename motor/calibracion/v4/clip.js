// Calibración v4 (iteración de detalle, 2026-11-06): la cámara de ref-01 (docs/estilo/analisis/ref-01-camara.md),
// efectos de pixelfx (motor/estilo/v3/fx.js) y los objetos con más detalle (v3/props.js). MISTA, tal cual (v3).
// Tramo real de Mithril: bloque A (0-19,9 s) con su voz. Un laboratorio ancho de 3 pantallas con una estación por idea:
//   1 · corcho con «1 persona · 11 laboratorios · + IA»   2 · la ficha de Mithril   3 · el microscopio y el gen LAMA2.
// Cámara: acercamiento lento, travelling con paralaje entre estaciones (fondo a 0,6, primer plano a 1,35), zoom core en
// la ficha y «revelar» (travelling + alejamiento a la vez) hasta la tercera. MISTA se queda en la primera y reaparece en
// la tercera. Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  const W = 270, H = 480, U = 3; // pantalla en px CSS; 1 unidad de arte = 3 px CSS = 12 px de salida
  const ANCHO = 360; // unidades de cada lienzo: el primer plano (d = 1,35) recorre más mundo que el plano medio (270)
  const SUELO = 97, MESA = 85;
  const DURACION = 19.9;
  const T = window.TIMING;
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const PALABRAS = T.frases.flatMap((f) => f.palabras);
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  function P(fr, trozo) {
    const p = FR[fr].palabras.find((w) => norm(w.p).includes(norm(trozo)));
    if (!p) throw new Error(`No encuentro «${trozo}» en ${fr}`);
    return p.i;
  }
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const paso = (v, p) => Math.floor(v / p + 1e-9) * p;
  const salto = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);
  const s1 = (t, a) => (salto(t, a) === -2 ? -1 : salto(t, a) === null ? null : 0); // salto en unidades de 12 px
  const hablando = (t) => PALABRAS.some((p) => t >= p.i && t <= p.f);

  // ---------- tiempos de cámara ----------
  const VIAJE2 = FR.fr01.fin + 0.07, LLEGA2 = VIAJE2 + 1.1; // travelling a la ficha, entre frases
  const ZOOM2 = P("fr02", "empleado"); // core: 1 empleado y la misión
  const REVELA = FR.fr03.inicio, LLEGA3 = REVELA + 1.3; // la última línea de la ficha se ve entera ≥ 1,5 s // travelling + alejamiento hasta el microscopio
  const LAMA = P("fr03", "LAMA2");

  // ---------- lienzos (unidades; 1 pantalla = 90×160) ----------
  const L = {};
  for (const id of ["lejos", "medio", "brillo", "frente", "delante"]) {
    L[id] = lienzo(id);
    L[id].setAttribute("viewBox", `0 0 ${ANCHO} 160`);
    L[id].setAttribute("width", ANCHO * U); L[id].setAttribute("height", 480);
  }
  const caja = document.getElementById("textos"), cajaUI = document.getElementById("textos-ui"), fuentes = document.getElementById("fuentes");
  const nodos = {};
  function texto(id, desde, hasta, clase, html, x, y, estilo = "", ui = false) {
    const d = document.createElement("div");
    d.className = `${clase} oculto`; d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`;
    Object.assign(d.dataset, { x, y, desde, hasta });
    (ui ? cajaUI : clase.includes("fuente-dato") ? fuentes : caja).appendChild(d); nodos[id] = d;
  }
  function ver(t) {
    Object.values(nodos).forEach((d) => {
      const s = salto(t, Number(d.dataset.desde)), visible = s !== null && t < Number(d.dataset.hasta);
      d.classList.toggle("oculto", !visible);
      if (visible) d.style.top = `${Number(d.dataset.y) + s}px`;
    });
  }

  // ---------- estaciones: x de su pantalla (unidades) y tarjetas ----------
  const E1 = 0, E2 = 90, E3 = 180;
  const TARJ1 = { x: E1 + 7, y: 34, w: 44, h: 31 }; // tableros a ≥ 2 unidades del rótulo de cabecera
  const TARJ2 = { x: E2 + 16, y: 32, w: 58, h: 36 };
  const TARJ3 = { x: E3 + 6, y: 33, w: 46, h: 31 };
  const tx = (tj, dx = 9) => tj.x * U + dx; // x CSS del texto dentro de una tarjeta
  const FIN = 99;
  // 1 · una persona, once laboratorios y la IA
  texto("e1-uno", P("fr01", "persona"), FIN, "tarjeta-texto", "<b style='font-size:16px'>1</b> persona", tx(TARJ1), 110);
  texto("e1-labs", P("fr01", "laboratorios"), FIN, "tarjeta-texto", "11 laboratorios", tx(TARJ1), 178);
  texto("e1-fte", P("fr01", "laboratorios"), FIN, "fuente-dato con-fondo", "Fuente: Anthropic", E1 * U + 26, 198); // x 26: con el acercamiento (k 13/12) queda a ≥ 16 px del borde
  // 2 · la ficha de Mithril
  texto("e2-fun", FR.fr02.inicio, FIN, "tarjeta-texto", "C. Tranbarger", tx(TARJ2, 21), 106);
  texto("e2-bio", P("fr02", "biotecnologica"), FIN, "tarjeta-texto", "Biotecnológica", tx(TARJ2), 122);
  texto("e2-emp", P("fr02", "empleado"), FIN, "tarjeta-texto", "Empleados: <b style='font-size:16px'>1</b>", tx(TARJ2), 136);
  texto("e2-mis", P("fr02", "buscar"), FIN, "tarjeta-texto", "Misión:", tx(TARJ2), 158, "color:#b4622a");
  texto("e2-m1", P("fr02", "tratamientos"), FIN, "tarjeta-texto", "tratar", tx(TARJ2) + 64, 158);
  texto("e2-m2", P("fr02", "distrofias"), FIN, "tarjeta-texto", "2 distrofias<br>musculares raras", tx(TARJ2), 171);
  texto("e2-fte", P("fr02", "distrofias"), FIN, "fuente-dato con-fondo", "Fuente: Anthropic", E2 * U + 16, 216);
  // 3 · el gen LAMA2
  texto("e3-fz", FR.fr03.inicio, FIN, "tarjeta-texto", "Fuerza:", tx(TARJ3), 106);
  texto("e3-g1", P("fr03", "grave"), FIN, "tarjeta-texto", "Forma grave:", tx(TARJ3), 138, "color:#b4622a");
  texto("e3-g2", P("fr03", "nacimiento"), FIN, "tarjeta-texto", "al nacer o en", tx(TARJ3), 150);
  texto("e3-g3", P("fr03", "primeros"), FIN, "tarjeta-texto", "los primeros", tx(TARJ3), 162);
  texto("e3-g4", P("fr03", "meses"), FIN, "tarjeta-texto", "meses", tx(TARJ3), 174);
  texto("e3-fte", P("fr03", "nacimiento"), FIN, "fuente-dato con-fondo", "Fuente:<br>MedlinePlus", E3 * U + 26, 200);
  // Rótulos de cabecera (interfaz fija): cambian a mitad de cada travelling
  texto("r1", 0, VIAJE2 + 0.55, "rotulo", 'Una <span class="clave">persona</span>', 16, 64, "", true);
  texto("r1-ia", P("fr01", "ia"), VIAJE2 + 0.55, "insignia", "+ IA", 126, 64, "border:1px solid var(--texto)", true);
  texto("r2", VIAJE2 + 0.55, REVELA + 0.7, "rotulo", '<span class="clave">Mithril</span> Medicine', 16, 64, "", true);
  texto("r3", REVELA + 0.7, FIN, "rotulo", 'Gen <span class="clave">LAMA2</span>', 16, 64, "", true);
  tildesPixel();

  // ---------- el laboratorio ancho ----------
  function laboratorio(t) {
    const { lejos, medio, brillo, delante } = L;
    // Pared de azulejos (lejos, d = 0,6: en reposo se ve x 0-90, 54-144 y 108-198 en cada estación)
    bandas(lejos, 0, SUELO, ["#17303a", "#1a3540", "#1d3b47", "#20414e"]);
    for (let y = 8; y < MESA; y += 6) rect(lejos, 0, y, ANCHO, 1, "#24485a");
    for (let x = 3; x < ANCHO; x += 6) rect(lejos, x, 8, 1, MESA - 8, "#1b3a46");
    // Ventanas con la ciudad de noche (una por estación, en coordenadas del fondo) y un avión que cruza la primera
    // pizarra con fórmulas en el fondo de la estación 2 (rompe la repetición de ventanas)
    rect(lejos, 100, 26, 34, 24, "#3a2a1c"); rect(lejos, 101, 27, 32, 22, "#1f3a2e");
    const tiza = mulberry32(12);
    for (let j = 0; j < 5; j++) { let x = 104; while (x < 128) { const w = 1 + Math.floor(tiza() * 4); if (tiza() < 0.75) rect(lejos, x, 30 + j * 4, w, 1, "#c9d8cf"); x += w + 1; } }
    rect(lejos, 100, 50, 34, 1, P3.maderaLuz);
    [[60, 31], [160, 53]].forEach(([vx, semilla], n) => {
      const vy = 30;
      rect(lejos, vx, vy, 26, 24, "#0b1022");
      const azar = mulberry32(semilla);
      for (let k = 0; k < 5; k++) {
        const bh = 6 + Math.floor(azar() * 12), bx = vx + 1 + k * 5;
        rect(lejos, bx, vy + 24 - bh, 4, bh, "#1b2142");
        for (let j = 1; j < bh - 1; j += 3) if (azar() < 0.6) rect(lejos, bx + 1, vy + 24 - bh + j, 1, 1, "#f2c14e");
      }
      rect(lejos, vx - 1, vy - 1, 28, 1, "#0d1418"); rect(lejos, vx - 1, vy + 24, 28, 1, "#0d1418");
      rect(lejos, vx - 1, vy, 1, 24, "#0d1418"); rect(lejos, vx + 26, vy, 1, 24, "#0d1418"); rect(lejos, vx + 12, vy, 1, 24, "#0d1418");
      if (n === 0) {
        const ax = vx + Math.floor(((t % 12) / 12) * 40) - 7;
        if (ax >= vx && ax < vx + 25) { rect(lejos, ax, vy + 5, 2, 1, "#c9d2ff"); if (Math.floor(t / 0.4) % 2 === 0) rect(lejos, ax + 2, vy + 5, 1, 1, "#e0454f"); }
      }
      // estante de reactivos bajo cada ventana, con una burbuja que sube por cada bote
      rect(lejos, vx - 2, vy + 33, 30, 1, P3.maderaSombra);
      ["#1fd69a", "#ff8a3d", "#5b8cff", "#e0454f", "#f2c14e", "#c07ad8"].forEach((c, k) => {
        bote3(lejos, vx + k * 5, vy + 28, c);
        const sube = Math.floor(((t + k * 0.37 + n) % 1.6) / 0.4);
        if (sube < 3) rect(lejos, vx + k * 5 + 1, vy + 31 - sube, 1, 1, "#f5f7fb");
      });
    });
    // Lámparas de techo (una por estación) con su cono de luz cálida y polvo
    [E1 + 45, E2 + 45, E3 + 45].forEach((cx, k) => {
      const v = [0, 1, 0, -1][Math.floor(t / 0.9 + k) % 4], lx = cx + v;
      rect(medio, cx, 0, 1, 7, "#0d1418"); rect(medio, lx - 4, 7, 8, 2, "#2b3b44"); rect(medio, lx - 4, 7, 8, 1, "#3e5260");
      rect(medio, lx - 1, 9, 2, 1, "#fff1c4");
      cono3(brillo, lx, 10, SUELO, "#5a4630", 0.32);
      motas3(brillo, t, lx, 12, 16, 14, 77 + k);
    });
    // Mesa corrida (medio) con patas en cada estación
    rect(medio, 0, MESA, 270, 2, P3.maderaLuz); rect(medio, 0, MESA + 2, 270, 1, P3.maderaSombra);
    for (const x of [3, 84, 93, 174, 183, 264]) { rect(medio, x, MESA + 3, 3, SUELO - MESA - 3, P3.maderaSombra); rect(medio, x, MESA + 3, 1, SUELO - MESA - 3, P3.madera); }
    // Suelo de baldosas (delante, desenfocado) y dos estanterías en primer plano que solo cruzan en los travellings
    // (d = 1,35: x 106 y 227 del primer plano quedan en el centro a mitad de cada travelling y fuera en reposo)
    rect(delante, 0, SUELO, ANCHO, 160 - SUELO, "#0f1a20");
    for (let y = SUELO; y < 160; y += 4) for (let x = ((y - SUELO) / 4) % 2 ? 0 : 4; x < ANCHO; x += 8) rect(delante, x, y, 4, 4, "#14242c");
    [100, 221].forEach((x, n) => {
      rect(delante, x, 0, 12, 160, "#0b1216"); rect(delante, x, 0, 2, 160, "#1a2a32");
      const azar = mulberry32(40 + n); // cada balda con botes distintos
      for (let y = 18; y < 120; y += 26) {
        rect(delante, x - 3, y, 18, 2, "#2b2018");
        let bx = x - 2;
        while (bx < x + 13) {
          const w = 2 + Math.floor(azar() * 3), h = 3 + Math.floor(azar() * 5), c = [P3.verde, P3.naranja, P3.azul, "#c07ad8", P3.dorado][Math.floor(azar() * 5)];
          if (azar() < 0.8) { rect(delante, bx, y - h, w, h, c); rect(delante, bx, y - h, 1, h, "#f5f7fb"); }
          bx += w + 1;
        }
      }
    });
  }

  // Escaneo dibujado en la rejilla de 12 px: corchetes que se cierran sobre el objeto (a escalones), una línea que lo
  // recorre de arriba abajo con su brillo, y los corchetes parpadean al terminar. Sin cifras: no es un dato.
  function escaneo(t, t0, x, y, w, h) {
    if (t < t0 || t > t0 + 2.2) return;
    const { frente, brillo } = L, C = "#7cf08c", e = t - t0;
    const abre = e < 0.075 ? 3 : e < 0.15 ? 2 : e < 0.225 ? 1 : 0;
    if (e > 1.8 && Math.floor((e - 1.8) / 0.1) % 2 === 1) return;
    const x0 = x - abre, y0 = y - abre, x1 = x + w + abre, y1 = y + h + abre;
    for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1 - 1, y0, -1, 1], [x0, y1 - 1, 1, -1], [x1 - 1, y1 - 1, -1, -1]]) {
      rect(frente, Math.min(cx, cx + sx * 2), cy, 3, 1, C); rect(frente, cx, Math.min(cy, cy + sy * 2), 1, 3, C);
    }
    if (e >= 0.3 && e < 1.6) {
      const ly = y + Math.floor(prog(t, t0 + 0.3, t0 + 1.5) * (h - 1));
      rect(frente, x + 1, ly, w - 2, 1, C); rect(brillo, x, ly - 1, w, 3, "#2cc256");
    }
  }

  // ---------- objetos de cada estación ----------
  function objetos(t, cam) {
    const { medio, frente } = L;
    // 1 · corcho con la tarjeta, matraces y botes
    corcho3(medio, E1 + 4, 31, 51, 35);
    const a1 = P("fr01", "persona");
    if (s1(t, a1) !== null) tarjeta3(frente, TARJ1.x, TARJ1.y + s1(t, a1), TARJ1.w, TARJ1.h);
    const a = P("fr01", "once"), b = FR.fr01.palabras.find((p) => norm(p.p) === "laboratorios").f;
    const n = t < a ? 0 : Math.min(11, 1 + Math.floor(prog(t, a, b) * 11));
    for (let k = 0; k < n; k++) matrazMini(frente, E1 + 10 + (k % 6) * 7, 43 + Math.floor(k / 6) * 7, [P3.verde, P3.azul, P3.naranja][k % 3]);
    matraz3(frente, E1 + 7, MESA - 11, t, { color: P3.verde, activo: t < FR.fr01.fin, semilla: 5 });
    matraz3(frente, E1 + 17, MESA - 11, t, { color: P3.azul, semilla: 6 });
    bote3(frente, E1 + 28, MESA - 5, P3.naranja); bote3(frente, E1 + 32, MESA - 5, "#c07ad8");
    // 2 · la ficha de Mithril en un corcho grande; caja y botes en la mesa
    corcho3(medio, E2 + 12, 28, 66, 44);
    const a2 = FR.fr02.inicio - 0.2;
    if (s1(t, a2) !== null) {
      tarjeta3(frente, TARJ2.x, TARJ2.y + s1(t, a2), TARJ2.w, TARJ2.h);
      if (t >= FR.fr02.inicio) { const dy = s1(t, FR.fr02.inicio); rect(frente, TARJ2.x + 4, TARJ2.y + 3 + dy, 1, 1, "#b4622a"); rect(frente, TARJ2.x + 3, TARJ2.y + 4 + dy, 3, 2, "#b4622a"); }
    }
    caja3(frente, E2 + 8, MESA - 9, t);
    matraz3(frente, E2 + 64, MESA - 11, t, { color: P3.naranja, semilla: 7 });
    bote3(frente, E2 + 74, MESA - 5, P3.verde); bote3(frente, E2 + 78, MESA - 5, P3.azul);
    // 3 · tarjeta de la fuerza y el microscopio grande (×2: sus detalles de media unidad quedan a 12 px)
    corcho3(medio, E3 + 3, 30, 52, 37);
    const a3 = FR.fr03.inicio - 0.2;
    if (s1(t, a3) !== null) {
      tarjeta3(frente, TARJ3.x, TARJ3.y + s1(t, a3), TARJ3.w, TARJ3.h);
      if (t >= FR.fr03.inicio) { // la barra entra llena y baja cuando la voz dice «debilita»
        const caida = paso(prog(t, P("fr03", "debilita"), P("fr03", "grave")) * 0.7, 0.1), bx = TARJ3.x + 3, by = TARJ3.y + 7;
        rect(frente, bx, by, 38, 4, P3.contorno); rect(frente, bx + 1, by + 1, 36, 2, P3.papelSombra);
        rect(frente, bx + 1, by + 1, Math.round(36 * (1 - caida)), 2, caida > 0 ? P3.rojo : P3.verde);
      }
    }
    const lama = t >= LAMA;
    microscopio3(frente, E3 + 63, MESA - 11, { activo: lama });
    matraz3(frente, E3 + 75, MESA - 11, t, { color: P3.verde, activo: lama, semilla: 8 });
    escaneo(t, LAMA, E3 + 61, MESA - 13, 14, 14); // escaneo de la muestra cuando la voz dice «LAMA2»
  }

  // ---------- MISTA: en la primera estación; tras el «revelar», en la tercera ----------
  function mista(t, cam) {
    if (!cam.general) return;
    const pose1 = t >= P("fr01", "ia") ? "senalar" : "pie";
    gato(L.frente, E1 + 50, SUELO - 32, { pose: pose1, t, hablando: hablando(t), espejo: true }, 1);
    if (t >= LLEGA3) {
      const pose3 = t >= P("fr03", "debilita") ? "pensar" : "pie";
      gato(L.frente, E3 + 30, SUELO - 32 + (s1(t, LLEGA3) || 0), { pose: pose3, t, hablando: hablando(t) }, 1);
    }
    // la IA aparece y «se carga» en el aire junto a MISTA cuando la voz la nombra
    const ia = P("fr01", "ia");
    if (t >= ia && t < ia + 1.6) efecto(L.frente, "carga", t, ia, E1 + 46, 84, 0.5);
  }

  // ---------- cámara (px CSS; centros de estación en 135, 405 y 675) ----------
  const CAM = crearCamara({ W, H, SX: 135, SY: 180, lineaCaja: 300, anchoMundo: 810, planos: [
    [0, "corte", 1, 135, 240],
    [0.25, "mover", 13 / 12, 135, 182, VIAJE2 - 0.4], // acercamiento lento: el píxel pasa de 12 a 13 px
    [VIAJE2, "mover", 1, 405, 240, LLEGA2 - VIAJE2], // travelling con paralaje; MISTA se queda atrás
    [ZOOM2, "zoom", 1.25, 405, 175], // zoom core a escalones: la ficha y su corcho enteros
    [REVELA, "mover", 1, 675, 240, LLEGA3 - REVELA], // revelar: travelling y alejamiento a la vez
    [LLEGA3 + 0.2, "mover", 13 / 12, 675, 182, DURACION - LLEGA3 - 0.2], // acercamiento lento hasta el final
  ] });
  const CAPAS = [
    { el: document.getElementById("p-lejos"), d: 0.6 },
    { el: document.getElementById("p-medio"), d: 1 },
    { el: document.getElementById("p-delante"), d: 1.35 },
    { el: document.getElementById("p-textos"), d: 1 },
  ];

  // ---------- caja de diálogo (páginas de ≤ 2 líneas de ~21 caracteres) ----------
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  const CLAVES = { fr01: "persona", fr02: "Mithril", fr03: "LAMA2" };
  const PAGINAS = [];
  const lineas = (ps) => ps.reduce((acc, p) => {
    const u = acc[acc.length - 1];
    if (u && u.length + 1 + p.p.length <= 21) acc[acc.length - 1] = `${u} ${p.p}`; else acc.push(p.p);
    return acc;
  }, []).length;
  ["fr01", "fr02", "fr03"].forEach((id) => {
    let actual = [];
    FR[id].palabras.forEach((p, k, todas) => {
      actual.push(p);
      if (k === todas.length - 1 || actual.length >= 8 || /[.:?!]$/.test(p.p) || (actual.length >= 4 && /[,;]$/.test(p.p)) || lineas([...actual, todas[k + 1]]) > 2) {
        PAGINAS.push({ fr: id, palabras: actual, i: actual[0].i }); actual = [];
      }
    });
  });
  const dialogo = document.getElementById("dialogo"), fraseEl = document.getElementById("frase");
  function pintarDialogo(t) {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    svgRetrato.replaceChildren();
    retratoGato(svgRetrato, 5, 4.5, { t, hablando: false }, 1.5);
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = norm(CLAVES[pag.fr]);
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡]+$/, ""), punt = p.p.slice(nucleo.length);
      const c = norm(nucleo) === clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p.p;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ") + (dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  }

  // ---------- sonido: atado a la pantalla ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    add(VIAJE2, "destello"); add(REVELA, "destello"); // travellings
    add(P("fr01", "ia"), "aparicion"); // la IA se carga
    add(LAMA, "tick"); // empieza el escaneo
    add(LLEGA3, "aparicion"); // MISTA reaparece en la tercera estación
    return ev;
  };

  window.seek = async (t) => {
    await FX.listo;
    Object.values(L).forEach((s) => s.replaceChildren());
    const cam = CAM.en(t);
    CAM.aplicarCapas(cam, CAPAS);
    laboratorio(t); objetos(t, cam); mista(t, cam);
    ver(t);
    // solo se meten en pantalla en los zooms core: en los travellings, cada cartela se va con su estación
    const zoomCore = cam.k >= 1.25;
    CAM.fuentesSinZoom(cam, fuentes, zoomCore ? 16 : -1e4, zoomCore ? 237 : 1e4);
    pintarDialogo(t);
  };
  window.seek(0);
})();
