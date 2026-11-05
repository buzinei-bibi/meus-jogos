# MEUS JOGOS

agenda diária do flamengo, manchester city, real madrid e borussia dortmund: jogos de hoje com placar ao vivo, próximos jogos e últimos resultados. dados da api pública da espn. custo zero.

## como abrir

```bash
python servidor.py
```

depois é só abrir http://localhost:5198

## pastas

```
MEUS JOGOS/
├── index.html            a página
├── servidor.py           serve o site e salva os jogos de cada time
├── imagens/logo.svg      a logo (bola + ponto de ao vivo)
├── estilos/
│   ├── base.css          cores, fontes, topo, botões e títulos
│   ├── fundo.css         gradiente que muda com a cor do time
│   ├── hoje.css          cards dos jogos de hoje
│   ├── times.css         cards de "meus times"
│   ├── listas.css        próximos jogos e últimos resultados
│   └── responsivo.css    tablet e celular
├── scripts/
│   ├── principal.js      ponto de partida: botões e atualização automática
│   ├── estado.js         filtro escolhido e jogos na memória
│   ├── dados/
│   │   ├── espn.js       busca os jogos na espn
│   │   ├── jogos.js      regras: hoje, próximos, resultados, vitória/empate/derrota
│   │   ├── competicoes.js nomes das competições em português
│   │   └── arquivo.js    manda os jogos de cada time pro jogos.json da pasta dele
│   ├── tela/             desenha cada parte da página
│   └── utilidades/       datas e pedacinhos de html
└── times/
    ├── index.js          junta os 4 times
    ├── flamengo/         time.js (id e cor) + jogos.json (atualizado sozinho)
    ├── manchester-city/
    ├── real-madrid/
    └── borussia-dortmund/
```
