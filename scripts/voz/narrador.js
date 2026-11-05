// narrador: fala só o essencial — jogo ao vivo, último resultado e próximo jogo.
// usa voz neural humana (servidor.py → edge-tts, de graça). sem servidor, cai na voz do navegador.
import { jogosDoFiltro, situacaoTexto, foraDoAr } from '../dados/jogos.js';
import { diaRelativo, horaFalada } from '../utilidades/datas.js';

let audio = null;

export function textoResumo() {
  const lista = jogosDoFiltro();
  const ordenar = (a, b) => a.data - b.data;
  const vivos = lista.filter((e) => e.estado === 'in').sort(ordenar);
  const ultimo = lista.filter((e) => e.estado === 'post' && e.casa.placar != null).sort((a, b) => b.data - a.data)[0];
  const proximo = lista.filter((e) => e.estado === 'pre' && !foraDoAr(e)).sort(ordenar)[0];
  const nome = (l) => l.nomeLongo || l.nome;
  const placar = (e) => `${nome(e.casa)} ${e.casa.placar ?? 0}, ${nome(e.fora)} ${e.fora.placar ?? 0}`;

  const partes = [];
  for (const e of vivos) {
    const min = parseInt(e.relogio, 10);
    const quando = situacaoTexto(e) === 'intervalo' ? ', no intervalo' : (min ? `, aos ${min} minutos` : '');
    partes.push(`Ao vivo, ${e.liga}: ${placar(e)}${quando}.`);
  }
  if (ultimo) partes.push(`Último resultado, ${ultimo.liga}: ${placar(ultimo)}.`);
  if (proximo) partes.push(`Próximo jogo: ${diaRelativo(proximo.data)}, às ${horaFalada(proximo.data)}, ${nome(proximo.casa)} contra ${nome(proximo.fora)}, ${proximo.liga}.`);
  return partes.length ? partes.join(' ') : 'Não encontrei jogos dos seus times agora.';
}

function avisar(texto) {
  const el = document.querySelector('#aviso-voz');
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => { el.hidden = true; }, 5000);
}

function parar(botao) {
  if (audio) { audio.pause(); audio = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  botao.classList.remove('falando', 'carregando');
}

async function vozNeural(texto) {
  const r = await fetch('/api/voz', { method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: texto });
  if (!r.ok) throw new Error('sem voz neural');
  return URL.createObjectURL(await r.blob());
}

function vozDoNavegador(texto, botao) {
  if (!('speechSynthesis' in window)) { avisar('seu navegador não lê em voz alta'); parar(botao); return; }
  const vozes = speechSynthesis.getVoices();
  const br = vozes.filter((v) => /^pt[-_]br/i.test(v.lang));
  const voz = br.find((v) => /online|natural|neural|google/i.test(v.name)) || br[0] || vozes.find((v) => /^pt/i.test(v.lang));
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = voz?.lang || 'pt-BR';
  if (voz) u.voice = voz;
  u.onend = u.onerror = () => parar(botao);
  speechSynthesis.speak(u);
}

export async function falar() {
  const botao = document.querySelector('#ouvir');
  if (botao.classList.contains('falando') || botao.classList.contains('carregando')) { parar(botao); return; }

  const texto = textoResumo();
  botao.classList.add('carregando');
  try {
    const url = await vozNeural(texto);
    if (!botao.classList.contains('carregando')) return; // clicou pra parar enquanto carregava
    audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); parar(botao); };
    botao.classList.replace('carregando', 'falando');
    await audio.play();
  } catch {
    // sem servidor ou sem internet: usa a voz do próprio navegador
    botao.classList.replace('carregando', 'falando');
    avisar('voz humana indisponível agora — usando a voz do navegador');
    vozDoNavegador(texto, botao);
  }
}
