// menu da logo: abre um painel pequeno com atalhos pras seções da página.
// ele só fecha quando você toca na logo de novo (ou aperta esc) — nunca sozinho
export function ligarMenu() {
  const botao = document.querySelector('#abrir-menu');
  const menu = document.querySelector('#menu-secoes');

  const abrir = (sim) => {
    menu.hidden = !sim;
    botao.setAttribute('aria-expanded', String(sim));
    botao.setAttribute('aria-label', sim ? 'fechar o menu' : 'abrir o menu');
    botao.classList.toggle('marca-aberta', sim);
  };

  botao.addEventListener('click', () => abrir(menu.hidden));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !menu.hidden) { abrir(false); botao.focus(); }
  });
}
