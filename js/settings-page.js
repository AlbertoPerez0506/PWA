// settings-page.js — Lógica específica de la página "Ajustes".

import { clearProgress, getPreference, savePreference } from './db.js';
import {
  isSupported as notifSupported,
  requestPermission,
  isEnabled as notifEnabled,
  disable as notifDisable
} from './notifications.js';
import { setMuted } from './audio.js';
import { renderIcons } from './icons.js';

export async function initSettingsPage() {
  await initNotifications();
  await initSounds();
  initClearData();
  initInstallButton();
  renderIcons();
}

async function initNotifications() {
  const toggle = document.getElementById('notif-toggle');
  const status = document.getElementById('notif-status');
  if (!toggle) return;

  const supported = notifSupported();
  const enabled = supported && await notifEnabled();
  toggle.setAttribute('aria-checked', String(enabled));

  if (!supported) {
    toggle.disabled = true;
    if (status) status.textContent = 'No disponible en este navegador.';
    return;
  }

  if (status) status.textContent = enabled ? 'Activadas' : 'Desactivadas';

  toggle.addEventListener('click', async () => {
    if (toggle.getAttribute('aria-checked') === 'true') {
      await notifDisable();
      toggle.setAttribute('aria-checked', 'false');
      if (status) status.textContent = 'Desactivadas';
    } else {
      const ok = await requestPermission();
      toggle.setAttribute('aria-checked', String(ok));
      if (status) status.textContent = ok ? 'Activadas' : 'Permiso denegado';
    }
  });
}

async function initSounds() {
  const toggle = document.getElementById('sound-toggle');
  const status = document.getElementById('sound-status');
  if (!toggle) return;

  const muted = await getPreference('muted', false);
  setMuted(muted);
  toggle.setAttribute('aria-checked', String(!muted));
  if (status) status.textContent = muted ? 'Silenciados' : 'Activados';

  toggle.addEventListener('click', async () => {
    const currentlyEnabled = toggle.getAttribute('aria-checked') === 'true';
    const newMuted = currentlyEnabled;
    setMuted(newMuted);
    await savePreference('muted', newMuted);
    toggle.setAttribute('aria-checked', String(!newMuted));
    if (status) status.textContent = newMuted ? 'Silenciados' : 'Activados';
  });
}

function initClearData() {
  const btn = document.getElementById('clear-data-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (!confirm('¿Borrar TODOS los datos (progreso, respuestas y preferencias)? Esta acción no se puede deshacer.')) return;
    await clearProgress();
    await new Promise((r) => setTimeout(r, 100));
    alert('Datos borrados. La página se recargará.');
    location.reload();
  });
}

function initInstallButton() {
  const btn = document.getElementById('install-app-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.add('show');
    else alert('Usa el menú de tu navegador para instalar esta aplicación.');
  });
}
