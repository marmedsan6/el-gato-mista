// Compara píxel a píxel dos carpetas de PNG con el mismo nombre: iguales, distintos, máx. diferencia y PSNR.
import pngjs from "file:///C:/Users/mario/proyectos/canal-videos/motor/node_modules/pngjs/lib/png.js";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const { PNG } = pngjs; const [a, b] = process.argv.slice(2);
let iguales = 0, distintos = 0, maxd = 0, peor = null, peorPsnr = Infinity, pxDist = 0, pxTot = 0;
for (const f of readdirSync(a).filter((n) => n.endsWith(".png"))) {
  const A = PNG.sync.read(readFileSync(join(a, f))), Bb = PNG.sync.read(readFileSync(join(b, f)));
  let se = 0, n = 0, m = 0;
  for (let i = 0; i < A.data.length; i += 4) { let px = false; for (let c = 0; c < 3; c++) { const d = Math.abs(A.data[i + c] - Bb.data[i + c]); if (d) { px = true; se += d * d; m = Math.max(m, d); } } if (px) n++; }
  pxTot += A.width * A.height; pxDist += n;
  if (!n) iguales++; else { distintos++; const psnr = 10 * Math.log10(255 * 255 / (se / (A.width * A.height * 3))); if (psnr < peorPsnr) { peorPsnr = psnr; peor = f; } maxd = Math.max(maxd, m); }
}
console.log(JSON.stringify({ iguales, distintos, max_diferencia: maxd, pct_pixeles_distintos: +(100 * pxDist / pxTot).toFixed(4), peor_psnr_db: peor ? +peorPsnr.toFixed(1) : null, peor }));
