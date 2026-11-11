# Crítica · clip v6 en 16:9, primera vuelta · 2026-11-10

Subagente `critico-visual` (Opus) sobre `.runtime/qa/calibracion-v6-largo-v1/` (primer render del clip: hoja a 2 fps,
5 tiras de movimiento y 15 instantes a tamaño completo y a 640×360). Guardada por el orquestador. La misma pasada juzgó
el short interno v4 de NVIDIA: `proyectos/nvidia-huang-espionaje/reviews/critica-04.md`.

## 3 peores defectos
1. **[t≈16,9-22,2] La pantalla del gráfico llevaba 4 textos más el rótulo** (LAMA2, FUERZA, NACIMIENTO, PRIMEROS MESES).
   «LAMA2» repetía el rótulo y la caja; «FUERZA» se quedaba sin barra; los otros dos transcribían la voz.
   - Arreglo: fuera LAMA2 y FUERZA; como mucho, un identificador pegado a la línea de tiempo. **BLOQUEANTE: sí.**
2. **[t=0-2,0] Entrada con texto de plantilla** («TEMA 1») y rótulo «Mithril Medicine» 4 s antes de que la voz lo
   nombre. No bloquea, pero el texto de plantilla tiene que salir.
3. **[t≈3,0-5,3] «11 LABORATORIOS» copia la voz y lleva palabra**; la regla pide la cifra grande y sola. No bloquea.

## Otros
- Final quieto de 19,5 a 22,2 s.
- El zoom de la oficina deja una franja negra entre el suelo y la caja (pendiente desde la v5).
- «IA de mano derecha» es una bolita azul: se lee como una luz.
- El marco de «Mithril» pega «fundó[Mithril]Medicine».

## Lo que funciona
La oficina con la persona y la ciudad con los laboratorios en las ventanas; el ADN con el tramo LAMA2 resaltado; el
brazo con la barra de fuerza que baja, que se entiende sin leer; la fuente dentro de la caja, en la línea del nombre,
legible a 640×360; el viaje con la partícula; el rótulo que cambia al llegar; el zoom que encuadra entero.

## Veredicto: no pasa
Bloquea el defecto 1. Lo aplicado y la segunda vuelta, en `iter-v6-01.md` y `critica-v6-02.md`.
