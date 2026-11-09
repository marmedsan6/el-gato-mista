# Crítica · máster short v1 nvidia-huang-espionaje (estilo v5) · 2026-11-09

Subagente `critico-visual` (Opus) sobre `.runtime/qa/nvidia-huang-espionaje-short/` (hojas cada 0,5 s y 12 fotogramas a 1080×1920 y 360×640). Guardada por el orquestador (el crítico solo lee). El tramo 42-44 s ya estaba corregido y no se cuenta.

## 3 peores defectos
1. [t=53.5-55.0] El panel de «OJO: MATIZ» dice «NVIDIA CONFIRMA» sin tachar unos 2 s, mientras la voz dice «Pero ojo: NVIDIA no…»; el tachado y el sello llegan en t=55.5. La pantalla afirma lo contrario de lo que pasó durante 2 s (incumple «ninguna etiqueta afirma más que la voz»). Arreglo: que entre como pregunta o negado, tachado desde el primer fotograma. · **BLOQUEANTE**
2. [t=9, 15-19.5, 25, 28.5, 36.5, 69] Etiquetas apiladas arriba a la izquierda, lejos de lo que nombran, con duplicados del rótulo («MEGASPEED» + «MEGASPEED · SINGAPUR», «SEGÚN EL NYT» + «SEGÚN THE NEW YORK TIMES», «EL OBJETIVO» + «OBJETIVO: SUS CHIPS») y margen izquierdo que baila (x 12, 16 y 20 u). Arreglo: anclarlas a su objeto, quitar duplicados, alinear a 16 u. · No bloquea (recomendado, primer vídeo v5)
3. [t=2.5-6.0, 14-18, 25-28.5] Tramos sin novedad frente a la regla v5 de 1-2 s (la silueta del gancho apenas se ve; la rotativa solo gira; en Megaspeed solo se mueve la lupa). Arreglo: un evento atado a la voz en cada tramo. · No bloquea

## Otros
- Franja derecha tapada (x > 231 u, 45-85 % de la altura): caseta de «China», lupa, bobina derecha, mitad del plano del chip y bocadillo de China. Desplazar a la izquierda.
- MISTA sale en 4 de los 9 rótulos (entrada, correo, MATIZ, cierre): es lo que decidió Mario; los demás rótulos son estaciones, no temas.
- Alice Huang (silueta) mide ~25 u: a 360×640 es una mancha. Agrandarla, en sombra.
- La diana roja sobre la cara de Jensen Huang (t≈31-34) se lee como mira telescópica. Mejor solo sobre el plano del chip.
- t=69: la barra al ~40 % sugiere un avance que nadie ha dado; mejor indeterminada. Los consejeros de la torre parecen velas. La etiqueta toca la antena.
- Verde en «2024»: el verde es para lo que sigue intacto.
- «OBJETIVO: SUS CHIPS» es acusación y le falta «según…».
- Cierre sin remisión al largo: correcto, no hay largo.
- Posible tramo quieto t=44.5-49.0 (hay hilo, pero 46.5-48.4 sin novedad).

## Lo que funciona
Gancho del fotograma 0; ambiente de thriller nocturno coherente; silueta de Alice en el corcho; atribuciones presentes y la de EE. UU. en naranja; caja de diálogo y etiquetas legibles a 360×640; sala del consejo, despacho del correo y Singapur bien dibujados, sin píxeles borrosos.

## Veredicto: no pasa
Bloquea el defecto 1. Se corrigen el 1, el 2, el 3 y los «otros» que tocan precisión o legibilidad (`reviews/iter-01.md`).
