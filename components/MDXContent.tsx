import { MDXRemote } from 'next-mdx-remote/rsc'
import { Figure } from './mdx/Figure'
import { TwoColumn, Column } from './mdx/TwoColumn'
import { Callout } from './mdx/Callout'
import { Divider } from './mdx/Divider'
import { Stats } from './mdx/Stats'

const components = {
  Figure,
  TwoColumn,
  Column,
  Callout,
  Divider,
  Stats,
}

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
