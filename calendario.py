"""gera o calendario.ics com os jogos dos meus times (pra assinar no celular).

- próximos jogos dos 4 times, com campeonato e estádio
- resultados dos últimos 21 dias, com o placar no título
- cada jogo tem um lembrete 1 hora antes

roda sozinho no github (.github/workflows/calendario.yml) algumas vezes por dia.
na mão: python calendario.py   (só usa o que já vem com o python)
"""
import json
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

pasta = Path(__file__).resolve().parent
saida = pasta / 'calendario.ics'
base = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams'

# mesmos times do site (times/<time>/time.js)
times = {'819': 'Flamengo', '382': 'Manchester City', '86': 'Real Madrid', '124': 'Borussia Dortmund'}

ligas = {
    'bra.1': 'Brasileirão', 'bra.copa_do_brazil': 'Copa do Brasil', 'bra.camp.carioca': 'Carioca',
    'conmebol.libertadores': 'Libertadores', 'conmebol.recopa': 'Recopa', 'bra.supercopa_do_brazil': 'Supercopa do Brasil',
    'eng.1': 'Premier League', 'eng.fa': 'Copa da Inglaterra', 'eng.league_cup': 'Copa da Liga Inglesa',
    'eng.charity': 'Supercopa da Inglaterra', 'esp.1': 'La Liga', 'esp.copa_del_rey': 'Copa do Rei',
    'esp.super_cup': 'Supercopa da Espanha', 'ger.1': 'Bundesliga', 'ger.dfb_pokal': 'Copa da Alemanha',
    'ger.super_cup': 'Supercopa da Alemanha', 'uefa.champions': 'Champions League', 'uefa.super_cup': 'Supercopa da UEFA',
    'fifa.cwc': 'Mundial de Clubes', 'fifa.intercontinental_cup': 'Intercontinental', 'club.friendly': 'Amistoso',
}

agora = datetime.now(timezone.utc)
limite_resultados = agora - timedelta(days=21)


def pegar(url):
    pedido = urllib.request.Request(url, headers={'User-Agent': 'meus-jogos-calendario'})
    with urllib.request.urlopen(pedido, timeout=30) as r:
        return json.load(r)


def placar(c):
    s = c.get('score')
    if isinstance(s, dict):
        return s.get('displayValue')
    return s


def texto_ics(t):
    return str(t).replace('\\', '\\\\').replace(';', '\\;').replace(',', '\\,').replace('\n', '\\n')


def dobrar(linha):
    # o formato ics pede linhas de no máximo 75 bytes; o resto continua na linha de baixo com um espaço
    bruto = linha.encode('utf-8')
    if len(bruto) <= 75:
        return linha
    partes, atual = [], b''
    for ch in linha:
        b = ch.encode('utf-8')
        if len(atual) + len(b) > (75 if not partes else 74):
            partes.append(atual.decode('utf-8'))
            atual = b''
        atual += b
    partes.append(atual.decode('utf-8'))
    return '\r\n '.join(partes)


eventos = {}
for time_id in times:
    for sufixo in ('?fixture=true', ''):
        try:
            dados = pegar(f'{base}/{time_id}/schedule{sufixo}')
        except Exception as erro:  # um time fora do ar não derruba o calendário inteiro
            print(f'aviso: não consegui buscar {times[time_id]}{sufixo}: {erro}')
            continue
        for e in dados.get('events', []):
            comp = (e.get('competitions') or [{}])[0]
            cs = comp.get('competitors') or []
            casa = next((c for c in cs if c.get('homeAway') == 'home'), cs[0] if cs else {})
            fora = next((c for c in cs if c.get('homeAway') == 'away'), cs[1] if len(cs) > 1 else {})
            inicio = datetime.strptime(e['date'], '%Y-%m-%dT%H:%MZ').replace(tzinfo=timezone.utc)
            estado = ((comp.get('status') or {}).get('type') or {}).get('state', 'pre')
            situacao = ((comp.get('status') or {}).get('type') or {}).get('name', '')
            if estado == 'post' and inicio < limite_resultados:
                continue  # resultado antigo demais, não polui o calendário
            liga = e.get('league') or {}
            nome_casa = (casa.get('team') or {}).get('displayName', '?')
            nome_fora = (fora.get('team') or {}).get('displayName', '?')
            if estado == 'post' and placar(casa) is not None:
                titulo = f'{nome_casa} {placar(casa)} x {placar(fora)} {nome_fora}'
            else:
                titulo = f'⚽ {nome_casa} x {nome_fora}'
            if situacao == 'STATUS_POSTPONED':
                titulo += ' (adiado)'
            local = ', '.join(p for p in [(comp.get('venue') or {}).get('fullName'), ((comp.get('venue') or {}).get('address') or {}).get('city')] if p)
            eventos[str(e['id'])] = {
                'inicio': inicio,
                'titulo': titulo,
                'campeonato': ligas.get(liga.get('slug'), liga.get('name', '')),
                'local': local,
                'link': f'https://www.espn.com/soccer/match/_/gameId/{e["id"]}',
                'pre': estado == 'pre',
            }

linhas = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//meus jogos//calendario//PT-BR', 'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH', 'X-WR-CALNAME:Meus jogos', 'X-WR-TIMEZONE:America/Sao_Paulo',
    'X-WR-CALDESC:Jogos do Flamengo, Manchester City, Real Madrid e Borussia Dortmund',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H', 'X-PUBLISHED-TTL:PT6H',
]
for eid, ev in sorted(eventos.items(), key=lambda x: x[1]['inicio']):
    fim = ev['inicio'] + timedelta(hours=2)
    linhas += [
        'BEGIN:VEVENT',
        f'UID:{eid}@meus-jogos',
        f'DTSTAMP:{ev["inicio"].strftime("%Y%m%dT%H%M%SZ")}',  # fixo por jogo: o arquivo só muda quando os jogos mudam
        f'DTSTART:{ev["inicio"].strftime("%Y%m%dT%H%M%SZ")}',
        f'DTEND:{fim.strftime("%Y%m%dT%H%M%SZ")}',
        f'SUMMARY:{texto_ics(ev["titulo"])}',
        f'DESCRIPTION:{texto_ics(ev["campeonato"] + chr(10) + ev["link"])}',
        f'LOCATION:{texto_ics(ev["local"])}',
        f'URL:{ev["link"]}',
    ]
    if ev['pre']:  # lembrete 1 hora antes, só pros jogos que ainda vão acontecer
        linhas += ['BEGIN:VALARM', 'ACTION:DISPLAY', f'DESCRIPTION:{texto_ics(ev["titulo"])}', 'TRIGGER:-PT1H', 'END:VALARM']
    linhas.append('END:VEVENT')
linhas.append('END:VCALENDAR')

saida.write_text('\r\n'.join(dobrar(l) for l in linhas) + '\r\n', encoding='utf-8', newline='')
proximos = sum(1 for e in eventos.values() if e['pre'])
print(f'calendario.ics: {proximos} próximos jogos e {len(eventos) - proximos} resultados recentes')
