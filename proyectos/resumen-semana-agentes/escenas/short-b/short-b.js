// resumen-semana-agentes · short B «La extensión oficial, con puerta trasera». Estilo v3; plano de detalle solo en la extensión
// con su identificador legítimo (Mario, 2026-11-06). Guion propio, no recortado del largo. Fuente del dato bajo el rótulo.
(() => {
  const { SUELO, GX, GY } = CORTO;
  const { P, INI, medio } = tiemposDe(window.TIMING);
  const fr = (n) => `fr${String(n).padStart(2, "0")}`;
  const p = (n, w, k) => P(fr(n), w, k), ini = (n) => INI(fr(n));
  const CORTES = [medio("fr02", "fr03"), medio("fr04", "fr05"), medio("fr07", "fr08")];
  const LLEGA = (k) => (k > 0 ? CORTES[k - 1] + 0.2 : 0);
  const GATO = (pose) => ({ x: GX, y: GY, pose, espejo: false });
  const ev = [], son = (t, tipo) => ev.push({ t: Math.round(t * 1000) / 1000, tipo });
  let e;
  const oscuro = (e) => rect(e.capas.brillo, 0, 0, 90, 97, "#3a0c14");

  const bloques = [
    { // B1 · oficial… con puerta trasera
      pintar(t) {
        escenario3("servidores", e.capas, t, { suelo: SUELO }); oscuro(e);
        e.rot('La extensión <span class="clave">oficial</span>', 0);
        extension3(e.frente, 58, 36, t, { puerta: t >= p(1, "trasera") ? 2 : 0 });
        e.tx("etiqueta", "Nombre: correcto", 16, 104, p(1, "nombre"));
        e.tx("etiqueta", "Editor: correcto", 16, 118, p(1, "editor"));
        e.tx("etiqueta", "+ puerta trasera", 16, 136, p(1, "trasera"), "color:var(--naranja)");
        if (t >= ini(2)) { e.tx("etiqueta", "Tienda de Cursor", 16, 158, p(2, "Cursor")); e.tx("etiqueta", "29 de octubre", 16, 172, p(2, "29")); }
        e.fuente("Fuente: Cursor", 16, 82, 0);
      },
      gato: (t) => GATO(t >= p(1, "trasera") ? "sorpresa" : "senalar"),
    },
    { // B2 · el identificador legítimo (detalle)
      pintar(t) {
        escenario3("servidores", e.capas, t, { suelo: SUELO }); oscuro(e);
        e.rot('No era una <span class="clave">imitación</span>', LLEGA(1));
        extension3(e.frente, 56, 32, t, { puerta: 2 });
        e.tx("etiqueta", "Versión manipulada", 28, 128, p(3, "manipulada"));
        e.tx("etiqueta", "ID legítimo:", 28, 142, p(3, "identificador"));
        e.tx("etiqueta", "anthropic.claude-code", 28, 156, p(3, "identificador"), "color:var(--naranja)");
        if (t >= ini(4)) { e.tx("etiqueta", "Unas 11 horas", 28, 176, p(4, "11")); e.tx("etiqueta", "Hasta 5.000 personas", 28, 190, p(4, "5.000")); }
        e.fuente(t >= ini(4) ? "Fuente: Cursor, Help Net" : "Fuente: Cursor", 16, 82, p(3, "manipulada"));
      },
      gato: (t) => GATO("senalar"),
    },
    { // B3 · qué hacía y qué comprobar
      pintar(t) {
        escenario3("servidores", e.capas, t, { suelo: SUELO }); oscuro(e);
        const busca = t >= ini(7);
        e.rot(busca ? 'Qué <span class="clave">comprobar</span>' : 'Qué <span class="clave">hacía</span>', busca ? ini(7) : LLEGA(2));
        extension3(e.frente, 58, 36, t, { puerta: 2 });
        if (!busca) {
          const f = Math.floor((t - ini(5)) / 0.15) % 6;
          if (t >= p(5, "datos")) { papel3(e.frente, 72 + f * 2, 40 - f, t); e.tx("etiqueta", "Datos de tu equipo", 16, 128, p(5, "datos")); }
          if (t >= p(5, "clave")) { llaveRoja3(e.frente, 82 - Math.min(f, 4) * 3, 50); e.tx("etiqueta", "Clave del atacante", 16, 142, p(5, "clave")); }
          if (t >= p(5, "túnel")) { for (let k = 0; k < 7; k++) if ((k + Math.floor(t / 0.1)) % 3 !== 0) rect(e.frente, 72 + k * 2, 45, 1, 1, P3.rojo); e.tx("etiqueta", "Túnel por SSH", 16, 156, p(5, "túnel")); }
          if (t >= ini(6)) { e.tx("etiqueta", "Sin admin: túnel KO", 16, 176, p(6, "túnel")); e.tx("etiqueta", "Clave y datos: sí", 16, 190, p(6, "clave"), "color:var(--naranja)"); }
          e.fuente("Fuente: Cursor, Phorion", 16, 82, ini(5));
        } else {
          e.tx("titular", "Busca", 16, 120, p(7, "mira")); e.tx("titular", "la clave", 16, 144, p(7, "mira"));
          e.tx("insignia", "svc-telemetry", 16, 176, p(7, "svc"));
          e.fuente("Fuente: Cursor, Phorion", 16, 82, ini(7));
        }
      },
      gato: (t) => GATO(t >= ini(7) ? "senalar" : t >= p(5, "túnel") ? "sorpresa" : "pensar"),
    },
    { // B4 · la cadena de suministro; cierre al largo
      pintar(t) {
        escenario3("servidores", e.capas, t, { suelo: SUELO }); oscuro(e);
        e.rot('Cadena de <span class="clave">suministro</span>', LLEGA(3));
        if (t < p(9, "largo")) {
          robot3(e.frente, 44, 30, t, { color: "azul" }); extension3(e.frente, 57, 32, t, { puerta: 2 }); if (t >= p(8, "ti")) ingeniero3(e.frente, 76, 30, t, { portatil: false });
          rect(e.frente, 52, 37, 5, 1, P3.gris); rect(e.frente, 71, 37, 5, 1, P3.rojo);
          e.tx("etiqueta", "Autor", 120, 136, ini(8)); e.tx("etiqueta", "Tienda", 168, 136, ini(8)); e.tx("etiqueta", "Tú", 228, 136, p(8, "ti"));
          e.tx("etiqueta", "Atacan lo que", 28, 168, p(8, "instalas"), "color:var(--naranja)"); e.tx("etiqueta", "instalas", 28, 180, p(8, "instalas"), "color:var(--naranja)");
        } else carteLargo(e, t, p(9, "largo"));
      },
      gato: (t) => GATO(t >= ini(9) ? "senalar" : "pensar"),
    },
  ];

  const planos = [[0, "corte", 1], [p(3, "manipulada"), "zoom", 1.25, 120, 130], [ini(5) - 0.4, "corte", 1]];
  const CLAVES = { fr01: "trasera", fr02: "Cursor", fr03: "identificador", fr04: "5.000", fr05: "túnel", fr06: "administrador", fr07: "svc-telemetry",
    fr08: "instalas", fr09: "largo" };
  e = escenaShort(bloques, CORTES, planos, CLAVES);
  CORTES.forEach((c) => son(c - 0.2, "destello"));
  [[p(1, "trasera"), "error"], [p(3, "manipulada"), "seleccion"], [p(5, "datos"), "aparicion"], [p(5, "túnel"), "error"], [p(7, "svc"), "seleccion"],
    [p(8, "instalas"), "aparicion"], [p(9, "largo"), "aparicion"]].forEach(([t, tipo]) => son(t, tipo));
  window.eventosSonido = () => ev.sort((a, b) => a.t - b.t);
  window.seek(0);
})();
