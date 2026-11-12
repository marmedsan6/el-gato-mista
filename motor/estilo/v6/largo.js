// Estilo v6 · motor del largo 16:9 con UN MUNDO POR BLOQUE (ADR 0010). Subido de
// proyectos/como-google-sabe-lo-que-quieres/escenas/largo/largo.js (2026-11-12), el primer vídeo completo en v6.
// Script clásico (funciones globales). Necesita escena.js y piezas.js.
// Cada bloque del guion es un mundo ancho propio (sus estaciones, su cámara ruta6, sus lienzos6 y su cielo). El mundo del
// bloque b empieza con una copia de la última estación del bloque b-1: el cambio de tema es el desplazamiento lateral de
// 0,4 s de siempre, con paralaje, y cada captura solo carga las pantallas de su bloque. window.revision junta los
// movimientos, salidas y llegadas de todos los bloques (tiempos absolutos). ?hasta=N pinta solo hasta el bloque N.
//
//   desfase6(window.TIMING, 1.2);                  // la voz entra 1,2 s después (título de 2 s): antes de tiempos6
//   const TT = tiempos6(window.TIMING);
//   const T6 = crearTextos6({ … });                 // los bloques pueden poner identificadores y cifras al definirse
//   const B1 = { estaciones: [{ dib(L, x0, t), hasta: "fr05", extra? }], zooms: [{ est, desde, cx, cy }],
//                rotulo: 'El <span class="clave">tema</span>', momento: { pose: "pensar" }, cierre?: true };
//   montarLargo6({ TT, T6, entrada: 2.2, titulo: [rotuloHtml, titularHtml], bloques: [B1, B2, …],
//     claves: [{ t, nombre }], sonidos: [{ t, tipo }], clavesDialogo, etiquetas, lunas: [1] })
//   → { BLOQUES, DURACION, M, SU }
// En los zooms, `est` cuenta la copia de la estación anterior (la 0 de cada bloque salvo el primero). Las coordenadas de los
// textos del mundo (T6.identificador, T6.cifra con enMundo) son locales al mundo de su bloque: x = k * W + …
// Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.

const M_LARGO6 = { suelo: 198, SX: 240, SY: 100, caja: 200, rotulo: [16, 16], titular: [176, 76], gato: [60, 104], asoma: [336, 99] };

// Retrasa la voz `s` segundos en el timing (frases, palabras y duración). Llámalo una vez, antes de tiempos6.
function desfase6(T, s) {
  T.frases.forEach((f) => { f.inicio += s; f.fin += s; f.palabras.forEach((w) => { w.i += s; w.f += s; }); });
  T.audio.duracion_s += s;
  return T;
}

// Bloques con su mundo: la copia de la última estación del anterior, los saltos, la ruta y la cámara de cada uno.
function mundosPorBloque6({ bloques, hasta = bloques.length, W, H, M, fin, entrada }) {
  const BLOQUES = bloques.slice(0, hasta).map((b, i) => {
    const previa = i > 0 ? bloques[i - 1].estaciones[bloques[i - 1].estaciones.length - 1] : null;
    const estaciones = previa ? [previa, ...b.estaciones] : b.estaciones;
    const saltos = [];
    if (previa) saltos.push([previa.hasta, "tema", previa.extra || 0]);
    b.estaciones.slice(0, -1).forEach((e) => saltos.push([e.hasta, "viaje", e.extra || 0]));
    const R = ruta6({ W, M, fin, entrada: i === 0 ? entrada : 0, saltos, zooms: b.zooms || [] });
    const N = estaciones.length;
    const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: N * W, altoMundo: H, planos: R.planos });
    const desde = i === 0 ? 0 : R.salidas[0];
    return { ...b, estaciones, R, N, CAM, desde, llega: i === 0 ? R.LLE(0) : R.LLE(1) };
  });
  BLOQUES.forEach((b, i) => { b.hasta = i + 1 < BLOQUES.length ? BLOQUES[i + 1].desde : Infinity; });
  const MOV = BLOQUES.flatMap((b) => b.R.movimientos).sort((a, c) => a[0] - c[0]);
  const SAL = BLOQUES.flatMap((b) => b.R.salidas).sort((a, c) => a - c);
  const LLE = BLOQUES.flatMap((b, i) => (i === 0 ? b.R.llegadas : b.R.llegadas.slice(1))).sort((a, c) => a - c);
  return { BLOQUES, MOV, SAL, LLE, moviendo: (t) => MOV.some(([a, c]) => t >= a && t < c), bloqueEn: (t) => BLOQUES.reduce((a, b, k) => (t >= b.desde ? k : a), 0) };
}

function montarLargo6(cfg) {
  document.body.className = "largo";
  const W = 480, H = 270, M = { ...M_LARGO6, ...(cfg.M || {}) }, SU = M.suelo;
  const T = window.TIMING, TT = cfg.TT, fin = TT.fin, ENTRADA = cfg.entrada;
  const T6 = cfg.T6 || crearTextos6({ interfaz: document.getElementById("textos"), mundo: document.getElementById("textos-mundo") });
  const pedido = Number(new URLSearchParams(location.search).get("hasta"));
  const HASTA = Math.min(cfg.bloques.length, cfg.hasta || pedido || cfg.bloques.length);
  const MB = mundosPorBloque6({ bloques: cfg.bloques, hasta: HASTA, W, H, M, fin, entrada: ENTRADA });
  const { BLOQUES, SAL } = MB;
  const ultimo = BLOQUES[BLOQUES.length - 1];
  const DURACION = HASTA < cfg.bloques.length ? fin(ultimo.estaciones[ultimo.estaciones.length - 1].hasta) + 1.2 : TT.DURACION;
  window.DURACION = DURACION;

  // título y rótulos: el rótulo de cada bloque entra al llegar la cámara y dura todo el bloque
  T6.titulo(0, ENTRADA, cfg.titulo[0], cfg.titulo[1], M);
  BLOQUES.forEach((b) => T6.rotulo(b.llega, Math.min(b.hasta, DURACION + 1), b.rotulo, M.rotulo));
  if (cfg.textos) cfg.textos(T6, BLOQUES);
  // MISTA: entrada con el título y de pie 1-2 s al llegar a cada tema
  const MOMENTOS = BLOQUES.slice(1).map((b) => ({ desde: b.llega, hasta: b.cierre ? DURACION + 1 : b.llega + 1.6, pose: "pie", luego: [0.5, (b.momento && b.momento.pose) || "senalar"] }));

  const CLAVES = (cfg.claves || []).filter((c) => c.t < DURACION);
  window.revision = { movimientos: MB.MOV, salidas: SAL, llegadas: MB.LLE, claves: CLAVES };

  const D6 = crearDialogo6({ T, ids: T.frases.filter((f) => f.inicio < DURACION).map((f) => f.id), claves: cfg.clavesDialogo || {}, etiquetas: cfg.etiquetas || {},
    maxc: 52, corto: false, dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"),
    retrato: document.getElementById("retrato"), fuente: document.getElementById("fuente") });
  tildes6(); tildesPixel(".cifra6 .unidad"); // «días»: la Í minúscula de Press Start 2P

  window.eventosSonido = () => {
    const ev = [{ t: ENTRADA, tipo: "destello" }, ...SAL.map((t) => ({ t: Math.round(t * 1000) / 1000, tipo: "destello" })), ...(cfg.sonidos || [])];
    return ev.filter((e) => e.t < DURACION).sort((a, c) => a.t - c.t);
  };
  window.claveFotograma = clave6(MB.moviendo);

  // lienzos del bloque activo (se rehacen solo al cambiar de bloque)
  let actual = -1, LZ = null, F = null;
  function activar(i) {
    if (i === actual) return;
    actual = i;
    LZ = lienzos6({ W, H, N: BLOQUES[i].N });
    F = fondoNoche6({ L: LZ.L, ANCHO: LZ.ANCHO, W, H, N: BLOQUES[i].N, SU, SX: M.SX, lunas: cfg.lunas || [1] });
  }

  window.seek = (t) => {
    const i = MB.bloqueEn(t), B = BLOQUES[i];
    activar(i);
    LZ.limpiar();
    const cam = B.CAM.en(t);
    B.CAM.aplicarCapas(cam, LZ.CAPAS);
    F.cielo(t);
    const enTema = i === 0 && t < ENTRADA;
    ["p-medio", "p-delante"].forEach((id) => {
      const el = document.getElementById(id);
      el.style.visibility = enTema ? "hidden" : "visible";
      if (i === 0 && t >= ENTRADA && t < B.llega) el.style.transform = `translateX(${Math.round((1 - prog6(t, ENTRADA, B.llega)) * W)}px)`;
    });
    if (!enTema) {
      F.suelo();
      const n = lim6(Math.round((M.SX - cam.tx) / cam.k / W - 0.5), 0, B.N - 1);
      for (let k = Math.max(0, n - 1); k <= Math.min(B.N - 1, n + 1); k++) B.estaciones[k].dib(LZ.L, k * W, t);
      F.delante();
    }
    mista6(LZ.G12, t, { W, M, hablando: TT.hablando, entrada: [ENTRADA, BLOQUES[0].llega], momentos: MOMENTOS });
    T6.ver(t);
    D6.pintar(t);
  };
  window.seek(0);
  return { BLOQUES, DURACION, M, SU, D6 };
}
