import { site } from '@/config/site';

/**
 * Build a wa.me link with context-specific prefilled text (PRD F-G4).
 * All WhatsApp CTAs on the site must go through this helper so the number
 * stays a single config value (PRD T7).
 */
export function waLink(text: string): string {
  const base = `https://wa.me/${site.whatsappE164}`;
  const trimmed = text?.trim();
  return trimmed ? `${base}?text=${encodeURIComponent(trimmed)}` : base;
}

/** Prefilled messages, centralized so copy stays consistent. */
export const waMessages = {
  general: () =>
    `Halo ${site.name}, saya mau tanya-tanya soal servis/sparepart.`,

  // Catalog detail (PRD F-C5)
  product: (opts: { name: string; brand?: string; sku?: string }) => {
    const brand = opts.brand ? ` (${opts.brand})` : '';
    const sku = opts.sku ? ` — kode ${opts.sku}` : '';
    return `Halo, mau tanya stok: ${opts.name}${brand}${sku}`;
  },

  // Service CTA (PRD F-S2)
  service: (name: string) =>
    `Halo ${site.name}, saya mau tanya soal layanan: ${name}`,

  // Project detail CTA (PRD F-P5)
  project: (title: string) =>
    `Halo, saya lihat project ${title}, mau tanya untuk motor saya`,

  // Empty catalog filter state (PRD F-C7)
  notFound: () =>
    `Halo, saya cari sparepart tapi belum ketemu di katalog. Bisa dibantu?`,
} as const;
