// Oggetto `result` serializzabile (pronto per il futuro backend: userId opzionale, versione dello schema).
import { SCHEMA_VERSION } from '../config.js';
export const buildResult = ({ levelId, exerciseId, timestamp, summary }) => ({ schemaVersion: SCHEMA_VERSION, userId: null, levelId, exerciseId, timestamp, metrics: summary });
