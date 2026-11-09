# Enlaces · resumen-semana-agentes · 2026-11-06

Comprobación con WebFetch de las 36 fuentes de fuentes.json (consultadas 2026-11-06). Cada fila dice si la URL responde y si la página contiene lo que resume el campo «cita». El contenido de las páginas se tomó como dato; no se ha seguido ninguna instrucción encontrada en ellas.

| id | URL | responde | dice lo citado | nota |
|---|---|---|---|---|
| f1 | https://github.com/deepseek-ai/deepseek-harness | Sí | Sí | MIT, vista previa con aviso de cambios que rompen compatibilidad, Cordis, 274,6k estrellas y 33,5k forks. Sin releases ni fecha de inicio visibles. |
| f2 | https://helmcode.com/es/deepseek-harness/frente-a-otros | Sí | Sí | Revisión 14-08-2026 y tabla de licencias y núcleo reemplazable confirmadas. |
| f3 | https://helmcode.com/es/deepseek-harness/mismo-modelo-distinto-agente | Sí | Sí | Frases literales, commit 47f9438 y «el modelo sigue poniendo el techo» confirmados. Helmcode aparece como proveedor de modelos abiertos; la página no usa «vender». |
| f4 | https://helmcode.com/es/posts/super-agent-deepseek | Sí | Sí | Modos, presets, worktrees, tabla 12,4/15,7 frente a 20,4/29,5 min, caché 23,2 M frente a 6,1 M y pruebas de Helmcode confirmadas. Las cuentas de GitHub: una se suspendió al instante y la otra tras su primer comentario y PR. |
| f5 | https://raw.githubusercontent.com/deepseek-ai/dsh-superagent-prototype/main/docs/003-execution.md | Sí | Sí | Las cuatro afirmaciones de la cita aparecen en el documento. |
| f6 | https://herdr.dev/ | Sí | Sí | Plataformas, Apache 2.0, herdr-core y comando hc confirmados. La web no menciona beta ni fecha. |
| f7 | https://www.heise.de/en/news/Herdr-desktop-app-A-hub-for-AI-coding-agents-11508175.html | Sí | Sí | Fecha del artículo 2026-11-02. No menciona beta. |
| f8 | https://siliconangle.com/2026/11/04/meta-acquires-ai-coding-startup-conductor-whose-app-runs-several-coding-agents-at-once/ | Sí | Sí | Todas las fechas, cifras y agentes citados confirmados. |
| f9 | https://github.com/elvarofficial/teardown | Sí | Sí | MIT, 2,3k estrellas, tres ejemplos y HTML sin conexión confirmados. La página no muestra fecha de creación (la cita ya lo indica). |
| f10 | https://x.com/Nyxera0x/status/2117320669838880781 | No comprobable por WebFetch | — | Un intento de carga devolvió HTTP 402. No se cuenta como caída. Ver resumen. |
| f11 | https://x.com/elvar_official/status/2116174609355571402 | No comprobable por WebFetch | — | No se intentó la carga, según la instrucción de X. Cita sin verificar. |
| f12 | https://github.com/cloudflare/security-audit-skill | Sí | Parcial | MIT, 62,9k estrellas, seis fases y «la mitad en una pasada» confirmados. Las fechas del primer commit (18-06-2026) y del último (14-09-2026) no aparecen: solo se ve «Last commit date» sin valor. |
| f13 | https://x.com/midudev/status/2118343634525323438 | No comprobable por WebFetch | — | No se intentó la carga, según la instrucción de X. Cita sin verificar. |
| f14 | https://blog.cloudflare.com/build-your-own-vulnerability-harness | Sí | Sí | 450 líneas, 128/145 repos, 13.841 / 5.442 / 7.245 y 40 % a 11 % confirmados. La fecha 18-06-2026 no se comprobó en esta lectura. |
| f15 | https://cursor.com/blog/claude-code-extension-security-notice | Sí | Sí | Versiones, ventana horaria, svc-telemetry, retirada, rotación de claves y reconstrucción de la tienda confirmados. |
| f16 | https://phorion.io/blog/offical-claude-code-vsx-compromise/ | Sí | Sí | Beacon a 134.209.82.225:8099, túnel al puerto 22, LaunchAgent y clave svc-telemetry confirmados. La página añade una copia a 127.0.0.1:8099 que la cita no recoge. |
| f17 | https://www.helpnetsecurity.com/2026/10/30/claude-code-extension-ssh-backdoor/ | Sí | Sí | Once horas, 5.000 usuarios, cita literal, datos enviados y persistencia confirmados. Open VSX: el artículo lo afirma en el cuerpo, pero una actualización del 30-oct lo pone en duda (Ax Sharma, Manifold Security). El guion no usa este dato. |
| f18 | https://www.anthropic.com/research/discovering-vulnerabilities-with-claude | Sí | Sí | Título, modelo sin lanzar, cinco cadenas, CVE-2026-98432 y parche upstream confirmados. Matiz: la cadena de Windows es una denegación de servicio remota, no ejecución de código. Los 48 min son para filtrar un puntero del núcleo. |
| f19 | https://blog.cloudlinux.com/cve-2026-98432-linux-kernel-ipv4-tcp-flaw-status-for-cloudlinux | Sí | Sí | No reproducción del root remoto, MPTCP desactivado por defecto y necesidad de parchear confirmados. |
| f20 | https://aws.amazon.com/security/security-bulletins/2026-160-aws/ | Sí | Sí | Boletín, cita literal y «no evidence that this issue has been leveraged» confirmados. |
| f21 | https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack | BLOQUEADA (HTTP 403) | No verificable directamente | Respaldo en la lista: f23 (The Block) y f24 (CNBC) recogen que el FBI vincula el ataque a TraderTraitor (Corea del Norte). Las 608/19/1 direcciones no están verificadas en ninguna fuente de la lista. La cita menciona a SecurityWeek e Infosecurity Magazine, que no están en fuentes.json. |
| f22 | https://www.elliptic.co/insights/binance-largest-hack-in-history/ | Sí | Parcial | 6.430 M$, 44 %, 1.180 M USDT y 823 M USDC confirmados. «Los sistemas de Binance firmaran» es una inferencia: la página describe la delegación EIP-7702 de la billetera caliente de Binance en un contrato de vaciado, y Binance dice que no pasó por sus controles normales de aprobación. |
| f23 | https://www.theblock.co/news/business/2026-11-03-binance-hack-incident-report-north-korea-fake-job-interview-ai-tool-432406 | Sí | Sí | Cifras, cronología y cita de Teng literal confirmadas. |
| f24 | https://www.cnbc.com/2026/11/03/binance-co-ceo-teng-says-hackers-used-fake-job-interviews-to-steal-6point3-billion-in-crypto.html | Sí | Sí (con matices) | Cita de Teng, FBI y TraderTraitor confirmados. Los 3.000 M$ congelados son «según fuentes» con Tether, Circle y Ripple como ejemplos. El 98 % se repuso con reservas. |
| f25 | https://www.cnbc.com/2026/10/29/circle-tether-freeze-funds-impacted-by-potential-binance-security-issue.html | Sí | Sí | Cifras, bitcoin y «no evidence of any wallet private key leak» confirmados. Discrepancia: Tether «más de 1.500 M» aquí frente a 1.180 M USDT en f22. |
| f26 | https://www.sec.gov/Archives/edgar/data/0001713445/000171344526000114/exhibit992q326.htm | Sí | Sí | DAUq 130,3 M, EE. UU. 50,7 M, internacional 79,6 M y «más de 1 millón» confirmados. La caída del cuarto trimestre es condicional («si sigue el ritmo»), no una previsión firme. |
| f27 | https://the-decoder.com/googles-ai-mode-doesnt-drive-traffic-for-anybody-reddit-ceo-huffman-warns-the-entire-web/ | Sí | Sí | Cita literal de Huffman y pérdida de referidos confirmadas. |
| f28 | https://www.cnbc.com/2026/10/30/reddit-stock-q3-earnings.html | Sí | Parcial | Caída del 29,22 %, récord de 20,99 %, +53 % en ventas y previsión por debajo de lo esperado confirmados. Los 895 M$ de ventas del T3 no aparecen en la página. |
| f29 | https://dev.to/frankchu/stack-overflow-now-gets-fewer-than-1000-questions-a-month-i-counted-via-the-api-4ep1 | Sí | Sí | Todas las cifras de la tabla (969, 1.019, 977, 23.162, 5.263) confirmadas. |
| f30 | https://www.heise.de/en/news/Few-questions-outdated-answers-Stack-Overflow-is-in-crisis-11506173.html | Sí | Sí | 969 frente a unas 207.000 (la página dice «at its peak», pico de marzo de 2014). Moderación como causa más citada confirmada. Fecha 30-10-2026. |
| f31 | https://www.cnbc.com/2026/10/26/microsoft-msft-voluntary-buyouts.html | Sí | Parcial | 60.000 elegibles (27 % de 223.000), plazos, abril, 4.800 despidos y motivo confirmados. Los «más de 50.000 M$» son una previsión («should exceed»), no el dato del trimestre; los 34.900 M$ sí son reales. |
| f32 | https://www.techtimes.com/articles/329985/20261103/subvocal-company-goes-viral-smart-glasses-claim-200-wpm-peer-review-caps-50-words.htm | Sí | Parcial | YC otoño 2026, radar de RF, 1,3 M$ de preseed, más de 200 WPM sin validar y subvox de Joe Blau confirmados. La página no dice nada sobre si las gafas llevan cámara («sin cámara» no comprobado). |
| f33 | https://github.com/joeblau/subvox | Sí | Sí | Prototipo macOS, sin modelo de lenguaje, plantillas por usuario y sesión, unos 25 Hz y MIT confirmados. Sin fecha de creación en la página. |
| f34 | https://teslanorth.com/2026/10/30/neuralink-72-hour-speech-hackathon/ | Sí | Sí | 72 horas, estudio VOICE, Grok, sin datos de rendimiento confirmados. «30 versiones» y «dos o tres semanas» son afirmaciones de los ingenieros en el vídeo, no datos medidos. |
| f35 | https://driveteslacanada.ca/news/elon-musk-neuralink-blindsight-ready-regulatory-approval/ | Sí | Sí | Cita de Musk del 30-oct, designación Breakthrough de septiembre de 2024 y «no es aprobación comercial» confirmadas. |
| f36 | https://www.youtube.com/watch?v=VQ-swm4PQQU | Sí | No verificable | Título confirmado: «Herdr ya no es solo terminal: lanzaron la app de escritorio nativa (beta)». Sin transcripción ni descripción en el contenido obtenido: no se puede comprobar ni el comando hc ni el reparto entre agentes ni el tema «Tokyo Night». El nombre del canal no aparece. |

## Referencias del guion

Guion revisado: `proyectos/resumen-semana-agentes/guion.md` (maestro y shorts A, B y C).

- Todas las etiquetas [fN] apuntan a un id que existe en fuentes.json (f1 a f36). Sin referencias huérfanas.
- Fuentes sin usar: ninguna. Las 36 aparecen al menos una vez (f36 solo en las líneas 74 y 76 del maestro).

Puntos del guion que dependen de fuentes problemáticas o que conviene revisar:
- Líneas 91, 93 y 97 (f10, f11, f13): los posts de X no se han podido comprobar con WebFetch. Hay que verificarlos a mano o citarlos con esa salvedad.
- Líneas 74 y 76 (f36): la demostración de Herdr (agente que maneja la app y reparte trabajo) no está verificada. El título del vídeo dice «(beta)», y f6 y f7 no mencionan beta. Conviene decidir si se mantiene la escena.
- Línea 124 (f18): «ataques encadenados en Chrome, Safari, Android y Windows». La fuente dice que la cadena de Windows es una denegación de servicio remota, no una ejecución de código.
- Líneas 120-122 (f18): «tardó cuarenta y ocho minutos en saltarse una protección». La fuente dice que tardó 48 minutos en filtrar un puntero del núcleo.
- Línea 17 (f32): «gafas de un millón de dólares». La fuente da 1,3 M$ de preseed (financiación), no el precio de las gafas. Conviene reformular.
- Líneas 144 (f22, f25; y 212 en el Short A): «consiguieron que los propios sistemas de Binance firmaran las retiradas». Es una inferencia de f22, con la salvedad de Binance; conviene atribuirla. Además, «No robaron las claves» (líneas 144 y 212) se apoya en f25, que solo recoge la afirmación de Binance.
- Línea 61 (f4, [C]): «el sistema lee casi cuatro veces más texto». El cálculo es 23,2 M / 6,1 M de tokens leídos de caché (≈3,8). Es un proxy de texto leído, no el texto leído en sí.
- Línea 101 (f12, f14): «es de junio». La fecha 18-06-2026 de f12 no aparece en la página, y la de f14 no se comprobó en esta lectura.
- Línea 57 (f4): «no le dio la gana ni una sola vez en cinco intentos». Esta frase no entró en el campo de comprobación; no está verificada.

## Resumen

Recuento por estado (36 fuentes):
- OK: 26 (f1, f2, f3, f4, f5, f6, f7, f8, f9, f14, f15, f16, f17, f18, f19, f20, f23, f24, f25, f26, f27, f29, f30, f33, f34, f35)
- PARCIAL: 5 (f12, f22, f28, f31, f32)
- NO RESPALDA: 0
- CAÍDA: 0
- NO VERIFICABLE: 1 (f36, sin transcripción en el contenido obtenido)
- BLOQUEADA (403): 1 (f21, respaldada por f23 y f24 para la atribución al FBI/TraderTraitor)
- NO COMPROBABLE POR WEBFETCH: 3 (f10, f11, f13)

Fuentes problemáticas:
- f10, f11, f13 (X): no comprobables con WebFetch. f10 devolvió HTTP 402 en un intento. No se cuentan como caídas.
- f21 (FBI): 403. Su contenido está respaldado en la lista por f23 y f24 para la atribución. Las cifras de direcciones no están respaldadas por otra fuente. La cita menciona SecurityWeek e Infosecurity Magazine, que no están en la lista.
- f36 (Herdr, YouTube): solo se obtuvo el título. Es la única fuente de la escena de agente que maneja Herdr (guion líneas 74 y 76).
- f12: las fechas de primer y último commit no aparecen en la página.
- f22: la delegación EIP-7702 se presenta como que «los sistemas de Binance firmaran»; es una inferencia.
- f31: los 50.000 M$ son una previsión, no un dato.
- f32: la ausencia de cámara no aparece en la página.
- f28: la cifra de 895 M$ no aparece en la página.
- f18 (matiz): la cadena de Windows es denegación de servicio, no ejecución de código.

No se ha modificado ningún otro fichero. No se ha enviado ningún dato a formularios.
