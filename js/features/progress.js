import { getState, getStars } from '../core/state.js';
import { dbGetAll } from '../core/database.js';
import { starsHTML } from '../ui/components.js';

export async function renderProgress(main) {
  const state = getState();
  const stars = getStars();
  const sessions = await dbGetAll('gameSessions');
  const attempts = await dbGetAll('examAttempts');

  const bestScore = attempts.length ? Math.max(...attempts.map(a => a.score)) : null;
  const modulesDone = state.lessonProgress.modulesCompleted.length;
  const totalPercent = Math.round((stars / 3) * 60 + (modulesDone / 3) * 20 + (attempts.some(a => a.passed) ? 20 : 0));

  main.innerHTML = `
    <div class="progress-screen">
      <h1>Mi progreso</h1>
      <div class="stat-grid">
        <div class="stat-box"><div class="stat-box-value">${stars}</div><div class="stat-box-label">Estrellas</div></div>
        <div class="stat-box"><div class="stat-box-value">${modulesDone}/3</div><div class="stat-box-label">Módulos</div></div>
        <div class="stat-box"><div class="stat-box-value">${state.userProgress.islandsCompleted.length}/5</div><div class="stat-box-label">Islas</div></div>
        <div class="stat-box"><div class="stat-box-value">${bestScore !== null ? bestScore : '—'}</div><div class="stat-box-label">Mejor examen</div></div>
      </div>

      <div class="card card-dark" style="margin-bottom:var(--space-4)">
        <p style="margin:0 0 var(--space-2)">Estrellas obtenidas</p>
        ${starsHTML(stars)}
        <p style="margin-top:var(--space-3);color:var(--text-muted-dark);font-size:var(--fs-sm)">Progreso general: ${totalPercent}%</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${totalPercent}%"></div></div>
      </div>

      <h3>Historial de partidas</h3>
      ${sessions.length === 0 ? '<p style="color:var(--text-muted-dark)">Aún no hay partidas.</p>' : `
        <table class="history-table">
          <thead><tr><th>Juego</th><th>Fecha</th><th>Resultado</th></tr></thead>
          <tbody>
            ${sessions.slice().reverse().map(s => `
              <tr><td>${s.game}</td><td>${new Date(s.finishedAt).toLocaleDateString()}</td><td>${s.completed ? 'Completado' : 'En curso'}</td></tr>
            `).join('')}
          </tbody>
        </table>
      `}

      <h3 style="margin-top:var(--space-5)">Historial de exámenes</h3>
      ${attempts.length === 0 ? '<p style="color:var(--text-muted-dark)">Aún no hay exámenes.</p>' : `
        <table class="history-table">
          <thead><tr><th>Fecha</th><th>Calificación</th><th>Estado</th></tr></thead>
          <tbody>
            ${attempts.slice().reverse().map(a => `
              <tr><td>${new Date(a.date).toLocaleDateString()}</td><td>${a.score}/100</td><td>${a.passed ? '✓ Aprobado' : '✗ No aprobado'}</td></tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}
