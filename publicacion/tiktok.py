"""TikTok Content Posting API (Upload): el vídeo local va a la bandeja de Mario, que termina el post. Nunca publica por su cuenta."""
from __future__ import annotations

import time
import urllib.parse

import requests

from . import redes
from .core import ClipError, now

AUTH = 'https://www.tiktok.com/v2/auth/authorize/'
API = 'https://open.tiktokapis.com'
SCOPES = ['user.info.basic', 'video.upload']
PORT = 8766
CALLBACK = '/callback/'
REDIRECT = f'http://127.0.0.1:{PORT}{CALLBACK}'
MB = 1024 * 1024


def chunk_plan(size):
    """Hasta 64 MB, una sola parte; más, partes de 32 MB y la última absorbe el resto (TikTok: 5-64 MB, la última hasta 128 MB)."""
    if size <= 0:
        raise ClipError('El vídeo está vacío.')
    if size <= 64 * MB:
        return size, 1
    chunk = 32 * MB
    return chunk, size // chunk


def authorize_url(client_key, state, challenge):
    query = {'client_key': client_key, 'response_type': 'code', 'scope': ','.join(SCOPES), 'redirect_uri': REDIRECT,
             'state': state, 'code_challenge': challenge, 'code_challenge_method': 'S256'}
    return AUTH + '?' + urllib.parse.urlencode(query)


def _token_from(payload, previous=None):
    if not payload.get('access_token'):
        raise ClipError('TikTok no devolvió un access token.')
    token = dict(previous or {})
    token.update({'access_token': payload['access_token'], 'refresh_token': payload.get('refresh_token') or token.get('refresh_token'),
                  'open_id': payload.get('open_id') or token.get('open_id'), 'scope': payload.get('scope', token.get('scope', '')),
                  'access_expira': redes.expires_in(payload.get('expires_in', 86400)),
                  'refresh_expira': redes.expires_in(payload['refresh_expires_in']) if payload.get('refresh_expires_in') else token.get('refresh_expira')})
    return token


def _api_failed(response, body):
    return response.status_code != 200 or str(body.get('error') or '') not in ('', 'ok')


def connect(session=None, opener=None, timeout=300):
    cred = redes.credentials('tiktok')
    session = session or requests.Session()
    verifier, challenge = redes.pkce()
    state = redes.new_state()
    url = authorize_url(cred['client_key'], state, challenge)
    kwargs = {'opener': opener} if opener else {}
    result = redes.wait_for_callback(PORT, CALLBACK, url, timeout=timeout, **kwargs)
    if result.get('error'):
        raise ClipError('TikTok no concedió la autorización: ' + str(result.get('error'))[:80] + '.')
    if not redes.same_state(state, result.get('state')) or not result.get('code'):
        raise ClipError('La respuesta de autorización no coincide con la solicitud; no se guarda nada. Parámetros recibidos: ' + ', '.join(sorted(result)) + '.')
    granted = set((result.get('scopes') or '').split(','))
    if 'video.upload' not in granted:
        raise ClipError('Falta el permiso video.upload en la autorización. Acéptalo en la pantalla de TikTok.')
    response = session.post(API + '/v2/oauth/token/', data={'client_key': cred['client_key'], 'client_secret': cred['client_secret'], 'code': result['code'],
                            'grant_type': 'authorization_code', 'redirect_uri': REDIRECT, 'code_verifier': verifier},
                            headers={'Content-Type': 'application/x-www-form-urlencoded'}, timeout=30)
    payload = response.json() if response.status_code == 200 else {}
    if _api_failed(response, payload):
        raise redes.api_error(response, 'TikTok no entregó el token')
    token = _token_from(payload)
    token['conectado'] = now()
    token['cuenta'] = _display_name(session, token['access_token'])
    redes.write_json(redes.token_path('tiktok'), token)
    return {'conectado': True, 'cuenta': token['cuenta'], 'permisos': token['scope'], 'credenciales': 'guardadas en ruta privada'}


def _display_name(session, access_token):
    try:
        response = session.get(API + '/v2/user/info/', params={'fields': 'display_name'}, headers={'Authorization': 'Bearer ' + access_token}, timeout=30)
        return (response.json().get('data') or {}).get('user', {}).get('display_name') if response.status_code == 200 else None
    except Exception:
        return None


def access_token(session):
    """Token vigente; lo renueva con el refresh token si caduca en menos de cinco minutos."""
    token = redes.load_token('tiktok')
    if redes.seconds_left(token, 'access_expira') > 300:
        return token
    if token.get('refresh_expira') and redes.seconds_left(token, 'refresh_expira') <= 0:
        raise ClipError('La conexión con TikTok caducó. Vuelve a conectar con tiktok-conectar.')
    cred = redes.credentials('tiktok')
    response = session.post(API + '/v2/oauth/token/', data={'client_key': cred['client_key'], 'client_secret': cred['client_secret'],
                            'grant_type': 'refresh_token', 'refresh_token': token['refresh_token']},
                            headers={'Content-Type': 'application/x-www-form-urlencoded'}, timeout=30)
    payload = response.json() if response.status_code == 200 else {}
    if _api_failed(response, payload):
        raise redes.api_error(response, 'No se pudo renovar la conexión con TikTok; vuelve a conectar')
    token = _token_from(payload, token)
    redes.write_json(redes.token_path('tiktok'), token)
    return token


def _headers(token):
    return {'Authorization': 'Bearer ' + token['access_token'], 'Content-Type': 'application/json; charset=UTF-8'}


def _error_code(body):
    return str((body.get('error') or {}).get('code') or 'ok')


def fetch_status(session, token, publish_id):
    response = session.post(API + '/v2/post/publish/status/fetch/', json={'publish_id': publish_id}, headers=_headers(token), timeout=30)
    body = response.json() if response.status_code == 200 else {}
    if response.status_code != 200 or _error_code(body) != 'ok':
        raise redes.api_error(response, 'TikTok no devolvió el estado del envío')
    data = body.get('data') or {}
    return {'tiktok': data.get('status'), 'motivo': data.get('fail_reason')}


def send_inbox(video, state, save, session, pause=time.sleep, polls=12):
    """Crea el envío una sola vez (`state` conserva el publish_id), sube los bytes y espera a que llegue a la bandeja."""
    token = access_token(session)
    if state.get('estado') == 'creando':
        raise ClipError('Una creación anterior quedó incierta. Revisa la bandeja de TikTok antes de reintentar; no se repite sola.')
    if state.get('publish_id'):
        return {**state, **fetch_status(session, token, state['publish_id'])}
    size = video['bytes']
    chunk, total = chunk_plan(size)
    state = {'sha256': video['sha256'], 'estado': 'creando', 'creado': now()}
    save(state)
    incierto = False
    try:
        response = session.post(API + '/v2/post/publish/inbox/video/init/', headers=_headers(token), timeout=60,
                                json={'source_info': {'source': 'FILE_UPLOAD', 'video_size': size, 'chunk_size': chunk, 'total_chunk_count': total}})
        body = response.json() if response.status_code == 200 else {}
        if response.status_code >= 500:  # TikTok pudo crear el envío aunque responda con error: queda incierto, no fallido.
            incierto = True
            raise redes.api_error(response, 'TikTok no confirmó el envío (puede haberse creado; revisa tu bandeja)')
        if response.status_code != 200 or _error_code(body) != 'ok':
            raise redes.api_error(response, 'TikTok no aceptó el envío')
        data = body.get('data') or {}
        if not data.get('publish_id') or not data.get('upload_url'):
            raise ClipError('TikTok aceptó el envío pero no devolvió dónde subir el vídeo.')
    except ClipError:
        if not incierto:
            state['estado'] = 'fallido'
            save(state)
        raise
    except Exception as error:
        raise ClipError('No se confirmó la creación del envío en TikTok. No se repite sola: revisa tu bandeja.') from error
    state.update({'publish_id': data['publish_id'], 'estado': 'subiendo'})
    save(state)
    with video['ruta'].open('rb') as stream:
        for index in range(total):
            start = index * chunk
            length = chunk if index < total - 1 else size - start
            stream.seek(start)
            part = session.put(data['upload_url'], data=stream.read(length), timeout=300,
                               headers={'Content-Type': 'video/mp4', 'Content-Length': str(length), 'Content-Range': f'bytes {start}-{start + length - 1}/{size}'})
            if part.status_code not in (200, 201, 206):
                state['estado'] = 'subida_pausada'
                save(state)
                raise redes.api_error(part, f'TikTok no recibió la parte {index + 1} de {total}')
    state['estado'] = 'enviado'
    save(state)
    last = {}
    for _ in range(polls):
        last = fetch_status(session, token, state['publish_id'])
        if last['tiktok'] in ('SEND_TO_USER_INBOX', 'PUBLISH_COMPLETE', 'FAILED'):
            break
        pause(5)
    state.update(last)
    save(state)
    return state


def inbox(project, execute=False, only_status=False, session=None):
    video = redes.exported_video(project)
    state = redes.record(project).get('tiktok', {})

    def save(value):
        data = redes.record(project)
        data['tiktok'] = value
        redes.save_record(project, data)

    info = {'destino': 'bandeja de TikTok (borrador): Mario termina el post desde la notificación; no se publica solo',
            'archivo': video['ruta'].name, 'bytes': video['bytes'], 'sha256': video['sha256'], 'titulo_propuesto': video['titulo']}
    if only_status:
        if not state.get('publish_id'):
            raise ClipError('Este proyecto todavía no se ha enviado a TikTok.')
        session = session or requests.Session()
        return {**info, 'publish_id': state['publish_id'], **fetch_status(session, access_token(session), state['publish_id'])}
    if state.get('publish_id') and state.get('sha256') != video['sha256']:
        raise ClipError('Este proyecto ya se envió a TikTok con otro vídeo. Revisa la bandeja antes de enviar de nuevo.')
    if not execute:
        return {'modo': 'simulacion', **info, 'estado_previo': state.get('estado'),
                'aviso': 'No se ha enviado nada. Con --ejecutar el vídeo llega a tu bandeja de TikTok.'}
    session = session or requests.Session()
    result = send_inbox(video, state, save, session)
    return {**info, 'publish_id': result.get('publish_id'), 'estado': result.get('estado'), 'tiktok': result.get('tiktok'), 'motivo': result.get('motivo'),
            'siguiente': 'Abre TikTok, toca la notificación de la bandeja y termina el post tú.'}
