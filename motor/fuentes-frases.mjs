// Fuente de cada frase (estilo v6): reparte las marcas [fN] del guion entre las frases del timing, para que la caja de
// diálogo enseñe la fuente mientras suena la frase. Lógica pura, con tests.
//
// El guion lleva las marcas al final de cada párrafo; un párrafo puede tener varias frases y todas heredan sus marcas.
// Las frases del timing van en el mismo orden que el guion: se reparten por número de palabras (la voz puede escribir
// los nombres de otra forma, «Envidia» por «NVIDIA», pero el recuento casi no cambia).

const palabras = (s) => s.split(/\s+/).filter((p) => /[\p{L}\p{N}]/u.test(p)).length;

// Devuelve los párrafos de la sección: [{ texto, fuentes: ["f1", …], palabras }]
export function parrafosDelGuion(guion, seccion) {
  const lineas = guion.replace(/<!--[\s\S]*?-->/g, "").split(/\r?\n/);
  const ini = lineas.findIndex((l) => /^##\s+/.test(l) && l.replace(/^##\s+/, "").toLowerCase().startsWith(seccion.toLowerCase()));
  if (ini < 0) throw new Error(`El guion no tiene la sección «## ${seccion}»`);
  const resto = lineas.slice(ini + 1);
  const fin = resto.findIndex((l) => /^##\s+/.test(l));
  const cuerpo = (fin < 0 ? resto : resto.slice(0, fin)).join("\n");
  return cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const fuentes = [...new Set([...p.matchAll(/\[(f\d+)\]/g)].map((m) => m[1]))];
    const texto = p.replace(/\[f\d+\]/g, "").replace(/\s+/g, " ").trim();
    return { texto, fuentes, palabras: palabras(texto) };
  }).filter((p) => p.palabras > 0);
}

// frases: [{ id, texto? , palabras: [{ p }] }] → [["f1"], [], …] (una lista por frase, en su orden)
export function fuentesPorFrase(guion, seccion, frases) {
  const parrafos = parrafosDelGuion(guion, seccion);
  const cuenta = (f) => palabras(f.texto || f.palabras.map((w) => w.p).join(" "));
  const salida = [];
  let p = 0, acumulado = 0;
  frases.forEach((f, k) => {
    if (p >= parrafos.length) throw new Error(`Sobran frases: «${f.id}» no cabe en los ${parrafos.length} párrafos de «${seccion}»`);
    salida.push(parrafos[p].fuentes);
    acumulado += cuenta(f);
    const siguiente = frases[k + 1];
    // se queda en el párrafo solo si la frase siguiente lo acerca a su tamaño
    const seQueda = siguiente && Math.abs(acumulado + cuenta(siguiente) - parrafos[p].palabras) < Math.abs(acumulado - parrafos[p].palabras);
    if (!seQueda) {
      const desvio = Math.abs(acumulado - parrafos[p].palabras);
      if (desvio > Math.max(4, parrafos[p].palabras * 0.3)) throw new Error(`Las frases no cuadran con el párrafo ${p + 1} de «${seccion}» (${acumulado} palabras frente a ${parrafos[p].palabras}): «${parrafos[p].texto.slice(0, 50)}…»`);
      p++; acumulado = 0;
    }
  });
  if (p < parrafos.length) throw new Error(`Faltan frases: quedan ${parrafos.length - p} párrafos de «${seccion}» sin frase`);
  return salida;
}

// Nombre que se enseña en pantalla: el campo `corto` de fuentes.json o, si falta, el autor hasta el primer paréntesis.
export function nombresCortos(fuentes) {
  const lista = Array.isArray(fuentes) ? fuentes : fuentes.fuentes || [];
  return Object.fromEntries(lista.map((f) => [f.id, (f.corto || (f.autor || f.id).split(" (")[0]).trim()]));
}
