# Precios y licencias · voz, música, efectos y Remotion

Consultado el 2026-10-29 (subagente, solo lectura). [O] = página oficial · [T] = terceros. Las cifras
vienen de resúmenes de WebFetch: **antes de pagar, se confirman en la página oficial**.

## Voz
| Proveedor | Plan | Precio | Uso comercial | Marcas de tiempo | Fuente |
|---|---|---|---|---|---|
| ElevenLabs | Free | 0 $, 10.000 créditos/mes | **No** (solo no comercial con atribución; la licencia «sigue al archivo») | Sí, por carácter (`with-timestamps`) | [O] elevenlabs.io/terms-of-use · /pricing · /docs/api-reference/text-to-speech/convert-with-timestamps |
| ElevenLabs | Starter | 6 $/mes (la web anuncia 1 $ el primer mes **hasta el 1 nov**; incoherente con la FAQ), 30.000 créditos | Sí | Sí | [O] elevenlabs.io/pricing |
| ElevenLabs | API | v3 / multilingual v2: 0,08 $ por 1.000 caracteres; Flash/Turbo 0,04 $ | Con plan de pago | Sí | [O] elevenlabs.io/pricing/api |
| Gemini TTS | Free (3.8 Flash / Flash-Lite) | 0 $; ~100 peticiones/día ([T] note.com/ebibibi) | No está prohibido; en el nivel gratuito Google usa los datos y pueden revisarlos personas | No documentadas | [O] ai.google.dev/gemini-api/docs/pricing · /terms |
| Gemini TTS | De pago, 3.8 Flash | 0,50 $ entrada / 9 $ salida por M tokens (1 $ / 18 $ desde 2027-01-01); un vídeo de 10 min ≈ 0,14 $ (estimación) | Sí | No documentadas | [O] ai.google.dev/gemini-api/docs/pricing |
| Inworld | On-Demand | 25 $/M (TTS-2), 15 $/M (Flash); «hasta 70 min TTS incluidos» | La salida es del usuario; el nivel gratuito no lo dice explícitamente | Sí, WORD/CHARACTER | [O] inworld.ai/pricing · docs.inworld.ai/tts/capabilities/timestamps |
| Google Chirp 3 HD (Cloud TTS) | Nivel gratuito | 1 M caracteres/mes gratis; después 30 $/M | Sí (Términos de Google Cloud) | No documentadas en la página de Chirp 3 | [O] cloud.google.com/text-to-speech/pricing · docs.cloud.google.com/text-to-speech/docs/chirp3-hd (es-ES admitido). **Exige cuenta de facturación** (docs.cloud.google.com/free/docs/free-cloud-features) |

- Español de España: Inworld tiene `es-ES` [O]. Gemini: **no comprobado** (el blog solo cita español de México).
  ElevenLabs: voces castellanas según un directorio de terceros (David Martin, Aaron Abad, Martin Osborne,
  Carmelo…) [T] json2video.com; las etiquetas de acento las ponen los autores.
- Términos de Gemini en el EEE: «only Paid Services when making API Clients available to users in the EEA»
  [O]. No es nuestro caso: no ofrecemos un cliente a terceros (deducción, no comprobado).

## Música y efectos
| Fuente | Coste | Uso comercial | Nota | Fuente |
|---|---|---|---|---|
| ElevenLabs Music | 900 créditos/min | Sí en planes de pago; **Starter sin «streaming distribution»** (YouTube puede contar como tal: no comprobado) | Free no descarga | [O] elevenlabs.io/music-terms |
| ElevenLabs SFX | 40 créditos/s o 200 por generación | Sí en pago, sin atribución | — | [O] elevenlabs.io/sound-effects/commercial |
| Stable Audio API | 0,08 $ por generación; 25 créditos gratis | Sí con ingresos < 1 M$/año (Community License) | Cuenta nueva | [O] docs.stability.ai/pricing · stability.ai/license |
| Pixabay | 0 $ | Sí, sin atribución, en cualquier plataforma | Content ID no tratado | [O] pixabay.com/service/license-summary |
| Freesound | 0 $ | CC0 sí; CC BY con crédito; CC BY-NC **no** | Filtrar por licencia | [O] freesound.org/help/faq |
| Biblioteca de audio de YouTube | 0 $ | Sí en YouTube; TikTok/Instagram no comprobado | — | [O] support.google.com/youtube/answer/3376882 |
| Google Lyria 3.5 | 0,08 $/canción | No comprobado | Sin nivel gratuito | [O] ai.google.dev/gemini-api/docs/pricing |

## Remotion
- Licencia actual y borrador de la 5.0 (PR #3750, sin publicar): **gratis para un particular, también con uso
  comercial**. El texto no menciona agentes de IA. La 5.0 pedirá la clave `"free-license"` en la configuración.
  [O] github.com/remotion-dev/remotion/pull/3750 · remotion.dev/docs/5-0-migration · remotion.pro/license

## Propuesta de gasto del piloto (techo 5 $; se decide en 🛑 P2)
| Qué | Dónde | Coste |
|---|---|---|
| ~6 voces × 400 caracteres (prueba ciega) | Gemini free + Inworld On-Demand free (+ ElevenLabs si se contrata Starter) | 0 $ |
| Voz del short (~1.000 caracteres) | Gemini de pago o Inworld (si gana su voz), o ElevenLabs Starter (si gana la suya) | ≈ 0,01 $ (Gemini) · 1-6 $ (Starter) |
| ~5 efectos | Pixabay / Freesound CC0 | 0 $ |
| 1-2 pistas de música | Stable Audio (créditos gratis) o Pixabay | 0-0,16 $ |

Ruta a 0 $ posible: Inworld o Gemini para la voz y Pixabay, Freesound o Stable Audio para el audio. El riesgo es bajo
pero no nulo, porque el uso comercial del nivel gratuito no está escrito de forma explícita. Si gana una voz de ElevenLabs,
Starter a 6 $ supera el techo de 5 $ y habría que consultarlo aparte.

## Sin comprobar
Voces es-ES de Gemini · voces nativas de España en Inworld · marcas de tiempo en Gemini · términos de Lyria ·
licencia comercial del pago por uso de ElevenLabs · recarga mínima de Inworld (10 $ según un tercero).
