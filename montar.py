"""monta o site.js: junta todos os scripts das pastas scripts/ e times/ num arquivo só.

por quê:
- abrindo o index.html direto da pasta (file://), o navegador bloqueia scripts separados em módulos
  e o site abria só com os títulos. um arquivo único roda em qualquer lugar.
- o github pages guarda cada arquivo por 10 min no navegador; com vários arquivos ele misturava
  versões e travava. agora é um arquivo só, com a versão no endereço (site.js?v=...).

as pastas continuam organizadas pra editar: mexa em scripts/ e times/ e rode
    python montar.py
antes de testar ou commitar. o site.js é gerado — não edite ele na mão.
"""
import re
import time
from pathlib import Path

pasta = Path(__file__).resolve().parent
entrada = pasta / 'scripts' / 'principal.js'
saida = pasta / 'site.js'
versao = time.strftime('%Y%m%d%H%M%S')

re_import = re.compile(r"^import\s+(\{[^}]*\}|\w+)\s+from\s+'([^']+?)(?:\?v=[^']*)?';[ \t]*$", re.M)


def nome_modulo(caminho):
    rel = caminho.relative_to(pasta).with_suffix('')
    return 'm_' + re.sub(r'\W', '_', str(rel).replace('\\', '/'))


def resolver(base, alvo):
    return (base.parent / alvo).resolve()


ordem, vistos = [], set()


def visitar(caminho):
    if caminho in vistos:
        return
    vistos.add(caminho)
    texto = caminho.read_text(encoding='utf-8')
    for _, alvo in re_import.findall(texto):
        visitar(resolver(caminho, alvo))
    ordem.append(caminho)


visitar(entrada)

blocos = []
for caminho in ordem:
    texto = caminho.read_text(encoding='utf-8')

    def trocar_import(m):
        o_que, alvo = m.group(1), m.group(2)
        mod = nome_modulo(resolver(caminho, alvo))
        if o_que.startswith('{'):
            nomes = [n.strip() for n in o_que.strip('{} ').split(',') if n.strip()]
            nomes = [n.replace(' as ', ': ') for n in nomes]
            return f"const {{ {', '.join(nomes)} }} = {mod};"
        return f"const {o_que} = {mod}.default;"

    texto = re_import.sub(trocar_import, texto)

    exportados = re.findall(r'^export\s+(?:async\s+)?function\s+(\w+)', texto, re.M)
    exportados += re.findall(r'^export\s+(?:const|let)\s+(\w+)', texto, re.M)
    texto = re.sub(r'^export\s+(?=(?:async\s+)?function|const|let)', '', texto, flags=re.M)
    tem_padrao = re.search(r'^export\s+default\s+', texto, re.M) is not None
    texto = re.sub(r'^export\s+default\s+', 'const padrao = ', texto, flags=re.M)

    saidas = exportados + (['default: padrao'] if tem_padrao else [])
    rel = caminho.relative_to(pasta).as_posix()
    if caminho == entrada:
        blocos.append(f'// ===== {rel} =====\n{texto}')
    else:
        blocos.append(
            f'// ===== {rel} =====\nconst {nome_modulo(caminho)} = (() => {{\n{texto}\n'
            f'return {{ {", ".join(saidas)} }};\n}})();'
        )

cabecalho = (
    '// arquivo gerado por montar.py — não edite aqui.\n'
    '// o código de verdade fica em scripts/ e times/; depois de mexer, rode: python montar.py\n'
)
saida.write_text(cabecalho + "(() => {\n'use strict';\n\n" + '\n\n'.join(blocos) + '\n})();\n', encoding='utf-8')

# carimba a versão no index.html (css, imagens e o site.js)
html = pasta / 'index.html'
texto = html.read_text(encoding='utf-8')
texto = re.sub(r'((?:href|src)="(?:estilos/[^"?]+?\.css|imagens/[^"?]+?\.svg|site\.js))(?:\?v=[^"]*)?"', rf'\1?v={versao}"', texto)
html.write_text(texto, encoding='utf-8')

print(f'site.js montado com {len(ordem)} arquivos · versão {versao}')
