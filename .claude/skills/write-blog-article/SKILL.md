---
name: Write Blog Article
description: This skill should be used when the user asks to "write a blog post", "create a new article", "draft a blog article", "write about a topic", "help me write content for my blog", "create a note", or wants assistance writing technical content for their personal website. Provides guidance on article structure, frontmatter format, writing style, and MDX patterns.
version: 0.1.0
---

# Write Blog Article Skill

This skill helps write new blog articles for Jonathan Gelin's personal website, ensuring consistency with existing content style, structure, and technical patterns.

## Purpose

Generate high-quality technical blog content that:
- Matches the established writing voice and style
- Uses correct MDX format with proper frontmatter
- Follows the article structure patterns from existing posts
- Integrates properly with the Astro 5 content collection

## Workflow

### Step 1: Understand the Topic

Before writing, clarify:
- **Topic scope**: What specific aspect to cover
- **Article type**: "article" (long-form technical) or "note" (shorter updates/news)
- **Target audience**: Developers working with Nx/monorepos, or broader technical audience
- **Key takeaways**: What readers should learn

### Step 2: Research Existing Content

Read existing articles to understand established patterns:
1. Use `Glob` to find related articles: `src/content/blog/**/*.mdx`
2. Read 2-3 relevant articles to understand:
   - Section structure and heading patterns
   - Code example conventions
   - Image and embed usage
   - Tone and voice

### Step 3: Create Article File

Create the new MDX file at: `src/content/blog/[slug].mdx`

**File naming convention:**
- Use kebab-case
- Be descriptive but concise
- Example: `optimizing-nx-cache-strategies.mdx`

### Step 4: Write Frontmatter

Use the schema from `references/blog-format.md` for proper frontmatter structure.

### Step 5: Write Content

Follow the patterns in `references/writing-style.md` for:
- Title formatting with emojis
- Section structure with emoji headings
- Code block conventions
- Personal voice and perspective

### Step 6: Add Embeds (Optional)

For embedding external URLs or internal blog references, import and use:

```mdx
import UrlEmbed from "../../components/embeds/UrlEmbed.astro";
import BlogEmbed from "../../components/embeds/BlogEmbed.astro";

<UrlEmbed url="https://example.com" />
<BlogEmbed slug="existing-article-slug" title="Article Title" />
```

### Step 7: Create Cover Image Prompt

Suggest a cover image description for generation with AI image tools:
- Match existing cover image style (dark background, tech-focused)
- Include topic-relevant visual elements
- Suggest saving to: `/public/blog/covers/[slug].webp`

## Quick Reference

### Article Types

| Type | Description | Typical Length |
|------|-------------|----------------|
| `article` | Long-form technical deep-dive | 1500-4000 words |
| `note` | News updates, release highlights | 500-1500 words |

### Common Tags

Use consistent tags from existing articles:
- `nx`, `monorepo`, `angular`, `reactjs`, `typescript`, `nodejs`
- `micro-frontend`, `module-federation`, `ci-cd`
- `developer-experience`, `architecture`

### Image Paths

- Cover images: `/blog/covers/[slug].png` or `.webp`
- Content images: `/blog/images/[descriptive-name].png`

## Context Files

When writing content related to Jonathan's expertise, consult:
- `context/profile.md` - Background and expertise
- `context/ai-approach.md` - AI tooling philosophy
- `context/positioning.md` - Value proposition
- `context/services.md` - Service offerings

## Additional Resources

### Reference Files

- **`references/blog-format.md`** - Complete frontmatter schema and file structure
- **`references/writing-style.md`** - Writing patterns, voice, and conventions

### Example Files

- **`examples/article-template.mdx`** - Template for long-form articles
- **`examples/note-template.mdx`** - Template for shorter notes

## Validation

After writing, verify:
1. Frontmatter contains all required fields (title, publishedAt, type)
2. File is saved in `src/content/blog/` with `.mdx` extension
3. All image paths are valid
4. Embeds use correct import paths
5. Run `pnpm build` to validate content collection parsing
