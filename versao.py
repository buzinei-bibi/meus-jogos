"""carimba uma versão nova em todos os arquivos do site (?v=...).

por quê: o github pages deixa o navegador guardar cada arquivo por 10 minutos.
depois de uma atualização, o navegador misturava arquivo novo com antigo e o site
parava de rodar (só apareciam os títulos). com a versão no endereço de cada arquivo,
todo commit vira um conjunto novo e o navegador nunca mistura.

roda sozinho antes de cada commit (gancho .git/hooks/pre-commit).
na mão: python versao.py
"""
import re
import time
from pathlib import Path

pasta = Path(__file__).resolve().parent
versao = time.strftime('%Y%m%d%H%M%S')

# no index.html: estilos/*.css, scripts/principal.js e imagens
html = pasta / 'index.html'
texto = html.read_text(encoding='utf-8')
texto = re.sub(r'((?:href|src)="(?:estilos|scripts|imagens)/[^"?]+?\.(?:css|js|svg))(?:\?v=[^"]*)?"', rf'\1?v={versao}"', texto)
html.write_text(texto, encoding='utf-8')

# nos scripts: todo import de .js ganha a mesma versão (senão o navegador carrega o mesmo arquivo duas vezes)
arquivos = list((pasta / 'scripts').rglob('*.js')) + list((pasta / 'times').rglob('*.js'))
for arquivo in arquivos:
    texto = arquivo.read_text(encoding='utf-8')
    novo = re.sub(r"(from\s+'[^'?]+?\.js)(?:\?v=[^']*)?'", rf"\1?v={versao}'", texto)
    novo = re.sub(r"(import\(\s*'[^'?]+?\.js)(?:\?v=[^']*)?'", rf"\1?v={versao}'", novo)
    if novo != texto:
        arquivo.write_text(novo, encoding='utf-8')

print(f'versão {versao} carimbada em index.html e {len(arquivos)} scripts')
