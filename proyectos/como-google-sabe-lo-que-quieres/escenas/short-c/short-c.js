// como-google-sabe-lo-que-quieres · short C «Dónde ver lo que Google cree que te gusta» (9:16, estilo v6).
// 7 estaciones: tu lista y Mi centro de anuncios, los interruptores, la taza | el archivador de la cuenta, YouTube, Discover |
// cierre. Arte a 4 px, lienzo 270×480; lo importante, fuera de las zonas tapadas del short.
(() => {
  const T = window.TIMING, TT = tiempos6(T), P = TT.P, fin = TT.fin;
  const prog = prog6, salto = salto6, SU = 292;
  const PX = (id, palabra) => { const w = TT.FR[id].palabras.find((p) => norm6(p.p) === norm6(palabra)); if (!w) throw new Error(`No encuentro «${palabra}» en ${id}`); return w.i; };
  const T_ENTRADA = P("fr01", "gusta"), T_VER = P("fr01", "ver");
  const T_CENTRO = P("fr02", "centro"), T_DATOS = ["edad", "idioma", "actividad", "zonas"].map((w) => P("fr02", w));
  const T_INTER = P("fr03", "interruptores"), T_OFF = [P("fr03", "actividad"), P("fr03", "youtube"), P("fr03", "zonas")], T_APAGA = PX("fr03", "apaga");
  const T_QUITAS = P("fr04", "quitas"), T_SEGUIRAS = P("fr04", "seguiras");
  const T_GUARDA = P("fr05", "guarda"), T_CASILLA = P("fr05", "casilla"), T_CHROME = P("fr05", "chrome"), T_APAGAR = P("fr05", "apagar");
  const T_INTERESA = P("fr06", "interesa"), T_CANAL = P("fr06", "canal"), T_PAUSAR = P("fr06", "pausar");
  const T_SEGUIR = P("fr07", "seguir"), T_QUITAR = P("fr07", "quitar");

  // 0 · tu lista: una ficha de intereses (robot, escoba, estrella) y, con «Mi centro de anuncios», el panel con tus datos
  function lista(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { m: 8, techo: 70, ventanas: [] });
    caja5(medio, x0 + 20, 214, 150, 58, G.PAPEL);
    [["robot", 0], ["escoba", 1], ["estrella", 2]].forEach(([ic, k]) => { if (t < 0.6 + k * 0.4) return; const x = x0 + 30 + k * 46, y = 226; if (ic === "robot") { rect(frente, x - 2, y - 2, 40, 34, GC); rect(frente, x - 1, y - 1, 38, 32, "#26304a"); robotG(frente, null, x + 3, y + 12, t, { piloto: false }); } else { rect(frente, x - 2, y - 2, 40, 34, GC); rect(frente, x - 1, y - 1, 38, 32, "#1a2236"); iconoG(frente, x + 13, y + 10, ic); } });
    if (t >= T_CENTRO) {
      const y = 100 + (salto(t, T_CENTRO) || 0);
      caja5(medio, x0 + 14, y, 230, 112, R5.metal); rect(medio, x0 + 20, y + 20, 218, 86, "#141a26");
      placa6(medio, x0 + 22, y + 4, "MI CENTRO DE ANUNCIOS", { color: "#f5f7fb", fondo: "#0c1016" });
      ["edad", "globo", "huellas", "chincheta"].forEach((ic, k) => { const on = t >= T_DATOS[k]; iconoG(medio, x0 + 30 + (k % 2) * 104, y + 32 + Math.floor(k / 2) * 34, ic, on); rect(medio, x0 + 46 + (k % 2) * 104, y + 36 + Math.floor(k / 2) * 34, 70, 2, on ? "#8a93a6" : "#33405a"); if (on) destello5(frente, brillo, x0 + 35 + (k % 2) * 104, y + 37 + Math.floor(k / 2) * 34, t, T_DATOS[k], R5.ia); });
      const pos = (k) => [x0 + 60 + (k % 2) * 104, y + 40 + Math.floor(k / 2) * 34];
      const kk = T_DATOS.filter((td) => t >= td).length - 1, a = pos(Math.max(0, kk - 1)), b = pos(Math.max(0, kk)), g = kk < 1 ? 1 : prog(t, T_DATOS[kk], T_DATOS[kk] + 0.4);
      cursorG(frente, Math.round(a[0] + (b[0] - a[0]) * g + Math.sin(t * 4) * 2), Math.round(a[1] + (b[1] - a[1]) * g));
    }
  }
  // 1 · los interruptores: se apagan uno a uno; las recomendaciones, en su caja aparte, siguen encendidas
  function interruptores(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { m: 8, techo: 70, ventanas: [] });
    caja5(medio, x0 + 14, 96, 150, 100, R5.metal); rect(medio, x0 + 20, 102, 138, 88, "#141a26");
    ["huellas", "play", "chincheta"].forEach((ic, k) => interruptorG(medio, brillo, x0 + 30 + k * 44, 118, t < T_OFF[k], ic));
    caja5(medio, x0 + 176, 112, 60, 56, R5.metal); interruptorG(medio, brillo, x0 + 197, 120, true, null); iconoG(medio, x0 + 181, 116, "play");
    rect(medio, x0 + 206, 168, 2, SU - 168, GC); rect(medio, x0 + 206, 168, 1, SU - 168, R5.verde[1]);
    for (let j = 0; j < 3; j++) { const yy = 172 + Math.round((t * 22 + j * 36) % 104); caja5(frente, x0 + 196, yy, 22, 14, ["#141c2c", "#1a2438", "#22304a", "#2c3c5c"]); rect(frente, x0 + 199, yy + 3, 8, 8, [R5.ia, R5.verde, P6.ORO][j][2]); }
    if (t >= T_APAGA) destello5(frente, brillo, x0 + 206, 136, t, T_APAGA, R5.verde.concat("#ffffff"));
  }
  // 2 · sigue habiendo anuncios: en el hueco, el robot se cambia por una taza
  function taza(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], m: 8, techo: 70, ventanas: [] });
    tabletaNoticiasG(medio, brillo, x0 + 30, 100, 200, 128, t, { hueco: { visible: true, robot: t < T_SEGUIRAS, y: 146, h: 34 } });
    if (t >= T_SEGUIRAS) { tazaG(frente, x0 + 123, 160); destello5(frente, brillo, x0 + 130, 164, t, T_SEGUIRAS, R5.ia); }
    if (t >= T_QUITAS) interruptorG(frente, brillo, x0 + 116, 240, false, null);
  }
  // 3 · el archivador de la cuenta: la casilla de Chrome y, con «apagar», el cajón que se vacía
  function archivo(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], m: 8, techo: 70, ventanas: [] });
    const vacio = t >= T_APAGAR + 0.5;
    archivadorG(medio, brillo, x0 + 96, 86, t, { iconos: ["lupa", "mapa", "globo", "movil", "chincheta"], abiertos: vacio ? [] : [0, 1, 2, 3, 4], extra: t >= T_CASILLA && t < T_APAGAR ? 1 : 0 });
    if (t >= T_CASILLA) casillaG(frente, brillo, x0 + 176, 212, t >= T_CASILLA + 0.3 && t < T_APAGAR);
    if (t >= T_CHROME && t < T_APAGAR) pestanaG(frente, x0 + 172, 196 + (salto(t, T_CHROME) || 0), R5.ia);
    papeleraG(medio, x0 + 200, SU);
    if (t >= T_APAGAR && t < T_APAGAR + 1.2) for (let k = 0; k < 5; k++) { const f = prog(t, T_APAGAR + k * 0.08, T_APAGAR + 0.5 + k * 0.08); if (f > 0 && f < 1) fichaG(frente, Math.round(x0 + 136 + (x0 + 206 - x0 - 136) * f), Math.round(94 + k * 21 + (262 - 94 - k * 21) * f)); }
  }
  // 4 · YouTube: una mano aparta un vídeo, el canal tachado y la pausa
  function youtube(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { m: 8, techo: 70, ventanas: [] });
    caja5(medio, x0 + 20, 226, 210, 30, P6.CARTON);
    teleG(medio, brillo, x0 + 24, 96, 200, 120, t, { placa: "YOUTUBE", dentro: (sx, sy, sw, sh) => reproductorG(medio, brillo, sx, sy, sw, sh, t, { robot: t < T_INTERESA + 0.5 ? 5 : -1, semilla: 13 }) });
    if (t >= T_INTERESA - 0.3 && t < T_INTERESA + 0.8) { const f = prog(t, T_INTERESA - 0.3, T_INTERESA + 0.5); manoG(frente, Math.round(x0 + 100 + f * 60), 150); }
    if (t >= T_CANAL) canalTachadoG(frente, x0 + 60, 234 + (salto(t, T_CANAL) || 0), R5.metal);
    if (t >= T_PAUSAR) pausaG(frente, x0 + 84, 234 + (salto(t, T_PAUSAR) || 0));
  }
  // 5 · Discover: la estrella sigue un tema y una tarjeta se va
  function discover(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], m: 8, techo: 70, ventanas: [] });
    movilG(medio, brillo, x0 + 60, 90, 100, 190, { dentro: (sx, sy, sw, sh) => {
      rect(medio, sx, sy, sw, 16, "#141c2c"); placa6(medio, sx + 4, sy + 2, "DISCOVER", { color: "#f5f7fb", fondo: "#1d2f6b" });
      tarjetaG(medio, sx + 4, sy + 22, sw - 8, "normal", 4);
      if (t < T_QUITAR + 0.4) tarjetaG(medio, sx + 4 + Math.round(prog(t, T_QUITAR, T_QUITAR + 0.4) * 100), sy + 56, sw - 8, "normal", 7);
      tarjetaG(medio, sx + 4, sy + 90, sw - 8, "normal", 9); tarjetaG(medio, sx + 4, sy + 124, sw - 8, "normal", 11);
    } });
    if (t >= T_SEGUIR) { iconoG(frente, x0 + 170, 120 + (salto(t, T_SEGUIR) || 0), "estrella"); destello5(frente, brillo, x0 + 175, 125, t, T_SEGUIR, P6.ORO.concat(["#fff1c4", "#ffffff"])); }
  }
  // 6 · cierre: el panel con los interruptores
  function cierre(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { m: 8, techo: 70, ventanas: [[160, 100, 56, 50]] });
    caja5(medio, x0 + 70, 168, 150, 70, R5.metal); rect(medio, x0 + 76, 174, 138, 58, "#141a26");
    ["huellas", "play", "chincheta"].forEach((ic, k) => interruptorG(medio, brillo, x0 + 90 + k * 40, 180, k === 1, null));
    cursorG(frente, Math.round(x0 + 140 + Math.sin(t * 1.4) * 44), Math.round(206 + Math.cos(t * 1.1) * 8));
  }

  montarShort({ TT, entrada: T_ENTRADA, titulo: ['Algoritmos · <span class="clave">Google</span>', 'Lo que cree<br>que te <span class="clave">gusta</span>'],
    estaciones: [{ dib: lista, hasta: "fr02" }, { dib: interruptores, hasta: "fr03" }, { dib: taza, hasta: "fr04" }, { dib: archivo, hasta: "fr05" },
      { dib: youtube, hasta: "fr06" }, { dib: discover, hasta: "fr07", extra: 0.3 }, { dib: cierre, hasta: "fr08" }],
    zooms: [],
    temas: [{ desde: 0, hasta: 2, html: 'Tu <span class="clave">lista</span>' }, { desde: 3, hasta: 5, html: 'Tu <span class="clave">rastro</span>', pose: "senalar" },
      { desde: 6, hasta: 6, html: 'En <span class="clave">resumen</span>', pose: "pie" }],
    claves: [[T_DATOS[0], "la ficha de datos"], [T_OFF[0], "los interruptores se apagan"], [T_SEGUIRAS, "la taza en el hueco"], [T_CASILLA, "la casilla de Chrome"],
      [T_INTERESA, "la mano aparta el vídeo"], [T_SEGUIR, "la estrella de Discover"]],
    sonidos: [[T_CENTRO, "aparicion"], ...T_DATOS.map((t) => [t, "tick"]), ...T_OFF.map((t) => [t, "seleccion"]), [T_APAGA, "acierto"], [T_SEGUIRAS, "aparicion"],
      [T_CASILLA, "tick"], [T_APAGAR, "destello"], [T_INTERESA, "destello"], [T_PAUSAR, "tick"], [T_SEGUIR, "acierto"]],
    clavesDialogo: { fr01: "gusta", fr02: "centro", fr03: "recomendaciones", fr04: "relevantes", fr05: "casilla", fr06: "canal", fr07: "Discover", fr08: "largo" } });
})();
