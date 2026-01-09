import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { notionLoader } from 'notion-astro-loader';
import { TalksPageSchema, CFPsPageSchema, ConferencesPageSchema } from '../loaders/talks/schemas';
import { blogSchema } from './blog/_schema';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: blogSchema,
});

const talks = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DATABASE_ID_TALKS,
  }),
  schema: TalksPageSchema,
});

const cfps = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DATABASE_ID_CFPS,
  }),
  schema: CFPsPageSchema,
});

const conferences = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DATABASE_ID_CONFERENCE,
  }),
  schema: ConferencesPageSchema,
});

export const collections = { posts, talks, cfps, conferences };
