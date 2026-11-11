// Lint de textos y sincronía: cada regla con un caso que falla y otro que pasa (datos sintéticos, sin navegador).
import { test } from "node:test";
import assert from "node:assert/strict";
import { lintTextos } from "../lint-textos.mjs";

// nodos: [{ id, clase, texto, caja: [l, t, ancho, alto] | (t) => [l, t, ancho, alto], desde, hasta, arte }]
function muestreo({ nodos = [], dur = 10, paso = 0.1, corto = true, dialogo = null, fuente = null, frases = [], revision = { movimientos: [], salidas: [], claves: [] } }) {
  const [W, H] = corto ? [270, 480] : [480, 270];
  const instantes = [];
  for (let k = 0; k < Math.round(dur / paso); k++) {
    const t = Math.round(k * paso * 1000) / 1000;
    const textos = nodos.filter((n) => t >= n.desde - 1e-9 && t < n.hasta - 1e-9).map((n) => {
      const [l, y, w, h] = typeof n.caja === "function" ? n.caja(t) : n.caja;
      return { id: n.id, clase: n.clase || "identificador", texto: n.texto || n.id, arte: !!n.arte, l, t: y, r: l + w, b: y + h };
    });
    instantes.push({ t, textos, dialogo: typeof dialogo === "function" ? dialogo(t) : dialogo, fuente: typeof fuente === "function" ? fuente(t) : fuente });
  }
  return { W, H, corto, paso, frases, revision, instantes };
}
const reglas = (r) => r.errores.map((e) => e.regla);
const DLG = { l: 16, t: 300, r: 224, b: 362, lineas: 2, huerfano: false };

test("una escena limpia no da errores", () => {
  const r = lintTextos(muestreo({ nodos: [
    { id: "rot", clase: "rotulo", texto: "Según la prensa", caja: [16, 64, 130, 17], desde: 0, hasta: 10 },
    { id: "id1", texto: "Alice Huang", caja: [20, 200, 94, 13], desde: 2, hasta: 6 },
  ], dialogo: DLG }));
  assert.deepEqual(r.errores, []);
  assert.equal(r.resumen.max_simultaneos, 2);
});

test("solape: cuenta si dura, no en la entrada a saltos", () => {
  const dos = (hasta) => [{ id: "a", caja: [16, 110, 180, 13], desde: 1, hasta: 6 }, { id: "b", caja: [100, 118, 120, 13], desde: 3, hasta }];
  assert.ok(reglas(lintTextos(muestreo({ nodos: dos(6) }), { minimo: 0 })).includes("solape"));
  assert.ok(!reglas(lintTextos(muestreo({ nodos: dos(3.1) }), { minimo: 0 })).includes("solape"));
});

test("fuera de pantalla: la cartela empujada a x = 268 de 270", () => {
  const r = lintTextos(muestreo({ nodos: [{ id: "f", clase: "fuente-dato", texto: "Fuente: NVIDIA", caja: [268, 140, 118, 15], desde: 1, hasta: 7 }] }));
  assert.deepEqual(reglas(r), ["fuera"]);
  assert.equal(r.errores[0].desde, 1);
});

test("zona tapada: franja derecha solo en el short", () => {
  const n = [{ id: "x", caja: [200, 230, 60, 13], desde: 0, hasta: 5 }];
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: n }))), ["zona-tapada"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: n, corto: false }))), []);
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: [{ id: "y", caja: [16, 40, 60, 13], desde: 0, hasta: 5 }] }))), ["zona-tapada"]);
});

test("texto sobre la caja de diálogo", () => {
  const r = lintTextos(muestreo({ nodos: [{ id: "x", caja: [20, 292, 100, 13], desde: 0, hasta: 5 }], dialogo: DLG }));
  assert.deepEqual(reglas(r), ["sobre-dialogo"]);
});

test("permanencia: 0,87 s no basta; un titular de 6 palabras pide 2,1 s", () => {
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: [{ id: "x", caja: [16, 190, 200, 13], desde: 2, hasta: 2.87 }] }))), ["permanencia"]);
  const titular = (hasta) => [{ id: "t", clase: "titular grande", texto: "¿Espiar al jefe de NVIDIA hoy?", caja: [16, 116, 160, 72], desde: 0, hasta }];
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: titular(1.4) }))), ["permanencia"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: titular(2.2) }))), []);
});

test("simultáneos: más de 2 falla; las piezas del dibujo no cuentan", () => {
  const n = (arte) => [0, 1, 2].map((k) => ({ id: `n${k}`, caja: [16, 110 + k * 20, 100, 13], desde: 0, hasta: 5, arte: arte && k > 0 }));
  assert.ok(reglas(lintTextos(muestreo({ nodos: n(false) }))).includes("simultaneos"));
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: n(true) }))), []);
});

test("salto: un texto que cambia de sitio con la cámara quieta; en un movimiento declarado, no", () => {
  const n = [{ id: "x", caja: (t) => (t < 4 ? [16, 128, 160, 13] : [6, 85, 160, 13]), desde: 0, hasta: 9 }];
  assert.ok(reglas(lintTextos(muestreo({ nodos: n }), { transitorio: 0 })).includes("salto"));
  assert.ok(!reglas(lintTextos(muestreo({ nodos: n, revision: { movimientos: [[3.8, 4.2]], salidas: [], claves: [] } }), { transitorio: 0 })).includes("salto"));
});

test("repite la voz: una etiqueta que transcribe la frase; un identificador, no", () => {
  const frases = [{ id: "fr10", inicio: 0, fin: 6, texto: "Dice no tener motivos para creer que se filtraran secretos.", fuentes: [] }];
  const caja = [16, 124, 206, 13];
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: [{ id: "e", clase: "etiqueta fondo", texto: "QUE SE FILTRARAN SECRETOS", caja, desde: 1, hasta: 5 }], frases }))), ["repite-voz"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: [{ id: "e", clase: "identificador", texto: "SECRETOS FILTRADOS", caja, desde: 1, hasta: 5 }], frases }))), []);
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: [{ id: "e", clase: "etiqueta fondo", texto: "8 NOV 2026", caja, desde: 1, hasta: 5 }], frases }))), []);
});

test("fuente: tiene que verse durante su frase", () => {
  const frases = [{ id: "fr03", inicio: 1, fin: 8, texto: "Según el New York Times…", fuentes: ["f3"] }];
  const pestana = { texto: "Fuente: NYT vía AFP", l: 100, t: 360, r: 224, b: 373 };
  assert.deepEqual(reglas(lintTextos(muestreo({ frases, dialogo: DLG }))), ["fuente"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ frases, dialogo: DLG, fuente: (t) => (t >= 1 && t < 8 ? pestana : null) }))), []);
  assert.deepEqual(reglas(lintTextos(muestreo({ frases, dialogo: DLG, fuente: (t) => (t >= 1 && t < 8 ? { ...pestana, l: 250, r: 374 } : null) }))), ["fuente"]);
});

test("fuente: una frase que no cabe entera en el tramo recorrido no se comprueba", () => {
  const frases = [{ id: "fr04", inicio: 9.5, fin: 14, texto: "Fuera del clip.", fuentes: ["f1"] }];
  assert.deepEqual(reglas(lintTextos(muestreo({ frases, dialogo: DLG }))), []);
});

test("pieza clave: 0,85 s antes de que salga la cámara no basta", () => {
  const rev = (salida) => ({ movimientos: [], salidas: [salida], claves: [{ t: 19.82, nombre: "dosier de la ejecutiva" }] });
  assert.deepEqual(reglas(lintTextos(muestreo({ dur: 25, revision: rev(20.67) }))), ["clave"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ dur: 25, revision: rev(21.9) }))), []);
});

test("rótulo: no cambia antes de que llegue la cámara", () => {
  const n = (desde) => [{ id: "r", clase: "rotulo", texto: "El correo", caja: [16, 64, 82, 17], desde, hasta: desde + 5 }];
  const revision = { movimientos: [[3, 4.1]], salidas: [3], claves: [] };
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: n(3), revision }))), ["rotulo-llegada"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ nodos: n(4.1), revision }))), []);
});

test("caja de diálogo: más de 2 líneas o un signo solo al empezar línea", () => {
  assert.deepEqual(reglas(lintTextos(muestreo({ dur: 1, dialogo: { ...DLG, lineas: 3 } }))), ["dialogo"]);
  assert.deepEqual(reglas(lintTextos(muestreo({ dur: 1, dialogo: { ...DLG, huerfano: true } }))), ["dialogo"]);
});

test("sin window.revision: avisa de lo que no puede comprobar", () => {
  const r = lintTextos(muestreo({ revision: null }));
  assert.deepEqual(r.avisos.map((a) => a.regla), ["revision"]);
});
