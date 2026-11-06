"""MISTA procedural (iteración de detalle, 2026-11-04): un único modelo del gato atigrado del boceto de Mario, hecho de
formas (elipses, triángulos y una curva para la cola), que se rasteriza a la rejilla que se pida con sombreado por rampas
(luz arriba a la izquierda), rayas que siguen el cuerpo, ojos con iris, pupila y brillo, bigotes y contorno selectivo.
De un mismo diseño salen todas las resoluciones (48 filas a 12 px, 64×64 a 6 px, 48×48 a 8 px…) y, más adelante, las poses.

Uso: python -I gato_procedural.py --filas 48 --salida sprite.png [--escala 12] [--retrato] [--texto sprite.txt]
  --escala: tamaño de cada píxel de la imagen de salida (vista previa); --texto: vuelca la rejilla como filas de letras.
Método (pixelfx / Hugo Duprez): borrador → render → mirar → refinar. Cada vuelta se mira a tamaño real y a 360×640.
"""
import argparse, math
import numpy as np
from PIL import Image

# Rampas por material (de sombra a luz). Contorno: oscuro en la sombra, cálido en la luz (contorno selectivo).
PAL = {
    "linea": "#2b1a10", "linea_luz": "#7a3f1c",
    "naranja": ["#8e4318", "#b0602a", "#dc8a3e", "#f0a352", "#ffc47e"],
    "raya": ["#6e3212", "#8a4419", "#a5561f"],
    "crema": ["#c99a66", "#e2b986", "#f4d3a1", "#fff0d6"],
    "rosa": ["#b65a68", "#e8919c", "#f6b8c0"],
    "ojo": ["#5e6a18", "#9aa232", "#d8c94a", "#efe27a"],
    "pupila": "#1d140a", "brillo": "#fffbe8", "nariz": ["#b65a68", "#e8919c"], "boca": "#5a2c18",
    "bigote": "#fff3dc",
}
LUZ = np.array([-0.55, -0.75, 0.38]); LUZ = LUZ / np.linalg.norm(LUZ)


def elipse(x, y, cx, cy, rx, ry):
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2


def tri(x, y, a, b, c):
    def s(p, q, r):
        return (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1])
    d1, d2, d3 = s((x, y), a, b), s((x, y), b, c), s((x, y), c, a)
    neg = (d1 < 0) | (d2 < 0) | (d3 < 0); pos = (d1 > 0) | (d2 > 0) | (d3 > 0)
    return ~(neg & pos)


def sombra(nx, ny):
    """Valor de luz 0..1 a partir de la normal de una superficie elipsoidal (nx, ny en -1..1)."""
    nz = np.sqrt(np.clip(1 - nx ** 2 - ny ** 2, 0, 1))
    return np.clip(0.28 + 0.72 * (nx * LUZ[0] + ny * LUZ[1] + nz * LUZ[2]), 0, 1)


UMBRALES = {5: [0.16, 0.36, 0.74, 0.9], 4: [0.3, 0.6, 0.88], 3: [0.33, 0.7], 2: [0.5], 1: []}


def rampa(v, colores):
    """Índice de tono: umbrales sesgados hacia el tono base (el del medio), para que la sombra no ensucie."""
    u = UMBRALES[len(colores)]
    return np.searchsorted(np.array(u), v, side="right")


def modelo(filas, retrato=False):
    """Devuelve una rejilla de colores (H×W de strings hex o None). Coordenadas normalizadas: el gato sentado mide 1.0 de alto."""
    W = filas if not retrato else filas
    H = filas
    # Centro de cada píxel en coordenadas del modelo (ancho del lienzo = 1.0 si es cuadrado)
    ys, xs = np.mgrid[0:H, 0:W]
    if retrato:  # solo la cabeza, encuadrada
        x = 0.14 + (xs + 0.5) / W * 0.72; y = -0.02 + (ys + 0.5) / H * 0.60
    else:
        x = (xs + 0.5) / W; y = (ys + 0.5) / H
    out = np.full((H, W), None, dtype=object)
    capa = np.zeros((H, W), dtype=int)  # para el contorno: 1 = gato

    def pinta(mascara, colores_o_color, valor=None, prioridad=None):
        m = mascara & (out == None) if prioridad is None else mascara
        if isinstance(colores_o_color, str):
            out[m] = colores_o_color
        else:
            idx = rampa(valor, colores_o_color)
            for k, c in enumerate(colores_o_color):
                out[m & (idx == k)] = c
        capa[mascara] = 1

    # --- rasgos de la cara (se pintan primero: tienen prioridad) ---
    hx, hy, hrx, hry = 0.5, 0.33, 0.29, 0.215
    for sx in (-1, 1):
        ex, ey = 0.5 + sx * 0.105, 0.325
        ojo = elipse(x, y, ex, ey, 0.052, 0.058) <= 1
        iris_v = np.clip(0.35 + (y - ey) / 0.11 + 0.15, 0, 0.99)  # el iris se aclara hacia abajo
        pupila = elipse(x, y, ex + 0.004, ey + 0.004, 0.016, 0.046) <= 1
        brillo = elipse(x, y, ex - 0.018, ey - 0.022, 0.014, 0.014) <= 1
        pinta(ojo & brillo, PAL["brillo"]); pinta(ojo & pupila, PAL["pupila"])
        pinta(ojo, PAL["ojo"], iris_v)
        # párpado superior oscuro (da expresión)
        pinta((elipse(x, y, ex, ey, 0.064, 0.07) <= 1) & (elipse(x, y, ex, ey, 0.052, 0.058) > 1) & (y < ey - 0.02), PAL["linea"])
    nariz = tri(x, y, (0.465, 0.392), (0.535, 0.392), (0.5, 0.428))
    pinta(nariz & (y < 0.405), PAL["nariz"][1]); pinta(nariz, PAL["nariz"][0])
    boca = ((np.abs(x - 0.5) < 0.006) & (y > 0.425) & (y < 0.445)) | \
           ((np.abs(y - (0.447 + 0.25 * (x - 0.5) ** 2 * 40)) < 0.007) & (np.abs(x - 0.5) < 0.05) & (np.abs(x - 0.5) > 0.004))
    pinta(boca, PAL["boca"])
    # --- cabeza ---
    cabeza = (elipse(x, y, hx, hy, hrx, hry) <= 1)
    mejillas = (elipse(x, y, hx - 0.21, hy + 0.08, 0.10, 0.08) <= 1) | (elipse(x, y, hx + 0.21, hy + 0.08, 0.10, 0.08) <= 1)
    orejas = tri(x, y, (0.255, 0.215), (0.24, 0.035), (0.40, 0.155)) | tri(x, y, (0.745, 0.215), (0.76, 0.035), (0.60, 0.155))
    oreja_in = tri(x, y, (0.28, 0.19), (0.265, 0.075), (0.37, 0.16)) | tri(x, y, (0.72, 0.19), (0.735, 0.075), (0.63, 0.16))
    hocico = (elipse(x, y, 0.47, 0.425, 0.06, 0.045) <= 1) | (elipse(x, y, 0.53, 0.425, 0.06, 0.045) <= 1) | (elipse(x, y, 0.5, 0.465, 0.07, 0.04) <= 1)
    # ceja/frente: la «M» del atigrado
    frente = cabeza & (y < 0.27) & (np.abs(x - 0.5) < 0.16)
    rayaM = np.zeros_like(frente)
    for k in (-1, 0, 1):
        cxk = 0.5 + k * 0.06 * (1 - (y - 0.15) / 0.2)
        rayaM |= frente & (np.abs(x - cxk) < 0.012) & (y > 0.155) & (y < 0.255 - abs(k) * 0.03)
    pinta(oreja_in, PAL["rosa"], np.clip(1 - (y - 0.07) / 0.14, 0, 0.99))
    vcab = sombra((x - hx) / (hrx * 1.15), (y - hy) / (hry * 1.15))
    pinta(hocico, PAL["crema"], np.clip(vcab + 0.15, 0, 0.99))
    pinta(rayaM, PAL["raya"], vcab)
    # rayas de las mejillas (3 trazos horizontales a cada lado)
    for sx in (-1, 1):
        for k in range(2):
            r = (np.abs(y - (0.37 + k * 0.035) + sx * (x - 0.5) * 0.0) < 0.009) & (sx * (x - 0.5) > 0.19) & (sx * (x - 0.5) < 0.30)
            pinta(r & (cabeza | mejillas), PAL["raya"], vcab)
    pinta(cabeza | mejillas | orejas, PAL["naranja"], vcab)
    if retrato:
        return out, capa
    # --- cuerpo sentado ---
    bx, by, brx, bry = 0.5, 0.735, 0.255, 0.235
    cuerpo = elipse(x, y, bx, by, brx, bry) <= 1
    ancas = (elipse(x, y, 0.29, 0.85, 0.13, 0.125) <= 1) | (elipse(x, y, 0.71, 0.85, 0.13, 0.125) <= 1)
    pecho = elipse(x, y, 0.5, 0.635, 0.105, 0.13) <= 1
    patas = (np.abs(x - 0.42) < 0.045) & (y > 0.70) & (y < 0.955) | (np.abs(x - 0.58) < 0.045) & (y > 0.70) & (y < 0.955)
    zarpas = (elipse(x, y, 0.415, 0.955, 0.06, 0.035) <= 1) | (elipse(x, y, 0.585, 0.955, 0.06, 0.035) <= 1)
    vcue = sombra((x - bx) / (brx * 1.2), (y - by) / (bry * 1.2))
    # sombra bajo la cabeza (oclusión)
    ocl = (y < 0.6) & (np.abs(x - 0.5) < 0.25)
    pinta(zarpas, PAL["crema"], np.clip(sombra((x - 0.5) * 3, (y - 0.94) * 8) + 0.1, 0, 0.99))
    # dedos: separaciones en las zarpas
    for zx in (0.415, 0.585):
        for d in (-0.02, 0.02):
            pinta((np.abs(x - (zx + d)) < 0.004) & (y > 0.94) & (y < 0.975), PAL["crema"][0])
    vpat = np.clip(sombra(((x - 0.42) * (x < 0.5) + (x - 0.58) * (x >= 0.5)) / 0.06, 0.15 + 0 * y), 0, 0.99)
    rayas_pata = patas & (np.abs(((y - 0.70) / 0.05) - np.round((y - 0.70) / 0.05)) < 0.18)
    pinta(rayas_pata & (np.abs(x - 0.5) > 0.11), PAL["raya"], vpat)
    pinta(patas, PAL["naranja"], vpat)
    pinta(pecho, PAL["crema"], np.clip(vcue - 0.05 - ocl * 0.25, 0, 0.99))
    # rayas del cuerpo: bandas curvas que siguen el costado
    fase = (y - 0.56) / 0.085 + ((x - 0.5) ** 2) * 7
    raya = (np.abs(fase - np.round(fase)) < 0.16) & (np.abs(x - 0.5) > 0.15)
    pinta((cuerpo | ancas) & raya, [PAL["raya"][1], PAL["raya"][2]], vcue)
    pinta(ancas, PAL["naranja"], np.clip(sombra((x - 0.5) * 2.4, (y - 0.85) * 4) , 0, 0.99))
    pinta(cuerpo, PAL["naranja"], np.clip(vcue - ocl * 0.3, 0, 0.99))
    # cola: curva por detrás, abajo a la izquierda, con rayas y punta crema
    for k in range(60):
        u = k / 59
        cxl = 0.27 - 0.20 * u + 0.03 * math.sin(u * 5); cyl = 0.93 - 0.30 * u - 0.10 * u * u
        disco = elipse(x, y, cxl, cyl, 0.036, 0.036) <= 1
        if u > 0.86:
            pinta(disco, PAL["crema"], np.full(x.shape, 0.7))
        elif int(u * 9) % 2 == 1:
            pinta(disco, PAL["raya"], np.full(x.shape, 0.6))
        else:
            pinta(disco, PAL["naranja"], np.clip(sombra((x - cxl) / 0.05, (y - cyl) / 0.05), 0, 0.99))
    return out, capa


OJO_AMBAR = ["#a8661a", "#d08e2a", "#eab048", "#f8d97e"]


def modelo_boceto(filas, retrato=False):
    """Diseño fiel al boceto de Mario (vista 3/4, de pie): cabeza pequeña, cuello y pecho crema, torso esbelto, cuatro
    patas largas con almohadillas crema, cola alzada con anillos y punta crema, ojos ámbar. Coordenadas normalizadas."""
    H = W = filas
    ys, xs = np.mgrid[0:H, 0:W]
    if retrato:
        x = 0.13 + (xs + 0.5) / W * 0.36; y = 0.035 + (ys + 0.5) / H * 0.36
    else:
        x = (xs + 0.5) / W; y = (ys + 0.5) / H
    out = np.full((H, W), None, dtype=object)
    capa = np.zeros((H, W), dtype=int)

    def pinta(m, col, v=None):
        m2 = m & (out == None)
        if isinstance(col, str):
            out[m2] = col
        else:
            idx = rampa(v, col)
            for k, c in enumerate(col):
                out[m2 & (idx == k)] = c
        capa[m] = 1

    N, R, C = PAL["naranja"], PAL["raya"], PAL["crema"]
    # --- cara (vista 3/4: el ojo lejano, más pequeño) ---
    hx, hy = 0.30, 0.27
    for ex, ey, rx, ry in ((0.254, 0.262, 0.041, 0.046), (0.345, 0.258, 0.035, 0.043)):
        ojo = elipse(x, y, ex, ey, rx, ry) <= 1
        pinta(ojo & (elipse(x, y, ex - rx * 0.38, ey - ry * 0.38, rx * 0.36, ry * 0.32) <= 1), PAL["brillo"])
        pinta(ojo & (elipse(x, y, ex + rx * 0.06, ey + 0.004, rx * 0.2, ry * 0.7) <= 1), PAL["pupila"])  # pupila en rendija
        pinta(ojo, OJO_AMBAR, np.clip(0.55 + (y - ey) / (ry * 2.4), 0, 0.99))
        pinta((elipse(x, y, ex, ey, rx * 1.3, ry * 1.25) <= 1) & (elipse(x, y, ex, ey, rx, ry) > 1), "#3a2010")  # aro oscuro: separa el ojo del pelaje
    pinta(tri(x, y, (0.283, 0.303), (0.317, 0.303), (0.30, 0.322)), PAL["nariz"][1])
    pinta((np.abs(x - 0.30) < 0.0045) & (y > 0.32) & (y < 0.334), PAL["boca"])
    pinta((np.abs(y - (0.336 + (x - 0.30) ** 2 * 25)) < 0.005) & (np.abs(x - 0.30) < 0.03) & (np.abs(x - 0.30) > 0.004), PAL["boca"])
    cabeza = (elipse(x, y, hx, hy, 0.13, 0.11) <= 1) | (elipse(x, y, hx, 0.305, 0.135, 0.075) <= 1)
    hocico = (elipse(x, y, 0.285, 0.322, 0.03, 0.022) <= 1) | (elipse(x, y, 0.315, 0.322, 0.03, 0.022) <= 1) | (elipse(x, y, 0.30, 0.345, 0.035, 0.02) <= 1)
    orejas = tri(x, y, (0.185, 0.215), (0.19, 0.065), (0.27, 0.165)) | tri(x, y, (0.33, 0.16), (0.415, 0.07), (0.415, 0.215))
    oreja_in = tri(x, y, (0.20, 0.195), (0.20, 0.095), (0.255, 0.165)) | tri(x, y, (0.345, 0.165), (0.40, 0.10), (0.40, 0.195))
    vcab = sombra((x - hx) / 0.16, (y - hy) / 0.14)
    frente = cabeza & (y < 0.235) & (np.abs(x - 0.30) < 0.075)
    rayaM = np.zeros_like(frente)
    for k in (-1, 0, 1):
        rayaM |= frente & (np.abs(x - (0.30 + k * 0.03 * (1 - (y - 0.165) / 0.05))) < 0.0075) & (y > 0.165) & (y < 0.212 - abs(k) * 0.012)
    pinta(oreja_in, PAL["rosa"], np.clip(1 - (y - 0.09) / 0.12, 0, 0.99))
    pinta(hocico, C, np.clip(vcab + 0.15, 0, 0.99))
    pinta(rayaM, R, vcab)
    for sx in (-1, 1):  # rayas de las mejillas
        for k in range(2):
            pinta(cabeza & (np.abs(y - (0.29 + k * 0.022)) < 0.006) & (sx * (x - 0.30) > 0.085) & (sx * (x - 0.30) < 0.14), R, vcab)
    pinta(cabeza | orejas, N, vcab)
    if retrato:
        return out, capa
    # --- cuello y pecho crema, torso, ancas ---
    pecho = elipse(x, y, 0.30, 0.49, 0.075, 0.13) <= 1
    cuello = elipse(x, y, 0.33, 0.48, 0.12, 0.15) <= 1
    torso = elipse(x, y, 0.56, 0.54, 0.25, 0.14) <= 1
    anca = elipse(x, y, 0.74, 0.60, 0.125, 0.14) <= 1
    vtor = sombra((x - 0.56) / 0.3, (y - 0.52) / 0.17)
    # patas: la cercana (izquierda) en luz y la lejana (derecha de cada par) en sombra
    def pata(x0, x1, y0, y1, ancho):
        t = np.clip((y - y0) / (y1 - y0), 0, 1)
        return (np.abs(x - (x0 + (x1 - x0) * t)) < ancho) & (y >= y0) & (y <= y1)
    patas_cerca = pata(0.29, 0.29, 0.56, 0.905, 0.036) | pata(0.70, 0.685, 0.66, 0.905, 0.04) | (elipse(x, y, 0.70, 0.68, 0.06, 0.07) <= 1)
    patas_lejos = pata(0.385, 0.385, 0.58, 0.895, 0.03) | pata(0.80, 0.81, 0.68, 0.895, 0.032)
    zarpas = (elipse(x, y, 0.285, 0.913, 0.04, 0.02) <= 1) | (elipse(x, y, 0.685, 0.913, 0.042, 0.02) <= 1)
    zarpas_l = (elipse(x, y, 0.388, 0.902, 0.034, 0.018) <= 1) | (elipse(x, y, 0.81, 0.902, 0.036, 0.018) <= 1)
    pinta(zarpas, C, np.full(x.shape, 0.6)); pinta(zarpas_l, C, np.full(x.shape, 0.25))
    banda = lambda y0, paso: np.abs((y - y0) / paso - np.round((y - y0) / paso)) < 0.17
    pinta(patas_cerca & banda(0.62, 0.095), [R[2]], np.full(x.shape, 0.6))
    pinta(patas_cerca, N, np.clip(0.55 + (0.03 - np.abs(x - 0.29) * 0) * 0, 0, 0.99) * 0 + np.where(x < 0.5, 0.62, 0.55))
    pinta(patas_lejos & banda(0.64, 0.095), [R[1]], np.full(x.shape, 0.2))
    pinta(patas_lejos, N, np.full(x.shape, 0.3))
    pinta(pecho, C, np.clip(sombra((x - 0.30) / 0.09, (y - 0.47) / 0.15), 0, 0.99))
    # rayas del lomo: bandas casi verticales, perpendiculares al espinazo, solo por encima de la tripa
    fase = (x - 0.40) / 0.075 - (y - 0.45) * 2.0 + np.sin(y * 40) * 0.18
    rayas = (np.abs(fase - np.round(fase)) < 0.19) & (y < 0.61) & (x > 0.40)
    pinta((torso | anca) & rayas, [R[1], R[2]], vtor)
    tripa = torso & (y > 0.61)
    pinta(tripa, [N[3], N[4]], np.clip(vtor, 0, 0.99))
    pinta(cuello, N, np.clip(sombra((x - 0.33) / 0.14, (y - 0.44) / 0.17), 0, 0.99))
    pinta(anca, N, np.clip(sombra((x - 0.74) / 0.15, (y - 0.54) / 0.16), 0, 0.99))
    pinta(torso, N, vtor)
    # cola alzada por detrás, en S, con anillos y punta crema
    for k in range(70):
        u = k / 69
        cx = 0.83 + 0.10 * math.sin(u * 2.4) - 0.03 * u; cy = 0.50 - 0.33 * u
        r = 0.029 - 0.008 * u
        disco = elipse(x, y, cx, cy, r, r) <= 1
        if u > 0.86:
            pinta(disco, C, np.clip(sombra((x - cx) / (r * 1.4), (y - cy) / (r * 1.4)), 0, 0.99))
        elif int(u * 10) % 2 == 1:
            pinta(disco, R, np.full(x.shape, 0.6))
        else:
            pinta(disco, N, np.clip(sombra((x - cx) / (r * 1.4), (y - cy) / (r * 1.4)), 0, 0.99))
    return out, capa


def bigotes_boceto(rej, filas):
    H, W = rej.shape
    for x0, y0, x1, y1 in ((0.262, 0.326, 0.15, 0.30), (0.262, 0.333, 0.15, 0.345), (0.338, 0.326, 0.44, 0.305), (0.338, 0.333, 0.44, 0.345)):
        n = int(abs(x1 - x0) * W) + 1
        for s in range(n):
            u = s / max(n - 1, 1)
            i, j = int((x0 + (x1 - x0) * u) * W), int((y0 + (y1 - y0) * u) * H)
            if 0 <= i < W and 0 <= j < H and (rej[j, i] is None or u > 0.35):
                rej[j, i] = PAL["bigote"]
    return rej


def sombra_suelo(rej):
    H, W = rej.shape
    for j in range(H):
        for i in range(W):
            x, y = (i + 0.5) / W, (j + 0.5) / H
            if rej[j, i] is None and ((x - 0.55) / 0.33) ** 2 + ((y - 0.93) / 0.03) ** 2 <= 1:
                rej[j, i] = "#00000055"
    return rej


def textura(out, filas, semilla=7):
    """Motas de pelaje: algunos píxeles del tono base pasan al tono vecino (luz o sombra), sin tocar bordes ni rasgos."""
    rng = np.random.default_rng(semilla)
    H, W = out.shape
    n = PAL["naranja"]
    for j in range(1, H - 1):
        for i in range(1, W - 1):
            c = out[j, i]
            if c == n[2] and all(out[j + dj, i + di] == n[2] for dj, di in ((-1, 0), (1, 0), (0, -1), (0, 1))):
                p = rng.random()
                if p < 0.07: out[j, i] = n[3] if (i + j) % 3 else n[1]
            elif c == n[3] and rng.random() < 0.05 and all(out[j + dj, i + di] in (n[3], n[2]) for dj, di in ((-1, 0), (0, -1))):
                out[j, i] = n[4]
    return out


def contorno(out, capa):
    H, W = out.shape
    res = out.copy()
    for j in range(H):
        for i in range(W):
            if capa[j, i]:
                continue
            vec = [(j + dj, i + di) for dj, di in ((-1, 0), (1, 0), (0, -1), (0, 1)) if 0 <= j + dj < H and 0 <= i + di < W]
            if any(capa[a, b] for a, b in vec):
                # contorno selectivo: más cálido arriba a la izquierda (lado de la luz)
                res[j, i] = PAL["linea_luz"] if (j < H * 0.45 and i < W * 0.45) else PAL["linea"]
    # limpieza: píxeles sueltos de un color distinto a todos sus vecinos dentro del gato
    return res


def bigotes(rej, filas):
    if filas < 56:  # a 48 filas o menos, un bigote de 12 px se lee como un palo: se omiten
        return rej
    H, W = rej.shape
    for sx in (-1, 1):
        lista = ((0.405, -0.05), (0.428, 0.05)) if filas >= 56 else ((0.418, 0.0),)
        for k, (y0, pend) in enumerate(lista):
            for i in range(W):
                x = (i + 0.5) / W
                d = sx * (x - 0.5)
                if 0.285 < d < 0.40:
                    y = y0 + pend * (d - 0.285) / 0.115
                    j = int(y * H)
                    if 0 <= j < H:
                        if rej[j, i] is None or d > 0.30:
                            rej[j, i] = PAL["bigote"]
    return rej


def a_imagen(rej, escala, fondo=None):
    H, W = rej.shape
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0) if fondo is None else fondo)
    px = im.load()
    for j in range(H):
        for i in range(W):
            c = rej[j, i]
            if c:
                px[i, j] = tuple(int(c[k:k + 2], 16) for k in (1, 3, 5)) + ((int(c[7:9], 16),) if len(c) == 9 else (255,))
    return im.resize((W * escala, H * escala), Image.NEAREST)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--filas", type=int, required=True); ap.add_argument("--salida", required=True)
    ap.add_argument("--escala", type=int, default=12); ap.add_argument("--retrato", action="store_true"); ap.add_argument("--texto")
    ap.add_argument("--diseno", choices=["boceto", "chibi"], default="boceto")
    a = ap.parse_args()
    if a.diseno == "chibi":
        out, capa = modelo(a.filas, a.retrato)
        rej = bigotes(contorno(textura(out, a.filas), capa), a.filas if not a.retrato else 0)
    else:
        out, capa = modelo_boceto(a.filas, a.retrato)
        rej = contorno(textura(out, a.filas), capa)
        if not a.retrato:
            rej = sombra_suelo(bigotes_boceto(rej, a.filas))
    a_imagen(rej, a.escala).save(a.salida)
    if a.texto:
        colores = sorted({c for c in rej.flat if c})
        letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        mapa = {c: letras[k] for k, c in enumerate(colores)}
        with open(a.texto, "w", encoding="utf-8") as fh:
            fh.write("// " + " ".join(f"{v}={k}" for k, v in mapa.items()) + "\n")
            for fila in rej:
                fh.write("".join(mapa[c] if c else "." for c in fila) + "\n")


if __name__ == "__main__":
    main()
