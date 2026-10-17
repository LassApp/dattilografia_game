// Punto unico: domani qui si sceglie SupabaseAdapter senza toccare il resto dell'app.
import { createLocalStorageAdapter } from './local-storage-adapter.js';
export const storage = createLocalStorageAdapter();
