"""Enlaces entre el largo y sus shorts, y de Instagram y TikTok a YouTube (Mario, 2026-11-02)."""
import json
import shutil
import subprocess

import pytest

from conftest import Respuesta, Sesion
from publicacion import enlaces, instagram, redes, subir, tiktok, youtube_profiles
from publicacion.core import ClipError, read_json

ORDEN = 'Súbelos'
SOLO_YOUTUBE = ('youtube',)


class SesionYouTube(Sesion):
    """Cada subida recibe su propio id y los cambios de descripción (videos.update) se apuntan aparte."""

    def __init__(self):
        super().__init__()
        self.ids, self.cambios = 0, []

    def put(self, url, json=None, **kwargs):
        if url.startswith('https://www.googleapis.com/youtube/v3/videos'):
            self.cambios.append(json)
            return Respuesta(200)
        self.ids += 1
        return Respuesta(200, payload={'id': f'video{self.ids:06d}'})


class Credenciales:
    def __init__(self, scopes):
        self.scopes = scopes

    def to_json(self):
        return '{}'


@pytest.fixture
def youtube(monkeypatch):
    falsa = SesionYouTube()
    permisos = {'scopes': list(youtube_profiles.SCOPES)}
    monkeypatch.setattr(youtube_profiles, 'authorized_session', lambda perfil: (Credenciales(permisos['scopes']), falsa))
    falsa.permisos = permisos
    return falsa


def video(ruta, color, tamano):
    subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-y', '-f', 'lavfi', '-i', f'color=c={color}:s={tamano}:r=30:d=1',
                    '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest', '-c:v', 'libx264', '-c:a', 'aac', str(ruta)],
                   check=True, capture_output=True)


def largo_y_dos_shorts(proyecto):
    """Como alien-isolation-ia: un largo y dos shorts. Los shorts van antes en publicacion.json a propósito."""
    salida = proyecto / 'salida'
    (salida / 'short.mp4').rename(salida / 'short-a.mp4')
    video(salida / 'short-b.mp4', 'white', '108x192')
    video(salida / 'largo.mp4', 'red', '192x108')
    (proyecto / 'timing.short.json').rename(proyecto / 'timing.short-a.json')
    for formato in ('short-b', 'largo'):
        shutil.copy2(proyecto / 'timing.short-a.json', proyecto / f'timing.{formato}.json')
    datos = read_json(proyecto / 'publicacion.json')
    base = datos['formatos'].pop('short')
    datos['formatos'] = {'short-a': {**base, 'archivo': 'salida/short-a.mp4', 'titulo': 'Dos cerebros', 'descripcion': 'Resumen A'},
                         'short-b': {**base, 'archivo': 'salida/short-b.mp4', 'titulo': 'Isolation 2', 'descripcion': 'Resumen B'},
                         'largo': {**base, 'archivo': 'salida/largo.mp4', 'titulo': 'El largo', 'descripcion': 'Resumen del largo'}}
    (proyecto / 'publicacion.json').write_text(json.dumps(datos), encoding='utf-8')


def test_el_largo_sube_primero_y_cada_short_sale_con_su_enlace(proyecto, youtube):
    largo_y_dos_shorts(proyecto)
    resultado = subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    titulos = [cuerpo['snippet']['title'] for cuerpo in youtube.cuerpos]
    assert titulos[0] == 'El largo' and sorted(titulos[1:]) == ['Dos cerebros', 'Isolation 2']
    assert youtube.cuerpos[0]['snippet']['description'] == 'Resumen del largo'
    for cuerpo in youtube.cuerpos[1:]:
        assert cuerpo['snippet']['description'].endswith('\n\nVídeo completo: https://www.youtube.com/watch?v=video000001')
    assert resultado['completo'] is True


def test_el_largo_recibe_despues_los_enlaces_de_sus_shorts_sin_perder_titulo_ni_etiquetas(proyecto, youtube):
    largo_y_dos_shorts(proyecto)
    resultado = subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    assert len(youtube.cambios) == 1
    cambio = youtube.cambios[0]
    ids = enlaces.video_ids(proyecto)
    assert cambio['id'] == ids['largo'] == 'video000001'
    assert cambio['snippet']['title'] == 'El largo' and cambio['snippet']['tags'] == ['ia'] and cambio['snippet']['categoryId'] == '28'
    assert cambio['snippet']['description'] == ('Resumen del largo\n\nShorts de este vídeo:\n'
                                                f'- Dos cerebros: https://www.youtube.com/shorts/{ids["short-a"]}\n'
                                                f'- Isolation 2: https://www.youtube.com/shorts/{ids["short-b"]}')
    assert next(item for item in resultado['youtube'] if item['id'] == 'largo')['enlaces'] == 'añadidos'


def test_repetir_la_orden_no_vuelve_a_subir_ni_a_cambiar_la_descripcion(proyecto, youtube):
    largo_y_dos_shorts(proyecto)
    subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    resultado = subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    assert youtube.subidas == 3 and len(youtube.cambios) == 1 and resultado['completo'] is True


def test_sin_permiso_de_edicion_los_enlaces_quedan_pendientes_y_luego_se_completan(proyecto, youtube):
    largo_y_dos_shorts(proyecto)
    youtube.permisos['scopes'] = [s for s in youtube_profiles.SCOPES if s != youtube_profiles.EDITAR]
    resultado = subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    largo = next(item for item in resultado['youtube'] if item['id'] == 'largo')
    assert largo['enlaces'] == 'pendientes' and 'youtube-conectar' in largo['detalle_enlaces']
    assert 'Shorts de este vídeo:' in largo['descripcion_con_enlaces'] and not youtube.cambios
    assert resultado['completo'] is False
    youtube.permisos['scopes'] = list(youtube_profiles.SCOPES)
    resultado = subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    assert youtube.subidas == 3 and len(youtube.cambios) == 1 and resultado['completo'] is True


def test_instagram_y_tiktok_llevan_el_enlace_al_largo(proyecto, youtube):
    largo_y_dos_shorts(proyecto)
    subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    clip = redes.exported_video(proyecto, 'short-b')
    assert instagram.caption_of(clip) == 'Isolation 2\n\nResumen B\n\nVídeo completo en YouTube: https://www.youtube.com/watch?v=video000001'


def test_sin_largo_instagram_enlaza_el_mismo_short_en_youtube(proyecto, youtube):
    resultado = subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    assert youtube.cuerpos[0]['snippet']['description'] == 'Una descripción' and not youtube.cambios and resultado['completo'] is True
    assert redes.exported_video(proyecto, 'short')['enlace_youtube'] == 'En YouTube: https://www.youtube.com/shorts/video000001'


def test_instagram_no_sale_sin_el_enlace_a_youtube():
    with pytest.raises(ClipError, match='sube antes a YouTube'):
        instagram.caption_of({'titulo': 'T', 'descripcion': 'D', 'enlace_youtube': None})


def test_el_texto_para_tiktok_lleva_el_enlace_o_avisa_de_que_falta(proyecto, youtube, monkeypatch):
    largo_y_dos_shorts(proyecto)
    original = tiktok.inbox
    monkeypatch.setattr(tiktok, 'inbox', lambda project, execute=False, formato='short': {**original(project, False, formato=formato), 'estado': 'simulado'})
    resultado = subir.subir(proyecto, ORDEN, ('tiktok',))
    assert resultado['tiktok']['short-a']['texto_para_tiktok'].endswith('(Falta el enlace a YouTube: sube antes a YouTube y repite la orden para tenerlo.)')
    subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    texto = original(proyecto, False, formato='short-a')['texto_para_tiktok']
    assert texto == 'Dos cerebros\n\nResumen A\n\nVídeo completo en YouTube: https://www.youtube.com/watch?v=video000001'


def test_una_descripcion_con_enlaces_escritos_a_mano_no_se_toca(proyecto, youtube):
    largo_y_dos_shorts(proyecto)
    datos = read_json(proyecto / 'publicacion.json')
    datos['formatos']['short-a']['descripcion'] = 'Resumen A\n\nVídeo completo: https://www.youtube.com/watch?v=w8Z7xCj_8tc'
    (proyecto / 'publicacion.json').write_text(json.dumps(datos), encoding='utf-8')
    subir.subir(proyecto, ORDEN, SOLO_YOUTUBE)
    corto = next(c for c in youtube.cuerpos if c['snippet']['title'] == 'Dos cerebros')
    assert corto['snippet']['description'].count('youtube.com') == 1
    assert redes.exported_video(proyecto, 'short-a')['enlace_youtube'] == ''
