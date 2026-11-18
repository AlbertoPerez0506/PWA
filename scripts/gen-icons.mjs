import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'pwa/icon.svg';
const targets = [
  ['pwa/pwa-icon-192.png', 192],
  ['pwa/pwa-icon-512.png', 512],
  ['pwa/pwa-maskable-192.png', 192],
  ['pwa/pwa-maskable-512.png', 512],
  ['assets/icon/apple-touch-icon.png', 180],
  ['assets/icon/favicon-32.png', 32],
  ['assets/icon/favicon-16.png', 16]
];

await mkdir('pwa', { recursive: true });
await mkdir('assets/icon', { recursive: true });
for (const [out, size] of targets) {
  await sharp(SRC).resize(size, size).png().toFile(out);
  console.log('✓', out);
}
