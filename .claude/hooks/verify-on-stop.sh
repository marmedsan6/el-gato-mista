#!/usr/bin/env bash
# Stop hook: sensor de verificación. Antes de que el agente dé el turno por terminado, si hay cambios en
# motor/ o en escenas (git diff + no versionados), ejecuta los tests del motor: lint del contrato de escena
# y determinismo de seek(t) (motor/tests/).
#  - 1.er fallo: exit 2 → el agente recibe los errores y sigue arreglando.
#  - 2.º fallo seguido (stop_hook_active): no bloquea; avisa a Mario (escalado humano).
# Prueba manual: echo '{}' | bash .claude/hooks/verify-on-stop.sh; echo $?

input=$(cat)
retry=false
echo "$input" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true' && retry=true

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
cd "$root" || exit 0

changed=$({ git diff --name-only HEAD; git ls-files --others --exclude-standard; } 2>/dev/null | sort -u)
echo "$changed" | grep -qE '^(motor/.*\.(mjs|js|jsx|html|css)|proyectos/[^/]+/escenas/.*)$' || exit 0
[ -d motor/node_modules ] || exit 0

if out=$(cd motor && npm test --silent 2>&1); then
  exit 0
fi
report="== npm test (motor/)"$'\n'"$(echo "$out" | grep -vE '^(ℹ|▶)' | tail -40)"

if [ "$retry" = true ]; then
  node -e 'process.stdout.write(JSON.stringify({systemMessage: "Los tests del motor siguen fallando tras un intento de arreglo. Revisa antes de dar la tarea por buena:\n" + process.argv[1]}))' "$report"
  exit 0
fi

echo "La verificación automática (.claude/hooks/verify-on-stop.sh) ha fallado. Arregla estos errores antes de terminar; si no sabes cómo, explica el error a Mario y propón la solución:" >&2
echo "$report" >&2
exit 2
