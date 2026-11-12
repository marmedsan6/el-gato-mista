// como-google-sabe-lo-que-quieres · short A «¿Tu móvil te escucha?» (9:16, estilo v6). Guion propio (guion.md, Short A).
// 7 estaciones: el banco del parque, el laboratorio (zoom núcleo), el filtro, la cámara de pantalla | el rastro: la búsqueda
// y el archivador, la etiqueta de la tienda | cierre con las migas. Arte a 4 px, lienzo 270×480; lo importante, fuera del
// 12 % de arriba, del 20 % de abajo y de la franja derecha (x > 237 entre y 216 y 408).
(() => {
  const T = window.TIMING, TT = tiempos6(T), P = TT.P, fin = TT.fin;
  const prog = prog6, salto = salto6, SU = 292;
  const T_ENTRADA = P("fr01", "algo"), T_ANUNCIO = P("fr01", "anuncio"), T_ESCUCHA = P("fr01", "escucha");
  const T_UNIV = P("fr02", "universidad"), T_17 = P("fr03", "17260"), T_9 = P("fr03", "9100"), T_PUSIERON = P("fr03", "pusieron"), T_REGISTR = P("fr03", "registraron");
  const T_BUSCABAN = P("fr04", "buscaban"), T_NINGUNA = P("fr04", "ninguna");
  const T_PASARA = P("fr05", "pasara"), T_TEXTO = P("fr05", "texto"), T_VISTO = P("fr05", "visto");
  const T_GRABABAN = P("fr06", "grababan"), T_MANDABAN = P("fr06", "mandaban");
  const T_BUSCAS = P("fr07", "buscas"), T_GUARDA = P("fr07", "guarda"), T_DEDUCE = P("fr07", "deduce");
  const T_ETIQUETA = P("fr08", "etiqueta"), T_SEGUNDOS = P("fr08", "segundos"), T_LISTA = P("fr08", "lista");
  const T_PISTAS = P("fr09", "pistas"), T_VIAJE = P("fr10", "viaje");

  // 0 · la sospecha: dos personas en el banco; con «anuncio», el móvil enseña el robot (y se ve de cerca)
  function sospecha(L, x0, t) {
    const { medio, frente, brillo } = L;
    farola6(medio, brillo, x0 + 28, t, SU);
    rect(medio, x0 + 214, SU - 60, 6, 60, GC); disco(medio, x0 + 217, SU - 74, 24, GC); disco(medio, x0 + 217, SU - 74, 23, R5.verde[0]); disco(medio, x0 + 211, SU - 80, 12, R5.verde[1]);
    personaSentadaG(medio, x0 + 70, SU - 52, t, { camisa: R5.ia });
    personaSentadaG(medio, x0 + 124, SU - 52, t + 1.3, { camisa: [R5.verde[0], R5.verde[1], R5.verde[2]], pelo: ["#3a2216", "#6a4428", "#8a5a32"] });
    bancoParqueG(frente, x0 + 58, SU, 112);
    if (t >= 1.7) { bocadilloRobotG(frente, x0 + 44, 196 + (salto(t, 1.7) || 0), "der"); if (t >= 2.2) bocadilloRobotG(frente, x0 + 138, 200 + (salto(t, 2.2) || 0), "izq"); }
    if (t >= T_ANUNCIO) { // el móvil, de cerca: el anuncio del robot
      const y = 86 + (salto(t, T_ANUNCIO) || 0);
      movilG(frente, brillo, x0 + 96, y, 66, 110, { dentro: (sx, sy, sw, sh) => { rect(frente, sx, sy + 20, sw, 50, "#26304a"); rect(frente, sx, sy + 58, sw, 12, G.SUELO[2]); robotG(frente, brillo, sx + 15, sy + 44, t); caja5(frente, sx + 6, sy + 78, sw - 12, 10, R5.naranja); } });
      destello5(frente, brillo, x0 + 129, y + 50, t, T_ANUNCIO, R5.naranja.concat("#fff1c4"));
    }
    if (t >= T_ESCUCHA) interrogacionG(frente, x0 + 176, 104 + (salto(t, T_ESCUCHA) || 0), R5.naranja, 3);
  }
  // 1 · el laboratorio (zoom núcleo): cinco móviles probando apps con un dedo mecánico; los paquetes suben a la nube
  function laboratorio(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: G.LAB, m: 8, techo: 70, ventanas: [], suelo: ["#0d1418", "#16242f", "#22545a"] });
    placa6(medio, x0 + 76, 279, "NORTHEASTERN", { color: "#f5f7fb", fondo: "#2a1618" });
    const BX = x0 + 40, BY = SU - 62, n = 5, paso = 32, activo = t >= T_PUSIERON - 3 ? Math.floor(t * 1.6) % n : -1;
    bancoMovilesG(medio, brillo, BX, BY, n, t, { activo });
    rect(frente, BX - 10, 164, 180, 4, GC); rect(frente, BX - 9, 165, 178, 2, R5.metal[2]);
    if (activo >= 0) dedoMecanicoG(frente, BX + activo * paso + 11, 172, BY + 8, (t * 1.6) % 1 < 0.5 ? 1 : 0);
    nubeG(medio, brillo, x0 + 116, 104);
    const flujo = t >= T_REGISTR ? 1 : t >= T_17 ? 0.35 : 0;
    for (let k = 0; k < 10; k++) {
      if (k / 10 >= flujo) break;
      const f = (t * 0.45 + k * 0.137) % 1, m = (k * 3) % n, px = BX + m * paso + 8, tx = x0 + 128 + (k % 3) * 8;
      paqueteG(frente, Math.round(px + (tx - px) * f), Math.round(BY - 4 + (122 - BY) * f), k % 3 === 0 ? "texto" : "imagen");
    }
  }
  // 2 · el filtro: los paquetes caen a sus cajones; el del audio sigue vacío; luego el bocadillo que se vuelve hoja
  function filtro(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: G.LAB, m: 8, techo: 70, ventanas: [], suelo: ["#0d1418", "#16242f", "#22545a"] });
    const FX = x0 + 43, FY = 96, parpadeo = t >= T_VISTO - 0.4 && t < T_VISTO + 0.8;
    const F = filtroMicrofonoG(medio, brillo, FX, FY, t, { piloto: false, parpadeo });
    const entrada = [FX + 92, FY + 60], tramo = (a, b, f) => [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f)];
    for (let k = 0; k < 5; k++) {
      const f = (t * 0.4 + k / 5) % 1, tipo = k % 2 ? "texto" : "imagen", cj = F.cajon(tipo === "texto" ? 1 : 0);
      const p = f < 0.35 ? tramo([x0 + 16, FY + 52], entrada, f / 0.35) : f < 0.65 ? tramo(entrada, F.boca, (f - 0.35) / 0.3) : tramo(F.boca, [cj[0], cj[1] - 6], (f - 0.65) / 0.35);
      paqueteG(frente, p[0] - 4, p[1] - 4, tipo);
    }
    if (t >= T_PASARA - 0.6 && t < T_VISTO + 0.5) {
      const m = prog(t, T_PASARA - 0.6, T_TEXTO), v = prog(t, T_TEXTO + 0.2, T_VISTO);
      const p = v < 0.6 ? tramo([x0 + 20, 96], [entrada[0] - 15, entrada[1] - 30], v / 0.6) : tramo([entrada[0] - 15, entrada[1] - 30], [F.cajon(1)[0] - 15, F.cajon(1)[1] - 20], (v - 0.6) / 0.4);
      bocadilloHojaG(frente, p[0], p[1], m >= 1 ? 1 : 0);
    }
    if (t >= T_VISTO + 0.5) { const [cx, cy] = F.cajon(1); caja5(frente, cx + 10, cy - 10, 12, 14, G.PAPEL); }
  }
  // 3 · la pantalla: una app con una cámara pequeña que la fotografía; las fotos vuelan a otra empresa y se apilan
  function pantalla(L, x0, t) {
    const { medio, frente, brillo } = L;
    oficinasG(medio, x0 + 150, 140, 84, SU, null);
    const { sx, sy, sw, sh } = movilG(medio, brillo, x0 + 36, 96, 74, 140, { dentro: (sx, sy, sw, sh) => {
      rect(medio, sx, sy, sw, 16, "#13362a");
      for (let k = 0; k < 4; k++) { const y = sy + 22 + k * 24; caja5(medio, sx + 4, y, sw - 8, 20, ["#141c2c", "#1a2438", "#22304a", "#2c3c5c"]); motoG(medio, sx + 8, y + 6); rect(medio, sx + 28, y + 6, sw - 38, 2, "#4a5774"); }
    } });
    const capturas = [T_GRABABAN, T_GRABABAN + 1.2, T_MANDABAN, T_MANDABAN + 1.0];
    if (t >= T_GRABABAN - 0.4) camaritaG(frente, brillo, sx + sw - 4, sy + 10 + (salto(t, T_GRABABAN - 0.4) || 0), t, capturas.some((tc) => t >= tc && t < tc + 0.2));
    const destino = [x0 + 180, SU - 16];
    capturas.forEach((tc, k) => {
      if (t < tc) return;
      destello5(frente, brillo, sx + sw / 2, sy + sh / 2, t, tc, ["#3a3f4c", "#8a93a6", "#c4cae0", "#e4e8f0", "#ffffff"]);
      const f = prog(t, tc + 0.2, tc + 1.2), ox = sx + sw + 4, oy = sy + 20;
      if (f < 1) fotoG(frente, Math.round(ox + (destino[0] - ox) * f), Math.round(oy + (destino[1] - k * 4 - oy) * f - Math.sin(f * Math.PI) * 30));
      else fotoG(frente, destino[0] + (k % 2) * 6, destino[1] - k * 4);
    });
  }
  // 4 · el rastro: la búsqueda va al archivador de la cuenta; con «deduce», las fichas forman el robot
  function rastro(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], m: 8, techo: 70, ventanas: [] });
    const V = ventanaG(medio, brillo, x0 + 16, 112, 140, 84, { placa: "GOOGLE" });
    barraBusquedaG(medio, V.ix + 6, V.iy + 8, V.iw - 12, prog(t, T_BUSCAS - 0.3, T_BUSCAS + 0.6));
    const abiertos = [T_GUARDA, T_GUARDA + 0.4, T_GUARDA + 0.8, T_GUARDA + 1.2, T_GUARDA + 1.6].map((a, k) => (t >= a ? k : -1)).filter((k) => k >= 0);
    archivadorG(medio, brillo, x0 + 168, 90, t, { iconos: ["lupa", "mapa", "globo", "movil", "chincheta"], abiertos });
    const f = prog(t, T_GUARDA - 0.5, T_GUARDA + 0.2);
    if (f > 0 && f < 1) { const ax = V.ix + 50, ay = V.iy + 10; fichaG(frente, Math.round(ax + (x0 + 198 - ax) * f), Math.round(ay + (98 - ay) * f - Math.sin(f * Math.PI) * 24)); }
    if (t >= T_DEDUCE - 0.3) {
      const cx = x0 + 135, cy = 250;
      for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2, px = Math.round(cx + Math.cos(a) * 44) - 5, py = Math.round(cy + Math.sin(a) * 12) - 4, g = prog(t, T_DEDUCE - 0.3 + k * 0.05, T_DEDUCE + 0.4 + k * 0.05); if (g > 0) fichaG(frente, Math.round(x0 + 200 + (px - x0 - 200) * g), Math.round(150 + (py - 150) * g)); }
      if (t >= T_DEDUCE + 1.0) { rect(frente, cx - 40, cy - 2, 80, 4, GC); rect(frente, cx - 39, cy - 1, 78, 2, R5.naranja[2]); }
    }
  }
  // 5 · la etiqueta: la pegatina de la tienda avisa y la ficha se clava en el tablón en segundos
  function etiqueta(L, x0, t) {
    const { medio, frente, brillo } = L;
    const Tn = tiendaG(medio, brillo, x0 + 14, SU, t, { pegatina: t >= T_ETIQUETA - 0.3, avisa: t >= T_ETIQUETA && t < T_SEGUNDOS + 0.4 });
    const Tb = tablonG(medio, brillo, x0 + 146, 86, t >= T_SEGUNDOS ? 8 : 7, prog(t, T_SEGUNDOS, T_SEGUNDOS + 0.5));
    relojParedG(medio, x0 + 200, 168, t);
    const f = prog(t, T_ETIQUETA + 0.3, T_SEGUNDOS + 0.4), h = Tb.hueco(7);
    if (f > 0 && f < 1) { const [px, py] = Tn.pegatina; fichaG(frente, Math.round(px + (h[0] - px) * f), Math.round(py + (h[1] - py) * f - Math.sin(f * Math.PI) * 24)); }
    if (t >= T_LISTA) rect(brillo, h[0] - 4, h[1] - 4, 24, 21, R5.naranja[0]);
  }
  // 6 · cierre: el robot y un camino de migas que se encienden
  function cierre(L, x0, t) {
    const { medio, frente, brillo } = L;
    habitacionG(medio, x0, SU, { pared: R5.hormigon, m: 8, techo: 70, ventanas: [[150, 110, 56, 50]] });
    robotG(frente, brillo, x0 + 70 + Math.round((1 - Math.cos(t * 0.9)) * 14), SU - 31, t, { e: 3 });
    [[166, 282], [190, 276], [214, 281], [176, 262], [204, 256], [228, 250], [196, 236], [222, 228]].forEach(([x, y], k) => migaG(frente, brillo, x0 + x, y, t, t >= T_PISTAS + k * 0.12, k));
  }

  montarShort({ TT, entrada: T_ENTRADA, titulo: ['Algoritmos · <span class="clave">Google</span>', '¿Tu móvil<br>te <span class="clave">escucha</span>?'],
    estaciones: [{ dib: sospecha, hasta: "fr01" }, { dib: laboratorio, hasta: "fr03" }, { dib: filtro, hasta: "fr05" }, { dib: pantalla, hasta: "fr06" },
      { dib: rastro, hasta: "fr07" }, { dib: etiqueta, hasta: "fr08" }, { dib: cierre, hasta: "fr10" }],
    zooms: [{ est: 1, desde: T_PUSIERON, cx: 121, cy: 220 }],
    temas: [{ desde: 0, hasta: 3, html: '¿Te <span class="clave">escucha</span>?' }, { desde: 4, hasta: 5, html: 'El <span class="clave">rastro</span>', pose: "senalar" },
      { desde: 6, hasta: 6, html: 'En <span class="clave">resumen</span>', pose: "pie" }],
    textos: (T6, R, X) => {
      T6.cifra(T_17, T_9, '17.260<span class="unidad">apps</span>', [X(1) + 40, 136], true);
      T6.cifra(T_9, R.SAL(1) - 0.5, '9.100<span class="unidad">apps</span>', [X(1) + 40, 136], true);
      T6.cifra(T_NINGUNA, R.SAL(2), '0<span class="unidad">audio</span>', [16, 100]);
    },
    claves: [[T_ANUNCIO, "el móvil con el anuncio"], [T_REGISTR, "paquetes subiendo a la nube"], [T_NINGUNA, "cajón del audio vacío"], [T_PASARA, "el bocadillo que se vuelve hoja"],
      [T_GRABABAN, "la cámara que fotografía la pantalla"], [T_GUARDA, "la búsqueda entra en el archivador"], [T_SEGUNDOS, "la ficha se clava en el tablón"], [T_PISTAS, "las migas"]],
    sonidos: [[T_ANUNCIO, "seleccion"], [T_REGISTR, "aparicion"], [T_NINGUNA, "error"], [T_TEXTO, "aparicion"], [T_VISTO, "seleccion"], [T_GRABABAN, "destello"],
      [T_GUARDA, "seleccion"], [T_SEGUNDOS, "tick"], [T_PISTAS, "tick"]],
    clavesDialogo: { fr01: "escucha", fr03: "registraron", fr04: "Ninguna", fr05: "texto", fr06: "pantalla", fr07: "rastro", fr08: "etiqueta", fr09: "pistas", fr10: "largo" } });
})();
