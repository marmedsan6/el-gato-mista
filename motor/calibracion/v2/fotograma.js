// C5a v2 · 4 fotogramas fijos del short de Mithril con el estilo v2: MISTA en escena, escenario ilustrado, datos sobre
// objetos del escenario (corcho, pantalla, papel, menú) y objetos ×2 alrededor que reaccionan. ?f=A|B|C|D.
// Contenido: guion aprobado (PUERTA 1). Iteración 02, tras critica-v2-01.md.
(() => {
  const W = 270, H = 480, SUELO = 290, MESA = SUELO - 40;
  const f = new URLSearchParams(location.search).get("f") || "A";
  const capas = { fondo: lienzo("fondo"), medio: lienzo("medio"), brillo: lienzo("brillo") };
  const frente = lienzo("frente");
  const caja = document.getElementById("textos");
  const texto = (clase, html, x, y, estilo = "") => {
    const d = document.createElement("div"); d.className = clase; d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`; caja.appendChild(d); return d;
  };
  const tarjeta = (x, y, w, h, color = PROP.papel) => {
    rect(frente, x + 2, y + 2, w, h, "#0a0806"); // sombra plana (nada de semitransparencias)
    rect(frente, x, y, w, h, PROP.contorno); rect(frente, x + 1, y + 1, w - 2, h - 2, color);
  };
  const frase = (dicho, actual, clave) => {
    document.getElementById("frase").innerHTML = `<span class="dicho">${dicho}</span> ` +
      (clave ? actual.replace(clave, `<span class="sel">${clave}<i></i></span>`) : actual);
  };
  const x2 = (x, y, fn) => escalado(frente, x, y, 2, fn); // objetos a ×2
  const t = { A: 8.2, B: 22.6, C: 44.9, D: 56.6 }[f];
  const svgRetrato = document.getElementById("retrato");
  svgRetrato.setAttribute("viewBox", "0 0 34 30");
  retratoGato(svgRetrato, 1, 2, { t, hablando: true }, 2);

  const ESCENAS = {
    A() { // Laboratorio · la ficha de Mithril en el corcho; MISTA la señala; un matraz burbujea marcado
      escenario("laboratorio", capas, t, { W, H, suelo: SUELO });
      texto("rotulo", "Mithril Medicine", 16, 64);
      propCorcho(capas.medio, 12, 88, 152, 98);
      tarjeta(22, 96, 132, 82);
      propChincheta(frente, 86, 97);
      texto("tarjeta-texto", "Empleados: <b style='font-size:16px'>1</b>", 30, 106);
      texto("tarjeta-texto", "Misión:", 30, 130, "color:#b4622a");
      texto("tarjeta-texto", "2 distrofias<br>musculares<br>raras", 30, 142);
      texto("fuente-dato con-fondo", "Fuente: Anthropic", 14, 192);
      // Objetos ×2 sobre la mesa: dos matraces (uno reacciona: burbujea y lleva marco de selección), microscopio y botes
      x2(20, MESA - 26, (g) => propMatraz(g, 0, 0, t, { color: PROP.verde, activo: true, semilla: 5 }));
      marcoSeleccion(frente, 16, MESA - 32, 28, 34);
      x2(50, MESA - 26, (g) => propMatraz(g, 0, 0, t, { color: PROP.azul, semilla: 6 }));
      x2(80, MESA - 50, (g) => propMicroscopio(g, 0, 0, { activo: true }));
      x2(124, MESA - 24, (g) => { propBote(g, 0, 0, PROP.naranja); propBote(g, 10, 0, "#c07ad8"); });
      gato(frente, 172, 226, { pose: "senalar", t, hablando: true, espejo: true }, 2);
      frase("una biotecnológica de un", "solo empleado,", "solo");
    },
    B() { // Servidores · la red de Claude en la pantalla; MISTA toca las cajas (logística) y saltan; los contratos vuelan
      escenario("servidores", capas, t, { W, H, suelo: SUELO });
      texto("rotulo", "Claude organiza", 16, 64);
      propMonitor(frente, 38, 88, 190, 108, { dibujo: (s, x, y, w, h) => {
        const cx = Math.round(x + w / 2), cy = y + 48;
        for (let k = 0; k < 11; k++) {
          const ang = Math.PI * (0.06 + 0.88 * k / 10), nx = Math.round(cx - Math.cos(ang) * 82), ny = Math.round(cy - Math.sin(ang) * 36);
          linea(s, cx, cy, nx + 3, ny + 3, PROP.azul);
          rect(s, nx, ny, 7, 7, PROP.contorno); rect(s, nx + 1, ny + 1, 5, 5, PROP.azul);
        }
      } });
      texto("rotulo", "Claude", 110, 133);
      [["Contratos", 0], ["Logística", 1], ["Experimentos", 2]].forEach(([n, k]) => {
        texto("etiqueta", n, 64, 156 + k * 12);
        check(frente, 196, 156 + k * 12, PROP.verde);
      });
      texto("fuente-dato con-fondo", "Fuente: Anthropic", 14, 204);
      // Contratos ×2 flotando (uno con sello verde y marco), cajas ×2 que saltan al tocarlas MISTA
      x2(164, 226, (g) => propPapel(g, 0, 0, t, { activo: true, sello: PROP.verde }));
      marcoSeleccion(frente, 160, 222, 36, 44);
      x2(204, 232, (g) => propPapel(g, 0, 0, t + 0.3, { activo: true }));
      x2(92, SUELO - 28, (g) => propCaja(g, 0, 0, t, { activo: true }));
      x2(92, SUELO - 56, (g) => propCaja(g, 0, 0, t + 0.15, { activo: true }));
      gato(frente, 24, 226, { pose: "tocar", t, hablando: true }, 2);
      frase("le organizaba", "contratos,", "contratos");
    },
    C() { // Despacho · los matices en un papel; la lupa amplía el «NO»; libros, taza y papeles alrededor
      escenario("despacho", capas, t, { W, H, suelo: SUELO });
      texto("rotulo", 'Ahora, los <span class="clave">matices</span>', 16, 64);
      tarjeta(30, 90, 200, 104);
      propChincheta(frente, 128, 91);
      texto("tarjeta-texto", "Fase:", 42, 104);
      texto("tarjeta-texto", "Temprana", 42, 118, "color:#b4622a");
      texto("tarjeta-texto", "Revisión por pares:", 42, 140);
      texto("tarjeta-texto", "No", 54, 161); // dentro del cristal (interior x 54-70)
      aspa(frente, 80, 162, PROP.rojo);
      x2(48, 152, (g) => propLupa(g, 0, 0, { activo: true })); // el cristal (centro 62,166) enmarca el «NO ✕»
      texto("fuente-dato con-fondo", "Fuente: The Next Web", 14, 202);
      // Libros apilados, taza y papeles ×2 sobre la mesa
      x2(96, MESA - 18, (g) => {
        [["#c0504a", 0], ["#4a6fb0", 3], ["#4a9a6a", 6]].forEach(([c, y]) => { rect(g, 0, y, 22, 3, PROP.contorno); rect(g, 1, y, 20, 2, c); });
      });
      x2(150, MESA - 14, (g) => { rect(g, 0, 0, 8, 7, PROP.contorno); rect(g, 1, 1, 6, 5, PROP.blanco); rect(g, 8, 2, 2, 3, PROP.contorno);
        if (Math.floor(t * 3) % 2 === 0) rect(g, 3, -3, 1, 2, "#cfd6e4"); else rect(g, 4, -4, 1, 2, "#cfd6e4"); });
      x2(176, MESA - 20, (g) => propPapel(g, 0, 0, t, {}));
      gato(frente, 20, 226, { pose: "pensar", t, hablando: true }, 2);
      frase("no ha pasado revisión por", "pares.", "pares");
    },
    D() { // Azotea · menú de juego «¿1 persona + IA = 1 empresa?» → SE ACERCA; ratones en jaula; MISTA piensa mirándolos
      escenario("azotea", capas, t, { W, H, suelo: SUELO - 6 });
      rect(frente, 16, 78, 210, 64, PROP.contorno); rect(frente, 17, 79, 208, 62, "#151b30");
      texto("etiqueta", "¿1 persona + IA", 26, 86);
      texto("etiqueta", "= 1 empresa?", 26, 98);
      puntaFlecha(frente, 34, 124, "der", "#5b8cff", 5);
      texto("etiqueta", "Se acerca", 42, 120, "color:var(--azul)");
      texto("titular", 'De momento:<br><span class="clave">ratones</span>', 16, 152);
      x2(16, SUELO - 6 - 66, (g) => propJaula(g, 0, 0, t, { activo: true }));
      marcoSeleccion(frente, 12, SUELO - 6 - 70, 96, 74, "#ff8a3d");
      gato(frente, 160, 220, { pose: "pensar", t, hablando: true, espejo: true }, 2);
      frase("Pero de momento, son", "ratones.", "ratones");
    },
  };
  ESCENAS[f]();
  tildesPixel();
  window.seek = () => {};
})();
