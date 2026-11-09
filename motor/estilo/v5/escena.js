// Estilo v5 · piezas comunes de escena (aprobado el 2026-11-09, ADR 0009): entradas a saltos, textos de interfaz y
// anclados al mundo, caja de diálogo por páginas. Script clásico (funciones globales). Necesita v3/gato.js (retratoGato).
// Contrato seek(t): todo sale de t.

// Entrada a saltos de 0,075 s (desplazamiento en px: -2, -1, 0) o null si todavía no ha entrado.
const salto5 = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);
const norm5 = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");

// Textos de la escena. De interfaz: fijos en pantalla (rótulo, cifras del plano general). Anclados al mundo (mundo: true):
// siguen a la cámara sin crecer, se ocultan mientras la cámara viaja (moviendo) y se ajustan para no salirse: a 6 px
// del borde, fuera de la franja derecha tapada del short y a la derecha de la etiqueta anterior de su fila.
// Ojo: la que va antes en el documento empuja a la siguiente; créalas de izquierda a derecha.
//   const T5 = crearTextos5({ caja, W, H, lineaCaja, corto });
//   T5.texto(desde, hasta, clase, html, [x, y], { mundo, estilo });  …  tildesPixel();  …  T5.ver(t, cam, moviendo)
function crearTextos5({ caja, W, H, lineaCaja, corto }) {
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const nodos = [];
  function texto(desde, hasta, clase, html, pos, { mundo = false, estilo = "" } = {}) {
    const d = document.createElement("div");
    d.className = `${clase} oculto`; d.innerHTML = html; d.style.cssText = estilo;
    caja.appendChild(d); nodos.push({ d, desde, hasta, pos, mundo });
    return d;
  }
  function ver(t, cam, moviendo) {
    nodos.forEach(({ d, desde, hasta, pos, mundo }) => {
      const s = salto5(t, desde);
      let visible = s !== null && t < hasta;
      let [x, y] = pos;
      if (visible && mundo) {
        if (moviendo) visible = false;
        x = cam.tx + cam.k * pos[0]; y = cam.ty + cam.k * pos[1];
        if (x < -W / 2 || x > W - 20 || y < 0 || y > lineaCaja - 10) visible = false; // lejos de cuadro: oculta; el resto se ajusta
      }
      d.classList.toggle("oculto", !visible);
      if (visible && mundo) {
        const tapada = corto && y + d.offsetHeight > H * 0.45 && y < H * 0.85; // franja derecha tapada del short
        x = lim(x, 6, (tapada ? 231 : W - 6) - d.offsetWidth);
        const previa = nodos.find((n) => n.d !== d && n.mundo && !n.d.classList.contains("oculto") && Math.abs(parseFloat(n.d.style.top) - Math.round(y)) < 8 && n.d.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING);
        if (previa) x = Math.max(x, parseFloat(previa.d.style.left) + previa.d.offsetWidth + 6);
      }
      if (visible) { d.style.left = `${Math.round(x)}px`; d.style.top = `${Math.round(y) + s}px`; }
    });
  }
  return { texto, ver };
}

// Caja de diálogo de MISTA con retrato: páginas de 2 líneas como máximo (maxc caracteres por línea: 21 en el short,
// 52 en el largo), corte en fin de frase y, en el short, tras una coma con 4 palabras o más; sin palabras huérfanas.
// La palabra clave de cada frase va en caja de selección y las cifras en mono (.cifra).
//   const D5 = crearDialogo5({ T: window.TIMING, ids: ["fr01", …], claves: { fr01: "persona" }, maxc, corto,
//                              dialogo, frase, retrato });   …   D5.pintar(t)
function crearDialogo5({ T, ids, claves = {}, maxc, corto, dialogo, frase, retrato }) {
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  retrato.setAttribute("viewBox", "0 0 34 30");
  const paginas = [];
  const nLineas = (ps) => ps.reduce((acc, p) => { const v = acc[acc.length - 1]; if (v && v.length + 1 + p.p.length <= maxc) acc[acc.length - 1] = `${v} ${p.p}`; else acc.push(p.p); return acc; }, []).length;
  ids.forEach((id) => {
    let actual = [];
    FR[id].palabras.forEach((p, k, todas) => {
      actual.push(p);
      if (k === todas.length - 1 || /[.:?!;]$/.test(p.p) || (corto && actual.length >= 4 && /,$/.test(p.p)) || nLineas([...actual, todas[k + 1]]) > 2) { paginas.push({ fr: id, palabras: actual, i: actual[0].i }); actual = []; }
    });
  });
  for (let k = 1; k < paginas.length; k++) { // sin huérfanas: la página de una sola palabra se lleva las tres anteriores
    const a = paginas[k - 1], b = paginas[k];
    if (b.palabras.length === 1 && a.fr === b.fr && a.palabras.length > 4) { b.palabras = [...a.palabras.splice(-3), ...b.palabras]; b.i = b.palabras[0].i; }
  }
  function pintar(t) {
    const pag = paginas.filter((p) => t >= p.i - 0.05).pop();
    if (!pag) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    retrato.replaceChildren(); retratoGato(retrato, 5, 4.5, { t }, 1.5);
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = claves[pag.fr] ? norm5(claves[pag.fr]) : null;
    frase.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:]+$/, ""), punt = p.p.slice(nucleo.length);
      const cuerpo = /\d/.test(nucleo) ? nucleo.replace(/(\d+)/g, '<span class="cifra">$1</span>') : nucleo;
      const c = norm5(nucleo) === clave ? `<span class="sel">${cuerpo}<i></i></span>${punt}` : cuerpo + punt;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ");
  }
  return { pintar, paginas };
}
