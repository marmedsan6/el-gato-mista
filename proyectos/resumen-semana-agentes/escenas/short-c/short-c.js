// resumen-semana-agentes · short C «Mismo modelo, distinto agente». Estilo v3; plano de detalle solo en el bucle que se cambia
// (Mario, 2026-11-06). Guion propio, no recortado del largo. Fuente del dato bajo el rótulo.
(() => {
  const { SUELO, MESA, GX, GY } = CORTO;
  const { P, INI, medio } = tiemposDe(window.TIMING);
  const fr = (n) => `fr${String(n).padStart(2, "0")}`;
  const p = (n, w, k) => P(fr(n), w, k), ini = (n) => INI(fr(n));
  const CORTES = [medio("fr02", "fr03"), medio("fr05", "fr06"), medio("fr09", "fr10")];
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const GATO = (pose) => ({ x: GX, y: GY, pose, espejo: false });
  const ev = [], son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  const AVISO = "color:var(--naranja);background:#171e2a;border:1px solid var(--rojo);padding:2px 3px";
  let e;
  const lab = (t) => escenario3("laboratorio", e.capas, t, { suelo: SUELO, mesa: MESA });

  const bloques = [
    { // C1 · mismo cerebro, otro agente
      pintar(t) {
        lab(t);
        e.rot('Mismo <span class="clave">modelo</span>', 0);
        cerebro3(e.frente, 44, 30, t); robot3(e.frente, 44, 42, t, { color: "azul", trabaja: true });
        if (t >= p(1, "distintos")) { cerebro3(e.frente, 66, 30, t); robot3(e.frente, 66, 42, t, { color: "naranja", cara: t >= p(1, "harán") ? "error" : "feliz" }); }
        e.tx("etiqueta", "Mismo cerebro", 16, 104, p(1, "cerebro"));
        e.tx("etiqueta", "Otro agente", 16, 118, p(1, "harán"), "color:var(--naranja)");
        if (t >= ini(2)) e.tx("insignia", "Modelo + harness", 16, 176, p(2, "harness"));
        e.fuente("Fuente: Helmcode", 16, 82, p(1, "cerebro"));
      },
      gato: (t) => GATO(t >= p(1, "harán") ? "sorpresa" : "senalar"),
    },
    { // C2 · qué es el harness y qué decide
      pintar(t) {
        lab(t);
        const fase = t < ini(4) ? "rodea" : t < ini(5) ? "decide" : "techo";
        e.rot(fase === "rodea" ? 'El <span class="clave">harness</span>' : fase === "decide" ? 'Lo que <span class="clave">decide</span>' : 'El <span class="clave">techo</span>', fase === "rodea" ? LLEGA(1) : ini(fase === "decide" ? 4 : 5));
        if (fase === "rodea") {
          cerebro3(e.frente, 56, 40, t, { brilla: true });
          rect(e.frente, 52, 36, 18, 1, P3.naranja); rect(e.frente, 52, 50, 18, 1, P3.naranja); rect(e.frente, 52, 36, 1, 15, P3.naranja); rect(e.frente, 69, 36, 1, 15, P3.naranja);
          [["Herramientas", "herramientas", (x, y) => { rect(e.frente, x, y + 2, 6, 2, P3.contorno); rect(e.frente, x + 1, y + 2, 4, 1, P3.metalLuz); rect(e.frente, x + 5, y, 2, 6, P3.contorno); }, 44, 32],
            ["Archivos", "archivos", (x, y) => papel3(e.frente, x, y - 3, t), 72, 33],
            ["Permisos", "permisos", (x, y) => candado3(e.frente, x + 1, y - 1), 44, 54],
            ["Memoria", "memoria", (x, y) => disquete3(e.frente, x - 1, y - 3), 74, 56]].forEach(([s, w, dib, x, y], k) => {
            const a = p(3, w); if (t < a) return;
            dib(x, y); e.tx("etiqueta", s, 16, 104 + k * 14, a);
          });
          e.tx("etiqueta", "Claude Code · Codex", 16, 176, p(3, "Codex"));
        }
        if (fase === "decide") {
          [["¿Pide permiso?", "borrar", () => candado3(e.frente, 61, 32)], ["¿Qué olvida?", "olvida", () => disquete3(e.frente, 59, 41)], ["¿Repite o cambia?", "repite", () => bucle3(e.frente, 59, 51, t, { roto: t < p(4, "otra") })]].forEach(([s, w, dib], k) => {
            const a = p(4, w); if (t < a) return;
            dib(); e.tx("etiqueta", s, 16, 104 + k * 30, a);
          });
        }
        if (fase === "techo") {
          rect(e.frente, 50, 26, 34, 1, P3.blanco);
          barra3(e.frente, 54, 28, 8, 24, 1, P3.verde); if (t >= p(5, "harness")) barra3(e.frente, 70, 40, 8, 12, 1, P3.naranja);
          e.tx("etiqueta", "Techo:", 16, 104, p(5, "techo")); e.tx("etiqueta", "el modelo", 16, 116, p(5, "techo"));
          e.tx("etiqueta", "Harness:", 16, 136, p(5, "harness"), "color:var(--naranja)"); e.tx("etiqueta", "cuánto llegas", 16, 148, p(5, "acercas"), "color:var(--naranja)");
        }
        e.fuente("Fuente: Helmcode", 16, 82, LLEGA(1));
      },
      gato: (t) => GATO(t >= ini(5) ? "tocar" : t >= ini(4) ? "pensar" : "senalar"),
    },
    { // C3 · el de DeepSeek: el bucle se cambia (detalle)
      pintar(t) {
        lab(t);
        const fase = t < ini(7) ? "ds" : t < ini(9) ? "bucle" : "aviso";
        e.rot(fase === "aviso" ? 'Vista <span class="clave">previa</span>' : fase === "bucle" ? 'El <span class="clave">bucle</span>' : 'El de <span class="clave">DeepSeek</span>', fase === "aviso" ? ini(9) : fase === "bucle" ? ini(7) : LLEGA(2));
        if (fase === "ds") {
          robot3(e.frente, 56, 32, t, { color: "azul", trabaja: true });
          e.tx("titular", "DeepSeek", 16, 106, ini(6)); e.tx("insignia", "Abierto", 16, 136, p(6, "abierto"));
          e.fuente("Fuente: repo de DeepSeek", 16, 82, ini(6));
        }
        if (fase === "bucle") {
          const cambia = p(8, "pieza"), entra = p(8, "cambiar");
          const PASOS = [["Lee", 40, 32], ["Piensa", 62, 44], ["Actúa", 40, 58], ["Mira", 18, 44]];
          const activo = Math.floor(t / 0.35) % 4;
          // recorrido: flechas de 1 unidad entre los pasos, en el sentido de las agujas del reloj
          rect(e.frente, 61, 35, 1, 9, P3.gris); rect(e.frente, 61, 52, 1, 6, P3.gris); rect(e.frente, 29, 52, 1, 6, P3.gris); rect(e.frente, 29, 35, 1, 9, P3.gris);
          rect(e.frente, 55, 34, 7, 1, P3.gris); rect(e.frente, 29, 34, 11, 1, P3.gris); rect(e.frente, 55, 60, 7, 1, P3.gris); rect(e.frente, 29, 60, 11, 1, P3.gris);
          PASOS.forEach(([s, x, y], k) => {
            rect(e.frente, x, y, 16, 6, k === activo ? P3.naranja : P3.contorno); rect(e.frente, x + 1, y + 1, 14, 4, P3.metal);
            e.tx("etiqueta", s, x * 3 + 24 - s.length * 4, y * 3 + 6, ini(7));
          });
          const sale = t >= cambia ? Math.min(4, Math.floor((t - cambia) / 0.1)) * 3 : 0;
          if (t < entra) bucle3(e.frente, 44, 43 - sale, t, { color: t >= cambia ? P3.azul : P3.naranja });
          else bucle3(e.frente, 44, 43 + (e.s1(t, entra) || 0), t, { color: P3.verde });
          if (t < cambia) { candado3(e.frente, 54, 45); e.tx("etiqueta", "Núcleo fijo", 120, 200, p(7, "fijo")); }
          else e.tx("insignia", "Cambiable", 120, 200, cambia);
          e.fuente("Fuente: Helmcode", 16, 82, ini(7));
          if (t >= cambia) e.marcar(43, 42 - sale, 11, 11);
        }
        if (fase === "aviso") {
          robot3(e.frente, 60, 42, t, { color: "azul", cara: "pensar" });
          e.tx("etiqueta", "Habrá cambios", 16, 110, p(9, "previa"), AVISO);
          e.tx("etiqueta", "que lo rompan", 16, 126, p(9, "previa"), AVISO);
          e.fuente("Fuente: repo de DeepSeek", 16, 82, p(9, "previa"));
        }
      },
      gato: (t) => GATO(t >= ini(9) ? "pensar" : "senalar"),
    },
    { // C4 · cierre al largo
      pintar(t) { lab(t); e.rot('La semana de los <span class="clave">agentes</span>', LLEGA(3)); carteLargo(e, t, p(10, "largo")); },
      gato: (t) => GATO("senalar"),
    },
  ];

  const planos = [[0, "corte", 1], [p(8, "pieza"), "zoom", 1.25, 150, 140], [ini(9) - 0.4, "corte", 1]];
  const CLAVES = { fr01: "cerebro", fr02: "harness", fr03: "rodea", fr04: "borrar", fr05: "techo", fr06: "raro", fr07: "fijo", fr08: "cambiar", fr09: "previa", fr10: "largo" };
  e = escenaShort(bloques, CORTES, planos, CLAVES);
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(1, "distintos"), "aparicion"], [p(1, "harán"), "error"], [p(3, "herramientas"), "aparicion"], [p(4, "otra"), "acierto"], [p(8, "pieza"), "seleccion"],
    [p(8, "cambiar"), "acierto"], [p(9, "cambios"), "error"], [p(10, "largo"), "aparicion"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
