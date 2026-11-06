"""MISTA 64×64 (6 px): mezcla del MISTA de los vídeos (silueta y postura del sprite v3 de 32×32) con la referencia de
Mario (hojas de modelo, poses y expresiones del gato atigrado): ojos grandes, redondos y amarillos con pupila redonda y
brillo, pelo melocotón con rayas finas, orejas rosadas, bigotes y cola rizada. Pedido de Mario (2026-11-06): «una mezcla
del que teníamos y ese».

Pasos: sprite v3 «pie» (32×32, leído del render de motor/calibracion/v3/gato-hoja.html) → sin la cola → Scale2x (EPX:
dobla sin difuminar y suaviza diagonales) → paleta melocotón → rayas finas → ojos, nariz, boca, bigotes y cola nuevos →
textura de pelo. Uso: python -I gato_mezcla.py --salida mista64.png [--vista 8]
"""
import argparse, math
import numpy as np
from PIL import Image

# Sprite v3 «pie» leído del render (A contorno, B luz, C sombra, D rosa, E raya, F base, G brillo, H pupila, I iris,
# J crema, K crema en sombra, L contorno interior)
V3 = """\
................................
................................
................................
................................
................................
.........AA..........AA.........
.........ABA........ACA.........
.........ABDA......ADCA.........
.........ABDBAAAAAACDCA.........
........ABBBBEFEEFEFFFCA........
........ABBBFFEFFEFFFFCA........
........ABFGHIFFFFGHIFCA........
........ABFIHIFFFFIHIFCA........
........AEFFFJJDDJJFFCEA........
........AFFFFJJAAJJFFCCA........
.........AFFFKJJJJKFFCA.........
..........ACCFFKKFFCCA..........
..........AAAAAAAAAAAA..........
.........ABFFFJJJFFFFCA.........
........ABEFFJJJJJFFFECA........
........ABEFFJJJJJKFFECA........
.......ABFEFFJJJJJKFFEFCA.......
.......ABFFFFJJJJJKFFFFCA.......
.......ABFEFFFJJJKFFFEFCA.......
.......ABFFFFFJKKFFFFFCCA.......
.......AFFEFFFFFFFFFEFFCA.......
.......AFFFEFFFFFFFFEFCCA.......
.......AFFFEFFFFFFFCECCCA.......
.......AFFFLFFFFFFFCLCCA........
........AJJKKALFFFFLAKKJCA......
.........AAAAAAAAAAAAAAAA.......
................................"""

NUEVO = {  # paleta melocotón (referencia de Mario) para cada letra del v3
    "A": "#3a2a2c", "B": "#fbc993", "C": "#dd8a45", "D": "#f2a1a6", "E": "#c96f30", "F": "#f2a862",
    "G": "#f2a862", "H": "#f2a862", "I": "#f2a862", "J": "#fde3c4", "K": "#efc49c", "L": "#b4612c",
}
OJO = ["..ooo..", ".oyyyo.", "oywppyo", "oypppyo", "oypppyo", ".oYYYo.", "..ooo.."]
COLOR_OJO = {"o": "#3a2a2c", "y": "#e8c54e", "Y": "#f6de86", "p": "#1c1a24", "w": "#ffffff"}


def scale2x(g):
    """EPX: cada píxel se divide en 4 y las esquinas copian al vecino cuando dos lados coinciden (diagonales suaves)."""
    H, W = len(g), len(g[0])
    o = [[None] * (W * 2) for _ in range(H * 2)]
    at = lambda j, i: g[j][i] if 0 <= j < H and 0 <= i < W else "."
    for j in range(H):
        for i in range(W):
            P, A, B, C, D = g[j][i], at(j - 1, i), at(j, i + 1), at(j, i - 1), at(j + 1, i)
            e1 = A if (C == A and C != D and A != B) else P
            e2 = B if (A == B and A != C and B != D) else P
            e3 = C if (D == C and D != B and C != A) else P
            e4 = D if (B == D and B != A and D != C) else P
            o[2 * j][2 * i], o[2 * j][2 * i + 1], o[2 * j + 1][2 * i], o[2 * j + 1][2 * i + 1] = e1, e2, e3, e4
    return o


def construir():
    g = [list(f) for f in V3.splitlines()]
    g = scale2x(g)
    H = W = 64
    rej = np.full((H, W), None, dtype=object)
    for j in range(H):
        for i in range(W):
            ch = g[j][i]
            rej[j, i] = None if ch == "." else NUEVO[ch]
    # rayas finas: de cada raya de 2 px de alto se queda la fila de arriba
    raya = NUEVO["E"]
    for j in range(1, H):
        for i in range(W):
            if rej[j, i] == raya and rej[j - 1, i] == raya:
                rej[j, i] = NUEVO["F"]
    # el contorno entre cabeza y cuerpo (líneas interiores de 1-2 px entre zonas de pelo) pasa a sombra: parecía un collar
    A = NUEVO["A"]
    for i in range(W):
        j = 1
        while j < H - 1:
            if rej[j, i] == A:
                k = j
                while k < H and rej[k, i] == A: k += 1
                if k - j <= 2 and rej[j - 1, i] not in (None, A) and k < H and rej[k, i] not in (None, A):
                    for jj in range(j, k): rej[jj, i] = NUEVO["C"]
                j = k
            else:
                j += 1
    # ojos grandes y redondos (centros en el v3: columnas 12 y 19, filas 11-12 → aquí 24,38 · 23)
    for cx, cy in ((25, 23), (39, 23)):
        for j, fila in enumerate(OJO):
            for i, ch in enumerate(fila):
                if ch != ".":
                    rej[cy - 3 + j, cx - 3 + i] = COLOR_OJO[ch]
    # nariz rosa y boca en «w»
    for i in range(30, 34): rej[27, i] = "#e98c96"
    rej[28, 31] = rej[28, 32] = "#e98c96"
    for (i, j) in ((31, 29), (32, 29), (30, 30), (33, 30)): rej[j, i] = NUEVO["A"]
    # bigotes: 3 por lado, saliendo de las mejillas
    for sx in (-1, 1):
        for k, dy in enumerate((-1, 1, 3)):
            for s in range(8):
                i = (17 - s) if sx < 0 else (46 + s)
                j = 27 + dy + (s * (k - 1)) // 4
                if 0 <= i < W and 0 <= j < H and (rej[j, i] is None or s < 2):
                    rej[j, i] = "#fff6e6"
    A = NUEVO["A"]
    # cola: sube por el costado izquierdo (curva de Bézier) y se enrosca hacia fuera en la punta
    def bez(t, p0, p1, p2, p3):
        return tuple((1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d for a, b, c, d in zip(p0, p1, p2, p3))
    pts = [(*bez(k / 59, (17, 57), (3, 56), (3, 40), (8, 31)), k / 59 * 0.75) for k in range(60)]
    for k in range(1, 30):  # rizo: arco alrededor de (5, 30) hacia fuera
        ang = -0.1 - k / 29 * math.pi * 1.15
        pts.append((5 + 3.2 * math.cos(ang), 30 + 3.2 * math.sin(ang), 0.75 + 0.25 * k / 29))
    radio = lambda u: 2.6 - 0.9 * u
    for x, y, u in pts:  # contorno
        r = radio(u) + 1
        for j in range(int(y - r - 1), int(y + r + 2)):
            for i in range(int(x - r - 1), int(x + r + 2)):
                if 0 <= i < W and 0 <= j < H and (i - x) ** 2 + (j - y) ** 2 <= r * r and rej[j, i] is None:
                    rej[j, i] = A
    for x, y, u in pts:  # relleno: anillos de raya y punta crema
        r = radio(u)
        col = NUEVO["J"] if u > 0.88 else (NUEVO["E"] if int(u * 14) % 3 == 1 else NUEVO["F"])
        for j in range(int(y - r - 1), int(y + r + 2)):
            for i in range(int(x - r - 1), int(x + r + 2)):
                if 0 <= i < W and 0 <= j < H and (i - x) ** 2 + (j - y) ** 2 <= r * r and (rej[j, i] in (None, A) or i < 16):
                    rej[j, i] = col
    # textura de pelo: motas de luz y sombra con semilla en las zonas de color base
    rng = np.random.default_rng(11)
    for j in range(1, H - 1):
        for i in range(1, W - 1):
            if rej[j, i] == NUEVO["F"] and all(rej[j + dj, i + di] == NUEVO["F"] for dj, di in ((-1, 0), (1, 0), (0, -1), (0, 1))):
                p = rng.random()
                if p < 0.06: rej[j, i] = NUEVO["B"]
                elif p < 0.10: rej[j, i] = NUEVO["C"]
    return rej


def a_imagen(rej, escala=1):
    H, W = rej.shape
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); px = im.load()
    for j in range(H):
        for i in range(W):
            c = rej[j, i]
            if c: px[i, j] = tuple(int(c[k:k + 2], 16) for k in (1, 3, 5)) + (255,)
    return im.resize((W * escala, H * escala), Image.NEAREST) if escala > 1 else im


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--salida", required=True); ap.add_argument("--vista", type=int, default=0)
    a = ap.parse_args()
    rej = construir()
    a_imagen(rej).save(a.salida)
    if a.vista: a_imagen(rej, a.vista).save(a.salida.replace(".png", f"_x{a.vista}.png"))


if __name__ == "__main__":
    main()
