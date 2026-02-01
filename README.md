# Jinyao Ouyang Portfolio

A minimalist, fast, SEO-friendly portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and MDX.

## Features

- **Next.js 14 App Router** — Latest React framework with server components
- **MDX Content** — Write case studies and blog posts in Markdown with React components
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **TypeScript** — Full type safety throughout
- **SEO Optimized** — Metadata API, sitemap, robots.txt, Open Graph
- **Responsive** — Mobile-first design
- **Fast** — Optimized images, static generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Home page
│   ├── about/              # About page
│   ├── blog/               # Blog index and [slug] pages
│   ├── work/               # Work index and [slug] pages
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/             # React components
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── WorkCard.tsx        # Work preview card
│   ├── BlogCard.tsx        # Blog preview card
│   ├── MDXContent.tsx      # MDX renderer
│   └── mdx/                # MDX components
│       ├── Figure.tsx
│       ├── TwoColumn.tsx
│       ├── Callout.tsx
│       ├── Divider.tsx
│       └── Stats.tsx
├── content/                # MDX content files
│   ├── work/               # Case study MDX files
│   └── blog/               # Blog post MDX files
├── lib/                    # Utilities and config
│   ├── config.ts           # Site configuration
│   ├── content.ts          # Content fetching functions
│   ├── mdx.ts              # MDX serialization
│   └── types.ts            # TypeScript types
├── public/                 # Static assets
│   ├── work/               # Case study images
│   ├── blog/               # Blog images
│   └── Jinyao_Ouyang_Resume.pdf
└── tailwind.config.ts      # Tailwind configuration
```

## Adding Content

### Add a New Case Study

1. Create a new `.mdx` file in `content/work/`:

```mdx
---
title: "Project Title"
description: "Brief description of the project"
date: "2024-01-15"
tags: ["Tag1", "Tag2"]
role: "Your Role"
timeline: "3 months"
tools: ["Figma", "React"]
coverImage: "/work/project-cover.jpg"
featuredOrder: 1
metrics: ["Metric 1", "Metric 2"]
---

## Overview

Your content here...
```

2. Add cover image to `public/work/`
3. Set `featuredOrder` (1-4) to control display order on home and work pages

### Add a New Blog Post

1. Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: "Post Title"
description: "Brief description"
date: "2024-01-15"
tags: ["Tag1", "Tag2"]
readingTime: "5 min"
---

Your content here...
```

2. Posts are automatically sorted by date (newest first)

### Using MDX Components

Available components in MDX files:

```mdx
<Figure 
  src="/work/image.jpg" 
  alt="Description" 
  caption="Optional caption" 
/>

<TwoColumn>
<Column>
Left content
</Column>
<Column>
Right content
</Column>
</TwoColumn>

<Callout type="insight">
Important note or insight
</Callout>

<Divider />

<Stats items={[
  { label: "Users", value: "10K+" },
  { label: "Rating", value: "4.8" }
]} />
```

## Configuration

Edit `lib/config.ts` to update:

- Site title and description
- Your name and tagline
- Email address
- LinkedIn URL
- Resume path
- Navigation items

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy — Vercel auto-detects Next.js

Or use the CLI:

```bash
npm i -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build settings are configured in `netlify.toml`

Or use the CLI:

```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Customization

### Colors

Edit CSS variables in `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --border: #e5e5e5;
}
```

### Typography

Edit the Tailwind typography config in `tailwind.config.ts`.

### Dark Mode

Dark mode is class-based. Add dark mode toggle by managing the `dark` class on `<html>`.

## License

MIT
