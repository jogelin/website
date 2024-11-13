import { PostSchema } from './schemas';
import type { Loader } from 'astro/loaders';
import { getPosts } from './queries';

export interface HashnodePostsLoaderOptions {
  myHashnodeURL: string;
}

export function hashnodePostsLoader({ myHashnodeURL }: HashnodePostsLoaderOptions): Loader {
  return {
    name: 'hasnode-posts-loader',
    load: async ({ logger, store }) => {
      logger.info(`Loading posts from ${myHashnodeURL}`);

      const result = await getPosts(myHashnodeURL);
      for (const post of result.publication.posts.edges) {
        const data = post.node;
        store.set({ id: data.slug, data });
      }

      logger.info(`Loaded ${result.publication.posts.edges.length} posts from ${myHashnodeURL}`);
    },
    schema: () => PostSchema,
  };
}