# Crítica · máster short v4 (1080×1920, 58,3 s) · 2026-11-03

Crítico visual (Opus, agente `critico-visual`) sobre 16 fotogramas a 1080×1920 y 360×640 y la hoja de contactos del primer
máster v4 (SHA-256 `c122ac5a…00b0`, ya sustituido). Veredicto: **pasa** como versión de prueba, sin bloqueantes. Pidió
corregir los defectos 1 y 2 antes de usar la cámara como referencia; se corrigieron los tres.

## Lo que funciona (conservar)
- **Ritmo:** mucho más dinámico que la v3. Alterna plano general y detalle cada 3-5 s, y los cortes secos (contador, fecha, pregunta) tienen pegada.
- **MISTA:** entra y sale con sentido. Está en el plano general de cada desplazamiento y en los gags (cajas, «comprado», jaula); nunca en los detalles, nunca dos gatos.
- **Píxel:** nítido y uniforme a ×1,25, ×1,5, ×1,75 y ×2.
- **Interfaz:** el rótulo de cabecera y la caja de diálogo no se mueven con la cámara.
- **Sin regresiones de texto.**

## 3 defectos y qué se hizo
1. **Bajo la caja de diálogo, en los planos de detalle,** asomaban objetos cortados de la mesa y había marcos de selección señalando algo tapado. Además, la caja translúcida dejaba ver sombras.
   - En los planos de detalle, el mundo se recorta en la línea de la caja (y=300 base), con fondo oscuro debajo.
   - La caja de diálogo es opaca (`#171e2a`, en `motor/estilo/estilo.css`).
   - `marcar()` solo dibuja un marco de selección si su objeto se ve entero en el encuadre.
   - Los planos del laboratorio suben (cy=136) para que la línea de la mesa quede fuera.
2. **Las etiquetas de fuente crecían con el zoom,** competían con el dato y rozaban la zona tapada y el borde izquierdo.
   - `fuentesSinZoom()`: conservan su tamaño (escala 1/k), siguen a su objeto y se mantienen entre x=16 y x=237-ancho.
3. **Los zooms fuertes (contador ×2 y pregunta ×1,75) cortaban el panel por un lado.**
   - El contador pasa a ×1,5 con la pantalla centrada; la pregunta, a ×1,25 con el panel entero.

## Otros
- El detalle de la revisión por pares empieza en «informe» (antes, en «revisión»): ahora dura ~2,6 s y no ~1,3 s.
- **Sin cambio:**
  - El último diálogo de un bloque sigue en pantalla ~0,2 s tras cambiar el rótulo; pasa igual en la v3.
  - El tramo de 27 a 35 s tiene 4 cambios de plano; está en el límite, pero no marea.
