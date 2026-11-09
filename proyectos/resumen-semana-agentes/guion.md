# Guion · resumen-semana-agentes

Cada frase con un hecho lleva su fuente entre corchetes: [f1]. `[C]` marca un cálculo propio a partir de la fuente que lo acompaña.
Lo que se atribuye a una empresa o persona («según Helmcode», «dice DeepSeek») va así también en pantalla.

## Maestro (largo)

### 1. Gancho
Esta semana, a Binance le robaron más de seis mil millones de dólares. [f23]

Meta compró una app de agentes. Para cerrarla. [f8]

Una IA encontró sola un fallo grave en Linux. [f18]

La extensión oficial de Claude Code salió con una puerta trasera. [f15]

Y alguien copió en nueve minutos, con unos AirPods, unas gafas que habían levantado más de un millón de dólares. [f32]

Parecen cinco noticias sueltas. Pero todas tienen algo en común: los agentes.

Soy MISTA, y esta ha sido la semana de los agentes. Con lo que pasó de verdad. Y con lo que se exageró.

Vamos por partes: cómo son por dentro, quién los manda, qué saben hacer, cómo se rompen, qué están cambiando y cómo les hablaremos.

### 2. Por dentro: el harness
Primero, una palabra que vas a oír mucho: harness.

Un modelo de IA es como un cerebro: razona y escribe. Pero, solo, no puede tocar nada. [f3]

El harness es todo lo que lo rodea para que trabaje: las herramientas, el acceso a tus archivos, los permisos y la memoria. Claude Code o Codex son harness. [f3]

Y aquí viene lo curioso. Cambia el harness y cambia el agente, aunque el cerebro sea exactamente el mismo. [f3]

El harness decide si el agente te pregunta antes de borrar algo. Qué olvida cuando se le llena la memoria. Y si, cuando algo falla, repite diez veces el mismo comando roto o prueba otra vía. [f3]

Eso sí: el modelo marca el techo. Un buen harness te acerca a él. Uno malo desperdicia un buen cerebro. [f3]

DeepSeek tiene el suyo, abierto y con licencia MIT. [f1]

¿Qué tiene de raro? Casi todos los harness tienen un núcleo fijo: el bucle que lee, piensa, usa una herramienta y vuelve a empezar. Alrededor se enchufan extensiones. [f2]

Según Helmcode, que lo ha analizado a fondo, en el de DeepSeek ese bucle es una pieza más, y se puede cambiar como cualquier otra. [f2]

O sea: puedes sustituir justo la pieza que decide qué hace el agente. [f2]

Pero no te lo vendo como la panacea. Está en vista previa, y sus autores avisan, en mayúsculas, de que habrá cambios que lo rompan. [f1]

### 3. El jefe que no trabaja
Y DeepSeek ha enseñado otra idea: el Super-agent. [f4]

El problema es conocido. Abres tres agentes: uno arregla un test, otro revisa código y otro investiga un error. Y te pasas el rato vigilándolos. [f4]

La solución es un jefe. Un agente que recibe los encargos y los reparte entre agentes obreros, cada uno con su tarea y sus herramientas. [f4]

Y al jefe le quitan casi todas las herramientas, para que no se ponga a trabajar él: tiene que delegar. [f4] [f5]

¿Por qué? Porque en sus pruebas, a un agente que podía delegar si quería, no le dio la gana ni una sola vez en cinco intentos. [f4]

Con el jefe, el peor caso bajó de casi treinta minutos a menos de dieciséis. [f4]

Pero ojo con la letra pequeña. Son pruebas preliminares de la propia DeepSeek. Y a cambio, el sistema relee casi cuatro veces más texto. [f4] [C]

Además, los obreros trabajan con todos los permisos de la cuenta de quien los lanza. [f4] [f5]

Y un detalle que me encanta: cuando Helmcode lo probó, GitHub le suspendió las cuentas del agente. A una, tras su primer comentario. [f4]

### 4. Los jefes de equipo
La misma idea, pero desde fuera: herramientas para que una persona maneje muchos agentes a la vez.

Herdr acaba de sacar su app de escritorio. Es abierta y junta muchos agentes distintos en una sola ventana. [f6] [f7]

Su truco: la ventana solo enseña. Los agentes viven en un pequeño servidor aparte, así que, si cierras la app, siguen trabajando. [f6]

Y hasta un agente puede manejar la app: abrir pestañas y repartir el trabajo entre otros agentes. [f36]

En la demo de Fazt, Claude Code reparte la actualización de varios proyectos entre Claude Code, Codex, Kimi y otros agentes, cada uno en su terminal. [f36]

El 4 de noviembre, Meta compró Conductor, una app que hacía algo parecido y que decía tener más de cien mil usuarios. [f8]

¿Y qué ha hecho Meta con ella? Cerrarla. Ya no admite altas, y su nube se apaga el 20 de noviembre. [f8]

En la misma semana, una app de agentes abierta que llega, y otra comprada que se cierra. Los jefes de equipo valen tanto que las grandes los compran.

### 5. Los oficios: las skills
Vale, ya tenemos agentes y alguien que los manda. Pero, ¿qué saben hacer?

Ahí entran las skills: paquetes de instrucciones que le enseñan un oficio a un agente.

Esta semana se hizo viral teardown, una skill gratuita que convierte una máquina en un simulador 3D que puedes girar y desmontar. Un motor, un tren de aterrizaje… [f9]

Un post viral dijo que iba a acabar con algunas carreras. [f10]

Pues no tanto. Lo que hace es animar máquinas calculadas con medidas reales, no personajes. Y su propio autor avisa: sin una foto o un plano de referencia, le salían juguetes genéricos. [f11]

La otra skill viral es la de Cloudflare, que convierte a un agente en auditor de seguridad. [f12]

Otro post dijo que encuentra todos los bugs. [f13]

Su propia documentación dice otra cosa: una sola pasada encuentra más o menos la mitad de lo que encuentran varias seguidas. [f12]

Y no es de esta semana: es de junio. Simplemente se ha vuelto a hacer viral. [f12] [f14]

Lo que sí mola es su regla de oro: el agente que comprueba un fallo nunca es el que lo encontró. [f12]

Y funciona: con un modelo que busca y otro distinto que valida, los avisos falsos que se descartaban bajaron del cuarenta al once por ciento. [f14]

Cloudflare la usó dentro de casa: en unas seis semanas, de una skill de unas 450 líneas pasó a revisar más de cien repositorios. [f14]

### 6. El lado oscuro
Y ahora, el giro. Porque si un agente puede tocar tus archivos, también puede ser la puerta de entrada.

El 29 de octubre, en la tienda de extensiones de Cursor apareció una versión manipulada de la extensión oficial de Claude Code. No era una imitación: llevaba el identificador legítimo de Anthropic. [f15]

Estuvo unas once horas. Y, según Cursor, llegó como mucho a cinco mil personas. [f15] [f17]

Mandaba datos de tu equipo, metía una clave del atacante para entrar por SSH e intentaba abrir un túnel hacia fuera. [f15] [f16]

Esto se llama ataque a la cadena de suministro: no te atacan a ti, atacan lo que instalas.

La misma semana, Anthropic contó que un modelo suyo, aún sin lanzar, encontró un fallo en el núcleo de Linux y escribió un ataque que funcionaba. [f18]

En su prueba, tardó cuarenta y ocho minutos en saltarse una protección, y cinco más en tener el control total del servidor. [f18]

Y el mismo informe habla de fallos en Chrome, Safari, Android y Windows. [f18]

Pero hay matices. El ataque que enseñaron necesita una función concreta activada en el servidor. Otra empresa, CloudLinux, no consiguió reproducirlo. Y no consta ningún ataque real. [f18] [f19] [f20]

Aun así, el fallo está en código que usan casi todos, así que toca actualizar. [f19]

Y la gran historia de la semana: Binance.

Le robaron unos seis mil trescientos cuarenta millones de dólares. Más de cuatro veces el récord anterior. [f23] [f22]

El FBI se lo atribuye a Corea del Norte. [f21]

Y la campaña venía de lejos. En septiembre, un falso reclutador contactó con un ingeniero de Binance en una web de empleo real, y le coló una prueba de selección trucada. [f23]

El 20 de octubre, desde el ordenador de ese ingeniero, el atacante abusó de una herramienta interna de IA de la empresa para hacerse con otros dos ingenieros. [f23]

Y nueve días después, lanzó las retiradas. [f23]

Ese día, el bitcoin cayó más de un cuatro por ciento. [f25]

No robaron las claves: se colaron en el propio sistema que firma las retiradas. [f23] [f25]

Su jefe lo resumió así: no fue un error, fue una campaña de meses. [f23]

Se han congelado casi tres mil millones, y Binance ha repuesto el noventa y ocho por ciento con sus reservas. [f22] [f24]

La puerta fue una persona. Y el puente, una herramienta de IA.

### 7. El impacto
Mientras tanto, hay cosas que ya están cambiando.

Reddit dice que, en octubre, le llegaba de media más de un millón de visitas menos a la semana desde los buscadores. [f26]

Y su jefe culpa al modo IA de Google: dice que no manda visitas. Ni a ellos, ni a nadie que él conozca. [f27]

En Estados Unidos, sus usuarios diarios bajaron un dos por ciento, aunque en el mundo siguen creciendo. [f26]

Sus acciones cayeron un 29 % en un día, el peor desde que salió a bolsa. Aunque sus ingresos crecieron un 53 %. [f28]

Stack Overflow, la web donde los programadores se resolvían las dudas, recibió en septiembre 969 preguntas. En marzo de 2014 recibía unas 207.000. [f29] [f30]

Parte de la culpa, dicen sus usuarios, es de una moderación muy estricta. Pero la caída es brutal. [f30]

Y aquí viene la paradoja: la IA aprendió de Stack Overflow y de Reddit. Ahora contesta en su lugar. ¿De quién aprenderá la siguiente?

Y Microsoft ofrece una baja voluntaria a sesenta mil empleados. Ojo: no es que se vayan sesenta mil. Son sesenta mil los que pueden pedirla, el 27 % de la plantilla. Tienen hasta principios de diciembre para decidir. [f31]

¿El motivo? Equilibrar lo carísimo que le está saliendo construir infraestructura para la IA. [f31]

### 8. Lo siguiente: hablarles sin voz
Y la última pregunta: ¿cómo vamos a hablar con los agentes?

Subvocal, una startup de Y Combinator, hace unas gafas que convierten en texto lo que dices sin emitir sonido. No leen tus labios: usan un radar en la montura. [f32]

Han levantado un millón trescientos mil dólares. [f32]

Y un desarrollador hizo una versión gratis en unos nueve minutos, con un solo prompt y unos AirPods Pro, que notan cómo mueves la mandíbula. [f32] [f33]

Pero no hacen lo mismo: la copia solo reconoce las pocas palabras que le enseñas. [f33]

Y Neuralink fue más allá: un participante de su estudio despertó un agente basado en Grok solo con el pensamiento, imaginando la frase «Hey Neuralink». [f34]

Eso sí: no han publicado datos de cómo funciona. [f34]

Y Musk dice que Blindsight, su implante para la vista, está listo y solo espera al regulador. Una designación de la FDA no es una aprobación. [f35]

### 9. Cierre
Voz, susurro, mandíbula, pensamiento.

La carrera ya no es solo qué agente es más listo. Es quién lo construye, quién lo manda, qué sabe hacer, por dónde se rompe… y cómo le hablamos.

Y esta semana ha pasado de todo.

## Short A · El mayor robo cripto empezó con una entrevista de trabajo
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1. Sale el sábado 7.
     Estimación (caracteres/13): ~1000 caracteres de voz → ~77 s · por qué esa duración: el atraco solo se entiende con sus tres pasos (oferta falsa, herramienta interna de IA, retiradas) y el giro de que no robaron las claves; sin el desenlace (congelado y repuesto) queda a medias. -->
A Binance le robaron unos seis mil trescientos cuarenta millones de dólares. El mayor robo cripto de la historia: más de cuatro veces el anterior. [f23] [f22]

Y todo empezó con una oferta de trabajo. [f23]

En septiembre, un falso reclutador contactó con un ingeniero de Binance en una web de empleo real, y le mandó una prueba de selección trucada. [f23]

Con eso, se coló en su ordenador. [f23]

El 20 de octubre, desde ahí, abusó de una herramienta interna de IA de la empresa para hacerse con otros dos ingenieros. [f23]

Y nueve días después, lanzó las retiradas. [f23]

Ojo al dato: no robaron las claves. Se colaron en el propio sistema que firma las retiradas. [f23] [f25]

El FBI se lo atribuye a Corea del Norte. [f21]

Se han congelado casi tres mil millones, y Binance ha repuesto el noventa y ocho por ciento con sus reservas. [f22] [f24]

La puerta fue una persona. Y el puente, una herramienta de IA.

¿Te interesa saber más? Tengo un vídeo largo en YouTube con toda la semana de los agentes.

## Short B · La extensión oficial, con puerta trasera
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1. Sale el domingo 8.
     Estimación (caracteres/13): ~880 caracteres de voz → ~68 s · por qué esa duración: hace falta decir por qué engañaba (el identificador oficial), qué hacía, su límite real (sin permisos, el túnel no funcionaba) y qué comprobar; sin el consejo práctico se queda en susto. -->
Imagina instalar la extensión oficial de Claude Code. Con el nombre correcto. Del editor correcto. Y que traiga una puerta trasera. [f15]

Pasó el 29 de octubre, en la tienda de extensiones de Cursor. [f15]

No era una imitación: era una versión manipulada que llevaba el identificador legítimo de Anthropic. [f15]

Estuvo unas once horas y, según Cursor, llegó como mucho a cinco mil personas. [f15] [f17]

Mandaba datos de tu equipo, metía una clave del atacante para entrar por SSH e intentaba abrir un túnel hacia fuera. [f15] [f16]

En la mayoría de los equipos, el túnel no llegaba a funcionar, porque hacían falta permisos de administrador. Pero la clave y los datos, sí. [f15]

Si la instalaste, mira si tienes una clave llamada svc-telemetry. [f15] [f16]

Esto es un ataque a la cadena de suministro: no te atacan a ti, atacan lo que instalas.

¿Te interesa saber más? Tengo un vídeo largo en YouTube con toda la semana de los agentes.

## Short C · Mismo modelo, distinto agente
<!-- Guion propio, no recortado del largo; se aprueba junto con el maestro en la PUERTA 1. Sale el lunes 9.
     Estimación (caracteres/13): ~880 caracteres de voz → ~68 s · por qué esa duración: primero hay que definir harness con ejemplos de decisiones que cambian el resultado; solo entonces se entiende qué tiene de raro el de DeepSeek y su límite (vista previa). -->
Si le das el mismo cerebro de IA a dos agentes distintos, no harán lo mismo. [f3]

Porque un agente no es solo el modelo. Es el modelo más su harness. [f3]

El harness es todo lo que rodea al cerebro: las herramientas, el acceso a tus archivos, los permisos y la memoria. Claude Code o Codex son harness. [f3]

Y decide cosas que lo cambian todo: si te pregunta antes de borrar, qué olvida cuando se le llena la memoria, y si ante un fallo repite lo mismo o prueba otra vía. [f3]

Por eso el modelo marca el techo, pero el harness decide cuánto te acercas a él. [f3]

DeepSeek tiene uno abierto, y con algo raro. [f1]

Casi todos tienen un núcleo fijo: el bucle que lee, piensa, actúa y vuelve a empezar. [f2]

Según Helmcode, en el de DeepSeek ese bucle es una pieza más, y se puede cambiar. [f2]

Eso sí: está en vista previa, y avisa de que habrá cambios que lo rompan. [f1]

¿Te interesa saber más? Tengo un vídeo largo en YouTube con toda la semana de los agentes.
