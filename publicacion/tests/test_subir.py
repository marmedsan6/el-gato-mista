"""La orden de subir de Mario: sin huellas que escribir y a todas las redes de una vez."""
import json
import time

import pytest

from conftest import escribir_puerta
from publicacion import aprobado, cli, instagram, subir, tiktok
from publicacion.core import ClipError, read_json, sha_file, write_json

ORDEN = 'Súbelo ya a todas las redes'


@pytest.fixture
def redes_falsas(monkeypatch):
    """Instagram y TikTok de mentira, que apuntan cada llamada."""
    llamadas = []

    def preparar(project, execute=False, polls=12):
        llamadas.append(('preparar', execute))
        return {'estado': 'listo', 'huella': 'huella-instagram', 'publicado': False}

    def publicar(project, confirmation):
        llamadas.append(('publicar', confirmation))
        return {'estado': 'publicado', 'permalink': 'https://instagram.invalid/reel'}

    def bandeja(project, execute=False):
        llamadas.append(('bandeja', execute))
        return {'estado': 'enviado', 'tiktok': 'SEND_TO_USER_INBOX', 'siguiente': 'Termina el post.'}

    monkeypatch.setattr(instagram, 'prepare', preparar)
    monkeypatch.setattr(instagram, 'publish', publicar)
    monkeypatch.setattr(tiktok, 'inbox', bandeja)
    return llamadas


def sin_aprobar(proyecto):
    escribir_puerta(proyecto, sha_file(proyecto / 'salida' / 'short.mp4'), 'pendiente')


def test_la_orden_sube_a_todas_las_redes_sin_pedir_nada_mas(proyecto, sesion, redes_falsas):
    sin_aprobar(proyecto)
    resultado = subir.subir(proyecto, ORDEN)
    assert resultado['youtube'][0]['estado'] == 'publicado' and sesion.subidas == 1
    assert resultado['instagram']['estado'] == 'publicado' and resultado['instagram']['permalink']
    assert resultado['tiktok']['estado'] == 'enviado'
    assert redes_falsas == [('preparar', True), ('publicar', 'huella-instagram'), ('bandeja', True)]


def test_la_orden_queda_anotada_con_la_huella_del_video(proyecto, sesion, redes_falsas):
    sin_aprobar(proyecto)
    sha = sha_file(proyecto / 'salida' / 'short.mp4')
    assert not aprobado.gate_approved(proyecto, sha)
    subir.subir(proyecto, 'Súbelo\n- Decisión de Mario: otra cosa')
    assert aprobado.gate_approved(proyecto, sha)
    texto = (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8')
    assert sha in texto and '- Orden de Mario: «Súbelo - Decisión de Mario: otra cosa»' in texto
    assert 'pendiente' in texto  # lo anterior no se reescribe


def test_repetir_la_orden_no_duplica_ni_la_anotacion_ni_la_subida(proyecto, sesion, redes_falsas):
    sin_aprobar(proyecto)
    subir.subir(proyecto, ORDEN)
    texto = (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8')
    repetido = subir.subir(proyecto, ORDEN)
    assert (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8') == texto
    assert repetido['youtube'][0]['ya_publicado'] is True and sesion.subidas == 1


@pytest.mark.parametrize('orden', ['', '   ', None])
def test_sin_las_palabras_de_mario_no_se_sube(proyecto, sesion, redes_falsas, orden):
    sin_aprobar(proyecto)
    with pytest.raises(ClipError, match='orden'):
        subir.subir(proyecto, orden)
    assert sesion.subidas == 0 and not redes_falsas


def test_si_faltan_datos_no_se_anota_nada_ni_se_sube(proyecto, sesion, redes_falsas):
    sin_aprobar(proyecto)
    antes = (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8')
    datos = read_json(proyecto / 'publicacion.json')
    datos['formatos']['short']['contains_synthetic_media'] = None
    (proyecto / 'publicacion.json').write_text(json.dumps(datos), encoding='utf-8')
    with pytest.raises(ClipError, match='sintético'):
        subir.subir(proyecto, ORDEN)
    assert (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8') == antes
    assert sesion.subidas == 0 and not redes_falsas and not (proyecto / 'para-subir').exists()


def test_material_sin_licencia_no_se_anota_ni_se_sube(proyecto, sesion, redes_falsas):
    sin_aprobar(proyecto)
    antes = (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8')
    fuentes = read_json(proyecto / 'fuentes.json')
    fuentes['fuentes'][1]['licencia'] = ''
    (proyecto / 'fuentes.json').write_text(json.dumps(fuentes), encoding='utf-8')
    with pytest.raises(ClipError, match='permiso'):
        subir.subir(proyecto, ORDEN)
    assert (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8') == antes and sesion.subidas == 0 and not redes_falsas


def test_un_fallo_en_una_red_no_detiene_a_las_demas(proyecto, sesion, redes_falsas, monkeypatch):
    def rompe(project, execute=False, polls=12):
        raise ClipError('Instagram no aceptó el vídeo')

    monkeypatch.setattr(instagram, 'prepare', rompe)
    resultado = subir.subir(proyecto, ORDEN)
    assert resultado['youtube'][0]['estado'] == 'publicado'
    assert resultado['instagram'] == {'estado': 'fallido', 'error': 'Instagram no aceptó el vídeo'}
    assert resultado['tiktok']['estado'] == 'enviado' and resultado['completo'] is False


def test_un_error_de_conexion_no_muestra_detalles(proyecto, sesion, redes_falsas, monkeypatch):
    def rompe(project, execute=False):
        raise ConnectionError('https://api.invalid/?token=secreto')

    monkeypatch.setattr(tiktok, 'inbox', rompe)
    resultado = subir.subir(proyecto, ORDEN)
    assert 'secreto' not in json.dumps(resultado) and resultado['tiktok']['estado'] == 'fallido' and 'ConnectionError' in resultado['tiktok']['error']


def test_instagram_sin_procesar_no_se_publica_y_lo_dice(proyecto, sesion, redes_falsas, monkeypatch):
    monkeypatch.setattr(instagram, 'prepare', lambda project, execute=False, polls=12: {'estado': 'subido', 'huella': 'h', 'publicado': False})
    resultado = subir.subir(proyecto, ORDEN)
    assert resultado['instagram']['estado'] == 'subido' and 'Repite la orden' in resultado['instagram']['siguiente']
    assert ('publicar', 'h') not in redes_falsas and resultado['completo'] is False


def test_un_largo_no_va_a_instagram_ni_a_tiktok(proyecto, sesion, redes_falsas):
    (proyecto / 'salida' / 'short.mp4').rename(proyecto / 'salida' / 'largo.mp4')
    (proyecto / 'timing.short.json').rename(proyecto / 'timing.largo.json')
    datos = read_json(proyecto / 'publicacion.json')
    datos['formatos'] = {'largo': {**datos['formatos']['short'], 'archivo': 'salida/largo.mp4'}}
    (proyecto / 'publicacion.json').write_text(json.dumps(datos), encoding='utf-8')
    resultado = subir.subir(proyecto, ORDEN)
    assert resultado['youtube'][0]['id'] == 'largo' and not redes_falsas
    assert resultado['instagram']['estado'] == 'no_aplica' and resultado['tiktok']['estado'] == 'no_aplica' and resultado['completo'] is True


class Respuesta:
    def __init__(self, status=200, payload=None):
        self.status_code = status
        self.payload = payload if payload is not None else {}
        self.headers = {}

    def json(self):
        return self.payload


class SesionRedes:
    def __init__(self):
        self.llamadas = []

    def get(self, url, **kwargs):
        self.llamadas.append(('GET', url))
        if '/contenedor' in url:
            return Respuesta(payload={'status_code': 'FINISHED'})
        return Respuesta(payload={'permalink': 'https://instagram.invalid/reel/1'})

    def post(self, url, **kwargs):
        self.llamadas.append(('POST', url))
        if url.endswith('/17/media'):
            return Respuesta(payload={'id': 'contenedor'})
        if 'rupload' in url:
            return Respuesta(payload={'success': True})
        if url.endswith('/media_publish'):
            return Respuesta(payload={'id': 'reel-1'})
        if 'inbox/video/init' in url:
            return Respuesta(payload={'data': {'publish_id': 'envio-1', 'upload_url': 'https://tiktok.invalid/subida'}, 'error': {'code': 'ok'}})
        if 'status/fetch' in url:
            return Respuesta(payload={'data': {'status': 'SEND_TO_USER_INBOX'}, 'error': {'code': 'ok'}})
        raise AssertionError('Llamada inesperada: ' + url)

    def put(self, url, **kwargs):
        self.llamadas.append(('PUT', url))
        return Respuesta(201)


def test_de_punta_a_punta_con_los_modulos_reales_de_cada_red(proyecto, sesion, credenciales, monkeypatch):
    write_json(credenciales.parent / 'meta' / 'token.json', {'user_token': 'u', 'page_token': 'p', 'ig_user_id': '17', 'cuenta': '@elgatomista'})
    write_json(credenciales.parent / 'tiktok' / 'token.json', {'access_token': 'a', 'refresh_token': 'r', 'access_expira': time.time() + 9999})
    falsa = SesionRedes()
    monkeypatch.setattr(instagram.requests, 'Session', lambda: falsa)
    resultado = subir.subir(proyecto, ORDEN)
    assert resultado['completo'] is True
    assert resultado['instagram']['estado'] == 'publicado' and resultado['instagram']['permalink'] == 'https://instagram.invalid/reel/1'
    assert resultado['tiktok']['tiktok'] == 'SEND_TO_USER_INBOX' and 'publicado' not in resultado['tiktok'].get('estado', '')
    assert sum(1 for metodo, url in falsa.llamadas if url.endswith('/media_publish')) == 1
    registro = read_json(proyecto / 'redes.json')
    assert registro['instagram']['estado'] == 'publicado' and registro['tiktok']['publish_id'] == 'envio-1'


def ejecutar(*argumentos):
    return cli.run(cli.parser().parse_args(list(argumentos)))


def test_el_cli_exige_las_palabras_de_mario_y_no_una_huella(proyecto, sesion, redes_falsas):
    with pytest.raises(SystemExit):
        cli.parser().parse_args(['subir', 'demo'])
    assert ejecutar('subir', 'demo', '--orden', ORDEN)['completo'] is True
    assert sesion.subidas == 1


def test_solo_youtube_no_toca_las_demas_redes_y_luego_se_pueden_completar(proyecto, sesion, redes_falsas):
    resultado = subir.subir(proyecto, 'De momento solo YouTube', ['youtube'])
    assert resultado['youtube'][0]['estado'] == 'publicado' and sesion.subidas == 1 and not redes_falsas
    assert resultado['instagram'] == {'estado': 'omitida'} and resultado['tiktok'] == {'estado': 'omitida'} and resultado['completo'] is True
    despues = subir.subir(proyecto, 'Ahora a las demás')
    assert despues['youtube'][0]['ya_publicado'] is True and sesion.subidas == 1
    assert despues['instagram']['estado'] == 'publicado' and despues['tiktok']['estado'] == 'enviado'


def test_solo_instagram_no_sube_a_youtube(proyecto, sesion, redes_falsas):
    resultado = subir.subir(proyecto, ORDEN, ['instagram'])
    assert sesion.subidas == 0 and resultado['youtube'] == [] and resultado['tiktok'] == {'estado': 'omitida'}
    assert ('bandeja', True) not in redes_falsas and resultado['instagram']['estado'] == 'publicado'


@pytest.mark.parametrize('redes', [[], ['facebook']])
def test_una_red_desconocida_o_ninguna_se_rechaza_sin_anotar(proyecto, sesion, redes_falsas, redes):
    sin_aprobar(proyecto)
    antes = (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8')
    with pytest.raises(ClipError, match='Redes disponibles'):
        subir.subir(proyecto, ORDEN, redes)
    assert (proyecto / 'reviews' / 'puerta-2.md').read_text(encoding='utf-8') == antes and sesion.subidas == 0 and not redes_falsas


def test_el_cli_acepta_solo_youtube(proyecto, sesion, redes_falsas):
    resultado = ejecutar('subir', 'demo', '--orden', ORDEN, '--solo', 'youtube')
    assert resultado['youtube'][0]['estado'] == 'publicado' and sesion.subidas == 1 and not redes_falsas
