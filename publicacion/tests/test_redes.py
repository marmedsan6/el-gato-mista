import hashlib
import socket
import threading
import time
import urllib.parse
import urllib.request
from pathlib import Path

import pytest

from publicacion import cli, core, instagram, redes, tiktok
from publicacion.core import ClipError, read_json, write_json


class Response:
    def __init__(self, status=200, payload=None, headers=None):
        self.status_code = status
        self.payload = payload if payload is not None else {}
        self.headers = headers or {}

    def json(self):
        return self.payload


class Fake:
    """Sesión simulada: cada ruta tiene una cola de respuestas y se registran todas las llamadas."""
    def __init__(self, routes):
        self.routes = {key: list(value) for key, value in routes.items()}
        self.calls = []

    def _answer(self, method, url, kwargs):
        self.calls.append((method, url, kwargs))
        for key, queue in self.routes.items():
            if key in url:
                item = queue.pop(0) if len(queue) > 1 else queue[0]
                if isinstance(item, Exception):
                    raise item
                return item
        raise AssertionError('Llamada inesperada: ' + method + ' ' + url)

    def get(self, url, **kwargs):
        return self._answer('GET', url, kwargs)

    def post(self, url, **kwargs):
        return self._answer('POST', url, kwargs)

    def put(self, url, **kwargs):
        return self._answer('PUT', url, kwargs)

    def count(self, method, part):
        return sum(1 for m, u, _ in self.calls if m == method and part in u)


def free_port():
    with socket.socket() as probe:
        probe.bind(('127.0.0.1', 0))
        return probe.getsockname()[1]


@pytest.fixture
def privado(tmp_path, monkeypatch):
    monkeypatch.setenv('ELGATOMISTA_CREDENCIALES', str(tmp_path / 'privado' / 'youtube'))
    return tmp_path / 'privado'


def rellenar(privado):
    write_json(privado / 'tiktok' / 'credenciales.json', {'client_key': 'ck-secreta', 'client_secret': 'cs-secreta'})
    write_json(privado / 'meta' / 'credenciales.json', {'app_id': '111', 'app_secret': 'as-secreta', 'config_id': '222', 'api_version': 'v26.0'})


def callback_opener(port, path, **extra):
    """Simula al navegador: lee el state de la URL de autorización y llama al receptor local."""
    def opener(url):
        state = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)['state'][0]
        query = {'code': 'codigo-de-prueba', 'state': extra.get('state', state), **{k: v for k, v in extra.items() if k != 'state'}}
        target = f'http://127.0.0.1:{port}{path}?' + urllib.parse.urlencode(query)
        threading.Thread(target=lambda: urllib.request.urlopen(target, timeout=10).read(), daemon=True).start()
    return opener


def video_de_prueba(tmp_path, tamano=4096):
    path = tmp_path / 'es.mp4'
    path.write_bytes(b'v' * tamano)
    return {'ruta': path, 'bytes': tamano, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'titulo': 'Un título', 'descripcion': 'Fuente: https://x.com/a/status/1',
            'sintetico': False, 'huella_lote': 'lote'}


# --- credenciales y receptor -------------------------------------------------

def test_credenciales_faltantes_o_de_plantilla_no_revelan_valores(privado):
    with pytest.raises(ClipError, match='redes-plantillas'):
        redes.credentials('tiktok')
    redes.templates()
    with pytest.raises(ClipError) as error:
        redes.credentials('tiktok')
    assert 'client_key' in str(error.value) and 'client_secret' in str(error.value)
    rellenar(privado)
    assert redes.credentials('tiktok')['client_key'] == 'ck-secreta'


def test_la_plantilla_no_pisa_lo_que_ya_rellenó_mario(privado):
    rellenar(privado)
    result = redes.templates()
    assert result['tiktok']['plantilla'] == 'ya existía'
    assert read_json(privado / 'tiktok' / 'credenciales.json')['client_key'] == 'ck-secreta'


def test_las_credenciales_no_pueden_vivir_en_onedrive(monkeypatch, tmp_path):
    monkeypatch.setenv('ELGATOMISTA_CREDENCIALES', str(tmp_path / 'OneDrive' / 'x' / 'youtube'))
    with pytest.raises(ClipError, match='fuera de OneDrive'):
        redes.root('tiktok')


def test_estado_no_muestra_secretos(privado):
    rellenar(privado)
    write_json(privado / 'tiktok' / 'token.json', {'access_token': 'at-secreto', 'cuenta': 'mario'})
    text = str(redes.status())
    assert 'ck-secreta' not in text and 'cs-secreta' not in text and 'at-secreto' not in text
    assert redes.status()['tiktok']['conexion'] == 'conectada'


def test_pkce_usa_sha256_en_hexadecimal():
    verifier, challenge = redes.pkce()
    assert 43 <= len(verifier) <= 128
    assert challenge == hashlib.sha256(verifier.encode()).hexdigest()


def test_el_receptor_devuelve_los_parametros_y_responde_404_a_otras_rutas():
    port = free_port()
    result = redes.wait_for_callback(port, '/ok/', 'http://x/?state=s', timeout=10, opener=callback_opener(port, '/ok/'))
    assert result['code'] == 'codigo-de-prueba'


def test_el_receptor_ignora_otras_rutas():
    port = free_port()

    def opener(url):
        def visit():
            for path in ('/otra/', '/ok/?code=c&state=s'):
                try:
                    urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=10).read()
                except urllib.error.HTTPError as error:
                    assert error.code == 404
        threading.Thread(target=visit, daemon=True).start()
    assert redes.wait_for_callback(port, '/ok/', 'http://x', timeout=10, opener=opener)['code'] == 'c'


def test_una_peticion_sin_parametros_no_cierra_la_espera():
    port = free_port()

    def opener(url):
        def visit():
            for path in ('/ok/', '/ok/?code=c&state=s'):
                try:
                    urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=10).read()
                except urllib.error.HTTPError:
                    pass
        threading.Thread(target=visit, daemon=True).start()
    assert redes.wait_for_callback(port, '/ok/', 'http://x', timeout=10, opener=opener)['code'] == 'c'


def test_el_receptor_caduca_sin_respuesta():
    with pytest.raises(ClipError, match='a tiempo'):
        redes.wait_for_callback(free_port(), '/ok/', 'http://x', timeout=0.2, opener=lambda url: None)


# --- TikTok -------------------------------------------------------------------

def test_reparto_en_partes_de_tiktok():
    assert tiktok.chunk_plan(4_300_000) == (4_300_000, 1)
    assert tiktok.chunk_plan(64 * tiktok.MB) == (64 * tiktok.MB, 1)
    chunk, total = tiktok.chunk_plan(100 * tiktok.MB)
    assert chunk == 32 * tiktok.MB and total == 3 and 100 * tiktok.MB - (total - 1) * chunk <= 128 * tiktok.MB


def test_la_url_de_tiktok_pide_solo_user_info_y_video_upload_con_pkce():
    url = tiktok.authorize_url('ck', 'estado', 'reto')
    query = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)
    assert query['scope'] == ['user.info.basic,video.upload'] and query['code_challenge_method'] == ['S256']
    assert 'video.publish' not in url


def conectar_tiktok(privado, monkeypatch, **extra):
    rellenar(privado)
    port = free_port()
    monkeypatch.setattr(tiktok, 'PORT', port)
    session = Fake({'/v2/oauth/token/': [Response(payload={'access_token': 'at-secreto', 'refresh_token': 'rt-secreto', 'open_id': 'o', 'scope': 'user.info.basic,video.upload',
                                                              'expires_in': 86400, 'refresh_expires_in': 31536000})],
                    '/v2/user/info/': [Response(payload={'data': {'user': {'display_name': 'Pod 02'}}})]})
    opener = callback_opener(port, tiktok.CALLBACK, scopes=extra.pop('scopes', 'user.info.basic,video.upload'), **extra)
    return session, opener


def test_conectar_tiktok_guarda_el_token_sin_devolverlo(privado, monkeypatch):
    session, opener = conectar_tiktok(privado, monkeypatch)
    result = tiktok.connect(session=session, opener=opener, timeout=10)
    assert result['conectado'] and result['cuenta'] == 'Pod 02'
    assert 'at-secreto' not in str(result) and 'cs-secreta' not in str(result)
    token = read_json(privado / 'tiktok' / 'token.json')
    assert token['access_token'] == 'at-secreto' and token['refresh_token'] == 'rt-secreto'
    sent = session.calls[0][2]['data']
    assert sent['grant_type'] == 'authorization_code' and sent['code_verifier'] and sent['redirect_uri'].startswith('http://127.0.0.1:')


def test_tiktok_rechaza_un_state_distinto_y_no_guarda_nada(privado, monkeypatch):
    session, opener = conectar_tiktok(privado, monkeypatch, state='otro')
    with pytest.raises(ClipError, match='no coincide'):
        tiktok.connect(session=session, opener=opener, timeout=10)
    assert not (privado / 'tiktok' / 'token.json').exists() and not session.calls


def test_tiktok_exige_el_permiso_video_upload(privado, monkeypatch):
    session, opener = conectar_tiktok(privado, monkeypatch, scopes='user.info.basic')
    with pytest.raises(ClipError, match='video.upload'):
        tiktok.connect(session=session, opener=opener, timeout=10)
    assert not session.calls


def test_el_token_de_tiktok_se_renueva_cuando_caduca(privado):
    rellenar(privado)
    write_json(privado / 'tiktok' / 'token.json', {'access_token': 'viejo', 'refresh_token': 'rt', 'access_expira': time.time() - 10,
                                                   'refresh_expira': time.time() + 10_000})
    session = Fake({'/v2/oauth/token/': [Response(payload={'access_token': 'nuevo', 'refresh_token': 'rt2', 'expires_in': 86400})]})
    assert tiktok.access_token(session)['access_token'] == 'nuevo'
    assert session.calls[0][2]['data']['grant_type'] == 'refresh_token'
    assert read_json(privado / 'tiktok' / 'token.json')['refresh_token'] == 'rt2'


def preparar_envio(privado):
    rellenar(privado)
    write_json(privado / 'tiktok' / 'token.json', {'access_token': 'at', 'refresh_token': 'rt', 'access_expira': time.time() + 9999})


def test_el_envio_a_la_bandeja_se_crea_una_sola_vez(tmp_path, privado):
    preparar_envio(privado)
    video = video_de_prueba(tmp_path)
    saved = []
    session = Fake({'/inbox/video/init/': [Response(payload={'data': {'publish_id': 'v_inbox_file~1', 'upload_url': 'https://open-upload.invalid/x'}, 'error': {'code': 'ok'}})],
                    'open-upload.invalid': [Response(201)],
                    '/status/fetch/': [Response(payload={'data': {'status': 'PROCESSING_UPLOAD'}, 'error': {'code': 'ok'}}),
                                       Response(payload={'data': {'status': 'SEND_TO_USER_INBOX'}, 'error': {'code': 'ok'}})]})
    state = tiktok.send_inbox(video, {}, saved.append, session, pause=lambda _: None)
    assert state['tiktok'] == 'SEND_TO_USER_INBOX' and state['publish_id'] == 'v_inbox_file~1'
    init = session.calls[0][2]['json']['source_info']
    assert init == {'source': 'FILE_UPLOAD', 'video_size': 4096, 'chunk_size': 4096, 'total_chunk_count': 1}
    put = next(c for c in session.calls if c[0] == 'PUT')[2]['headers']
    assert put['Content-Range'] == 'bytes 0-4095/4096'
    again = tiktok.send_inbox(video, state, saved.append, session, pause=lambda _: None)
    assert session.count('POST', '/inbox/video/init/') == 1 and again['publish_id'] == 'v_inbox_file~1'


def test_una_creacion_incierta_no_se_repite(tmp_path, privado):
    preparar_envio(privado)
    session = Fake({})
    with pytest.raises(ClipError, match='incierta'):
        tiktok.send_inbox(video_de_prueba(tmp_path), {'estado': 'creando'}, lambda v: None, session)
    assert not session.calls


def test_si_tiktok_rechaza_el_envio_queda_como_fallido(tmp_path, privado):
    preparar_envio(privado)
    saved = []
    session = Fake({'/inbox/video/init/': [Response(403, {'error': {'code': 'scope_not_authorized', 'message': 'sin permiso'}})]})
    with pytest.raises(ClipError, match='scope_not_authorized'):
        tiktok.send_inbox(video_de_prueba(tmp_path), {}, saved.append, session)
    assert saved[-1]['estado'] == 'fallido'


def test_un_429_al_crear_el_envio_queda_como_fallido(tmp_path, privado):
    preparar_envio(privado)
    saved = []
    session = Fake({'/inbox/video/init/': [Response(429, {'error': {'code': 'rate_limit_exceeded', 'message': 'demasiadas peticiones'}})]})
    with pytest.raises(ClipError, match='rate_limit_exceeded'):
        tiktok.send_inbox(video_de_prueba(tmp_path), {}, saved.append, session)
    assert saved[-1]['estado'] == 'fallido'


def test_un_5xx_al_crear_el_envio_queda_incierto_y_no_se_repite(tmp_path, privado, monkeypatch):
    preparar_envio(privado)
    video = video_de_prueba(tmp_path)
    monkeypatch.setattr(redes, 'exported_video', lambda project: video)
    project = tmp_path / 'proyecto'
    session = Fake({'/inbox/video/init/': [Response(503, {'error': {'code': 'internal_error', 'message': 'temporal'}})]})
    with pytest.raises(ClipError, match='temporal'):
        tiktok.inbox(project, execute=True, session=session)
    assert read_json(project / 'redes.json')['tiktok']['estado'] == 'creando'
    with pytest.raises(ClipError, match='incierta'):
        tiktok.inbox(project, execute=True, session=session)
    assert session.count('POST', '/inbox/video/init/') == 1


def test_tiktok_bandeja_simula_por_defecto(tmp_path, privado, monkeypatch):
    video = video_de_prueba(tmp_path)
    monkeypatch.setattr(redes, 'exported_video', lambda project: video)
    result = tiktok.inbox(tmp_path / 'proyecto')
    assert result['modo'] == 'simulacion' and not (tmp_path / 'proyecto' / 'trabajo' / 'redes.json').exists()


# --- Instagram ------------------------------------------------------------------

def test_la_url_de_meta_usa_la_configuracion_y_el_redirect_registrado():
    url = instagram.dialog_url({'app_id': '111', 'config_id': '222'}, 's')
    query = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)
    assert query['config_id'] == ['222'] and query['redirect_uri'] == ['http://localhost:8765/meta/callback']
    assert query['response_type'] == ['code']


def conectar_meta(privado, monkeypatch, paginas, **extra):
    rellenar(privado)
    port = free_port()
    monkeypatch.setattr(instagram, 'PORT', port)
    session = Fake({'/oauth/access_token': [Response(payload={'access_token': 'corto'}), Response(payload={'access_token': 'largo', 'expires_in': 5_000_000})],
                    '/me/accounts': [Response(payload={'data': paginas})]})
    return session, callback_opener(port, instagram.CALLBACK, **extra)


PAGINA = {'id': 'p1', 'name': 'Pod 02', 'access_token': 'pt-secreto', 'instagram_business_account': {'id': 'ig1', 'username': 'pod02'}}


def test_conectar_instagram_elige_la_cuenta_enlazada(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [{'id': 'p0', 'name': 'Sin Instagram'}, PAGINA])
    result = instagram.connect(session=session, opener=opener, timeout=10)
    assert result['cuenta'] == '@pod02' and 'pt-secreto' not in str(result) and 'as-secreta' not in str(result)
    token = read_json(privado / 'meta' / 'token.json')
    assert token['page_token'] == 'pt-secreto' and token['ig_user_id'] == 'ig1'
    assert session.calls[1][2]['params']['grant_type'] == 'fb_exchange_token'


def test_conectar_instagram_sin_cuenta_profesional_da_un_aviso_claro(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [{'id': 'p0', 'name': 'Sin Instagram'}])
    with pytest.raises(ClipError) as error:
        instagram.connect(session=session, opener=opener, timeout=10)
    assert 'Sin Instagram' in str(error.value) and 'instagram-diagnostico' in str(error.value)
    token = read_json(privado / 'meta' / 'token.json')
    assert token['user_token'] == 'largo' and 'page_token' not in token
    with pytest.raises(ClipError, match='falta elegir la cuenta'):
        instagram.load_token()
    assert redes.status()['meta']['conexion'] == 'autorizada, falta elegir la cuenta'


def test_conectar_instagram_sin_paginas_visibles_lo_dice(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [])
    with pytest.raises(ClipError, match='No se ve ninguna página'):
        instagram.connect(session=session, opener=opener, timeout=10)


def test_elegir_la_cuenta_despues_no_pide_otra_autorizacion(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [])
    with pytest.raises(ClipError):
        instagram.connect(session=session, opener=opener, timeout=10)
    later = Fake({'/me/accounts': [Response(payload={'data': [PAGINA]})]})
    result = instagram.resolve(session=later)
    assert result['cuenta'] == '@pod02' and instagram.load_token()['ig_user_id'] == 'ig1'
    assert read_json(privado / 'meta' / 'token.json')['user_token'] == 'largo'


def test_el_diagnostico_informa_sin_mostrar_secretos(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [])
    with pytest.raises(ClipError):
        instagram.connect(session=session, opener=opener, timeout=10)
    diag = Fake({'/me/permissions': [Response(payload={'data': [{'permission': 'pages_show_list', 'status': 'granted'}]})],
                 '/debug_token': [Response(payload={'data': {'type': 'USER', 'app_id': '111', 'is_valid': True,
                                                              'granular_scopes': [{'scope': 'pages_show_list', 'target_ids': ['p9']}]}})],
                 '/me/accounts': [Response(payload={'data': [{'id': 'p0', 'name': 'Sin Instagram'}]})],
                 '/999': [Response(400, {'error': {'code': 100, 'message': 'no existe'}})],
                 '/me': [Response(payload={'id': 'u1', 'name': 'Mario'})]})
    report = instagram.diagnose('999', diag)
    assert report['permisos'] == {'pages_show_list': 'granted'}
    assert report['token']['permisos_por_activo'] == [{'permiso': 'pages_show_list', 'activos': ['p9']}] and report['token']['app_id_coincide']
    assert report['paginas_me_accounts'][0]['nombre'] == 'Sin Instagram'
    assert report['pagina_directa'].startswith('error') and 'no existe' in report['pagina_directa']
    text = str(report)
    assert 'largo' not in text and 'as-secreta' not in text and 'Bearer' not in text
    debug = next(c for c in diag.calls if '/debug_token' in c[1])[2]['params']['access_token']
    assert debug == '111|as-secreta'  # El token de la app solo viaja a Meta, nunca al informe.


def test_conectar_instagram_con_el_id_de_la_pagina_no_usa_me_accounts(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [])
    session.routes.pop('/me/accounts')
    session.routes['/999'] = [Response(payload=PAGINA)]
    result = instagram.connect(session=session, opener=opener, timeout=10, page_id='999')
    assert result['cuenta'] == '@pod02' and session.count('GET', '/me/accounts') == 0
    with pytest.raises(ClipError, match='solo dígitos'):
        instagram.connect(session=session, opener=opener, timeout=10, page_id='../x')


def test_conectar_instagram_con_dos_cuentas_pide_elegir(privado, monkeypatch):
    otra = {**PAGINA, 'id': 'p2', 'instagram_business_account': {'id': 'ig2', 'username': 'otra'}}
    session, opener = conectar_meta(privado, monkeypatch, [PAGINA, otra])
    with pytest.raises(ClipError, match='--usuario'):
        instagram.connect(session=session, opener=opener, timeout=10)


def test_instagram_rechaza_un_state_distinto(privado, monkeypatch):
    session, opener = conectar_meta(privado, monkeypatch, [PAGINA], state='otro')
    with pytest.raises(ClipError, match='no coincide'):
        instagram.connect(session=session, opener=opener, timeout=10)
    assert not session.calls


def test_un_error_de_red_al_canjear_el_codigo_no_muestra_el_secreto(privado, monkeypatch):
    rellenar(privado)
    port = free_port()
    monkeypatch.setattr(instagram, 'PORT', port)
    session = Fake({'/oauth/access_token': [RuntimeError('fallo en la URL ?client_secret=SECRETO')]})
    with pytest.raises(ClipError) as error:
        instagram.connect(session=session, opener=callback_opener(port, instagram.CALLBACK), timeout=10)
    assert 'RuntimeError' in str(error.value) and 'SECRETO' not in str(error.value)
    assert error.value.__cause__ is None and error.value.__suppress_context__ is True


def preparar_instagram(tmp_path, privado, monkeypatch):
    rellenar(privado)
    write_json(privado / 'meta' / 'token.json', {'user_token': 'ut-secreto', 'page_token': 'pt-secreto', 'ig_user_id': 'ig1', 'cuenta': '@pod02', 'user_expira': time.time() + 99999})
    video = video_de_prueba(tmp_path)
    monkeypatch.setattr(redes, 'exported_video', lambda project: video)
    return tmp_path / 'proyecto', video


def sesion_ig(final='FINISHED'):
    return Fake({'/ig1/media_publish': [Response(payload={'id': 'media9'})],
                 '/ig1/media': [Response(payload={'id': 'cont1'})],
                 'rupload.facebook.com': [Response(payload={'success': True})],
                 '/cont1': [Response(payload={'status_code': final})],
                 '/media9': [Response(payload={'permalink': 'https://www.instagram.com/reel/abc/'})]})


def test_instagram_preparar_simula_y_calcula_la_huella_sin_llamar_a_meta(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    result = instagram.prepare(project)
    assert result['modo'] == 'simulacion' and len(result['huella']) == 64
    assert not (project / 'redes.json').exists()


def test_instagram_preparar_sube_el_reel_pero_no_lo_publica(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    result = instagram.prepare(project, True, session, pause=lambda _: None)
    assert result['estado'] == 'listo' and result['publicado'] is False and result['huella']
    assert session.count('POST', 'media_publish') == 0
    created = next(c for c in session.calls if c[0] == 'POST' and c[1].endswith('/ig1/media'))[2]['data']
    assert created['media_type'] == 'REELS' and created['upload_type'] == 'resumable' and 'is_ai_generated' not in created
    sent = next(c for c in session.calls if 'rupload' in c[1])[2]['headers']
    assert sent['offset'] == '0' and sent['file_size'] == '4096' and sent['Authorization'] == 'OAuth pt-secreto'
    again = instagram.prepare(project, True, session, pause=lambda _: None)
    assert again['estado'] == 'listo' and session.count('POST', '/ig1/media') == 1


def test_si_la_subida_falla_al_principio_se_reintenta_sobre_el_mismo_contenedor(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    session.routes['rupload.facebook.com'] = [Response(400, {'debug_info': {'type': 'ProcessingFailedError', 'message': 'Request processing failed'}}),
                                              Response(payload={'success': True})]
    result = instagram.prepare(project, True, session, pause=lambda _: None)
    assert result['estado'] == 'listo' and session.count('POST', 'rupload') == 2 and session.count('POST', '/ig1/media') == 1


def test_si_la_subida_nunca_se_acepta_queda_como_fallida(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig(final='IN_PROGRESS')
    session.routes['rupload.facebook.com'] = [Response(400, {'debug_info': {'type': 'ProcessingFailedError', 'message': 'Request processing failed'}})]
    with pytest.raises(ClipError, match='ProcessingFailedError'):
        instagram.prepare(project, True, session, pause=lambda _: None)
    assert read_json(project / 'redes.json')['instagram']['estado'] == 'subida_fallida' and session.count('POST', 'rupload') == 5


def test_un_5xx_con_el_video_ya_guardado_no_se_da_por_fallido(tmp_path, privado, monkeypatch):
    # Caso real (2026-10-21): Meta guardó el vídeo, respondió 5xx y los reintentos sobre el contenedor dieron 400.
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    fallo = Response(400, {'debug_info': {'type': 'ProcessingFailedError', 'message': 'Request processing failed'}})
    session.routes['rupload.facebook.com'] = [Response(503, {})] + [fallo] * 4
    result = instagram.prepare(project, True, session, pause=lambda _: None)
    assert result['estado'] == 'listo' and session.count('POST', '/ig1/media') == 1 and session.count('POST', 'media_publish') == 0


def test_un_contenedor_fallido_pero_listo_en_meta_se_reutiliza_sin_subir_otra_vez(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    huella = instagram.fingerprint('ig1', video, instagram.caption_of(video))
    redes.save_record(project, {'instagram': {'estado': 'subida_fallida', 'container_id': 'cont1', 'huella': huella, 'sha256': video['sha256'], 'creado': core.now()}})
    session = sesion_ig()
    result = instagram.prepare(project, True, session, pause=lambda _: None)
    assert result['estado'] == 'listo' and session.count('POST', '/ig1/media') == 0 and session.count('POST', 'rupload') == 0
    assert read_json(project / 'redes.json')['instagram']['container_id'] == 'cont1'


def test_un_contenedor_fallido_y_no_listo_crea_uno_nuevo(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    huella = instagram.fingerprint('ig1', video, instagram.caption_of(video))
    redes.save_record(project, {'instagram': {'estado': 'subida_fallida', 'container_id': 'viejo', 'huella': huella, 'sha256': video['sha256'], 'creado': core.now()}})
    session = sesion_ig()
    session.routes['/viejo'] = [Response(payload={'status_code': 'ERROR'})]
    result = instagram.prepare(project, True, session, pause=lambda _: None)
    assert result['estado'] == 'listo' and session.count('POST', '/ig1/media') == 1
    assert read_json(project / 'redes.json')['instagram']['container_id'] == 'cont1'


def test_publicar_exige_la_huella_exacta(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    huella = instagram.prepare(project, True, session, pause=lambda _: None)['huella']
    for mala in ('', 'x' * 64, huella[:-1] + ('0' if huella[-1] != '0' else '1')):
        with pytest.raises(ClipError, match='huella'):
            instagram.publish(project, mala, session)
    assert session.count('POST', 'media_publish') == 0
    done = instagram.publish(project, huella, session)
    assert done['estado'] == 'publicado' and done['permalink'].endswith('/abc/')
    assert instagram.publish(project, huella, session)['ya_publicado'] and session.count('POST', 'media_publish') == 1


def test_un_cambio_en_el_texto_invalida_la_huella_autorizada(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    huella = instagram.prepare(project, True, session, pause=lambda _: None)['huella']
    video['titulo'] = 'Otro título'
    with pytest.raises(ClipError, match='huella'):
        instagram.publish(project, huella, session)
    assert session.count('POST', 'media_publish') == 0


def test_no_se_publica_si_meta_no_marca_el_video_como_listo(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig(final='IN_PROGRESS')
    result = instagram.prepare(project, True, session, pause=lambda _: None, polls=2)
    assert result['estado'] == 'subido' and 'Aún no está listo' in result['siguiente']
    with pytest.raises(ClipError, match='no está listo'):
        instagram.publish(project, result['huella'], session)


def test_un_error_5xx_al_publicar_queda_incierto_y_no_se_repite(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    huella = instagram.prepare(project, True, session, pause=lambda _: None)['huella']
    session.routes['/ig1/media_publish'] = [Response(503, {'error': {'message': 'temporal'}})]
    with pytest.raises(ClipError, match='temporal'):
        instagram.publish(project, huella, session)
    with pytest.raises(ClipError, match='incierto'):
        instagram.publish(project, huella, session)
    assert session.count('POST', 'media_publish') == 1


def test_un_rechazo_definitivo_al_publicar_permite_reintentar(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    session = sesion_ig()
    huella = instagram.prepare(project, True, session, pause=lambda _: None)['huella']
    session.routes['/ig1/media_publish'] = [Response(400, {'error': {'message': 'parámetro inválido'}}), Response(payload={'id': 'media9'})]
    with pytest.raises(ClipError, match='inválido'):
        instagram.publish(project, huella, session)
    assert instagram.publish(project, huella, session)['estado'] == 'publicado'


def test_el_texto_largo_se_rechaza_antes_de_subir(tmp_path):
    video = video_de_prueba(tmp_path)
    video['descripcion'] = 'x' * 2300
    with pytest.raises(ClipError, match='2200'):
        instagram.caption_of(video)


def test_un_video_de_mas_de_512_mb_se_rechaza_antes_de_crear_el_contenedor(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    video['bytes'] = 512 * 1024 * 1024 + 1
    session = sesion_ig()
    with pytest.raises(ClipError, match='512 MB'):
        instagram.prepare(project, True, session, pause=lambda _: None)
    assert session.calls == []


def test_un_contenedor_subiendo_reciente_se_reutiliza_sin_crear_otro(tmp_path, privado, monkeypatch):
    project, video = preparar_instagram(tmp_path, privado, monkeypatch)
    huella = instagram.fingerprint('ig1', video, instagram.caption_of(video))
    redes.save_record(project, {'instagram': {'estado': 'subiendo', 'container_id': 'cont1', 'huella': huella, 'sha256': video['sha256'], 'creado': core.now()}})
    session = sesion_ig()
    result = instagram.prepare(project, True, session, pause=lambda _: None)
    assert result['estado'] == 'listo' and session.count('POST', '/ig1/media') == 0
    assert any(c[0] == 'POST' and 'rupload' in c[1] and c[1].endswith('/cont1') for c in session.calls)
    assert read_json(project / 'redes.json')['instagram']['container_id'] == 'cont1'


# --- CLI ------------------------------------------------------------------------

def test_el_cli_expone_los_comandos_de_conexion_y_estado():
    comandos = set(cli.parser()._subparsers._group_actions[0].choices)
    assert {'redes-estado', 'tiktok-conectar', 'instagram-conectar', 'instagram-cuenta', 'subir'} <= comandos
