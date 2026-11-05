"""servidor do meus jogos.

- serve o site sem cache (toda mudança aparece na hora)
- POST /api/salvar/<time>  -> grava os jogos do time em times/<time>/jogos.json

uso: python servidor.py   (abre em http://localhost:5198)
não precisa instalar nada: só python.

no render: a porta vem da variável PORT (definida pelo render) e o servidor escuta em 0.0.0.0.
lá o /api/salvar fica desligado, porque o site é público e o disco do render é temporário.
"""
import json
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

pasta = Path(__file__).resolve().parent
online = 'PORT' in os.environ  # PORT e RENDER são variáveis do próprio render, por isso maiúsculas
porta = int(os.environ.get('PORT', 5198))
endereco = '0.0.0.0' if online else '127.0.0.1'
salvar_ligado = not os.environ.get('RENDER')
times_validos = {'flamengo', 'manchester-city', 'real-madrid', 'borussia-dortmund'}


class Manipulador(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_head(self):
        # não entrega arquivos internos: .git, .gitignore, código python, cache do python
        partes = [p for p in self.path.split('?')[0].split('/') if p]
        if any(p.startswith('.') or p == '__pycache__' for p in partes) or self.path.split('?')[0].endswith('.py'):
            self.send_error(404)
            return None
        return super().send_head()

    def log_message(self, formato, *args):
        if '/api/' in self.path:
            super().log_message(formato, *args)

    def ler_corpo(self, limite):
        tamanho = int(self.headers.get('Content-Length') or 0)
        if tamanho <= 0 or tamanho > limite:
            return None
        return self.rfile.read(tamanho)

    def responder(self, codigo, corpo=b'', tipo='text/plain; charset=utf-8'):
        self.send_response(codigo)
        self.send_header('Content-Type', tipo)
        self.send_header('Content-Length', str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def do_POST(self):
        if self.path.startswith('/api/salvar/'):
            if not salvar_ligado:
                return self.responder(403, b'salvar desligado no site online')
            nome = self.path.rsplit('/', 1)[-1]
            if nome not in times_validos:
                return self.responder(404, b'time desconhecido')
            corpo = self.ler_corpo(2_000_000)
            try:
                dados = json.loads(corpo or b'')
            except ValueError:
                return self.responder(400, b'json invalido')
            destino = pasta / 'times' / nome / 'jogos.json'
            destino.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
            return self.responder(204)

        self.responder(404, b'rota desconhecida')


if __name__ == '__main__':
    servidor = ThreadingHTTPServer((endereco, porta), partial(Manipulador, directory=str(pasta)))
    print(f'meus jogos no ar: http://localhost:{porta}', flush=True)
    servidor.serve_forever()
