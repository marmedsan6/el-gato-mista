"""La orden de Mario de subir un vídeo: lo aprueba, lo exporta y lo saca a todas las redes de una vez, sin pedir huellas.

La huella sigue existiendo por dentro: vincula lo que se sube con lo que se exportó y evita duplicados. Mario ya no la escribe.
Cada red va aparte: un fallo en una no detiene a las demás, y repetir la orden solo completa lo que falte.
TikTok no publica: el vídeo llega a la bandeja de Mario, que termina el post (la app solo tiene el permiso video.upload).
"""
from __future__ import annotations

from . import aprobado, instagram, story_publication, tiktok
from .core import ClipError


def _safely(action):
    try:
        return action()
    except ClipError as error:
        return {'estado': 'fallido', 'error': str(error)[:1000]}
    except Exception as error:  # Una excepción de red puede llevar la URL: solo se muestra el tipo.
        return {'estado': 'fallido', 'error': 'Error de conexión o autenticación (' + type(error).__name__ + '); no se muestran credenciales ni sesiones.'}


def _instagram(project):
    prepared = instagram.prepare(project, execute=True, polls=36)
    if prepared.get('publicado'):
        return {'estado': 'publicado', 'ya_publicado': True, 'permalink': prepared.get('permalink')}
    if prepared['estado'] != 'listo':
        return {'estado': prepared['estado'], 'siguiente': 'Meta aún no ha terminado de procesar el vídeo. Repite la orden en un minuto: no se sube otra vez.'}
    return instagram.publish(project, prepared['huella'])


def _complete(result):
    return (all(item['estado'] == 'publicado' for item in result['youtube'])
            and result['instagram']['estado'] in ('publicado', 'no_aplica')
            and (result['tiktok']['estado'] == 'no_aplica' or result['tiktok'].get('tiktok') in ('SEND_TO_USER_INBOX', 'PUBLISH_COMPLETE')))


def subir(project, order):
    order = ' '.join(str(order or '').split())
    if not order:
        raise ClipError('Indica la orden de Mario con sus palabras literales (--orden).')
    # Antes de anotar la orden: lo que impediría subir se dice aquí, sin haber aprobado ni enviado nada.
    items = story_publication.validate(project)
    for item in items:
        if item['fuentes_pendientes'] or not item['channel_id']:
            raise ClipError('Falta permiso de una fuente o identificación del canal: ' + item['id'])
    for format_id, _, render, path in aprobado.approved(project, gate=False):
        aprobado.record_order(project, path, render['sha256'], order)
    story_publication.export(project)
    huella = story_publication.plan(project)['huella_lote']
    result = {'proyecto': project.name, 'videos': {item['id']: item['sha256'] for item in items},
              'youtube': _safely(lambda: story_publication.execute(project, huella)['destinos'])}
    if not isinstance(result['youtube'], list):
        result['youtube'] = [result['youtube']]
    if any(item['id'] == 'short' for item in items):
        result['instagram'] = _safely(lambda: _instagram(project))
        result['tiktok'] = _safely(lambda: tiktok.inbox(project, execute=True))
    else:
        result['instagram'] = result['tiktok'] = {'estado': 'no_aplica'}
    result['completo'] = _complete(result)
    return result
