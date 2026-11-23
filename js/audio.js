// audio.js — Sonidos generados con Web Audio API.
// No requiere archivos externos, funciona 100% offline.

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function beep(freq, duration, volume = 0.08, type = 'sine') {
  try {
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch (e) { /* silencio */ }
}

let muted = false;
export function setMuted(v) { muted = !!v; }

export const sounds = {
  click: () => { if (!muted) beep(640, 0.06, 0.05); },
  correct: () => {
    if (muted) return;
    beep(523, 0.10); setTimeout(() => beep(659, 0.10), 100); setTimeout(() => beep(784, 0.14), 200);
  },
  incorrect: () => {
    if (muted) return;
    beep(320, 0.14, 0.08, 'triangle');
    setTimeout(() => beep(220, 0.20, 0.08, 'triangle'), 150);
  },
  complete: () => {
    if (muted) return;
    beep(523, 0.10); setTimeout(() => beep(659, 0.10), 100); setTimeout(() => beep(784, 0.10), 200); setTimeout(() => beep(1047, 0.22), 300);
  }
};
