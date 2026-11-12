// Estilo v6 · motor de shorts 9:16 (ADR 0010). Subido de proyectos/como-google-sabe-lo-que-quieres/escenas/comun/short-motor.js
// (2026-11-12), el primer vídeo completo en v6. Script clásico (funciones globales). Necesita escena.js y piezas.js.
// Un mundo ancho de N estaciones con ruta6 (viaje entre estaciones, desplazamiento lateral en los cambios de tema, zoom
// core de 0,4 s), título de 2 s, un rótulo por tema que entra al llegar la cámara, MISTA en la entrada, de pie en cada
// cambio de tema y en el cierre, y la caja de diálogo con la fuente de cada frase. Cada short solo pone sus estaciones.
//
//   montarShort6({ TT, entrada, titulo: [rotuloHtml, titularHtml],
//     estaciones: [{ dib(L, x0, t), hasta: "fr03", extra? }],     // la cámara sale de la estación tras el fin real de `hasta`
//     zooms: [{ est, desde, cx, cy }],                              // cx relativo a su estación
//     temas: [{ desde, hasta, html, pose? }],                       // estaciones de cada tema; la primera es la entrada
//     textos(T6, R, X), claves: [[t, nombre]], sonidos: [[t, tipo]], clavesDialogo: { fr01: "palabra" },
//     etiquetas: { fr05: "texto de la pestaña" }, cortos: { f3: "Nombre corto" }, lunas: [0, N - 1] })
//   → { R, X, M, SU, D6, avisos }
//
// La pestaña de la fuente va bajo la caja, alineada a la derecha y en una línea: con más de FUENTE_SHORT6 caracteres se
// sale por la izquierda. Los nombres salen de TIMING.fuentes, que motor/timing-a-js.mjs llena para un short con el campo
// `corto_short` de fuentes.json (o `corto` si falta); `cortos` los cambia para este short. Las pestañas demasiado largas
// van a window.revision.avisos y motor/revisar.mjs las enseña.
// Contrato seek(t): todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.

const FUENTE_SHORT6 = 17; // caracteres que caben en la pestaña de la fuente del short (sin «Fuente:»)

// Nombres de la pestaña para un short y avisos de las que no caben: { nombres: { f1: "…" }, avisos: [{ frase, texto, largo }] }.
// El texto de cada frase es el de crearDialogo6: su etiqueta o sus fuentes unidas con « · ».
function fuentesShort6(T, { cortos = {}, etiquetas = {}, max = FUENTE_SHORT6 } = {}) {
  const nombres = { ...(T.fuentes || {}), ...cortos };
  const avisos = [];
  for (const f of T.frases) {
    const texto = f.id in etiquetas ? etiquetas[f.id] : [...new Set((f.fuentes || []).map((m) => nombres[m] || m))].join(" · ");
    if (texto && texto.length > max) avisos.push({ frase: f.id, texto, largo: texto.length });
  }
  return { nombres, avisos };
}

function montarShort6(cfg) {
  document.body.className = "short";
  const W = 270, H = 480;
  const M = { rotulo: [16, 64], suelo: 292, SX: 135, SY: 200, caja: 300, titular: [16, 116], gato: [20, 196], asoma: [6, 195] };
  const T = window.TIMING, TT = cfg.TT, SU = M.suelo;
  const FS = fuentesShort6(T, { cortos: cfg.cortos, etiquetas: cfg.etiquetas });
  T.fuentes = FS.nombres;
  const N = cfg.estaciones.length;
  const { L, ANCHO, MW, G12, CAPAS, X, limpiar } = lienzos6({ W, H, N });
  const DURACION = TT.DURACION;
  const saltos = cfg.estaciones.slice(0, -1).map((e, k) => [e.hasta, cfg.temas.some((m) => m.desde === k + 1) ? "tema" : "viaje", e.extra || 0]);
  const R = ruta6({ W, M, fin: TT.fin, entrada: cfg.entrada, saltos, zooms: cfg.zooms || [] });
  const F = fondoNoche6({ L, ANCHO, W, H, N, SU, SX: M.SX, lunas: cfg.lunas || [0, N - 1] });

  const T6 = crearTextos6({ interfaz: document.getElementById("textos"), mundo: document.getElementById("textos-mundo") });
  T6.titulo(0, cfg.entrada, cfg.titulo[0], cfg.titulo[1], M);
  cfg.temas.forEach((m) => T6.rotulo(R.LLE(m.desde), m.hasta + 1 < N ? R.SAL(m.hasta) : DURACION + 1, m.html, M.rotulo));
  if (cfg.textos) cfg.textos(T6, R, X);
  const CLAVES = (cfg.claves || []).map(([t, nombre]) => ({ t: Math.round(t * 1000) / 1000, nombre }));
  const avisos = FS.avisos.map((a) => ({ regla: "fuente-larga", texto: `${a.frase}: «${a.texto}» tiene ${a.largo} caracteres; en el short caben ${FUENTE_SHORT6} (corto_short en fuentes.json o cortos)` }));
  window.revision = { movimientos: R.movimientos, salidas: R.salidas, llegadas: R.llegadas, claves: CLAVES, avisos };

  // MISTA: de pie 1-2 s al llegar a cada tema (salvo el primero, que es la entrada) y hasta el final en el cierre
  const MOMENTOS = cfg.temas.slice(1).map((m) => ({ desde: R.LLE(m.desde), hasta: m.desde === N - 1 ? DURACION + 1 : R.LLE(m.desde) + 1.6, pose: "pie", luego: [0.5, m.pose || "senalar"] }));
  const CAM = crearCamara({ W, H, SX: M.SX, SY: M.SY, lineaCaja: M.caja, anchoMundo: MW, altoMundo: H, planos: R.planos });
  const D6 = crearDialogo6({ T, ids: T.frases.map((f) => f.id), claves: cfg.clavesDialogo || {}, etiquetas: cfg.etiquetas || {}, maxc: 21, corto: true,
    dialogo: document.getElementById("dialogo"), frase: document.getElementById("frase"), retrato: document.getElementById("retrato"), fuente: document.getElementById("fuente") });
  tildes6(); tildesPixel(".cifra6 .unidad"); // «días»: la Í minúscula de Press Start 2P

  window.eventosSonido = () => {
    const ev = [{ t: cfg.entrada, tipo: "destello" }, ...R.salidas.map((t) => ({ t, tipo: "destello" })), ...(cfg.sonidos || []).map(([t, tipo]) => ({ t, tipo }))];
    return ev.map((e) => ({ t: Math.round(e.t * 1000) / 1000, tipo: e.tipo })).sort((a, b) => a.t - b.t);
  };
  window.claveFotograma = clave6(R.moviendo);
  window.DURACION = DURACION;

  window.seek = (t) => {
    limpiar();
    const cam = CAM.en(t);
    CAM.aplicarCapas(cam, CAPAS);
    F.cielo(t);
    const enTema = t < cfg.entrada;
    ["p-medio", "p-delante"].forEach((id) => {
      const el = document.getElementById(id);
      el.style.visibility = enTema ? "hidden" : "visible";
      if (t >= cfg.entrada && t < R.LLE(0)) el.style.transform = `translateX(${Math.round((1 - prog6(t, cfg.entrada, R.LLE(0))) * W)}px)`;
    });
    if (!enTema) {
      F.suelo();
      const n = lim6(Math.round((M.SX - cam.tx) / cam.k / W - 0.5), 0, N - 1);
      for (let k = Math.max(0, n - 1); k <= Math.min(N - 1, n + 1); k++) cfg.estaciones[k].dib(L, X(k), t);
      F.delante();
    }
    mista6(G12, t, { W, M, hablando: TT.hablando, entrada: [cfg.entrada, R.LLE(0)], momentos: MOMENTOS });
    T6.ver(t);
    D6.pintar(t);
  };
  window.seek(0);
  return { R, X, M, SU, D6, avisos: FS.avisos };
}
