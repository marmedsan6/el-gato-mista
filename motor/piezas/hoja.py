# Hojas de piezas del arte generado (estilo v7). Una pieza es una rejilla de letras con su paleta, como la pinta sprite5
# (motor/estilo/v5/dibujo.js): {"filas": [...], "paleta": {"a": "#hex"}, "w": n, "h": n}.
#  - contactos(): la hoja de revisión. Las piezas a tamaño de salida (4 px por píxel de arte) sobre la noche, de pie en
#    la misma línea de suelo y con la persona de referencia al principio de cada fila para ver la escala; debajo, la
#    misma fila como se ve en un móvil (short a 360 px de ancho). La usan convertir.py (cada tanda), montar.mjs (la hoja
#    del vídeo, para la puerta de estilo) y promover.mjs (el set).
#  - para_codex(): la misma fila sobre magenta, sin rótulos: la referencia de estilo y escala que se pasa a Codex.
#  - regla(): una pieza a ×8 con su rejilla numerada cada 5 píxeles, para medir sus coordenadas internas (anclas).
# Uso: python hoja.py entrada.json salida.png [--para-codex] [--regla <carpeta>]
#      entrada.json = {"piezas": [{"nombre", "etiqueta"?, "set"?, ...pieza}], "referencia": pieza | null}
import argparse, json, os
from PIL import Image, ImageDraw, ImageFont

NOCHE = (14, 18, 36, 255)
SUELO = (47, 58, 79, 255)
MAGENTA = (255, 0, 255, 255)
TEXTO = (245, 247, 251)
TEXTO_SET = (31, 214, 154)
TEXTO_SUAVE = (138, 147, 166)
ESCALA = 4              # px de salida por píxel de arte
MOVIL = 360 / 1080      # el short visto en un móvil de 360 px de ancho
HUECO = 8               # píxeles de arte entre piezas


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


FUENTE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "marca", "fuentes", "jetbrains-mono", "JetBrainsMono[wght].ttf")


def fuente(tam):
    try:
        return ImageFont.truetype(FUENTE, tam)
    except OSError:  # sin la fuente de la marca, la de Pillow (sin tildes ni «×»)
        return ImageFont.load_default()


def imagen(s):
    """Pieza → RGBA a 1 px por píxel de arte."""
    w = max(len(f) for f in s["filas"])
    im = Image.new("RGBA", (w, len(s["filas"])), (0, 0, 0, 0))
    px = im.load()
    for j, fila in enumerate(s["filas"]):
        for i, c in enumerate(fila):
            if c != "." and c in s["paleta"]:
                px[i, j] = hexrgb(s["paleta"][c]) + (255,)
    return im


def filas_de(items, ancho_max):
    """Reparte las piezas en filas que no pasen de ancho_max píxeles de arte."""
    filas, actual, ancho = [], [], HUECO
    for it in items:
        w = it["w"] + HUECO
        if actual and ancho + w > ancho_max:
            filas.append(actual)
            actual, ancho = [], HUECO
        actual.append(it)
        ancho += w
    if actual:
        filas.append(actual)
    return filas


def lienzo_fila(fila, fondo, suelo):
    w = sum(it["w"] for it in fila) + HUECO * (len(fila) + 1)
    h = max(it["h"] for it in fila) + HUECO * 2
    im = Image.new("RGBA", (w, h), fondo)
    if suelo:
        ImageDraw.Draw(im).line([(0, h - HUECO), (w, h - HUECO)], fill=SUELO)
    x, pos = HUECO, []
    for it in fila:
        im.alpha_composite(imagen(it), (x, h - HUECO - it["h"]))
        pos.append((x, it))
        x += it["w"] + HUECO
    return im, pos


def contactos(piezas, ruta, referencia=None, ancho_max=600, titulo=None):
    """Hoja de revisión: tamaño de salida, rótulos y la tira a tamaño de móvil."""
    ref = [dict(referencia, nombre="ref", etiqueta=f"{referencia['h']} alto", ref=True)] if referencia else []
    bloques = []
    f_nombre, f_peq = fuente(16), fuente(12)
    for fila in filas_de(piezas, ancho_max):
        arte, pos = lienzo_fila(ref + fila, NOCHE, True)
        grande = arte.resize((arte.width * ESCALA, arte.height * ESCALA), Image.NEAREST)
        rot = Image.new("RGBA", (grande.width + 160, 84), NOCHE)  # margen para el último rótulo
        d = ImageDraw.Draw(rot)
        for k, (x, it) in enumerate(pos):  # dos alturas alternas: las piezas estrechas no se pisan los rótulos
            color = TEXTO_SUAVE if it.get("ref") else (TEXTO_SET if it.get("set") else TEXTO)
            y = 4 + 40 * (k % 2)
            d.line([(x * ESCALA, 0), (x * ESCALA, y)], fill=SUELO)
            d.text((x * ESCALA + 3, y), it["nombre"] + (" · set" if it.get("set") else ""), fill=color, font=f_nombre)
            d.text((x * ESCALA + 3, y + 19), it.get("etiqueta") or f"{it['w']}×{it['h']}", fill=TEXTO_SUAVE, font=f_peq)
        movil = grande.resize((round(grande.width * MOVIL), round(grande.height * MOVIL)), Image.LANCZOS)
        tira = Image.new("RGBA", (grande.width, movil.height + 22), NOCHE)
        ImageDraw.Draw(tira).text((4, 2), "en un móvil (short a 360 px)", fill=TEXTO_SUAVE, font=f_peq)
        tira.alpha_composite(movil, (0, 20))
        bloques += [grande, rot, tira]
    if titulo:
        cab = Image.new("RGBA", (max(b.width for b in bloques), 30), NOCHE)
        ImageDraw.Draw(cab).text((8, 6), titulo, fill=TEXTO, font=f_nombre)
        bloques.insert(0, cab)
    ancho = max(b.width for b in bloques)
    hoja = Image.new("RGBA", (ancho, sum(b.height for b in bloques)), NOCHE)
    y = 0
    for b in bloques:
        hoja.alpha_composite(b, (0, y))
        y += b.height
    hoja.convert("RGB").save(ruta)


def para_codex(piezas, ruta, escala=6, ancho_max=400):
    """Referencia para Codex: las piezas en su escala relativa, sobre magenta y sin rótulos."""
    bloques = [lienzo_fila(f, MAGENTA, False)[0] for f in filas_de(piezas, ancho_max)]
    ancho = max(b.width for b in bloques)
    arte = Image.new("RGBA", (ancho, sum(b.height for b in bloques)), MAGENTA)
    y = 0
    for b in bloques:
        arte.alpha_composite(b, (0, y))
        y += b.height
    arte.resize((arte.width * escala, arte.height * escala), Image.NEAREST).convert("RGB").save(ruta)


def regla(s, ruta, k=8, margen=28):
    """La pieza a ×k con su rejilla: línea fina en cada píxel, fuerte y numerada cada 5 (desde 0, arriba a la izquierda)."""
    im = imagen(s)
    w, h = im.size
    lienzo = Image.new("RGBA", (w * k + margen, h * k + margen), NOCHE)
    lienzo.alpha_composite(im.resize((w * k, h * k), Image.NEAREST), (margen, margen))
    d, f = ImageDraw.Draw(lienzo), fuente(11)
    for i in range(w + 1):
        fuerte = i % 5 == 0
        d.line([(margen + i * k, margen), (margen + i * k, margen + h * k)], fill=(90, 100, 130, 255) if fuerte else (40, 46, 66, 255))
        if fuerte and i < w:
            d.text((margen + i * k + 1, 4), str(i), fill=TEXTO, font=f)
    for j in range(h + 1):
        fuerte = j % 5 == 0
        d.line([(margen, margen + j * k), (margen + w * k, margen + j * k)], fill=(90, 100, 130, 255) if fuerte else (40, 46, 66, 255))
        if fuerte and j < h:
            d.text((2, margen + j * k + 1), str(j), fill=TEXTO, font=f)
    lienzo.convert("RGB").save(ruta)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("salida")
    ap.add_argument("--para-codex", action="store_true")
    ap.add_argument("--regla", default=None, help="carpeta donde dejar una regla por pieza")
    ap.add_argument("--titulo", default=None)
    a = ap.parse_args()
    with open(a.entrada, encoding="utf-8") as f:
        datos = json.load(f)
    piezas = datos["piezas"]
    if a.para_codex:
        para_codex(piezas, a.salida)
    else:
        contactos(piezas, a.salida, datos.get("referencia"), titulo=a.titulo)
    if a.regla:
        os.makedirs(a.regla, exist_ok=True)
        for p in piezas:
            regla(p, os.path.join(a.regla, f"regla-{p['nombre']}.png"))


if __name__ == "__main__":
    main()
