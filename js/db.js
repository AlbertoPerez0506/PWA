// BIOISLAS V4 — IndexedDB nativo. Conserva las tablas históricas creadas por Dexie.
const DB_NAME = 'BioislasDB';
const DB_VERSION = 20; // Dexie version(1) se almacena como versión nativa 10.
let databasePromise;

function openDatabase() {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('Este navegador no admite IndexedDB.'));
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('gameProgress')) {
        const store = db.createObjectStore('gameProgress', { keyPath: 'id', autoIncrement: true });
        ['gameName','score','totalQuestions','completedAt'].forEach(key => store.createIndex(key,key));
      }
      if (!db.objectStoreNames.contains('examAnswers')) {
        const store = db.createObjectStore('examAnswers', { keyPath: 'id', autoIncrement: true });
        ['questionId','selectedAnswer','isCorrect','answeredAt'].forEach(key => store.createIndex(key,key));
      }
      if (!db.objectStoreNames.contains('preferences')) db.createObjectStore('preferences', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('islandState')) db.createObjectStore('islandState', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('examAttempts')) {
        const store = db.createObjectStore('examAttempts', { keyPath: 'id', autoIncrement: true });
        ['createdAt','score','passed'].forEach(key => store.createIndex(key,key));
      }
    };
    request.onsuccess = () => { const db = request.result; db.onversionchange = () => db.close(); resolve(db); };
    request.onerror = () => reject(request.error || new Error('No fue posible abrir el almacenamiento local.'));
    request.onblocked = () => reject(new Error('Cierra otras pestañas de BIOISLAS para completar la actualización.'));
  });
  return databasePromise;
}
function requestValue(request) { return new Promise((resolve,reject) => { request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error); }); }
async function readStore(storeName,key) { const db=await openDatabase(); const tx=db.transaction(storeName,'readonly'); return requestValue(tx.objectStore(storeName).get(key)); }
async function allFromStore(storeName) { const db=await openDatabase(); const tx=db.transaction(storeName,'readonly'); return requestValue(tx.objectStore(storeName).getAll()); }
async function writeStore(storeName,value) { const db=await openDatabase(); return new Promise((resolve,reject)=>{ const tx=db.transaction(storeName,'readwrite'); let result; const req=tx.objectStore(storeName).put(value); req.onsuccess=()=>result=req.result; tx.oncomplete=()=>resolve(result); tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error||new Error('Operación cancelada.')); }); }

const DEFAULT_JOURNEY = Object.freeze({ completedModules: [], completedGames: [], stars: 0, examUnlocked: false, examAttempts: 0, examPassed: false });
export async function getJourney() { const row=await readStore('islandState','journey'); return { ...DEFAULT_JOURNEY, ...(row?.value||{}) }; }
export async function getState(key,fallback=null) { const row=await readStore('islandState',key); return row?.value ?? fallback; }
export async function setState(key,value) { return writeStore('islandState',{key,value,updatedAt:new Date().toISOString()}); }

export async function completeModule(moduleId) {
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('islandState','readwrite'); const store=tx.objectStore('islandState'); const req=store.get('journey'); let result;
    req.onsuccess=()=>{
      const journey={...DEFAULT_JOURNEY,...(req.result?.value||{})};
      const moduleOrder=['module-1','module-2','module-3'];
      if(!moduleOrder.includes(moduleId)){result={ok:false,reason:'El módulo solicitado no existe.'};return;}
      const previous={'module-2':'module-1','module-3':'module-2'}[moduleId];
      if(previous&&!journey.completedModules.includes(previous)){result={ok:false,reason:'Completa primero el módulo anterior.'};return;}
      const firstTime=!journey.completedModules.includes(moduleId);
      if(firstTime) journey.completedModules=[...journey.completedModules,moduleId];
      store.put({key:'journey',value:journey,updatedAt:new Date().toISOString()}); result={ok:true,firstTime,journey};
    };
    tx.oncomplete=()=>resolve(result); tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error||new Error('No se pudo guardar el módulo.'));
  });
}

export async function completeGame(gameId,gameName,score,total,stats={}) {
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(['islandState','gameProgress'],'readwrite'); const state=tx.objectStore('islandState'); const progress=tx.objectStore('gameProgress'); const req=state.get('journey'); let result;
    req.onsuccess=()=>{
      const journey={...DEFAULT_JOURNEY,...(req.result?.value||{})};
      const order=['game-memorama','game-terms','game-sequence']; const index=order.indexOf(gameId); const previous=index>0?order[index-1]:null;
      if(index<0){result={ok:false,reason:'El desafío solicitado no existe.'};tx.abort();return;}
      if(index===0&&!['module-1','module-2','module-3'].every(id=>journey.completedModules.includes(id))){result={ok:false,reason:'Completa primero los tres módulos de la Isla 01.'};tx.abort();return;}
      if(previous&&!journey.completedGames.includes(previous)){result={ok:false,reason:'Completa primero el desafío anterior.'};tx.abort();return;}
      const firstTime=!journey.completedGames.includes(gameId);
      if(firstTime) journey.completedGames=[...journey.completedGames,gameId];
      journey.stars=journey.completedGames.length; journey.examUnlocked=journey.stars>=3;
      progress.add({gameId,gameName,score,totalQuestions:total,stats,completedAt:new Date().toISOString(),firstCompletion:firstTime});
      state.put({key:'journey',value:journey,updatedAt:new Date().toISOString()}); result={ok:true,firstTime,journey};
    };
    tx.oncomplete=()=>resolve(result); tx.onerror=()=>reject(tx.error); tx.onabort=()=>{ if(result?.ok===false)resolve(result); else reject(tx.error||new Error('No se pudo guardar el resultado.')); };
  });
}

export async function saveGameProgress(gameName,score,totalQuestions,extra={}) {
  const db=await openDatabase(); return new Promise((resolve,reject)=>{const tx=db.transaction('gameProgress','readwrite');let id;const req=tx.objectStore('gameProgress').add({gameName,score,totalQuestions,completedAt:new Date().toISOString(),...extra});req.onsuccess=()=>id=req.result;tx.oncomplete=()=>resolve(id);tx.onerror=()=>reject(tx.error);});
}
export async function getGameProgress() { const rows=await allFromStore('gameProgress'); return rows.sort((a,b)=>new Date(b.completedAt)-new Date(a.completedAt)); }
export async function saveExamAnswer(questionId,selectedAnswer,isCorrect,attemptId=null) { const db=await openDatabase(); const tx=db.transaction('examAnswers','readwrite'); return requestValue(tx.objectStore('examAnswers').add({questionId,selectedAnswer,isCorrect,attemptId,answeredAt:new Date().toISOString()})); }

export async function saveExamAttempt(attempt) {
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(['examAttempts','examAnswers','islandState','gameProgress'],'readwrite');
    const attempts=tx.objectStore('examAttempts'), answers=tx.objectStore('examAnswers'), state=tx.objectStore('islandState'), progress=tx.objectStore('gameProgress');
    const stateReq=state.get('journey'); let attemptId; let blockedReason=null; let record;
    stateReq.onsuccess=()=>{
      const journey={...DEFAULT_JOURNEY,...(stateReq.result?.value||{})};
      if(journey.stars<3){blockedReason='El examen requiere las tres estrellas de los juegos.';tx.abort();return;}
      record={...attempt,createdAt:new Date().toISOString()};
      const add=attempts.add(record);
      add.onsuccess=()=>{
        attemptId=add.result;
        for(const answer of(record.answers||[]))answers.add({...answer,attemptId,answeredAt:record.createdAt});
        progress.add({gameId:'exam-final',gameName:'Examen final',score:record.correctCount,totalQuestions:record.totalQuestions,completedAt:record.createdAt,percentage:record.score,passed:record.passed});
        journey.examAttempts=(journey.examAttempts||0)+1;
        if(record.passed)journey.examPassed=true;
        state.put({key:'journey',value:journey,updatedAt:new Date().toISOString()});
      };
    };
    tx.oncomplete=()=>resolve({id:attemptId,...record});
    tx.onerror=()=>reject(tx.error||new Error('No se pudo guardar el examen.'));
    tx.onabort=()=>reject(blockedReason?new Error(blockedReason):(tx.error||new Error('No se pudo guardar el examen.')));
  });
}
export async function getExamAttempts() { const rows=await allFromStore('examAttempts'); return rows.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); }
export async function getExamAttempt(id) { const db=await openDatabase(); const tx=db.transaction('examAttempts','readonly'); return requestValue(tx.objectStore('examAttempts').get(Number(id))); }
export async function savePreference(key,value) { return writeStore('preferences',{key,value}); }
export async function getPreference(key,defaultValue=null) { const row=await readStore('preferences',key); return row?.value ?? defaultValue; }
export async function clearJourneyData() { const db=await openDatabase(); return new Promise((resolve,reject)=>{const names=['gameProgress','examAnswers','examAttempts','islandState'];const tx=db.transaction(names,'readwrite');names.forEach(name=>tx.objectStore(name).clear());tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);}); }
export async function clearProgress() { return clearJourneyData(); }
