// Lectores de la salida de FFmpeg para el QA (motor/qa.mjs) y la mezcla (motor/mezcla.mjs). Funciones puras, con tests.

const num = (s) => (s === undefined ? null : Number(s));

// ebur128=peak=true → { lufs, lra, pico } leídos del bloque «Summary» final (null si no aparece).
export function leerEbur128(stderr) {
  const i = stderr.lastIndexOf("Summary:");
  if (i < 0) return { lufs: null, lra: null, pico: null };
  const s = stderr.slice(i);
  return {
    lufs: num((s.match(/\bI:\s+(-?[\d.]+)\s+LUFS/) || [])[1]),
    lra: num((s.match(/\bLRA:\s+(-?[\d.]+)\s+LU\b/) || [])[1]),
    pico: num((s.match(/\bPeak:\s+(-?[\d.]+)\s+dBFS/) || [])[1]),
  };
}

// silencedetect → [{ inicio, fin, duracion }]. Un silencio que llega al final del fichero no trae silence_end: fin = null.
export function leerSilencios(stderr) {
  const tramos = [];
  for (const linea of stderr.split(/\r?\n/)) {
    const a = linea.match(/silence_start:\s*(-?[\d.]+)/);
    if (a) { tramos.push({ inicio: Math.max(0, Number(a[1])), fin: null, duracion: null }); continue; }
    const b = linea.match(/silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)/);
    if (b && tramos.length) { const t = tramos[tramos.length - 1]; t.fin = Number(b[1]); t.duracion = Number(b[2]); }
  }
  return tramos;
}

// freezedetect → [{ inicio, duracion }] (un congelado que llega al final no trae duración: null).
export function leerCongelados(stderr) {
  const tramos = [];
  for (const linea of stderr.split(/\r?\n/)) {
    const a = linea.match(/freeze_start:\s*([\d.]+)/);
    if (a) { tramos.push({ inicio: Number(a[1]), duracion: null }); continue; }
    const b = linea.match(/freeze_duration:\s*([\d.]+)/);
    if (b && tramos.length) tramos[tramos.length - 1].duracion = Number(b[1]);
  }
  return tramos;
}

// blackdetect → [{ inicio, fin, duracion }]
export function leerNegros(stderr) {
  return [...stderr.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)]
    .map((m) => ({ inicio: Number(m[1]), fin: Number(m[2]), duracion: Number(m[3]) }));
}

// Veredicto frente a docs/criterios.md §4. formato: "short…" o "largo". Devuelve filas { nombre, medida, umbral, ok }.
export function veredicto({ formato, ancho, alto, fps, duracion, lufs, pico, silencios, congelados, negros }) {
  const corto = formato.startsWith("short");
  const filas = [];
  const fila = (nombre, medida, umbral, ok) => filas.push({ nombre, medida, umbral, ok });
  const [w, h] = corto ? [1080, 1920] : [1920, 1080];
  fila("Resolución y fps", `${ancho}×${alto}, ${fps}`, `${w}×${h}, 60 fps`, ancho === w && alto === h && Math.abs(fps - 60) < 0.01);
  fila("Duración", `${duracion.toFixed(2)} s`, corto ? "short ≤ 120 s" : "largo 8-10 min", corto ? duracion <= 120 : duracion >= 480 && duracion <= 600);
  fila("Sonoridad integrada", `${lufs} LUFS`, "-14 ± 1 LUFS", lufs !== null && Math.abs(lufs + 14) <= 1);
  fila("Pico real", `${pico} dBTP`, "< -2 dBTP", pico !== null && pico < -2);
  const dura = (x) => (x.duracion === null ? duracion - x.inicio : x.duracion); // un tramo abierto llega hasta el final
  const largos = silencios.filter((s) => dura(s) >= 0.4);
  fila("Silencios ≥ 0,4 s (-35 dB)", String(largos.length), corto ? "short sin pausas" : "informativo en el largo", corto ? largos.length === 0 : true);
  const quietos = congelados.filter((c) => dura(c) >= 2);
  fila("Congelados ≥ 2 s", String(quietos.length), "0", quietos.length === 0);
  fila("Tramos casi quietos ≥ 1 s", String(congelados.length), "informativo (algo nuevo cada 1-2 s)", true);
  fila("Negros", String(negros.length), "0", negros.length === 0);
  return filas;
}
