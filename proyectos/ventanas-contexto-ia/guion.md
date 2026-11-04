# Guion · ventanas-contexto-ia

Cada frase con hecho lleva su fuente entre corchetes: [f1]. `[C]` marca un cálculo propio a partir de la fuente que lo acompaña.

Lo que va bajo «Opinión» es lo que dice una persona concreta, y en pantalla va marcado como opinión con su nombre.

## Maestro (largo)

### 1. Gancho
Le das a tu IA un PDF de 300 páginas. [f1]

Le preguntas por tres datos repartidos por el documento. Y puede que uno te lo cambie. [f2]

No es que sea tonta. Es que trabaja en una mesa. Y la mesa tiene un tamaño.

Hoy te explico qué es esa mesa, que en la jerga se llama ventana de contexto. Por qué tiene tope. Por qué rinde peor antes de llenarse. Y si una mesa infinita lo arreglaría todo.

Spoiler: no del todo.

### 2. La mesa de trabajo
Una IA como ChatGPT, Claude o Gemini sabe muchas cosas. Las aprendió durante su entrenamiento, y ese conocimiento ya no cambia cuando hablas con ella. [f1]

Pero para contestarte usa otra cosa: lo que tiene delante en ese momento. [f1]

Yo lo veo como mi mesa. Lo que sé, lo llevo en la cabeza. Pero solo puedo trabajar con los papeles que están encima de la mesa.

Y en esa mesa no caben palabras, sino tokens: trozos de palabra.

En los modelos nuevos de Anthropic, un millón de tokens son unas 555.000 palabras. O sea, algo más de media palabra por token. [f5] [C]

Y ojo, porque según el idioma el mismo texto puede gastar bastantes más tokens. El inglés suele salir más barato. [f9]

¿Y cuánto cabe? Hoy, en los modelos punteros, alrededor de un millón de tokens. [f5] [f19] [f20]

Google lo traduce a unas ocho novelas. [f20]

### 3. Lo que hay en la mesa sin que lo veas
Ahora viene lo que casi nadie sabe. En la mesa no está solo lo que tú escribes. [f1]

Están las instrucciones que la empresa le da a la IA y que tú no ves. Las herramientas que puede usar. Los archivos que le subes. [f1]

Y su propia respuesta. Lo que escribe también ocupa sitio en la mesa, y en el siguiente mensaje pasa a ser parte de lo que lee. [f1]

Y otra cosa: la IA no recuerda entre mensajes. Cada vez que le escribes, relee la conversación entera desde el principio. [f6] [f3]

Es como si cada mañana me despertara sin recuerdos y me leyera de un tirón el diario de toda la conversación antes de contestarte.

### 4. La fiesta de los saludos
¿Y cómo lee todo eso? Con algo que se llama atención. Es el corazón del Transformer, el diseño en el que se basan casi todas estas IA. [f41]

La idea es que cada token se fija en todos los demás para entender qué significa. [f7]

Imagínatelo como una fiesta en la que cada invitado tiene que saludar a todos los demás.

Con 10 invitados hay 45 saludos. Con 1.000 invitados, casi medio millón. [C]

Si duplicas los invitados, los saludos se multiplican casi por cuatro. [f7] [C]

Y un millón de tokens es una fiesta de un millón de invitados. Ahí ya hablamos de unos quinientos mil millones de saludos. [C]

Guárdate esta fiesta, porque explica casi todo lo que viene ahora.

### 5. Cuándo lo notas
Seguro que te ha pasado: una conversación muy larga y, de repente, la IA parece olvidar lo que le dijiste al principio.

Pueden estar pasando tres cosas distintas.

La primera: la mesa se ha llenado y la app tira los papeles más antiguos para hacer sitio. [f1]

La segunda: la app ha resumido lo anterior para seguir. Claude lo hace en sus planes de pago, y Claude Code, cuando la conversación se acerca al límite. [f8] [f6]

Pero un resumen, como el acta de una reunión, pierde matices.

Y la tercera es la más curiosa: todo sigue en la mesa, pero la IA lo atiende peor cuanto más hay. [f7]

En 2023, un estudio vio que los modelos usaban mejor lo que estaba al principio y al final, y peor lo del medio. [f13]

Como en un concierto largo: te acuerdas de la primera canción y de la última. [f13]

Hoy ese efecto ha bajado bastante. Pero el otro, el de rendir peor con más texto, sigue ahí. [f10]

Mi consejo de profe, y también el de Google: cuando cambies de tema, abre un chat nuevo. [f3]

### 6. Por qué tiene tope
¿Y por qué no hacen la mesa infinita? Porque choca con cuatro muros.

El primero es la fiesta. Si cada token saluda a todos, el trabajo crece con el cuadrado del texto. [f7]

Meta lo dice en su informe de Llama 3: no entrenaron con textos largos desde el principio porque el cálculo de la atención crece de forma cuadrática. [f16]

El segundo muro es la memoria. Para no rehacer cuentas, el modelo guarda una especie de chuleta de cada token que ya ha leído. Y esa chuleta engorda con cada token. [f37]

Con los números que publica Meta de su modelo más grande, la chuleta de una sola conversación de un millón de tokens ocuparía más de quinientos gigas de memoria. Para un solo usuario. [f16] [C]

El tercer muro es la práctica. Casi no hay textos tan largos para entrenar. [f7]

Llama 3 aprendió con textos de unos 8.000 tokens, y solo al final se le estiró hasta 128.000, con un 5 % de todo su entrenamiento. [f16] [C]

Es como un corredor que siempre ha entrenado carreras de cinco kilómetros. Puede apuntarse a un maratón. Otra cosa es que lo termine bien.

Y el cuarto muro es la factura. Aunque el precio por token no cambie, una petición de 900.000 tokens cuesta cien veces lo que una de 9.000. [f17] [C]

### 7. De 512 a un millón
Con todo eso, la mesa ha crecido muchísimo.

En 2018, GPT-1 trabajaba con 512 tokens. [f26]

En 2020, GPT-3, con 2.048. [f27]

Y en 2023 llegó el gran salto. En un solo año pasamos de los 8.000 de GPT-4 a los 100.000 de Claude y los 200.000 de Claude 2.1. [f28] [f29] [f44]

En 2024, Gemini 1.5 Pro llegó al millón, y después a dos millones. [f30] [f31]

Y en 2025, OpenAI llegó al millón con GPT-4.1. [f32]

De 512 a un millón son unas 2.000 veces más en ocho años. [C]

Pero aquí viene lo raro. Epoch AI calcula que, desde 2023, las ventanas crecían unas 30 veces al año. [f24]

Y sin embargo, desde 2024, el techo de los grandes modelos casi no se ha movido.

### 8. Noviembre de 2026
Así está la mesa hoy.

Anthropic, OpenAI, Google y DeepSeek: alrededor de un millón de tokens en sus modelos punteros. [f5] [f19] [f20] [f22]

xAI se queda en 500.000 con Grok 4.7, la mitad que Grok 4.3. [f21] [f45]

Y Meta anuncia diez millones en Llama 4 Scout. [f23]

El millón se ha vuelto el estándar. Y lo más nuevo no siempre es lo más grande: Gemini tenía dos millones en 2024 y hoy tiene uno. [f31] [f20]

Ojo también con la app: en Gemini, sin plan de pago, la ventana es de 32.000 tokens. [f3]

### 9. Cabe, pero no lo lee
Y ahora, la pregunta de verdad: ¿usan bien lo que cabe?

La respuesta corta es que no del todo.

Chroma probó 18 modelos. Con la misma tarea, solo alargando el texto, todos rindieron peor. [f10]

Ya en 2024, NVIDIA vio que de los modelos que decían aguantar 32.000 tokens o más, solo la mitad lo hacía bien. [f12]

Otro estudio, NoLiMa, probó 13 modelos que anuncian 128.000 tokens o más. A 32.000, once de ellos ya rendían menos de la mitad que con textos cortos. [f11]

Y Google dice de su propio Gemini 3.1 Pro que acierta un 84,9 % en una prueba difícil a 128.000 tokens, pero solo un 26,3 % a un millón. [f15]

La mejora existe: en esa misma prueba, Claude Opus 4.6 sacó un 76 % a un millón, cuando Sonnet 4.5 sacaba un 18,5 %. [f14]

Pero son cifras que dan las propias empresas.

Y Epoch AI ve lo mismo desde fuera: la longitud a la que los mejores modelos aciertan un 80 % se multiplicó por más de 250 en nueve meses. [f25]

Lo que crece ahora no es tanto la mesa como lo bien que se usa.

Así que la cifra de la etiqueta es el tamaño de la mesa. No lo que la IA es capaz de leer bien encima de ella.

Por eso Anthropic habla de ingeniería de contexto: dar a la IA el menor número posible de tokens, pero los que importan. [f7]

### 10. Cómo se rodea hoy
Y como la mesa no da para todo, las empresas hacen trucos.

El primero es el bibliotecario. En vez de ponerte la biblioteca entera en la mesa, te trae solo las fichas que tienen que ver con tu pregunta. Se llama RAG. [f33]

Sale mucho más barato. Aunque, si sobran recursos, poner todo el documento en la mesa suele dar mejores respuestas. [f34]

El segundo es el resumen: cuando la mesa se llena, la IA escribe un resumen de lo anterior y sigue con eso. [f36]

Es como un punto de guardado en el que, en vez de guardar la partida entera, el personaje deja una nota de lo que ha pasado.

El tercero son los becarios. La IA reparte el trabajo entre varias IA, cada una con su mesa limpia, y cada una le devuelve solo un resumen. [f6] [f7]

Anthropic lo probó: rindió un 90 % mejor que una sola IA en su prueba interna, pero gastó unas quince veces más tokens. [f35]

Y luego están los que tocan el motor por dentro. DeepSeek hace que cada token no salude a todos, sino solo a los que parecen importantes. [f22]

Y otros mezclan la atención con capas que no releen todo, sino que van resumiendo sobre la marcha, como Mamba. Su coste crece en línea recta, no al cuadrado. [f42] [f37]

Es como llevar un cuaderno que vas reescribiendo: nunca se llena, pero los detalles viejos se emborronan.

Por eso varias de estas mezclas, como las de Qwen, conservan una de cada cuatro capas con la atención de siempre. [f37]

Y no todos lo tienen claro: MiniMax probó atajos de este tipo y volvió a la atención completa, porque en textos largos fallaban. [f38]

### 11. ¿Y si fuera infinita?
Entonces, ¿hay que tirar el Transformer para tener una mesa más grande?

Para unos pocos millones de tokens, no. Basta con retocarlo o mezclarlo, como ya hacen. [f22] [f23]

Para una mesa de verdad infinita, sí cambia la cosa. Si la chuleta crece con cada token, ningún ordenador da para siempre: en algún momento hay que resumir u olvidar. [f37]

Y aun así, una mesa infinita no resolvería todo.

Opinión. Dario Amodei, que dirige Anthropic, cree que un millón de tokens ya equivale a días de aprendizaje humano, y que llegar a cien millones es cuestión de ingeniería. [f39]

Opinión. Andrej Karpathy, que estuvo en los comienzos de OpenAI, cree que lo que les falta es otra cosa: aprender de verdad con la experiencia, como hacemos nosotros. [f40]

### 12. Cierre
Yo me quedo con esto.

La mesa de tu IA es enorme, pero la usa peor de lo que dice la etiqueta.

Cuanto mejor elijas lo que le pones delante, mejor te contestará.

Y una mesa infinita no es lo mismo que un gato que aprende.

## Short A · Tu IA se relee la conversación entera
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1.
     Estimación (caracteres/13): 835 caracteres de voz → ~64 s · por qué esa duración: para que «se relee todo» no se quede en curiosidad hay que enseñar qué hay en la mesa (lo oculto y la propia respuesta), qué pasa al llenarse y el consejo práctico; con menos, el consejo final no se entiende. -->
Cada vez que le escribes a tu IA, se relee la conversación entera. Desde el principio. [f6] [f3]

No te recuerda entre mensajes. Trabaja con lo que tiene delante, como en una mesa. Se llama ventana de contexto. [f1]

Y en esa mesa no está solo lo que tú escribes. [f1]

Están las instrucciones que la empresa le da y que tú no ves, las herramientas que puede usar, los archivos que le subes. [f1]

Y su propia respuesta, que también ocupa sitio y en el siguiente mensaje pasa a ser parte de lo que lee. [f1]

¿Y cuando la mesa se llena? Unas apps tiran lo más antiguo. Otras lo resumen, y un resumen pierde detalles. [f1] [f8]

Pero hay algo peor: aunque todo quepa, cuanto más hay en la mesa, peor lo atiende. [f7] [f10]

Por eso Google da un consejo muy sencillo: cuando cambies de tema, abre un chat nuevo. [f3]

¿Te interesa saber más? Tengo un vídeo largo en YouTube que explica la mesa entera.

## Short B · Cabe, pero no lo lee
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1.
     Estimación (caracteres/13): 829 caracteres de voz → ~64 s · por qué esa duración: hacen falta dos pruebas independientes y la cifra del propio fabricante para que «cabe pero no lo lee» no parezca una opinión, más el matiz de que ha mejorado. -->
Casi todas las IA punteras anuncian un millón de tokens. Unas ocho novelas. [f5] [f19] [f20]

Pero que quepa no significa que lo lea bien.

Chroma probó 18 modelos. Con la misma tarea, solo alargando el texto, todos rindieron peor. [f10]

Otro estudio probó 13 modelos que anuncian 128.000 tokens o más. A 32.000, once ya rendían menos de la mitad que con textos cortos. [f11]

Y Google dice de su propio Gemini 3.1 Pro que acierta un 84,9 % en una prueba difícil a 128.000 tokens. A un millón, un 26,3 %. [f15]

Ha mejorado, sí: en esa prueba, Claude Opus 4.6 llegó al 76 % a un millón. Pero son cifras de las propias empresas. [f14]

Así que el millón es el tamaño de la mesa. No lo que la IA lee bien encima de ella.

Mi consejo: dale solo lo que importa. Menos papeles, pero los buenos. [f7]

¿Te interesa saber más? Tengo un vídeo largo en YouTube que explica por qué pasa esto.

## Short C · ¿Por qué no la hacen infinita?
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1.
     Estimación (caracteres/13): 960 caracteres de voz → ~74 s · por qué esa duración: son cuatro muros y cada uno necesita su imagen (fiesta, chuleta, corredor, factura); quitar uno deja la pregunta a medias. -->
¿Por qué tu IA no puede leer infinito? Por una fiesta.

Para entender un texto, cada token, cada trozo de palabra, se fija en todos los demás. [f7]

Es como una fiesta en la que cada invitado saluda a todos. Con 10 invitados hay 45 saludos. Con 1.000, casi medio millón. [C]

Duplicas el texto y ese trabajo se multiplica casi por cuatro. Meta lo dice en su informe de Llama 3: crece de forma cuadrática. [f16]

Segundo problema: la memoria. El modelo guarda una chuleta de cada token que ya ha leído, y crece con cada uno. [f37]

Con los números del modelo más grande de Meta, una sola conversación de un millón de tokens ocuparía más de quinientos gigas. Para un solo usuario. [f16] [C]

Tercero: casi no hay textos tan largos para practicar. Llama 3 aprendió con textos de 8.000 tokens y solo al final se estiró a 128.000. [f16]

Y cuarto, la factura: una petición de 900.000 tokens cuesta cien veces lo que una de 9.000. [f17] [C]

¿Te interesa saber más? Tengo un vídeo largo en YouTube que explica cómo lo están intentando resolver.
