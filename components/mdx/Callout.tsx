import { ReactNode } from 'react'

interface CalloutProps {
  children: ReactNode
  type?: 'default' | 'insight' | 'warning'
}

export function Callout({ children, type = 'default' }: CalloutProps) {
  const styles = {
    default: 'border-border bg-muted',
    insight: 'border-foreground/20 bg-foreground/5',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
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
