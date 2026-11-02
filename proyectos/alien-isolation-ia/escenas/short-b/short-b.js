// alien-isolation-ia · short B «El alien de Alien: Isolation 2». Estilo v2 con las desviaciones de style_guide.md. Caja de
// diálogo con retrato, algo nuevo cada 2-4 s, sin llamada a la acción; la especulación va con su marco fijo.
// Zona segura: nada importante por encima de y=58 (12 %), ni bajo la caja de diálogo, ni en x>237 entre y=216 y y=408.
(() => {
  const W = 270, H = 480, SUELO = 290, Y_GATO = 226;
  const { P, INI, medio } = tiemposDe(window.TIMING);
  const CORTES = [medio("fr02", "fr03"), medio("fr03", "fr04"), medio("fr06", "fr07"), medio("fr07", "fr08"), medio("fr08", "fr09")];
  const op = { W, H, suelo: SUELO };
  const LLEGA = (k) => CORTES[k] + 0.2, AZUL_LUZ = "#4a5a80";
  const FUENTE_CA = "Fuente: Creative Assembly";
  let e;

  // B1 · gancho
  function bloque1(t) {
    escenario("colonia", e.capas, t, op);
    e.tx("rotulo", 'Alien: Isolation <span class="clave">2</span>', 16, 62, 0);
    e.tx("titular", "Aún más", 16, 80, P("fr01", "todavia"));
    e.tx("titular", '<span class="clave">inteligente</span>', 16, 104, P("fr01", "inteligente"));
    e.tx("titular", "¿Cómo?", 16, 128, P("fr02", "como"), "color:#f2c14e");
    alien(e.frente, 104, SUELO - 126, { pose: t >= INI("fr02") ? "sisear" : "agachado", t, luz: AZUL_LUZ }, 2);
    e.fuente(FUENTE_CA, 16, 154, 0);
  }

  // B2 · el primero aprendía a medias
  function bloque2(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(0), abre = P("fr03", "veces");
    e.tx("rotulo", 'El primero: <span class="clave">a medias</span>', 16, 62, a);
    e.panel(16, 84, 238, 112, "#0b0e14");
    nodo(e, 76, 92, 118, "Alien", { desde: a, color: "#ff8a3d" });
    nodo(e, 28, 124, 214, "Mirar en taquillas", { desde: P("fr03", "taquillas"), candado: t >= abre });
    if (t >= P("fr03", "escaparas")) {
      const n = Math.min(3, 1 + Math.floor(e.prog(t, P("fr03", "escaparas"), abre) * 3));
      e.tx("etiqueta", `Escapadas: ${"I".repeat(n)}`, 28, 152, P("fr03", "escaparas"), "color:#1fd69a");
    }
    e.tx("etiqueta", "Se activa", 28, 172, abre, "color:#f2c14e");
    e.fuente("Fuente: Thompson (2017-2020)", 16, 204, a);
  }

  // B3 · lo nuevo, según el estudio
  function bloque3(t) {
    escenario("colonia", e.capas, t, op);
    const a = LLEGA(1);
    if (t < INI("fr06")) {
      e.tx("rotulo", 'Según el <span class="clave">estudio</span>', 16, 62, a);
      e.panel(16, 84, 238, 112, "#0b0e14");
      [["Cosas nuevas que aprender", "fr04", "aprender"], ["Cambia en cada encuentro", "fr04", "encuentro"], ["No sirve repetir trucos", "fr04", "trucos"], ["Reacciona a objetos nuevos", "fr05", "objetos"]]
        .forEach(([s, fr, w], k) => { if (e.tx("etiqueta", s, 40, 96 + k * 24, P(fr, w), k === 1 ? "color:#ff8a3d" : "")) puntaFlecha(e.frente, 32, 99 + k * 24, "der", PROP.dorado, 3); });
    } else {
      e.tx("rotulo", 'Exteriores <span class="clave">×10</span>', 16, 62, INI("fr06"));
      e.panel(16, 84, 238, 112, "#0b0e14");
      rect(e.frente, 32, 160, 20, 20, "#3a4166"); e.tx("etiqueta", "Primero", 28, 184, INI("fr06"), "color:#8a93a6");
      if (t >= P("fr06", "diez")) { rect(e.frente, 150, 116, 80, 50, "#16301c"); marcoSeleccion(e.frente, 150, 116, 80, 50, "#1fd69a"); e.tx("titular", "×10", 166, 132, P("fr06", "diez"), "color:#1fd69a"); }
      e.tx("etiqueta", "(aprox.)", 158, 172, P("fr06", "grandes"), "color:#8a93a6");
      e.tx("etiqueta", "Con tormentas", 28, 100, P("fr06", "tormentas"), "color:#f2c14e");
    }
    e.fuente(FUENTE_CA, 16, 204, a);
  }

  // B4 · fuera no deja de cazarte
  function bloque4(t) {
    escenario("colonia", e.capas, t, op);
    const a = LLEGA(2), clima = P("fr07", "clima");
    e.tx("rotulo", 'Fuera, más <span class="clave">agresivo</span>', 16, 62, a);
    e.panel(16, 84, 238, 70 + 6, "#0b0e14");
    e.tx("etiqueta", "Usará que estás expuesto", 28, 96, P("fr07", "expuesto"), "color:#ff8a3d");
    e.tx("etiqueta", "Más agresividad", 28, 112, P("fr07", "agresividad"));
    e.tx("etiqueta", "El clima, para ocultar", 28, 128, clima, "color:#f5f7fb");
    e.tx("etiqueta", "sus movimientos", 28, 140, P("fr07", "movimientos"), "color:#f5f7fb");
    alien(e.frente, 104, SUELO - 126, { pose: "agachado", t, luz: AZUL_LUZ }, 2);
    if (t >= clima) { const az = mulberry32(5); for (let k = 0; k < 150; k++) { const x = 96 + az() * 150, y0 = az() * 150, y = Math.floor((y0 + t * 260) % 150) + 158; rect(e.frente, Math.floor(x - (y * 0.35) % 18), y, 1, 3, "#5a6a8a"); } }
    e.fuente(FUENTE_CA, 16, 164, a);
  }

  // B5 · el micrófono
  function bloque5(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(3), perro = P("fr08", "perro");
    e.tx("rotulo", 'Te oye por el <span class="clave">micro</span>', 16, 62, a);
    e.panel(16, 84, 238, 112, "#0b0e14");
    e.x2(36, 104, (g) => propMicrofono(g, 0, 0, { activo: true }));
    e.tx("etiqueta", "Si lo activas", 72, 100, P("fr08", "activas"));
    e.tx("etiqueta", "También en PC", 72, 116, P("fr08", "PC"), "color:#f2c14e");
    if (t >= perro) {
      e.x2(150, 140, (g) => propPerro(g, 0, 0, t, { ladra: true }));
      for (let k = 0; k < 3; k++) { const r = 6 + k * 7 + (Math.floor(t / 0.15) % 3) * 2; for (let q = -5; q <= 5; q++) rect(e.frente, 146 - Math.round(Math.cos(q / 6) * r), 154 + Math.round(Math.sin(q / 6) * r), 2, 1, "#f2c14e"); }
      e.tx("etiqueta", "Puede delatarte", 28, 176, P("fr08", "delatarte"), "color:#ff8a3d");
    }
    e.fuente(FUENTE_CA, 16, 204, a);
  }

  // B6 · especulación y cierre
  function bloque6(t) {
    escenario("colonia", e.capas, t, op);
    const a = LLEGA(4), cierre = INI("fr10");
    if (t < cierre) {
      rect(e.frente, 12, 80, 246, 2, PROP.dorado); rect(e.frente, 12, 200, 246, 2, PROP.dorado); rect(e.frente, 12, 80, 2, 122, PROP.dorado); rect(e.frente, 256, 80, 2, 122, PROP.dorado);
      e.tx("insignia", "Especulación de MISTA", 16, 62, a, "background:#f2c14e");
      e.panel(20, 88, 230, 106, "#0b0e14");
      e.x2(30, 100, (g) => propRejilla(g, 0, 0, { tachada: t >= P("fr09", "hay") }));
      e.tx("etiqueta", "Antes: conductos", 90, 104, P("fr09", "conductos"), "color:#8a93a6");
      e.tx("etiqueta", "Fuera no hay", 90, 120, P("fr09", "hay"), "color:#ff8a3d");
      if (t >= P("fr09", "tormenta")) e.x2(30, 140, (g) => propTormenta(g, 0, 0, t));
      e.tx("etiqueta", "¿Su nuevo", 100, 150, P("fr09", "tormenta"), "color:#f2c14e");
      e.tx("etiqueta", "escondite?", 100, 164, P("fr09", "escondite"), "color:#f2c14e");
    } else {
      e.tx("rotulo", 'Sin <span class="clave">fecha</span>', 16, 62, cierre);
      e.tx("titular", "Fecha: ???", 16, 90, P("fr10", "fecha"), "color:#e0454f");
      if (t >= P("fr10", "perro")) e.x2(150, 250, (g) => propPerro(g, 0, 0, t));
      e.fuente("Fuente: SEGA (2026-06-08)", 16, 120, cierre);
    }
  }

  const G = (pose, x = 18, espejo = false) => ({ x, y: Y_GATO, espejo, pose });
  const bloques = [
    { pintar: bloque1, gato: (t) => G(t >= INI("fr02") ? "pensar" : "asustado") },
    { pintar: bloque2, gato: (t) => G(t >= P("fr03", "veces") ? "sorpresa" : "senalar") },
    { pintar: bloque3, gato: (t) => G(t >= INI("fr06") ? "sorpresa" : "senalar") },
    { pintar: bloque4, gato: (t) => G("asustado") },
    { pintar: bloque5, gato: (t) => G(t >= P("fr08", "perro") ? "asustado" : "senalar") },
    { pintar: bloque6, gato: (t) => (t >= P("fr10", "perro") ? G("pensar", 70) : G(t >= P("fr09", "tormenta") ? "asustado" : "pensar")) },
  ];
  const CLAVES = { fr01: "inteligente", fr02: "cómo", fr03: "medias", fr04: "encuentro", fr05: "objetos", fr06: "diez",
    fr07: "clima", fr08: "micrófono", fr09: "especulación", fr10: "desconfianza" };
  let pintarDialogo = () => {};
  e = escenaBase({ W, H, bloques, cortes: CORTES, y0Gato: Y_GATO, alPintar: (t) => pintarDialogo(t) });
  pintarDialogo = dialogoShort(e, CLAVES, CORTES);

  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - 0.2, "destello"));
    add(P("fr01", "inteligente"), "seleccion"); add(INI("fr02"), "error"); add(P("fr03", "veces"), "acierto");
    add(P("fr04", "encuentro"), "seleccion"); add(P("fr06", "diez"), "aparicion"); add(P("fr07", "clima"), "aparicion");
    add(P("fr08", "perro"), "error"); add(P("fr09", "hay"), "error"); add(P("fr10", "fecha"), "tick");
    return ev;
  };
  window.seek(0);
})();
