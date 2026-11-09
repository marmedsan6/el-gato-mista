# Verificación · resumen-semana-agentes

- Nivel: N2 (ver docs/editorial.md §3)
- Fecha de la última revisión: 2026-11-06. Tres verificadores en paralelo y comprobaciones propias. Las tablas detalladas, con su cita por afirmación, están en el scratchpad de la sesión (`verif-bloques-1-3.md`, `verif-bloque-4.md`, `verif-bloques-5-6.md`).
- x.com no se puede abrir con WebFetch: f10, f11 y f13 se leyeron en la investigación del 2026-11-06 y no se han vuelto a abrir. Solo respaldan lo que dijeron esos posts y el método de Elvar.

| # | Hecho (tal como sale en el guion) | Fuentes (id) | Primaria | Estado | Matiz que hay que decir |
|---|---|---|---|---|---|
| 1 | El harness es lo que rodea al modelo; si cambia el harness, cambia el agente; el modelo marca el techo | f3 | No (Helmcode) | verificado | Helmcode es secundaria e interesada (vende acceso a modelos) |
| 2 | DeepSeek Harness: abierto, MIT, en vista previa y con aviso de cambios que lo rompen | f1 | Sí | verificado | Las estrellas (unas 275.000 hoy) no salen en el guion |
| 3 | En el de DeepSeek, el bucle es una pieza más que se puede cambiar | f2 | No | parcial | El README solo dice «everything is a plugin». En el guion va como «según Helmcode» |
| 4 | Super-agent: un jefe que reparte el trabajo entre obreros, con casi ninguna herramienta propia | f4, f5 | f5 sí | verificado | f5: «conjunto reducido de herramientas». No se dice «prohibido» |
| 5 | Sin jefe, no delegó en ninguna de las cinco pruebas | f4 | No | parcial | Solo con el prompt neutro; prueba sintética |
| 6 | Peor caso (p95): de 29,5 a 15,7 min; lee casi 4 veces más (23,2 M frente a 6,1 M de caché) | f4 | No (tabla de DeepSeek recogida por Helmcode) | verificado | Pruebas preliminares de DeepSeek. «Casi cuatro veces» = 23,2/6,1 ≈ 3,8 [C] |
| 7 | Los obreros trabajan con todos los permisos de la cuenta | f4, f5 | Sí (docs 003 y 006) | verificado | |
| 8 | GitHub suspendió las cuentas del agente en la prueba de Helmcode | f4 | No | verificado | Fue en la prueba de Helmcode, no en la de DeepSeek |
| 9 | Herdr: app de escritorio abierta; los agentes siguen si cierras la app; un agente maneja la app | f6, f7, f36 | f6 sí | verificado | Sin «beta» y sin fecha exacta (la fuente del 29 de octubre era X) |
| 10 | Meta compra Conductor (4 de noviembre), más de 100.000 usuarios, sin altas y nube apagada el 20 de noviembre | f8 | No (SiliconANGLE) | verificado | Los 100.000 usuarios los da la propia web de Conductor; Axios dio 403 |
| 11 | teardown: skill gratuita, simulador 3D que se gira y se desmonta (motor, tren de aterrizaje) | f9 | Sí | verificado | |
| 12 | «Acabar con algunas carreras» (post viral) | f10 | Sí (el post) | verificado en la investigación | |
| 13 | Sin referencia salían juguetes genéricos; máquinas con medidas reales | f11 | Sí (artículo del autor) | verificado en la investigación | El README no lo dice |
| 14 | Skill de Cloudflare: auditor de seguridad; una pasada encuentra más o menos la mitad; es de junio | f12, f14 | Sí | verificado | |
| 15 | «Encuentra todos los bugs» (post) | f13 | Sí (el post) | verificado en la investigación | |
| 16 | Regla: el que comprueba nunca es el que encontró | f12 | Sí | verificado | |
| 17 | 6 semanas, skill de ~450 líneas, más de cien repos; rechazos del 40 al 11 % | f14 | Sí | verificado | 128 repos escaneables de un total de 145 |
| 18 | Extensión manipulada con el identificador legítimo, en la tienda de Cursor, el 29 de octubre, unas 11 h | f15 | Sí | verificado | Afectó a las versiones 2.1.312 y 2.1.313 |
| 19 | Como mucho, 5.000 personas | f15, f17 | f17 cita a Cursor | verificado | |
| 20 | Datos, clave SSH y túnel; sin permisos de administrador, el túnel no funcionaba; la clave `svc-telemetry` | f15, f16 | Sí | verificado | Fuera: las «66 líneas» y el arreglo en la 2.1.314 (sin confirmar) |
| 21 | Modelo interno sin lanzar de Anthropic: fallo en Linux, 48 + 5 min, cadenas en Chrome, Safari, Android y Windows | f18 | Sí | verificado | Anthropic no dice qué modelo es: «Mythos» queda fuera |
| 22 | El ataque demostrado necesita una función activada (MPTCP); CloudLinux no lo reprodujo; no consta ningún ataque real; el fallo está en código TCP normal | f18, f19, f20 | Sí | verificado | La nota decía «solo afecta con MPTCP»: era incorrecto |
| 23 | Binance: 6.340 M$, más de 4 veces el récord de Bybit | f23, f22 | No (informe vía The Block) | verificado | Elliptic: 6.430 M$. La cifra de 5.900 M$ no aparece en ninguna fuente: fuera |
| 24 | El FBI lo atribuye a Corea del Norte | f21 | Sí (403; contenido por SecurityWeek e Infosecurity) | verificado | |
| 25 | Septiembre: falso reclutador y prueba trucada; 20 de octubre: herramienta interna de IA; 9 días después, el robo | f23 | No | verificado | El Homebrew de junio (otro ingeniero) se omite por claridad |
| 26 | No robaron las claves: hicieron que los sistemas de Binance firmaran | f22, f25 | No | verificado | |
| 27 | «Campaña de meses» (Teng) | f23 | No | verificado | |
| 28 | Casi 3.000 M$ congelados; 98 % repuesto con reservas; el bitcoin cae más de un 4 % | f22, f24, f25 | No | verificado | Congelados: 2.850 M$ (Elliptic), unos 3.000 M$ (CNBC) |
| 29 | Reddit: más de 1 M de visitas menos a la semana desde buscadores; EE. UU. -2 %, mundo +12 % | f26 | Sí (carta en la SEC) | verificado | Son visitas que llegan desde buscadores, no el total |
| 30 | Huffman: el modo IA no manda visitas «ni a nadie que yo sepa» | f27 | No | verificado | |
| 31 | Acción -29 % en un día (la peor desde la salida a bolsa); ingresos +53 % | f28 | No (CNBC) | verificado | |
| 32 | Stack Overflow: 969 preguntas (sep. 2026) frente a unas 207.000 (mar. 2014); la moderación también influye | f29, f30 | Sí (API) | verificado | |
| 33 | Microsoft: 60.000 con derecho a pedirla (27 %), decisión a principios de diciembre, para equilibrar el gasto en infraestructura de IA | f31 | No (CNBC) | verificado | No son 60.000 salidas |
| 34 | Subvocal (YC): radar en la montura, sin cámara; 1,3 M$ | f32 | No | verificado | El equipo de tres personas no está claro: fuera |
| 35 | subvox: unos 9 minutos, un prompt, AirPods Pro; solo palabras entrenadas | f32, f33 | f33 sí | verificado | Las visualizaciones del post quedan fuera |
| 36 | Neuralink: un participante del estudio despierta un agente de Grok con «Hey Neuralink»; sin datos de rendimiento | f34 | No (cita la primaria) | verificado | |
| 37 | Blindsight: Musk dice que está listo; la designación de la FDA no es una aprobación | f35 | No | verificado | |

Estado: verificado | parcial (explicar) | sin fuente (no entra en el guion).
