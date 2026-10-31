# 0003 · Web legal en la rama gh-pages

- Fecha: 2026-10-29
- Estado: aceptada (completa la 0002)

## Contexto
El ADR 0002 sobrescribe `main` de `marmedsan6/el-gato-mista` con el proyecto. Ese repo servía con
GitHub Pages la página principal, la política de privacidad y las condiciones de uso de la app de
publicación (YouTube, TikTok e Instagram), que las plataformas tienen registradas por URL.
Comprobado el 2026-10-29: la API de Pages del repo devuelve 404 y
`https://marmedsan6.github.io/el-gato-mista/privacidad.html` también; la web ya no se servía.

## Decisión
- `main` = proyecto. La web legal vive en una rama aparte, `gh-pages`, creada desde `web-antigua`
  (commit `e9ffddd`), y Pages sirve solo esa rama (`/`). Así los `docs/` del proyecto no se publican
  como web y las URLs legales vuelven a ser las de antes.
- Comandos que ejecuta Mario (los agentes no hacen push ni cambian ajustes del repo):
  - `git push --force-with-lease=main:e9ffddd origin main`
  - `git push origin gh-pages`
  - `gh api -X POST repos/marmedsan6/el-gato-mista/pages -f "source[branch]=gh-pages" -f "source[path]=/"`
- Verificación: `curl -s -o /dev/null -w "%{http_code}" https://marmedsan6.github.io/el-gato-mista/privacidad.html` → 200.

## Consecuencias
- Los textos siguen nombrando «Canal noticias IA» y el canal `UCA76YezyGjv7spjOfRqAKNA`; si la app
  pasa a publicar como ElGatoMista, Mario decide si se reescriben (antes de la publicación por API).
- `index.html` no enlaza `terminos.html` (sí existe la página).
- Cambiar la web legal = commit en `gh-pages`, nunca en `main`.
