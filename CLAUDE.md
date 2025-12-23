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
- `src/components/` - Astro components (Hero, ValueSlider, ServicePillars, AISection, etc.)
- `src/layouts/Layout.astro` - Main HTML layout with Calendly widget
- `src/pages/` - File-based routing (index.astro, cv.astro)
- `src/loaders/` - Custom content loaders for Hashnode and Notion
- `src/content/config.ts` - Content collections configuration
- `context/` - Profile context markdown files for AI-assisted content generation

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

### Tailwind
- Dark mode via selector strategy (`dark:` prefix)
- Custom utilities: `.text-primary`, `.text-secondary`, `.link-primary`, `.curved-underline`
- Green primary color (light: green-700, dark: green-500)

### TypeScript
- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Zod schemas for all external API data validation
