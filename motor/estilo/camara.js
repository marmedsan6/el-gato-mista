// Estilo vigente · cámara pixel (Mario, 2026-11-03): plano general (k=1) y planos de detalle SOLO en las explicaciones
// core del vídeo. Se entra con zoom a escalones (×0,25 cada 0,075 s) y se sale con corte seco. k siempre es múltiplo
// de 0,25: a ×4 de salida cada píxel base mide 5, 6, 7 u 8 px enteros, así que el pixel art sigue nítido.
// Determinista: todo depende de t. Ejemplo completo: proyectos/mithril-ia-medicina/escenas/short-v6/.
//
// Montaje en el HTML: el escenario, los objetos, MISTA y los textos de los objetos van dentro de un contenedor
// #mundo (position:absolute; transform-origin:0 0); los rótulos de cabecera y la caja de diálogo, fuera (interfaz fija),
// y debajo de todo un #base con el color de fondo (se ve donde la cámara recorta el mundo).
//
// const CAM = crearCamara({ W, H, SX, SY, lineaCaja, planos });
//   planos: [[inicio, "zoom" | "corte", k, cx, cy], …]; el primero, [0, "corte", 1]. (cx, cy) es el punto del mundo que
//   queda en (SX, SY) de pantalla: elige SX, SY por encima de la caja de diálogo y fuera de las zonas tapadas.
//   [inicio, "mover", k, cx, cy, duración]: desplazamiento (travelling) o acercamiento lento continuo, con aceleración y
//   frenada suaves; aquí k no se cuantiza (algunos píxeles miden 1 px más durante el movimiento, como en la referencia).
//   anchoMundo / altoMundo: tamaño del mundo si es mayor que la pantalla (una pared de cuadros); por defecto, W y H.
//   CAM.en(t)                          → { k, tx, ty, inicio, general }
//   CAM.aplicar(c, mundo)              → transform del contenedor y recorte en la línea de la caja (solo si k ≥ 1,25)
//   CAM.aplicarCapas(c, [{ el, d }])   → lo mismo con paralaje: un contenedor por capa, cada uno con su profundidad d
//   CAM.marcoVisible(c, x, y, w, h)    → true si el rectángulo se ve entero: no se señala lo que la cámara tapa
//   CAM.fuentesSinZoom(c, caja, xMin, xMax) → las .fuente-dato no crecen con el zoom y quedan entre xMin y xMax
function crearCamara({ W, H, SX, SY, lineaCaja, planos, escalon = 0.075, anchoMundo = W, altoMundo = H }) {
  const q = (v) => Math.round(v * 4) / 4; // múltiplos de 0,25 px CSS = píxeles enteros a ×4
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const encuadre = (k, cx, cy) => (k === 1 && cx === undefined ? { k, tx: 0, ty: 0 }
    : { k, tx: q(lim(SX - k * cx, W - k * anchoMundo, 0)), ty: q(lim(SY - k * cy, H - k * altoMundo, 0)) });
  const finales = planos.map(([, , k, cx, cy]) => encuadre(k, cx, cy));

  function en(t) {
    const i = planos.reduce((a, p, j) => (t >= p[0] ? j : a), 0);
    const [inicio, tipo] = planos[i], fin = finales[i], prev = i > 0 ? finales[i - 1] : finales[0];
    const plano = { ...fin, inicio, general: fin.k === 1 };
    if (tipo === "mover") {
      const p = lim((t - inicio) / planos[i][5], 0, 1), f = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p);
      return { k: prev.k + (fin.k - prev.k) * f, tx: q(prev.tx + (fin.tx - prev.tx) * f), ty: q(prev.ty + (fin.ty - prev.ty) * f),
        inicio, general: fin.k < 1.25 }; // un acercamiento lento sigue siendo plano general (MISTA se ve)
    }
    if (tipo !== "zoom" || fin.k === prev.k) return plano;
    const pasos = Math.round(Math.abs(fin.k - prev.k) / 0.25), n = Math.min(pasos, Math.floor((t - inicio) / escalon + 1e-9) + 1);
    const f = n / pasos;
    return { k: prev.k + (fin.k - prev.k) * f, tx: q(prev.tx + (fin.tx - prev.tx) * f), ty: q(prev.ty + (fin.ty - prev.ty) * f),
      inicio, general: false };
  }

  function aplicar(c, mundo) {
    mundo.style.transform = c.k === 1 && !c.tx && !c.ty ? "" : `translate(${c.tx}px, ${c.ty}px) scale(${c.k})`;
    // recorte solo en los planos de detalle (k ≥ 1,25), no durante un acercamiento lento
    mundo.style.clipPath = c.k < 1.25 ? "" : `inset(0 0 ${q(altoMundo - (lineaCaja - c.ty) / c.k)}px 0)`;
  }

  // Paralaje (iteración de detalle, 2026-11-06; ref-01: el fondo va a ~0,5-0,65 de la velocidad del plano medio y el
  // primer plano, más rápido). Cada capa va en su propio contenedor con su profundidad d (1 = plano medio). El punto del
  // mundo que la cámara pone en (SX, SY) se desplaza en cada capa d veces lo que en el plano medio, y el zoom crece
  // 1 + d·(k − 1). En reposo (k = 1, sin desplazar) todas las capas coinciden. capas: [{ el, d }, …]
  function aplicarCapas(c, capas) {
    const cx = (SX - c.tx) / c.k, cy = (SY - c.ty) / c.k; // punto del mundo en (SX, SY) en el plano medio
    for (const { el, d } of capas) {
      const kd = 1 + d * (c.k - 1), cxd = SX + d * (cx - SX), cyd = SY + d * (cy - SY);
      const txd = q(SX - kd * cxd), tyd = q(SY - kd * cyd);
      el.style.transformOrigin = "0 0";
      el.style.transform = kd === 1 && !txd && !tyd ? "" : `translate(${txd}px, ${tyd}px) scale(${kd})`;
      el.style.clipPath = c.k < 1.25 ? "" : `inset(0 0 ${q(altoMundo - (lineaCaja - tyd) / kd)}px 0)`;
    }
  }

  function marcoVisible({ k, tx, ty }, x, y, w, h) {
    const dentro = (v, a, b) => v >= a && v <= b;
    return k === 1 || (dentro(tx + k * x, 0, W) && dentro(tx + k * (x + w), 0, W) && dentro(ty + k * (y + h), 0, lineaCaja));
  }

  // Las etiquetas leen su x original de data-x (la escena la guarda al crearlas)
  function fuentesSinZoom({ k, tx }, caja, xMin, xMax) {
    caja.querySelectorAll(".fuente-dato:not(.oculto)").forEach((d) => {
      if (k === 1) { d.style.left = `${d.dataset.x}px`; return; }
      const w = d.offsetWidth, natural = tx + k * Number(d.dataset.x);
      // la de un objeto que está fuera de cuadro se queda donde está (no se mete en pantalla)
      const xs = natural + w < 0 || natural > W ? natural : lim(natural, xMin, xMax - w);
      d.style.left = `${q((xs - tx) / k)}px`;
      d.style.transformOrigin = "0 0";
      d.style.transform = `scale(${1 / k})`;
    });
  }

  return { en, aplicar, aplicarCapas, marcoVisible, fuentesSinZoom };
}
