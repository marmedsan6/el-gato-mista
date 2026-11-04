// ventanas-contexto-ia · short B «Cabe, pero no lo lee». Estilo v3 con las desviaciones de style_guide.md; plano de
// detalle solo en la caída de Gemini (Mario, 2026-11-03). Guion propio, no recortado del largo.
(() => {
  const { SUELO, MESA, GX, GY } = CORTO;
  const { P, INI, FIN, medio } = tiemposDe(window.TIMING);
  const p = (n, w, k) => P(`fr0${n}`, w, k), ini = (n) => INI(`fr0${n}`), fin = (n) => FIN(`fr0${n}`);
  const CORTES = [medio("fr02", "fr03"), medio("fr04", "fr05"), medio("fr06", "fr07")];
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const GATO = (pose) => ({ x: GX, y: GY, pose, espejo: false });
  const ev = [], son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  let e;

  const bloques = [
    { // B1 · un millón, ocho novelas
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('<span class="clave">1M</span> de tokens', 0);
        e.tx("dato", "1.000.000", 16, 92, p(1, "millón"));
        e.tx("etiqueta", "tokens", 16, 120, p(1, "tokens"));
        const ocho = p(1, "ocho");
        // 8 tomos gruesos en dos pilas de 4 (uno por novela), con la cifra encima sobre fondo
        const lomos = ["#c0504a", "#4a6fb0", "#4a9a6a", "#c9a84a", "#8a5ab0", "#d07a3a", "#4a6fb0", "#c0504a"];
        for (let k = 0; k < 8; k++) if (t >= ocho + k * 0.06) {
          const x = 46 + (k % 2) * 16, y = MESA - 7 - Math.floor(k / 2) * 4;
          rect(e.frente, x, y, 14, 4, P3.contorno); rect(e.frente, x + 1, y + 1, 12, 2, lomos[k]); rect(e.frente, x + 1, y + 1, 12, 1, "#ffffff55");
        }
        e.tx("etiqueta", '≈ <span class="cifra">8</span> novelas', 130, 176, ocho + 0.42, "background:#171e2a;padding:2px 3px"); // cuando ya están los 8 tomos
        e.fuente("Fuentes: webs oficiales", 16, 136, p(1, "millón"));
        e.tx("insignia", "Cabe ≠ lo lee", 16, 160, ini(2), "background:var(--rojo);color:#f5f7fb");
      },
      gato: (t) => GATO(t >= ini(2) ? "pensar" : "senalar"),
    },
    { // B2 · dos pruebas
      pintar(t) {
        escenario3("laboratorio", e.capas, t, { suelo: SUELO, mesa: MESA });
        e.rot('Dos <span class="clave">pruebas</span>', LLEGA(1));
        if (t < ini(4)) {
          barrasPrueba3(e, t, 8, 52, 26, Array.from({ length: 18 }, (_, k) => 0.95 - k * 0.04), { desde: p(3, "18"), cada: 0.05, ancho: 3 });
          e.tx("etiqueta", "Chroma · 18 modelos · texto →", 16, 162, p(3, "18"));
          e.tx("etiqueta", "Más texto → peor", 16, 176, p(3, "peor"), "color:var(--naranja)");
          e.fuente("Fuente: Chroma (2025)", 16, 190, p(3, "18"));
        } else {
          barrasPrueba3(e, t, 14, 52, 26, [0.9, 0.45, 0.4, 0.35, 0.3, 0.42, 0.25, 0.38, 0.2, 0.3, 0.33, 0.6, 0.15], { desde: p(4, "13"), cada: 0.06, umbral: 0.5, ancho: 4, color: P3.verde });
          e.tx("etiqueta", "13 modelos de 128.000+", 16, 162, p(4, "13"));
          e.tx("insignia", "A 32.000: 11 bajo la mitad", 16, 176, p(4, "32.000"));
          e.fuente("Fuente: NoLiMa (2025)", 16, 190, p(4, "13"));
        }
      },
      gato: (t) => GATO(t >= p(4, "mitad") ? "sorpresa" : "senalar"),
    },
    { // B3 · Gemini cae (detalle) y Opus mejora
      pintar(t) {
        escenario3("laboratorio", e.capas, t, { suelo: SUELO, mesa: MESA });
        e.rot(t >= ini(6) ? 'Y <span class="clave">Anthropic</span>' : 'Lo dice <span class="clave">Google</span>', t >= ini(6) ? ini(6) : LLEGA(2));
        // cae a escalones mientras la voz dice «a un millón, un 26,3 %»
        const a = p(5, "millón"), cae = p(5, "26,3"), v = 0.849 - e.paso(e.prog(t, a, cae + 0.3), 0.125) * (0.849 - 0.263);
        // Barras de 10 a 66 unidades: en el detalle (×1,25, centro x = 116) caben enteras con «100 %» y margen
        e.tx("etiqueta", t >= ini(6) ? "Gemini 3.1 Pro" : "Gemini 3.1 Pro", 30, 84, ini(5), t >= ini(6) ? "color:var(--texto-suave)" : "");
        barra3(e.frente, 10, 33, 56, 6, v, v < 0.5 ? P3.rojo : P3.verde);
        e.tx("etiqueta", '<span class="cifra">100</span> %', 162, 84, ini(5), "background:#171e2a;padding:1px 2px");
        e.tx(t >= cae ? "insignia" : "etiqueta", t >= a ? (t >= cae ? 'A 1M: <span class="cifra">26,3</span> %' : "A 1M…") : 'A <span class="cifra">128K</span>: <span class="cifra">84,9</span> %', 30, 124, p(5, "84,9"), t >= cae ? "background:var(--rojo);color:#f5f7fb" : "");
        e.fuente("Fuente: Google DeepMind", 30, 140, p(5, "84,9"));
        if (t >= ini(6)) {
          e.tx("etiqueta", 'Claude Opus <span class="cifra">4.6</span> · <span class="cifra">1M</span>', 30, 166, p(6, "Opus"));
          barra3(e.frente, 10, 60, 56, 6, t >= p(6, "76") ? 0.76 : 0.185, P3.verde);
          e.tx("etiqueta", t >= p(6, "76") ? '<span class="cifra">76</span> %' : "", 162, 166, p(6, "76"), "background:#171e2a;padding:1px 2px");
          e.fuente("Fuente: Anthropic", 30, 196, p(6, "76"));
          e.tx("insignia", "Cifras de<br>las empresas", 130, 222, p(6, "76"), "background:var(--dorado)");
        }
      },
      gato: (t) => GATO(t >= p(5, "26,3") && t < fin(5) ? "sorpresa" : "senalar"),
    },
    { // B4 · la etiqueta es la mesa; consejo y cierre
      pintar(t) {
        escenario3("despacho", e.capas, t, { suelo: SUELO, mesa: MESA }); tableroCorto(e);
        e.rot('La <span class="clave">etiqueta</span>', LLEGA(3));
        if (t < p(9, "largo")) {
          pila3(e.frente, 44, MESA - 3, t >= ini(8) ? ["tu", "tu"] : ["tu", "respuesta", "oculto", "tu", "archivo", "respuesta", "tu", "tu"], 18, 5);
          if (t >= ini(8)) e.marcar(43, MESA - 8, 20, 6);
          e.tx("etiqueta", "1M = tamaño de la mesa", 16, 96, p(7, "tamaño"));
          e.tx("etiqueta", "≠ lo que lee bien", 16, 112, p(7, "bien"), "color:var(--naranja)");
          e.tx("insignia", "Menos papeles, los buenos", 16, 148, ini(8));
          e.fuente("Fuente: Anthropic", 16, 166, p(8, "importa"));
        } else carteLargo(e, t, p(9, "largo"));
      },
      gato: (t) => GATO(t >= ini(8) && t < ini(9) ? "tocar" : "senalar"),
    },
  ];

  const planos = [[0, "corte", 1], [ini(5), "zoom", 1.25, 116, 130], [ini(6) - 0.05, "corte", 1]];
  const CLAVES = { fr01: "millón", fr02: "lea", fr03: "peor", fr04: "mitad", fr05: "26,3", fr06: "76", fr07: "mesa", fr08: "buenos", fr09: "largo" };
  e = escenaShort(bloques, CORTES, planos, CLAVES);
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(1, "ocho") + 0.42, "tick"], [p(2, "lea"), "error"], [p(3, "18") + 0.85, "tick"], [p(4, "32.000"), "error"], [p(5, "26,3") + 0.5, "error"],
    [p(6, "76"), "acierto"], [p(8, "buenos"), "acierto"], [p(9, "largo"), "aparicion"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
