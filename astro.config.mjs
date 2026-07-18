// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public site URL. Override at build time via env for previews/production.
// This drives canonical tags, sitemap, and absolute URLs in JSON-LD.
const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  // Static output (SSG). See PRD §7 Stack.
  output: 'static',
  image: {
    // Astro's built-in sharp pipeline handles raw phone photos (PRD T4).
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
