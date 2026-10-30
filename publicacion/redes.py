"""Instagram y TikTok: credenciales fuera del repo, receptor OAuth local y estado compartido. Nunca se imprimen secretos."""
from __future__ import annotations

import hashlib
import http.server
import secrets
import time
import urllib.parse
import webbrowser
from pathlib import Path

from . import core
from .core import ClipError, now, read_json, write_json

REDES = {'tiktok': 'tiktok', 'meta': 'meta'}
PLANTILLAS = {
    'tiktok': {'client_key': 'REEMPLAZA', 'client_secret': 'REEMPLAZA'},
    'meta': {'app_id': 'REEMPLAZA', 'app_secret': 'REEMPLAZA', 'config_id': '1456649246376600', 'api_version': 'v26.0'},
}
PRIVADO = 'REEMPLAZA'


def root(network):
    if network not in REDES:
        raise ClipError('Red desconocida: ' + network)
    path = core.credentials_root().resolve().parent / REDES[network]
    if path.is_relative_to(core.ROOT.resolve()) or any('onedrive' in part.lower() for part in path.parts):
        raise ClipError('Las credenciales de ' + network + ' deben estar fuera de OneDrive y del workspace.')
    return path


def credentials(network):
    """Lee credenciales.json sin mostrar nunca los valores; falla si falta o sigue la plantilla."""
    path = root(network) / 'credenciales.json'
    if not path.is_file():
        raise ClipError(f'Falta {path}. Crea la plantilla con redes-plantillas y rellénala tú; no pegues secretos en el chat.')
    data = read_json(path)
    missing = [key for key in PLANTILLAS[network] if not str(data.get(key, '')).strip() or str(data.get(key)).strip() == PRIVADO]
    if missing:
        raise ClipError('Faltan por rellenar en credenciales.json de ' + network + ': ' + ', '.join(missing) + '.')
    return data


def templates():
    """Crea las carpetas y las plantillas que Mario rellena a mano. No pisa nada existente."""
    result = {}
    for network, content in PLANTILLAS.items():
        folder = root(network)
        folder.mkdir(parents=True, exist_ok=True)
        path = folder / 'credenciales.json'
        result[network] = {'carpeta': str(folder), 'plantilla': 'ya existía' if path.is_file() else 'creada'}
        if not path.is_file():
            write_json(path, content)
    return result


def token_path(network):
    return root(network) / 'token.json'


def load_token(network):
    path = token_path(network)
    if not path.is_file():
        raise ClipError('Todavía no hay conexión con ' + network + '. Ejecuta el comando de conexión.')
    return read_json(path)


def status():
    """Qué está listo, sin valores."""
    result = {}
    for network, template in PLANTILLAS.items():
        folder = root(network)
        cred = folder / 'credenciales.json'
        info = {'carpeta': str(folder), 'credenciales': 'falta', 'conexion': 'sin conectar'}
        if cred.is_file():
            data = read_json(cred)
            empty = [key for key in template if not str(data.get(key, '')).strip() or str(data.get(key)).strip() == PRIVADO]
            info['credenciales'] = 'completas' if not empty else 'por rellenar: ' + ', '.join(empty)
        if token_path(network).is_file():
            token = read_json(token_path(network))
            info['conexion'] = 'conectada' if token.get('page_token') or token.get('access_token') else 'autorizada, falta elegir la cuenta'
            info['cuenta'] = token.get('cuenta')
            info['conectado'] = token.get('conectado')
        result[network] = info
    return result


def pkce():
    """TikTok pide el SHA-256 del verificador codificado en hexadecimal (guía de Login Kit para escritorio)."""
    verifier = secrets.token_urlsafe(64)[:96]
    return verifier, hashlib.sha256(verifier.encode()).hexdigest()


def new_state():
    return secrets.token_urlsafe(24)


def same_state(expected, received):
    return bool(expected) and bool(received) and secrets.compare_digest(str(expected), str(received))


class _Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        url = urllib.parse.urlsplit(self.path)
        query = {key: values[0] for key, values in urllib.parse.parse_qs(url.query).items()}
        if url.path != self.server.callback_path or not query:
            self.send_response(404)
            self.end_headers()
            return
        self.server.result = query
        body = '<!doctype html><meta charset="utf-8"><title>Listo</title><p>Puedes cerrar esta pestaña y volver al motor.</p>'.encode()
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        try:
            self.wfile.write(body)
        except OSError:  # El navegador puede cerrar la conexión después de recibir la respuesta.
            pass

    def log_message(self, *args):  # El código de autorización viaja en la URL: no se registra.
        pass


def wait_for_callback(port, path, open_url, timeout=300, host='127.0.0.1', opener=webbrowser.open):
    """Abre el receptor local, lanza la autorización y devuelve los parámetros de la redirección."""
    try:
        server = http.server.HTTPServer((host, port), _Handler)
    except OSError as error:
        raise ClipError(f'No se pudo abrir el puerto local {port} para recibir la autorización; ciérralo e inténtalo otra vez.') from error
    server.callback_path = path
    server.result = None
    server.timeout = 1
    try:
        opener(open_url)
        deadline = time.monotonic() + timeout
        while server.result is None and time.monotonic() < deadline:
            server.handle_request()
    finally:
        server.server_close()
    if server.result is None:
        raise ClipError('No llegó la autorización a tiempo. Vuelve a ejecutar el comando de conexión.')
    return server.result


def api_error(response, what):
    """Error legible sin credenciales: solo estado HTTP y el código y mensaje que devuelve la plataforma."""
    detail = ''
    try:
        body = response.json()
    except Exception:
        body = {}
    error = body.get('error') if isinstance(body, dict) else None
    debug = body.get('debug_info') if isinstance(body, dict) else None
    if isinstance(debug, dict) and not error:
        detail = ' '.join(str(debug[key]) for key in ('type', 'message') if debug.get(key))
    elif isinstance(error, dict):
        detail = ' '.join(str(error[key]) for key in ('code', 'type', 'message') if error.get(key))
    elif isinstance(error, str):
        detail = error + ' ' + str(body.get('error_description', ''))
    return ClipError(f'{what} (HTTP {response.status_code}){": " + detail.strip()[:300] if detail.strip() else ""}.')


def seconds_left(token, key):
    expires = token.get(key)
    if not expires:
        return 0
    return expires - time.time()


def expires_in(seconds):
    return time.time() + float(seconds)


def record_path(project):
    return Path(project) / 'redes.json'


def record(project):
    path = record_path(project)
    return read_json(path) if path.is_file() else {'version': 1}


def save_record(project, data):
    write_json(record_path(project), {**data, 'actualizado': now()})


def exported_video(project):
    """Vídeo del paquete exportado y aprobado, con su huella de contenido y la publicación que ya se aprobó."""
    from . import story_publication as publication
    manifest, package = publication.current(project)
    item = next((destino for destino in manifest['destinos'] if destino['id'] == 'short'), None)
    if not item:
        raise ClipError('El paquete exportado no tiene el short; Instagram y TikTok solo reciben shorts.')
    path = (package / item['archivo']).resolve()
    if not path.is_relative_to(package.resolve()) or not path.is_file():
        raise ClipError('No se encuentra el vídeo del paquete exportado; vuelve a exportar.')
    if core.sha_file(path) != item['sha256']:
        raise ClipError('El vídeo exportado cambió; vuelve a exportar y aprobar antes de enviarlo a una red.')
    snippet = item['body']['snippet']
    return {'ruta': path, 'bytes': path.stat().st_size, 'sha256': item['sha256'], 'titulo': snippet['title'], 'descripcion': snippet.get('description', ''),
            'sintetico': bool(item['body']['status'].get('containsSyntheticMedia', False)), 'huella_lote': manifest['huella_lote']}
