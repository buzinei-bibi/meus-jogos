// junta os 4 times. pra trocar ou adicionar um time: crie a pasta dele com um time.js e importe aqui.
import flamengo from './flamengo/time.js';
import manchesterCity from './manchester-city/time.js';
import realMadrid from './real-madrid/time.js';
import borussiaDortmund from './borussia-dortmund/time.js';

export const times = [flamengo, manchesterCity, realMadrid, borussiaDortmund];
export const meus = new Map(times.map((t) => [t.id, t]));

// cor e brilho do fundo quando o filtro é "todos" (vermelho da marca)
export const todos = { cor: '#d7263d', brilho: 0.6 };
