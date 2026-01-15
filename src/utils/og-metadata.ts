import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface OgMetadata {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  fetchedAt: string;
}

type OgCache = Record<string, OgMetadata>;

// Cache file path - use process.cwd() to get the project root
// This works during both dev and build because Astro runs from project root
const CACHE_PATH = join(process.cwd(), '.cache', 'og-metadata.json');

// Cache duration in milliseconds (7 days)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

function loadCache(): OgCache {
  try {
    if (existsSync(CACHE_PATH)) {
      const data = readFileSync(CACHE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load OG cache:', error);
  }
  return {};
}

function saveCache(cache: OgCache): void {
  try {
    // Ensure the cache directory exists
    const cacheDir = dirname(CACHE_PATH);
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Failed to save OG cache:', error);
  }
}

function isCacheValid(metadata: OgMetadata): boolean {
  const fetchedAt = new Date(metadata.fetchedAt).getTime();
  return Date.now() - fetchedAt < CACHE_DURATION;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slash for consistency
    return parsed.href.replace(/\/$/, '');
  } catch {
    return url;
  }
}

function extractMetaContent(html: string, selectors: string[]): string | undefined {
  for (const selector of selectors) {
    // Match og:, twitter:, or name= meta tags
    const patterns = [
      new RegExp(`<meta[^>]*property=["']${selector}["'][^>]*content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${selector}["']`, 'i'),
      new RegExp(`<meta[^>]*name=["']${selector}["'][^>]*content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${selector}["']`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return decodeHtmlEntities(match[1]);
      }
    }
  }
  return undefined;
}

function extractTitle(html: string): string | undefined {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch?.[1] ? decodeHtmlEntities(titleMatch[1].trim()) : undefined;
}

function extractFavicon(html: string, baseUrl: string): string | undefined {
  // Look for various favicon link tags
  const patterns = [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i,
    /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']*)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return resolveUrl(match[1], baseUrl);
    }
  }

  // Fallback to /favicon.ico
  try {
    const url = new URL(baseUrl);
    return `${url.origin}/favicon.ico`;
  } catch {
    return undefined;
  }
}

function resolveUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
}

function getDomainName(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function createFallbackMetadata(url: string): OgMetadata {
  const domain = getDomainName(url);
  return {
    url,
    title: domain,
    description: '',
    siteName: domain,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchMetadata(url: string): Promise<OgMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGFetcher/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return createFallbackMetadata(url);
    }

    const html = await response.text();

    const title =
      extractMetaContent(html, ['og:title', 'twitter:title']) ||
      extractTitle(html) ||
      getDomainName(url);

    const description =
      extractMetaContent(html, ['og:description', 'twitter:description', 'description']) || '';

    const image = extractMetaContent(html, ['og:image', 'twitter:image']);
    const resolvedImage = image ? resolveUrl(image, url) : undefined;

    const siteName = extractMetaContent(html, ['og:site_name']) || getDomainName(url);

    const favicon = extractFavicon(html, url);

    return {
      url,
      title: title.trim(),
      description: description.trim(),
      image: resolvedImage,
      siteName,
      favicon,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn(`Error fetching metadata for ${url}:`, error);
    return createFallbackMetadata(url);
  }
}

export async function getOgMetadata(url: string): Promise<OgMetadata> {
  const normalizedUrl = normalizeUrl(url);
  const cache = loadCache();

  // Check if we have valid cached data
  const cached = cache[normalizedUrl];
  if (cached && isCacheValid(cached)) {
    return cached;
  }

  // Fetch fresh metadata
  const metadata = await fetchMetadata(normalizedUrl);

  // Update cache
  cache[normalizedUrl] = metadata;
  saveCache(cache);

  return metadata;
}

export async function refreshOgMetadata(url: string): Promise<OgMetadata> {
  const normalizedUrl = normalizeUrl(url);
  const cache = loadCache();

  // Force fetch fresh metadata
  const metadata = await fetchMetadata(normalizedUrl);

  // Update cache
  cache[normalizedUrl] = metadata;
  saveCache(cache);

  return metadata;
}

export function clearOgCache(): void {
  saveCache({});
}
