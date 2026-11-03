# Guion · phonic-1-voz

Cada frase con hecho lleva su fuente entre corchetes: [f1].

`[CLIP mm:ss]` marca un fragmento de la llamada, solo con la voz del modelo (tramos exactos en `fuentes.json`, m1).

## Maestro (largo)

### 1. Gancho
«Cancela la cita del lunes... no, la del martes.» [f10]

Es un ejemplo, pero piensa en él un segundo. Una persona esperaría a que acabaras la frase.

La mayoría de las IA de voz, también. [f1]

Phonic-1, no. Su empresa dice que es el único modelo que puede hacer cosas mientras tú sigues hablando. [f1] [f2]

Así que tenía una duda muy simple: si actúa antes de que termines, ¿qué pasa cuando cambias de idea?

Me fui a buscarlo a su propia demostración. Y encontré una reserva que nadie le mencionó a la clienta. Ahora llegamos.

### 2. Por qué suenan torpes
Si alguna vez has hablado con un asistente telefónico, ya conoces el baile.

Hablas. Silencio. Más silencio. Y cuando por fin contesta, tú ya habías vuelto a hablar.

No es mala educación. Es cómo están construidos.

### 3. La cascada
Muchos agentes de voz son, en realidad, tres máquinas en fila. [f1] [f12]

La primera convierte tu voz en texto. La segunda lee ese texto y decide qué hacer. La tercera convierte la respuesta otra vez en voz. [f1] [f12]

Se llama cascada. Y funciona como un teléfono escacharrado muy bien organizado.

### 4. Qué se pierde por el camino
Tiene tres pegas.

La primera: el texto no tiene tono. Una pausa, una duda o una ironía se quedan por el camino. [f16] [f21]

La segunda: cada paso añade espera. [f11]

La tercera es la importante: otros modelos esperan a que termines para usar cualquier herramienta. Para buscar una mesa, mirar un vuelo o apuntar un dato. [f1]

Por eso oyes el famoso «déjame que lo compruebe», seguido de un silencio.

Ahora bien, la cascada tiene una ventaja que luego nos va a importar: como hay texto por medio, puedes revisarlo antes de que la máquina responda. [f12]

### 5. Phonic-1
El 29 de octubre, una empresa de diez personas presentó Phonic-1, junto a una ronda de 27,5 millones de dólares. [f6] [f15]

Su propuesta: quitar la transcripción de en medio. Tu voz entra directamente en el modelo. [f1]

Y mientras te escucha, puede ir haciendo cosas. [f1]

Phonic enseña esta comparación: la misma petición, cinco herramientas. Phonic-1 contesta 1,1 segundos después de que termines. GPT-Live, 15,7. [f1]

Es una demostración elegida por la propia empresa, así que la apunto a lápiz.

### 6. La llamada de 44 minutos
Para enseñarlo, publicaron una llamada de 44 minutos. [f3] [f7]

Sofia organiza una despedida de soltera para once personas en Río y llama a un hotel. Al otro lado, Phonic-1 hace de conserje del hotel: Mariana. [f1] [f3]

[CLIP 00:01]

Y hay que reconocerlo: impresiona.

Sofia avisa a los seis minutos de que una amiga tiene una alergia grave a los frutos secos. Más de veinticinco minutos después, Mariana sigue pidiendo comida sin frutos secos para ella. [f3]

Cuando Sofia se pone a buscar un vuelo, Mariana se calla y espera. [f3]

Cuando Sofia pide seguir en portugués, cambia sin perder el hilo. [f3]

[CLIP 18:07]

Y su respuesta típica tarda 0,58 segundos. [f3]

Pero mi momento favorito es este: Mariana manda llamar a tres restaurantes y sigue charlando. Esas gestiones tardan entre 38 y 64 segundos. La conversación no se para, y cuando Sofia pregunta, ya tiene las tres respuestas. [f3]

Sin «déjame que lo compruebe». Sin silencio.

### 7. La letra pequeña
Pero esa página deja ver cada herramienta que usó. Así que me puse a mirar. [f3]

Phonic habla de 123 llamadas a herramientas. Las conté y salen 123 exactas. Pero ocho son decidir no hablar, y una es colgar. Quedan 114. [f3] [f7]

Esas 114 van a la misma dirección: api.example.com, un dominio reservado para ejemplos. [f3] [f17]

Y los teléfonos de los invitados usan el 555-01, la numeración reservada para ficción. Sí, la de las películas. [f3] [f18]

Todo apunta a que el hotel es un simulador y nadie ha reservado nada.

Ojo, eso no es trampa: una demo se monta así, y Phonic ya dice que el modelo hace de conserje. [f1]

Pero significa que esas herramientas suelen contestar en una décima de segundo, y que las 114 responden que todo ha ido bien. [f3]

Un sistema real puede no ser tan amable.

¿Y cuántas veces actuó mientras ella hablaba? Por lo que muestra el registro, unas once de 114. [f3]

### 8. La reserva
Y ahora, la reserva.

Minuto 16. Sofia propone Tia Rosa, el restaurante al que la llevaba su abuelo, para siete personas, a las ocho y media. [f3]

Y en su turno, el registro muestra esto: reservar mesa. Tia Rosa. Siete personas. Ocho y media. Respuesta: confirmada. Código RT-4842. [f3]

Once segundos después, Mariana le dice que a esa hora no hay sitio. [f3]

[CLIP 16:15]

Sofia nunca oye ese código.

Más tarde descartan el restaurante, porque su cocina no puede garantizar una comida sin trazas de frutos secos para su amiga. [f3]

Repasé todo el registro. Nadie vuelve a mencionar ese código. Y no hay ninguna cancelación. [f3]

Hay que ser justos. Parece un simulador, y dice a la vez que la mesa está confirmada y que no hay sitio. No sé si por detrás se corrige solo: el registro público no me lo dice. [f3]

La documentación de Phonic dice que, por norma, ejecuta las herramientas lo antes posible. También que algunas se interrumpen si hablas mientras se ejecutan. Pero no explica qué pasa si te corriges. [f4]

Y es exactamente la pregunta del principio. Con un restaurante de verdad, sería una mesa para siete que nadie va a ocupar.

Hay otra cosa, más pequeña. En una nota, Mariana apunta a una invitada como Tara. Se llama Sarah. [f3]

### 9. La regla
¿Tiene arreglo? Probablemente sí, y no hace falta magia.

En las respuestas al tweet por el que llegué aquí, un usuario, JVCE, lo resumía muy bien: mientras escuchas, busca y consulta. Antes de reservar, cancelar o cobrar, repite lo que vas a hacer y espera un sí. Y si el cliente se corrige, manda lo último. [f10]

Consultar, sí. Cobrar, solo con un sí.

Esa línea no la traza la voz. La traza quien monta el agente.

### 10. Te pasará a ti
Porque esto no va de despedidas en Río.

Phonic dice que ya atiende llamadas en seis continentes, en atención al cliente, sanidad, selección de personal y logística. [f1]

Ashby, por ejemplo, dice que la usa para sus entrevistas con IA en 25 países. [f1] Tu próxima entrevista de trabajo podría ser con una voz así.

En Europa, desde agosto, estos sistemas deben estar diseñados para que sepas que hablas con una IA, salvo que sea evidente. [f19] [f20]

Y en España, los servicios básicos y las grandes empresas tienen hasta finales de diciembre para adaptarse a una ley que te deja pedir hablar con una persona en cualquier momento. [f14]

Cuanto mejor suene la máquina, más importa saber eso.

### 11. ¿Resuelto? Las cifras con lupa
«Por fin alguien lo ha resuelto», decía el tweet. Vamos a verlo. [f11]

Phonic-1 es primero en el índice de voz a voz de Artificial Analysis. Cierto. Con 87,1 puntos, frente a 86,9 de Grok Voice 3. Dos décimas. [f8]

Donde sí saca ventaja es en resolver tareas con herramientas: 79,9 % frente a 74,5 % del siguiente. Es su dato más sólido. [f8]

En velocidad, 0,61 segundos: lo mejor de los cinco primeros, aunque más abajo hay modelos más rápidos. [f8]

¿Y gusta? Depende de a quién preguntes. En Artificial Analysis queda fuera de los cinco primeros en preferencia humana. [f8] [f9] En la prueba que publica Phonic, gana a GPT-Live-1 por 61,5 % a 32 %. [f1]

Frente a actores de voz humanos, pierde: 57 % a 32 %. Lo dice la propia Phonic. [f1]

Su web también cuenta que usa modelos de frontera como supervisores, para herramientas y razonamiento, sin decir cuáles. La voz es directa, pero no trabaja sola. [f2]

Y lo de ser el único: lo dice la empresa. No he encontrado a nadie que lo haya verificado. [f1]

### 12. Cierre
Entonces, ¿qué ha resuelto?

Una parte muy real: que hablar con una máquina deje de parecer rellenar un formulario en voz alta.

Lo que no ha resuelto es qué pasa cuando la máquina va más rápido que tú.

Porque oírte mientras hablas es un avance.

Pero a veces, la frase importante llega al final.

«No, la del martes.»

## Short
<!-- versión derivada del maestro, ~60 s; se aprueba junto con el maestro en la PUERTA 1 -->
«Cancela la cita del lunes... no, la del martes.» [f10]

Si una IA actúa mientras hablas, ¿cuál cancela?

Phonic-1 presume justo de eso: hacer cosas mientras sigues hablando. [f1]

Y en su demo de 44 minutos, impresiona. Recuerda alergias, manda llamar a restaurantes y no deja de charlar. [f3]

Pero abrí el registro. Minuto 16. La clienta propone una mesa, y en su turno aparece una reserva. Confirmada. Código RT-4842. [f3]

Once segundos después, le dicen que a esa hora no hay sitio. [f3]

Nunca oye ese código, y en el registro no aparece ninguna cancelación. [f3]

Ojo: todo apunta a un simulador, así que nadie reservó nada de verdad. [f3] [f17]

Pero con un restaurante real, sería una mesa para siete que nadie va a ocupar.

La solución es sencilla: mientras te oye, que consulte. Para reservar, cancelar o cobrar, que espere un sí. [f10]

Oírte mientras hablas es un avance. Pero a veces, la frase importante llega al final.
