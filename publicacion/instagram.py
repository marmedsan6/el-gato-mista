"""Instagram (Reels) por Facebook Login for Business: sube el vídeo local por la subida reanudable de Meta, sin alojamiento externo.
Preparar deja el contenedor listo y NO publica; media_publish comprueba que la huella sigue siendo la del vídeo, el texto y la cuenta preparados."""
from __future__ import annotations

import time
import urllib.parse
from datetime import datetime, timezone

import requests

from . import redes
from .core import ClipError, digest_json, now

PORT = 8765
CALLBACK = '/meta/callback'
REDIRECT = f'http://localhost:{PORT}{CALLBACK}'
DEFAULT_VERSION = 'v26.0'
CAPTION_LIMIT = 2200
CONTAINER_LIFETIME = 24 * 3600
MAX_VIDEO_BYTES = 512 * 1024 * 1024


def _version(cred):
    return str(cred.get('api_version') or DEFAULT_VERSION)


def _api_version():
    """Versión de la API sin exigir las credenciales completas (para simular y publicar)."""
    path = redes.root('meta') / 'credenciales.json'
    return _version(redes.read_json(path)) if path.is_file() else DEFAULT_VERSION


def graph(version):
    return f'https://graph.facebook.com/{version}'


def dialog_url(cred, state):
    query = {'client_id': cred['app_id'], 'redirect_uri': REDIRECT, 'state': state, 'config_id': cred['config_id'],
             'response_type': 'code', 'override_default_response_type': 'true'}
    return f'https://www.facebook.com/{_version(cred)}/dialog/oauth?' + urllib.parse.urlencode(query)


def _json(response, what):
    try:
        body = response.json()
    except Exception:
        body = {}
    if response.status_code != 200 or (isinstance(body, dict) and body.get('error')):
        raise redes.api_error(response, what)
    return body


def _exchange(session, version, params, what):
    """Llamada a /oauth/access_token: lleva el client_secret en la query, así que un error de red no puede mostrar la URL."""
    try:
        return _json(session.get(graph(version) + '/oauth/access_token', timeout=30, params=params), what)
    except ClipError:
        raise
    except Exception as error:
        raise ClipError(f'No se pudo obtener el token de Meta (error de conexión: {type(error).__name__}); no se muestran credenciales.') from None


def connect(username=None, session=None, opener=None, timeout=300, page_id=None):
    cred = redes.credentials('meta')
    version = _version(cred)
    if page_id is not None and not str(page_id).isdigit():
        raise ClipError('El ID de la página son solo dígitos.')
    session = session or requests.Session()
    state = redes.new_state()
    kwargs = {'opener': opener} if opener else {}
    result = redes.wait_for_callback(PORT, CALLBACK, dialog_url(cred, state), timeout=timeout, host='127.0.0.1', **kwargs)
    if result.get('error'):
        raise ClipError('Meta no concedió la autorización: ' + str(result.get('error_reason') or result.get('error'))[:80] + '.')
    if not redes.same_state(state, result.get('state')) or not result.get('code'):
        raise ClipError('La respuesta de autorización no coincide con la solicitud; no se guarda nada.')
    short = _exchange(session, version, {
        'client_id': cred['app_id'], 'client_secret': cred['app_secret'], 'redirect_uri': REDIRECT, 'code': result['code']}, 'Meta no entregó el token')
    long = _exchange(session, version, {
        'grant_type': 'fb_exchange_token', 'client_id': cred['app_id'], 'client_secret': cred['app_secret'],
        'fb_exchange_token': short['access_token']}, 'Meta no amplió la duración del token')
    token = {'user_token': long['access_token'], 'user_expira': redes.expires_in(long['expires_in']) if long.get('expires_in') else None,
             'conectado': now(), 'estado': 'sin_cuenta'}
    redes.write_json(redes.token_path('meta'), token)  # El token de usuario se guarda ya: elegir la cuenta no exige otra autorización.
    return resolve(username, page_id, session)


def _user_token():
    token = redes.load_token('meta')
    if not token.get('user_token'):
        raise ClipError('Falta la autorización de Meta. Ejecuta instagram-conectar.')
    if token.get('user_expira') and redes.seconds_left(token, 'user_expira') <= 0:
        raise ClipError('La conexión con Meta caducó. Vuelve a conectar con instagram-conectar.')
    return token


def resolve(username=None, page_id=None, session=None):
    """Elige la página y la cuenta de Instagram con el token de usuario ya guardado; no abre el navegador."""
    cred = redes.credentials('meta')
    version = _version(cred)
    if page_id is not None and not str(page_id).isdigit():
        raise ClipError('El ID de la página son solo dígitos.')
    session = session or requests.Session()
    token = _user_token()
    user_token = token['user_token']
    fields = 'id,name,access_token,instagram_business_account{id,username}'
    if page_id:
        # Las páginas de un porfolio empresarial a veces no salen en /me/accounts; el ID de la página es público.
        direct = session.get(f'{graph(version)}/{page_id}', timeout=30, headers={'Authorization': 'Bearer ' + user_token}, params={'fields': fields})
        pages = {'data': [_json(direct, 'Meta no dejó leer esa página con tu cuenta (¿es administradora? Prueba instagram-diagnostico)')]}
    else:
        pages = _json(session.get(graph(version) + '/me/accounts', timeout=30, headers={'Authorization': 'Bearer ' + user_token},
                                  params={'fields': fields, 'limit': 100}), 'No se pudieron leer tus páginas')
    candidates = [page for page in pages.get('data', []) if page.get('instagram_business_account')]
    if not candidates:
        seen = [page.get('name', '?') for page in pages.get('data', [])]
        raise ClipError('Meta no devolvió ninguna cuenta de Instagram profesional enlazada a tus páginas. ' +
                        ('Páginas visibles: ' + ', '.join(seen) + '; ninguna tiene Instagram profesional enlazado. '
                         if seen else 'No se ve ninguna página. ') + 'El token de usuario queda guardado: ejecuta instagram-diagnostico para ver qué concedió Meta.')
    if username:
        candidates = [page for page in candidates if page['instagram_business_account'].get('username', '').lower() == username.lstrip('@').lower()]
        if not candidates:
            raise ClipError('Ninguna de tus cuentas de Instagram enlazadas tiene ese usuario.')
    if len(candidates) > 1:
        names = ', '.join('@' + page['instagram_business_account'].get('username', '?') for page in candidates)
        raise ClipError('Hay varias cuentas posibles (' + names + '). Ejecuta instagram-cuenta indicando --usuario.')
    page = candidates[0]
    account = page['instagram_business_account']
    token.update({'page_token': page['access_token'], 'page_id': page['id'], 'pagina': page.get('name'), 'ig_user_id': account['id'],
                  'cuenta': '@' + account.get('username', ''), 'estado': 'conectada', 'cuenta_elegida': now()})
    redes.write_json(redes.token_path('meta'), token)
    return {'conectado': True, 'cuenta': token['cuenta'], 'pagina': token['pagina'], 'credenciales': 'guardadas en ruta privada'}


def diagnose(page_id=None, session=None):
    """Qué concedió realmente Meta: usuario, permisos, páginas visibles y alcance por activo. Sin mostrar tokens ni secretos."""
    cred = redes.credentials('meta')
    version = _version(cred)
    session = session or requests.Session()
    user_token = _user_token()['user_token']
    headers = {'Authorization': 'Bearer ' + user_token}
    report = {}

    def attempt(key, call):
        try:
            report[key] = call()
        except ClipError as error:
            report[key] = 'error: ' + str(error)
        except Exception as error:
            report[key] = 'error de conexión (' + type(error).__name__ + ')'

    attempt('usuario', lambda: {k: v for k, v in _json(session.get(graph(version) + '/me', headers=headers, params={'fields': 'id,name'}, timeout=30), 'No se pudo leer el usuario').items()})
    attempt('permisos', lambda: {item['permission']: item['status'] for item in _json(session.get(graph(version) + '/me/permissions', headers=headers, timeout=30), 'No se pudieron leer los permisos').get('data', [])})

    def token_info():
        data = _json(session.get(graph(version) + '/debug_token', timeout=30, params={'input_token': user_token, 'access_token': cred['app_id'] + '|' + cred['app_secret']}),
                     'No se pudo inspeccionar el token').get('data', {})
        return {'tipo': data.get('type'), 'app_id_coincide': str(data.get('app_id')) == str(cred['app_id']), 'valido': data.get('is_valid'),
                'permisos_por_activo': [{'permiso': g.get('scope'), 'activos': g.get('target_ids', 'todos')} for g in data.get('granular_scopes', [])]}
    attempt('token', token_info)
    attempt('paginas_me_accounts', lambda: [{'id': p.get('id'), 'nombre': p.get('name'), 'instagram': (p.get('instagram_business_account') or {}).get('username')} for p in _json(
        session.get(graph(version) + '/me/accounts', headers=headers, timeout=30, params={'fields': 'id,name,instagram_business_account{id,username}', 'limit': 100}),
        'No se pudieron leer tus páginas').get('data', [])])
    if page_id:
        if not str(page_id).isdigit():
            raise ClipError('El ID de la página son solo dígitos.')
        attempt('pagina_directa', lambda: _json(session.get(f'{graph(version)}/{page_id}', headers=headers, timeout=30, params={'fields': 'id,name,instagram_business_account{id,username}'}),
                                                'Meta no dejó leer la página'))

    def businesses():
        found = _json(session.get(graph(version) + '/me/businesses', headers=headers, timeout=30, params={'fields': 'id,name', 'limit': 25}), 'No se pudieron leer los porfolios').get('data', [])
        out = []
        for business in found:
            entry = {'id': business.get('id'), 'nombre': business.get('name')}
            for edge in ('owned_pages', 'client_pages'):
                try:
                    pages = _json(session.get(f"{graph(version)}/{business['id']}/{edge}", headers=headers, timeout=30,
                                              params={'fields': 'id,name,instagram_business_account{id,username}', 'limit': 25}), 'sin acceso').get('data', [])
                    entry[edge] = [{'id': p.get('id'), 'nombre': p.get('name'), 'instagram': (p.get('instagram_business_account') or {}).get('username')} for p in pages]
                except ClipError as error:
                    entry[edge] = 'error: ' + str(error)[:160]
            out.append(entry)
        return out
    attempt('porfolios', businesses)
    return report


def load_token():
    """Token listo para publicar: exige que ya se haya elegido la cuenta (instagram-conectar o instagram-cuenta)."""
    token = _user_token()
    if not token.get('page_token') or not token.get('ig_user_id'):
        raise ClipError('Meta está autorizado pero falta elegir la cuenta de Instagram. Ejecuta instagram-cuenta (o instagram-diagnostico si falla).')
    return token


def caption_of(video):
    caption = (video['titulo'].strip() + '\n\n' + video['descripcion'].strip()).strip()
    if len(caption) > CAPTION_LIMIT:
        raise ClipError(f'El texto supera los {CAPTION_LIMIT} caracteres de Instagram; acórtalo antes de preparar.')
    if caption.count('#') > 30:
        raise ClipError('Instagram admite como mucho 30 hashtags.')
    return caption


def fingerprint(ig_user_id, video, caption):
    return digest_json({'motor_instagram': 1, 'ig_user_id': ig_user_id, 'sha256': video['sha256'], 'caption': caption,
                        'media_type': 'REELS', 'ai': video['sintetico']})


def _headers(token):
    return {'Authorization': 'Bearer ' + token['page_token']}


def container_status(session, version, token, container_id):
    response = session.get(f'{graph(version)}/{container_id}', params={'fields': 'status_code,status'}, headers=_headers(token), timeout=30)
    body = _json(response, 'Instagram no devolvió el estado del vídeo')
    return {'status_code': body.get('status_code'), 'detalle': body.get('status')}


def prepare(project, execute=False, session=None, pause=time.sleep, polls=12):
    cred_version = _api_version()
    video = redes.exported_video(project)
    caption = caption_of(video)
    token_file = redes.token_path('meta')
    token = None
    if token_file.is_file():
        try:
            token = load_token()
        except ClipError:
            if execute:
                raise
    huella = fingerprint(token['ig_user_id'], video, caption) if token else None
    data = redes.record(project)
    state = data.get('instagram', {})
    info = {'destino': 'Instagram Reels (contenedor en Meta, sin publicar)', 'cuenta': token['cuenta'] if token else None, 'archivo': video['ruta'].name,
            'bytes': video['bytes'], 'sha256': video['sha256'], 'texto': caption, 'huella': huella}
    if not execute:
        return {'modo': 'simulacion', **info, 'estado_previo': state.get('estado'),
                'aviso': 'No se ha enviado nada. Con --ejecutar se sube el vídeo a Meta y queda listo, SIN publicar.' if token else 'Conecta Instagram primero (instagram-conectar).'}
    if not token:
        raise ClipError('Conecta Instagram primero con instagram-conectar.')
    if video['bytes'] > MAX_VIDEO_BYTES:  # Antes de crear nada en Meta.
        raise ClipError('El vídeo pesa más de 512 MB; no se envía de una vez a Instagram.')
    session = session or requests.Session()

    def save(value):
        full = redes.record(project)
        full['instagram'] = value
        redes.save_record(project, full)

    if state.get('estado') == 'publicado' and state.get('huella') == huella:
        return {**info, 'estado': 'publicado', 'permalink': state.get('permalink'), 'publicado': True}
    if state.get('estado') in ('creando', 'publicando'):
        raise ClipError('Un intento anterior quedó incierto. Revisa Instagram antes de repetir; no se repite solo.')
    age = (datetime.now(timezone.utc) - datetime.fromisoformat(state['creado'])).total_seconds() if state.get('creado') else None
    reutilizable = bool(state.get('container_id')) and state.get('huella') == huella and age is not None and age < CONTAINER_LIFETIME
    status = None
    if reutilizable and state.get('estado') == 'subida_fallida':
        # Meta puede guardar el vídeo y aun así responder con error a la subida: si el contenedor ya está listo, se usa.
        previo = container_status(session, cred_version, token, state['container_id'])
        if previo['status_code'] == 'FINISHED':
            status = previo
    if status is None and reutilizable and state.get('estado') in ('subido', 'listo'):
        status = container_status(session, cred_version, token, state['container_id'])
    elif status is None:
        if reutilizable and state.get('estado') == 'subiendo':
            container = state['container_id']  # Un intento anterior ya creó este contenedor: se sube a él, sin otro POST /media.
        else:
            state = {'estado': 'creando', 'huella': huella, 'sha256': video['sha256'], 'creado': now()}
            save(state)
            try:
                response = session.post(f"{graph(cred_version)}/{token['ig_user_id']}/media", headers=_headers(token), timeout=60, data={
                    'media_type': 'REELS', 'upload_type': 'resumable', 'caption': caption, **({'is_ai_generated': 'true'} if video['sintetico'] else {})})
                container = _json(response, 'Instagram no aceptó el vídeo')['id']
            except ClipError:
                state['estado'] = 'fallido'
                save(state)
                raise
            except Exception as error:
                raise ClipError('No se confirmó la creación en Instagram. No se repite sola: revisa tu cuenta.') from error
            state.update({'container_id': container, 'estado': 'subiendo'})
            save(state)
        # Meta rechaza el cuerpo como flujo de fichero (400 «Request processing failed»); con los bytes completos lo acepta.
        data = video['ruta'].read_bytes()
        ok, response = False, None
        pause(3)  # El contenedor tarda unos segundos en admitir el archivo; subir otra vez al mismo contenedor no duplica nada.
        for attempt in range(5):
            response = session.post(f'https://rupload.facebook.com/ig-api-upload/{cred_version}/{container}', timeout=600, data=data,
                                    headers={'Authorization': 'OAuth ' + token['page_token'], 'offset': '0', 'file_size': str(video['bytes'])})
            try:
                ok = response.status_code == 200 and response.json().get('success') is True
            except Exception:
                ok = False
            if ok or response.status_code not in (400, 500, 502, 503, 504) or attempt == 4:
                break
            pause(3 * (attempt + 1))
        if not ok:
            # Un 5xx puede llegar con el vídeo ya guardado; los reintentos sobre ese contenedor responden entonces 400.
            try:
                ok = container_status(session, cred_version, token, container)['status_code'] == 'FINISHED'
            except Exception:
                ok = False
        if not ok:
            state['estado'] = 'subida_fallida'
            save(state)
            raise redes.api_error(response, 'Instagram no recibió el vídeo')
        state['estado'] = 'subido'
        save(state)
        status = {'status_code': None}
    for _ in range(polls):
        status = container_status(session, cred_version, token, state['container_id'])
        if status['status_code'] in ('FINISHED', 'ERROR', 'EXPIRED'):
            break
        pause(5)
    if status['status_code'] == 'FINISHED':
        state['estado'] = 'listo'
    elif status['status_code'] in ('ERROR', 'EXPIRED'):
        state['estado'] = 'fallido'
    state.update({'status_code': status['status_code'], 'detalle': status.get('detalle')})
    save(state)
    return {**info, 'estado': state['estado'], 'status_code': status['status_code'], 'publicado': False,
            'siguiente': 'Listo para publicar con la orden de Mario.' if state['estado'] == 'listo' else 'Aún no está listo; repite el comando en un minuto.'}


def publish(project, confirmation, session=None):
    video = redes.exported_video(project)
    caption = caption_of(video)
    token = load_token()
    version = _api_version()
    expected = fingerprint(token['ig_user_id'], video, caption)
    state = redes.record(project).get('instagram', {})
    if not confirmation or confirmation != expected:
        raise ClipError('La huella no coincide con lo que se publicaría (vídeo, texto o cuenta). No se publica.')
    if state.get('huella') != expected or not state.get('container_id'):
        raise ClipError('No hay un contenedor preparado para esta huella. Repite la orden de subir.')
    if state.get('estado') == 'publicado':
        return {'estado': 'publicado', 'ya_publicado': True, 'permalink': state.get('permalink')}
    if state.get('estado') == 'publicando':
        raise ClipError('Un intento de publicar quedó incierto. Comprueba Instagram antes de repetir; no se repite solo.')
    if state.get('estado') != 'listo':
        raise ClipError('El contenedor no está listo (estado: ' + str(state.get('estado')) + ').')
    if (datetime.now(timezone.utc) - datetime.fromisoformat(state['creado'])).total_seconds() >= CONTAINER_LIFETIME:
        raise ClipError('El contenedor caducó (24 h). Repite la orden de subir.')
    session = session or requests.Session()
    if container_status(session, version, token, state['container_id'])['status_code'] != 'FINISHED':
        raise ClipError('Meta aún no marca el vídeo como FINISHED; espera y reintenta.')

    def save(value):
        full = redes.record(project)
        full['instagram'] = value
        redes.save_record(project, full)

    state = {**state, 'estado': 'publicando', 'publicando': now()}
    save(state)
    response = None
    try:
        response = session.post(f"{graph(version)}/{token['ig_user_id']}/media_publish", headers=_headers(token), timeout=120, data={'creation_id': state['container_id']})
        media_id = _json(response, 'Instagram no publicó el vídeo')['id']
    except ClipError:
        if response is not None and response.status_code < 500:  # Rechazo definitivo; un 5xx puede haber publicado igualmente.
            state['estado'] = 'listo'
            save(state)
        raise
    except Exception as error:
        raise ClipError('No se confirmó la publicación en Instagram. No se repite sola: comprueba tu cuenta.') from error
    permalink = None
    try:
        permalink = session.get(f'{graph(version)}/{media_id}', params={'fields': 'permalink'}, headers=_headers(token), timeout=30).json().get('permalink')
    except Exception:
        pass
    state.update({'estado': 'publicado', 'media_id': media_id, 'permalink': permalink, 'publicado': now(), 'autorizacion': {'huella': confirmation, 'confirmado': now()}})
    save(state)
    return {'estado': 'publicado', 'media_id': media_id, 'permalink': permalink}
