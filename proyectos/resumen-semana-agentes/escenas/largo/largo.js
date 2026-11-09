// resumen-semana-agentes · largo (16:9). Estilo v3 a 12 px (lienzo de 160×90 unidades) con las desviaciones de
// style_guide.md: agentes = robots pixel, skills = cartuchos, sello «MATIZ» cuando MISTA corrige una exageración, y plano de
// detalle solo en el bucle del harness, las barras del Super-agent, la cronología de Binance y Stack Overflow (Mario, 2026-11-06).
// Guion: PUERTA 1 (reviews/puerta-1.md). Arte en unidades (1 = 3 px CSS); textos en px CSS. MISTA a la izquierda, la idea a la derecha.
(() => {
  const W = 480, H = 270, SUELO = 64, MESA = 52, GX = 6, GY = SUELO - 32;
  const { P, PF, INI, FIN, medio } = tiemposDe(window.TIMING);
  const fr = (n) => `fr${String(n).padStart(2, "0")}`;
  const p = (n, w, k) => P(fr(n), w, k), ini = (n) => INI(fr(n)), fin = (n) => FIN(fr(n));
  // Bloques: primera frase de cada uno (el último acaba en fr90)
  const PRIMERA = [1, 9, 20, 29, 37, 49, 54, 59, 70, 80, 88];
  const CORTES = PRIMERA.slice(1).map((n) => medio(fr(n - 1), fr(n)));
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const ev = [];
  const son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  let e;
  const de = (t, a, b) => t >= a && (b === undefined || t < b);
  const GATO = (pose, extra = {}) => ({ x: GX, y: GY, pose, espejo: false, ...extra });
  const salta = (t, a) => e.s1(t, a); // null antes de a; -1 el primer escalón; 0 después
  const ROJO = "background:var(--rojo);color:#f5f7fb";
  const VERDE = "background:var(--verde)";
  const PLACA = "background:#171e2a;padding:1px 2px";

  // ---------- 1 · Gancho: cinco noticias en el corcho ----------
  const NOTICIAS = [
    ["Binance", (s, x, y) => { moneda3(s, x + 4, y + 2); moneda3(s, x + 9, y + 5); }, 1],
    ["Meta", (s, x, y, t) => robot3(s, x + 5, y + 1, t, { color: "gris", cara: "dormido" }), 2],
    ["Linux", (s, x, y, t) => terminal3(s, x + 3, y + 2, t, { color: P3.rojo, semilla: 2 }), 3],
    ["Extensión", (s, x, y, t) => extension3(s, x + 2, y + 2, t, { puerta: 2 }), 4],
    ["Gafas", (s, x, y, t) => { gafas3(s, x + 1, y + 4, t); auricular3(s, x + 8, y + 8, t); }, 5],
  ];
  const b1 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const partes = t >= ini(8);
      e.rot(partes ? 'Vamos por <span class="clave">partes</span>' : t >= p(6, "agentes") ? 'La semana de los <span class="clave">agentes</span>' : 'Esta <span class="clave">semana</span>', partes ? ini(8) : t >= p(6, "agentes") ? p(6, "agentes") : 0);
      if (!partes) {
        corcho3(e.capas.medio, 46, 14, 112, 36);
        NOTICIAS.forEach(([nombre, icono, n], k) => {
          const a = ini(n), s = salta(t, a);
          if (s === null) return;
          const x = 49 + k * 22, y = 18 + s;
          tarjeta3(e.frente, x, y, 19, 14);
          icono(e.frente, x, y, t);
          e.tx("etiqueta", nombre, x * 3 + 28 - nombre.length * 4, k % 2 ? 110 : 98, a);
        });
        if (t >= p(6, "agentes")) {
          for (let k = 0; k < 5; k++) rect(e.frente, 58 + k * 22, 33, 1, 4, P3.naranja);
          rect(e.frente, 58, 37, 89, 1, P3.naranja);
          robot3(e.frente, 98, 40, t, { color: "naranja", trabaja: true });
          e.tx("insignia", "Agentes", 330, 124, p(6, "agentes"));
        }
        e.fuente("Fuentes: The Block, SiliconANGLE,", 150, 168, ini(1)); e.fuente("Anthropic, Cursor, Tech Times", 150, 182, ini(1));
      } else {
        ["1 · Por dentro", "2 · Quién los manda", "3 · Qué saben hacer", "4 · Cómo se rompen", "5 · Qué cambian", "6 · Cómo les hablaremos"].forEach((s, k) => {
          const w = ["dentro", "manda", "saben", "rompen", "cambiando", "hablaremos"][k];
          e.tx("etiqueta", s, 200, 44 + k * 22, p(8, w), k === 3 ? "color:var(--naranja)" : "");
          if (t >= p(8, w)) robot3(e.frente, 57, 13 + k * 7 - 2, t, { color: ["azul", "dorado", "verde", "rojo", "gris", "naranja"][k], semilla: k });
        });
      }
    },
    gato: (t) => GATO(t >= ini(8) ? "senalar" : t >= ini(7) ? "celebrar" : t >= p(6, "agentes") ? "sorpresa" : t >= ini(1) ? "senalar" : "pie"),
  };

  // ---------- 2 · Por dentro: el harness (detalle: el bucle que se cambia) ----------
  const ICONOS_H = [["Herramientas", "herramientas", (s, x, y) => { rect(s, x, y + 2, 6, 2, P3.contorno); rect(s, x + 1, y + 2, 4, 1, P3.metalLuz); rect(s, x + 5, y, 2, 6, P3.contorno); }],
    ["Archivos", "archivos", (s, x, y, t) => papel3(s, x, y - 3, t)],
    ["Permisos", "permisos", (s, x, y) => candado3(s, x + 1, y - 1)],
    ["Memoria", "memoria", (s, x, y) => disquete3(s, x - 1, y - 3)]];
  const b2 = {
    pintar(t) {
      laboratorioH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const fase = t < ini(11) ? "cerebro" : t < ini(12) ? "rodea" : t < ini(13) ? "dos" : t < ini(14) ? "decide" : t < ini(15) ? "techo" : t < ini(16) ? "deepseek" : t < ini(19) ? "bucle" : "aviso";
      const titulos = { cerebro: ['Qué es un <span class="clave">harness</span>', LLEGA(1)], rodea: ['El <span class="clave">harness</span>', ini(11)], dos: ['Mismo cerebro, <span class="clave">otro agente</span>', ini(12)],
        decide: ['Lo que <span class="clave">decide</span>', ini(13)], techo: ['El <span class="clave">techo</span>', ini(14)], deepseek: ['El de <span class="clave">DeepSeek</span>', ini(15)],
        bucle: ['El <span class="clave">bucle</span>', ini(16)], aviso: ['Vista <span class="clave">previa</span>', ini(19)] };
      e.rot(...titulos[fase]);
      if (fase === "cerebro" || fase === "rodea") {
        const a = p(10, "cerebro");
        if (t >= a) { cerebro3(e.frente, 92, 26 + (salta(t, a) || 0), t, { brilla: true }); e.tx("etiqueta", "Modelo", 270, 112, a); }
        if (fase === "cerebro") {
          if (t >= p(10, "tocar")) { aspa3(e.frente, 104, 24, P3.rojo); e.tx("etiqueta", "Solo, no toca nada", 222, 128, p(10, "tocar")); }
          e.tx("titular", "Harness", 300, 50, p(9, "harness"));
        } else {
          rect(e.frente, 84, 20, 26, 1, P3.naranja); rect(e.frente, 84, 41, 26, 1, P3.naranja); rect(e.frente, 84, 20, 1, 22, P3.naranja); rect(e.frente, 109, 20, 1, 22, P3.naranja);
          ICONOS_H.forEach(([nombre, w, icono], k) => {
            const a = p(11, w); if (t < a) return;
            const x = [70, 113, 70, 113][k], y = [22, 22, 36, 36][k];
            icono(e.frente, x, y + (salta(t, a) || 0), t);
            e.tx("etiqueta", nombre, k % 2 ? 370 : 110, y * 3 + 4, a);
          });
          e.tx("insignia", "Claude Code · Codex", 270, 150, p(11, "Codex"));
          e.fuente("Fuente: Helmcode", 270, 170, ini(11));
        }
      }
      if (fase === "dos") {
        [[64, "azul", "feliz"], [112, "naranja", "error"]].forEach(([x, color, cara], k) => {
          const a = k ? p(12, "agente") : ini(12);
          if (t < a) return;
          cerebro3(e.frente, x, 18, t);
          robot3(e.frente, x, 30, t, { color, cara, trabaja: k === 0 });
          e.tx("etiqueta", k ? "Harness B" : "Harness A", x * 3 - 6, 140, a);
        });
        e.tx("insignia", "Mismo modelo", 186, 50, p(12, "mismo"));
        e.fuente("Fuente: Helmcode", 186, 160, ini(12));
      }
      if (fase === "decide") {
        [["¿Pregunta antes de borrar?", "borrar"], ["¿Qué olvida?", "olvida"], ["¿Repite o prueba otra vía?", "falla"]].forEach(([s, w], k) => {
          const a = p(13, w); if (t < a) return;
          e.tx("etiqueta", s, 186, 50 + k * 26, a);
          [() => candado3(e.frente, 52, 17 + k * 9), () => disquete3(e.frente, 50, 14 + k * 9), () => bucle3(e.frente, 50, 15 + k * 9, t, { roto: t < p(13, "otra") })][k]();
        });
        e.fuente("Fuente: Helmcode", 186, 132, ini(13));
      }
      if (fase === "techo") {
        rect(e.frente, 60, 16, 70, 1, P3.blanco); e.tx("etiqueta", "Techo del modelo", 186, 32, p(14, "techo"));
        const bueno = p(14, "buen"), malo = p(14, "malo");
        if (t >= bueno) { barra3(e.frente, 70, 20, 12, 30, 1, P3.verde); }
        if (t >= bueno) { rect(e.frente, 71, 21, 10, 3, "#141a26"); e.tx("etiqueta", "Buen harness", 176, 156, bueno); }
        if (t >= malo) { barra3(e.frente, 100, 34, 12, 16, 1, P3.rojo); e.tx("etiqueta", "Harness malo", 296, 156, malo, "color:var(--naranja)"); }
        e.fuente("Fuente: Helmcode", 330, 60, ini(14));
      }
      if (fase === "deepseek") {
        robot3(e.frente, 92, 28, t, { color: "azul", trabaja: true });
        e.tx("titular", "DeepSeek", 222, 56, ini(15)); e.tx("titular", "Harness", 222, 80, ini(15));
        e.tx("insignia", "Abierto · MIT", 222, 112, p(15, "MIT"));
        e.fuente("Fuente: repo de DeepSeek", 222, 130, ini(15));
      }
      if (fase === "bucle") {
        // Núcleo fijo en casi todos; en DeepSeek, el bucle sale y entra otro (detalle de cámara)
        const cambia = p(17, "pieza"), entra = p(18, "sustituir");
        ["MCP", "Skills", "Hooks", "Herram."].forEach((s, k) => { const x = [62, 110, 62, 110][k], y = [16, 16, 40, 40][k]; rect(e.frente, x, y, 22, 6, P3.contorno); rect(e.frente, x + 1, y + 1, 20, 4, P3.metal); e.tx("etiqueta", s, x * 3 + 2, y * 3 + 6, ini(16)); });
        const sale = t >= cambia ? Math.min(4, Math.floor((t - cambia) / 0.1)) * 3 : 0;
        if (t < entra) bucle3(e.frente, 92, 26 - sale, t, { color: t >= cambia ? P3.azul : P3.naranja });
        else bucle3(e.frente, 92, 26 + (salta(t, entra) || 0), t, { color: P3.verde });
        if (t < cambia) { candado3(e.frente, 103, 24); e.tx("etiqueta", "Núcleo fijo", 330, 92, p(16, "fijo")); }
        else e.tx("insignia", "Pieza cambiable", 330, 92, cambia);
        e.tx("etiqueta", "Lee · piensa · actúa", 222, 142, p(16, "lee"));
        e.fuente("Fuente: Helmcode", 222, 156, ini(17));
        if (t >= cambia) e.marcar(91, 25 - sale, 11, 11);
      }
      if (fase === "aviso") {
        robot3(e.frente, 92, 28, t, { color: "azul", cara: "pensar" });
        e.tx("insignia", "Vista previa", 222, 60, p(19, "previa"));
        e.tx("etiqueta", "Habrá cambios", 222, 84, p(19, "cambios"), ROJO + ";padding:2px 3px");
        e.tx("etiqueta", "que lo rompan", 222, 98, p(19, "cambios"), ROJO + ";padding:2px 3px");
        e.fuente("Fuente: repo de DeepSeek", 222, 118, p(19, "previa"));
      }
    },
    gato: (t) => GATO(t >= ini(19) ? "pensar" : t >= ini(16) ? "senalar" : t >= ini(14) ? "tocar" : t >= ini(12) ? "sorpresa" : "senalar"),
  };

  // ---------- 3 · El jefe que no trabaja (detalle: las barras del peor caso) ----------
  const b3 = {
    pintar(t) {
      servidoresH(e.capas, t, { suelo: SUELO });
      const fase = t < ini(21) ? "titulo" : t < ini(22) ? "vigilar" : t < ini(24) ? "jefe" : t < ini(25) ? "solo" : t < ini(27) ? "cifras" : t < ini(28) ? "permisos" : "github";
      const tit = { titulo: ["El <span class='clave'>Super-agent</span>", LLEGA(2)], vigilar: ["El <span class='clave'>problema</span>", ini(21)], jefe: ["Un <span class='clave'>jefe</span>", ini(22)],
        solo: ["¿Y sin jefe?", ini(24)], cifras: ["El <span class='clave'>peor caso</span> (p95)", ini(25)], permisos: ["Todos los <span class='clave'>permisos</span>", ini(27)], github: ["Cuentas <span class='clave'>suspendidas</span>", ini(28)] };
      e.rot(...tit[fase]);
      const obreros = (cara = "feliz", herr = false, trabaja = true) => ["azul", "verde", "dorado"].forEach((c, k) => robot3(e.frente, 72 + k * 22, 40, t, { color: c, cara, trabaja, semilla: k, herramienta: herr }));
      if (fase === "titulo") { robot3(e.frente, 96, 26, t, { color: "naranja", jefe: true }); e.tx("titular", "Super-agent", 222, 60, p(20, "Super")); e.fuente("Fuente: Helmcode", 222, 90, p(20, "Super")); }
      if (fase === "vigilar") {
        ["Test", "Código", "Error"].forEach((s, k) => { const a = p(21, ["test", "código", "error"][k]); if (t < a) return; terminal3(e.frente, 68 + k * 22, 22, t, { semilla: k }); robot3(e.frente, 70 + k * 22, 40, t, { color: ["azul", "verde", "dorado"][k], trabaja: true, semilla: k }); e.tx("etiqueta", s, (68 + k * 22) * 3 + 4, 100, a); });
        if (t >= p(21, "vigilándolos")) { reloj3(e.frente, 132, 8, t, { velocidad: 3 }); e.tx("etiqueta", "Vigilando...", 340, 30, p(21, "vigilándolos")); }
      }
      if (fase === "jefe") {
        robot3(e.frente, 96, 14, t, { color: "naranja", jefe: true });
        e.tx("insignia", "Jefe", 314, 44, ini(22));
        if (t >= p(22, "obreros")) {
          obreros("feliz", t >= ini(23), true);
          const f = Math.floor((t - p(22, "reparte")) / 0.15) % 6;
          if (t >= p(22, "reparte")) for (let k = 0; k < 3; k++) papel3(e.frente, 98 + (k - 1) * Math.min(f, 4) * 5, 28 + Math.min(f, 4), t);
          e.tx("etiqueta", "Obreros", 400, 150, p(22, "obreros"));
        }
        if (t >= ini(23)) { e.tx("etiqueta", "Sin herramientas", 330, 64, p(23, "herramientas"), "color:var(--naranja)"); e.tx("etiqueta", "Solo delega", 330, 78, p(23, "delegar")); }
        e.fuente("Fuente: Helmcode, DeepSeek", 186, 176, ini(22));
      }
      if (fase === "solo") {
        robot3(e.frente, 96, 34, t, { color: "naranja", cara: "pensar" });
        e.tx("etiqueta", "¿Delegar? Si quiere...", 222, 60, p(24, "delegar"));
        e.tx("dato", "0 / 5", 270, 78, p(24, "cinco"), "color:var(--rojo)");
        e.tx("etiqueta", "veces delegó", 270, 108, p(24, "cinco"));
        e.fuente("Fuente: Helmcode", 222, 126, p(24, "cinco"));
      }
      if (fase === "cifras") {
        const a = p(25, "treinta"), b = p(25, "dieciséis");
        barrasDato3(e.frente, 76, 56, 36, [1], t, a, { ancho: 14, colores: [P3.rojo], ultimo: P3.rojo });
        if (t >= b) barrasDato3(e.frente, 124, 56, 36, [15.7 / 29.5], t, b, { ancho: 14, colores: [P3.verde], ultimo: P3.verde });
        e.tx("etiqueta", "Sin jefe", 276, 70, a); e.tx("etiqueta", "29,5 min", 276, 84, a);
        e.tx("etiqueta", "Con jefe", 296, 112, b); e.tx("etiqueta", "15,7 min", 296, 126, b);
        if (t >= ini(26)) { e.tx("insignia", "Preliminar · DeepSeek", 276, 30, p(26, "preliminares")); e.tx("etiqueta", "Relee ×3,8", 276, 46, p(26, "relee"), "color:var(--naranja)"); }
        e.fuente("Fuente: DeepSeek vía Helmcode", 276, 100, a);
      }
      if (fase === "permisos") {
        obreros("feliz", true, true);
        candado3(e.frente, 100, 20, P3.rojo);
        e.tx("etiqueta", "Todos los permisos", 222, 50, p(27, "permisos"), ROJO + ";padding:2px 3px");
        e.tx("etiqueta", "de la cuenta", 222, 66, p(27, "cuenta"));
        e.fuente("Fuente: docs de DeepSeek", 222, 84, p(27, "permisos"));
      }
      if (fase === "github") {
        robot3(e.frente, 96, 34, t, { color: "gris", cara: t >= p(28, "suspendió") ? "error" : "feliz" });
        e.tx("insignia", "Cuenta suspendida", 222, 60, p(28, "suspendió"), ROJO);
        e.tx("etiqueta", "GitHub · prueba de Helmcode", 222, 80, p(28, "GitHub"));
        e.tx("etiqueta", "Tras su primer comentario", 222, 96, p(28, "primer"));
        e.fuente("Fuente: Helmcode", 222, 114, p(28, "suspendió"));
      }
    },
    gato: (t) => GATO(t >= p(28, "suspendió") ? "celebrar" : t >= ini(26) ? "pensar" : t >= ini(24) ? "sorpresa" : "senalar"),
  };

  // ---------- 4 · Los jefes de equipo: Herdr y Conductor ----------
  const b4 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const conductor = t >= ini(34), resumen = t >= ini(36);
      e.rot(resumen ? "Una llega, otra <span class='clave'>cierra</span>" : conductor ? "Meta compra <span class='clave'>Conductor</span>" : "Los <span class='clave'>jefes</span> de equipo", resumen ? ini(36) : conductor ? ini(34) : LLEGA(3));
      if (!conductor) {
        const app = p(30, "app"), cierra = p(31, "cierras");
        const abierta = t < cierra || t >= ini(32);
        monitor3(e.frente, 60, 10, 50, 30, { dibujo: abierta ? (s, x, y) => { for (let k = 0; k < 4; k++) if (t >= app + k * 0.15) terminal3(s, x + 2 + (k % 2) * 22, y + 2 + Math.floor(k / 2) * 12, t, { semilla: k, titulo: [P3.naranja, P3.azul, P3.verde, P3.dorado][k] }); } : null });
        if (t >= app) e.tx("insignia", "Herdr", 340, 40, app);
        if (t >= p(30, "abierta") && t < ini(32)) e.tx("etiqueta", "Abierta", 340, 58, p(30, "abierta"));
        if (de(t, cierra, ini(32))) {
          rect(e.frente, 70, 44, 30, 6, P3.contorno); rect(e.frente, 71, 45, 28, 4, P3.metal);
          for (let k = 0; k < 4; k++) rect(e.frente, 73 + k * 6, 46, 3, 2, Math.floor(t / 0.2 + k) % 2 ? P3.verde : "#0e5a40");
          e.tx("etiqueta", "Los agentes siguen", 300, 160, p(31, "siguen"), "color:var(--verde)");
        }
        if (t >= ini(32)) {
          robot3(e.frente, 112, 40, t, { color: "naranja", trabaja: true });
          e.tx("etiqueta", "Un agente maneja la app", 186, 160, p(32, "manejar"));
          ["Claude Code", "Codex", "Kimi"].forEach((s, k) => e.tx("etiqueta", s, 372, 64 + k * 14, p(33, ["Claude", "Codex", "Kimi"][k], k === 0 ? 2 : 1)));
          e.fuente("Fuente: demo de Fazt Code", 186, 176, ini(33));
        } else e.fuente("Fuente: herdr.dev, Heise", 186, 176, app);
      } else if (!resumen) {
        caja3(e.frente, 64, 20, t);
        e.tx("titular", "Conductor", 240, 50, p(34, "Conductor"));
        e.tx("etiqueta", "Meta · 4 de noviembre", 240, 76, p(34, "Meta"));
        e.tx("etiqueta", "+100.000 usuarios", 240, 92, p(34, "cien"));
        if (t >= ini(35)) {
          rect(e.frente, 62, 22, 16, 1, P3.rojo); rect(e.frente, 62, 27, 16, 1, P3.rojo);
          calendario3(e.frente, 66, 34); e.tx("etiqueta", "20", 204, 112, p(35, "20"), "color:#2b1a10");
          e.tx("insignia", "Cerrada", 240, 116, p(35, "Cerrarla"), ROJO);
          e.tx("etiqueta", "Sin altas · nube apagada", 240, 134, p(35, "altas"));
        }
        e.fuente("Fuente: SiliconANGLE", 240, 152, ini(34));
      } else {
        monitor3(e.frente, 56, 18, 24, 16, { dibujo: (s, x, y) => terminal3(s, x + 4, y + 3, t) });
        caja3(e.frente, 104, 24, t); rect(e.frente, 103, 27, 14, 1, P3.rojo);
        e.tx("insignia", "Llega · abierta", 150, 120, ini(36), VERDE);
        e.tx("insignia", "Comprada · cerrada", 300, 120, p(36, "comprada"), ROJO);
      }
    },
    gato: (t) => GATO(t >= ini(36) ? "pensar" : t >= p(35, "Cerrarla") ? "sorpresa" : t >= ini(31) ? "senalar" : "tocar"),
  };

  // ---------- 5 · Los oficios: skills como cartuchos ----------
  const motor3 = (s, x, y, t, abre) => { // máquina de ejemplo: bloque de motor con pistón que se separa al desmontar
    const C = P3.contorno, d = abre ? Math.min(3, Math.floor(abre / 0.12)) : 0, ph = Math.floor(t / 0.15) % 3;
    rect(s, x, y + 6, 16, 9, C); rect(s, x + 1, y + 7, 14, 7, P3.metal); rect(s, x + 1, y + 7, 14, 1, P3.metalLuz);
    rect(s, x + 3, y - d, 4, 7, C); rect(s, x + 4, y + 1 - d + ph, 2, 4, P3.metalLuz);
    rect(s, x + 9, y - d * 2, 4, 7, C); rect(s, x + 10, y + 1 - d * 2 + (2 - ph), 2, 4, P3.metalLuz);
    rect(s, x + 6, y + 15, 4, 2, C); disco(s, x + 8, y + 18, 2, P3.naranja);
  };
  const b5 = {
    pintar(t) {
      laboratorioH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const fase = t < ini(39) ? "cartucho" : t < ini(42) ? "teardown" : t < ini(46) ? "cloudflare" : "regla";
      e.rot(...({ cartucho: ["Las <span class='clave'>skills</span>", LLEGA(4)], teardown: ["<span class='clave'>teardown</span>", ini(39)], cloudflare: ["La skill de <span class='clave'>Cloudflare</span>", ini(42)], regla: ["La regla de <span class='clave'>oro</span>", ini(46)] })[fase]);
      if (fase === "cartucho") {
        robot3(e.frente, 96, 34, t, { color: "azul", cara: t >= p(38, "oficio") ? "feliz" : "pensar" });
        const a = p(38, "skills");
        if (t >= a) { const baja = Math.min(4, Math.floor((t - a) / 0.15)); if (baja < 4) cartucho3(e.frente, 96, 18 + baja * 2, P3.dorado); else rect(e.frente, 97, 34, 6, 1, P3.dorado); }
        e.tx("etiqueta", "Skill = oficio", 330, 110, p(38, "oficio"), "color:var(--naranja)");
      }
      if (fase === "teardown") {
        const a = ini(39);
        cartucho3(e.frente, 60, 28, P3.naranja); e.tx("etiqueta", "teardown", 166, 118, a);
        if (t >= p(39, "simulador")) motor3(e.frente, 80, 24, t, t >= p(39, "desmontar") ? t - p(39, "desmontar") : 0);
        e.tx("etiqueta", "Gira · desmonta", 230, 140, p(39, "desmontar"));
        e.fuente("Fuente: repo de teardown", 230, 156, a);
        if (t >= ini(40)) bocadilloPost(e, "Va a acabar con algunas carreras", 300, 30, ini(40), 160);
        if (t >= ini(41)) {
          selloMatiz(e, 330, 70, ini(41));
          e.tx("etiqueta", "Máquinas reales", 300, 104, p(41, "medidas"), "background:#171e2a;padding:2px 3px");
          e.tx("etiqueta", "Sin foto: genérico", 300, 120, p(41, "genéricos"), "background:#171e2a;padding:2px 3px");
          e.fuente("Fuente: Elvar (autor)", 300, 176, p(41, "medidas"));
        }
      }
      if (fase === "cloudflare") {
        cartucho3(e.frente, 60, 28, P3.verde); lupa3(e.frente, 80, 26);
        e.tx("etiqueta", "Auditor de seguridad", 166, 140, p(42, "auditor"));
        if (t >= ini(43)) bocadilloPost(e, "Encuentra todos los bugs", 300, 30, ini(43), 160);
        if (t >= ini(44)) {
          selloMatiz(e, 330, 70, ini(44));
          e.tx("etiqueta", "1 pasada: la mitad", 300, 104, p(44, "mitad"), "background:#171e2a;padding:2px 3px");
          barra3(e.frente, 100, 39, 50, 4, t >= p(44, "mitad") ? 0.5 : 0, P3.naranja);
          e.fuente("Fuente: repo de Cloudflare", 166, 156, p(44, "mitad"));
        }
        if (t >= ini(45)) e.tx("insignia", "Es de junio", 340, 140, p(45, "junio"));
      }
      if (fase === "regla") {
        robot3(e.frente, 70, 44, t, { color: "verde", trabaja: true }); lupa3(e.frente, 80, 40);
        robot3(e.frente, 110, 44, t, { color: "azul", semilla: 1 }); if (t >= p(46, "comprueba")) check3(e.frente, 113, 38, P3.verde);
        e.tx("etiqueta", "Encuentra", 196, 172, ini(46)); e.tx("etiqueta", "Comprueba", 316, 172, p(46, "comprueba"));
        e.tx("etiqueta", "Nunca el mismo", 240, 36, p(46, "nunca"), "color:var(--naranja)");
        if (t >= ini(47)) { e.tx("etiqueta", "Avisos falsos descartados", 240, 56, ini(47)); e.tx("dato", "40 % → 11 %", 240, 70, p(47, "once")); }
        if (t >= ini(48)) e.tx("etiqueta", "450 líneas → +100 repos", 240, 100, p(48, "450"));
        e.fuente("Fuente: Cloudflare", 240, 114, ini(46));
      }
    },
    gato: (t) => GATO(de(t, ini(40), ini(41)) || de(t, ini(43), ini(44)) ? "pensar" : t >= ini(41) && t < ini(42) || t >= ini(44) && t < ini(45) ? "senalar" : t >= ini(47) ? "celebrar" : "tocar"),
  };

  // ---------- 6 · El lado oscuro: la extensión con puerta trasera ----------
  const b6 = {
    pintar(t) {
      servidoresH(e.capas, t, { suelo: SUELO });
      rect(e.capas.brillo, 0, 0, 160, 64, "#3a0c14");
      const cadena = t >= ini(53);
      e.rot(cadena ? "Cadena de <span class='clave'>suministro</span>" : "El lado <span class='clave'>oscuro</span>", cadena ? ini(53) : LLEGA(5));
      if (!cadena) {
        const puerta = t >= p(52, "túnel") ? 2 : t >= ini(52) ? 1 : 0;
        if (t >= ini(50)) extension3(e.frente, 64, 24, t, { puerta });
        if (t >= ini(50)) { e.tx("etiqueta", "Tienda de Cursor · 29 oct", 240, 36, p(50, "Cursor")); e.tx("etiqueta", "ID oficial de Anthropic", 240, 50, p(50, "identificador"), "color:var(--naranja)"); }
        if (t >= ini(51)) { reloj3(e.frente, 64, 40, t, { velocidad: 4 }); e.tx("etiqueta", "Unas 11 h · hasta 5.000", 240, 120, p(51, "once")); }
        if (t >= ini(52)) {
          const f = Math.floor((t - ini(52)) / 0.15) % 6;
          if (t >= p(52, "datos")) papel3(e.frente, 80 + f * 4, 26 - f, t);
          if (t >= p(52, "clave")) llaveRoja3(e.frente, 112 - Math.min(f, 4) * 4, 32);
          if (t >= p(52, "túnel")) for (let k = 0; k < 10; k++) if ((k + Math.floor(t / 0.1)) % 3 !== 0) rect(e.frente, 80 + k * 4, 30, 2, 1, P3.rojo);
          e.tx("etiqueta", "Datos · clave SSH · túnel", 240, 136, p(52, "datos"));
        }
        e.fuente("Fuente: Cursor", 240, 152, ini(50));
      } else {
        [["Autor", 60], ["Tienda", 94], ["Tú", 128]].forEach(([s, x], k) => {
          const a = k === 2 ? p(53, "ti") : ini(53);
          if (t < a) return;
          if (k === 0) robot3(e.frente, x, 30, t, { color: "azul" }); else if (k === 1) extension3(e.frente, x - 3, 32, t, { puerta: 2 }); else ingeniero3(e.frente, x, 30, t, { portatil: false });
          e.tx("etiqueta", s, x * 3 + 4 - s.length * 2, 140, a);
          if (k < 2) rect(e.frente, x + 12, 37, 18, 1, k === 1 ? P3.rojo : P3.gris);
        });
        e.tx("etiqueta", "Atacan lo que instalas", 186, 50, p(53, "instalas"), "color:var(--naranja)");
      }
    },
    gato: (t) => GATO(t >= ini(53) ? "senalar" : t >= ini(52) ? "sorpresa" : "senalar"),
  };

  // ---------- 7 · El fallo de Linux ----------
  const b7 = {
    pintar(t) {
      servidoresH(e.capas, t, { suelo: SUELO });
      const matiz = t >= ini(57);
      e.rot(matiz ? "Los <span class='clave'>matices</span>" : "Un fallo en <span class='clave'>Linux</span>", matiz ? ini(57) : LLEGA(6));
      monitor3(e.frente, 60, 14, 30, 22, { dibujo: (s, x, y) => terminal3(s, x + 7, y + 5, t, { color: t >= p(55, "control") ? P3.rojo : P3.verde }) });
      robot3(e.frente, 94, 26, t, { color: "gris", trabaja: !matiz });
      if (!matiz) {
        e.tx("etiqueta", "Modelo de Anthropic sin lanzar", 186, 130, p(54, "lanzar"));
        if (t >= ini(55)) { e.tx("dato", "48 min", 330, 40, p(55, "cuarenta")); e.tx("etiqueta", "+5: control total", 330, 70, p(55, "control"), "color:var(--naranja)"); }
        if (t >= ini(56)) ["Chrome", "Safari", "Android", "Windows"].forEach((s, k) => e.tx("etiqueta", s, 186 + k * 72, 148, p(56, s.toLowerCase())));
        e.fuente("Fuente: Anthropic", 186, 164, ini(54));
      } else {
        selloMatiz(e, 330, 36, ini(57));
        [["Necesita MPTCP activado", "función"], ["CloudLinux no lo reprodujo", "CloudLinux"], ["Sin ataques reales", "ataque", 2]].forEach(([s, w, n], k) =>
          e.tx("etiqueta", s, 186, 132 + k * 14, p(57, w, n), "background:#171e2a;padding:1px 3px"));
        if (t >= ini(58)) e.tx("insignia", "Toca actualizar", 330, 80, p(58, "actualizar"), VERDE);
        e.fuente("Fuente: Anthropic, CloudLinux, AWS", 186, 176, ini(57));
      }
    },
    gato: (t) => GATO(t >= ini(58) ? "senalar" : t >= ini(57) ? "pensar" : t >= p(55, "control") ? "sorpresa" : "senalar"),
  };

  // ---------- 8 · Binance (detalle: la cronología del robo) ----------
  const b8 = {
    pintar(t) {
      azoteaH(e.capas, t, { suelo: SUELO });
      const fase = t < ini(62) ? "cifra" : t < ini(65) ? "fases" : t < ini(68) ? "claves" : t < ini(69) ? "congela" : "puerta";
      e.rot(...({ cifra: ["El robo a <span class='clave'>Binance</span>", LLEGA(7)], fases: ["Una campaña de <span class='clave'>meses</span>", ini(62)], claves: ["No robaron las <span class='clave'>claves</span>", ini(65)],
        congela: ["Congelado y <span class='clave'>repuesto</span>", ini(68)], puerta: ["La <span class='clave'>puerta</span> y el puente", ini(69)] })[fase]);
      if (fase === "cifra") {
        cajaFuerte3(e.frente, 70, 36, t, { abierta: t >= ini(60), alarma: t >= ini(60) });
        if (t >= ini(60)) { e.tx("dato", "6.340 M$", 280, 40, p(60, "seis")); e.tx("etiqueta", "Bybit (2025): 1.460 M$", 280, 70, p(60, "récord"), "color:var(--texto-suave)"); e.tx("insignia", "×4 el récord", 280, 86, p(60, "récord")); }
        if (t >= ini(61)) e.tx("etiqueta", "FBI: Corea del Norte", 280, 106, p(61, "Corea"), "color:var(--naranja)");
        e.fuente("Fuente: The Block, Elliptic, FBI", 186, 176, ini(60));
      }
      if (fase === "fases") {
        const s1 = p(62, "septiembre"), s2 = ini(63), s3 = ini(64);
        rect(e.frente, 58, 50, 96, 1, P3.gris);
        if (t >= s1) { ingeniero3(e.frente, 60, 34, t, { pillado: t >= p(62, "trucada") }); papel3(e.frente, 72, 30, t, { activo: t < p(62, "trucada"), sello: P3.rojo }); e.tx("etiqueta", "Sept.", 180, 160, s1, PLACA); e.tx("etiqueta", "Oferta falsa", 160, 174, p(62, "reclutador"), PLACA); }
        if (t >= s2) { robot3(e.frente, 96, 32, t, { color: "rojo", cara: "error", trabaja: true }); ingeniero3(e.frente, 108, 34, t, { camiseta: P3.verde, portatil: false }); ingeniero3(e.frente, 114, 34, t, { camiseta: P3.naranja, portatil: false }); e.tx("etiqueta", "20 oct", 290, 160, s2, PLACA); e.tx("etiqueta", "IA interna", 284, 174, p(63, "herramienta"), PLACA); flecha3(e.frente, 76, 46, 94, P3.rojo, (t - s2) / 0.4); }
        if (t >= s3) { cajaFuerte3(e.frente, 134, 34, t, { abierta: true, alarma: true }); e.tx("etiqueta", "29 oct", 404, 160, s3, PLACA); e.tx("etiqueta", "Retiradas", 398, 174, p(64, "retiradas"), PLACA); flecha3(e.frente, 120, 46, 133, P3.rojo, (t - s3) / 0.4); }
        e.fuente("Fuente: informe de Binance (The Block)", 168, 186, s1);
      }
      if (fase === "claves") {
        if (t < ini(66)) { e.tx("dato", "BTC −4 %", 222, 50, p(65, "bitcoin")); barrasDato3(e.frente, 90, 50, 20, [1, 0.96, 0.9], t, ini(65), { ancho: 5, colores: [P3.gris], ultimo: P3.rojo }); e.fuente("Fuente: CNBC", 222, 80, ini(65)); }
        else {
          llaveRoja3(e.frente, 84, 30); if (t >= p(66, "claves")) aspa3(e.frente, 86, 26, P3.rojo);
          if (t >= p(66, "firma")) { papel3(e.frente, 110, 26, t, { sello: P3.dorado }); e.tx("etiqueta", "Sistema que firma", 300, 126, p(66, "firma"), "color:var(--naranja)"); }
          e.tx("etiqueta", "Claves: a salvo", 240, 50, p(66, "claves"));
          if (t >= ini(67)) e.tx("etiqueta", "«No fue un error, fue una campaña de meses»", 150, 150, ini(67), "white-space:normal;width:300px;line-height:12px;color:var(--dorado)");
          e.fuente("Fuente: Elliptic, CNBC, The Block", 186, 176, ini(66));
        }
      }
      if (fase === "congela") {
        cajaFuerte3(e.frente, 70, 36, t);
        for (let k = 0; k < 6; k++) { rect(e.frente, 92 + k * 6, 40, 5, 5, P3.contorno); rect(e.frente, 93 + k * 6, 41, 3, 3, "#9fd8e0"); rect(e.frente, 93 + k * 6, 41, 3, 1, "#e4f7f9"); }
        e.tx("dato", "≈ 3.000 M$", 280, 40, p(68, "tres"), "color:#9fd8e0"); e.tx("etiqueta", "congelados", 280, 70, p(68, "congelado"));
        e.tx("insignia", "98 % repuesto", 280, 92, p(68, "noventa"), VERDE);
        e.fuente("Fuente: Elliptic, CNBC", 280, 110, ini(68));
      }
      if (fase === "puerta") {
        ingeniero3(e.frente, 76, 34, t, { portatil: false }); robot3(e.frente, 108, 34, t, { color: "rojo", cara: "error" });
        e.tx("insignia", "Puerta: una persona", 140, 150, p(69, "persona"));
        e.tx("insignia", "Puente: una IA", 320, 150, p(69, "puente"), ROJO);
      }
    },
    gato: (t) => GATO(t >= ini(69) ? "pensar" : t >= ini(68) ? "celebrar" : t >= ini(66) ? "senalar" : t >= ini(60) && t < ini(62) ? "sorpresa" : "senalar"),
  };

  // ---------- 9 · El impacto (detalle: Stack Overflow) ----------
  const b9 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const fase = t < ini(75) ? "reddit" : t < ini(78) ? "so" : "msft";
      e.rot(...({ reddit: ["Internet sin <span class='clave'>visitas</span>", LLEGA(8)], so: ["Stack Overflow se <span class='clave'>vacía</span>", ini(75)], msft: ["Microsoft y los <span class='clave'>60.000</span>", ini(78)] })[fase]);
      if (fase === "reddit") {
        monitor3(e.frente, 60, 12, 40, 26, { dibujo: (s, x, y) => { for (let k = 0; k < 5; k++) rect(s, x + 3 + k * 7, y + 4 + k * 3, 6, 1, t >= ini(71) ? P3.rojo : P3.naranja); } });
        if (t >= ini(71)) e.tx("etiqueta", "Reddit: -1 M visitas/semana", 186, 156, p(71, "millón"));
        e.tx("etiqueta", "desde buscadores", 186, 168, p(71, "buscadores"), "color:var(--texto-suave)");
        if (t >= ini(72)) bocadilloPost(e, "El modo IA no manda visitas. Ni a nadie", 310, 24, ini(72), 150);
        if (t >= ini(73)) { e.tx("etiqueta", "EE. UU. -2 %", 310, 84, p(73, "dos")); e.tx("etiqueta", "Mundo +12 %", 310, 98, p(73, "mundo")); }
        if (t >= ini(74)) { e.tx("dato", "−29 %", 310, 112, p(74, "29"), "color:var(--rojo);background:#171e2a;padding:0 3px"); e.tx("etiqueta", "Ingresos +53 %", 310, 140, p(74, "53")); }
        e.fuente(t >= ini(74) ? "Fuente: Reddit, CNBC" : "Fuente: carta de Reddit", 186, 182, ini(71));
      }
      if (fase === "so") {
        const a = p(75, "969"), b = p(75, "207.000");
        if (t >= b) barrasDato3(e.frente, 76, 56, 36, [1], t, b, { ancho: 14, colores: [P3.naranja], ultimo: P3.naranja });
        if (t >= a) barrasDato3(e.frente, 116, 56, 36, [0.005], t, a, { ancho: 14, colores: [P3.rojo], ultimo: P3.rojo });
        e.tx("etiqueta", "Preguntas al mes", 276, 58, ini(75), "background:#171e2a;padding:1px 3px");
        if (t >= b) { e.tx("etiqueta", "Mar 2014", 276, 74, b); e.tx("etiqueta", "207.000", 276, 88, b); }
        if (t >= a) { e.tx("dato", "969", 396, 118, a, "color:var(--rojo);background:#171e2a;padding:0 3px"); e.tx("etiqueta", "Sep 2026", 396, 148, a); }
        if (t >= ini(76)) e.tx("etiqueta", "+ moderación estricta", 276, 102, p(76, "moderación"));
        if (t >= ini(77)) { e.tx("etiqueta", "Aprendió de ellos.", 276, 28, p(77, "aprendió"), "color:var(--naranja)"); e.tx("etiqueta", "¿Y la siguiente?", 276, 42, p(77, "siguiente"), "color:var(--naranja)"); }
        e.fuente("Fuente: API de Stack Exchange, Heise", 186, 164, b);
      }
      if (fase === "msft") {
        for (let k = 0; k < 10; k++) ingeniero3(e.frente, 58 + k * 9, 40, t, { portatil: false, camiseta: k < 3 && t >= p(78, "pedirla") ? P3.naranja : P3.gris });
        e.tx("dato", "60.000", 240, 40, p(78, "sesenta"));
        if (t >= p(78, "pedirla")) { selloMatiz(e, 360, 30, p(78, "Ojo")); e.tx("etiqueta", "Pueden pedirla: 27 %", 240, 70, p(78, "pedirla"), "color:var(--naranja);background:#171e2a;padding:1px 3px"); }
        if (t >= ini(79)) e.tx("etiqueta", "Motivo: infraestructura de IA", 186, 86, p(79, "infraestructura"));
        e.fuente("Fuente: CNBC", 240, 100, ini(78));
      }
    },
    gato: (t) => GATO(t >= p(78, "Ojo") ? "senalar" : t >= ini(77) ? "pensar" : t >= p(75, "969") ? "sorpresa" : "senalar"),
  };

  // ---------- 10 · Lo siguiente: hablarles sin voz ----------
  const b10 = {
    pintar(t) {
      laboratorioH(e.capas, t, { suelo: SUELO, mesa: MESA });
      const fase = t < ini(83) ? "gafas" : t < ini(85) ? "airpods" : "neuralink";
      e.rot(...({ gafas: ["Hablar <span class='clave'>sin voz</span>", LLEGA(9)], airpods: ["La copia en <span class='clave'>9 minutos</span>", ini(83)], neuralink: ["Con el <span class='clave'>pensamiento</span>", ini(85)] })[fase]);
      if (fase === "gafas") {
        if (t >= ini(81)) { gafas3(e.frente, 84, 30, t, { emite: t >= p(81, "radar") }); e.tx("etiqueta", "Subvocal · Y Combinator", 222, 40, p(81, "Subvocal")); }
        if (t >= p(81, "radar")) e.tx("etiqueta", "Radar, sin cámara", 222, 56, p(81, "radar"), "color:var(--verde)");
        if (t >= ini(82)) e.tx("dato", "1,3 M$", 222, 74, p(82, "millón"));
        e.fuente("Fuente: Tech Times", 222, 124, ini(81));
      }
      if (fase === "airpods") {
        gafas3(e.frente, 64, 30, t);
        auricular3(e.frente, 96, 28, t, { mueve: true }); auricular3(e.frente, 104, 28, t + 0.1, { mueve: true });
        e.tx("dato", "9 min", 310, 40, p(83, "nueve")); e.tx("etiqueta", "1 prompt · AirPods", 310, 70, p(83, "prompt"));
        if (t >= ini(84)) { selloMatiz(e, 330, 90, ini(84)); e.tx("etiqueta", "Solo palabras enseñadas", 186, 140, p(84, "palabras"), "background:#171e2a;padding:1px 3px"); }
        e.fuente("Fuente: repo de subvox, Tech Times", 186, 156, ini(83));
      }
      if (fase === "neuralink") {
        cerebro3(e.frente, 64, 40, t, { brilla: true }); chip3(e.frente, 66, 34, t);
        if (t >= p(85, "agente")) robot3(e.frente, 100, 42, t, { color: "dorado", trabaja: true });
        e.tx("etiqueta", "«Hey Neuralink»", 222, 40, p(85, "Hey"), "color:var(--dorado)");
        e.tx("etiqueta", "Agente con Grok", 222, 56, p(85, "Grok"));
        if (t >= ini(86)) e.tx("etiqueta", "Sin datos publicados", 222, 76, p(86, "datos"), ROJO + ";padding:1px 3px");
        if (t >= ini(87)) { e.tx("etiqueta", "Blindsight: «listo», dice Musk", 222, 96, p(87, "Blindsight")); e.tx("etiqueta", "Designación: no aprobación", 222, 110, p(87, "aprobación"), "color:var(--naranja)"); }
        e.fuente(t >= ini(87) ? "Fuente: Teslanorth, Drive Tesla" : "Fuente: Teslanorth", 186, 176, ini(85));
      }
    },
    gato: (t) => GATO(t >= ini(86) ? "pensar" : t >= ini(85) ? "sorpresa" : t >= ini(84) ? "senalar" : "tocar"),
  };

  // ---------- 11 · Cierre ----------
  const b11 = {
    pintar(t) {
      despachoH(e.capas, t, { suelo: SUELO, mesa: MESA });
      e.rot("La semana de los <span class='clave'>agentes</span>", LLEGA(10));
      const iconos = [["Voz", "Voz", (x) => { rect(e.frente, x, 24, 8, 5, P3.contorno); rect(e.frente, x + 1, 25, 6, 3, P3.blanco); rect(e.frente, x + 2, 29, 2, 2, P3.contorno); }],
        ["Susurro", "susurro", (x) => { rect(e.frente, x, 25, 6, 4, P3.contorno); rect(e.frente, x + 1, 26, 4, 2, P3.gris); }],
        ["Mandíbula", "mandíbula", (x) => auricular3(e.frente, x + 2, 23, t, { mueve: true })],
        ["Pensamiento", "pensamiento", (x) => chip3(e.frente, x + 1, 24, t)]];
      iconos.forEach(([s, w, dib], k) => { const a = p(88, w); if (t < a) return; const x = 46 + k * 28; dib(x); e.tx("etiqueta", s, x * 3 + 12 - s.length * 4, k % 2 ? 112 : 100, a); });
      if (t >= ini(89)) ["Quién lo construye", "Quién lo manda", "Qué sabe hacer", "Por dónde se rompe", "Cómo le hablamos"].forEach((s, k) => e.tx("etiqueta", s, 186, 128 + k * 12, p(89, ["construye", "manda", "sabe", "rompe", "hablamos"][k]), k === 4 ? "color:var(--naranja)" : ""));
      if (t >= ini(90)) robot3(e.frente, 150, 44, t, { color: "naranja", trabaja: true });
    },
    gato: (t) => GATO(t >= ini(90) ? "celebrar" : t >= ini(89) ? "pensar" : "senalar"),
  };

  const BLOQUES = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11];

  // ---------- cámara: acercamiento lento en el general; detalle solo en las 4 explicaciones core (Mario, 2026-11-06) ----------
  const ACERCA = (a, b) => [a, "mover", 25 / 24, 240, 110, b - a];
  const ALEJA = (b) => [b - 0.35, "mover", 1, 240, 110, 0.3];
  const planos = [[0, "corte", 1]];
  const conDetalle = [1, 2, 7, 8]; // harness, Super-agent, Binance, impacto
  CORTES.forEach((c, k) => { if (!conDetalle.includes(k)) planos.push(ACERCA(LLEGA(k) + 0.1, c - 0.45), ALEJA(c)); });
  planos.push(ACERCA(LLEGA(10) + 0.1, fin(90) - 0.5));
  planos.push([p(17, "pieza"), "zoom", 1.25, 290, 100], [ini(19), "corte", 1]);       // el bucle que se cambia
  planos.push([p(25, "treinta"), "zoom", 1.25, 300, 110], [ini(27), "corte", 1]);    // barras del peor caso
  planos.push([p(62, "septiembre"), "zoom", 1.25, 300, 130], [ini(65), "corte", 1]); // cronología de Binance
  planos.push([p(75, "207.000"), "zoom", 1.25, 290, 110], [ini(76), "corte", 1]);    // Stack Overflow
  planos.sort((a, b) => a[0] - b[0]);

  const CLAVES = { fr01: "Binance", fr02: "cerrarla", fr03: "Linux", fr04: "trasera", fr05: "AirPods", fr06: "agentes", fr07: "exageró", fr08: "partes",
    fr09: "harness", fr10: "cerebro", fr11: "rodea", fr12: "agente", fr13: "borrar", fr14: "techo", fr15: "MIT", fr16: "fijo", fr17: "cambiar", fr18: "sustituir",
    fr19: "previa", fr20: "Super-agent", fr21: "vigilándolos", fr22: "jefe", fr23: "delegar", fr24: "cinco", fr25: "dieciséis", fr26: "preliminares", fr27: "permisos",
    fr28: "suspendió", fr29: "fuera", fr30: "Herdr", fr31: "siguen", fr32: "manejar", fr33: "terminal", fr34: "Conductor", fr35: "Cerrarla", fr36: "compran",
    fr37: "saben", fr38: "skills", fr39: "teardown", fr40: "carreras", fr41: "genéricos", fr42: "Cloudflare", fr43: "todos", fr44: "mitad", fr45: "junio",
    fr46: "nunca", fr47: "once", fr48: "450", fr49: "puerta", fr50: "identificador", fr51: "cinco", fr52: "túnel", fr53: "instalas", fr54: "Linux",
    fr55: "control", fr56: "Windows", fr57: "matices", fr58: "actualizar", fr59: "Binance", fr60: "récord", fr61: "Corea", fr62: "reclutador", fr63: "herramienta",
    fr64: "retiradas", fr65: "bitcoin", fr66: "firma", fr67: "meses", fr68: "repuesto", fr69: "puente", fr70: "cambiando", fr71: "buscadores", fr72: "visitas",
    fr73: "dos", fr74: "29 %", fr75: "969", fr76: "moderación", fr77: "paradoja", fr78: "pedirla", fr79: "infraestructura", fr80: "hablar", fr81: "radar",
    fr82: "trescientos", fr83: "nueve", fr84: "enseñas", fr85: "pensamiento", fr86: "datos", fr87: "aprobación", fr88: "pensamiento", fr89: "hablamos", fr90: "todo" };

  e = escenaV3({ W, H, bloques: BLOQUES, cortes: CORTES, planos, SX: 240, SY: 110, lineaCaja: 200, claves: CLAVES, linea: 56 });

  // ---------- sonido (efectos a -24 dB): solo cuando algo aparece, se completa o cambia de plano ----------
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[ini(1), "aparicion"], [ini(2), "aparicion"], [ini(3), "aparicion"], [ini(4), "aparicion"], [ini(5), "aparicion"], [p(6, "agentes"), "seleccion"],
    [p(10, "cerebro"), "aparicion"], [p(10, "tocar"), "error"], [p(12, "agente"), "aparicion"], [p(14, "malo"), "error"], [p(17, "pieza"), "seleccion"], [p(18, "sustituir"), "acierto"],
    [p(19, "cambios"), "error"], [p(22, "reparte"), "aparicion"], [p(24, "cinco"), "error"], [p(25, "dieciséis") + 0.4, "acierto"], [p(28, "suspendió"), "error"],
    [p(30, "app"), "aparicion"], [p(31, "siguen"), "acierto"], [p(35, "Cerrarla"), "error"], [p(38, "skills") + 0.6, "acierto"], [p(39, "desmontar"), "aparicion"],
    [ini(41), "seleccion"], [ini(44), "seleccion"], [p(47, "once"), "acierto"], [ini(50), "aparicion"], [p(52, "túnel"), "error"], [p(55, "control"), "error"],
    [ini(57), "seleccion"], [p(60, "seis"), "error"], [p(62, "septiembre"), "aparicion"], [ini(63), "aparicion"], [ini(64), "error"], [p(68, "noventa"), "acierto"],
    [p(74, "29"), "error"], [p(75, "969") + 0.3, "error"], [p(78, "Ojo"), "seleccion"], [p(81, "radar"), "aparicion"], [p(83, "nueve"), "tick"], [ini(84), "seleccion"],
    [p(85, "agente"), "aparicion"], [ini(90), "acierto"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
