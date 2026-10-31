// Escena «piloto-01» como función pura de t (segundos): la misma para las 3 candidatas.
// Ver motor/piloto/escena-spec.md. Todo en px enteros del lienzo base; nada depende del reloj.

export const DURACION = 25;
export const FPS = 60;
export const ESCALA = 4;
export const LIENZO = { largo: [480, 270], short: [270, 480] };
export const PALETA = {
  fondo: "#0c1016", fondoVioleta: "#1e1727", panel: "#171e2a", linea: "#36373b",
  texto: "#f5f7fb", textoSuave: "#8a93a6", naranja: "#ff8a3d", azul: "#5b8cff", rojo: "#e0454f", dorado: "#f2c14e",
};
export const TITULAR = "PRUEBA DE MOTOR";

export function mulberry32(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Partículas precalculadas con semilla fija (posición inicial, velocidad, color).
const azar = mulberry32(42);
const PARTICULAS = Array.from({ length: 30 }, () => ({
  x: azar(), y: azar(), vx: (azar() - 0.5) * 40, vy: -10 - azar() * 30, c: azar() < 0.5 ? "azul" : "dorado",
}));

const escalon = (v, paso) => Math.floor(v / paso) * paso; // curva escalonada (P10)
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Estado de la escena en el segundo t para un formato.
 * Devuelve solo números enteros (px base) y textos: cada motor lo pinta a su manera.
 */
export function estado(t, formato = "largo") {
  const [W, H] = LIENZO[formato];
  const f = Math.round(limitar(t, 0, DURACION) * FPS); // fotograma
  const tt = f / FPS;

  // 1. Cuadrícula de 16 px que se desplaza 1 px cada 4 fotogramas
  const cuadricula = { paso: 16, desplazamiento: Math.floor(f / 4) % 16 };

  // 2. Sprite 16×16 que cruza el lienzo de 0 a 12 s, con posición escalonada a 2 px
  const progreso = limitar(tt / 12, 0, 1);
  const sprite = { x: Math.round(escalon(-16 + progreso * (W + 16), 2)), y: Math.round(H * 0.62), w: 16, h: 16 };

  // 3. Titular letra a letra de 2 a 6 s
  const letras = Math.round(limitar((tt - 2) / 4, 0, 1) * TITULAR.length);

  // 4. Barra de 0 a 100 % de 8 a 20 s (pasos de 5 %)
  const barra = escalon(limitar((tt - 8) / 12, 0, 1) * 100, 5);

  // 5. Partículas de 12 a 25 s
  const tp = tt - 12;
  const particulas = tp < 0 ? [] : PARTICULAS.map((p) => ({
    x: Math.round(p.x * W + p.vx * tp), y: Math.round(H * 0.8 + p.vy * tp), c: p.c,
  })).filter((p) => p.x >= 0 && p.x < W && p.y >= 0 && p.y < H);

  // 6. Cambio de composición en t = 15 s
  const composicion = tt < 15 ? "A" : "B";

  return { formato, W, H, fotograma: f, t: tt, cuadricula, sprite, titular: TITULAR.slice(0, letras), barra, particulas, composicion };
}
