// phonic-1-voz · short. Estilo v2 vigente: MISTA narra en escena, caja de diálogo con retrato, escenarios vivos,
// desplazamiento lateral entre bloques y efectos atados a la pantalla. Composición propia, no un recorte del largo.
// Zona segura: nada importante por encima de y=58 (12 %) ni por debajo de la caja de diálogo.
(() => {
  const W = 270, H = 480, SUELO = 290, Y_GATO = 226;
  const { norm, P, INI, medio } = tiemposDe(window.TIMING);
  const CORTES = [medio("fr02", "fr03"), medio("fr05", "fr06"), medio("fr12", "fr13"), medio("fr16", "fr17")];
  const op = { W, H, suelo: SUELO };
  let e;

  // A · el gancho
  function bloqueA(t) {
    escenario("despacho", e.capas, t, op);
    e.tx("rotulo", '<span class="clave">Cancela</span> la cita', 16, 62, 0);
    const lun = P("fr01", "lunes"), no = P("fr01", "no"), mar = P("fr01", "martes");
    const q = INI("fr02");
    calendarioDia(e, 22, 90, 100, 92, "Lun", 0, { apagado: t >= no && t < q });
    calendarioDia(e, 136, 90, 100, 92, "Mar", no);
    // Durante la pregunta el marco salta entre los dos días: la imagen no debe responderla
    const enLunes = t < q ? t >= lun && t < no : Math.floor((t - q) / 0.4) % 2 === 0;
    const enMartes = t < q ? t >= mar : !enLunes;
    if (enLunes) marcoSeleccion(e.frente, 17, 85, 110, 102, "#ff8a3d");
    if (enMartes) marcoSeleccion(e.frente, 131, 85, 110, 102, "#ff8a3d");
    if (e.tx("insignia", "¿Cuál cancela?", 68, 194, P("fr02", "cual"))) marcoSeleccion(e.frente, 62, 188, 134, 22, "#3d68ba");
  }

  // B · la demo impresiona
  function bloqueB(t) {
    escenario("hotel", e.capas, t, op);
    const a = CORTES[0] + 0.2;
    e.tx("rotulo", '<span class="clave">Phonic-1</span>', 16, 62, a);
    const d = P("fr04", "44"), lista = P("fr05", "alergias");
    e.panel(16, 84, 212, t < d ? 42 : t < lista ? 68 : 118); // el panel crece con su contenido
    e.tx("etiqueta", "Actúa mientras hablas", 26, 92, a, "color:#f2c14e");
    propOndaVoz(e.frente, 26, 104, 190, 14, t, { color: PROP.naranja, activo: t >= P("fr03", "hablando") - 0.3, semilla: 8 });
    if (t >= d) {
      const m = Math.floor(e.prog(t, d, d + 1) * 44), s = Math.floor(e.prog(t, d, d + 1) * 18);
      e.tx("dato", `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`, 26, 122, d, "color:#f5f7fb");
      e.tx("etiqueta", "de llamada", 122, 132, d);
    }
    [["Recuerda alergias", "alergias"], ["Manda llamar a 3", "restaurantes"], ["No deja de charlar", "charlar"]].forEach(([txt, w], k) => {
      if (e.tx("etiqueta", txt, 40, 154 + k * 15, P("fr05", w))) check(e.frente, 28, 153 + k * 15, PROP.verde);
    });
    e.fuente("Fuente: Phonic", 16, 206, a);
  }

  // C · el registro: la cabecera dice siempre de qué momento es lo que se ve
  function bloqueC(t) {
    escenario("hotel", e.capas, t, op);
    const a = CORTES[1] + 0.2, r = P("fr08", "reserva"), sitio = INI("fr11"), todo = INI("fr12");
    e.tx("rotulo", 'Registro de la <span class="clave">demo</span>', 16, 62, a);
    pantallaRegistro(e, 14, 84, 216, 118, t, t < r ? 8 : 0, 20);
    if (t >= r) rect(e.frente, 19, 104 + (Math.floor(t * 30) % 90), 206, 6, "#16293a"); // barrido del monitor
    rect(e.frente, 19, 89, 206, 14, "#0e1a24");
    if (t >= sitio) e.tx("etiqueta", t >= todo ? "Todo el registro" : "16:15 · turno agente", 24, 92, t >= todo ? todo : sitio, "color:#f2c14e");
    else e.tx("etiqueta", "16:04 · turno clienta", 24, 92, INI("fr07"), "color:#f2c14e");
    if (t < sitio) {
      e.tx("etiqueta", "Reservar mesa", 24, 110, r, "color:#c9d2ff");
      e.tx("etiqueta", "7 personas · 20:30", 24, 122, r, "color:#8a93a6");
      e.tx("titular", "Confirmada", 24, 136, INI("fr09"), "color:#1fd69a");
      if (e.tx("dato", "RT-4842", 24, 162, INI("fr10"), "color:#f5f7fb")) marcoSeleccion(e.frente, 20, 160, 112, 32, Math.floor(t / 0.25) % 2 ? "#ff8a3d" : "#f2c14e");
    } else if (t < todo) {
      e.tx("dato", "+11 s", 24, 108, sitio, "color:#f2c14e");
      e.tx("titular", "No hay", 24, 140, P("fr11", "esa"), "color:#ff8a3d");
      e.tx("titular", "sitio", 24, 164, P("fr11", "sitio"), "color:#ff8a3d");
    } else {
      e.tx("etiqueta", "Código oído:", 24, 116, todo);
      e.tx("dato", "0", 180, 108, P("fr12", "codigo"), "color:#f5f7fb");
      e.tx("etiqueta", "Cancelaciones:", 24, 146, P("fr12", "registro"));
      e.tx("dato", "0", 180, 138, P("fr12", "ninguna"), "color:#f5f7fb");
      e.tx("etiqueta", "En el registro público", 24, 178, P("fr12", "cancelacion"), "color:#8a93a6");
    }
    e.fuente("Fuente: registro de Phonic", 16, 208, INI("fr07"));
  }

  // D · matiz y regla
  function bloqueD(t) {
    escenario("despacho", e.capas, t, op);
    const a = CORTES[2] + 0.2, mesa = INI("fr14"), regla = INI("fr15");
    if (t < mesa) {
      e.tx("rotulo", '<span class="clave">Ojo</span>', 16, 62, a);
      const ap = P("fr13", "apunta"), nadie = P("fr13", "nadie");
      if (t >= ap) e.panel(16, 84, 212, t < nadie ? 76 : 112);
      e.tx("etiqueta", "Todo apunta a un", 28, 92, ap, "color:#c9d2ff");
      e.tx("titular", "Simulador", 28, 106, ap, "color:#f2c14e");
      e.tx("etiqueta", "api.example.com", 28, 136, P("fr13", "simulador"), "color:#c9d2ff");
      e.tx("etiqueta", "Dominio de ejemplo", 28, 148, P("fr13", "simulador"), "color:#8a93a6");
      e.tx("etiqueta", "Nadie reservó", 28, 166, P("fr13", "nadie"));
      e.tx("etiqueta", "de verdad", 28, 178, P("fr13", "nadie"));
      e.fuente("Fuente: registro · IANA", 16, 200, P("fr13", "simulador"));
    } else if (t < regla) {
      e.tx("rotulo", 'En un restaurante <span class="clave">real</span>', 16, 62, mesa);
      e.panel(16, 84, 212, 112, "#241a16");
      e.x2(26, 90, (g) => propMesaSillas(g, 0, 0, { sillas: 7 }));
      e.tx("titular", "7 sillas", 30, 156, P("fr14", "siete"), "color:#ff8a3d");
      e.tx("etiqueta", "que nadie ocuparía", 30, 178, P("fr14", "nadie"));
    } else {
      e.tx("rotulo", 'La <span class="clave">regla</span>', 16, 62, regla);
      e.panel(16, 84, 212, t < INI("fr16") ? 40 : 118);
      e.tx("etiqueta", "Mientras te oye:", 28, 92, regla, "color:#f2c14e");
      if (e.tx("etiqueta", "Consultar", 44, 106, P("fr15", "consulte"))) check(e.frente, 28, 105, PROP.verde);
      e.tx("etiqueta", "Para actuar:", 28, 128, INI("fr16"), "color:#f2c14e");
      [["Reservar", "reservar", 146], ["Cancelar", "cancelar", 164], ["Cobrar", "cobrar", 182]].forEach(([txt, w, y]) => {
        if (e.tx("etiqueta", txt, 44, y, P("fr16", w))) propCandado(e.frente, 26, y - 5, { abierto: t >= P("fr16", "si") });
      });
      e.tx("titular", "Solo con", 130, 154, P("fr16", "cobrar"), "color:#1fd69a; font-size:12px; line-height:16px");
      e.tx("titular", "un sí", 130, 172, P("fr16", "cobrar"), "color:#1fd69a; font-size:12px; line-height:16px");
      e.fuente("Idea: JVCE, en X", 16, 206, P("fr15", "consulte"));
    }
  }

  // E · cierre, sin llamada a la acción
  function bloqueE(t) {
    escenario("azotea", e.capas, t, { W, H, suelo: SUELO - 6 });
    e.tx("etiqueta", "Oírte mientras hablas", 20, 70, CORTES[3] + 0.2, "color:#c9d2ff");
    e.tx("etiqueta", "es un avance", 20, 84, P("fr17", "avance"), "color:#1fd69a");
    if (t >= P("fr18", "frase")) e.panel(12, 112, 184, 108);
    e.tx("titular", "La frase", 20, 120, P("fr18", "frase"));
    e.tx("titular", "importante", 20, 144, P("fr18", "importante"), "color:#ff8a3d");
    e.tx("titular", "llega al", 20, 168, P("fr18", "llega"));
    e.tx("titular", "final", 22, 192, P("fr18", "final"), "color:#ff8a3d");
  }

  const bloques = [
    { pintar: bloqueA, gato: (t) => ({ x: 170, y: Y_GATO, espejo: true, pose: t >= P("fr02", "cancela") ? "sorpresa" : t >= P("fr01", "martes") ? "senalar" : "pie" }) },
    { pintar: bloqueB, gato: (t) => ({ x: 170, y: Y_GATO, espejo: true, pose: t >= P("fr04", "impresiona") ? "celebrar" : t >= P("fr03", "presume") ? "senalar" : "pie" }) },
    { pintar: bloqueC, gato: (t) => ({ x: 18, y: Y_GATO, espejo: false, pose: t >= INI("fr12") ? "pensar" : t >= INI("fr11") ? "sorpresa" : t >= INI("fr09") ? "senalar" : "tocar" }) },
    { pintar: bloqueD, gato: (t) => ({ x: 170, y: Y_GATO, espejo: true, pose: t >= INI("fr15") ? "senalar" : t >= INI("fr14") ? "pensar" : "tocar" }) },
    { pintar: bloqueE, gato: (t) => ({ x: 170, y: 220, espejo: true, pose: t >= P("fr18", "final") ? "senalar" : "pensar" }) },
  ];
  e = escenaBase({ W, H, bloques, cortes: CORTES, y0Gato: Y_GATO, alPintar: pintarDialogo });
  const bloqueDe = (t) => CORTES.filter((c) => t >= c).length;

  // ---------- caja de diálogo: páginas que caben en 2 líneas; se reinicia con cada frase ----------
  const CLAVES = { fr01: "martes", fr02: "cancela", fr03: "Phonic-1", fr04: "impresiona", fr05: "charlar", fr06: "registro", fr07: "16",
    fr08: "reserva", fr09: "Confirmada", fr10: "RT-4842", fr11: "sitio", fr12: "cancelación", fr13: "simulador", fr14: "siete",
    fr15: "consulte", fr16: "sí", fr17: "avance", fr18: "final" };
  const LINEA = 21;
  const lineas = (ps) => ps.reduce((acc, p) => {
    const ultima = acc[acc.length - 1];
    if (ultima && ultima.length + 1 + p.p.length <= LINEA) acc[acc.length - 1] = `${ultima} ${p.p}`; else acc.push(p.p);
    return acc;
  }, []).length;
  const PAGINAS = [];
  window.TIMING.frases.forEach((f) => {
    let actual = [];
    f.palabras.forEach((p, k) => {
      actual.push(p);
      const ultima = k === f.palabras.length - 1, siguiente = f.palabras[k + 1];
      if (ultima || actual.length >= 8 || /[.:?!]$/.test(p.p) || (actual.length >= 4 && /[,;]$/.test(p.p)) || lineas([...actual, siguiente]) > 2) {
        PAGINAS.push({ fr: f.id, palabras: actual, i: actual[0].i, bloque: bloqueDe(actual[0].i), finFrase: ultima });
        actual = [];
      }
    });
  });
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  const dialogo = document.getElementById("dialogo"), fraseEl = document.getElementById("frase");
  function pintarDialogo(t) {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag || e.enTransicion(t) || pag.bloque !== bloqueDe(t)) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    svgRetrato.replaceChildren();
    retratoGato(svgRetrato, 1, 2, { t, hablando: false }, 2); // el retrato solo parpadea (Mario, 2026-10-30)
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = norm(CLAVES[pag.fr] || "");
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡…]+$/, ""), punt = p.p.slice(nucleo.length);
      const c = norm(nucleo) === clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p.p;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ") + (pag.finFrase && dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  }

  // ---------- sonido: atado a lo que pasa en pantalla ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - 0.2, "destello"));
    add(P("fr01", "lunes"), "seleccion");
    add(P("fr01", "martes"), "seleccion");
    add(P("fr02", "cancela"), "aparicion");
    add(P("fr04", "44") + 1, "tick");
    add(P("fr08", "reserva"), "aparicion");
    add(INI("fr09"), "acierto");
    add(P("fr11", "esa"), "error");
    add(P("fr12", "ninguna"), "tick");
    add(P("fr13", "simulador"), "aparicion");
    add(P("fr14", "siete"), "aparicion");
    add(P("fr16", "si"), "acierto");
    return ev;
  };
  window.seek(0);
})();
