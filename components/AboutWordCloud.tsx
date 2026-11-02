'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { PORTRAIT_H, PORTRAIT_W, PORTRAIT_WORDS } from '@/lib/aboutPortrait'

type KeyStory = {
  w: string
  kicker: string
  body: string
}

// The 14 stories. Their order is the `s` index in lib/aboutPortrait.ts — the
// phrases inside the portrait that own each story point back here by number.
const KEY: KeyStory[] = [
  { w: 'FLEXI-CASA', kicker: 'Commercial work', body: 'Sole <b>Product Designer & Engineer</b> for a custom Next.js / Shopify storefront, alongside a reusable Amazon product-image workflow. My work connects product presentation, commerce integration, and implementation.' },
  { w: 'Design Engineer', kicker: 'How I work', body: 'I take a product from <b>interaction design to working software</b>: defining behavior, building components, and refining the details in code.' },
  { w: 'Trail', kicker: 'Independent build', body: 'An AI job-search copilot with a web dashboard and Chrome extension. I designed and built the initial version solo in <b>4 days</b>, then continued refining the workflow.' },
  { w: 'AI-Native', kicker: "What I'm drawn to", body: 'Products where people can <b>inspect, steer, and recover from AI output</b>. I care about the interaction and the rules around the model.' },
  { w: 'Growth & Tooling', kicker: 'How I build', body: 'Especially drawn to <b>growth, tooling, and consumer AI</b> problems.' },
  { w: 'University of Washington', kicker: 'Education', body: '<b>MS in Technology Innovation (HCI)</b>, Global Innovation Exchange, University of Washington.' },
  { w: 'Imagine Cup', kicker: 'Recognition', body: 'Microsoft Imagine Cup 2022 — <b>Americas Regional Champion</b>.' },
  { w: 'TEAGUE', kicker: 'Past role', body: 'Product Design intern at <b>TEAGUE</b>, working on WebVR and automotive UX.' },
  { w: 'Silkroad', kicker: 'Past role', body: 'UX Designer at <b>Silkroad Visual Technology</b>, building enterprise SaaS.' },
  { w: 'Grand Rapids', kicker: 'Base', body: 'Based in <b>Grand Rapids, MI</b> — willing to relocate. H-1B transfer-ready.' },
  { w: 'Medium', kicker: 'Writing', body: 'I write on <b>Medium</b> about product decisions, implementation, and lessons from AI-assisted workflows.' },
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
  // Three distinct ways a phrase can be active, kept apart on purpose:
  //   hover    — fine pointer over the phrase; clears the moment it leaves
  //   focus    — keyboard focus; clears on blur
  //   selected — a touch tap; persists (touch has no hover) until another tap
  // Nothing else persists. Mouse clicks never select.
  const [hover, setHover] = useState<number | null>(null)
  const [focus, setFocus] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const active = hover ?? focus ?? selected

  // The story panel crossfades to follow `active`. This is presentation only:
  // whenever `active` changes, any pending swap is dropped, so a hover that
  // leaves within the fade can never surface a stale story.
  const [panel, setPanel] = useState<Panel | null>(null)
  const [visible, setVisible] = useState(true)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current)
    if (active === null) {
      setPanel(null)
      setVisible(true)
      return
    }
    const data = KEY[active]
    setVisible(false)
    timer.current = window.setTimeout(() => {
      setPanel({ kicker: data.kicker, body: data.body })
      setVisible(true)
    }, 120)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [active])

  const isTouch = (e: ReactPointerEvent<SVGGElement>) => e.pointerType === 'touch'

  const onPointerEnter = (index: number) => (e: ReactPointerEvent<SVGGElement>) => {
    if (!isTouch(e)) setHover(index)
  }
  const onPointerLeave = (index: number) => (e: ReactPointerEvent<SVGGElement>) => {
    if (!isTouch(e)) setHover((h) => (h === index ? null : h))
  }
  // A mouse click must not leave keyboard focus on the phrase — that would
  // quietly reintroduce persistence after the pointer leaves.
  const onPointerDown = (e: ReactPointerEvent<SVGGElement>) => {
    if (!isTouch(e)) e.preventDefault()
  }
  const onPointerUp = (index: number) => (e: ReactPointerEvent<SVGGElement>) => {
    if (isTouch(e)) setSelected(index)
  }
  const onKey = (index: number) => (e: ReactKeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFocus(index)
    }
  }

  return (
    <div className="about-cloud-hero">
      <div className="about-cloud-lead">
        <div className="about-cloud-eyebrow">
          About, in the words I&apos;m built from
        </div>
        <h1 className="about-cloud-title">
          I like turning messy ideas
          <br />
          into things that work.
        </h1>
        <p className="about-cloud-standfirst">
          I&apos;m Jinyao, a Design Engineer working across product design, React, and React Native.
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
                onPointerEnter={onPointerEnter(s)}
                onPointerLeave={onPointerLeave(s)}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp(s)}
                onFocus={() => setFocus(s)}
                onBlur={() => setFocus((f) => (f === s ? null : f))}
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
