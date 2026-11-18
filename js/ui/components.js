import { STAR_SVG, LOGO_SVG } from './assets.js';

export function starsHTML(count) {
  let html = '<div class="stars-row" aria-label="' + count + ' de 3 estrellas">';
  for (let i = 0; i < 3; i++) {
    html += STAR_SVG.replace('class="star"', `class="star ${i < count ? 'earned' : ''}"`);
  }
  return html + '</div>';
}

export function logoSVG(size = 36) {
  return LOGO_SVG.replace('<svg', `<svg width="${size}" height="${size}"`);
}

/** Badge grande de estrella para pantallas de victoria (sin emoji ★). */
export function starBadgeHTML() {
  return STAR_SVG.replace('class="star"', 'class="star"').replace('<svg', '<svg viewBox="0 0 24 24"');
}

export function confetti(count = 40) {
  const colors = ['#F2B872', '#255941', '#7BA685', '#A8B5AD', '#F2ECE4'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.6) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3200);
  }
}

export function progressBar(percent) {
  return `<div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>`;
}
