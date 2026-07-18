# Workshop Portfolio & Parts Catalog

Project base for a motorcycle workshop's portfolio + spare-parts catalog site.
Built per the PRD "Workshop Portfolio & Parts Catalog Website" — **portfolio-led,
WhatsApp-first, no checkout**. Discovery + trust, not e-commerce.

## Stack

- **[Astro](https://astro.build) (SSG)** — content-heavy, near-zero JS, small output (PRD §7).
- **Content Collections** (Markdown) — model the future CMS shape; schema-validated at build.
- **`@astrojs/sitemap`** — sitemap + robots.
- Built-in **sharp** image pipeline — AVIF/WebP, responsive `srcset`, explicit dimensions (PRD T4).
- No UI framework, no web fonts. Catalog filtering is vanilla JS over pre-rendered cards (PRD T2).

## Getting started

```bash
npm install
node scripts/gen-placeholders.mjs   # generate sample images (first run only)
npm run dev                         # http://localhost:4321
npm run build                       # static output in dist/
npm run preview                     # serve the build locally
```

Set the public URL for canonical tags / sitemap at build time:

```bash
PUBLIC_SITE_URL="https://real-domain.com" npm run build
```

## Where to edit things

| What | Where |
|---|---|
| **Phone, WhatsApp, address, hours, map, IG** (single source of truth — PRD T7) | `src/config/site.ts` |
| Brand color / spacing tokens | `src/styles/global.css` (`:root` custom properties) |
| Services + price ranges | `src/content/services/*.md` |
| Catalog products | `src/content/products/*.md` |
| Portfolio projects | `src/content/projects/*.md` |
| Testimonials (real + attributable only — PRD SEO3) | `src/content/testimonials/*.md` |
| Content schemas (the CMS contract) | `src/content.config.ts` |

Anything in `src/config/site.ts` or the content files marked `[LIKE THIS]` is a
**placeholder the client must replace** before launch.

## Routes (PRD §5)

```
/                     Home
/layanan              Services & price ranges
/katalog              Catalog index (filter: category, model, search)
/katalog/[slug]       Product detail
/portofolio           Project index (filter: type)
/portofolio/[slug]    Project case study
/tentang              About + team + contact + map
```

## PRD conformance notes

- **WhatsApp everywhere.** All WA links go through `src/lib/whatsapp.ts` with
  context-specific prefilled text (F-G4). Sticky FAB on every route (F-G1).
- **Analytics.** Clicks on elements with `data-analytics` fire GA4 events
  (`wa_click` / `call_click` / `directions_click`) with `source_page` — see
  `src/lib/analytics.ts`. Paste the GA4 gtag snippet into `BaseLayout.astro`
  once the client provides a Measurement ID (keep it cookieless — PRD §10).
- **Open/closed status** is computed from `site.hours` client + server side
  (`src/lib/hours.ts`, F-G5).
- **Map** uses a lazy facade so a third-party iframe never blocks LCP (T5).
- **SEO.** `LocalBusiness`(AutoRepair) JSON-LD on Home + About (SEO1);
  `Product` JSON-LD on catalog detail **without `offers.price`** by design —
  add prices to the schema only once they are committed accurate (SEO2).
- **Catalog cap.** Client-side filtering assumes ≤150 SKUs (T3). Beyond that,
  move to pagination or a search service.

## Out of scope (PRD §9)

No cart, checkout, payments, live stock, user accounts, or booking system.
Availability is a manual enum (`Tersedia` / `Indent` / `Habis`), edited by hand.

## Not yet wired (client decisions / deliverables)

- Real content (photos, prices, projects) — see PRD §8 content dependencies.
- GA4 Measurement ID + Search Console verification.
- CMS layer (Sanity / Payload / Decap) on top of these collections — PRD §7.
- Google Business Profile — the highest-ROI deliverable (PRD SEO6 / Phase P0),
  handled outside this repo.
- Lighthouse CI budget in the deploy pipeline (T6).
