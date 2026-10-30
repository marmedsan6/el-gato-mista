from pathlib import Path
import pytest
from publicacion.core import ClipError, read_json, write_json
from publicacion.youtube_upload import publication_body, upload_resumable


class Response:
    def __init__(self, status, headers=None, payload=None):
        self.status_code = status
        self.headers = headers or {}
        self.payload = payload or {}
    def json(self):
        return self.payload


class Session:
    def __init__(self, responses):
        self.responses = iter(responses)
        self.posts, self.puts = 0, 0
    def post(self, *args, **kwargs):
        self.posts += 1
        return Response(200, {'Location': 'https://upload.invalid/session'})
    def put(self, *args, **kwargs):
        self.puts += 1
        response = next(self.responses)
        if isinstance(response, Exception):
            raise response
        return response


def test_publication_does_not_guess_child_audience():
    with pytest.raises(ClipError):
        publication_body({'titulo': 'Un clip'})
    data = publication_body({'titulo': 'Un clip', 'made_for_kids': False})
    assert data['status']['privacyStatus'] == 'private'
    with pytest.raises(ClipError):
        publication_body({'titulo': 'Un clip', 'made_for_kids': False}, 'public', '2030-01-01T18:00:00')


def test_lost_final_response_resumes_without_duplicate_upload(tmp_path):
    video = tmp_path / 'clip.mp4'
    video.write_bytes(b'demo' * 100)
    checkpoint = tmp_path / 'session.json'
    session = Session([Response(308), ConnectionError('se perdió la respuesta final'), Response(200, payload={'id': 'video-demo'})])
    assert upload_resumable(session, video, {}, checkpoint, pause=lambda _: None) == 'video-demo'
    assert session.posts == 1
    assert read_json(checkpoint)['estado'] == 'completado'
    assert upload_resumable(session, video, {}, checkpoint, pause=lambda _: None) == 'video-demo'
    assert session.posts == 1 and session.puts == 3


def test_restart_checks_saved_session_before_sending_new_bytes(tmp_path):
    video = tmp_path / 'clip.mp4'
    video.write_bytes(b'demo')
    checkpoint = tmp_path / 'session.json'
    write_json(checkpoint, {'uri': 'https://upload.invalid/existing', 'estado': 'subiendo'})
    session = Session([Response(200, payload={'id': 'already-complete'})])
    assert upload_resumable(session, video, {}, checkpoint, pause=lambda _: None) == 'already-complete'
    assert session.posts == 0 and session.puts == 1


def test_uncertain_creation_is_not_repeated(tmp_path):
    video = tmp_path / 'clip.mp4'
    video.write_bytes(b'demo')
    checkpoint = tmp_path / 'session.json'
    write_json(checkpoint, {'estado': 'creacion-incierta'})
    session = Session([])
    with pytest.raises(ClipError):
        upload_resumable(session, video, {}, checkpoint, pause=lambda _: None)
    assert session.posts == 0
