# Set común del arte generado (estilo v7)

Lo escribe `motor/piezas/promover.mjs`: no se edita a mano. Las piezas están en `set.json`; la hoja, en `contactos.png`.
Para reutilizar una en un vídeo: `{"nombre": …, "de": "set"}` en su `piezas/lista.json`. Las personas salen siempre de aquí
con otra camisa por paleta (`camisa7`). Las marcadas como referencia son las que se pasan a Codex con `-i`.

36 piezas. Escala: `motor/piezas/escala.json`.

| Pieza | Tipo | Tamaño | Etiquetas | Anclas | Estados | Origen | Referencia |
|---|---|---|---|---|---|---|---|
| quieto | persona | 10×28 | persona, paseante | — | — | set:00-piloto-personas | sí |
| paso | persona | 14×28 | persona, paseante, pose | — | — | set:00-piloto-personas |  |
| tendero | persona | 10×28 | persona, comercio | — | — | set:00-piloto-personas |  |
| observador-piloto | persona | 12×28 | persona, investigador | tablilla | — | set:00-piloto-personas |  |
| observador | persona | 18×28 | — | — | — | set:05-observador |  |
| observador3 | persona | 15×28 | — | — | — | set:05-observador |  |
| sentada | persona-sentada | 23×24 | — | — | — | set:01-personajes |  |
| ejecutiva | persona | 13×28 | — | — | — | set:01-personajes |  |
| robot | robot | 16×34 | — | — | — | set:01-personajes | sí |
| tienda | tienda | 87×67 | calle, comercio, web | puerta, escaparate | apagada | set:00-piloto-tienda | sí |
| sede | edificio | 77×110 | — | — | — | set:02-edificios | sí |
| pisos | edificio | 68×124 | — | — | — | set:02-edificios |  |
| centro-datos | edificio | 129×62 | tecnología, ia, edificio | — | — | set:03-maquinas |  |
| camion | vehiculo | 61×33 | calle, reparto | — | — | set:03-maquinas |  |
| rack | maquina | 24×43 | — | — | — | set:03-maquinas | sí |
| portatil | objeto | 23×16 | — | — | — | set:04-objetos |  |
| movil | objeto | 9×16 | — | — | — | set:04-objetos |  |
| ventana | interfaz | 106×70 | — | — | — | set:04-objetos | sí |
| buscador | interfaz | 81×64 | interfaz, web, buscador | barra, resultados | — | ia-pasa-factura:01b-buscador |  |
| cartel-resumen | interfaz | 71×40 | interfaz, ia, resumen | — | — | ia-pasa-factura:01c-carteles |  |
| cartel-enlaces | interfaz | 71×40 | interfaz, ia, resumen, enlaces | enlace | — | ia-pasa-factura:01c-carteles |  |
| foro | edificio | 68×101 | edificio, web, foro | — | — | ia-pasa-factura:02b-foro |  |
| portal | edificio | 106×133 | edificio, puerta, acceso | puerta | — | ia-pasa-factura:02-edificios |  |
| candado-abierto | objeto | 20×26 | objeto, seguridad | — | — | ia-pasa-factura:03-objetos |  |
| candado-cerrado | objeto | 18×24 | objeto, seguridad | — | — | ia-pasa-factura:03-objetos |  |
| teclado | objeto | 21×30 | objeto, seguridad, acceso | — | — | ia-pasa-factura:03-objetos |  |
| globo | objeto | 19×24 | objeto, mundo | — | — | ia-pasa-factura:03-objetos |  |
| pregunta | objeto | 12×18 | signo, duda | — | — | ia-pasa-factura:04-signos |  |
| bocadillo-pregunta | objeto | 14×14 | signo, conversación | — | — | ia-pasa-factura:04-signos |  |
| bocadillo-exclamacion | objeto | 14×14 | signo, conversación | — | — | ia-pasa-factura:04-signos |  |
| estanteria | mueble | 172×60 | mueble, biblioteca, saber | — | — | ia-pasa-factura:05b-estanteria |  |
| mesa-vacia | mueble | 29×22 | mueble, oficina | — | — | ia-pasa-factura:05-muebles |  |
| calendario | objeto | 19×22 | objeto, tiempo | — | — | ia-pasa-factura:05-muebles |  |
| robot-lee | robot | 22×34 | robot, ia, pose | — | — | ia-pasa-factura:06-robot |  |
| robot-llama | robot | 20×34 | robot, ia, pose | — | — | ia-pasa-factura:08-repuestos |  |
| libro-abierto | objeto | 19×12 | objeto, saber | — | — | ia-pasa-factura:07-foro-gemelo |  |
