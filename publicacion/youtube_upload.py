"""Subida a YouTube: cuerpo de la publicación, fecha programada y subida reanudable."""
from __future__ import annotations

import re
import time
from datetime import datetime, timezone
from pathlib import Path

from .core import ClipError, now, read_json, write_json

UPLOAD = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status'


def parse_date(value):
    try:
        instant = datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError as error:
        raise ClipError('Fecha inválida. Usa ISO 8601 con zona, por ejemplo 2026-10-10T18:00:00+02:00.') from error
    if instant.tzinfo is None or instant <= datetime.now(timezone.utc):
        raise ClipError('La fecha programada necesita zona horaria y debe estar en el futuro.')
    return instant.astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')


def publication_body(clip, privacy='private', publish_at=None):
    if privacy not in ('private', 'unlisted', 'public'):
        raise ClipError('Visibilidad inválida.')
    if 'made_for_kids' not in clip:
        raise ClipError('Antes de subir, indica made_for_kids (true/false) en cada clip; no se adivina la audiencia.')
    status = {'privacyStatus': 'private' if publish_at else privacy, 'selfDeclaredMadeForKids': clip['made_for_kids'], 'containsSyntheticMedia': clip.get('contains_synthetic_media', False)}
    if publish_at:
        if privacy != 'public':
            raise ClipError('Una programación requiere visibilidad public; se mantiene privado hasta la fecha.')
        status['publishAt'] = parse_date(publish_at)
    return {'snippet': {'title': clip['titulo'], 'description': clip.get('descripcion', ''), 'tags': clip.get('tags', []), 'categoryId': clip.get('categoria', '22')}, 'status': status}


def upload_resumable(session, path, body, checkpoint, pause=time.sleep):
    """Resume an existing URI and probe after uncertain responses; never repeat creation."""
    state = read_json(checkpoint) if checkpoint.is_file() else {}
    if state.get('video_id'):
        return state['video_id']
    if state.get('estado') == 'creacion-incierta' and not state.get('uri'):
        raise ClipError('Creación de sesión incierta. Revisa Studio antes de reiniciar; no se repite la solicitud automáticamente.')
    size = path.stat().st_size
    if not state.get('uri'):
        state = {'estado': 'creacion-incierta', 'actualizado': now()}
        write_json(checkpoint, state)
        try:
            response = session.post(UPLOAD, json=body, headers={'X-Upload-Content-Type': 'video/mp4', 'X-Upload-Content-Length': str(size)}, timeout=60)
        except Exception as error:
            raise ClipError('No se confirmó la creación de la sesión. No se inicia otra para evitar duplicados.') from error
        if response.status_code not in (200, 201) or not response.headers.get('Location'):
            raise ClipError(f'YouTube no confirmó la sesión (HTTP {response.status_code}). Revisa configuración y estado antes de reintentar.')
        state = {'uri': response.headers['Location'], 'estado': 'subiendo', 'actualizado': now()}
        write_json(checkpoint, state)

    def completed(response):
        if response.status_code not in (200, 201):
            return None
        identifier = response.json().get('id')
        if not identifier:
            raise ClipError('La respuesta final no contiene el id. La sesión se conserva para comprobarla.')
        state.update({'video_id': identifier, 'estado': 'completado', 'actualizado': now()})
        write_json(checkpoint, state)
        return identifier

    def offset_from(response):
        if response.status_code != 308:
            raise ClipError(f'No se pudo reanudar la sesión (HTTP {response.status_code}). No se crea otra subida automáticamente.')
        value = response.headers.get('Range')
        if not value:
            return 0
        match = re.fullmatch(r'bytes=0-(\d+)', value)
        if not match:
            raise ClipError('YouTube devolvió un rango inesperado.')
        return int(match.group(1)) + 1

    offset, retries, needs_probe = 0, 0, True
    with path.open('rb') as stream:
        while True:
            try:
                if needs_probe:
                    response = session.put(state['uri'], data=b'', headers={'Content-Range': f'bytes */{size}', 'Content-Length': '0'}, timeout=60)
                    identifier = completed(response)
                    if identifier:
                        return identifier
                    if response.status_code in (500, 502, 503, 504, 429):
                        raise ConnectionError('respuesta temporal')
                    offset = offset_from(response)
                    needs_probe = False
                if offset >= size:
                    raise ClipError('YouTube recibió los bytes pero no confirmó el vídeo. Conservamos la sesión para comprobarla después.')
                stream.seek(offset)
                chunk = stream.read(8 * 1024 * 1024)
                response = session.put(state['uri'], data=chunk, headers={'Content-Type': 'video/mp4', 'Content-Length': str(len(chunk)), 'Content-Range': f'bytes {offset}-{offset + len(chunk) - 1}/{size}'}, timeout=180)
                identifier = completed(response)
                if identifier:
                    return identifier
                if response.status_code in (500, 502, 503, 504, 429):
                    raise ConnectionError('respuesta temporal')
                received = offset_from(response)
                if received <= offset or received > size:
                    raise ClipError('Rango sin progreso o inválido. Conservamos la sesión.')
                offset = received
                retries = 0
                state.update({'recibidos': offset, 'actualizado': now()})
                write_json(checkpoint, state)
            except ClipError:
                raise
            except Exception as error:
                retries += 1
                if retries > 4:
                    raise ClipError('Subida pausada tras cuatro reintentos. La siguiente ejecución comprobará la misma sesión.') from error
                pause(min(2 ** retries, 8))
                needs_probe = True


def upload_thumbnail(session, video_id, thumbnail):
    path = Path(thumbnail)
    if not path.is_file():
        raise ClipError(f'No se encuentra la portada aprobada para YouTube: {path.name}.')
    with path.open('rb') as image:
        response = session.post(
            'https://www.googleapis.com/upload/youtube/v3/thumbnails/set',
            params={'videoId': video_id}, data=image,
            headers={'Content-Type': 'image/jpeg'}, timeout=120,
        )
    if not 200 <= response.status_code < 300:
        try:
            reasons = ', '.join(f"{e.get('reason')}: {e.get('message')}" for e in response.json()['error']['errors'])[:400]
        except Exception:
            reasons = ''
        raise ClipError(f'YouTube no confirmó la portada (HTTP {response.status_code}{": " + reasons if reasons else ""}); '
                        'el vídeo permanece registrado para reanudar la portada sin repetir la subida.')
