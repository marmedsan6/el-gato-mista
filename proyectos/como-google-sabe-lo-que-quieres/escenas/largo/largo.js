// como-google-sabe-lo-que-quieres · largo 16:9, estilo v6 (ADR 0010; shotlist.md y style_guide.md del proyecto).
// Un MUNDO POR BLOQUE: cada bloque del guion es un mundo ancho propio (sus estaciones, su cámara ruta6, su cielo). El mundo
// del bloque b empieza con una copia de la última estación del bloque b-1, así el cambio de tema es el desplazamiento
// lateral de 0,4 s de siempre, con paralaje, y cada captura solo carga las pantallas de su bloque (hoja de ruta, punto 5).
// Hilo visual: el mismo robot aspirador en todas las estaciones donde se habla de él.
// Arte a 4 px (1 unidad = 1 px CSS), lienzo 480×270. La voz entra DESFASE s después (título de 2 s).
// ?hasta=N pinta solo hasta el bloque N (para revisar mientras se construye).
// Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
(() => {
  document.body.className = "largo";
  const W = 480, H = 270, DESFASE = 1.2;
  const Q = new URLSearchParams(location.search);
  const T = window.TIMING;
  T.frases.forEach((f) => { f.inicio += DESFASE; f.fin += DESFASE; f.palabras.forEach((w) => { w.i += DESFASE; w.f += DESFASE; }); });
  T.audio.duracion_s += DESFASE;
  const TT = tiempos6(T), P = TT.P, fin = TT.fin, ini = TT.ini;
  // como P, pero la palabra entera (P busca «contiene»: «me» encontraría «mezclan»)
  const PX = (id, palabra) => { const w = TT.FR[id].palabras.find((p) => norm6(p.p) === norm6(palabra)); if (!w) throw new Error(`No encuentro la palabra «${palabra}» en ${id}`); return w.i; };
  const prog = prog6, pasos = pasos6, salto = salto6, lim = lim6;
  const M = { suelo: 198, SX: 240, SY: 100, caja: 200, rotulo: [16, 16], titular: [176, 76], gato: [60, 104], asoma: [336, 99] };
  const SU = M.suelo;
  const T_ENTRADA = 2.2;

  // ---------- textos y piezas clave (globales; las posiciones del mundo son locales a cada bloque) ----------
  const T6 = crearTextos6({ interfaz: document.getElementById("textos"), mundo: document.getElementById("textos-mundo") });
  const CLAVES = [];
  const clave = (t, nombre) => { CLAVES.push({ t: Math.round(t * 1000) / 1000, nombre }); return t; };
  const EVENTOS = [];
  const sonido = (t, tipo) => { EVENTOS.push({ t: Math.round(t * 1000) / 1000, tipo }); return t; };

  // ======================================================================================================
  // BLOQUE 1 · Gancho (fr01-fr05): la tele del salón, la noticia con el anuncio y el robot que arranca
  // ======================================================================================================
  const B1 = (() => {
    const T_MINIS = P("fr01", "primero"), T_ROBOT = P("fr01", "robot"), T_AYER = P("fr01", "ayer"), T_TIENDA = P("fr01", "tienda");
    const T_COMPRASTE = P("fr02", "compraste"), T_NADIE = P("fr02", "nadie");
    const T_NOTICIAS = P("fr03", "noticias"), T_ANUNCIO = P("fr03", "anuncio"), T_MITAD = P("fr03", "mitad"), T_COMO = P("fr04", "como");
    const T_SEGUIR = P("fr05", "seguir"), T_PERSIGUE = P("fr05", "persigue"), T_FINAL = P("fr05", "final"), T_CAMBIARLO = P("fr05", "cambiarlo");
    clave(T_ROBOT, "miniatura del robot en la tele"); clave(T_COMPRASTE, "carrito vacío"); clave(T_ANUNCIO, "el robot dentro del artículo");
    clave(T_PERSIGUE, "el robot en marcha con su rastro");
    sonido(T_ROBOT, "seleccion"); sonido(T_AYER, "aparicion"); sonido(T_COMPRASTE, "error"); sonido(T_ANUNCIO, "aparicion"); sonido(T_COMO, "seleccion");
    sonido(T_FINAL, "tick");

    // 0 · el salón: la tele con la portada y, con «ayer», el móvil con la ficha de la tienda y el carrito vacío
    function salon(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { ventanas: [[392, 46, 52, 54]] });
      lamparaG(medio, brillo, x0 + 36, SU, t);
      calendarioG(medio, x0 + 78, 58, prog(t, T_AYER, T_AYER + 0.6));
      // mueble y tele grande
      caja5(medio, x0 + 140, 164, 200, 34, P6.CARTON); rect(medio, x0 + 150, 172, 80, 1, P6.CARTON[1]); rect(medio, x0 + 250, 172, 80, 1, P6.CARTON[1]);
      teleG(medio, brillo, x0 + 150, 36, 180, 116, t, { placa: "YOUTUBE", dentro: (sx, sy, sw, sh) => {
        const n = pasos(t, T_MINIS, T_MINIS + 1.2, 8) * 8;
        reproductorG(medio, brillo, sx, sy, sw, sh, t, { cuantas: Math.round(n), elegida: t >= T_ROBOT ? 5 : -1, robot: 5 });
      } });
      // planta a la derecha
      caja5(medio, x0 + 352, 176, 18, 22, P6.CARTON);
      [[361, 160, 8], [354, 168, 7], [368, 166, 7]].forEach(([x, y, r]) => { disco(medio, x0 + x, y, r + 1, GC); disco(medio, x0 + x, y, r, R5.verde[1]); disco(medio, x0 + x - 2, y - 2, r - 3, R5.verde[2]); });
      // «ayer»: el móvil con la ficha (el dedo pasa sin pulsar) y, con «compraste», el carrito vacío
      if (t >= T_AYER) {
        const y = 108 + (salto(t, T_AYER) || 0);
        movilG(frente, brillo, x0 + 392, y, 34, 58, { dentro: (sx, sy, sw, sh) => fichaTiendaG(frente, sx, sy, sw, sh, { boton: false }) });
        if (t >= T_TIENDA && t < T_COMPRASTE + 0.6) { // el dedo baja hacia el botón y se va sin pulsar
          const f = prog(t, T_TIENDA, T_COMPRASTE), dy = Math.round(Math.sin(f * Math.PI) * 10);
          rect(frente, x0 + 410, y + 60 - dy, 6, 14, GC); rect(frente, x0 + 411, y + 60 - dy, 4, 13, R5.piel[1]); rect(frente, x0 + 411, y + 60 - dy, 1, 13, R5.piel[2]);
        }
        if (t >= T_COMPRASTE) {
          const s = salto(t, T_COMPRASTE) || 0;
          carritoG(frente, x0 + 434, 150 + s);
          if (t >= T_NADIE) { const sy = 146 + (salto(t, T_NADIE) || 0); [[0, 0, 22, 18], [22, 0, 0, 18]].forEach(([a, b, c, d]) => { linea(frente, x0 + 430 + a, sy + b, x0 + 430 + c, sy + d, GC, 5); linea(frente, x0 + 430 + a, sy + b, x0 + 430 + c, sy + d, R5.naranja[2], 3); }); }
        }
      }
    }
    // 1 · la noticia: la tableta en el escritorio; con «anuncio», el hueco con el mismo robot; con «¿cómo?», la pregunta
    function noticia(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [[40, 44, 60, 60]] });
      caja5(medio, x0 + 96, 170, 290, 10, P6.CARTON); rect(medio, x0 + 110, 180, 6, 18, GC); rect(medio, x0 + 366, 180, 6, 18, GC);
      // taza humeante
      caja5(medio, x0 + 336, 156, 14, 14, ["#5a2a1a", "#8a3a22", "#c25e22", "#ff8a3d"]); rect(medio, x0 + 350, 159, 3, 6, GC);
      for (let k = 0; k < 3; k++) { const f = (t * 0.8 + k / 3) % 1; rect(medio, x0 + 340 + (k % 2) * 3, 150 - Math.round(f * 14), 1, 2, "#8a93a6"); }
      const scroll = t >= T_NOTICIAS ? Math.floor((t - T_NOTICIAS) * 8) : 0;
      const huecoVis = t >= T_ANUNCIO;
      tabletaNoticiasG(medio, brillo, x0 + 130, 40, 200, 128, t, { scroll: huecoVis ? Math.floor((T_ANUNCIO - T_NOTICIAS) * 8) : scroll,
        hueco: { visible: huecoVis, robot: t >= T_ANUNCIO + 0.15, y: 86 + (salto(t, T_ANUNCIO) || 0), h: 34 } });
      if (t >= T_MITAD) destello5(frente, brillo, x0 + 230, 103, t, T_MITAD, R5.naranja.concat("#fff1c4"));
      if (t >= T_COMO) interrogacionG(frente, x0 + 372, 54 + (salto(t, T_COMO) || 0), R5.naranja, 4);
    }
    // 2 · el viaje: el robot arranca y deja huellas hacia tres puertas; con «final», el panel de interruptores al fondo
    function viaje(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.hormigon, ventanas: [] });
      // tres puertas (los tres sistemas que vamos a ver): su lámpara se enciende cuando el robot pasa por delante
      const f = prog(t, T_SEGUIR, T_PERSIGUE + 1.2), rx = Math.round(x0 + 40 + f * 250);
      [110, 200, 290].forEach((px, k) => {
        puertaG(medio, x0 + px, SU - 4, { rampa: [P6.CARTON, R5.metal, ["#1d2f6b", "#3a5fc0", "#5b8cff", "#9fc4ff"]][k] });
        const on = rx > x0 + px + 10;
        rect(medio, x0 + px + 4, SU - 56, 14, 6, GC); rect(medio, x0 + px + 5, SU - 55, 12, 4, on ? P6.ORO[2] : "#2a2d38");
        if (on) for (let j = 0; j < 12; j += 2) rect(brillo, x0 + px + 6 - j, SU - 50 + j * 2, 10 + 2 * j, 2, "#3a2c1c");
      });
      // panel de interruptores (la promesa del final)
      if (t >= T_FINAL) {
        const y = 70 + (salto(t, T_FINAL) || 0);
        caja5(medio, x0 + 386, y, 52, 44, R5.metal);
        for (let k = 0; k < 3; k++) { rect(medio, x0 + 394 + k * 14, y + 10, 8, 22, GC); const on = t < T_CAMBIARLO + k * 0.25; rect(medio, x0 + 395 + k * 14, on ? y + 11 : y + 21, 6, 10, on ? R5.verde[2] : R5.naranja[2]); }
      }
      // el robot recorre el suelo dejando su rastro
      rastroG(frente, brillo, [[x0 + 20, SU - 2], [rx - 60, SU - 2]], t, 1);
      robotG(frente, brillo, rx - 60, SU - 31, t, { mueve: f > 0 && f < 1, e: 3 });
    }
    return { estaciones: [{ dib: salon, hasta: "fr02", extra: 0.3 }, { dib: noticia, hasta: "fr04", extra: 1.0 }, { dib: viaje, hasta: "fr05" }], zooms: [],
      rotulo: '¿Cómo lo <span class="clave">sabe</span>?' };
  })();

  // ======================================================================================================
  // BLOQUE 2 · ¿Me está escuchando? (fr06-fr14): el banco del parque, el laboratorio, el filtro y la pantalla
  // ======================================================================================================
  const B2 = (() => {
    const T_HABLAS = P("fr06", "hablas"), T_ANUNCIO = P("fr06", "anuncio");
    const T_UNIV = P("fr07", "universidad"), T_ANALIZ = P("fr08", "analizaron"), T_17 = P("fr08", "17260"), T_9 = P("fr08", "9100");
    const T_PUSIERON = P("fr08", "pusieron"), T_TOCABA = P("fr08", "tocaba"), T_REGISTR = P("fr08", "registraron");
    const T_BUSCABAN = P("fr09", "buscaban"), T_MICRO = P("fr09", "microfono");
    const T_NINGUNA = P("fr10", "ninguna");
    const T_CONVIRT = P("fr11", "convirtiera"), T_TEXTO = P("fr11", "texto"), T_VISTO = P("fr11", "visto"), T_VACIO = P("fr11", "vacio");
    const T_GRABABAN = P("fr12", "grababan"), T_MANDABAN = P("fr12", "mandaban"), T_CAPTURAS = P("fr13", "capturas"), T_APPSEE = P("fr13", "appsee");
    const T_PISTAS = P("fr14", "pistas");
    clave(T_HABLAS, "bocadillos con el robot"); clave(T_REGISTR, "paquetes subiendo a la nube"); clave(T_NINGUNA, "cajón del audio vacío");
    clave(T_CONVIRT, "el bocadillo que se vuelve hoja"); clave(T_GRABABAN, "la cámara que fotografía la pantalla"); clave(T_CAPTURAS, "la foto que vuela a Appsee");
    clave(T_PISTAS, "las migas que se encienden");
    sonido(T_HABLAS, "aparicion"); sonido(T_ANUNCIO, "seleccion"); sonido(T_REGISTR, "aparicion"); sonido(T_NINGUNA, "error");
    sonido(T_TEXTO, "aparicion"); sonido(T_VISTO, "seleccion"); sonido(T_VACIO, "acierto");
    sonido(T_GRABABAN, "destello"); sonido(T_CAPTURAS, "destello"); sonido(T_PISTAS, "tick");
    // la cifra va en la interfaz (no crece con el zoom), arriba a la derecha y sola
    T6.cifra(T_17, T_9, '17.260<span class="unidad">apps</span>', [2 * W + 228, 84], true); // en la pared del laboratorio: viaja con el zoom
    T6.cifra(T_9, fin("fr09") + 0.15 - 0.5, '9.100<span class="unidad">apps</span>', [2 * W + 228, 84], true);

    // 1 · la sospecha: dos personas en un banco del parque; bocadillos con el robot y el anuncio en el móvil
    function sospecha(L, x0, t) {
      const { medio, frente, brillo } = L;
      farola6(medio, brillo, x0 + 64, t, SU);
      [[300, 120], [40, 150]].forEach(([x, r], k) => { // árboles al fondo
        rect(medio, x0 + x - 3, SU - 60, 6, 60, GC); rect(medio, x0 + x - 2, SU - 60, 4, 60, P6.CARTON[1]);
        disco(medio, x0 + x, SU - 74, 26, GC); disco(medio, x0 + x, SU - 74, 25, R5.verde[0]); disco(medio, x0 + x - 6, SU - 80, 14, R5.verde[1]);
      });
      personaSentadaG(medio, x0 + 128, SU - 52, t, { camisa: R5.ia });
      personaSentadaG(medio, x0 + 182, SU - 52, t + 1.3, { camisa: [R5.verde[0], R5.verde[1], R5.verde[2]], pelo: ["#3a2216", "#6a4428", "#8a5a32"] });
      bancoParqueG(frente, x0 + 116, SU, 112);
      if (t >= T_HABLAS) { bocadilloRobotG(frente, x0 + 98, 90 + (salto(t, T_HABLAS) || 0), "der"); if (t >= T_HABLAS + 0.5) bocadilloRobotG(frente, x0 + 196, 84 + (salto(t, T_HABLAS + 0.5) || 0), "izq"); }
      // el móvil, en la mano de la persona de la izquierda: vibra y enseña el anuncio del robot
      const vib = t >= T_ANUNCIO - 0.3 && t < T_ANUNCIO + 0.3 ? (Math.floor(t * 20) % 2 ? 1 : -1) : 0;
      movilG(frente, brillo, x0 + 150 + vib, SU - 58, 26, 44, { on: t >= T_ANUNCIO - 0.3, dentro: (sx, sy, sw, sh) => {
        if (t >= T_ANUNCIO) { rect(frente, sx, sy + 6, sw, 18, "#26304a"); rect(frente, sx, sy + 20, sw, 4, G.SUELO[2]); miniRobotG(frente, sx + 4, sy + 14); rect(frente, sx + 2, sy + 28, sw - 4, 4, R5.naranja[2]); }
      } });
      if (t >= T_ANUNCIO) destello5(frente, brillo, x0 + 163, SU - 36, t, T_ANUNCIO, R5.naranja.concat("#fff1c4"));
    }
    // 2 · el laboratorio (zoom núcleo): la facultad y, dentro, cinco móviles probando apps con un dedo mecánico; los
    //     paquetes que envían suben a la nube y, con «audio», una lupa los repasa
    function laboratorio(L, x0, t) {
      const { medio, frente, brillo } = L;
      facultadG(medio, x0 + 22, 56, 150, SU, { placa: t >= T_PUSIERON + 0.2 && t < fin("fr09") + 0.15 - 0.5 ? null /* vuelve con el corte a plano general */ : "NORTHEASTERN" });
      habitacionG(medio, x0, SU, { pared: G.LAB, desde: 196, ancho: 270, ventanas: [[396, 40, 44, 40]], suelo: ["#0d1418", "#16242f", "#22545a"] });
      const BX = x0 + 220, BY = SU - 62, n = 5, paso = 32;
      const activo = t >= T_ANALIZ ? Math.floor(t * 1.6) % n : -1;
      bancoMovilesG(medio, brillo, BX, BY, n, t, { activo });
      // el dedo va de móvil en móvil y toca a escalones
      if (activo >= 0) dedoMecanicoG(frente, BX + activo * paso + 11, 34, BY + 8, (t * 1.6) % 1 < 0.5 ? 1 : 0);
      rect(frente, BX - 10, 26, 180, 4, GC); rect(frente, BX - 9, 27, 178, 2, R5.metal[2]); // carril del dedo
      // ordenador que registra
      monitor5(medio, x0 + 400, SU - 54, 44, 32, t, R5.verde[2], 4); caja5(medio, x0 + 396, SU - 20, 52, 6, R5.metal);
      for (let k = 0; k < n; k++) rect(medio, BX + k * paso + 11, SU - 20, 1, 4, GC);
      rect(medio, BX + 11, SU - 17, x0 + 420 - (BX + 11), 1, GC);
      // paquetes que suben de los móviles a la nube (desde «registraron» todos; antes, alguno suelto)
      nubeG(medio, brillo, x0 + 234, 40);
      const flujo = t >= T_REGISTR ? 1 : t >= T_ANALIZ ? 0.35 : 0;
      for (let k = 0; k < 10; k++) {
        if (k / 10 >= flujo) break;
        const f = (t * 0.45 + k * 0.137) % 1, m = (k * 3) % n, px = BX + m * paso + 8, tx = x0 + 246 + (k % 3) * 8;
        const x = Math.round(px + (tx - px) * f), y = Math.round(BY - 4 + (60 - BY) * f);
        paqueteG(frente, x, y, k % 3 === 0 ? "texto" : "imagen");
      }
      if (t >= T_BUSCABAN) lupa6(frente, brillo, x0 + 300 + Math.round(Math.sin(t * 2) * 10), 92, 9, t);
      if (t >= T_MICRO) { // un micrófono tachado sobre la lupa: lo que buscaban
        const y = 66 + (salto(t, T_MICRO) || 0);
        rect(frente, x0 + 296, y, 8, 12, GC); rect(frente, x0 + 297, y + 1, 6, 10, R5.naranja[2]); rect(frente, x0 + 297, y + 1, 2, 10, R5.naranja[3]);
      }
    }
    // 3 · el filtro: los paquetes caen por el embudo a los cajones; el del audio sigue vacío y el micrófono, apagado.
    //     Luego el límite: un bocadillo se vuelve hoja de texto y pasa sin que el filtro lo marque
    function filtro(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: G.LAB, ventanas: [[400, 44, 44, 40]], suelo: ["#0d1418", "#16242f", "#22545a"] });
      const FX = x0 + 148, FY = 34;
      const parpadeo = t >= T_VISTO - 0.4 && t < T_VISTO + 0.8;
      const F = filtroMicrofonoG(medio, brillo, FX, FY, t, { piloto: false, parpadeo });
      const entrada = [FX + 92, FY + 60]; // centro de la boca de arriba del embudo
      // tubería que trae los paquetes desde la izquierda hasta la boca del embudo
      rect(medio, x0 + 24, FY + 54, FX + 60 - x0 - 24, 8, GC); rect(medio, x0 + 25, FY + 55, FX + 58 - x0 - 24, 6, R5.metal[1]); rect(medio, x0 + 25, FY + 55, FX + 58 - x0 - 24, 1, R5.metal[3]);
      const tramo = (a, b, f) => [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f)];
      for (let k = 0; k < 6; k++) { // paquetes de imagen y de texto: llegan por la tubería y bajan por el embudo a su cajón
        const f = (t * 0.4 + k / 6) % 1, tipo = k % 2 ? "texto" : "imagen", cj = F.cajon(tipo === "texto" ? 1 : 0);
        const p = f < 0.45 ? tramo([x0 + 28, FY + 48], entrada, f / 0.45) : f < 0.7 ? tramo(entrada, F.boca, (f - 0.45) / 0.25) : tramo(F.boca, [cj[0], cj[1] - 6], (f - 0.7) / 0.3);
        paqueteG(frente, p[0] - 4, p[1] - 4, tipo);
      }
      // los cajones de imagen y texto se van llenando; el del audio, vacío
      [0, 1].forEach((k) => { const [cx, cy] = F.cajon(k); for (let j = 0; j < 3; j++) paqueteG(medio, cx - 18 + j * 12, cy, k ? "texto" : "imagen"); });
      // el límite: el bocadillo aparece a la izquierda, se vuelve hoja con «texto» y entra en el cajón del texto sin marca
      if (t >= T_CONVIRT - 0.6 && t < T_VISTO + 0.5) {
        const m = prog(t, T_CONVIRT - 0.6, T_TEXTO), viajeF = prog(t, T_TEXTO + 0.3, T_VISTO);
        const p = viajeF < 0.6 ? tramo([x0 + 48, 72], [entrada[0] - 15, entrada[1] - 30], viajeF / 0.6) : tramo([entrada[0] - 15, entrada[1] - 30], [F.cajon(1)[0] - 15, F.cajon(1)[1] - 20], (viajeF - 0.6) / 0.4);
        bocadilloHojaG(frente, p[0], p[1], m >= 1 ? 1 : 0);
      }
      if (t >= T_VISTO + 0.5) { const [cx, cy] = F.cajon(1); caja5(frente, cx + 14, cy - 10, 12, 14, G.PAPEL); rect(frente, cx + 16, cy - 6, 8, 1, G.TEXTO_GRIS); }
      // al final, el cajón del audio sigue vacío: check verde encima
      if (t >= T_VACIO) cheque6(frente, F.cajon(2)[0] - 6, F.cajon(2)[1] - 36 + (salto(t, T_VACIO) || 0));
    }
    T6.cifra(T_NINGUNA, fin("fr10") + 0.15 + 0.3, '0<span class="unidad">audio</span>', [300, 18]);
    // 4 · la pantalla: una app de reparto con una cámara diminuta que fotografía la pantalla; la foto vuela a otra empresa
    function pantalla(L, x0, t) {
      const { medio, frente, brillo } = L;
      oficinasG(medio, x0 + 300, 70, 120, SU, "APPSEE");
      farola6(medio, brillo, x0 + 270, t, SU);
      const { sx, sy, sw, sh } = movilG(medio, brillo, x0 + 120, 34, 74, 140, { dentro: (sx, sy, sw, sh) => {
        rect(medio, sx, sy, sw, 16, "#13362a"); placa6(medio, sx + 4, sy + 2, "GOPUFF", { color: "#f5f7fb", fondo: "#0d5a42" });
        for (let k = 0; k < 4; k++) { const y = sy + 22 + k * 24; caja5(medio, sx + 4, y, sw - 8, 20, ["#141c2c", "#1a2438", "#22304a", "#2c3c5c"]); motoG(medio, sx + 8, y + 6); rect(medio, sx + 28, y + 6, sw - 38, 2, "#4a5774"); rect(medio, sx + 28, y + 11, 18, 2, P6.ORO[2]); }
      } });
      // la cámara, asomada al borde de la pantalla
      const capturas = [T_GRABABAN, T_MANDABAN, T_CAPTURAS, T_CAPTURAS + 1.4, T_APPSEE + 1.6];
      if (t >= T_GRABABAN - 0.4) camaritaG(frente, brillo, sx + sw - 4, sy + 10 + (salto(t, T_GRABABAN - 0.4) || 0), t, capturas.some((tc) => t >= tc && t < tc + 0.2));
      // cada «captura»: destello y una foto que vuela en arco hasta la puerta del edificio, donde se apilan
      const destino = [x0 + 342, SU - 16];
      capturas.forEach((tc, k) => {
        if (t < tc) return;
        destello5(frente, brillo, sx + Math.floor(sw / 2), sy + Math.floor(sh / 2), t, tc, ["#3a3f4c", "#8a93a6", "#c4cae0", "#e4e8f0", "#ffffff"]);
        const f = prog(t, tc + 0.2, tc + 1.3), ox = sx + sw + 4, oy = sy + 20;
        if (f < 1) fotoG(frente, Math.round(ox + (destino[0] - ox) * f), Math.round(oy + (destino[1] - k * 4 - oy) * f - Math.sin(f * Math.PI) * 36));
        else fotoG(frente, destino[0] + (k % 2) * 6, destino[1] - k * 4);
      });
    }
    // 5 · pistas de sobra: el robot junto a un camino de migas que se encienden una a una
    function pistas(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.hormigon, ventanas: [[60, 48, 56, 50]] });
      robotG(frente, brillo, x0 + 50, SU - 31, t, { e: 3 });
      const migas = [[160, 188], [190, 183], [220, 188], [250, 181], [282, 187], [314, 180], [346, 186], [378, 179], [410, 185], [440, 178]];
      migas.forEach(([x, y], k) => migaG(frente, brillo, x0 + x, y, t, t >= T_PISTAS + k * 0.12, k));
    }
    return { estaciones: [{ dib: sospecha, hasta: "fr06", extra: 1.0 }, { dib: laboratorio, hasta: "fr09" }, { dib: filtro, hasta: "fr11" },
      { dib: pantalla, hasta: "fr13" }, { dib: pistas, hasta: "fr14" }],
      zooms: [{ est: 2, desde: T_PUSIERON, cx: 300, cy: 112 }],   // est cuenta la copia de la estación anterior (0)
      rotulo: '¿Te <span class="clave">escucha</span>?', momento: { pose: "pensar" } };
  })();

  // ======================================================================================================
  // BLOQUE 3 · El rastro (fr15-fr21): la búsqueda y el archivador, la casilla de Chrome y el mapa de islas con el faro
  // ======================================================================================================
  const B3 = (() => {
    const T_BUSCARAS = P("fr15", "buscaras"), T_GUARDA = P("fr16", "guarda"), T_ACTIV = P("fr16", "actividad"), T_BUSCAS = P("fr16", "buscas");
    const T_MAPS = P("fr16", "maps"), T_IDIOMA = P("fr16", "idioma"), T_DISPO = P("fr16", "dispositivo"), T_CONECTAS = P("fr16", "conectas");
    const T_CASILLA = P("fr17", "casilla"), T_MARCADA = P("fr17", "marcada"), T_CHROME = P("fr17", "chrome");
    const T_WEBS = P("fr18", "webs"), T_ANUNCIOS = P("fr18", "anuncios"), T_DEDUCIR = P("fr19", "deducir");
    const T_TODO = P("fr20", "todo"), T_BUSCADOR = P("fr20", "buscador"), T_YT = P("fr20", "youtube"), T_CHROME20 = P("fr20", "chrome"), T_WEBS20 = P("fr20", "webs");
    const T_TIENDA = P("fr21", "tienda"), T_ETIQUETA = P("fr21", "etiqueta"), T_CODIGO = P("fr21", "codigo");
    clave(T_GUARDA, "la búsqueda entra en el archivador"); clave(T_MARCADA, "la casilla marcada abre el cajón"); clave(T_DEDUCIR, "las fichas forman el robot");
    clave(T_WEBS20, "los puentes de luz al faro"); clave(T_ETIQUETA, "la pegatina de la tienda con su hilo");
    sonido(T_BUSCARAS, "aparicion"); sonido(T_GUARDA, "seleccion"); sonido(T_MARCADA, "acierto"); sonido(T_CHROME, "aparicion"); sonido(T_DEDUCIR, "seleccion");
    sonido(T_BUSCADOR, "tick"); sonido(T_WEBS20, "tick"); sonido(T_ETIQUETA, "aparicion");
    const ARCH = ["lupa", "mapa", "globo", "movil", "chincheta"];
    const abiertosEn = (t) => [T_GUARDA, T_MAPS, T_IDIOMA, T_DISPO, T_CONECTAS].map((a, k) => (t >= a ? k : -1)).filter((k) => k >= 0);
    T6.identificador(T_ACTIV, fin("fr16") + 0.15, "Actividad", [W + 318, 24]);
    T6.identificador(T_ETIQUETA, fin("fr21") + 0.15 - 0.5, "Etiqueta", [3 * W + 344, 58]);

    // 1 · la búsqueda: la ventana del buscador con el robot escrito y, con «guarda», la ficha que vuela al archivador
    function busqueda(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [] });
      caja5(medio, x0 + 40, 166, 230, 10, P6.CARTON); rect(medio, x0 + 52, 176, 6, 22, GC); rect(medio, x0 + 252, 176, 6, 22, GC);
      lamparaG(medio, brillo, x0 + 22, SU, t);
      const V = ventanaG(medio, brillo, x0 + 64, 44, 180, 118, { placa: "GOOGLE" });
      barraBusquedaG(medio, V.ix + 14, V.iy + 14, V.iw - 28, prog(t, T_BUSCARAS - 0.3, T_BUSCARAS + 0.8));
      if (t >= T_BUSCARAS + 0.8) for (let k = 0; k < 4; k++) if (t >= T_BUSCARAS + 0.8 + k * 0.2) { const y = V.iy + 36 + k * 16; rect(medio, V.ix + 14, y, 50, 2, R5.ia[3]); rect(medio, V.ix + 14, y + 4, 110, 1, "#3a4560"); rect(medio, V.ix + 14, y + 7, 80, 1, "#3a4560"); }
      const A = archivadorG(medio, brillo, x0 + 322, 40, t, { iconos: ARCH, abiertos: abiertosEn(t) });
      // la ficha de la búsqueda vuela en arco al cajón de la lupa
      const f = prog(t, T_GUARDA - 0.5, T_GUARDA + 0.2);
      if (f > 0 && f < 1) { const sx = V.ix + 60, sy = V.iy + 20, dx = x0 + 352, dy = 48; fichaG(frente, Math.round(sx + (dx - sx) * f), Math.round(sy + (dy - sy) * f - Math.sin(f * Math.PI) * 30)); }
    }
    // 2 · la casilla: se marca y abre un cajón de más por el que entran las pestañas del navegador; las webs con el puntito de
    //     Google se encienden; con «deducir», las fichas forman la silueta del robot
    function casilla(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [] });
      const ext = prog(t, T_MARCADA, T_MARCADA + 0.4);
      const A = archivadorG(medio, brillo, x0 + 40, 34, t, { iconos: ARCH, abiertos: [0, 1, 2, 3, 4], extra: t >= T_MARCADA ? ext : 0 });
      if (t >= T_CASILLA) casillaG(frente, brillo, x0 + 132, 128 + (salto(t, T_CASILLA) || 0), t >= T_MARCADA);
      const V = ventanaG(medio, brillo, x0 + 196, 40, 120, 76, { placa: "CHROME" });
      for (let k = 0; k < 3; k++) pestanaG(medio, V.ix + 6 + k * 24, V.iy + 4, [R5.ia, R5.verde, P6.ORO.concat(["#fff1c4"])][k]);
      rect(medio, V.ix + 6, V.iy + 18, V.iw - 12, 36, "#16203a");
      // las pestañas vuelan al cajón de más
      for (let k = 0; k < 3; k++) { const f = prog(t, T_CHROME + k * 0.25, T_CHROME + k * 0.25 + 0.7); if (f > 0 && f < 1) pestanaG(frente, Math.round(V.ix + 6 + k * 24 + (x0 + 60 - V.ix - 6 - k * 24) * f), Math.round(V.iy + 4 + (34 + 5 * 21 + 8 - V.iy - 4) * f - Math.sin(f * Math.PI) * 20)); }
      // fila de webs: las del puntito de Google se encienden con «webs»; las de anuncios, con «anuncios»
      const webs = [[330, 34, true, false], [366, 34, false, false], [402, 34, true, true], [330, 64, true, true], [366, 64, false, true], [402, 64, true, false], [438, 49, false, false]];
      webs.forEach(([x, y, punto, anuncio]) => webG(medio, brillo, x0 + x, y, { punto, anuncio, luz: punto && (t >= T_WEBS && (!anuncio || t >= T_ANUNCIOS)) }));
      // con «deducir»: fichas que salen del archivador y forman el robot
      if (t >= T_DEDUCIR - 0.3) {
        const cx = x0 + 300, cy = 160, puntos = [];
        for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; puntos.push([Math.round(cx + Math.cos(a) * 44) - 5, Math.round(cy + Math.sin(a) * 12) - 4]); }
        puntos.forEach(([px, py], k) => { const f = prog(t, T_DEDUCIR - 0.3 + k * 0.05, T_DEDUCIR + 0.4 + k * 0.05); const ox = x0 + 100, oy = 60; if (f > 0) fichaG(frente, Math.round(ox + (px - ox) * f), Math.round(oy + (py - oy) * f)); });
        if (t >= T_DEDUCIR + 1.2) { rect(frente, cx - 40, cy - 2, 80, 4, GC); rect(frente, cx - 39, cy - 1, 78, 2, R5.naranja[2]); destello5(frente, brillo, cx, cy, t, T_DEDUCIR + 1.2, R5.naranja.concat("#fff1c4")); }
      }
    }
    // 3 · el mapa (zoom núcleo en la tienda): islas de internet; las que pasan por servicios de Google tienden un puente de luz
    //     al faro; las demás siguen a oscuras. Con «etiqueta», la pegatina de la tienda se enciende
    function mapa(L, x0, t) {
      const { medio, frente, brillo } = L;
      rect(medio, x0 + 6, 28, 468, SU - 28, "#0b1424"); rect(medio, x0 + 6, 28, 468, 1, "#1d2f4a");
      for (let k = 0; k < 40; k++) { const x = x0 + 14 + ((k * 53) % 450), y = 40 + ((k * 37) % 150), d = Math.floor(t * 2 + k) % 3; rect(medio, x + d, y, 6, 1, "#16243c"); }
      const FX = x0 + 236, FB = 150;
      const islas = [["buscador", 90, 74, T_BUSCADOR], ["reproductor", 128, 150, T_YT], ["navegador", 344, 150, T_CHROME20], ["tienda", 392, 70, T_WEBS20]];
      islas.forEach(([tipo, x, y, ta]) => puenteG(medio, brillo, x0 + x, y + 6, FX, FB - 66, prog(t, ta, ta + 0.5)));
      [[52, 140], [196, 172], [440, 160], [300, 54]].forEach(([x, y]) => islaG(medio, brillo, x0 + x, y, "oscura"));
      faroG(medio, brillo, FX, FB, t);
      islas.forEach(([tipo, x, y, ta]) => islaG(medio, brillo, x0 + x, y, tipo, { luz: t >= ta, pegatina: tipo === "tienda" && t >= T_ETIQUETA, t }));
      if (t >= T_ETIQUETA) { rect(brillo, x0 + 404, 46, 4, 4, R5.ia[2]); ruta5(medio, brillo, [[x0 + 407, 48], [x0 + 407, 30], [FX, 30], [FX, FB - 72]], t, 0, prog(t, T_ETIQUETA, T_ETIQUETA + 0.6)); }
      if (t >= T_CODIGO) { const y = 92; rect(frente, x0 + 418, y, 30, 18, GC); rect(frente, x0 + 419, y + 1, 28, 16, "#0c1016"); for (let j = 0; j < 4; j++) rect(frente, x0 + 422 + (j % 2) * 4, y + 4 + j * 3, 14 - j * 2, 1, R5.ia[3]); }
    }
    return { estaciones: [{ dib: busqueda, hasta: "fr16" }, { dib: casilla, hasta: "fr19" }, { dib: mapa, hasta: "fr21" }],
      zooms: [{ est: 3, desde: T_TIENDA, cx: 330, cy: 96 }], rotulo: 'El <span class="clave">rastro</span>', momento: { pose: "senalar" } };
  })();

  // ======================================================================================================
  // BLOQUE 4 · Lo que te recomiendan (fr22-fr37): la cuenta llega a YouTube, el embudo, reloj contra clic, el 20 %, las
  // señales, la gente parecida y Discover
  // ======================================================================================================
  const B4 = (() => {
    const T_CUENTA = P("fr23", "cuenta"), T_RECOM = P("fr23", "recomienda"), T_YACUENTA = P("fr23", "ya");
    const T_2016 = P("fr24", "2016"), T_EMBUDO = P("fr24", "embudo"), T_PRIMER = P("fr25", "primer"), T_MILLONES = P("fr25", "millones"), T_CIENTOS = P("fr25", "cientos");
    const T_VISTO = P("fr25", "visto"), T_BUSCADO = P("fr25", "buscado"), T_REGION = P("fr25", "region"), T_DISPO = P("fr25", "dispositivo"), T_EDAD = P("fr25", "edad");
    const T_ORDENA = P("fr26", "ordena"), T_DOCENAS = P("fr26", "docenas"), T_PANTALLA = P("fr26", "pantalla");
    const T_CLIC = P("fr27", "clic"), T_TIEMPO = P("fr27", "tiempo"), T_ENGAN = P("fr28", "enganosos"), T_CLICKBAIT = P("fr28", "clickbait");
    const T_2011 = P("fr29", "2011"), T_2012 = P("fr29", "2012"), T_CAYERON = P("fr29", "cayeron"), T_ASUMIERON = P("fr29", "asumieron");
    const T_SENALES = P("fr30", "senales"), T_S = ["clics", "tiempo", "encuestas", "compartidos", "me", "no"].map((w) => PX("fr30", w)), T_80 = P("fr30", "80000");
    const T_ENCUESTAS = P("fr31", "encuestas"), T_ESTRELLAS = P("fr31", "estrellas");
    const T_COMPARAN = P("fr32", "comparan"), T_TRUCOS = P("fr33", "trucos"), T_SALGA = P("fr33", "salga"), T_RECOS = P("fr34", "recomendaciones");
    const T_ARTICULOS = P("fr35", "articulos"), T_DISCOVER = P("fr35", "discover"), T_GUARDA = P("fr36", "guarda"), T_UBIC = P("fr36", "ubicacion"), T_COMPARATIVA = P("fr37", "comparativa");
    clave(T_RECOM, "la miniatura del robot en la tele"); clave(T_CIENTOS, "el primer piso deja pasar unos pocos"); clave(T_DOCENAS, "la fila ordenada");
    clave(T_TIEMPO, "la balanza se inclina al reloj"); clave(T_ENGAN, "las miniaturas engañosas caen"); clave(T_CAYERON, "el contador baja");
    clave(T_S[0], "las palancas de las señales"); clave(T_TRUCOS, "la escoba salta de tele en tele"); clave(T_RECOS, "el chorro grueso de las recomendaciones");
    clave(T_GUARDA, "la ficha entra en Discover"); clave(T_COMPARATIVA, "la tarjeta de la comparativa");
    sonido(T_CUENTA, "aparicion"); sonido(T_RECOM, "seleccion"); sonido(T_MILLONES, "aparicion"); sonido(T_DOCENAS, "tick"); sonido(T_TIEMPO, "seleccion");
    sonido(T_ENGAN, "error"); sonido(T_CAYERON, "error"); T_S.forEach((t) => sonido(t, "tick")); sonido(T_TRUCOS, "aparicion"); sonido(T_SALGA, "seleccion");
    sonido(T_GUARDA, "aparicion"); sonido(T_COMPARATIVA, "acierto");
    T6.cifra(T_CAYERON, fin("fr29") + 0.15 + 1.0, '-20 %<span class="unidad">vistas</span>', [236, 18]); // sin rozar la ventana
    // sin cifra para los 80.000 millones: el lint la da por transcripción de la voz (80 y 000 están en la frase); lo cuenta
    // el mar de puntos de luz, que se llena con «señales» y se vuelve más denso con la cifra

    // 1 · la cuenta cuenta: el archivador manda una ficha por un tubo a la tele; la miniatura del robot se enciende
    function cuenta(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { ventanas: [[420, 46, 40, 50]] });
      archivadorG(medio, brillo, x0 + 40, 60, t, { iconos: ["lupa", "mapa", "globo", "movil", "chincheta"], abiertos: [0, 1, 2, 3, 4] });
      caja5(medio, x0 + 210, 162, 196, 36, P6.CARTON);
      tuboG(medio, brillo, [[x0 + 72, 58], [x0 + 72, 36], [x0 + 190, 36], [x0 + 190, 96], [x0 + 214, 96]], prog(t, T_CUENTA, T_CUENTA + 1.3));
      teleG(medio, brillo, x0 + 214, 40, 180, 114, t, { placa: "YOUTUBE", dentro: (sx, sy, sw, sh) => reproductorG(medio, brillo, sx, sy, sw, sh, t, { elegida: t >= T_RECOM ? 5 : -1, robot: t >= T_CUENTA + 1.3 ? 5 : -1, semilla: 11 }) });
      if (t >= T_YACUENTA) destello5(frente, brillo, x0 + 330, 90, t, T_YACUENTA, R5.naranja.concat("#fff1c4"));
    }
    // 2 · el embudo de dos pisos (zoom núcleo): millones de miniaturas, unos cientos, unas docenas en fila hacia tu tele
    function embudo(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.hormigon, ventanas: [] });
      // caldera con la placa del año del artículo
      caja5(medio, x0 + 46, 96, 54, 102, R5.metal); disco(medio, x0 + 73, 136, 14, GC); disco(medio, x0 + 73, 136, 12, R5.metal[1]);
      for (let k = 0; k < 4; k++) rect(medio, x0 + 66 + k * 4, 128, 2, 16, Math.floor(t * 6 + k) % 3 ? R5.naranja[1] : R5.naranja[3]);
      placa6(medio, x0 + 52, 104, "2016", { color: "#f5f7fb", fondo: "#0c1016" });
      embudoDosPisosG(medio, brillo, x0 + 150, 38, t, { lluvia: prog(t, T_MILLONES - 0.3, T_MILLONES + 0.7), piso1: t >= T_CIENTOS ? 1 : 0, piso2: prog(t, T_ORDENA, T_DOCENAS + 0.4) });
      // lo que mira el primer paso: iconos que entran en el embudo
      [["ojo", T_VISTO], ["lupa", T_BUSCADO], ["mapa", T_REGION], ["movil", T_DISPO], ["edad", T_EDAD]].forEach(([ic, ta], k) => {
        if (t < ta) return;
        const x = x0 + 110, y = 46 + k * 16 + (salto(t, ta) || 0);
        iconoG(frente, x, y, ic); rect(frente, x + 12, y + 4, 14 + (k % 2) * 4, 2, R5.ia[2]);
      });
      // tu tele, a la derecha, recibe la fila
      teleG(medio, brillo, x0 + 330, 104, 70, 48, t, { dentro: (sx, sy, sw, sh) => { const n = Math.round(prog(t, T_DOCENAS, T_PANTALLA + 0.5) * 6); for (let k = 0; k < n; k++) rect(medio, sx + 3 + (k % 3) * 20, sy + 3 + Math.floor(k / 3) * 18, 17, 14, [R5.ia, R5.verde, P6.ORO][k % 3][1]); } });
    }
    // 3 · reloj contra clic: la balanza se inclina hacia el reloj de arena; las miniaturas engañosas caen al vacío
    function reloj(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.hormigon, ventanas: [[400, 44, 44, 44]] });
      // mientras «duda» (antes del veredicto) la balanza oscila y el cursor se mece: sin esto el tramo queda congelado
      const duda = 0.45 * Math.sin(t * 3.9) * (1 - prog(t, T_TIEMPO, T_TIEMPO + 0.5));
      const inc = duda + (t < T_CLIC ? 0 : t < T_TIEMPO ? -0.6 * prog(t, T_CLIC, T_CLIC + 0.4) : -0.6 + 1.6 * prog(t, T_TIEMPO, T_TIEMPO + 0.5));
      const B = balanzaG(medio, x0 + 194, 70, inc);
      cursorG(frente, B.izq[0] - 5 + Math.round(Math.sin(t * 5.3) * 3), B.izq[1] - 16); relojArenaG(frente, B.der[0] - 7, B.der[1] - 21, t);
      // estante con miniaturas engañosas (cara de sorpresa): con «engañosos» se caen a un pozo
      caja5(medio, x0 + 40, 74, 100, 6, P6.CARTON); rect(medio, x0 + 38, 168, 104, 30, GC); rect(medio, x0 + 40, 170, 100, 28, "#05070b"); rect(medio, x0 + 40, 170, 100, 5, "#141a26"); rect(medio, x0 + 40, 175, 100, 2, "#0c1016");
      for (let k = 0; k < 13; k++) rect(medio, x0 + 38 + k * 8, 166, 4, 3, k % 2 ? GC : P6.ORO[2]);
      for (let k = 0; k < 4; k++) {
        const f = prog(t, T_ENGAN + k * 0.2, T_ENGAN + k * 0.2 + 0.8), x = x0 + 46 + k * 24, y = 52 + Math.round(f * f * 110);
        if (f >= 1) continue;
        rect(frente, x, y, 20, 14, GC); rect(frente, x + 1, y + 1, 18, 12, R5.naranja[1]); disco(frente, x + 10, y + 7, 3, P6.ORO[2]); rect(frente, x + 9, y + 8, 2, 2, GC); rect(frente, x + 7, y + 5, 1, 1, GC); rect(frente, x + 12, y + 5, 1, 1, GC);
      }
      if (t >= T_CLICKBAIT) destello5(frente, brillo, x0 + 90, 176, t, T_CLICKBAIT, R5.naranja.concat("#fff1c4"));
    }
    // 4 · el 20 %: el calendario pasa de 2011 a 2012 y el contador de visualizaciones baja; una figura se encoge de hombros
    function veinte(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.oficina.slice(0, 4).concat([R5.oficina[3]]), ventanas: [[400, 44, 44, 44]] });
      calendarioG(medio, x0 + 70, 60, prog(t, T_2012 - 0.4, T_2012 + 0.2));
      placa6(medio, x0 + 66, 106, t >= T_2012 ? "2012" : "2011", { color: "#f5f7fb", fondo: "#0c1016" });
      contadorG(medio, x0 + 180, 70, t < T_CAYERON ? 1 : 1 - 0.2 * prog(t, T_CAYERON, T_CAYERON + 0.6), t);
      persona5(medio, x0 + 300, 112, t, { camisa: R5.ia });
      rect(medio, x0 + 301, 146, 24, 52, GC); rect(medio, x0 + 302, 146, 22, 51, R5.ia[0]); rect(medio, x0 + 302, 146, 7, 51, R5.ia[1]);
      if (t >= T_ASUMIERON) { const s = Math.floor((t - T_ASUMIERON) * 4) % 2; rect(medio, x0 + 292, 140 - s * 3, 8, 3, R5.ia[1]); rect(medio, x0 + 326, 140 - s * 3, 8, 3, R5.ia[1]); }
      caja5(medio, x0 + 160, 164, 120, 34, P6.CARTON);
    }
    // 5 · las señales: seis palancas que se mueven al nombrarlas; un mar de puntitos de luz al fondo; la encuesta de estrellas
    function senales(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.hormigon, ventanas: [] });
      const az = mulberry32(17), n = t >= T_80 ? 420 : t >= T_SENALES ? 120 : 30;
      for (let k = 0; k < n; k++) { const x = x0 + 24 + Math.floor(az() * 430), y = 28 + Math.floor(az() * 52); if (Math.floor(t * 3 + k) % 4) rect(medio, x, y, 1, 1, k % 3 ? R5.ia[3] : P6.ORO[2]); }
      if (t >= T_80) destello5(frente, brillo, x0 + 240, 50, t, T_80, P6.ORO.concat(["#fff1c4", "#ffffff"]));
      caja5(medio, x0 + 70, 84, 250, 84, R5.metal); rect(medio, x0 + 76, 90, 238, 72, "#141a26");
      ["clic", "reloj", "estrella", "flecha", "pulgar", "abajo"].forEach((ic, k) => palancaG(frente, x0 + 92 + k * 38, 98, prog(t, T_S[k], T_S[k] + 0.25), ic, t >= T_S[k]));
      caja5(medio, x0 + 336, 96, 104, 48, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]);
      rect(medio, x0 + 342, 102, 60, 3, "#4a5774");
      const llenas = t < T_ENCUESTAS ? 0 : Math.round(prog(t, T_ENCUESTAS, T_ESTRELLAS + 0.3) * 5);
      for (let k = 0; k < 5; k++) iconoG(frente, x0 + 342 + k * 19, 116, "estrella", k < llenas);
    }
    // 6 · gente parecida: tres personas con su tele; la escoba salta de tele en tele hasta la tuya; los chorros de lo que ves
    function parecida(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { ventanas: [] });
      const mini = (k) => (t >= T_TRUCOS + k * 0.6 ? "escoba" : "robot");
      personaTeleG(medio, brillo, x0 + 30, SU, t, { camisa: R5.verde, mini: mini(0), semilla: 0.4 });
      personaTeleG(medio, brillo, x0 + 160, SU, t, { camisa: ["#5a1e4a", "#8a2e6a", "#c04a90"], mini: mini(1), semilla: 1.7 });
      personaTeleG(medio, brillo, x0 + 330, SU, t, { camisa: R5.ia, mini: t >= T_SALGA ? "escoba" : "robot", semilla: 2.9 });
      if (t >= T_COMPARAN) for (let x = x0 + 110; x < x0 + 330; x += 8) rect(frente, x, 116, 4, 1, Math.floor(t * 4 + x / 8) % 2 ? R5.ia[3] : R5.ia[1]);
      if (t >= T_RECOS) { // de dónde sale lo que ves: el chorro de las recomendaciones, mucho más grueso
        const y0 = 34 + (salto(t, T_RECOS) || 0);
        chorroG(medio, x0 + 60, y0, x0 + 400, 12, t, R5.naranja, 0); iconoG(medio, x0 + 44, y0 - 5, "play");
        chorroG(medio, x0 + 60, y0 + 18, x0 + 400, 3, t, R5.ia, 3); iconoG(medio, x0 + 44, y0 + 13, "estrella");
        chorroG(medio, x0 + 60, y0 + 30, x0 + 400, 3, t, R5.verde, 7); iconoG(medio, x0 + 44, y0 + 25, "lupa");
        caja5(medio, x0 + 400, y0 - 10, 30, 46, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]); rect(medio, x0 + 404, y0 - 6, 22, 38, G.PANTALLA[1]);
      }
    }
    // 7 · Discover: el móvil con tarjetas que suben solas; entra la ficha de la cuenta, la chincheta y la comparativa
    function discover(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [[380, 46, 56, 56]] });
      archivadorG(medio, brillo, x0 + 40, 60, t, { iconos: ["lupa", "mapa", "globo", "movil", "chincheta"], abiertos: [0, 1, 2, 3, 4] });
      tuboG(medio, brillo, [[x0 + 104, 80], [x0 + 176, 80]], prog(t, T_GUARDA, T_GUARDA + 0.8));
      movilG(medio, brillo, x0 + 180, 22, 96, 172, { dentro: (sx, sy, sw, sh) => {
        rect(medio, sx, sy, sw, 16, "#141c2c"); placa6(medio, sx + 4, sy + 2, "DISCOVER", { color: "#f5f7fb", fondo: "#1d2f6b" });
        const sube = t >= T_ARTICULOS ? Math.floor((t - T_ARTICULOS) * 10) % 34 : 0, tope = t >= T_COMPARATIVA;
        if (tope) tarjetaG(medio, sx + 4, sy + 22, sw - 8, "comparativa");
        for (let k = 0; k < 5; k++) { const y = sy + (tope ? 58 : 22) + k * 34 - (tope ? 0 : sube); if (y > sy + 16 && y + 28 < sy + sh) tarjetaG(medio, sx + 4, y, sw - 8, "normal", k + 3); }
      } });
      if (t >= T_UBIC) { const y = 100 + (salto(t, T_UBIC) || 0); disco(frente, x0 + 296, y, 7, GC); disco(frente, x0 + 296, y, 6, R5.naranja[2]); disco(frente, x0 + 294, y - 2, 2, R5.naranja[3]); rect(frente, x0 + 295, y + 6, 3, 8, GC); }
      if (t >= T_COMPARATIVA) destello5(frente, brillo, x0 + 228, 60, t, T_COMPARATIVA, P6.ORO.concat(["#fff1c4", "#ffffff"]));
    }
    return { estaciones: [{ dib: cuenta, hasta: "fr23" }, { dib: embudo, hasta: "fr26", extra: 0.3 }, { dib: reloj, hasta: "fr28" }, { dib: veinte, hasta: "fr29", extra: 1.0 },
      { dib: senales, hasta: "fr31" }, { dib: parecida, hasta: "fr34" }, { dib: discover, hasta: "fr37", extra: 0.3 }],
      zooms: [{ est: 2, desde: T_PRIMER, cx: 238, cy: 100 }], rotulo: 'Te <span class="clave">recomienda</span>', momento: { pose: "senalar" } };
  })();

  // ======================================================================================================
  // BLOQUE 5 · El anuncio que te persigue (fr38-fr48): es publicidad, la lista de la tienda, dónde vale, la subasta, el plazo
  // y los cientos de empresas
  // ======================================================================================================
  const B5 = (() => {
    const T_ANUNCIO = P("fr38", "anuncio"), T_RECO = P("fr38", "recomendacion"), T_PUBLI = P("fr38", "publicidad");
    const T_CUANDO = P("fr39", "cuando"), T_ENTRAS = P("fr39", "entras"), T_AVISA = P("fr39", "avisa"), T_SEGUNDOS = P("fr39", "segundos"), T_LISTA = P("fr39", "lista");
    const T_DATOS = P("fr40", "datos");
    const T_BUSCADOR = P("fr41", "buscador"), T_YT = P("fr41", "youtube"), T_WEBS = P("fr41", "webs");
    const T_TREINTA = P("fr42", "treinta"), T_540 = P("fr42", "540");
    const T_SUBASTA = P("fr43", "subasta"), T_CARGAR = P("fr44", "cargar"), T_HUECO = P("fr44", "hueco"), T_PUJAN = P("fr44", "pujan");
    const T_ICONOS = ["ip", "cookies", "dispositivo", "ubicacion", "idioma", "grupos"].map((w) => P("fr45", w));
    const T_PUJAR = P("fr46", "pujar"), T_GANA = P("fr46", "gana"), T_ROBOT = P("fr46", "robot");
    const T_80 = P("fr47", "80"), T_TITULAR = P("fr47", "titular"), T_DURA = P("fr47", "dura");
    const T_REGULADOR = P("fr48", "regulador"), T_VISITA = P("fr48", "visita"), T_CIENTOS = P("fr48", "cientos"), T_DESPROP = P("fr48", "desproporcionado");
    clave(T_PUBLI, "la moneda cae en el hueco del anuncio"); clave(T_SEGUNDOS, "la ficha se clava en el tablón"); clave(T_WEBS, "las tres pantallas con el robot");
    clave(T_540, "el segundo calendario"); clave(T_PUJAN, "las paletas que suben"); clave(T_GANA, "el mazo cae y gana la tienda");
    clave(T_80, "el cronómetro"); clave(T_CIENTOS, "la ciudad que se enciende");
    sonido(T_PUBLI, "aparicion"); sonido(T_AVISA, "seleccion"); sonido(T_SEGUNDOS, "tick"); sonido(T_540, "aparicion"); sonido(T_PUJAN, "aparicion");
    T_ICONOS.forEach((t) => sonido(t, "tick")); sonido(T_GANA, "acierto"); sonido(T_80, "tick"); sonido(T_CIENTOS, "aparicion"); sonido(T_DESPROP, "error");
    T6.cifra(T_540, fin("fr42") + 0.15 + 0.3, '540<span class="unidad">días</span>', [240, 104]); // sobre la línea entre los calendarios
    T6.cifra(T_80, fin("fr47") + 0.15, '80 ms a 1 s', [22, 142]);
    const EST = { pujas: [[274, 70, R5.ia], [310, 70, R5.verde], [346, 70, P6.ORO.concat(["#fff1c4"])], [382, 70, R5.labLuz], [292, 112, ["#5a1e4a", "#8a2e6a", "#c04a90", "#e070b0"]], [328, 112, null], [364, 112, R5.ia]] };

    // 1 · es publicidad: la tableta con el robot en el anuncio; la tele de las recomendaciones se aparta; cae una moneda
    function publicidad(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [[40, 44, 50, 50]] });
      caja5(medio, x0 + 140, 170, 260, 10, P6.CARTON);
      teleG(medio, brillo, x0 + 30, 108, 90, 60, t, { on: true, dentro: (sx, sy, sw, sh) => reproductorG(medio, null, sx, sy, sw, sh, t, { cuantas: 4, robot: -1, semilla: 5 }) });
      if (t >= T_RECO) aspa(frente, x0 + 70, 132 + (salto(t, T_RECO) || 0), R5.naranja[2]);
      tabletaNoticiasG(medio, brillo, x0 + 170, 40, 200, 128, t, { hueco: { visible: true, robot: true, y: 86, h: 34 } });
      if (t >= T_ANUNCIO) destello5(frente, brillo, x0 + 270, 103, t, T_ANUNCIO, R5.naranja.concat("#fff1c4"));
      if (t >= T_PUBLI - 0.6) { const f = prog(t, T_PUBLI - 0.6, T_PUBLI); monedaG(frente, x0 + 340, Math.round(20 + f * 70)); if (t >= T_PUBLI) destello5(frente, brillo, x0 + 345, 95, t, T_PUBLI, P6.ORO.concat(["#fff1c4", "#ffffff"])); }
    }
    // 2 · la lista (zoom núcleo): la silueta entra en la tienda, la pegatina avisa y la ficha se clava en el tablón en segundos
    function lista(L, x0, t) {
      const { medio, frente, brillo } = L;
      const Tn = tiendaG(medio, brillo, x0 + 30, SU, t, { pegatina: true, avisa: t >= T_AVISA && t < T_SEGUNDOS + 0.4 });
      relojParedG(medio, x0 + 382, 40, t);
      const n = t >= T_SEGUNDOS ? 8 : 7;
      const Tb = tablonG(medio, brillo, x0 + 262, 40, n, prog(t, T_SEGUNDOS, T_SEGUNDOS + 0.5));
      // la silueta camina hasta la puerta y entra
      const fa = prog(t, T_CUANDO - 0.8, T_ENTRAS), sx = Math.round(x0 + 210 - fa * 70);
      if (t < T_ENTRAS + 0.3) silueta6(frente, sx, SU, t, fa > 0 && fa < 1);
      // la ficha vuela de la pegatina al tablón
      const f = prog(t, T_AVISA + 0.2, T_SEGUNDOS + 0.4), h = Tb.hueco(7);
      if (f > 0 && f < 1) { const [px, py] = Tn.pegatina; fichaG(frente, Math.round(px + (h[0] - px) * f), Math.round(py + (h[1] - py) * f - Math.sin(f * Math.PI) * 24)); }
      if (t >= T_LISTA) rect(brillo, h[0] - 4, h[1] - 4, 24, 21, R5.naranja[0]);
    }
    // 3 · dónde vale y cuánto dura: el tablón se copia a tres pantallas; luego pasan treinta días y llega el segundo calendario
    function pantallas(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.hormigon, ventanas: [] });
      tablonG(medio, brillo, x0 + 30, 60, 8, 1);
      const pantalla = (ta, x, y, w, h, tipo) => {
        const on = t >= ta;
        if (tipo === "tele") teleG(medio, brillo, x, y, w, h, t, { on: true, dentro: (sx, sy, sw, sh) => { rect(medio, sx, sy, sw, sh, "#1a2236"); if (on) { rect(medio, sx + 4, sy + 4, sw - 8, sh - 8, "#26304a"); miniRobotG(medio, sx + sw / 2 - 6, sy + sh / 2 - 2); } } });
        else { const V = ventanaG(medio, brillo, x, y, w, h); if (tipo === "buscador") barraBusquedaG(medio, V.ix + 4, V.iy + 4, V.iw - 8, 0); if (on) { rect(medio, V.ix + 4, V.iy + V.ih - 18, V.iw - 8, 14, R5.naranja[0]); miniRobotG(medio, V.ix + 8, V.iy + V.ih - 14); } }
        const f = prog(t, ta - 0.6, ta); if (f > 0 && f < 1) fichaG(frente, Math.round(x0 + 78 + (x + w / 2 - x0 - 78) * f), Math.round(64 + (y + 10 - 64) * f - Math.sin(f * Math.PI) * 20));
      };
      pantalla(T_BUSCADOR, x0 + 150, 38, 84, 60, "buscador"); pantalla(T_YT, x0 + 256, 38, 90, 60, "tele"); pantalla(T_WEBS, x0 + 366, 38, 84, 60, "web");
      if (t >= T_TREINTA - 0.4) { calendarioG(medio, x0 + 200, 128, (t - T_TREINTA) % 0.6 / 0.6 * (t < T_540 ? 1 : 0)); }
      if (t >= T_540) { const s = salto(t, T_540) || 0; rect(medio, x0 + 236, 146, 144, 3, R5.naranja[2]); calendarioG(medio, x0 + 380, 128 + s, 0); calendarioG(medio, x0 + 386, 124 + s, 0); }
    }
    // 4 · la subasta (zoom núcleo): la web de noticias pone a la venta el hueco mientras carga; la ficha con tus datos se
    //     proyecta a la grada; suben las paletas y gana la de la tienda
    function subasta(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e", "#8a4a38"], ventanas: [] });
      // atril con la web de noticias y su hueco
      caja5(medio, x0 + 66, 132, 100, 66, P6.CARTON); rect(medio, x0 + 68, 134, 96, 3, P6.CARTON[3]); rect(medio, x0 + 68, 186, 96, 10, P6.CARTON[0]);
      for (let k = 0; k < 3; k++) rect(medio, x0 + 76 + k * 30, 146, 20, 30, P6.CARTON[k % 2 ? 1 : 2]);
      const V = ventanaG(medio, brillo, x0 + 64, 52, 108, 78);
      barraCargaG(medio, V.ix + 4, V.iy + V.ih - 10, V.iw - 8, prog(t, T_CARGAR, T_ROBOT));
      for (let k = 0; k < 5; k++) rect(medio, V.ix + 6, V.iy + 6 + k * 9, V.iw - 12 - (k * 13) % 30, 2, "#3a4560");
      const hy = V.iy + 24;
      if (t >= T_HUECO) { rect(medio, V.ix + 8, hy - 1, V.iw - 16, 24, GC); rect(medio, V.ix + 9, hy, V.iw - 18, 22, t >= T_ROBOT ? "#26304a" : "#141a26"); if (t < T_ROBOT && Math.floor(t * 3) % 2) rect(medio, V.ix + 9, hy, V.iw - 18, 1, R5.naranja[2]); }
      if (t >= T_ROBOT) { robotG(frente, brillo, V.ix + V.iw / 2 - 15, hy + 8, t); destello5(frente, brillo, V.ix + V.iw / 2, hy + 12, t, T_ROBOT, R5.naranja.concat("#fff1c4")); }
      mazoG(frente, x0 + 164, 110, t < T_GANA ? 0 : prog(t, T_GANA, T_GANA + 0.15));
      // la ficha de puja, en el centro, con sus iconos encendiéndose
      const enc = T_ICONOS.filter((ti) => t >= ti).length;
      if (t >= T_ICONOS[0] - 0.8) fichaPujaG(medio, brillo, x0 + 176, 132, enc);
      if (t >= T_PUJAN) for (let k = 0; k < 3; k++) { const y = 140 - k * 12; rect(brillo, x0 + 264, y, 30 + k * 4, 2, "#3a3420"); }
      // gradas con los anunciantes
      caja5(medio, x0 + 270, 104, 160, 10, P6.CARTON); caja5(medio, x0 + 270, 146, 160, 10, P6.CARTON); caja5(medio, x0 + 270, 188, 160, 10, P6.CARTON);
      EST.pujas.forEach(([x, y, color], k) => {
        const tienda = color === null, ta = tienda ? T_PUJAR : T_PUJAN + k * 0.18;
        pujadorG(medio, x0 + x, y, t, { sube: prog(t, ta, ta + 0.3) * (tienda || t < T_GANA ? 1 : 0.2), color: color || R5.naranja, robot: tienda, semilla: k });
      });
      [[284, 154], [320, 154], [356, 154], [392, 154]].forEach(([x, y], k) => pujadorG(medio, x0 + x, y, t, { sube: prog(t, T_PUJAN + 0.3 + k * 0.15, T_PUJAN + 0.6 + k * 0.15) * (t < T_GANA ? 1 : 0.2), color: [R5.verde, R5.ia, P6.ORO.concat(["#fff1c4"]), R5.labLuz][k] }));
      if (t >= T_GANA) destello5(frente, brillo, x0 + 354, 96, t, T_GANA, P6.ORO.concat(["#fff1c4", "#ffffff"]));
    }
    // 5 · el plazo: el cronómetro corre casi una vuelta mientras la barra de carga se llena y se escribe el titular
    function plazo(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#2a1618", "#3d2020", "#552c26", "#6e3a2e", "#8a4a38"], ventanas: [] });
      const v = prog(t, T_DURA, T_TITULAR + 0.6);
      cronometroG(medio, brillo, x0 + 70, 64, v * 0.9);
      const V = ventanaG(medio, brillo, x0 + 214, 40, 236, 130);
      barraCargaG(medio, V.ix + 10, V.iy + 8, V.iw - 20, v);
      const letras = Math.round(prog(t, T_TITULAR - 1.2, T_TITULAR + 0.4) * 12);
      for (let k = 0; k < letras; k++) rect(medio, V.ix + 12 + k * 14, V.iy + 26, 11, 6, "#8a93a6");
      for (let k = 0; k < 6; k++) rect(medio, V.ix + 12, V.iy + 44 + k * 10, V.iw - 30 - (k * 17) % 50, 2, v >= 1 ? "#3a4560" : "#1a2236");
    }
    // 6 · cientos de empresas: la ficha se copia y vuela a las ventanas de la ciudad, que se encienden; el sello del regulador
    function cientos(L, x0, t) {
      const { medio, frente, brillo } = L;
      const enc = prog(t, T_VISITA, T_CIENTOS + 0.8) * 0.85;
      [[150, 70, 60, 3], [216, 46, 54, 5], [276, 82, 56, 7], [338, 58, 60, 9], [404, 90, 50, 11]].forEach(([x, y, w, s]) => edificioVentanasG(medio, brillo, x0 + x, y, w, SU, enc, s));
      fichaPujaG(medio, brillo, x0 + 40, 120, 6);
      if (t >= T_VISITA) for (let k = 0; k < 8; k++) { const f = (t * 0.6 + k / 8) % 1, tx = x0 + 170 + k * 34, ty = 80 + (k * 23) % 60; fichaG(frente, Math.round(x0 + 84 + (tx - x0 - 84) * f), Math.round(130 + (ty - 130) * f - Math.sin(f * Math.PI) * 30)); }
      if (t >= T_REGULADOR) selloG(frente, x0 + 60, 50 + (salto(t, T_REGULADOR) || 0), "ICO");
      if (t >= T_DESPROP) destello5(frente, brillo, x0 + 78, 68, t, T_DESPROP, R5.ia);
    }
    return { estaciones: [{ dib: publicidad, hasta: "fr38", extra: 0.3 }, { dib: lista, hasta: "fr40" }, { dib: pantallas, hasta: "fr42", extra: 0.3 },
      { dib: subasta, hasta: "fr46", extra: 0.6 }, { dib: plazo, hasta: "fr47" }, { dib: cientos, hasta: "fr48" }],
      zooms: [{ est: 2, desde: T_CUANDO, cx: 220, cy: 100 }, { est: 4, desde: T_SUBASTA, cx: 240, cy: 104 }],
      rotulo: 'El <span class="clave">anuncio</span>', momento: { pose: "sorpresa" } };
  })();

  // ======================================================================================================
  // BLOQUE 6 · El giro de las cookies (fr49-fr55): la galleta de terceros, iban a quitarla y la caja que nadie usaba
  // ======================================================================================================
  const B6 = (() => {
    const T_TERCEROS = P("fr49", "terceros"), T_COOKIE = P("fr50", "cookie"), T_TERC50 = P("fr50", "terceros"), T_OTRAS = P("fr50", "otras");
    const T_QUITAR = P("fr51", "quitar"), T_SANDBOX = P("fr51", "privacysandbox"), T_JULIO = P("fr52", "julio"), T_ELEGIR = P("fr52", "elegir");
    const T_ABRIL = P("fr53", "abril"), T_QUEDAN = P("fr53", "quedan"), T_INCOG = P("fr53", "incognito");
    const T_RETIRO = P("fr54", "retiro"), T_USABA = P("fr54", "usaba"), T_SIGUE = P("fr55", "sigue");
    clave(T_TERC50, "la galleta cae en el tarro"); clave(T_QUITAR, "la mano se lleva el tarro"); clave(T_QUEDAN, "el tarro vuelve a la estantería");
    clave(T_RETIRO, "la caja polvorienta se va");
    sonido(T_COOKIE, "aparicion"); sonido(T_TERC50, "aparicion"); sonido(T_OTRAS, "tick"); sonido(T_QUITAR, "destello"); sonido(T_JULIO, "error"); sonido(T_QUEDAN, "acierto");
    sonido(T_INCOG, "seleccion"); sonido(T_RETIRO, "destello"); sonido(T_SIGUE, "tick");
    T6.identificador(T_TERCEROS, fin("fr50") + 0.15 - 0.5, "De terceros", [W + 252, 102]);

    // 1 · la galleta de terceros: el hueco de un anuncio de otra web deja una galleta en tu tarro; en otras webs, el mismo
    //     hueco la reconoce
    function galleta(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [] });
      const V = ventanaG(medio, brillo, x0 + 40, 40, 190, 126);
      for (let k = 0; k < 7; k++) rect(medio, V.ix + 8, V.iy + 8 + k * 9, V.iw - 70 - (k * 11) % 30, 2, "#3a4560");
      rect(medio, V.ix + V.iw - 56, V.iy + 8, 50, 40, R5.naranja[2]); rect(medio, V.ix + V.iw - 54, V.iy + 10, 46, 36, "#26304a"); // el hueco del anuncio, de otra web (marco naranja)
      if (t >= T_COOKIE) galletaG(frente, V.ix + V.iw - 40, V.iy + 22);
      const n = t >= T_TERC50 + 0.6 ? 2 : t >= T_COOKIE + 0.6 ? 1 : 0;
      tarroG(medio, brillo, x0 + 254, 124, n);
      const f = prog(t, T_TERC50, T_TERC50 + 0.6);
      if (f > 0 && f < 1) galletaG(frente, Math.round(V.ix + V.iw - 40 + (x0 + 264 - V.ix - V.iw + 40) * f), Math.round(V.iy + 22 + (140 - V.iy - 22) * f - Math.sin(f * Math.PI) * 26));
      [[320, 50], [370, 80], [420, 50]].forEach(([x, y], k) => { webG(medio, brillo, x0 + x, y, { anuncio: true, luz: t >= T_OTRAS + k * 0.2 }); if (t >= T_OTRAS + k * 0.2) galletaG(frente, x0 + x + 8, y + 10); });
    }
    // 2 · iban a quitarla: una mano se lleva el tarro hacia la papelera; en julio de 2024 se para; en abril de 2025 vuelve a
    //     la estantería; en incógnito lleva gafas oscuras
    function quitarla(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [] });
      estanteriaG(medio, x0 + 60, 70, 200);
      cajaPlacaG(medio, x0 + 76, 128 - 0, 152, 30, "PRIVACY SANDBOX", 0);
      papeleraG(medio, x0 + 400, SU);
      caja5(medio, x0 + 300, 40, 50, 20, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]);
      placa6(medio, x0 + 306, 44, t >= T_ABRIL ? "2025" : t >= T_JULIO ? "2024" : "....", { color: "#f5f7fb", fondo: null });
      // trayecto del tarro: estante (80, 72) → hacia la papelera (hasta medio camino) → vuelta al estante
      const ida = prog(t, T_QUITAR, T_JULIO), vuelta = prog(t, T_QUEDAN - 0.6, T_QUEDAN);
      const k = Math.min(ida, 0.55) * (1 - vuelta);
      const tx = Math.round(x0 + 90 + (x0 + 395 - x0 - 90) * k), ty = Math.round(74 + Math.sin(k * Math.PI) * -20 + k * 60);
      tarroG(medio, brillo, tx, ty, 2, { gafas: t >= T_INCOG });
      if (t >= T_QUITAR - 0.3 && t < T_QUEDAN + 0.2) manoG(frente, tx + 34, ty + 18);
      if (t >= T_JULIO && t < T_ABRIL) { interrogacionG(frente, tx + 8, ty - 28, R5.naranja, 2); }
      if (t >= T_QUEDAN) destello5(frente, brillo, x0 + 107, 94, t, T_QUEDAN, P6.ORO.concat(["#fff1c4", "#ffffff"]));
    }
    // 3 · nadie la usaba: la caja de recambio, llena de polvo, se va al trastero; el tarro sigue en su sitio
    function nadie(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [] });
      estanteriaG(medio, x0 + 60, 70, 200);
      tarroG(medio, brillo, x0 + 90, 74, 2);
      puertaG(medio, x0 + 400, SU - 4, { abierta: prog(t, T_RETIRO - 0.3, T_RETIRO + 0.2) * (t < T_USABA + 0.6 ? 1 : 0) });
      const f = prog(t, T_RETIRO, T_USABA);
      if (f < 1) cajaPlacaG(medio, Math.round(x0 + 76 + f * 330), 128 + Math.round(f * 40), 152, 30, "PRIVACY SANDBOX", prog(t, T_RETIRO - 1.2, T_RETIRO));
      if (t >= T_SIGUE) destello5(frente, brillo, x0 + 107, 94, t, T_SIGUE, P6.ORO.concat(["#fff1c4", "#ffffff"]));
    }
    return { estaciones: [{ dib: galleta, hasta: "fr50" }, { dib: quitarla, hasta: "fr53" }, { dib: nadie, hasta: "fr55" }], zooms: [],
      rotulo: 'Las <span class="clave">cookies</span>', momento: { pose: "pensar" } };
  })();

  // ======================================================================================================
  // BLOQUE 7 · Cómo verlo y cambiarlo (fr56-fr63): Mi centro de anuncios, la taza, YouTube y Discover, el archivador y la vitrina
  // ======================================================================================================
  const B7 = (() => {
    const T_PRIMERO = P("fr57", "primero"), T_DATOS = ["edad", "idioma", "actividad", "zonas"].map((w) => P("fr57", w));
    const T_INTER = P("fr58", "interruptores"), T_OFF = [P("fr58", "actividad"), P("fr58", "youtube"), P("fr58", "zonas")], T_NOAPAGA = PX("fr58", "apaga");
    const T_DESACT = P("fr59", "desactivas"), T_SEGUIRAS = P("fr59", "seguiras");
    const T_INTERESA = P("fr60", "interesa"), T_CANAL = P("fr60", "canal"), T_PAUSAR = P("fr60", "pausar"), T_BORRAR = P("fr60", "borrar");
    const T_SEGUIR = P("fr61", "seguir"), T_NOINT = P("fr61", "interesa");
    const T_CASILLA = P("fr62", "casilla"), T_APAGAR = P("fr62", "apagar");
    const T_ASEGURA = P("fr63", "asegura"), T_NUNCA = P("fr63", "nunca"), T_GMAIL = P("fr63", "gmail");
    clave(T_DATOS[0], "la ficha de datos"); clave(T_OFF[0], "los interruptores se apagan"); clave(T_SEGUIRAS, "la taza en el hueco");
    clave(T_INTERESA, "la mano aparta el vídeo"); clave(T_SEGUIR, "la estrella de Discover"); clave(T_APAGAR, "el cajón se vacía"); clave(T_NUNCA, "la vitrina cerrada");
    T_DATOS.forEach((t) => sonido(t, "tick")); T_OFF.forEach((t) => sonido(t, "seleccion")); sonido(T_NOAPAGA, "acierto"); sonido(T_SEGUIRAS, "aparicion");
    sonido(T_INTERESA, "destello"); sonido(T_PAUSAR, "tick"); sonido(T_SEGUIR, "acierto"); sonido(T_APAGAR, "destello"); sonido(T_NUNCA, "seleccion");
    T6.identificador(T_ASEGURA, fin("fr63") + 0.15, "Según Google", [5 * W + 172, 40]);

    // 1 · Mi centro de anuncios: la ficha con los datos que usa y tres interruptores que se apagan; las recomendaciones van aparte
    function panel(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { ventanas: [[420, 46, 40, 50]] });
      caja5(medio, x0 + 50, 34, 300, 136, R5.metal); rect(medio, x0 + 56, 54, 288, 110, "#141a26");
      placa6(medio, x0 + 60, 38, "MI CENTRO DE ANUNCIOS", { color: "#f5f7fb", fondo: "#0c1016" });
      caja5(medio, x0 + 66, 64, 96, 88, G.PAPEL);
      ["edad", "globo", "huellas", "chincheta"].forEach((ic, k) => { iconoG(medio, x0 + 74, 72 + k * 19, ic, t >= T_DATOS[k]); rect(medio, x0 + 88, 76 + k * 19, 60, 2, t >= T_DATOS[k] ? "#4a5774" : "#b8ad96"); });
      ["huellas", "play", "chincheta"].forEach((ic, k) => interruptorG(medio, brillo, x0 + 190 + k * 50, 78, t < T_OFF[k], ic));
      // las recomendaciones, en una caja aparte con su cable: siguen encendidas
      caja5(medio, x0 + 370, 96, 60, 48, R5.metal); interruptorG(medio, brillo, x0 + 391, 104, true, null); iconoG(medio, x0 + 375, 100, "play");
      rect(medio, x0 + 400, 144, 2, 54, GC); rect(medio, x0 + 400, 144, 1, 54, R5.verde[1]);
      // la caja de recomendaciones sigue viva: pulsos que bajan por su cable
      for (let j = 0; j < 3; j++) rect(brillo, x0 + 399, 144 + Math.round((t * 26 + j * 18) % 50), 4, 4, R5.verde[2]);
      if (t >= T_NOAPAGA) destello5(frente, brillo, x0 + 400, 118, t, T_NOAPAGA, R5.verde.concat("#ffffff"));
      // tras apagar el último interruptor, el cursor va hasta la caja aparte («no apaga las recomendaciones»)
      if (t >= T_OFF[2]) {
        const f = prog(t, T_OFF[2] + 0.3, T_NOAPAGA), ff = f * f * (3 - 2 * f);
        cursorG(frente, Math.round(x0 + 300 + ff * 96), Math.round(92 + ff * 30 - Math.sin(ff * Math.PI) * 24 + Math.sin(t * 5) * 2));
      }
    }
    // 2 · sigue habiendo anuncios: en el hueco, el robot se cambia por una taza cualquiera
    function taza(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [[40, 44, 50, 50]] });
      caja5(medio, x0 + 110, 170, 260, 10, P6.CARTON);
      tabletaNoticiasG(medio, brillo, x0 + 140, 40, 200, 128, t, { hueco: { visible: true, robot: t < T_SEGUIRAS, y: 86, h: 34 } });
      if (t >= T_SEGUIRAS) { tazaG(frente, x0 + 233, 100); destello5(frente, brillo, x0 + 240, 104, t, T_SEGUIRAS, R5.ia); }
      if (t >= T_DESACT) interruptorG(frente, brillo, x0 + 380, 96, false, "play");
    }
    // 3 · YouTube y Discover: una mano aparta un vídeo, el canal tachado, la pausa y la papelera; en el móvil, la estrella
    function controles(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { ventanas: [] });
      caja5(medio, x0 + 40, 164, 210, 34, P6.CARTON);
      const Tl = teleG(medio, brillo, x0 + 50, 40, 190, 116, t, { placa: "YOUTUBE", dentro: (sx, sy, sw, sh) => reproductorG(medio, brillo, sx, sy, sw, sh, t, { robot: t < T_INTERESA + 0.5 ? 5 : -1, semilla: 13 }) });
      if (t >= T_INTERESA - 0.3 && t < T_INTERESA + 0.8) { const f = prog(t, T_INTERESA - 0.3, T_INTERESA + 0.5); manoG(frente, Math.round(x0 + 130 + f * 60), 90); }
      if (t >= T_CANAL) canalTachadoG(frente, x0 + 64, 128 + (salto(t, T_CANAL) || 0));
      if (t >= T_PAUSAR) pausaG(frente, x0 + 86, 128 + (salto(t, T_PAUSAR) || 0));
      if (t >= T_BORRAR) papeleraG(frente, x0 + 108, 156 + (salto(t, T_BORRAR) || 0));
      movilG(medio, brillo, x0 + 300, 30, 80, 150, { dentro: (sx, sy, sw, sh) => {
        rect(medio, sx, sy, sw, 14, "#141c2c"); placa6(medio, sx + 2, sy + 1, "DISCOVER", { color: "#f5f7fb", fondo: "#1d2f6b" });
        tarjetaG(medio, sx + 4, sy + 20, sw - 8, "normal", 4); if (t < T_NOINT + 0.4) tarjetaG(medio, sx + 4 + Math.round(prog(t, T_NOINT, T_NOINT + 0.4) * 80), sy + 54, sw - 8, "normal", 7); tarjetaG(medio, sx + 4, sy + 88, sw - 8, "normal", 9);
      } });
      if (t >= T_SEGUIR) { iconoG(frente, x0 + 386, 56 + (salto(t, T_SEGUIR) || 0), "estrella"); destello5(frente, brillo, x0 + 391, 61, t, T_SEGUIR, P6.ORO.concat(["#fff1c4", "#ffffff"])); }
    }
    // 4 · el archivador: la casilla se desmarca y, con «apagar», el cajón se vacía en la papelera
    function archivo(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: ["#1f1a24", "#2a2330", "#362c3c", "#45384a", "#58475c"], ventanas: [] });
      const vacio = t >= T_APAGAR + 0.6;
      archivadorG(medio, brillo, x0 + 130, 34, t, { iconos: ["lupa", "mapa", "globo", "movil", "chincheta"], abiertos: vacio ? [] : [0, 1, 2, 3, 4], extra: t < T_CASILLA ? 1 : 0 });
      casillaG(frente, brillo, x0 + 220, 140, t < T_CASILLA);
      papeleraG(medio, x0 + 300, SU);
      if (t >= T_APAGAR && t < T_APAGAR + 1.2) for (let k = 0; k < 5; k++) { const f = prog(t, T_APAGAR + k * 0.1, T_APAGAR + 0.6 + k * 0.1); if (f > 0 && f < 1) fichaG(frente, Math.round(x0 + 170 + (x0 + 306 - x0 - 170) * f), Math.round(42 + k * 21 + (166 - 42 - k * 21) * f - Math.sin(f * Math.PI) * 20)); }
    }
    // 5 · lo que dice Google: el correo, la carpeta y la foto, en una vitrina que se cierra con candado
    function vitrina(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { pared: R5.oficina.slice(0, 4).concat([R5.oficina[3]]), ventanas: [] });
      vitrinaG(medio, brillo, x0 + 176, 60, prog(t, T_NUNCA, T_NUNCA + 0.4));
      if (t >= T_GMAIL) destello5(frente, brillo, x0 + 197, 100, t, T_GMAIL, R5.ia);
    }
    return { estaciones: [{ dib: panel, hasta: "fr58" }, { dib: taza, hasta: "fr59" }, { dib: controles, hasta: "fr61" }, { dib: archivo, hasta: "fr62", extra: 0.3 }, { dib: vitrina, hasta: "fr63" }],
      zooms: [], rotulo: 'Tú <span class="clave">mandas</span>', momento: { pose: "celebrar" } };
  })();

  // ======================================================================================================
  // BLOQUE 8 · Cierre (fr64-fr66): la cadena del rastro y el robot que vuelve a su base
  // ======================================================================================================
  const B8 = (() => {
    const T_BUSCASTE = P("fr65", "buscaste"), T_ETIQ = P("fr65", "etiqueta"), T_LISTA = P("fr65", "lista"), T_GANO = P("fr65", "gano"), T_RASTRO = P("fr66", "rastro"), T_MENTE = P("fr66", "mente");
    sonido(T_BUSCASTE, "tick"); sonido(T_ETIQ, "tick"); sonido(T_LISTA, "tick"); sonido(T_GANO, "acierto"); sonido(T_RASTRO, "destello");
    function cierre(L, x0, t) {
      const { medio, frente, brillo } = L;
      habitacionG(medio, x0, SU, { ventanas: [[256, 40, 48, 48]] });
      lamparaG(medio, brillo, x0 + 106, SU, t);
      // la cadena: lupa → pegatina → ficha clavada → mazo, unidas por el rastro
      const piezas = [[T_BUSCASTE, (x, y) => iconoG(frente, x + 3, y + 3, "lupa")], [T_ETIQ, (x, y) => { rect(frente, x + 3, y + 3, 10, 10, GC); rect(frente, x + 4, y + 4, 8, 8, R5.ia[3]); }],
        [T_LISTA, (x, y) => fichaG(frente, x + 3, y + 4)], [T_GANO, (x, y) => mazoG(frente, x + 4, y + 14, 1)]];
      piezas.forEach(([ta, dib], k) => { if (t < ta) return; const x = x0 + 50 + k * 54, y = 60 + (salto(t, ta) || 0); caja5(frente, x - 2, y - 2, 20, 20, ["#0e1018", "#1a1e2a", "#2c3140", "#4a5163"]); dib(x, y); if (k) rastroG(frente, brillo, [[x - 36, y + 8], [x - 4, y + 8]], t, 1); });
      // base de carga del robot y el robot que vuelve con «rastro»
      caja5(medio, x0 + 40, SU - 14, 40, 14, R5.metal); rect(medio, x0 + 56, SU - 12, 8, 2, t >= T_RASTRO + 0.8 ? R5.verde[3] : R5.naranja[2]);
      const f = prog(t, T_MENTE, T_RASTRO + 0.8), rx = Math.round(x0 + 230 - f * 180);
      if (f < 1) rastroG(frente, brillo, [[x0 + 300, SU - 2], [rx + 60, SU - 2]], t, 1);
      robotG(frente, brillo, rx, SU - 31, t, { mueve: f > 0 && f < 1, e: 3 });
    }
    return { estaciones: [{ dib: cierre, hasta: "fr66" }], zooms: [], rotulo: 'En <span class="clave">resumen</span>', momento: { pose: "pie" }, cierre: true };
  })();

  // ======================================================================================================
  // Motor del mundo por bloque
  // ======================================================================================================
  const TODOS = [B1, B2, B3, B4, B5, B6, B7, B8];
  const HASTA = Math.min(TODOS.length, Number(Q.get("hasta")) || TODOS.length);
  const BLOQUES = TODOS.slice(0, HASTA).map((b, i) => {
    const previa = i > 0 ? TODOS[i - 1].estaciones[TODOS[i - 1].estaciones.length - 1] : null;
    const estaciones = previa ? [previa, ...b.estaciones] : b.estaciones;
    const saltos = [];
    if (previa) saltos.push([previa.hasta, "tema", previa.extra || 0]);
    b.estaciones.slice(0, -1).forEach((e) => saltos.push([e.hasta, "viaje", e.extra || 0]));
    const R = ruta6({ W, M, fin, entrada: i === 0 ? T_ENTRADA : 0, saltos, zooms: b.zooms });
    const N = estaciones.length;
    const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: N * W, altoMundo: H, planos: R.planos });
    const desde = i === 0 ? 0 : R.salidas[0];
    return { ...b, estaciones, R, N, CAM, desde, llega: i === 0 ? R.LLE(0) : R.LLE(1) };
  });
  BLOQUES.forEach((b, i) => { b.hasta = i + 1 < BLOQUES.length ? BLOQUES[i + 1].desde : Infinity; });
  const ultimo = BLOQUES[BLOQUES.length - 1];
  const DURACION = HASTA < TODOS.length ? fin(ultimo.estaciones[ultimo.estaciones.length - 1].hasta) + 1.2 : TT.DURACION;
  window.DURACION = DURACION;

  // título y rótulos: el rótulo de cada bloque entra al llegar la cámara y dura todo el bloque
  T6.titulo(0, T_ENTRADA, 'Algoritmos · <span class="clave">Google</span>', '¿Cómo sabe<br>lo que<br><span class="clave">quieres</span>?', M);
  BLOQUES.forEach((b) => T6.rotulo(b.llega, Math.min(b.hasta, DURACION + 1), b.rotulo, M.rotulo));
  // MISTA: entrada con el título y de pie 1-2 s al llegar a cada tema
  const MOMENTOS = BLOQUES.slice(1).map((b) => ({ desde: b.llega, hasta: b.cierre ? DURACION + 1 : b.llega + 1.6, pose: "pie", luego: [0.5, (b.momento && b.momento.pose) || "senalar"] }));

  // revisión para el lint: movimientos, salidas y llegadas de todos los bloques (tiempos absolutos)
  const MOV = BLOQUES.flatMap((b) => b.R.movimientos).sort((a, c) => a[0] - c[0]);
  const SAL = BLOQUES.flatMap((b) => b.R.salidas).sort((a, c) => a - c);
  const LLE = BLOQUES.flatMap((b, i) => (i === 0 ? b.R.llegadas : b.R.llegadas.slice(1))).sort((a, c) => a - c);
  window.revision = { movimientos: MOV, salidas: SAL, llegadas: LLE, claves: CLAVES.filter((c) => c.t < DURACION) };
  const moviendo = (t) => MOV.some(([a, c]) => t >= a && t < c);

  const D6 = crearDialogo6({ T, ids: T.frases.filter((f) => f.inicio < DURACION).map((f) => f.id),
    claves: { fr01: "robot", fr02: "nadie", fr03: "anuncio", fr04: "sabe", fr05: "Google", fr06: "escucha", fr07: "Northeastern", fr08: "registraron",
      fr09: "audio", fr10: "Ninguna", fr11: "texto", fr12: "pantalla", fr13: "capturas", fr14: "pistas" },
    // las frases con dos fuentes llevan una etiqueta corta, para que la pestaña no pise el nombre de MISTA
    etiquetas: { fr20: "Ayuda de Google y Google Ads", fr46: "Google Ads · ICO" },
    maxc: 52, corto: false, dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"),
    retrato: document.getElementById("retrato"), fuente: document.getElementById("fuente") });
  tildes6(); tildesPixel(".cifra6 .unidad"); // «días»: la Í minúscula de Press Start 2P

  window.eventosSonido = () => {
    const ev = [{ t: T_ENTRADA, tipo: "destello" }, ...SAL.map((t) => ({ t: Math.round(t * 1000) / 1000, tipo: "destello" })), ...EVENTOS];
    return ev.filter((e) => e.t < DURACION).sort((a, c) => a.t - c.t);
  };
  window.claveFotograma = clave6(moviendo);

  // ---------- lienzos del bloque activo (se rehacen solo al cambiar de bloque) ----------
  let actual = -1, LZ = null, F = null;
  function activar(i) {
    if (i === actual) return;
    actual = i;
    LZ = lienzos6({ W, H, N: BLOQUES[i].N });
    F = fondoNoche6({ L: LZ.L, ANCHO: LZ.ANCHO, W, H, N: BLOQUES[i].N, SU, SX: M.SX, lunas: [1] });
  }

  window.seek = (t) => {
    const i = BLOQUES.reduce((a, b, k) => (t >= b.desde ? k : a), 0), B = BLOQUES[i];
    activar(i);
    LZ.limpiar();
    const cam = B.CAM.en(t);
    B.CAM.aplicarCapas(cam, LZ.CAPAS);
    F.cielo(t);
    const enTema = i === 0 && t < T_ENTRADA;
    ["p-medio", "p-delante"].forEach((id) => {
      const el = document.getElementById(id);
      el.style.visibility = enTema ? "hidden" : "visible";
      if (i === 0 && t >= T_ENTRADA && t < B.llega) el.style.transform = `translateX(${Math.round((1 - prog(t, T_ENTRADA, B.llega)) * W)}px)`;
    });
    if (!enTema) {
      F.suelo();
      const n = lim(Math.round((M.SX - cam.tx) / cam.k / W - 0.5), 0, B.N - 1);
      for (let k = Math.max(0, n - 1); k <= Math.min(B.N - 1, n + 1); k++) B.estaciones[k].dib(LZ.L, k * W, t);
      F.delante();
    }
    // textos del mundo: solo los del bloque activo (sus coordenadas son locales a su mundo)
    mista6(LZ.G12, t, { W, M, hablando: TT.hablando, entrada: [T_ENTRADA, BLOQUES[0].llega], momentos: MOMENTOS });
    T6.ver(t);
    D6.pintar(t);
  };
  window.seek(0);
})();
