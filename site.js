// arquivo gerado por montar.py — não edite aqui.
// o código de verdade fica em scripts/ e times/; depois de mexer, rode: python montar.py
(() => {
'use strict';

// ===== scripts/estado.js =====
const m_scripts_estado = (() => {
// estado compartilhado entre as partes do site
function ler(chave) {
  try { return localStorage.getItem(chave); } catch { return null; }
}
function gravar(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch { /* sem storage, segue */ }
}

const estado = {
  eventos: new Map(),       // todos os jogos conhecidos, por id da espn
  placarVisto: new Map(),   // último placar mostrado, pra piscar quando sai gol
  posicoes: new Map(),      // posição de cada time no campeonato nacional, por id do time
  tabelas: new Map(),       // tabela completa de cada liga (bra.1, eng.1...), em ordem de posição
  filtro: 'todos',          // o site sempre abre na home (todos os times)
  ultimaAtualizacao: null,
  erro: null,
  animarEntrada: true,
};

function trocarFiltro(id) {
  estado.filtro = id;
  estado.animarEntrada = true;
}

return { ler, gravar, trocarFiltro, estado };
})();

// ===== times/flamengo/time.js =====
const m_times_flamengo_time = (() => {
// flamengo — id do time na espn e as cores usadas no site
const padrao = {
  id: '819',
  nome: 'Flamengo',
  curto: 'Flamengo', // nome curto do filtro do topo
  pasta: 'flamengo',
  liga: 'bra.1', // campeonato nacional, usado pra mostrar a posição na tabela
  cor: '#e5252a',
  brilho: 0.9, // força do gradiente do fundo quando o time está selecionado
};

return { default: padrao };
})();

// ===== times/manchester-city/time.js =====
const m_times_manchester_city_time = (() => {
// manchester city — id do time na espn e as cores usadas no site
const padrao = {
  id: '382',
  nome: 'Manchester City',
  curto: 'City', // nome curto do filtro do topo
  pasta: 'manchester-city',
  liga: 'eng.1', // campeonato nacional, usado pra mostrar a posição na tabela
  cor: '#6cabdd',
  brilho: 0.9, // força do gradiente do fundo quando o time está selecionado
};

return { default: padrao };
})();

// ===== times/real-madrid/time.js =====
const m_times_real_madrid_time = (() => {
// real madrid — id do time na espn e as cores usadas no site
const padrao = {
  id: '86',
  nome: 'Real Madrid',
  curto: 'Real', // nome curto do filtro do topo
  pasta: 'real-madrid',
  liga: 'esp.1', // campeonato nacional, usado pra mostrar a posição na tabela
  cor: '#f2c14e',
  brilho: 0.45, // dourado pesa muito no fundo escuro, então fica mais suave
};

return { default: padrao };
})();

// ===== times/borussia-dortmund/time.js =====
const m_times_borussia_dortmund_time = (() => {
// borussia dortmund — id do time na espn e as cores usadas no site
const padrao = {
  id: '124',
  nome: 'Borussia Dortmund',
  curto: 'Dortmund', // nome curto do filtro do topo
  pasta: 'borussia-dortmund',
  liga: 'ger.1', // campeonato nacional, usado pra mostrar a posição na tabela
  cor: '#fde100',
  brilho: 0.4, // amarelo pesa muito no fundo escuro, então fica mais suave
};

return { default: padrao };
})();

// ===== times/index.js =====
const m_times_index = (() => {
// junta os 4 times. pra trocar ou adicionar um time: crie a pasta dele com um time.js e importe aqui.
const flamengo = m_times_flamengo_time.default;
const manchesterCity = m_times_manchester_city_time.default;
const realMadrid = m_times_real_madrid_time.default;
const borussiaDortmund = m_times_borussia_dortmund_time.default;

const times = [flamengo, manchesterCity, realMadrid, borussiaDortmund];
const meus = new Map(times.map((t) => [t.id, t]));

// cor e brilho do fundo quando o filtro é "todos" (vermelho da marca)
const todos = { cor: '#d7263d', brilho: 0.6 };

return { times, meus, todos };
})();

// ===== scripts/dados/competicoes.js =====
const m_scripts_dados_competicoes = (() => {
// nomes das competições e fases em português (a espn manda em inglês)
const ligas = {
  'bra.1': 'Brasileirão',
  'bra.copa_do_brazil': 'Copa do Brasil',
  'bra.camp.carioca': 'Carioca',
  'conmebol.libertadores': 'Libertadores',
  'conmebol.recopa': 'Recopa',
  'bra.supercopa_do_brazil': 'Supercopa do Brasil',
  'eng.1': 'Premier League',
  'eng.fa': 'Copa da Inglaterra',
  'eng.league_cup': 'Copa da Liga Inglesa',
  'eng.charity': 'Supercopa da Inglaterra',
  'esp.1': 'La Liga',
  'esp.copa_del_rey': 'Copa do Rei',
  'esp.super_cup': 'Supercopa da Espanha',
  'ger.1': 'Bundesliga',
  'ger.dfb_pokal': 'Copa da Alemanha',
  'ger.super_cup': 'Supercopa da Alemanha',
  'uefa.champions': 'Champions League',
  'uefa.super_cup': 'Supercopa da UEFA',
  'fifa.cwc': 'Mundial de Clubes',
  'fifa.intercontinental_cup': 'Intercontinental',
  'club.friendly': 'Amistoso',
};

const fases = {
  'League Phase': 'fase de liga',
  'Knockout Round Playoffs': 'playoff',
  'Round of 32': '16 avos',
  'Round of 16': 'oitavas',
  'Quarterfinals': 'quartas',
  'Semifinals': 'semifinal',
  'Final': 'final',
  'Group Stage': 'fase de grupos',
};

return { ligas, fases };
})();

// ===== scripts/utilidades/datas.js =====
const m_scripts_utilidades_datas = (() => {
// datas e horários, sempre no horário de brasília
const fuso = 'America/Sao_Paulo';

const fmtDia = new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' });
const fmtHora = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, hour: '2-digit', minute: '2-digit' });
const fmtDiaLongo = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, weekday: 'long', day: 'numeric', month: 'long' });
const fmtSemana = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, weekday: 'long' });
const fmtSemanaCurta = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, weekday: 'short' });
const fmtDiaMes = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, day: '2-digit', month: '2-digit' });

const chaveDia = (d) => fmtDia.format(d); // "2026-11-04"
const hora = (d) => fmtHora.format(d);   // "19:30"

// "hoje", "amanhã", "sábado" ou "21 de novembro"
function diaRelativo(d) {
  const hoje = chaveDia(new Date());
  const amanha = chaveDia(new Date(Date.now() + 864e5));
  const k = chaveDia(d);
  if (k === hoje) return 'hoje';
  if (k === amanha) return 'amanhã';
  const dias = (new Date(k) - new Date(hoje)) / 864e5;
  if (dias > 0 && dias < 7) return fmtSemana.format(d).replace('-feira', '');
  return fmtDiaLongo.format(d).replace(/^[^,]+, /, '');
}

// "em 2h 10min", "em 3 dias"
function falta(d) {
  const min = Math.round((d - Date.now()) / 6e4);
  if (min <= 0) return 'já já';
  if (min < 60) return `em ${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return m ? `em ${h}h ${m}min` : `em ${h}h`;
  const dias = Math.round(h / 24);
  return dias === 1 ? 'em 1 dia' : `em ${dias} dias`;
}

// "14 e 30" / "17 horas" — do jeito que a gente fala
function horaFalada(d) {
  const [h, m] = hora(d).split(':').map(Number);
  return m ? `${h} e ${String(m).padStart(2, '0')}` : `${h} horas`;
}

return { diaRelativo, falta, horaFalada, fuso, fmtDiaLongo, fmtSemanaCurta, fmtDiaMes, chaveDia, hora };
})();

// ===== scripts/dados/classificacao.js =====
const m_scripts_dados_classificacao = (() => {
// classificação do campeonato nacional de cada time (tabela da espn)
const { times } = m_times_index;
const { estado } = m_scripts_estado;
const { ligas } = m_scripts_dados_competicoes;

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

async function buscarClassificacao() {
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
function vizinhosNaTabela(timeId) {
  const pos = estado.posicoes.get(timeId);
  const tabela = pos && estado.tabelas.get(pos.ligaSlug);
  if (!tabela) return [];
  const i = tabela.findIndex((l) => l.id === timeId);
  if (i < 0) return [];
  if (i === 0) return tabela.slice(0, 2);
  if (i <= 4) return tabela.slice(0, i + 1);
  return [...tabela.slice(0, 3), tabela[i]];
}

return { buscarClassificacao, vizinhosNaTabela };
})();

// ===== scripts/dados/espn.js =====
const m_scripts_dados_espn = (() => {
// busca os jogos na api pública da espn (sem chave, com cors liberado)
const { times, meus } = m_times_index;
const { estado, ler, gravar } = m_scripts_estado;
const { ligas, fases } = m_scripts_dados_competicoes;
const { chaveDia } = m_scripts_utilidades_datas;
const { buscarClassificacao } = m_scripts_dados_classificacao;

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

async function buscarTudo() {
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
function carregarCache() {
  try {
    const c = JSON.parse(ler('meus-jogos:cache') || 'null');
    if (!c) return;
    for (const e of c.eventos) estado.eventos.set(e.id, { ...e, data: new Date(e.data) });
    for (const [id, p] of c.posicoes || []) estado.posicoes.set(id, p);
    for (const [liga, t] of c.tabelas || []) estado.tabelas.set(liga, t);
    estado.ultimaAtualizacao = new Date(c.quando);
  } catch { /* cache quebrado, ignora */ }
}

return { buscarTudo, carregarCache };
})();

// ===== scripts/dados/jogos.js =====
const m_scripts_dados_jogos = (() => {
// regras sobre os jogos: o que é de hoje, próximos, resultados, vitória/empate/derrota
const { estado } = m_scripts_estado;
const { meus } = m_times_index;
const { chaveDia, hora } = m_scripts_utilidades_datas;

const nomeResultado = { v: 'vitória', e: 'empate', d: 'derrota' };
const ordenar = (a, b) => a.data - b.data;
const doFiltro = (e) => estado.filtro === 'todos' || e.meus.includes(estado.filtro);

function jogosDoFiltro() {
  return [...estado.eventos.values()].filter((e) => e.meus.length && doFiltro(e));
}

function separar() {
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

function resultadoPara(e, timeId) {
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

function proximoDe(timeId) {
  return [...estado.eventos.values()]
    .filter((e) => e.meus.includes(timeId) && (e.estado === 'pre' || e.estado === 'in'))
    .sort(ordenar)[0];
}

function situacaoTexto(e) {
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

const foraDoAr = (e) => ['adiado', 'cancelado'].includes(situacaoTexto(e));
const corDe = (e) => (meus.get(estado.filtro !== 'todos' ? estado.filtro : e.meus[0])?.cor) || '#fff';
const ligaTexto = (e) => [e.liga, e.fase].filter(Boolean).join(' · ');

function temJogoQuente() {
  const agora = Date.now();
  return [...estado.eventos.values()].some((e) => e.meus.length
    && (e.estado === 'in' || (e.estado === 'pre' && e.data - agora < 20 * 6e4 && e.data - agora > -3 * 36e5)));
}

return { jogosDoFiltro, separar, resultadoPara, proximoDe, situacaoTexto, temJogoQuente, nomeResultado, foraDoAr, corDe, ligaTexto };
})();

// ===== scripts/dados/arquivo.js =====
const m_scripts_dados_arquivo = (() => {
// salva os jogos de cada time na pasta dele (times/flamengo/jogos.json e por aí vai)
// só funciona quando o site roda pelo servidor.py; se não tiver servidor, ignora em silêncio
const { times } = m_times_index;
const { estado } = m_scripts_estado;
const { resultadoPara, nomeResultado, situacaoTexto } = m_scripts_dados_jogos;
const { chaveDia, hora } = m_scripts_utilidades_datas;

const jaSalvo = new Map(); // evita gravar o mesmo conteúdo de novo
// no site publicado (github pages) não tem servidor pra gravar: só tenta no seu computador
const noComputador = ['localhost', '127.0.0.1'].includes(location.hostname);

function jogoLegivel(e, timeId) {
  const jogo = {
    data: chaveDia(e.data),
    hora: hora(e.data),
    casa: e.casa.nomeLongo || e.casa.nome,
    fora: e.fora.nomeLongo || e.fora.nome,
    campeonato: [e.liga, e.fase].filter(Boolean).join(' · '),
    estadio: [e.estadio, e.cidade].filter(Boolean).join(' · '),
  };
  if (e.casa.placar != null && e.estado !== 'pre') {
    jogo.placar = `${e.casa.placar} x ${e.fora.placar}`;
    jogo.situacao = situacaoTexto(e);
    const r = resultadoPara(e, timeId);
    if (r && e.estado === 'post') jogo.resultado = nomeResultado[r];
  }
  return jogo;
}

async function salvarPorTime() {
  if (!noComputador) return;
  const todos = [...estado.eventos.values()];
  await Promise.allSettled(times.map(async (t) => {
    const deste = todos.filter((e) => e.meus.includes(t.id));
    const conteudo = {
      time: t.nome,
      classificacao: (() => { // posição, pontos e campanha no campeonato nacional
        const p = estado.posicoes.get(t.id);
        return p ? { campeonato: p.liga, posicao: p.posicao, pontos: p.pontos, jogos: p.jogos, vitorias: p.vitorias, empates: p.empates, derrotas: p.derrotas, saldo: p.saldo } : null;
      })(),
      ao_vivo: deste.filter((e) => e.estado === 'in').map((e) => jogoLegivel(e, t.id)),
      proximos: deste.filter((e) => e.estado === 'pre').sort((a, b) => a.data - b.data).map((e) => jogoLegivel(e, t.id)),
      resultados: deste.filter((e) => e.estado === 'post').sort((a, b) => b.data - a.data).map((e) => jogoLegivel(e, t.id)),
    };
    const texto = JSON.stringify(conteudo);
    if (jaSalvo.get(t.pasta) === texto) return;
    const r = await fetch(`/api/salvar/${t.pasta}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: texto });
    if (r.ok) jaSalvo.set(t.pasta, texto);
  }));
}

return { salvarPorTime };
})();

// ===== scripts/utilidades/html.js =====
const m_scripts_utilidades_html = (() => {
// pedacinhos de html reaproveitados em várias partes da tela
const { diaRelativo, fmtSemanaCurta, fmtDiaMes } = m_scripts_utilidades_datas;

function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// nome inteiro do time ("Manchester City", não "Man City")
const nomeTodo = (lado) => lado.nomeLongo || lado.nome;

function escudo(lado, tam) {
  const reserva = `https://a.espncdn.com/i/teamlogos/soccer/500/${esc(lado.id)}.png`;
  return `<img class="escudo" src="${esc(lado.logo)}" alt="" width="${tam}" height="${tam}" onerror="if(!this.dataset.reserva){this.dataset.reserva=1;this.src='${reserva}'}else{this.style.visibility='hidden'}">`;
}

// bloco de data das listas: "SÁB" em cima, "07/11" embaixo
function dataBloco(d) {
  const rel = diaRelativo(d);
  const topo = rel === 'hoje' || rel === 'amanhã' ? rel : fmtSemanaCurta.format(d).replace('.', '');
  return `<span class="data-bloco"><small>${esc(topo)}</small><b>${esc(fmtDiaMes.format(d))}</b></span>`;
}

// troca o conteúdo só se mudou: redesenhar igual recriava os escudos e a tela piscava
function trocarHtml(alvo, html) {
  if (!alvo || alvo._html === html) return;
  alvo._html = html;
  alvo.innerHTML = html;
}

return { esc, escudo, dataBloco, trocarHtml, nomeTodo };
})();

// ===== scripts/tela/hoje.js =====
const m_scripts_tela_hoje = (() => {
// cards dos jogos de hoje (placar em formato de tv: um time por linha)
const { estado } = m_scripts_estado;
const { meus } = m_times_index;
const { esc, escudo, nomeTodo, trocarHtml } = m_scripts_utilidades_html;
const { hora, falta, diaRelativo } = m_scripts_utilidades_datas;
const { resultadoPara, situacaoTexto, foraDoAr, corDe, ligaTexto } = m_scripts_dados_jogos;

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

function desenharHoje(doDia, proximoJogo) {
  const alvo = document.querySelector('#hoje');
  if (doDia.length) trocarHtml(alvo, doDia.map(cartao).join(''));
  else trocarHtml(alvo, estado.eventos.size ? semJogo(proximoJogo) : '<div class="vazio esqueleto"></div>');
}

return { desenharHoje };
})();

// ===== scripts/tela/times.js =====
const m_scripts_tela_times = (() => {
// cards de "meus times" (servem de filtro): nome, dia/hora e contra quem joga
const { estado } = m_scripts_estado;
const { times, todos } = m_times_index;
const { esc, escudo, nomeTodo, trocarHtml } = m_scripts_utilidades_html;
const { hora, diaRelativo } = m_scripts_utilidades_datas;
const { proximoDe } = m_scripts_dados_jogos;

function desenharTimes() {
  const cards = [`
    <button class="chip chip-todos ${estado.filtro === 'todos' ? 'chip-ativo' : ''}" data-time="todos" type="button" style="--cor:${todos.cor};--i:0" aria-pressed="${estado.filtro === 'todos'}">
      <span class="chip-nome">todos</span>
      <span class="chip-sub">${times.length} times</span>
    </button>`];

  times.forEach((t, i) => {
    const p = proximoDe(t.id);
    const rival = p ? (p.casa.id === t.id ? p.fora : p.casa) : null;
    const quando = !p ? 'sem jogo marcado'
      : p.estado === 'in' ? `<b class="ponto-vivo"></b>ao vivo · ${esc(p.casa.placar ?? 0)} – ${esc(p.fora.placar ?? 0)}`
        : `${esc(diaRelativo(p.data))} · ${esc(hora(p.data))}`;
    cards.push(`
      <button class="chip ${estado.filtro === t.id ? 'chip-ativo' : ''}" data-time="${t.id}" type="button" style="--cor:${t.cor};--i:${i + 1}" aria-pressed="${estado.filtro === t.id}">
        <img class="escudo" src="https://a.espncdn.com/i/teamlogos/soccer/500-dark/${t.id}.png" onerror="this.src='https://a.espncdn.com/i/teamlogos/soccer/500/${t.id}.png'" alt="" width="34" height="34">
        <span class="chip-texto">
          <span class="chip-nome">${esc(t.nome)}</span>
          <span class="chip-sub">${quando}</span>
          ${rival ? `<span class="chip-rival"><i>x</i>${escudo(rival, 16)}<span>${esc(nomeTodo(rival))}</span></span>` : ''}
        </span>
      </button>`);
  });
  trocarHtml(document.querySelector('#filtros'), cards.join(''));
}

return { desenharTimes };
})();

// ===== scripts/tela/classificacao.js =====
const m_scripts_tela_classificacao = (() => {
// seção "classificação": posição de cada time no campeonato nacional.
// com um time escolhido no filtro, abre também a disputa: quem está colado na tabela (pro líder, o 2º colocado)
const { estado } = m_scripts_estado;
const { times } = m_times_index;
const { esc, trocarHtml } = m_scripts_utilidades_html;
const { vizinhosNaTabela } = m_scripts_dados_classificacao;

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

function desenharClassificacao() {
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

return { desenharClassificacao };
})();

// ===== scripts/tela/proximos.js =====
const m_scripts_tela_proximos = (() => {
// tabela dos próximos jogos
const { esc, escudo, nomeTodo, dataBloco, trocarHtml } = m_scripts_utilidades_html;
const { hora, falta } = m_scripts_utilidades_datas;
const { situacaoTexto, foraDoAr, corDe } = m_scripts_dados_jogos;
const { meus } = m_times_index;

function ladoDoJogo(l, pos, tam = 22) {
  const meu = meus.has(l.id) ? 'lado-meu' : '';
  return pos === 'casa'
    ? `<span class="lado lado-casa ${meu}"><span class="lado-nome">${esc(nomeTodo(l))}</span>${escudo(l, tam)}</span>`
    : `<span class="lado ${meu}">${escudo(l, tam)}<span class="lado-nome">${esc(nomeTodo(l))}</span></span>`;
}

function linha(e, i) {
  return `
    <a class="linha" href="${esc(e.link)}" target="_blank" rel="noopener" style="--cor:${corDe(e)};--i:${i}">
      ${dataBloco(e.data)}
      <span class="linha-hora">${esc(foraDoAr(e) ? situacaoTexto(e) : hora(e.data))}</span>
      <span class="linha-jogo">${ladoDoJogo(e.casa, 'casa')}<span class="linha-x">x</span>${ladoDoJogo(e.fora, 'fora')}</span>
      <span class="linha-liga"><span>${esc(e.liga)}</span><small>${esc(falta(e.data))}</small></span>
    </a>`;
}

function desenharProximos(lista, temDados) {
  const alvo = document.querySelector('#proximos');
  if (!temDados) { trocarHtml(alvo, ''); return; }
  trocarHtml(alvo, lista.length
    ? `<div class="painel-cabeca cabeca-agenda"><span>data</span><span>hora</span><span>jogo</span><span>campeonato</span></div>
       ${lista.map(linha).join('')}`
    : '<div class="painel-vazio">nenhum jogo marcado por enquanto.</div>');
}

return { ladoDoJogo, desenharProximos };
})();

// ===== scripts/tela/resultados.js =====
const m_scripts_tela_resultados = (() => {
// tabela dos últimos resultados
const { estado } = m_scripts_estado;
const { esc, dataBloco, trocarHtml } = m_scripts_utilidades_html;
const { resultadoPara, nomeResultado, corDe } = m_scripts_dados_jogos;
const { ladoDoJogo } = m_scripts_tela_proximos;

function linha(e, i) {
  const meuId = estado.filtro !== 'todos' ? estado.filtro : e.meus[0];
  const r = resultadoPara(e, meuId);
  return `
    <a class="resultado" href="${esc(e.link)}" target="_blank" rel="noopener" style="--cor:${corDe(e)};--i:${i}">
      ${dataBloco(e.data)}
      <span class="res-jogo">${ladoDoJogo(e.casa, 'casa')}<span class="res-placar"><span class="gol-casa">${esc(e.casa.placar)}</span><i>–</i><span class="gol-fora">${esc(e.fora.placar)}</span></span>${ladoDoJogo(e.fora, 'fora')}</span>
      <span class="res-liga">${esc(e.liga)}</span>
      <span class="res-letra res-${r}" title="${nomeResultado[r] || ''}" aria-label="${nomeResultado[r] || ''}">${esc(r || '')}</span>
    </a>`;
}

function desenharResultados(lista, temDados) {
  const alvo = document.querySelector('#resultados');
  if (!temDados) { trocarHtml(alvo, ''); return; }
  trocarHtml(alvo, lista.length
    ? `<div class="painel-cabeca cabeca-resultados"><span>data</span><span>jogo</span><span>campeonato</span><span></span></div>
       ${lista.map(linha).join('')}`
    : '<div class="painel-vazio">sem resultados recentes.</div>');
}

return { desenharResultados };
})();

// ===== scripts/tela/pagina.js =====
const m_scripts_tela_pagina = (() => {
// redesenha a página inteira com o estado atual
const { estado } = m_scripts_estado;
const { meus, todos } = m_times_index;
const { esc } = m_scripts_utilidades_html;
const { fmtDiaLongo, hora } = m_scripts_utilidades_datas;
const { separar } = m_scripts_dados_jogos;
const { desenharHoje } = m_scripts_tela_hoje;
const { desenharTimes } = m_scripts_tela_times;
const { desenharClassificacao } = m_scripts_tela_classificacao;
const { desenharProximos } = m_scripts_tela_proximos;
const { desenharResultados } = m_scripts_tela_resultados;

let timerEntrada = null;

function desenhar() {
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

  // a entrada animada roda uma vez só, na primeira vez que tem jogo pra mostrar
  // (antes rodava com os dados guardados e de novo quando chegavam os novos: piscava duas vezes)
  if (estado.animarEntrada && temDados) {
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

return { desenhar };
})();

// ===== scripts/principal.js =====
// meus jogos — ponto de partida: liga os botões e mantém tudo atualizado
const { estado, trocarFiltro } = m_scripts_estado;
const { buscarTudo, carregarCache } = m_scripts_dados_espn;
const { temJogoQuente } = m_scripts_dados_jogos;
const { salvarPorTime } = m_scripts_dados_arquivo;
const { desenhar } = m_scripts_tela_pagina;

let timerBusca = null;

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
  desenhar();
  // com jogo rolando (ou pra começar) atualiza a cada 30s; senão, a cada 5 min
  timerBusca = setTimeout(atualizar, temJogoQuente() ? 30e3 : 5 * 6e4);
}

// os cards de "meus times" trocam o time escolhido
function aoEscolherTime(ev) {
  const b = ev.target.closest('[data-time]');
  if (!b || b.dataset.time === estado.filtro) return;
  trocarFiltro(b.dataset.time);
  desenhar();
}
// o ?. evita travar o site inteiro se alguma parte da página não existir
document.querySelector('#filtros')?.addEventListener('click', aoEscolherTime);
// a logo volta pra home (todos os times), sem recarregar a página
document.querySelector('#ir-home')?.addEventListener('click', (ev) => {
  ev.preventDefault();
  if (estado.filtro !== 'todos') { trocarFiltro('todos'); desenhar(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.querySelector('#atualizar')?.addEventListener('click', atualizar);
document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
setInterval(desenhar, 30e3); // contagens regressivas andam mesmo sem buscar

carregarCache();
desenhar();
atualizar();

})();
