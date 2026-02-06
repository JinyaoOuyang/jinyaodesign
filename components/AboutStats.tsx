interface Stat {
  value: string
  label: string
}

interface AboutStatsProps {
  stats?: Stat[]
}

const defaultStats: Stat[] = [
  { value: '5+', label: 'Years of Experience' },
  { value: '20+', label: 'Completed Projects' },
  { value: '10+', label: 'Collaborations' },
]

export function AboutStats({ stats = defaultStats }: AboutStatsProps) {
  return (
    <div className="flex gap-10 md:gap-12">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <span
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {stat.value}
          </span>
          <span className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
