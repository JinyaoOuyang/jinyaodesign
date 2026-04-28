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
          <span className="font-display text-4xl md:text-5xl leading-none tracking-[-0.015em] text-foreground">
            {stat.value}
          </span>
          <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
