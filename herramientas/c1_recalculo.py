"""Recalcula cortes de plano y paleta de las referencias (calibración C1) con un método común.

Uso: python -I herramientas/c1_recalculo.py <raiz_principal> <dir_analisis> ref-01 [ref-02 ...]
  raiz_principal: checkout con referencias/ y .runtime/ (vídeos y fotogramas).
  dir_analisis:   carpeta con los <id>.json que se actualizan.

- Cortes: puntuación de escena de FFmpeg en cada fotograma; umbrales 0,05 / 0,1 / 0,2 / 0,3 y separación
  mínima de 0,25 s (un destello de varios fotogramas cuenta como un corte). Los fundidos encadenados
  apenas puntúan: si la puntuación máxima es baja, el número de planos no es fiable.
- Paleta: mosaico de todos los fotogramas f_*.png reducidos a 96 px de ancho, cuantizado a 16 colores
  (mediana) → % de cada color sobre el total (suma ~100 %).
"""
import json
import re
import statistics
import subprocess
import sys
from pathlib import Path

from PIL import Image

UMBRALES = (0.05, 0.1, 0.2, 0.3)
SEPARACION_MIN = 0.25
ANCHO_MOSAICO = 96
COLORES = 16


def puntuaciones(video: Path):
    cmd = ["ffmpeg", "-hide_banner", "-nostats", "-i", str(video), "-an",
           "-vf", "select='gte(scene,0)',metadata=print:key=lavfi.scene_score", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    t, res = None, []
    for linea in err.splitlines():
        m = re.search(r"pts_time:([\d.]+)", linea)
        if m:
            t = float(m.group(1))
        m = re.search(r"lavfi\.scene_score=([\d.]+)", linea)
        if m and t is not None:
            res.append((t, float(m.group(1))))
    return res


def planos(scores, duracion, umbral):
    cortes = []
    for t, s in scores:
        if s > umbral and (not cortes or t - cortes[-1] >= SEPARACION_MIN):
            cortes.append(t)
    bordes = [0.0] + cortes + [duracion]
    dur = [b - a for a, b in zip(bordes, bordes[1:]) if b - a > 0]
    dur_ord = sorted(dur)
    p90 = dur_ord[min(len(dur_ord) - 1, int(round(0.9 * (len(dur_ord) - 1))))]
    return {"n": len(dur), "media_s": round(statistics.mean(dur), 2),
            "mediana_s": round(statistics.median(dur), 2), "p90_s": round(p90, 2),
            "cortes_s": [round(c, 2) for c in cortes]}


def paleta(dir_fotos: Path):
    fotos = sorted(dir_fotos.glob("f_*.png"))
    if not fotos:
        return [], 0
    miniaturas = []
    for f in fotos:
        with Image.open(f) as im:
            im = im.convert("RGB")
            alto = max(1, round(im.height * ANCHO_MOSAICO / im.width))
            miniaturas.append(im.resize((ANCHO_MOSAICO, alto), Image.Resampling.BOX))
    alto = miniaturas[0].height
    mosaico = Image.new("RGB", (ANCHO_MOSAICO, alto * len(miniaturas)))
    for i, m in enumerate(miniaturas):
        mosaico.paste(m.resize((ANCHO_MOSAICO, alto)), (0, i * alto))
    q = mosaico.quantize(COLORES, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: COLORES * 3]
    total = q.width * q.height
    cuenta = sorted(q.getcolors(COLORES * 4), reverse=True)
    res = []
    for n, idx in cuenta:
        r, g, b = pal[idx * 3: idx * 3 + 3]
        res.append({"hex": f"#{r:02x}{g:02x}{b:02x}", "pct": round(100 * n / total, 2)})
    return res, len(fotos)


def main():
    raiz, dir_analisis, ids = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3:]
    for id_ in ids:
        ruta_json = dir_analisis / f"{id_}.json"
        datos = json.loads(ruta_json.read_text(encoding="utf-8"))
        duracion = float(datos["duracion_s"])
        scores = puntuaciones(raiz / "referencias" / f"{id_}.mp4")
        datos["planos"] = planos(scores, duracion, 0.1)
        datos["planos_umbral"] = 0.1
        datos["planos_sensibilidad"] = {str(u): planos(scores, duracion, u) for u in UMBRALES}
        datos["planos_score_max"] = round(max((s for _, s in scores), default=0.0), 3)
        pal, n_fotos = paleta(raiz / ".runtime" / "referencias" / id_)
        datos["paleta"] = pal
        datos["paleta_metodo"] = (f"mosaico de {n_fotos} fotogramas a {ANCHO_MOSAICO} px, "
                                  f"cuantizado a {COLORES} colores (mediana)")
        datos["recalculo"] = "herramientas/c1_recalculo.py, 2026-10-29"
        ruta_json.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        s = datos["planos_sensibilidad"]
        print(id_, "| fotogramas puntuados:", len(scores),
              "| planos 0.05/0.1/0.2/0.3:", s["0.05"]["n"], s["0.1"]["n"], s["0.2"]["n"], s["0.3"]["n"], "| score max:", datos["planos_score_max"],
              "| mediana 0.1:", s["0.1"]["mediana_s"], "s",
              "| paleta suma:", round(sum(p["pct"] for p in pal), 1), "% top3:",
              [p["hex"] for p in pal[:3]])


if __name__ == "__main__":
    main()
