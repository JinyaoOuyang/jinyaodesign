interface StatItem {
  label: string
  value: string
}

interface StatsProps {
  items: StatItem[]
}

export function Stats({ items }: StatsProps) {
  return (
    <div className="my-8 grid grid-cols-2 gap-6 md:grid-cols-4">
      {items.map((item, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-semibold md:text-3xl">{item.value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
