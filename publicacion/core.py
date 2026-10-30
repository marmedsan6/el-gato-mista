from __future__ import annotations

import contextlib
import hashlib
import json
import os
import subprocess
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ClipError(Exception):
    pass


def now():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))


def write_json(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + '.' + uuid.uuid4().hex + '.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False), encoding='utf-8')
    # En Windows el antivirus o el indexador pueden retener el archivo unos milisegundos.
    for attempt in range(6):
        try:
            os.replace(temp, path)
            return
        except PermissionError:
            if attempt == 5:
                temp.unlink(missing_ok=True)
                raise
            time.sleep(0.05 * (attempt + 1))


def sha_file(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as stream:
        while block := stream.read(1024 * 1024):
            digest.update(block)
    return digest.hexdigest()


def digest_json(data):
    return hashlib.sha256(json.dumps(data, ensure_ascii=False, sort_keys=True, allow_nan=False).encode()).hexdigest()


def credentials_root():
    """El perfil de Pod 02 se comparte con canal-noticias-ia: el mismo canal, la misma app OAuth y la misma auditoría."""
    override = os.environ.get('ELGATOMISTA_CREDENCIALES')
    return Path(override) if override else Path.home() / '.clipping-ia' / 'youtube'


def project_path(value):
    value = Path(value)
    path = value.resolve() if value.is_absolute() else (ROOT / 'proyectos' / str(value)).resolve()
    if not path.is_relative_to((ROOT / 'proyectos').resolve()):
        raise ClipError('El proyecto debe estar dentro de la carpeta proyectos.')
    if not (path / 'brief.md').is_file():
        raise ClipError('No existe ese proyecto: falta su brief.md.')
    return path


@contextlib.contextmanager
def project_lock(path):
    lock = (Path(path) / '.lock').open('a+b')
    try:
        if lock.seek(0, 2) == 0:
            lock.write(b'0')
            lock.flush()
        lock.seek(0)
        try:
            if os.name == 'nt':
                import msvcrt
                msvcrt.locking(lock.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError as error:
            raise ClipError('Otro proceso está trabajando en este proyecto. Reintenta cuando termine.') from error
        yield
    finally:
        lock.close()


def command(arguments):
    process = subprocess.run([str(x) for x in arguments], capture_output=True, encoding='utf-8', errors='replace', creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    if process.returncode:
        raise ClipError('Error de procesamiento: ' + process.stderr[-2200:])
    return process.stdout


def ffmpeg(arguments):
    return command(['ffmpeg', '-hide_banner', '-nostdin', '-y', *arguments])


def duration(path):
    return float(command(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path]).strip())
