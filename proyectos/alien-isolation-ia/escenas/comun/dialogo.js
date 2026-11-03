// alien-isolation-ia · caja de diálogo de los shorts (copiada de phonic-1-voz/short.js): páginas que caben en 2 líneas,
// se reinicia con cada frase, palabra clave en caja de selección y retrato que solo parpadea (Mario, 2026-10-30).
// dialogoShort(e, CLAVES, CORTES) → función (t) para alPintar. Necesita tiemposDe (base.js) y retratoGato (gato.js).
function dialogoShort(e, CLAVES, CORTES) {
  const { norm } = tiemposDe(window.TIMING);
  const bloqueDe = (t) => CORTES.filter((c) => t >= c).length;
  const LINEA = 21;
  const lineas = (ps) => ps.reduce((acc, p) => {
    const ultima = acc[acc.length - 1];
    if (ultima && ultima.length + 1 + p.p.length <= LINEA) acc[acc.length - 1] = `${ultima} ${p.p}`; else acc.push(p.p);
    return acc;
  }, []).length;
  const PAGINAS = [];
  window.TIMING.frases.forEach((f) => {
    let actual = [];
    f.palabras.forEach((p, k) => {
      actual.push(p);
      const ultima = k === f.palabras.length - 1, siguiente = f.palabras[k + 1];
      if (ultima || actual.length >= 8 || /[.:?!]$/.test(p.p) || (actual.length >= 4 && /[,;]$/.test(p.p)) || lineas([...actual, siguiente]) > 2) {
        PAGINAS.push({ fr: f.id, palabras: actual, i: actual[0].i, bloque: bloqueDe(actual[0].i), finFrase: ultima });
        actual = [];
      }
    });
  });
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  const dialogo = document.getElementById("dialogo"), fraseEl = document.getElementById("frase");
  return (t) => {
    const pag = PAGINAS.filter((p) => t >= p.i - 0.05).pop();
    if (!pag || e.enTransicion(t) || pag.bloque !== bloqueDe(t)) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    svgRetrato.replaceChildren();
    retratoGato(svgRetrato, 1, 2, { t, hablando: false }, 2);
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = norm(CLAVES[pag.fr] || "");
    fraseEl.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?¿!¡…«»]+$/, ""), punt = p.p.slice(nucleo.length);
      const c = norm(nucleo) === clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p.p;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ") + (pag.finFrase && dichas === pag.palabras.length ? '<span class="cursor"></span>' : "");
  };
}
