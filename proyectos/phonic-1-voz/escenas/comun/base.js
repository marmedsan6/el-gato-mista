// Base común de phonic-1-voz (largo y short): tiempos por palabra, capas, textos por fotograma, transiciones y MISTA.
// Contrato seek(t): todo se pinta desde t; sin reloj ni animaciones CSS; azar solo con semilla.
function escenaBase({ W, H, bloques, cortes, y0Gato, enClip = () => false, alPintar = null, TRANS = 0.4 }) {
  const T = window.TIMING;
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const PALABRAS = T.frases.flatMap((f) => f.palabras);
  const LIENZOS = { fondo: lienzo("fondo"), medio: lienzo("medio"), brillo: lienzo("brillo"), frente: lienzo("frente") };
  const caja = document.getElementById("textos");
  const e = { capas: {}, frente: LIENZOS.frente, t: 0, dx: 0 };

  const salto = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);
  const hablando = (t) => !enClip(t) && PALABRAS.some((p) => t >= p.i && t <= p.f);
  const indice = (t) => cortes.filter((c) => t >= c).length;

  // Un texto existe solo en el fotograma que lo pide: entra a saltos en `desde` y viaja con su escenario
  e.tx = (clase, html, x, y, desde = 0, estilo = "") => {
    const s = salto(e.t, desde);
    if (s === null) return false;
    const d = document.createElement("div");
    d.className = clase; d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y + s}px; ${estilo}; ${e.dx ? `transform:translateX(${e.dx}px);` : ""}`;
    caja.appendChild(d);
    return true;
  };
  e.fuente = (txt, x, y, desde = 0) => e.tx("fuente-dato con-fondo", txt, x, y, desde);
  e.x2 = (x, y, fn) => escalado(e.frente, x, y, 2, fn);
  e.panel = (x, y, w, h, color = "#151b30") => {
    rect(e.frente, x + 2, y + 2, w, h, "#07090d"); rect(e.frente, x, y, w, h, PROP.contorno); rect(e.frente, x + 1, y + 1, w - 2, h - 2, color);
  };
  e.papel = (x, y, w, h, desde = 0) => {
    const s = salto(e.t, desde);
    if (s === null) return false;
    rect(e.frente, x + 2, y + 2 + s, w, h, "#0a0806"); rect(e.frente, x, y + s, w, h, PROP.contorno); rect(e.frente, x + 1, y + 1 + s, w - 2, h - 2, PROP.papel);
    return true;
  };
  e.barra = (x, y, w, h, frac, color, fondo = "#0c1016") => {
    rect(e.frente, x, y, w, h, PROP.contorno); rect(e.frente, x + 1, y + 1, w - 2, h - 2, fondo);
    if (frac > 0) rect(e.frente, x + 1, y + 1, Math.max(1, Math.round((w - 2) * Math.min(1, frac))), h - 2, color);
  };
  e.prog = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
  e.paso = (v, p) => Math.floor(v / p + 1e-9) * p;

  const dibujar = (k, t, dx, conGato) => {
    e.dx = dx;
    for (const n of ["fondo", "medio", "brillo"]) e.capas[n] = dx ? capaDesplazada(LIENZOS[n], dx) : LIENZOS[n];
    e.frente = dx ? capaDesplazada(LIENZOS.frente, dx) : LIENZOS.frente;
    const b = bloques[k];
    b.pintar(t);
    if (conGato && b.gato) {
      const sal = k > 0 ? salto(t, cortes[k - 1] + TRANS / 2) || 0 : 0; // reaparece con un saltito tras el desplazamiento
      const g = b.gato(t);
      gato(e.frente, g.x, (g.y ?? y0Gato) + sal, { pose: g.pose, t, hablando: hablando(t), espejo: g.espejo }, 2);
    }
    e.dx = 0;
  };

  e.enTransicion = (t) => cortes.some((c) => Math.abs(t - c) < TRANS / 2);
  e.indice = indice;
  window.seek = (t) => {
    e.t = t;
    Object.values(LIENZOS).forEach((s) => s.replaceChildren());
    caja.replaceChildren();
    const c = cortes.findIndex((v) => Math.abs(t - v) < TRANS / 2);
    if (c >= 0) {
      // El que sale se va a la izquierda con MISTA; el nuevo entra por la derecha y MISTA aparece al terminar
      const p = (t - (cortes[c] - TRANS / 2)) / TRANS, suave = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p), dx = Math.round(suave * W);
      dibujar(c, t, -dx, true);
      dibujar(c + 1, t, W - dx, false);
    } else dibujar(indice(t), t, 0, true);
    tildesPixel();
    if (alPintar) alPintar(t);
  };
  // Pixel art a 30 imágenes por segundo en un vídeo de 60; los desplazamientos entre bloques van a 60
  window.claveFotograma = (t) => (e.enTransicion(t) ? `d${Math.round(t * 60)}` : `n${Math.floor(t * 30 + 1e-6)}`);
  return e;
}

// Utilidades de tiempos sobre window.TIMING
function tiemposDe(T) {
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  const P = (fr, trozo, n = 1) => {
    if (!FR[fr]) throw new Error(`No existe ${fr}`);
    const ps = FR[fr].palabras.filter((p) => norm(p.p).includes(norm(trozo)));
    if (!ps[n - 1]) throw new Error(`No encuentro «${trozo}» en ${fr}: ${FR[fr].texto}`);
    return ps[n - 1].i;
  };
  const INI = (fr) => { if (!FR[fr]) throw new Error(`No existe ${fr}`); return FR[fr].inicio; };
  const FIN = (fr) => { if (!FR[fr]) throw new Error(`No existe ${fr}`); return FR[fr].fin; };
  const medio = (a, b) => (FIN(a) + INI(b)) / 2;
  return { FR, norm, P, INI, FIN, medio };
}

// Dibujo compartido por los dos formatos

// Hoja de calendario con el día en grande
function calendarioDia(e, x, y, w, h, dia, desde, { apagado = false } = {}) {
  const s = e.t >= desde ? 0 : null;
  if (s === null) return;
  rect(e.frente, x + 2, y + 2, w, h, "#0a0806"); rect(e.frente, x, y, w, h, PROP.contorno);
  rect(e.frente, x + 1, y + 1, w - 2, 14, apagado ? PROP.gris : PROP.rojo);
  rect(e.frente, x + 1, y + 15, w - 2, h - 16, PROP.papel);
  rect(e.frente, x + 8, y - 3, 3, 6, PROP.contorno); rect(e.frente, x + w - 11, y - 3, 3, 6, PROP.contorno);
  e.tx("titular", dia, x + Math.floor((w - dia.length * 16) / 2), y + Math.floor(h / 2) - 2, desde, `color:${apagado ? "#8a7a68" : "#2b1a10"}; text-shadow:none;`);
}

// Pantalla del registro con filas que corren por detrás (el dibujo es propio, no una captura)
function pantallaRegistro(e, x, y, w, h, t, filas = 7, margen = 4) {
  propMonitor(e.frente, x, y, w, h, { dibujo: (s, xx, yy, ww) => {
    if (!filas) return;
    const azar = mulberry32(44);
    rect(s, xx + 4, yy + margen + (Math.floor(t * 4) % filas) * 8 - 1, ww - 8, 5, "#1a2b3c");
    for (let k = 0; k < filas; k++) {
      const yf = yy + margen + k * 8, ancho = 24 + Math.floor(azar() * (ww - 70));
      rect(s, xx + 4, yf, 3, 3, "#1fd69a"); rect(s, xx + 10, yf, ancho, 2, "#26344a");
    }
  } });
}
