// ventanas-contexto-ia · short C «¿Por qué no la hacen infinita?». Estilo v3 con las desviaciones de style_guide.md;
// plano de detalle solo en la fiesta de saludos (Mario, 2026-11-03). Guion propio, no recortado del largo.
(() => {
  const { SUELO, MESA, GX, GY } = CORTO;
  const { P, PF, INI, FIN, medio } = tiemposDe(window.TIMING);
  const p = (n, w, k) => P(`fr0${n}`, w, k), ini = (n) => INI(`fr0${n}`), fin = (n) => FIN(`fr0${n}`);
  const CORTES = [medio("fr04", "fr05"), medio("fr06", "fr07"), medio("fr07", "fr08")];
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const GATO = (pose, extra = {}) => ({ x: GX, y: GY, pose, espejo: false, ...extra });
  const ev = [], son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  let e;

  const bloques = [
    { // C1 · la fiesta (detalle en el corro)
      pintar(t) {
        fiesta(e.capas, t, { suelo: SUELO });
        e.rot('Una <span class="clave">fiesta</span>', 0);
        const mil = p(3, "1.000");
        if (t < ini(2)) corro3(e, t, 43, 38, 14, 8, 2, { lineas: t >= 0.6 }); // desde el primer segundo, una ficha saluda a otra
        if (t >= ini(2) && t < ini(4)) {
          if (t < mil) corro3(e, t, 43, 38, 22, 13, t >= p(3, "10") ? 10 : 5, { lineas: t >= p(2, "todos") });
          else nube3(e, t, 14, 26, 58, 30, 400);
          if (t < p(3, "45")) e.tx("etiqueta", "Cada token, con todos", 16, 176, p(2, "todos"));
        }
        if (t >= p(3, "45") && t < p(4, "Meta")) { // al llegar la cita de Meta, el marcador deja su sitio
          const dobla = p(4, "duplicas");
          const valor = t >= dobla ? (t >= dobla + 0.6 ? "190" : "45") : t >= mil ? (t >= PF("fr03", "millón") ? "499.500" : "45") : "45";
          // en el detalle (×1,25) el marcador tiene que quedar por encima de la caja de diálogo (y = 300 px de pantalla)
          e.tx("etiqueta", "Saludos", 120, 172, p(3, "45")); e.tx("dato", valor, 120, 186, p(3, "45"), valor.length > 4 ? "font-size:20px" : "");
          // en el detalle (×1,25, MISTA fuera) la fuente va más a la izquierda para no entrar en la franja tapada; en el general, junto al marcador
          e.fuente("Fuente:<br>cálculo propio", t < ini(4) ? 60 : 120, 214, p(3, "45"));
        }
        if (t >= ini(4)) corro3(e, t, 43, 38, 22, 13, t >= p(4, "duplicas") + 0.6 ? 20 : 10, { lineas: true, turnoCada: 0.25 });
        e.tx("insignia", "×2 → ×4", 130, 66, p(4, "duplicas"));
        e.tx("etiqueta", "Según Meta: al cuadrado", 16, 176, p(4, "Meta"), "background:#171e2a;padding:1px 2px;color:var(--naranja)");
        e.fuente("Fuente:<br>Meta, Llama 3", 120, 192, p(4, "Meta"));
      },
      gato: (t) => GATO(t >= ini(3) ? "celebrar" : "pensar", t >= ini(3) ? { encima: (s, x, y) => gorro3(s, x + 11, y) } : {}),
    },
    { // C2 · la memoria
      pintar(t) {
        escenario3("servidores", e.capas, t, { suelo: SUELO });
        e.rot('La <span class="clave">memoria</span>', LLEGA(1));
        const a = LLEGA(1); // la chuleta crece desde que se entra en la sala y acaba saliéndose del cuadro
        if (t >= a) chuleta3(e.frente, 64, 24, 14, 8 + Math.round(e.paso(e.prog(t, a, fin(6)), 0.0625) * 140), t);
        e.tx("etiqueta", "Crece con cada token", 16, 90, p(5, "crece"));
        e.tx("dato", "516 GB", 16, 120, p(6, "ocuparía"), "color:var(--naranja)"); // entra antes de la cifra hablada y se queda
        e.tx("etiqueta", "1 conversación de 1M", 16, 150, p(6, "millón"));
        e.tx("insignia", "1 usuario", 16, 166, p(6, "usuario"));
        e.fuente("Fuente: Meta +<br>cálculo propio", 16, 180, p(6, "ocuparía"));
      },
      gato: (t) => GATO(t >= p(6, "gigas") && t < fin(6) ? "sorpresa" : "senalar"),
    },
    { // C3 · la práctica
      pintar(t) {
        escenario3("azotea", e.capas, t, { suelo: SUELO });
        e.rot('La <span class="clave">práctica</span>', LLEGA(2));
        if (e.s1(t, p(7, "aprendió")) !== null) panel3(e.frente, 3, 27 + e.s1(t, p(7, "aprendió")), 56, 42, "#10142a"); // entra con su primer texto
        // pista vertical: la ficha corre desde «8K» (abajo) y la meta «128K» está arriba
        rect(e.frente, 72, 28, 4, 34, "#3a4366"); for (let y = 30; y < 62; y += 4) rect(e.frente, 73, y, 2, 1, "#8a93c6");
        for (let k = 0; k < 4; k++) rect(e.frente, 70 + k * 2, 26, 2, 2, k % 2 ? P3.blanco : P3.contorno);
        const sube = e.paso(e.prog(t, p(7, "estiró"), p(7, "128.000") + 0.4), 0.125);
        token3(e.frente, 71, 57 - Math.round(sube * 10), P3.verde, t, { semilla: 3 });
        e.tx("etiqueta", "8K", 234, 186, p(7, "8.000"), "color:var(--verde)"); e.tx("etiqueta", "128K", 202, 64, p(7, "estiró"), "color:var(--naranja)");
        e.tx("etiqueta", "Llama 3 entrenó con", 16, 90, p(7, "aprendió"));
        e.tx("dato", "8.000", 16, 104, p(7, "8.000"));
        e.tx("etiqueta", "y se estiró a", 16, 140, p(7, "estiró"));
        e.tx("dato", "128.000", 16, 154, p(7, "estiró"), "color:var(--naranja)");
        e.fuente("Fuente:<br>Meta, Llama 3", 16, 176, p(7, "8.000"));
      },
      gato: (t) => GATO(t >= p(7, "128.000") ? "sorpresa" : "senalar"),
    },
    { // C4 · la factura y cierre
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('La <span class="clave">factura</span>', LLEGA(3));
        if (t < p(9, "largo")) {
          if (t >= p(8, "900.000")) panel3(e.frente, 5, 27, 76, 26, "#f4ecc8");
          e.tx("tarjeta-texto", "900.000 tokens", 24, 96, p(8, "900.000"));
          e.tx("tarjeta-texto", "= 100 ×", 24, 118, p(8, "cien"), "color:#b4622a");
          e.tx("tarjeta-texto", "9.000 tokens", 24, 136, p(8, "9.000"));
          e.fuente("Fuente: Anthropic (precios)", 16, 170, p(8, "900.000"));
        } else carteLargo(e, t, p(9, "largo"));
      },
      gato: (t) => GATO("senalar"),
    },
  ];

  const planos = [[0, "corte", 1], [ini(3), "zoom", 1.25, 110, 132], [ini(4), "corte", 1]];
  const CLAVES = { fr01: "fiesta", fr02: "todos", fr03: "45", fr04: "cuatro", fr05: "memoria", fr06: "usuario", fr07: "128.000", fr08: "factura", fr09: "largo" };
  e = escenaShort(bloques, CORTES, planos, CLAVES);
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(2, "todos"), "aparicion"], [p(3, "45"), "tick"], [PF("fr03", "millón"), "tick"], [p(4, "duplicas"), "seleccion"], [p(6, "gigas"), "error"],
    [p(7, "128.000"), "tick"], [p(8, "cien"), "tick"], [p(9, "largo"), "aparicion"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
