// Calibración v7 · clip 16:9 (2026-11-15, ADR 0011). Las estaciones 0 y 1 del short A de ia-pasa-factura con arte
// generado, compuestas para 480×270: la respuesta de arriba (buscador, tienda, paseante y tendero) y las dos calles de
// Pew, aquí una al lado de la otra (izquierda sin cartel: todos entran; derecha con el cartel: la mitad se da la vuelta).
// Voz y timing del short A hasta el final de fr05. Contrato seek(t): todo desde t; sin reloj; azar solo con semilla.
(() => {
  const PZ = window.PIEZAS;
  const T = window.TIMING;
  T.frases = T.frases.slice(0, 5);
  T.audio.duracion_s = Math.round((T.frases[4].fin + 0.6) * 100) / 100;
  const W = 480, H = 270, N = 2;
  const M = { suelo: 198, SX: 240, SY: 100, caja: 200, rotulo: [16, 16], titular: [176, 76], gato: [60, 104], asoma: [336, 99] };
  const TT = tiempos6(T), P = TT.P, SU = M.suelo, DURACION = TT.DURACION, GC = R5.contorno, C = CAMISAS7, LUZ = "#3a2c1c";
  const prog = prog6, salto = salto6;
  const { L, ANCHO, MW, G12, CAPAS, X, limpiar } = lienzos6({ W, H, N });
  const F = fondoNoche6({ L, ANCHO, W, H, N, SU, SX: M.SX, lunas: [0] });

  const T_ENTRADA = P("fr01", "que"), T_ARRIBA = P("fr01", "arriba"), T_VAS = P("fr01", "vas"), T_NINGUNA = P("fr01", "ninguna");
  const T_RESULT = P("fr04", "resultado"), T_CUANDO = P("fr04", "Cuando"), T_SOLO = P("fr04", "solo");
  const T_ENLACES = P("fr05", "enlaces"), T_UNO = P("fr05", "1 %");
  const R = ruta6({ W, M, fin: TT.fin, entrada: T_ENTRADA, saltos: [["fr02", "viaje", 0]], zooms: [{ est: 1, desde: T_CUANDO, cx: 300, cy: 140 }] });
  window.revision = { movimientos: R.movimientos, salidas: R.salidas, llegadas: R.llegadas,
    claves: [[T_NINGUNA, "el tendero en la puerta"], [T_RESULT, "la calle de la izquierda entra"], [T_SOLO - 0.4, "la calle del cartel se da la vuelta"], [T_ENLACES, "el botón del resumen"]]
      .map(([t, nombre]) => ({ t: Math.round(t * 1000) / 1000, nombre })) };

  const T6 = crearTextos6({ interfaz: document.getElementById("textos"), mundo: document.getElementById("textos-mundo") });
  T6.titulo(0, T_ENTRADA, 'IA · <span class="clave">la factura</span>', 'Sin<br><span class="clave">clic</span>', M);
  T6.rotulo(R.LLE(0), DURACION + 1, 'Sin <span class="clave">clic</span>', M.rotulo);
  T6.cifra(T_RESULT, T_SOLO - 0.2, '15<span class="unidad">%</span>', [X(1) + 150, 100], true);
  T6.cifra(T_SOLO, T_UNO, '8<span class="unidad">%</span>', [X(1) + 392, 100], true);
  T6.cifra(T_UNO + 0.05, DURACION + 1, '1<span class="unidad">%</span>', [X(1) + 392, 100], true);
  const D6 = crearDialogo6({ T, ids: T.frases.map((f) => f.id), claves: { fr01: "ninguna", fr02: "notado", fr03: "900", fr04: "mitad", fr05: "1" }, maxc: 52, corto: false,
    dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"), retrato: document.getElementById("retrato"), fuente: document.getElementById("fuente") });
  tildes6();
  const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: MW, altoMundo: H, planos: R.planos });

  const camina = (svg, x, su, t, op = {}) => andar7(svg, { quieto: PZ.quieto, paso: PZ.paso }, x, su, t, op);
  const arriba = (svg, s, x, y, op = {}) => sprite7(svg, s, x, y + s.h, { izq: true, ...op });
  function tienda(x, su, { luz = 1, cierre = 0 } = {}) {
    const Tn = sprite7(L.medio, PZ.tienda, x, su, { izq: true, estado: luz ? null : "apagada" });
    const e = punto7(Tn, "escaparate"), d = punto7(Tn, "puerta");
    if (luz) rect(L.brillo, e.x - 3, e.y - 3, e.w + 6, e.h + 6, LUZ);
    puerta7(L.medio, d, cierre);
    return d;
  }
  function cartel(s, x, y, t, s0 = null) {
    const dy = s0 === null ? 0 : salto(t, s0) || 0;
    const pos = arriba(L.frente, s, x, y + dy);
    rect(L.brillo, x - 3, y - 3 + dy, s.w + 6, s.h + 6, Math.floor(t * 2) % 2 ? "#1d2f6b" : "#16285a");
    return pos;
  }

  function respuesta(x0, t) {
    const { medio, frente } = L;
    const B = arriba(medio, PZ.buscador, x0 + 60, 70);
    placa6(medio, B.x0 + PZ.buscador.w - 54, B.y0 - 15, "GOOGLE", { color: "#f5f7fb", fondo: "#0c1016" });
    const barra = punto7(B, "barra"), escrito = prog(t, T_ENTRADA - 0.4, T_ENTRADA + 0.4);
    for (let k = 0; k < Math.round(escrito * 10); k++) rect(medio, barra.x + 10 + k * 5, barra.y + 2, 3, 3, "#43506a");
    if (t >= T_ARRIBA - 0.2) { const r = punto7(B, "resultados"); cartel(PZ["cartel-resumen"], r.cx - 35, r.y - 2, t, T_ARRIBA - 0.2); }
    const apaga = T_NINGUNA + 1.3;
    const d = tienda(x0 + 300, SU, { luz: t < apaga ? 1 : 0, cierre: prog(t, apaga, apaga + 0.4) });
    const ida = prog(t, T_ENTRADA, T_VAS), vuelta = prog(t, T_VAS, T_VAS + 2.4);
    const px = Math.round(x0 + 170 + 110 * ida - 170 * vuelta);
    if (px > x0 - 14) camina(frente, px, SU, t, { camisa: C[1], dir: t < T_VAS ? 1 : -1, anda: ida < 1 || vuelta > 0 });
    if (t >= T_NINGUNA) {
      const s = salto(t, T_NINGUNA) || 0;
      sprite7(frente, PZ.tendero, d.x - 8, SU + s, { dir: -1 });
      if (t >= T_NINGUNA + 0.6) sprite7(frente, PZ.pregunta, d.x - 14, SU - 32 + (salto(t, T_NINGUNA + 0.6) || 0));
    }
  }
  function calles(x0, t) {
    const { medio, frente, brillo } = L;
    const A = tienda(x0 + 130, SU), B = tienda(x0 + 372, SU);
    rect(medio, x0 + 236, SU - 90, 4, 90, GC); rect(medio, x0 + 237, SU - 90, 2, 90, R5.hormigon[2]); // la esquina que separa las dos calles
    const K = cartel(PZ[t >= T_ENLACES - 0.3 ? "cartel-enlaces" : "cartel-resumen"], x0 + 290, SU - 80, t);
    if (t >= T_ENLACES && (t - T_ENLACES) % 1.6 < 0.9) { const e = punto7(K, "enlace"); rect(frente, e.x, e.y, e.w, e.h, P6.ORO[2]); rect(brillo, e.x - 3, e.y - 3, e.w + 6, e.h + 6, LUZ); }
    const ob = sprite7(medio, PZ.observador, x0 + 14, SU, { izq: true }), papel = punto7(ob, "papel");
    const marcas = Math.floor(prog(t, TT.ini("fr03"), T_RESULT + 4) * 6);
    for (let k = 0; k < Math.min(marcas, 6); k++) rect(frente, papel.x + 1 + (k % 2) * 3, papel.y + 1 + Math.floor(k / 2) * 2, 2, 1, GC);
    placa6(medio, x0 + 10, SU - PZ.observador.h - 18, "PEW", { color: "#f5f7fb", fondo: "#0c1016" });
    for (let k = 0; k < 4; k++) {
      const f = (t * 0.2 + k / 4) % 1, xa = x0 + 40;
      if (f < 0.96) camina(frente, Math.round(xa + (A.cx - xa) * f), SU, t, { camisa: C[k % 5], fase: k * 0.1 });
      const g = (t * 0.2 + k / 4 + 0.12) % 1, xb = x0 + 250, vuelve = k % 2 === 0;
      if (!vuelve) { if (g < 0.96) camina(frente, Math.round(xb + (B.cx - xb) * g), SU, t, { camisa: C[(k + 2) % 5], fase: k * 0.13 }); }
      else { const ida = Math.min(g, 0.4), atras = Math.max(0, g - 0.4); const xx = Math.round(xb + (B.cx - xb) * ida - 120 * atras); if (xx > xb - 4) camina(frente, xx, SU, t, { camisa: C[(k + 2) % 5], dir: g < 0.4 ? 1 : -1, fase: k * 0.13 }); }
    }
  }

  window.eventosSonido = () => [{ t: T_ENTRADA, tipo: "destello" }, { t: T_ARRIBA, tipo: "aparicion" }, { t: T_NINGUNA, tipo: "seleccion" }, { t: R.SAL(0), tipo: "destello" },
    { t: T_RESULT, tipo: "tick" }, { t: T_SOLO, tipo: "tick" }, { t: T_UNO, tipo: "tick" }].map((e) => ({ t: Math.round(e.t * 1000) / 1000, tipo: e.tipo }));
  window.claveFotograma = clave6(R.moviendo);
  window.seek = (t) => {
    limpiar();
    const cam = CAM.en(t);
    CAM.aplicarCapas(cam, CAPAS);
    F.cielo(t);
    const enTema = t < T_ENTRADA;
    ["p-medio", "p-delante"].forEach((id) => { const el = document.getElementById(id); el.style.visibility = enTema ? "hidden" : "visible";
      if (t >= T_ENTRADA && t < R.LLE(0)) el.style.transform = `translateX(${Math.round((1 - prog6(t, T_ENTRADA, R.LLE(0))) * W)}px)`; });
    if (!enTema) { F.suelo(); respuesta(X(0), t); calles(X(1), t); F.delante(); }
    mista6(G12, t, { W, M, hablando: TT.hablando, entrada: [T_ENTRADA, R.LLE(0)], momentos: [] });
    T6.ver(t);
    D6.pintar(t);
  };
  window.seek(0);
})();
