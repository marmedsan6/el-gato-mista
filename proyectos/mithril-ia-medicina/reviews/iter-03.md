# Iteración 03 · short v3 · 2026-10-31

- Qué se enseña: máster del short v2 tras la iteración 02 (`salida/short-v2.mp4`, SHA-256 `368c32dd…16ae`).

## Me gustó (se conserva)
- No señala nada en contra del resto: pide 4 cambios concretos.

## No me gustó
- Los efectos suenan demasiado alto.
- Los efectos siguen al texto y no a lo que pasa en pantalla.
- La pantalla blanca entre escenas.
- Los fondos tienen poco movimiento.

## Cambia exactamente (qué · dónde · cómo)
- **Volumen de efectos:** de -12 a **-18 dB** (`mezcla.mjs --sfx-db -18`). Respuesta de Mario: «Bastante: -18 dB».
- **Sonidos atados a la pantalla:** fuera los blips de las palabras del diálogo. Respuesta de Mario: «Pasarlos a la pantalla». Quedan **14** efectos, cada uno en el instante en que algo aparece o reacciona:
  - se clava la primera tarjeta;
  - el undécimo matraz y el undécimo nodo;
  - el matraz, el microscopio y las cajas cuando se marcan;
  - el ratón aparece en la pantalla;
  - «ADQUIRIDA» con el sello;
  - la lupa llega al «NO»;
  - la flecha llega a 2028;
  - aparece la jaula;
  - los 3 desplazamientos entre bloques.
  - El marco de la palabra clave del diálogo se mantiene, pero ya no suena.
- **Transición:** el destello blanco se sustituye por un **desplazamiento lateral** de 0,4 s, como pasar de pantalla en un juego de plataformas. Respuesta de Mario: «Desplazamiento lateral».
  - El escenario que sale se va a la izquierda con sus textos y MISTA; el nuevo entra por la derecha.
  - El movimiento acelera y frena suave, a píxeles enteros.
  - MISTA reaparece en el nuevo escenario con un saltito al terminar, nunca dos gatos a la vez.
  - La caja de diálogo se oculta durante los 0,4 s.
- **Fondos con movimiento** («vivo pero tranquilo», `motor/estilo/escenarios.js`):
  - **Laboratorio:** la lámpara se balancea, polvo flota en su luz, suben burbujas por los botes y un avión cruza la ventana.
  - **Servidores:** paquetes de datos por el cable del techo y del suelo, ventiladores girando en los racks y un barrido de luz sobre el fondo.
  - **Despacho:** ventilador de techo, reloj de pared con segundero y polvo en la luz de la lámpara.
  - **Azotea:** nubes que pasan por delante de la luna, una estrella fugaz cada 5 s, un avión con luz intermitente y un murciélago.
