import { getState, updateSettings } from '../core/state.js';
import { setAudioEnabled, setVolume } from '../ui/audio.js';
import { exportAll, importAll, resetAll } from '../core/database.js';
import { confirmDialog, toast, openModal } from '../ui/modal.js';
import { navigate } from '../core/router.js';

export function renderSettings(main) {
  const s = getState().settings;

  main.innerHTML = `
    <div class="settings-screen">
      <h1>Configuración</h1>

      <div class="card card-dark" style="margin-bottom:var(--space-4)">
        <div class="setting-row">
          <div><div class="setting-label">Sonido</div><div class="setting-desc">Activa efectos de audio</div></div>
          <button class="switch" id="sw-sound" role="switch" aria-checked="${s.sound}"></button>
        </div>
        <div class="setting-row">
          <div style="flex:1"><div class="setting-label">Volumen</div><div class="setting-desc">Nivel de sonido</div></div>
          <input type="range" min="0" max="100" value="${Math.round(s.volume*100)}" id="vol" style="max-width:140px">
        </div>
        <div class="setting-row">
          <div><div class="setting-label">Reducir animaciones</div><div class="setting-desc">Menos movimiento en la interfaz</div></div>
          <button class="switch" id="sw-motion" role="switch" aria-checked="${s.reduceMotion}"></button>
        </div>
      </div>

      <div class="card card-dark" style="margin-bottom:var(--space-4)">
        <h3>Respaldo de datos</h3>
        <p style="color:var(--text-muted-dark);font-size:var(--fs-sm)">Exporta tu progreso o impórtalo desde otro respaldo. Los datos son locales a este navegador.</p>
        <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-top:var(--space-3)">
          <button class="btn btn-secondary" id="btn-export">Exportar</button>
          <button class="btn btn-secondary" id="btn-import">Importar</button>
        </div>
        <input type="file" id="file-input" accept="application/json" hidden>
      </div>

      <div class="card card-dark" style="margin-bottom:var(--space-4)">
        <h3>Información</h3>
        <p style="font-size:var(--fs-sm);color:var(--text-muted-dark)">
          BIOISLAS v1.0 · Proyecto académico · Universidad Tecnológica del Usumacinta
        </p>
      </div>

      <div class="card card-dark">
        <h3 style="color:var(--color-error)">Zona de peligro</h3>
        <p style="color:var(--text-muted-dark);font-size:var(--fs-sm)">Borra todo el progreso: estrellas, partidas, exámenes e historial.</p>
        <button class="btn btn-danger" id="btn-reset" style="margin-top:var(--space-3)">Borrar todo el progreso</button>
      </div>
    </div>
  `;

  main.querySelector('#sw-sound').addEventListener('click', async (e) => {
    const next = e.currentTarget.getAttribute('aria-checked') !== 'true';
    e.currentTarget.setAttribute('aria-checked', next);
    await updateSettings({ sound: next });
    setAudioEnabled(next);
  });
  main.querySelector('#vol').addEventListener('input', async (e) => {
    const v = parseInt(e.target.value) / 100;
    setVolume(v);
    await updateSettings({ volume: v });
  });
  main.querySelector('#sw-motion').addEventListener('click', async (e) => {
    const next = e.currentTarget.getAttribute('aria-checked') !== 'true';
    e.currentTarget.setAttribute('aria-checked', next);
    document.documentElement.style.setProperty('--transition-med', next ? '0ms' : '280ms');
    await updateSettings({ reduceMotion: next });
  });

  main.querySelector('#btn-export').addEventListener('click', async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioislas-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Respaldo exportado');
  });

  main.querySelector('#btn-import').addEventListener('click', () => {
    main.querySelector('#file-input').click();
  });
  main.querySelector('#file-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      confirmDialog('Importar respaldo', 'Se sustituirá tu progreso actual. ¿Continuar?', async () => {
        await importAll(payload);
        toast('Respaldo importado');
        setTimeout(() => location.reload(), 800);
      });
    } catch (err) {
      toast('Archivo inválido');
    }
  });

  main.querySelector('#btn-reset').addEventListener('click', () => {
    confirmDialog('Borrar progreso', 'Esta acción es irreversible. ¿Continuar?', async () => {
      await resetAll();
      toast('Progreso borrado');
      setTimeout(() => { location.hash = ''; location.reload(); }, 800);
    });
  });
}
