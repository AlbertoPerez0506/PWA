// results-page.js — Lógica específica de la página "Mi progreso".

import { getGameProgress, clearProgress } from './db.js';
import { renderIcons, icon } from './icons.js';

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
    renderIcons();
    return;
  }

  empty.hidden = true;
  history.hidden = false;
  if (clearBtn) clearBtn.hidden = false;

  history.innerHTML = progress.map((p) => {
    const pct = Math.round((p.score / p.totalQuestions) * 100);
    const date = new Date(p.completedAt).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    return `
      <div class="history-item">
        <div class="history-item__info">
          <span class="history-item__name">${escapeHtml(p.gameName)}</span>
          <span class="history-item__date">${date}</span>
        </div>
        <span class="history-item__score">${p.score}/${p.totalQuestions} · ${pct}%</span>
      </div>`;
  }).join('');

  renderIcons();

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (!confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) return;
      await clearProgress();
      location.reload();
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
