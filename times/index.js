// junta os 4 times. pra trocar ou adicionar um time: crie a pasta dele com um time.js e importe aqui.
import flamengo from './flamengo/time.js?v=20261104223454';
import manchesterCity from './manchester-city/time.js?v=20261104223454';
import realMadrid from './real-madrid/time.js?v=20261104223454';
import borussiaDortmund from './borussia-dortmund/time.js?v=20261104223454';

export const times = [flamengo, manchesterCity, realMadrid, borussiaDortmund];
export const meus = new Map(times.map((t) => [t.id, t]));

// cor e brilho do fundo quando o filtro é "todos" (vermelho da marca)
export const todos = { cor: '#d7263d', brilho: 0.6 };
