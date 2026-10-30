"""Qué vídeos de este canal pasaron la PUERTA 2 y con qué datos salen.

Sustituye a stories.approved, stories.load y stories.rights_pending de canal-noticias-ia, donde la aprobación
y los metadatos viven en estado-clips.json e historia.json. Aquí viven en reviews/puerta-2.md, publicacion.json
y fuentes.json. El resto de la publicación (story_publication.py) no sabe de dónde salen estos datos.
"""
from __future__ import annotations

import re

from .core import ClipError, duration, read_json, sha_file

FORMATS = ('short', 'largo')
PROFILE = 'es'
# Solo «aprobado», solo o con una nota entre paréntesis: «aprobado con cambios» o la plantilla sin rellenar no valen.
DECISION = re.compile(r'^- Decisión de Mario[^:\n]*:\s*\*{0,2}aprobad[oa]\*{0,2}\s*(?:\(.*|«.*|\.\s*)?$', re.M | re.I)
HUELLA = re.compile(r'^- Huella:.*$', re.M)


def gate_approved(project, sha):
    """¿Aprobó Mario esta huella exacta? Cada bloque de puerta-2.md se lee aparte: una decisión solo vale para las huellas de su bloque."""
    path = project / 'reviews' / 'puerta-2.md'
    if not path.is_file():
        return False
    for block in re.split(r'^# Puerta 2', path.read_text(encoding='utf-8-sig'), flags=re.M)[1:]:
        hashes = {value for line in HUELLA.findall(block) for value in re.findall(r'[0-9a-f]{64}', line)}
        if sha in hashes and DECISION.search(block):
            return True
    return False


def load(project):
    path = project / 'publicacion.json'
    if not path.is_file():
        raise ClipError('Falta publicacion.json en el proyecto (plantilla en plantillas/proyecto/).')
    data = read_json(path)
    if data.get('perfil') != PROFILE:
        raise ClipError('El perfil de publicación debe ser ' + PROFILE + '.')
    unknown = set(data.get('formatos', {})) - set(FORMATS)
    if unknown or not data.get('formatos'):
        raise ClipError('publicacion.json necesita formatos short y/o largo.')
    return data


def approved(project):
    """Formatos cuyo fichero actual tiene la PUERTA 2 aprobada; el resto se omite y, si no queda ninguno, se para."""
    result = []
    for format_id, publication in load(project)['formatos'].items():
        path = (project / publication['archivo']).resolve()
        if path.parent != (project / 'salida').resolve():
            raise ClipError('El vídeo debe estar directamente en salida/: ' + format_id)
        if not path.is_file():
            raise ClipError('No se encuentra el vídeo de ' + format_id + ': ' + path.name)
        sha = sha_file(path)
        if gate_approved(project, sha):
            result.append((format_id, publication, {'sha256': sha, 'duracion': duration(path)}, path))
    if not result:
        raise ClipError('Todavía no hay vídeos con la PUERTA 2 aprobada sobre su huella exacta (reviews/puerta-2.md).')
    return result


def check_youtube_limits(publication, format_id):
    """YouTube rechaza estos valores al crear la sesión de subida, lo que deja el checkpoint en creacion-incierta: se para antes."""
    title, description = publication['titulo'], publication['descripcion']
    if len(title) > 100 or len(description.encode('utf-8')) > 5000 or any(mark in title + description for mark in '<>'):
        raise ClipError('Título de hasta 100 caracteres y descripción de hasta 5000 bytes, sin < ni >: ' + format_id)


def _sources(project):
    return read_json(project / 'fuentes.json')['fuentes']


def rights_pending(project):
    return [source['id'] for source in _sources(project) if source['tipo'] == 'material'
            and not (source['licencia'].strip() and source['url'].strip())]


def source_evidence(project):
    return {source['id']: {'uso': source['uso'], 'licencia': source['licencia'], 'url': source['url'], 'tramo': source['tramo']}
            for source in sorted(_sources(project), key=lambda item: item['id']) if source['tipo'] == 'material'}


def words(project, format_id):
    timing = read_json(project / f'timing.{format_id}.json')
    result = [{'texto': word['p'], 'inicio': word['i'], 'fin': word['f']}
              for group in timing.get('frases') or timing.get('escenas') or [] for word in group['palabras']]
    if not result:
        raise ClipError('timing.' + format_id + '.json no tiene palabras para los subtítulos.')
    return result


def write_srt(path, words):
    def timestamp(seconds):
        milliseconds = round(seconds * 1000)
        hours, rest = divmod(milliseconds, 3600000)
        minutes, rest = divmod(rest, 60000)
        seconds, ms = divmod(rest, 1000)
        return f'{hours:02}:{minutes:02}:{seconds:02},{ms:03}'
    lines = []
    for start in range(0, len(words), 6):
        group = words[start:start + 6]
        lines.extend([str(start // 6 + 1), timestamp(group[0]['inicio']) + ' --> ' + timestamp(group[-1]['fin']),
                      ' '.join(w['texto'] for w in group), ''])
    path.write_text('\n'.join(lines), encoding='utf-8')
