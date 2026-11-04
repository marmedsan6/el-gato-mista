// ventanas-contexto-ia · largo (16:9). Estilo v3 a 12 px (lienzo de 160×90 unidades) con las desviaciones de
// style_guide.md: la mesa de trabajo de MISTA como metáfora, papeles de colores fijos, cámara con plano de detalle solo
// en «lo oculto» (bloque 3), la tabla de modelos (8) y la caída de Gemini (9). Guion: PUERTA 1 (reviews/puerta-1.md).
// Arte en unidades (1 = 3 px CSS = 12 px de salida); textos en px CSS. MISTA en el tercio izquierdo, la idea a la derecha.
(() => {
  const W = 480, H = 270, SUELO = 64, MESA = 52, GX = 6, GY = SUELO - 32;
  const { P, PF, INI, FIN, medio } = tiemposDe(window.TIMING);
  const fr = (n) => `fr${String(n).padStart(2, "0")}`;
  const p = (n, w, k) => P(fr(n), w, k), ini = (n) => INI(fr(n)), fin = (n) => FIN(fr(n));
  // Bloques: primera frase de cada uno (el último acaba en fr93)
  const PRIMERA = [1, 6, 14, 19, 26, 36, 45, 54, 60, 72, 84, 90];
  const CORTES = PRIMERA.slice(1).map((n) => medio(fr(n - 1), fr(n)));
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const ev = []; // efectos de sonido, atados a lo que pasa en pantalla
  const son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  let e;
  const de = (t, a, b) => t >= a && (b === undefined || t < b);
  const GATO = (pose, extra = {}) => ({ x: GX, y: GY, pose, espejo: false, ...extra });
  const conGorro = { encima: (s, x, y) => gorro3(s, x + 11, y) };

  // ---------- 1 · Gancho: el PDF de 300 páginas ----------
  const b1 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot(t < p(4, "ventana") ? '<span class="clave">300</span> páginas' : 'Ventana de <span class="clave">contexto</span>', 0);
      const cae = p(1, "300");
      if (t >= cae) {
        const dy = t < cae + 0.15 ? -6 + Math.floor((t - cae) / 0.05) * 2 : 0;
        pila3(e.frente, 62, MESA - 2 + dy, Array(14).fill("tu"), 18, 4);
        e.tx("etiqueta", "PDF · 300 páginas", 282, 120, cae);
        e.fuente("Fuente: Anthropic", 174, 184, cae);
      }
      // Tres marcapáginas; el segundo cambia su dato
      const tres = p(2, "tres"), cambia = p(2, "cambie");
      ["#5b8cff", "#1fd69a", "#f2c14e"].forEach((c, k) => {
        if (t < tres + k * 0.15) return;
        const y = 26 + k * 5, mal = k === 1 && t >= cambia;
        rect(e.frente, 80, y, 6, 3, P3.contorno); rect(e.frente, 80, y + 1, 5, 1, mal ? P3.rojo : c);
      });
      e.tx("titular", "?", 264, 96, cambia, "color:var(--rojo)");
      if (t >= p(3, "mesa")) e.marcar(43, 38, 114, 16);
      if (t >= p(3, "tamaño")) { barra3(e.frente, 100, 56, 50, 4, 0.55, P3.naranja); e.tx("etiqueta", "Tamaño", 300, 150, p(3, "tamaño")); }
      // Lo que viene: cuatro preguntas en la pared
      [["¿Qué es?", "explico"], ["¿Por qué tope?", "tope"], ["¿Por qué peor?", "peor"], ["¿Y si fuera infinita?", "infinita"]].forEach(([s, w], k) =>
        e.tx("etiqueta", s, 280, 42 + k * 14, p(4, w), k === 3 ? "color:var(--naranja)" : ""));
      e.tx("insignia", "Spoiler: no del todo", 300, 106, p(5, "no"));
    },
    gato: (t) => GATO(t >= p(4, "explico") ? "senalar" : t >= INI("fr03") ? "pensar" : t >= p(2, "cambie") ? "sorpresa" : "pie"),
  };

  // ---------- 2 · La mesa de trabajo ----------
  const b2 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot('La <span class="clave">mesa</span> de trabajo', LLEGA(1));
      const sabe = p(6, "sabe");
      if (t >= sabe) {
        pensamiento3(e.frente, 5, 13, 34, 16, 20, 32);
        libros3(e.frente, 8, 21); libros3(e.frente, 22, 21);
        e.tx("tarjeta-texto", "Lo que sabe", 23, 46, sabe);
        if (t >= p(6, "cambia")) candado3(e.frente, 33, 23);
      }
      const delante = p(7, "delante");
      const fase = t < ini(9) ? "mesa" : t < ini(10) ? "tokens" : t < ini(12) ? "palabras" : "novelas";
      if (t >= delante) {
        pila3(e.frente, 50, MESA - 2, ["oculto", "herramienta", "tu", "archivo", "tu", "respuesta"], 16, 3);
        hoja3(e.frente, 72, 41, 18, 10, "tu");
        if (fase === "mesa") e.tx("etiqueta", "Lo que tiene delante", 150, 98, delante);
      }
      if (fase === "mesa" && t >= p(8, "mesa", 2)) e.marcar(43, 38, 114, 16);
      if (fase === "tokens") {
        const a = p(9, "palabras"), b = p(9, "tokens");
        e.tx("titular", "Ventana", 300, 50, a);
        if (t >= b) {
          ["Ven", "ta", "na"].forEach((s, k) => { token3(e.frente, 100 + k * 16, 30, [P3.azul, P3.verde, P3.naranja][k], t, { semilla: k }); e.tx("etiqueta", s, 300 + k * 48, 112, b); });
          e.tx("etiqueta", "= 3 tokens", 300, 128, b, "color:var(--naranja)");
        }
      }
      if (fase === "palabras") {
        e.tx("etiqueta", "1M tokens ≈", 300, 46, ini(10));
        e.tx("dato", "555.000", 300, 58, p(10, "555.000"));
        e.tx("etiqueta", "palabras", 300, 86, p(10, "palabras"));
        e.fuente("Fuente: Anthropic", 300, 100, p(10, "555.000"));
        if (t >= ini(11)) {
          const id = p(11, "idioma");
          e.tx("etiqueta", "EN", 240, 124, id); e.tx("etiqueta", "ES", 240, 140, id);
          if (t >= id) { barra3(e.frente, 88, 41, 20, 4, 1, P3.verde); barra3(e.frente, 88, 46, 28, 4, 1, P3.naranja); }
          e.tx("etiqueta", "Más tokens", 372, 140, p(11, "tokens"), "color:var(--naranja)");
          e.fuente("Fuente: Petrov et al. (2023)", 240, 158, id);
        }
      }
      if (fase === "novelas") {
        e.tx("titular", "≈ 1M tokens", 264, 50, p(12, "millón"));
        const ocho = p(13, "ocho");
        for (let k = 0; k < 8; k++) if (t >= ocho + k * 0.06) libros3(e.frente, 104 + (k % 2) * 13, 46 - Math.floor(k / 2) * 6 + 0);
        e.tx("etiqueta", "≈ 8 novelas", 300, 96, ocho);
        e.fuente("Fuente: Google", 300, 110, ocho);
      }
    },
    gato: (t) => GATO(t >= ini(9) ? "senalar" : t >= ini(8) ? "tocar" : t >= ini(7) ? "senalar" : "pensar"),
  };

  // ---------- 3 · Lo oculto (plano de detalle) y la relectura ----------
  const TIPOS = [["tu", "Tú", 0, 108], ["oculto", "Instrucciones", 0, 168], ["herramienta", "Herramientas", 0, 108], ["archivo", "Archivos", 0, 168], ["respuesta", "Su respuesta", 0, 108]];
  const b3 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const relee = t >= ini(17);
      e.rot(relee ? 'Lo <span class="clave">relee</span> todo' : 'Lo que <span class="clave">no ves</span>', relee ? ini(17) : LLEGA(2));
      if (!relee) {
        const llegan = [ini(14), p(15, "instrucciones"), p(15, "herramientas"), p(15, "archivos"), p(16, "respuesta")];
        TIPOS.forEach(([tipo, nombre, , y], k) => {
          const a = llegan[k], s = e.s1(t, a);
          if (s === null) return;
          hoja3(e.frente, 42 + k * 22, 41 + s, 20, 10, tipo);
          e.tx("etiqueta", nombre, 156 + k * 66 - nombre.length * 4, y, a);
        });
        const actual = llegan.filter((a) => t >= a).length - 1;
        if (actual >= 1) e.marcar(41 + actual * 22, 40, 22, 12);
        if (t >= p(16, "siguiente")) e.tx("etiqueta", "→ Se relee", 360, 186, p(16, "siguiente"), "color:var(--naranja)");
        e.fuente("Fuente: Anthropic", 240, 184, p(15, "instrucciones"));
      } else {
        pila3(e.frente, 50, MESA - 2, ["tu", "respuesta", "tu", "respuesta", "tu", "oculto"], 16, 6);
        const lee = p(17, "relee");
        if (t >= lee) diario3(e.frente, 80, 40, t, t >= p(18, "leyera"));
        e.tx("etiqueta", "No recuerda", 240, 86, p(17, "recuerda"));
        e.tx("etiqueta", "Relee todo", 240, 100, lee, "color:var(--naranja)");
        e.fuente("Fuente: Claude Code, Google", 240, 168, lee);
        if (de(t, ini(18), p(18, "leyera"))) e.tx("etiqueta", "z z z", 66, 80, ini(18), "color:var(--texto-suave)");
      }
    },
    gato: (t) => GATO(de(t, ini(18), p(18, "leyera")) ? "pie" : t >= p(18, "leyera") ? "sorpresa" : "senalar", de(t, ini(18), p(18, "leyera")) ? { parpadeo: false } : {}),
  };

  // ---------- 4 · La fiesta de los saludos ----------
  const b4 = {
    pintar(t) {
      fiesta(e.capas, t, { suelo: SUELO });
      const fiestaYa = t >= ini(21);
      e.rot(fiestaYa ? 'La fiesta de los <span class="clave">saludos</span>' : 'La <span class="clave">atención</span>', fiestaYa ? ini(21) : LLEGA(3));
      if (!fiestaYa) {
        e.tx("titular", "Transformer", 150, 40, p(19, "Transformer"));
        e.fuente("Fuente: Vaswani et al. (2017)", 150, 66, p(19, "Transformer"));
        if (t >= ini(20)) corro3(e, t, 110, 46, 16, 10, 5, { lineas: t >= p(20, "todos") });
        return;
      }
      const mil = p(22, "1.000");
      if (t < mil) corro3(e, t, 84, 34, 26, 19, 10, { lineas: t >= p(21, "saludar") });
      else nube3(e, t, 60, 14, 52, 42, t >= ini(24) ? 900 : 300);
      if (t >= p(22, "45")) panel3(e.frente, 120, 10, 34, 20);
      e.tx("etiqueta", "Saludos", 368, 36, p(22, "45"));
      const valor = t >= p(24, "500.000") ? "500.000 M" : t >= mil ? (t >= PF(fr(22), "millón") ? "499.500" : String(Math.round(45 + (499500 - 45) * e.paso(e.prog(t, mil, PF(fr(22), "millón")), 0.1))).replace(/\B(?=(\d{3})+(?!\d))/g, ".")) : "45";
      e.tx("dato", valor, 368, 50, p(22, "45"), valor.length > 6 ? "font-size:16px" : "");
      e.fuente("Fuente: cálculo propio", 336, 96, p(22, "45"));
      e.tx("etiqueta", t >= mil ? (t >= ini(24) ? "1 millón de invitados" : "1.000 invitados") : "10 invitados", 210, 172, p(22, "10"));
      e.tx("insignia", "×2 invitados → ×4 saludos", 210, 154, p(23, "duplicas"));
    },
    gato: (t) => (t >= ini(21) ? GATO(t >= ini(25) ? "senalar" : "celebrar", conGorro) : GATO("pensar")),
  };

  // ---------- 5 · Cuándo lo notas ----------
  const b5 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot('¿Por qué <span class="clave">olvida</span>?', LLEGA(4));
      const consejo = t >= ini(35), medioYa = t >= ini(32) && t < ini(35);
      if (consejo) {
        hoja3(e.frente, 90, 41, 20, 10, "tu");
        e.tx("insignia", "Consejo: chat nuevo", 216, 66, ini(35));
        e.fuente("Fuente: Google", 300, 168, p(35, "chat"));
        return;
      }
      if (medioYa) { // perdido en el medio: fila de papeles, el centro apagado
        for (let k = 0; k < 7; k++) {
          hoja3(e.frente, 46 + k * 15, 41, 13, 10, k % 2 ? "respuesta" : "tu");
          const apaga = [0, 0.35, 0.6, 0.75, 0.6, 0.35, 0][k] * (t >= ini(34) ? 0.4 : 1);
          if (apaga > 0) rect(e.frente, 46 + k * 15, 41, 13, 10, `rgba(20,16,26,${apaga})`);
        }
        e.tx("insignia", "2023", 140, 66, ini(32));
        e.tx("etiqueta", "Principio", 140, 168, p(32, "principio")); e.tx("etiqueta", "Final", 400, 168, p(32, "final"));
        e.tx("etiqueta", "Medio", 290, 168, p(32, "medio"), "color:var(--texto-suave)");
        e.fuente("Fuente: Liu et al. (2023)", 140, 184, ini(32));
        e.tx("etiqueta", "Hoy: mucho menos", 260, 92, ini(34), "color:var(--verde)");
        e.fuente("Fuente: Chroma (2025)", 260, 106, ini(34));
        return;
      }
      // Mesa llena con la barra al tope; tres causas
      barra3(e.frente, 64, 56, 70, 4, 1, P3.rojo);
      const cae = p(28, "tira");
      const pilaTipos = ["tu", "respuesta", "tu", "oculto", "respuesta", "tu"];
      pila3(e.frente, 70, MESA - 2, pilaTipos, 16, 8);
      if (t >= p(29, "resumido")) hoja3(e.frente, 94, 41, 16, 10, "archivo"); else pila3(e.frente, 94, MESA - 2, ["tu", "respuesta", "tu"], 16, 9);
      e.tx("etiqueta", "Resumen", 282, 108, p(29, "resumido"), "color:var(--verde)");
      if (t < cae) hoja3(e.frente, 46, 41, 16, 10, "tu");
      else if (t < cae + 0.6) { const f = Math.floor((t - cae) / 0.1); hoja3(e.frente, 46 - f * 2, 41 + f * 4, 16, 10, "tu"); }
      [["1 · Se cae lo viejo", p(28, "primera")], ["2 · Se resume", p(29, "segunda")], ["3 · Lo atiende peor", p(31, "tercera")]].forEach(([s, a], k) =>
        e.tx("etiqueta", s, 216, 42 + k * 16, a, k === 2 ? "color:var(--naranja)" : ""));
      e.tx("etiqueta", "Claude y Claude Code", 216, 90, p(29, "pago"), "color:var(--texto-suave)");
      e.tx("etiqueta", "Pierde matices", 336, 142, p(30, "matices"), "color:var(--texto-suave)");
      e.tx("etiqueta", "Mesa llena", 192, 150, ini(26), "color:var(--naranja)");
      e.fuente("Fuente: Anthropic", 216, 184, cae);
      if (t >= p(31, "peor")) rect(e.frente, 70, 38, 16, 12, "rgba(20,16,26,0.45)");
    },
    gato: (t) => GATO(t >= ini(35) ? "senalar" : t >= ini(31) ? "pensar" : t >= p(28, "tira") && t < p(28, "tira") + 0.8 ? "sorpresa" : "pie"),
  };

  // ---------- 6 · Cuatro muros ----------
  const MUROS = [[37, "La fiesta"], [39, "La memoria"], [41, "La práctica"], [44, "La factura"]];
  const b6 = {
    pintar(t) {
      servidoresH(e.capas, t, { suelo: SUELO });
      e.rot('Cuatro <span class="clave">muros</span>', LLEGA(5));
      const aparecen = p(36, "cuatro");
      const actual = MUROS.filter(([n]) => t >= ini(n)).length - 1;
      MUROS.forEach(([n, nombre], k) => {
        if (e.s1(t, aparecen + k * 0.1) === null) return;
        muro3(e.frente, 46 + k * 28, 8 + e.s1(t, aparecen + k * 0.1), 24, 14, k === actual);
        e.tx("etiqueta", String(k + 1), 138 + k * 84 + 30, 30, aparecen + k * 0.1, "color:#f5f7fb");
        if (k === actual) e.tx("etiqueta", nombre, 138 + k * 84 + 36 - nombre.length * 4, 70, ini(n), "color:var(--naranja)");
      });
      if (actual === 0) {
        e.tx("titular", "×2 → ×4", 150, 100, p(37, "cuadrado"));
        e.tx("etiqueta", "Meta: crece de forma cuadrática", 150, 130, p(38, "cuadrática"));
        e.fuente("Fuente: Meta, Llama 3 (2024)", 150, 146, ini(38));
      } else if (actual === 1) {
        const crece = e.prog(t, p(39, "chuleta"), fin(39));
        if (t >= p(39, "chuleta")) chuleta3(e.frente, 52, 30, 12, 6 + Math.round(e.paso(crece, 0.125) * 22), t);
        e.tx("dato", "516 GB", 210, 100, p(40, "gigas"));
        e.tx("etiqueta", "1 conversación · 1M tokens", 210, 128, p(40, "millón"));
        e.tx("etiqueta", "1 usuario", 210, 142, p(40, "usuario"), "color:var(--naranja)");
        e.fuente("Fuente: Meta + cálculo propio", 210, 158, p(40, "gigas"));
      } else if (actual === 2) {
        e.tx("etiqueta", "Entrenó con", 150, 96, p(42, "aprendió")); e.tx("dato", "8.000", 150, 108, p(42, "8.000"));
        e.tx("etiqueta", "Se estiró a", 300, 96, p(42, "128.000")); e.tx("dato", "128.000", 300, 108, p(42, "128.000"), "color:var(--naranja)");
        e.tx("etiqueta", "con un 5 % del entreno", 150, 140, p(42, "5"));
        e.fuente("Fuente: Meta, Llama 3 (2024)", 150, 156, p(42, "8.000"));
        if (t >= ini(43)) { e.tx("insignia", "5 km", 150, 174, ini(43)); e.tx("insignia", "Maratón", 220, 174, p(43, "maratón"), "background:var(--rojo);color:#f5f7fb"); }
      } else if (actual === 3) {
        if (t >= p(44, "900.000")) panel3(e.frente, 50, 30, 60, 22, "#f4ecc8");
        e.tx("tarjeta-texto", "900.000 tokens", 162, 100, p(44, "900.000"));
        e.tx("tarjeta-texto", "= 100 × 9.000", 162, 118, p(44, "cien"), "color:#b4622a");
        e.fuente("Fuente: Anthropic (precios)", 150, 164, p(44, "900.000"));
      }
    },
    gato: (t) => GATO(t >= ini(44) ? "senalar" : t >= p(40, "gigas") && t < fin(40) ? "sorpresa" : "senalar"),
  };

  // ---------- 7 · De 512 a un millón (curva escalonada) ----------
  const HITOS = [[2018, 512, 46, "512"], [2020, 2048, 47, "2.048"], [2023, 8192, 48, "8.000"], [2023.4, 1e5, 48, "100.000"], [2023.9, 2e5, 48, "200.000"],
    [2024.1, 1e6, 49, "2024"], [2024.5, 2e6, 49, "dos"], [2025.3, 1.05e6, 50, "4.1"]];
  const b7 = {
    pintar(t) {
      azoteaH(e.capas, t, { suelo: SUELO });
      e.rot('De 512 a un <span class="clave">millón</span>', LLEGA(6));
      const X = (a) => Math.round(48 + (a - 2018) * 12), Y = (v) => Math.round(52 - (Math.log10(v) - Math.log10(500)) * 9);
      panel3(e.frente, 44, 12, 106, 48, "#10142a");
      for (let a = 2018; a <= 2026; a += 2) e.tx("etiqueta suave", String(a), Math.min(X(a) * 3 - 8, 412), 164, ini(45)); // «2026» dentro del panel
      e.tx("etiqueta suave", "Tokens · log.", 144, 40, ini(45));
      let prev = null;
      HITOS.forEach(([a, v, n, w], k) => {
        const llega = n === 49 && w === "dos" ? p(49, "millones") : p(n, w);
        if (t < llega) return;
        const x = X(a), y = Y(v);
        if (prev) { rect(e.frente, prev[0], prev[1], x - prev[0] + 1, 1, P3.naranja); rect(e.frente, x, Math.min(prev[1], y), 1, Math.abs(prev[1] - y) + 1, P3.naranja); }
        rect(e.frente, x - 1, y - 1, 3, 3, P3.contorno); rect(e.frente, x, y, 1, 1, P3.dorado);
        prev = [x, y];
      });
      // Etiquetas de cada peldaño (px CSS), colocadas a mano para que no se pisen con la escalera ni entre sí
      [["512", 46, "512", 150, 140], ["2.048", 47, "2.048", 222, 126], ["8K", 48, "8.000", 300, 112], ["100K", 48, "100.000", 288, 88],
        ["200K", 48, "200.000", 288, 74], ["1M", 49, "2024", 338, 72], ["2M", 49, "millones", 392, 60]].forEach(([s, n, w, x, y]) =>
        e.tx("etiqueta", s, x, y, p(n, w)));
      e.tx("insignia", "×2.000 en 8 años", 156, 100, p(51, "2.000"));
      if (t >= p(52, "30")) { linea(e.frente, X(2024.1), Y(1e6), X(2025.2), 14, "#5b8cff"); e.tx("etiqueta", "Epoch: ×30/año", 266, 40, p(52, "30"), "color:var(--azul)"); }
      if (t >= ini(53)) { for (let x = X(2024); x <= X(2026); x += 2) rect(e.frente, x, Y(2e6) - 2, 1, 1, P3.blanco); e.tx("insignia", "Techo plano", 360, 112, ini(53)); }
      e.fuente("Fuentes: OpenAI, Anthropic, Google, Epoch AI", 144, 184, p(46, "512"));
    },
    gato: (t) => GATO(t >= ini(53) ? "pensar" : t >= ini(48) && t < fin(48) ? "sorpresa" : "senalar"),
  };

  // ---------- 8 · Noviembre de 2026: tabla de modelos (plano de detalle) ----------
  const FILAS = [["Anthropic", "1M", 1e6, 55, "Anthropic"], ["OpenAI", "1,05M", 1.05e6, 55, "OpenAI"], ["Google", "1M", 1e6, 55, "Google"], ["DeepSeek", "1M", 1e6, 55, "DeepSeek"],
    ["xAI", "500K", 5e5, 56, "xAI"], ["Meta", "10M", 1e7, 57, "Meta"]];
  const b8 = {
    pintar(t) {
      servidoresH(e.capas, t, { suelo: SUELO });
      e.rot('Noviembre de <span class="clave">2026</span>', LLEGA(7));
      panel3(e.frente, 46, 12, 108, 43);
      if (t < ini(58)) {
        e.tx("etiqueta suave", "Ventana máxima · escala log.", 148, 44, ini(54));
        FILAS.forEach(([nombre, valor, v, n, w], k) => {
          const a = p(n, w), y = 19 + k * 6;
          if (t < a) return;
          e.tx("etiqueta", nombre, 148, y * 3 + 1, a);
          barra3(e.frente, 84, y, 46, 4, Math.log10(v / 1e4) / 3, k === 4 ? P3.naranja : P3.azul);
          e.tx("etiqueta", valor, 400, y * 3 + 1, a, k === 4 ? "color:var(--naranja)" : "");
        });
        if (t >= p(56, "mitad")) { e.marcar(47, 19 + 4 * 6 - 1, 106, 6); e.tx("insignia", "½", 448, 82, p(56, "mitad")); }
      } else {
        e.tx("titular", 'Estándar: <span class="clave">1M</span>', 156, 56, ini(58));
        e.tx("etiqueta", "Gemini: 2M (2024) → 1M (2026)", 156, 92, p(58, "Gemini"));
        e.tx("etiqueta", "App de Gemini sin plan:", 156, 120, ini(59));
        e.tx("dato", "32.000", 156, 132, p(59, "32.000"), "color:var(--naranja)");
      }
      e.fuente("Fuentes: webs oficiales (nov. 2026)", 148, 176, p(55, "Anthropic"));
    },
    gato: (t) => GATO(t >= p(56, "mitad") && t < fin(56) ? "sorpresa" : "senalar"),
  };

  // ---------- 9 · Cabe, pero no lo lee (plano de detalle en la caída de Gemini) ----------
  const b9 = {
    pintar(t) {
      laboratorioH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot('¿Lo <span class="clave">lee</span> bien?', LLEGA(8));
      const fase = t < ini(62) ? 0 : t < ini(65) ? 1 : t < ini(68) ? 2 : t < ini(69) ? 3 : 4;
      if (fase === 0) {
        e.tx("titular", 'Cabe <span class="clave">≠</span> lo lee', 210, 70, p(60, "cabe"));
        e.tx("etiqueta", "No del todo", 210, 104, ini(61), "color:var(--naranja)");
      } else if (fase === 1) {
        barrasPrueba3(e, t, 50, 48, 30, Array.from({ length: 18 }, (_, k) => 0.95 - k * 0.04), { desde: p(62, "18"), cada: 0.05, ancho: 2 });
        if (t < ini(64)) { e.tx("etiqueta", "Chroma · 18 modelos", 150, 152, p(62, "18")); e.tx("etiqueta", "Más texto → peor", 150, 166, p(62, "peor"), "color:var(--naranja)"); }
        if (t < ini(63)) e.fuente("Fuente: Chroma (2025)", 150, 182, p(62, "18"));
        if (t >= ini(63)) {
          barrasPrueba3(e, t, 112, 48, 30, [0.9, 0.85, 0.8, 0.7, 0.62, 0.45, 0.4, 0.3, 0.25, 0.2], { desde: ini(63), umbral: 0.5, malo: P3.rojo, color: P3.verde });
          e.tx("etiqueta", "RULER: la mitad", 336, 152, p(63, "mitad"));
        }
        if (t >= ini(63) && t < ini(64)) e.fuente("Fuentes: Chroma, NVIDIA", 150, 182, ini(63));
        if (t >= ini(64)) {
          e.tx("etiqueta", "NoLiMa: 13 modelos", 150, 152, p(64, "13"));
          e.tx("insignia", "A 32.000, 11 bajo la mitad", 150, 166, p(64, "once"));
          e.fuente("Fuentes: Chroma, NVIDIA, NoLiMa", 150, 182, ini(63));
        }
      } else if (fase === 2) { // detalle: la barra de Gemini cae; Opus sube
        const cae = p(65, "26,3"), ab = 0.849 - (t >= cae ? e.paso(e.prog(t, cae, cae + 0.5), 0.25) * (0.849 - 0.263) : 0);
        e.tx("etiqueta", "Gemini 3.1 Pro", 162, 54, ini(65));
        barra3(e.frente, 54, 24, 90, 6, ab, ab < 0.5 ? P3.rojo : P3.verde);
        e.tx(t >= cae ? "insignia" : "etiqueta", t >= cae ? "1M: 26,3 %" : "128K: 84,9 %", 162, 96, p(65, "84,9"), t >= cae ? "background:var(--rojo);color:#f5f7fb" : "");
        e.fuente("Fuente: Google DeepMind", 162, 110, p(65, "84,9"));
        if (t >= ini(66)) {
          e.tx("etiqueta", "Claude Opus 4.6 · 1M", 162, 126, p(66, "Opus"));
          const sube = e.paso(e.prog(t, p(66, "76"), p(66, "76") + 0.5), 0.25), v = 0.185 + sube * (0.76 - 0.185);
          barra3(e.frente, 54, 46, 90, 6, t >= p(66, "76") ? v : 0.185, P3.verde);
          e.tx("etiqueta", t >= p(66, "18,5") ? "76 % (antes, 18,5 %)" : "", 162, 158, p(66, "76"));
          e.fuente("Fuente: Anthropic", 330, 142, p(66, "76"));
          e.tx("insignia", "Del fabricante", 330, 126, p(67, "cifras"), "background:var(--dorado)");
        }
      } else if (fase === 3) {
        e.tx("etiqueta", "Epoch, desde fuera:", 150, 60, ini(68));
        e.tx("dato", "×250", 150, 74, p(68, "250"), "color:var(--verde)");
        e.tx("etiqueta", "en 9 meses (80 % de acierto)", 150, 104, p(68, "meses"));
        e.fuente("Fuente: Epoch AI (2025)", 150, 120, p(68, "250"));
      } else {
        e.tx("etiqueta", "Lo que crece: lo bien que se usa", 150, 40, ini(69), "color:var(--verde)");
        if (t >= p(70, "etiqueta")) { barra3(e.frente, 50, 24, 90, 5, 1, P3.azul); e.tx("etiqueta", "Etiqueta", 150, 58, p(70, "etiqueta")); }
        if (t >= p(70, "tamaño")) { hoja3(e.frente, 60, MESA - 12, 70, 10, "tu"); e.tx("etiqueta", "= tamaño de la mesa", 222, 58, p(70, "tamaño")); }
        if (t >= p(70, "leer")) { lupa3(e.frente, 132, 30); e.tx("insignia", "≠ lo que lee bien", 222, 92, p(70, "leer")); }
        e.tx("etiqueta", "Ingeniería de contexto", 150, 112, p(71, "ingeniería"));
        e.tx("insignia", "Pocos tokens, los buenos", 150, 128, p(71, "importan"));
        e.fuente("Fuente: Anthropic", 150, 184, p(71, "ingeniería"));
      }
    },
    gato: (t) => GATO(t >= p(65, "26,3") && t < fin(65) ? "sorpresa" : t >= ini(67) && t < fin(67) ? "pensar" : "senalar"),
  };

  // ---------- 10 · Los trucos ----------
  const b10 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot('Los <span class="clave">trucos</span>', LLEGA(9));
      const f = t < ini(75) ? 0 : t < ini(77) ? 1 : t < ini(79) ? 2 : t < ini(80) ? 3 : t < ini(82) ? 4 : t < ini(83) ? 5 : 6;
      if (f === 0) {
        const llega = p(73, "fichas");
        for (let k = 0; k < 5; k++) { const x = t >= llega ? 50 + k * 14 : -20; if (t >= llega + k * 0.08) hoja3(e.frente, x, 42, 12, 8, "archivo"); }
        e.tx("insignia", "RAG", 150, 50, p(73, "RAG"));
        e.tx("etiqueta", "El bibliotecario: solo las fichas útiles", 150, 70, p(73, "bibliotecario"));
        e.tx("etiqueta", "Más barato", 150, 90, p(74, "barato"), "color:var(--verde)");
        e.tx("etiqueta", "Con todo en la mesa: mejor", 150, 104, p(74, "mejores"), "color:var(--naranja)");
        e.fuente("Fuentes: Lewis et al. (2020), Li et al. (2024)", 150, 184, p(73, "RAG"));
      } else if (f === 1) {
        hoja3(e.frente, 60, 41, 18, 10, "archivo"); e.tx("etiqueta", "Resumen", 180, 108, p(75, "resumen"), "color:var(--verde)");
        if (t >= p(76, "guardado")) disquete3(e.frente, 90, 40);
        e.tx("etiqueta", "Punto de guardado", 270, 104, p(76, "guardado"));
        e.fuente("Fuente: Anthropic", 150, 184, p(75, "resumen"));
      } else if (f === 2) {
        for (let k = 0; k < 3; k++) if (t >= p(77, "becarios") + k * 0.1) { panel3(e.frente, 50 + k * 34, 26, 28, 12, "#2a1e19"); token3(e.frente, 61 + k * 34, 29, [P3.azul, P3.verde, P3.naranja][k], t, { semilla: k }); }
        e.tx("etiqueta", "Becarios con su mesa limpia", 150, 128, p(77, "becarios"));
        e.tx("dato", "+90 %", 150, 144, p(78, "90"), "color:var(--verde)");
        e.tx("dato", "×15 tokens", 280, 144, p(78, "quince"), "color:var(--naranja)");
        e.fuente("Fuente: Anthropic (2025)", 150, 184, p(78, "90"));
      } else if (f === 3) {
        corro3(e, t, 92, 30, 22, 14, 8, { lineas: false });
        const pos = [[92 + 22, 30], [92, 44], [70, 30]]; // pocos saludos: solo a los importantes
        pos.forEach(([x, y]) => linea(e.capas.medio, 94, 18, x + 2, y + 2, "#e9dcff"));
        e.tx("etiqueta", "DeepSeek: solo los importantes", 150, 172, p(79, "importantes"));
        e.fuente("Fuente: DeepSeek-V4 (2026)", 150, 186, p(79, "DeepSeek"));
      } else if (f === 4) {
        const emborrona = t >= ini(81);
        chuleta3(e.frente, 60, 12, 28, 30, t);
        if (emborrona) for (let r = 0; r < 4; r++) rect(e.frente, 61, 13 + r * 3, 26, 2, "#c9bf9a");
        e.tx("etiqueta", "Mamba: coste en línea recta", 150, 140, p(80, "Mamba"));
        e.tx("etiqueta", "Lo viejo se emborrona", 150, 156, p(81, "emborronan"), "color:var(--texto-suave)");
        e.fuente("Fuentes: Gu y Dao (2023), Raschka", 150, 172, p(80, "Mamba"));
      } else if (f === 5) {
        for (let k = 0; k < 4; k++) if (t >= p(82, "una") + k * 0.1) { rect(e.frente, 60 + k * 16, 24, 14, 14, P3.contorno); rect(e.frente, 61 + k * 16, 25, 12, 12, k === 3 ? P3.naranja : "#5a6072"); }
        e.tx("titular", "3 : 1", 186, 126, p(82, "cuatro"));
        e.tx("etiqueta", "Atención de siempre: 1 de 4", 186, 156, p(82, "atención"), "color:var(--naranja)");
        e.fuente("Fuente: Raschka (Qwen)", 186, 172, p(82, "Qwen"));
      } else {
        e.tx("etiqueta", "MiniMax", 150, 60, p(83, "MiniMax"));
        e.tx("insignia", "← Vuelve a la atención completa", 150, 80, p(83, "volvió"));
        e.tx("etiqueta", "En textos largos fallaba", 150, 100, p(83, "fallaban"), "color:var(--naranja)");
        e.fuente("Fuente: LMSYS (2025)", 150, 116, p(83, "volvió"));
      }
    },
    gato: (t) => GATO(t >= ini(83) ? "pensar" : "senalar"),
  };

  // ---------- 11 · ¿Y si fuera infinita? ----------
  const b11 = {
    pintar(t) {
      azoteaH(e.capas, t, { suelo: SUELO });
      e.rot('¿Y si fuera <span class="clave">infinita</span>?', LLEGA(10));
      if (t < ini(88)) {
        e.tx("titular", "¿Tirar el Transformer?", 150, 40, p(84, "Transformer"));
        e.tx("etiqueta", "Pocos millones: retocarlo", 150, 96, p(85, "retocarlo"), "color:var(--verde)");
        e.tx("etiqueta", "o mezclarlo", 358, 96, p(85, "mezclarlo"), "color:var(--verde)");
        e.fuente("Fuentes: DeepSeek, Meta", 150, 110, p(85, "retocarlo"));
        e.tx("etiqueta", "Infinita:", 150, 128, p(86, "infinita"), "color:var(--naranja)");
        if (t >= p(86, "chuleta") && t < ini(87)) chuleta3(e.frente, 136, 44, 12, 6 + Math.round(e.paso(e.prog(t, p(86, "chuleta"), p(86, "olvidar")), 0.125) * 16), t);
        e.tx("etiqueta", "ningún ordenador da para siempre", 150, 142, p(86, "ordenador"), "color:var(--texto-suave)");
        e.tx("etiqueta", "resumir u olvidar", 230, 128, p(86, "olvidar"), "color:var(--naranja)");
        if (t >= ini(87)) { // mesa que se pierde en el horizonte
          for (let k = 0; k < 6; k++) rect(e.frente, 48 + k * 18, 56 - k, 18 - k, 2 + (k < 3 ? 1 : 0), ["#8a5e3e", "#7d5537", "#6b4a32", "#5a3b26", "#4a3526", "#3a2a20"][k]);
          e.tx("etiqueta", "No lo arreglaría todo", 150, 146, p(87, "todo"));
        }
      } else {
        opinion3(e, 46, 12, 108, 22, "Dario Amodei (Anthropic)", "1M ≈ días de aprendizaje humano", ini(88), "Fuente: Dwarkesh Patel (2026)");
        if (t >= ini(89)) opinion3(e, 46, 38, 108, 22, "Andrej Karpathy", "Falta aprender con la experiencia", ini(89), "Fuente: Dwarkesh Patel (2025)");
      }
    },
    gato: (t) => GATO(t >= ini(88) ? "pensar" : "senalar"),
  };

  // ---------- 12 · Cierre ----------
  const b12 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot('La <span class="clave">mesa</span> y el gato', LLEGA(11));
      const elige = ini(92);
      if (t < elige) {
        e.tx("etiqueta", "Etiqueta", 150, 60, p(91, "etiqueta")); barra3(e.frente, 90, 19, 60, 5, 1, P3.azul);
        e.tx("etiqueta", "Uso real", 150, 82, p(91, "peor")); if (t >= p(91, "peor")) barra3(e.frente, 90, 26, 60, 5, 0.4, P3.naranja);
        pila3(e.frente, 60, MESA - 2, ["tu", "respuesta", "oculto", "tu", "archivo", "tu", "respuesta"], 16, 11);
      } else {
        hoja3(e.frente, 80, 41, 20, 10, "tu");
        e.marcar(79, 40, 22, 12);
        e.tx("etiqueta", "Lo que importa", 238, 168, p(92, "elijas"));
        if (t >= ini(93)) {
          pensamiento3(e.frente, 5, 13, 34, 16, 20, 32);
          const crece = Math.min(3, Math.floor((t - p(93, "aprende")) / 0.2) + 1);
          for (let k = 0; k < (t >= p(93, "aprende") ? crece : 1); k++) libros3(e.frente, 8 + k * 9, 21 - (k % 2));
          e.tx("tarjeta-texto", "Aprende", 23, 46, p(93, "aprende"));
        }
      }
    },
    gato: (t) => GATO(t >= p(93, "aprende") ? "celebrar" : t >= ini(92) ? "tocar" : "pensar"),
  };

  const BLOQUES = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12];

  // ---------- cámara: plano general con acercamiento lento; detalle solo en las explicaciones core (Mario) ----------
  // El acercamiento es leve (k = 25/24) porque en 16:9 el contenido llega casi a los bordes.
  const ACERCA = (a, b) => [a, "mover", 25 / 24, 240, 110, b - a];
  const ALEJA = (b) => [b - 0.35, "mover", 1, 240, 110, 0.3];
  const planos = [[0, "corte", 1]];
  const sinDetalle = (k) => ![2, 7, 8].includes(k);
  CORTES.forEach((c, k) => { // bloques k = 0..10; el último bloque se trata aparte
    const a = LLEGA(k) + 0.1;
    if (sinDetalle(k)) planos.push(ACERCA(a, c - 0.45), ALEJA(c));
  });
  planos.push(ACERCA(LLEGA(11) + 0.1, fin(93) - 0.5));
  // Detalles: lo oculto (fr15-fr16), la tabla (fr55-fr57) y la caída de Gemini (fr65-fr66)
  planos.push([p(15, "instrucciones"), "zoom", 1.25, 288, 135], [ini(17), "corte", 1]);
  planos.push([p(55, "Anthropic"), "zoom", 1.25, 300, 95], [ini(58), "corte", 1]);
  planos.push([ini(65), "zoom", 1.25, 300, 110], [ini(68), "corte", 1]);
  planos.sort((a, b) => a[0] - b[0]);

  const CLAVES = { fr01: "300", fr03: "mesa", fr04: "contexto", fr07: "delante", fr09: "tokens", fr10: "555.000", fr13: "novelas",
    fr15: "instrucciones", fr16: "respuesta", fr17: "relee", fr19: "atención", fr21: "fiesta", fr22: "45", fr24: "millón",
    fr28: "antiguos", fr29: "resumido", fr31: "peor", fr32: "medio", fr35: "nuevo", fr36: "muros", fr37: "cuadrado", fr39: "chuleta",
    fr40: "usuario", fr41: "práctica", fr44: "factura", fr51: "2.000", fr53: "techo", fr55: "millón", fr56: "mitad", fr58: "estándar",
    fr59: "32.000", fr62: "peor", fr64: "mitad", fr65: "26,3", fr66: "76", fr67: "empresas", fr69: "usa", fr71: "importan", fr73: "RAG",
    fr75: "resumen", fr77: "becarios", fr79: "importantes", fr80: "Mamba", fr82: "cuatro", fr83: "completa", fr86: "olvidar",
    fr88: "Opinión", fr89: "Opinión", fr91: "etiqueta", fr93: "aprende" };

  e = escenaV3({ W, H, bloques: BLOQUES, cortes: CORTES, planos, SX: 240, SY: 110, lineaCaja: 200, claves: CLAVES, linea: 56 });

  // ---------- sonido (efectos a -24 dB, Mario 2026-11-03): solo cuando algo aparece, se completa o cambia de plano ----------
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(1, "300"), "aparicion"], [p(2, "cambie"), "error"], [p(3, "mesa"), "seleccion"], [p(7, "delante"), "aparicion"], [p(9, "tokens"), "aparicion"],
    [p(10, "555.000"), "tick"], [p(13, "ocho") + 0.48, "tick"], [p(15, "instrucciones"), "seleccion"], [p(16, "respuesta"), "aparicion"],
    [p(17, "relee"), "aparicion"], [p(21, "saludar"), "aparicion"], [p(22, "45"), "tick"], [PF(fr(22), "millón"), "tick"], [p(24, "500.000"), "acierto"],
    [p(28, "tira") + 0.5, "error"], [p(29, "resumido"), "aparicion"], [p(35, "chat"), "acierto"], [p(36, "cuatro"), "aparicion"],
    [p(40, "gigas"), "error"], [p(44, "900.000"), "tick"], [p(51, "2.000"), "acierto"], [p(56, "mitad"), "seleccion"], [p(57, "Meta"), "aparicion"],
    [p(65, "26,3") + 0.5, "error"], [p(66, "76") + 0.5, "acierto"], [p(68, "250"), "tick"], [p(73, "fichas"), "aparicion"],
    [p(76, "guardado"), "aparicion"], [p(78, "90"), "tick"], [p(83, "volvió"), "seleccion"], [ini(88), "aparicion"], [ini(89), "aparicion"],
    [p(92, "elijas"), "seleccion"], [p(93, "aprende"), "acierto"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
