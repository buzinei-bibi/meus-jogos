// pedacinhos de html reaproveitados em várias partes da tela
import { diaRelativo, fmtSemanaCurta, fmtDiaMes } from './datas.js';

export function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// nome inteiro do time ("Manchester City", não "Man City")
export const nomeTodo = (lado) => lado.nomeLongo || lado.nome;

export function escudo(lado, tam) {
  const reserva = `https://a.espncdn.com/i/teamlogos/soccer/500/${esc(lado.id)}.png`;
  return `<img class="escudo" src="${esc(lado.logo)}" alt="" width="${tam}" height="${tam}" onerror="if(!this.dataset.reserva){this.dataset.reserva=1;this.src='${reserva}'}else{this.style.visibility='hidden'}">`;
}

// bloco de data das listas: "SÁB" em cima, "07/11" embaixo
export function dataBloco(d) {
  const rel = diaRelativo(d);
  const topo = rel === 'hoje' || rel === 'amanhã' ? rel : fmtSemanaCurta.format(d).replace('.', '');
  return `<span class="data-bloco"><small>${esc(topo)}</small><b>${esc(fmtDiaMes.format(d))}</b></span>`;
}
