# Arquitectura

Estado: **al día a 2026-11-10** (iteración v6). Las decisiones de fondo están en `docs/decisiones/` (ADR 0001-0010);
el borrador original del 2026-10-29 está en el historial de git.

## 1. Objetivo y alcance
Producir, a partir de un tema, un vídeo largo y sus shorts en español con:
- voz sintética (Gemini «Orus», ADR 0006), sin voz ni metraje propios;
- imágenes generadas por código (HTML + SVG, pixel art a 4 px; estilo en `docs/estilo.md`);
- material público de terceros como complemento, registrado y acreditado.

Cada hecho se verifica con fuente antes de producir. Nada se publica sin la orden de Mario.

## 2. Formatos
| | Largo | Short |
|---|---|---|
| Proporción | 16:9 | 9:16 |
| Duración | 8-10 min | La que pida la explicación (máx. 120 s) |
| Resolución | 1920×1080 | 1080×1920 |
| fps | 60 | 60 |
| Lienzo base | 480×270, ×4 | 270×480, ×4 |
| Texto | Caja de diálogo de MISTA; SRT aparte desde `timing.largo.json` | Caja de diálogo de MISTA |
| Plataformas | YouTube | YouTube Shorts, Instagram y bandeja de TikTok |

- Mismo guion maestro y mismo estilo. Cada formato se compone por separado: nunca se recorta uno del otro.
- Un vídeo puede llevar varios shorts (`short-a`, `short-b`…) o ser solo short, si Mario lo decide.
- Zona segura del short: nada importante en el 12 % superior, el 20 % inferior ni la franja derecha.

## 3. Flujo por etapas
| # | Etapa | Sale | Con qué | Criterio de salida |
|---|---|---|---|---|
| 1 | Brief | `brief.md` | Opus + Mario | Ángulo, público y gancho claros |
| 2 | Fuentes y verificación | `fuentes.json`, `verificacion.md` | Opus; `verificador-enlaces` | Cada hecho con fuente accesible |
| 3 | Guion | `guion.md`, con `[fN]` por párrafo | Opus | Cada frase con hecho trazable |
| — | **PUERTA 1** | `reviews/puerta-1.md` | Mario | Aprobación explícita |
| 4 | Storyboard y estilo | `shotlist.md`, `style_guide.md` | Opus; skill `estilo` | Una estación por idea; qué se dibuja para cada dato |
| 5 | Voz | audio en `.runtime/voz/<slug>/` | `motor/voz/generar.mjs` o `por-bloques.mjs`; `apretar-pausas.mjs` en el short | Sin errores de lectura |
| 6 | Alineación | `timing.<formato>.json` | `motor/voz/alinear.py`, `escrito.mjs`, `revisar-alineacion.mjs --corregir` | Límites de frase en los silencios reales |
| 7 | Escenas | `escenas/<formato>/` | Opus; `motor/timing-a-js.mjs --guion`; biblioteca `motor/estilo/v6/` | Contrato `seek(t)` y `revisar.mjs --estricto` sin errores |
| 8 | Render | `render/<formato>/` | `motor/render.mjs` (un tramo con `--desde/--hasta`) | Sin violaciones del contrato |
| 9 | Montaje y mezcla | `salida/<formato>-vN.mp4` | `motor/eventos.mjs`, `motor/mezcla.mjs` | -14 ± 1 LUFS y < -2 dBTP medidos en el máster |
| 10 | QA | `reviews/qa-vN.md`, `critica-NN.md` | `motor/qa.mjs`; `critico-visual` | Sin defectos bloqueantes |
| — | **PUERTA 2** | `reviews/puerta-2.md` | Mario | Su orden de subir, anotada con la huella |
| 11 | Exportar y publicar | URLs en `memoria/videos.md` | `publicacion/` (skill `publicar`, ADR 0008) | Orden expresa de Mario |

## 4. Carpetas y git
Tabla en `README.md`. En git solo van texto, código, fuentes tipográficas y métricas. Vídeos, audio, fotogramas,
claves y `node_modules` quedan fuera (`.runtime/`, `render/`, `salida/`, `referencias/`).

Cada vídeo (`proyectos/<slug>/`): `brief.md`, `fuentes.json`, `verificacion.md`, `guion.md`, `shotlist.md`,
`style_guide.md`, `timing.<formato>.json`, `escenas/<formato>/`, `publicacion.json`, `reviews/` y, sin versionar,
`render/`, `salida/`, `para-subir/` y `trabajo/`.

## 5. Motor (`motor/`)
Detalle y comandos en `motor/README.md`.
| Pieza | Qué hace |
|---|---|
| `render.mjs` | Playwright + chrome-headless-shell + FFmpeg (ADR 0004). Captura por `seek(t)`, caché por fotograma, `claveFotograma` |
| `revisar.mjs` + `lint-textos.mjs` | Recorre la escena antes del render: errores de `seek` y lint de textos y sincronía |
| `voz/` | Síntesis, alineación con faster-whisper, nombres escritos, pausas y revisión de la alineación |
| `timing-a-js.mjs` + `fuentes-frases.mjs` | `timing.js` de la escena, con la fuente de cada frase |
| `eventos.mjs`, `mezcla.mjs` | Efectos desde la escena; voz + música + efectos, limitador y medida del máster |
| `qa.mjs` + `qa-medidas.mjs` | QA mecánico en un comando |
| `huellas.mjs` | Huellas de las escenas publicadas: lo ya subido no cambia |
| `estilo/` | Bibliotecas de estilo por versión; las de vídeos publicados no se editan |

## 6. Contrato de escena y calidad
`docs/criterios.md`: `seek(t)` determinista, sin reloj, azar con semilla, fuentes locales, presupuesto de texto y QA.

## 7. Agentes y modelos
- Opus orquesta. Subagentes en `.claude/agents/`: `verificador-enlaces` (barato) y `critico-visual` (Opus, con aviso).
  `extractor-fotogramas` y `qa-audio` quedan para referencias externas: el QA de un máster lo hace `motor/qa.mjs`.
- Skills: `nuevo-video`, `estilo`, `qa` y `publicar`. Hook `verify-on-stop.sh`: `npm test` si cambian `motor/` o escenas.

## 8. Esquemas de datos
`fuentes.json`:
```json
{ "fuentes": [ { "id": "f1", "url": "", "autor": "", "corto": "nombre que se enseña en la caja (opcional)", "fecha": "",
    "consultada": "", "tipo": "hecho | material | contexto", "licencia": "", "cita": "", "uso": "", "tramo": "" } ] }
```
`timing.<formato>.json` (lo escribe `alinear.py`):
```json
{ "formato": "largo | short", "fps": 60, "audio": { "fichero": "", "sha256": "", "duracion_s": 0 }, "alineacion": {},
  "frases": [ { "id": "fr01", "texto": "", "inicio": 0.0, "fin": 3.2, "palabras": [ { "p": "", "i": 0.0, "f": 0.0 } ] } ] }
```
`timing.js` de la escena añade `frases[].fuentes` y `fuentes` (nombre corto por id).

## 9. Riesgos abiertos
- El mundo ancho de la v5/v6 no escala tal cual a un largo de 60-70 estaciones: hace falta un mundo por tema o
  virtualizado (pendiente, `docs/hoja-de-ruta.md`).
- Cada vídeo exige mucho dibujo a medida: falta el catálogo de dioramas por concepto.
- Cupo de Opus: cada pasada del crítico se avisa.
- Material de terceros: Mario gestiona cualquier reclamación; el registro está en `fuentes.json`.
