# 0002 · Repo remoto en GitHub

- Fecha: 2026-10-29
- Estado: aceptada (sustituye «git solo local» de la 0001)

## Contexto
Mario quiere el proyecto en GitHub, en `marmedsan6/el-gato-mista`. Ese repo era el antiguo
`canal-noticias-ia-web`: público, con GitHub Pages sirviendo la página principal, la política de
privacidad y las condiciones de uso de la app de publicación (TikTok, Instagram y YouTube).

## Decisión
- `origin` = `https://github.com/marmedsan6/el-gato-mista.git`; rama `main`.
- Se sobrescribe el historial anterior con un push forzado que ejecuta Mario.
- El contenido anterior queda en la rama local `web-antigua` (sin subir).

## Consecuencias
- El repo es **público**: nada privado entra en git (claves, datos personales, cifras de cuentas).
- La web legal anterior deja de servirse; las apps registradas con esas URLs necesitarán nuevas
  páginas de privacidad y condiciones antes de la publicación por API.
- Con GitHub Pages activo, `main` sin `index.html` publica el README como web: desactivar Pages
  o rehacer las páginas legales.

## Actualización 2026-10-29
- Pages ya daba 404 antes del push forzado. La web legal se recupera en la rama `gh-pages`: ver ADR 0003.
