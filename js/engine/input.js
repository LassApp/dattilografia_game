// Classificazione di un tasto premuto. Funzione pura: riceve un oggetto semplice, non l'evento del browser.
const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock', 'OS', 'Fn', 'Hyper', 'Super']);
/** @param {{key:string,code:string,ctrl?:boolean,meta?:boolean,alt?:boolean,altGraph?:boolean,repeat?:boolean,composing?:boolean}} ev */
export function classifyKey(ev, expected) {
  if (ev.repeat) return { kind: 'ignored', reason: 'repeat' };
  if (ev.composing) return { kind: 'ignored', reason: 'composing' };
  if (ev.key === 'Dead') return { kind: 'dead' }; // tasto morto: non è un errore
  if (MODIFIERS.has(ev.key)) return { kind: 'modifier' };
  if (ev.meta || (ev.ctrl && !ev.altGraph) || (ev.alt && !ev.altGraph)) return { kind: 'ignored', reason: 'shortcut' };
  const typed = ev.key === 'Enter' ? '\n' : ev.key;
  if (typed.length !== 1 && typed !== '\n') return { kind: 'ignored', reason: 'non-printing' };
  return { kind: typed === expected ? 'correct' : 'wrong', typed };
}
