"""Colores de acento (saturados y luminosos) de cada referencia, para el borrador de tokens (C3).

Uso: python -I herramientas/c3_acentos.py <raiz_principal> ref-01 [ref-02 ...]
Toma los fotogramas f_*.png de .runtime/referencias/<id>/, se queda con los píxeles de saturación
≥ 0,45 y brillo ≥ 0,45 (HSV), los agrupa por tono en cubetas de 15° y da el color medio de cada
cubeta con su % sobre los píxeles de acento. Imprime también qué % de la imagen es acento.
"""
import colorsys
import sys
from pathlib import Path

from PIL import Image

ANCHO = 120
SAT_MIN = 0.45
VAL_MIN = 0.45


def main():
    raiz, ids = Path(sys.argv[1]), sys.argv[2:]
    for id_ in ids:
        cubetas, total, acento = {}, 0, 0
        for f in sorted((raiz / ".runtime" / "referencias" / id_).glob("f_*.png")):
            with Image.open(f) as im:
                im = im.convert("RGB")
                im = im.resize((ANCHO, max(1, round(im.height * ANCHO / im.width))), Image.Resampling.BOX)
                for r, g, b in im.getdata():
                    total += 1
                    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                    if s >= SAT_MIN and v >= VAL_MIN:
                        acento += 1
                        c = cubetas.setdefault(int(h * 360) // 15, [0, 0, 0, 0])
                        c[0] += r; c[1] += g; c[2] += b; c[3] += 1
        filas = sorted(cubetas.items(), key=lambda kv: -kv[1][3])[:6]
        print(f"{id_}: acento = {100 * acento / max(total, 1):.2f} % de la imagen")
        for cub, (r, g, b, n) in filas:
            print(f"   tono {cub * 15:3d}-{cub * 15 + 14:3d}°  #{r // n:02x}{g // n:02x}{b // n:02x}  {100 * n / acento:5.1f} % del acento")


if __name__ == "__main__":
    main()
