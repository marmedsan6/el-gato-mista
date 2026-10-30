"""Exportar y publicar sobre un proyecto de este canal: sin red y con un YouTube de mentira."""
import json
from pathlib import Path

import pytest

from conftest import CANAL, escribir_puerta
from publicacion import aprobado, cli, story_publication
from publicacion.core import ClipError, read_json, sha_file

V1 = 'a7146cc9de151829b496dfe43ccd7becee4aa48e1a0e794449e17bed46cacd3a'
V2 = '368c32dd86b474a22036cab9c43f3bf73eb08ef0d926c015ba6fd811d3f216ae'
PUERTA_REAL = f"""# Puerta 2 · mithril-ia-medicina
- Fichero: `proyectos/mithril-ia-medicina/salida/short-v1.mp4` (renombrado tras la decisión; misma huella)
- Huella: SHA-256 `{V1}`
- Decisión de Mario: **no se publica; queda como versión interna v1** («Me gusta como primer vídeo, pero tenemos que seguir iterando»;
  «Versión interna; publicamos la v2»). La v2, con el estilo v2, repetirá la PUERTA 2 sobre su propia huella.

---

# Puerta 2 · mithril-ia-medicina · short v2 (estilo v2, MISTA)
- Fichero: `proyectos/mithril-ia-medicina/salida/short-v2.mp4`
- Huella: SHA-256 `{V2}`
- Primera presentación (SHA `f8fbd012…e96f`): Mario pide 2 cambios (`reviews/iter-02.md`): retrato sin mover la boca y menos sonidos. Aplicados.
- Decisión de Mario sobre la huella actual: **{{decision}}**
"""


def puerta(tmp_path, texto):
    (tmp_path / 'reviews').mkdir(exist_ok=True)
    (tmp_path / 'reviews' / 'puerta-2.md').write_text(texto, encoding='utf-8')
    return tmp_path


def ajustar(carpeta, **campos):
    datos = read_json(carpeta / 'publicacion.json')
    datos['formatos']['short'].update(campos)
    (carpeta / 'publicacion.json').write_text(json.dumps(datos), encoding='utf-8')


@pytest.mark.parametrize('decision', ['pendiente', 'cambios', 'aprobado con cambios', 'aprobado | cambios', 'no aprobado'])
def test_la_puerta_solo_se_pasa_con_aprobado(tmp_path, decision):
    assert not aprobado.gate_approved(puerta(tmp_path, PUERTA_REAL.format(decision=decision)), V2)


@pytest.mark.parametrize('decision', ['aprobado', 'Aprobado', 'aprobado («sí, adelante»)'])
def test_la_aprobacion_vale_para_su_huella_y_ninguna_otra(tmp_path, decision):
    carpeta = puerta(tmp_path, PUERTA_REAL.format(decision=decision))
    assert aprobado.gate_approved(carpeta, V2)
    assert not aprobado.gate_approved(carpeta, V1)  # la v1 quedó como versión interna
    assert not aprobado.gate_approved(carpeta, 'f' * 64)


def test_sin_fichero_de_puerta_no_hay_aprobacion(tmp_path):
    assert not aprobado.gate_approved(tmp_path, V2)


def test_exportar_sin_aprobacion_se_niega_y_no_escribe_nada(proyecto):
    escribir_puerta(proyecto, sha_file(proyecto / 'salida' / 'short.mp4'), 'pendiente')
    with pytest.raises(ClipError, match='PUERTA 2'):
        story_publication.export(proyecto)
    assert not (proyecto / 'para-subir').exists() and not (proyecto / 'trabajo').exists()


def test_un_video_cambiado_pierde_la_aprobacion(proyecto):
    (proyecto / 'salida' / 'short.mp4').write_bytes(b'otro video')
    with pytest.raises(ClipError, match='PUERTA 2'):
        story_publication.export(proyecto)


def test_no_se_adivina_el_contenido_sintetico(proyecto):
    ajustar(proyecto, contains_synthetic_media=None)
    with pytest.raises(ClipError, match='sintético'):
        story_publication.export(proyecto)


@pytest.mark.parametrize('campos', [{'titulo': 'x' * 101}, {'titulo': 'con <marca>'}, {'descripcion': 'Hola <!-- PENDIENTE -->'},
                                    {'descripcion': 'ñ' * 2501}, {'titulo': '   '}])
def test_metadatos_que_youtube_rechazaria_no_llegan_a_la_subida(proyecto, campos):
    # Un rechazo al crear la sesión deja el checkpoint en creacion-incierta y bloquea los reintentos: se para antes.
    ajustar(proyecto, **campos)
    with pytest.raises(ClipError):
        story_publication.export(proyecto)


def test_un_archivo_fuera_de_salida_se_rechaza(proyecto):
    ajustar(proyecto, archivo='../../secreto.mp4')
    with pytest.raises(ClipError, match='salida'):
        story_publication.export(proyecto)


def test_material_sin_licencia_bloquea_la_subida(proyecto, sesion):
    fuentes = read_json(proyecto / 'fuentes.json')
    fuentes['fuentes'][1]['licencia'] = ' '
    (proyecto / 'fuentes.json').write_text(json.dumps(fuentes), encoding='utf-8')
    story_publication.export(proyecto)
    huella = story_publication.plan(proyecto)['huella_lote']
    with pytest.raises(ClipError, match='permiso'):
        story_publication.execute(proyecto, huella)
    assert sesion.subidas == 0


def test_exportar_crea_el_paquete_vinculado_a_la_huella(proyecto):
    paquete = story_publication.export(proyecto)
    propuesta = story_publication.plan(proyecto)
    destino = propuesta['destinos'][0]
    assert propuesta['modo'] == 'simulacion' and paquete.endswith(propuesta['huella_lote'][:16])
    assert destino['id'] == 'short' and destino['perfil'] == 'es' and destino['channel_id'] == CANAL
    assert destino['metodo'] == 'YouTube Data API' and destino['estado'] == 'pendiente_de_autorizacion'
    assert destino['sha256'] == sha_file(proyecto / 'salida' / 'short.mp4')
    assert destino['body']['snippet']['defaultLanguage'] == 'es' and destino['body']['status']['containsSyntheticMedia'] is True
    assert destino['evidencia_uso'] == {'m1': {'uso': 'música', 'licencia': 'CC0', 'url': 'https://example.invalid/musica', 'tramo': 'completo'}}
    nombres = {f.name for f in (proyecto / 'para-subir' / propuesta['huella_lote'][:16]).iterdir()}
    assert {'short.mp4', 'short-portada.jpg', 'short.srt', 'short-publicacion.txt', 'publicacion.json', 'LEEME.txt'} == nombres
    srt = (proyecto / 'para-subir' / propuesta['huella_lote'][:16] / 'short.srt').read_text(encoding='utf-8')
    assert '00:00:00,000 --> 00:00:00,900' in srt and 'Una sola persona.' in srt


def test_exportar_dos_veces_da_la_misma_huella(proyecto):
    story_publication.export(proyecto)
    primera = story_publication.plan(proyecto)['huella_lote']
    story_publication.export(proyecto)
    assert story_publication.plan(proyecto)['huella_lote'] == primera


def test_cambiar_metadatos_o_el_paquete_invalida_la_propuesta(proyecto):
    paquete = story_publication.export(proyecto)
    ajustar(proyecto, titulo='Otro título')
    with pytest.raises(ClipError, match='vuelve a exportar'):
        story_publication.plan(proyecto)
    ajustar(proyecto, titulo='Un título')
    story_publication.plan(proyecto)
    (proyecto / 'para-subir' / paquete.rsplit('\\', 1)[-1].rsplit('/', 1)[-1] / 'short.mp4').write_bytes(b'manipulado')
    with pytest.raises(ClipError, match='vuelve a exportar'):
        story_publication.plan(proyecto)


def test_una_huella_erronea_no_sube_nada(proyecto, sesion):
    story_publication.export(proyecto)
    with pytest.raises(ClipError, match='huella'):
        story_publication.execute(proyecto, 'otra-huella')
    assert sesion.subidas == 0


def test_publicar_sube_una_vez_y_registra_el_resultado(proyecto, sesion):
    story_publication.export(proyecto)
    huella = story_publication.plan(proyecto)['huella_lote']
    resultado = story_publication.execute(proyecto, huella)
    assert resultado['destinos'][0] == {'id': 'short', 'estado': 'publicado', 'video_id': 'video-demo'}
    assert sesion.subidas == 1 and sesion.portadas == 1
    assert sesion.cuerpos[0]['snippet']['title'] == 'Un título' and sesion.cuerpos[0]['status']['privacyStatus'] == 'public'
    registro = next(iter(read_json(proyecto / 'publicaciones.json')['historias'].values()))
    assert registro['url'] == 'https://www.youtube.com/watch?v=video-demo' and registro['formato'] == 'short'
    repetido = story_publication.execute(proyecto, huella)
    assert repetido['destinos'][0]['ya_publicado'] is True and sesion.subidas == 1 and sesion.portadas == 1


def test_sin_auditoria_confirmada_lo_publico_va_a_mano(proyecto, sesion, credenciales):
    perfil = credenciales / 'perfiles' / 'es' / 'perfil.json'
    perfil.write_text(json.dumps({**read_json(perfil), 'auditoria_youtube': 'pendiente'}), encoding='utf-8')
    story_publication.export(proyecto)
    huella = story_publication.plan(proyecto)['huella_lote']
    assert story_publication.execute(proyecto, huella)['destinos'][0]['estado'] == 'requiere_subida_manual'
    assert sesion.subidas == 0
    item = story_publication.manual_result(proyecto, 'short', 'publicado', CANAL, 'https://youtu.be/manual')
    assert item['estado'] == 'publicado'
    with pytest.raises(ClipError, match='canal'):
        story_publication.manual_result(proyecto, 'short', 'publicado', 'UCotro', 'https://youtu.be/manual')


def test_el_perfil_solo_admite_espanol(credenciales):
    from publicacion import youtube_profiles
    with pytest.raises(ClipError):
        youtube_profiles.profile_root('en')


def test_las_credenciales_no_pueden_vivir_en_el_repo(proyecto, monkeypatch):
    from publicacion import core, youtube_profiles
    monkeypatch.setenv('ELGATOMISTA_CREDENCIALES', str(core.ROOT / '.runtime' / 'claves'))
    with pytest.raises(ClipError, match='fuera de OneDrive'):
        youtube_profiles.profile_root('es')


def ejecutar(*argumentos):
    return cli.run(cli.parser().parse_args(list(argumentos)))


def test_publicar_antes_de_exportar_da_un_mensaje_claro(proyecto):
    with pytest.raises(ClipError, match='exportar'):
        ejecutar('publicar', 'demo')


def test_el_cli_exporta_simula_y_exige_la_huella(proyecto, sesion):
    assert ejecutar('exportar', 'demo')['carpeta']
    huella = ejecutar('publicar', 'demo')['huella_lote']
    assert sesion.subidas == 0
    with pytest.raises(ClipError):
        ejecutar('publicar', 'demo', '--ejecutar', '--confirmacion-lote', 'mala')
    with pytest.raises(ClipError):
        ejecutar('publicar', 'demo', '--ejecutar')
    assert sesion.subidas == 0
    assert ejecutar('publicar', 'demo', '--ejecutar', '--confirmacion-lote', huella)['destinos'][0]['estado'] == 'publicado'
    assert sesion.subidas == 1


def test_el_cli_no_acepta_proyectos_fuera_de_la_carpeta(proyecto):
    with pytest.raises(ClipError):
        ejecutar('exportar', '..')
    with pytest.raises(ClipError):
        ejecutar('exportar', 'no-existe')


def test_la_plantilla_sin_rellenar_no_se_puede_exportar(proyecto):
    plantilla = read_json(Path(__file__).parents[2] / 'plantillas' / 'proyecto' / 'publicacion.json')
    assert set(plantilla['formatos']) == {'short', 'largo'}
    datos = {'perfil': plantilla['perfil'], 'formatos': {'short': {**plantilla['formatos']['short'], 'contains_synthetic_media': True}}}
    (proyecto / 'publicacion.json').write_text(json.dumps(datos), encoding='utf-8')
    with pytest.raises(ClipError, match='sin < ni >'):
        story_publication.export(proyecto)
