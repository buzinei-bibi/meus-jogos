// meus jogos — ponto de partida: liga os botões e mantém tudo atualizado
import { estado, trocarFiltro } from './estado.js';
import { buscarTudo, carregarCache } from './dados/espn.js';
import { temJogoQuente } from './dados/jogos.js';
import { salvarPorTime } from './dados/arquivo.js';
import { desenhar } from './tela/pagina.js';
import { falar } from './voz/narrador.js';

let timerBusca = null;
let primeiraBusca = true;

async function atualizar() {
  clearTimeout(timerBusca);
  document.body.classList.add('buscando');
  try {
    await buscarTudo();
    salvarPorTime(); // grava times/<time>/jogos.json (sem travar a tela)
  } catch (e) {
    estado.erro = e.message || 'falha ao buscar os jogos';
  }
  document.body.classList.remove('buscando');
  if (primeiraBusca) { estado.animarEntrada = true; primeiraBusca = false; } // entrada animada com os dados frescos
  desenhar();
  // com jogo rolando (ou pra começar) atualiza a cada 30s; senão, a cada 5 min
  timerBusca = setTimeout(atualizar, temJogoQuente() ? 30e3 : 5 * 6e4);
}

document.querySelector('#filtros').addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-time]');
  if (!b || b.dataset.time === estado.filtro) return;
  trocarFiltro(b.dataset.time);
  desenhar();
});
document.querySelector('#atualizar').addEventListener('click', atualizar);
document.querySelector('#ouvir').addEventListener('click', falar);
document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
setInterval(desenhar, 30e3); // contagens regressivas andam mesmo sem buscar

carregarCache();
desenhar();
atualizar();
