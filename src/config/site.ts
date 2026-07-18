/**
 * Single source of truth for workshop contact + business info.
 *
 * PRD T7: phone number is a single config value — it will change.
 * PRD F-G3 / F-G5: address, structured hours, contact links all live here.
 *
 * >>> CLIENT: fill in the real values below before launch. <<<
 */

export interface OpeningHour {
  /** 0 = Sunday ... 6 = Saturday (JS Date.getDay convention) */
  day: number;
  label: string;
  /** null/null = closed that day */
  open: string | null; // "HH:MM" 24h
  close: string | null; // "HH:MM" 24h
}

export const site = {
  name: 'Bengkel [NAMA]',
  legalName: 'Bengkel [NAMA] Motor',
  tagline: 'Servis, sparepart, & modifikasi motor terpercaya.',
  description:
    'Bengkel motor spesialis servis, sparepart, dan modifikasi di [KOTA]. Tanya stok & booking langsung lewat WhatsApp.',
  city: '[KOTA]',
  kecamatan: '[KECAMATAN]',

  // ---- Contact (PRD T7: single config value) ----
  // WhatsApp number in E.164 WITHOUT the leading "+" (wa.me format).
  whatsappE164: '628123456789',
  // Phone for tel: links. Local format is fine for display.
  phoneDisplay: '0812-3456-789',
  phoneTel: '+628123456789',
  instagram: 'https://instagram.com/bengkel_nama',
  instagramHandle: '@bengkel_nama',

  // ---- Location (PRD F-G3, F-H4, F-A4) ----
  address: {
    street: 'Jl. Contoh No. 123',
    kelurahan: '[KELURAHAN]',
    kecamatan: '[KECAMATAN]',
    city: '[KOTA]',
    province: '[PROVINSI]',
    postalCode: '00000',
    country: 'ID',
  },
  geo: {
    // Used for LocalBusiness JSON-LD (PRD SEO1). Replace with real coords.
    latitude: -6.2,
    longitude: 106.816666,
  },
  // Directions deep link (PRD F-H1 secondary CTA, F-H4, F-G3).
  // Replace query with the exact business name/coords once GBP is claimed.
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=-6.2,106.816666',
  // Embed URL for the lazy-loaded map facade (PRD T5, F-H4).
  mapsEmbedUrl:
    'https://www.google.com/maps?q=-6.2,106.816666&output=embed',

  // ---- Operating hours (PRD F-G5: open/closed computed client-side) ----
  hours: [
    { day: 1, label: 'Senin', open: '08:00', close: '17:00' },
    { day: 2, label: 'Selasa', open: '08:00', close: '17:00' },
    { day: 3, label: 'Rabu', open: '08:00', close: '17:00' },
    { day: 4, label: 'Kamis', open: '08:00', close: '17:00' },
    { day: 5, label: 'Jumat', open: '08:00', close: '17:00' },
    { day: 6, label: 'Sabtu', open: '08:00', close: '15:00' },
    { day: 0, label: 'Minggu', open: null, close: null },
  ] as OpeningHour[],

  // IANA timezone used for open/closed computation.
  timezone: 'Asia/Jakarta',
} as const;

export type Site = typeof site;
