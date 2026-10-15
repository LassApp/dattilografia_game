# Piattaforma di dattilografia (NOME_DA_DEFINIRE)
Sito statico: HTML + CSS + JavaScript vanilla (moduli ES), nessuna dipendenza.
## Avvio
I moduli ES non funzionano da `file://`: serve un server statico, es. `python -m http.server 8000`, poi http://localhost:8000/ (app), `/palette.html`, `/componenti.html`.
Se `palette.html`, `componenti.html` o l'app mostrano solo il titolo, stai aprendo il file con doppio clic (`file://`): usa un server (su Windows: `py -m http.server 8000`, oppure l'estensione Live Server di VS Code) o la versione pubblicata su GitHub Pages.
## Pubblicazione (GitHub Pages)
Tutti i percorsi sono relativi: pubblica la cartella così com'è (Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`). L'indirizzo sarà `https://<utente>.github.io/<repository>/`. Il workflow `.github/workflows/check.yml` esegue `npm run check` a ogni push.
## Regole
- Nessun colore fuori da `css/tokens.css`; nessuno stile inline; un file JS + un file CSS per componente; stringhe solo in `js/i18n/it.js`.
- Controlli: `npm run check` (senza dipendenze) a fine di ogni fase.
- Nome del progetto: solo in `js/config.js` (`PROJECT_NAME`).
