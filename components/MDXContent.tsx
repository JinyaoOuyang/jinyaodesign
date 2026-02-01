'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Figure, TwoColumn, Column, Callout, Divider, Stats } from './mdx'

const components = {
  Figure,
  TwoColumn,
  Column,
  Callout,
  Divider,
  Stats,
}

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
