// Unico punto con listener su document/window durante la partita. Traduce eventi DOM → engine e stato engine → update() dei componenti.
import { charToKeys } from '../data/layout-it.js';
import { hudValues } from '../util/format.js';
import { IDLE_PAUSE_MS, HUD_REFRESH_MS } from '../config.js';
/** ui: { setCaps(bool), setHint(hint|null), showPause(reason), hidePause(), onStatus(state), onCompleted(state, summary) } */
export function createGameController({ session, hints, textView, keyboard, fingerHint, fingerLegend, hud, ui }) {
  let caps = false, hudTimer = null, idleTimer = null;
  const refreshHud = () => hud.update(hudValues(session.getState()));
  const render = () => {
    const st = session.getState(); const nk = st.expected != null ? charToKeys(st.expected) : null;
    textView.update({ text: st.text, index: st.index, error: st.errorActive, errorTick: st.errors });
    keyboard.update({ next: nk }); fingerHint.update({ next: nk }); fingerLegend.update({ active: nk ? nk.finger : null }); refreshHud();
  };
  const stopTimers = () => { clearInterval(hudTimer); clearTimeout(idleTimer); hudTimer = idleTimer = null; };
  const armIdle = () => { clearTimeout(idleTimer); if (session.getState().status === 'running') idleTimer = setTimeout(() => session.pause('idle'), IDLE_PAUSE_MS); };
  const onStatus = ({ status }) => {
    const st = session.getState(); render();
    if (status === 'running') { hudTimer ??= setInterval(refreshHud, HUD_REFRESH_MS); armIdle(); ui.hidePause(); } else stopTimers();
    if (status === 'paused' && st.pauseReason !== 'modal') ui.showPause(st.pauseReason); // 'modal': è già aperto un altro modal
    if (status === 'ready' || status === 'completed') { ui.hidePause(); ui.setHint(null); }
    if (status === 'ready') hints.reset();
    if (status === 'completed') ui.onCompleted(st, session.summary());
    ui.onStatus(st);
  };
  const offs = [session.on('load', render), session.on('status', onStatus),
    session.on('correct', (e) => { keyboard.press(e.code, 'ok'); hints.onCorrect(); ui.setHint(null); render(); armIdle(); }),
    session.on('wrong', (e) => { keyboard.press(e.code, 'error'); const hint = hints.onWrong(e.expected); if (hint) ui.setHint(hint); render(); armIdle(); }),
    session.on('modifier', (e) => keyboard.press(e.code, 'neutral'))];
  const syncCaps = (e) => { const on = !!e.getModifierState?.('CapsLock'); if (on !== caps) { caps = on; ui.setCaps(on); } };
  const onDown = (e) => {
    syncCaps(e); const status = session.getState().status;
    if (e.key === 'Escape' && status === 'running') { session.pause('manual'); e.preventDefault(); return; }
    if (status !== 'ready' && status !== 'running') return;
    if (status === 'running') document.activeElement?.blur?.(); // un pulsante con focus verrebbe attivato da Spazio/Invio
    const r = session.key({ key: e.key, code: e.code, ctrl: e.ctrlKey, meta: e.metaKey, alt: e.altKey, altGraph: e.getModifierState('AltGraph'), repeat: e.repeat, composing: e.isComposing });
    if (['correct', 'wrong', 'dead'].includes(r.kind) || (r.kind === 'ignored' && r.reason === 'repeat' && e.key.length === 1)) e.preventDefault(); // no scroll con Spazio, no ricerca rapida con ' e /
  };
  const onUp = (e) => { syncCaps(e); keyboard.release(e.code); };
  const autoPause = () => { if (session.getState().status === 'running') session.pause('focus'); };
  const onBlur = () => { keyboard.releaseAll(); autoPause(); };
  const onVisibility = () => { if (document.hidden) autoPause(); };
  const onModalOpen = () => { if (session.getState().status === 'running') session.pause('modal'); };
  const onModalClose = () => { const st = session.getState(); if (st.status === 'paused' && st.pauseReason === 'modal') ui.showPause('manual'); };
  const block = (e) => e.preventDefault(); // incolla e trascinamento disattivati
  const doc = document; const bind = [[doc, 'keydown', onDown], [doc, 'keyup', onUp], [doc, 'pointerdown', syncCaps], [doc, 'visibilitychange', onVisibility], [doc, 'dt:modal-open', onModalOpen], [doc, 'dt:modal-close', onModalClose],
    [doc, 'paste', block], [doc, 'drop', block], [doc, 'dragover', block], [window, 'blur', onBlur]];
  bind.forEach(([t, ev, fn]) => t.addEventListener(ev, fn));
  return { render, destroy() { offs.forEach((o) => o()); bind.forEach(([t, ev, fn]) => t.removeEventListener(ev, fn)); stopTimers(); keyboard.releaseAll(); } };
}
