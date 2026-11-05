// cards dos jogos de hoje (placar em formato de tv: um time por linha)
import { estado } from '../estado.js';
import { meus } from '../../times/index.js';
import { esc, escudo, nomeTodo, trocarHtml } from '../utilidades/html.js';
import { hora, falta, diaRelativo } from '../utilidades/datas.js';
import { resultadoPara, situacaoTexto, foraDoAr, corDe, ligaTexto } from '../dados/jogos.js';

function cartao(e, i) {
  const vivo = e.estado === 'in';
  const fim = e.estado === 'post';
  const temPlacar = (vivo || fim) && e.casa.placar != null;

  // descobre de qual lado saiu gol desde a última vez, pra animar só aquele número
  const antes = (estado.placarVisto.get(e.id) || '').split('-');
  const viuAntes = estado.placarVisto.has(e.id);
  const golCasa = temPlacar && viuAntes && antes[0] !== String(e.casa.placar);
  const golFora = temPlacar && viuAntes && antes[1] !== String(e.fora.placar);
  if (temPlacar) estado.placarVisto.set(e.id, `${e.casa.placar}-${e.fora.placar}`);

  const res = fim ? e.meus.map((id) => resultadoPara(e, id)).find(Boolean) : null;
  // jogo encerrado: só times, competição e placar (sem selo)
  const selo = vivo
    ? `<span class="selo selo-vivo"><b></b>ao vivo · ${esc(situacaoTexto(e))}</span>`
    : fim ? ''
      : `<span class="selo selo-falta">${esc(foraDoAr(e) ? situacaoTexto(e) : `${hora(e.data)} · ${falta(e.data)}`)}</span>`;

  const linhaTime = (l, gol) => `
    <div class="pt-linha ${meus.has(l.id) ? 'time-meu' : ''} ${fim && l.venceu ? 'pt-venceu' : ''} ${fim && !l.venceu && res !== 'e' ? 'pt-perdeu' : ''}">
      ${escudo(l, 30)}
      <span class="time-nome">${esc(nomeTodo(l))}</span>
      <span class="pt-gols ${gol ? 'placar-gol' : ''}">${temPlacar ? esc(l.placar) : ''}${l.penaltis != null ? `<small>(${esc(l.penaltis)})</small>` : ''}</span>
    </div>`;

  return `
    <a class="cartao ${vivo ? 'cartao-vivo' : ''}" href="${esc(e.link)}" target="_blank" rel="noopener"
       style="--cor:${corDe(e)};--i:${i}" title="${esc([e.estadio, e.cidade].filter(Boolean).join(' · '))}">
      <div class="cartao-topo">
        <span class="liga">${esc(ligaTexto(e))}</span>
        ${selo}
      </div>
      <div class="placar-tabela">
        ${linhaTime(e.casa, golCasa)}
        ${linhaTime(e.fora, golFora)}
      </div>
    </a>`;
}

function semJogo(proximo) {
  if (!proximo) return `<div class="vazio">nenhum jogo hoje.</div>`;
  const meu = meus.get(estado.filtro !== 'todos' ? estado.filtro : proximo.meus[0]);
  return `
    <div class="vazio" style="--cor:${meu?.cor};--i:0">
      <span class="vazio-rotulo">sem jogo hoje · o próximo é</span>
      <span class="vazio-jogo">${escudo(proximo.casa, 28)} ${esc(nomeTodo(proximo.casa))} <i>x</i> ${esc(nomeTodo(proximo.fora))} ${escudo(proximo.fora, 28)}</span>
      <span class="vazio-quando">${esc(diaRelativo(proximo.data))} · ${esc(hora(proximo.data))} · ${esc(falta(proximo.data))}</span>
    </div>`;
}

export function desenharHoje(doDia, proximoJogo) {
  const alvo = document.querySelector('#hoje');
  if (doDia.length) trocarHtml(alvo, doDia.map(cartao).join(''));
  else trocarHtml(alvo, estado.eventos.size ? semJogo(proximoJogo) : '<div class="vazio esqueleto"></div>');
}
