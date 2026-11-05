// tabela dos próximos jogos
import { esc, escudo, nomeTodo, dataBloco, trocarHtml } from '../utilidades/html.js';
import { hora, falta } from '../utilidades/datas.js';
import { situacaoTexto, foraDoAr, corDe } from '../dados/jogos.js';
import { meus } from '../../times/index.js';

export function ladoDoJogo(l, pos, tam = 22) {
  const meu = meus.has(l.id) ? 'lado-meu' : '';
  return pos === 'casa'
    ? `<span class="lado lado-casa ${meu}"><span class="lado-nome">${esc(nomeTodo(l))}</span>${escudo(l, tam)}</span>`
    : `<span class="lado ${meu}">${escudo(l, tam)}<span class="lado-nome">${esc(nomeTodo(l))}</span></span>`;
}

function linha(e, i) {
  return `
    <a class="linha" href="${esc(e.link)}" target="_blank" rel="noopener" style="--cor:${corDe(e)};--i:${i}">
      ${dataBloco(e.data)}
      <span class="linha-hora">${esc(foraDoAr(e) ? situacaoTexto(e) : hora(e.data))}</span>
      <span class="linha-jogo">${ladoDoJogo(e.casa, 'casa')}<span class="linha-x">x</span>${ladoDoJogo(e.fora, 'fora')}</span>
      <span class="linha-liga"><span>${esc(e.liga)}</span><small>${esc(falta(e.data))}</small></span>
    </a>`;
}

export function desenharProximos(lista, temDados) {
  const alvo = document.querySelector('#proximos');
  if (!temDados) { trocarHtml(alvo, ''); return; }
  trocarHtml(alvo, lista.length
    ? `<div class="painel-cabeca cabeca-agenda"><span>data</span><span>hora</span><span>jogo</span><span>campeonato</span></div>
       ${lista.map(linha).join('')}`
    : '<div class="painel-vazio">nenhum jogo marcado por enquanto.</div>');
}
