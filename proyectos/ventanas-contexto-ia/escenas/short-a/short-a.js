// ventanas-contexto-ia · short A «Tu IA se relee la conversación entera». Estilo v3 con las desviaciones de
// style_guide.md; plano de detalle solo en «lo oculto» (Mario, 2026-11-03). Guion propio, no recortado del largo.
(() => {
  const { SUELO, MESA, GX, GY } = CORTO;
  const { P, INI, FIN, medio } = tiemposDe(window.TIMING);
  const p = (n, w, k) => P(`fr0${n}`, w, k), ini = (n) => INI(`fr0${n}`), fin = (n) => FIN(`fr0${n}`);
  const CORTES = [medio("fr02", "fr03"), medio("fr05", "fr06"), medio("fr07", "fr08")];
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const GATO = (pose) => ({ x: GX, y: GY, pose, espejo: false });
  const ev = [], son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  let e;

  const bloques = [
    { // A1 · se relee todo
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('Se <span class="clave">relee</span> todo', 0);
        const lee = p(1, "relee");
        if (t >= lee) diario3(e.frente, 40, MESA - 13, t, t < fin(1));
        e.tx("titular", "Desde el", 16, 96, p(1, "principio")); e.tx("titular", '<span class="clave">principio</span>', 16, 120, p(1, "principio"));
        e.fuente("Fuente: Claude Code, Google", 16, 150, lee);
        if (t < p(2, "ventana")) e.tx("insignia", "No te recuerda", 130, 186, p(2, "recuerda")); // deja su sitio a la palabra clave
        e.tx("insignia", "Ventana de contexto", 16, 172, p(2, "ventana"));
      },
      gato: (t) => GATO(t >= ini(2) ? "senalar" : t >= p(1, "relee") ? "sorpresa" : "pie"),
    },
    { // A2 · lo que hay en la mesa (detalle)
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('Lo que <span class="clave">no ves</span>', LLEGA(1));
        corcho3(e.capas.medio, 4, 28, 66, 44);
        const llegan = [ini(3), p(4, "instrucciones"), p(4, "herramientas"), p(4, "archivos"), p(5, "respuesta")];
        [["tu", "Tú"], ["oculto", "Instrucciones"], ["herramienta", "Herramientas"], ["archivo", "Archivos"], ["respuesta", "Su respuesta"]].forEach(([tipo, nombre], k) => {
          const s = e.s1(t, llegan[k]);
          if (s === null) return;
          hoja3(e.frente, 7, 30 + k * 8 + s, 22, 6, tipo);
          e.tx("etiqueta", nombre, 90, (30 + k * 8) * 3 + 6, llegan[k], "background:#171e2a;padding:1px 2px");
        });
        const actual = llegan.filter((a) => t >= a).length - 1;
        if (actual >= 1) e.marcar(6, 29 + actual * 8, 24, 8);
        e.fuente("Fuente: Anthropic", 16, 220, p(4, "instrucciones"));
      },
      gato: (t) => GATO("senalar"),
    },
    { // A3 · cuando se llena
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('Cuando se <span class="clave">llena</span>', LLEGA(2));
        barra3(e.frente, 40, 62, 40, 4, 1, P3.rojo);
        pila3(e.frente, 52, MESA - 3, ["tu", "respuesta", "oculto", "tu", "respuesta", "tu", "archivo"], 18, 4);
        const tira = p(6, "tiran");
        if (t < tira) hoja3(e.frente, 40, MESA - 9, 10, 6, "tu");
        else if (t < tira + 0.6) { const f = Math.floor((t - tira) / 0.1); hoja3(e.frente, 40 - f * 2, MESA - 9 + f * 3, 10, 6, "tu"); }
        e.tx("etiqueta", "1 · Tira lo antiguo", 16, 90, tira);
        e.tx("etiqueta", "2 · Resume", 16, 106, p(6, "resumen"));
        e.tx("etiqueta", "(pierde detalles)", 16, 120, p(6, "detalles"), "background:#171e2a;padding:1px 2px");
        e.tx("insignia", "Más papeles = peor", 16, 146, p(7, "peor"), "background:var(--rojo);color:#f5f7fb");
        if (t >= p(7, "peor")) rect(e.frente, 52, MESA - 17, 18, 14, "rgba(20,16,26,0.45)");
        e.fuente("Fuente: Anthropic, Chroma", 16, 164, tira);
      },
      gato: (t) => GATO(t >= ini(7) ? "pensar" : t >= p(6, "tiran") && t < p(6, "tiran") + 0.8 ? "sorpresa" : "pie"),
    },
    { // A4 · consejo y cierre
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('El <span class="clave">consejo</span>', LLEGA(3));
        if (t < p(9, "largo")) {
          hoja3(e.frente, 52, MESA - 9, 14, 6, "tu");
          e.tx("titular", "Cambias", 16, 96, p(8, "consejo")); e.tx("titular", "de tema:", 16, 120, p(8, "consejo"));
          e.tx("insignia", "Chat nuevo", 16, 150, p(8, "consejo"));
          e.fuente("Fuente: Google", 16, 168, p(8, "consejo"));
        } else carteLargo(e, t, p(9, "largo"));
      },
      gato: (t) => GATO(t >= ini(9) ? "senalar" : t >= p(8, "nuevo") ? "celebrar" : "senalar"),
    },
  ];

  const planos = [[0, "corte", 1], [p(4, "instrucciones"), "zoom", 1.25, 110, 140], [ini(6) - 0.4, "corte", 1]];
  const CLAVES = { fr01: "relee", fr02: "contexto", fr03: "escribes", fr04: "instrucciones", fr05: "respuesta", fr06: "resumen", fr07: "peor", fr08: "nuevo", fr09: "largo" };
  e = escenaShort(bloques, CORTES, planos, CLAVES);
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(1, "relee"), "aparicion"], [p(4, "instrucciones"), "seleccion"], [p(5, "respuesta"), "aparicion"], [p(6, "tiran") + 0.5, "error"],
    [p(7, "peor"), "error"], [p(8, "nuevo"), "acierto"], [p(9, "largo"), "aparicion"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
