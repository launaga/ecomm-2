/**
 * Generates lightweight placeholder JPGs so the sample content builds before
 * the client provides real photos. Run: `node scripts/gen-placeholders.mjs`.
 * Safe to delete once real images replace the placeholders.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'assets',
  'placeholders',
);
await mkdir(outDir, { recursive: true });

const items = [
  { file: 'product.jpg', label: 'FOTO PRODUK', bg: '#e7e5e4', w: 800, h: 600 },
  { file: 'product-2.jpg', label: 'FOTO PRODUK 2', bg: '#d6d3d1', w: 800, h: 600 },
  { file: 'project-cover.jpg', label: 'FOTO PROJECT', bg: '#1c1917', fg: '#fff', w: 1000, h: 667 },
  { file: 'before.jpg', label: 'BEFORE', bg: '#78716c', fg: '#fff', w: 600, h: 600 },
  { file: 'after.jpg', label: 'AFTER', bg: '#c1121f', fg: '#fff', w: 600, h: 600 },
];

for (const { file, label, bg, fg = '#57534e', w, h } of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${bg}"/>
    <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="${Math.round(w / 14)}"
      font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 70 }).toFile(join(outDir, file));
  console.log('wrote', file);
}
