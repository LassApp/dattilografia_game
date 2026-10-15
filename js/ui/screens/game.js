// Schermata di gioco v0 (Fase 2): tastiera + testo + motore. HUD, pausa e controlli arrivano in Fase 3.
import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Button } from '../components/button.js';
import { TextView } from '../components/text-view.js';
import { VirtualKeyboard } from '../components/virtual-keyboard.js';
import { FingerHint } from '../components/finger-hint.js';
import { getSettings } from '../../storage/settings-store.js';
import { createSession } from '../../engine/session.js';
import { normalizeText } from '../../engine/text-normalize.js';
import { createGameController } from '../../controllers/game-controller.js';
export function GameScreen(params = []) {
  const [levelId = 'prova', exId] = params; const settings = getSettings();
  const session = createSession();
  const textView = TextView({ size: settings.textSize }); const keyboard = VirtualKeyboard({ guide: settings.guide, tint: settings.fingerTint }); const hint = FingerHint();
  const title = h('h1', { class: 's-game__title' }); const done = h('p', { class: 's-game__done', role: 'status' });
  const restart = Button({ label: t('game.restart'), icon: 'restart', onClick: (e) => { session.restart(); e.currentTarget.blur(); } });
  const el = h('div', { class: 's-game l-container' }, h('div', { class: 'l-cluster' }, title, restart.el), hint.el, keyboard.el, textView.el, done);
  const ctrl = createGameController({ session, textView, keyboard, hint });
  session.on('status', ({ status }) => { done.textContent = status === 'completed' ? t('game.done') : ''; });
  (async () => {
    try {
      if (!/^[\w-]+$/.test(levelId)) throw new Error('id');
      const level = await (await fetch(`content/levels/${levelId}.json`)).json();
      const ex = level.esercizi.find((x) => x.id === exId) || level.esercizi[0];
      title.textContent = `${level.titolo} · ${ex.id}`; session.load(normalizeText(ex.testo));
    } catch { title.textContent = t('game.loadError'); }
  })();
  return { el, destroy() { ctrl.destroy(); } };
}
