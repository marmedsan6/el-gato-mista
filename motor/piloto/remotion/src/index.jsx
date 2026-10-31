import React from "react";
import { registerRoot, Composition } from "remotion";
import { Escena } from "./Escena.jsx";
import { DURACION, FPS, LIENZO, ESCALA } from "../../comun/escena.mjs";

const FRAMES = DURACION * FPS;
const comp = (id, formato) => (
  <Composition
    id={id}
    component={Escena}
    durationInFrames={FRAMES}
    fps={FPS}
    width={LIENZO[formato][0] * ESCALA}
    height={LIENZO[formato][1] * ESCALA}
    defaultProps={{ formato }}
  />
);

registerRoot(() => (
  <>
    {comp("piloto-largo", "largo")}
    {comp("piloto-short", "short")}
  </>
));
