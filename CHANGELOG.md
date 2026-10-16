# Changelog
## 0.3.0 — Fase 3 (metriche, controlli, pausa)
- Motore: `metrics` (tutte le metriche del §7), `hints` (5 errori consecutivi + attesa), `result` (oggetto serializzabile); la sessione registra le metriche.
- Componenti: StatPill, Hud, Banner (Caps Lock, suggerimento), Modal (`<dialog>`), PauseOverlay, ConfirmDialog, SettingsPanel, Switch, SegmentedControl; Topbar con contesto per schermata.
- Controller: Caps Lock, pausa automatica (finestra non attiva, scheda nascosta, inattività, qualunque modal), Esc, blocco incolla/trascinamento.
- Impostazioni modificabili dal pannello (tema, suoni, guida, dita colorate, dimensione testo).
## 0.2.1 — Correzione
- Livello di prova rinominato `_prova` → `prova`: GitHub Pages (Jekyll) non pubblica file e cartelle che iniziano con `_`. Aggiunto `.nojekyll`.
## 0.2.0 — Fase 2 (layout italiano, tastiera animata, motore di input)
- `layout-it` (tasti, dita, mani, Shift opposto, AltGr, Caps per maiuscole accentate), motore `input`/`session` con blocco su errore, `text-normalize`.
- Componenti: Key, VirtualKeyboard, TextView (Char e Cursor solo CSS), FingerHint; `animations.js`; `game-controller`; schermata di gioco v0 con esercizi `[ESERCIZIO DI PROVA]`.
- Test con `node --test`. Token: `--slate-scuro` (info-text in chiaro passa AA, era 4,24:1), `--ft-t`.
## 0.1.1 — Repository
- `.gitignore`, workflow GitHub Actions `check`, nota sul server statico nel README.
## 0.1.0 — Fase 1 (scaffold)
- Struttura moduli, `tokens.css` (dai mockup approvati), `scale.css`, layer CSS, font locali (JetBrains Mono, Atkinson Hyperlegible).
- Tema chiaro/scuro (`data-theme`, rispetta `prefers-color-scheme`, scelta memorizzata).
- Componenti: Icon, Button, IconButton, ThemeToggle, Topbar, AppShell. Router hash.
- `palette.html`, `componenti.html`, `tools/check-colors.mjs`, `tools/check-architecture.mjs`.
