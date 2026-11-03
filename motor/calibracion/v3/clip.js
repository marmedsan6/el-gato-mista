// Calibración del estilo v3 (2026-11-03), a partir de la referencia ref-01 (reel De-F4riBJ1K) y las respuestas de Mario:
// todo a 12 px (rejilla de arte 90×160 por pantalla), escenas simples con objetos grandes, profundidad de campo (pared y
// suelo delantero desenfocados, plano medio nítido), conos de luz, MISTA sombreado a mano, acercamiento lento continuo,
// travelling por una pared de cuadros (MISTA sale de cuadro) y un zoom core. Tramo real de Mithril: los matices (35,0-50,4 s).
// Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  const DESDE = 35.0; // el clip empieza en este segundo del short (la voz se corta igual)
  const W = 270, H = 480, U = 3; // pantalla en px CSS; 1 unidad de arte = 3 px CSS = 12 px de salida
  const SUELO = 98; // unidades: el suelo queda justo encima de la caja de diálogo (y=100)
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
  const hablando = (t) => PALABRAS.some((p) => t >= p.i && t <= p.f);
  const VIAJE3 = FR.fr09.inicio + 0.3, LLEGA3 = VIAJE3 + 1.1; // el travelling al tercer cuadro espera a la frase

  // ---------- lienzos: el arte se dibuja en unidades (viewBox 270×160 = 3 pantallas de 90×160) ----------
  const L = {};
  for (const id of ["lejos", "medio", "brillo", "frente", "delante"]) {
    L[id] = lienzo(id);
    L[id].setAttribute("viewBox", "0 0 270 160");
    L[id].setAttribute("width", 810); L[id].setAttribute("height", 480); // el mundo mide 3 pantallas de ancho
  }
  const caja = document.getElementById("textos"), cajaUI = document.getElementById("textos-ui");
  const nodos = {};
  function texto(id, desde, hasta, clase, html, x, y, estilo = "", ui = false) {
    const d = document.createElement("div");
    d.className = `${clase} oculto`; d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`;
    Object.assign(d.dataset, { x, y, desde, hasta });
    (ui ? cajaUI : caja).appendChild(d); nodos[id] = d;
  }
  function ver(t) {
    Object.values(nodos).forEach((d) => {
      const s = salto(t, Number(d.dataset.desde)), visible = s !== null && t < Number(d.dataset.hasta);
      d.classList.toggle("oculto", !visible);
      if (visible) d.style.top = `${Number(d.dataset.y) + s}px`;
    });
  }

  // ---------- la galería: 3 cuadros, uno por pantalla ----------
  const CUADROS = [45, 135, 225]; // centro x de cada cuadro (unidades)
  const CY = 38, CW = 56, CH = 30; // marco: y, ancho y alto (unidades); bajo el rótulo, con aire, y sin lienzo vacío
  const FIN = 99; // los textos no caducan dentro del clip
  const ANCHO_CARTELA = "width:118px", cartela = (k) => (CUADROS[k] + CW / 2) * U - 118; // cartela bajo el borde derecho
  const izq = (k) => (CUADROS[k] - CW / 2 + 3) * U + 6; // x CSS del texto dentro del lienzo del cuadro
  // Cuadro 1 · consultores
  texto("c1a", DESDE, FIN, "tarjeta-texto", "Empleados: <b style='font-size:16px'>1</b>", izq(0), 129);
  texto("c1b", P("fr07", "solo"), FIN, "tarjeta-texto", "+ consultores", izq(0), 151, "color:#b4622a");
  texto("c1c", P("fr07", "consultores"), FIN, "tarjeta-texto", "a tiempo parcial", izq(0), 165);
  texto("c1f", P("fr07", "consultores"), FIN, "fuente-dato con-fondo", "Fuente:<br>C. Tranbarger", cartela(0), 210, ANCHO_CARTELA);
  // Cuadro 2 · fase temprana y revisión por pares
  texto("c2a", FR.fr08.inicio, FIN, "tarjeta-texto", "Fase:", izq(1), 129);
  texto("c2b", P("fr08", "temprana"), FIN, "tarjeta-texto", "Temprana", izq(1), 141, "color:#b4622a");
  texto("c2c", P("fr08", "revision"), FIN, "tarjeta-texto", "Revisión por", izq(1), 159);
  texto("c2d", P("fr08", "revision"), FIN, "tarjeta-texto", "pares:", izq(1), 171);
  texto("c2e", P("fr08", "pares"), FIN, "tarjeta-texto", "No", izq(1) + 56, 171, "color:#c0303a");
  texto("c2f", P("fr08", "pares"), FIN, "fuente-dato con-fondo", "Fuente:<br>The Next Web", cartela(1), 210, ANCHO_CARTELA);
  // Cuadro 3 · ensayos en humanos
  texto("c3a", P("fr09", "pronto"), FIN, "tarjeta-texto", "Como pronto:", izq(2), 127, "color:#b4622a");
  texto("c3b", P("fr09", "finales"), FIN, "tarjeta-texto", "finales de 2028", izq(2), 138, "color:#b4622a");
  texto("c3c", P("fr09", "humanos"), FIN, "tarjeta-texto", "2026", (CUADROS[2] - 18) * U - 16, 165);
  texto("c3d", P("fr09", "humanos"), FIN, "tarjeta-texto", "2029", (CUADROS[2] + 18) * U - 16, 165, "color:#8a7a68");
  texto("c3e", P("fr09", "bien"), FIN, "tarjeta-texto", "si todo va bien", izq(2), 181);
  texto("c3f", P("fr09", "2028"), FIN, "fuente-dato con-fondo", "Fuente:<br>Anthropic", cartela(2), 210, ANCHO_CARTELA);
  // Rótulos de cabecera (interfaz fija)
  texto("r1", DESDE, VIAJE3 + 0.55, "rotulo", 'Ahora, los <span class="clave">matices</span>', 16, 64, "", true);
  texto("r2", VIAJE3 + 0.55, FIN, "rotulo", "Ensayos en humanos", 16, 64, "", true);
  tildesPixel();

  function galeria(t) {
    const { lejos, medio, brillo, delante } = L;
    // Pared y techo (lejos, muy desenfocados)
    bandas(lejos, 0, 86, ["#2a2140", "#30264a", "#372c53", "#3e325d", "#453766"]);
    rect(lejos, 0, 0, 270, 6, "#16111f");
    rect(lejos, 0, 84, 270, 14, "#2a2140"); rect(lejos, 0, 84, 270, 2, "#5a4a78"); rect(lejos, 0, 86, 270, 1, "#1d162c");
    for (let x = 2; x < 270; x += 18) { rect(lejos, x, 88, 14, 8, "#30264a"); rect(lejos, x, 88, 14, 1, "#3e325d"); rect(lejos, x, 95, 14, 1, "#1d162c"); }
    // Columnas entre cuadros (plano medio, nítidas)
    for (const x of [90, 180]) {
      rect(medio, x - 6, 66, 12, 3, "#9a9280"); rect(medio, x - 6, 68, 12, 1, "#6e6658");
      rect(medio, x - 4, 69, 8, 29, "#7e7666"); rect(medio, x - 4, 69, 2, 29, "#a49c8a"); rect(medio, x + 3, 69, 1, 29, "#5a5348");
      rect(medio, x - 6, 96, 12, 2, "#5a5348");
    }
    CUADROS.forEach((cx, k) => {
      const x = cx - CW / 2;
      // Foco del techo y su cono de luz (brillo con bloom): escalonado cada 2 unidades
      rect(lejos, cx - 4, 6, 8, 3, "#463a5c"); rect(lejos, cx - 2, 9, 4, 1, "#fff1c4");
      for (let y = 10; y < SUELO; y += 2) {
        const a = Math.round(3 + (y - 10) * 0.55);
        rect(brillo, cx - a, y, a * 2, 2, "#5a4630");
      }
      rect(brillo, cx - 34, 96, 68, 6, "#6a5232"); rect(brillo, cx - 24, 102, 48, 4, "#5a4428"); // charco de luz en el suelo
      // Marco dorado con luz y sombra; lienzo crema
      rect(medio, x, CY, CW, CH, "#4a3418");
      rect(medio, x + 1, CY + 1, CW - 2, CH - 2, "#c9a84a");
      rect(medio, x + 1, CY + 1, CW - 2, 1, "#f2d27a"); rect(medio, x + 1, CY + 1, 1, CH - 2, "#e4c262");
      rect(medio, x + 1, CY + CH - 2, CW - 2, 1, "#8a6a2a"); rect(medio, x + CW - 2, CY + 1, 1, CH - 2, "#9c7a32");
      rect(medio, x + 3, CY + 3, CW - 6, CH - 6, "#efe6d2");
      rect(medio, x + 3, CY + 3, CW - 6, 1, "#d6cbb2"); rect(medio, x + 3, CY + 3, 1, CH - 6, "#ddd2ba");
      rect(medio, x + 2, CY + CH, CW - 4, 1, "#140f1c"); // sombra del marco en la pared
    });
    // Suelo de madera (delante, desenfocado) y postes de cordón en primer plano
    rect(delante, 0, SUELO, 270, 62, "#3a2a20");
    for (let y = SUELO + 3; y < 160; y += 5) rect(delante, 0, y, 270, 1, "#2c2018");
    for (let x = 7; x < 270; x += 23) rect(delante, x, SUELO, 1, 62, "#33251c");
    for (let x = 24; x < 204; x += 1) { const c = (x - 24) % 90, y = 116 + Math.round(Math.sin((c / 90) * Math.PI) * 5); rect(delante, x, y, 1, 2, "#8a2a3a"); }
    for (const x of [22, 112, 202]) {
      rect(delante, x, 116, 3, 44, "#6a5530"); rect(delante, x - 1, 113, 5, 4, "#c9a84a");
      rect(brillo, x - 2, 112, 7, 6, "#6a5232");
    }
    // Motas de polvo que flotan en los conos de luz (en la capa de brillo: a 12 px, nítidas parecían píxeles sueltos)
    CUADROS.forEach((cx, k) => {
      const azar = mulberry32(90 + k);
      for (let j = 0; j < 6; j++) {
        const bx = cx - 14 + azar() * 28, fase = azar(), y = 70 - ((t * 3 + fase * 50) % 50);
        rect(brillo, Math.round(bx + Math.sin(t + fase * 6)), Math.round(y), 1, 1, "#ffe9b8");
      }
    });
  }

  // Contenido dibujado de los cuadros (aspa del «No» y línea temporal), en el plano medio
  function contenido(t) {
    const { frente } = L;
    if (t >= P("fr08", "pares")) { // aspa roja junto al «No»
      const ax = (CUADROS[1] - CW / 2 + 3) + 27, ay = 57;
      for (let i = 0; i < 4; i++) { rect(frente, ax + i, ay + i, 1, 1, "#c0303a"); rect(frente, ax + 3 - i, ay + i, 1, 1, "#c0303a"); }
    }
    if (t >= P("fr09", "humanos")) { // eje 2026-2029 con la flecha que llega a finales de 2028
      const cx = CUADROS[2], y = 54;
      rect(frente, cx - 18, y, 36, 1, "#6b5a48");
      for (const dx of [-18, -6, 6, 18]) rect(frente, cx + dx, y - 1, 1, 3, "#6b5a48");
      if (t >= P("fr09", "pronto")) {
        const ax = cx - 6 + Math.round(21 * paso(prog(t, P("fr09", "pronto"), P("fr09", "2028")), 0.125));
        for (let i = 0; i < 3; i++) rect(frente, ax - 2 + i, y - 4 + i, 5 - 2 * i, 1, "#ff8a3d");
      }
    }
  }

  // ---------- MISTA: junto al primer cuadro y, tras el segundo travelling, junto al tercero ----------
  function mista(t) {
    const pose = t >= FR.fr09.inicio ? "pensar" : "pie";
    gato(L.frente, 4, SUELO - 32, { pose, t, hablando: hablando(t) }, 1);
    if (t >= LLEGA3) gato(L.frente, 184, SUELO - 32 + (salto(t, LLEGA3) || 0), { pose: "pensar", t, hablando: hablando(t) }, 1);
  }

  // ---------- cámara (px CSS; centros de cuadro en 135, 405 y 675) ----------
  const CAM = crearCamara({ W, H, SX: 135, SY: 180, lineaCaja: 300, anchoMundo: 810, planos: [
    [0, "corte", 1, 135, 240],
    [DESDE + 0.25, "mover", 13 / 12, 135, 195, 4.6], // acercamiento lento anclado al suelo: el píxel pasa de 12 a 13 px
    [FR.fr08.inicio - 0.45, "mover", 1, 405, 240, 1.1], // travelling al segundo cuadro (MISTA queda fuera)
    [P("fr08", "informe"), "zoom", 1.5, 405, 172], // zoom core a escalones (18 px por píxel)
    [FR.fr08.fin, "corte", 1, 405, 240], // sale con corte seco; después, el travelling
    [VIAJE3, "mover", 1, 675, 240, 1.1], // travelling al tercer cuadro
    [LLEGA3 + 0.3, "mover", 13 / 12, 675, 195, 50.4 - (LLEGA3 + 0.3)], // acercamiento lento hasta el final
  ] });

  // ---------- caja de diálogo (páginas de ≤ 2 líneas de ~21 caracteres) ----------
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  const CLAVES = { fr07: "matices", fr08: "temprana", fr09: "2028" };
  const PAGINAS = [];
  const lineas = (ps) => ps.reduce((acc, p) => {
    const u = acc[acc.length - 1];
    if (u && u.length + 1 + p.p.length <= 21) acc[acc.length - 1] = `${u} ${p.p}`; else acc.push(p.p);
    return acc;
  }, []).length;
  ["fr07", "fr08", "fr09"].forEach((id) => {
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
    retratoGato(svgRetrato, 5, 4.5, { t, hablando: false }, 1.5); // 1,5 px CSS = 6 px de salida, la mitad de 12
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = norm(CLAVES[pag.fr]);
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡]+$/, ""), punt = p.p.slice(nucleo.length);
      const c = norm(nucleo) === clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p.p;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ") + (dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  }

  // ---------- sonido (tiempos del clip): atado a la pantalla ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round((t - DESDE) * 1000) / 1000, tipo });
    add(FR.fr08.inicio - 0.45, "destello"); add(VIAJE3, "destello"); // travellings
    add(P("fr08", "pares"), "error"); // el «No» y su aspa
    add(P("fr09", "2028"), "tick"); // la flecha llega a finales de 2028
    add(LLEGA3, "aparicion"); // MISTA aparece junto al tercer cuadro
    return ev;
  };

  const mundo = document.getElementById("mundo");
  window.seek = (tc) => {
    const t = tc + DESDE;
    Object.values(L).forEach((s) => s.replaceChildren());
    const cam = CAM.en(t);
    CAM.aplicar(cam, mundo);
    galeria(t); contenido(t); mista(t);
    ver(t);
    CAM.fuentesSinZoom(cam, caja, 16, 237);
    pintarDialogo(t);
  };
  window.seek(0);
})();
