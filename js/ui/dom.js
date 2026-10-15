// Helper DOM minimi. Lo stile inline è vietato: solo variabili numeriche via setVar().
export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'style') throw new Error('Stile inline vietato: usa classi e token');
    if (k === 'class') el.className = v;
    else if (k === 'data') Object.assign(el.dataset, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  el.append(...kids.flat().filter((c) => c != null && c !== false));
  return el;
}
export const setVar = (el, name, n) => el.style.setProperty(name, String(Number(n)));
