# Crítica · C5b, clip de prueba de 18 s (short y largo) · 2026-10-29

- Revisor: subagente con Opus, siguiendo `.claude/agents/critico-visual.md`.
- Material revisado: 4 hojas de contactos a 2 fotogramas/s y 8 PNG a resolución completa.
- Clip: `.runtime/calibracion/c5b/`. Escena: `motor/calibracion/c5b/`.

## 3 peores defectos
1. **El destello no se ve en las hojas** (t=6 y t=12), aunque `t_6.png` y `t_12.png` sí lo muestran. **Bloqueante para cerrar C5b.**
   - Falta comprobar a 60 fps que el destello está en el MP4 y dura lo previsto.
   - El pico es un gris claro plano, el elemento más luminoso del clip, y roza P24.
   - Arreglo: fotogramas de 5,80 a 6,20 s, hojas con el muestreo exacto y destello menos luminoso o dejando ver la imagen.
2. **short B: la barra se queda en el 70 % de 8,5 a 12 s**; se lee como una carga colgada. Arreglo: llegar al 100 % con un check. No bloqueante.
3. **Etiquetas pequeñas en rojo sobre el panel** («ONDA LARGA», «ROJO»), a 4,1:1, en contra de los tokens. Arreglo: `texto_suave`. No bloqueante.

## Por bloque
- **short A, B y C:** pasan, salvo el defecto 2 en B.
  - Algo nuevo cada 0,5-1 s; el tramo más largo sin novedad es el cierre (16-18 s).
  - Zona segura correcta en todos los fotogramas.
- **largo A, B y C:** pasan.
  - El tramo más largo sin novedad es de 2,5 s (3,5-6 s).
  - En B, el rojo y el azul llegan los dos rectos al ojo. Es un problema de contenido, no de estilo: hay que revisarlo en el vídeo real.

## Otros
- No se puede juzgar el movimiento escalonado con 2 fotogramas/s: hacen falta fotogramas seguidos a 60 fps.
- El texto del diálogo del short parece de 40-44 px, frente a los 48 px de los tokens, y faltan versiones a 360×640.
- La caja de selección enmarca también el punto («azul.»).
- «×1» y «×5,8» no comparten línea base.
- Barras con interior negro puro, que no está en los tokens.
- El borde derecho de la caja de diálogo (904) no coincide con el de los paneles (896).

## Lo que funciona
- No ha vuelto ningún defecto de la crítica 01: 2 acentos por escena, tildes bien, zona segura, «frente a 700 nm», cursor ▶ y λ⁴ unido.
- Reparto de fondos de P7 respetado.
- Primer plano nítido con *bloom* en el sol.
- Etiquetas junto a su objeto.
- Cifras proporcionales a lo dibujado.

## Veredicto: no pasa (solo por el defecto 1)
