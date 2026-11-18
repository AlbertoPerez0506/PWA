import { dbGet, dbPut, dbGetAll } from './database.js';

const state = {
  userProgress: null,
  lessonProgress: null,
  achievements: [],
  settings: { id: 'app', sound: true, volume: 0.6, narration: false, reduceMotion: false },
  loaded: false
};

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => fn(state)); }

export async function loadState() {
  let up = await dbGet('userProgress', 'main');
  if (!up) {
    up = {
      id: 'main',
      islandsCompleted: [], // [1,2,3,4,5]
      currentIsland: 1,
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      finished: false
    };
    await dbPut('userProgress', up);
  }
  state.userProgress = up;

  let lp = await dbGet('lessonProgress', 'main');
  if (!lp) {
    lp = { id: 'main', modulesCompleted: [], segmentsCompleted: {}, lastPosition: { module: 0, segment: 0 } };
    await dbPut('lessonProgress', lp);
  }
  state.lessonProgress = lp;

  state.achievements = await dbGetAll('achievements');

  let st = await dbGet('settings', 'app');
  if (!st) {
    st = { id: 'app', sound: true, volume: 0.6, narration: false, reduceMotion: false };
    await dbPut('settings', st);
  }
  state.settings = st;

  state.loaded = true;
  emit();
  return state;
}

export function getState() { return state; }

export function getStars() {
  return state.achievements.filter(a => a.type === 'star').length;
}

export function hasStar(id) {
  return state.achievements.some(a => a.id === id && a.type === 'star');
}

export async function awardStar(starId, gameId, sessionId) {
  if (hasStar(starId)) return false;
  const achievement = {
    id: starId,
    type: 'star',
    game: gameId,
    earnedAt: new Date().toISOString(),
    sessionRef: sessionId || null
  };
  await dbPut('achievements', achievement);
  state.achievements = await dbGetAll('achievements');
  emit();
  return true;
}

export async function saveUserProgress() {
  state.userProgress.lastActivity = new Date().toISOString();
  await dbPut('userProgress', state.userProgress);
  emit();
}

export async function markIslandCompleted(islandNum) {
  const list = state.userProgress.islandsCompleted;
  if (!list.includes(islandNum)) {
    list.push(islandNum);
    await saveUserProgress();
  }
}

export async function saveLessonProgress() {
  await dbPut('lessonProgress', state.lessonProgress);
  emit();
}

export async function updateSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  await dbPut('settings', state.settings);
  emit();
}

// Reglas de desbloqueo
export function isIslandUnlocked(n) {
  const stars = getStars();
  const lc = state.userProgress.islandsCompleted;
  switch (n) {
    case 1: return true;
    case 2: return lc.includes(1);
    case 3: return stars >= 1;
    case 4: return stars >= 2;
    case 5: return stars >= 3;
    default: return false;
  }
}
