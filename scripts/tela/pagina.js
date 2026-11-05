// redesenha a página inteira com o estado atual
import { estado } from '../estado.js?v=20261104223454';
import { meus, todos } from '../../times/index.js?v=20261104223454';
import { esc } from '../utilidades/html.js?v=20261104223454';
import { fmtDiaLongo, hora } from '../utilidades/datas.js?v=20261104223454';
import { separar } from '../dados/jogos.js?v=20261104223454';
import { desenharHoje } from './hoje.js?v=20261104223454';
import { desenharTimes } from './times.js?v=20261104223454';
import { desenharClassificacao } from './classificacao.js?v=20261104223454';
import { desenharProximos } from './proximos.js?v=20261104223454';
import { desenharResultados } from './resultados.js?v=20261104223454';

let timerEntrada = null;

export function desenhar() {
  const { doDia, proximos, resultados } = separar();
  const temDados = estado.eventos.size > 0;

  const dataHoje = document.querySelector('#data-hoje');
  if (dataHoje) dataHoje.textContent = fmtDiaLongo.format(new Date());

  // o fundo inteiro ganha a cor do time escolhido; o brilho controla a força do gradiente
  const tema = estado.filtro === 'todos' ? todos : meus.get(estado.filtro);
  document.documentElement.style.setProperty('--tema', tema.cor);
  document.documentElement.style.setProperty('--brilho', tema.brilho);
  // na home (todos) os títulos ficam brancos; só ganham cor quando um time é escolhido
  document.documentElement.dataset.filtro = estado.filtro === 'todos' ? 'todos' : 'time';

  const at = document.querySelector('#atualizado') || {};
  if (estado.erro) at.innerHTML = `<span class="aviso">${esc(estado.erro)}${estado.ultimaAtualizacao ? ` · dados das ${esc(hora(estado.ultimaAtualizacao))}` : ''}</span>`;
  else if (estado.ultimaAtualizacao) at.textContent = `atualizado ${hora(estado.ultimaAtualizacao)}`;

  if (estado.animarEntrada) {
    document.body.classList.add('entrando');
    clearTimeout(timerEntrada);
    timerEntrada = setTimeout(() => document.body.classList.remove('entrando'), 1400);
    estado.animarEntrada = false;
  }

  // cada parte desenha sozinha: se uma der erro, as outras continuam aparecendo
  const partes = [
    () => desenharHoje(doDia, proximos[0]),
    () => desenharTimes(),
    () => desenharClassificacao(),
    () => desenharProximos(proximos, temDados),
    () => desenharResultados(resultados, temDados),
  ];
  for (const parte of partes) {
    try { parte(); } catch (erro) { console.error('falha ao desenhar uma parte da página', erro); }
  }
}
