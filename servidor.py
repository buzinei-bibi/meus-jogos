"""servidor do meus jogos.

- serve o site sem cache (toda mudança aparece na hora)
- POST /api/voz            -> transforma texto em fala com voz neural humana (edge-tts, de graça)
- POST /api/salvar/<time>  -> grava os jogos do time em times/<time>/jogos.json

uso: python servidor.py   (abre em http://localhost:5198)
precisa de: pip install edge-tts
"""
import asyncio
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

pasta = Path(__file__).resolve().parent
porta = 5198
voz = 'pt-BR-AntonioNeural'  # outras: pt-BR-FranciscaNeural, pt-BR-ThalitaMultilingualNeural
times_validos = {'flamengo', 'manchester-city', 'real-madrid', 'borussia-dortmund'}
limite_texto = 2000
cache_voz = {}


async def gerar_fala(texto):
    import edge_tts
    fala = edge_tts.Communicate(texto, voz, rate='+6%')
    audio = b''
    async for parte in fala.stream():
        if parte['type'] == 'audio':
            audio += parte['data']
    return audio


class Manipulador(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

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
        if self.path == '/api/voz':
            corpo = self.ler_corpo(limite_texto * 4)
            if not corpo:
                return self.responder(400, b'texto vazio ou grande demais')
            texto = corpo.decode('utf-8', 'replace').strip()[:limite_texto]
            try:
                if texto not in cache_voz:
                    if len(cache_voz) > 30:
                        cache_voz.clear()
                    cache_voz[texto] = asyncio.run(gerar_fala(texto))
                return self.responder(200, cache_voz[texto], 'audio/mpeg')
            except Exception as erro:  # sem internet, edge-tts fora do ar etc.
                return self.responder(503, f'voz indisponível: {erro}'.encode('utf-8'))

        if self.path.startswith('/api/salvar/'):
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
    servidor = ThreadingHTTPServer(('127.0.0.1', porta), partial(Manipulador, directory=str(pasta)))
    print(f'meus jogos no ar: http://localhost:{porta}')
    servidor.serve_forever()
