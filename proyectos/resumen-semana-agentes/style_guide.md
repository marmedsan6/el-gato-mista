# Guía de estilo · resumen-semana-agentes

- Estilo base: estilo v3 (docs/estilo.md), con la cámara vigente y las cifras de la caja en JetBrains Mono.
- Desviaciones de este vídeo (solo lo que cambia), todas decididas por Mario el 2026-11-06:
  - **Agentes = robots pixel pequeños** (8×11 unidades, con la pantalla por cara y un color por agente). El jefe del Super-agent lleva gorra y portapapeles, sin herramientas (`escenas/comun/agentes.js`, `robot3`).
  - **Skills = cartuchos de videojuego** que se meten en el robot (`cartucho3`).
  - **Sello «MATIZ»**: cuando MISTA corrige una exageración, la frase del post sale en un bocadillo sin el nombre de la cuenta y le cae encima un sello rojo de 16 px con el dato real al lado (`bocadilloPost`, `selloMatiz`). Sale en teardown, Cloudflare, Linux, Microsoft y subvox.
  - **Plano de detalle** solo en cuatro explicaciones del largo: el bucle que se cambia (harness), las barras del peor caso (Super-agent), la cronología de Binance y la caída de Stack Overflow. En los shorts, uno por short: la cronología (A), la extensión con su identificador (B) y el bucle (C).
  - Escenarios: despacho (gancho, orquestadores, impacto y cierre), laboratorio (harness, skills e interfaces), sala de servidores (Super-agent, extensión y Linux, con un tinte rojo en el lado oscuro) y azotea de noche (Binance).
  - Shorts: la fuente del dato va siempre bajo el rótulo (y = 82 px), porque la columna izquierda se llena de texto.
  - Sin logos reales de empresas: los nombres van como texto.
