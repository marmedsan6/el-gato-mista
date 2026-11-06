// Exporta efectos de pixelfx (MIT, github.com/patch-gg/pixelfx; dependencia de motor/) a hojas de sprites PNG en
// motor/estilo/v3/fx/ (ignoradas por git: se regeneran con este script) y escribe sus metadatos en
// motor/estilo/v3/fx/fx-meta.js (window.FX_META), que las escenas cargan como script clásico (nada de módulos ES ni fetch
// desde file://). Uso: node fx-exportar.mjs
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const PFX = join(AQUI, "node_modules", "pixelfx");
const DESTINO = join(AQUI, "estilo", "v3", "fx");
const TMP = join(AQUI, "..", ".fx-tmp");

// nombre → efecto de pixelfx y opciones (paleta: rampa de oscuro a claro, recoloreada con los tokens de la marca)
export const EFECTOS = [
  { nombre: "escaner", id: "scifi/scanner", opts: {} },
  { nombre: "carga", id: "arcane/spell-charge", opts: { palette: ["#14203d", "#2a3f7a", "#3d68ba", "#5b8cff", "#c9d6ff", "#ffffff"] } },
  { nombre: "chispa", id: "lightning/spark-arc", opts: {} },
];

mkdirSync(DESTINO, { recursive: true });
const meta = {};
for (const { nombre, id, opts } of EFECTOS) {
  execFileSync("node", ["tools/render.mjs", id, "--sheet", "--bg", "none", "--opts", JSON.stringify(opts), "--out", TMP], { cwd: PFX, stdio: "ignore" });
  const base = id.split("/")[1], dir = join(TMP, id);
  if (!existsSync(join(dir, `${base}.png`))) throw new Error(`pixelfx no generó ${id}`);
  copyFileSync(join(dir, `${base}.png`), join(DESTINO, `${nombre}.png`));
  const m = JSON.parse(readFileSync(join(dir, `${base}.json`), "utf8")).meta.pixelfx;
  meta[nombre] = { id, fps: m.fps, loop: m.loop, frames: m.frames, w: m.frameSize[0], h: m.frameSize[1], cols: m.columns, pivot: m.pivot };
}
writeFileSync(join(DESTINO, "fx-meta.js"),
  "// Generado por motor/fx-exportar.mjs (pixelfx, MIT: github.com/patch-gg/pixelfx). No editar a mano.\n" +
  "window.FX_META = " + JSON.stringify(meta, null, 1) + ";\n" +
  "window.FX_BASE = new URL(\".\", document.currentScript.src).href;\n");
console.log(JSON.stringify(meta));
