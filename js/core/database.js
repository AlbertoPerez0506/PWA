// Base de datos IndexedDB
const DB_NAME = 'BioIslasDB';
const DB_VERSION = 1;

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      ['userProgress','lessonProgress','gameSessions','achievements','examAttempts','settings'].forEach((name) => {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' });
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function withStore(storeName, mode, work) {
  const db = await openDB();
  const os = db.transaction(storeName, mode).objectStore(storeName);
  return new Promise((resolve, reject) => {
    try {
      const req = work(os);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) { reject(err); }
  });
}

export function dbPut(store, value)     { return withStore(store, 'readwrite', (os) => os.put(value)); }
export function dbGet(store, key)       { return withStore(store, 'readonly',  (os) => os.get(key)); }
export function dbGetAll(store)         { return withStore(store, 'readonly',  (os) => os.getAll()); }
export function dbDelete(store, key)    { return withStore(store, 'readwrite', (os) => os.delete(key)); }
export function dbClear(store)          { return withStore(store, 'readwrite', (os) => os.clear()); }

export async function resetAll() {
  for (const s of ['userProgress','lessonProgress','gameSessions','achievements','examAttempts','settings']) {
    await dbClear(s);
  }
}

export async function exportAll() {
  const data = {};
  for (const s of ['userProgress','lessonProgress','gameSessions','achievements','examAttempts','settings']) {
    data[s] = await dbGetAll(s);
  }
  return { version: DB_VERSION, exportedAt: new Date().toISOString(), data };
}

export async function importAll(payload) {
  if (!payload || !payload.data || payload.version !== DB_VERSION)
    throw new Error('Formato de respaldo inválido');
  await resetAll();
  for (const store of Object.keys(payload.data)) {
    for (const item of payload.data[store]) {
      await dbPut(store, item);
    }
  }
}
