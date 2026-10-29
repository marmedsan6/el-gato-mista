# Arquitectura (borrador)

Estado: **borrador del 2026-10-29**. Lo marcado como *propuesta* o *pendiente* se decide en el
piloto o en la calibración y queda en `docs/decisiones/`.

## 1. Objetivo y alcance
Producir, a partir de un tema, un vídeo largo y un short en español con:
- voz sintética (sin voz ni metraje propios, sin edición de crudos);
- imágenes generadas por código (HTML/SVG/GSAP, formas 2D, etiquetas, diagramas, paleta fija);
- material público de terceros como complemento, registrado y acreditado;
- vídeo generado por IA y escenas 3D (Blender) solo como tipos opcionales, más adelante.

Cada hecho se verifica con fuente antes de producir. Nada se publica sin aprobación de Mario.

## 2. Formatos
| | Largo | Short |
|---|---|---|
| Proporción | 16:9 | 9:16 |
| Duración | 8-10 min | ~60 s (máx. 120 s) |
| Resolución | 1920×1080 | 1080×1920 |
| fps | 60 | 60 |
| Subtítulos | SRT aparte, desde `timing.largo.json` | En pantalla, siempre |
| Plataformas | YouTube | YouTube Shorts, TikTok, Instagram |

- Mismo guion maestro y mismo estilo; el short es una versión derivada del guion, aprobada a la
  vez. Se componen por separado: nunca se recorta uno para sacar el otro.
- **Hipótesis pixel art** (se confirma en la calibración): lienzo base de 480×270 (largo) y
  270×480 (short), escalado ×4 exacto a la salida, `image-rendering: pixelated`, posiciones y
  tamaños redondeados al píxel del lienzo base (sin movimiento subpíxel).
- El short respeta la zona segura más restrictiva de las tres plataformas (interfaz superior,
  inferior y lateral derecha). Los márgenes exactos se miden en el piloto.

## 3. Flujo por etapas
| # | Etapa | Entrada | Salida | Quién | Criterio de salida |
|---|---|---|---|---|---|
| 1 | Brief | Tema | `brief.md` | Opus + Mario | Ángulo, público, gancho y duración claros |
| 2 | Fuentes y verificación | brief | `fuentes.json` | Opus (+ Haiku para enlaces) | Cada hecho con fuente accesible |
| 3 | Guion | brief, fuentes | `guion.md` (maestro + `## Short`) | Opus | Cada frase con hecho trazable |
| — | **PUERTA 1** | guion | `reviews/puerta-1.md` | Mario | Aprobación explícita |
| 4 | Storyboard y estilo | guion, estilo vN | `shotlist.md`, `style_guide.md` | Opus | Algo nuevo cada 2-4 s |
| 5 | Voz | guion | audio en `.runtime/cache/voz/` | Opus | Sin errores de lectura |
| 6 | Alineación | audio, guion | `timing.largo.json`, `timing.short.json` | Haiku | Palabras con marca de tiempo |
| 7 | Escenas | shotlist, timing | `escenas/{largo,short}/` | Opus | Cumplen el contrato de escena |
| 8 | Render por escena | escenas | `render/{largo,short}/` | Motor | Fotogramas completos |
| 9 | Montaje y mezcla | render, voz, música | máster en `salida/` | Motor | -14 LUFS, pico < -2 dBTP |
| 10 | QA | máster | `reviews/qa.md`, hoja de contactos | Haiku + crítico | Sin defectos bloqueantes |
| — | **PUERTA 2** | máster + SHA-256 | `reviews/puerta-2.md` | Mario | Aprobación sobre la huella |
| 11 | Exportar | máster, timing | ficheros por plataforma + `largo.srt` | Motor | Huella registrada; SRT sincronizado |
| 12 | Publicar | exportados | URL en `memoria/videos.md` | API de cada plataforma (*se diseña más adelante*) | Solo con PUERTA 2 aprobada |

## 4. Carpetas y git
Ver tabla en `README.md`. Regla: en git solo texto, código, fuentes tipográficas y métricas.
Vídeos, audio, fotogramas, claves y `node_modules` quedan fuera (`.runtime/`, `render/`,
`salida/`, `referencias/`).

Cada vídeo (`proyectos/<slug>/`): `brief.md`, `fuentes.json`, `guion.md`, `style_guide.md`,
`shotlist.md`, `timing.largo.json`, `timing.short.json`, `escenas/{largo,short}/`,
`render/{largo,short}/`, `reviews/`, `salida/`.

## 5. Contrato de escena (resumen)
Detalle en `docs/criterios.md`. Toda escena expone `seek(t)` y pinta exactamente el fotograma
del segundo `t`; nada depende del reloj real; azar solo con semilla; fuentes locales;
prohibiciones de estilo por defecto; algo nuevo cada 2-4 s; legible a 360×640.

## 6. Motor de render (*pendiente*, se decide en el piloto)
Candidatas:
- **HyperFrames** como carcasa, con escenas HTML libres (HTML + GSAP, render por fotograma en
  Chrome sin cabeza + FFmpeg; Node 22+).
- **Claude libre**: Playwright + FFmpeg, código propio en `motor/`.
- **Remotion**: duda de licencia para uso con agentes (ver nota de investigación).

Criterios del piloto: determinismo (mismo `t` → mismo fotograma), tiempo de render de 10 min,
reanudación por escena, coste, encaje con pixel art (escalado entero, sin suavizado), facilidad
para que el agente escriba escenas.

## 7. Voz y alineación (*pendiente*)
- Candidatas: ElevenLabs v4, Inworld TTS-2 / Flash (según precio), Gemini Flash TTS.
- Voz: **española (de España), masculina**. Prueba ciega con el mismo texto entre las voces de
  ese perfil de cada proveedor.
- Coste estimado de terceros, sin verificar: ~9.000 caracteres por vídeo largo.
  Tope del proyecto: 10 $/mes además de Claude y Codex.
- Caché por hash del texto en `.runtime/cache/voz/`: no se paga dos veces la misma frase.
- Alineación: marcas de tiempo del proveedor si las da; si no, WhisperX en CPU (la GPU es AMD,
  sin CUDA en Windows).

## 8. Audio
- Música y efectos **generados por IA** (ElevenLabs, Google u otra plataforma similar). Antes de
  usarlos, comprobar que el plan contratado permite uso comercial en YouTube, TikTok e Instagram.
  Caché por hash del prompt en `.runtime/cache/`.
- Un efecto suena 1 fotograma después de la imagen que lo provoca.
- Mezcla: -14 LUFS integrados, pico real < -2 dBTP.

## 9. QA
- FFmpeg: `freezedetect`, `blackdetect`, `ebur128` (sonoridad y pico real), `volumedetect`.
- Hoja de contactos del máster.
- Crítico visual: subagente que juzga solo fotogramas y lista los 3 peores defectos con marca
  de tiempo.
Umbrales en `docs/criterios.md`.

## 10. Agentes y modelos
- Solo Claude por ahora; `AGENTS.md` sirve también para Codex si se incorpora.
- Opus a esfuerzo alto orquesta. Subagentes previstos (se crean cuando hagan falta, en
  `.claude/agents/`):
  - `extractor-fotogramas` (Haiku): FFmpeg sobre referencias y másteres.
  - `qa-audio` (Haiku): medidas de sonoridad y silencios.
  - `verificador-enlaces` (Haiku): que cada URL de `fuentes.json` responde y dice lo citado.
  - `critico-visual` (modelo fuerte): juicio sobre fotogramas.
- Skill `estilo` al cerrar la calibración (`.claude/skills/estilo/`).

## 11. Esquemas de datos (borrador)
`fuentes.json`:
```json
{
  "fuentes": [
    {
      "id": "f1",
      "url": "",
      "autor": "",
      "fecha": "",
      "consultada": "",
      "tipo": "hecho | material",
      "licencia": "",
      "cita": "",
      "uso": "frase del guion o escena donde se usa",
      "tramo": "solo material: inicio-fin usado"
    }
  ]
}
```
`timing.<formato>.json`:
```json
{
  "formato": "largo | short",
  "fps": 60,
  "escenas": [
    { "id": "e01", "inicio": 0.0, "fin": 3.2, "frase": "", "palabras": [ { "p": "", "i": 0.0, "f": 0.0 } ] }
  ]
}
```

## 12. Riesgos
- Material de terceros: Mario asume la gestión de cualquier reclamación; se mantiene el registro
  en `fuentes.json` para poder responder.
- 60 fps duplica los fotogramas a renderizar frente a 30 fps: medir el tiempo de render de 10 min
  en el piloto.
- Cupo de Opus a esfuerzo alto con suscripción de 20 $.
- Ninguna fuente prueba un vídeo de 10 min de punta a punta con estas herramientas.
- Calidad de la voz en español y su coste dentro de 10 $/mes.
- FFmpeg no está en el PATH (se resolverá al empezar el piloto).
- Pixel art pequeño frente a legibilidad a 360×640.

## 13. Decisiones pendientes
Cada una tendrá su ADR en `docs/decisiones/`:
motor de render · proveedor de voz (perfil ya fijado) · alineación · plataforma de música y
efectos por IA · diseño de la publicación por API · miniaturas.
