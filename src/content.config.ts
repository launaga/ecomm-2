import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections model the CMS shape (PRD §6). The client edits these
 * (via a CMS later, or Markdown now). Schemas are the contract — a missing
 * required field fails the build instead of shipping a broken card.
 */

// PRD F-C1 categories
const CATEGORIES = [
  'Mesin',
  'Kaki-kaki',
  'Body',
  'Kelistrikan',
  'Aksesoris',
  'Oli & Cairan',
] as const;

// PRD F-C6 availability enum (manual, not synced to any system)
const AVAILABILITY = ['Tersedia', 'Indent', 'Habis'] as const;

// PRD F-P2 project types
const PROJECT_TYPES = [
  'Servis Besar',
  'Restorasi',
  'Modif',
  'Custom Build',
  'Perbaikan',
] as const;

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      brand: z.string(),
      sku: z.string(),
      category: z.enum(CATEGORIES),
      // "Mulai dari Rp X" — store the number, format in the UI (PRD F-C4).
      priceFrom: z.number().nullable().default(null),
      availability: z.enum(AVAILABILITY).default('Tersedia'),
      // PRD F-C2: multi-select compatibility. Free-text model names.
      compatibleModels: z.array(z.string()).default([]),
      // 2–4 images (PRD F-C5). First is the card image.
      images: z.array(image()).min(1),
      specs: z.record(z.string(), z.string()).default({}),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      bikeModel: z.string(),
      bikeYear: z.number().optional(),
      projectType: z.enum(PROJECT_TYPES),
      year: z.number(),
      cover: image(),
      brief: z.string(), // client brief / complaint (PRD F-P3)
      workPerformed: z.array(z.string()).default([]),
      // Parts used, optionally linked to catalog items (PRD F-P3).
      partsUsed: z
        .array(
          z.object({
            label: z.string(),
            product: reference('products').optional(),
          }),
        )
        .default([]),
      // Before/after pairs (PRD F-P4).
      beforeAfter: z
        .array(z.object({ before: image(), after: image(), caption: z.string().optional() }))
        .default([]),
      gallery: z.array(image()).default([]),
      durationLabel: z.string().optional(), // e.g. "3 minggu"
      testimonial: z
        .object({ quote: z.string(), author: z.string() })
        .optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    icon: z.string().optional(), // emoji or short label
    summary: z.string(),
    includes: z.array(z.string()).default([]),
    durationLabel: z.string().optional(),
    // Price RANGE, never empty (PRD F-S1). Both set => "Rp X–Y".
    priceFrom: z.number().nullable().default(null),
    priceTo: z.number().nullable().default(null),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  // PRD F-H5 / SEO3: real + attributable only. text + name + bike model.
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    bikeModel: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { products, projects, services, testimonials };
export { CATEGORIES, AVAILABILITY, PROJECT_TYPES };
