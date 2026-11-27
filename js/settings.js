import './experience.js';
import { getPreference, savePreference, clearJourneyData } from './db.js';
import { initAudio, setAudioEnabled } from './audio.js';
import {
  getTheme,
  getResolvedTheme,
  setTheme
} from './theme.js';
import {
  notificationsSupported,
  isNotificationsEnabled,
  enableNotifications,
  disableNotifications
} from './notifications.js';

const $ = id => document.getElementById(id);
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
});

await initAudio();

const soundEnabled = await getPreference('soundEnabled', !(await getPreference('muted', false)));
$('sound-setting').setAttribute('aria-checked', String(soundEnabled));
$('sound-status').textContent = soundEnabled ? 'Activados' : 'Silenciados';
$('sound-setting').addEventListener('click', async () => {
  const enabled = $('sound-setting').getAttribute('aria-checked') !== 'true';
  await setAudioEnabled(enabled);
  $('sound-setting').setAttribute('aria-checked', String(enabled));
  $('sound-status').textContent = enabled ? 'Activados' : 'Silenciados';
});

function describeTheme(mode) {
  if (mode === 'light') return 'Modo claro';
  if (mode === 'dark') return 'Modo oscuro';
  return `Sistema · actualmente ${getResolvedTheme('system') === 'dark' ? 'oscuro' : 'claro'}`;
}

function renderThemeSetting(mode = getTheme()) {
  document.querySelectorAll('[data-theme-option]').forEach(button => {
    const selected = button.dataset.themeOption === mode;
    button.setAttribute('aria-pressed', String(selected));
  });
  $('theme-status').textContent = describeTheme(mode);
}

renderThemeSetting();
const systemAppearance = window.matchMedia?.('(prefers-color-scheme: dark)');
systemAppearance?.addEventListener?.('change', () => {
  if (getTheme() === 'system') renderThemeSetting('system');
});
document.querySelectorAll('[data-theme-option]').forEach(button => {
  button.addEventListener('click', () => {
    const mode = button.dataset.themeOption;
    setTheme(mode);
    renderThemeSetting(mode);
  });
});

if (!notificationsSupported()) {
  $('notification-setting').disabled = true;
  $('notification-status').textContent = 'No disponible en este navegador.';
} else {
  const enabled = await isNotificationsEnabled();
  $('notification-setting').setAttribute('aria-checked', String(enabled));
  $('notification-status').textContent = enabled ? 'Activadas' : 'Desactivadas';
  $('notification-setting').addEventListener('click', async () => {
    const next = $('notification-setting').getAttribute('aria-checked') !== 'true'
      ? await enableNotifications()
      : await disableNotifications();
    $('notification-setting').setAttribute('aria-checked', String(next));
    $('notification-status').textContent = next ? 'Activadas' : 'Desactivadas';
  });
}

$('install-setting').addEventListener('click', async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    deferredPrompt = null;
  } else {
    alert('En el menú de tu navegador selecciona “Instalar aplicación” o “Añadir a pantalla de inicio”.');
  }
});

$('clear-setting').addEventListener('click', async () => {
  if (!confirm('¿Seguro que deseas borrar el progreso y el historial de BIOISLAS? Esta acción no se puede deshacer.')) return;
  await clearJourneyData();
  await savePreference('welcomeSeen', false);
  alert('El progreso se ha restablecido. La aplicación volverá a comenzar.');
  location.href = '/index.html';
});
