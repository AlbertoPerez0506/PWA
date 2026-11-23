// db.js — Capa IndexedDB con Dexie.
// Guarda: progreso de juegos, respuestas del examen, preferencias de usuario.

import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@4.0.10/+esm';

export const db = new Dexie('BioislasDB');

db.version(1).stores({
  gameProgress: '++id, gameName, score, totalQuestions, completedAt',
  examAnswers: '++id, questionId, selectedAnswer, isCorrect, answeredAt',
  preferences: 'key'
});

/** Guarda el resultado de una partida o examen */
export async function saveGameProgress(gameName, score, totalQuestions) {
  return db.gameProgress.add({
    gameName,
    score,
    totalQuestions,
    completedAt: new Date().toISOString()
  });
}

/** Devuelve todo el progreso, ordenado por fecha descendente */
export async function getGameProgress() {
  const all = await db.gameProgress.toArray();
  return all.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

/** Borra todo el progreso y las respuestas del examen */
export async function clearProgress() {
  await db.gameProgress.clear();
  await db.examAnswers.clear();
}

/** Guarda o actualiza una preferencia */
export async function savePreference(key, value) {
  return db.preferences.put({ key, value });
}

/** Lee una preferencia */
export async function getPreference(key, defaultValue = null) {
  const row = await db.preferences.get(key);
  return row?.value ?? defaultValue;
}
