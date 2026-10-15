// Unico punto con listener su document durante la partita. Traduce eventi DOM → engine e stato engine → update() dei componenti.
import { charToKeys } from '../data/layout-it.js';
export function createGameController({ session, textView, keyboard, hint }) {
  const render = () => {
    const st = session.getState(); const nk = st.expected != null ? charToKeys(st.expected) : null;
    textView.update({ text: st.text, index: st.index, error: st.errorActive, errorTick: st.errors });
    keyboard.update({ next: nk }); hint.update({ next: nk });
  };
  const offs = [session.on('load', render), session.on('status', render),
    session.on('correct', (e) => { keyboard.press(e.code, 'ok'); render(); }),
    session.on('wrong', (e) => { keyboard.press(e.code, 'error'); render(); }),
    session.on('modifier', (e) => keyboard.press(e.code, 'neutral'))];
  const onDown = (e) => {
    const status = session.getState().status; if (status !== 'ready' && status !== 'running') return;
    if (status === 'running') document.activeElement?.blur?.(); // un pulsante con focus verrebbe attivato da Spazio/Invio
    const r = session.key({ key: e.key, code: e.code, ctrl: e.ctrlKey, meta: e.metaKey, alt: e.altKey, altGraph: e.getModifierState('AltGraph'), repeat: e.repeat, composing: e.isComposing });
    if (['correct', 'wrong', 'dead'].includes(r.kind) || (r.kind === 'ignored' && r.reason === 'repeat' && e.key.length === 1)) e.preventDefault(); // no scroll con Spazio, no ricerca rapida con ' e /
  };
  const onUp = (e) => keyboard.release(e.code); const onBlur = () => keyboard.releaseAll();
  document.addEventListener('keydown', onDown); document.addEventListener('keyup', onUp); addEventListener('blur', onBlur);
  return { render, destroy() { offs.forEach((o) => o()); document.removeEventListener('keydown', onDown); document.removeEventListener('keyup', onUp); removeEventListener('blur', onBlur); keyboard.releaseAll(); } };
}
