// Genera sonidos con Web Audio API (sin archivos externos)
let ctx = null;
let enabled = true;
let volume = 0.6;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function setAudioEnabled(v) { enabled = v; }
export function isAudioEnabled() { return enabled; }
export function setVolume(v) { volume = Math.max(0, Math.min(1, v)); }
export function getVolume() { return volume; }

function tone(freq, dur = 0.15, type = 'sine', gainVal = 0.3) {
  if (!enabled) return;
  try {
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal * volume, c.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur);
  } catch (e) { /* silencioso */ }
}

export const playSelect = () => tone(520, 0.08, 'sine', 0.2);
export const playCorrect = () => { tone(660, 0.1); setTimeout(() => tone(880, 0.15), 90); };
export const playWrong = () => tone(200, 0.25, 'sawtooth', 0.25);
export const playStar = () => {
  tone(700, 0.12); setTimeout(() => tone(880, 0.12), 100);
  setTimeout(() => tone(1100, 0.2), 220);
};
export const playVictory = () => {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.2), i * 130));
};
