// alien-isolation-ia · short A «Dos cerebros». Estilo v2 con las desviaciones de style_guide.md. Caja de diálogo con
// retrato, algo nuevo cada 2-4 s, sin llamada a la acción. Composición propia, no un recorte del largo.
// Zona segura: nada importante por encima de y=58 (12 %), ni bajo la caja de diálogo, ni en x>237 entre y=216 y y=408.
(() => {
  const W = 270, H = 480, SUELO = 290, Y_GATO = 226;
  const { P, INI, medio } = tiemposDe(window.TIMING);
  const CORTES = [medio("fr02", "fr03"), medio("fr05", "fr06"), medio("fr07", "fr08"), medio("fr09", "fr10")];
  const op = { W, H, suelo: SUELO };
  const LLEGA = (k) => CORTES[k] + 0.2, ROJO_LUZ = "#7a2a30";
  let e;

  // A1 · gancho
  function bloque1(t) {
    escenario("control", e.capas, t, op);
    e.tx("rotulo", 'El juego <span class="clave">sabe</span>', 16, 62, 0);
    mapaEstacion(e, 16, 84, 238, 120, t);
    e.tx("insignia", "El alien, no", 16, 212, P("fr01", "no"), "background:#e0454f;color:#f5f7fb");
    if (t >= INI("fr02")) { e.x2(132, 206, (g) => cerebro(g, 0, 0, "#5bd0a0")); e.x2(186, 206, (g) => cerebro(g, 0, 0, "#e8919c")); }
    e.tx("etiqueta", "2 cerebros", 132, 246, P("fr02", "cerebros"), "color:#f2c14e");
  }

  // A2 · director y alien
  function bloque2(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(0), alienDesde = INI("fr04"), empuja = P("fr05", "empuja");
    if (t < alienDesde) {
      e.tx("rotulo", '1 · El <span class="clave">director</span>', 16, 62, a);
      mapaEstacion(e, 16, 84, 238, 96, t);
      e.tx("etiqueta", "Sin cuerpo", 20, 186, P("fr03", "cuerpo"), "color:#8a93a6");
      e.tx("etiqueta", "Sabe dónde estás", 20, 200, P("fr03", "exactamente"), "color:#ff8a3d");
    } else if (t < INI("fr05")) {
      e.tx("rotulo", '2 · El <span class="clave">alien</span>', 16, 62, alienDesde);
      alien(e.frente, 104, SUELO - 126, { pose: "quieto", t, luz: "#4a5a80" }, 2);
      e.tx("titular", "?", 200, 96, P("fr04", "sabe"), "color:#e0454f");
      e.tx("etiqueta", "No sabe dónde estás", 16, 96, P("fr04", "sabe"));
      e.tx("etiqueta", "Oye y ve", 16, 116, P("fr04", "oye"), "color:#f2c14e");
    } else {
      e.tx("rotulo", 'Solo da <span class="clave">pistas</span>', 16, 62, INI("fr05"));
      const f = e.paso(e.prog(t, empuja, P("fr05", "zona") + 0.4), 0.1);
      mapaEstacion(e, 16, 84, 238, 96, t, { alien: [0.1 + f * 0.45, 0.15 + f * 0.3], zona: t >= P("fr05", "zona"), flecha: t >= empuja });
      e.tx("etiqueta", "Que busque", 20, 186, P("fr05", "busque"), "color:#f2c14e");
    }
    e.fuente("Fuente: Thompson (2017)", 16, t >= alienDesde && t < INI("fr05") ? 136 : 212, a);
  }

  // A3 · sentidos y búsqueda
  function bloque3(t) {
    escenario("pasillo", e.capas, t, op);
    const a = LLEGA(1);
    if (t < INI("fr07")) {
      e.tx("rotulo", 'Lo que <span class="clave">oye</span>', 16, 62, a);
      e.panel(16, 84, 238, 96);
      [["Pasos", "pasos"], ["Disparos", "disparos"], ["Detector", "detector"]].forEach(([s, w], k) => e.tx("etiqueta", s, 28, 96 + k * 24, P("fr06", w), k === 1 ? "color:#ff8a3d" : ""));
      if (t >= P("fr06", "detector")) e.x2(150, 104, (g) => propDetector(g, 0, 0, t, { puntos: [[0.4, -0.5]] }));
      e.tx("etiqueta", "Si lo tienes cerca", 28, 166, P("fr06", "cerca"), "color:#1fd69a");
    } else {
      e.tx("rotulo", 'Si te <span class="clave">pierde</span>', 16, 62, INI("fr07"));
      e.panel(16, 84, 238, 120, C_ALIEN.fondo);
      const cx = 135, cy = 136, ini = P("fr07", "vueltas"), pasada = Math.max(0, Math.floor((t - ini) / 1.2)), r = Math.max(14, 56 - pasada * 11);
      for (let k = 0; k < 36; k++) { const q = (k / 36) * Math.PI * 2; rect(e.frente, Math.round(cx + Math.cos(q) * r), Math.round(cy + Math.sin(q) * r * 0.75), 1, 1, "#7a2a30"); }
      if (t >= ini) { const g = ((t - ini) % 1.2) / 1.2 * Math.PI * 2; rect(e.frente, Math.round(cx + Math.cos(g) * r) - 2, Math.round(cy + Math.sin(g) * r * 0.75) - 2, 5, 5, C_ALIEN.alien); }
      rect(e.frente, cx - 2, cy - 2, 5, 5, C_ALIEN.tu);
      e.tx("etiqueta", "Cada pasada, más cerca", 20, 188, P("fr07", "estrechando"), "color:#f2c14e");
    }
    e.fuente("Fuente: Thompson (2017-2020)", 16, 212, a);
  }

  // A4 · medidor de amenaza y conductos
  function bloque4(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(2), sube = P("fr08", "sube"), llena = INI("fr09");
    e.tx("rotulo", 'Medidor de <span class="clave">amenaza</span>', 16, 62, a);
    e.panel(16, 84, 238, 120, "#0b0e14");
    e.tx("etiqueta", "Amenaza", 28, 96, P("fr08", "amenaza"));
    const nivel = t >= llena ? 1 : t >= sube ? 0.3 + e.paso(e.prog(t, sube, llena), 0.1) * 0.7 : 0.1;
    if (t >= P("fr08", "amenaza")) e.barra(28, 110, 214, 12, nivel, PROP.rojo);
    e.tx("etiqueta", "Sube por tenerlo cerca", 28, 132, P("fr08", "tenerlo"), "color:#f2c14e");
    if (t >= llena) {
      e.x2(28, 152, (g) => propRejilla(g, 0, 0));
      e.tx("etiqueta", "Al conducto", 84, 152, P("fr09", "conductos"), "color:#8a93a6");
      e.tx("etiqueta", "Un respiro", 84, 166, P("fr09", "respiro"), "color:#1fd69a");
      e.tx("etiqueta", "A menudo, por delante", 28, 186, P("fr09", "delante"), "color:#ff8a3d");
    }
    e.fuente("Fuente: Thompson (2017)", 16, 212, a);
  }

  // A5 · trampas y cierre
  function bloque5(t) {
    escenario("pasillo", e.capas, t, op);
    const a = LLEGA(3);
    if (t < INI("fr11")) {
      e.tx("rotulo", '¿<span class="clave">Teletransporte</span>?', 16, 62, a);
      e.panel(16, 84, 238, 92);
      if (e.tx("etiqueta", "En toda la campaña:", 28, 96, P("fr10", "campana"))) e.tx("dato", "2", 28, 112, P("fr10", "dos"), "color:#ff8a3d");
      if (t >= P("fr10", "dos")) for (let k = 0; k < 2; k++) e.x2(70 + k * 36, 116, (g) => propClaqueta(g, 0, 0));
      e.tx("etiqueta", "Solo para escenas", 28, 154, P("fr10", "escenas"), "color:#1fd69a");
      e.fuente("Fuente: Thompson (2017)", 16, 182, a);
    } else {
      e.tx("titular", "No hace", 16, 84, INI("fr11"));
      e.tx("titular", '<span class="clave">trampas</span>', 16, 108, P("fr11", "trampas"));
      e.tx("etiqueta", "El que sabe es el otro", 16, 140, P("fr11", "otro"), "color:#f2c14e");
    }
    if (t >= INI("fr11")) alien(e.frente, 104, SUELO - 126, { pose: "sisear", t, luz: ROJO_LUZ }, 2);
  }

  const G = (pose, x = 18, espejo = false) => ({ x, y: Y_GATO, espejo, pose });
  const bloques = [
    { pintar: bloque1, gato: (t) => G(t >= INI("fr02") ? "senalar" : t >= P("fr01", "no") ? "sorpresa" : "pie", 18) },
    { pintar: bloque2, gato: (t) => G(t >= INI("fr05") ? "senalar" : t >= INI("fr04") ? "pensar" : "tocar") },
    { pintar: bloque3, gato: (t) => G(t >= INI("fr07") ? "asustado" : "senalar") },
    { pintar: bloque4, gato: (t) => G(t >= INI("fr09") ? "celebrar" : "senalar") },
    { pintar: bloque5, gato: (t) => G(t >= INI("fr11") ? "senalar" : "asustado") },
  ];
  const CLAVES = { fr01: "no", fr02: "cerebros", fr03: "director", fr04: "alien", fr05: "pistas", fr06: "detector", fr07: "círculo",
    fr08: "amenaza", fr09: "conductos", fr10: "dos", fr11: "otro" };
  let pintarDialogo = () => {};
  e = escenaBase({ W, H, bloques, cortes: CORTES, y0Gato: Y_GATO, alPintar: (t) => pintarDialogo(t) });
  pintarDialogo = dialogoShort(e, CLAVES, CORTES);

  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - 0.2, "destello"));
    add(P("fr01", "no"), "error"); add(INI("fr02"), "aparicion"); add(P("fr05", "empuja"), "aparicion");
    add(P("fr06", "detector"), "tick"); add(P("fr07", "estrechando"), "seleccion");
    add(INI("fr09"), "tick"); add(P("fr10", "dos"), "acierto"); add(INI("fr11"), "error");
    return ev;
  };
  window.seek(0);
})();
