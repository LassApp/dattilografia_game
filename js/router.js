// Router hash: '#/' · '#/gioco/:livello/:esercizio' · '#/risultati'. Le schermate ricevono (params, ctx) e restituiscono {el, destroy}.
export function startRouter(routes, outlet, ctx = {}) {
  let current = null;
  const go = () => {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const [name = 'home', ...params] = parts;
    const screen = routes[name] || routes.home;
    current?.destroy?.(); current = screen(params, ctx); outlet.replaceChildren(current.el);
  };
  addEventListener('hashchange', go); go();
}
