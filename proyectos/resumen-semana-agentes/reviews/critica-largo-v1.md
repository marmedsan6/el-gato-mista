# Crítica · largo v1 resumen-semana-agentes (16:9) · 2026-11-06

Subagente `critico-visual` (Opus) sobre la hoja de contactos y 12 fotogramas de `.runtime/qa/resumen-semana-agentes-largo/`. Lo copia aquí el orquestador, porque el crítico solo tiene herramientas de lectura.

## 3 peores defectos
1. [09:29] La etiqueta «PENSAMIENTO» se sale por la derecha («PENSAMIENT») y casi toca «MANDÍBULA». · BLOQUEANTE · **Arreglado:** columnas fijas cada 28 unidades y rótulos alternos en dos alturas.
2. [01:42, detalle del bucle] El texto sale de sus placas («SKILLS», «HOOKS», «HERRAM.»). · BLOQUEANTE · **Arreglado:** placas de 22 unidades, a la medida del texto.
3. [05:33] El «≤» de Press Start 2P se lee como «$» («$ 5.000»). · BLOQUEANTE · **Arreglado:** «Unas 11 h · hasta 5.000». También se han cambiado el «−» (U+2212, que no está en Press Start 2P: se comprobó con fontTools), «≈», «≠» y «…» de las etiquetas, en el largo y en los shorts B y C.

## Otros
- [02:33] La fuente tapaba la barra roja del detalle. **Arreglado:** sube a y = 100, entre las etiquetas.
- [04:26 y 06:08] El sello «MATIZ» no cae sobre el bocadillo y la fuente queda cerca de la esquina. Sin cambios: no bloquea.
- [06:44] Los hitos de la cronología de Binance iban sin fondo sobre las ventanas. **Arreglado:** placa `panel` detrás de cada rótulo.
- [00:24] La insignia «AGENTES» chocaba con las fuentes. **Arreglado:** sube a y = 124, junto al robot.
- Rojo en texto pequeño: se comprobó en fotogramas completos. Esos textos van en blanco sobre placa roja (permitido); el resto, en naranja.
- [03:50 y 09:10] Sin caja: son el desplazamiento lateral entre bloques y el final del vídeo.

## Veredicto del crítico: no pasa (v1)
Los tres bloqueantes y el solape de 02:33 están arreglados en la v2 (comprobado con fotogramas en `trabajo/revisar4/`).
