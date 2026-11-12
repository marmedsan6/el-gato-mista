// Lint de textos y sincronía (estilo v6, ADR 0010). Lógica pura sobre un muestreo de la escena: la hace revisar.mjs
// recorriendo seek(t) y midiendo los rectángulos del DOM. Aquí no hay navegador: se prueba con datos sintéticos.
//
// Muestreo:
//   { W, H, corto, paso,
//     frases: [{ id, inicio, fin, texto, fuentes: [] }],                      // del timing (opcional)
//     revision: { movimientos: [[a, b]], salidas: [t], claves: [{ t, nombre }], avisos?: [{ regla, texto }] } | null,   // window.revision (opcional)
//     instantes: [{ t, textos: [{ id, clase, texto, arte, l, t, r, b }],
//                   dialogo: { l, t, r, b, lineas, huerfano } | null,
//                   fuente: { texto, l, t, r, b } | null }] }
// Resultado: { errores: [{ regla, texto, desde, hasta, detalle }], avisos: [...], resumen }
export const POR_DEFECTO = {
  minimo: 2,            // s que tiene que estar en pantalla cualquier texto
  porPalabra: 0.35,     // s por palabra para rótulos y titulares (si da más que el mínimo)
  maxSimultaneos: 2,    // textos a la vez, sin contar la caja ni las piezas del dibujo (data-arte)
  saltoMax: 6,          // px que puede moverse un texto entre dos muestras con la cámara quieta
  transitorio: 0.15,    // s por debajo de los cuales un solape, un salto o una salida de cuadro no cuentan (entradas a saltos)
  repite: 0.6,          // parte de las palabras de un texto que, si están en la frase que suena, lo delatan como transcripción
  margenClave: 2,       // s entre una pieza clave y la salida de la cámara
  maxFuenteShort: 17,   // caracteres que caben en la pestaña de la fuente del short (aviso, sin «Fuente:»)
};

const VACIAS = new Set(["de", "del", "la", "el", "los", "las", "a", "al", "que", "se", "lo", "en", "su", "sus", "y", "o", "para", "por", "sin", "con", "un", "una", "es", "como"]);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const palabras = (s) => norm(s).split(/[^a-z0-9ñ]+/).filter(Boolean);
const contenido = (s) => palabras(s).filter((p) => !VACIAS.has(p));

// instantes sueltos → tramos [desde, hasta) uniendo los consecutivos
function tramos(ts, paso) {
  const r = [];
  for (const t of ts) { const u = r[r.length - 1]; if (u && t - u[1] <= paso * 1.5) u[1] = t; else r.push([t, t]); }
  return r.map(([a, b]) => [a, b + paso]);
}

export function lintTextos(m, opciones = {}) {
  const op = { ...POR_DEFECTO, ...opciones };
  const { W, H, corto, paso } = m;
  const errores = [], avisos = [];
  const marcas = new Map(); // "regla|quien" → { regla, texto, ts: [], detalle }
  const marca = (regla, texto, t, detalle = "") => {
    const k = `${regla}|${texto}`;
    if (!marcas.has(k)) marcas.set(k, { regla, texto, ts: [], detalle });
    const e = marcas.get(k); e.ts.push(t); if (detalle) e.detalle = detalle;
  };
  const movimientos = (m.revision && m.revision.movimientos) || [];
  const moviendo = (t) => movimientos.some(([a, b]) => t >= a - paso && t <= b + paso);
  const nodos = new Map(); // id → { clase, texto, arte, ts: [] }
  let maxSim = 0, tMaxSim = 0;
  let previo = null;
  const demasiados = []; // instantes con más textos que el presupuesto

  for (const ins of m.instantes) {
    const vis = ins.textos;
    for (const x of vis) {
      if (!nodos.has(x.id)) nodos.set(x.id, { clase: x.clase, texto: x.texto, arte: !!x.arte, ts: [] });
      nodos.get(x.id).ts.push(ins.t);
      const viajando = moviendo(ins.t); // en un viaje, lo anclado al mundo cruza el borde como cualquier objeto
      if (!viajando && (x.l < -0.5 || x.r > W + 0.5 || x.t < -0.5 || x.b > H + 0.5)) marca("fuera", x.texto, ins.t, `x ${Math.round(x.l)}-${Math.round(x.r)} de ${W}`);
      if (corto && !viajando) {
        if (x.t < H * 0.12) marca("zona-tapada", x.texto, ins.t, "12 % superior");
        else if (x.b > H * 0.8) marca("zona-tapada", x.texto, ins.t, "20 % inferior");
        else if (x.r > W * (237 / 270) && x.b > H * 0.45 && x.t < H * 0.85) marca("zona-tapada", x.texto, ins.t, "franja derecha");
      }
      const d = ins.dialogo;
      if (d && Math.min(x.r, d.r) - Math.max(x.l, d.l) > 1 && Math.min(x.b, d.b) - Math.max(x.t, d.t) > 1) marca("sobre-dialogo", x.texto, ins.t);
      if (previo && !moviendo(ins.t)) {
        const antes = previo.textos.find((y) => y.id === x.id);
        if (antes && Math.hypot(x.l - antes.l, x.t - antes.t) > op.saltoMax) marca("salto", x.texto, ins.t, `de (${Math.round(antes.l)},${Math.round(antes.t)}) a (${Math.round(x.l)},${Math.round(x.t)})`);
      }
    }
    for (let a = 0; a < vis.length; a++) for (let b = a + 1; b < vis.length; b++) {
      const A = vis[a], B = vis[b];
      const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
      if (ox > 1 && oy > 1) marca("solape", `${A.texto} × ${B.texto}`, ins.t, `${Math.round(ox)}×${Math.round(oy)} px`);
    }
    const cuenta = vis.filter((x) => !x.arte).length;
    if (cuenta > maxSim) { maxSim = cuenta; tMaxSim = ins.t; }
    if (cuenta > op.maxSimultaneos) demasiados.push({ t: ins.t, cuenta, lista: vis.filter((x) => !x.arte).map((x) => x.texto).join(" · ") });
    if (ins.dialogo && ins.dialogo.lineas > 2) marca("dialogo", "caja de diálogo con más de 2 líneas", ins.t, `${ins.dialogo.lineas} líneas`);
    if (ins.dialogo && ins.dialogo.huerfano) marca("dialogo", "signo de puntuación solo al empezar una línea de la caja", ins.t);
    previo = ins;
  }

  // reglas con duración: lo transitorio (entradas a saltos de 0,15 s) no cuenta
  for (const e of marcas.values()) {
    const corta = e.regla === "salto" || e.regla === "dialogo" ? 0 : op.transitorio; // un salto es instantáneo por naturaleza
    for (const [a, b] of tramos(e.ts, paso)) if (b - a > corta) errores.push({ regla: e.regla, texto: e.texto, desde: a, hasta: b, detalle: e.detalle });
  }
  for (const [a, b] of tramos(demasiados.map((d) => d.t), paso)) { // un error por tramo, con su peor instante
    const peor = demasiados.filter((d) => d.t >= a && d.t < b).reduce((m, d) => (d.cuenta > m.cuenta ? d : m));
    errores.push({ regla: "simultaneos", texto: `${peor.cuenta} textos a la vez (presupuesto: ${op.maxSimultaneos})`, desde: a, hasta: b, detalle: peor.lista });
  }

  // permanencia, rótulo frente a la llegada y transcripción de la voz
  const frases = m.frases || [];
  for (const n of nodos.values()) {
    const titulo = /rotulo|titular/.test(n.clase);
    const minimo = titulo ? Math.max(op.minimo, op.porPalabra * palabras(n.texto).length) : op.minimo;
    for (const [a, b] of tramos(n.ts, paso)) {
      if (b - a < minimo - paso) errores.push({ regla: "permanencia", texto: n.texto, desde: a, hasta: b, detalle: `${(b - a).toFixed(2)} s en pantalla; mínimo ${minimo.toFixed(2)} s` });
      if (/rotulo/.test(n.clase)) {
        const viaje = movimientos.find(([x, y]) => a >= x - paso && a < y - paso);
        if (viaje) errores.push({ regla: "rotulo-llegada", texto: n.texto, desde: a, hasta: viaje[1], detalle: "el rótulo cambia antes de que llegue la cámara" });
      }
      if (!n.arte && !/identificador|rotulo|titular/.test(n.clase)) {
        const suena = frases.filter((f) => f.inicio < b && f.fin > a).map((f) => f.texto).join(" ");
        const mias = contenido(n.texto), dichas = new Set(contenido(suena));
        if (mias.length >= 2 && mias.filter((p) => dichas.has(p)).length / mias.length >= op.repite) {
          errores.push({ regla: "repite-voz", texto: n.texto, desde: a, hasta: b, detalle: "repite lo que dice la voz en ese momento" });
        }
      }
    }
  }

  // fuente del dato: visible durante su frase (solo las frases que caen enteras en el tramo recorrido)
  const t0 = m.instantes.length ? m.instantes[0].t : 0, t1 = m.instantes.length ? m.instantes[m.instantes.length - 1].t + paso : 0;
  for (const f of frases.filter((x) => x.fuentes && x.fuentes.length && x.inicio >= t0 - paso && x.fin <= t1 + paso)) {
    const dentro = m.instantes.filter((i) => i.t >= f.inicio && i.t < f.fin && i.fuente && i.fuente.texto &&
      i.fuente.l >= -0.5 && i.fuente.r <= W + 0.5 && i.fuente.b <= H + 0.5);
    const visible = dentro.length * paso, pedido = Math.min(op.minimo, (f.fin - f.inicio) * 0.8);
    if (visible < pedido - paso) errores.push({ regla: "fuente", texto: `${f.id}: ${f.fuentes.join(", ")}`, desde: f.inicio, hasta: f.fin, detalle: `la fuente se ve ${visible.toFixed(2)} s durante la frase; mínimo ${pedido.toFixed(2)} s` });
  }

  // piezas clave: en pantalla el margen pedido antes de que la cámara salga
  if (m.revision && m.revision.claves && m.revision.salidas) {
    for (const c of m.revision.claves) {
      const salida = m.revision.salidas.find((s) => s > c.t);
      if (salida !== undefined && salida - c.t < op.margenClave - 1e-6) {
        errores.push({ regla: "clave", texto: c.nombre, desde: c.t, hasta: salida, detalle: `${(salida - c.t).toFixed(2)} s antes de que salga la cámara; mínimo ${op.margenClave} s` });
      }
    }
  }
  // pestaña de la fuente del short: una línea alineada a la derecha; con más de maxFuenteShort caracteres se sale por la izquierda
  if (corto) {
    const vistas = new Set(m.instantes.filter((i) => i.fuente && i.fuente.texto).map((i) => i.fuente.texto.replace(/^fuente:\s*/i, "").trim()));
    for (const n of vistas) if (n.length > op.maxFuenteShort) avisos.push({ regla: "fuente-larga", texto: `«${n}» tiene ${n.length} caracteres; en la pestaña del short caben ${op.maxFuenteShort} (corto_short en fuentes.json)` });
  }
  for (const a of (m.revision && m.revision.avisos) || []) if (!avisos.some((b) => b.regla === a.regla && b.texto === a.texto)) avisos.push(a); // los que declara la escena (montarShort6)
  if (!m.revision) avisos.push({ regla: "revision", texto: "la escena no declara window.revision: no se comprueban piezas clave ni saltos con la cámara en movimiento" });

  errores.sort((a, b) => a.desde - b.desde || a.regla.localeCompare(b.regla));
  const porRegla = {};
  for (const e of errores) porRegla[e.regla] = (porRegla[e.regla] || 0) + 1;
  const duracion = m.instantes.length ? m.instantes[m.instantes.length - 1].t + paso - m.instantes[0].t : 0;
  return { errores, avisos, resumen: { textos: nodos.size, de_arte: [...nodos.values()].filter((n) => n.arte).length, max_simultaneos: maxSim, t_max_simultaneos: tMaxSim,
    duracion, errores: errores.length, por_regla: porRegla } };
}

// Texto para la consola y para pegar en reviews/qa-vN.md
export function informeLint(r) {
  const s = r.resumen;
  const lineas = [`Lint de textos: ${s.textos} textos (${s.de_arte} son piezas del dibujo), máximo ${s.max_simultaneos} a la vez (t = ${s.t_max_simultaneos.toFixed(2)} s), ${s.errores} errores.`];
  for (const e of r.errores) lineas.push(`- [${e.desde.toFixed(2)}-${e.hasta.toFixed(2)}] ${e.regla}: «${e.texto}»${e.detalle ? ` · ${e.detalle}` : ""}`);
  for (const a of r.avisos) lineas.push(`- aviso · ${a.regla}: ${a.texto}`);
  return lineas.join("\n");
}
