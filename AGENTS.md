# AGENTS.md

This file provides guidance to agentic coding agents (such as yourself) that operate in this repository.

## Build Commands

```bash
# Development
pnpm start          # Start dev server with --force flag
pnpm dev            # Alias for start

# Production
pnpm build          # Type check + build (astro check && astro build)
pnpm preview        # Preview production build locally

# Type Checking
pnpm astro check    # Run TypeScript type checking
pnpm check          # Alias for astro check

# Linting/Formatting
pnpm prettier --write .    # Format all files
prettier --write src/      # Format source files only
```

## Project Architecture

- **Framework**: Astro 5 with TypeScript
- **Styling**: Tailwind CSS + scoped CSS in components
- **Content**: Hashnode (blog) + Notion (talks/conferences) + static JSON (CV)
- **Package Manager**: pnpm (required - see packageManager in package.json)

### Key Directories

- `src/components/` - Reusable Astro components
- `src/layouts/` - Page layouts (Layout.astro, BlogPostLayout.astro)
- `src/pages/` - File-based routing
- `src/loaders/` - Custom content loaders for external APIs
- `src/content/` - Content collections and schemas
- `context/` - Profile context for AI content generation

## Code Style Guidelines

### TypeScript/JavaScript

- **Strict mode**: Enabled (extends astro/tsconfigs/strict)
- **Imports**: Use ES6 imports, prefer default exports for components
- **Types**: Define interfaces for component props, use Zod for external data validation
- **Naming**: PascalCase for components, camelCase for variables/functions

```typescript
// Component props interface
interface Props {
  title: string;
  activeLink?: 'home' | 'blog' | 'resume';
}

// Zod schema for external data
export const PostSchema = z.object({
  title: z.string(),
  publishedAt: z.string(),
});
```

### Astro Components

- **Frontmatter**: TypeScript interfaces first, then props destructuring
- **Scoped styles**: Use `<style>` tags within components
- **Global styles**: Use `:global()` modifier for dark mode styles
- **Class names**: BEM-style with component prefix

```astro
---
interface Props {
  title: string;
  isActive?: boolean;
}

const { title, isActive = false } = Astro.props;
---

<div class:list={['card', { active: isActive }]}>
  <h2 class="card__title">{title}</h2>
</div>

<style>
  .card {
    background: white;
  }
  :global(.dark) .card {
    background: #1e293b;
  }
</style>
```

### CSS/Styling

- **Approach**: Scoped CSS in components, minimal Tailwind classes
- **Dark mode**: Use `:global(.dark)` selector strategy
- **Colors**: Follow design system (see CLAUDE.md for palette)
- **Typography**: JetBrains Mono for tags/code, Inter for body text

```css
/* Component styles */
.hero-title {
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}

/* Dark mode */
:global(.dark) .hero-title {
  color: #e2e8f0;
}

/* Custom utilities (defined in tailwind.config.mjs) */
.text-primary    /* Green accent color */
.link-primary     /* Primary link styling */
.curved-underline /* Decorative underline */
```

### Import Patterns

```typescript
// Astro imports
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Component imports (relative)
import Navbar from '../components/Navbar.astro';
import { PostSchema } from './schemas';

// External libraries
import { z } from 'astro:content';
```

### Error Handling

- **External APIs**: Always validate with Zod schemas
- **Type guards**: Use for runtime type checking
- **Optional props**: Provide sensible defaults

```typescript
// Type guard example
export function isInstanceOfPost(post: any): post is Post {
  return (post as Post).publishedAt !== undefined;
}

// Safe prop access
const { title = 'Default Title' } = Astro.props;
```

### File Organization

- **Components**: Group by feature (embeds/, content/, etc.)
- **Types**: Co-locate with components or in dedicated schemas/
- **Styles**: Keep scoped CSS in the same file
- **Utilities**: Use Tailwind config for custom utilities

### Content Collections

- **Schema validation**: Always use Zod schemas
- **Type exports**: Export inferred types for use in components
- **Loaders**: Use appropriate loader (glob, notion, custom)

```typescript
// Content collection with schema
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: blogSchema,
});

// Export types
export type Post = z.infer<typeof PostSchema>;
```

## Testing

No test framework is currently configured. When adding tests:

- Check for existing test setup in package.json
- Follow Astro testing recommendations
- Use appropriate test runner (vitest, jest, etc.)

## Environment Variables

Required at build time (check .env.example or CLAUDE.md):

- `NOTION_TOKEN` - Notion API authentication
- `NOTION_DATABASE_ID_*` - Notion database IDs
- `LINKEDIN_TOKEN` - LinkedIn API token

## Git Workflow

- **Branch strategy**: Main branch for production
- **Commits**: Conventional commits preferred
- **Pre-commit**: No hooks configured (consider adding for linting)

## Performance Considerations

- **Images**: Optimize for web, use appropriate formats
- **Fonts**: Preload Google Fonts (Inter, JetBrains Mono)
- **Build**: Static site generation, optimize bundle size
- **External data**: Fetched at build time, cached appropriately

## Common Patterns

### Component Props

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  links: { name: string; href: string }[];
}

const { title, subtitle, links } = Astro.props;
---
```

### Conditional Rendering

```astro
{
  picture && (
    <div class="card-image">
      <img src={picture} alt={title} />
    </div>
  )
}
```

### List Rendering

```astro
{links.map(({ name, href }) => <a href={href}>{name}</a>)}
```

### Class Lists

```astro
<div class:list={['card', { active: isActive, featured: isFeatured }]}></div>
```

## Tools and Integrations

- **Calendly**: Booking widget (loaded in Layout.astro)
- **Hashnode**: GraphQL API for blog posts
- **Notion**: Database API for talks/conferences
- **Snappify**: Embedded presentations
- **Social**: GitHub, X, Bluesky, LinkedIn integration

## Design System

### Color Palette

- **Dark background**: `#0f1117` (primary), `#1e293b` (cards)
- **Green accent**: `#10b981` (emerald-500) - primary accent, CTAs, highlights
- **Yellow**: `#fbbf24` (amber-400) - DX layer, availability bar
- **Purple**: `#a855f7` - AI Orchestration layer
- **Cyan**: `#06b6d4` - Engineering Foundations layer
- **Text**: `#e2e8f0` (light), `rgba(226, 232, 240, 0.7)` (muted)

### Typography

- **`JetBrains Mono`**: Labels, tags, code, monospace elements
- **`Inter`**: Body text, headings

### Component Types

- **ARTICLE**: Green/emerald badges for blog posts
- **NOTE**: Amber badges for shorter posts
- **TALK**: Purple badges for conference talks

## Content Loading Patterns

### External APIs

- **Hashnode GraphQL**: `https://gql.hashnode.com` for blog posts
- **Notion API**: Via `notion-astro-loader` for structured data
- **Static JSON**: CV data in `src/content/cv/cv.json`

### Schema Validation

All external data must use Zod schemas:

```typescript
export const PostSchema = z.object({
  title: z.string(),
  publishedAt: z.string(),
  // ... other fields
});
```

## Profile Context System

The `context/` directory contains markdown files for AI-assisted content generation:

- `profile.md` - Core identity and experience
- `positioning.md` - Value proposition and differentiators
- `services.md` - Service pillars descriptions
- `ai-approach.md` - AI-augmented engineering philosophy
- `messaging.md` - Headlines and key phrases

Use these when generating profile-related content.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->
