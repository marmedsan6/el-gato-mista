// C5b · clip de 18 s con el estilo v1 (docs/estilo.md, marca/tokens.json), texto neutro de prueba.
// Contrato: seek(t) redibuja todo desde t; sin reloj ni animaciones CSS; azar solo con semilla.
// Movimiento escalonado (P10), entradas por salto o crecimiento (P18), destello pixelado entre bloques (P12),
// cámara fija con travelling lento (P11), máx. 2 acentos por escena.
(() => {
  const formato = new URLSearchParams(location.search).get("formato") === "largo" ? "largo" : "short";
  const [W, H] = formato === "largo" ? [480, 270] : [270, 480];
  document.body.className = `${formato} violeta`;
  const C = { fondo: "#0c1016", violeta: "#1e1727", panel: "#171e2a", linea: "#36373b", texto: "#f5f7fb",
    suave: "#8a93a6", naranja: "#ff8a3d", azul: "#5b8cff", rojo: "#e0454f", dorado: "#f2c14e", sol: "#ffd97a" };
  const DESTELLOS = [6, 12];
  const ANCHO_DESTELLO = 0.3;

  // --- utilidades deterministas ---
  const paso = (v, p) => Math.floor(v / p) * p;
  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => lim((t - a) / (b - a), 0, 1);
  const desde = (t, a) => t >= a;
  // Salto de entrada: 2 px de rebote en 2 escalones durante 0,15 s
  const salto = (t, a) => (t < a ? null : t < a + 0.075 ? -2 : t < a + 0.15 ? -1 : 0);

  // --- capas y textos (se crean una vez) ---
  const capa = { a: document.getElementById("capa-a"), b: document.getElementById("capa-b"), c: document.getElementById("capa-c") };
  const svg = {};
  ["a-fondo", "a-brillo", "a-frente", "b-brillo", "b-frente", "c-brillo", "c-frente", "destello"].forEach((id) => (svg[id] = lienzo(id)));
  const textos = document.getElementById("textos");
  const nodos = {};
  function texto(id, clase, html, x, y, estilo = "") {
    const d = document.createElement("div");
    d.className = clase;
    d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`;
    d.dataset.x = x; d.dataset.y = y;
    textos.appendChild(d);
    nodos[id] = d;
    return d;
  }
  function mostrar(id, t, a, bloque) {
    const d = nodos[id];
    const s = salto(t, a);
    const visible = s !== null && bloqueActivo(t) === bloque;
    d.classList.toggle("oculto", !visible);
    if (visible) d.style.top = `${Number(d.dataset.y) + s}px`;
  }

  // Bloque visible en t (el cambio ocurre en el pico del destello)
  const bloqueActivo = (t) => (t < DESTELLOS[0] ? "a" : t < DESTELLOS[1] ? "b" : "c");

  // ====== textos por formato ======
  const S = formato === "short";
  if (S) {
    texto("titular1", "titular", "¿Por qué", 16, 80);
    texto("titular2", "titular", "el cielo", 16, 104);
    texto("titular3", "titular", 'es <span class="clave">azul?</span>', 16, 128);
    texto("insignia", "insignia", "Ciencia · 01", 16, 164);
    texto("rotulo", "rotulo", "Escaneando luz", 16, 64);
    texto("pct", "etiqueta suave", "0%", 172, 83);
    texto("onda1", "etiqueta", "Onda corta", 24, 112, "color:var(--azul)");
    texto("onda2", "etiqueta suave", "Onda larga", 24, 172);
    texto("dato450", "dato", "450 nm", 16, 232, "color:var(--azul)");
    texto("dato700", "dato", "frente a 700 nm", 16, 258, "color:var(--texto-suave); font-size:16px");
    texto("fuenteB", "fuente-dato", "Fuente: [f1]", 16, 282);
    texto("tituloC", "titular p8", "Dispersión de la luz", 16, 76);
    texto("rojoC", "etiqueta suave", "Rojo", 24, 108);
    texto("azulC", "etiqueta", "Azul", 134, 108, "color:var(--azul)");
    texto("x1", "dato", "×1", 24, 234, "color:var(--texto-suave); font-size:16px");
    texto("contador", "dato", "×1,0", 134, 228, "color:var(--azul)");
    texto("fuenteC", "fuente-dato", "Fuente: [f1]", 126, 280);
  } else {
    texto("insignia", "insignia", "Capítulo 1", 32, 56);
    texto("titular1", "titular", "La luz", 32, 80);
    texto("titular2", "titular", 'del <span class="clave">sol</span>', 32, 104);
    texto("meta", "etiqueta suave", "8 min · ciencia", 32, 136);
    texto("tituloB", "titular p8", "Luz → aire → ojo", 32, 32);
    texto("sol", "etiqueta", "Sol", 40, 178);
    texto("moleculas", "etiqueta", "Moléculas de aire", 178, 216);
    texto("ojo", "etiqueta", "Ojo", 396, 178);
    texto("formula", "dato", '1/λ<sup style="font-size:14px; vertical-align:10px; margin-left:-2px;">4</sup>', 300, 56, "color:var(--azul)");
    texto("fuenteB", "fuente-dato", "Fuente: [f1]", 300, 90);
    texto("colores", "etiqueta", "Colores", 44, 52);
    ["Rojo", "Naranja", "Verde", "Azul", "Violeta"].forEach((c, i) => texto(`m${i}`, "etiqueta suave", c, 60, 80 + i * 20));
    texto("disp", "etiqueta", "Dispersión", 236, 52);
    texto("drojo", "etiqueta suave", "Rojo", 236, 80);
    texto("dazul", "etiqueta", "Azul", 236, 100, "color:var(--azul)");
    texto("contador", "dato", "×1,0", 236, 136, "color:var(--azul)");
    texto("fuenteC", "fuente-dato", "Fuente: [f1]", 236, 164);
    texto("nivel", "etiqueta suave", "Nivel 2 · Rayleigh", 236, 200);
  }
  tildesPixel();

  // ====== caja de diálogo (solo short): páginas, palabra a palabra cada 0,3 s ======
  const PAGINAS = [
    { t: 1.2, texto: "El sol trae todos los colores." },
    { t: 3.4, texto: "Pero arriba se ve azul.", clave: "azul" },
    { t: 6.6, texto: "Cuanto más corta es la onda,", clave: "corta" },
    { t: 9.2, texto: "más rebota en el aire." },
    { t: 12.6, texto: "Por eso el aire nos devuelve" },
    { t: 15.0, texto: "casi seis veces más azul.", clave: "azul" },
  ];
  const POR_PALABRA = 0.3;
  const dialogo = document.getElementById("dialogo");
  function pintarDialogo(t) {
    if (!S) { dialogo.classList.add("oculto"); return; }
    const pagina = [...PAGINAS].reverse().find((p) => t >= p.t);
    // Una frase solo se ve dentro de su bloque: tras el destello, la caja espera a la frase nueva.
    if (!pagina || enDestello(t) || bloqueActivo(pagina.t) !== bloqueActivo(t)) { dialogo.classList.add("oculto"); return; }
    dialogo.classList.remove("oculto");
    const palabras = pagina.texto.split(" ");
    const dichas = Math.min(palabras.length, 1 + Math.floor((t - pagina.t) / POR_PALABRA));
    const html = palabras.slice(0, dichas).map((p, i) => {
      const actual = i === dichas - 1;
      const [nucleo, punt] = [p.replace(/[.,;:]$/, ""), (p.match(/[.,;:]$/) || [""])[0]];
      const contenido = nucleo === pagina.clave ? `<span class="sel">${nucleo}<i></i></span>${punt}` : p;
      return actual ? contenido : `<span class="dicho">${contenido}</span>`;
    }).join(" ");
    dialogo.innerHTML = html + (dichas === palabras.length ? '<span class="cursor"></span>' : "");
  }

  // ====== destello pixelado (retícula de puntos) ======
  const enDestello = (t) => DESTELLOS.some((d) => Math.abs(t - d) < ANCHO_DESTELLO / 2);
  function pintarDestello(t) {
    const s = svg.destello;
    s.replaceChildren();
    const d = DESTELLOS.find((x) => Math.abs(t - x) < ANCHO_DESTELLO / 2);
    if (d === undefined) return;
    const p = (t - (d - ANCHO_DESTELLO / 2)) / ANCHO_DESTELLO; // 0..1
    const intensidad = 0.85 * paso(1 - Math.abs(2 * p - 1), 0.25); // escalonado, pico al 85 %: se intuye la imagen
    if (intensidad <= 0) return;
    const blanco = rect(s, 0, 0, W, H, "#ffffff");
    blanco.setAttribute("opacity", intensidad.toFixed(2));
    // Retícula de puntos oscuros cada 4 px base (más gruesa en el pico)
    const lado = intensidad >= 0.6 ? 2 : 1;
    for (let y = 1; y < H; y += 4) for (let x = 1; x < W; x += 4) rect(s, x, y, lado, lado, C.fondo);
  }

  // ====== bloques ======
  function bloqueA(t) {
    const f = svg["a-fondo"], b = svg["a-brillo"], fr = svg["a-frente"];
    [f, b, fr].forEach((x) => x.replaceChildren());
    const travelling = -paso(t * 2, 1); // la cámara se desplaza 2 px base por segundo, a saltos de 1 px
    if (S) {
      bandas(f, 0, 300, ["#1e1727", "#241b33", "#2b2040", "#33264d", "#3b2c58"]);
      estrellas(f, 7, 40, 0, 0, 270, 160, t);
      montanasDesplazadas(f, 3, 268, 40, 6, "#2a2238", travelling);
      const ySol = 262 - paso(prog(t, 0.5, 5) * 34, 2);
      disco(b, 196, ySol, 22, C.dorado);
      disco(fr, 196, ySol, 12, C.dorado);
      disco(fr, 196, ySol, 9, C.sol);
      montanas(fr, 11, 290, 30, 4, "#171e2a");
      rect(fr, 0, 290, 270, 190, C.fondo);
      particulas(fr, 21, 120, 0, 292, 270, 90, ["#171e2a", "#2a2238"]);
      mostrar("titular1", t, 0.0, "a"); mostrar("titular2", t, 0.4, "a"); mostrar("titular3", t, 0.8, "a");
      crecer("insignia", t, 2.2, "a");
    } else {
      bandas(f, 0, 236, ["#1e1727", "#241b33", "#2b2040", "#33264d", "#3b2c58", "#46335f"]);
      estrellas(f, 5, 60, 0, 0, 480, 120, t);
      montanasDesplazadas(f, 9, 222, 46, 8, "#2a2238", travelling);
      const ySol = 230 - paso(prog(t, 0.5, 5) * 34, 2);
      disco(b, 340, ySol, 30, C.dorado);
      if (desde(t, 2.5)) for (let i = 0; i < 7; i++) linea(b, 340, ySol, 250 + i * 32, 0, C.dorado, 2);
      disco(fr, 340, ySol, 16, C.dorado);
      disco(fr, 340, ySol, 12, C.sol);
      montanas(fr, 4, 240, 30, 6, "#171e2a");
      rect(fr, 0, 240, 480, 30, C.fondo);
      particulas(fr, 13, 90, 0, 242, 480, 28, ["#171e2a", "#2a2238"]);
      crecer("insignia", t, 0.2, "a");
      mostrar("titular1", t, 0.6, "a"); mostrar("titular2", t, 1.0, "a"); mostrar("meta", t, 3.5, "a");
    }
  }

  function bloqueB(t) {
    const b = svg["b-brillo"], fr = svg["b-frente"];
    [b, fr].forEach((x) => x.replaceChildren());
    if (S) {
      mostrar("rotulo", t, 6.2, "b");
      const pct = paso(prog(t, 6.4, 9.8) * 100, 5);
      nodos.pct.textContent = `${pct}%`;
      mostrar("pct", t, 6.4, "b");
      if (desde(t, 6.4)) {
        rect(fr, 16, 84, 150, 6, C.fondo); rect(fr, 16, 84, 150, 1, C.texto); rect(fr, 16, 89, 150, 1, C.texto);
        rect(fr, 16, 84, 1, 6, C.texto); rect(fr, 165, 84, 1, 6, C.texto);
        rect(fr, 17, 85, Math.round(148 * pct / 100), 4, C.texto);
        if (desde(t, 9.8)) check(fr, 210, 82, C.texto);
      }
      if (desde(t, 6.8)) {
        rect(fr, 16, 104, 210, 116, C.panel); rect(fr, 16, 104, 210, 1, C.linea); rect(fr, 16, 219, 210, 1, C.linea);
      }
      const largo1 = paso(prog(t, 7.0, 8.5) * 194, 6), largo2 = paso(prog(t, 8.0, 9.5) * 194, 6);
      if (largo1 > 0) onda(fr, 24, 140, largo1, 18, 10, C.azul);
      if (largo2 > 0) onda(fr, 24, 198, largo2, 56, 10, C.rojo);
      mostrar("onda1", t, 7.0, "b"); mostrar("onda2", t, 8.0, "b");
      crecerDato("dato450", t, 9.8, "b", 24);
      mostrar("dato700", t, 10.6, "b"); mostrar("fuenteB", t, 10.9, "b");
    } else {
      const pan = paso((1 - prog(t, 6, 12)) * 24, 1); // travelling: el diagrama entra 24 px desde la derecha
      const g = (x) => x + pan;
      [["tituloB", 6.2], ["sol", 6.4], ["moleculas", 7.8], ["ojo", 10.4], ["formula", 10.8], ["fuenteB", 11.0]].forEach(([id, a]) => {
        mostrar(id, t, a, "b");
        nodos[id].style.left = `${Number(nodos[id].dataset.x) + (id === "tituloB" ? 0 : pan)}px`;
      });
      const cx = g(236), cy = 140;
      if (desde(t, 6.2)) { disco(b, g(52), cy, 22, C.texto); disco(fr, g(52), cy, 14, C.texto); }
      const haz = paso(prog(t, 6.6, 7.6) * (cx - g(72)), 8);
      if (haz > 0) linea(fr, g(72), cy, g(72) + haz, cy, C.texto, 2);
      if (desde(t, 7.6)) particulas(fr, 42, 260, g(186), 104, 100, 72, [C.linea, C.suave]);
      const rayos = [[300, 96], [298, 180], [250, 92], [258, 192], [190, 100]];
      const nRayos = Math.floor(prog(t, 8.4, 9.2) * rayos.length + (desde(t, 9.2) ? 0 : 0));
      rayos.slice(0, desde(t, 9.2) ? rayos.length : nRayos).forEach(([x, y]) => linea(fr, cx, cy, g(x), y, C.azul));
      const rojo = paso(prog(t, 9.4, 10.2) * (g(388) - cx), 8);
      if (rojo > 0) linea(fr, cx, cy + 2, cx + rojo, cy + 2, C.rojo, 2);
      if (desde(t, 10.2)) { puntaFlecha(fr, g(390), cy + 2, "der", C.rojo, 5); linea(fr, cx, cy - 6, g(388), cy - 6, C.azul, 2); puntaFlecha(fr, g(390), cy - 6, "der", C.azul, 5); }
      if (desde(t, 10.4)) {
        [[6, 0, 16], [3, 1, 22], [1, 2, 26], [0, 3, 28], [0, 4, 28], [1, 5, 26], [3, 6, 22], [6, 7, 16]]
          .forEach(([dx, dy, w]) => rect(fr, g(398) + dx, 134 + dy * 2, w, 2, C.texto));
        rect(fr, g(402), 138, 20, 8, C.fondo);
        disco(fr, g(412), 142, 4, C.azul); disco(b, g(412), 142, 9, C.azul);
      }
      if (desde(t, 7.8)) linea(fr, cx, 214, cx, 178, C.suave);
      if (desde(t, 10.8)) linea(fr, g(300), 104, g(278), 120, C.suave);
    }
  }

  function bloqueC(t) {
    const b = svg["c-brillo"], fr = svg["c-frente"];
    [b, fr].forEach((x) => x.replaceChildren());
    // Contador ×1,0 → ×5,8 en 24 pasos de 0,2 (con enteros: 4,8 / 0,2 en coma flotante da 23,999…)
    const pasos = Math.min(24, Math.floor(prog(t, S ? 13.0 : 15.2, S ? 14.6 : 16.4) * 24 + 1e-9));
    const factor = 1 + pasos / 5;
    nodos.contador.textContent = `×${factor.toFixed(1).replace(".", ",")}`;
    if (S) {
      mostrar("tituloC", t, 12.2, "c");
      [[16, C.rojo, 12.4], [126, C.azul, 12.6]].forEach(([x, c, a]) => {
        if (!desde(t, a)) return;
        rect(fr, x, 100, 98, 172, C.panel);
        rect(fr, x, 100, 98, 1, c); rect(fr, x, 271, 98, 1, c); rect(fr, x, 100, 1, 172, c); rect(fr, x + 97, 100, 1, 172, c);
      });
      mostrar("rojoC", t, 12.4, "c"); mostrar("azulC", t, 12.6, "c");
      const p = prog(t, 13.0, 14.6);
      const hRojo = paso(p * 14, 2), hAzul = paso(p * 81, 3);
      if (hRojo > 0) rect(fr, 36, 210 - hRojo, 24, hRojo, C.rojo);
      if (hAzul > 0) { rect(fr, 146, 210 - hAzul, 24, hAzul, C.azul); rect(b, 140, 210 - hAzul - 6, 36, hAzul + 6, C.azul); }
      mostrar("x1", t, 13.0, "c"); mostrar("contador", t, 13.0, "c"); mostrar("fuenteC", t, 15.2, "c");
    } else {
      [[32, 168, 12.2], [224, 224, 12.4]].forEach(([x, w, a]) => {
        if (!desde(t, a)) return;
        rect(fr, x, 40, w, 190, C.panel);
        rect(fr, x, 40, w, 1, C.linea); rect(fr, x, 229, w, 1, C.linea); rect(fr, x, 40, 1, 190, C.linea); rect(fr, x + w - 1, 40, 1, 190, C.linea);
      });
      mostrar("colores", t, 12.2, "c"); mostrar("disp", t, 12.4, "c");
      for (let i = 0; i < 5; i++) mostrar(`m${i}`, t, 12.6 + i * 0.2, "c");
      // Cursor: baja de Rojo (0) a Azul (3), un paso cada 0,45 s desde 13,6
      const fila = desde(t, 13.6) ? Math.min(3, Math.floor((t - 13.6) / 0.45)) : 0;
      if (desde(t, 13.4)) puntaFlecha(fr, 52, 84 + fila * 20, "der", C.texto, 5);
      const elegido = desde(t, 15.0);
      nodos.m3.style.color = elegido ? "var(--azul)" : "";
      nodos.m3.innerHTML = elegido ? '<span class="sel" style="line-height:10px; padding:1px 3px;">AZUL<i></i></span>' : "AZUL";
      mostrar("drojo", t, 15.2, "c"); mostrar("dazul", t, 15.2, "c");
      const p = prog(t, 15.2, 16.4);
      if (desde(t, 15.2)) {
        [[79, 20, C.rojo], [99, 116, C.azul]].forEach(([y, max, c]) => {
          rect(fr, 308, y, 124, 8, C.fondo); rect(fr, 308, y, 124, 1, C.texto); rect(fr, 308, y + 7, 124, 1, C.texto);
          rect(fr, 308, y, 1, 8, C.texto); rect(fr, 431, y, 1, 8, C.texto);
          const w = paso(p * max, 4);
          if (w > 0) rect(fr, 309, y + 1, w, 6, c);
        });
      }
      mostrar("contador", t, 15.2, "c"); mostrar("fuenteC", t, 16.6, "c"); mostrar("nivel", t, 17.0, "c");
    }
  }

  // --- piezas con movimiento ---
  function estrellas(s, semilla, n, x, y, w, h, t) {
    const azar = mulberry32(semilla);
    for (let i = 0; i < n; i++) {
      const px = x + azar() * w, py = y + azar() * h, fase = azar();
      if ((Math.floor(t * 2 + fase * 8) % 4) !== 0) rect(s, px, py, 1, 1, azar() < 0.5 ? C.suave : C.texto);
      else azar();
    }
  }
  function montanasDesplazadas(s, semilla, yBase, amplitud, pasoM, color, dx) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${dx} 0)`);
    s.appendChild(g);
    const sub = { appendChild: (n) => g.appendChild(n), viewBox: { baseVal: { width: W + 60, height: H } } };
    montanas(sub, semilla, yBase, amplitud, pasoM, color);
  }
  function crecer(id, t, a, bloque) {
    // Crecimiento por píxeles: la insignia se recorta de izquierda a derecha en 4 escalones
    const d = nodos[id];
    const visible = desde(t, a) && bloqueActivo(t) === bloque;
    d.classList.toggle("oculto", !visible);
    if (visible) d.style.clipPath = `inset(0 ${100 - paso(prog(t, a, a + 0.2) * 100, 25)}% 0 0)`;
  }
  function crecerDato(id, t, a, bloque, tam) {
    // El dato crece en tamaño a saltos (8 → 16 → tam px)
    const d = nodos[id];
    const visible = desde(t, a) && bloqueActivo(t) === bloque;
    d.classList.toggle("oculto", !visible);
    if (visible) d.style.fontSize = `${t < a + 0.1 ? 8 : t < a + 0.2 ? 16 : tam}px`;
  }

  // ====== seek ======
  window.seek = (t) => {
    const b = bloqueActivo(t);
    capa.a.classList.toggle("oculto", b !== "a");
    capa.b.classList.toggle("oculto", b !== "b");
    capa.c.classList.toggle("oculto", b !== "c");
    document.body.className = `${formato} ${b === "a" ? "violeta" : "azul"}`;
    Object.values(nodos).forEach((n) => n.classList.add("oculto"));
    if (b === "a") bloqueA(t); else if (b === "b") bloqueB(t); else bloqueC(t);
    pintarDialogo(t);
    pintarDestello(t);
  };
  window.seek(0);
})();
