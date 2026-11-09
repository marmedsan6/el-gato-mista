# Biblioteca de recursos pixel animados para El Gato Mista

Fecha: 2026-11-06. Estado: investigación y propuesta; no es un cambio aprobado de estilo ni una orden de producción.

## Petición de Mario

Crear un conjunto amplio de imágenes pixel con animaciones, reutilizables como fondos o para explicar conceptos. No se refiere a un único plató. Mario recuerda un repositorio externo posiblemente integrado en la v6; no ha quedado identificado con la evidencia disponible.

## Referencia analizada

Reel de SpriteForge (@spriteforgetech): https://www.instagram.com/reels/DfUurtvD7Jd/ (f1 en fuentes.json).

Descargado con yt-dlp 2026.08.19. ffprobe: vídeo H.264, 720×1280, 30 fps, audio AAC y duración de contenedor 39,273375 s. Revisión visual mediante hoja de contactos a un fotograma por segundo a lo largo del reel, además de una muestra inicial cada cinco segundos. Transcripción automática local con faster-whisper large-v3-turbo, CPU/int8: audio 39,168 s, inglés detectado con probabilidad 0,99805. No equivale a escucha humana ni a visionado audiovisual continuo.

Resumen del contenido, no transcripción literal:

| Tramo aproximado | Contenido |
|---|---|
| 0–12 s | El autor presenta la necesidad de 1.561 sprites para su RPG y contrapone el tiempo de dibujarlos y el coste de contratar a un artista. |
| 12–24 s | Critica su ejemplo de generación por difusión: apariencia pixelada con colores y cuadrícula poco controlados. |
| 24–33 s | Presenta su alternativa: Claude construye sprites en una cuadrícula, píxel por píxel, con una paleta pequeña. |
| 33–39 s | Muestra resultados dentro de un juego y termina con una llamada a pedir el enlace. |

La cifra 1.561 está en pantalla y en la descripción. El ASR devuelve 1.500: no usar esa lectura como dato verificado. Las 39 semanas y el volumen producido son afirmaciones del autor, no medidas nuestras. El ejemplo de difusión mostrado no demuestra que todos los modelos o flujos de difusión fallen así. La cuadrícula y la paleta controladas tampoco garantizan por sí solas buen dibujo o animaciones coherentes.

## Qué existe ya

- `motor/estilo/v3/gato.js`: MISTA representado mediante filas de caracteres y una paleta; poses, cara, boca, cola y parpadeo calculados desde el tiempo.
- `motor/estilo/v3/props.js`: matraces, microscopio, botes, corcho, tarjetas, monitor, caja, papel, libros, taza, lupa, ratón, jaula y símbolos. Algunos tienen estado activo o movimiento.
- `motor/estilo/v3/escenarios.js`: laboratorio, servidores, despacho y azotea; capas separadas de fondo, plano medio, luz y primer plano.
- `proyectos/resumen-semana-agentes/escenas/comun/agentes.js`: candidatos a reutilizar como robots, cerebro, bucle, cartucho, moneda, caja fuerte, ingeniero, extensión, reloj, calendario, gafas, auricular, chip y terminal. Siguen siendo recursos de ese vídeo; extraerlos requiere revisar dependencias y conservar su reproducción.

El commit `55422e3` y `proyectos/mithril-ia-medicina/reviews/iter-06.md` documentan el redibujado propio a 12 px. La escena short-v6 carga la biblioteca local. No se ha encontrado allí una dependencia externa de pixel art, ni una referencia identificable a ella en los documentos consultados. Esto no prueba que nunca se instalase una herramienta externa en otro lugar.

## Propuesta

Construir una biblioteca propia acumulativa con tres tipos de recursos:

1. **Fondos por capas.** Habitaciones, ciudad, laboratorio, servidores, exteriores y ambientes temáticos. Paredes, muebles, objetos cercanos, luces y partículas separados para poder recomponerlos en 16:9 y 9:16.
2. **Objetos y personajes animados.** Cada recurso con estados con sentido: servidor apagado/procesando/saturado, carpeta vacía/llena, robot esperando/trabajando/error, puerta cerrada/abierta. Bucles breves solo cuando aporten vida o información.
3. **Escenas explicativas reutilizables.** Enviar un mensaje y recibir respuesta; llenar una memoria y desbordarla; buscar un documento; bloquear un acceso; comparar dos cantidades; recorrer un bucle. El texto, los valores, el número de elementos y los tiempos se adaptan al guion.

Mantener el estilo v3 aprobado: tamaño de píxel de referencia de 12 px, pocos objetos grandes, iluminación y sombreado coherentes, profundidad por capas y MISTA reconocible. Mantener las excepciones vigentes del texto/retrato y el comportamiento de cámara aprobado. Los fondos se componen para cada formato; no se recortan del largo.

El catálogo debe mostrar miniatura, animación, etiquetas temáticas, tamaño nativo, estados disponibles, origen/licencia y versión. Etiquetar por concepto además de por objeto: «memoria», «búsqueda», «espera», «error», «comparación». Así el guion puede pedir una idea y encontrar varias formas de representarla.

Los recursos se guardan con datos de píxel/paleta o código, y cuando convenga con hojas de sprites PNG transparentes y duración de sus fotogramas. El motor elige el fotograma a partir de `t`; no se dependerá del reloj de reproducción de un GIF. Un manifiesto identifica versión, anclajes, capas, variantes y estados. Los vídeos publicados fijan la versión del recurso para no cambiar al mejorar la biblioteca.

## Papel de SpriteForge

Según su documentación oficial consultada (f2–f4), el editor y el generador son productos separados. El editor permite trabajar sobre cuadrícula y paleta; el generador utiliza créditos y produce sprites, conjuntos, animaciones y tilesets. La documentación indica que la generación funciona mejor entre 8 y 32 px y admite hasta 64 px por lado; conviene usar piezas pequeñas para componer fondos grandes.

Puede servir como herramienta de autoría/exportación. No es necesario sustituir el motor actual. La representación de MISTA ya comparte el principio de paleta y cuadrícula. La recomendación inicial es organizar lo existente y evaluar después si el editor o generador mejora el trabajo. No se ha instalado, conectado ni pagado ningún servicio. La calidad, el coste de nuestro lote y la licencia aplicable a recursos concretos se comprobarían antes de incorporarlos.

## Primer lote propuesto

- Normalizar los cuatro fondos existentes y documentar su composición por formato.
- Elegir unas 24 familias de objetos de uso frecuente, priorizando material ya creado.
- Preparar tres estados útiles por objeto cuando tenga sentido; no multiplicar variantes decorativas sin utilidad narrativa.
- Crear seis escenas explicativas parametrizadas y un catálogo visual navegable.
- Probar el mismo material en tres temas del canal: IA, ciencia y videojuegos. Una biblioteca grande puede crecer a partir de esta base; la cantidad inicial es propuesta, no compromiso ni resultado ya realizado.

Antes de generar piezas se concretarán con Mario las familias iniciales y las dudas visuales pendientes. Después: muestras comparables en ambos formatos, clip breve de prueba y revisión visual. No se cambia la guía de estilo hasta aprobación expresa.

## Verificación de esta investigación

- `git show --stat 55422e3`: confirma la introducción de los tres ficheros de biblioteca v3 y la calibración.
- `rg -n '^function ' motor/estilo/v3`: identifica los recursos y funciones existentes.
- `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json .runtime/referencias/DfUurtvD7Jd/reel.mp4`: medidas indicadas arriba.
- `ffmpeg -v error -i .runtime/referencias/DfUurtvD7Jd/reel.mp4 -vf 'fps=1,scale=216:-1,tile=8x5' -frames:v 1 .runtime/referencias/DfUurtvD7Jd/contacto-completo.jpg`: hoja visual revisada.
- Material de referencia y transcripción automática en `.runtime/referencias/DfUurtvD7Jd/`, ignorado por git. Solo referencia de investigación: no autorización de reutilizar sus sprites en vídeos.
- No se han modificado escenas ni ejecutado pruebas del motor: esta entrega es documental. La integración y su QA siguen pendientes.
