/* BIOISLAS REWILD · Preferencias de apariencia e identidad local.
   No requiere red ni modifica IndexedDB. */

const STORAGE_KEY = 'bioislas-theme-mode';
const VALID_MODES = new Set(['light', 'dark', 'system']);
const colorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)') ?? null;
const coarsePointerQuery = window.matchMedia?.('(pointer: coarse)') ?? null;

function readSavedMode() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return VALID_MODES.has(saved) ? saved : 'system';
  } catch (error) {
    console.warn('BIOISLAS no pudo leer la preferencia de apariencia:', error);
    return 'system';
  }
}

export function getTheme() {
  return readSavedMode();
}

export function getResolvedTheme(mode = getTheme()) {
  if (mode === 'dark') return 'dark';
  if (mode === 'light') return 'light';
  return colorSchemeQuery?.matches ? 'dark' : 'light';
}

function updateThemeColor(effectiveTheme) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = effectiveTheme === 'dark' ? '#111b16' : '#fffdf8';
}

function updateBrandImage() {
  const isMobile = Boolean(coarsePointerQuery?.matches);
  const iconPath = isMobile
    ? '/assets/icon/icon_redondo.png'
    : '/assets/icon/icon_radio.png';

  document.querySelectorAll('.brand-icon').forEach(image => {
    if (image.getAttribute('src') !== iconPath) image.setAttribute('src', iconPath);
  });
}

function installIconLinks() {
  // Sustituye el favicon SVG anterior por los PNG locales elegidos para cada tipo de dispositivo.
  document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach(link => link.remove());

  const desktopIcon = document.createElement('link');
  desktopIcon.rel = 'icon';
  desktopIcon.type = 'image/png';
  desktopIcon.sizes = '512x512';
  desktopIcon.media = '(pointer: fine)';
  desktopIcon.href = '/assets/icon/icon_radio.png';

  const mobileIcon = document.createElement('link');
  mobileIcon.rel = 'icon';
  mobileIcon.type = 'image/png';
  mobileIcon.sizes = '512x512';
  mobileIcon.media = '(pointer: coarse)';
  mobileIcon.href = '/assets/icon/icon_redondo.png';

  const fallbackIcon = document.createElement('link');
  fallbackIcon.rel = 'icon';
  fallbackIcon.type = 'image/png';
  fallbackIcon.sizes = '512x512';
  fallbackIcon.href = '/assets/icon/icon_radio.png';

  const appleIcon = document.createElement('link');
  appleIcon.rel = 'apple-touch-icon';
  appleIcon.href = '/assets/icon/icon_redondo.png';

  document.head.append(desktopIcon, mobileIcon, fallbackIcon, appleIcon);
}

function applyTheme(mode = getTheme()) {
  const safeMode = VALID_MODES.has(mode) ? mode : 'system';
  const effectiveTheme = getResolvedTheme(safeMode);

  document.documentElement.dataset.themeMode = safeMode;
  document.documentElement.dataset.theme = effectiveTheme;
  updateThemeColor(effectiveTheme);
  updateBrandImage();
  return effectiveTheme;
}

export function setTheme(mode) {
  if (!VALID_MODES.has(mode)) {
    throw new TypeError(`Modo de apariencia no válido: ${mode}`);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch (error) {
    console.warn('BIOISLAS no pudo guardar la preferencia de apariencia:', error);
  }

  applyTheme(mode);
  return mode;
}

function ensureThemeStylesheet() {
  if (document.querySelector('link[data-bioislas-theme]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/theme.css';
  link.dataset.bioislasTheme = 'true';
  document.head.appendChild(link);
}

// Se aplica antes de que se ejecute la lógica de cada pantalla.
applyTheme();
ensureThemeStylesheet();
installIconLinks();

colorSchemeQuery?.addEventListener?.('change', () => {
  if (getTheme() === 'system') applyTheme('system');
});
coarsePointerQuery?.addEventListener?.('change', updateBrandImage);
