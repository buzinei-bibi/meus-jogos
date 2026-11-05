// datas e horários, sempre no horário de brasília
export const fuso = 'America/Sao_Paulo';

const fmtDia = new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' });
const fmtHora = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, hour: '2-digit', minute: '2-digit' });
export const fmtDiaLongo = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, weekday: 'long', day: 'numeric', month: 'long' });
const fmtSemana = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, weekday: 'long' });
export const fmtSemanaCurta = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, weekday: 'short' });
export const fmtDiaMes = new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, day: '2-digit', month: '2-digit' });

export const chaveDia = (d) => fmtDia.format(d); // "2026-11-04"
export const hora = (d) => fmtHora.format(d);   // "19:30"

// "hoje", "amanhã", "sábado" ou "21 de novembro"
export function diaRelativo(d) {
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
export function falta(d) {
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
export function horaFalada(d) {
  const [h, m] = hora(d).split(':').map(Number);
  return m ? `${h} e ${String(m).padStart(2, '0')}` : `${h} horas`;
}
