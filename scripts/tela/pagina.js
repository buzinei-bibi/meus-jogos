// redesenha a página inteira com o estado atual
import { estado } from '../estado.js';
import { meus, todos } from '../../times/index.js';
import { esc } from '../utilidades/html.js';
import { fmtDiaLongo, hora } from '../utilidades/datas.js';
import { separar } from '../dados/jogos.js';
import { desenharHoje } from './hoje.js';
import { desenharTimes, desenharFiltroTopo } from './times.js';
import { desenharClassificacao } from './classificacao.js';
import { desenharProximos } from './proximos.js';
import { desenharResultados } from './resultados.js';

let timerEntrada = null;

export function desenhar() {
  const { doDia, proximos, resultados } = separar();
  const temDados = estado.eventos.size > 0;

  document.querySelector('#data-hoje').textContent = fmtDiaLongo.format(new Date());

  // o fundo inteiro ganha a cor do time escolhido; o brilho controla a força do gradiente
  const tema = estado.filtro === 'todos' ? todos : meus.get(estado.filtro);
  document.documentElement.style.setProperty('--tema', tema.cor);
  document.documentElement.style.setProperty('--brilho', tema.brilho);
  // na home (todos) os títulos ficam brancos; só ganham cor quando um time é escolhido
  document.documentElement.dataset.filtro = estado.filtro === 'todos' ? 'todos' : 'time';

  const at = document.querySelector('#atualizado');
  if (estado.erro) at.innerHTML = `<span class="aviso">${esc(estado.erro)}${estado.ultimaAtualizacao ? ` · dados das ${esc(hora(estado.ultimaAtualizacao))}` : ''}</span>`;
  else if (estado.ultimaAtualizacao) at.textContent = `atualizado ${hora(estado.ultimaAtualizacao)}`;

  if (estado.animarEntrada) {
    document.body.classList.add('entrando');
    clearTimeout(timerEntrada);
    timerEntrada = setTimeout(() => document.body.classList.remove('entrando'), 1400);
    estado.animarEntrada = false;
  }

  desenharFiltroTopo();
  desenharHoje(doDia, proximos[0]);
  desenharTimes();
  desenharClassificacao();
  desenharProximos(proximos, temDados);
  desenharResultados(resultados, temDados);
}
