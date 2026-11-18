let deferredPrompt = null;
let installed = false;

/** ¿Ya está instalada como PWA? (standalone / iOS / evento previo) */
export function isInstalled() {
  return (
    installed ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/** ¿El navegador puede mostrar el prompt nativo? */
export function canInstall() {
  return deferredPrompt !== null;
}

export function registerSW() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');

      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(nw);
          }
        });
      });

      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    } catch (err) {
      console.warn('SW error', err);
    }
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Avisa a la UI para que muestre/habilite el botón Instalar
    document.dispatchEvent(new CustomEvent('pwa-installable'));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installed = true;
    document.dispatchEvent(new CustomEvent('pwa-installed'));
  });
}

/**
 * Lanza el diálogo nativo de instalación.
 * @returns {Promise<{ ok:boolean, accepted?:boolean, reason?:'installed'|'unavailable'|'error' }>}
 */
export async function promptInstall() {
  if (isInstalled()) {
    return { ok: false, reason: 'installed' };
  }
  if (!deferredPrompt) {
    return { ok: false, reason: 'unavailable' };
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;

    if (outcome === 'accepted') {
      installed = true;
      document.dispatchEvent(new CustomEvent('pwa-installed'));
      return { ok: true, accepted: true };
    }
    return { ok: true, accepted: false };
  } catch (err) {
    console.warn('Install prompt error', err);
    deferredPrompt = null;
    return { ok: false, reason: 'error' };
  }
}

function showUpdateBanner(worker) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast show update-toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <span>Hay una nueva versión disponible.</span>
    <button class="btn btn-gold" type="button" style="min-height:32px;padding:0 12px;font-size:0.85rem;margin-left:10px">Actualizar</button>
  `;
  root.appendChild(el);
  el.querySelector('button').addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
}
