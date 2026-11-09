// ventanas-contexto-ia · piezas comunes de los tres shorts (9:16, lienzo de 90×160 unidades de 12 px).
// Zona segura: nada por encima de y = 58 px (12 %), nada bajo la caja de diálogo (y ≥ 300 px) ni en x > 237 px entre
// y = 216 y y = 408 px. MISTA abajo a la izquierda; la idea arriba y a su derecha.
const CORTO = { W: 270, H: 480, SUELO: 97, MESA: 85, GX: 4, GY: 97 - 32, SX: 135, SY: 180, CAJA: 300 };

function escenaShort(bloques, cortes, planos, claves) {
  return escenaV3({ W: CORTO.W, H: CORTO.H, bloques, cortes, planos, SX: CORTO.SX, SY: CORTO.SY, lineaCaja: CORTO.CAJA,
    claves, rotulo: [16, 64], linea: 21, cifrasMono: true });
}

// Tablero de la mesa en vertical (el despacho v3 solo trae el canto): se ve un poco desde arriba
function tableroCorto(e) {
  const M = CORTO.MESA;
  rect(e.capas.medio, 0, M - 8, 90, 8, "#8a5e3e"); rect(e.capas.medio, 0, M - 8, 90, 1, "#a87650");
  for (let y = M - 5; y < M; y += 3) rect(e.capas.medio, 2, y, 86, 1, "#7d5537");
}

// Cierre común: remite al vídeo largo (Mario, 2026-11-02) con una pantalla que reproduce y el rótulo del canal
function carteLargo(e, t, desde) {
  const s = e.s1(t, desde);
  if (s === null) return;
  monitor3(e.frente, 40, 26 + s, 44, 26, { dibujo: (svg, x, y, w, h) => {
    // botón de reproducir: rectángulo rojo con un triángulo blanco que apunta a la derecha
    const cx = x + Math.floor(w / 2), cy = y + Math.floor(h / 2);
    rect(svg, cx - 8, cy - 6, 16, 12, "#2a3350"); rect(svg, cx - 8, cy - 6, 16, 1, "#3d4a72");
    for (let i = 0; i < 6; i++) rect(svg, cx - 3 + i, cy - 5 + i, 1, 11 - 2 * i, P3.naranja);
  } });
  e.tx("insignia", "Vídeo largo", 126, 168, desde);
  e.tx("etiqueta", "en YouTube", 126, 184, desde);
}
