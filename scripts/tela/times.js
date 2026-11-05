// cards de "meus times" (servem de filtro): nome, dia/hora e contra quem joga
import { estado } from '../estado.js';
import { times, todos } from '../../times/index.js';
import { esc, escudo, nomeTodo } from '../utilidades/html.js';
import { hora, diaRelativo } from '../utilidades/datas.js';
import { proximoDe } from '../dados/jogos.js';

export function desenharTimes() {
  const cards = [`
    <button class="chip chip-todos ${estado.filtro === 'todos' ? 'chip-ativo' : ''}" data-time="todos" type="button" style="--cor:${todos.cor};--i:0" aria-pressed="${estado.filtro === 'todos'}">
      <span class="chip-nome">todos</span>
      <span class="chip-sub">${times.length} times</span>
    </button>`];

  times.forEach((t, i) => {
    const p = proximoDe(t.id);
    const rival = p ? (p.casa.id === t.id ? p.fora : p.casa) : null;
    const quando = !p ? 'sem jogo marcado'
      : p.estado === 'in' ? `<b class="ponto-vivo"></b>ao vivo · ${esc(p.casa.placar ?? 0)} – ${esc(p.fora.placar ?? 0)}`
        : `${esc(diaRelativo(p.data))} · ${esc(hora(p.data))}`;
    cards.push(`
      <button class="chip ${estado.filtro === t.id ? 'chip-ativo' : ''}" data-time="${t.id}" type="button" style="--cor:${t.cor};--i:${i + 1}" aria-pressed="${estado.filtro === t.id}">
        <img class="escudo" src="https://a.espncdn.com/i/teamlogos/soccer/500-dark/${t.id}.png" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/${t.id}.png'" alt="" width="34" height="34">
        <span class="chip-texto">
          <span class="chip-nome">${esc(t.nome)}</span>
          <span class="chip-sub">${quando}</span>
          ${rival ? `<span class="chip-rival"><i>x</i>${escudo(rival, 16)}<span>${esc(nomeTodo(rival))}</span></span>` : ''}
        </span>
      </button>`);
  });
  document.querySelector('#filtros').innerHTML = cards.join('');
}

// filtro rápido no topo da home: todos + os 4 times, cada um com escudo e nome curto
export function desenharFiltroTopo() {
  const opcao = (id, cor, conteudo, rotulo) => `
    <button class="filtro-opcao ${estado.filtro === id ? 'filtro-ativo' : ''}" data-time="${id}" type="button"
            style="--cor:${cor}" aria-pressed="${estado.filtro === id}" aria-label="${esc(rotulo)}">${conteudo}</button>`;
  const icone = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>';
  document.querySelector('#filtro-topo').innerHTML =
    opcao('todos', todos.cor, `${icone}<span>todos</span>`, 'todos os times')
    + times.map((t) => opcao(t.id, t.cor,
      `<img class="escudo" src="https://a.espncdn.com/i/teamlogos/soccer/500-dark/${t.id}.png" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/${t.id}.png'" alt="" width="22" height="22"><span>${esc(t.curto || t.nome)}</span>`,
      t.nome)).join('');
}
