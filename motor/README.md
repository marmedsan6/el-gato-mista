# Motor

Vacío a propósito. El motor de render se elige en el piloto (ver `docs/arquitectura.md` §6).

Cuando exista:
- Código y `package.json` aquí; `node_modules/` aquí mismo, ignorado por git.
- Tests en `tests/`, incluido uno de determinismo: `seek(t)` dos veces → mismo fotograma.
- FFmpeg desde el PATH.
