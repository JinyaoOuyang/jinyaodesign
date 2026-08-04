import { Reveal } from './Reveal'

interface Capability {
  num: string
  title: string
  italic: string
  body: string
}

const defaults: Capability[] = [
  {
    num: '01',
    title: 'Adaptive',
    italic: 'systems',
    body: 'Interfaces that respond to context — not static dashboards or one-size-fits-all flows.',
  },
  {
    num: '02',
    title: 'AI-powered',
    italic: 'product',
    body: 'Designing with AI as a collaborator: shaping decisions, not just generating content.',
  },
  {
    num: '03',
    title: 'Built with',
    italic: 'restraint',
    body: 'Less is more. Every added feature competes for attention; I choose carefully.',
  },
]

export function CapabilitiesStrip({ items = defaults }: { items?: Capability[] }) {
  return (
    <Reveal className="caps">
      {items.map((cap) => (
        <div className="cell" key={cap.num}>
          <div className="num">{cap.num}</div>
          <h3 className="h">
            {cap.title} <em>{cap.italic}</em>
          </h3>
          <p className="p">{cap.body}</p>
        </div>
      ))}
    </Reveal>
  )
}
