# Conversor del piloto de piezas generadas (2026-11-14): de una hoja de pixel art generada a sprites de rejilla de
# letras con la paleta del canal, en el formato que pinta sprite5() (motor/estilo/v5/dibujo.js).
#  - Hoja de un generador general (Codex): «píxel falso» de tamaño no entero; se detecta su periodo y se sigue la
#    deriva de la rejilla línea a línea.
#  - --nativo: PNG que ya está en su rejilla real (PixelLab); solo se pasa a letras y paleta.
# Uso:
#   python convertir.py hoja.png salida.js --var CODEX --rejilla 4x1 --nombres a,b,c,d [--mismo-pixel] [--limpiar]
#                       [--nativo] [--contactos hoja-contactos.png] [--anadir]
import argparse, json
import numpy as np
from PIL import Image

PALETA = {  # R5 y acentos del canal (docs/estilo.md, motor/estilo/v5/dibujo.js, piezas-factura.js)
    "contorno": ["#0b0e14"],
    "hormigon": ["#161b26", "#222a3a", "#2f3a4f", "#43506a", "#5b6a86"],
    "metal": ["#262b48", "#3a4166", "#5a6390", "#8a93c0"],
    "ia": ["#1d2f6b", "#3a5fc0", "#5b8cff", "#9fc4ff", "#f5f7fb"],
    "naranja": ["#7a3a14", "#c25e22", "#ff8a3d", "#ffb37a"],
    "verde": ["#0d5a42", "#13936a", "#1fd69a", "#8ff0c8"],
    "ambar": ["#6a4210", "#b0701c", "#f0a83a", "#ffd486"],
    "oficina": ["#2a1d1c", "#41291f", "#5c3a26", "#7c5232", "#f2c14e"],
    "crema": ["#b8ad96", "#efe6d2"],
    "piel": ["#a8674a", "#d8946c", "#f2c4a0"],
    "pelo": ["#2a1810", "#4a2c1a"],
    "rojo": ["#e0454f"],
}
COLORES = list(dict.fromkeys(c for r in PALETA.values() for c in r))
CLAVES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


def rgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], dtype=float)


def lab(c):  # sRGB → Lab aproximado, para elegir el color más cercano con sentido perceptivo
    c = np.asarray(c, dtype=float) / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


PAL_LAB = lab(np.array([rgb(c) for c in COLORES]))


def es_fondo(a):  # magenta del fondo (con margen para la compresión del generador)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (r > 170) & (b > 170) & (g < 110)


def tinte_fondo(a):  # mezcla del contorno con el magenta en los bordes: morado sin verde
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return es_fondo(a) | ((r - g > 50) & (b - g > 50) & (np.abs(r - b) < 70))


def periodo(perfil):
    """Tamaño del píxel falso: el periodo cuyas líneas (±1 px) recogen más borde del que les toca por azar."""
    n, total = len(perfil), perfil.sum() + 1e-9
    acum = np.concatenate([[0], np.cumsum(perfil)])
    mejor = (-1, 0, 0)
    for p in np.arange(4.0, 24.01, 0.05):
        for fase in np.arange(0, p, 0.5):
            lin = np.round(np.arange(fase, n, p)).astype(int)
            lo, hi = np.clip(lin - 1, 0, n), np.clip(lin + 2, 0, n)
            nota = (acum[hi] - acum[lo]).sum() / total - 3.0 / p
            if nota > mejor[0]:
                mejor = (nota, p, fase)
    return mejor


def fase_para(perfil, p):
    n, total = len(perfil), perfil.sum() + 1e-9
    acum = np.concatenate([[0], np.cumsum(perfil)])
    mejor = (-1, 0)
    for fase in np.arange(0, p, 0.25):
        lin = np.round(np.arange(fase, n, p)).astype(int)
        lo, hi = np.clip(lin - 1, 0, n), np.clip(lin + 2, 0, n)
        nota = (acum[hi] - acum[lo]).sum() / total
        if nota > mejor[0]:
            mejor = (nota, fase)
    return mejor[1]


def cortes(perfil, p, fase):
    """Líneas de corte que siguen la deriva de la rejilla: cada una, en el borde más fuerte cerca de donde tocaría."""
    n, lineas, x = len(perfil), [], fase
    while x > p:
        x -= p
    while x < n + p:
        i = int(round(x))
        lo, hi = max(i - 2, 0), min(i + 3, n)
        if hi > lo and perfil[lo:hi].max() > 0:
            x = lo + int(np.argmax(perfil[lo:hi]))
        lineas.append(x + 1)  # el borde está entre la columna x y la x+1
        x += p
    return [lineas[0] - p] + lineas


def perfiles(a):
    return np.abs(np.diff(a, axis=1)).sum(axis=(0, 2)), np.abs(np.diff(a, axis=0)).sum(axis=(1, 2))


def muestrear(crop, p=None):
    a = crop.astype(float)
    gx, gy = perfiles(a)
    if p is None:
        _, px, fx = periodo(gx)
        _, py, fy = periodo(gy)
        p = (px + py) / 2
    fx, fy = fase_para(gx, p), fase_para(gy, p)
    xs, ys = cortes(gx, p, fx), cortes(gy, p, fy)
    filas = []
    for y0, y1 in zip(ys, ys[1:]):
        fila = []
        for x0, x1 in zip(xs, xs[1:]):
            mx, my = (x1 - x0) * 0.25, (y1 - y0) * 0.25
            cx0, cx1 = max(int(round(x0 + mx)), 0), int(round(x1 - mx))
            cy0, cy1 = max(int(round(y0 + my)), 0), int(round(y1 - my))
            trozo = a[cy0:max(cy1, cy0 + 1), cx0:max(cx1, cx0 + 1)].reshape(-1, 3)
            if len(trozo) == 0:
                fila.append(None)
                continue
            tinte = tinte_fondo(trozo)
            if tinte.mean() > 0.5:
                fila.append(None)
                continue
            fila.append(np.median(trozo[~tinte], axis=0))
        filas.append(fila)
    return filas, p


def nativo(img):
    a = np.array(img.convert("RGBA")).astype(float)
    return [[None if px[3] < 128 else px[:3] for px in fila] for fila in a], 1.0


def agrupar(colores, k):
    """k-medias determinista en Lab: arranca en cuantiles de luminosidad. Devuelve el centro de cada color."""
    x = lab(colores)
    k = min(k, len(np.unique(np.round(x), axis=0)))
    orden = np.argsort(x[:, 0])
    centros = x[orden[np.linspace(0, len(x) - 1, k).astype(int)]].copy()
    for _ in range(25):
        d = ((x[:, None, :] - centros[None]) ** 2).sum(-1)
        g = d.argmin(1)
        nuevos = np.array([x[g == c].mean(0) if (g == c).any() else centros[c] for c in range(k)])
        if np.allclose(nuevos, centros):
            break
        centros = nuevos
    return centros[g]


def indices(filas, k=None):
    """Cada píxel al color de la paleta más cercano (índice), o -1 si es transparente. Con k, agrupa antes los colores
    del sprite en k tonos: así el ruido dentro de una misma superficie no salta entre dos colores de la paleta."""
    h, w = len(filas), max(len(f) for f in filas)
    m = np.full((h, w), -1, dtype=int)
    pos = [(j, i) for j, fila in enumerate(filas) for i, c in enumerate(fila) if c is not None]
    cols = np.array([filas[j][i] for j, i in pos], dtype=float)
    x = agrupar(cols, k) if k else lab(cols)
    idx = ((x[:, None, :] - PAL_LAB[None]) ** 2).sum(-1).argmin(1)
    for (j, i), v in zip(pos, idx):
        m[j, i] = int(v)
    return m


def limpiar(m):
    """Quita los píxeles sueltos: si sus 4 vecinos coinciden en otro valor, toma ese valor. Devuelve cuántos cambió."""
    h, w = m.shape
    pad = np.pad(m, 1, constant_values=-1)
    nuevo, cambios = m.copy(), 0
    for j in range(h):
        for i in range(w):
            v = [pad[j, i + 1], pad[j + 2, i + 1], pad[j + 1, i], pad[j + 1, i + 2]]
            if v[0] == v[1] == v[2] == v[3] and v[0] != m[j, i]:
                nuevo[j, i] = v[0]
                cambios += 1
    return nuevo, cambios


def recortar(m):
    ys, xs = np.where(m >= 0)
    return m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def a_letras(m):
    usados = {}
    filas = []
    for fila in m:
        s = ""
        for v in fila:
            if v < 0:
                s += "."
            else:
                usados.setdefault(int(v), CLAVES[len(usados)])
                s += usados[int(v)]
        filas.append(s)
    return filas, {k: COLORES[i] for i, k in usados.items()}


def contactos(sprites, ruta, escala=4):
    fondo = (14, 18, 36)
    ancho = sum(s["w"] for s in sprites.values()) + 6 * (len(sprites) + 1)
    alto = max(s["h"] for s in sprites.values()) + 12
    im = Image.new("RGB", (ancho, alto), fondo)
    x = 6
    for s in sprites.values():
        y = alto - 6 - s["h"]
        for j, fila in enumerate(s["filas"]):
            for i, c in enumerate(fila):
                if c != ".":
                    im.putpixel((x + i, y + j), tuple(int(v) for v in rgb(s["paleta"][c])))
        x += s["w"] + 6
    im.resize((ancho * escala, alto * escala), Image.NEAREST).save(ruta)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("hoja")
    ap.add_argument("salida")
    ap.add_argument("--var", default="PIEZAS")
    ap.add_argument("--rejilla", default="1x1")
    ap.add_argument("--nombres", default=None)
    ap.add_argument("--nativo", action="store_true")
    ap.add_argument("--mismo-pixel", action="store_true", help="todas las casillas con el píxel mediano de la hoja")
    ap.add_argument("--pixel", type=float, default=None, help="fuerza el tamaño del píxel falso (reduce si es mayor que el real)")
    ap.add_argument("--limpiar", action="store_true")
    ap.add_argument("--tonos", type=int, default=None, help="agrupa los colores del sprite en N tonos antes de la paleta")
    ap.add_argument("--contactos", default=None)
    ap.add_argument("--anadir", action="store_true", help="añade a la variable en vez de crearla")
    a = ap.parse_args()
    cols, fils = (int(v) for v in a.rejilla.lower().split("x"))
    nombres = a.nombres.split(",") if a.nombres else [f"s{k}" for k in range(cols * fils)]
    img = Image.open(a.hoja)
    sprites = {}
    if a.nativo:
        recortes = [img]
    else:
        im = np.array(img.convert("RGB"))
        H, W = im.shape[:2]
        recortes = []
        for j in range(fils):
            for i in range(cols):
                celda = im[j * H // fils:(j + 1) * H // fils, i * W // cols:(i + 1) * W // cols]
                ys, xs = np.where(~es_fondo(celda.astype(float)))
                recortes.append(celda[max(ys.min() - 12, 0):ys.max() + 12, max(xs.min() - 12, 0):xs.max() + 12])
    p_comun = a.pixel
    if a.mismo_pixel and not a.nativo:
        p_comun = float(np.median([muestrear(c)[1] for c in recortes]))
    for k, crop in enumerate(recortes):
        filas, p = nativo(crop) if a.nativo else muestrear(crop, p_comun)
        m = indices(filas, a.tonos)
        cambios = 0
        if a.limpiar:
            m, cambios = limpiar(m)
        m = recortar(m)
        rejilla, paleta = a_letras(m)
        s = {"filas": rejilla, "paleta": paleta, "w": len(rejilla[0]), "h": len(rejilla),
             "pixel_falso": round(float(p), 2), "limpiados": cambios}
        sprites[nombres[k]] = s
        print(f"{nombres[k]}: píxel {p:.2f} → {s['w']}×{s['h']}, {len(paleta)} colores, {cambios} píxeles limpiados")
    with open(a.salida, "a" if a.anadir else "w", encoding="utf-8") as f:
        if not a.anadir:
            f.write("// Generado por motor/piloto/piezas-generadas/convertir.py (piloto, no se edita a mano).\n")
            f.write(f"var {a.var} = {a.var} || {{}};\n")
        f.write(f"Object.assign({a.var}, " + json.dumps(sprites, ensure_ascii=False) + ");\n")
    if a.contactos:
        contactos(sprites, a.contactos)


main()
