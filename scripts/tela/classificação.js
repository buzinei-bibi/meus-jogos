// seção "classificação": posição de cada time no campeonato nacional.
// com um time escolhido no filtro, abre também a disputa: quem está colado na tabela (pro líder, o 2º colocado)
import { estado } from '../estado.js';
import { times } from '../../times/index.js';
import { esc, trocarHtml } from '../utilidades/html.js';
import { vizinhosNaTabela } from '../dados/classificação.js';

// "1º" com o "o" pequeno, no alto e sublinhado, como se escreve à mão
const ordinal = (n, classe = '') => `<span class="ordinal ${classe}"><span class="ordinal-num">${n}</span><span class="ordinal-o">o</span></span>`;

function escudoTime(id, logo, tam) {
  const reserva = `https://a.espncdn.com/i/teamlogos/soccer/500/${esc(id)}.png`;
  return `<img class="escudo" src="${esc(logo || reserva)}" onerror="this.src='${reserva}'" alt="" width="${tam}" height="${tam}">`;
}

function cartao(t, pos, i) {
  return `
    <a class="tabela" href="${esc(pos.link)}" target="_blank" rel="noopener" style="--cor:${t.cor};--i:${i}">
      <span class="tabela-posicao">${ordinal(pos.posicao)}</span>
      <span class="tabela-time">
        ${escudoTime(t.id, `https://a.espncdn.com/i/teamlogos/soccer/500-dark/${t.id}.png`, 24)}
        <span class="tabela-nome">${esc(t.nome)}</span>
      </span>
      <span class="tabela-liga">${esc(pos.liga)}</span>
      <span class="tabela-pontos"><b>${pos.pontos}</b> pts</span>
      <span class="tabela-campanha">${pos.jogos} j · ${pos.vitorias}v ${pos.empates}e ${pos.derrotas}d · saldo ${esc(pos.saldo)}</span>
    </a>`;
}

function disputa(t) {
  const linhas = vizinhosNaTabela(t.id);
  if (linhas.length < 2) return '';
  return `
    <div class="disputa" style="--cor:${t.cor};--i:1">
      <div class="disputa-titulo">tabela de classificação</div>
      ${linhas.map((l) => `
        <div class="disputa-linha ${l.id === t.id ? 'disputa-eu' : ''}">
          ${ordinal(l.posicao, 'ordinal-pequeno')}
          <span class="disputa-time">${escudoTime(l.id, l.logo, 22)}<span>${esc(l.nome)}</span></span>
          <span class="disputa-pontos"><b>${l.pontos}</b> pts</span>
        </div>`).join('')}
    </div>`;
}

export function desenharClassificacao() {
  const alvo = document.querySelector('#classificacao');
  const lista = times
    .filter((t) => estado.filtro === 'todos' || estado.filtro === t.id)
    .map((t) => [t, estado.posicoes.get(t.id)])
    .filter(([, pos]) => pos?.posicao);

  if (!lista.length) {
    alvo.classList.remove('classificacao-aberta');
    trocarHtml(alvo, estado.eventos.size ? '<div class="painel-vazio">classificação indisponível agora.</div>' : '');
    return;
  }

  const aberta = estado.filtro !== 'todos';
  alvo.classList.toggle('classificacao-aberta', aberta);
  trocarHtml(alvo, lista.map(([t, pos], i) => cartao(t, pos, i)).join('')
    + (aberta ? disputa(lista[0][0]) : ''));
}
