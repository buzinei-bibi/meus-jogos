// estado compartilhado entre as partes do site
import { meus } from '../times/index.js';

export function ler(chave) {
  try { return localStorage.getItem(chave); } catch { return null; }
}
export function gravar(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch { /* sem storage, segue */ }
}

const filtroSalvo = ler('meus-jogos:filtro') || 'todos';

export const estado = {
  eventos: new Map(),       // todos os jogos conhecidos, por id da espn
  placarVisto: new Map(),   // último placar mostrado, pra piscar quando sai gol
  filtro: filtroSalvo === 'todos' || meus.has(filtroSalvo) ? filtroSalvo : 'todos',
  ultimaAtualizacao: null,
  erro: null,
  animarEntrada: true,
};

export function trocarFiltro(id) {
  estado.filtro = id;
  estado.animarEntrada = true;
  gravar('meus-jogos:filtro', id);
}
