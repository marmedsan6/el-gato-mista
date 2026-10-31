# Criterios

Reglas que todo vídeo cumple. Si una regla molesta, se cambia aquí con aprobación de Mario,
no se salta.

## 1. Contrato de escena
Toda escena, en cualquier motor:
1. Expone `seek(t)`, que pinta exactamente el fotograma del segundo `t`. Llamar `seek(t)` dos
   veces con el mismo `t`, en cualquier orden, da el mismo fotograma.
2. En modo render no usa CSS transitions ni animations con reloj, `setTimeout`, `setInterval`,
   `requestAnimationFrame` ni `Date.now()`/`performance.now()`.
3. Azar solo con generador con semilla fija por escena.
4. Fuentes tipográficas de la marca dentro del proyecto (`marca/fuentes/`); nada de fuentes
   del sistema ni CDN.
5. Prohibido por defecto (se permite solo si `docs/estilo.md` lo autoriza):
   - título centrado sobre degradado;
   - todo entrando con fundido;
   - etiquetas en las esquinas.
6. Algo nuevo en pantalla cada 2-4 s.
7. Legible a 360×640 (se comprueba escalando el fotograma, no a ojo en el monitor).
8. El short no es un recorte del largo: cada formato tiene su composición.

## 2. Fuentes y hechos
- Cada afirmación factual del guion apunta a un `id` de `fuentes.json`.
- Fuente primaria cuando exista; si no, dos secundarias independientes.
- Noticias: fecha de consulta registrada; se revisa antes de la PUERTA 2 si pasaron días.
- Material de terceros: solo público; se registra URL, autor, licencia y tramo usado; crédito
  en pantalla o descripción; fragmento lo más corto posible y con comentario propio. El que
  aporta Mario se da por libre de reclamaciones; si llega alguna, la gestiona Mario.
- Las referencias de estilo aportan solo lenguaje visual: nunca sujetos, logos ni textos.

## 3. Puertas
Fichero `reviews/puerta-N.md` por puerta:
```markdown
# Puerta N · <slug>
- Fecha:
- Qué se aprueba: guion (PUERTA 1) | máster largo y short (PUERTA 2)
- Huella: SHA-256 de cada fichero, duración y resolución (solo PUERTA 2)
- Decisión de Mario: aprobado | cambios (lista)
```
Si el fichero cambia después de aprobar, la huella deja de valer y hay que volver a aprobar.
En la PUERTA 2, la orden de subir de Mario es la aprobación: `subir` anota su bloque con la SHA-256 del fichero vigente.

## 4. QA
| Comprobación | Herramienta | Umbral |
|---|---|---|
| Congelados | `freezedetect` | Ninguno no intencionado > 2 s (*a afinar*) |
| Negros | `blackdetect` | Ninguno no intencionado |
| Sonoridad | `ebur128` | -14 LUFS integrados (±1) |
| Pico real | `ebur128` (true peak) | < -2 dBTP |
| Silencios | `silencedetect` | Según `docs/estilo.md` |
| Visual | hoja de contactos + crítico | 3 peores defectos con marca de tiempo, ninguno bloqueante |

Un defecto bloqueante impide pasar a la PUERTA 2.
