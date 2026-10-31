// mithril-ia-medicina · short. Estilo v1 (docs/estilo.md) + style_guide.md del vídeo. Storyboard: shotlist.md.
// Todo se pinta desde t y desde timing.js (palabras alineadas con la voz): cada elemento entra en la palabra que lo nombra.
// Contrato seek(t): sin reloj, sin animaciones CSS; azar solo con semilla.
(() => {
  const W = 270, H = 480;
  const C = { fondo: "#0c1016", violeta: "#1e1727", panel: "#171e2a", linea: "#36373b", texto: "#f5f7fb", suave: "#8a93a6",
    naranja: "#ff8a3d", azul: "#5b8cff", rojo: "#e0454f", verde: "#1fd69a", seleccion: "#3d68ba" };
  const T = window.TIMING;
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  // Inicio de la n-ésima palabra de una frase que contiene `trozo` (normalizado). Si no existe, se avisa.
  function P(fr, trozo, n = 1) {
    const ps = FR[fr].palabras.filter((p) => norm(p.p).includes(norm(trozo)));
    if (!ps[n - 1]) throw new Error(`No encuentro «${trozo}» en ${fr}`);
    return ps[n - 1].i;
  }
  const FIN = (fr) => FR[fr].fin;

  // Bloques: el destello cae en el silencio entre la última frase de un bloque y la primera del siguiente.
  const medio = (a, b) => (FIN(a) + FR[b].inicio) / 2;
  const CORTES = [medio("fr03", "fr04"), medio("fr06", "fr07"), medio("fr09", "fr10")];
  const DESTELLO = 0.3;
  const bloque = (t) => (t < CORTES[0] ? "A" : t < CORTES[1] ? "B" : t < CORTES[2] ? "C" : "D");
  // Escena dentro del bloque (cambia al empezar cada frase)
  const ESCENAS = [["e01", 0], ["e02", FR.fr02.inicio - 0.2], ["e03", FR.fr03.inicio - 0.2], ["e04", CORTES[0]],
    ["e05", FR.fr05.inicio - 0.2], ["e06", FR.fr06.inicio - 0.2], ["e07", CORTES[1]], ["e08", FR.fr08.inicio - 0.2],
    ["e09", FR.fr09.inicio - 0.2], ["e10", CORTES[2]]];
  const escena = (t) => ESCENAS.filter(([, a]) => t >= a).pop()[0];

  const paso = (v, p) => Math.floor(v / p + 1e-9) * p;
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const salto = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);

  // ---------- capas y textos ----------
  const s = { fondo: lienzo("fondo"), brillo: lienzo("brillo"), frente: lienzo("frente"), destello: lienzo("destello") };
  const capaFondo = document.getElementById("capa-fondo");
  const caja = document.getElementById("textos");
  const nodos = {};
  function texto(id, escenaId, clase, html, x, y, estilo = "") {
    const d = document.createElement("div");
    d.className = clase;
    d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`;
    Object.assign(d.dataset, { y, escena: escenaId });
    caja.appendChild(d);
    nodos[id] = d;
  }
  function ver(id, t, a) {
    const d = nodos[id];
    const sl = salto(t, a);
    const visible = sl !== null && escena(t) === d.dataset.escena && !enDestello(t);
    d.classList.toggle("oculto", !visible);
    if (visible) d.style.top = `${Number(d.dataset.y) + sl}px`;
    return visible;
  }

  // e01 · una persona, once laboratorios, una IA
  texto("e01-tit", "e01", "titular", 'Una <span class="clave">persona</span>', 16, 64);
  texto("e01-labs", "e01", "etiqueta", "11 laboratorios", 16, 176);
  texto("e01-ia", "e01", "insignia", "+ IA de mano derecha", 16, 204);
  // e02 · la ficha de Mithril
  texto("e02-rot", "e02", "rotulo", "Mithril Medicine", 16, 64);
  texto("e02-emp", "e02", "etiqueta suave", "Empleados:", 28, 112);
  texto("e02-uno", "e02", "dato", "1", 120, 104, "color:var(--texto)");
  texto("e02-mis", "e02", "etiqueta", "Misión", 28, 156, "color:var(--naranja)");
  texto("e02-m1", "e02", "etiqueta", "Tratamientos para", 28, 176);
  texto("e02-m2", "e02", "etiqueta", "2 distrofias", 28, 192);
  texto("e02-m3", "e02", "etiqueta", "musculares raras", 28, 208);
  texto("e02-fte", "e02", "fuente-dato", "Fuente: Anthropic", 16, 252);
  // e03 · el gen LAMA2
  texto("e03-gen", "e03", "rotulo", 'Gen <span class="clave">LAMA2</span>', 16, 64);
  texto("e03-fz", "e03", "etiqueta suave", "Fuerza muscular", 28, 168);
  texto("e03-g1", "e03", "etiqueta", "Forma grave:", 28, 208);
  texto("e03-g2", "e03", "etiqueta", "desde el nacimiento", 28, 224);
  texto("e03-g3", "e03", "etiqueta", "o los primeros meses", 28, 240);
  texto("e03-fte", "e03", "fuente-dato", "Fuente: MedlinePlus", 16, 274);
  // e04 · Claude y los once laboratorios
  texto("e04-cl", "e04", "rotulo", "Claude", 111, 120);
  texto("e04-c1", "e04", "etiqueta", "Contratos", 44, 216);
  texto("e04-c2", "e04", "etiqueta", "Logística", 44, 236);
  texto("e04-c3", "e04", "etiqueta", "Experimentos", 44, 256);
  texto("e04-fte", "e04", "fuente-dato", "Fuente: Anthropic", 16, 282);
  // e05 · menos de 18 meses
  texto("e05-rot", "e05", "rotulo", "De la idea a…", 16, 64);
  texto("e05-mes", "e05", "dato", "0", 16, 92, "color:var(--azul)");
  texto("e05-mesl", "e05", "etiqueta suave", "meses", 80, 100);
  texto("e05-i", "e05", "etiqueta suave", "Idea", 16, 154);
  texto("e05-r", "e05", "etiqueta", "En ratones", 140, 192);
  texto("e05-fte", "e05", "fuente-dato", "Fuente: Anthropic", 16, 268);
  // e06 · la compra
  texto("e06-ok", "e06", "titular", "Adquirida", 40, 120, "color:var(--verde)");
  texto("e06-fe", "e06", "dato", "27·10·2026", 40, 152, "color:var(--texto); font-size:20px");
  texto("e06-q", "e06", "etiqueta", "Anthropic → Mithril", 40, 188);
  texto("e06-fte", "e06", "fuente-dato", "Fuente: Anthropic", 16, 268);
  // e07 · los matices: no lo hizo solo
  texto("e07-rot", "e07", "rotulo", 'Ahora, los <span class="clave">matices</span>', 16, 64);
  texto("e07-emp", "e07", "etiqueta suave", "Empleados:", 28, 112);
  texto("e07-uno", "e07", "dato", "1", 120, 104, "color:var(--texto)");
  texto("e07-c1", "e07", "etiqueta", "+ consultores", 28, 156, "color:var(--naranja)");
  texto("e07-c2", "e07", "etiqueta suave", "(a tiempo parcial)", 28, 172);
  texto("e07-fte", "e07", "fuente-dato", "Fuente: C. Tranbarger", 16, 268);
  // e08 · fase temprana, sin revisión por pares
  texto("e08-f1", "e08", "etiqueta suave", "Fase:", 28, 112);
  texto("e08-f2", "e08", "etiqueta", "Temprana", 28, 128, "color:var(--naranja)");
  texto("e08-r1", "e08", "etiqueta suave", "Revisión por pares:", 28, 168);
  texto("e08-r2", "e08", "etiqueta", "No", 28, 184);
  texto("e08-fte", "e08", "fuente-dato", "Fuente: The Next Web", 16, 268);
  // e09 · ensayos en humanos: como pronto, 2028
  texto("e09-rot", "e09", "rotulo", "Ensayos en humanos", 16, 64);
  texto("e09-a1", "e09", "etiqueta suave", "2026", 20, 176);
  texto("e09-a2", "e09", "etiqueta suave", "2027", 80, 176);
  texto("e09-a3", "e09", "etiqueta", "2028", 140, 176);
  texto("e09-cp", "e09", "etiqueta", "Como pronto:", 96, 112, "color:var(--naranja)");
  texto("e09-fin", "e09", "etiqueta", "finales de 2028", 96, 126, "color:var(--naranja)");
  texto("e09-si", "e09", "etiqueta suave", "Si todo va bien", 16, 216);
  texto("e09-fte", "e09", "fuente-dato", "Fuente: Anthropic", 16, 268);
  // e10 · cierre
  texto("e10-p", "e10", "etiqueta", "1 persona + IA", 16, 96, "color:var(--azul)");
  texto("e10-e", "e10", "etiqueta suave", "Empresa entera", 16, 140);
  texto("e10-t1", "e10", "titular", "De momento:", 16, 196);
  texto("e10-t2", "e10", "titular", '<span class="clave">ratones</span>', 16, 220);
  tildesPixel();

  // ---------- sprites pixel ----------
  function sprite(sv, x, y, filas, paleta, e = 2) {
    filas.forEach((f, j) => [...f].forEach((ch, i) => { if (paleta[ch]) rect(sv, x + i * e, y + j * e, e, e, paleta[ch]); }));
  }
  const MATRAZ = ["..ttt..", "..t.t..", "..t.t..", ".t...t.", "t.....t", "tlllllt", "tlllllt", ".ttttt."];
  const RATON = ["....oo......", "...oooo..o..", ".oooooooo...", "ooooooooo...", "oxooooooo...", ".ooooooo....", "..o...o....."];
  const ADN = (sv, x, y, alto, color) => {
    for (let j = 0; j < alto; j++) {
      const d = Math.round(Math.sin(j / 5) * 6);
      rect(sv, x + 8 + d, y + j, 2, 1, color); rect(sv, x + 8 - d, y + j, 2, 1, color);
      if (j % 4 === 0) rect(sv, x + 8 - Math.abs(d), y + j, Math.abs(d) * 2 + 2, 1, C.linea);
    }
  };

  // ---------- caja de diálogo: frases en páginas de ≤8 palabras, palabra a palabra con la voz ----------
  const CLAVES = { fr01: "persona", fr02: "Mithril", fr03: "LAMA2", fr04: "Claude", fr05: "ratones", fr06: "comprado",
    fr07: "matices", fr08: "temprana", fr09: "2028", fr10: "ratones" };
  const PAGINAS = [];
  T.frases.forEach((f) => {
    let actual = [];
    f.palabras.forEach((p, k) => {
      actual.push(p);
      const fin = k === f.palabras.length - 1;
      if (fin || actual.length >= 8 || /[.:?!]$/.test(p.p) || (actual.length >= 4 && /[,;]$/.test(p.p))) {
        PAGINAS.push({ fr: f.id, palabras: actual, i: actual[0].i, bloque: bloque(actual[0].i) });
        actual = [];
      }
    });
  });
  const dialogo = document.getElementById("dialogo");
  function pintarDialogo(t) {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag || enDestello(t) || pag.bloque !== bloque(t)) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length;
    const clave = norm(CLAVES[pag.fr] || "");
    dialogo.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡]+$/, ""), punt = p.p.slice(nucleo.length);
      const contenido = norm(nucleo) === clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p.p;
      return k === dichas - 1 ? contenido : `<span class="dicho">${contenido}</span>`;
    }).join(" ") + (dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  }

  // ---------- destello pixelado entre bloques ----------
  const enDestello = (t) => CORTES.some((c) => Math.abs(t - c) < DESTELLO / 2);
  function pintarDestello(t) {
    const c = CORTES.find((x) => Math.abs(t - x) < DESTELLO / 2);
    if (c === undefined) return;
    const p = (t - (c - DESTELLO / 2)) / DESTELLO;
    const intensidad = 0.85 * paso(1 - Math.abs(2 * p - 1), 0.25);
    if (intensidad <= 0) return;
    rect(s.destello, 0, 0, W, H, "#ffffff").setAttribute("opacity", intensidad.toFixed(2));
    const lado = intensidad >= 0.6 ? 2 : 1;
    for (let y = 1; y < H; y += 4) for (let x = 1; x < W; x += 4) rect(s.destello, x, y, lado, lado, C.fondo);
  }

  // ---------- fondos ----------
  function fondoVioleta(t) {
    bandas(s.fondo, 0, 300, ["#1e1727", "#241b33", "#2b2040", "#33264d", "#3b2c58"]);
    const azar = mulberry32(7);
    for (let i = 0; i < 40; i++) {
      const x = azar() * W, y = azar() * 200, fase = azar(), c = azar() < 0.5 ? C.suave : C.texto;
      if (Math.floor(t * 2 + fase * 8) % 4 !== 0) rect(s.fondo, x, y, 1, 1, c);
    }
    montanas(s.fondo, 3, 290, 36, 6, "#2a2238");
    rect(s.fondo, 0, 290, W, H - 290, C.fondo);
  }
  function panel(x, y, w, h, borde = C.linea) {
    rect(s.frente, x, y, w, h, C.panel);
    rect(s.frente, x, y, w, 1, borde); rect(s.frente, x, y + h - 1, w, 1, borde);
    rect(s.frente, x, y, 1, h, borde); rect(s.frente, x + w - 1, y, 1, h, borde);
  }
  function barra(x, y, w, frac, color) {
    rect(s.frente, x, y, w, 8, C.fondo);
    rect(s.frente, x, y, w, 1, C.texto); rect(s.frente, x, y + 7, w, 1, C.texto);
    rect(s.frente, x, y, 1, 8, C.texto); rect(s.frente, x + w - 1, y, 1, 8, C.texto);
    const r = Math.round((w - 2) * lim(frac, 0, 1));
    if (r > 0) rect(s.frente, x + 1, y + 1, r, 6, color);
  }

  // ---------- escenas ----------
  const PINTAR = {
    e01(t) {
      ver("e01-tit", t, 0); // el gancho está desde el primer fotograma
      const a = P("fr01", "once"), b = FR.fr01.palabras.find((p) => norm(p.p) === "laboratorios").f;
      const n = t < a ? 0 : Math.min(11, 1 + Math.floor(prog(t, a, b) * 11));
      for (let k = 0; k < n; k++) sprite(s.frente, 20 + (k % 6) * 34, 104 + Math.floor(k / 6) * 26, MATRAZ, { t: C.texto, l: C.naranja });
      ver("e01-labs", t, P("fr01", "laboratorios"));
      const ia = P("fr01", "ia");
      if (ver("e01-ia", t, ia)) nodos["e01-ia"].style.clipPath = `inset(0 ${100 - paso(prog(t, ia, ia + 0.2) * 100, 25)}% 0 0)`;
    },
    e02(t) {
      ver("e02-rot", t, FR.fr02.inicio - 0.2);
      if (t >= FR.fr02.inicio - 0.2) panel(16, 96, 210, 140);
      ver("e02-emp", t, P("fr02", "solo")); ver("e02-uno", t, P("fr02", "empleado"));
      ver("e02-mis", t, P("fr02", "buscar")); ver("e02-m1", t, P("fr02", "tratamientos"));
      ver("e02-m2", t, P("fr02", "distrofias")); ver("e02-m3", t, P("fr02", "raras"));
      ver("e02-fte", t, P("fr02", "distrofias"));
    },
    e03(t) {
      ver("e03-gen", t, FR.fr03.inicio - 0.2);
      if (t >= FR.fr03.inicio - 0.2) { panel(16, 96, 210, 164); ADN(s.frente, 190, 104, 56, C.suave); linea(s.frente, 120, 76, 190, 104, C.suave); }
      if (ver("e03-fz", t, P("fr03", "debilita"))) {
        const caida = paso(prog(t, P("fr03", "debilita"), P("fr03", "grave")) * 0.7, 0.1);
        barra(28, 182, 150, 1 - caida, C.rojo);
      }
      ver("e03-g1", t, P("fr03", "grave")); ver("e03-g2", t, P("fr03", "nacimiento")); ver("e03-g3", t, P("fr03", "primeros"));
      ver("e03-fte", t, P("fr03", "nacimiento"));
    },
    e04(t) {
      // «CLAUDE» entra al acabar el destello (no en su palabra): si no, el bloque B arranca vacío (blackdetect 20,07-20,33 s).
      const cl = Math.min(P("fr04", "Claude"), CORTES[0] + DESTELLO / 2);
      ver("e04-cl", t, cl);
      const cx = 135, cy = 126;
      const tl = P("fr04", "organizaba"), tf = P("fr04", "laboratorios");
      const n = t < tl ? 0 : Math.min(11, 1 + Math.floor(prog(t, tl, tf) * 11));
      // Los 11 laboratorios aparecen apagados con «CLAUDE» y se encienden (azul + línea) al decir «organizaba».
      for (let k = 0; t >= cl && k < 11; k++) {
        const ang = Math.PI * (0.05 + 0.9 * k / 10) + Math.PI;
        const x = Math.round(cx + Math.cos(ang) * 100), y = Math.round(cy + Math.sin(ang) * 46 + 36);
        const encendido = k < n;
        if (encendido) linea(s.frente, cx, cy + 4, x + 3, y + 3, C.azul);
        rect(s.frente, x, y, 7, 7, encendido ? C.panel : C.linea);
        rect(s.frente, x + 1, y + 1, 5, 5, encendido ? C.azul : C.panel);
        if (encendido) rect(s.brillo, x - 2, y - 2, 11, 11, C.azul);
      }
      if (t >= cl) { rect(s.brillo, cx - 30, cy - 10, 60, 24, C.azul); }
      if (t >= P("fr04", "contratos")) panel(28, 206, 170, 68);
      [["e04-c1", "contratos"], ["e04-c2", "logistica"], ["e04-c3", "experimentos"]].forEach(([id, w], k) => {
        if (ver(id, t, P("fr04", w))) check(s.frente, 180, 216 + k * 20, C.verde);
      });
      ver("e04-fte", t, P("fr04", "laboratorios"));
    },
    e05(t) {
      ver("e05-rot", t, FR.fr05.inicio);
      const a = P("fr05", "menos"), b = P("fr05", "meses");
      nodos["e05-mes"].textContent = String(Math.min(18, Math.floor(prog(t, a, b + 0.3) * 18 + 1e-9)));
      ver("e05-mes", t, a); ver("e05-mesl", t, a);
      ver("e05-i", t, P("fr05", "idea"));
      if (t >= P("fr05", "idea")) barra(16, 168, 200, paso(prog(t, P("fr05", "idea"), P("fr05", "ratones")), 0.05), C.azul);
      if (t >= P("fr05", "ratones")) { sprite(s.frente, 108, 186, RATON, { o: C.suave, x: C.texto }); }
      ver("e05-r", t, P("fr05", "ratones")); ver("e05-fte", t, P("fr05", "prometedores"));
    },
    e06(t) {
      const a = FR.fr06.inicio - 0.2;
      if (t >= a) {
        const crec = paso(prog(t, a, a + 0.2), 0.25);
        const w = Math.round(190 * crec);
        if (w > 0) { panel(40 - 12, 106, w, 104, C.verde); rect(s.brillo, 40 - 12, 106, w, 104, C.verde); }
      }
      ver("e06-fe", t, P("fr06", "27")); ver("e06-ok", t, P("fr06", "comprado"));
      ver("e06-q", t, P("fr06", "Anthropic")); ver("e06-fte", t, P("fr06", "anuncio"));
    },
    e07(t) {
      ver("e07-rot", t, P("fr07", "matices"));
      if (t >= P("fr07", "hizo")) panel(16, 96, 210, 110);
      ver("e07-emp", t, P("fr07", "hizo")); ver("e07-uno", t, P("fr07", "solo"));
      ver("e07-c1", t, P("fr07", "solo")); ver("e07-c2", t, P("fr07", "consultores"));
      ver("e07-fte", t, P("fr07", "consultores"));
    },
    e08(t) {
      if (t >= FR.fr08.inicio) panel(16, 96, 210, 112);
      ver("e08-f1", t, FR.fr08.inicio); ver("e08-f2", t, P("fr08", "temprana"));
      ver("e08-r1", t, P("fr08", "revision"));
      if (ver("e08-r2", t, P("fr08", "pares"))) aspa(s.frente, 52, 184, C.rojo);
      ver("e08-fte", t, P("fr08", "pares"));
    },
    e09(t) {
      ver("e09-rot", t, FR.fr09.inicio);
      if (t >= P("fr09", "humanos")) {
        // Tramos de un año: 2026 [24-84), 2027 [84-144), 2028 [144-204]; «finales de 2028» = x 196
        rect(s.frente, 24, 160, 181, 1, C.suave);
        [24, 84, 144, 204].forEach((x) => rect(s.frente, x, 156, 1, 9, C.suave));
        ver("e09-a1", t, P("fr09", "humanos")); ver("e09-a2", t, P("fr09", "humanos")); ver("e09-a3", t, P("fr09", "humanos"));
        // El marcador solo aparece y se mueve con «como pronto», y termina en finales de 2028 (no se queda en 2026)
        const desde = P("fr09", "pronto");
        if (t >= desde) {
          const m = paso(prog(t, desde, P("fr09", "2028")), 0.125);
          const x = 84 + Math.round(112 * m);
          puntaFlecha(s.frente, x, 150, "aba", C.naranja, 5);
          rect(s.brillo, x - 4, 144, 9, 9, C.naranja);
        }
      }
      ver("e09-cp", t, P("fr09", "pronto")); ver("e09-fin", t, P("fr09", "finales")); ver("e09-si", t, P("fr09", "bien"));
      ver("e09-fte", t, P("fr09", "2028"));
    },
    e10(t) {
      if (ver("e10-p", t, CORTES[2] + DESTELLO / 2)) {
        const a = P("fr10", "acerca"), lleno = 0.35 + paso(prog(t, a, a + 0.8) * 0.45, 0.05);
        barra(16, 112, 210, lleno, C.azul);
      }
      if (ver("e10-e", t, P("fr10", "empresa"))) barra(16, 156, 210, 1, C.suave);
      ver("e10-t1", t, P("fr10", "momento")); ver("e10-t2", t, P("fr10", "ratones"));
      if (t >= P("fr10", "ratones")) sprite(s.frente, 132, 246, RATON, { o: C.texto, x: C.naranja });
    },
  };

  // Efectos de sonido con los mismos tiempos que la imagen (motor/eventos.mjs los saca; motor/mezcla.mjs los coloca
  // 1 fotograma después). Tipos: aparicion · tick · acierto · error · destello.
  window.eventosSonido = () => {
    const ev = [];
    const add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - DESTELLO / 2, "destello"));
    [P("fr01", "persona"), P("fr01", "ia"), P("fr02", "Mithril"), P("fr03", "LAMA2"), Math.min(P("fr04", "Claude"), CORTES[0] + DESTELLO / 2),
      FR.fr05.inicio, P("fr06", "27"), P("fr07", "matices"), FR.fr08.inicio, FR.fr09.inicio, P("fr10", "persona"), P("fr10", "ratones")]
      .forEach((t) => add(t, "aparicion"));
    const a = P("fr01", "once"), b = FR.fr01.palabras.find((p) => norm(p.p) === "laboratorios").f;
    for (let k = 0; k < 11; k++) add(a + (k * (b - a)) / 11, "tick");
    const tl = P("fr04", "organizaba"), tf = P("fr04", "laboratorios");
    for (let k = 0; k < 11; k++) add(tl + (k * (tf - tl)) / 11, "tick");
    ["contratos", "logistica", "experimentos"].forEach((w) => add(P("fr04", w), "acierto"));
    add(P("fr06", "comprado"), "acierto");
    add(P("fr08", "pares"), "error");
    return ev;
  };

  window.seek = (t) => {
    Object.values(s).forEach((x) => x.replaceChildren());
    Object.values(nodos).forEach((n) => n.classList.add("oculto"));
    const b = bloque(t);
    const violeta = b === "A" || b === "D";
    document.body.className = `short ${violeta ? "violeta" : "azul"}`;
    capaFondo.classList.toggle("oculto", !violeta);
    if (violeta) fondoVioleta(t);
    if (!enDestello(t) || Math.abs(t - CORTES.find((c) => Math.abs(t - c) < DESTELLO / 2)) > DESTELLO * 0.25) PINTAR[escena(t)](t);
    pintarDialogo(t);
    pintarDestello(t);
  };
  window.seek(0);
})();
