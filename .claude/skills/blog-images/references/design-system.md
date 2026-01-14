# smartsdlc.dev Design System for Images

Complete styling guidelines for generating consistent blog images.

## Design Philosophy

**Light, professional, corporate presentation style.**

- Light/white backgrounds with subtle geometric patterns
- Muted, professional color palette
- Clean, minimalist aesthetic
- Soft drop shadows (NOT glow effects)
- No harsh contrasts or neon colors

## Color Palette

### Backgrounds

| Name | Hex | Usage |
|------|-----|-------|
| Primary Light | `#ffffff` | Main background |
| Subtle Gray | `#f5f5f5` | Secondary background, patterns |
| Light Gray | `#e0e0e0` | Borders, subtle elements |

**Background pattern:** Light/white with very subtle geometric line patterns

### Accent Colors (Muted)

| Name | Hex | Usage |
|------|-----|-------|
| Muted Teal | `#5eaaa8` | Primary accent, executors |
| Soft Purple | `#9b8ac4` | Secondary accent, knowledge |
| Slate Blue | `#64748b` | Neutral elements, connections |
| Gentle Amber | `#d4a574` | Highlights, warnings |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#334155` | Headings, labels |
| Secondary | `#64748b` | Body text, descriptions |
| Muted | `#94a3b8` | Captions, subtle labels |

## Layer Color System (Website)

The three-layer stack concept on the website uses:

```
┌─────────────────────────────────┐
│     Developer Experience        │  ← Yellow (#fbbf24)
│         (DX Layer)              │
├─────────────────────────────────┤
│       AI Orchestration          │  ← Purple (#a855f7)
│     (Framework + Tooling)       │
├─────────────────────────────────┤
│   Engineering Foundations       │  ← Cyan (#06b6d4)
│      (Technical Base)           │
└─────────────────────────────────┘
```

**Note:** For blog diagrams, use the muted versions of these colors for a professional look.

## Visual Effects

### Shadows (Preferred)

- Soft drop shadows: `0 2px 8px rgba(0, 0, 0, 0.1)`
- Card shadows: `0 4px 12px rgba(0, 0, 0, 0.08)`

### Do NOT Use

- Glow effects
- Neon colors
- Dark backgrounds (unless specifically requested)
- Harsh contrasts

### Borders and Lines

- Connection lines: `1px solid #e0e0e0`
- Accent borders: Muted colors at full opacity
- Dividers: `1px solid #f0f0f0`

## Typography in Images

### Font Style

- Clean sans-serif for all text
- Dark gray text (`#334155`) on light backgrounds
- Medium weight for labels

### Text Styling

- Use sentence case for labels
- Keep labels short and clear
- Add subtle text shadow only if needed for readability

## Diagram Styles

### Simple Block Diagrams (Preferred)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Block 1    │  │   Block 2    │  │   Block 3    │
│   (icon)     │  │   (icon)     │  │   (icon)     │
└──────────────┘  └──────────────┘  └──────────────┘
```

- Simple rounded rectangles
- Icon + label in each block
- Soft shadows
- **No complex connections between blocks**

### Grouped Blocks (By Row/Color)

```
Row 1 (teal):    [Block A]  [Block B]  [Block C]
Row 2 (purple):  [Block D]  [Block E]  [Block F]  [Block G]
```

- Group related items on same row
- Different color per row
- No extra "group label" boxes
- Just use color to indicate grouping

### Flowcharts

```
┌──────────────┐     ┌──────────────┐
│   Step 1     │────▶│   Step 2     │
│  (rounded)   │     │  (rounded)   │
└──────────────┘     └──────────────┘
```

- Rounded rectangles for process steps
- Gray arrows with pointed heads
- Muted color borders
- Light background

### Architecture Diagrams

- Layered visualization with soft shadows
- Muted color-coded components
- Gentle connecting lines in gray
- Professional technical illustration style

## File Formats

| Type | Format | Quality |
|------|--------|---------|
| Diagrams | PNG | High quality |
| Cover images | WebP | Optimized for web |

## Prompt Keywords

Use these keywords for consistent AI generation:

**Style:** clean, minimalist, professional, corporate, light theme, presentation style

**Colors:** light background, muted colors, soft teal, slate blue, gentle purple

**Composition:** simple blocks, grid layout, clear labels, icons

**Effects:** soft shadows, subtle patterns, no glow, no neon

## Example Prompt Structure

```
"A [type] diagram showing [content].
[Layout description - rows, grid, etc.].
Each [element] as a simple rounded rectangle with [icon type] icon and label.
[Color instructions - which elements get which muted color].
Light background, soft shadows, professional corporate presentation style."
```
