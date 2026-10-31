// Genera el proyecto HyperFrames de un formato a partir de plantilla.html.
// La escena es la de motor/piloto/comun/escena.mjs (se incrusta tal cual, sin `export`): una sola fuente de verdad.
// Uso: node preparar.mjs <largo|short>   → imprime la carpeta del proyecto
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const raizRuntime = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";

export async function preparar(formato, sufijo = "") {
  const { LIENZO } = await import(pathToFileURL(resolve(aqui, "..", "comun", "escena.mjs")).href);
  const [W, H] = LIENZO[formato];
  const escena = readFileSync(resolve(aqui, "..", "comun", "escena.mjs"), "utf8").replace(/^export /gm, "");
  const html = readFileSync(join(aqui, "plantilla.html"), "utf8")
    .replaceAll("__W__", String(W)).replaceAll("__H__", String(H)).replaceAll("__FORMATO__", formato)
    .replace("/*__ESCENA__*/", () => escena);
  const dir = join(raizRuntime, "piloto", "hyperframes", `proyecto-${formato}${sufijo}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  copyFileSync(resolve(aqui, "..", "..", "..", "marca", "fuentes", "press-start-2p", "PressStart2P-Regular.ttf"),
    join(dir, "PressStart2P-Regular.ttf"));
  writeFileSync(join(dir, "meta.json"), JSON.stringify({ id: `piloto-01-${formato}`, name: `piloto-01 ${formato}` }));
  return dir;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await preparar(process.argv[2] || "largo"));
}
