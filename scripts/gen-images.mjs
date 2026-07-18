/**
 * Generates original, on-brand illustrated images for each content slot.
 *
 * These are placeholder ILLUSTRATIONS (not photos) — original vector art in the
 * workshop brand palette, so a freshly-deployed site looks intentional instead
 * of showing empty gray boxes. Replace with the client's real photography when
 * available (same file paths). No third-party assets, no licensing obligation.
 *
 * Run: `node scripts/gen-images.mjs`
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'generated');
await mkdir(outDir, { recursive: true });

const BRAND = '#c1121f';
const INK = '#1c1917';
const CHARCOAL = '#26211e';

// ---- Line-art icons (monoline, viewBox 0 0 100 100) ----
const icons = {
  brake: `
    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
    <g stroke="currentColor" stroke-width="2" fill="none">
      <circle cx="50" cy="27" r="2.4"/><circle cx="68" cy="41" r="2.4"/>
      <circle cx="61" cy="66" r="2.4"/><circle cx="39" cy="66" r="2.4"/>
      <circle cx="32" cy="41" r="2.4"/>
    </g>
    <rect x="60" y="40" width="18" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>`,
  oil: `
    <path d="M42 24h16v8l6 6v34a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6V38l6-6z" fill="none" stroke="currentColor" stroke-width="3"/>
    <rect x="44" y="20" width="12" height="6" rx="2" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M50 48c5 6 8 9 8 13a8 8 0 0 1-16 0c0-4 3-7 8-13z" fill="currentColor" opacity="0.85"/>`,
  shock: `
    <rect x="43" y="18" width="14" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>
    <rect x="45" y="30" width="10" height="20" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M40 52h20M40 58h20M40 64h20M40 70h20" stroke="currentColor" stroke-width="3" fill="none"/>
    <rect x="43" y="74" width="14" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="3"/>`,
  light: `
    <path d="M34 40a16 16 0 0 1 32 0v14a10 10 0 0 1-10 10H44a10 10 0 0 1-10-10z" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M42 46a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M72 34l8-4M74 46h9M72 58l8 4M28 34l-8-4M26 46h-9M28 58l-8 4" stroke="currentColor" stroke-width="3"/>`,
  exhaust: `
    <path d="M22 44h30l8 6h14a8 8 0 0 1 8 8v6a8 8 0 0 1-8 8H60l-8 6H22z" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M30 44v28M40 44v28" stroke="currentColor" stroke-width="2"/>
    <circle cx="74" cy="61" r="4" fill="none" stroke="currentColor" stroke-width="3"/>`,
  spark: `
    <rect x="44" y="16" width="12" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M42 26h16v10l-2 6h-12l-2-6z" fill="none" stroke="currentColor" stroke-width="3"/>
    <rect x="45" y="42" width="10" height="18" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M50 60v14M50 74h8" fill="none" stroke="currentColor" stroke-width="3"/>`,
  bike: `
    <circle cx="28" cy="62" r="13" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="74" cy="62" r="13" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M28 62l12-20h20l8 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M40 42l6 20h28" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M58 42h12l4-6" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M36 40h12" stroke="currentColor" stroke-width="3"/>`,
  wrench: `
    <path d="M64 30a12 12 0 0 0-15 15L30 64a6 6 0 0 0 8 8l19-19a12 12 0 0 0 15-15l-8 8-7-2-2-7z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
};

function plate({ w, h, icon, bg1, bg2, iconColor, label, sublabel, labelColor }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <g opacity="0.07" fill="none" stroke="#ffffff" stroke-width="2">
      ${Array.from({ length: 6 }, (_, i) => `<line x1="${-h + i * (w / 3)}" y1="${h}" x2="${i * (w / 3)}" y2="0"/>`).join('')}
    </g>
    <g transform="translate(${w / 2 - h * 0.22}, ${h * 0.5 - h * 0.34}) scale(${(h * 0.44) / 100})" color="${iconColor}">
      ${icon}
    </g>
    ${label ? `<text x="50%" y="${h - 46}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${Math.round(w / 22)}" font-weight="800" fill="${labelColor}">${label}</text>` : ''}
    ${sublabel ? `<text x="50%" y="${h - 22}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${Math.round(w / 34)}" font-weight="500" fill="${labelColor}" opacity="0.7">${sublabel}</text>` : ''}
  </svg>`;
}

async function write(name, svg, { w = 800, h = 600 } = {}) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(join(outDir, name));
  console.log('wrote', name);
}

// ---- Product images (unique per SKU) ----
const products = [
  { file: 'kampas-rem-depan', icon: icons.brake, label: 'Kampas Rem', sub: 'Aspira' },
  { file: 'oli-mesin-10w40', icon: icons.oil, label: 'Oli Mesin 10W-40', sub: 'Federal' },
  { file: 'shockbreaker-belakang', icon: icons.shock, label: 'Shockbreaker', sub: 'KYB' },
  { file: 'lampu-led-h4', icon: icons.light, label: 'Lampu LED H4', sub: 'Osram' },
  { file: 'knalpot-racing', icon: icons.exhaust, label: 'Knalpot Racing', sub: 'R9' },
  { file: 'busi-iridium', icon: icons.spark, label: 'Busi Iridium', sub: 'NGK' },
];
for (const p of products) {
  await write(
    `product-${p.file}.jpg`,
    plate({
      w: 800, h: 600, icon: p.icon,
      bg1: '#f5f5f4', bg2: '#e2ddd8', iconColor: BRAND,
      label: p.label, sublabel: p.sub, labelColor: INK,
    }),
  );
}

// ---- Project covers (motorcycle silhouette, dark & moody) ----
const projects = [
  { file: 'restorasi-cb100', label: 'Honda CB100', sub: 'Restorasi · 1972', bg: ['#3a2f2a', '#c1121f'] },
  { file: 'modif-nmax-touring', label: 'Yamaha NMAX', sub: 'Modif Touring', bg: ['#1f2937', '#0f766e'] },
  { file: 'servis-besar-vario', label: 'Honda Vario 125', sub: 'Servis Besar', bg: ['#26211e', '#57534e'] },
  { file: 'custom-build-scrambler', label: 'Honda Tiger', sub: 'Custom Build', bg: ['#1c1917', '#b45309'] },
];
for (const p of projects) {
  await write(
    `project-${p.file}.jpg`,
    plate({
      w: 1000, h: 667, icon: icons.bike,
      bg1: p.bg[0], bg2: p.bg[1], iconColor: '#ffffff',
      label: p.label, sublabel: p.sub, labelColor: '#ffffff',
    }),
    { w: 1000, h: 667 },
  );
}

// ---- Before / After (shared, reusable) ----
await write('before.jpg', plate({
  w: 600, h: 600, icon: icons.wrench, bg1: '#57534e', bg2: '#78716c',
  iconColor: '#ffffff', label: 'SEBELUM', sublabel: 'Kondisi awal', labelColor: '#ffffff',
}), { w: 600, h: 600 });
await write('after.jpg', plate({
  w: 600, h: 600, icon: icons.wrench, bg1: '#7f0d16', bg2: BRAND,
  iconColor: '#ffffff', label: 'SESUDAH', sublabel: 'Setelah dikerjakan', labelColor: '#ffffff',
}), { w: 600, h: 600 });

// ---- Generic gallery fillers ----
await write('detail-1.jpg', plate({
  w: 800, h: 600, icon: icons.wrench, bg1: '#26211e', bg2: '#3a2f2a',
  iconColor: '#ffffff', label: 'Proses Pengerjaan', sublabel: '', labelColor: '#ffffff',
}));
await write('detail-2.jpg', plate({
  w: 800, h: 600, icon: icons.bike, bg1: '#0f766e', bg2: '#134e4a',
  iconColor: '#ffffff', label: 'Hasil Akhir', sublabel: '', labelColor: '#ffffff',
}));

console.log('done');
