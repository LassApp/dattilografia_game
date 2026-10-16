// Configurazione globale. Nessun colore qui (§4).
export const PROJECT_NAME = 'NOME_DA_DEFINIRE';
export const VERSION = '0.3.0';
export const STORAGE_NS = 'dt'; // prefisso neutro: il nome del prodotto cambierà, i dati locali no
export const SCHEMA_VERSION = 1;
// Valori operativi (Fase 3) — DA CONCORDARE: si cambiano solo qui.
export const HINT_ERRORS = 5;            // errori consecutivi sullo stesso carattere prima del suggerimento
export const HINT_COOLDOWN_MS = 20000;   // attesa minima tra due suggerimenti
export const IDLE_PAUSE_MS = 60000;      // pausa automatica per inattività
export const RESTART_CONFIRM_CHARS = 10; // oltre questa soglia "Ricomincia" chiede conferma
export const SAMPLE_MS = 3000;           // campionamento della velocità per il grafico
export const WPM_MIN_MS = 2000;          // prima di questo tempo l'HUD mostra "—" al posto dei WPM
export const HUD_REFRESH_MS = 250;       // aggiornamento dell'HUD (~4 Hz)
