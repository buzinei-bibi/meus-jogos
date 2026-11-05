// regras sobre os jogos: o que é de hoje, próximos, resultados, vitória/empate/derrota
import { estado } from '../estado.js';
import { meus } from '../../times/index.js';
import { chaveDia, hora } from '../utilidades/datas.js';

export const nomeResultado = { v: 'vitória', e: 'empate', d: 'derrota' };
const ordenar = (a, b) => a.data - b.data;
const doFiltro = (e) => estado.filtro === 'todos' || e.meus.includes(estado.filtro);

export function jogosDoFiltro() {
  return [...estado.eventos.values()].filter((e) => e.meus.length && doFiltro(e));
}

export function separar() {
  const hoje = chaveDia(new Date());
  const lista = jogosDoFiltro();
  const peso = { in: 0, pre: 1, post: 2 }; // ao vivo primeiro, depois os que vão começar, depois os encerrados
  const doDia = lista.filter((e) => chaveDia(e.data) === hoje || e.estado === 'in')
    .sort((a, b) => (peso[a.estado] ?? 1) - (peso[b.estado] ?? 1) || (a.estado === 'post' ? b.data - a.data : a.data - b.data));
  const proximos = lista.filter((e) => e.estado === 'pre' && chaveDia(e.data) > hoje).sort(ordenar).slice(0, 8);
  const resultados = lista.filter((e) => e.estado === 'post' && chaveDia(e.data) < hoje && e.casa.placar != null)
    .sort((a, b) => b.data - a.data).slice(0, 8);
  return { doDia, proximos, resultados };
}

export function resultadoPara(e, timeId) {
  const a = Number(e.casa.placar); const b = Number(e.fora.placar);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const souCasa = e.casa.id === timeId;
  if (a === b) {
    if (e.casa.penaltis != null && e.fora.penaltis != null) {
      const ganhouCasa = Number(e.casa.penaltis) > Number(e.fora.penaltis);
      return ganhouCasa === souCasa ? 'v' : 'd';
    }
    return 'e';
  }
  return (a > b) === souCasa ? 'v' : 'd';
}

export function proximoDe(timeId) {
  return [...estado.eventos.values()]
    .filter((e) => e.meus.includes(timeId) && (e.estado === 'pre' || e.estado === 'in'))
    .sort(ordenar)[0];
}

export function situacaoTexto(e) {
  const s = e.situacao;
  if (s === 'STATUS_POSTPONED') return 'adiado';
  if (s === 'STATUS_CANCELED' || s === 'STATUS_ABANDONED') return 'cancelado';
  if (s === 'STATUS_SUSPENDED' || s === 'STATUS_DELAYED') return 'paralisado';
  if (e.estado === 'in') {
    if (s === 'STATUS_HALFTIME' || e.detalhe === 'HT') return 'intervalo';
    if (s === 'STATUS_SHOOTOUT') return 'pênaltis';
    return e.relogio || 'rolando';
  }
  if (e.estado === 'post') {
    if (s === 'STATUS_FINAL_PEN' || e.detalhe.includes('Pen')) return 'fim nos pênaltis';
    if (s === 'STATUS_FINAL_AET' || e.detalhe.includes('AET')) return 'fim na prorrogação';
    return 'encerrado';
  }
  return hora(e.data);
}

export const foraDoAr = (e) => ['adiado', 'cancelado'].includes(situacaoTexto(e));
export const corDe = (e) => (meus.get(estado.filtro !== 'todos' ? estado.filtro : e.meus[0])?.cor) || '#fff';
export const ligaTexto = (e) => [e.liga, e.fase].filter(Boolean).join(' · ');

export function temJogoQuente() {
  const agora = Date.now();
  return [...estado.eventos.values()].some((e) => e.meus.length
    && (e.estado === 'in' || (e.estado === 'pre' && e.data - agora < 20 * 6e4 && e.data - agora > -3 * 36e5)));
}
