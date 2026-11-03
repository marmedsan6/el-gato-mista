// alien-isolation-ia · muestras del estilo oscuro: un fotograma por escenario nuevo (t 0-10 pasillo, 10-20 control,
// 20-30 colonia). Solo para aprobar el aspecto; las escenas de verdad salen de timing.*.json.
(() => {
  const corto = new URLSearchParams(location.search).get("formato") === "short";
  document.body.className = corto ? "short" : "largo";
  const [W, H] = corto ? [270, 480] : [480, 270];
  const SUELO = corto ? 290 : 232, Y_GATO = SUELO - 64;
  const L = { fondo: lienzo("fondo"), medio: lienzo("medio"), brillo: lienzo("brillo"), frente: lienzo("frente") };
  const caja = document.getElementById("textos");
  const tx = (clase, html, x, y, estilo = "") => { const d = document.createElement("div"); d.className = clase; d.innerHTML = html; d.style.cssText = `left:${x}px;top:${y}px;${estilo}`; caja.appendChild(d); };
  const panel = (x, y, w, h, c = "#0e1420") => { rect(L.frente, x + 2, y + 2, w, h, "#030407"); rect(L.frente, x, y, w, h, PROP.contorno); rect(L.frente, x + 1, y + 1, w - 2, h - 2, c); };
  const barra = (x, y, w, h, frac, c) => { rect(L.frente, x, y, w, h, PROP.contorno); rect(L.frente, x + 1, y + 1, w - 2, h - 2, "#0c1016"); rect(L.frente, x + 1, y + 1, Math.round((w - 2) * frac), h - 2, c); };
  const op = { W, H, suelo: SUELO };

  // Mapa de la estación con tu punto (lo sabe el director) y la ficha del alien empujada hacia tu zona
  function mapa(x, y, w, h, t) {
    panel(x, y, w, h, "#06120c");
    for (const [a, b, c, d] of [[8, 12, w - 16, 4], [8, 12, 4, h - 22], [w - 30, 12, 4, h - 22], [8, h - 14, w - 16, 4], [40, 12, 4, 40], [40, 48, w - 70, 4]]) rect(L.frente, x + a, y + b, c, d, "#13402a");
    const tu = [x + w - 28, y + h - 13];
    rect(L.frente, x + w - 52, y + h - 30, 30, 22, "#16301c");
    if (Math.floor(t / 0.4) % 2 === 0) rect(L.frente, tu[0] - 2, tu[1] - 2, 5, 5, "#ff8a3d");
    marcoSeleccion(L.frente, tu[0] - 6, tu[1] - 6, 13, 13, "#ff8a3d");
    rect(L.frente, x + 42, y + 30, 5, 5, "#e0454f");
    linea(L.frente, x + 50, y + 32, x + w - 40, y + h - 20, "#f2c14e", 2); puntaFlecha(L.frente, x + w - 40, y + h - 20, "der", "#f2c14e", 3);
  }

  window.seek = (t) => {
    Object.values(L).forEach((s) => s.replaceChildren()); caja.replaceChildren();
    const dlg = document.getElementById("dialogo"); dlg.hidden = true;
    if (t < 10) {
      escenario("pasillo", L, t, op);
      if (corto) {
        tx("rotulo", 'La segunda <span class="clave">taquilla</span>', 16, 62);
        escalado(L.frente, 20, SUELO - 88, 2, (g) => propTaquilla(g, 0, 0, { abierta: 0.55 }));
        alien(L.frente, 60, SUELO - 126, { pose: "sisear", t, espejo: false, luz: "#7a2a30" }, 2);
        gato(L.frente, 18, Y_GATO + 4, { pose: "asustado", t }, 2);
        dlg.hidden = false; document.getElementById("frase").innerHTML = 'Y esa vez, <span class="sel">abrió<i></i></span>&nbsp;la puerta.';
        const r = document.getElementById("retrato"); r.replaceChildren(); r.setAttribute("viewBox", "0 0 34 30"); retratoGato(r, 1, 1, { t }, 2);
      } else {
        tx("rotulo", 'El juego sabe dónde estás. El alien, <span class="clave">no</span>.', 16, 14);
        for (let k = 0; k < 3; k++) escalado(L.frente, 40 + k * 40, SUELO - 88, 2, (g) => propTaquilla(g, 0, 0, { abierta: k === 2 ? 0.6 : 0 }));
        gato(L.frente, 128, Y_GATO, { pose: "asustado", t }, 2);
        alien(L.frente, 300, SUELO - 126, { pose: "andar", t, luz: "#7a2a30" }, 2);
        escalado(L.frente, 190, 120, 2, (g) => propDetector(g, 0, 0, t, { puntos: [[0.6, -0.4]] }));
        tx("fuente-dato con-fondo", "Fuente: Thompson, Game Developer (2017)", 16, 250);
      }
    } else if (t < 20) {
      escenario("control", L, t, op);
      if (corto) {
        tx("rotulo", 'El director <span class="clave">sabe</span>', 16, 62);
        mapa(16, 86, 238, 120, t);
        tx("etiqueta", "Amenaza", 20, 216); barra(90, 214, 140, 10, 0.7, "#e0454f");
        gato(L.frente, 16, Y_GATO, { pose: "senalar", t }, 2);
      } else {
        tx("rotulo", 'El director sabe dónde <span class="clave">estás</span>', 16, 14);
        mapa(150, 44, 220, 118, t);
        tx("etiqueta", "Amenaza", 384, 50); barra(384, 62, 80, 10, 0.75, "#e0454f");
        tx("etiqueta suave", "Pista:", 384, 84); tx("etiqueta", "Tu zona", 384, 96, "color:#f2c14e");
        gato(L.frente, 60, Y_GATO, { pose: "senalar", t }, 2);
        tx("fuente-dato con-fondo", "Fuente: Thompson, Game Developer (2017)", 16, 250);
      }
    } else {
      escenario("colonia", L, t, op);
      tx("rotulo", 'Kurosaki Station · <span class="clave">tormenta</span>', 16, corto ? 62 : 14);
      alien(L.frente, corto ? 120 : 280, SUELO - 126, { pose: "agachado", t, espejo: false, luz: "#4a5a80" }, 2);
      gato(L.frente, corto ? 20 : 90, Y_GATO, { pose: "asustado", t }, 2);
      tx("fuente-dato con-fondo", "Fuente: SEGA (2026-06-08)", 16, corto ? 352 : 250);
    }
    tildesPixel();
  };
})();
