'use client'

import { useEffect, useRef, useState } from 'react'
import { ABOUT_FACE_ASPECT, ABOUT_FACE_WORDS } from '@/lib/aboutFaceCloud'

type Tier = 'c1' | 'c2' | 'c3'

type KeyStory = {
  w: string
  c: Tier
  kicker: string
  body: string
}

// Stories behind the interactive keywords — indexed by `k` in the placement data.
const KEY: KeyStory[] = [
  { w: 'FLEXI-CASA', c: 'c1', kicker: 'Day job', body: 'Sole <b>PM and Design Engineer</b> at FLEXI-CASA — a multi-channel DTC brand spanning a headless Shopify/Next.js storefront, Amazon, and Etsy. I own the full stack: product strategy, conversion funnel, experimentation, and the code that makes it run.' },
  { w: 'Design Engineer', c: 'c1', kicker: 'How I work', body: "I don't hand things off. I <b>design it, build it, and ship it</b> — from system architecture to the final pixel." },
  { w: 'Trail', c: 'c2', kicker: 'Side build', body: "An AI-powered job search copilot. Idea to live product in <b>~4 days</b> — designed, built, and shipped solo. That's how I work." },
  { w: 'AI-Native', c: 'c1', kicker: "What I'm looking for", body: 'Actively exploring PM and Design Engineer roles at <b>AI-native companies</b> — teams that value judgment over process, ship fast, and treat AI as a core product discipline, not a feature checkbox.' },
  { w: 'Growth & Tooling', c: 'c2', kicker: "What I'm drawn to", body: 'Especially drawn to <b>growth, tooling, and consumer AI</b> problems.' },
  { w: 'University of Washington', c: 'c2', kicker: 'Education', body: '<b>MS in Technology Innovation (HCI)</b>, Global Innovation Exchange, University of Washington.' },
  { w: 'Imagine Cup', c: 'c3', kicker: 'Recognition', body: 'Microsoft Imagine Cup 2022 — <b>Americas Regional Champion</b>.' },
  { w: 'TEAGUE', c: 'c3', kicker: 'Past role', body: 'Product Design intern at <b>TEAGUE</b>, working on WebVR and automotive UX.' },
  { w: 'Silkroad', c: 'c3', kicker: 'Past role', body: 'UX Designer at <b>Silkroad Visual Technology</b>, building enterprise SaaS.' },
  { w: 'Grand Rapids', c: 'c2', kicker: 'Base', body: 'Based in <b>Grand Rapids, MI</b> — willing to relocate. H-1B transfer-ready.' },
  { w: 'Medium', c: 'c3', kicker: 'Writing', body: 'I write on <b>Medium</b> about AI-native development workflows.' },
  { w: 'Mandarin & English', c: 'c3', kicker: 'Background', body: 'Originally from <b>China</b> — fluent in Mandarin and English.' },
  { w: 'Strength Training', c: 'c3', kicker: 'Off the clock', body: "When I'm not building: <b>strength training</b>, watching chipmunks in the backyard, and eating my way through whatever cuisine I haven't tried yet." },
  { w: 'Cursor & Claude', c: 'c2', kicker: 'Toolkit', body: 'Figma, Framer, Windsurf, Notion, React, Next.js, TypeScript, Supabase — built daily alongside <b>Cursor and Claude</b>.' },
]

const DEFAULT_PANEL = {
  kicker: 'Start here',
  body: "I'm Jinyao — a PM and builder at the intersection of AI, product, and engineering. I don't hand things off: I design it, build it, and ship it, from system architecture to the final pixel. <b>Hover any bold word</b> in the portrait to read the story behind it.",
}

export function AboutWordCloud() {
  const [active, setActive] = useState<number | null>(null)
  const [panel, setPanel] = useState(DEFAULT_PANEL)
  const [visible, setVisible] = useState(true)
  const timer = useRef<number | null>(null)

  const show = (data: KeyStory, index: number) => {
    if (index === active) return
    setActive(index)
    setVisible(false)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPanel({ kicker: data.kicker, body: data.body })
      setVisible(true)
    }, 120)
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
          Hover the <em>portrait</em>.
          <br />
          Every word is a piece of the story.
        </h2>

        <div className="about-cloud-panel">
        <div className="kicker" style={{ opacity: visible ? 1 : 0 }}>
          {panel.kicker}
        </div>
        <div
          className="body"
          style={{ opacity: visible ? 1 : 0 }}
          dangerouslySetInnerHTML={{ __html: panel.body }}
        />
          <div className="hint">
            Currently exploring PM &amp; Design Engineer roles at AI-native teams.
          </div>
        </div>
      </div>

      <div>
        <div
          className="about-face-art"
          style={{ aspectRatio: String(ABOUT_FACE_ASPECT) }}
          role="img"
          aria-label="Typographic portrait of Jinyao Ouyang — the words of her story arranged into her face"
        >
          {ABOUT_FACE_WORDS.map((word, i) => {
            if (word.k !== undefined) {
              const data = KEY[word.k]
              return (
                <span
                  key={i}
                  tabIndex={0}
                  className={`kw ${word.c}${active === word.k ? ' active' : ''}`}
                  style={{
                    left: `${word.x}%`,
                    top: `${word.y}%`,
                    fontSize: `${word.s}cqw`,
                  }}
                  onMouseEnter={() => show(data, word.k!)}
                  onFocus={() => show(data, word.k!)}
                  onClick={() => show(data, word.k!)}
                >
                  {word.t}
                </span>
              )
            }
            return (
              <span
                key={i}
                className={`fw l${word.l}`}
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  fontSize: `${word.s}cqw`,
                }}
              >
                {word.t}
              </span>
            )
          })}
        </div>
        <div className="about-cloud-caption">
          A portrait drawn from the words of the work — hover or tap a bright
          word to read its story.
        </div>
      </div>
    </div>
  )
}
