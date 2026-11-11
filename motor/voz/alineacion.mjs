// Revisión de la alineación (lógica pura, con tests): compara los límites de frase de un timing.<formato>.json con los
// silencios reales de la voz y los ajusta. Nace del short de NVIDIA (2026-11-10): Whisper dio «China.» 0,06 s y «Y»
// 0,86 s, y la cámara cortó mientras la voz aún decía «China».
//
// timing:    { frases: [{ id, inicio, fin, palabras: [{ p, i, f }] }] }
// silencios: [{ inicio, fin }] de silencedetect sobre la voz (p. ej. noise=-40dB:d=0.15)
// → { avisos: [{ tipo, donde, detalle }], fronteras: [{ entre, fin: [antes, despues], inicio: [antes, despues] }], timing }
// El timing devuelto es una copia con los límites ajustados; el original no se toca.
export const POR_DEFECTO = { tolerancia: 0.12, margen: 0.2, cortaPorLetra: 0.025, largaBase: 0.25, largaPorLetra: 0.14 };

const letras = (p) => p.replace(/[^\p{L}\p{N}]/gu, "").length;
const r3 = (x) => Math.round(x * 1000) / 1000;

export function revisarAlineacion(timing, silencios, opciones = {}) {
  const op = { ...POR_DEFECTO, ...opciones };
  const copia = JSON.parse(JSON.stringify(timing));
  const avisos = [], fronteras = [];

  // palabras con duración imposible: delatan un límite mal puesto aunque el porcentaje de la alineación sea alto
  for (const f of copia.frases) for (const w of f.palabras) {
    const n = letras(w.p), d = w.f - w.i;
    if (n >= 3 && d < op.cortaPorLetra * n + 0.02) avisos.push({ tipo: "palabra-corta", donde: `${f.id} «${w.p}»`, detalle: `${d.toFixed(2)} s para ${n} letras (t = ${w.i.toFixed(2)})` });
    if (d > op.largaBase + op.largaPorLetra * n) avisos.push({ tipo: "palabra-larga", donde: `${f.id} «${w.p}»`, detalle: `${d.toFixed(2)} s para ${n} letras (t = ${w.i.toFixed(2)})` });
  }

  // cada límite entre dos frases se lleva al silencio más largo que haya entre la última palabra de una y la primera de la otra
  for (let k = 0; k + 1 < copia.frases.length; k++) {
    const A = copia.frases[k], B = copia.frases[k + 1];
    const ultima = A.palabras[A.palabras.length - 1], primera = B.palabras[0];
    const desde = ultima.i - op.margen, hasta = primera.f + op.margen;
    const candidatos = silencios.filter((s) => s.fin !== null && s.fin > desde && s.inicio < hasta);
    const entre = `${A.id}→${B.id}`;
    if (!candidatos.length) { avisos.push({ tipo: "sin-silencio", donde: entre, detalle: `ningún silencio entre ${desde.toFixed(2)} y ${hasta.toFixed(2)} s: no se ajusta` }); continue; }
    const s = candidatos.reduce((m, x) => (x.fin - x.inicio > m.fin - m.inicio ? x : m));
    const dFin = Math.abs(A.fin - s.inicio), dIni = Math.abs(B.inicio - s.fin);
    if (dFin > op.tolerancia || dIni > op.tolerancia) {
      avisos.push({ tipo: "desfase", donde: entre, detalle: `la frase acaba en ${A.fin.toFixed(2)} y la siguiente empieza en ${B.inicio.toFixed(2)}; el silencio real va de ${s.inicio.toFixed(2)} a ${s.fin.toFixed(2)}` });
    }
    fronteras.push({ entre, fin: [A.fin, r3(s.inicio)], inicio: [B.inicio, r3(s.fin)] });
    const previa = A.palabras.length > 1 ? A.palabras[A.palabras.length - 2].f : A.inicio;
    A.fin = r3(s.inicio); ultima.f = r3(s.inicio);
    if (ultima.i > ultima.f - 0.06) ultima.i = r3(Math.max(previa, ultima.f - 0.06));
    const siguiente = B.palabras.length > 1 ? B.palabras[1].i : B.fin;
    B.inicio = r3(s.fin); primera.i = r3(s.fin);
    if (primera.f < primera.i + 0.06) primera.f = r3(Math.min(siguiente, primera.i + 0.06));
  }
  return { avisos, fronteras, timing: copia };
}
