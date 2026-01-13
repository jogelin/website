# Blog Format Reference

## File Location

All blog posts live in: `src/content/blog/`

File extension: `.mdx` (MDX format for component support)

## Frontmatter Schema

```yaml
---
title: "Title with emoji prefix"
subtitle: "Descriptive subtitle explaining article scope"
publishedAt: YYYY-MM-DD
updatedAt: YYYY-MM-DD  # Optional, add when making significant updates
coverImage: /blog/covers/article-slug.png
tags:
  - tag1
  - tag2
author:
  name: Jonathan Gelin
  profilePicture: /avatar.png
type: article  # or "note"
draft: false   # Set to true while writing
---
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Article title, typically with emoji prefix |
| `publishedAt` | date | Publication date in YYYY-MM-DD format |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `subtitle` | string | - | Explanatory subtitle |
| `updatedAt` | date | - | Last significant update date |
| `coverImage` | string | - | Path to cover image |
| `tags` | string[] | `[]` | Categorization tags |
| `author.name` | string | `"Jonathan Gelin"` | Author name |
| `author.profilePicture` | string | `"/avatar.png"` | Author avatar path |
| `type` | enum | `"article"` | Either "article" or "note" |
| `draft` | boolean | `false` | Hide from production build |

## Title Conventions

Titles typically start with an emoji that relates to the content:

```yaml
# Technical deep-dives
title: "🔎 Deep Dive into Nx Affected"
title: "💡 10 Tips for Successful Nx Plugin Architecture"

# Release/update notes
title: "🍒 Cherry-Picked Nx v19.6 Updates"

# Discovery/exploration
title: "✨ Discovering Nx Project Crystal's Magic"

# How-to/guides
title: "🏗️ Local Library Development with Nx Release and Verdaccio"
```

Common emoji usage:
- 🔎 Deep dives, investigations
- 💡 Tips, insights, ideas
- 🍒 Cherry-picked updates
- ✨ New features, discoveries
- 🏗️ Architecture, building
- 🛠️ Tools, configuration
- 📦 Packages, modules
- 🚀 Performance, launches

## Tag Guidelines

### Primary Tags (use for topic)
- `nx` - Any Nx-related content
- `monorepo` - Monorepo strategies
- `angular` - Angular-specific
- `reactjs` - React-specific
- `typescript` - TypeScript deep-dives
- `nodejs` - Node.js topics

### Secondary Tags (use for technologies mentioned)
- `micro-frontend`
- `module-federation`
- `ci-cd`
- `developer-experience`
- `architecture`
- `testing`

### Tag Count
Aim for 4-7 relevant tags per article.

## Cover Image Specifications

- **Location**: `/public/blog/covers/`
- **Naming**: Match article slug (e.g., `deep-dive-into-nx-affected.png`)
- **Formats**: `.png`, `.webp` preferred
- **Style**: Dark background, tech-focused imagery

## Content Image Paths

Images referenced in article body:
- **Location**: `/public/blog/images/`
- **Reference path in MDX**: `/blog/images/filename.png`

```markdown
![Alt text description](/blog/images/diagram-name.png)
```

## MDX Component Imports

Place imports after frontmatter, before content:

```mdx
---
# frontmatter here
---

import UrlEmbed from "../../components/embeds/UrlEmbed.astro";
import BlogEmbed from "../../components/embeds/BlogEmbed.astro";

Content starts here...
```

## Embed Components

### UrlEmbed
For external links with preview cards:
```mdx
<UrlEmbed url="https://nx.dev/blog/example" />
```

### BlogEmbed
For linking to other articles on the same blog:
```mdx
<BlogEmbed slug="poly-monorepos-with-nx" title="Poly-Monorepos with Nx" />
```

## Draft Workflow

1. Create article with `draft: true`
2. Write and iterate
3. Run `pnpm build` to validate
4. Set `draft: false` when ready to publish
5. Commit and deploy

## Date Formatting

Always use ISO format: `YYYY-MM-DD`

```yaml
publishedAt: 2024-06-18
updatedAt: 2024-07-01
```
