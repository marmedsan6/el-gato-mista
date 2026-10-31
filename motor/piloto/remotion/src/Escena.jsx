// Escena «piloto-01» en Remotion: todo sale de estado(frame / fps, formato). Sin reloj real.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from "remotion";
import { estado, PALETA, ESCALA } from "../../comun/escena.mjs";

const FUENTE = "PressStart2PLocal";

function useFuente() {
  const [handle] = useState(() => delayRender("fuente Press Start 2P"));
  useEffect(() => {
    const f = new FontFace(FUENTE, `url(${staticFile("PressStart2P-Regular.ttf")})`);
    f.load().then((c) => { document.fonts.add(c); continueRender(handle); }, () => continueRender(handle));
  }, [handle]);
}

const R = ({ x, y, w, h, c }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: c }} />
);

// Gato provisional 16x16 con rectangulos (coordenadas relativas al sprite)
const GATO = [
  [3, 1, 2, 3, "naranja"], [11, 1, 2, 3, "naranja"], [3, 3, 10, 7, "naranja"], [2, 9, 12, 5, "naranja"],
  [5, 5, 2, 2, "fondo"], [10, 5, 2, 2, "fondo"], [7, 8, 2, 1, "rojo"], [1, 13, 3, 2, "naranja"], [12, 13, 3, 2, "naranja"],
];

export function Escena({ formato }) {
  useFuente();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = estado(frame / fps, formato);
  const { W, H } = s;
  const B = s.composicion === "B";
  const fondo = B ? PALETA.fondoVioleta : PALETA.fondo;

  const verticales = [], horizontales = [];
  for (let x = -s.cuadricula.desplazamiento; x < W; x += s.cuadricula.paso) verticales.push(x);
  for (let y = 0; y < H; y += s.cuadricula.paso) horizontales.push(y);

  const barraX = 16, barraY = B ? 40 : H - 28, barraW = W - 32, barraH = 12;
  const relleno = Math.floor((barraW - 2) * s.barra / 100);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: fondo,
        transform: `scale(${ESCALA})`, transformOrigin: "0 0", imageRendering: "pixelated",
        fontFamily: `${FUENTE}, monospace`, fontSize: 8, lineHeight: "8px",
      }}>
        {verticales.map((x) => <R key={"v" + x} x={x} y={0} w={1} h={H} c={PALETA.linea} />)}
        {horizontales.map((y) => <R key={"h" + y} x={0} y={y} w={W} h={1} c={PALETA.linea} />)}

        {B && <R x={8} y={8} w={W - 16} h={H - 16} c={PALETA.panel} />}
        {B && <R x={8} y={8} w={W - 16} h={1} c={PALETA.azul} />}

        {/* Sprite */}
        <div style={{ position: "absolute", left: s.sprite.x, top: s.sprite.y, width: 16, height: 16 }}>
          {GATO.map(([x, y, w, h, c], i) => <R key={i} x={x} y={y} w={w} h={h} c={PALETA[c]} />)}
        </div>

        {/* Titular */}
        <div style={{ position: "absolute", left: 16, top: B ? 16 : 24, color: B ? PALETA.dorado : PALETA.texto, whiteSpace: "pre" }}>
          {s.titular}
        </div>

        {/* Barra con etiqueta */}
        <R x={barraX} y={barraY} w={barraW} h={barraH} c={PALETA.linea} />
        <R x={barraX + 1} y={barraY + 1} w={barraW - 2} h={barraH - 2} c={PALETA.panel} />
        <R x={barraX + 1} y={barraY + 1} w={relleno} h={barraH - 2} c={B ? PALETA.azul : PALETA.naranja} />
        <div style={{ position: "absolute", left: barraX, top: barraY + barraH + 4, color: PALETA.textoSuave }}>
          {s.barra}%
        </div>

        {/* Particulas */}
        {s.particulas.map((p, i) => <R key={i} x={p.x} y={p.y} w={2} h={2} c={p.c === "azul" ? PALETA.azul : PALETA.dorado} />)}
      </div>
    </AbsoluteFill>
  );
}
