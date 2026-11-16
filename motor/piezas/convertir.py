# Conversor del arte generado (estilo v7): de una hoja de pixel art de un generador (Codex) a piezas de rejilla de
# letras con la paleta del canal, en el formato que pinta sprite5() (motor/estilo/v5/dibujo.js). Viene del piloto del
# 2026-11-14 (docs/investigacion/herramientas-pixel-2026-11-14/piloto.md).
#  - La hoja trae un «píxel falso» de tamaño no entero: se detecta su periodo y se sigue la deriva de la rejilla.
#  - --alto / --altos: fuerza el píxel para que la pieza salga con esa altura en píxeles de arte (Codex no mantiene la
#    escala entre hojas). Al reducir, exacta (rejilla uniforme); cerca de lo que trae, siguiendo su rejilla (±1-3 %); si
#    se pide más de lo que trae, se queda en lo que trae y avisa (ampliar no añade detalle): se pide otra hoja.
#  - --nativo: PNG que ya está en su rejilla real; solo se pasa a letras y paleta.
# Uso:
#   python convertir.py hoja.png piezas.json --nombres a,b,c [--rejilla auto|CxF] [--altos a=28,b=67 | --alto 28]
#                       [--tonos 14] [--limpiar] [--contactos hoja.png] [--referencia set.json#quieto] [--regla carpeta]
#   La salida es JSON ({nombre: pieza}); con .js escribe «Object.assign(VAR, …)» como en el piloto (--var, --anadir).
import argparse, json, os, sys
import numpy as np
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import hoja  # noqa: E402

with open(os.path.join(AQUI, "paleta.json"), encoding="utf-8") as _f:
    PALETA = json.load(_f)["rampas"]
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


def muestrear(crop, p=None, fijo=False):
    """Divide el recorte en celdas de un píxel de arte y toma el color mediano del centro de cada una. Sin `fijo`, las
    líneas siguen la deriva de la rejilla del generador; con `fijo` (al reducir, cuando esa rejilla ya no sirve), son
    uniformes y arrancan en la caja del objeto, así que la altura sale exacta."""
    a = crop.astype(float)
    gx, gy = perfiles(a)
    if p is None:
        _, px, fx = periodo(gx)
        _, py, fy = periodo(gy)
        p = (px + py) / 2
    if fijo:
        lleno = ~es_fondo(a)
        ys0, xs0 = np.where(lleno.sum(axis=1) >= 2)[0], np.where(lleno.sum(axis=0) >= 2)[0]
        xs = list(np.arange(xs0.min(), xs0.max() + 1 + p * 0.5, p))
        ys = list(np.arange(ys0.min(), ys0.max() + 1 + p * 0.5, p))
    else:
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


def segmentos(im, n):
    """Separa los objetos de una hoja de una fila por las columnas de fondo. Devuelve n cajas (x0, x1, y0, y1) de
    izquierda a derecha, o None si no salen n. Si salen de más, une los trozos más cercanos (un objeto con un hueco)."""
    lleno = ~es_fondo(im.astype(float))
    col = lleno.sum(axis=0) >= 2
    trozos, i, W = [], 0, len(col)
    while i < W:
        if col[i]:
            j = i
            while j < W and col[j]:
                j += 1
            trozos.append([i, j])
            i = j
        else:
            i += 1
    if not trozos:
        return None
    pesos = [lleno[:, a:b].sum() for a, b in trozos]
    trozos = [t for t, p in zip(trozos, pesos) if p > max(pesos) * 0.01]  # motas de compresión
    while len(trozos) > n:
        k = min(range(len(trozos) - 1), key=lambda q: trozos[q + 1][0] - trozos[q][1])
        trozos[k] = [trozos[k][0], trozos[k + 1][1]]
        del trozos[k + 1]
    if len(trozos) != n:
        return None
    cajas = []
    for a, b in trozos:
        filas = np.where(lleno[:, a:b].sum(axis=1) >= 2)[0]
        cajas.append((a, b, int(filas.min()), int(filas.max()) + 1))
    return cajas


def alto_px(crop):
    """Alto en píxeles de imagen de lo que no es fondo (filas con 2 píxeles o más, para no contar motas)."""
    filas = np.where((~es_fondo(crop.astype(float))).sum(axis=1) >= 2)[0]
    return int(filas.max() - filas.min() + 1) if len(filas) else crop.shape[0]


def alto_filas(filas):
    """Alto de lo muestreado sin las filas vacías de arriba y abajo."""
    llenas = [j for j, f in enumerate(filas) if any(c is not None for c in f)]
    return llenas[-1] - llenas[0] + 1 if llenas else 0


def muestrear_alto(crop, alto, p0, p_nat):
    """Muestrea con el píxel que deja la pieza en `alto` filas. Si reduce (más de un 10 % sobre el píxel de la hoja),
    con rejilla uniforme. Si no, siguiendo la rejilla de la hoja: los cortes se pegan a los bordes y pueden quedar a ±1,
    así que se corrige el píxel y se repite (pocas vueltas, se queda con el más cercano)."""
    fijo = p0 > p_nat * 1.1
    p, mejor = p0, None
    for _ in range(6):
        filas, _ = muestrear(crop, p, fijo)
        h = alto_filas(filas)
        if mejor is None or abs(h - alto) < abs(mejor[2] - alto):
            mejor = (filas, p, h)
        if h == alto or h == 0:
            break
        p *= h / alto
    return mejor[0], mejor[1]


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
    de la pieza en k tonos: así el ruido dentro de una misma superficie no salta entre dos colores de la paleta."""
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


def leer_pieza(ref):
    """«fichero.json#nombre» → la pieza (para la persona de referencia de la hoja)."""
    ruta, nombre = ref.split("#")
    with open(ruta, encoding="utf-8") as f:
        datos = json.load(f)
    return datos.get("piezas", datos)[nombre]


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("hoja")
    ap.add_argument("salida")
    ap.add_argument("--var", default="PIEZAS", help="solo con salida .js")
    ap.add_argument("--rejilla", default="auto", help="auto (una fila, separa por el fondo) o CxF (casillas iguales)")
    ap.add_argument("--nombres", default=None)
    ap.add_argument("--nativo", action="store_true")
    ap.add_argument("--mismo-pixel", action="store_true", help="todas las casillas con el píxel mediano de la hoja")
    ap.add_argument("--pixel", type=float, default=None, help="fuerza el tamaño del píxel falso (reduce si es mayor que el real)")
    ap.add_argument("--alto", type=int, default=None, help="altura final de todas las piezas, en píxeles de arte")
    ap.add_argument("--altos", default=None, help="altura final por pieza: nombre=N,nombre=N")
    ap.add_argument("--limpiar", action="store_true")
    ap.add_argument("--tonos", type=int, default=None, help="agrupa los colores de la pieza en N tonos antes de la paleta")
    ap.add_argument("--contactos", default=None)
    ap.add_argument("--referencia", default=None, help="persona de referencia para la hoja: fichero.json#nombre")
    ap.add_argument("--regla", default=None, help="carpeta donde dejar la regla de cada pieza")
    ap.add_argument("--anadir", action="store_true", help="solo con salida .js: añade a la variable en vez de crearla")
    a = ap.parse_args(argv)
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")  # la consola de Windows va en cp1252
    img = Image.open(a.hoja)
    altos = dict((k, int(v)) for k, v in (x.split("=") for x in a.altos.split(","))) if a.altos else {}
    if a.nativo:
        recortes = [None]
    else:
        im = np.array(img.convert("RGB"))
        H, W = im.shape[:2]
        recortes = []
        if a.rejilla == "auto":
            n = len(a.nombres.split(",")) if a.nombres else 1
            cajas = segmentos(im, n)
            if cajas is None:
                sys.exit(f"No salen {n} objetos separados por el fondo: usa --rejilla CxF o pide otra hoja")
            for x0, x1, y0, y1 in cajas:
                recortes.append(im[max(y0 - 12, 0):y1 + 12, max(x0 - 12, 0):x1 + 12])
        else:
            cols, fils = (int(v) for v in a.rejilla.lower().split("x"))
            for j in range(fils):
                for i in range(cols):
                    celda = im[j * H // fils:(j + 1) * H // fils, i * W // cols:(i + 1) * W // cols]
                    ys, xs = np.where(~es_fondo(celda.astype(float)))
                    recortes.append(celda[max(ys.min() - 12, 0):ys.max() + 12, max(xs.min() - 12, 0):xs.max() + 12])
    nombres = a.nombres.split(",") if a.nombres else [f"s{k}" for k in range(len(recortes))]
    if len(nombres) != len(recortes):
        sys.exit(f"{len(nombres)} nombres para {len(recortes)} casillas")
    p_comun = a.pixel
    if a.mismo_pixel and not a.nativo:
        p_comun = float(np.median([muestrear(c)[1] for c in recortes]))
    piezas = {}
    for nombre, crop in zip(nombres, recortes):
        alto = altos.get(nombre, a.alto)
        p_forzado, aviso, p_nat = p_comun, "", None
        if crop is not None and alto:
            p_forzado = alto_px(crop) / alto
            _, p_nat = muestrear(crop)
            if p_forzado < p_nat * 0.9:
                aviso = f" · AVISO: pides {alto} de alto y la hoja trae unos {alto_px(crop) / p_nat:.0f}: se queda en lo que trae"
        if crop is None:
            filas, p = nativo(img)
        elif alto and aviso:  # pide más de lo que hay: se queda con el píxel de la hoja (ampliar no añade detalle)
            filas, p = muestrear(crop, p_nat)
        elif alto:
            filas, p = muestrear_alto(crop, alto, p_forzado, p_nat)
        else:
            filas, p = muestrear(crop, p_forzado)
        m = indices(filas, a.tonos)
        cambios = 0
        if a.limpiar:
            m, cambios = limpiar(m)
        m = recortar(m)
        rejilla, paleta = a_letras(m)
        s = {"filas": rejilla, "paleta": paleta, "w": len(rejilla[0]), "h": len(rejilla),
             "pixel_falso": round(float(p), 2), "limpiados": cambios}
        piezas[nombre] = s
        print(f"{nombre}: píxel {p:.2f} → {s['w']}×{s['h']}, {len(paleta)} colores, {cambios} píxeles limpiados{aviso}")
    if a.salida.endswith(".js"):
        with open(a.salida, "a" if a.anadir else "w", encoding="utf-8") as f:
            if not a.anadir:
                f.write("// Generado por motor/piezas/convertir.py (no se edita a mano).\n")
                f.write(f"var {a.var} = {a.var} || {{}};\n")
            f.write(f"Object.assign({a.var}, " + json.dumps(piezas, ensure_ascii=False) + ");\n")
    else:
        with open(a.salida, "w", encoding="utf-8") as f:
            json.dump(piezas, f, ensure_ascii=False, indent=1)
            f.write("\n")
    lista = [dict(s, nombre=n) for n, s in piezas.items()]
    if a.contactos:
        hoja.contactos(lista, a.contactos, leer_pieza(a.referencia) if a.referencia else None)
    if a.regla:
        os.makedirs(a.regla, exist_ok=True)
        for s in lista:
            hoja.regla(s, os.path.join(a.regla, f"regla-{s['nombre']}.png"))
    return piezas


if __name__ == "__main__":
    main()
