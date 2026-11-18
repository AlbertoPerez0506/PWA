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
      if (!db.objectStoreNames.contains('userProgress'))
        db.createObjectStore('userProgress', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('lessonProgress'))
        db.createObjectStore('lessonProgress', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('gameSessions'))
        db.createObjectStore('gameSessions', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('achievements'))
        db.createObjectStore('achievements', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('examAttempts'))
        db.createObjectStore('examAttempts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('settings'))
        db.createObjectStore('settings', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(storeName, mode) {
  const db = await openDB();
  return db.transaction(storeName, mode).objectStore(storeName);
}

export async function dbPut(store, value) {
  return new Promise(async (resolve, reject) => {
    const os = await tx(store, 'readwrite');
    const req = os.put(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGet(store, key) {
  return new Promise(async (resolve, reject) => {
    const os = await tx(store, 'readonly');
    const req = os.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetAll(store) {
  return new Promise(async (resolve, reject) => {
    const os = await tx(store, 'readonly');
    const req = os.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbDelete(store, key) {
  return new Promise(async (resolve, reject) => {
    const os = await tx(store, 'readwrite');
    const req = os.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbClear(store) {
  return new Promise(async (resolve, reject) => {
    const os = await tx(store, 'readwrite');
    const req = os.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function resetAll() {
  const stores = ['userProgress','lessonProgress','gameSessions','achievements','examAttempts','settings'];
  for (const s of stores) await dbClear(s);
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
