import { gql, GraphQLClient } from 'graphql-request';
import * as fs from 'fs/promises';
import * as path from 'path';

const HASHNODE_HOST = 'gelinjo.hashnode.dev';
const OUTPUT_DIR = './src/content/blog';

interface HashnodePost {
  title: string;
  subtitle: string;
  slug: string;
  publishedAt: string;
  content: { markdown: string };
  coverImage: { url: string } | null;
  tags: { name: string; slug: string }[];
  author: { name: string; profilePicture: string };
}

interface PostsResponse {
  publication: {
    posts: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      edges: { node: HashnodePost }[];
    };
  };
}

const EMBED_COMPONENTS = ['YouTube', 'Gist', 'Tweet', 'CodePen', 'Snappify', 'LinkPreview', 'UrlEmbed'] as const;

async function fetchAllPosts(): Promise<HashnodePost[]> {
  const client = new GraphQLClient('https://gql.hashnode.com');
  const posts: HashnodePost[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  while (hasNextPage) {
    const query = gql`
      query allPosts($after: String) {
        publication(host: "${HASHNODE_HOST}") {
          posts(first: 20, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                title
                subtitle
                slug
                publishedAt
                content {
                  markdown
                }
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
                author {
                  name
                  profilePicture
                }
              }
            }
          }
        }
      }
    `;

    const response: PostsResponse = await client.request<PostsResponse>(query, { after: endCursor });
    posts.push(...response.publication.posts.edges.map((e: { node: HashnodePost }) => e.node));
    hasNextPage = response.publication.posts.pageInfo.hasNextPage;
    endCursor = response.publication.posts.pageInfo.endCursor;
  }

  return posts;
}

function generateFrontmatter(post: HashnodePost): string {
  const isNote = post.tags.some((t) => t.slug === 'note');
  const publishDate = new Date(post.publishedAt).toISOString().split('T')[0];

  // Escape quotes in title and subtitle
  const escapeYaml = (str: string) => str.replace(/"/g, '\\"');

  const lines = ['---', `title: "${escapeYaml(post.title)}"`];

  if (post.subtitle) {
    lines.push(`subtitle: "${escapeYaml(post.subtitle)}"`);
  }

  lines.push(`publishedAt: ${publishDate}`);

  if (post.coverImage?.url) {
    lines.push(`coverImage: ${post.coverImage.url}`);
  }

  lines.push(`canonicalUrl: https://${HASHNODE_HOST}/${post.slug}`);

  if (post.tags.length > 0) {
    lines.push('tags:');
    post.tags.forEach((t) => {
      lines.push(`  - ${t.slug}`);
    });
  }

  lines.push('author:');
  lines.push(`  name: ${post.author.name}`);
  if (post.author.profilePicture) {
    lines.push(`  profilePicture: ${post.author.profilePicture}`);
  }

  lines.push(`type: ${isNote ? 'note' : 'article'}`);
  lines.push('draft: false');
  lines.push('---');

  return lines.join('\n');
}

function transformContent(markdown: string): string {
  let content = markdown;

  // Fix Hashnode image alignment syntax: ![alt](url align="...") -> ![alt](url)
  content = content.replace(/!\[([^\]]*)\]\(([^)\s]+)\s+align="[^"]*"\)/g, '![$1]($2)');

  // Transform Hashnode YouTube embeds: %[https://www.youtube.com/watch?v=VIDEO_ID]
  content = content.replace(
    /%\[https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^\]&]+)[^\]]*\]/g,
    '<YouTube id="$1" />'
  );

  // Transform short YouTube URLs: %[https://youtu.be/VIDEO_ID]
  content = content.replace(/%\[https?:\/\/youtu\.be\/([^\]?]+)[^\]]*\]/g, '<YouTube id="$1" />');

  // Transform GitHub Gist embeds: %[https://gist.github.com/USER/GIST_ID]
  content = content.replace(/%\[https?:\/\/gist\.github\.com\/([^\]]+)\]/g, '<Gist id="$1" />');

  // Transform Twitter/X embeds: %[https://twitter.com/USER/status/ID] or %[https://x.com/USER/status/ID]
  content = content.replace(
    /%\[https?:\/\/(?:twitter|x)\.com\/\w+\/status\/(\d+)[^\]]*\]/g,
    '<Tweet id="$1" />'
  );

  // Transform CodePen embeds: %[https://codepen.io/USER/pen/PEN_ID]
  content = content.replace(
    /%\[https?:\/\/codepen\.io\/([^\/]+)\/pen\/([^\]]+)\]/g,
    '<CodePen user="$1" slug="$2" />'
  );

  // Transform Snappify embeds: %[https://snappify.com/view/ID]
  content = content.replace(
    /%\[https?:\/\/snappify\.com\/(?:view|embed)\/([^\]]+)\]/g,
    '<Snappify id="$1" />'
  );

  // Transform remaining URL embeds to UrlEmbed component: %[https://...]
  // But convert internal Hashnode links to regular markdown links
  content = content.replace(/%\[(https?:\/\/[^\]]+)\]/g, (match, url) => {
    if (url.includes('gelinjo.hashnode.dev')) {
      const slug = url.replace(/https?:\/\/gelinjo\.hashnode\.dev\//, '').split('#')[0];
      const anchor = url.includes('#') ? '#' + url.split('#')[1] : '';
      const title = slug.replace(/-/g, ' ');
      return `[Read: ${title}](/blog/${slug}${anchor})`;
    }
    return `<UrlEmbed url="${url}" />`;
  });

  // Also convert inline markdown links to Hashnode to internal links
  content = content.replace(
    /\]\(https:\/\/gelinjo\.hashnode\.dev\/([^)]+)\)/g,
    (match, slugWithAnchor) => {
      const [slug, anchor] = slugWithAnchor.split('#');
      const internalUrl = anchor ? `/blog/${slug}#${anchor}` : `/blog/${slug}`;
      return `](${internalUrl})`;
    }
  );

  return content;
}

function detectUsedComponents(content: string): string[] {
  return EMBED_COMPONENTS.filter((comp) => new RegExp(`<${comp}[\\s/>]`).test(content));
}

function generateImports(components: string[]): string {
  if (components.length === 0) return '';

  return (
    components.map((comp) => `import ${comp} from "../../components/embeds/${comp}.astro";`).join('\n') + '\n'
  );
}

async function migrate() {
  console.log('Fetching posts from Hashnode...');
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} posts`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const post of posts) {
    const frontmatter = generateFrontmatter(post);
    const transformedContent = transformContent(post.content.markdown);
    const usedComponents = detectUsedComponents(transformedContent);
    const imports = generateImports(usedComponents);

    const fullContent = `${frontmatter}\n\n${imports}${transformedContent}`;

    const filename = `${post.slug}.mdx`;
    const filepath = path.join(OUTPUT_DIR, filename);

    await fs.writeFile(filepath, fullContent, 'utf-8');
    console.log(
      `  Migrated: ${filename}` + (usedComponents.length > 0 ? ` (embeds: ${usedComponents.join(', ')})` : '')
    );
  }

  console.log('\nMigration complete!');
  console.log(`\nNext steps:`);
  console.log(`1. Review the generated MDX files in ${OUTPUT_DIR}`);
  console.log(`2. Run 'pnpm build' to verify everything works`);
  console.log(`3. Once verified, you can remove the Hashnode loader files`);
}

migrate().catch(console.error);
