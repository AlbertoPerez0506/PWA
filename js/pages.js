// pages.js — Lógica específica de páginas: results.html y settings.html.

import { getGameProgress, clearProgress, getPreference, savePreference } from './db.js';
import { isSupported as notifSupported, requestPermission, isEnabled as notifEnabled, disable as notifDisable } from './notifications.js';
import { setMuted } from './audio.js';
import { renderIcons, icon } from './icons.js';

// ---------- Página de resultados ----------
export async function initResultsPage() {
  const history = document.getElementById('history');
  const empty = document.getElementById('history-empty');
  const clearBtn = document.getElementById('clear-history-btn');
  if (!history) return;

  const progress = await getGameProgress();

  if (progress.length === 0) {
    empty.hidden = false;
    history.hidden = true;
    if (clearBtn) clearBtn.hidden = true;
    return;
  }

  empty.hidden = true;
  history.hidden = false;

  history.innerHTML = progress.map((p) => {
    const pct = Math.round((p.score / p.totalQuestions) * 100);
    const date = new Date(p.completedAt).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    return `
      <div class="history-item">
        <div class="history-item__info">
          <span class="history-item__name">${p.gameName}</span>
          <span class="history-item__date">${date}</span>
        </div>
        <span class="history-item__score">${p.score}/${p.totalQuestions} · ${pct}%</span>
      </div>`;
  }).join('');

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (!confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) return;
      await clearProgress();
      location.reload();
    });
  }
}

// ---------- Página de ajustes ----------
export async function initSettingsPage() {
  // Notificaciones
  const notifToggle = document.getElementById('notif-toggle');
  const notifStatus = document.getElementById('notif-status');
  if (notifToggle) {
    const supported = notifSupported();
    const enabled = supported && await notifEnabled();
    notifToggle.setAttribute('aria-checked', String(enabled));
    if (!supported) {
      notifToggle.disabled = true;
      if (notifStatus) notifStatus.textContent = 'No disponible en este navegador.';
    } else {
      if (notifStatus) notifStatus.textContent = enabled ? 'Activadas' : 'Desactivadas';
      notifToggle.addEventListener('click', async () => {
        if (notifToggle.getAttribute('aria-checked') === 'true') {
          await notifDisable();
          notifToggle.setAttribute('aria-checked', 'false');
          if (notifStatus) notifStatus.textContent = 'Desactivadas';
        } else {
          const ok = await requestPermission();
          notifToggle.setAttribute('aria-checked', String(ok));
          if (notifStatus) notifStatus.textContent = ok ? 'Activadas' : 'Permiso denegado';
        }
      });
    }
  }

  // Sonidos
  const soundToggle = document.getElementById('sound-toggle');
  const soundStatus = document.getElementById('sound-status');
  if (soundToggle) {
    const muted = await getPreference('muted', false);
    setMuted(muted);
    soundToggle.setAttribute('aria-checked', String(!muted));
    if (soundStatus) soundStatus.textContent = muted ? 'Silenciados' : 'Activados';
    soundToggle.addEventListener('click', async () => {
      const currentlyMuted = soundToggle.getAttribute('aria-checked') === 'false';
      const newMuted = !currentlyMuted;
      setMuted(newMuted);
      await savePreference('muted', newMuted);
      soundToggle.setAttribute('aria-checked', String(!newMuted));
      if (soundStatus) soundStatus.textContent = newMuted ? 'Silenciados' : 'Activados';
    });
  }

  // Borrar datos
  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (!confirm('¿Borrar TODOS los datos (progreso, respuestas y preferencias)? Esta acción no se puede deshacer.')) return;
      await clearProgress();
      alert('Datos borrados. La página se recargará.');
      location.reload();
    });
  }

  // Instalar app
  const installBtn = document.getElementById('install-app-btn');
  if (installBtn) {
    installBtn.addEventListener('click', () => {
      const banner = document.getElementById('install-banner');
      if (banner) banner.classList.add('show');
      else alert('Usa el menú de tu navegador para instalar esta aplicación.');
    });
  }
}
