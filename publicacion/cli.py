from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .core import ClipError, project_lock, project_path

PROFILES = ['es']
FORMATS = ['short', 'largo']


def parser():
    p = argparse.ArgumentParser(description='Exportar y publicar en YouTube los vídeos con la PUERTA 2 aprobada.')
    commands = p.add_subparsers(dest='command', required=True)
    upload = commands.add_parser('subir', help='Orden de Mario: aprueba, exporta y sube a YouTube, Instagram y la bandeja de TikTok, sin huellas')
    upload.add_argument('proyecto')
    upload.add_argument('--orden', required=True, help='Palabras literales de Mario en el chat; quedan anotadas en reviews/puerta-2.md')
    upload.add_argument('--solo', action='append', choices=['youtube', 'instagram', 'tiktok'], help='Solo esa red, si Mario lo pide (repetible); por defecto, todas')
    export = commands.add_parser('exportar', help='Generar el paquete de subida de los vídeos aprobados')
    export.add_argument('proyecto')
    commands.add_parser('redes-estado', help='Estado de las credenciales y conexiones de TikTok e Instagram (sin mostrar valores)')
    commands.add_parser('tiktok-conectar', help='Autorización OAuth de TikTok (video.upload); abre el navegador y guarda el token fuera del repo')
    ig_login = commands.add_parser('instagram-conectar', help='Autorización de Meta (Facebook Login for Business); abre el navegador')
    ig_login.add_argument('--usuario', help='Usuario de Instagram, solo si hay varias cuentas posibles')
    ig_login.add_argument('--pagina', help='ID de la página de Facebook, si /me/accounts no la lista (páginas de un porfolio empresarial)')
    ig_account = commands.add_parser('instagram-cuenta', help='Elegir la cuenta de Instagram con el token de Meta ya guardado (sin abrir el navegador)')
    ig_account.add_argument('--usuario')
    ig_account.add_argument('--pagina')
    login = commands.add_parser('youtube-conectar', help='OAuth de un perfil de canal; abre la autorización de Google')
    login.add_argument('credenciales', type=Path)
    login.add_argument('--perfil', required=True, choices=PROFILES)
    login.add_argument('--canal-id')
    profile = commands.add_parser('youtube-perfil', help='Registrar el canal real y la evidencia de auditoría de un perfil')
    profile.add_argument('--perfil', required=True, choices=PROFILES)
    profile.add_argument('--canal-id', required=True)
    profile.add_argument('--nombre', default='')
    profile.add_argument('--auditoria', choices=['pendiente', 'confirmada'])
    profile.add_argument('--evidencia', default='')
    pub = commands.add_parser('publicar', help='Mostrar la propuesta con su huella; --ejecutar --confirmacion-lote la envía')
    pub.add_argument('proyecto')
    pub.add_argument('--confirmacion-lote', help='Huella exacta del lote autorizada por Mario en el chat')
    pub.add_argument('--ejecutar', action='store_true')
    pub.add_argument('--probar-publica', action='store_true', help='Hasta confirmar la auditoría de la API: sube en público por API una sola vez y lee el estado que YouTube le da')
    outcome = commands.add_parser('publicacion-resultado', help='Anotar el resultado de una subida manual revisada')
    outcome.add_argument('proyecto')
    outcome.add_argument('formato', choices=FORMATS)
    outcome.add_argument('estado', choices=['publicado', 'fallido', 'incierto'])
    outcome.add_argument('--cuenta', required=True)
    outcome.add_argument('--resultado')
    outcome.add_argument('--nota', default='')
    return p


def run(args):
    name = args.command
    if name == 'youtube-perfil':
        from .youtube_profiles import configure
        return configure(args.perfil, args.canal_id, args.nombre, args.auditoria, args.evidencia)
    if name == 'youtube-conectar':
        from .youtube_profiles import connect
        return connect(args.credenciales, args.perfil, args.canal_id)
    if name == 'redes-estado':
        from .redes import status
        return status()
    if name == 'tiktok-conectar':
        from .tiktok import connect
        return connect()
    if name == 'instagram-conectar':
        from .instagram import connect
        return connect(args.usuario, page_id=args.pagina)
    if name == 'instagram-cuenta':
        from .instagram import resolve
        return resolve(args.usuario, args.pagina)
    from .story_publication import execute, export, manual_result, plan
    project = project_path(args.proyecto)
    with project_lock(project):
        if name == 'subir':
            from .subir import NETWORKS, subir
            return subir(project, args.orden, args.solo or NETWORKS)
        if name == 'exportar':
            return {'carpeta': export(project)}
        if name == 'publicar':
            if args.probar_publica and not args.ejecutar:
                raise ClipError('--probar-publica solo se usa con --ejecutar y la huella autorizada por Mario.')
            return execute(project, args.confirmacion_lote, args.probar_publica) if args.ejecutar else plan(project)
        if name == 'publicacion-resultado':
            return manual_result(project, args.formato, args.estado, args.cuenta, args.resultado, args.nota)
    raise ClipError('Comando desconocido.')


def main():
    try:
        data = run(parser().parse_args())
        if data is not None:
            print(json.dumps(data, ensure_ascii=False, indent=2))
    except (ClipError, OSError, ValueError) as error:
        print('Error: ' + str(error), file=sys.stderr)
        raise SystemExit(1)
    except KeyError as error:
        print('Error: falta el campo ' + str(error) + ' en un fichero del proyecto.', file=sys.stderr)
        raise SystemExit(1)


if __name__ == '__main__':
    main()
