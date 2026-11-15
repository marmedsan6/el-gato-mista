# Adaptar nuestro estilo a un set generado (PixelLab) y cómo animar imágenes fijas

Fecha: 2026-11-13. Estado: **abandonada por Mario el 2026-11-13** tras probarla con packs CC0 de Kenney (ver [prueba-v7.md](prueba-v7.md)); PixelLab no se llegó a usar. Complementa a
[informe.md](informe.md). Pedido de Mario: no hacer un set con nuestro estilo, sino **adaptar nuestro estilo al
set**, y valorar cómo casar las animaciones con unas piezas que llegan como imágenes y no como animaciones completas.

## 1. Veredicto

**Viable, como un cambio de estilo (una «v7»), no como un añadido a la v6.** El motor (contrato `seek(t)`, cámara,
paralaje, caja de diálogo, tiempos de la voz, render) no depende de cómo se dibuja cada pieza: una imagen PNG entra en
la escena igual que hoy entra un dibujo por código. Lo que cambia es **cómo se anima**:
- hoy cada pieza se anima por dentro (la aguja, la luz, la tapa, porque la dibujamos);
- con un set generado, la mayor parte del movimiento pasa a ser **coreografía**: piezas que entran, saltan, cambian de
  estado o se mueven por un recorrido, más bucles cortos generados para lo que tenga que moverse por dentro.

Se puede llegar al «algo nuevo cada 1-2 s» con eso. El riesgo está en la coherencia del set y en las animaciones que
explican un mecanismo, no en la técnica. Hay que probarlo antes de decidir (§6).

## 2. Qué da PixelLab (documentación oficial, 2026-11-13)

- **Imágenes:** de texto a pixel art, hasta 400-512 px de lado según el modelo; generación con **estilo de referencia**;
  *inpainting* (retocar una parte manteniendo el resto); rotación en 8 direcciones; convertir una imagen a pixel art;
  quitar el fondo. [f7]
- **Animación:**

  | Herramienta | Tamaño máximo | Fotogramas |
  |---|---|---|
  | Animar con texto v3 (desde uno o dos fotogramas) | 256×256 | hasta 16 |
  | PixMiniMax (beta) | 256×256 | de 4 a 40 |
  | Esqueleto v3 | 256×256 | de 3 a 15 |
  | Efectos (VFX) | 512×512 | hasta 32 |

  El modo clásico de «animar con texto» va a 64×64 exactos y da 4 fotogramas; acepta **paleta objetivo**. La propia
  documentación recomienda generar varias veces, quedarse con los mejores fotogramas y repasarlos. [f7, f8]
- **Coste por llamada (estimado por ellos):** 0,007-0,017 $ en los modelos básicos y 0,08-0,15 $ en los Pro. Algunas
  herramientas piden suscripción (Tier 1). [f7]
- **Para el agente:** servidor MCP y API. Instalarlo y pagarlo necesita el sí de Mario.
- **Licencia de uso comercial:** la página de la API no la detalla; **hay que leer sus términos antes de publicar
  nada**.

## 3. Cómo se anima una imagen fija sin romper el pixel

Seis capas, de la más barata a la más cara. Todas encajan en `seek(t)`: el fotograma se calcula desde `t`, sin reloj.

| Capa | Qué es | Sirve para | Coste |
|---|---|---|---|
| 1. Cámara | Travelling, paralaje y zoom, que ya existen | que el mundo nunca esté quieto | 0 |
| 2. Títere | Mover la imagen entera: entrar, salir, saltito, temblor, latido de 1 px, voltear, aparecer por barrido | entradas y énfasis en cada palabra clave | 0 |
| 3. Estados | Variantes de la misma pieza hechas con *inpainting* (puerta cerrada/abierta, tarro vacío/lleno, servidor apagado/saturado) que se cambian en una palabra de la voz | cambios con significado: «cae», «se cierra», «se llena» | 1 llamada por estado |
| 4. Bucles generados | Hojas de 4-16 fotogramas (respirar, hablar, señalar, humo, engranaje, pantalla parpadeando); fotograma = f(t) | vida por dentro: personas, máquinas, fuego | 1 llamada por bucle, y repasarlo |
| 5. Composición | Explicar con varias piezas pequeñas que se mueven por un recorrido (monedas que caen al embudo, fichas que viajan, barras que suben a saltos) | mecanismos: lo que hoy hacemos dibujando la animación entera | código, sin generar |
| 6. Efectos por código | Chispas, brillo, flechas, contadores y cifras, dibujados a la rejilla con la paleta del set | señalar, contar, unir piezas | código |

**Lo que no funciona con imágenes fijas** (y la salida):
- **Girar o escalar libremente** destroza la rejilla de píxeles. Solo se puede mover a píxel entero, voltear, girar
  90° o usar las 8 rotaciones que genera el propio servicio.
- **Mover una parte de la imagen** (la aguja de un indicador, el brazo de alguien) obliga a generar la pieza por
  partes (la base y la aguja aparte, usando el *inpainting* para separarlas) o a generar un bucle. Funciona, pero cuesta
  más trabajo por pieza.
- **Transformar un objeto en otro** con un fundido queda poco pixel. Mejor un corte con un efecto de «puf».

## 4. Qué hace falta para que el set sea coherente

1. **Una sola densidad de píxel.** Todo se genera ya a su tamaño final en la rejilla del lienzo (480×270 o 270×480, a
   ×4) y nunca se reescala a medias. Por ejemplo: objetos de 32-96 px y personas de 48-64 px.
2. **Una paleta fija.** Se pide la paleta objetivo donde exista y, en todo caso, se recuantiza en local con un script
   determinista. La paleta podría ser una nueva sacada del set, o la nuestra ampliada.
3. **Un set de referencia de estilo** (10-20 piezas aprobadas por Mario) que se pasa siempre como referencia, y una
   **puerta de estilo**: el crítico revisa cada tanda nueva en hoja de contactos frente a la referencia. La deriva de
   estilo entre cientos de piezas es el riesgo principal.
4. **Caja de diálogo, tipografías y textos** se quedan como están. **MISTA** habría que redibujarlo en el estilo del
   set o mantenerlo a propósito como está: lo decide Mario.

## 5. Cómo encaja con el árbol que elige las piezas

- **El set:** los PNG con su ficha (prompt, semilla, paleta, tamaño, estados, bucles, conceptos, licencia).
- **El selector:** propone las piezas de cada estación, como en la prueba del informe.
- **Lo que falta** se genera en el momento, por MCP o API, con la referencia y la paleta, pasa la puerta de estilo y
  entra al set. Así el set crece solo, vídeo a vídeo.
- **Coste orientativo (sin medir):** con unas 20 piezas nuevas por vídeo, cada una con su imagen, 2 estados y un bucle,
  son unas 80 llamadas: del orden de 2-8 $ por vídeo, más la suscripción si alguna herramienta la exige. Hay que
  medirlo en la prueba.

## 6. Prueba propuesta antes de decidir (necesita el sí de Mario)

1. **Cuenta de PixelLab:** la crea Mario (hay prueba gratuita sin tarjeta, según su web). Instalar el MCP o usar la API
   se decide antes. Leer sus términos de uso comercial.
2. **Rehacer el short A de ia-pasa-factura**, 8 estaciones, con unas 15 piezas generadas: paleta fija y una sola
   densidad, al menos 2 estados y 2 bucles.
3. **Animar con las seis capas** del §3 en una escena `seek(t)` normal, pasar lint y QA, y renderizarla.
4. **Comparar con la versión v6:** el crítico sobre las dos y Mario mirando las dos. Medir horas y dólares gastados.

Si gana, la v7 se fija con su ADR, su guía en `docs/estilo.md` y sus plantillas. Si no, se queda en atrezo.
