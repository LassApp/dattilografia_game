// Testo del suggerimento su dito, riga e Shift (usato dal banner in partita e dai "tasti da ripassare"). Funzioni pure.
import { t } from '../i18n/index.js';
export const charName = (c) => (c === ' ' ? t('game.space') : c === '\n' ? t('game.enter') : c);
/** @param {{char:string,finger:string,hand:string,row:number,mods:string[]}} x */
export function hintText(x) {
  if (x.finger === 't') return t('hint.thumb', { char: charName(x.char) });
  const shiftSide = x.mods.find((m) => m.startsWith('Shift'));
  return [t('hint.base', { char: charName(x.char), finger: t(`fingerArt.${x.finger}`), hand: t(`hand.${x.hand}`), row: t(`row.${x.row}`) }),
    shiftSide ? t('hint.shift', { side: t(shiftSide === 'ShiftLeft' ? 'hand.l' : 'hand.r') }) : '', t('hint.home')].filter(Boolean).join(' ');
}
