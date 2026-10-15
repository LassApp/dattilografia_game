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
];
export const PAIRS = {
  light: COMMON({ topbar: '--fango', card: '--fango', key: '--fango' }),
  dark: COMMON({ topbar: '--beige-scuro', card: '--oliva-scuro', key: '--beige-scuro' }),
};
