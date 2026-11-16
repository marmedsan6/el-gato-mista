// Herramientas del arte generado (motor/piezas/): montar.mjs junta las piezas de una fuente (tanda aceptada + set),
// aplica la meta y valida; generar.mjs --seco compone la orden de Codex y la petición sin llamarlo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const MOTOR = join(dirname(fileURLToPath(import.meta.url)), "..");
const PYTHON = process.env.PYTHON || "C:/Users/mario/AppData/Local/Programs/Python/Python312/python.exe";
const BASE = join(process.env.RUNTIME_DIR || join(MOTOR, "..", ".runtime"), "tests", `piezas-${process.pid}-${process.hrtime.bigint()}`);
const json = (ruta, datos) => { mkdirSync(dirname(ruta), { recursive: true }); writeFileSync(ruta, JSON.stringify(datos)); };
const node = (script, args) => spawnSync(process.execPath, [join(MOTOR, "piezas", script), ...args], { encoding: "utf8", env: { ...process.env, RUNTIME_DIR: BASE } });

const caja = { filas: Array.from({ length: 12 }, () => "abba"), paleta: { a: "#0b0e14", b: "#5b8cff" }, w: 4, h: 12, pixel_falso: 10.2, limpiados: 0, tipo: "objeto" };
const persona = { filas: Array.from({ length: 28 }, () => "aba"), paleta: { a: "#0b0e14", b: "#d8946c" }, w: 3, h: 28, tipo: "persona", origen: "prueba:01" };

function fuente(nombre, meta) {
  const dir = join(BASE, nombre, "piezas");
  json(join(dir, "tandas", "01-prueba.piezas.json"), { caja });
  json(join(dir, "lista.json"), { piezas: [{ nombre: "caja", de: "01-prueba" }, { nombre: "quieto", de: "set" }] });
  json(join(dir, "meta.json"), meta);
  json(join(BASE, nombre, "set.json"), { piezas: { quieto: persona } });
  return dir;
}

test("montar.mjs junta tanda y set, aplica igualar y conserva las anclas", { skip: !existsSync(PYTHON), timeout: 60000 }, () => {
  const dir = fuente("bien", { caja: { anclas: { tapa: { x: 1, y: 0, w: 2, h: 2 } }, igualar: { "#5b8cff": "#ff8a3d" }, estados: { apagada: { "#ff8a3d": "#41291f" } } } });
  const salida = join(BASE, "bien", "piezas.js"), contactos = join(BASE, "bien", "contactos.png");
  const r = node("montar.mjs", [dir, "--set", join(BASE, "bien", "set.json"), "--salida", salida, "--contactos", contactos]);
  assert.equal(r.status, 0, r.stderr);
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(salida, "utf8"), ctx);
  const P = JSON.parse(JSON.stringify(ctx.window.PIEZAS)); // fuera del contexto de vm, para comparar
  assert.deepEqual(Object.keys(P), ["caja", "quieto"]);
  assert.equal(P.caja.paleta.b, "#ff8a3d", "igualar no se ha aplicado");
  assert.deepEqual(P.caja.anclas.tapa, { x: 1, y: 0, w: 2, h: 2 });
  assert.equal(P.caja.pixel_falso, undefined, "lo del conversor no va a la escena");
  assert.equal(P.quieto.origen, "prueba:01");
  assert.ok(existsSync(contactos), "falta la hoja de contactos");
});

test("montar.mjs rechaza un ancla fuera de la pieza y una altura fuera de escala", { skip: !existsSync(PYTHON), timeout: 60000 }, () => {
  const dir = fuente("mal", { caja: { anclas: { tapa: { x: 3, y: 0, w: 2, h: 2 } } }, quieto: { tipo: "robot" } });
  const r = node("montar.mjs", [dir, "--set", join(BASE, "mal", "set.json"), "--salida", join(BASE, "mal", "piezas.js"), "--contactos", join(BASE, "mal", "c.png")]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /ancla «tapa» se sale/);
  assert.match(r.stderr, /quieto: mide 28 de alto y un robot va de/);
  assert.ok(!existsSync(join(BASE, "mal", "piezas.js")), "con errores no se escribe nada");
});

test("generar.mjs --seco compone la orden (las -i antes de -C) y la petición", () => {
  const tanda = join(BASE, "seco", "piezas", "tandas", "01-calle.json");
  json(tanda, { tipo: "tienda", piezas: [{ nombre: "tienda", pide: "Una tienda de barrio con toldo a rayas" }, { nombre: "lata", tipo: "objeto", pide: "Una lata de refresco" }] });
  const refs = [join(BASE, "seco", "a.png"), join(BASE, "seco", "b.png")];
  refs.forEach((f) => writeFileSync(f, ""));
  const r = node("generar.mjs", ["--tanda", tanda, "--seco", "--referencias", refs.join(",")]);
  assert.equal(r.status, 0, r.stderr);
  const { orden, peticion, carpeta } = JSON.parse(r.stdout);
  assert.equal(orden[0], "codex");
  assert.equal(orden[1], "exec");
  assert.ok(orden.lastIndexOf("-i") < orden.indexOf("-C"), "las -i tienen que ir antes de -C");
  assert.equal(orden.at(-1), "-", "la petición va por stdin");
  assert.match(carpeta, /piezas\/seco\/01-calle\/intento-1$/);
  assert.match(peticion, /#ff00ff/);
  // se pide un 25 % de más (Codex dibuja más pequeño) y el conversor reduce: 67 → 84, 86 → 108, 16 → 20, 28 → 35
  assert.match(peticion, /1\. Una tienda de barrio con toldo a rayas\. Unos 84 píxeles lógicos de alto y 108 de ancho\./);
  assert.match(peticion, /2\. Una lata de refresco\. Unos 20 píxeles lógicos de alto\./);
  assert.match(peticion, /Una persona de pie mediría 35 píxeles/);
  assert.match(peticion, /2 imágenes adjuntas/);
  assert.ok(!existsSync(join(BASE, "piezas", "seco")), "--seco no crea carpetas");
});
