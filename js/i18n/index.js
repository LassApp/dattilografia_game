import it from './it.js';
export function t(key, params = {}) {
  const s = key.split('.').reduce((o, k) => (o == null ? o : o[k]), it);
  if (typeof s !== 'string') return key;
  return s.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
}
