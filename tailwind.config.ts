import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-deep': 'var(--primary-deep)',
        gold: 'var(--gold)',
        'gold-amber': 'var(--gold-amber)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '760px',
            color: 'var(--foreground)',
            a: {
              color: 'var(--foreground)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': {
                opacity: 0.7,
              },
            },
            h1: { color: 'var(--foreground)' },
            h2: { color: 'var(--foreground)' },
            h3: { color: 'var(--foreground)' },
            h4: { color: 'var(--foreground)' },
            strong: { color: 'var(--foreground)' },
            code: { color: 'var(--foreground)' },
            blockquote: {
              color: 'var(--muted-foreground)',
              borderLeftColor: 'var(--border)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
