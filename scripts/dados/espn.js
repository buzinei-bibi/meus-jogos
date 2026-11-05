// busca os jogos na api pública da espn (sem chave, com cors liberado)
import { times, meus } from '../../times/index.js?v=20261104223454';
import { estado, ler, gravar } from '../estado.js?v=20261104223454';
import { ligas, fases } from './competicoes.js?v=20261104223454';
import { chaveDia } from '../utilidades/datas.js?v=20261104223454';
import { buscarClassificacao } from './classificacao.js?v=20261104223454';

const base = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all';

async function pegar(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`espn respondeu ${r.status}`);
  return r.json();
}

function logoDe(time) {
  const logos = time?.logos || [];
  const escuro = logos.find((l) => l.rel?.includes('dark'));
  return (escuro || logos[0])?.href || time?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${time?.id}.png`;
}

function placarDe(c) {
  const s = c.score;
  if (s == null || s === '') return null;
  return typeof s === 'object' ? (s.displayValue ?? String(s.value)) : String(s);
}

function lado(c) {
  return {
    id: String(c.team?.id ?? c.id),
    nome: c.team?.shortDisplayName || c.team?.displayName || '?',
    nomeLongo: c.team?.displayName || c.team?.shortDisplayName || '?',
    logo: logoDe(c.team),
    placar: placarDe(c),
    penaltis: c.shootoutScore != null ? String(c.shootoutScore?.displayValue ?? c.shootoutScore) : null,
    venceu: c.winner === true,
  };
}

// transforma o formato da espn no nosso formato, em português
function normalizar(e, comp, liga) {
  const cs = comp.competitors || [];
  const casa = cs.find((c) => c.homeAway === 'home') || cs[0];
  const fora = cs.find((c) => c.homeAway === 'away') || cs[1];
  const st = comp.status || e.status || {};
  const tipo = st.type || {};
  const ev = {
    id: String(e.id),
    data: new Date(e.date || comp.date),
    ligaSlug: liga?.slug || '',
    liga: ligas[liga?.slug] || liga?.shortName || liga?.name || '',
    fase: fases[(e.seasonType?.name || '').trim()] || '',
    casa: lado(casa),
    fora: lado(fora),
    estado: tipo.state || 'pre', // pre = vai começar, in = rolando, post = acabou
    situacao: tipo.name || '',
    relogio: st.displayClock || '',
    detalhe: tipo.shortDetail || '',
    estadio: comp.venue?.fullName || '',
    cidade: comp.venue?.address?.city || '',
    link: (e.links || []).find((l) => l.rel?.includes('desktop'))?.href || `https://www.espn.com/soccer/match/_/gameId/${e.id}`,
  };
  ev.meus = [ev.casa.id, ev.fora.id].filter((id) => meus.has(id));
  return ev;
}

function juntar(novo) {
  const velho = estado.eventos.get(novo.id);
  if (velho) {
    // não deixa um dado conhecido sumir quando a fonte nova não traz
    if (novo.casa.placar == null) { novo.casa.placar = velho.casa.placar; novo.fora.placar = velho.fora.placar; }
    if (!novo.estadio) { novo.estadio = velho.estadio; novo.cidade = velho.cidade; }
    if (!novo.fase) novo.fase = velho.fase;
    if (!novo.liga) novo.liga = velho.liga;
  }
  estado.eventos.set(novo.id, novo);
}

export async function buscarTudo() {
  const pedidos = times.flatMap((t) => [
    pegar(`${base}/teams/${t.id}/schedule`),              // resultados
    pegar(`${base}/teams/${t.id}/schedule?fixture=true`), // próximos jogos
  ]);
  const respostas = await Promise.allSettled(pedidos);
  const ok = respostas.filter((r) => r.status === 'fulfilled');
  if (!ok.length) throw new Error('não consegui falar com a espn');

  for (const r of ok) {
    for (const e of r.value.events || []) {
      const comp = e.competitions?.[0];
      if (comp) juntar(normalizar(e, comp, e.league));
    }
  }

  // placar ao vivo: o calendário não traz placar de jogo rolando, então pergunta jogo a jogo
  const hoje = chaveDia(new Date());
  const doDia = [...estado.eventos.values()].filter((e) => e.meus.length && (e.estado === 'in' || (chaveDia(e.data) === hoje && e.data - Date.now() < 15 * 6e4)));
  await Promise.allSettled([
    ...doDia.map(async (e) => {
      const d = await pegar(`${base}/summary?event=${e.id}`);
      const comp = d.header?.competitions?.[0];
      if (comp) juntar(normalizar({ ...d.header, id: e.id, date: comp.date, links: d.header.links }, comp, d.header.league || { slug: e.ligaSlug }));
    }),
    buscarClassificacao(), // posição de cada time na tabela, junto com os placares
  ]);

  estado.ultimaAtualizacao = new Date();
  estado.erro = null;
  gravar('meus-jogos:cache', JSON.stringify({
    quando: estado.ultimaAtualizacao,
    eventos: [...estado.eventos.values()],
    posicoes: [...estado.posicoes],
    tabelas: [...estado.tabelas],
  }));
}

// mostra os últimos dados na hora, enquanto a busca nova não chega
export function carregarCache() {
  try {
    const c = JSON.parse(ler('meus-jogos:cache') || 'null');
    if (!c) return;
    for (const e of c.eventos) estado.eventos.set(e.id, { ...e, data: new Date(e.data) });
    for (const [id, p] of c.posicoes || []) estado.posicoes.set(id, p);
    for (const [liga, t] of c.tabelas || []) estado.tabelas.set(liga, t);
    estado.ultimaAtualizacao = new Date(c.quando);
  } catch { /* cache quebrado, ignora */ }
}
