# Writing Style Reference

## Voice and Tone

### First Person Perspective
Write from personal experience using "I" perspective:

```markdown
✅ "I often see that Nx users don't know or are afraid of extending Nx..."
✅ "This is a question I hear every day!"
✅ "I've worked on many different Monorepos..."
✅ "I hope I clarified some parts..."

❌ "One might observe that users..."
❌ "The reader should note..."
```

### Direct and Practical
Be conversational yet professional:

```markdown
✅ "Let's walk through an example..."
✅ "Here's how it works..."
✅ "The most common rule is..."

❌ "In this section, we shall examine..."
❌ "It behooves the developer to..."
```

### Enthusiastic but Grounded
Share genuine enthusiasm without hyperbole:

```markdown
✅ "Stay Tuned 🚀"
✅ "The combination is powerful because..."
✅ "This makes the investigation not always straightforward..."
```

## Article Structure

### Opening Pattern

Start with a relatable problem or question:

```markdown
## 😵 **Why is this untouched project affected?**

This is a question I hear every day! A question that has led me
many times into a debugging session...
```

Or introduce the value proposition:

```markdown
Nx provides many features, and I often see that Nx users don't know
or are **afraid of extending Nx** by implementing Nx Plugins.

I've worked on many different Monorepos, and **setting up an Nx plugin
architecture** has helped me **solve many issues**.
```

### Section Headings

Use emoji prefixes for major sections:

```markdown
## 🤓 Affected Reminder
## 🤩 Affected Commands
## 😶 Affected Rules
## 🧐 Affected Investigation
## 🤕 Affected Fixes
## 🙂 Last Thoughts
```

For numbered tips/lists:

```markdown
## **1. Start Using Nx Plugins**
## **2. Use Inference over Generators**
## **3. Adopt Secondary Entry Points**
```

### Horizontal Rules

Use horizontal rules (`---`) to separate major sections:

```markdown
---

## 🌊 Nx Core

### Skipping Dependent Tasks

Content here...

---

## 🧩 Module Federation
```

## Text Formatting

### Bold for Emphasis
Use bold for key terms and important concepts:

```markdown
The ability to re-execute **only the impacted** apps/libs will
drastically **reduce your Software Development Cycle time**.

You are impacting the related app/lib and also all other **apps/libs**
that **depend** on it.
```

### Blockquotes for Warnings and Notes

```markdown
> ⚠️ Only use this as a last resort!

> For more detailed information about how Nx handles target caching...
```

### Inline Code
Use for technical terms, commands, file names:

```markdown
Files matching a pattern in `.gitignore` or `.nxignore` will be **ignored**.

You can use the command `nx show project [projectName]`...
```

## Code Blocks

### Command Examples
Use appropriate language hints:

```markdown
```bash
nx affected -t lint test build
```

```json
nx show projects --affected
```
```

### Configuration Examples
Show practical, real-world configs:

```markdown
```json
"targetDefaults": {
  "@nx/jest:jest": {
    "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
  },
},
```
```

### TypeScript/Code Examples
Include full, working examples:

```markdown
```typescript
export const config: ModuleFederationConfig = {
  ...,
  disableNxRuntimeLibraryControlPlugin: true
}
```
```

## Images and Diagrams

### Image Markdown
Use descriptive alt text:

```markdown
![Affected Projects Principle](/blog/images/1*wBNqBAJJrM2AemYdHiIjUg.png)

![Comparaison between Project Graph and Task Graph](/blog/images/1*oiv9ahvmBu6yPWUzcPr_0g.png)
```

### Image Captions
Add context after images when needed:

```markdown
![Task Graph Diagram](/blog/images/task-graph.png)

from Nx Mental Model Documentation
```

## Lists

### Bullet Points
Use for feature lists, options:

```markdown
* `all`: Affect all projects
* `auto`: Affect only projects related to the modified dependencies
* `string[]`: Define a list of projects
```

### Numbered Steps
Use for procedures:

```markdown
1. Cloning the external repository.
2. Moving the code to the desired directory in a temporary branch.
3. Merging the code into the current workspace branch.
4. Recommending Nx plugins for tool integration.
```

## Closing Pattern

### Summary Section
Wrap up with key takeaways:

```markdown
## 🙂 Last Thoughts

As you can see, the Nx affected process not only considers the list of
modified files but also computes the list based on various other factors.

I hope I clarified some parts and provided you with the keys for a
better understanding of the affected process.
```

### Call to Action
End with engagement invitation:

```markdown
If you have additional tips or ask questions, feel free to contact me
or book a call. More information is available on my website below 👇

---

## **Resources**

<UrlEmbed url="https://nx.dev/extending-nx/intro/getting-started" />
```

### Signature/Link Block
Include website link at the end:

```markdown
[![](/blog/images/1*eovVydp711USejlB4b7HfA.png)](https://smartsdlc.dev/)
```

## Article Type Differences

### Full Articles (`type: article`)
- 1500-4000 words
- Multiple major sections with emoji headings
- Detailed code examples
- Images and diagrams
- Resources section at end

### Notes (`type: note`)
- 500-1500 words
- Curated list of updates/features
- Subsections for each feature
- External links with UrlEmbed
- More concise explanations

## Common Phrases

Transition phrases:

```markdown
"Let's walk through an example..."
"For example, if you..."
"However, on big repositories..."
"This behavior can be modified using..."
"To address this, a new..."
"For more information, see..."
```

Engagement phrases:

```markdown
"I often see that..."
"This is a question I hear every day!"
"I hope this list of tips helps you..."
"Stay Tuned 🚀"
```

## Proofreading Checklist

- [ ] Emoji in title matches content theme
- [ ] Bold used for key terms, not randomly
- [ ] Code blocks have language hints
- [ ] Images have descriptive alt text
- [ ] Sections separated with horizontal rules
- [ ] Resources section at end (if applicable)
- [ ] Personal voice maintained throughout
- [ ] Technical accuracy verified
