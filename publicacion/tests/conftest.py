import json
import shutil
import subprocess

import pytest

from publicacion import core

CANAL = 'UCA76YezyGjv7spjOfRqAKNA'


def escribir_puerta(proyecto, huella, decision='aprobado'):
    (proyecto / 'reviews').mkdir(exist_ok=True)
    (proyecto / 'reviews' / 'puerta-2.md').write_text(
        f'# Puerta 2 · demo\n- Fichero: `salida/short.mp4`\n- Huella: SHA-256 `{huella}`\n- Decisión de Mario: {decision}\n', encoding='utf-8')


class Respuesta:
    def __init__(self, status, headers=None, payload=None):
        self.status_code = status
        self.headers = headers or {}
        self.payload = payload or {}

    def json(self):
        return self.payload


class Sesion:
    """YouTube de mentira: cuenta las sesiones de subida, las portadas y los bytes recibidos."""

    def __init__(self):
        self.subidas, self.portadas = 0, 0
        self.cuerpos = []

    def post(self, url, json=None, **kwargs):
        if 'thumbnails' in url:
            self.portadas += 1
            return Respuesta(200)
        self.subidas += 1
        self.cuerpos.append(json)
        return Respuesta(200, {'Location': 'https://upload.invalid/sesion'})

    def put(self, url, **kwargs):
        return Respuesta(200, payload={'id': 'video-demo'})

    def get(self, url, **kwargs):
        return Respuesta(200, payload={'items': [{'id': CANAL, 'status': {'privacyStatus': 'public'}}]})

    def close(self):
        pass


class Credenciales:
    def to_json(self):
        return '{}'


@pytest.fixture
def credenciales(tmp_path, monkeypatch):
    """Perfil `es` conectado y con la auditoría confirmada, en una carpeta temporal."""
    raiz = tmp_path / 'credenciales'
    perfil = raiz / 'perfiles' / 'es'
    perfil.mkdir(parents=True)
    (perfil / 'token.json').write_text('{}', encoding='utf-8')
    (perfil / 'perfil.json').write_text(json.dumps({'perfil': 'es', 'channel_id': CANAL, 'nombre': 'Pod 02', 'auditoria_youtube': 'confirmada'}), encoding='utf-8')
    monkeypatch.setenv('ELGATOMISTA_CREDENCIALES', str(raiz))
    return raiz


@pytest.fixture
def sesion(monkeypatch):
    from publicacion import youtube_profiles
    falsa = Sesion()
    monkeypatch.setattr(youtube_profiles, 'authorized_session', lambda perfil: (Credenciales(), falsa))
    return falsa


@pytest.fixture
def proyecto(tmp_path, monkeypatch, credenciales):
    """Un vídeo con todo lo que pide la publicación y la PUERTA 2 aprobada sobre su huella exacta."""
    if not shutil.which('ffmpeg'):
        pytest.skip('hace falta FFmpeg en el PATH')
    raiz = tmp_path / 'repo con espacios y ñ'
    carpeta = raiz / 'proyectos' / 'demo'
    (carpeta / 'salida').mkdir(parents=True)
    monkeypatch.setattr(core, 'ROOT', raiz)
    video = carpeta / 'salida' / 'short.mp4'
    subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=108x192:r=30:d=1',
                    '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest', '-c:v', 'libx264', '-c:a', 'aac', str(video)],
                   check=True, capture_output=True)
    (carpeta / 'brief.md').write_text('# Brief · demo\n', encoding='utf-8')
    (carpeta / 'fuentes.json').write_text(json.dumps({'fuentes': [
        {'id': 'f1', 'tipo': 'hecho', 'url': 'https://example.invalid/noticia', 'licencia': '', 'uso': 'frase 1', 'tramo': ''},
        {'id': 'm1', 'tipo': 'material', 'url': 'https://example.invalid/musica', 'licencia': 'CC0', 'uso': 'música', 'tramo': 'completo'}]}), encoding='utf-8')
    (carpeta / 'timing.short.json').write_text(json.dumps({'formato': 'short', 'frases': [
        {'id': 'fr01', 'palabras': [{'p': 'Una', 'i': 0.0, 'f': 0.3}, {'p': 'sola', 'i': 0.3, 'f': 0.6}, {'p': 'persona.', 'i': 0.6, 'f': 0.9}]}], 'escenas': []}), encoding='utf-8')
    (carpeta / 'publicacion.json').write_text(json.dumps({'perfil': 'es', 'formatos': {'short': {
        'archivo': 'salida/short.mp4', 'titulo': 'Un título', 'descripcion': 'Una descripción', 'tags': ['ia'], 'categoria': '28',
        'visibilidad': 'public', 'portada_segundo': 0.5, 'made_for_kids': False, 'contains_synthetic_media': True}}}), encoding='utf-8')
    escribir_puerta(carpeta, core.sha_file(video))
    return carpeta
