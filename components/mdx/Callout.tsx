import { ReactNode } from 'react'

interface CalloutProps {
  children: ReactNode
  type?: 'default' | 'insight' | 'warning'
}

export function Callout({ children, type = 'default' }: CalloutProps) {
  const styles = {
    default: 'border-border bg-muted',
    insight: 'border-primary/20 bg-primary/5',
    warning: 'border-gold-amber/50 bg-gold-amber/10',
  }

  return (
    <aside
      className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}
      role="note"
    >
      <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
    </aside>
  )
}
