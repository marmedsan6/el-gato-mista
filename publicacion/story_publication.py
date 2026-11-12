"""Immutable YouTube packages bound to files, channels and full request bodies."""
from __future__ import annotations

import json
import shutil

from .aprobado import PROFILE, approved, check_youtube_limits, is_format, rights_pending, source_evidence, words, write_srt
from .core import ClipError, digest_json, ffmpeg, now, read_json, sha_file, write_json
from . import enlaces, youtube_profiles as profiles


def _payload(project, gate=True):
    from .youtube_upload import publication_body
    result = []
    for format_id, publication, render, path in approved(project, gate):
        if not publication['titulo'].strip() or not isinstance(publication['made_for_kids'], bool) or not isinstance(publication['contains_synthetic_media'], bool):
            raise ClipError('Completa título, audiencia infantil y declaración de contenido sintético antes de exportar: ' + format_id)
        check_youtube_limits(publication, format_id)
        cover = publication['portada_segundo']
        duration = render['duracion']
        if cover is None or not 0 <= cover < duration:
            raise ClipError('Elige un segundo de portada dentro del render: ' + format_id)
        # Portada propia (Mario, 2026-11-09: generada aparte, p. ej. con Codex): una imagen directamente en salida/.
        # Si no hay, la portada es el fotograma de portada_segundo.
        image = publication.get('portada_imagen')
        image_sha = None
        if image is not None:
            image_path = (project / str(image)).resolve()
            if image_path.parent != (project / 'salida').resolve() or not image_path.is_file():
                raise ClipError('La portada_imagen debe ser una imagen directamente en salida/: ' + format_id)
            image_sha = sha_file(image_path)
        meta = profiles.metadata(PROFILE)
        body = publication_body({'titulo': publication['titulo'], 'descripcion': publication['descripcion'],
                                 'tags': publication['tags'], 'categoria': publication['categoria'],
                                 'made_for_kids': publication['made_for_kids'], 'contains_synthetic_media': publication['contains_synthetic_media']},
                                publication['visibilidad'], publication.get('fecha'))
        body['snippet']['defaultLanguage'] = PROFILE
        body['snippet']['defaultAudioLanguage'] = PROFILE
        result.append({'id': format_id, 'perfil': PROFILE, 'channel_id': meta.get('channel_id'),
                       'cuenta': meta['nombre'], 'archivo': path.name, 'sha256': render['sha256'],
                       'body': body, 'visibilidad': publication['visibilidad'], 'fecha': publication.get('fecha'),
                       'portada_segundo': cover, 'metodo': profiles.route(PROFILE, publication['visibilidad']),
                       **({'portada_imagen': str(image), 'portada_imagen_sha256': image_sha} if image is not None else {}),
                       'fuentes_pendientes': rights_pending(project), 'evidencia_uso': source_evidence(project)})
    return result


def validate(project):
    """Lo que se publicaría si Mario diera la orden ahora; para si falta algo, sin escribir nada."""
    return _payload(project, gate=False)


def fingerprint(items):
    return digest_json({'motor_publicacion_historias': 1, 'destinos': [{k: v for k, v in x.items() if k not in ('estado', 'resultado', 'error', 'fecha_resultado', 'nota_resultado')} for x in items]})


def export(project):
    items = _payload(project)
    proposal = project / 'trabajo' / 'portadas'
    proposal.mkdir(parents=True, exist_ok=True)
    for item in items:
        cover = proposal / (item['id'] + '.jpg')
        if item.get('portada_imagen'):
            ffmpeg(['-i', project / item['portada_imagen'], '-frames:v', '1', '-q:v', '2', cover])
        else:
            ffmpeg(['-ss', f'{item["portada_segundo"]:.6f}', '-i', project / 'salida' / item['archivo'], '-frames:v', '1', '-q:v', '3', cover])
        item.update({'portada_archivo': item['id'] + '-portada.jpg', 'portada_sha256': sha_file(cover)})
        captions = project / 'trabajo' / item['id'] / 'subtitulos.srt'
        captions.parent.mkdir(parents=True, exist_ok=True)
        write_srt(captions, words(project, item['id']))
        item.update({'subtitulos_archivo': item['id'] + '.srt', 'subtitulos_sha256': sha_file(captions)})
    batch_hash = fingerprint(items)
    package = project / 'para-subir' / batch_hash[:16]
    package.mkdir(parents=True, exist_ok=True)
    for item in items:
        for original, target in ((project / 'salida' / item['archivo'], item['archivo']),
                                 (proposal / (item['id'] + '.jpg'), item['portada_archivo']),
                                 (project / 'trabajo' / item['id'] / 'subtitulos.srt', item['subtitulos_archivo'])):
            shutil.copy2(original, package / target)
        item['estado'] = 'pendiente_de_autorizacion'
        (package / (item['id'] + '-publicacion.txt')).write_text(
            item['body']['snippet']['title'] + '\n\n' + item['body']['snippet']['description'] + '\n\n' +
            'Perfil: ' + item['perfil'] + '\nCanal: ' + str(item['channel_id'] or 'pendiente de crear/conectar') +
            '\nMétodo: ' + item['metodo'] + '\nVisibilidad: ' + item['visibilidad'], encoding='utf-8')
    manifest = {'version': 1, 'modo': 'historias', 'proyecto': project.name,
                'huella_lote': batch_hash, 'autorizacion_lote': {'estado': 'pendiente'}, 'destinos': items}
    manifest_path = package / 'publicacion.json'
    if manifest_path.is_file():
        previous = read_json(manifest_path)
        if previous.get('huella_lote') == batch_hash:
            manifest = previous  # Preserve authorization/results when exactly the same package is re-exported.
    write_json(manifest_path, manifest)
    write_json(project / 'trabajo/publicacion-actual.json', {'paquete': package.relative_to(project).as_posix(),
                                                          'huella_lote': batch_hash, 'actualizado': now()})
    (package / 'LEEME.txt').write_text('Paquete para YouTube.\nRevisar publicacion.json: su huella vincula archivos, canales, portada y todos los datos enviados.\nLa exportación no autoriza publicar. Los perfiles sin conectar requieren configuración antes de ejecutar.\n', encoding='utf-8')
    return str(package)


def current(project):
    marker = project / 'trabajo/publicacion-actual.json'
    if not marker.is_file():
        raise ClipError('Todavía no hay paquete exportado. Aprueba el vídeo con decision y ejecuta exportar antes de publicar.')
    saved = read_json(marker)
    package = (project / saved['paquete']).resolve()
    if not package.is_relative_to((project / 'para-subir').resolve()):
        raise ClipError('Ruta de paquete inválida.')
    manifest = read_json(package / 'publicacion.json')
    if manifest.get('modo') != 'historias' or manifest['huella_lote'] != saved['huella_lote'] or fingerprint(manifest['destinos']) != saved['huella_lote']:
        raise ClipError('El manifiesto cambió; vuelve a exportar y autorizar.')
    return manifest, package


def plan(project):
    manifest, package = current(project)
    fresh = {item['id']: item for item in _payload(project)}
    if set(fresh) != {item['id'] for item in manifest['destinos']} or len(fresh) != len(manifest['destinos']):
        raise ClipError('La selección aprobada cambió; vuelve a exportar y autorizar.')
    for item in manifest['destinos']:
        expected = fresh.get(item['id'])
        if not expected or any(item.get(key) != value for key, value in expected.items()):
            raise ClipError('La propuesta ya no coincide con la versión, cuenta, permisos o metadatos actuales; vuelve a exportar.')
        for filename, hash_key in (('archivo', 'sha256'), ('portada_archivo', 'portada_sha256'), ('subtitulos_archivo', 'subtitulos_sha256')):
            file = (package / item[filename]).resolve()
            if not file.is_relative_to(package) or not file.is_file() or sha_file(file) != item[hash_key]:
                raise ClipError('Un archivo exportado cambió; vuelve a exportar y autorizar.')
    return {'modo': 'simulacion', 'huella_lote': manifest['huella_lote'], 'destinos': manifest['destinos'],
            'aviso': 'Sin envío ni conexión de cuentas. Publicar exige autorización expresa de este lote exacto.'}


def execute(project, confirmation, probe_public=False):
    """Sube el lote autorizado. `probe_public` (solo hasta confirmar la auditoría de la API) sube en público por API una
    sola vez y lee después el estado real que YouTube dio al vídeo; ver youtube_profiles.record_public_probe."""
    from .youtube_upload import upload_resumable, upload_thumbnail
    prepared = plan(project)
    if confirmation != prepared['huella_lote']:
        raise ClipError('La huella no coincide con el lote autorizado.')
    manifest, package = current(project)
    for item in manifest['destinos']:
        if item['fuentes_pendientes'] or not item['channel_id']:
            raise ClipError('Falta permiso de una fuente o identificación del canal: ' + item['id'])
    if probe_public:
        for item in manifest['destinos']:
            if item['metodo'] == 'YouTube Data API':
                raise ClipError('Este perfil ya publica por la API: no hace falta la prueba pública.')
            if item['visibilidad'] != 'public':
                raise ClipError('La prueba pública exige un lote con visibilidad public.')
            if not (profiles.profile_root(item['perfil']) / 'token.json').is_file():
                raise ClipError('Conecta el perfil de YouTube antes de la prueba pública.')
            if profiles.public_probe_done(item['perfil']):
                raise ClipError('La prueba pública ya se hizo (una sola vez): su resultado está en el perfil del canal. Sube a mano desde '
                                'Studio o, si el vídeo de la prueba quedó en público, confirma la auditoría con youtube-perfil.')
    manifest['autorizacion_lote'] = {'estado': 'confirmado', 'huella': confirmation, 'confirmado': now(), 'origen': 'confirmación expresa del lote en conversación'}
    write_json(package / 'publicacion.json', manifest)
    records_path = project / 'publicaciones.json'
    records = read_json(records_path) if records_path.is_file() else {'historias': {}}
    results = []
    # El largo sube antes que sus shorts, para que cada short salga ya con su enlace.
    for item in sorted(manifest['destinos'], key=lambda destino: destino['id'] != 'largo'):
        key = digest_json({'channel_id': item['channel_id'], 'sha256': item['sha256']})
        previous = records.setdefault('historias', {}).get(key, {})
        if item['estado'] == 'incierto':
            results.append({'id': item['id'], 'estado': 'incierto', 'detalle': 'Verifica el destino antes de otro intento.'})
            continue
        published_record = bool(previous.get('video_id') or previous.get('video_publicado'))
        if published_record and previous.get('body_sha256') != digest_json(item['body']):
            item['estado'] = 'metadatos_pendientes_en_studio'
            results.append({'id': item['id'], 'estado': item['estado'], 'video_id': previous.get('video_id'), 'url': previous.get('url'),
                            'detalle': 'El vídeo ya existe. Actualiza sus metadatos en Studio y registra el resultado; no se inicia otra subida.'})
            continue
        if item['estado'] == 'publicado' or published_record and previous.get('portada_sha256') == item['portada_sha256']:
            item.update({'estado': 'publicado', 'resultado': previous or item.get('resultado')})
            results.append({'id': item['id'], 'estado': 'publicado', 'ya_publicado': True})
            continue
        if published_record and not previous.get('video_id'):
            item['estado'] = 'portada_pendiente_en_studio'
            results.append({'id': item['id'], 'estado': item['estado'], 'url': previous.get('url')})
            continue
        probing = False
        probe_result = None
        if item['metodo'] != 'YouTube Data API':
            if not probe_public:
                item['estado'] = 'requiere_subida_manual'
                results.append({'id': item['id'], 'estado': item['estado'], 'paquete': str(package)})
                continue
            probing = True
        credentials = session = None
        checkpoint = None
        try:
            credentials, session = profiles.authorized_session(item['perfil'])
            private = profiles.profile_root(item['perfil']) / 'sesiones'
            private.mkdir(exist_ok=True)
            checkpoint = private / (key + '.json')
            sent = previous.get('descripcion_enviada')
            if previous.get('video_id'):
                video_id = previous['video_id']
            else:
                sent, _ = enlaces.youtube_description(project, item['id'], item['body']['snippet']['description'])
                video_id = upload_resumable(session, package / item['archivo'], {**item['body'], 'snippet': {**item['body']['snippet'], 'description': sent}}, checkpoint)
            # body_sha256 es el de publicacion.json, sin enlaces: así repetir la orden no lo toma por metadatos cambiados.
            record = {**previous, 'video_id': video_id, 'channel_id': item['channel_id'], 'sha256': item['sha256'],
                      'formato': item['id'], 'fecha': now(), 'url': 'https://www.youtube.com/watch?v=' + video_id,
                      'body_sha256': digest_json(item['body']), **({'descripcion_enviada': sent} if sent is not None else {})}
            records['historias'][key] = record
            write_json(records_path, records)  # Persist video before the independent thumbnail request.
            if probing:
                # Con la subida hecha y antes de la portada: qué privacidad dejó realmente YouTube en el vídeo.
                privacy = None
                try:
                    privacy = profiles.video_privacy(session, video_id)
                except Exception:
                    pass
                probe_result = profiles.record_public_probe(item['perfil'], video_id, privacy or 'desconocido')
                record['prueba_publica'] = probe_result
                write_json(records_path, records)
            upload_thumbnail(session, video_id, package / item['portada_archivo'])
            record['portada_sha256'] = item['portada_sha256']
            write_json(records_path, records)
            item.update({'estado': 'publicado', 'resultado': record})
            results.append({'id': item['id'], 'estado': 'publicado', 'video_id': video_id,
                            **({'prueba_publica': probe_result} if probe_result else {})})
        except Exception as error:
            saved = records['historias'].get(key, {})
            upload_state = read_json(checkpoint) if checkpoint and checkpoint.is_file() else {}
            status = 'portada_pendiente' if saved.get('video_id') else 'subida_pausada' if upload_state.get('uri') else 'incierto' if upload_state.get('estado') == 'creacion-incierta' else 'fallido'
            item.update({'estado': status, 'resultado': saved or None,
                         'error': str(error)[:1000] if isinstance(error, ClipError) else 'Error de conexión o autenticación (' + type(error).__name__ + '); no se muestran credenciales ni sesiones.'})
            results.append({'id': item['id'], 'estado': item['estado'], 'error': item['error'],
                            **({'prueba_publica': probe_result} if probe_result else {})})
        finally:
            if credentials is not None:
                write_json(profiles.profile_root(item['perfil']) / 'token.json', json.loads(credentials.to_json()))
            if session is not None:
                session.close()
            write_json(package / 'publicacion.json', manifest)
    write_json(package / 'publicacion.json', manifest)
    _complete_links(project, manifest, records, records_path, results)
    return {'huella_lote': confirmation, 'destinos': results}


def _complete_links(project, manifest, records, records_path, results):
    """Con todo subido, el largo recibe los enlaces de sus shorts (y un short que subió sin el largo, el suyo).
    Pide el permiso youtube.force-ssl; sin él, el vídeo queda con `enlaces: pendientes` y se dice qué falta."""
    from .youtube_upload import update_snippet
    ids = enlaces.video_ids(project)
    by_id = {result['id']: result for result in results}
    pending = []
    for item in manifest['destinos']:
        record = records['historias'].get(digest_json({'channel_id': item['channel_id'], 'sha256': item['sha256']}), {})
        base = item['body']['snippet']['description']
        if not record.get('video_id') or item['id'] not in by_id:
            continue
        wanted, _ = enlaces.youtube_description(project, item['id'], base, ids)
        if wanted != record.get('descripcion_enviada', base):
            pending.append((item, record, wanted))
    if not pending:
        return
    credentials = session = None
    try:
        credentials, session = profiles.authorized_session(pending[0][0]['perfil'])
        if not profiles.can_edit(credentials):
            raise ClipError('Falta el permiso de edición de YouTube: vuelve a conectar el perfil con youtube-conectar.')
        for item, record, wanted in pending:
            update_snippet(session, record['video_id'], {**item['body']['snippet'], 'description': wanted})
            record['descripcion_enviada'] = wanted
            write_json(records_path, records)
            by_id[item['id']]['enlaces'] = 'añadidos'
    except Exception as error:
        detail = str(error)[:300] if isinstance(error, ClipError) else 'Error de conexión o autenticación (' + type(error).__name__ + ').'
        for item, record, wanted in pending:
            if by_id[item['id']].get('enlaces') != 'añadidos':
                by_id[item['id']].update({'enlaces': 'pendientes', 'detalle_enlaces': detail + ' Repite la orden después: solo se añaden los enlaces.',
                                          'descripcion_con_enlaces': wanted})
    finally:
        if credentials is not None:
            write_json(profiles.profile_root(pending[0][0]['perfil']) / 'token.json', json.loads(credentials.to_json()))
        if session is not None:
            session.close()


def manual_result(project, format_id, status, account, result=None, note=''):
    if not is_format(format_id) or status not in ('publicado', 'fallido', 'incierto'):
        raise ClipError('Formato o resultado inválidos.')
    plan(project)
    manifest, package = current(project)
    if manifest['autorizacion_lote'].get('estado') != 'confirmado':
        raise ClipError('Autoriza el lote antes de registrar una publicación manual.')
    item = next((i for i in manifest['destinos'] if i['id'] == format_id), None)
    if not item or item['channel_id'] != account:
        raise ClipError('El canal informado no coincide con el lote.')
    if item['estado'] == 'publicado' and status != 'publicado':
        raise ClipError('Un resultado publicado no se degrada sin verificar el destino.')
    if status == 'publicado' and not result:
        raise ClipError('Registra la URL o ID del vídeo publicado.')
    item.update({'estado': status, 'resultado': result, 'nota_resultado': note[:1000], 'fecha_resultado': now()})
    # Result notes/timestamps are operational fields, excluded from the authorized payload.
    write_json(package / 'publicacion.json', manifest)
    records_path = project / 'publicaciones.json'
    records = read_json(records_path) if records_path.is_file() else {'historias': {}}
    key = digest_json({'channel_id': account, 'sha256': item['sha256']})
    previous = records.setdefault('historias', {}).get(key, {})
    records['historias'][key] = {**previous, 'channel_id': account, 'sha256': item['sha256'], 'estado': status,
        'resultado': result, 'nota': note[:1000], 'fecha': now(), 'formato': format_id}
    if status == 'publicado':
        records['historias'][key]['body_sha256'] = digest_json(item['body'])
        records['historias'][key]['video_publicado'] = True
        records['historias'][key]['url'] = result
        records['historias'][key]['portada_sha256'] = item['portada_sha256']
    write_json(records_path, records)
    return item


def publish_now(project, format_id):
    """Orden de Mario: un vídeo ya subido y programado sale ya (p. ej. el short A con el largo, Mario 2026-11-12).
    No toca publicacion.json (su huella es la del lote subido): lo anota en publicaciones.json."""
    from .youtube_upload import set_public
    video_id = enlaces.video_ids(project).get(format_id)
    if not video_id:
        raise ClipError(f'Ese formato no está subido a YouTube: {format_id}. Súbelo antes con la orden de Mario.')
    credentials = session = None
    try:
        credentials, session = profiles.authorized_session(PROFILE)
        if not profiles.can_edit(credentials):
            raise ClipError('Falta el permiso de edición de YouTube: vuelve a conectar el perfil con youtube-conectar.')
        before = set_public(session, video_id)
    finally:
        if credentials is not None:
            write_json(profiles.profile_root(PROFILE) / 'token.json', json.loads(credentials.to_json()))
        if session is not None:
            session.close()
    records_path = project / 'publicaciones.json'
    records = read_json(records_path)
    for record in records.get('historias', {}).values():
        if record.get('video_id') == video_id:
            record.update({'publicado_ya': now(), 'estado_previo': before})
    write_json(records_path, records)
    return {'formato': format_id, 'video_id': video_id, 'antes': before, 'ahora': 'public'}
