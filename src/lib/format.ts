/** Rupiah formatting helpers. Prices are stored as numbers, formatted here. */

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function rupiah(value: number): string {
  return idr.format(value);
}

/** "Mulai dari Rp X" or "Tanya harga" when no price is committed (PRD F-C4, OQ5). */
export function priceFrom(value: number | null): string {
  return value == null ? 'Tanya harga' : `Mulai dari ${rupiah(value)}`;
}

/** Service price range: "Rp X–Y", "Mulai dari Rp X", or "Tanya harga" (PRD F-S1). */
export function priceRange(from: number | null, to: number | null): string {
  if (from != null && to != null) return `${rupiah(from)}–${rupiah(to)}`;
  if (from != null) return `Mulai dari ${rupiah(from)}`;
  return 'Tanya harga';
}
