# Set grande de piezas pixel con un selector por árbol: ¿es viable?

Fecha: 2026-11-13. Estado: **abandonada por Mario el 2026-11-13** (ver [prueba-v7.md](prueba-v7.md)); se conserva como documentación. Sigue a la propuesta del 2026-11-06
([biblioteca-pixel-2026-11-06](../biblioteca-pixel-2026-11-06/propuesta.md)) y al punto 6 de la hoja de ruta.

Pedido de Mario: usar siempre un set muy grande de figuras pixel art, con alguna pieza a medida cuando convenga, y
que otra IA, a modo de árbol, filtre y decida qué piezas van en cada escena según lo que se dice.

## 1. Veredicto

**Viable y barato, con una condición: el set tiene que ser nuestro, dibujado por código en estilo v6.** Un set comprado
o generado con IA no da por sí solo el 4 px con contorno, 3 tonos y la paleta `R5` que exige el estilo, y meterlo
costaría más que dibujar. El selector por árbol funciona y cuesta poco. Pero **filtra bien y crea poco**: debe proponer
piezas, y la metáfora de cada estación la sigue decidiendo quien escribe la escena.

## 2. Lo que ya pasa sin set (medido)

- **como-google-sabe-lo-que-quieres** tiene **73 piezas dibujadas solo para él** (tele, taza, robot, reloj, moneda,
  calendario, puerta, nube…). La biblioteca común v5/v6 tiene 24. Dibujar y montar las escenas llevó unas **2,5 h**
  (horas de creación de los ficheros: piezas de 15:30 a 16:45; escenas hasta las 17:44). Los arreglos tras el QA y la
  crítica llevaron **4,5 h más** (de 08:15 a 12:49, 4 versiones del largo y 3 de los shorts). Entre los arreglos había
  «iconos que engañan» (decisiones.md).
- **ia-pasa-factura**, el vídeo siguiente, **copió enteros los tres ficheros de piezas del de Google** y añadió 28
  nuevas. Cuenta de llamadas en sus escenas:

  | Short | Piezas nuevas | Del vídeo de Google | Biblioteca común |
  |---|---|---|---|
  | A | 13 | 7 | 4 |
  | B | 14 | 8 | 6 |

  **Cerca de la mitad ya venía hecha.** Las 28 nuevas son casi todas objetos genéricos (camión, grúa, farmacia,
  candado, libro, vaso, gota, flecha, globo, sobre, mesa…); solo unas pocas son propias del tema (pagaré, caja
  registradora, robot bibliotecario).
- Entre cinco vídeos hay objetos dibujados **3 y 4 veces**: nube (4), robot, moneda, calendario, candado, pila, panel
  (3 cada uno).

Conclusión: la reutilización ya ocurre, pero **copiando y pegando**, sin catálogo, sin etiquetas, sin versión y sin
saber qué existe.

## 3. De dónde puede salir un set grande

| Fuente | Tamaño | Coste | Encaje con v6 | Licencia |
|---|---|---|---|---|
| **Propio por código** (lo de ahora, ordenado) | ~100 piezas v6 ya hechas; crece unas 30-70 por vídeo | tokens | **total**: mismo píxel, paleta y contorno; se anima con `seek(t)` y estados | propia |
| Kenney [f1] | miles de sprites | gratis | bajo: planos, sin nuestro sombreado; habría que repintarlos | CC0 |
| Atlas de Krea [f5] | 1.409.404 sprites | gratis | bajo: **16×16** (64 px de 1920), descripciones sin revisar | CC0 + Krea §2.3: comercial por debajo de 1 M$ al año [f6] |
| Retro Diffusion [f2] | a demanda | 0,03-0,18 $ por imagen | medio: la página no dice nada de forzar nuestra paleta en el modelo; la recoloreo es una herramienta aparte | según su web, lo generado es tuyo (por confirmar en sus términos) |
| PixelLab [f3, f4] | a demanda | 12-50 $ al mes; API aparte | medio: estilo por referencia y animaciones; la paleta propia no aparece | uso comercial según terceros (por confirmar) |

**Las imágenes PNG externas chocan con cómo dibujamos.** Nuestras piezas son funciones que pintan a la rejilla de
4 px y cambian de estado con `t` (encendido, lleno, roto…). Un PNG habría que cuantizarlo a `R5`, contornearlo y
partirlo en fotogramas, y aun así el crítico notaría el cambio de mano. Sirven como **referencia** o para atrezo
pequeño, no como base.

## 4. Prueba del selector

Montaje (`catalogo-prueba.txt` y `seleccion-short-a.json` en esta carpeta):
- Catálogo con las 246 funciones que existían **antes** de ia-pasa-factura, solo con nombre y fichero.
- Un subagente **Haiku** recibió el guion del short A de ia-pasa-factura y trabajó por niveles: agrupar frases en
  estaciones → concepto → objetos a dibujar → pieza del catálogo o «FALTA».

Resultado:
- **Elección:** 8 estaciones, 23 objetos, **22 con pieza y 1 que falta** (un grupo de 900 personas).
- **Coste:** 37 s y unos 80.000 tokens.
- **Nombres:** las 20 piezas distintas que eligió **existen**; no se inventó ninguna.
- **8 de esas 20 son de estilos anteriores** (v3 a 12 px, v2, el de Alien): habría que redibujarlas a 4 px. El
  catálogo necesita saber el estilo de cada pieza.
- **Sus metáforas son literales:** lupa, embudo, puerta, robot. Lo que se dibujó de verdad fue más rico: las dos calles
  del estudio de Pew, el grifo del tráfico, el robot bibliotecario. El selector cubre bien lo genérico, pero la idea
  visual de cada estación no la pone él.

## 5. Cómo lo montaría

1. **El set (v6, propio):**
   - Sacar las ~100 piezas v6 de como-google e ia-pasa-factura a `motor/estilo/v6/set/`, un fichero por familia
     (personas, dinero, tiempo, acceso, datos, web, dispositivos, edificios, vehículos, naturaleza…).
   - Cada pieza, con un manifiesto: id, descripción en una línea, conceptos, estados, tamaño, anclajes, estilo,
     versión y origen.
   - Una **hoja de contactos automática** por `seek(t)` para verla entera.
   - Los vídeos publicados conservan sus copias, como ya hacen; `npm test` sigue comparando sus huellas.
2. **El árbol (el selector):**
   - Tema → concepto → objeto → estado.
   - Lo ejecuta un subagente barato tras la PUERTA 1, con el guion y el manifiesto, y devuelve un *storyboard de
     piezas* en JSON con lo elegido y la lista de lo que FALTA.
   - Quien escribe las escenas parte de esa propuesta, decide la metáfora clave de cada estación y dibuja a medida
     solo lo que falta o lo que cuenta la idea central: el «render que creamos oportuno» del que hablaba Mario.
3. **Crecer:**
   - Cada pieza nueva de un vídeo entra al set con su manifiesto al cerrar el vídeo.
   - Además, una tanda inicial de 100-150 piezas de huecos frecuentes, dibujadas por código y revisadas una vez por
     el crítico en hojas.
   - Con 300-500 piezas, la mayoría de las estaciones genéricas saldrían del set.
4. **Opcional, con gasto y tu sí:** probar un generador con 10 piezas difíciles (personas en poses, vehículos,
   edificios), convertirlas a `R5` y pasarlas por el crítico frente a las nuestras.

## 6. Qué ganaríamos, y lo que no sé

- **Tiempo:** si el set cubre el 80-90 % de las piezas genéricas, se ahorraría buena parte de las ~2,5 h de dibujo por
  vídeo, y algunos arreglos, porque las piezas del set ya habrían pasado la crítica. **Es una estimación, no una
  medida.** El render ya no es el cuello de botella: ~13 min ([informe del render](../render-largo-2026-11-12/informe.md)).
- **Calidad:** estilo más uniforme y menos «iconos que engañan». **Riesgo:** que los vídeos se parezcan entre sí. Se
  mitiga con estados y variantes por pieza, con la regla de que la idea central de cada vídeo sea a medida, y con un
  registro de qué piezas salieron en los últimos vídeos.
- **No sé** cuánto baja el número de rondas de crítica con piezas ya aprobadas: hay que medirlo en el primer vídeo
  que use el set.

## 7. Decisiones de Mario

1. ¿Set propio por código como base (recomendado), o probar también un generador de pago?
2. ¿El selector **propone** y quien escribe la escena decide (recomendado), o lo que elija va directo?
3. ¿Cuánto se permite repetir una pieza entre vídeos seguidos?
