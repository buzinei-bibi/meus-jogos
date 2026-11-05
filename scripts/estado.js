// estado compartilhado entre as partes do site
export function ler(chave) {
  try { return localStorage.getItem(chave); } catch { return null; }
}
export function gravar(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch { /* sem storage, segue */ }
}

export const estado = {
  eventos: new Map(),       // todos os jogos conhecidos, por id da espn
  placarVisto: new Map(),   // último placar mostrado, pra piscar quando sai gol
  posicoes: new Map(),      // posição de cada time no campeonato nacional, por id do time
  tabelas: new Map(),       // tabela completa de cada liga (bra.1, eng.1...), em ordem de posição
  filtro: 'todos',          // o site sempre abre na home (todos os times)
  ultimaAtualizacao: null,
  erro: null,
  animarEntrada: true,
};

export function trocarFiltro(id) {
  estado.filtro = id;
  estado.animarEntrada = true;
}
