// js/ui/modal.js
const modalRoot = () => document.getElementById('modal-root');

let activeDialog = null;

export function openModal({ title, bodyHTML = '', actions = [], onClose } = {}) {
  closeModal();

  const root = modalRoot();
  if (!root) return null;

  // Foco capturado localmente por modal — evita race en aperturas encadenadas.
  const returnFocus = document.activeElement;

  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog';
  dialog.setAttribute('aria-labelledby', 'app-dialog-title');
  if ('closedBy' in HTMLDialogElement.prototype) {
    dialog.setAttribute('closedby', 'any');
  }

  const titleId = 'app-dialog-title';
  const form = document.createElement('form');
  form.method = 'dialog';
  form.className = 'app-dialog-form';

  form.innerHTML = `
    <header class="app-dialog-header">
      <h2 id="${titleId}" class="app-dialog-title">${escapeHTML(title || '')}</h2>
      <button type="button" class="app-dialog-close" aria-label="Cerrar" data-close>&times;</button>
    </header>
    <div class="app-dialog-body">${bodyHTML}</div>
    <footer class="app-dialog-actions"></footer>
  `;

  const actionsEl = form.querySelector('.app-dialog-actions');
  actions.forEach((a) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn ${a.className || 'btn-secondary'}`;
    btn.textContent = a.label;
    if (a.value != null) btn.value = a.value;
    btn.addEventListener('click', () => {
      if (a.onClick) a.onClick();
      if (a.close !== false) dialog.close(a.value ?? '');
    });
    actionsEl.appendChild(btn);
  });

  form.querySelector('[data-close]').addEventListener('click', () => dialog.close('cancel'));
  dialog.appendChild(form);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) dialog.close('backdrop');
    }
  });

  dialog.addEventListener('close', () => {
    if (typeof onClose === 'function') onClose(dialog.returnValue);
    dialog.remove();
    if (activeDialog === dialog) activeDialog = null;
    // Solo devolvemos foco si no hay otro modal abierto
    if (!activeDialog && returnFocus && document.contains(returnFocus)) {
      returnFocus.focus({ preventScroll: true });
    }
  });

  root.appendChild(dialog);
  activeDialog = dialog;
  dialog.showModal();

  const primary = actionsEl.querySelector('button');
  (primary || form.querySelector('[data-close]')).focus({ preventScroll: true });

  return dialog;
}

export function closeModal() {
  if (activeDialog && activeDialog.open) activeDialog.close('external');
  activeDialog = null;
}

export function toast(msg, ms = 2400) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = msg;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, ms);
}

export function confirmDialog(title, message, onConfirm, { confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' } = {}) {
  openModal({
    title,
    bodyHTML: `<p>${escapeHTML(message)}</p>`,
    actions: [
      { label: cancelLabel, className: 'btn-secondary' },
      { label: confirmLabel, className: 'btn-primary', onClick: onConfirm }
    ]
  });
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
