const modalRoot = () => document.getElementById('modal-root');

export function openModal({ title, bodyHTML, actions = [], onClose }) {
  const root = modalRoot();
  root.innerHTML = '';
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h3 id="modal-title">${title}</h3>
      <div class="modal-body">${bodyHTML || ''}</div>
      <div class="modal-actions"></div>
    </div>`;
  const actionsEl = backdrop.querySelector('.modal-actions');
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = `btn ${a.className || 'btn-secondary'}`;
    btn.textContent = a.label;
    btn.addEventListener('click', () => {
      if (a.onClick) a.onClick();
      if (a.close !== false) closeModal();
    });
    actionsEl.appendChild(btn);
  });
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) { if (onClose) onClose(); closeModal(); }
  });
  root.appendChild(backdrop);
  const firstBtn = actionsEl.querySelector('button');
  if (firstBtn) firstBtn.focus();
}

export function closeModal() {
  modalRoot().innerHTML = '';
}

export function toast(msg, ms = 2200) {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, ms);
}

export function confirmDialog(title, message, onConfirm) {
  openModal({
    title,
    bodyHTML: `<p>${message}</p>`,
    actions: [
      { label: 'Cancelar', className: 'btn-secondary' },
      { label: 'Confirmar', className: 'btn-primary', onClick: onConfirm }
    ]
  });
}
