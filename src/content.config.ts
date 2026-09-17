import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // Order in the case-study sequence (matches the original site's
    // Home → Projects grid / prev-next order).
    order: z.number(),
    role: z.array(z.string()),
    timeline: z.string(),
    team: z.string(),
    tools: z.array(z.string()),
    skills: z.array(z.string()),
    // Image shown on the Home page project grid.
    tileImage: z.string(),
    tileAlt: z.string(),
    // One-line project description shown on the Home page tile.
    summary: z.string(),
    // Slug + title of a page to link to as "next" when this project isn't
    // the last one and the next one isn't a content-collection entry
    // (used once, for Dominos -> Consulting Work).
    nextOverrideHref: z.string().optional(),
    nextOverrideTitle: z.string().optional(),
  }),
});

export const collections = { projects };
