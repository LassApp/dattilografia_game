// Tastiera italiana ISO (QWERTY). `code` = KeyboardEvent.code (posizione fisica); base/shift/altgr = carattere prodotto.
// Dito: p mignolo · r anulare · m medio · i indice · t pollice. Mano: l sinistra · r destra. w = larghezza relativa.
const K = (code, base, shift, finger, hand, x = {}) => ({ code, base, shift, finger, hand, ...x });
const S = (code, label, finger, hand, w) => ({ code, label, finger, hand, w, special: true });
export const ROWS = [
  [K('Backquote', '\\', '|', 'p', 'l'), K('Digit1', '1', '!', 'p', 'l'), K('Digit2', '2', '"', 'r', 'l'), K('Digit3', '3', '£', 'm', 'l'), K('Digit4', '4', '$', 'i', 'l'), K('Digit5', '5', '%', 'i', 'l'),
    K('Digit6', '6', '&', 'i', 'r'), K('Digit7', '7', '/', 'i', 'r'), K('Digit8', '8', '(', 'm', 'r'), K('Digit9', '9', ')', 'r', 'r'), K('Digit0', '0', '=', 'p', 'r'),
    K('Minus', "'", '?', 'p', 'r'), K('Equal', 'ì', '^', 'p', 'r', { caps: true }), S('Backspace', '⌫', 'p', 'r', 2)],
  [S('Tab', 'Tab', 'p', 'l', 1.6), K('KeyQ', 'q', 'Q', 'p', 'l'), K('KeyW', 'w', 'W', 'r', 'l'), K('KeyE', 'e', 'E', 'm', 'l', { altgr: '€' }), K('KeyR', 'r', 'R', 'i', 'l'), K('KeyT', 't', 'T', 'i', 'l'),
    K('KeyY', 'y', 'Y', 'i', 'r'), K('KeyU', 'u', 'U', 'i', 'r'), K('KeyI', 'i', 'I', 'm', 'r'), K('KeyO', 'o', 'O', 'r', 'r'), K('KeyP', 'p', 'P', 'p', 'r'),
    K('BracketLeft', 'è', 'é', 'p', 'r', { altgr: '[', altgrShift: '{', caps: true }), K('BracketRight', '+', '*', 'p', 'r', { altgr: ']', altgrShift: '}' })],
  [S('CapsLock', 'Caps', 'p', 'l', 1.6), K('KeyA', 'a', 'A', 'p', 'l'), K('KeyS', 's', 'S', 'r', 'l'), K('KeyD', 'd', 'D', 'm', 'l'), K('KeyF', 'f', 'F', 'i', 'l'), K('KeyG', 'g', 'G', 'i', 'l'),
    K('KeyH', 'h', 'H', 'i', 'r'), K('KeyJ', 'j', 'J', 'i', 'r'), K('KeyK', 'k', 'K', 'm', 'r'), K('KeyL', 'l', 'L', 'r', 'r'),
    K('Semicolon', 'ò', 'ç', 'p', 'r', { altgr: '@', caps: true }), K('Quote', 'à', '°', 'p', 'r', { altgr: '#', caps: true }), K('Backslash', 'ù', '§', 'p', 'r', { caps: true }), S('Enter', '↵', 'p', 'r', 2)],
  [S('ShiftLeft', '⇧', 'p', 'l', 1.3), K('IntlBackslash', '<', '>', 'p', 'l'), K('KeyZ', 'z', 'Z', 'p', 'l'), K('KeyX', 'x', 'X', 'r', 'l'), K('KeyC', 'c', 'C', 'm', 'l'), K('KeyV', 'v', 'V', 'i', 'l'),
    K('KeyB', 'b', 'B', 'i', 'l'), K('KeyN', 'n', 'N', 'i', 'r'), K('KeyM', 'm', 'M', 'i', 'r'), K('Comma', ',', ';', 'm', 'r'), K('Period', '.', ':', 'r', 'r'), K('Slash', '-', '_', 'p', 'r'), S('ShiftRight', '⇧', 'p', 'r', 2.6)],
  [S('Space', '', 't', 'r', 8)],
];
ROWS.forEach((r, i) => r.forEach((k) => { k.row = i; })); // 0 numeri · 1 superiore · 2 base · 3 inferiore · 4 spazio
export const KEYS = ROWS.flat();
export const KEY_BY_CODE = new Map(KEYS.map((k) => [k.code, k]));
export const CHAR_MAP = new Map();
const add = (ch, key, mods) => { if (ch && !CHAR_MAP.has(ch)) CHAR_MAP.set(ch, { code: key.code, ...mods }); };
for (const key of KEYS) {
  if (key.special) continue;
  add(key.base, key, {}); add(key.shift, key, { shift: true });
  add(key.altgr, key, { altgr: true }); add(key.altgrShift, key, { altgr: true, shift: true });
  if (key.caps) add(key.base.toUpperCase(), key, { caps: true }); // È À Ò Ù Ì: sulla tastiera italiana solo con Blocco maiuscole
}
add(' ', KEY_BY_CODE.get('Space'), {}); add('\n', KEY_BY_CODE.get('Enter'), {});
const OPPOSITE = { l: 'ShiftRight', r: 'ShiftLeft' }; // la maiuscola si fa con il Shift della mano opposta
/** Come si digita un carattere: tasto, dito, mano e tasti accessori (Shift/AltGr/Caps). null se non è sulla tastiera italiana. */
export function charToKeys(ch) {
  const m = CHAR_MAP.get(ch); if (!m) return null;
  const key = KEY_BY_CODE.get(m.code); const mods = [];
  if (m.shift) mods.push(OPPOSITE[key.hand]);
  if (m.altgr) mods.push('AltRight');
  if (m.caps) mods.push('CapsLock');
  return { code: m.code, finger: key.finger, hand: key.hand, row: key.row, shift: !!m.shift, altgr: !!m.altgr, caps: !!m.caps, mods };
}
