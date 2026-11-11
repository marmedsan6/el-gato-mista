// anthropic-fable-5-2 · short (estilo v5, 2026-11-10). Arte a 4 px (1 unidad = 1 px CSS), lienzo 270×480.
// Mundo de 8 estaciones (una pantalla cada una), con paralaje (lejos 0,6 · medio 1 · delante 1,35):
//   1 la fábrica del modelo (Fable y Mythos salen del mismo molde) · 2 el velocímetro y el «hasta 30 %»
//   3 la carrera de barras (Fable 5.2 / Fable 5.1 / Opus 5.5) · 4 ciencia y robótica · 5 el precio (zoom core: la balanza)
//   6 la letra pequeña (empata al máximo, la mitad de coste) · 7 «empieza por Opus 5.5» y los cuatro cambios
//   8 cierre (el trofeo y la etiqueta de precio)
// MISTA: entrada de tema, cambio de tema en fr14 (de pie 1-2 s) y cierre. Travelling de 1,1 s entre estaciones.
// Texto: máximo 2 textos a la vez (lint-textos.mjs). Lo que es parte del dibujo (etiquetas de las barras, del molde, de la
// balanza) va pintado en el SVG con data-arte; la fuente del dato, en la pestaña #fuente; el dato que importa, en la caja.
// Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  document.body.className = "short";
  const W = 270, H = 480, N = 8, MW = N * W;
  const T = window.TIMING;
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const PALABRAS = T.frases.flatMap((f) => f.palabras);
  const P = (fr, trozo) => { const p = FR[fr].palabras.find((w) => norm5(w.p).includes(norm5(trozo))); if (!p) throw new Error(`No encuentro «${trozo}» en ${fr}`); return p.i; };
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const pasos = (t, a, b, n) => Math.floor(prog(t, a, b) * n + 1e-9) / n; // progreso a escalones
  const hablando = (t) => PALABRAS.some((p) => t >= p.i && t <= p.f);
  const salto = salto5;
  const DURACION = T.audio.duracion_s + 0.6;
  const M = { rotulo: [16, 64], suelo: 292, SX: 135, SY: 200, caja: 300, titular: [16, 112], gato: [20, 196], asoma: [6, 195] };
  const SU = M.suelo, X = (n) => n * W;
  const R1 = 112, R2 = 126, R3 = 140, R4 = 154, R5y = 168; // filas de etiquetas (bajo el rótulo y la pestaña de fuente)
  const Z1 = 128, Z2 = 142, Z3 = 156; // en la estación con zoom core: con k = 1,25 siguen bajo el rótulo y la fuente
  const VIAJE = 1.1, SLIDE = 0.4;

  // ---------- tiempos (de la voz alineada) ----------
  const T_SLIDE = P("fr01", "recomienda"), T_SLIDE_FIN = T_SLIDE + SLIDE;
  const T_NUEVO = P("fr01", "nuevo"), T_FABLE = P("fr01", "Fable"), T_DOBLE = P("fr01", "doble"), T_TOKEN = P("fr01", "token");
  const T_BARATO = P("fr02", "barato");
  const T_MISMO = P("fr03", "mismo"), T_MYTHOS = P("fr04", "Mythos"), T_VERIF = P("fr04", "verificadas"), T_CIBER = P("fr04", "ciberseguridad"), T_FABLE5 = P("fr05", "Fable");
  const T_V1 = FR.fr05.fin + 0.05, T_A1 = T_V1 + VIAJE;
  const T_VELO = P("fr06", "rápido"), T_HASTA = P("fr06", "hasta"), T_TECHO = P("fr07", "techo"), T_MEDIA = P("fr07", "media");
  const T_V2 = FR.fr07.fin + 0.05, T_A2 = T_V2 + VIAJE;
  const T_SACA = P("fr09", "saca"), T_CUARENTA9 = P("fr09", "cuarenta"), T_PORCIENTO = P("fr09", "ciento"), T_FRONTIER = P("fr09", "FrontierCode"), T_MIDE = P("fr09", "mide"), T_ACEPT = P("fr09", "aceptarían");
  const T_F51 = P("fr10", "Fable"), T_TREINTA = P("fr10", "treinta");
  const T_OPUS = P("fr11", "Opus"), T_CUARENTA11 = P("fr11", "cuarenta");
  const T_V3 = FR.fr11.fin + 0.05, T_A3 = T_V3 + VIAJE;
  const T_CIENCIA = P("fr12", "ciencia"), T_SETENTA = P("fr12", "setenta"), T_CINCUENTA = P("fr12", "cincuenta"), T_CINCUENTA2 = P("fr12", "cincuenta", 2), T_CINCUENTA8 = P("fr12", "cincuenta", 3);
  const T_ROBOT = P("fr13", "robótica"), T_SESENTA = P("fr13", "sesenta"), T_VEINTI = P("fr13", "veintisiete");
  const T_V4 = FR.fr13.fin + 0.05, T_S4 = T_V4 + SLIDE, T_A4 = T_S4 + SLIDE, T_MISTA4_FIN = T_A4 + 1.6;
  const T_CUESTA = P("fr15", "cuesta"), T_CUATRO = P("fr15", "cuatro"), T_ENTRADA = P("fr15", "entrada"), T_SALIDA = P("fr15", "salida");
  const T_OCHO = P("fr16", "ocho"), T_CUARENTA16 = P("fr16", "cuarenta");
  const T_DOBLE17 = P("fr17", "doble");
  const T_Z5 = T_CUESTA, T_C5 = FR.fr17.fin + 0.05;
  const T_V5 = T_C5 + 0.02, T_A5 = T_V5 + VIAJE;
  const T_VENDE = P("fr18", "vende"), T_TAREA = P("fr18", "tarea");
  const T_EMPATA = P("fr19", "empata"), T_MAXIMO = P("fr19", "máximo"), T_MITAD = P("fr19", "mitad");
  const T_LETRA = P("fr20", "letra"), T_ESTIM = P("fr20", "estimación"), T_SEGUIR = P("fr20", "seguir");
  const T_SUBE = P("fr21", "Sube"), T_APRETADO = P("fr21", "apretado"), T_LLEGUE = P("fr21", "llegue");
  const T_MIGRAR = P("fr22", "migrar"), T_NOMBRE = P("fr22", "nombre");
  const T_CAMBIOS = P("fr23", "cuatro"), T_ROMPEN = P("fr23", "rompen"), T_PENSAMIENTO = P("fr23", "pensamiento"), T_DESACT = P("fr23", "desactivar");
  const T_V7 = FR.fr23.fin + 0.05, T_A7 = T_V7 + VIAJE;
  const T_V8 = FR.fr24.fin + 0.05, T_A8 = T_V8 + VIAJE;
  const T_GANA = P("fr24", "gana"), T_BARATO25 = P("fr25", "barato");
  const VIAJES = [[T_V1, T_A1], [T_V2, T_A2], [T_V3, T_A3], [T_V4, T_A4], [T_V5, T_A5], [T_V7, T_A7], [T_V8, T_A8]];
  const SALIDAS = [T_V1, T_V2, T_V3, T_V4, T_V5, T_V7, T_V8, DURACION + 1];
  const MOVIMIENTOS = [[T_SLIDE, T_SLIDE_FIN], [T_S4, T_A4], ...VIAJES];

  // ---------- lienzos ----------
  const ANCHO = { lejos: Math.round(MW * 0.6) + W, medio: MW, brillo: MW, frente: MW, delante: Math.round(MW * 1.35) + W };
  const L = {};
  for (const id of Object.keys(ANCHO)) {
    const s = document.getElementById(id);
    s.setAttribute("viewBox", `0 0 ${ANCHO[id]} ${H}`); s.setAttribute("width", ANCHO[id]); s.setAttribute("height", H);
    s.style.width = `${ANCHO[id]}px`; s.style.height = `${H}px`;
    L[id] = s;
  }
  [["p-lejos", "lejos"], ["p-medio", "medio"], ["p-delante", "delante"]].forEach(([id, c]) => { const d = document.getElementById(id); d.style.width = `${ANCHO[c]}px`; d.style.height = `${H}px`; });
  const G12 = document.getElementById("gato12");
  G12.setAttribute("viewBox", `0 0 ${W / 3} ${H / 3}`); G12.setAttribute("width", W); G12.setAttribute("height", H);

  // ---------- paletas ----------
  const C = R5.contorno;
  const ORO = ["#7a5a1a", "#c2862e", "#f2c14e", "#ffe9a8"];
  const PAPEL = ["#b8ad96", "#d8ceb6", "#efe6d2", "#fbf6ea"];
  const NARANJA5 = [...R5.naranja, "#fff1c4"];
  const VERDE5 = [...R5.verde, "#e6fff4"];
  const AZUL5 = [...R5.ia, "#ffffff"];
  // Opus 5.5: azul; Fable 5.1: gris; Fable 5.2: naranja (el color de la marca del canal para lo nuevo)
  const BARRAS = { f52: R5.naranja, f51: R5.metal, opus: R5.ia };

  // ---------- glifos de 3×5 para las piezas del dibujo (coordenadas enteras, sin textos) ----------
  const GL = {
    "0": ["111", "101", "101", "101", "111"], "1": ["010", "110", "010", "010", "111"], "2": ["111", "001", "111", "100", "111"],
    "3": ["111", "001", "111", "001", "111"], "4": ["101", "101", "111", "001", "001"], "5": ["111", "100", "111", "001", "111"],
    "6": ["111", "100", "111", "101", "111"], "7": ["111", "001", "010", "010", "010"], "8": ["111", "101", "111", "101", "111"],
    "9": ["111", "101", "111", "001", "111"], "X": ["101", "101", "010", "101", "101"], "+": ["000", "010", "111", "010", "000"],
    "F": ["111", "100", "110", "100", "100"], "M": ["101", "111", "111", "101", "101"], "O": ["111", "101", "101", "101", "111"],
    "%": ["101", "001", "010", "100", "101"], ".": ["000", "000", "000", "000", "010"], "/": ["001", "001", "010", "100", "100"],
    "$": ["011", "110", "010", "011", "110"], "?": ["111", "001", "011", "000", "010"],
  };
  // Texto de glifos: escala s, separación de 1 glifo. Devuelve su ancho en unidades.
  function glifos(svg, x, y, texto, color, s = 1) {
    let cx = x;
    for (const ch of texto) {
      const g = GL[ch];
      if (g) g.forEach((fila, j) => { for (let i = 0; i < 3; i++) if (fila[i] === "1") rect(svg, cx + i * s, y + j * s, s, s, color); });
      cx += 4 * s;
    }
    return cx - x - s;
  }
  const anchoGlifos = (texto, s = 1) => texto.length * 4 * s - s;

  // ---------- textos de interfaz ----------
  const T5 = crearTextos5({ caja: document.getElementById("textos"), W, H, lineaCaja: M.caja, corto: true });
  const tx = T5.texto, mundo = { mundo: true };
  const eti = (a, b, html, x, y, clase = "etiqueta fondo") => tx(a, b, clase, html, [x, y], mundo);
  // texto que es parte del dibujo: no cuenta para el presupuesto de textos ni para la permanencia (lint-textos.mjs)
  const arte = (a, b, html, x, y, clase = "etiqueta fondo") => { const d = tx(a, b, clase, html, [x, y], mundo); d.dataset.arte = "1"; return d; };
  // entrada de tema
  tx(0, T_SLIDE, "rotulo", 'Noticia · <span class="clave">Anthropic</span>', M.rotulo);
  tx(0, T_SLIDE, "titular grande", '¿Por qué<br>cuesta el<br><span class="clave">doble</span>?', [16, 96]);
  // rótulos de cada estación (interfaz fija; cambian al salir hacia la siguiente)
  const ROTULOS = ['El <span class="clave">modelo nuevo</span>', 'Hasta un <span class="clave">30 %</span>', 'La <span class="clave">carrera</span>',
    'Ciencia y <span class="clave">robótica</span>', 'El <span class="clave">precio</span>', 'La <span class="clave">letra pequeña</span>',
    'Empieza por <span class="clave">Opus</span>', 'El que <span class="clave">más gana</span>'];
  ROTULOS.forEach((r, n) => tx(n === 0 ? T_SLIDE_FIN : SALIDAS[n - 1], SALIDAS[n], "rotulo", r, M.rotulo));
  // 1 · la fábrica del modelo
  arte(T_NUEVO, T_V1, "Fable 5.2 · 9 nov 2026", X(0) + 16, R5y);
  arte(T_MYTHOS, T_V1, "Mythos: solo verificados", X(0) + 16, R4);
  // 2 · el velocímetro
  arte(T_VELO, T_V2, 'Salida <span class="clave">+30 %</span>', X(1) + 16, R1);
  arte(T_TECHO, T_V2, '«Hasta» = un <span class="clave">techo</span>', X(1) + 16, R2);
  // 3 · la carrera de barras
  arte(T_FRONTIER, T_V3, "FrontierCode 2.0", X(2) + 16, R1);
  // 4 · ciencia y robótica
  arte(T_CIENCIA, T_V4, "Ciencia", X(3) + 16, R1);
  arte(T_ROBOT, T_V4, 'Robótica: <span class="clave">casi ×3</span>', X(3) + 16, R2);
  // 5 · el precio (zoom core)
  arte(T_CUESTA, T_C5, "Por millón de tokens", X(4) + 16, R5y);
  arte(T_CUESTA, T_C5, 'Opus 5.5: <span class="cifra-ui">4 $ / 20 $</span>', X(4) + 16, Z3);
  // 6 · la letra pequeña
  arte(T_TAREA, T_V5, 'No vende el token:<br>vende la tarea', X(5) + 16, R1);
  arte(T_EMPATA, T_V5, 'Empata al máximo<br>y sale <span class="clave">por la mitad</span>', X(5) + 16, R3);
  // 7 · empieza por Opus
  arte(T_SUBE, T_V7, '«Empieza por <span class="clave">Opus 5.5</span>»', X(6) + 16, R1);
  arte(T_MIGRAR, T_V7, 'Migrar <span class="clave">no es</span> cambiar el nombre', X(6) + 16, R2);
  // 8 · cierre
  arte(T_GANA, DURACION + 1, 'El que gana <span class="clave">más barato</span>', X(7) + 16, R1);
  tildesPixel();

  // ---------- pestaña de fuente (interfaz fija): la de la frase que suena ----------
  const FUENTE = document.getElementById("fuente");
  const FUENTES = { f1: "Anthropic", f2: "Anthropic", f3: "Anthropic", f4: "Anthropic", f5: "Anthropic", f6: "Anthropic", f7: "Anthropic", f8: "Anthropic" };
  function pintarFuente(t) {
    const f = FR && Object.values(FR).find((x) => t >= x.inicio && t < x.fin && x.fuentes && x.fuentes.length);
    if (!f) { FUENTE.classList.add("oculto"); return; }
    FUENTE.classList.remove("oculto");
    FUENTE.textContent = `Fuente: ${[...new Set([...new Set(f.fuentes)].map((k) => FUENTES[k] || k))].join(", ")}`; FUENTE.dataset.arte = "1";
  }

  // ---------- cielo, ciudad lejana y suelo ----------
  function cielo(t) {
    const { lejos } = L, AL = ANCHO.lejos;
    const bandas = [...R5.cielo].reverse(), alto = Math.ceil(SU / bandas.length);
    bandas.forEach((c, i) => { rect(lejos, 0, i * alto, AL, alto, c); if (i) tramado5(lejos, 0, i * alto, AL, 2, bandas[i - 1], i); });
    const az = mulberry32(3);
    for (let k = 0; k < 260; k++) {
      const x = Math.floor(az() * AL), y = Math.floor(az() * SU * 0.4), f = az();
      if (Math.floor(t * 2 + f * 7) % 7 !== 0) rect(lejos, x, y, 1, 1, f < 0.3 ? "#f5f7fb" : "#8a93c0");
    }
    for (let k = 0; k < 6; k++) { // nubes que cruzan despacio
      const nx = Math.round(((t * 3 + k * 260) % (AL + 80)) - 40), ny = 70 + (k * 37) % 60;
      rect(lejos, nx, ny + 3, 34, 4, "#232848"); rect(lejos, nx + 6, ny, 20, 3, "#232848");
    }
    const azc = mulberry32(21);
    let x = -4;
    while (x < AL) {
      const w = Math.round(10 + azc() * 18), h = Math.round(SU * (0.18 + azc() * 0.3));
      rect(lejos, x, SU - h, w, h, R5.ciudad[1]); rect(lejos, x, SU - h, 1, h, R5.ciudad[2]);
      for (let wy = SU - h + 3; wy < SU; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) if (azc() < 0.16) rect(lejos, wx, wy, 2, 2, R5.ventana[0]);
      x += w + Math.round(1 + azc() * 4);
    }
    rect(lejos, 0, SU, AL, H - SU, "#10131c");
  }
  function suelo() {
    const { medio } = L;
    rect(medio, 0, SU, MW, H - SU, "#141824"); rect(medio, 0, SU, MW, 1, "#2f3a4f");
    for (let x = 0; x < MW; x += 24) rect(medio, x, SU + 3, 12, 1, "#1c2232");
  }
  function delante() {
    const { delante } = L;
    rect(delante, 0, SU + 6, ANCHO.delante, H, "#07090f");
    const az = mulberry32(9);
    for (let x = -4; x < ANCHO.delante; x += 9) disco(delante, x, SU + 8, Math.round(4 + az() * 4), "#05070b");
  }

  // ---------- piezas comunes ----------
  // Barra de la carrera: crece a escalones desde `desde` hasta su valor (0-1); su cifra va pintada encima
  function barra(svg, brillo, x, yBase, alto, v, color, crece, cifra, t, desde) {
    const h = Math.round(alto * v * crece);
    if (h <= 0) return;
    rect(svg, x - 1, yBase - h - 1, 16, h + 2, C);
    rect(svg, x, yBase - h, 14, h, color[1]);
    rect(svg, x, yBase - h, 14, 1, color[3]);
    rect(svg, x, yBase - h, 1, h, color[2]);
    rect(svg, x + 12, yBase - h, 2, h, color[0]);
    for (let k = 4; k < h; k += 6) rect(svg, x, yBase - k, 14, 1, color[0]);
    rect(brillo, x - 2, yBase - h - 2, 18, 4, color[1]);
    if (t >= desde + 0.7) { // la cifra, encima de la barra (pieza del dibujo)
      const w = anchoGlifos(cifra, 2) + 8;
      rect(svg, x + 7 - Math.floor(w / 2) - 1, yBase - h - 24, w + 2, 14, C);
      rect(svg, x + 7 - Math.floor(w / 2), yBase - h - 23, w, 12, "#0c1016");
      glifos(svg, x + 7 - Math.floor(w / 2) + 4, yBase - h - 20, cifra, color[3], 2);
    }
  }
  // Balanza de la estación 5: fiel, dos brazos y dos platos; el izquierdo sube (Fable) y el derecho baja (Opus)
  function balanza(svg, brillo, cx, yPie, t, inclina) {
    rect(svg, cx - 26, yPie - 6, 52, 6, C); rect(svg, cx - 25, yPie - 5, 50, 3, R5.metal[1]); rect(svg, cx - 25, yPie - 5, 50, 1, R5.metal[3]);
    rect(svg, cx - 3, yPie - 70, 6, 64, C); rect(svg, cx - 2, yPie - 69, 4, 63, R5.metal[2]); rect(svg, cx - 2, yPie - 69, 1, 63, R5.metal[3]);
    const a = -inclina * 0.16, dx = Math.round(Math.cos(a) * 68), dy = Math.round(Math.sin(a) * 68);
    linea(svg, cx - dx, yPie - 64 - dy, cx + dx, yPie - 64 + dy, C, 5); linea(svg, cx - dx, yPie - 64 - dy, cx + dx, yPie - 64 + dy, R5.metal[2], 3); linea(svg, cx - dx, yPie - 65 - dy, cx + dx, yPie - 65 + dy, R5.metal[3], 1);
    disco(svg, cx, yPie - 64, 5, C); disco(svg, cx, yPie - 64, 4, ORO[1]); disco(svg, cx - 1, yPie - 65, 2, ORO[2]);
    for (const [lado, color, cifra] of [[-1, R5.naranja, "8/40"], [1, R5.ia, "4/20"]]) {
      const px = cx + lado * dx, py = yPie - 64 + lado * dy;
      linea(svg, px, py, px - 22, py + 26, R5.metal[3], 1); linea(svg, px, py, px + 22, py + 26, R5.metal[3], 1);
      rect(svg, px - 26, py + 26, 52, 4, C); rect(svg, px - 25, py + 26, 50, 2, color[2]); rect(svg, px - 25, py + 26, 50, 1, color[3]);
      rect(svg, px - 24, py + 30, 48, 3, color[1]);
      rect(brillo, px - 28, py + 24, 56, 10, color[1]);
      // monedas: más en el plato de Fable (cuesta el doble)
      const n = lado < 0 ? 5 : 3;
      for (let k = 0; k < n; k++) { const mx = px - 16 + k * 8, my = py + 20 - (k % 2) * 3; rect(svg, mx, my, 7, 6, C); rect(svg, mx + 1, my + 1, 5, 4, ORO[1]); rect(svg, mx + 1, my + 1, 5, 1, ORO[2]); }
      // el precio del plato, colgando de su borde (pieza del dibujo)
      const w = anchoGlifos(cifra, 2) + 8;
      rect(svg, px - Math.floor(w / 2) - 1, py + 36, w + 2, 14, C); rect(svg, px - Math.floor(w / 2), py + 37, w, 12, color[1]);
      glifos(svg, px - Math.floor(w / 2) + 4, py + 40, cifra, color[3], 2);
    }
  }
  // Recibo con dos columnas de cifras (la letra pequeña)
  function recibo(svg, x, y, t) {
    rect(svg, x - 1, y - 1, 62, 78, C); rect(svg, x, y, 60, 76, PAPEL[2]); rect(svg, x, y, 60, 1, PAPEL[3]); rect(svg, x + 58, y, 2, 76, PAPEL[1]);
    for (let k = 0; k < 4; k++) rect(svg, x + 6 + k * 12, y + 4, 8, 2, "#2a2a2a");
    rect(svg, x + 4, y + 10, 52, 1, "#8a8474");
    for (let k = 0; k < 3; k++) { rect(svg, x + 5, y + 16 + k * 12, 26, 2, "#7a7466"); rect(svg, x + 40, y + 16 + k * 12, 14, 2, "#5a5648"); }
    rect(svg, x + 4, y + 58, 52, 1, "#8a8474");
    for (let k = 0; k < 3; k++) rect(svg, x + 6 + k * 16, y + 66, 12, 1, "#2a2a2a");
    // el recibo se va imprimiendo línea a línea (algo nuevo cada 1-2 s) y el sello de «estimación» late
    const lineas = 3 + Math.floor((t % 4) / 1.2);
    for (let j = 0; j < lineas; j++) rect(svg, x + 6, y + 16 + j * 12 + 6, 26, 1, "#3a352c");
    if (Math.floor(t * 2) % 2 === 0) rect(svg, x + 46, y + 62, 8, 8, R5.naranja[2]);
  }
  // Trofeo (cierre): copa dorada con asas, brillo que late
  function trofeo(svg, brillo, cx, yPie, t, late) {
    rect(brillo, cx - 30, yPie - 74, 60, 74, late && Math.floor(t * 2) % 2 === 0 ? "#5c4a14" : "#3a3010");
    // peana: dos escalones de metal
    rect(svg, cx - 24, yPie - 6, 48, 6, C); rect(svg, cx - 23, yPie - 5, 46, 3, R5.metal[1]); rect(svg, cx - 23, yPie - 5, 46, 1, R5.metal[3]);
    rect(svg, cx - 14, yPie - 12, 28, 6, C); rect(svg, cx - 13, yPie - 11, 26, 4, ORO[1]); rect(svg, cx - 13, yPie - 11, 26, 1, ORO[2]);
    // pie y cuello
    rect(svg, cx - 5, yPie - 26, 10, 14, C); rect(svg, cx - 4, yPie - 25, 8, 13, ORO[1]); rect(svg, cx - 4, yPie - 25, 2, 13, ORO[2]);
    // copa: boca ancha, cuerpo que se estrecha, con su luz a la izquierda
    for (let j = 0; j < 36; j++) {
      const f = j / 35, a = Math.round(9 + 14 * (1 - f) * (1 - f * 0.15));
      const yy = yPie - 62 + j;
      rect(svg, cx - a - 1, yy, 2 * a + 3, 1, C);
      rect(svg, cx - a, yy, 2 * a + 1, 1, j < 6 ? ORO[2] : ORO[1]);
      rect(svg, cx + Math.floor(a * 0.45), yy, a - Math.floor(a * 0.45) + 1, 1, ORO[0]);
      rect(svg, cx - a + 2, yy, 2, 1, ORO[3]);
    }
    // asas: dos arcos a los lados que salen de la boca
    for (const lado of [-1, 1]) {
      const ax = cx + lado * 22;
      for (let j = 0; j < 18; j++) { const w = Math.round(7 * Math.sqrt(1 - Math.pow((j - 9) / 9, 2))); rect(svg, ax - (lado > 0 ? 0 : w), yPie - 56 + j, w + 1, 1, C); }
      for (let j = 2; j < 16; j++) { const w = Math.round(7 * Math.sqrt(1 - Math.pow((j - 9) / 9, 2))); if (w > 2) rect(svg, ax - (lado > 0 ? 0 : w) + 1, yPie - 56 + j, w - 1, 1, ORO[1]); }
    }
    if (late && Math.floor(t * 2) % 2 === 0) { rect(svg, cx - 2, yPie - 50, 2, 2, "#ffffff"); rect(svg, cx - 6, yPie - 44, 1, 1, ORO[3]); }
  }

  // ---------- 1 · la fábrica del modelo ----------
  function estacion1(t) {
    const { medio, frente, brillo } = L, x0 = X(0);
    // nave de la fábrica con la cadena y el molde
    const fx = x0 + 24, fy = 196, fw = 222, fh = SU - fy;
    caja5(medio, fx, fy, fw, fh, R5.hormigon);
    rect(medio, fx + 8, fy + 8, fw - 16, 26, "#0b1622");
    for (let k = 0; k < 6; k++) { const on = Math.floor(t * 3 + k) % 4 !== 0; rect(medio, fx + 14 + k * 34, fy + 14, 24, 12, on ? R5.ia[1] : "#101a2c"); if (on) rect(brillo, fx + 12 + k * 34, fy + 12, 28, 16, R5.ia[0]); }
    // el molde central: un cubo con una pantalla que late
    const mx = x0 + 112, my = SU - 54;
    caja5(frente, mx, my, 46, 46, R5.metal);
    rect(frente, mx + 8, my + 10, 30, 26, "#0b1622");
    const late = Math.floor(t * 3) % 2 === 0;
    rect(frente, mx + 10, my + 16, 26, 14, late ? R5.ia[2] : R5.ia[1]);
    for (let k = 0; k < 26; k += 4) rect(frente, mx + 10 + k, my + 16, 1, 14, R5.ia[0]);
    rect(brillo, mx - 4, my - 4, 54, 54, R5.ia[0]);
    // cinta transportadora con dos piezas que salen: una naranja (Fable) y otra gris (Mythos)
    const cy = SU - 12;
    rect(medio, x0 + 30, cy, 210, 8, C); rect(medio, x0 + 31, cy + 1, 208, 6, R5.metal[1]); rect(medio, x0 + 31, cy + 1, 208, 1, R5.metal[3]);
    const av = Math.floor(t * 10) % 6;
    for (let k = 0; k < 208; k += 6) rect(medio, x0 + 31 + ((k + av) % 208), cy + 4, 2, 2, R5.metal[0]);
    if (t >= T_MISMO) {
      const p = prog(t, T_MISMO, T_MISMO + 0.9);
      const px = Math.round(x0 + 96 - p * 62), qx = Math.round(x0 + 96 + p * 62);
      for (const [bx, color] of [[px, R5.naranja], [qx, R5.metal]]) {
        const s = salto(t, T_MISMO) || 0;
        rect(frente, bx, cy - 16 + s, 18, 16, C); rect(frente, bx + 1, cy - 15 + s, 16, 14, color[2]); rect(frente, bx + 1, cy - 15 + s, 16, 1, color[3]);
        rect(frente, bx + 5, cy - 10 + s, 8, 4, "#0b1622"); rect(frente, bx + 6, cy - 9 + s, 2, 2, color[3]);
      }
      if (t >= T_MYTHOS) { // el candado de Mythos: solo organizaciones verificadas
        const s = salto(t, T_MYTHOS) || 0;
        rect(frente, qx + 4, cy - 26 + s, 12, 8, C); rect(frente, qx + 5, cy - 25 + s, 10, 6, ORO[1]); rect(frente, qx + 7, cy - 28 + s, 2, 3, ORO[2]); rect(frente, qx + 11, cy - 28 + s, 2, 3, ORO[2]);
        destello5(frente, brillo, qx + 10, cy - 24, t, T_MYTHOS, NARANJA5);
      }
    }
    if (t >= T_NUEVO) destello5(frente, brillo, mx + 23, my + 23, t, T_NUEVO, NARANJA5);
    if (t >= T_DOBLE) { // la etiqueta de precio que cuelga del molde: ×2
      const s = salto(t, T_DOBLE) || 0;
      rect(frente, mx - 4, my - 22 + s, 54, 14, C); rect(frente, mx - 3, my - 21 + s, 52, 12, R5.naranja[1]); rect(frente, mx - 3, my - 21 + s, 52, 1, R5.naranja[3]);
      rect(frente, mx + 20, my - 8 + s, 4, 8, C);
      glifos(frente, mx + 8, my - 18 + s, "X2", R5.naranja[3], 2);
      rect(frente, mx + 26, my - 17 + s, 5, 4, ORO[2]); rect(frente, mx + 32, my - 17 + s, 5, 4, ORO[2]);
    }
  }

  // ---------- 2 · el velocímetro y el techo ----------
  function estacion2(t) {
    const { medio, frente, brillo } = L, x0 = X(1);
    // arco del velocímetro con la aguja que sube hasta el techo
    const cx = x0 + 168, cy = SU - 26, r = 62;
    for (let a = 180; a <= 360; a += 3) { const rad = (a * Math.PI) / 180; rect(medio, Math.round(cx + Math.cos(rad) * (r + 5)), Math.round(cy + Math.sin(rad) * (r + 5)), 2, 2, R5.metal[2]); }
    for (let a = 180; a <= 360; a += 20) { const rad = (a * Math.PI) / 180; rect(medio, Math.round(cx + Math.cos(rad) * (r - 6)), Math.round(cy + Math.sin(rad) * (r - 6)), 3, 3, R5.metal[3]); }
    const vel = t >= T_VELO ? pasos(t, T_VELO, T_VELO + 1.1, 10) : 0;
    const ang = Math.PI + Math.PI * (t >= T_VELO ? 0.55 + 0.45 * vel : 0.1);
    linea(frente, cx, cy, Math.round(cx + Math.cos(ang) * (r - 4)), Math.round(cy + Math.sin(ang) * (r - 4)), C, 5);
    linea(frente, cx, cy, Math.round(cx + Math.cos(ang) * (r - 5)), Math.round(cy + Math.sin(ang) * (r - 5)), R5.naranja[2], 3);
    disco(frente, cx, cy, 7, C); disco(frente, cx, cy, 6, R5.metal[2]); disco(frente, cx - 1, cy - 1, 3, R5.metal[3]);
    if (t >= T_VELO) rect(brillo, cx - r - 8, cy - r - 8, 2 * r + 16, r + 16, R5.naranja[0]);
    // el techo: una viga que baja con «techo» y la línea de la media que se queda abajo
    const vigaY = 176 + (t >= T_TECHO ? 0 : -40);
    rect(medio, x0 + 20, vigaY, 96, 8, C); rect(medio, x0 + 21, vigaY + 1, 94, 6, R5.naranja[1]); rect(medio, x0 + 21, vigaY + 1, 94, 1, R5.naranja[3]);
    for (let k = 0; k < 94; k += 12) rect(medio, x0 + 21 + k, vigaY + 6, 6, 2, R5.naranja[0]);
    if (t >= T_MEDIA) { // la media, punteada, muy por debajo
      const my = SU - 40;
      for (let k = 0; k < 96; k += 4) rect(medio, x0 + 20 + k, my, 2, 1, R5.metal[3]);
      rect(frente, x0 + 58, my - 4, 4, 9, C); rect(frente, x0 + 59, my - 3, 2, 7, R5.metal[3]);
    }
    if (t >= T_TECHO) destello5(frente, brillo, x0 + 68, vigaY + 4, t, T_TECHO, NARANJA5);
    // la barra del 30 % que llega al techo y se queda ahí
    const bx = x0 + 132, by = SU - 8, alto = 96;
    rect(medio, bx - 1, by - alto - 1, 18, alto + 2, C); rect(medio, bx, by - alto, 16, alto, "#14202a");
    const lleno = Math.round(alto * (t >= T_HASTA ? pasos(t, T_HASTA, T_HASTA + 0.9, 10) * 0.9 + 0.1 : 0));
    if (lleno > 0) { rect(medio, bx + 1, by - lleno, 14, lleno, R5.naranja[1]); rect(medio, bx + 1, by - lleno, 14, 1, R5.naranja[3]); }
    rect(medio, bx - 1, by, 18, 3, C);
  }

  // ---------- 3 · la carrera de barras ----------
  function estacion3(t) {
    const { medio, frente, brillo } = L, x0 = X(2);
    const yBase = SU - 6, alto = 178;
    rect(medio, x0 + 140, yBase, 118, 2, R5.metal[2]);
    for (let k = 0; k <= 4; k++) { const y = yBase - Math.round((alto * k) / 4); for (let x = x0 + 140; x < x0 + 258; x += 4) rect(medio, x, y, 2, 1, R5.metal[1]); }
    for (let k = 0; k < 4; k++) rect(medio, x0 + 132 - k, yBase - 60 - k * 14, 2 * k + 3, 2, R5.naranja[1]);
    rect(medio, x0 + 131, yBase - 60, 2, 60, R5.naranja[1]);
    const T = { f52: T_SACA, f51: T_F51, opus: T_OPUS };
    [[150, "f52", 0.491, "49"], [196, "f51", 0.324, "32"], [242, "opus", 0.455, "45"]].forEach(([x, clave, v, cifra]) => {
      const desde = T[clave];
      barra(frente, brillo, x0 + x - 8, yBase, alto, v, BARRAS[clave], t < desde ? 0 : pasos(t, desde, desde + 0.7, 8), cifra, t, desde);
      if (t >= desde) destello5(frente, brillo, x0 + x, yBase - Math.round(alto * v), t, desde, BARRAS[clave].concat("#ffffff"));
    });
    // el trofeo pequeño del primero, que salta a la barra de Fable 5.2
    if (t >= T_CUARENTA9) { const s = salto(t, T_CUARENTA9) || 0; rect(frente, x0 + 142, yBase - alto - 12 + s, 12, 10, C); rect(frente, x0 + 143, yBase - alto - 11 + s, 10, 8, ORO[1]); rect(frente, x0 + 145, yBase - alto - 2 + s, 6, 4, ORO[0]); }
  }

  // ---------- 4 · ciencia y robótica ----------
  function panelCiencia(svg, x, y, w, h, v, color, crece) {
    caja5(svg, x, y, w, h, R5.metal);
    rect(svg, x + 3, y + 3, w - 6, h - 6, "#0b1622");
    const alto = h - 14, base = y + h - 6, n = v.length;
    v.forEach((valor, k) => {
      const bw = Math.floor((w - 14) / n) - 4, bx = x + 8 + k * (bw + 4);
      const bh = Math.round(alto * valor * (crece[k] || 0));
      if (bh > 0) { rect(svg, bx, base - bh, bw, bh, color[k][1]); rect(svg, bx, base - bh, bw, 1, color[k][3]); rect(svg, bx, base - bh, 1, bh, color[k][2]); }
    });
    rect(svg, x + 6, base, w - 12, 1, R5.metal[3]);
  }
  function estacion4(t) {
    const { medio, frente, brillo } = L, x0 = X(3);
    // panel de ciencia: tres barras (Fable 5.2, Fable 5.1, Opus 5.5)
    const px = x0 + 108, py = 196, pw = 146, ph = 90;
    panelCiencia(frente, px, py, pw, ph, [0.746, 0.526, 0.587], [R5.naranja, R5.metal, R5.ia],
      [t >= T_SETENTA ? pasos(t, T_SETENTA, T_SETENTA + 0.6, 6) : 0, t >= T_CINCUENTA ? pasos(t, T_CINCUENTA, T_CINCUENTA + 0.6, 6) : 0, t >= T_CINCUENTA8 ? pasos(t, T_CINCUENTA8, T_CINCUENTA8 + 0.6, 6) : 0]);
    rect(brillo, px - 3, py - 3, pw + 6, ph + 6, R5.ia[0]);
    if (t >= T_SETENTA) destello5(frente, brillo, px + 30, py + 30, t, T_SETENTA, NARANJA5);
    // el robot del laboratorio: brazo que se mueve siempre y una pieza que levanta con «robótica»
    rect(frente, x0 + 14, SU - 40, 74, 40, C); rect(frente, x0 + 15, SU - 39, 72, 38, R5.hormigon[1]); rect(frente, x0 + 15, SU - 39, 72, 1, R5.hormigon[3]);
    for (let k = 0; k < 3; k++) rect(frente, x0 + 22 + k * 24, SU - 34, 18, 12, "#0b1622");
    if (Math.floor(t * 3 + 1) % 2 === 0) rect(frente, x0 + 26, SU - 31, 3, 3, R5.verde[2]);
    brazo5(frente, x0 + 50, SU - 42, t, { largo: 22, fase: 0.4, color: R5.naranja });
    if (t >= T_ROBOT) { // la pieza que levanta y el ×3
      const s = salto(t, T_ROBOT) || 0;
      rect(frente, x0 + 62, SU - 92 + s, 18, 14, C); rect(frente, x0 + 63, SU - 91 + s, 16, 12, R5.ia[2]); rect(frente, x0 + 63, SU - 91 + s, 16, 1, R5.ia[3]);
      destello5(frente, brillo, x0 + 71, SU - 85 + s, t, T_ROBOT, NARANJA5);
      if (t >= T_VEINTI) { // dos barritas: 64,9 frente a 27,6 (casi el triple)
        const bx = x0 + 150, by = SU - 10;
        [[0.649, R5.naranja], [0.276, R5.metal]].forEach(([v, color], k) => {
          const h = Math.round(70 * v * pasos(t, T_VEINTI, T_VEINTI + 0.5, 5));
          if (h > 0) { rect(frente, bx + k * 26, by - h, 18, h, C); rect(frente, bx + k * 26 + 1, by - h + 1, 16, h - 1, color[2]); rect(frente, bx + k * 26 + 1, by - h + 1, 16, 1, color[3]); }
        });
        rect(frente, bx - 2, by, 50, 2, C);
      }
    }
  }

  // ---------- 5 · el precio (zoom core) ----------
  function estacion5(t) {
    const { medio, frente, brillo } = L, x0 = X(4);
    const inclina = t < T_CUESTA ? 0 : t < T_OCHO ? 0.35 * pasos(t, T_CUESTA, T_CUESTA + 0.6, 4) : 0.35 + 0.65 * pasos(t, T_OCHO, T_OCHO + 0.6, 4);
    balanza(frente, brillo, x0 + 135, SU - 26, t, inclina);
    if (t >= T_DOBLE17) destello5(frente, brillo, x0 + 135, SU - 86, t, T_DOBLE17, NARANJA5);
    if (t >= T_DOBLE17) { // el «×2» que cae sobre el plato de Fable
      const s = salto(t, T_DOBLE17) || 0;
      rect(frente, x0 + 34, 146 + s, 30, 22, C); rect(frente, x0 + 35, 147 + s, 28, 20, R5.naranja[1]); rect(frente, x0 + 35, 147 + s, 28, 1, R5.naranja[3]);
      glifos(frente, x0 + 40, 152 + s, "X2", R5.naranja[3], 2);
    }
  }

  // ---------- 6 · la letra pequeña ----------
  function estacion6(t) {
    const { medio, frente, brillo } = L, x0 = X(5);
    recibo(frente, x0 + 176, 190, t);
    rect(brillo, x0 + 172, 186, 70, 86, "#2a2418");
    // dos fichas iguales que caen en la misma línea: empate
    const y1 = 214, y2 = 262;
    const ficha = (x, y, color, s) => { rect(frente, x, y + s, 52, 20, C); rect(frente, x + 1, y + 1 + s, 50, 18, color[1]); rect(frente, x + 1, y + 1 + s, 50, 1, color[3]); rect(frente, x + 5, y + 6 + s, 12, 4, "#0c1016"); rect(frente, x + 5, y + 12 + s, 30, 2, color[3]); };
    ficha(x0 + 20, y1 - 40, R5.naranja, t >= T_EMPATA ? Math.round(prog(t, T_EMPATA, T_EMPATA + 0.5) * 40) : 0);
    ficha(x0 + 20, y2 - 40, R5.ia, t >= T_MAXIMO ? Math.round(prog(t, T_MAXIMO, T_MAXIMO + 0.5) * 40) : 0);
    if (t >= T_MAXIMO) { // la línea del empate y el check
      rect(frente, x0 + 16, y2 + 22, 60, 2, R5.verde[2]);
      check(frente, x0 + 80, y2 + 10, R5.verde[2]);
      destello5(frente, brillo, x0 + 46, y2 + 10, t, T_MAXIMO, VERDE5);
    }
    if (t >= T_MITAD) { // la mitad: una barra se parte y queda la mitad
      const bx = x0 + 104, by = 236;
      rect(frente, bx - 1, by - 1, 56, 26, C); rect(frente, bx, by, 54, 24, "#14202a");
      const lleno = Math.round(50 * pasos(t, T_MITAD, T_MITAD + 0.6, 5));
      if (lleno > 0) { rect(frente, bx + 2, by + 2, lleno, 20, R5.verde[1]); rect(frente, bx + 2, by + 2, lleno, 1, R5.verde[3]); }
      for (let k = 0; k < 24; k += 4) rect(frente, bx + 27, by + k, 1, 2, C);
      destello5(frente, brillo, bx + 27, by + 12, t, T_MITAD, VERDE5);
    }
  }

  // ---------- 7 · empieza por Opus ----------
  function estacion7(t) {
    const { medio, frente, brillo } = L, x0 = X(6);
    // la ficha de Opus 5.5 con la corona de «empieza por este»
    const ox = x0 + 150, oy = 206;
    const s = t >= T_SUBE ? (salto(t, T_SUBE) || 0) : 40;
    rect(frente, ox, oy + s, 70, 46, C); rect(frente, ox + 1, oy + 1 + s, 68, 44, R5.ia[1]); rect(frente, ox + 1, oy + 1 + s, 68, 1, R5.ia[3]);
    rect(frente, ox + 6, oy + 8 + s, 26, 6, R5.ia[3]); rect(frente, ox + 6, oy + 18 + s, 40, 3, R5.ia[0]);
    for (let k = 0; k < 3; k++) rect(frente, ox + 54, oy + 8 + k * 10 + s, 8, 6, k === 0 ? R5.verde[2] : R5.ia[0]);
    if (t >= T_SUBE) { // corona y flecha que apunta a la ficha
      rect(frente, ox + 20, oy - 14 + s, 30, 12, C); rect(frente, ox + 21, oy - 13 + s, 28, 10, ORO[1]); rect(frente, ox + 21, oy - 13 + s, 28, 1, ORO[2]);
      for (let k = 0; k < 3; k++) rect(frente, ox + 24 + k * 9, oy - 17 + s, 4, 4, ORO[2]);
      rect(brillo, ox - 4, oy - 6, 78, 58, R5.ia[0]);
      destello5(frente, brillo, ox + 35, oy + 23, t, T_SUBE, AZUL5);
    }
    // el muro de los cuatro cambios: cuatro bloques que se agrietan con «rompen»
    const mx = x0 + 16, my = 258;
    for (let k = 0; k < 4; k++) {
      const bx = mx + k * 26, roto = t >= T_ROMPEN;
      rect(frente, bx, my, 24, 24, C); rect(frente, bx + 1, my + 1, 22, 22, roto ? "#5a3a3a" : "#4a5266"); rect(frente, bx + 1, my + 1, 22, 1, roto ? "#7a4a4a" : "#6a7488");
      if (roto) { for (let j = 0; j < 6; j++) rect(frente, bx + 4 + ((j * 5) % 16), my + 3 + j * 3, 2, 2, C); rect(frente, bx + 10, my + 2, 2, 20, C); }
    }
    if (t >= T_ROMPEN) destello5(frente, brillo, mx + 50, my + 12, t, T_ROMPEN, NARANJA5);
    // el interruptor del pensamiento, clavado en «activado» (ya no se puede desactivar)
    const sx = x0 + 130, sy = 266;
    rect(frente, sx - 1, sy - 1, 46, 22, C); rect(frente, sx, sy, 44, 20, t >= T_PENSAMIENTO ? R5.verde[1] : "#2a3040");
    rect(frente, sx + (t >= T_PENSAMIENTO ? 24 : 2), sy + 2, 18, 16, C); rect(frente, sx + (t >= T_PENSAMIENTO ? 25 : 3), sy + 3, 16, 14, R5.metal[3]);
    if (t >= T_PENSAMIENTO) destello5(frente, brillo, sx + 22, sy + 10, t, T_PENSAMIENTO, VERDE5);
    if (t >= T_DESACT) { // el candado sobre el interruptor
      const s2 = salto(t, T_DESACT) || 0;
      rect(frente, sx + 14, sy - 18 + s2, 16, 12, C); rect(frente, sx + 15, sy - 17 + s2, 14, 10, ORO[1]); rect(frente, sx + 18, sy - 22 + s2, 2, 5, ORO[2]); rect(frente, sx + 24, sy - 22 + s2, 2, 5, ORO[2]);
    }
  }

  // ---------- 8 · cierre ----------
  function estacion8(t) {
    const { medio, frente, brillo } = L, x0 = X(7);
    // el cierre: el trofeo en el centro, con la etiqueta de precio colgando; MISTA a la izquierda, sin taparlos
    trofeo(medio, brillo, x0 + 150, SU - 6, t, t >= T_GANA); // TROFEO-CENTRO
    if (t >= T_GANA) destello5(frente, brillo, x0 + 150, SU - 40, t, T_GANA, NARANJA5); // DESTELLO-CENTRO
    // la etiqueta de precio, colgando del trofeo
    if (t >= T_BARATO25) {
      const s = salto(t, T_BARATO25) || 0;
      rect(medio, x0 + 122, 176 + s, 56, 18, C); rect(medio, x0 + 123, 177 + s, 54, 16, R5.naranja[1]); rect(medio, x0 + 123, 177 + s, 54, 1, R5.naranja[3]);
      rect(medio, x0 + 148, 194 + s, 4, 12, C);
      for (let k = 0; k < 10; k++) rect(medio, x0 + 130 + k * 4, 184 + s, 2, 3, R5.naranja[3]);
    }
  }

  // ---------- MISTA ----------
  function mista(t) {
    const [ax, ay] = M.asoma;
    if (t < T_SLIDE_FIN) { // entrada de tema: entero con el titular; sale con el desplazamiento lateral
      const [gx, gy] = M.gato;
      gato(G12, Math.round(gx / 3), Math.round(gy / 3), { pose: t > 0.45 ? "senalar" : "pie", t, hablando: hablando(t) }, 1);
      G12.style.transform = t < T_SLIDE ? "" : `translateX(${-Math.round(prog(t, T_SLIDE, T_SLIDE_FIN) * W)}px)`;
      return;
    }
    G12.style.transform = "";
    const de = (a, b) => t >= a && t < b;
    if (de(T_A4, T_MISTA4_FIN)) gato(G12, Math.round(ax / 3), Math.round(ay / 3) + (salto(t, T_A4) || 0), { pose: t > T_A4 + 0.5 ? "senalar" : "pie", t, hablando: hablando(t) }, 1);
    else if (t >= T_A8) gato(G12, Math.round(ax / 3), Math.round(ay / 3) + (salto(t, T_A8) || 0), { pose: t > T_BARATO25 ? "celebrar" : "senalar", t, hablando: hablando(t) }, 1);
  }

  // ---------- cámara ----------
  const centro = (n) => X(n) + M.SX;
  const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: MW, altoMundo: H, planos: [
    [0, "corte", 1, M.SX, M.SY],
    [T_V1, "mover", 1, centro(1), M.SY, VIAJE],
    [T_V2, "mover", 1, centro(2), M.SY, VIAJE],
    [T_V3, "mover", 1, centro(3), M.SY, VIAJE],
    [T_V4, "mover", 1, centro(4), M.SY, VIAJE],
    [T_S4, "mover", 1, centro(4), M.SY, SLIDE], // cambio de tema: desplazamiento de 0,4 s
    [T_Z5, "zoom", 1.25, centro(4), 220], // zoom core: la balanza del precio (entra con «cuesta», cuando ya está todo en pantalla)
    [T_C5, "corte", 1, centro(4), M.SY],
    [T_V5, "mover", 1, centro(5), M.SY, VIAJE],
    [T_V7, "mover", 1, centro(6), M.SY, VIAJE],
    [T_V8, "mover", 1, centro(7), M.SY, VIAJE],
  ] });
  const CAPAS = [
    { el: document.getElementById("p-lejos"), d: 0.6 },
    { el: document.getElementById("p-medio"), d: 1 },
    { el: document.getElementById("p-delante"), d: 1.35 },
  ];

  // ---------- caja de diálogo ----------
  const D5 = crearDialogo5({ T, ids: T.frases.map((f) => f.id), claves: { fr01: "recomienda", fr02: "barato", fr03: "mismo", fr04: "verificadas",
    fr05: "días", fr06: "rápido", fr07: "techo", fr08: "otro", fr09: "FrontierCode", fr10: "anterior", fr11: "Opus 5.5", fr12: "ciencia", fr13: "triplica",
    fr14: "precio", fr15: "cuesta", fr16: "ocho", fr17: "doble", fr18: "tarea", fr19: "mitad", fr20: "estimación", fr21: "Sube", fr22: "nombre",
    fr23: "pensamiento", fr24: "gana", fr25: "barato" },
    maxc: 21, corto: true, dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"), retrato: document.getElementById("retrato") });

  // ---------- sonido: atado a lo que pasa en pantalla ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    // solo lo clave (Mario, 2026-10-30): transiciones y lo que aparece o reacciona en los datos decisivos
    add(T_SLIDE, "destello"); add(T_S4, "destello");
    VIAJES.forEach(([a]) => add(a, "destello"));
    add(T_NUEVO, "aparicion"); add(T_DOBLE, "error");
    add(T_MYTHOS, "seleccion");
    add(T_TECHO, "error");
    add(T_SACA, "aparicion"); add(T_F51, "aparicion"); add(T_OPUS, "aparicion"); add(T_CUARENTA9, "acierto");
    add(T_SETENTA, "aparicion"); add(T_ROBOT, "seleccion");
    add(T_OCHO, "error"); add(T_DOBLE17, "error");
    add(T_MAXIMO, "acierto"); add(T_MITAD, "acierto");
    add(T_SUBE, "seleccion"); add(T_ROMPEN, "error"); add(T_PENSAMIENTO, "acierto");
    add(T_V8, "destello"); add(T_GANA, "acierto"); add(T_BARATO25, "tick");
    return ev.sort((a, b) => a.t - b.t);
  };

  // Para motor/revisar.mjs: viajes, salidas de cámara y piezas clave
  window.revision = { movimientos: MOVIMIENTOS, salidas: SALIDAS,
    claves: [{ t: T_CUARENTA9, nombre: "49 % en FrontierCode" }, { t: T_CUESTA, nombre: "la balanza del precio" }, { t: T_SUBE, nombre: "empieza por Opus 5.5" }, { t: T_BARATO25, nombre: "el que gana más barato" }] };

  window.seek = (t) => {
    Object.values(L).forEach((s) => s.replaceChildren()); G12.replaceChildren();
    const cam = CAM.en(t);
    const moviendo = MOVIMIENTOS.some(([a, b]) => t >= a && t < b);
    CAM.aplicarCapas(cam, CAPAS);
    cielo(t);
    const enTema = t < T_SLIDE;
    ["p-medio", "p-delante"].forEach((id) => {
      const el = document.getElementById(id);
      el.style.visibility = enTema ? "hidden" : "visible";
      if (t >= T_SLIDE && t < T_SLIDE_FIN) el.style.transform = `translateX(${Math.round((1 - prog(t, T_SLIDE, T_SLIDE_FIN)) * W)}px)`;
    });
    if (!enTema) {
      suelo();
      // solo se dibujan las estaciones que pueden verse (la actual y sus vecinas)
      const n = lim(Math.round((M.SX - cam.tx) / cam.k / W - 0.5), 0, N - 1);
      const DIB = [estacion1, estacion2, estacion3, estacion4, estacion5, estacion6, estacion7, estacion8];
      for (let k = Math.max(0, n - 1); k <= Math.min(N - 1, n + 1); k++) DIB[k](t);
      delante();
    }
    mista(t);
    T5.ver(t, cam, moviendo);
    pintarFuente(t);
    D5.pintar(t);
  };
  window.seek(0);
})();
