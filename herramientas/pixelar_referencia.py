"""Convierte una ilustración de referencia (las hojas de modelo, poses y expresiones de MISTA que dibujó Mario) en un
sprite de pixel art: recorta una caja, quita el fondo gris, reduce a la rejilla pedida promediando por áreas, cuantiza a
una paleta limitada (k-medias, sin tramado), refuerza el contorno exterior y limpia píxeles sueltos.
Las ilustraciones originales son de Mario y viven fuera del repo (OneDrive); al repo solo van los sprites resultantes.

Uso: python -I pixelar_referencia.py --imagen hoja.png --caja x0,y0,x1,y1 --filas 64 --salida sprite.png
       [--colores 14] [--umbral-fondo 26] [--vista 8] [--paleta paleta.json] [--guardar-paleta paleta.json]
  --paleta: usa una paleta ya fijada (para que todas las poses compartan colores); --vista: escala de la vista previa.
"""
import argparse, json
import numpy as np
from PIL import Image


def quitar_fondo(rgb, umbral):
    """Alfa 0 donde el color está cerca del fondo (gris de las esquinas) o es la sombra gris del suelo."""
    esquinas = np.concatenate([rgb[:8, :8].reshape(-1, 3), rgb[:8, -8:].reshape(-1, 3), rgb[-8:, :8].reshape(-1, 3), rgb[-8:, -8:].reshape(-1, 3)])
    fondo = np.median(esquinas, axis=0)
    dist = np.sqrt(((rgb - fondo) ** 2).sum(-1))
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    lum = rgb.mean(-1) / 255
    gris_sombra = (sat < 0.10) & (lum > 0.45) & (lum < 0.85)  # sombra del suelo: gris medio sin color
    return ~((dist < umbral) | gris_sombra)


def reducir(rgb, alfa, filas):
    H, W = alfa.shape
    escala = filas / max(H, W)
    w, h = max(1, round(W * escala)), max(1, round(H * escala))
    peso = alfa.astype(np.float32)
    acc = np.zeros((h, w, 3), np.float64); pes = np.zeros((h, w), np.float64); tot = np.zeros((h, w), np.float64)
    ys = np.minimum((np.arange(H) * h / H).astype(int), h - 1); xs = np.minimum((np.arange(W) * w / W).astype(int), w - 1)
    for j in range(H):
        acc[ys[j], xs] += rgb[j] * peso[j][:, None]; pes[ys[j], xs] += peso[j]; tot[ys[j], xs] += 1
    color = acc / np.maximum(pes, 1e-6)[..., None]
    opaco = (pes / np.maximum(tot, 1)) >= 0.5
    lienzo = np.zeros((filas, filas, 3)); m = np.zeros((filas, filas), bool)
    oy, ox = filas - h, (filas - w) // 2  # apoyado abajo y centrado
    lienzo[oy:oy + h, ox:ox + w] = color; m[oy:oy + h, ox:ox + w] = opaco
    return lienzo, m


def kmedias(px, k, iteraciones=25, semilla=3):
    rng = np.random.default_rng(semilla)
    c = px[rng.choice(len(px), k, replace=False)].astype(np.float64)
    for _ in range(iteraciones):
        d = ((px[:, None, :] - c[None]) ** 2).sum(-1); a = d.argmin(1)
        for i in range(k):
            if (a == i).any(): c[i] = px[a == i].mean(0)
    return c


def cuantizar(color, m, paleta):
    px = color[m]
    d = ((px[:, None, :] - paleta[None]) ** 2).sum(-1)
    out = np.zeros(color.shape[:2], int) - 1
    out[m] = d.argmin(1)
    return out


def limpiar(idx, paleta):
    """Píxel suelto (distinto de sus 4 vecinos opacos, que coinciden entre sí en mayoría) → color mayoritario.
    Se respetan los muy oscuros y muy claros (pupilas, brillos de los ojos)."""
    H, W = idx.shape
    lum = paleta.mean(1) / 255
    res = idx.copy()
    for j in range(1, H - 1):
        for i in range(1, W - 1):
            c = idx[j, i]
            if c < 0 or lum[c] < 0.22 or lum[c] > 0.9:
                continue
            vec = [idx[j - 1, i], idx[j + 1, i], idx[j, i - 1], idx[j, i + 1]]
            if all(v >= 0 and v != c for v in vec):
                vals, cuenta = np.unique(vec, return_counts=True)
                if cuenta.max() >= 3:
                    res[j, i] = vals[cuenta.argmax()]
    return res


def contorno(idx, paleta):
    """El borde exterior del sprite, en el color más oscuro de la paleta (línea limpia de 1 píxel)."""
    H, W = idx.shape
    oscuro = int(np.argmin(paleta.sum(1)))
    res = idx.copy()
    for j in range(H):
        for i in range(W):
            if idx[j, i] < 0:
                continue
            for dj, di in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                jj, ii = j + dj, i + di
                if not (0 <= jj < H and 0 <= ii < W) or idx[jj, ii] < 0:
                    res[j, i] = oscuro
                    break
    return res


def interior_naranja(idx, paleta):
    """Los trazos interiores casi negros de la ilustración (pelo, separación de patas) pasan al naranja más oscuro de la
    paleta: el negro queda solo para el contorno exterior."""
    H, W = idx.shape
    lum = paleta.mean(1) / 255
    mx, mn = paleta.max(1), paleta.min(1)
    sat = (mx - mn) / np.maximum(mx, 1)
    naranjas = [i for i in range(len(paleta)) if sat[i] > 0.35 and 0.3 < lum[i] < 0.62]
    if not naranjas:
        return idx
    oscuro_naranja = min(naranjas, key=lambda i: lum[i])
    res = idx.copy()
    for j in range(H):
        for i in range(W):
            c = idx[j, i]
            if c >= 0 and lum[c] < 0.3 and all(0 <= j + dj < H and 0 <= i + di < W and idx[j + dj, i + di] >= 0
                                                  for dj, di in ((-1, 0), (1, 0), (0, -1), (0, 1))):
                res[j, i] = oscuro_naranja
    return res


OJO = [".ooo.", "oyyyo", "oyyyo", "oyyyo", ".ooo."]
COLOR_OJO = {"o": (42, 34, 48), "y": (226, 198, 78), "p": (26, 24, 34), "w": (255, 255, 255)}


def retocar(rgba, retoque):
    """Ojos legibles: aro oscuro, iris amarillo cálido, pupila redonda de 2×2 hacia donde mira y brillo blanco."""
    dx, dy = retoque.get("pupila", [0, 0])
    for x, y in retoque.get("ojos", []):
        for j, fila in enumerate(OJO):
            for i, ch in enumerate(fila):
                if ch != ".":
                    rgba[y - 2 + j, x - 2 + i] = [*COLOR_OJO[ch], 255]
        for j in (0, 1):
            for i in (0, 1):
                rgba[y - 1 + dy + j, x - 1 + dx + i] = [*COLOR_OJO["p"], 255]
        rgba[y - 1 + dy, x - 1 + dx] = [*COLOR_OJO["w"], 255]
    for x, y in retoque.get("nariz", []):
        rgba[y, x] = [232, 140, 150, 255]
    return rgba


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--imagen", required=True); ap.add_argument("--caja", required=True); ap.add_argument("--filas", type=int, default=64)
    ap.add_argument("--salida", required=True); ap.add_argument("--colores", type=int, default=14); ap.add_argument("--umbral-fondo", type=float, default=26)
    ap.add_argument("--vista", type=int, default=0); ap.add_argument("--paleta"); ap.add_argument("--guardar-paleta"); ap.add_argument("--retoque")
    a = ap.parse_args()
    x0, y0, x1, y1 = map(int, a.caja.split(","))
    rgb = np.asarray(Image.open(a.imagen).convert("RGB").crop((x0, y0, x1, y1)), np.float32)
    alfa = quitar_fondo(rgb, a.umbral_fondo)
    color, m = reducir(rgb, alfa, a.filas)
    paleta = np.array(json.load(open(a.paleta)), np.float64) if a.paleta else kmedias(color[m], a.colores)
    idx = contorno(interior_naranja(limpiar(cuantizar(color, m, paleta), paleta), paleta), paleta)
    if a.guardar_paleta:
        json.dump([[round(v) for v in c] for c in paleta.tolist()], open(a.guardar_paleta, "w"))
    out = np.zeros((a.filas, a.filas, 4), np.uint8)
    for j in range(a.filas):
        for i in range(a.filas):
            if idx[j, i] >= 0:
                out[j, i] = [*np.round(paleta[idx[j, i]]).astype(int), 255]
    if a.retoque:
        out = retocar(out, json.loads(a.retoque))
    im = Image.fromarray(out, "RGBA"); im.save(a.salida)
    if a.vista:
        im.resize((a.filas * a.vista, a.filas * a.vista), Image.NEAREST).save(a.salida.replace(".png", f"_x{a.vista}.png"))
    print(json.dumps({"salida": a.salida, "colores": len(paleta), "opacos": int((idx >= 0).sum())}))


if __name__ == "__main__":
    main()
