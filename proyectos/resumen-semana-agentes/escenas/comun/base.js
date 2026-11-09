// resumen-semana-agentes · base común de las escenas en estilo v3 (copiada de ventanas-contexto-ia/escenas/comun/base.js, sin cambios de lógica).
// mithril-ia-medicina/escenas/short-v6 (5 lienzos a 12 px, cámara, MISTA v3, desplazamiento lateral, caja con retrato)
// con la forma de alien-isolation-ia/escenas/comun/base.js (cada bloque pinta sus textos en el fotograma que los pide).
// Contrato seek(t): todo se pinta desde t; sin reloj ni animaciones CSS; azar solo con semilla.
//
// const e = escenaV3({ W, H, bloques, cortes, planos, SX, SY, lineaCaja, claves, rotulo: [x, y], linea });
//   bloques: [{ pintar(t), gato(t) → { x, y, pose, espejo } | null }] en unidades v3 (1 unidad = 3 px CSS)
//   cortes: instantes de los desplazamientos laterales entre bloques (uno menos que bloques)
//   planos: planos de cámara (motor/estilo/camara.js); claves: { frN: "palabra clave" } para la caja de diálogo
function escenaV3({ W, H, bloques, cortes, planos, SX, SY, lineaCaja, claves = {}, rotulo = [16, 16], linea = 21, TRANS = 0.4, cifrasMono = false }) {
  const T = window.TIMING;
  const PALABRAS = T.frases.flatMap((f) => f.palabras);
  const LIENZOS = {};
  for (const id of ["lejos", "medio", "brillo", "frente", "delante"]) { LIENZOS[id] = lienzo(id); LIENZOS[id].setAttribute("viewBox", `0 0 ${W / 3} ${H / 3}`); }
  const caja = document.getElementById("textos"), ui = document.getElementById("textos-ui");
  const mundo = document.getElementById("mundo");
  const CAM = crearCamara({ W, H, SX, SY, lineaCaja, planos });
  const e = { capas: {}, frente: LIENZOS.frente, t: 0, dx: 0, cam: { k: 1, tx: 0, ty: 0, general: true }, W, H, UW: W / 3, UH: H / 3 };

  const salto = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);
  e.s1 = (t, a) => (salto(t, a) === -2 ? -1 : salto(t, a) === null ? null : 0); // salto de entrada en unidades de 12 px
  e.prog = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
  e.paso = (v, p) => Math.floor(v / p + 1e-9) * p;
  const hablando = (t) => PALABRAS.some((p) => t >= p.i && t <= p.f);
  const indice = (t) => cortes.filter((c) => t >= c).length;
  e.indice = indice;
  e.enTransicion = (t) => cortes.some((c) => Math.abs(t - c) < TRANS / 2);
  e.llega = (k) => (k > 0 ? cortes[k - 1] + TRANS / 2 : 0); // fin del desplazamiento que abre el bloque k

  // Textos del mundo (se mueven con la cámara y con su escenario) e interfaz fija (rótulo de cabecera)
  function texto(padre, clase, html, x, y, desde, estilo) {
    const s = salto(e.t, desde);
    if (s === null) return false;
    const d = document.createElement("div");
    // En Press Start, a 360 px el 8 se lee S y el 5, S: con cifrasMono las cifras de los textos pequeños van en JetBrains Mono
    const mono = cifrasMono && /etiqueta|insignia|tarjeta-texto|fuente-dato/.test(clase);
    d.className = clase; d.innerHTML = mono ? html.replace(/(^|>)([^<]+)/g, (m, a, b) => a + b.replace(/(\d[\d.,]*\d|\d)/g, '<span class="cifra">$1</span>')) : html;
    d.dataset.x = x;
    d.style.cssText = `left:${x}px; top:${y + s}px; ${estilo || ""}; ${e.dx ? `transform:translateX(${e.dx}px);` : ""}`;
    padre.appendChild(d);
    return true;
  }
  e.tx = (clase, html, x, y, desde = 0, estilo = "") => texto(caja, clase, html, x, y, desde, estilo);
  e.rot = (html, desde = 0) => texto(ui, "rotulo", html, rotulo[0], rotulo[1], desde, "");
  e.fuente = (txt, x, y, desde = 0) => e.tx("fuente-dato con-fondo", txt, x, y, desde);
  // Marco de selección solo si su objeto se ve entero con la cámara de este fotograma (unidades v3)
  e.marcar = (x, y, w, h, color) => { if (CAM.marcoVisible(e.cam, x * 3, y * 3, w * 3, h * 3)) marcoSeleccion(e.frente, x, y, w, h, color); };

  // Último momento en que la cámara volvió de un plano de detalle al general: ahí MISTA reaparece con un saltito
  function vueltaDelDetalle(t) {
    let v = 0;
    planos.forEach((p, i) => { if (i > 0 && p[0] <= t && p[2] < 1.25 && planos[i - 1][2] >= 1.25) v = p[0]; });
    return v;
  }
  function dibujar(k, t, dx, conGato) {
    e.dx = dx;
    for (const n of ["lejos", "medio", "brillo", "delante"]) e.capas[n] = dx ? capaDesplazada(LIENZOS[n], dx / 3) : LIENZOS[n];
    e.frente = dx ? capaDesplazada(LIENZOS.frente, dx / 3) : LIENZOS.frente;
    const b = bloques[k];
    b.pintar(t);
    if (conGato && b.gato && e.cam.general) {
      const g = b.gato(t);
      if (g) {
        const llegada = Math.max(e.llega(k), vueltaDelDetalle(t));
        const sal = llegada > 0 ? e.s1(t, llegada) || 0 : 0;
        gato(e.frente, g.x, g.y + sal, { pose: g.pose, t, hablando: hablando(t), espejo: g.espejo }, 1);
        if (g.encima) g.encima(e.frente, g.x, g.y + sal);
      }
    }
    e.dx = 0;
  }

  // ---------- caja de diálogo con retrato: páginas de ≤ 8 palabras en 2 líneas; se reinicia con cada frase ----------
  const { norm } = tiemposDe(T);
  const lineas = (ps) => ps.reduce((acc, p) => {
    const ultima = acc[acc.length - 1];
    if (ultima && ultima.length + 1 + p.p.length <= linea) acc[acc.length - 1] = `${ultima} ${p.p}`; else acc.push(p.p);
    return acc;
  }, []).length;
  const PAGINAS = [];
  T.frases.forEach((f) => {
    let actual = [];
    f.palabras.forEach((p, k) => {
      actual.push(p);
      const ultima = k === f.palabras.length - 1, siguiente = f.palabras[k + 1];
      if (ultima || actual.length >= (linea > 30 ? 14 : 8) || /[.:?!]$/.test(p.p) || (actual.length >= 4 && /[,;]$/.test(p.p)) || lineas([...actual, siguiente]) > 2) {
        PAGINAS.push({ fr: f.id, palabras: actual, i: actual[0].i, bloque: indice(actual[0].i), finFrase: ultima });
        actual = [];
      }
    });
  });
  const retrato = document.getElementById("retrato"), dialogo = document.getElementById("dialogo"), fraseEl = document.getElementById("frase");
  retrato.setAttribute("viewBox", "0 0 34 30");
  function pintarDialogo(t) {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag || e.enTransicion(t) || pag.bloque !== indice(t)) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    retrato.replaceChildren();
    retratoGato(retrato, 5, 4.5, { t, hablando: false }, 1.5); // el retrato no habla: solo parpadea (Mario, 2026-10-30)
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = norm(claves[pag.fr] || "");
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡…«»]+$/, ""), punt = p.p.slice(nucleo.length);
      const cifras = (x) => x.replace(/(\d[\d.,]*\d|\d)/g, '<span class="cifra">$1</span>'); // cifras en mono (docs/estilo.md)
      const c = clave && norm(nucleo) === clave ? `<span class="sel">${cifras(nucleo)}<i></i></span>${punt}` : cifras(p.p);
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ") + (pag.finFrase && dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  }

  window.seek = (t) => {
    e.t = t;
    Object.values(LIENZOS).forEach((s) => s.replaceChildren());
    caja.replaceChildren(); ui.replaceChildren();
    e.cam = CAM.en(t);
    CAM.aplicar(e.cam, mundo);
    const c = cortes.findIndex((v) => Math.abs(t - v) < TRANS / 2);
    if (c >= 0) { // el bloque que sale se va a la izquierda con MISTA; el nuevo entra por la derecha (nunca dos gatos)
      const p = (t - (cortes[c] - TRANS / 2)) / TRANS, suave = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p), dx = Math.round(suave * W);
      dibujar(c, t, -dx, true);
      dibujar(c + 1, t, W - dx, false);
    } else dibujar(indice(t), t, 0, true);
    tildesPixel();
    CAM.fuentesSinZoom(e.cam, caja, 16, W - 16);
    pintarDialogo(t);
  };
  // Pixel art a 30 imágenes por segundo en un vídeo de 60; desplazamientos y zooms van a 60
  window.claveFotograma = (t) => (e.enTransicion(t) ? `d${Math.round(t * 60)}` : `n${Math.floor(t * 30 + 1e-6)}`);
  return e;
}

// Utilidades de tiempos sobre window.TIMING (P = inicio de la n-ésima palabra de la frase que contiene `trozo`)
function tiemposDe(T) {
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
  const P = (fr, trozo, n = 1) => {
    if (!FR[fr]) throw new Error(`No existe ${fr}`);
    const ps = FR[fr].palabras.filter((p) => norm(p.p).includes(norm(trozo)));
    if (!ps[n - 1]) throw new Error(`No encuentro «${trozo}» en ${fr}: ${FR[fr].texto}`);
    return ps[n - 1].i;
  };
  const PF = (fr, trozo, n = 1) => { const ps = FR[fr].palabras.filter((p) => norm(p.p).includes(norm(trozo))); if (!ps[n - 1]) throw new Error(`No encuentro «${trozo}» en ${fr}`); return ps[n - 1].f; };
  const INI = (fr) => { if (!FR[fr]) throw new Error(`No existe ${fr}`); return FR[fr].inicio; };
  const FIN = (fr) => { if (!FR[fr]) throw new Error(`No existe ${fr}`); return FR[fr].fin; };
  const medio = (a, b) => (FIN(a) + INI(b)) / 2;
  return { FR, norm, P, PF, INI, FIN, medio };
}
