import { MDXRemote } from 'next-mdx-remote/rsc'
import { Figure } from './mdx/Figure'
import { TwoColumn, Column } from './mdx/TwoColumn'
import { Callout } from './mdx/Callout'
import { Divider } from './mdx/Divider'
import { Stats } from './mdx/Stats'
import { slugify, type TocHeading } from '@/lib/toc'

function childrenToString(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) return children.map(childrenToString).join('')
  if (
    children &&
    typeof children === 'object' &&
    'props' in (children as any) &&
    (children as any).props?.children
  ) {
    return childrenToString((children as any).props.children)
  }
  return ''
}

const pad = (n: number) => String(n).padStart(2, '0')

function makeComponents(headings: TocHeading[]) {
  const bySlug = new Map(headings.map((h) => [h.slug, h]))
  return {
    Figure,
    TwoColumn,
    Column,
    Callout,
    Divider,
    Stats,
    h2: ({ children, ...props }: any) => {
      const text = childrenToString(children)
      const slug = slugify(text)
      const item = bySlug.get(slug)
      return (
        <>
          {item && (
            <div className="section-eyebrow">
              {pad(item.index)} — {text.toUpperCase()}
            </div>
          )}
          <h2 id={slug} {...props}>
            {children}
          </h2>
        </>
      )
    },
  }
}

interface MDXContentProps {
  source: string
  headings?: TocHeading[]
}

export function MDXContent({ source, headings = [] }: MDXContentProps) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <MDXRemote source={source} components={makeComponents(headings)} />
    </div>
  )
}
