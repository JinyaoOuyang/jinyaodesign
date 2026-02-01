import { ReactNode } from 'react'

interface TwoColumnProps {
  children: ReactNode
}

export function TwoColumn({ children }: TwoColumnProps) {
  return (
    <div className="my-8 grid gap-6 md:grid-cols-2">
      {children}
    </div>
  )
}

interface ColumnProps {
  children: ReactNode
}

export function Column({ children }: ColumnProps) {
  return <div className="space-y-4">{children}</div>
}
