// salva os jogos de cada time na pasta dele (times/flamengo/jogos.json e por aí vai)
// só funciona quando o site roda pelo servidor.py; se não tiver servidor, ignora em silêncio
import { times } from '../../times/index.js?v=20261104223454';
import { estado } from '../estado.js?v=20261104223454';
import { resultadoPara, nomeResultado, situacaoTexto } from './jogos.js?v=20261104223454';
import { chaveDia, hora } from '../utilidades/datas.js?v=20261104223454';

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

export async function salvarPorTime() {
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
