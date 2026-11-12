// Motor de shorts v6 (motor/estilo/v6/short.js) y nombres de fuente del short: la pestaña de la fuente del 9:16 cabe en
// una línea solo con 17 caracteres o menos, y lo que no cabe se avisa (en timing-a-js, en la escena y en el lint).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { avisosNombresShort, nombresShort } from "../fuentes-frases.mjs";
import { lintTextos } from "../lint-textos.mjs";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAIZ = join(MOTOR, "..");
// short.js es un script clásico: se carga en un contexto aislado para probar su lógica pura sin navegador
const ctx = vm.createContext({});
vm.runInContext(readFileSync(join(MOTOR, "estilo", "v6", "short.js"), "utf8"), ctx);
const { fuentesShort6 } = ctx;

const T = (fuentes, frases) => ({ fuentes, frases: frases.map(([id, marcas]) => ({ id, fuentes: marcas })) });

test("fuentesShort6: avisa de la pestaña que no cabe y no de la que cabe", () => {
  const r = fuentesShort6(T({ f1: "Authorized Buyers", f2: "Google Authorized Buyers" }, [["fr01", ["f1"]], ["fr02", ["f2"]], ["fr03", []]]));
  assert.equal(r.avisos.length, 1);
  assert.equal(r.avisos[0].frase, "fr02");
  assert.equal(r.avisos[0].largo, 24);
});

test("fuentesShort6: cortos cambia el nombre para este short y quita el aviso", () => {
  const r = fuentesShort6(T({ f2: "Google Authorized Buyers" }, [["fr02", ["f2"]]]), { cortos: { f2: "Authorized Buyers" } });
  assert.equal(r.nombres.f2, "Authorized Buyers");
  assert.equal(r.avisos.length, 0);
});

test("fuentesShort6: dos fuentes en una frase se miden juntas y la etiqueta manda", () => {
  const t = T({ f1: "Google Ads", f2: "ICO, 2019" }, [["fr01", ["f1", "f2"]]]);
  assert.equal(fuentesShort6(t).avisos[0].texto, "Google Ads · ICO, 2019");
  assert.equal(fuentesShort6(t, { etiquetas: { fr01: "Google Ads · ICO" } }).avisos.length, 0);
});

test("nombresShort: corto_short y, si falta, corto o el autor; avisa solo de las marcas usadas", () => {
  const f = { fuentes: [
    { id: "f1", autor: "Northeastern University (News)", corto: "Northeastern University", corto_short: "Northeastern" },
    { id: "f2", autor: "Google Authorized Buyers (Ayuda)" },
    { id: "f3", autor: "X", corto: "Ayuda de Google Ads y más" },
  ] };
  assert.deepEqual(nombresShort(f), { f1: "Northeastern", f2: "Google Authorized Buyers", f3: "Ayuda de Google Ads y más" });
  assert.deepEqual(avisosNombresShort(f).map((a) => a.id), ["f2", "f3"]);
  assert.deepEqual(avisosNombresShort(f, { usadas: ["f1", "f3"] }).map((a) => a.id), ["f3"]);
});

test("lint: la pestaña larga se avisa en el short (no en el largo) y pasan los avisos de window.revision", () => {
  const m = (corto, texto, avisos) => ({ W: corto ? 270 : 480, H: corto ? 480 : 270, corto, paso: 0.1, frases: [],
    revision: { movimientos: [], salidas: [], claves: [], avisos }, instantes: [{ t: 0, textos: [], dialogo: null, fuente: { texto, l: 10, t: 370, r: 224, b: 384 } }] });
  const de = (r) => r.avisos.filter((a) => a.regla === "fuente-larga");
  assert.equal(de(lintTextos(m(true, "Fuente: Google Authorized Buyers"))).length, 1);
  assert.equal(de(lintTextos(m(true, "Fuente: Authorized Buyers"))).length, 0);
  assert.equal(de(lintTextos(m(false, "Fuente: Google Authorized Buyers"))).length, 0);
  assert.equal(lintTextos(m(true, "Fuente: X", [{ regla: "fuente-larga", texto: "fr09: «…»" }])).avisos.length, 1);
});

const revisar = (html, ancho, alto, dur, ...extra) =>
  spawnSync("node", [join(MOTOR, "revisar.mjs"), html, ancho, alto, dur, "0.1", ".", "--json", ...extra], { encoding: "utf8" });
const lintDe = (r) => JSON.parse(r.stdout.trim().split("\n").pop());

test("montarShort6 en el navegador: la fuente larga llega al lint como aviso", { timeout: 120000 }, () => {
  const r = revisar(join(MOTOR, "tests", "fixtures", "short6-fuente-larga.html"), "270", "480", "8.6");
  assert.equal(r.status, 0, r.stderr);
  const avisos = lintDe(r).avisos.filter((a) => a.regla === "fuente-larga");
  assert.ok(avisos.length >= 1, JSON.stringify(lintDe(r).avisos));
  assert.ok(avisos.some((a) => /larguísimo|LARGUISIMO/i.test(a.texto)));
});

test("las plantillas v6 (short con montarShort6, largo con montarLargo6) pasan el lint estricto", { timeout: 240000 }, () => {
  const p = (f) => join(RAIZ, "plantillas", "escenas", "v6", f, "escena-plantilla.html");
  const s = revisar(p("short"), "270", "480", "13.8", "--estricto");
  assert.equal(s.status, 0, s.stdout.slice(-1500) + s.stderr);
  assert.deepEqual(lintDe(s).errores, []);
  const l = revisar(p("largo"), "480", "270", "13.8", "--estricto");
  assert.equal(l.status, 0, l.stdout.slice(-1500) + l.stderr);
  assert.deepEqual(lintDe(l).errores, []);
});
