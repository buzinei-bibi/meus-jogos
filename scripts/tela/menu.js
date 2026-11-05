// menu da logo: abre um painel pequeno com atalhos pras seções da página.
// fecha quando você toca numa seção, quando escolhe um time, ou tocando na logo de novo (ou esc)
let botao = null;
let menu = null;

function abrir(sim) {
  menu.hidden = !sim;
  botao.setAttribute('aria-expanded', String(sim));
  botao.setAttribute('aria-label', sim ? 'fechar o menu' : 'abrir o menu');
  botao.classList.toggle('marca-aberta', sim);
}

export function fecharMenu() {
  if (menu && !menu.hidden) abrir(false);
}

export function ligarMenu() {
  botao = document.querySelector('#abrir-menu');
  menu = document.querySelector('#menu-secoes');

  botao.addEventListener('click', () => abrir(menu.hidden));
  // tocou numa seção: vai até ela e fecha
  menu.addEventListener('click', (ev) => { if (ev.target.closest('a')) fecharMenu(); });
  // escolheu um time (no filtro do topo ou em "meus times"): fecha também
  document.addEventListener('click', (ev) => { if (ev.target.closest('[data-time]')) fecharMenu(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !menu.hidden) { fecharMenu(); botao.focus(); }
  });
}
