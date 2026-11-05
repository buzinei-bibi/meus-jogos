// tabela dos últimos resultados
import { estado } from '../estado.js?v=20261104223454';
import { esc, dataBloco } from '../utilidades/html.js?v=20261104223454';
import { resultadoPara, nomeResultado, corDe } from '../dados/jogos.js?v=20261104223454';
import { ladoDoJogo } from './proximos.js?v=20261104223454';

function linha(e, i) {
  const meuId = estado.filtro !== 'todos' ? estado.filtro : e.meus[0];
  const r = resultadoPara(e, meuId);
  return `
    <a class="resultado" href="${esc(e.link)}" target="_blank" rel="noopener" style="--cor:${corDe(e)};--i:${i}">
      ${dataBloco(e.data)}
      <span class="res-jogo">${ladoDoJogo(e.casa, 'casa')}<span class="res-placar"><span class="gol-casa">${esc(e.casa.placar)}</span><i>–</i><span class="gol-fora">${esc(e.fora.placar)}</span></span>${ladoDoJogo(e.fora, 'fora')}</span>
      <span class="res-liga">${esc(e.liga)}</span>
      <span class="res-letra res-${r}" title="${nomeResultado[r] || ''}" aria-label="${nomeResultado[r] || ''}">${esc(r || '')}</span>
    </a>`;
}

export function desenharResultados(lista, temDados) {
  const alvo = document.querySelector('#resultados');
  if (!temDados) { alvo.innerHTML = ''; return; }
  alvo.innerHTML = lista.length
    ? `<div class="painel-cabeca cabeca-resultados"><span>data</span><span>jogo</span><span>campeonato</span><span></span></div>
       ${lista.map(linha).join('')}`
    : '<div class="painel-vazio">sem resultados recentes.</div>';
}
