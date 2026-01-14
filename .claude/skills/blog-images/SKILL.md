---
name: blog-images
description: This skill should be used when the user asks to "generate a diagram", "create a blog image", "make a cover image", "create an architecture diagram", "generate a flowchart", "create an illustration for the article", or needs visual assets for blog posts. Also use when referencing image placeholders in articles (e.g., "[IMAGE: filename.svg]") that need to be generated. Generates images using Google's Gemini API with smartsdlc.dev design system styling.
---

# Blog Image Generation

Generate diagrams, cover images, and illustrations for blog articles using Google's Gemini API, styled consistently with the smartsdlc.dev design system.

## Design Philosophy

**Light, professional, corporate presentation style:**

- Light/white backgrounds with subtle geometric patterns
- Muted, professional color palette (soft teal, slate blue, gentle purple)
- Simple blocks with icons and labels
- Soft drop shadows (NOT glow effects)
- No complex connections between blocks
- Group related items by row with different colors

## Usage

Run the script using `uv run` with absolute path:

```bash
uv run /Users/jgelin/dev/website/.claude/skills/blog-images/scripts/generate_image.py \
  --prompt "description of the image" \
  --filename "output-path.png" \
  --style diagram|cover|flowchart|architecture|custom \
  --aspect-ratio 16:9|1:1|4:3
```

**Important:** Run from the project root directory so images save to the correct location (e.g., `public/blog/images/`).

## Image Types

### Diagrams (`--style diagram`)

Simple block diagrams for explaining concepts:
- Component grids (items grouped by rows)
- Process visualizations
- Concept illustrations

Output location: `public/blog/images/[article-slug]/[name].png`

### Flowcharts (`--style flowchart`)

Process and cycle diagrams:
- Step-by-step processes
- Migration cycles
- Workflow sequences

### Architecture Diagrams (`--style architecture`)

Layered and hub diagrams:
- Layered stacks (DX → AI → Foundations)
- Hub-and-spoke layouts
- System components

### Cover Images (`--style cover`)

Hero images for blog posts:
- Abstract tech-themed visuals
- Light gradient backgrounds
- No text (added via HTML/CSS)

Output location: `public/blog/covers/[article-slug].webp`

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `--prompt` | Yes | - | Image description |
| `--filename` | Yes | - | Output path (relative or absolute) |
| `--style` | No | `diagram` | Style preset |
| `--aspect-ratio` | No | `16:9` | Image dimensions |
| `--resolution` | No | `2K` | Output resolution (1K/2K/4K) |
| `--input-image` | No | - | For editing existing images |
| `--api-key` | No | env var | Gemini API key |

## API Key

The script checks for the API key in order:
1. `--api-key` argument
2. `GEMINI_API_KEY` environment variable

## Prompt Writing Best Practices

### Key Principles

1. **Always specify "light background"**
2. **Use "simple rounded rectangles"** for blocks
3. **Include "icon and label"** for each element
4. **Specify colors by category** - "muted teal for X, soft purple for Y"
5. **Add "no connections" or "clean connections"** to avoid tangled diagrams
6. **End with "professional corporate presentation style"**
7. **Mention "soft shadows"** for depth

### Example: Simple Block Grid

```bash
uv run .../generate_image.py \
  --prompt "A simple diagram with 7 components in 2 rows. Top row: Agents (robot icon), Skills (book icon), MCPs (plug icon) - 3 simple rounded rectangles in muted teal color. Bottom row: Prompts (speech bubble icon), Templates (document icon), Rules (checklist icon), Examples (code brackets icon) - 4 simple rounded rectangles in soft purple color. Each block has an icon and label only. No group titles, no connections between blocks. Clean grid layout. Light background, soft shadows, professional corporate style." \
  --filename "public/blog/images/ai-sdlc/components.png" \
  --style diagram
```

### Example: Cycle Diagram

```bash
uv run .../generate_image.py \
  --prompt "Circular diagram showing a repeating cycle with 5 steps connected by arrows. Steps arranged in a circle: Build Framework → Start Migration → Slow Adoption → New Technologies → Try Again → back to start. Each step as a rounded rectangle with a small icon. Gray arrows connecting each step. Light background, muted slate blue for blocks, soft shadows. Professional corporate presentation style." \
  --filename "public/blog/images/ai-sdlc/cycle.png" \
  --style flowchart
```

### Example: Layered Stack

```bash
uv run .../generate_image.py \
  --prompt "Three horizontal layers stacked vertically. Top layer: Soft yellow/amber tint, labeled Developer Experience. Middle layer: Soft purple tint, labeled AI Orchestration. Bottom layer: Soft cyan/teal tint, labeled Engineering Foundations. Subtle separation between layers. Light background. Clean, professional presentation style." \
  --filename "public/blog/images/ai-sdlc/stack.png" \
  --style architecture
```

## Color Reference

| Category | Color | Usage |
|----------|-------|-------|
| Executors | Muted teal | Agents, Skills, MCPs |
| Knowledge | Soft purple | Prompts, Templates, Rules, Examples |
| Neutral | Slate blue | Connections, borders |
| Background | White/Light gray | Always use light backgrounds |

## Filename Conventions

**Diagrams in articles:**
```
public/blog/images/[article-slug]/[NN]-[descriptive-name].png
```
Example: `public/blog/images/ai-sdlc/01-migration-cycle.png`

**Cover images:**
```
public/blog/covers/[article-slug].webp
```

## Troubleshooting

**Image too complex or tangled:**
Add "no connections between blocks" or "simple blocks only" to the prompt.

**Wrong colors or style:**
Always include "light background, soft shadows, professional corporate presentation style" at the end.

**API key not found:**
Set: `export GEMINI_API_KEY=your-key`

## Additional Resources

- **`references/design-system.md`** - Complete color palette and styling guidelines
- **`references/diagram-prompts.md`** - Example prompts for common diagram types
