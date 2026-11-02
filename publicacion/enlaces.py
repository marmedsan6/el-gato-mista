"""Enlaces entre el largo y sus shorts, y de Instagram y TikTok a YouTube (Mario, 2026-11-02).

publicacion.json lleva solo el resumen; los enlaces se añaden aquí con las URLs reales de publicaciones.json.
En YouTube el largo sube primero, así que cada short sale ya con «Vídeo completo»; el largo recibe después la lista de
sus shorts con videos.update (permiso youtube.force-ssl). Si una descripción ya trae enlaces de YouTube escritos a mano
(alien-isolation-ia), no se le añade nada.
"""
from __future__ import annotations

import re

from .aprobado import is_short, load
from .core import ClipError, read_json

ID = re.compile(r'(?:v=|/shorts/|youtu\.be/)([A-Za-z0-9_-]{11})')
LIMITE = 5000


def has_links(text):
    return 'youtube.com/' in text or 'youtu.be/' in text


def url(format_id, video_id):
    return ('https://www.youtube.com/shorts/' if is_short(format_id) else 'https://www.youtube.com/watch?v=') + video_id


def video_ids(project):
    """{formato: id de YouTube} de lo ya subido; si un formato se subió más de una vez, cuenta el más reciente."""
    path = project / 'publicaciones.json'
    records = read_json(path).get('historias', {}).values() if path.is_file() else []
    ids = {}
    for record in sorted(records, key=lambda r: r.get('fecha') or ''):
        if record.get('estado') in ('fallido', 'incierto'):
            continue
        match = ID.search(str(record.get('url') or ''))
        video_id = record.get('video_id') or (match.group(1) if match else None)
        if record.get('formato') and video_id:
            ids[record['formato']] = video_id
    return ids


def youtube_description(project, format_id, base, ids=None):
    """La descripción con sus enlaces y si ya está completa (False mientras falte subir alguno de los vídeos enlazados)."""
    formats = load(project)['formatos']
    ids = video_ids(project) if ids is None else ids
    if has_links(base) or 'largo' not in formats:
        return base, True
    if is_short(format_id):
        if 'largo' not in ids:
            return base, False
        text, complete = base.rstrip() + '\n\nVídeo completo: ' + url('largo', ids['largo']), True
    else:
        shorts = [f for f in formats if is_short(f)]
        lines = ['- ' + formats[f]['titulo'].strip() + ': ' + url(f, ids[f]) for f in shorts if f in ids]
        heading = 'Short de este vídeo:' if len(shorts) == 1 else 'Shorts de este vídeo:'
        text = base.rstrip() + ('\n\n' + heading + '\n' + '\n'.join(lines) if lines else '')
        complete = len(lines) == len(shorts)
    if len(text.encode('utf-8')) > LIMITE:
        raise ClipError('Con los enlaces, la descripción pasa de 5000 bytes; acorta el resumen: ' + format_id)
    return text, complete


def social_line(project, format_id):
    """Línea para Instagram y TikTok: el largo en YouTube o, si el vídeo no tiene largo, este mismo short.
    None si ese vídeo aún no está en YouTube."""
    target = 'largo' if 'largo' in load(project)['formatos'] else format_id
    video_id = video_ids(project).get(target)
    if not video_id:
        return None
    return ('Vídeo completo en YouTube: ' if target == 'largo' else 'En YouTube: ') + url(target, video_id)
