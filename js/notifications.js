// notifications.js — Gestión de notificaciones locales (opt-in del usuario).

import { getPreference, savePreference } from './db.js';

const KEY = 'notificationsEnabled';

export function isSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export async function requestPermission() {
  if (!isSupported()) return false;
  const permission = await Notification.requestPermission();
  const enabled = permission === 'granted';
  await savePreference(KEY, enabled);
  return enabled;
}

export async function isEnabled() {
  const saved = await getPreference(KEY, false);
  return saved && Notification.permission === 'granted';
}

export async function showLocal(title, body, url = '/') {
  if (!(await isEnabled())) return;
  const reg = await navigator.serviceWorker.ready;
  reg.showNotification(title, {
    body,
    icon: '/assets/images/icon.svg',
    badge: '/assets/images/icon.svg',
    data: { url }
  });
}

export async function disable() {
  await savePreference(KEY, false);
}
