'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { PORTRAIT_H, PORTRAIT_W, PORTRAIT_WORDS } from '@/lib/aboutPortrait'

type KeyStory = {
  w: string
  kicker: string
  body: string
}

// The 14 stories. Their order is the `s` index in lib/aboutPortrait.ts — the
// phrases inside the portrait that own each story point back here by number.
const KEY: KeyStory[] = [
  { w: 'FLEXI-CASA', kicker: 'Day job', body: 'Sole <b>Design Engineer</b>, with end-to-end product ownership at FLEXI-CASA — a multi-channel DTC brand spanning a headless Shopify/Next.js storefront, Amazon, and Etsy. I own the full stack: product strategy, conversion funnel, experimentation, and the code that makes it run.' },
  { w: 'Design Engineer', kicker: 'How I work', body: "I don't hand things off. I <b>design it, build it, and ship it</b> — from system architecture to the final pixel." },
  { w: 'Trail', kicker: 'Side build', body: "An AI-powered job search copilot. Idea to live product in <b>~4 days</b> — designed, built, and shipped solo. That's how I work." },
  { w: 'AI-Native', kicker: "What I'm drawn to", body: '<b>AI-native products</b> and emerging interaction models — where the product question is what a person and a model do together, and no pattern library has the answer yet.' },
  { w: 'Growth & Tooling', kicker: 'How I build', body: 'Especially drawn to <b>growth, tooling, and consumer AI</b> problems.' },
  { w: 'University of Washington', kicker: 'Education', body: '<b>MS in Technology Innovation (HCI)</b>, Global Innovation Exchange, University of Washington.' },
  { w: 'Imagine Cup', kicker: 'Recognition', body: 'Microsoft Imagine Cup 2022 — <b>Americas Regional Champion</b>.' },
  { w: 'TEAGUE', kicker: 'Past role', body: 'Product Design intern at <b>TEAGUE</b>, working on WebVR and automotive UX.' },
  { w: 'Silkroad', kicker: 'Past role', body: 'UX Designer at <b>Silkroad Visual Technology</b>, building enterprise SaaS.' },
  { w: 'Grand Rapids', kicker: 'Base', body: 'Based in <b>Grand Rapids, MI</b> — willing to relocate. H-1B transfer-ready.' },
  { w: 'Medium', kicker: 'Writing', body: 'I write on <b>Medium</b> about AI-native development workflows.' },
  { w: 'Mandarin & English', kicker: 'Background', body: 'Originally from <b>China</b> — fluent in Mandarin and English.' },
  { w: 'Strength Training', kicker: 'Off the clock', body: "When I'm not building: <b>strength training</b>, watching chipmunks in the backyard, and eating my way through whatever cuisine I haven't tried yet." },
  { w: 'Cursor & Claude', kicker: 'Toolkit', body: 'Figma, Framer, Windsurf, Notion, React, Next.js, TypeScript, Supabase — built daily alongside <b>Cursor and Claude</b>.' },
]

type Panel = { kicker: string; body: string }

// One composition, one coordinate system. The generator placed every word —
// anchors, phrases and face vocabulary — into a 575x596 field; the SVG viewBox
// scales that field as a whole, so the portrait is the same at every width.
const STATIC_WORDS = PORTRAIT_WORDS.filter((p) => p.s === undefined)
const STORY_WORDS = PORTRAIT_WORDS.filter((p) => p.s !== undefined)

export function AboutWordCloud() {
  const [active, setActive] = useState<number | null>(null)
  // null = resting state: the section shows only the invitation to explore.
  // Once a story is activated it persists until another phrase replaces it.
  const [panel, setPanel] = useState<Panel | null>(null)
  const [visible, setVisible] = useState(true)
  const timer = useRef<number | null>(null)

  const show = (index: number) => {
    if (index === active) return
    const data = KEY[index]
    setActive(index)
    setVisible(false)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPanel({ kicker: data.kicker, body: data.body })
      setVisible(true)
    }, 120)
  }

  const onKey = (index: number) => (e: ReactKeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      show(index)
    }
  }

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className="about-cloud-hero">
      <div className="about-cloud-lead">
        <div className="about-cloud-eyebrow">
          About, in the words I&apos;m built from
        </div>
        <h2 className="about-cloud-title">
          I like turning messy ideas
          <br />
          into things that work.
        </h2>
        <p className="about-cloud-standfirst">
          Design Engineer working across interaction, systems, and implementation.
        </p>

        <div className="about-cloud-panel">
          {panel ? (
            <>
              <div className="kicker" style={{ opacity: visible ? 1 : 0 }}>
                {panel.kicker}
              </div>
              <div
                className="body"
                style={{ opacity: visible ? 1 : 0 }}
                dangerouslySetInnerHTML={{ __html: panel.body }}
              />
            </>
          ) : (
            /* Resting state. Pointer-type decides the verb in CSS — no JS,
               so it stays correct through SSR and hybrid touch/trackpad. */
            <p className="about-cloud-cue" style={{ opacity: visible ? 1 : 0 }}>
              <span className="cue-hover">Hover a word</span>
              <span className="cue-tap">Tap a word</span>{' '}
              <span aria-hidden="true">→</span>
            </p>
          )}
        </div>
      </div>

      <div className="about-cloud-art-col">
        <svg
          className="about-portrait"
          viewBox={`0 0 ${PORTRAIT_W} ${PORTRAIT_H}`}
          aria-labelledby="about-portrait-title"
        >
          <title id="about-portrait-title">
            Typographic portrait of Jinyao Ouyang — the words of her story arranged into her face
          </title>

          {/* The field: every word that is not interactive. Decorative to AT. */}
          <g aria-hidden="true" className="pw-field">
            {STATIC_WORDS.map((p, i) => (
              <text key={i} x={p.x} y={p.y} fontSize={p.px} fontWeight={p.w} fillOpacity={p.a}>
                {p.t}
              </text>
            ))}
          </g>

          {/* The same field's story-owning phrases. Same type, same ink — the
              only difference is that these carry a story. Painted after the
              field so their hit rects sit on top. */}
          {STORY_WORDS.map((p, i) => {
            const s = p.s as number
            const [hx, hy, hw, hh] = p.hit as [number, number, number, number]
            const underlineY = p.y + p.px * 0.14
            return (
              <g
                key={`s${i}`}
                className={`pw${active === s ? ' active' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${KEY[s].w} — ${KEY[s].kicker}`}
                onMouseEnter={() => show(s)}
                onFocus={() => show(s)}
                onClick={() => show(s)}
                onKeyDown={onKey(s)}
              >
                <text x={p.x} y={p.y} fontSize={p.px} fontWeight={p.w} fillOpacity={p.a}>
                  {p.t}
                </text>
                <line
                  className="pw-rule"
                  x1={p.x}
                  x2={p.x + hw - (hx < p.x ? 2 * (p.x - hx) : 0)}
                  y1={underlineY}
                  y2={underlineY}
                  strokeWidth={Math.max(0.5, p.px * 0.06)}
                />
                <rect className="pw-hit" x={hx} y={hy} width={hw} height={hh} />
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
