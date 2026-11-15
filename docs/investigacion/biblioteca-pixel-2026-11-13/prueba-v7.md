# Prueba v7: adaptar el estilo a un set de pixel art ajeno (abandonada)

Fecha: 2026-11-13. Estado: **abandonada por Mario** («abandonamos la idea, borra todo lo que hayas hecho y simplemente
déjalo documentado»). El código, los sprites y los renders se enviaron a la Papelera. Este documento es lo que queda.
Antecedentes: [informe.md](informe.md) (set propio y selector por árbol) y [animar-un-set-ajeno.md](animar-un-set-ajeno.md)
(cómo animar imágenes fijas).

## Qué se probó, en orden

1. **Demo con sprites provisionales** (10 s, 9:16): las seis capas de animación sobre PNG fijos (cámara, títere, estados,
   bucles, composición y efectos por código) con `seek(t)`. Lint estricto con 0 errores; render a 1080×1920 sin un solo
   bloque de 4×4 mezclado.
2. **Demo «ciudad»** (30 s, 16:9) con el pack «Roguelike Modern City» de Kenney (CC0): tráfico con semáforo y cola
   (simulación determinista calculada al cargar), zoom ×2, travelling, toldo por barrido, puerta, cajas, coche que aparca
   y anochecer por código. A Mario le gustó el estilo.
3. **Short A de ia-pasa-factura rehecho** (67 s, 9:16) con el **RPG Urban Pack** de Kenney (CC0) sobre el sistema de
   siempre: misma voz, tiempos, fuentes, rótulos, cifras, sonidos y mezcla; MISTA solo en la caja (decisión de Mario).

| Medida del short v7 | Resultado |
|---|---|
| Lint estricto | 0 errores (10 textos, 2 a la vez como mucho) |
| Render | 61 s en total (4.027 fotogramas, 2.225 distintos, 0,010-0,017 s por captura) |
| Máster | 1080×1920, 60 fps, 67,1 s, -14,2 LUFS, -2,9 dBTP (el v6: -14,2 LUFS) |
| QA (`qa.mjs`) | 0 fallos, 0 negros, 2 tramos casi quietos (título y final) |
| Crítico visual | no se pasó |

## Cómo se montó (por si se retoma)

- **`motor/estilo/v7/sprites.js`:** carga PNG (`SPR.cargar`) u hojas de casillas (`SPR.cargarHoja`, `SPR.tesela`,
  `SPR.bloque`) y los pinta con una ventana SVG sobre la imagen, sin reescalar. Incluye estados, bucles con fotograma =
  f(t), títere (entrar, saltito, temblor, latido, barrido) y recorridos. `seek(t)` devuelve la promesa de carga: `render.mjs`
  y `revisar.mjs` ya la esperan.
- **`motor/estilo/v7/paleta.mjs`:** cuantiza a una paleta fija sin tramado y con alfa todo o nada; `--comprobar` falla si
  algo no cumple (con test).
- **`render.mjs`:** hacía falta meter los `.png` de `--incluir` en la clave de la caché, porque si no un sprite
  regenerado no invalidaba nada. Ese cambio se fue con la rama: **main sigue sin él**.
- **Motor del short v7:** el `montarShort` del v6 sin el mundo lateral. Se quedan `tiempos6`, título, rótulos, cifras,
  `crearDialogo6`, `window.revision`, `eventosSonido`, `clave6`, `ruta6` y `crearCamara`. El mundo es un mapa cenital
  a **escala base ×2** (1 píxel del set = 8 px de salida) con zoom núcleo ×1,5 (12 px): todo entero.
- **Extracción:** las hojas de Kenney tienen casillas de 16×16, a veces con 1 px de separación. Las piezas de varias
  casillas hay que coserlas, y el magenta pasa a transparente.

## Lo aprendido

- **El set impone su perspectiva.** Kenney es cenital, de día y sin contorno; el v6 es lateral y nocturno. Adaptarse a
  un set es adoptar su vista entera.
- **En 9:16, a 1 píxel del set por unidad todo queda diminuto.** A ×2 se lee como un juego; cada estación cabe en unas
  8×7 casillas encima de la caja.
- **Lo que el set no trae se pinta por código sin desentonar,** al tamaño de su píxel y con sus colores: luz activa del
  semáforo, asfalto, rayas, bocadillos, candado, interrogación, flechas, noche y faros.
- **Hay que leer bien cómo reparte el set las piezas.** Una mala lectura del autobús dio dos vehículos apilados; los
  semáforos venían con las tres luces encendidas a la vez.
- **El tráfico creíble pide simulación,** no recorridos sueltos. Calculada una vez al cargar, `seek(t)` sigue siendo
  determinista.
- **Los nombres (`placa6`) no pueden ir donde cae el rótulo de tema.**
- **El render con sprites fue rápido** (0,010-0,017 s por captura en el short). Pintar cada casilla del suelo como una
  imagen suelta lo encarece (0,12 s por captura en la demo «ciudad»).

## Material de terceros usado (todo CC0, de OpenGameArt, usuario kenney)

| Pack | Fichero | Uso |
|---|---|---|
| Roguelike Modern City | `Roguelike Modern City pack.zip`, 521.237 bytes, SHA-256 `ed45d3c0…93a5` | demo «ciudad» |
| RPG Urban Pack | `kenney_RPGurbanPack.zip`, 306.630 bytes, SHA-256 `4541d89d…afaf` | short A v7 |
| Roguelike Characters | `Roguelike Characters pack.zip`, 144.477 bytes, SHA-256 `def6c164…992d` | descartado (estilo de pueblo) |

Ninguno entró en un vídeo publicado. Las copias en `.runtime/referencias/kenney-*` también se enviaron a la Papelera.
