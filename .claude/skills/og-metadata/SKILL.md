---
name: og-metadata
description: This skill should be used when the user asks to "fetch OG metadata", "create rich embeds", "get link previews", "fetch URL metadata", or needs to display rich link cards with titles and descriptions from external URLs. Provides build-time Open Graph metadata fetching with caching for Astro projects.
---

# OG Metadata Fetching

Fetch Open Graph metadata from URLs at build time for rich link embeds, with intelligent caching to speed up builds and avoid rate limits.

## Overview

This utility fetches and caches Open Graph metadata (title, description, image, site name) from URLs. It's designed for static site generators like Astro where fetching happens at build time.

## Files

| File | Purpose |
|------|---------|
| `src/utils/og-metadata.ts` | Core fetching and caching utility |
| `.cache/og-metadata.json` | Cached metadata (auto-generated, gitignored) |
| `src/components/embeds/UrlEmbed.astro` | Rich embed component |

## Usage

### In Astro Components

```astro
---
import { getOgMetadata } from '../utils/og-metadata';

const url = 'https://example.com/article';
const metadata = await getOgMetadata(url);
---

<div>
  <h3>{metadata.title}</h3>
  <p>{metadata.description}</p>
  {metadata.image && <img src={metadata.image} alt="" />}
</div>
```

### API

```typescript
interface OgMetadata {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  fetchedAt: string;
}

// Fetch metadata for a single URL (uses cache)
async function getOgMetadata(url: string): Promise<OgMetadata>

// Force refresh metadata for a URL
async function refreshOgMetadata(url: string): Promise<OgMetadata>

// Clear all cached metadata
function clearOgCache(): void
```

## Caching Strategy

1. **Cache Location**: `.cache/og-metadata.json` (gitignored)
2. **Cache Duration**: 7 days by default
3. **Cache Key**: URL (normalized)
4. **On Cache Miss**: Fetches from URL, parses HTML, extracts OG tags
5. **On Cache Hit**: Returns cached data immediately

### Cache File Structure

```json
{
  "https://example.com/article": {
    "url": "https://example.com/article",
    "title": "Article Title",
    "description": "Article description from og:description",
    "image": "https://example.com/og-image.jpg",
    "siteName": "Example Site",
    "favicon": "https://example.com/favicon.ico",
    "fetchedAt": "2025-01-14T10:00:00.000Z"
  }
}
```

## Metadata Extraction Priority

The utility extracts metadata in this priority order:

### Title
1. `og:title`
2. `twitter:title`
3. `<title>` tag

### Description
1. `og:description`
2. `twitter:description`
3. `meta[name="description"]`

### Image
1. `og:image`
2. `twitter:image`

### Site Name
1. `og:site_name`
2. Domain name (fallback)

### Favicon
1. `link[rel="icon"]`
2. `link[rel="shortcut icon"]`
3. `/favicon.ico` (fallback)

## Error Handling

- **Network errors**: Returns fallback metadata with URL-derived title
- **Parse errors**: Returns fallback metadata
- **Missing OG tags**: Falls back to standard meta tags, then to sensible defaults
- **Rate limiting**: Cache prevents repeated requests to same URL

## Manual Cache Management

### Clear cache for fresh data

```bash
# Delete the cache file
rm .cache/og-metadata.json
```

### Refresh specific URL

```typescript
import { refreshOgMetadata } from '../utils/og-metadata';
await refreshOgMetadata('https://example.com/updated-article');
```

## Integration with UrlEmbed

The `UrlEmbed.astro` component uses this utility automatically:

```astro
<UrlEmbed url="https://nx.dev/blog/nx-mcp" />
```

Renders as a Medium-style card with:
- Site favicon and name
- Article title
- Description (truncated)
- Optional thumbnail image

## Troubleshooting

**Metadata not updating:**
Delete `.cache/og-metadata.json` and rebuild.

**Missing images:**
Some sites block server-side image requests. The component gracefully hides missing images.

**Slow builds:**
The cache prevents re-fetching. First build after cache clear will be slower.

**CORS errors:**
Not applicable - fetching happens at build time on the server, not in the browser.
