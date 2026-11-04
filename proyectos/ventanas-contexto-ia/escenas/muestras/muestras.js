// ventanas-contexto-ia · muestras del primer largo en estilo v3 (160×90 unidades de 12 px) y una del short. Un fotograma
// por idea nueva: t 0-10 la mesa de MISTA, 10-20 el plano de detalle de lo oculto, 20-30 la fiesta de saludos y 30-40 la
// tabla de modelos. Con ?formato=short, la mesa en vertical. Solo para aprobar el aspecto; las escenas salen de timing.*.json.
(() => {
  const corto = document.body.className === "short";
  const [W, H] = corto ? [270, 480] : [480, 270];
  const [UW, UH] = [W / 3, H / 3]; // lienzo en unidades v3
  const LIENZOS = {};
  for (const id of ["lejos", "medio", "brillo", "frente", "delante"]) { LIENZOS[id] = lienzo(id); LIENZOS[id].setAttribute("viewBox", `0 0 ${UW} ${UH}`); }
  const capas = { lejos: LIENZOS.lejos, medio: LIENZOS.medio, brillo: LIENZOS.brillo, delante: LIENZOS.delante };
  const F = LIENZOS.frente;
  const caja = document.getElementById("textos"), ui = document.getElementById("textos-ui");
  const retrato = document.getElementById("retrato"), frase = document.getElementById("frase");
  retrato.setAttribute("viewBox", "0 0 34 30");
  const nodos = [];
  const tx = (padre, clase, html, x, y, estilo = "") => {
    const d = document.createElement("div"); d.className = clase; d.innerHTML = html;
    d.style.cssText = `left:${x}px; top:${y}px; ${estilo}`; d.dataset.x = x; padre.appendChild(d); nodos.push(d);
  };
  const decir = (html) => { frase.innerHTML = html.replace(/(\d[\d.,]*)/g, '<span class="cifra">$1</span>'); };
  const e_marcar = (x, y, w, h) => marcoSeleccion(F, x, y, w, h, "#3d68ba");
  const sel = (p) => `<span class="sel">${p}<i></i></span>`;

  // MISTA con gorro de fiesta (cono a rayas sobre la cabeza)
  function gorro(x, y) {
    for (let k = 0; k < 6; k++) rect(F, x + 3 - Math.floor(k / 2), y + k, 1 + 2 * Math.floor(k / 2), 1, k % 2 ? P3.dorado : P3.rojo);
    rect(F, x + 3, y - 1, 1, 1, P3.blanco);
  }

  if (corto) { // ---------- short: la mesa en vertical ----------
    const SUELO = 97, MESA = 85;
    escenario3("despacho", capas, 3.2, { suelo: SUELO, mesa: MESA });
    rect(LIENZOS.medio, 0, MESA - 8, 90, 8, "#8a5e3e"); rect(LIENZOS.medio, 0, MESA - 8, 90, 1, "#a87650");
    for (let y = MESA - 5; y < MESA; y += 3) rect(LIENZOS.medio, 2, y, 86, 1, "#7d5537");
    gato(F, 4, SUELO - 32, { pose: "senalar", t: 3.2, hablando: true }, 1);
    pensamiento3(F, 2, 45, 37, 17, 18, 64);
    libros3(F, 6, 54); libros3(F, 20, 54);
    tx(caja, "tarjeta-texto", "Lo que sabe", 18, 140);
    pila3(F, 44, MESA - 3, ["oculto", "herramienta", "tu", "archivo", "tu", "respuesta", "tu"], 16, 5);
        barra3(F, 42, 63, 22, 4, 0.75, P3.naranja);
    tx(caja, "etiqueta", "Mesa", 126, 177);
    tx(caja, "fuente-dato con-fondo", "Fuente:<br>Anthropic", 120, 266);
    tx(ui, "rotulo", 'La <span class="clave">mesa</span> de trabajo', 16, 64);
    retratoGato(retrato, 5, 4.5, { t: 3.2 }, 1.5);
    decir(`Solo puedo trabajar con los papeles de la ${sel("mesa")}`);
    tildesPixel();
    window.seek = () => {};
    return;
  }

  // ---------- largo (160×90) ----------
  const SUELO = 64, MESA = 52;
  const CAM = crearCamara({ W, H, SX: 240, SY: 110, lineaCaja: 200, planos: [
    [0, "corte", 1], [10, "zoom", 1.25, 288, 135], [20, "corte", 1],
  ] });
  const mundo = document.getElementById("mundo");
  const escena = (t) => (t < 10 ? "mesa" : t < 20 ? "oculto" : t < 30 ? "fiesta" : "tabla");

  const FILAS = [["Anthropic", "1M", 1e6], ["OpenAI", "1,05M", 1.05e6], ["Google", "1M", 1e6], ["DeepSeek", "1M", 1e6], ["xAI", "500K", 5e5], ["Meta", "10M", 1e7]];
  // Textos de cada muestra (px CSS dentro del mundo, o en la interfaz fija)
  const T ={ mesa: [], oculto: [], fiesta: [], tabla: [] };
  const con = (k, fn) => { const antes = nodos.length; fn(); T[k].push(...nodos.slice(antes)); };
  con("mesa", () => {
    tx(ui, "rotulo", 'La <span class="clave">mesa</span> de trabajo', 16, 16);
    tx(caja, "tarjeta-texto", "Lo que sabe", 17, 46);
    tx(caja, "etiqueta", "Lo que tiene delante", 222, 98);
    tx(caja, "etiqueta", "Mesa", 142, 172);
    tx(caja, "fuente-dato con-fondo", "Fuente: Anthropic", 384, 170);
  });
  con("oculto", () => {
    tx(ui, "rotulo", 'Lo que <span class="clave">no ves</span>', 16, 16);
    [["Tú", 156, 108, 1], ["Herramientas", 288, 108, 0], ["Su respuesta", 420, 108, 1]].forEach(([s, cx, y, suave]) => tx(caja, suave ? "etiqueta suave" : "etiqueta", s, cx - s.length * 4, y));
    tx(caja, "fuente-dato con-fondo", "Fuente: Anthropic", 240, 184);
    [["Instrucciones", 222, 168], ["Archivos", 354, 168]].forEach(([s, cx, y]) => tx(caja, "etiqueta", s, cx - s.length * 4, y));
  });
  con("fiesta", () => {
    tx(ui, "rotulo", 'La fiesta de los <span class="clave">saludos</span>', 16, 16);
    tx(caja, "etiqueta", "Saludos", 368, 36);
    tx(caja, "dato", "45", 380, 50);
    tx(caja, "etiqueta", "10 invitados", 210, 172);
    tx(caja, "fuente-dato con-fondo", "Cálculo propio", 356, 96);
  });
  con("tabla", () => {
    tx(ui, "rotulo", 'Noviembre de <span class="clave">2026</span>', 16, 16);
    tx(caja, "etiqueta suave", "Ventana máxima · escala log.", 148, 44);
    FILAS.forEach(([nombre, valor], k) => {
      const y = (19 + k * 6) * 3 + 1;
      tx(caja, "etiqueta", nombre, 148, y);
      tx(caja, "etiqueta", valor, 400, y, k === 4 ? "color:var(--naranja)" : "");
    });
    tx(caja, "fuente-dato con-fondo", "Fuentes: webs oficiales", 148, 180);
  });
  tildesPixel();

  function fiestaTokens(t) {
    const colores = [P3.papel, HOJA.oculto.c, P3.azul, P3.verde, P3.naranja];
    const pos = Array.from({ length: 10 }, (_, k) => {
      const a = (k / 10) * Math.PI * 2;
      return [Math.round(84 + Math.cos(a) * 26), Math.round(34 + Math.sin(a) * 19)];
    });
    // Todos los saludos como un resplandor; los del invitado de turno, nítidos (cambia cada 0,5 s)
    pos.forEach((a, i) => pos.forEach((b, j) => { if (j > i) linea(LIENZOS.brillo, a[0] + 2, a[1] + 2, b[0] + 2, b[1] + 2, "#c9a4ff"); }));
    const turno = Math.floor(t / 0.5) % 10;
    pos.forEach((b, j) => { if (j !== turno) linea(LIENZOS.medio, pos[turno][0] + 2, pos[turno][1] + 2, b[0] + 2, b[1] + 2, "#e9dcff"); });
    pos.forEach(([x, y], k) => token3(F, x, y, colores[k % 5], t, { semilla: k, saluda: k % 3 === 0 }));
  }

  window.seek = (t) => {
    Object.values(LIENZOS).forEach((s) => s.replaceChildren());
    nodos.forEach((n) => n.classList.add("oculto"));
    const e = escena(t), cam = CAM.en(t);
    CAM.aplicar(cam, mundo);
    T[e].forEach((n) => n.classList.remove("oculto"));
    if (e === "mesa" || e === "oculto") {
      despachoH(capas, t, { suelo: SUELO, mesa: MESA });
      if (e === "mesa") {
        pensamiento3(F, 3, 13, 34, 16, 18, 32);
        libros3(F, 6, 21); libros3(F, 20, 21);
        pila3(F, 50, MESA - 2, ["oculto", "herramienta", "tu", "archivo", "tu", "respuesta"], 16, 3);
        pila3(F, 72, MESA - 2, ["tu", "respuesta", "tu"], 14, 9);
        hoja3(F, 96, 41, 18, 10, "tu"); hoja3(F, 120, 42, 18, 9, "respuesta");
        barra3(F, 64, 56, 60, 4, 0.6, P3.naranja);
        if (cam.general) gato(F, 6, SUELO - 32, { pose: "senalar", t, hablando: true }, 1);
        decir(`Pero solo puedo trabajar con los papeles que están encima de la ${sel("mesa")}.`);
      } else {
        ["tu", "oculto", "herramienta", "archivo", "respuesta"].forEach((tipo, k) => hoja3(F, 42 + k * 22, 41, 20, 10, tipo));
        for (const k of [0, 4]) rect(F, 42 + k * 22, 41, 20, 10, "#14101acc"); // lo que sí ves, apagado
        e_marcar(63, 40, 22, 12);
        decir(`Están las ${sel("instrucciones")} que la empresa le da a la IA y que tú no ves.`);
      }
    } else if (e === "fiesta") {
      fiesta(capas, t, { suelo: SUELO });
      fiestaTokens(t);
      panel3(F, 120, 10, 32, 20);
      gato(F, 6, SUELO - 32, { pose: "celebrar", t, hablando: false }, 1);
      gorro(17, SUELO - 32);
      decir(`Con 10 invitados hay 45 ${sel("saludos")}.`);
    } else {
      servidoresH(capas, t, { suelo: SUELO });
      panel3(F, 46, 12, 108, 45);
      FILAS.forEach(([, , v], k) => {
        const y = 19 + k * 6, frac = Math.log10(v / 1e4) / 3;
        barra3(F, 84, y, 46, 4, frac, k === 4 ? P3.naranja : P3.azul);
      });
      marcoSeleccion(F, 47, 19 + 4 * 6 - 1, 106, 6, "#3d68ba");
      gato(F, 6, SUELO - 32, { pose: "senalar", t, hablando: true }, 1);
      decir(`xAI se queda en 500.000 con Grok 4.7, la ${sel("mitad")} que Grok 4.3.`);
    }
    CAM.fuentesSinZoom(cam, caja, 16, 464);
    retrato.replaceChildren();
    retratoGato(retrato, 5, 4.5, { t }, 1.5);
  };
  window.seek(0);
})();
