// Mini event emitter. on() restituisce la funzione per annullare l'iscrizione.
export function createEmitter() {
  const m = new Map();
  return {
    on(type, fn) { (m.get(type) || m.set(type, new Set()).get(type)).add(fn); return () => m.get(type).delete(fn); },
    emit(type, payload) { m.get(type)?.forEach((fn) => fn(payload)); },
  };
}
