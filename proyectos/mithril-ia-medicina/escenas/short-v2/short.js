// mithril-ia-medicina · short v2. Estilo v2 (ADR 0007, fotogramas aprobados en reviews/calibracion/iter-v2-01.md):
// MISTA narra en escena, 4 escenarios ilustrados, datos sobre objetos del escenario, objetos ×2 que reaccionan.
// v3 (reviews/iter-03.md): desplazamiento lateral entre bloques en lugar del destello blanco y efectos atados a lo que
// pasa en pantalla. Mismo guion (PUERTA 1) y misma voz/alineación que la v1 (timing.js).
// Contrato seek(t): todo se pinta desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  const W = 270, H = 480, SUELO = 290, MESA = SUELO - 40;
  const T = window.TIMING;
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const PALABRAS = T.frases.flatMap((f) => f.palabras);
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  function P(fr, trozo, n = 1) {
    const ps = FR[fr].palabras.filter((p) => norm(p.p).includes(norm(trozo)));
    if (!ps[n - 1]) throw new Error(`No encuentro «${trozo}» en ${fr}`);
    return ps[n - 1].i;
  }
  const FIN = (fr) => FR[fr].fin;
  const medio = (a, b) => (FIN(a) + FR[b].inicio) / 2;
  const CORTES = [medio("fr03", "fr04"), medio("fr06", "fr07"), medio("fr09", "fr10")];
  const TRANS = 0.4; // duración del desplazamiento lateral entre bloques, centrado en cada corte
  const bloque = (t) => (t < CORTES[0] ? "A" : t < CORTES[1] ? "B" : t < CORTES[2] ? "C" : "D");
  const ESCENAS = [["e01", 0], ["e02", FR.fr02.inicio - 0.2], ["e03", FR.fr03.inicio - 0.2], ["e04", CORTES[0]],
    ["e05", FR.fr05.inicio - 0.2], ["e06", FR.fr06.inicio - 0.2], ["e07", CORTES[1]], ["e08", FR.fr08.inicio - 0.2],
    ["e09", FR.fr09.inicio - 0.2], ["e10", CORTES[2]]];
  const escena = (t) => ESCENAS.filter(([, a]) => t >= a).pop()[0];
  const paso = (v, p) => Math.floor(v / p + 1e-9) * p;
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const salto = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);
  const hablando = (t) => PALABRAS.some((p) => t >= p.i && t <= p.f);
  const enTransicion = (t) => CORTES.some((c) => Math.abs(t - c) < TRANS / 2);

  // ---------- capas y textos ----------
  // Los lienzos son fijos; `capas` y `frente` apuntan a grupos desplazados mientras se dibuja cada bloque
  const LIENZOS = { fondo: lienzo("fondo"), medio: lienzo("medio"), brillo: lienzo("brillo"), frente: lienzo("frente") };
  const capas = { fondo: LIENZOS.fondo, medio: LIENZOS.medio, brillo: LIENZOS.brillo };
  let frente = LIENZOS.frente;
  let forzado = null; // { b, e, dx } mientras se dibuja un bloque durante la transición
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  const caja = document.getElementById("textos");
  const nodos = {};
  function texto(id, escenaId, clase, html, x, y, estilo = "") {
    const d = document.createElement("div");
    d.className = clase; d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`;
    Object.assign(d.dataset, { y, escena: escenaId });
    caja.appendChild(d); nodos[id] = d;
  }
  // escenaId puede ser una escena («e02») o un bloque («B»)
  // Durante la transición, el bloque que se dibuja manda (forzado) y los textos se desplazan con su escenario
  function ver(id, t, a) {
    const d = nodos[id], s = salto(t, a), e = d.dataset.escena;
    const dentro = e.length === 1 ? (forzado ? forzado.b : bloque(t)) === e : (forzado ? forzado.e : escena(t)) === e;
    const visible = s !== null && dentro;
    d.classList.toggle("oculto", !visible);
    if (visible) {
      d.style.top = `${Number(d.dataset.y) + s}px`;
      d.style.transform = forzado ? `translateX(${forzado.dx}px)` : "";
    }
    return visible;
  }
  const x2 = (x, y, fn) => escalado(frente, x, y, 2, fn);
  const tarjeta = (x, y, w, h, color = PROP.papel) => {
    rect(frente, x + 2, y + 2, w, h, "#0a0806");
    rect(frente, x, y, w, h, PROP.contorno); rect(frente, x + 1, y + 1, w - 2, h - 2, color);
  };

  // A · laboratorio (corcho con tarjeta)
  texto("e01-rot", "e01", "rotulo", 'Una <span class="clave">persona</span>', 16, 64);
  texto("e01-ia", "e01", "insignia", "+ IA", 126, 64, "border:1px solid var(--texto)");
  texto("e01-uno", "e01", "tarjeta-texto", "<b style='font-size:16px'>1</b> persona", 30, 104);
  texto("e01-labs", "e01", "tarjeta-texto", "11 laboratorios", 30, 172);
  texto("e01-fte", "e01", "fuente-dato con-fondo", "Fuente: Anthropic", 16, 200);
  texto("e02-rot", "e02", "rotulo", "Mithril Medicine", 16, 64);
  texto("e02-fun", "e02", "tarjeta-texto", "C. Tranbarger", 42, 103);
  texto("e02-bio", "e02", "tarjeta-texto", "Biotecnológica", 30, 117);
  texto("e02-emp", "e02", "tarjeta-texto", "Empleados: <b style='font-size:16px'>1</b>", 30, 129);
  texto("e02-mis", "e02", "tarjeta-texto", "Misión:", 30, 149, "color:#b4622a");
  texto("e02-m1", "e02", "tarjeta-texto", "tratar", 94, 149);
  texto("e02-m2", "e02", "tarjeta-texto", "2 distrofias<br>musculares<br>raras", 30, 160);
  texto("e02-fte", "e02", "fuente-dato con-fondo", "Fuente: Anthropic", 16, 200);
  texto("e03-rot", "e03", "rotulo", 'Gen <span class="clave">LAMA2</span>', 16, 64);
  texto("e03-fz", "e03", "tarjeta-texto", "Fuerza:", 30, 104);
  texto("e03-g1", "e03", "tarjeta-texto", "Forma grave:", 30, 136, "color:#b4622a");
  texto("e03-g2", "e03", "tarjeta-texto", "al nacer o en", 30, 148);
  texto("e03-g3", "e03", "tarjeta-texto", "los primeros", 30, 160);
  texto("e03-g4", "e03", "tarjeta-texto", "meses", 30, 172);
  texto("e03-fte", "e03", "fuente-dato con-fondo", "Fuente: MedlinePlus", 16, 200);
  // B · servidores (pantalla)
  texto("e04-rot", "e04", "rotulo", "Claude organiza", 16, 64);
  texto("e04-cl", "e04", "rotulo", "Claude", 110, 133);
  texto("e04-c1", "e04", "etiqueta", "Contratos", 64, 156);
  texto("e04-c2", "e04", "etiqueta", "Logística", 64, 168);
  texto("e04-c3", "e04", "etiqueta", "Experimentos", 64, 180);
  texto("e04-fte", "e04", "fuente-dato con-fondo", "Fuente: Anthropic", 16, 210);
  texto("e05-rot", "e05", "rotulo", "Menos de 18 meses", 16, 64);
  texto("e05-mes", "e05", "dato", "0", 54, 104, "color:var(--azul)");
  texto("e05-mesl", "e05", "etiqueta", "meses", 104, 116, "color:#c9d2ff");
  texto("e05-i", "e05", "etiqueta", "Idea", 54, 138, "color:#c9d2ff");
  texto("e05-r", "e05", "etiqueta", "En ratones", 54, 172);
  texto("e05-fte", "e05", "fuente-dato con-fondo", "Fuente: Anthropic", 16, 210);
  texto("e06-rot", "e06", "rotulo", "27 de octubre", 16, 64);
  texto("e06-ok", "e06", "titular", "Adquirida", 60, 110, "color:var(--verde)");
  texto("e06-fe", "e06", "dato", "27·10·2026", 60, 138, "color:var(--texto); font-size:20px");
  texto("e06-q", "e06", "etiqueta", "Anthropic → Mithril", 58, 170, "letter-spacing:-0.5px");
  texto("e06-fte", "e06", "fuente-dato con-fondo", "Fuente: Anthropic", 16, 210);
  // C · despacho (papel)
  texto("e07-rot", "e07", "rotulo", 'Ahora, los <span class="clave">matices</span>', 16, 64);
  texto("e07-emp", "e07", "tarjeta-texto", "Empleados: <b style='font-size:16px'>1</b>", 42, 104);
  texto("e07-c1", "e07", "tarjeta-texto", "+ consultores", 42, 136, "color:#b4622a");
  texto("e07-c2", "e07", "tarjeta-texto", "(a tiempo parcial)", 42, 150);
  texto("e07-fte", "e07", "fuente-dato con-fondo", "Fuente: C. Tranbarger", 16, 202);
  texto("e08-rot", "e08", "rotulo", 'Ahora, los <span class="clave">matices</span>', 16, 64);
  texto("e08-f1", "e08", "tarjeta-texto", "Fase:", 42, 104);
  texto("e08-f2", "e08", "tarjeta-texto", "Temprana", 42, 118, "color:#b4622a");
  texto("e08-r1", "e08", "tarjeta-texto", "Revisión por pares:", 42, 140);
  texto("e08-r2", "e08", "tarjeta-texto", "No", 54, 161);
  texto("e08-fte", "e08", "fuente-dato con-fondo", "Fuente: The Next Web", 16, 202);
  texto("e09-rot", "e09", "rotulo", "Ensayos en humanos", 16, 64);
  // Eje: marcas en x = 60, 108, 156, 204 (2026-2029); cada año centrado bajo su marca (4 caracteres × 8 px),
  // con ≥ 10 px hasta el borde del papel (30-230)
  const MARCAS = [60, 108, 156, 204];
  ["2026", "2027", "2028", "2029"].forEach((a, k) => texto(`e09-a${k + 1}`, "e09", "tarjeta-texto", a, MARCAS[k] - 16, 158, k === 3 ? "color:#8a7a68" : ""));
  texto("e09-cp", "e09", "tarjeta-texto", "Como pronto:", 42, 102, "color:#b4622a");
  texto("e09-fin", "e09", "tarjeta-texto", "finales de 2028", 42, 114, "color:#b4622a");
  texto("e09-si", "e09", "tarjeta-texto", "Si todo va bien", 42, 176);
  texto("e09-fte", "e09", "fuente-dato con-fondo", "Fuente: Anthropic", 16, 202);
  // D · azotea (menú de juego)
  texto("e10-q1", "e10", "etiqueta", "¿1 persona + IA", 26, 86);
  texto("e10-q2", "e10", "etiqueta", "= 1 empresa?", 26, 98);
  texto("e10-r", "e10", "etiqueta", "Se acerca", 42, 120, "color:var(--azul)");
  texto("e10-t1", "e10", "titular", "De momento:", 16, 152);
  texto("e10-t2", "e10", "titular", '<span class="clave">ratones</span>', 16, 176);
  tildesPixel();

  // ---------- caja de diálogo con retrato (páginas de ≤8 palabras; se reinicia con cada frase) ----------
  const CLAVES = { fr01: "persona", fr02: "Mithril", fr03: "LAMA2", fr04: "Claude", fr05: "ratones", fr06: "comprado",
    fr07: "matices", fr08: "temprana", fr09: "2028", fr10: "ratones" };
  // Con retrato la caja es más estrecha: además de ≤8 palabras, la página debe caber en 2 líneas de ~21 caracteres
  // (medido en Chromium al final de cada página: con 23, «tratamientos» llevaba una página a 3 líneas)
  const LINEA = 21;
  const lineas = (ps) => ps.reduce((acc, p) => {
    const ultima = acc[acc.length - 1];
    if (ultima && ultima.length + 1 + p.p.length <= LINEA) acc[acc.length - 1] = `${ultima} ${p.p}`; else acc.push(p.p);
    return acc;
  }, []).length;
  const PAGINAS = [];
  T.frases.forEach((f) => {
    let actual = [];
    f.palabras.forEach((p, k) => {
      actual.push(p);
      const siguiente = f.palabras[k + 1];
      if (k === f.palabras.length - 1 || actual.length >= 8 || /[.:?!]$/.test(p.p) || (actual.length >= 4 && /[,;]$/.test(p.p))
        || lineas([...actual, siguiente]) > 2) {
        PAGINAS.push({ fr: f.id, palabras: actual, i: actual[0].i, bloque: bloque(actual[0].i) });
        actual = [];
      }
    });
  });
  const dialogo = document.getElementById("dialogo"), fraseEl = document.getElementById("frase");
  function pintarDialogo(t) {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag || enTransicion(t) || pag.bloque !== bloque(t)) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    svgRetrato.replaceChildren();
    retratoGato(svgRetrato, 1, 2, { t, hablando: false }, 2); // el retrato no habla: solo parpadea (Mario, 2026-10-30)
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = norm(CLAVES[pag.fr] || "");
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡]+$/, ""), punt = p.p.slice(nucleo.length);
      const c = norm(nucleo) === clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p.p;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ") + (dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  }

  // Desplazamiento lateral (como pasar de pantalla en un juego de plataformas): el bloque que sale se va a la izquierda
  // y entra el siguiente por la derecha, con aceleración y frenada suaves y a píxeles enteros. Sin blanco.
  function transicion(t) {
    const k = CORTES.findIndex((c) => Math.abs(t - c) < TRANS / 2);
    if (k < 0) return null;
    const c = CORTES[k], p = (t - (c - TRANS / 2)) / TRANS;
    const suave = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p);
    return { desde: bloque(c - 1e-3), eDesde: escena(c - 1e-3), hacia: bloque(c + 1e-3), eHacia: escena(c + 1e-3),
      dx: Math.round(suave * W), llegada: c + TRANS / 2 };
  }

  // ---------- MISTA: posición por bloque y pose por palabra ----------
  const GATO = {
    A: { x: 172, espejo: true, poses: (t) => (t >= P("fr03", "debilita") ? "pensar" : t >= P("fr01", "ia") ? "senalar" : "pie") },
    B: { x: 24, espejo: false, poses: (t) => (t >= P("fr06", "comprado") ? "celebrar" : t >= P("fr05", "prometedores") ? "sorpresa"
      : t >= P("fr04", "logistica") - 0.1 && t < FIN("fr04") ? "tocar" : "pie") },
    C: { x: 20, espejo: false, poses: (t) => (t >= P("fr08", "pares") && t < FIN("fr08") ? "sorpresa" : "pensar") },
    D: { x: 160, espejo: true, poses: (t) => (t >= P("fr10", "ratones") ? "pensar" : t >= P("fr10", "acerca") ? "senalar"
      : t >= P("fr10", "empresa") ? "pensar" : "pie") },
  };

  // ---------- bloques ----------
  function bloqueA(t, e) {
    escenario("laboratorio", capas, t, { W, H, suelo: SUELO });
    propCorcho(capas.medio, 12, 88, 152, 112);
    // La tarjeta se clava cuando llega su primer dato: nunca una tarjeta en blanco
    const conTarjeta = { e01: P("fr01", "persona"), e02: FR.fr02.inicio - 0.2, e03: FR.fr03.inicio - 0.2 }[e];
    if (salto(t, conTarjeta) !== null) { tarjeta(22, 96 + salto(t, conTarjeta), 132, 100); propChincheta(frente, 86, 97 + salto(t, conTarjeta)); }
    const marcado = e === "e02" && t >= P("fr02", "biotecnologica");
    x2(20, MESA - 26, (g) => propMatraz(g, 0, 0, t, { color: PROP.verde, activo: marcado || e === "e01", semilla: 5 }));
    if (marcado) marcoSeleccion(frente, 16, MESA - 32, 28, 34);
    x2(50, MESA - 26, (g) => propMatraz(g, 0, 0, t, { color: PROP.azul, semilla: 6 }));
    const lama = e === "e03" && t >= P("fr03", "LAMA2");
    x2(80, MESA - 50, (g) => propMicroscopio(g, 0, 0, { activo: lama }));
    if (lama) marcoSeleccion(frente, 76, MESA - 54, 44, 58);
    x2(124, MESA - 24, (g) => { propBote(g, 0, 0, PROP.naranja); propBote(g, 10, 0, "#c07ad8"); });
    if (e === "e01") {
      ver("e01-rot", t, 0);
      ver("e01-uno", t, P("fr01", "persona"));
      const a = P("fr01", "once"), b = FR.fr01.palabras.find((p) => norm(p.p) === "laboratorios").f;
      const n = t < a ? 0 : Math.min(11, 1 + Math.floor(prog(t, a, b) * 11));
      for (let k = 0; k < n; k++) propMatraz(frente, 30 + (k % 6) * 20, 124 + Math.floor(k / 6) * 22, t, { color: [PROP.verde, PROP.azul, PROP.naranja][k % 3], semilla: 70 + k });
      ver("e01-labs", t, P("fr01", "laboratorios"));
      ver("e01-ia", t, P("fr01", "ia"));
      ver("e01-fte", t, P("fr01", "laboratorios"));
    } else if (e === "e02") {
      ver("e02-rot", t, FR.fr02.inicio - 0.2);
      if (ver("e02-fun", t, FR.fr02.inicio)) { // icono de persona junto al fundador
        const dy = salto(t, FR.fr02.inicio);
        rect(frente, 32, 102 + dy, 4, 4, "#b4622a"); rect(frente, 30, 107 + dy, 8, 5, "#b4622a");
      }
      ver("e02-bio", t, P("fr02", "biotecnologica")); ver("e02-emp", t, P("fr02", "empleado")); ver("e02-mis", t, P("fr02", "buscar"));
      ver("e02-m1", t, P("fr02", "tratamientos")); ver("e02-m2", t, P("fr02", "distrofias"));
      ver("e02-fte", t, P("fr02", "distrofias"));
    } else {
      ver("e03-rot", t, FR.fr03.inicio - 0.2);
      if (t >= FR.fr03.inicio - 0.2) {
        // Doble hélice pequeña en la esquina de la tarjeta
        for (let j = 0; j < 22; j++) { const d = Math.round(Math.sin(j / 3) * 4); rect(frente, 136 + d, 100 + j, 2, 1, PROP.gris); rect(frente, 136 - d, 100 + j, 2, 1, "#b4622a"); }
      }
      // La barra de fuerza entra llena con la tarjeta y baja cuando la voz dice «debilita»
      if (ver("e03-fz", t, FR.fr03.inicio - 0.2)) {
        const caida = paso(prog(t, P("fr03", "debilita"), P("fr03", "grave")) * 0.7, 0.1);
        rect(frente, 30, 117, 112, 10, PROP.contorno); rect(frente, 31, 118, 110, 8, "#e9e1cf");
        rect(frente, 31, 118, Math.round(110 * (1 - caida)), 8, caida > 0 ? PROP.rojo : PROP.verde);
      }
      ver("e03-g1", t, P("fr03", "grave")); ver("e03-g2", t, P("fr03", "nacimiento"));
      ver("e03-g3", t, P("fr03", "primeros")); ver("e03-g4", t, P("fr03", "meses"));
      ver("e03-fte", t, P("fr03", "nacimiento"));
    }
  }

  function bloqueB(t, e) {
    escenario("servidores", capas, t, { W, H, suelo: SUELO });
    const tl = P("fr04", "organizaba"), tf = P("fr04", "laboratorios");
    propMonitor(frente, 38, 88, 190, 108, { dibujo: (s, x, y, w, h) => {
      if (e === "e04") {
        const cx = Math.round(x + w / 2), cy = y + 48, n = t < tl ? 0 : Math.min(11, 1 + Math.floor(prog(t, tl, tf) * 11));
        for (let k = 0; k < 11; k++) {
          const ang = Math.PI * (0.06 + 0.88 * k / 10), nx = Math.round(cx - Math.cos(ang) * 82), ny = Math.round(cy - Math.sin(ang) * 36);
          const on = k < n;
          if (on) linea(s, cx, cy, nx + 3, ny + 3, PROP.azul);
          rect(s, nx, ny, 7, 7, on ? PROP.contorno : "#2a3046"); rect(s, nx + 1, ny + 1, 5, 5, on ? PROP.azul : "#151b30");
        }
      } else if (e === "e05") {
        const a = P("fr05", "idea"), b = P("fr05", "ratones");
        const fr = paso(prog(t, a, b), 0.05);
        rect(s, x + 14, y + 62, w - 28, 10, PROP.contorno); rect(s, x + 15, y + 63, w - 30, 8, "#151b30");
        if (fr > 0) rect(s, x + 15, y + 63, Math.round((w - 30) * fr), 8, PROP.azul);
        if (t >= b) escalado(s, x + w - 46, y + 76, 2, (g) => propRaton(g, 0, 0, t, { activo: true }));
      } else if (t >= FR.fr06.inicio - 0.2) {
        const crec = paso(prog(t, FR.fr06.inicio - 0.2, FR.fr06.inicio), 0.25);
        rect(s, x + 6, y + 12, Math.round((w - 12) * crec), h - 24, "#12301f");
      }
    } });
    // Contratos y cajas (logística): reaccionan cuando se nombran
    const tc = P("fr04", "contratos"), tlg = P("fr04", "logistica");
    const papelActivo = e === "e04" && t >= tc;
    x2(164, 226, (g) => propPapel(g, 0, 0, t, { activo: papelActivo, sello: e === "e06" && t >= P("fr06", "comprado") ? PROP.verde : null }));
    // El marco de selección sigue a lo que se nombra: contratos → cajas (que MISTA toca) → contrato sellado
    const cajaActiva = e === "e04" && t >= tlg - 0.1;
    if ((papelActivo && !cajaActiva) || (e === "e06" && t >= P("fr06", "comprado"))) marcoSeleccion(frente, 160, 222, 36, 44);
    if (cajaActiva) marcoSeleccion(frente, 88, SUELO - 62, 44, 64);
    x2(204, 232, (g) => propPapel(g, 0, 0, t + 0.3, { activo: papelActivo }));
    x2(92, SUELO - 28, (g) => propCaja(g, 0, 0, t, { activo: cajaActiva }));
    x2(92, SUELO - 56, (g) => propCaja(g, 0, 0, t + 0.15, { activo: cajaActiva }));
    if (e === "e04") {
      ver("e04-rot", t, CORTES[0] + TRANS / 2);
      ver("e04-cl", t, CORTES[0] + TRANS / 2);
      [["e04-c1", "contratos"], ["e04-c2", "logistica"], ["e04-c3", "experimentos"]].forEach(([id, w], k) => {
        if (ver(id, t, P("fr04", w))) check(frente, 196, 156 + k * 12, PROP.verde);
      });
      ver("e04-fte", t, tf);
    } else if (e === "e05") {
      ver("e05-rot", t, FR.fr05.inicio - 0.2);
      const a = P("fr05", "menos"), b = P("fr05", "meses");
      const meses = Math.min(18, Math.floor(prog(t, a, b + 0.3) * 18 + 1e-9));
      nodos["e05-mes"].textContent = String(meses);
      nodos["e05-mesl"].textContent = meses === 1 ? "mes" : "meses";
      ver("e05-mes", t, a); ver("e05-mesl", t, a);
      ver("e05-i", t, P("fr05", "idea")); ver("e05-r", t, P("fr05", "ratones"));
      ver("e05-fte", t, P("fr05", "prometedores"));
    } else {
      ver("e06-rot", t, FR.fr06.inicio - 0.2);
      ver("e06-fe", t, P("fr06", "27")); ver("e06-ok", t, P("fr06", "comprado"));
      ver("e06-q", t, P("fr06", "Anthropic")); ver("e06-fte", t, P("fr06", "anuncio"));
    }
  }

  function bloqueC(t, e) {
    escenario("despacho", capas, t, { W, H, suelo: SUELO });
    const conTarjeta = { e07: CORTES[1] + TRANS / 2, e08: FR.fr08.inicio - 0.2, e09: P("fr09", "humanos") }[e];
    if (salto(t, conTarjeta) !== null) { tarjeta(30, 90 + salto(t, conTarjeta), 200, 104); propChincheta(frente, 128, 91 + salto(t, conTarjeta)); }
    x2(96, MESA - 18, (g) => [["#c0504a", 0], ["#4a6fb0", 3], ["#4a9a6a", 6]].forEach(([c, y]) => { rect(g, 0, y, 22, 3, PROP.contorno); rect(g, 1, y, 20, 2, c); }));
    x2(150, MESA - 14, (g) => { rect(g, 0, 0, 8, 7, PROP.contorno); rect(g, 1, 1, 6, 5, PROP.blanco); rect(g, 8, 2, 2, 3, PROP.contorno);
      if (Math.floor(t * 3) % 2 === 0) rect(g, 3, -3, 1, 2, "#cfd6e4"); else rect(g, 4, -4, 1, 2, "#cfd6e4"); });
    x2(176, MESA - 20, (g) => propPapel(g, 0, 0, t, {}));
    if (e === "e07") {
      ver("e07-rot", t, CORTES[1] + TRANS / 2);
      ver("e07-emp", t, CORTES[1] + TRANS / 2);
      ver("e07-c1", t, P("fr07", "solo")); ver("e07-c2", t, P("fr07", "consultores"));
      ver("e07-fte", t, P("fr07", "consultores"));
    } else if (e === "e08") {
      ver("e08-rot", t, FR.fr08.inicio - 0.2);
      ver("e08-f1", t, FR.fr08.inicio); ver("e08-f2", t, P("fr08", "temprana"));
      ver("e08-r1", t, P("fr08", "revision"));
      const tp = P("fr08", "pares");
      if (ver("e08-r2", t, tp)) {
        aspa(frente, 80, 162, PROP.rojo);
        // La lupa llega desde la derecha a saltos y se queda enmarcando el «NO»
        const xl = 48 + Math.round((1 - paso(prog(t, tp, tp + 0.3), 0.25)) * 120);
        x2(xl, 152, (g) => propLupa(g, 0, 0, { activo: true }));
      }
      ver("e08-fte", t, tp);
    } else {
      ver("e09-rot", t, FR.fr09.inicio - 0.2);
      if (t >= P("fr09", "humanos")) {
        rect(frente, MARCAS[0], 150, MARCAS[3] - MARCAS[0] + 1, 1, "#6b5a48");
        MARCAS.forEach((x) => rect(frente, x, 146, 1, 9, "#6b5a48"));
        ["e09-a1", "e09-a2", "e09-a3", "e09-a4"].forEach((id) => ver(id, t, P("fr09", "humanos")));
        const desde = P("fr09", "pronto");
        if (t >= desde) { // la flecha avanza de 2027 hasta justo antes de 2029: «finales de 2028»
          const x = MARCAS[1] + Math.round((MARCAS[3] - 8 - MARCAS[1]) * paso(prog(t, desde, P("fr09", "2028")), 0.125));
          puntaFlecha(frente, x, 140, "aba", PROP.naranja, 5);
          rect(capas.brillo, x - 4, 134, 9, 9, PROP.naranja);
        }
      }
      ver("e09-cp", t, P("fr09", "pronto")); ver("e09-fin", t, P("fr09", "finales")); ver("e09-si", t, P("fr09", "bien"));
      ver("e09-fte", t, P("fr09", "2028"));
    }
  }

  function bloqueD(t) {
    escenario("azotea", capas, t, { W, H, suelo: SUELO - 6 });
    const tq = CORTES[2] + TRANS / 2;
    if (t >= tq) { rect(frente, 16, 78, 210, 64, PROP.contorno); rect(frente, 17, 79, 208, 62, "#151b30"); }
    ver("e10-q1", t, tq); ver("e10-q2", t, P("fr10", "empresa"));
    if (ver("e10-r", t, P("fr10", "acerca"))) puntaFlecha(frente, 34, 124, "der", "#5b8cff", 5);
    ver("e10-t1", t, P("fr10", "momento")); ver("e10-t2", t, P("fr10", "ratones"));
    const tr = P("fr10", "ratones");
    if (t >= tr) {
      x2(16, SUELO - 6 - 66, (g) => propJaula(g, 0, 0, t, { activo: true }));
      marcoSeleccion(frente, 12, SUELO - 6 - 70, 96, 74, "#ff8a3d");
    }
  }

  // ---------- sonido: atado a lo que pasa en pantalla, no al texto (Mario, iteración 03) ----------
  // Cada efecto suena en el instante en que un objeto aparece o reacciona: tarjeta clavada, contador completo, objeto
  // marcado, sello, lupa que llega, flecha que llega, jaula y desplazamiento entre bloques. Nada mientras solo se habla.
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - TRANS / 2, "destello")); // arranca el desplazamiento
    add(P("fr01", "persona"), "aparicion"); // se clava la primera tarjeta
    const a = P("fr01", "once"), b = FR.fr01.palabras.find((p) => norm(p.p) === "laboratorios").f;
    add(a + (10 * (b - a)) / 11, "tick"); // aparece el undécimo matraz
    add(P("fr02", "biotecnologica"), "seleccion"); // el matraz queda marcado
    add(P("fr03", "LAMA2"), "seleccion"); // el microscopio queda marcado
    const tl = P("fr04", "organizaba"), tf = P("fr04", "laboratorios");
    add(tl + (10 * (tf - tl)) / 11, "tick"); // se enciende el undécimo nodo
    add(P("fr04", "logistica") - 0.1, "seleccion"); // MISTA toca las cajas y se marcan
    add(P("fr05", "ratones"), "aparicion"); // el ratón aparece en la pantalla
    add(P("fr06", "comprado"), "acierto"); // «ADQUIRIDA» y sello verde
    add(P("fr08", "pares") + 0.3, "error"); // la lupa llega al «NO»
    add(P("fr09", "2028"), "tick"); // la flecha llega a finales de 2028
    add(P("fr10", "ratones"), "seleccion"); // aparece la jaula marcada
    return ev;
  };

  // Dibuja un bloque entero desplazado dx px (escenario, objetos, textos y, si toca, MISTA)
  function dibujarBloque(b, e, t, dx, conGato) {
    forzado = dx ? { b, e, dx } : null;
    for (const k of ["fondo", "medio", "brillo"]) capas[k] = dx ? capaDesplazada(LIENZOS[k], dx) : LIENZOS[k];
    frente = dx ? capaDesplazada(LIENZOS.frente, dx) : LIENZOS.frente;
    ({ A: bloqueA, B: bloqueB, C: bloqueC, D: bloqueD })[b](t, e);
    if (conGato) {
      const g = GATO[b], k = "ABCD".indexOf(b);
      const sal = k > 0 ? salto(t, CORTES[k - 1] + TRANS / 2) || 0 : 0; // MISTA reaparece con un saltito tras el desplazamiento
      gato(frente, g.x, (b === "D" ? 220 : 226) + sal, { pose: g.poses(t), t, hablando: hablando(t), espejo: g.espejo }, 2);
    }
    forzado = null;
  }

  window.seek = (t) => {
    Object.values(LIENZOS).forEach((s) => s.replaceChildren());
    Object.values(nodos).forEach((n) => n.classList.add("oculto"));
    const tr = transicion(t);
    if (tr) { // MISTA se va con su escenario; en el nuevo aparece al terminar (nunca dos gatos a la vez)
      dibujarBloque(tr.desde, tr.eDesde, t, -tr.dx, true);
      dibujarBloque(tr.hacia, tr.eHacia, t, W - tr.dx, false);
    } else dibujarBloque(bloque(t), escena(t), t, 0, true);
    pintarDialogo(t);
  };
  window.seek(0);
})();
