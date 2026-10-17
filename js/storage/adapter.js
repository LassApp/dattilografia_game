// Contratto degli adapter di storage: oggi LocalStorageAdapter, domani SupabaseAdapter (le versioni di rete saranno asincrone: i chiamanti usano già `await`).
/**
 * @typedef {{wpmNet:number,accuracy:number,errors:number,elapsedMs:number,stars:number,timestamp:number}} BestResult
 * @typedef {{attempts:number,bestStars:number,best:BestResult|null,lastTimestamp:number}} ExerciseProgress
 * @typedef {Object} StorageAdapter
 * @property {() => {schemaVersion:number,exercises:Object<string,ExerciseProgress>}} getProgress
 * @property {(levelId:string, exerciseId:string) => (BestResult|null)} getBest
 * @property {(result:object, evaluation:{stars:number}) => void} saveResult
 */
export {};
