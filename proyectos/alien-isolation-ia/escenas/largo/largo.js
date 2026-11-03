// alien-isolation-ia · largo. Estilo v2 con las desviaciones de style_guide.md (más oscuro, igual de vivo; alien pixel).
// Sin subtítulos en pantalla (SRT aparte). Algo nuevo cada 3-8 s. MISTA a la izquierda; paneles a la derecha.
(() => {
  const W = 480, H = 270, SUELO = 232, Y_GATO = SUELO - 64;
  const { P, INI, FIN, medio } = tiemposDe(window.TIMING);
  const LIMITES = [["fr11", "fr12"], ["fr21", "fr22"], ["fr35", "fr36"], ["fr44", "fr45"], ["fr55", "fr56"], ["fr61", "fr62"],
    ["fr74", "fr75"], ["fr92", "fr93"], ["fr100", "fr101"], ["fr108", "fr109"], ["fr126", "fr127"], ["fr145", "fr146"]];
  const CORTES = LIMITES.map(([a, b]) => medio(a, b));
  const op = { W, H, suelo: SUELO };
  const LLEGA = (k) => CORTES[k] + 0.2;
  const CLIP_AUDIO = [FIN("fr113"), INI("fr114")]; // c5: «So now it will be even more intelligent»
  const enClip = (t) => t > CLIP_AUDIO[0] + 0.05 && t < CLIP_AUDIO[1] - 0.05;
  const ROJO_LUZ = "#7a2a30", AZUL_LUZ = "#4a5a80";
  let e, promesa = null;
  const clip = (x, y, k, t, a, b) => { if (t >= a && t < b) { promesa = clipCRT(e, x, y, k, t, a); barridoCRT(x, y); } };

  // 1 · gancho
  function b01(t) {
    escenario("pasillo", e.capas, t, op);
    if (t < INI("fr04")) {
      e.tx("rotulo", 'El juego <span class="clave">sabe</span> dónde estás', 16, 14, 0);
      mapaEstacion(e, 150, 40, 220, 118, t, { niebla: false });
      if (e.tx("insignia", "El alien, no", 150, 166, INI("fr02"), "background:#e0454f;color:#f5f7fb")) e.tx("titular", "?", 214, 62, INI("fr02"), "color:#e0454f");
      e.tx("titular", "Alien: Isolation", 150, 186, P("fr03", "alien"), "font-size:12px;line-height:16px");
      e.fuente("Fuente: Thompson, Game Developer (2017)", 150, 206, 0);
    } else if (t < INI("fr08")) {
      const pasa = P("fr05", "largo"), abre = P("fr07", "abrio");
      e.tx("rotulo", 'Me escondí en una <span class="clave">taquilla</span>', 16, 14, INI("fr04"));
      for (let k = 0; k < 3; k++) e.x2(110 + k * 44, SUELO - 88, (g) => propTaquilla(g, 0, 0, { abierta: k === 1 && t >= abre ? Math.min(1, e.paso((t - abre) / 0.5, 0.2)) : 0 }));
      // El alien pasa de largo por delante de la primera taquilla y vuelve a la segunda
      const xa = t < INI("fr06") ? Math.round(360 - e.paso(e.prog(t, INI("fr05") - 1, pasa + 0.6), 0.05) * 300) : Math.round(380 - e.paso(e.prog(t, INI("fr06"), abre), 0.05) * 170);
      // MISTA escondido: sus ojos en la rendija de la taquilla (la primera; desde «volví», la segunda)
      const tq = t >= INI("fr06") ? 1 : 0, parpadea = (t % 2.7) > 2.55;
      if (t < abre && !parpadea) { rect(e.frente, 110 + tq * 44 + 8, SUELO - 70, 4, 2, "#d8c94a"); rect(e.frente, 110 + tq * 44 + 18, SUELO - 70, 4, 2, "#d8c94a"); }
      alien(e.frente, xa, SUELO - 126, { pose: t >= abre ? "sisear" : "andar", t, luz: ROJO_LUZ }, 2);
      if (t >= abre) clip(330, 34, "k1", t, abre, INI("fr08"));
    } else {
      const q = ["¿Te vio?", "¿Trampas?", "¿Aprendió?"], w = ["visto", "trampas", "aprendido"];
      e.tx("rotulo", "Tres preguntas", 16, 14, INI("fr08"));
      if (t < INI("fr09")) q.forEach((s, k) => e.tx("titular", s, 130, 50 + k * 30, P("fr08", w[k]), k === 2 ? "color:#ff8a3d" : ""));
      else {
        e.tx("titular", 'Su <span class="clave">cerebro</span>', 130, 44, INI("fr09"));
        if (t >= P("fr10", "cerebros")) { e.panel(130, 78, 150, 74); e.x2(160, 86, (g) => cerebro(g, 0, 0, "#5bd0a0")); e.tx("etiqueta", "1 · Director", 146, 132, P("fr10", "cerebros"), "color:#1fd69a"); }
        if (t >= P("fr10", "dos")) { e.panel(296, 78, 150, 74); e.x2(326, 86, (g) => cerebro(g, 0, 0, "#e8919c")); e.tx("etiqueta", "2 · Alien", 316, 132, P("fr10", "dos"), "color:#ff8a3d"); }
        if (e.tx("insignia", "Al final: Isolation 2", 130, 166, P("fr11", "Isolation"))) e.tx("etiqueta", "«Aún más inteligente»", 296, 168, P("fr11", "inteligente"), "color:#f2c14e");
        e.fuente("Fuente: Creative Assembly, Dev Q&A (2026)", 130, 186, P("fr11", "inteligente"));
      }
    }
  }

  // 2 · un solo monstruo
  function b02(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(0);
    e.tx("rotulo", 'Sencilla y <span class="clave">cruel</span>', 16, 14, a);
    if (t < INI("fr16")) {
      e.panel(110, 40, 356, 120);
      [["Una estación", "estacion"], ["Una persona", "persona"], ["Un alien", "unico"]].forEach(([s, w], k) => e.tx("etiqueta", s, 124, 52 + k * 16, P("fr12", w), k === 2 ? "color:#ff8a3d" : ""));
      e.tx("insignia", "No puedes matarlo", 124, 104, P("fr12", "matar"), "background:#e0454f;color:#f5f7fb");
      if (e.tx("etiqueta", "Enemigos:", 124, 128, INI("fr13"))) e.tx("dato", t >= INI("fr14") ? "1" : "∞", 218, 120, INI("fr13"), `color:${t >= INI("fr14") ? "#ff8a3d" : "#8a93a6"}`);
      e.tx("etiqueta", "Campaña: 12-18 h", 270, 128, P("fr15", "doce"), "color:#f2c14e");
      e.fuente("Fuente: Thompson (2017)", 110, 168, P("fr15", "doce"));
    } else if (t < INI("fr19")) {
      e.tx("titular", "El problema", 110, 40, INI("fr16"));
      e.panel(110, 70, 356, 80);
      if (e.tx("etiqueta", "Te encuentra siempre", 124, 84, INI("fr17"))) e.tx("insignia", "Injusto", 360, 82, P("fr17", "injusto"), "background:#e0454f;color:#f5f7fb");
      if (e.tx("etiqueta", "No te encuentra nunca", 124, 114, INI("fr18"))) e.tx("insignia", "Pasillo vacío", 344, 112, P("fr18", "vacio"), "background:#8a93a6");
    } else {
      e.tx("titular", 'Cerca, pero <span class="clave">no encima</span>', 110, 40, INI("fr19"));
      e.panel(110, 80, 356, 60);
      rect(e.frente, 124, 108, 328, 4, "#2a3346");
      rect(e.frente, 124 + 82, 104, 164, 12, "#16301c"); e.tx("etiqueta", "Zona buena", 250, 90, INI("fr19"), "color:#1fd69a");
      rect(e.frente, 124, 104, 30, 12, "#3a1216"); e.tx("etiqueta", "Encima", 124, 120, INI("fr21"), "color:#8a93a6");
      const xa = 124 + 82 + Math.round(e.paso((Math.sin(t * 1.3) * 0.5 + 0.5), 0.1) * 150);
      rect(e.frente, xa, 102, 6, 16, C_ALIEN.alien);
      rect(e.frente, 120, 100, 4, 20, C_ALIEN.tu);
    }
  }

  // 3 · dos cerebros
  function b03(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(1);
    if (t < INI("fr29")) {
      e.tx("rotulo", 'Partir al monstruo <span class="clave">en dos</span>', 16, 14, a);
      if (t >= INI("fr23")) {
        mapaEstacion(e, 100, 40, 176, 104, t);
        e.tx("etiqueta", "Director", 104, 150, INI("fr23"), "color:#1fd69a");
        e.tx("etiqueta", "Sin cuerpo", 104, 164, INI("fr24"), "color:#8a93a6");
        e.tx("etiqueta", "Siempre sabe", 104, 178, P("fr25", "siempre"), "color:#ff8a3d");
      }
      if (t >= INI("fr26")) {
        alien(e.frente, 330, SUELO - 126, { pose: t >= INI("fr27") ? "quieto" : "andar", t, luz: AZUL_LUZ }, 2);
        if (t >= INI("fr27")) e.tx("titular", "?", 296, 84, INI("fr27"), "color:#e0454f");
        e.tx("etiqueta", "Alien", 296, 40, INI("fr26"), "color:#ff8a3d");
        e.tx("etiqueta", "Sin mapa", 296, 54, INI("fr27"), "color:#8a93a6");
        e.tx("etiqueta", "Te busca él solo", 296, 68, INI("fr28"), "color:#f5f7fb");
      }
      e.fuente("Fuente: Thompson (2017)", 100, 198, INI("fr23"));
    } else {
      e.tx("rotulo", 'El director da <span class="clave">pistas</span>', 16, 14, INI("fr29"));
      const empuja = t >= P("fr30", "empuja"), f = e.paso(e.prog(t, P("fr30", "empuja"), P("fr30", "zona") + 0.4), 0.1);
      const m = mapaEstacion(e, 100, 40, 260, 140, t, { alien: [0.15 + f * 0.45, 0.2 + f * 0.35], zona: t >= P("fr30", "zona"), flecha: empuja && t < INI("fr34") });
      if (t < INI("fr30")) { e.tx("etiqueta", "¿Taquilla 3?", m.tu[0] - 50, m.tu[1] - 30, P("fr29", "taquilla")); if (t >= P("fr29", "tres")) aspa(e.frente, m.tu[0] + 50, m.tu[1] - 30, PROP.rojo); }
      e.tx("etiqueta", "Pista", 370, 54, INI("fr31"), "color:#f2c14e"); e.tx("etiqueta", "aproximada", 370, 66, INI("fr31"), "color:#f2c14e");
      if (t >= INI("fr32") && t < INI("fr34")) { e.panel(370, 80, 98, 34, "#241c10"); e.tx("etiqueta", "«Por aquí", 376, 86, INI("fr32"), "color:#f2c14e"); e.tx("etiqueta", "hace calor»", 376, 100, P("fr32", "calor"), "color:#f2c14e"); }
      e.tx("etiqueta", "Que busque", 370, 124, INI("fr33"));
      if (t >= INI("fr34")) e.tx("titular", 'El que sabe', 100, 190, INI("fr35"), "font-size:12px;line-height:16px");
      e.tx("titular", 'es el <span class="clave">otro</span>', 270, 190, P("fr35", "otro"), "font-size:12px;line-height:16px");
      e.tx("etiqueta", "Sin trampas", 370, 144, P("fr34", "trampas"), "color:#1fd69a");
      e.fuente("Fuente: Thompson (2017)", 100, 206, INI("fr29"));
    }
  }

  // Onda de sonido pixel: arcos concéntricos que salen de (x, y) hacia la derecha, más grandes si fuerte
  function ondas(x, y, t, n, color) {
    for (let k = 0; k < n; k++) {
      const r = 6 + k * 7 + (Math.floor(t / 0.15) % 3) * 2;
      for (let a = -6; a <= 6; a++) { const g = (a / 6) * 0.9; rect(e.frente, x + Math.round(Math.cos(g) * r), y + Math.round(Math.sin(g) * r), 2, 1, color); }
    }
  }

  // 4 · lo que oye
  function b04(t) {
    escenario("pasillo", e.capas, t, op);
    const a = LLEGA(2);
    alien(e.frente, 340, SUELO - 126, { pose: "quieto", t, espejo: true, luz: ROJO_LUZ }, 2);
    e.tx("rotulo", '1 · El <span class="clave">oído</span>', 16, 14, a);
    if (t < INI("fr40")) {
      e.panel(110, 40, 200, 110);
      if (e.tx("etiqueta", "Pasos", 122, 54, P("fr38", "pasos"))) ondas(200, 58, t, t >= P("fr38", "corres") ? 3 : 1, "#8a93a6");
      e.tx("etiqueta", "Si corres: más", 122, 74, P("fr38", "corres"), "color:#f2c14e");
      if (e.tx("etiqueta", "Disparos", 122, 104, INI("fr39"))) ondas(200, 108, t, 5, "#ff8a3d");
      e.fuente("Fuente: Thompson (2017)", 110, 158, P("fr38", "pasos"));
    } else if (t < INI("fr42")) {
      e.x2(118, 60, (g) => propDetector(g, 0, 0, t, { puntos: [[0.3, -0.5]] }));
      e.tx("etiqueta", "Detector", 118, 44, INI("fr40"), "color:#1fd69a");
      if (t >= P("fr41", "metro")) { e.panel(118, 150, 160, 26, "#0b1a14"); e.tx("etiqueta", "Te oye a < 1,5 m", 126, 158, P("fr41", "metro"), "color:#1fd69a"); }
      clip(190, 40, "k2", t, P("fr41", "pitido"), INI("fr42"));
      e.fuente("Fuente: Thompson (2017)", 118, 182, P("fr41", "metro"));
    } else {
      e.panel(110, 40, 210, 116);
      e.tx("etiqueta", "Lo hace ir antes", 122, 52, INI("fr42"));
      e.tx("titular", 'Disparo', 122, 70, P("fr42", "disparo"), "color:#ff8a3d");
      e.tx("titular", '> pasos', 122, 94, P("fr42", "pasos"));
      if (e.papel(150, 124, 110, 26, P("fr43", "invitacion"))) e.tx("tarjeta-texto", "Invitación", 164, 132, P("fr43", "invitacion"), "color:#b4622a");
      e.tx("insignia", "Gracias, yo", 220, 162, INI("fr44"));
      e.fuente("Fuente: Thompson (2020)", 110, 178, INI("fr42"));
    }
  }

  // 5 · lo que ve
  function b05(t) {
    escenario("pasillo", e.capas, t, op);
    const a = LLEGA(3), duda = t >= INI("fr51") && t < INI("fr53");
    const espejo = !(duda && Math.floor((t - INI("fr51")) / 0.8) % 2 === 1);
    const xa = 310, cabeza = [xa + 10, SUELO - 126 + 34];
    e.tx("rotulo", '2 · La <span class="clave">vista</span>', 16, 14, a);
    if (t >= INI("fr47") && t < INI("fr53")) {
      const k = (w) => t >= P("fr47", w);
      if (k("periferico")) cono(e.capas.brillo, cabeza[0], cabeza[1], 70, 40, "#5b8cff");
      if (k("normal")) cono(e.capas.brillo, cabeza[0], cabeza[1], 150, 18, "#f2c14e");
      if (k("enfocado")) cono(e.capas.brillo, cabeza[0], cabeza[1], 200, 5, "#ff8a3d");
      if (k("cercano")) disco(e.capas.brillo, cabeza[0] - 6, cabeza[1] + 8, 18, "#cfd8ff");
      [["Normal", "normal"], ["Enfocado", "enfocado"], ["Periférico", "periferico"], ["Cercano", "cercano"]].forEach(([s, w], j) => e.tx("etiqueta", s, 110, 44 + j * 14, P("fr47", w), `color:${["#f2c14e", "#ff8a3d", "#5b8cff", "#f5f7fb"][j]}`));
      e.tx("etiqueta", "4 conos", 110, 30, INI("fr47"), "color:#8a93a6");
    }
    if (t >= INI("fr48") && t < INI("fr51")) {
      e.tx("etiqueta", "Señal", 110, 110, INI("fr49"));
      e.barra(160, 108, 120, 10, t >= INI("fr50") ? 1 : e.paso(e.prog(t, INI("fr49"), INI("fr50")), 0.1), PROP.rojo);
      e.tx("etiqueta", "No es sí o no", 110, 128, INI("fr48"), "color:#f2c14e");
      e.fuente("Fuente: Thompson (2020)", 110, 146, INI("fr48"));
    }
    if (duda) e.tx("insignia", "Duda…", 300, 60, P("fr51", "duda"));
    if (t >= INI("fr53")) {
      for (let k = 0; k < 3; k++) rect(e.capas.brillo, xa + 66 + k * 6, cabeza[1] + 4 + k, 4, 1, "#e0454f");
      e.tx("titular", 'Ojos en la <span class="clave">nuca</span>', 110, 50, INI("fr54"), "font-size:12px;line-height:16px");
      e.tx("etiqueta", "Rayos cortos atrás", 110, 74, P("fr53", "espalda"), "color:#ff8a3d");
      if (t >= INI("fr55")) e.tx("insignia", "Pillado", 380, 110, P("fr55", "pilla"), "background:#e0454f;color:#f5f7fb");
      e.fuente("Fuente: Thompson (2017)", 110, 92, P("fr53", "espalda"));
    }
    alien(e.frente, xa, SUELO - 126, { pose: duda ? "quieto" : t >= INI("fr55") ? "sisear" : "quieto", t, espejo: !espejo, luz: ROJO_LUZ }, 2);
  }

  // 6 · cuando no sabe dónde estás (mapa cenital)
  function b06(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(4), busca = INI("fr57"), cx = 290, cy = 110;
    e.tx("rotulo", '¿Y si te <span class="clave">pierde</span>?', 16, 14, a);
    e.panel(150, 40, 280, 150, C_ALIEN.fondo);
    for (const [x, y, w, h] of [[160, 50, 260, 4], [160, 176, 260, 4], [160, 50, 4, 130], [416, 50, 4, 130], [240, 50, 4, 70], [330, 110, 4, 70]]) rect(e.frente, x, y, w, h, C_ALIEN.pared);
    rect(e.frente, cx - 3, cy - 3, 7, 7, "#16301c"); e.tx("etiqueta", "Última vez", cx - 30, cy - 18, a, "color:#8a93a6");
    const escondite = [cx + 26, cy + 24], seguro = t < P("fr60", "deja");
    rect(e.frente, escondite[0] - 4, escondite[1] - 4, 9, 9, seguro ? "#1fd69a" : "#e0454f");
    if (t >= busca) {
      const pasada = Math.floor((t - busca) / 1.6), r = Math.max(12, 70 - pasada * 9), g = ((t - busca) % 1.6) / 1.6 * Math.PI * 2;
      for (let k = 0; k < 40; k++) { const q = (k / 40) * Math.PI * 2; rect(e.frente, Math.round(cx + Math.cos(q) * r), Math.round(cy + Math.sin(q) * r * 0.6), 1, 1, "#7a2a30"); }
      rect(e.frente, Math.round(cx + Math.cos(g) * r) - 2, Math.round(cy + Math.sin(g) * r * 0.6) - 2, 5, 5, C_ALIEN.alien);
    }
    if (e.tx("insignia", "Acecho", 160, 196, P("fr58", "acecho"), "background:#e0454f;color:#f5f7fb")) e.tx("etiqueta", "Cada pasada, más cerca", 240, 198, INI("fr59"), "color:#f2c14e");
    if (!seguro) e.tx("etiqueta", "Ya no es seguro", escondite[0] - 40, escondite[1] + 12, P("fr60", "deja"), "color:#ff8a3d");
    e.tx("etiqueta", "Está peinando", 160, 226, INI("fr61"));
    e.fuente("Fuente: Thompson (2020)", 280, 214, P("fr58", "acecho"));
  }

  // 7 · el medidor de amenaza
  function b07(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(5);
    e.tx("rotulo", 'Lo que más me <span class="clave">fascina</span>', 16, 14, a);
    if (t < INI("fr68")) {
      e.panel(110, 40, 356, 140);
      e.tx("titular", "Amenaza", 124, 50, INI("fr63"));
      const pasos = [P("fr64", "cerca"), P("fr64", "verlo"), P("fr64", "detector")], vete = P("fr67", "vete");
      const nivel = t >= vete ? 1 : t >= INI("fr67") ? 0.8 + e.paso(e.prog(t, INI("fr67"), vete), 0.05) * 0.2 : pasos.filter((p) => t >= p).length * 0.22;
      e.barra(124, 76, 330, 14, nivel, PROP.rojo);
      [["Cerca", 0], ["Lo ves", 1], ["En el detector", 2]].forEach(([s, k]) => e.tx("etiqueta", s, 124 + k * 100, 98, pasos[k], "color:#f2c14e"));
      if (t >= INI("fr65") && t < INI("fr67")) {
        if (e.tx("etiqueta", "Por atacarte", 140, 124, INI("fr65"))) aspa(e.frente, 124, 123, PROP.rojo);
        if (e.tx("etiqueta", "Por tenerlo cerca", 140, 142, INI("fr66"))) check(e.frente, 124, 141, PROP.verde);
      }
      if (t >= vete) e.tx("titular", '«<span class="clave">Vete</span>»', 300, 130, vete);
      e.fuente("Fuente: Thompson (2017)", 110, 188, INI("fr63"));
    } else if (t < INI("fr72")) {
      e.tx("titular", "Entre bastidores", 110, 40, P("fr69", "bastidores"), "font-size:12px;line-height:16px");
      const m = mapaEstacion(e, 110, 64, 250, 120, t, { alien: [0.3, 0.1], verTu: true });
      e.x2(370, 70, (g) => propRejilla(g, 0, 0));
      e.tx("etiqueta", "Conductos", 370, 96, INI("fr68"), "color:#8a93a6");
      if (t >= INI("fr71")) {
        const f = e.paso(e.prog(t, INI("fr71"), FIN("fr71")), 0.05), [x0, y0] = m.P(0.3, 0.1), [x1, y1] = m.P(0.85, 0.55);
        for (let k = 0; k <= 20; k += 2) rect(e.frente, Math.round(x0 + ((x1 - x0) * k) / 20), Math.round(y0 + ((y1 - y0) * k) / 20), 2, 2, "#7a2a30");
        rect(e.frente, Math.round(x0 + (x1 - x0) * f) - 3, Math.round(y0 + (y1 - y0) * f) - 3, 7, 7, C_ALIEN.alien);
        e.tx("etiqueta", "Por delante", 370, 116, P("fr71", "delante"), "color:#ff8a3d"); e.tx("etiqueta", "de ti", 370, 128, P("fr71", "delante"), "color:#ff8a3d");
      }
      e.tx("insignia", "No se va lejos", 300, 190, INI("fr70"));
      e.fuente("Fuente: Thompson (2017)", 110, 192, INI("fr68"));
    } else {
      if (t < INI("fr73")) {
        e.panel(110, 40, 356, 120);
        [["Espera", "espera"], ["Llenado", "llenarse"], ["Rondas", "rondarte"]].forEach(([s, w], k) => {
          const x = 140 + k * 110;
          if (t >= P("fr72", w)) { disco(e.frente, x + 20, 92, 20, PROP.contorno); disco(e.frente, x + 20, 92, 18, "#1b2130"); const g = Math.PI * (0.8 + 0.25 * k + 0.1 * (Math.floor(t / 0.5) % 2)); linea(e.frente, x + 20, 92, x + 20 + Math.round(Math.cos(g) * 14), 92 + Math.round(Math.sin(g) * 14), PROP.dorado, 2); }
          e.tx("etiqueta", s, x, 120, P("fr72", w));
        });
        e.fuente("Fuente: Thompson (2020)", 110, 168, P("fr72", "espera"));
      } else {
        e.tx("titular", "Mide tu", 120, 60, INI("fr73"));
        e.tx("titular", '<span class="clave">miedo</span>', 120, 86, P("fr73", "miedo"));
        e.tx("etiqueta", "Para darte un respiro", 120, 120, P("fr73", "respiro"), "color:#1fd69a");
        e.tx("etiqueta", "y asustarte en el peor momento", 120, 136, P("fr74", "peor"), "color:#ff8a3d");
      }
    }
  }

  // 8 · el árbol que aprende
  function b08(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(6);
    e.tx("rotulo", '¿Aprende o <span class="clave">no</span>?', 16, 14, a);
    if (t < INI("fr81")) {
      e.panel(104, 36, 364, 160, "#0b0e14");
      nodo(e, 236, 44, 100, "Alien", { desde: INI("fr76"), color: "#ff8a3d" });
      e.tx("etiqueta", "+100 nodos", 380, 48, P("fr76", "cien"), "color:#f2c14e");
      const hojas = [["Oigo: miro", "oigo"], ["Veo: voy", "veo"], ["Fuego: huyo", "queman"]];
      hojas.forEach(([s, w], k) => {
        const x = 112 + k * 120;
        if (t >= P("fr77", w)) { linea(e.frente, 286, 60, x + 54, 74, "#36373b"); nodo(e, x, 74, 112, s, { desde: P("fr77", w) }); }
      });
      if (t >= INI("fr79")) {
        nodo(e, 112, 112, 168, "Mirar en taquillas", { desde: INI("fr79"), candado: t >= P("fr80", "veces") });
        nodo(e, 292, 112, 168, "Conductos pequeños", { desde: INI("fr79"), candado: t >= P("fr80", "veces") });
      }
      if (t >= INI("fr80")) {
        const n = Math.min(3, 1 + Math.floor(e.prog(t, P("fr80", "taquillas"), P("fr80", "veces")) * 3));
        e.tx("etiqueta", `Escapadas: ${"I".repeat(n)}`, 112, 140, P("fr80", "escapado"), "color:#1fd69a");
      }
      e.fuente("Fuente: Thompson (2017, 2020)", 104, 204, INI("fr76"));
    } else if (t < INI("fr83")) {
      clip(110, 40, "k3", t, INI("fr81"), INI("fr83"));
      e.panel(256, 40, 210, 76, "#0b0e14");
      e.tx("etiqueta", "Memoria:", 266, 50, INI("fr81"));
      e.tx("etiqueta", "Lanzallamas: visto", 266, 66, P("fr81", "lanzallamas"), "color:#ff8a3d");
      e.tx("etiqueta", "Ataca y se retira", 266, 86, P("fr82", "retira"), "color:#f2c14e");
      e.tx("etiqueta", "Emboscadas", 266, 100, P("fr82", "emboscadas"), "color:#ff8a3d");
      e.fuente("Fuente: Thompson (2020)", 256, 124, INI("fr81"));
    } else if (t < INI("fr91")) {
      e.panel(110, 40, 356, 150, "#0b0e14");
      e.tx("etiqueta", "Aprende de:", 124, 50, INI("fr83"));
      if (e.tx("etiqueta", "Tus muertes", 144, 68, P("fr83", "muertes"))) aspa(e.frente, 126, 67, PROP.rojo);
      if (e.tx("etiqueta", "Tus escapadas", 144, 84, INI("fr84"))) check(e.frente, 126, 83, PROP.verde);
      if (t >= INI("fr86")) {
        e.tx("insignia", "Letra pequeña", 300, 50, INI("fr86"));
        for (let k = 0; k < 3; k++) propCandado(e.frente, 300 + k * 22, 74, { abierto: t >= P("fr87", "puntos") });
        e.tx("etiqueta", "En puntos fijos", 300, 96, P("fr87", "puntos"), "color:#f2c14e");
        e.tx("etiqueta", "de la historia", 300, 108, P("fr87", "historia"), "color:#f2c14e");
      }
      if (t >= INI("fr88")) {
        e.tx("titular", 'Aprende... <span class="clave">a medias</span>', 124, 130, P("fr88", "medias"), "font-size:12px;line-height:16px");
        e.tx("etiqueta", "Parte: tú", 124, 156, INI("fr89"), "color:#ff8a3d");
        e.tx("etiqueta", "Parte: escrito", 260, 156, INI("fr90"), "color:#8a93a6");
      }
      e.fuente("Fuente: Thompson (2017)", 110, 198, INI("fr83"));
    } else {
      e.tx("titular", 'Y aun así, <span class="clave">funciona</span>', 110, 50, INI("fr91"), "font-size:12px;line-height:16px");
      for (let k = 0; k < 3; k++) e.x2(170 + k * 44, SUELO - 88, (g) => propTaquilla(g, 0, 0));
      e.tx("etiqueta", "Desde dentro, no notas la diferencia", 110, 74, P("fr92", "diferencia"), "color:#f2c14e");
    }
  }

  // 9 · ¿hace trampas?
  function b09(t) {
    escenario("pasillo", e.capas, t, op);
    const a = LLEGA(7);
    e.tx("rotulo", 'La gran <span class="clave">sospecha</span>', 16, 14, a);
    if (t < INI("fr98")) {
      e.panel(110, 40, 356, 150);
      e.tx("titular", "¿Teletransporte?", 124, 50, P("fr93", "teletransporta"));
      if (t >= P("fr94", "falso")) { e.panel(124, 80, 210, 30, "#3a1216"); e.tx("titular", "Falso", 134, 86, P("fr94", "falso"), "color:#e0454f"); }
      e.tx("etiqueta", "Andy Bray · Creative Assembly", 124, 116, P("fr94", "Bray"), "color:#8a93a6");
      if (t >= P("fr95", "veces")) {
        e.tx("dato", "2", 124, 136, P("fr95", "veces"), "color:#ff8a3d");
        e.tx("etiqueta", "veces en toda la campaña", 156, 146, P("fr95", "veces"));
        for (let k = 0; k < 2; k++) e.x2(370 + k * 36, 132, (g) => propClaqueta(g, 0, 0));
      }
      e.tx("etiqueta", "Solo para escenas de vídeo", 124, 170, P("fr97", "escena"), "color:#1fd69a");
      e.fuente("Fuente: Thompson (2017)", 110, 198, P("fr94", "Bray"));
    } else {
      [["Empujón del director", "director"], ["Oídos muy finos", "oidos"], ["Un árbol que se abre", "arbol"]].forEach(([s, w], k) => {
        if (t >= P("fr98", w)) { e.panel(110, 44 + k * 30, 190, 24); e.tx("etiqueta", s, 120, 52 + k * 30, P("fr98", w), "color:#f2c14e"); }
      });
      e.tx("etiqueta", "Nada mágico", 110, 140, INI("fr99"), "color:#8a93a6");
      if (e.tx("titular", "Un depredador", 110, 160, INI("fr100"), "font-size:12px;line-height:16px")) e.tx("titular", 'que <span class="clave">piensa</span>', 110, 178, P("fr100", "piensa"), "font-size:12px;line-height:16px");
      alien(e.frente, 320, SUELO - 126, { pose: t >= INI("fr100") ? "sisear" : "quieto", t, espejo: true, luz: ROJO_LUZ }, 2);
    }
  }

  // 10 · Alien: Isolation 2
  function b10(t) {
    escenario("colonia", e.capas, t, op);
    const a = LLEGA(8);
    e.tx("rotulo", 'El que <span class="clave">viene</span>', 16, 14, a);
    e.panel(110, 40, 356, 156, "#0b0e14");
    e.tx("titular", "Alien: Isolation 2", 124, 50, P("fr102", "Isolation"), "font-size:12px;line-height:16px;color:#ff8a3d");
    e.tx("etiqueta", "Anunciado en junio de 2026", 124, 70, P("fr102", "junio"), "color:#8a93a6");
    if (t < INI("fr106")) {
      e.tx("etiqueta", "Al Hope, director creativo:", 124, 92, P("fr103", "Hope"));
      [["Asesino: más listo", "listo"], ["Entorno: más duro", null], ["Sobrevivir: menos", null]].forEach(([s, w], k) => {
        const d = k === 0 ? P("fr103", "listo") : k === 1 ? P("fr104", "duro") : P("fr105", "sobrevivir");
        e.tx("etiqueta", s, 140, 110 + k * 16, d, `color:${["#f2c14e", "#f5f7fb", "#ff8a3d"][k]}`);
      });
    } else {
      e.tx("etiqueta", "Planeta con tormentas", 124, 92, P("fr106", "tormentas"));
      e.tx("titular", "Kurosaki Station", 124, 106, P("fr106", "Kurosaki"), "font-size:12px;line-height:16px");
      e.tx("etiqueta", "Weyland-Yutani", 124, 126, P("fr106", "Weyland"), "color:#8a93a6");
      [["PS5", "PlayStation"], ["Xbox Series", "Xbox"], ["Switch 2", "Switch"], ["PC", "PC"]].forEach(([s, w], k) => e.tx("insignia", s, 124 + [0, 52, 160, 248][k], 146, P("fr107", w)));
      e.tx("etiqueta", "Fecha: ???", 124, 172, INI("fr108"), "color:#ff8a3d");
    }
    e.fuente("Fuente: SEGA (2026-06-08)", 110, 204, P("fr102", "junio"));
  }

  // 11 · lo que dicen de su nuevo cerebro
  function b11(t) {
    escenario("colonia", e.capas, t, op);
    const a = LLEGA(9);
    e.tx("rotulo", 'Su nuevo <span class="clave">cerebro</span>', 16, 14, a);
    if (t < INI("fr115")) {
      if (t < CLIP_AUDIO[0]) {
        e.tx("etiqueta", "Dev Q&A · octubre 2026", 110, 40, INI("fr109"), "color:#8a93a6");
        if (t >= INI("fr111")) {
          e.panel(110, 60, 356, 124, "#0b0e14");
          rect(e.frente, 130, 130, 24, 24, "#3a4166"); e.tx("etiqueta", "Primero", 124, 160, INI("fr111"), "color:#8a93a6");
          if (t >= P("fr112", "diez")) { rect(e.frente, 200, 82, 96, 60, "#16301c"); marcoSeleccion(e.frente, 200, 82, 96, 60, "#1fd69a"); e.tx("titular", "×10", 220, 100, P("fr112", "diez"), "color:#1fd69a"); }
          e.tx("etiqueta", "Exteriores", 330, 76, INI("fr111"), "color:#1fd69a");
          e.tx("etiqueta", "(aprox.)", 330, 92, P("fr112", "calculan"), "color:#8a93a6");
        }
        e.fuente("Fuente: Creative Assembly, Dev Q&A (2026)", 110, 192, INI("fr109"));
      } else {
        e.panel(110, 44, 356, 130, "#0b0e14");
        e.tx("etiqueta", "Creative Assembly · en inglés", 122, 54, CLIP_AUDIO[0], "color:#ff8a3d");
        propOndaVoz(e.frente, 122, 70, 330, 22, t, { color: PROP.verde, activo: enClip(t), semilla: 12 });
        e.tx("etiqueta", "«So now it will be even", 122, 104, CLIP_AUDIO[0], "color:#8a93a6");
        e.tx("etiqueta", "more intelligent»", 122, 116, CLIP_AUDIO[0], "color:#8a93a6");
        e.tx("titular", 'Aún más <span class="clave">inteligente</span>', 122, 136, CLIP_AUDIO[0] + 0.8, "font-size:12px;line-height:16px");
        e.fuente("Audio: Creative Assembly, Dev Q&A (2026)", 112, 182, CLIP_AUDIO[0]);
      }
    } else if (t < INI("fr121")) {
      e.panel(110, 40, 230, 150, "#0b0e14");
      [["Comportamientos nuevos", "nuevos", "fr115"], ["Reaccionará a objetos", "objetos", "fr115"], ["Fuera, más agresivo", "agresividad", "fr117"],
        ["Clima: oculta movimientos", "clima", "fr118"], ["Cosas nuevas que aprender", "aprender", "fr119"], ["Cambia en cada encuentro", "encuentro", "fr120"]]
        .forEach(([s, w, fr], k) => { if (e.tx("etiqueta", s, 132, 50 + k * 22, P(fr, w), k === 5 ? "color:#ff8a3d" : "")) puntaFlecha(e.frente, 124, 53 + k * 22, "der", PROP.dorado, 3); });
      if (t >= INI("fr116")) alien(e.frente, 350, SUELO - 126, { pose: "agachado", t, luz: AZUL_LUZ }, 2);
      // Cortina de lluvia densa que tapa al alien cuando se oculta en el clima
      if (t >= P("fr118", "clima")) { const az = mulberry32(5); for (let k = 0; k < 140; k++) { const x = 340 + az() * 140, y0 = az() * 200, y = Math.floor((y0 + t * 260) % 200) + 30; rect(e.frente, Math.floor(x - (y * 0.35) % 20), y, 1, 3, "#5a6a8a"); } }
      e.fuente("Fuente: Creative Assembly, Dev Q&A (2026)", 110, 198, INI("fr115"));
    } else {
      e.panel(110, 40, 356, 150, "#0b0e14");
      if (t < INI("fr123")) {
        e.x2(124, 54, (g) => propTormenta(g, 0, 0, t));
        e.tx("etiqueta", "La tormenta afecta", 196, 60, INI("fr121"));
        e.tx("etiqueta", "a tus sentidos y a los suyos", 196, 74, P("fr121", "suyos"), "color:#f2c14e");
        e.tx("etiqueta", "Sus pasos: peor oídos", 196, 104, P("fr122", "pasos"), "color:#8a93a6");
      } else {
        e.x2(130, 100, (g) => propMicrofono(g, 0, 0, { activo: true }));
        e.tx("titular", "Micrófono", 124, 50, P("fr123", "microfono"), "font-size:12px;line-height:16px");
        e.tx("etiqueta", "Opcional · ahora también en PC", 124, 72, INI("fr124"), "color:#f2c14e");
        if (t >= P("fr125", "perro")) { e.x2(190, 110, (g) => propPerro(g, 0, 0, t, { ladra: true })); ondas(236, 126, t, 3, "#f2c14e"); }
        e.tx("etiqueta", "Ruido dentro del juego", 290, 120, P("fr125", "juego"), "color:#ff8a3d");
        e.tx("etiqueta", "Más fuerte: lo oye de más lejos", 124, 166, INI("fr126"));
      }
      e.fuente("Fuente: Creative Assembly, Dev Q&A (2026)", 110, 198, INI("fr121"));
    }
  }

  // 12 · especulación (marco fijo durante todo el bloque)
  function b12(t) {
    escenario("control", e.capas, t, op);
    const a = LLEGA(10);
    rect(e.frente, 100, 30, 370, 2, PROP.dorado); rect(e.frente, 100, 196, 370, 2, PROP.dorado); rect(e.frente, 100, 30, 2, 168, PROP.dorado); rect(e.frente, 468, 30, 2, 168, PROP.dorado);
    e.tx("insignia", "Especulación de MISTA", 104, 22, a, "background:#f2c14e");
    if (t < INI("fr130")) {
      e.tx("titular", "No lo ha dicho", 120, 70, INI("fr128"), "font-size:12px;line-height:16px");
      e.tx("titular", '<span class="clave">el estudio</span>', 120, 90, P("fr128", "estudio"), "font-size:12px;line-height:16px");
      e.tx("etiqueta", "Deduzco de lo dicho y del primero", 120, 124, INI("fr129"), "color:#f2c14e");
    } else if (t < INI("fr135")) {
      e.tx("titular", "1", 116, 44, INI("fr130"), "color:#f2c14e");
      nodo(e, 140, 50, 120, "Alien", { desde: INI("fr131"), color: "#ff8a3d" });
      for (let k = 0; k < 4; k++) nodo(e, 140 + (k % 2) * 160, 76 + Math.floor(k / 2) * 24, 150, ["Taquillas", "Conductos", "¿Nueva?", "¿Nueva?"][k], { desde: k < 2 ? P("fr131", "ramas") : P("fr132", "cerradas"), candado: k < 2 });
      e.tx("etiqueta", "Más ramas cerradas", 140, 130, P("fr132", "ramas"), "color:#f2c14e");
      e.tx("etiqueta", "Nadie habla de aprendizaje automático", 116, 160, INI("fr134"), "color:#8a93a6");
    } else if (t < INI("fr138")) {
      e.tx("titular", "2", 116, 44, INI("fr135"), "color:#f2c14e");
      e.tx("etiqueta", "Ya recordaba: lanzallamas", 140, 50, INI("fr136"), "color:#ff8a3d");
      if (e.papel(140, 70, 220, 90, P("fr137", "sospecho"))) {
        e.tx("tarjeta-texto", "¿Recordará?", 152, 80, P("fr137", "sospecho"), "color:#b4622a");
        [["· Tu truco", "truco"], ["· Tu aparato", "aparato"], ["· Tu ruta", "huiste"]].forEach(([s, w], k) => e.tx("tarjeta-texto", s, 152, 100 + k * 16, P("fr137", w)));
      }
    } else if (t < INI("fr143")) {
      e.tx("titular", "3", 116, 44, INI("fr138"), "color:#f2c14e");
      e.x2(150, 70, (g) => propRejilla(g, 0, 0, { tachada: t >= INI("fr140") }));
      e.tx("etiqueta", "Su escondite: conductos", 150, 100, INI("fr139"), "color:#8a93a6");
      e.tx("etiqueta", "Fuera no hay", 150, 116, INI("fr140"), "color:#ff8a3d");
      if (t >= INI("fr141")) { e.x2(370, 60, (g) => propTormenta(g, 0, 0, t)); e.tx("etiqueta", "Se oculta en el clima", 150, 128, INI("fr141"), "color:#8a93a6"); }
      e.tx("titular", '¿Su nuevo <span class="clave">conducto</span>?', 150, 150, P("fr142", "conducto"), "font-size:12px;line-height:16px");
    } else {
      e.tx("titular", "4", 116, 44, INI("fr143"), "color:#f2c14e");
      const m = mapaEstacion(e, 140, 52, 200, 110, t, { alien: [0.1, 0.15], flecha: t >= P("fr144", "pista"), grosor: t >= P("fr144", "gorda") ? 4 : 1 });
      e.tx("etiqueta", "Espacio ×10", 350, 60, INI("fr144"), "color:#1fd69a");
      e.tx("etiqueta", "¿Pista", 350, 80, P("fr144", "gorda"), "color:#f2c14e"); e.tx("etiqueta", "más gorda?", 350, 92, P("fr144", "gorda"), "color:#f2c14e");
      e.tx("etiqueta", "¿Más justo", 350, 120, P("fr145", "justo"));
      e.tx("etiqueta", "o más cruel?", 350, 134, P("fr145", "cruel"), "color:#ff8a3d");
      void m;
    }
  }

  // 13 · cierre
  function b13(t) {
    escenario("pasillo", e.capas, t, op);
    const a = LLEGA(11);
    if (t < INI("fr151")) {
      e.tx("titular", '¿Más <span class="clave">listo</span>?', 110, 30, a);
      e.panel(110, 60, 356, 120, "#0b0e14");
      e.tx("etiqueta", "El primero:", 122, 70, INI("fr147"), "color:#8a93a6");
      e.tx("etiqueta", "Un cerebro sabe, otro busca", 122, 84, P("fr147", "cerebro"), "color:#1fd69a");
      e.tx("etiqueta", "El segundo, prometido:", 122, 110, INI("fr148"), "color:#8a93a6");
      e.tx("etiqueta", "Aprende, se adapta, caza fuera", 122, 124, P("fr148", "adapta"), "color:#ff8a3d");
      e.tx("etiqueta", "Hasta que salga: sus palabras", 122, 152, INI("fr149"), "color:#f2c14e");
    } else {
      e.tx("titular", "El juego siempre", 110, 50, INI("fr151"));
      e.tx("titular", 'sabe dónde <span class="clave">estás</span>', 110, 76, P("fr151", "estas"));
      if (t >= INI("fr152")) { e.x2(240, SUELO - 40, (g) => propMicrofono(g, 0, 0, { activo: true })); ondas(264, SUELO - 26, t, 3, "#f2c14e"); }
      e.tx("etiqueta", "Y a lo mejor, también te oye", 110, 110, P("fr152", "oye"), "color:#ff8a3d");
      alien(e.frente, 320, SUELO - 126, { pose: t >= P("fr152", "oye") ? "sisear" : "quieto", t, luz: ROJO_LUZ }, 2);
    }
  }

  // Medidor de la voz de MISTA bajo los paneles (movimiento continuo, como en phonic-1-voz). Calla en el clip.
  const PALABRAS = window.TIMING.frases.flatMap((f) => f.palabras);
  const medidor = (pintar) => (t) => {
    pintar(t);
    if (enClip(t)) return;
    const habla = PALABRAS.some((p) => t >= p.i - 0.05 && t <= p.f + 0.05);
    rect(e.frente, 98, 240, 370, 14, PROP.contorno);
    propOndaVoz(e.frente, 102, 242, 362, 10, t, { color: PROP.naranja, activo: habla, semilla: 21, paso: 4 });
  };
  const G = (pose, x = 14, espejo = false) => ({ x, espejo, pose });
  const escondido = (t) => t >= INI("fr04") && t < P("fr07", "abrio");
  const bloques = [
    { pintar: b01, gato: (t) => (escondido(t) ? G("asustado", -80) : G(t >= P("fr07", "abrio") && t < INI("fr09") ? "asustado" : t >= INI("fr09") ? "senalar" : t >= INI("fr02") ? "sorpresa" : "pie")) },
    { pintar: b02, gato: (t) => G(t >= INI("fr17") && t < INI("fr19") ? "pensar" : t >= INI("fr14") && t < INI("fr16") ? "sorpresa" : "senalar") },
    { pintar: b03, gato: (t) => G(t >= INI("fr32") && t < INI("fr34") ? "pensar" : t >= INI("fr34") ? "senalar" : "tocar") },
    { pintar: b04, gato: (t) => G(t >= INI("fr43") ? "pensar" : t >= INI("fr41") && t < INI("fr42") ? "asustado" : "senalar") },
    { pintar: b05, gato: (t) => G(t >= INI("fr55") ? "asustado" : t >= INI("fr53") ? "sorpresa" : "senalar") },
    { pintar: b06, gato: (t) => G(t >= INI("fr60") ? "asustado" : "pensar") },
    { pintar: b07, gato: (t) => G(t >= INI("fr73") ? "pensar" : t >= P("fr67", "vete") && t < INI("fr68") ? "celebrar" : "senalar") },
    { pintar: b08, gato: (t) => G(t >= INI("fr91") ? "asustado" : t >= INI("fr88") && t < INI("fr89") ? "pensar" : t >= INI("fr81") && t < INI("fr83") ? "sorpresa" : "senalar") },
    { pintar: b09, gato: (t) => G(t >= INI("fr100") ? "asustado" : t >= P("fr94", "falso") && t < INI("fr95") ? "celebrar" : "senalar") },
    { pintar: b10, gato: (t) => G(t >= INI("fr108") ? "pensar" : "senalar") },
    { pintar: b11, gato: (t) => G(t >= P("fr125", "perro") ? "asustado" : t >= CLIP_AUDIO[0] && t < INI("fr115") ? "sorpresa" : "senalar") },
    { pintar: b12, gato: (t) => G(t >= INI("fr138") && t < INI("fr143") ? "asustado" : "pensar") },
    { pintar: b13, gato: (t) => G(t >= INI("fr152") ? "asustado" : t >= INI("fr151") ? "senalar" : "pensar") },
  ];
  e = escenaBase({
    W, H, bloques: bloques.map((b) => ({ ...b, pintar: medidor(b.pintar), gato: (t) => (enClip(t) ? { ...b.gato(t), pose: "sorpresa" } : b.gato(t)) })),
    cortes: CORTES, y0Gato: Y_GATO, enClip, alPintar: () => { const p = promesa; promesa = null; return p; },
  });

  // ---------- sonido: atado a lo que pasa en pantalla, nunca al texto hablado ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - 0.2, "destello"));
    add(INI("fr02"), "error"); add(P("fr07", "abrio"), "error"); add(P("fr10", "dos"), "aparicion");
    add(P("fr12", "matar"), "error"); add(INI("fr14"), "seleccion"); add(P("fr17", "injusto"), "error");
    add(P("fr30", "empuja"), "aparicion"); add(P("fr29", "tres"), "error"); add(P("fr35", "otro"), "seleccion");
    add(INI("fr39"), "aparicion"); add(P("fr41", "metro"), "tick"); add(INI("fr44"), "acierto");
    add(INI("fr50"), "tick"); add(P("fr55", "pilla"), "error");
    add(P("fr58", "acecho"), "aparicion"); add(P("fr60", "deja"), "error");
    add(P("fr67", "vete"), "tick"); add(INI("fr68"), "aparicion");
    add(P("fr80", "veces"), "acierto"); add(P("fr83", "muertes"), "error"); add(INI("fr84"), "acierto"); add(P("fr88", "medias"), "seleccion");
    add(P("fr94", "falso"), "error"); add(P("fr95", "veces"), "tick"); add(INI("fr100"), "aparicion");
    add(P("fr102", "Isolation"), "aparicion"); add(INI("fr108"), "error");
    add(P("fr112", "diez"), "aparicion"); add(P("fr120", "encuentro"), "seleccion"); add(P("fr125", "perro"), "aparicion");
    add(INI("fr127"), "seleccion"); add(P("fr140", "conductos"), "error"); add(P("fr145", "cruel"), "error");
    add(P("fr152", "oye"), "error");
    return ev;
  };
  window.seek(0);
})();
