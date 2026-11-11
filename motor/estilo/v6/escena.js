// Estilo v6 · piezas comunes de escena (ADR 0010, 2026-11-10). Script clásico (funciones globales).
// Necesita: ../pixel.js, ../camara.js, ../v3/gato.js y ../v5/dibujo.js (primitivas de dibujo, sin cambios).
// Qué cambia frente a la v5:
//   - casi sin texto: rótulo solo en los temas, 1 identificador por estación pegado a su objeto y nada que repita la voz;
//   - la fuente del dato va en una pestaña de la caja de diálogo, sola, desde las marcas [fN] del guion;
//   - los textos del mundo viven dentro del plano medio (se mueven con la cámara como un objeto: no saltan ni se salen);
//   - la cámara sale tras el fin real de la frase, el rótulo cambia al llegar y el zoom core es un acercamiento de 0,4 s;
//   - la escena declara window.revision y claveFotograma para el lint (motor/revisar.mjs) y el render.
// Contrato seek(t): todo sale de t.

const salto6 = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0); // entrada a saltos (px) o null
const norm6 = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
const lim6 = (v, a, b) => Math.max(a, Math.min(b, v));
const prog6 = (t, a, b) => lim6((t - a) / (b - a), 0, 1);
const pasos6 = (t, a, b, n) => Math.floor(prog6(t, a, b) * n) / n; // progreso a escalones
const tildes6 = () => tildesPixel(".titular, .rotulo, .identificador, .sello6, .fuente6, .nombre, .insignia");

// ---------- tiempos de la voz ----------
//   const TT = tiempos6(window.TIMING);  TT.P("fr03", "alice") → inicio de la palabra · TT.fin("fr03") → fin real de la frase
function tiempos6(T) {
  const FR = Object.fromEntries(T.frases.map((f) => [f.id, f]));
  const PAL = T.frases.flatMap((f) => f.palabras);
  const frase = (id) => { if (!FR[id]) throw new Error(`No existe la frase «${id}» en el timing`); return FR[id]; };
  const P = (id, trozo) => {
    const p = frase(id).palabras.find((w) => norm6(w.p).includes(norm6(trozo)));
    if (!p) throw new Error(`No encuentro «${trozo}» en ${id}: ${frase(id).palabras.map((w) => w.p).join(" ")}`);
    return p.i;
  };
  return { FR, P, ini: (id) => frase(id).inicio, fin: (id) => frase(id).fin, hablando: (t) => PAL.some((p) => t >= p.i && t <= p.f),
    DURACION: T.audio.duracion_s + 0.6 };
}

// ---------- lienzos del mundo ancho (N pantallas) con paralaje ----------
// HTML: #p-lejos > svg#lejos · #p-medio > svg#medio, svg#brillo.bloom, svg#frente, div#textos-mundo · #p-delante > svg#delante · svg#gato12
function lienzos6({ W, H, N }) {
  const MW = N * W;
  const ANCHO = { lejos: Math.round(MW * 0.6) + W, medio: MW, brillo: MW, frente: MW, delante: Math.round(MW * 1.35) + W };
  const L = {};
  for (const id of Object.keys(ANCHO)) {
    const s = document.getElementById(id);
    s.setAttribute("viewBox", `0 0 ${ANCHO[id]} ${H}`); s.setAttribute("width", ANCHO[id]); s.setAttribute("height", H);
    s.style.width = `${ANCHO[id]}px`; s.style.height = `${H}px`;
    L[id] = s;
  }
  [["p-lejos", "lejos"], ["p-medio", "medio"], ["p-delante", "delante"]].forEach(([id, c]) => { const d = document.getElementById(id); d.style.width = `${ANCHO[c]}px`; d.style.height = `${H}px`; });
  const G12 = document.getElementById("gato12"); // MISTA a su píxel de 12 px
  G12.setAttribute("viewBox", `0 0 ${W / 3} ${H / 3}`); G12.setAttribute("width", W); G12.setAttribute("height", H);
  const CAPAS = [{ el: document.getElementById("p-lejos"), d: 0.6 }, { el: document.getElementById("p-medio"), d: 1 }, { el: document.getElementById("p-delante"), d: 1.35 }];
  return { L, ANCHO, MW, G12, CAPAS, X: (n) => n * W, limpiar: () => { Object.values(L).forEach((s) => s.replaceChildren()); G12.replaceChildren(); } };
}

// ---------- recorrido de la cámara con las reglas v6 ----------
//   const R = ruta6({ W, M, fin: TT.fin, entrada: T_ENTRADA,
//     saltos: [["fr01", "viaje"], ["fr05", "tema"], …],          // salto k: de la estación k a la k+1 tras el fin real de esa frase
//     zooms: [{ est: 3, desde: T_INVEST, frase: "fr04", cx: 118, cy: 220 }] });   // cx relativo a su estación
// Reglas: la cámara sale `margen` s después del fin real de la frase; el zoom core entra con un acercamiento de `zoom` s
// y sale con corte `aire` s antes de viajar. R.planos va a crearCamara; R.movimientos, R.salidas y R.llegadas, a window.revision.
function ruta6({ W, M, fin, entrada = 0, saltos, zooms = [], VIAJE = 1.1, SLIDE = 0.4, ZOOM = 0.4, margen = 0.15, aire = 0.5, k = 1.25 }) {
  const centro = (n) => n * W + M.SX;
  const planos = [[0, "corte", 1, M.SX, M.SY]];
  const movimientos = entrada > 0 ? [[entrada, entrada + SLIDE]] : [];
  const salidas = [], llegadas = [entrada > 0 ? entrada + SLIDE : 0];
  saltos.forEach(([frase, tipo, extra = 0], n) => {
    const dur = tipo === "tema" ? SLIDE : VIAJE, sale = fin(frase) + margen + extra;
    zooms.filter((z) => z.est === n).forEach((z) => {
      planos.push([z.desde, "mover", k, n * W + z.cx, z.cy, ZOOM]);
      movimientos.push([z.desde, z.desde + ZOOM]);
      planos.push([sale - aire, "corte", 1, centro(n), M.SY]);
      movimientos.push([sale - aire, sale - aire + 0.02]); // el corte de salida también es un cambio de cámara
    });
    planos.push([sale, "mover", 1, centro(n + 1), M.SY, dur]);
    movimientos.push([sale, sale + dur]);
    salidas.push(sale); llegadas.push(sale + dur);
  });
  zooms.filter((z) => z.est === saltos.length).forEach((z) => { // zoom en la última estación: se queda dentro hasta el final
    planos.push([z.desde, "mover", k, z.est * W + z.cx, z.cy, ZOOM]);
    movimientos.push([z.desde, z.desde + ZOOM]);
  });
  movimientos.sort((a, b) => a[0] - b[0]);
  const viajes = movimientos.filter(([a]) => salidas.includes(a) || a === entrada);
  return { planos, movimientos, salidas, llegadas, centro,
    SAL: (n) => (n < salidas.length ? salidas[n] : Infinity),   // cuándo sale la cámara de la estación n
    LLE: (n) => llegadas[n],                                    // cuándo llega a la estación n
    moviendo: (t) => movimientos.some(([a, b]) => t >= a && t < b),
    viajando: (t) => viajes.some(([a, b]) => t >= a && t < b) };
}

// ---------- textos ----------
//   const T6 = crearTextos6({ interfaz: #textos, mundo: #textos-mundo });
//   T6.titulo(desde, hasta, rotuloHtml, titularHtml, M)         entrada de tema (interfaz fija)
//   T6.rotulo(desde, hasta, html, pos)                           rótulo de tema: desde = llegada de la cámara
//   T6.identificador(desde, hasta, html, [x, y])                 1-3 palabras junto a su objeto (coordenadas del mundo)
//   T6.cifra(desde, hasta, html, pos, enMundo)                   la cifra, grande: '11<span class="unidad">laboratorios</span>'
//   T6.pieza(desde, hasta, clase, html, [x, y])                  texto que es parte del dibujo (un tuit): data-arte
//   …  tildes6();  …  T6.ver(t)
function crearTextos6({ interfaz, mundo }) {
  const nodos = [];
  const crear = (caja, desde, hasta, clase, html, pos, arte = false) => {
    const d = document.createElement("div");
    d.className = `${clase} oculto`; d.innerHTML = html;
    if (arte) d.dataset.arte = "1";
    caja.appendChild(d); nodos.push({ d, desde, hasta, pos });
    return d;
  };
  return {
    titulo(desde, hasta, rotulo, titular, M) { crear(interfaz, desde, hasta, "rotulo", rotulo, M.rotulo); return crear(interfaz, desde, hasta, "titular grande", titular, M.titular); },
    rotulo: (desde, hasta, html, pos) => crear(interfaz, desde, hasta, "rotulo", html, pos),
    identificador: (desde, hasta, html, pos) => crear(mundo, desde, hasta, "identificador", html, pos),
    cifra: (desde, hasta, html, pos, enMundo = false) => crear(enMundo ? mundo : interfaz, desde, hasta, "dato cifra6", html, pos), // el dato, grande; su fuente va en la caja
    pieza: (desde, hasta, clase, html, pos) => crear(mundo, desde, hasta, clase, html, pos, true),
    ver(t) {
      for (const { d, desde, hasta, pos } of nodos) {
        const s = salto6(t, desde), visible = s !== null && t < hasta;
        d.classList.toggle("oculto", !visible);
        if (visible) { d.style.left = `${pos[0]}px`; d.style.top = `${pos[1] + s}px`; }
      }
    },
  };
}

// ---------- caja de diálogo de MISTA con la fuente del dato ----------
// Páginas de 2 líneas como máximo (maxc caracteres por línea: 21 en el short, 52 en el largo), corte en fin de frase y,
// en el short, tras una coma con 4 palabras o más; sin palabras huérfanas. La palabra clave va en caja de selección
// (con su signo de puntuación pegado) y las cifras en mono. La pestaña #fuente enseña la fuente mientras dura la frase:
// por defecto, los nombres de T.fuentes para las marcas de frases[].fuentes; `etiquetas` cambia el texto de una frase.
//   const D6 = crearDialogo6({ T, ids, claves: { fr01: "jefe" }, etiquetas: { fr03: "NYT vía AFP" }, maxc, corto, dialogo, frase, retrato, fuente });
//   …  tildes6();  …  D6.pintar(t)
function crearDialogo6({ T, ids, claves = {}, etiquetas = {}, maxc, corto, dialogo, frase, retrato, fuente }) {
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
  // una pestaña por frase con fuente (creadas ya, para que tildes6() las alcance)
  const pestanas = {};
  if (fuente) {
    fuente.classList.add("oculto");
    for (const id of ids) {
      const marcas = FR[id].fuentes || [];
      const texto = id in etiquetas ? etiquetas[id] : [...new Set(marcas.map((m) => (T.fuentes && T.fuentes[m]) || m))].join(" · ");
      if (!texto) continue;
      const s = document.createElement("span");
      s.className = "oculto"; s.innerHTML = `Fuente: <b>${texto}</b>`;
      fuente.appendChild(s); pestanas[id] = s;
    }
  }
  function pintar(t) {
    const pag = paginas.filter((p) => t >= p.i - 0.05).pop();
    if (!pag) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    retrato.replaceChildren(); retratoGato(retrato, 5, 4.5, { t }, 1.5);
    const dichas = pag.palabras.filter((p) => t >= p.i - 0.05).length, clave = claves[pag.fr] ? norm6(claves[pag.fr]) : null;
    frase.innerHTML = pag.palabras.slice(0, dichas).map((p, k) => {
      const nucleo = p.p.replace(/[.,;:?!]+$/, ""), punt = p.p.slice(nucleo.length);
      const cuerpo = /\d/.test(nucleo) ? nucleo.replace(/(\d+)/g, '<span class="cifra">$1</span>') : nucleo;
      const c = norm6(nucleo) === clave ? `<span class="nw"><span class="sel">${cuerpo}<i></i></span>${punt}</span>` : cuerpo + punt;
      return k === dichas - 1 ? c : `<span class="dicho">${c}</span>`;
    }).join(" ");
    if (fuente) {
      let alguna = false;
      for (const [id, s] of Object.entries(pestanas)) { const ve = id === pag.fr; s.classList.toggle("oculto", !ve); alguna = alguna || ve; }
      fuente.classList.toggle("oculto", !alguna);
    }
  }
  return { pintar, paginas };
}

// ---------- MISTA: entrada de tema, cambios de tema y cierre (a 12 px) ----------
//   mista6(G12, t, { W, M, hablando, entrada: [tSale, tFuera], momentos: [{ desde, hasta, pose, luego: [dt, pose] }] })
// En la entrada va entero junto al título y sale con el desplazamiento lateral; en cada momento, de pie con un saltito.
function mista6(G12, t, { W, M, hablando, entrada, momentos }) {
  const [tSale, tFuera] = entrada;
  if (t < tFuera) {
    const [gx, gy] = M.gato;
    gato(G12, Math.round(gx / 3), Math.round(gy / 3), { pose: t > 0.45 ? "senalar" : "pie", t, hablando: hablando(t) }, 1);
    G12.style.transform = t < tSale ? "" : `translateX(${-Math.round(prog6(t, tSale, tFuera) * W)}px)`;
    return;
  }
  G12.style.transform = "";
  const [ax, ay] = M.asoma;
  const m = momentos.find((x) => t >= x.desde && t < x.hasta);
  if (m) gato(G12, Math.round(ax / 3), Math.round(ay / 3) + (salto6(t, m.desde) || 0), { pose: m.luego && t > m.desde + m.luego[0] ? m.luego[1] : m.pose, t, hablando: hablando(t) }, 1);
}

// ---------- clave de fotograma: 30 por segundo en reposo, 60 mientras la cámara se mueve ----------
//   window.claveFotograma = clave6(R.moviendo);
const clave6 = (moviendo) => (t) => (moviendo(t) ? `m${Math.round(t * 60)}` : `q${Math.floor(t * 30 + 1e-6)}`);
