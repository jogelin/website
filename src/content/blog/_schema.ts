import { z } from 'astro/zod';

export const blogSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  coverImage: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  author: z
    .object({
      name: z.string(),
      profilePicture: z.string().optional(),
    })
    .default({
      name: 'Jonathan Gelin',
      profilePicture: '/avatar.png',
    }),
  draft: z.boolean().default(false),
  type: z.enum(['article', 'note']).default('article'),
});

export type BlogPost = z.infer<typeof blogSchema>;

export function isInstanceOfBlogPost(data: unknown): data is BlogPost {
  return (
    typeof data === 'object' &&
    data !== null &&
    'publishedAt' in data &&
    data.publishedAt instanceof Date
  );
}

export function isInstanceOfArticle(post: BlogPost): boolean {
  return post.type === 'article';
}

export function isInstanceOfNote(post: BlogPost): boolean {
  return post.type === 'note';
}
