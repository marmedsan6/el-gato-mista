"""Mide los movimientos de cámara de un vídeo de referencia (paso 4 de la iteración de detalle, 2026-11-04).

Para cada par de fotogramas consecutivos (muestreados a --fps) calcula, con correlación de fase, el desplazamiento
(dx, dy) de 6 regiones: 3 bandas horizontales (fondo, medio, suelo) × 2 mitades (izquierda, derecha). De ahí salen:
  - desplazamiento de cámara (travelling): media de dx de la banda media;
  - zoom: si la mitad derecha va a la derecha y la izquierda a la izquierda, la imagen crece (dx_der - dx_izq > 0);
  - paralaje: bandas que se mueven a velocidades distintas en un mismo travelling;
  - cortes de plano: diferencia media de luminancia muy alta entre fotogramas.
Escribe un CSV por fotograma y un resumen JSON con los tramos de movimiento.

Uso: python -I camara_ref.py --video ref.mp4 --salida carpeta [--fps 15] [--ancho 270]
"""
import argparse, csv, json, subprocess, sys
import numpy as np

BANDAS = {"fondo": (0.14, 0.40), "medio": (0.40, 0.64), "suelo": (0.75, 0.97)}  # fracciones del alto (sin la caja de diálogo)


def fotogramas(video, fps, ancho):
    alto = ancho * 16 // 9
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", video, "-vf", f"fps={fps},scale={ancho}:{alto}:flags=area,format=gray",
           "-f", "rawvideo", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    n = ancho * alto
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(alto, ancho).astype(np.float32)


def fase(a, b):
    """Desplazamiento (dx, dy) de b respecto de a por correlación de fase, con precisión subpíxel parabólica."""
    v = np.hanning(a.shape[0])[:, None] * np.hanning(a.shape[1])[None, :]
    A, B = np.fft.fft2((a - a.mean()) * v), np.fft.fft2((b - b.mean()) * v)
    R = A.conj() * B
    R /= np.abs(R) + 1e-9
    c = np.fft.ifft2(R).real
    y, x = np.unravel_index(np.argmax(c), c.shape)
    def sub(i, n, eje):
        im, ip = (i - 1) % n, (i + 1) % n
        f0, f1, f2 = (c[im, x], c[i, x], c[ip, x]) if eje == 0 else (c[y, im], c[y, i], c[y, ip])
        d = (f0 - 2 * f1 + f2)
        return i + (0.5 * (f0 - f2) / d if abs(d) > 1e-9 else 0)
    yy, xx = sub(y, c.shape[0], 0), sub(x, c.shape[1], 1)
    if yy > c.shape[0] / 2: yy -= c.shape[0]
    if xx > c.shape[1] / 2: xx -= c.shape[1]
    return float(xx), float(yy), float(c.max())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True); ap.add_argument("--salida", required=True)
    ap.add_argument("--fps", type=float, default=15); ap.add_argument("--ancho", type=int, default=270)
    a = ap.parse_args()
    filas, prev = [], None
    for i, f in enumerate(fotogramas(a.video, a.fps, a.ancho)):
        if prev is not None:
            h, w = f.shape
            fila = {"t": round(i / a.fps, 3), "corte": round(float(np.abs(f - prev).mean()), 2)}
            for nombre, (y0, y1) in BANDAS.items():
                r0, r1 = int(y0 * h), int(y1 * h)
                for lado, (c0, c1) in {"izq": (0, w // 2), "der": (w // 2, w)}.items():
                    dx, dy, q = fase(prev[r0:r1, c0:c1], f[r0:r1, c0:c1])
                    fila[f"{nombre}_{lado}_dx"], fila[f"{nombre}_{lado}_dy"], fila[f"{nombre}_{lado}_q"] = round(dx, 3), round(dy, 3), round(q, 3)
            filas.append(fila)
        prev = f
    import os
    os.makedirs(a.salida, exist_ok=True)
    with open(os.path.join(a.salida, "movimiento.csv"), "w", newline="", encoding="utf-8") as fh:
        wr = csv.DictWriter(fh, fieldnames=list(filas[0].keys())); wr.writeheader(); wr.writerows(filas)
    # Resumen por segundo: travelling (dx medio de la banda media), zoom (separación izq/der) y paralaje (fondo y suelo frente a medio)
    por_seg = {}
    for f in filas:
        s = int(f["t"])
        d = por_seg.setdefault(s, {"pan": 0, "zoom": 0, "fondo": 0, "suelo": 0, "tilt": 0, "corte_max": 0, "n": 0})
        med = (f["medio_izq_dx"] + f["medio_der_dx"]) / 2
        d["pan"] += med; d["zoom"] += f["medio_der_dx"] - f["medio_izq_dx"]
        d["fondo"] += (f["fondo_izq_dx"] + f["fondo_der_dx"]) / 2; d["suelo"] += (f["suelo_izq_dx"] + f["suelo_der_dx"]) / 2
        d["tilt"] += (f["medio_izq_dy"] + f["medio_der_dy"]) / 2
        d["corte_max"] = max(d["corte_max"], f["corte"]); d["n"] += 1
    resumen = {str(s): {k: round(v, 2) for k, v in d.items()} for s, d in sorted(por_seg.items())}
    with open(os.path.join(a.salida, "resumen.json"), "w", encoding="utf-8") as fh:
        json.dump({"fps": a.fps, "ancho": a.ancho, "unidades": "px a ese ancho, sumados en cada segundo",
                   "por_segundo": resumen}, fh, ensure_ascii=False, indent=1)
    print(json.dumps({"fotogramas": len(filas) + 1, "salida": a.salida}))


if __name__ == "__main__":
    sys.exit(main())
