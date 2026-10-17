// Coppie testo/sfondo da verificare per tema: [primo piano, sfondo, minimo, etichetta]. Gli sfondi a gradiente sono verificati sul lato più critico.
const COMMON = (bg) => [
  ['--text', '--bg-page', 4.5, 'Testo su pagina'], ['--text-muted', '--bg-page', 4.5, 'Testo attenuato'],
  ['--text-faint', '--bg-page', 3, 'Testo tenue (solo decorativo)'], ['--success-text', '--bg-page', 4.5, 'Carattere digitato'],
  ['--error-text', '--bg-page', 4.5, 'Errore (testo)'], ['--char-error', '--bg-page', 4.5, 'Carattere errato'],
  ['--char-current', '--bg-page', 4.5, 'Carattere corrente'], ['--gold-text', '--bg-page', 4.5, 'Oro (testo)'],
  ['--info-text', '--bg-page', 4.5, 'Info (testo)'], ['--warning-text', '--surface', 4.5, 'Avviso su superficie'],
  ['--cta-text', '--cta-bg', 4.5, 'Bottone primario'], ['--focus-ring', '--bg-page', 3, 'Anello di focus (non testo)'],
  ['--error', '--bg-page', 3, 'Errore (grafica)'],
  ['--topbar-text', bg.topbar, 4.5, 'Topbar'], ['--card-text', bg.card, 4.5, 'Card'], ['--key-text', bg.key, 4.5, 'Testo dei tasti'],
  ['--key-finger-text', '--key-finger-p', 4.5, 'Tasto mignolo'], ['--key-finger-text', '--key-finger-r', 4.5, 'Tasto anulare'], ['--key-finger-text', '--key-finger-m', 4.5, 'Tasto medio'],
  ['--key-finger-text', '--key-finger-i', 4.5, 'Tasto indice'], ['--key-finger-t-text', '--key-finger-t', 4.5, 'Tasto pollice'],
  ['--heat-key-ink', '--heat-key-1', 4.5, 'Heatmap: pochi errori'], ['--heat-key-ink', '--heat-key-2', 4.5, 'Heatmap: alcuni errori'], ['--heat-key-ink-3', '--heat-key-3', 4.5, 'Heatmap: molti errori'],
];
export const PAIRS = {
  light: COMMON({ topbar: '--fango', card: '--fango', key: '--fango' }),
  dark: COMMON({ topbar: '--beige-scuro', card: '--oliva-scuro', key: '--beige-scuro' }),
};
