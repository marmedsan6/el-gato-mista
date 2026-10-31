// phonic-1-voz · largo. Estilo v2 vigente: MISTA en escena, escenarios vivos, desplazamiento lateral y efectos atados a
// la pantalla. Sin subtítulos en pantalla (SRT aparte). Algo nuevo cada 3-8 s. Composición propia, no un recorte del short.
(() => {
  const W = 480, H = 270, SUELO = 232, Y_GATO = SUELO - 64;
  const { P, INI, FIN, medio } = tiemposDe(window.TIMING);
  const LIMITES = [["fr10", "fr11"], ["fr17", "fr18"], ["fr23", "fr24"], ["fr31", "fr32"], ["fr39", "fr40"], ["fr53", "fr54"],
    ["fr68", "fr69"], ["fr94", "fr95"], ["fr103", "fr104"], ["fr110", "fr111"], ["fr129", "fr130"]];
  const CORTES = LIMITES.map(([a, b]) => medio(a, b));
  const op = { W, H, suelo: SUELO, estante: false };
  const LLEGA = (k) => CORTES[k] + 0.2; // cuando termina el desplazamiento que abre el bloque k + 1
  const CLIPS = [[FIN("fr42"), INI("fr43")], [FIN("fr47"), INI("fr48")], [FIN("fr78"), INI("fr79")]];
  const enClip = (t) => CLIPS.some(([a, b]) => t > a + 0.05 && t < b - 0.05);
  let e;

  // Panel del clip: teléfono, onda de Mariana, traducción y crédito. MISTA calla mientras suena.
  function panelClip(t, [a, b], lineas, idioma) {
    if (t < a || t >= b) return false;
    e.panel(100, 44, 366, 124, "#0e1524");
    e.x2(114, 58, (g) => propTelefono(g, 0, 0, t, { activo: true }));
    e.tx("etiqueta", `Mariana · Phonic-1 · en ${idioma}`, 182, 56, a, "color:#ff8a3d");
    propOndaVoz(e.frente, 182, 70, 270, 22, t, { color: PROP.verde, semilla: 12 });
    lineas.forEach((l, k) => e.tx("etiqueta", l, 114, 104 + k * 14, a, "color:#f5f7fb"));
    e.fuente("Audio: Phonic · traducción propia", 112, 150, a);
    return true;
  }

  function b01(t) {
    escenario("despacho", e.capas, t, op);
    if (t < INI("fr07")) {
      e.tx("rotulo", '<span class="clave">Cancela</span> la cita', 16, 14, 0);
      const no = P("fr01", "no"), mar = P("fr01", "martes"), lun = P("fr01", "lunes");
      calendarioDia(e, 100, 50, 84, 92, "Lun", 0, { apagado: t >= no });
      calendarioDia(e, 194, 50, 84, 92, "Mar", no);
      if (t >= lun && t < no) marcoSeleccion(e.frente, 96, 45, 92, 102, "#ff8a3d");
      if (t >= mar) marcoSeleccion(e.frente, 190, 45, 92, 102, "#ff8a3d");
      if (t >= INI("fr03")) {
        e.panel(294, 44, 172, 124);
        e.tx("etiqueta", "Persona", 304, 54, INI("fr03")); e.tx("etiqueta", "Espera", 392, 54, P("fr03", "esperaria"), "color:#1fd69a");
        e.tx("etiqueta", "Mayoría IA", 304, 72, INI("fr04")); e.tx("etiqueta", "Espera", 392, 72, P("fr04", "tambien"), "color:#1fd69a");
        e.tx("etiqueta", "Phonic-1", 304, 90, INI("fr05"), "color:#ff8a3d"); e.tx("etiqueta", "Dice: no", 392, 90, P("fr05", "no"), "color:#ff8a3d");
        e.tx("etiqueta", "Actúa mientras", 304, 112, P("fr06", "cosas"), "color:#f2c14e");
        e.tx("etiqueta", "hablas", 304, 124, P("fr06", "hablando"), "color:#f2c14e");
        e.fuente("«Único», dice Phonic", 300, 146, P("fr06", "unico"));
      }
    } else {
      e.tx("rotulo", "Una duda muy simple", 16, 14, INI("fr07"));
      e.tx("titular", "¿Y si", 104, 48, P("fr07", "actua"));
      e.tx("titular", 'cambias de <span class="clave">idea?</span>', 104, 74, P("fr07", "cambias"));
      if (e.papel(150, 108, 228, 58, INI("fr09"))) {
        e.tx("tarjeta-texto", "Una reserva", 164, 118, INI("fr09"), "color:#b4622a");
        e.tx("titular", "RT-????", 164, 134, P("fr09", "reserva"), "color:#2b1a10; text-shadow:none");
        marcoSeleccion(e.frente, 146, 104, 236, 66, "#ff8a3d");
      }
    }
  }

  function b02(t) {
    escenario("centralita", e.capas, t, op);
    const a = LLEGA(0), c = P("fr15", "contesta"), hab = INI("fr12");
    e.tx("rotulo", "Ya conoces el <span class='clave'>baile</span>", 16, 14, a);
    e.panel(100, 44, 366, 124);
    e.x2(116, 72, (g) => propTelefono(g, 0, 0, t, { activo: t >= hab && t < INI("fr13") }));
    e.tx("etiqueta", "Tú", 184, 58, a, "color:#ff8a3d");
    const tuHabla = (t >= hab && t < INI("fr13")) || t >= P("fr15", "vuelto");
    propOndaVoz(e.frente, 216, 50, 236, 24, t, { color: PROP.naranja, activo: tuHabla, semilla: 3 });
    e.tx("etiqueta", "IA", 184, 102, a, "color:#5b8cff");
    propOndaVoz(e.frente, 216, 94, 236, 24, t, { color: PROP.azul, activo: t >= c && t < INI("fr16"), semilla: 5 });
    if (t >= INI("fr13") && t < c) {
      const n = 1 + Math.floor((t - INI("fr13")) / 0.5);
      e.tx("titular", ".".repeat(Math.min(6, n)), 280, 130, INI("fr13"), "color:#8a93a6");
    }
    if (t >= P("fr15", "vuelto") && t < INI("fr16")) e.tx("insignia", "Choque", 312, 130, P("fr15", "vuelto"), "background:#e0454f;color:#f5f7fb");
    e.tx("etiqueta", "No es mala educación", 184, 130, INI("fr16"), "color:#8a93a6");
    e.tx("etiqueta", "Es cómo están construidos", 184, 146, INI("fr17"), "color:#f2c14e");
  }

  // Las tres máquinas en fila y los paquetes que corren entre ellas
  function cascada(t, encendidas, fraseActiva = true) {
    const xs = [116, 226, 336], y = 66;
    rect(e.frente, 100, y + 38, 366, 3, "#2a3a6a");
    xs.forEach((x, k) => e.x2(x, y, (g) => propMaquina(g, 0, 0, t, { activo: encendidas[k], color: [PROP.naranja, PROP.azul, PROP.verde][k] })));
    if (fraseActiva) for (let k = 0; k < 4; k++) {
      const px = 100 + Math.floor((t * 60 + k * 92) % 366);
      if (encendidas[Math.min(2, Math.floor((px - 100) / 122))]) { rect(e.frente, px, y + 37, 5, 5, PROP.dorado); rect(e.capas.brillo, px - 2, y + 35, 9, 9, PROP.dorado); }
    }
  }

  function b03(t) {
    escenario("servidores", e.capas, t, op);
    const a = LLEGA(1);
    e.tx("rotulo", "Tres máquinas en <span class='clave'>fila</span>", 16, 14, a);
    const u = INI("fr19"), d = INI("fr20"), r = INI("fr21");
    if (t < INI("fr23")) {
      cascada(t, [t >= u, t >= d, t >= r]);
      e.tx("etiqueta", "Voz a texto", 112, 152, u, "color:#ff8a3d");
      e.tx("etiqueta", "Decide", 240, 152, d, "color:#5b8cff");
      e.tx("etiqueta", "Texto a voz", 334, 152, r, "color:#1fd69a");
      e.tx("insignia", "Cascada", 244, 42, INI("fr22"));
    } else {
      e.tx("insignia", "Cascada", 244, 42, a);
      e.panel(100, 60, 366, 96);
      const c = INI("fr23"), f = FIN("fr23");
      const msgs = ["Cancela el martes", "Cancela el mar...", "Canela al marte"];
      const k = Math.min(2, Math.floor(e.prog(t, c, f) * 3));
      for (let j = 0; j <= k; j++) {
        e.tx("etiqueta", msgs[j], 150, 72 + j * 26, c + (j * (f - c)) / 3, j === 2 ? "color:#ff8a3d" : "");
        if (j < 2) puntaFlecha(e.frente, 122, 76 + j * 26, "der", PROP.gris, 4);
      }
      e.tx("etiqueta", "Ejemplo inventado", 300, 138, c, "color:#8a93a6");
    }
  }

  function b04(t) {
    escenario("servidores", e.capas, t, op);
    const a = LLEGA(2);
    e.tx("rotulo", "Tres <span class='clave'>pegas</span>", 16, 14, a);
    const u = INI("fr25"), d = INI("fr27"), r = INI("fr28");
    if (t >= u) e.panel(100, 40, 366, t < d ? 36 : t < r ? 62 : t < INI("fr29") ? 88 : 140);
    if (e.tx("etiqueta", "1 · Sin tono", 112, 50, u, "color:#ff8a3d")) {
      propOndaVoz(e.frente, 226, 44, 110, 18, t, { color: PROP.naranja, semilla: 4 });
      puntaFlecha(e.frente, 346, 53, "der", PROP.gris, 4);
      const plano = t >= INI("fr26");
      e.tx("etiqueta", plano ? "Texto" : "Pausa · duda", 354, 50, u, plano ? "color:#8a93a6" : "color:#c9d2ff");
    }
    if (e.tx("etiqueta", "2 · Espera", 112, 78, d, "color:#ff8a3d")) {
      [0, 1, 2].forEach((k) => { const on = t >= d + k * 0.5; rect(e.frente, 226 + k * 40, 76, 32, 12, PROP.contorno); rect(e.frente, 227 + k * 40, 77, on ? 30 : 0, 10, PROP.dorado); });
      e.tx("etiqueta", "Más tarde", 354, 78, d + 1.5, "color:#c9d2ff");
    }
    if (e.tx("etiqueta", "3 · Herramientas", 112, 106, r, "color:#ff8a3d")) {
      propCandado(e.frente, 256, 100, { abierto: false });
      e.tx("etiqueta", "Hasta que termines", 276, 106, P("fr28", "termines"), "color:#c9d2ff");
    }
    if (t >= INI("fr29") && t < INI("fr31")) {
      e.tx("etiqueta", "Mesa · vuelo · dato", 112, 126, INI("fr29"), "color:#8a93a6");
      e.tx("etiqueta", "«Déjame que lo compruebe»...", 112, 146, INI("fr30"), "color:#f5f7fb");
    }
    if (t >= INI("fr31")) {
      e.tx("etiqueta", "Ventaja de la cascada:", 112, 126, INI("fr31"), "color:#1fd69a");
      e.tx("etiqueta", "puedes revisar el texto", 112, 142, P("fr31", "revisarlo"), "color:#f5f7fb");
      e.papel(330, 118, 74, 46, INI("fr31"));
      for (let k = 0; k < 4; k++) rect(e.frente, 336, 124 + k * 8, 40 + (k % 2) * 16, 2, PROP.gris);
      e.x2(350, 122, (g) => propLupa(g, 0, 0, { activo: true }));
      e.fuente("Fuentes: Soniox · OpenAI", 108, 164, P("fr31", "ventaja"));
    }
  }

  function b05(t) {
    escenario("laboratorio", e.capas, t, op);
    const a = LLEGA(3), r = INI("fr33"), c = INI("fr36");
    e.tx("rotulo", '<span class="clave">Phonic-1</span>', 16, 14, a);
    e.panel(100, 40, 366, t < P("fr32", "diez") ? 30 : t >= c && t < INI("fr37") ? 30 : 128);
    if (t < r) {
      e.tx("etiqueta", "29 de octubre", 114, 50, a, "color:#f2c14e");
      const p = P("fr32", "diez");
      for (let k = 0; k < 10; k++) if (t >= p + k * 0.06) e.x2(114 + k * 20, 62, (g) => propPersona(g, 0, 0, k % 2 ? PROP.azul : PROP.verde));
      e.tx("etiqueta", "10 personas", 114, 90, p, "color:#c9d2ff");
      const d = P("fr32", "27");
      const v = Math.min(27.5, e.paso(e.prog(t, d, d + 0.9) * 27.5, 2.5) + (t >= d + 0.9 ? 27.5 : 0));
      e.tx("dato", `${v.toFixed(1).replace(".", ",")} M$`, 114, 110, d, "color:#1fd69a");
      e.tx("etiqueta", "Ronda Serie A", 262, 118, d, "color:#c9d2ff");
      e.fuente("Fuente: Moin Nadeem (Phonic)", 108, 150, P("fr32", "presento"));
    } else if (t < c) {
      e.tx("etiqueta", "Sin transcripción", 114, 50, r, "color:#ff8a3d");
      propOndaVoz(e.frente, 114, 74, 190, 28, t, { color: PROP.naranja, activo: t >= INI("fr34"), semilla: 6 });
      if (t >= INI("fr34")) { puntaFlecha(e.frente, 316, 88, "der", PROP.dorado, 5); e.x2(326, 68, (g) => propMaquina(g, 0, 0, t, { activo: true, color: PROP.verde })); }
      e.tx("etiqueta", "Tu voz, directa", 114, 112, INI("fr34"), "color:#f5f7fb");
      if (e.tx("etiqueta", "Y actúa mientras oye", 114, 134, INI("fr35"), "color:#f2c14e")) {
        for (let k = 0; k < 5; k++) if (Math.floor(t * 3 + k) % 5 !== 0) check(e.frente, 300 + k * 12, 133, PROP.verde);
      }
    } else {
      e.tx("etiqueta", "Misma petición · 5 herramientas", 114, 50, c, "color:#c9d2ff");
      const p1 = INI("fr37"), p2 = INI("fr38");
      if (e.tx("etiqueta", "Phonic-1", 114, 74, p1, "color:#ff8a3d")) {
        e.barra(204, 72, 240, 12, e.prog(t, p1, p1 + 0.4) * (1.1 / 15.7), PROP.verde);
        e.tx("etiqueta", "1,1 s", 230, 88, P("fr37", "1,1"), "color:#1fd69a");
      }
      if (e.tx("etiqueta", "GPT-Live", 114, 112, p2, "color:#5b8cff")) {
        e.barra(204, 110, 240, 12, e.prog(t, p2, p2 + 1), PROP.rojo);
        e.tx("etiqueta", "15,7 s", 386, 126, P("fr38", "15,7"), "color:#ff8a3d");
      }
      if (e.tx("etiqueta", "Demo elegida por Phonic", 114, 148, INI("fr39"), "color:#f2c14e")) e.x2(320, 138, (g) => propLapiz(g, 0, 0));
    }
  }

  function b06(t) {
    escenario("hotel", e.capas, t, op);
    const a = LLEGA(4);
    e.tx("rotulo", "La llamada", 16, 14, a);
    if (panelClip(t, CLIPS[0], ["Buenas tardes, aquí el Mirante Aurora.", "Soy Mariana. ¿Cómo puedo ayudar?"], "portugués")) return;
    if (panelClip(t, CLIPS[1], ["Claro. La mesa grande para vosotras,", "y el resto en la barra. ¿Puede ser?"], "portugués")) return;
    const imp = INI("fr43");
    e.panel(100, 40, 366, t < INI("fr41") ? 40 : 128);
    if (t < imp) {
      const d = P("fr40", "44");
      const v = e.prog(t, d, d + 1.2);
      e.tx("dato", `${String(Math.floor(v * 44)).padStart(2, "0")}:${String(Math.floor(v * 18)).padStart(2, "0")}`, 114, 50, a, "color:#f5f7fb");
      e.tx("etiqueta", "de llamada", 208, 60, a, "color:#c9d2ff");
      if (e.papel(112, 84, 164, 62, INI("fr41"))) {
        e.tx("tarjeta-texto", "Sofia", 120, 90, INI("fr41"), "color:#b4622a");
        e.tx("tarjeta-texto", "Despedida", 120, 104, P("fr41", "despedida"));
        e.tx("tarjeta-texto", "11 personas", 120, 116, P("fr41", "once"));
        e.tx("tarjeta-texto", "Río", 120, 128, P("fr41", "rio"));
      }
      if (e.papel(290, 84, 164, 62, INI("fr42"))) {
        e.tx("tarjeta-texto", "Mariana", 298, 90, INI("fr42"), "color:#b4622a");
        e.tx("tarjeta-texto", "Conserje", 298, 104, P("fr42", "conserje"));
        e.tx("tarjeta-texto", "= Phonic-1", 298, 116, P("fr42", "Phonic"), "color:#b4622a");
      }
      e.fuente("Fuente: Phonic", 108, 150, a);
    } else if (t < INI("fr49")) {
      e.tx("titular", '<span class="clave">Impresiona</span>', 112, 46, imp);
      if (e.tx("etiqueta", "Alergia: min 6", 112, 78, INI("fr44"), "color:#c9d2ff")) {
        e.barra(250, 76, 200, 12, e.prog(t, P("fr45", "25"), P("fr45", "25") + 0.8) * 0.65 + 0.14, PROP.verde);
        e.tx("etiqueta", "+25 min, sigue", 250, 90, P("fr45", "25"), "color:#1fd69a");
      }
      if (e.tx("etiqueta", "Busca un vuelo:", 112, 110, INI("fr46"), "color:#c9d2ff")) e.tx("etiqueta", "se calla", 250, 110, P("fr46", "calla"), "color:#1fd69a");
      if (e.tx("etiqueta", "Pide portugués:", 112, 126, INI("fr47"), "color:#c9d2ff")) e.tx("etiqueta", "cambia", 250, 126, P("fr47", "cambia"), "color:#1fd69a");
      if (e.tx("etiqueta", "Respuesta típica:", 112, 148, INI("fr48"), "color:#c9d2ff")) e.tx("etiqueta", "0,58 s", 262, 148, P("fr48", "0,58"), "color:#f2c14e");
    } else {
      e.tx("etiqueta", "Mientras sigue charlando", 112, 48, INI("fr49"), "color:#ff8a3d");
      propOndaVoz(e.frente, 112, 60, 340, 16, t, { color: PROP.naranja, semilla: 9 });
      [["Tia Rosa", 38], ["Casa Ondina", 52], ["Botequim Sabiá", 64]].forEach(([n, s], k) => {
        const ini = P("fr49", "llamar");
        if (e.tx("etiqueta", n, 112, 86 + k * 18, ini + k * 0.3)) {
          const v = e.prog(t, ini, INI("fr51")) * (64 / s);
          e.barra(248, 84 + k * 18, 160, 12, Math.min(1, v), v >= 1 ? PROP.verde : PROP.azul);
          e.tx("etiqueta", `${s} s`, 416, 86 + k * 18, P("fr50", "38"), "color:#f2c14e");
        }
      });
      e.tx("etiqueta", "«Déjame que lo compruebe»: 0", 112, 148, INI("fr52"), "color:#1fd69a");
    }
  }

  function b07(t) {
    escenario("despacho", e.capas, t, op);
    const a = LLEGA(5);
    e.tx("rotulo", "La letra <span class='clave'>pequeña</span>", 16, 14, a);
    const f = INI("fr60"), sim = INI("fr63"), ojo = INI("fr64"), once = INI("fr67");
    pantallaRegistro(e, 98, 38, 370, 136, t, t < INI("fr56") ? 12 : 0);
    if (t < INI("fr56")) { e.tx("etiqueta", "Registro de la llamada", 116, 148, a, "color:#f2c14e"); return; }
    const X = 116;
    if (t < f) {
      e.tx("dato", "123", X, 48, P("fr56", "123"), "color:#f5f7fb");
      e.tx("etiqueta", "herramientas, según Phonic", X + 62, 58, P("fr56", "herramientas"), "color:#c9d2ff");
      if (e.tx("etiqueta", "Contadas: 123", X, 82, INI("fr57"), "color:#1fd69a")) check(e.frente, X + 112, 81, PROP.verde);
      e.tx("etiqueta", "8 · decidir no hablar", X, 104, P("fr58", "ocho"), "color:#f2c14e");
      e.tx("etiqueta", "1 · colgar", X, 118, P("fr58", "colgar"), "color:#f2c14e");
      e.tx("dato", "114", X + 230, 104, P("fr59", "114"), "color:#ff8a3d");
    } else if (t < sim) {
      e.tx("dato", "114", X, 48, f, "color:#ff8a3d");
      e.tx("etiqueta", "Van a la misma dirección:", X + 62, 58, f, "color:#c9d2ff");
      e.tx("titular p8", "api.example.com", X, 86, P("fr60", "api.example.com"), "color:#f5f7fb; font-size:16px; line-height:18px; text-transform:none");
      e.tx("etiqueta", "Reservado para ejemplos", X, 106, P("fr60", "reservado"), "color:#f2c14e");
      e.tx("etiqueta", "Teléfonos: 555-01", X, 128, INI("fr61"), "color:#f5f7fb");
      e.tx("etiqueta", "Para ficción", X + 160, 128, P("fr61", "ficcion"), "color:#f2c14e");
      e.fuente("Fuentes: IANA · NANPA", X - 8, 180, P("fr60", "reservado"));
    } else if (t < ojo) {
      e.tx("titular", "Simulador", X + 44, 62, P("fr63", "simulador"), "color:#f2c14e");
      e.tx("etiqueta", "Todo apunta a eso", X + 44, 92, P("fr63", "apunta"), "color:#c9d2ff");
      e.tx("etiqueta", "Nadie ha reservado nada", X + 44, 114, P("fr63", "reservado"));
    } else if (t < once) {
      e.tx("etiqueta", "No es trampa: una demo es así", X, 54, ojo, "color:#1fd69a");
      e.tx("etiqueta", "Herramientas: ~0,1 s", X, 84, INI("fr65"), "color:#c9d2ff");
      e.tx("etiqueta", "Bien: 114 de 114", X, 102, P("fr65", "114"), "color:#c9d2ff");
      e.tx("etiqueta", "Un sistema real: ¿?", X, 130, INI("fr66"), "color:#f2c14e");
    } else {
      e.tx("etiqueta", "¿Mientras ella hablaba?", X, 54, once, "color:#f2c14e");
      const b = INI("fr68");
      e.barra(X, 78, 320, 16, e.prog(t, b, b + 1) * (11 / 114), PROP.naranja);
      e.tx("dato", "≈ 11 / 114", X, 104, P("fr68", "once"), "color:#ff8a3d");
      e.tx("etiqueta", "Por lo que muestra el registro", X, 140, b, "color:#8a93a6");
    }
  }

  function b08(t) {
    escenario("hotel", e.capas, t, op);
    const a = LLEGA(6), X = 116;
    e.tx("rotulo", "La <span class='clave'>reserva</span>", 16, 14, a);
    if (panelClip(t, CLIPS[2], ["Ah, Tia Rosa no tiene las 8:30,", "lo siento."], "inglés")) return;
    const so = INI("fr71"), reg = INI("fr72"), once = INI("fr78"), cod = INI("fr79"), just = INI("fr84"), mesa = INI("fr90"), nota = INI("fr92");
    if (t < once) {
      pantallaRegistro(e, 98, 38, 370, 136, t, 0);
      if (t < INI("fr70")) e.tx("titular", "Ahora, la reserva", X, 90, a, "color:#ff8a3d");
      e.tx("etiqueta", "Registro · fila 16:04", X, 48, INI("fr70"), "color:#f2c14e");
      if (t < reg) {
        e.tx("etiqueta", "Sofia propone:", X, 72, so, "color:#c9d2ff");
        e.tx("titular", "Tia Rosa", X, 90, P("fr71", "Tia"), "color:#f5f7fb");
        e.tx("etiqueta", "7 personas · 20:30", X, 122, P("fr71", "siete"), "color:#c9d2ff");
      } else {
        e.tx("etiqueta", "Turno de Sofia:", X, 66, reg, "color:#c9d2ff");
        e.tx("etiqueta", "book_table", X + 136, 66, P("fr72", "reservar"), "color:#f5f7fb; text-transform:none");
        e.tx("etiqueta", "Tia Rosa", X, 84, INI("fr73")); e.tx("etiqueta", "7 personas", X + 100, 84, INI("fr74")); e.tx("etiqueta", "20:30", X + 212, 84, INI("fr75"));
        e.tx("etiqueta", "Respuesta del registro:", X, 100, INI("fr76"), "color:#c9d2ff");
        e.tx("titular", "Confirmada", X, 112, P("fr76", "confirmada"), "color:#1fd69a");
        if (e.tx("dato", "RT-4842", X, 136, INI("fr77"), "color:#f5f7fb")) marcoSeleccion(e.frente, X - 4, 134, 116, 32, "#ff8a3d");
      }
    } else if (t < cod) {
      pantallaRegistro(e, 98, 38, 370, 136, t, 0);
      e.tx("dato", "+11 s", X, 56, once, "color:#f2c14e");
      e.tx("titular", "No hay sitio", X, 100, P("fr78", "sitio"), "color:#ff8a3d");
    } else if (t < just) {
      e.panel(100, 40, 366, 128);
      e.tx("etiqueta", "RT-4842", X, 50, cod, "color:#f5f7fb");
      if (e.tx("etiqueta", "Sofia no oye el código", X + 80, 50, P("fr79", "oye"), "color:#f2c14e")) aspa(e.frente, X + 266, 49, PROP.rojo);
      e.tx("etiqueta", "Restaurante descartado: alergia", X, 72, INI("fr80"), "color:#c9d2ff");
      e.tx("etiqueta", "En el registro público:", X, 98, INI("fr81"), "color:#f2c14e");
      e.tx("etiqueta", "Otra mención del código:", X, 116, INI("fr82")); e.tx("dato", "0", X + 220, 108, P("fr82", "mencionar"), "color:#f5f7fb");
      e.tx("etiqueta", "Cancelaciones de RT-4842:", X, 142, INI("fr83")); e.tx("dato", "0", X + 220, 134, P("fr83", "cancelacion"), "color:#ff8a3d");
    } else if (t < mesa) {
      e.panel(100, 40, 366, t < INI("fr85") ? 40 : 128);
      if (t < INI("fr87")) {
        e.tx("titular", "Seamos justos", X, 50, just, "color:#f2c14e");
        e.tx("etiqueta", "Parece un simulador, y dice:", X, 76, INI("fr85"), "color:#c9d2ff");
        e.tx("etiqueta", "Confirmada", X, 90, P("fr85", "confirmada"), "color:#1fd69a");
        e.tx("etiqueta", "y no hay sitio", X + 96, 90, P("fr85", "sitio"), "color:#ff8a3d");
        e.tx("etiqueta", "¿Se corrige fuera del registro?", X, 118, INI("fr86"), "color:#f5f7fb");
        e.tx("etiqueta", "No lo sé", X, 134, P("fr86", "registro"), "color:#f2c14e");
      } else {
        e.tx("etiqueta", "Documentación de Phonic", X, 50, INI("fr87"), "color:#c9d2ff");
        e.tx("etiqueta", "Ejecuta lo antes posible", X, 76, P("fr87", "antes"));
        e.tx("etiqueta", "Si hablas, algunas se interrumpen", X, 96, P("fr88", "interrumpen"));
        e.tx("etiqueta", "¿Y si te corriges? No lo explica", X, 116, P("fr89", "corriges"), "color:#f2c14e");
        e.fuente("Fuente: docs.phonic.ai", 108, 150, INI("fr87"));
      }
    } else if (t < nota) {
      e.panel(100, 40, 366, 128, "#241a16");
      e.tx("etiqueta", "En un restaurante real", 112, 48, INI("fr91"), "color:#c9d2ff");
      e.x2(100, 60, (g) => propMesaSillas(g, 0, 0, { sillas: 7 }));
      e.tx("titular", "7 sillas", 306, 66, P("fr91", "siete"), "color:#ff8a3d");
      e.tx("etiqueta", "que nadie", 306, 96, P("fr91", "nadie"));
      e.tx("etiqueta", "ocuparía", 306, 110, P("fr91", "ocupar"));
      e.tx("etiqueta", "La pregunta del principio", 112, 148, mesa, "color:#f2c14e");
    } else if (e.papel(160, 52, 240, 100, nota)) {
      e.tx("tarjeta-texto", "Nota de Mariana", 176, 62, nota, "color:#b4622a");
      e.tx("titular", "Tara", 176, 84, P("fr93", "Tara"), "color:#2b1a10; text-shadow:none");
      if (t >= P("fr94", "Sarah")) rect(e.frente, 174, 94, 68, 3, PROP.rojo);
      e.tx("titular", "Sarah", 258, 84, P("fr94", "Sarah"), "color:#1f8a5a; text-shadow:none");
      e.tx("tarjeta-texto", "Pequeño, pero nadie avisa", 176, 122, P("fr93", "invitada"));
    }
  }

  function b09(t) {
    escenario("despacho", e.capas, t, op);
    const a = LLEGA(7), X = 120;
    e.tx("rotulo", "¿Tiene <span class='clave'>arreglo</span>?", 16, 14, a);
    if (t >= INI("fr96")) e.panel(100, 40, 366, t < INI("fr97") ? 76 : 128);
    if (t < INI("fr97")) { e.tx("titular", "Probablemente", X, 62, P("fr96", "probablemente"), "color:#1fd69a"); e.tx("etiqueta", "Sin magia", X, 96, P("fr96", "magia"), "color:#c9d2ff"); return; }
    e.tx("etiqueta", "Mientras escuchas", X, 50, P("fr97", "mientras"), "color:#f2c14e");
    if (e.tx("etiqueta", "Busca y consulta", X + 16, 66, P("fr97", "busca"))) check(e.frente, X, 65, PROP.verde);
    e.tx("etiqueta", "Antes de actuar", X, 88, INI("fr98"), "color:#f2c14e");
    const si = P("fr98", "si");
    [["Reservar", "reservar", 0], ["Cancelar", "cancelar", 110], ["Cobrar", "cobrar", 220]].forEach(([n, w, dx]) => {
      if (e.tx("etiqueta", n, X + 16 + dx, 104, P("fr98", w))) propCandado(e.frente, X + dx, 100, { abierto: t >= si });
    });
    e.tx("etiqueta", "Repite y espera un sí", X, 124, si, "color:#1fd69a");
    e.tx("etiqueta", "Si te corriges: manda lo último", X, 142, INI("fr99"), "color:#c9d2ff");
    e.fuente("Idea: JVCE, en X", 108, 174, P("fr97", "JVCE"));
    if (t >= INI("fr102")) { linea(e.frente, X, 81, 452, 81, PROP.naranja, 2); e.tx("etiqueta", "La traza quien lo monta", X, 156, INI("fr103"), "color:#ff8a3d"); }
  }

  function b10(t) {
    escenario("centralita", e.capas, t, op);
    const a = LLEGA(8), X = 114;
    e.tx("rotulo", "Puede <span class='clave'>pasarte</span> a ti", 16, 14, a);
    e.panel(100, 40, 366, 128);
    if (t < INI("fr108")) {
      if (t < P("fr105", "seis")) e.tx("etiqueta", "No va de despedidas en Río", X, 92, a, "color:#f5f7fb");
      e.tx("dato", "6", X, 48, P("fr105", "seis"), "color:#ff8a3d");
      e.tx("etiqueta", "continentes, según Phonic", X + 26, 58, P("fr105", "continentes"), "color:#c9d2ff");
      [["Atención al cliente", "atencion"], ["Sanidad", "sanidad"], ["Selección", "seleccion"], ["Logística", "logistica"]].forEach(([n, w], k) => {
        const x = X + (k % 2) * 180, y = 84 + Math.floor(k / 2) * 16;
        if (e.tx("etiqueta", n, x + 14, y, P("fr105", w))) check(e.frente, x, y - 1, PROP.verde);
      });
      if (e.tx("insignia", "Ashby · 25 países", X, 124, P("fr106", "Ashby"))) e.tx("etiqueta", "entrevistas con IA", X + 164, 127, P("fr106", "entrevistas"), "color:#f5f7fb");
      e.tx("etiqueta", "¿Tu próxima entrevista?", X, 150, INI("fr107"), "color:#f2c14e");
    } else {
      if (e.papel(112, 50, 166, 106, INI("fr108"))) {
        e.tx("tarjeta-texto", "Europa", 120, 58, INI("fr108"), "color:#b4622a");
        e.tx("tarjeta-texto", "Desde agosto", 120, 74, P("fr108", "agosto"));
        e.tx("tarjeta-texto", "Debe saberse", 120, 90, P("fr108", "sepas"));
        e.tx("tarjeta-texto", "que es una IA", 120, 102, P("fr108", "hablas"));
        e.tx("tarjeta-texto", "Salvo evidente", 120, 122, P("fr108", "sepas"), "color:#8a7a68");
        e.tx("tarjeta-texto", "Art. 50", 120, 138, P("fr108", "agosto"), "color:#8a7a68");
      }
      if (e.papel(288, 50, 166, 106, INI("fr109"))) {
        e.tx("tarjeta-texto", "España", 296, 58, INI("fr109"), "color:#b4622a");
        e.tx("tarjeta-texto", "Básicos y", 296, 74, P("fr109", "basicos"));
        e.tx("tarjeta-texto", "grandes", 296, 86, P("fr109", "grandes"));
        e.tx("tarjeta-texto", "Pedir persona", 296, 104, P("fr109", "persona"), "color:#1f8a5a");
        e.tx("tarjeta-texto", "Plazo: dic.", 296, 122, P("fr109", "diciembre"), "color:#8a7a68");
        e.tx("tarjeta-texto", "Ley 10/2025", 296, 138, P("fr109", "ley"), "color:#8a7a68");
      }
    }
  }

  function b11(t) {
    escenario("servidores", e.capas, t, op);
    const a = LLEGA(9), X = 114;
    e.tx("rotulo", "Las cifras con <span class='clave'>lupa</span>", 16, 14, a);
    const alto = t < INI("fr113") ? 46 : t >= INI("fr120") && t < INI("fr122") ? 34 : t >= INI("fr126") && t < INI("fr128") ? 62 : 128;
    e.panel(100, 40, 366, alto);
    const fila =(n, v, y, frac, color, desde) => {
      if (!e.tx("etiqueta", n, X, y + 2, desde)) return;
      e.barra(X + 128, y, 168, 12, e.prog(t, desde, desde + 0.5) * frac, color);
      e.tx("etiqueta", v, X + 302, y + 2, desde, `color:${color}`);
    };
    if (t < INI("fr113")) {
      e.tx("etiqueta", "Decía el tweet:", X, 50, a, "color:#c9d2ff");
      e.tx("etiqueta", "«Por fin alguien resolvió el problema»", X, 66, a, "color:#f5f7fb");
    } else if (t < INI("fr117")) {
      e.tx("etiqueta", "Índice de voz a voz", X, 50, INI("fr113"), "color:#f2c14e");
      fila("Phonic-1", "87,1", 74, 0.871, PROP.verde, P("fr113", "primero"));
      fila("Grok Voice 3", "86,9", 94, 0.869, PROP.azul, P("fr115", "86,9"));
      e.tx("insignia", "2 décimas", X, 124, INI("fr116"));
      e.fuente("Fuente: Artificial Analysis", 108, 150, INI("fr113"));
    } else if (t < INI("fr120")) {
      e.tx("etiqueta", "Tareas con herramientas", X, 50, INI("fr117"), "color:#f2c14e");
      fila("Phonic-1", "79,9 %", 70, 0.799, PROP.verde, P("fr117", "79,9"));
      fila("Siguiente", "74,5 %", 90, 0.745, PROP.azul, P("fr117", "74,5"));
      e.tx("etiqueta", "Su dato más sólido", X, 106, INI("fr118"), "color:#1fd69a");
      e.tx("etiqueta", "Primer audio: 0,61 s", X, 122, INI("fr119"), "color:#c9d2ff");
      e.tx("etiqueta", "Más abajo, más rápidos", X, 136, P("fr119", "rapidos"), "color:#8a93a6");
      e.fuente("Fuente: Artificial Analysis", 108, 150, INI("fr117"));
    } else if (t < INI("fr126")) {
      e.tx("etiqueta", "¿Y gusta?", X, 50, INI("fr120"), "color:#f2c14e");
      e.tx("etiqueta", "Artificial Analysis:", X, 70, INI("fr122"), "color:#c9d2ff");
      e.tx("etiqueta", "fuera del top 5", X + 180, 70, P("fr122", "fuera"), "color:#ff8a3d");
      fila("Gana a GPT-Live", "61,5 %", 90, 0.615, PROP.verde, P("fr123", "61,5"));
      fila("Actores humanos", "57 %", 110, 0.57, PROP.azul, P("fr124", "57"));
      fila("Phonic-1", "32 %", 128, 0.32, PROP.naranja, P("fr124", "32"));
      e.fuente("Pruebas publicadas por Phonic", 108, 150, P("fr123", "publica"));
    } else {
      e.tx("etiqueta", "Modelos supervisores:", X, 54, INI("fr126"), "color:#c9d2ff");
      e.tx("etiqueta", "no dice cuáles", X + 180, 54, P("fr126", "cuales"), "color:#f2c14e");
      e.tx("etiqueta", "La voz no trabaja sola", X, 76, INI("fr127"), "color:#f5f7fb");
      e.tx("titular", "«Único»", X, 100, INI("fr128"), "color:#ff8a3d");
      e.tx("etiqueta", "Lo dice la empresa", X, 128, P("fr128", "empresa"), "color:#c9d2ff");
      e.tx("etiqueta", "Sin verificar", X + 180, 128, INI("fr129"), "color:#ff8a3d");
      e.fuente("Fuente: web de Phonic", 108, 150, INI("fr126"));
    }
  }

  function b12(t) {
    escenario("azotea", e.capas, t, { W, H, suelo: SUELO - 4 });
    const a = LLEGA(10), X = 112;
    if (t < INI("fr135")) {
      e.tx("titular", "¿Qué ha", X, 34, a);
      e.tx("titular", '<span class="clave">resuelto</span>?', X, 58, a);
      if (t >= INI("fr131")) e.panel(X - 8, 88, 250, 104);
      e.tx("etiqueta", "Ya no parece un formulario", X, 96, INI("fr131"), "color:#1fd69a");
      e.tx("etiqueta", "en voz alta", X, 110, P("fr131", "voz"), "color:#1fd69a");
      e.tx("etiqueta", "Si la máquina va más rápido", X, 130, INI("fr132"), "color:#f2c14e");
      e.tx("etiqueta", "que tú: sin resolver", X, 144, P("fr132", "rapido"), "color:#f2c14e");
      e.tx("etiqueta", "La frase importante", X, 164, INI("fr134"), "color:#f5f7fb");
      e.tx("etiqueta", "llega al final", X, 178, P("fr134", "llega"), "color:#ff8a3d");
    } else {
      e.tx("titular", "«No, la del", 110, 76, INI("fr135"));
      e.tx("titular", '<span class="clave">martes</span>»', 110, 104, P("fr135", "martes"));
    }
  }

  // Medidor de la voz de MISTA, siempre bajo el panel: da movimiento continuo aunque el panel tape el fondo. Calla en los clips.
  const PALABRAS = window.TIMING.frases.flatMap((f) => f.palabras);
  const medidor = (pintar) => (t) => {
    pintar(t);
    if (enClip(t)) return;
    const habla = PALABRAS.some((p) => t >= p.i - 0.05 && t <= p.f + 0.05);
    rect(e.frente, 98, 196, 370, 16, PROP.contorno);
    propOndaVoz(e.frente, 102, 198, 362, 12, t, { color: PROP.naranja, activo: habla, semilla: 21, paso: 4 });
  };
  const G = (x, espejo, pose) => ({ x, espejo, pose });
  const bloques = [
    { pintar: b01, gato: (t) => G(14, false, t >= P("fr09", "reserva") ? "sorpresa" : t >= INI("fr07") ? "pensar" : t >= INI("fr05") ? "senalar" : t >= INI("fr02") ? "pensar" : "pie") },
    { pintar: b02, gato: (t) => G(14, false, t >= P("fr15", "vuelto") && t < INI("fr16") ? "sorpresa" : t >= INI("fr16") ? "pensar" : t >= INI("fr12") ? "tocar" : "pie") },
    { pintar: b03, gato: (t) => G(14, false, t >= INI("fr23") ? "pensar" : t >= INI("fr22") ? "senalar" : "tocar") },
    { pintar: b04, gato: (t) => G(14, false, t >= INI("fr31") ? "senalar" : t >= INI("fr30") ? "pensar" : "pie") },
    { pintar: b05, gato: (t) => G(14, false, t >= INI("fr39") ? "pensar" : t >= P("fr38", "15,7") ? "sorpresa" : t >= INI("fr35") ? "senalar" : "pie") },
    { pintar: b06, gato: (t) => G(14, false, t >= INI("fr49") && t < INI("fr50") ? "celebrar" : t >= INI("fr46") && t < INI("fr47") ? "pensar" : t >= INI("fr43") && t < INI("fr44") ? "celebrar" : t >= CLIPS[0][0] && t < INI("fr43") ? "tocar" : t >= INI("fr51") ? "senalar" : "pie") },
    { pintar: b07, gato: (t) => G(14, false, t >= INI("fr67") ? "pensar" : t >= INI("fr63") && t < INI("fr64") ? "sorpresa" : t >= INI("fr58") ? "senalar" : "tocar") },
    { pintar: b08, gato: (t) => G(14, false, t >= INI("fr92") ? "pensar" : t >= INI("fr84") ? "pensar" : t >= INI("fr78") && t < INI("fr81") ? "sorpresa" : t >= INI("fr76") ? "senalar" : "tocar") },
    { pintar: b09, gato: (t) => G(14, false, t >= INI("fr102") ? "tocar" : t >= P("fr98", "si") ? "celebrar" : t >= INI("fr97") ? "senalar" : "pensar") },
    { pintar: b10, gato: (t) => G(14, false, t >= INI("fr110") ? "pensar" : t >= INI("fr107") && t < INI("fr108") ? "sorpresa" : "senalar") },
    { pintar: b11, gato: (t) => G(14, false, t >= INI("fr128") ? "pensar" : t >= INI("fr124") && t < INI("fr126") ? "sorpresa" : t >= INI("fr118") && t < INI("fr119") ? "celebrar" : "senalar") },
    { pintar: b12, gato: (t) => ({ x: 20, y: SUELO - 68, espejo: false, pose: t >= INI("fr135") ? "senalar" : t >= INI("fr132") ? "pensar" : "pie" }) },
  ];
  e = escenaBase({ W, H, bloques: bloques.map((b) => ({ ...b, pintar: medidor(b.pintar), gato: (t) => (enClip(t) ? { ...b.gato(t), pose: "pie" } : b.gato(t)) })), cortes: CORTES, y0Gato: Y_GATO, enClip });

  // ---------- sonido: atado a lo que pasa en pantalla, nunca al texto hablado ----------
  window.eventosSonido = () => {
    const ev = [], add = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
    CORTES.forEach((c) => add(c - 0.2, "destello"));
    add(P("fr01", "lunes"), "seleccion"); add(P("fr01", "martes"), "seleccion"); add(INI("fr09"), "aparicion");
    add(P("fr15", "vuelto"), "error");
    add(INI("fr19"), "aparicion"); add(INI("fr20"), "aparicion"); add(INI("fr21"), "aparicion");
    add(P("fr28", "termines"), "error"); add(INI("fr31"), "seleccion");
    add(P("fr32", "27") + 0.9, "tick"); add(P("fr37", "1,1"), "acierto"); add(P("fr38", "15,7"), "error");
    add(INI("fr41"), "aparicion"); add(INI("fr42"), "aparicion");
    add(P("fr45", "25"), "acierto"); add(P("fr48", "0,58"), "tick"); add(INI("fr51") , "acierto");
    add(P("fr59", "114"), "tick"); add(P("fr60", "api.example.com"), "seleccion"); add(P("fr63", "simulador"), "aparicion"); add(P("fr68", "once"), "tick");
    add(P("fr72", "reservar"), "aparicion"); add(P("fr76", "confirmada"), "acierto"); add(INI("fr77"), "seleccion");
    add(P("fr78", "sitio"), "error"); add(P("fr83", "cancelacion"), "tick"); add(P("fr89", "corriges"), "error");
    add(P("fr91", "siete"), "aparicion"); add(P("fr94", "Sarah"), "seleccion");
    add(P("fr97", "busca"), "acierto"); add(P("fr98", "si"), "acierto");
    add(P("fr106", "Ashby"), "aparicion"); add(INI("fr108"), "aparicion"); add(INI("fr109"), "aparicion");
    add(INI("fr116"), "seleccion"); add(P("fr117", "79,9"), "acierto"); add(P("fr124", "57"), "error"); add(INI("fr129"), "error");
    add(INI("fr135"), "seleccion");
    return ev;
  };
  window.seek(0);
})();
