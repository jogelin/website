# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Jonathan Gelin built with Astro 5, TypeScript, and Tailwind CSS. Static site that pulls content from Hashnode (blog posts) and Notion (talks/conferences) at build time.

## Commands

```bash
pnpm start      # Development server (astro dev --force)
pnpm build      # Type check + production build (astro check && astro build)
pnpm preview    # Preview production build locally
```

## Architecture

### Content Loading

- **Blog posts**: Fetched via GraphQL from Hashnode API (`src/loaders/hasnode/`)
- **Talks/Conferences/CFPs**: Loaded from Notion databases (`src/loaders/talks/`)
- **CV data**: Static JSON file (`src/content/cv/cv.json`)
- All external data validated with Zod schemas

### Key Directories

- `src/components/` - Astro components (see Component Architecture below)
- `src/layouts/Layout.astro` - Main HTML layout with Calendly widget and fonts
- `src/pages/` - File-based routing (index.astro, cv.astro)
- `src/loaders/` - Custom content loaders for Hashnode and Notion
- `src/content/config.ts` - Content collections configuration
- `context/` - Profile context markdown files for AI-assisted content generation

### Component Architecture

Shared layout components used across pages:

- `Navbar.astro` - Navigation bar with `activeLink` prop ('home' | 'blog' | 'resume')
- `AvailabilityBar.astro` - Sticky availability banner with Calendly integration
- `SocialSidebar.astro` - Fixed social media icons (GitHub, X, Bluesky, LinkedIn)
- `Footer.astro` - Simple footer with copyright

Page-specific components:

- `Hero.astro` - Homepage hero with 3-layer diagram (DX → AI → Foundations), testimonials
- `DiagramSections.astro` - Detailed breakdown of the hero diagram layers
- `Card.astro` - Blog/talk card with type badges (ARTICLE, NOTE, TALK)
- `content/Contents.astro` - Content listing with masonry layout
- `content/PostCard.astro`, `content/TalkCard.astro` - Specialized content cards

### Profile Context System

The `context/` directory contains markdown files with profile information for AI context:

- `profile.md` - Core identity, background, experience, philosophy
- `positioning.md` - Value proposition, differentiators, target audience
- `services.md` - 4 service pillars with descriptions
- `ai-approach.md` - AI-augmented engineering philosophy (Claude Code + Nx)
- `messaging.md` - Headlines, elevator pitches, key phrases

Use these files when generating LinkedIn posts, proposals, website content updates, or any profile-related content.

### External Integrations

- **Calendly** - Booking widget in Layout.astro
- **Hashnode GraphQL** - `https://gql.hashnode.com` for blog posts
- **Notion API** - via `notion-astro-loader` for talks/conferences
- **Snappify** - Embedded presentation video

## Environment Variables

Required at build time:

- `NOTION_TOKEN` - Notion API authentication
- `NOTION_DATABASE_ID_TALKS`, `NOTION_DATABASE_ID_CFPS`, `NOTION_DATABASE_ID_CONFERENCE`
- `LINKEDIN_TOKEN`

## Coding Patterns

### Astro Components

- Props defined as TypeScript interfaces in frontmatter
- Scoped styles within `<style>` tags
- Use `getCollection()` API to access content collections

### Design System

Color palette:

- Dark background: `#0f1117` (primary), `#1e293b` (cards)
- Green accent: `#10b981` (emerald-500) - primary accent, CTAs, highlights
- Yellow: `#fbbf24` (amber-400) - DX layer, availability bar
- Purple: `#a855f7` - AI Orchestration layer
- Cyan: `#06b6d4` - Engineering Foundations layer
- Text: `#e2e8f0` (light), `rgba(226, 232, 240, 0.7)` (muted)

Typography:

- `JetBrains Mono` - Labels, tags, code, monospace elements
- `Inter` - Body text, headings

### Tailwind

- Dark mode via selector strategy (`dark:` prefix)
- Custom utilities: `.text-primary`, `.text-secondary`, `.link-primary`, `.curved-underline`
- Most styling uses scoped CSS in components rather than Tailwind classes

### TypeScript

- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Zod schemas for all external API data validation

## Social Media Banners

Banner SVG files are stored in `public/` and exported as high-resolution PNGs for uploading.

### Files

| Platform | SVG | PNG | Dimensions |
|----------|-----|-----|------------|
| LinkedIn | `linkedin-banner.svg` | `linkedin-banner.png` | 1584×396 (exported at 2x: 3168×792) |
| Twitter/X | `twitter-banner.svg` | `twitter-banner.png` | 1500×500 (exported at 2x: 3000×1000) |
| Bluesky | `bluesky-banner.svg` | `bluesky-banner.png` | 3000×1000 (exported at 2x: 6000×2000) |

### Regenerating PNGs

After editing SVG files, regenerate PNGs using `rsvg-convert` (from librsvg):

```bash
# LinkedIn (2x resolution)
rsvg-convert -w 3168 -h 792 public/linkedin-banner.svg -o public/linkedin-banner.png

# Twitter/X (2x resolution)
rsvg-convert -w 3000 -h 1000 public/twitter-banner.svg -o public/twitter-banner.png

# Bluesky (2x resolution)
rsvg-convert -w 6000 -h 2000 public/bluesky-banner.svg -o public/bluesky-banner.png
```

### Design Notes

- Banners match website design: dark gradient background, 3-layer diagram (DX/AI/Foundations)
- Brand: `</>  smartSDLC.dev` with green `</>` and white underlined domain
- Tagline: "Build on **Foundations**, Scale with **AI**."
- Export at 2x resolution for sharp display on social platforms
