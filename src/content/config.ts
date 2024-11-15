import { defineCollection } from 'astro:content';
import { hashnodePostsLoader } from '../loaders/hasnode/loaders';
import { notionLoader } from 'notion-astro-loader';
import { TalksPageSchema, CFPsPageSchema, ConferencesPageSchema } from '../loaders/talks/schemas';

const posts = defineCollection({
  loader: hashnodePostsLoader({ myHashnodeURL: 'gelinjo.hashnode.dev' }),
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
