// app.js — Inicialización global: Service Worker, iconos, navegación activa.

import { renderIcons } from './icons.js';

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW no registrado:', err);
    });
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  renderIcons();
  highlightActiveNav();
  setupInstallPrompt();
});

function highlightActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('[data-nav-link]').forEach((el) => {
    const href = el.getAttribute('href');
    if (href === path || (path === '/' && href === '/index.html')) {
      el.classList.add('active');
      el.setAttribute('aria-current', 'page');
    }
  });
}

// Banner de instalación PWA
let deferredPrompt = null;
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.add('show');
    const btn = document.getElementById('install-btn');
    if (btn) {
      btn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (banner) banner.classList.remove('show');
      });
    }
  });
}

// Exportar helper para que otras páginas lo usen si lo necesitan
export { renderIcons };
