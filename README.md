# Jinyao Ouyang Portfolio

A minimalist, fast, SEO-friendly portfolio website built with Next.js 16, TypeScript, Tailwind CSS, and MDX.

## Features

- **Next.js 16 App Router** — Latest React framework with server components
- **MDX Content** — Write case studies and blog posts in Markdown with React components
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **TypeScript** — Full type safety throughout
- **SEO Optimized** — Metadata API, sitemap, robots.txt, Open Graph
- **Responsive** — Mobile-first design
- **Fast** — Optimized images, static generation

## Getting Started

### Prerequisites

- Node.js 22+
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

## Traffic measurement and release checks

GA4 uses the existing property `G-9WWV08C6KQ`. The loader only runs on
`jinyaodesign.com` and `www.jinyaodesign.com`; previews log `[analytics]` in
the browser console without sending test visits to GA. Automatic page views
remain enabled. Custom events are `project_open`, `case_study_view`,
`resume_click`, `contact_click`, `demo_click`, and `source_click`.
Custom parameters contain path, project slug, placement, contact method, or
public destination hostname; they omit link query strings and email addresses.

After deploying, verify these events in GA Realtime. Register `project_slug`
and `location` as event-scoped custom dimensions if project/placement reports
are needed. Mark `contact_click` as a key event; a click indicates intent,
not a completed inquiry. Confirm enhanced measurement's history-change page
views in the property before relying on route-level traffic reports.

Use tagged links on external channels only; keep internal links untagged:

- Medium article: https://www.jinyaodesign.com/work/isleo?utm_source=medium&utm_medium=referral&utm_campaign=isleo_case_study&utm_content=article_footer
- LinkedIn post: https://www.jinyaodesign.com/work/isleo?utm_source=linkedin&utm_medium=social&utm_campaign=isleo_case_study&utm_content=project_post
- Medium profile: https://www.jinyaodesign.com/?utm_source=medium&utm_medium=referral&utm_campaign=portfolio&utm_content=profile

Medium syndications point their canonical to the original Medium URL. Original
case studies and index pages point to this site. The sitemap includes only local
canonical pages. After deployment and ownership verification, submit
https://www.jinyaodesign.com/sitemap.xml in Google Search Console.
No Search Console verification token is invented or embedded.

Run `npm run check:portfolio` for event classification/privacy and article-source
checks. Run `npm run build`, start port 3010, then `npm run check:release` to
check all content routes, metadata, public linked assets, PDF download, share
image rendering, sitemap, and preview-page noindex. Set `PORTFOLIO_URL` to
check another running host.

Security maintenance: Next.js, React, and the 3D renderer are upgraded together.
MDX JavaScript expressions are explicitly blocked; interactive components are
provided through the reviewed component map. Run `npm audit` after dependency
updates, `npm run check:security` for the MDX execution regression checks, and
repeat the production build and release checks. Netlify uses Node 22 and the
automatically updated OpenNext adapter; the deployed adapter still requires a
real deployment check.
