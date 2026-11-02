"""Logo de elgatomista: MISTA tal cual sale en los vídeos, de cabeza a pecho, en un círculo con aro naranja.

Lee los píxeles y colores del sprite de motor/estilo/gato.js (la única fuente del gato), así que el logo
sigue al personaje si cambia. Solo cambian los ojos: verde lima en el logo, amarillos en los vídeos (Mario,
2026-11-02). Como en los vídeos, el personaje va a ×2 y el aro a ×1, en una cuadrícula de 52×52 exportada con
escalado entero (vecino más cercano).
Uso: python marca/logo/generar.py [#color_ojos ...]  → marca/logo/salida/ (con colores: solo pruebas de ojos)
"""
import re
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parents[2]
SPRITE = (RAIZ / "motor/estilo/gato.js").read_text(encoding="utf-8")

N = 52  # cuadrícula del logo
C = 26.0  # centro del círculo (coordenadas continuas)
DISCO, ARO = 22.8, 24.8  # radio del disco interior y radio exterior del aro
E = 2  # escala del personaje (Estilo vigente: personaje ×2)
OJOS = "#8ccf3f"  # verde lima, solo en el logo


def bloque(nombre):
    return SPRITE[SPRITE.index(f"const {nombre}"):].split(";", 1)[0]


GATO_COLOR = dict(re.findall(r'(\w):\s*"(#[0-9a-f]{6})"', bloque("GATO_COLOR")))
CABEZA = re.findall(r'"([.\w]{16})"', bloque("GATO_CABEZA"))
CUERPO = re.findall(r'"([.\w]{18})"', bloque("GATO_CUERPO"))
assert len(CABEZA) == 13 and len(CUERPO) == 14, "Cambió el formato del sprite en gato.js"

FONDO, PANEL, NARANJA, SOMBRA = "#0c1016", "#171e2a", "#ff8a3d", "#b4622a"  # tokens del canal


def rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def logo(color_ojos=OJOS):
    colores = {**GATO_COLOR, "e": color_ojos}
    img = [[FONDO] * N for _ in range(N)]
    radio = lambda i, j: ((i + 0.5 - C) ** 2 + (j + 0.5 - C) ** 2) ** 0.5
    for j in range(N):
        for i in range(N):
            r = radio(i, j)
            if r < DISCO:
                img[j][i] = PANEL
            elif r < ARO:
                img[j][i] = SOMBRA if (r < DISCO + 1 and j > C + 8) else NARANJA

    # Como en gato(): el cuerpo empieza 1 a la izquierda y 12 por debajo de la cabeza; las orejas pisan el aro
    def filas(x, y, sprite, limite):
        for dj, fila in enumerate(sprite):
            for di, ch in enumerate(fila):
                for i in range(x + di * E, x + (di + 1) * E):
                    for j in range(y + dj * E, y + (dj + 1) * E):
                        if ch in colores and 0 <= i < N and 0 <= j < N and radio(i, j) < limite:
                            img[j][i] = colores[ch]

    filas(8, 28, CUERPO, DISCO)  # el cuerpo se recorta en el disco
    filas(10, 4, CABEZA, ARO)  # la cabeza puede tapar el aro
    base = Image.new("RGB", (N, N))
    base.putdata([rgb(c) for fila in img for c in fila])
    return base


if __name__ == "__main__":
    salida = Path(__file__).parent / "salida"
    salida.mkdir(exist_ok=True)
    tonos = sys.argv[1:]
    if tonos:  # pruebas de color de ojos: una imagen por tono
        for t in tonos:
            logo(t).resize((512, 512), Image.NEAREST).save(salida / f"prueba-ojos-{t.lstrip('#')}.png")
    else:
        base = logo()
        base.save(salida / "logo-52.png")
        for lado in (1040, 520):  # múltiplos enteros de 52
            base.resize((lado, lado), Image.NEAREST).save(salida / f"logo-{lado}.png")
    print("ok:", sorted(p.name for p in salida.iterdir()))
