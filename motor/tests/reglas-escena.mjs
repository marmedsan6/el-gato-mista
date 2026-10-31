// Patrones prohibidos en las escenas (docs/criterios.md §1). Los usa tests/lint-escena.test.mjs.
export const PROHIBIDO = [
  [/\btransition\s*:/, "CSS transition"],
  [/\banimation(-name)?\s*:/, "CSS animation"],
  [/@keyframes/, "@keyframes"],
  [/\bsetTimeout\s*\(/, "setTimeout"],
  [/\bsetInterval\s*\(/, "setInterval"],
  [/\brequestAnimationFrame\s*\(/, "requestAnimationFrame"],
  [/\bDate\.now\s*\(/, "Date.now"],
  [/\bnew Date\s*\(\s*\)/, "new Date()"],
  [/\bperformance\.now\s*\(/, "performance.now"],
  [/\bMath\.random\s*\(/, "Math.random (usa mulberry32 con semilla)"],
  [/(?:src|href|url)\s*[=(]\s*["']?https?:\/\//, "recurso de red (fuentes y librerías, siempre locales)"],
];

// Quita comentarios para no dar falsos positivos con textos que explican la regla.
export const sinComentarios = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");

export function infracciones(texto) {
  const fallos = [];
  sinComentarios(texto).split("\n").forEach((l, i) => {
    for (const [re, nombre] of PROHIBIDO) if (re.test(l)) fallos.push({ linea: i + 1, nombre });
  });
  return fallos;
}
