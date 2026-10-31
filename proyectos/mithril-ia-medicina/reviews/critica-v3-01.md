# Crítica · máster short v3 (1080×1920, 58,3 s) · 2026-10-31

Crítico visual (Opus, `.claude/agents/critico-visual.md`) sobre 15 fotogramas a 1080×1920 y 360×640 y la hoja de contactos del
primer máster v3 (SHA-256 `24295c91…c96f`, ya sustituido). Veredicto: **pasa**, sin bloqueantes.

## Lo que funciona (conservar)
- **Desplazamiento lateral:** se lee como un cambio de pantalla de plataformas.
  - La curva es simétrica: 135, 540 y 945 px de salida a 19,85, 19,95 y 20,05 s.
  - No hay huecos ni negro, y nada se queda atrás.
  - Nunca salen dos gatos y la caja de diálogo se oculta durante el desplazamiento.
- **Fondo nuevo:** respeta la escala ×1 del escenario y queda en capas de poco contraste, lejos de los paneles de datos.
- **Sin regresiones respecto a la v2:** textos, márgenes y ortografía siguen bien.

## 3 defectos (no bloqueantes) y qué se hizo
1. **[50,50 s] Costura en C→D:** el primer edificio de la azotea, que empieza en x<0, invadía 4 px base del despacho que salía.
   - Arreglo: `capaDesplazada()` recorta cada escenario a su propio lienzo con un `clipPath` (`motor/estilo/pixel.js`).
   - Comprobado: la costura queda limpia en x=540 de salida.
2. **[3,5 y 11,0 s] Motas de polvo junto a los rótulos:** a 360×640 parecían puntuación.
   - Arreglo: el polvo del laboratorio queda en el cono de la lámpara, por encima de y=56 base.
3. **[55,15 y 57,6 s] Avión y estrella fugaz casi ilegibles:** el avión pasa a 6×2 px con luz alterna en la cola y el morro; la estrella lleva cabeza de 2×2 y una estela que se acorta a escalones.

## Otros
- El cable del suelo de los servidores sube 2 px base para no rozar la caja de diálogo.
- Sin cambio: la luna roza el panel de la pregunta (ya aceptado); el nodo apagado en 24,6 s es el undécimo, que aún no se ha encendido.
