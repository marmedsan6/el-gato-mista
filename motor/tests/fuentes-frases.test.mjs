// Reparto de las marcas [fN] del guion entre las frases del timing (fuente en la caja de diálogo, estilo v6).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fuentesPorFrase, nombresCortos, parrafosDelGuion } from "../fuentes-frases.mjs";

const GUION = `# Guion · prueba

## Maestro (largo)
Sin largo.

## Short
<!-- comentario con [f9] que no cuenta -->
¿Y si para conseguir los secretos no hiciera falta robarlos?

Sus chips no se pueden vender libremente a China: Estados Unidos restringe su exportación. [f5]

El domingo, Jensen Huang admitió en un correo que había sido infiel. La prensa relaciona esa infidelidad con la espía. [f2] [f3] [f5]

Pero ojo: NVIDIA no confirma el espionaje. Investiga lo publicado. [f1]
`;
const fr = (id, texto) => ({ id, texto, palabras: [] });

test("párrafos de la sección pedida, sin comentarios y con sus marcas", () => {
  const p = parrafosDelGuion(GUION, "Short");
  assert.equal(p.length, 4);
  assert.deepEqual(p.map((x) => x.fuentes), [[], ["f5"], ["f2", "f3", "f5"], ["f1"]]);
  assert.throws(() => parrafosDelGuion(GUION, "Inexistente"), /no tiene la sección/);
});

test("las frases de un mismo párrafo heredan sus marcas, aunque la voz escriba los nombres de otra forma", () => {
  const frases = [
    fr("fr01", "¿Y si para conseguir los secretos no hiciera falta robarlos?"),
    fr("fr02", "Sus chips no se pueden vender libremente a China: Estados Unidos restringe su exportación."),
    fr("fr03", "El domingo, Yensen Juang admitió en un correo que había sido infiel."),
    fr("fr04", "La prensa relaciona esa infidelidad con la espía."),
    fr("fr05", "Pero ojo: Envidia no confirma el espionaje."),
    fr("fr06", "Investiga lo publicado."),
  ];
  assert.deepEqual(fuentesPorFrase(GUION, "Short", frases), [[], ["f5"], ["f2", "f3", "f5"], ["f2", "f3", "f5"], ["f1"], ["f1"]]);
});

test("si las frases no cuadran con el guion, falla con un mensaje claro", () => {
  assert.throws(() => fuentesPorFrase(GUION, "Short", [fr("fr01", "¿Y si para conseguir los secretos no hiciera falta robarlos?")]), /Faltan frases/);
  assert.throws(() => fuentesPorFrase(GUION, "Short", [fr("fr01", "Una frase que no tiene nada que ver y que es larguísima para este párrafo tan corto de aquí.")]), /no cuadran/);
});

test("nombre corto: el campo corto o el autor hasta el paréntesis", () => {
  assert.deepEqual(nombresCortos({ fuentes: [{ id: "f1", autor: "NVIDIA (consejo de administración)" }, { id: "f3", autor: "AFP (en Yahoo News)", corto: "NYT vía AFP" }] }),
    { f1: "NVIDIA", f3: "NYT vía AFP" });
});
