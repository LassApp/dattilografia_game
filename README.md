# Piattaforma di dattilografia (NOME_DA_DEFINIRE)
Sito statico: HTML + CSS + JavaScript vanilla (moduli ES), nessuna dipendenza.
## Avvio
I moduli ES non funzionano da `file://`: serve un server statico, es. `python -m http.server 8000`, poi http://localhost:8000/ (app), `/palette.html`, `/componenti.html`.
## Pubblicazione (GitHub Pages)
Tutti i percorsi sono relativi: pubblica la cartella così com'è (Settings → Pages → branch `main`, root).
## Regole
- Nessun colore fuori da `css/tokens.css`; nessuno stile inline; un file JS + un file CSS per componente; stringhe solo in `js/i18n/it.js`.
- Controlli: `npm run check` (senza dipendenze) a fine di ogni fase.
- Nome del progetto: solo in `js/config.js` (`PROJECT_NAME`).
