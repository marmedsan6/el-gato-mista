// resumen-semana-agentes · short A «El mayor robo cripto empezó con una entrevista de trabajo». Estilo v3; plano de detalle
// solo en la cronología del robo (Mario, 2026-11-06). Guion propio, no recortado del largo. Fuente del dato bajo el rótulo.
(() => {
  const { SUELO, MESA, GX, GY } = CORTO;
  const { P, INI, FIN, medio } = tiemposDe(window.TIMING);
  const fr = (n) => `fr${String(n).padStart(2, "0")}`;
  const p = (n, w, k) => P(fr(n), w, k), ini = (n) => INI(fr(n)), fin = (n) => FIN(fr(n));
  const CORTES = [medio("fr02", "fr03"), medio("fr06", "fr07"), medio("fr09", "fr10")];
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const GATO = (pose) => ({ x: GX, y: GY, pose, espejo: false });
  const ev = [], son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  const ROJO = "background:var(--rojo);color:#f5f7fb";
  let e;

  const bloques = [
    { // A1 · la cifra y la oferta
      pintar(t) {
        escenario3("azotea", e.capas, t, { suelo: SUELO });
        e.rot('El robo a <span class="clave">Binance</span>', 0);
        if (t < ini(2)) {
          cajaFuerte3(e.frente, 56, 40, t, { abierta: t >= p(1, "robaron"), alarma: t >= p(1, "robaron") });
          e.tx("dato", "6.340 M$", 16, 104, p(1, "6.340"));
          e.tx("etiqueta", "Mayor robo cripto", 16, 128, p(1, "mayor"));
          e.tx("insignia", "×4 el récord", 16, 144, p(1, "cuatro"));
          e.fuente("Fuente: The Block, Elliptic", 16, 82, 0);
        } else {
          papel3(e.frente, 58, 36, t, { activo: true, sello: P3.rojo });
          e.tx("titular", "Oferta de", 16, 100, p(2, "oferta")); e.tx("titular", '<span class="clave">trabajo</span>', 16, 124, p(2, "oferta"));
        }
      },
      gato: (t) => GATO(t >= ini(2) ? "pensar" : t >= p(1, "robaron") ? "sorpresa" : "pie"),
    },
    { // A2 · la cronología (detalle)
      pintar(t) {
        escenario3("azotea", e.capas, t, { suelo: SUELO });
        e.rot('Una campaña de <span class="clave">meses</span>', LLEGA(1));
        const s1 = p(3, "septiembre"), s2 = ini(5), s3 = ini(6);
        if (t >= s1) {
          ingeniero3(e.frente, 46, 34, t, { pillado: t >= ini(4) }); papel3(e.frente, 58, 32, t, { activo: t < ini(4), sello: P3.rojo });
          e.tx("etiqueta", "Sept.", 20, 104, s1); e.tx("etiqueta", "Oferta falsa", 20, 116, p(3, "reclutador"));
          e.fuente("Fuente: informe de Binance", 16, 82, s1);
        }
        if (t >= s2) {
          robot3(e.frente, 46, 48, t, { color: "rojo", cara: "error", trabaja: true });
          ingeniero3(e.frente, 57, 49, t, { camiseta: P3.verde, portatil: false }); ingeniero3(e.frente, 64, 49, t, { camiseta: P3.naranja, portatil: false });
          e.tx("etiqueta", "20 oct", 20, 146, s2); e.tx("etiqueta", "IA interna", 20, 158, p(5, "herramienta"));
        }
        if (t >= s3) {
          cajaFuerte3(e.frente, 46, 62, t, { abierta: true, alarma: true });
          e.tx("etiqueta", "29 oct", 20, 188, s3); e.tx("etiqueta", "Retiradas", 20, 200, p(6, "retiradas"));
        }
      },
      gato: (t) => GATO("senalar"),
    },
    { // A3 · las claves, el FBI y lo recuperado
      pintar(t) {
        escenario3("azotea", e.capas, t, { suelo: SUELO });
        e.rot(t >= ini(9) ? 'Congelado y <span class="clave">repuesto</span>' : 'No robaron las <span class="clave">claves</span>', t >= ini(9) ? ini(9) : LLEGA(2));
        if (t < ini(9)) {
          llaveRoja3(e.frente, 46, 30); if (t >= p(7, "claves")) aspa3(e.frente, 48, 26, P3.rojo);
          e.tx("etiqueta", "Claves: a salvo", 16, 104, p(7, "claves"));
          if (t >= p(7, "firma")) { papel3(e.frente, 60, 26, t, { sello: P3.dorado }); e.tx("etiqueta", "Entraron en", 16, 122, p(7, "firma"), "color:var(--naranja)"); e.tx("etiqueta", "el sistema", 16, 134, p(7, "firma"), "color:var(--naranja)"); e.tx("etiqueta", "que firma", 16, 146, p(7, "firma"), "color:var(--naranja)"); }
          if (t >= ini(8)) { e.tx("etiqueta", "FBI:", 16, 166, p(8, "FBI")); e.tx("etiqueta", "Corea del Norte", 16, 178, p(8, "Corea")); }
          e.fuente(t >= ini(8) ? "Fuente: Elliptic, CNBC, FBI" : "Fuente: Elliptic, CNBC", 16, 82, p(7, "claves"));
        } else {
          cajaFuerte3(e.frente, 56, 32, t);
          for (let k = 0; k < 4; k++) { rect(e.frente, 46 + k * 7, 46, 6, 6, P3.contorno); rect(e.frente, 47 + k * 7, 47, 4, 4, "#9fd8e0"); rect(e.frente, 47 + k * 7, 47, 4, 1, "#e4f7f9"); }
          e.tx("dato", "≈ 3.000 M$", 16, 104, p(9, "3.000"), "color:#9fd8e0"); e.tx("etiqueta", "congelados", 16, 134, p(9, "congelado"));
          e.tx("insignia", "98 % repuesto", 16, 176, p(9, "98"), "background:var(--verde)");
          e.fuente("Fuente: Elliptic, CNBC", 16, 82, ini(9));
        }
      },
      gato: (t) => GATO(t >= p(9, "98") ? "celebrar" : t >= ini(8) ? "pensar" : "senalar"),
    },
    { // A4 · la puerta y el puente; cierre al largo
      pintar(t) {
        escenario3("azotea", e.capas, t, { suelo: SUELO });
        e.rot('La puerta y el <span class="clave">puente</span>', LLEGA(3));
        if (t < p(11, "largo")) {
          ingeniero3(e.frente, 50, 34, t, { portatil: false }); robot3(e.frente, 66, 33, t, { color: "rojo", cara: "error" });
          e.tx("insignia", "Puerta: una persona", 16, 104, p(10, "persona"));
          e.tx("insignia", "Puente: una IA", 16, 124, p(10, "puente"), ROJO);
        } else carteLargo(e, t, p(11, "largo"));
      },
      gato: (t) => GATO(t >= ini(11) ? "senalar" : "pensar"),
    },
  ];

  const planos = [[0, "corte", 1], [p(3, "septiembre"), "zoom", 1.25, 120, 150], [ini(7) - 0.4, "corte", 1]];
  const CLAVES = { fr01: "Binance", fr02: "oferta", fr03: "reclutador", fr04: "ordenador", fr05: "herramienta", fr06: "retiradas", fr07: "firma",
    fr08: "Corea", fr09: "repuesto", fr10: "puente", fr11: "largo" };
  e = escenaShort(bloques, CORTES, planos, CLAVES);
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(1, "robaron"), "error"], [p(2, "oferta"), "aparicion"], [p(3, "septiembre"), "aparicion"], [ini(5), "aparicion"], [ini(6), "error"],
    [p(7, "claves"), "seleccion"], [p(9, "98"), "acierto"], [p(10, "puente"), "aparicion"], [p(11, "largo"), "aparicion"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
