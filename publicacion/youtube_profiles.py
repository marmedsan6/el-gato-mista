"""Explicit, channel-verified OAuth profiles; no automatic account connection."""
from __future__ import annotations

import json
import re
from pathlib import Path

from . import core
from .core import ClipError, now, read_json, write_json

# yt-analytics.readonly: métricas de los shorts para el bot de feedback (C9), pedido ya para no repetir el consentimiento.
SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/yt-analytics.readonly']


def profile_root(profile):
    if profile != 'es':
        raise ClipError('Perfil disponible: es.')
    root = core.credentials_root().resolve()
    if root.is_relative_to(core.ROOT.resolve()) or any('onedrive' in part.lower() for part in root.parts):
        raise ClipError('Las credenciales de YouTube deben estar fuera de OneDrive y del workspace.')
    return root / 'perfiles' / profile


def metadata(profile):
    path = profile_root(profile) / 'perfil.json'
    return read_json(path) if path.is_file() else {'perfil': profile, 'channel_id': None, 'nombre': 'Canal pendiente', 'auditoria_youtube': 'pendiente'}


def route(profile, visibility):
    root = profile_root(profile)
    meta = metadata(profile)
    if (root / 'token.json').is_file() and meta.get('channel_id') and (visibility == 'private' or meta.get('auditoria_youtube') == 'confirmada'):
        return 'YouTube Data API'
    return 'YouTube Studio (manual)'


def verify_identity(session, expected):
    response = session.get('https://www.googleapis.com/youtube/v3/channels', params={'part': 'id,snippet', 'mine': 'true', 'maxResults': 50}, timeout=30)
    if response.status_code != 200:
        raise ClipError(f'No se pudo verificar el canal autenticado (HTTP {response.status_code}).')
    channels = response.json().get('items', [])
    if len(channels) != 1 or channels[0].get('id') != expected:
        raise ClipError('La conexión OAuth no identifica exclusivamente el canal previsto. Selecciona ese canal al volver a conectar el perfil.')
    return channels[0]


def connect(client_file, profile, channel_id):
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import AuthorizedSession
    if not re.fullmatch(r'UC[A-Za-z0-9_-]{22}', channel_id or ''):
        raise ClipError('Indica el channelId real de YouTube (UC seguido de 22 caracteres).')
    path = Path(client_file).resolve()
    if any('onedrive' in part.lower() for part in path.parts) or path.is_relative_to(core.ROOT.resolve()):
        raise ClipError('Guarda el JSON OAuth fuera del proyecto y de OneDrive.')
    root = profile_root(profile)
    if 'installed' not in read_json(path):
        raise ClipError('Se necesita el JSON OAuth de una aplicación de escritorio.')
    flow = InstalledAppFlow.from_client_secrets_file(str(path), SCOPES)
    credentials = flow.run_local_server(host='127.0.0.1', port=0, open_browser=True, success_message='Puedes cerrar esta pestaña; verificando el canal elegido.')
    session = AuthorizedSession(credentials)
    try:
        channel = verify_identity(session, channel_id)
    finally:
        session.close()
    root.mkdir(parents=True, exist_ok=True)
    write_json(root / 'token.json', json.loads(credentials.to_json()))
    previous = metadata(profile)
    same_channel = previous.get('channel_id') == channel_id
    write_json(root / 'perfil.json', {'perfil': profile, 'channel_id': channel_id, 'nombre': channel.get('snippet', {}).get('title', profile),
                                    'verificado': now(), 'auditoria_youtube': previous.get('auditoria_youtube', 'pendiente') if same_channel else 'pendiente'})
    return {'perfil': profile, 'channel_id': channel_id, 'conectado': True, 'credenciales': 'guardadas en ruta privada'}


def authorized_session(profile):
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import AuthorizedSession
    root = profile_root(profile)
    if not (root / 'token.json').is_file():
        raise ClipError('Perfil de YouTube todavía sin conectar: ' + profile)
    credentials = Credentials.from_authorized_user_file(str(root / 'token.json'), SCOPES)
    session = AuthorizedSession(credentials)
    try:
        verify_identity(session, metadata(profile)['channel_id'])
    except Exception:
        session.close()
        raise
    return credentials, session


def public_probe_done(profile):
    """¿Ya se hizo la prueba de subida pública por API de este perfil? Solo se hace una vez, con el resultado que dé YouTube."""
    return bool(metadata(profile).get('prueba_publica'))


def record_public_probe(profile, video_id, privacy):
    """Guarda lo que YouTube hizo con el vídeo de la prueba (privacyStatus). No toca `auditoria_youtube`: eso lo confirma Mario."""
    item = {**metadata(profile), 'prueba_publica': {'video_id': video_id, 'fecha': now(), 'privacyStatus': privacy}}
    write_json(profile_root(profile) / 'perfil.json', item)
    return item['prueba_publica']


def video_privacy(session, video_id):
    """privacyStatus que YouTube asignó al vídeo (videos.list?part=status), o None si no se pudo leer."""
    response = session.get('https://www.googleapis.com/youtube/v3/videos', params={'part': 'status', 'id': video_id}, timeout=30)
    if response.status_code != 200:
        return None
    items = response.json().get('items') or []
    return items[0].get('status', {}).get('privacyStatus') if items else None


def configure(profile, channel_id, name='', audit=None, evidence=''):
    if not re.fullmatch(r'UC[A-Za-z0-9_-]{22}', channel_id or ''):
        raise ClipError('Indica el channelId real de YouTube.')
    root = profile_root(profile)
    previous = metadata(profile)
    if previous.get('channel_id') not in (None, channel_id):
        raise ClipError('El perfil ya pertenece a otro canal; vuelve a conectarlo explícitamente.')
    if audit == 'confirmada' and not evidence.strip():
        raise ClipError('Registra la evidencia de auditoría antes de habilitar publicación pública por API.')
    item = {**previous, 'channel_id': channel_id, 'nombre': name or previous['nombre']}
    if audit:
        item.update({'auditoria_youtube': audit, 'evidencia_auditoria': evidence})
    write_json(root / 'perfil.json', item)
    return item
