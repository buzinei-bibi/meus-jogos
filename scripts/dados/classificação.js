// classificação do campeonato nacional de cada time (tabela da espn)
import { times } from '../../times/index.js';
import { estado } from '../estado.js';
import { ligas } from './competições.js';

const base = 'https://site.api.espn.com/apis/v2/sports/soccer';

// uma linha da tabela no nosso formato
function linhaDaTabela(e) {
  const valor = (nome) => e.stats?.find((s) => s.name === nome)?.displayValue;
  const logos = e.team?.logos || [];
  return {
    id: String(e.team?.id),
    nome: e.team?.displayName || e.team?.shortDisplayName || '?',
    logo: (logos.find((l) => l.rel?.includes('dark')) || logos[0])?.href || `https://a.espncdn.com/i/teamlogos/soccer/500/${e.team?.id}.png`,
    posicao: Number(valor('rank')) || null,
    pontos: Number(valor('points')) || 0,
    jogos: Number(valor('gamesPlayed')) || 0,
    vitorias: Number(valor('wins')) || 0,
    empates: Number(valor('ties')) || 0,
    derrotas: Number(valor('losses')) || 0,
    saldo: valor('pointDifferential') || '0',
  };
}

async function tabelaDa(liga) {
  const r = await fetch(`${base}/${liga}/standings`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`tabela ${liga}: ${r.status}`);
  const d = await r.json();
  // a espn às vezes divide em grupos (children); junta tudo numa lista só
  const grupos = d.children?.length ? d.children : [d];
  return grupos.flatMap((g) => g.standings?.entries || []).map(linhaDaTabela)
    .filter((l) => l.posicao).sort((a, b) => a.posicao - b.posicao);
}

export async function buscarClassificacao() {
  const ligasUsadas = [...new Set(times.map((t) => t.liga).filter(Boolean))];
  const respostas = await Promise.allSettled(ligasUsadas.map(async (liga) => [liga, await tabelaDa(liga)]));
  for (const r of respostas) {
    if (r.status === 'fulfilled') estado.tabelas.set(r.value[0], r.value[1]);
  }

  for (const t of times) {
    const linha = estado.tabelas.get(t.liga)?.find((l) => l.id === t.id);
    if (!linha) continue;
    estado.posicoes.set(t.id, {
      ...linha,
      liga: ligas[t.liga] || t.liga,
      ligaSlug: t.liga,
      link: `https://www.espn.com/soccer/standings/_/league/${t.liga}`,
    });
  }
}

// linhas da tabela a mostrar: do 1º colocado até o meu time (3º → 1º, 2º e 3º).
// líder mostra também o 2º colocado; time lá embaixo mostra o top 3 + ele, pra lista não ficar enorme
export function vizinhosNaTabela(timeId) {
  const pos = estado.posicoes.get(timeId);
  const tabela = pos && estado.tabelas.get(pos.ligaSlug);
  if (!tabela) return [];
  const i = tabela.findIndex((l) => l.id === timeId);
  if (i < 0) return [];
  if (i === 0) return tabela.slice(0, 2);
  if (i <= 4) return tabela.slice(0, i + 1);
  return [...tabela.slice(0, 3), tabela[i]];
}
