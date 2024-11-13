import { defineCollection } from 'astro:content'
import { hashnodePostsLoader } from '../loaders/hasnode/loaders';

const myHashnodeURL = 'gelinjo.hashnode.dev'

const posts = defineCollection({
  loader: hashnodePostsLoader({myHashnodeURL})
});

const talks

export const collections = { posts }
