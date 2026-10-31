"""Alineación de la voz con el guion (ADR 0006): faster-whisper con marcas por palabra, casado con el texto conocido.

Uso (con el entorno aislado):
  <RUNTIME>/venv-alineacion/Scripts/python.exe -I motor/voz/alinear.py --audio <wav> --guion <txt> --salida <timing.json>
      [--formato short] [--fps 60] [--modelo <carpeta del modelo>]

- El guion es el texto exacto que se leyó, una frase por línea (p. ej. proyectos/<slug>/voz-short.txt).
- Se transcribe en español con marcas por palabra y se casan las palabras normalizadas (minúsculas, sin tildes ni
  puntuación) con difflib. A las palabras del guion que no casan se les reparten los tiempos entre sus vecinas.
- El informe dice qué porcentaje casa y qué palabras faltan o sobran: así se comprueba que la voz leyó el guion
  aprobado sin saltarse ni cambiar nada (las cifras, como «2028» frente a «dos mil veintiocho», salen como sustitución).
"""
import argparse
import difflib
import hashlib
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")


def normalizar(p):
    p = unicodedata.normalize("NFD", p.lower())
    p = "".join(c for c in p if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ]", "", p)


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--audio", required=True)
    a.add_argument("--guion", required=True)
    a.add_argument("--salida", required=True)
    a.add_argument("--formato", default="short")
    a.add_argument("--fps", type=int, default=60)
    a.add_argument("--sin-pista", action="store_true", help="transcribir sin el guion como pista (comprobación a ciegas)")
    a.add_argument("--modelo", default="C:/Users/mario/proyectos/canal-videos/.runtime/modelos/faster-whisper-large-v3-turbo")
    args = a.parse_args()

    frases = [l.strip() for l in Path(args.guion).read_text(encoding="utf-8").splitlines() if l.strip()]
    guion = [(fi, p) for fi, f in enumerate(frases) for p in f.split()]

    # Audio decodificado con FFmpeg (16 kHz mono float32): la versión de PyAV que instala faster-whisper 1.2.1
    # no acepta `metadata_errors` y falla en decode_audio.
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", args.audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    modelo = WhisperModel(args.modelo, device="cpu", compute_type="int8")
    segmentos, info = modelo.transcribe(audio, language="es", word_timestamps=True, beam_size=5,
                                        initial_prompt=None if args.sin_pista else " ".join(frases)[:600], vad_filter=False)
    reconocidas = [(w.word.strip(), w.start, w.end, w.probability) for s in segmentos for w in s.words]

    a_norm = [normalizar(p) for _, p in guion]
    b_norm = [normalizar(w[0]) for w in reconocidas]
    sm = difflib.SequenceMatcher(a=a_norm, b=b_norm, autojunk=False)
    tiempos = [None] * len(guion)
    faltan, sobran, sustituidas = [], [], []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                tiempos[i1 + k] = (reconocidas[j1 + k][1], reconocidas[j1 + k][2])
        elif op == "replace":
            sustituidas.append({"guion": " ".join(p for _, p in guion[i1:i2]), "oido": " ".join(w[0] for w in reconocidas[j1:j2])})
            # Reparte el tramo oído entre las palabras del guion
            ini, fin = reconocidas[j1][1], reconocidas[j2 - 1][2]
            n = i2 - i1
            for k in range(n):
                tiempos[i1 + k] = (ini + (fin - ini) * k / n, ini + (fin - ini) * (k + 1) / n)
        elif op == "delete":
            faltan.append(" ".join(p for _, p in guion[i1:i2]))
        elif op == "insert":
            sobran.append(" ".join(w[0] for w in reconocidas[j1:j2]))

    # Palabras sin tiempo (no oídas): se interpolan entre la anterior y la siguiente con tiempo
    for k, t in enumerate(tiempos):
        if t is None:
            prev = next((tiempos[j][1] for j in range(k - 1, -1, -1) if tiempos[j]), 0.0)
            sig = next((tiempos[j][0] for j in range(k + 1, len(tiempos)) if tiempos[j]), prev + 0.3)
            tiempos[k] = (prev, max(prev, sig))

    salida_frases = []
    for fi, texto in enumerate(frases):
        idx = [k for k, (f, _) in enumerate(guion) if f == fi]
        palabras = [{"p": guion[k][1], "i": round(tiempos[k][0], 3), "f": round(tiempos[k][1], 3)} for k in idx]
        salida_frases.append({"id": f"fr{fi + 1:02d}", "texto": texto, "inicio": palabras[0]["i"], "fin": palabras[-1]["f"], "palabras": palabras})

    casadas = sum(1 for op, i1, i2, *_ in sm.get_opcodes() if op == "equal" for _ in range(i2 - i1))
    resultado = {
        "formato": args.formato, "fps": args.fps,
        "audio": {"fichero": Path(args.audio).name, "sha256": hashlib.sha256(Path(args.audio).read_bytes()).hexdigest(),
                  "duracion_s": round(info.duration, 3)},
        "alineacion": {"herramienta": "faster-whisper 1.2.1 · large-v3-turbo (int8, CPU)", "con_pista": not args.sin_pista, "palabras_guion": len(guion),
                       "casadas": casadas, "porcentaje": round(100 * casadas / len(guion), 1),
                       "faltan": faltan, "sobran": sobran, "sustituidas": sustituidas},
        "frases": salida_frases,
        "escenas": [],
    }
    Path(args.salida).write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    al = resultado["alineacion"]
    print(json.dumps({"salida": args.salida, "duracion_s": resultado["audio"]["duracion_s"], "palabras": al["palabras_guion"],
                      "casadas_pct": al["porcentaje"], "faltan": al["faltan"], "sobran": al["sobran"], "sustituidas": al["sustituidas"]},
                     ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
