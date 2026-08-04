'use client'

import { Fragment, useState } from 'react'
import type { ComponentType } from 'react'

type Kind = 'design' | 'ai' | 'clay' | 'ship'

type Step = {
  id: string
  name: string
  kind: Kind
  title: string
  blurb: string
  human: string
  machineLabel?: string
  machine?: string
  parallel?: boolean
  Logo: ComponentType
}

/* ---- Hand-built brand logos (recognizable, self-contained SVG) ---- */

function FigmaLogo() {
  return (
    <svg viewBox="0 0 38 57" height="34" role="img" aria-hidden="true">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  )
}

function NotionLogo() {
  return (
    <svg viewBox="0 0 24 24" height="34" role="img" aria-hidden="true">
      <rect x="1.6" y="1.6" width="20.8" height="20.8" rx="3.6" fill="#fff" stroke="#111" strokeWidth="1.3" />
      <path
        d="M8 7.1v9.8M8 7.1l8 9.8M16 7.1v9.8"
        stroke="#111"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CursorLogo() {
  return (
    <svg viewBox="0 0 24 24" height="34" role="img" aria-hidden="true">
      <polygon points="12,3 21,8 12,13 3,8" fill="#7a7a7a" />
      <polygon points="3,8 12,13 12,21.5 3,16.5" fill="#3d3d3d" />
      <polygon points="21,8 12,13 12,21.5 21,16.5" fill="#1c1c1c" />
    </svg>
  )
}

function BlenderLogo() {
  return (
    <svg viewBox="0 0 24 24" height="34" role="img" aria-hidden="true">
      <circle cx="12" cy="13" r="8.6" fill="#ea7600" />
      <ellipse cx="13" cy="11.8" rx="5.2" ry="3.1" transform="rotate(-18 13 11.8)" fill="#fff" />
      <circle cx="14.6" cy="11.1" r="1.75" fill="#265787" />
      <path d="M4.5 15.5 12 11" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function GitHubLogo() {
  return (
    <svg viewBox="0 0 24 24" height="32" role="img" aria-hidden="true">
      <path
        fill="#1a1535"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  )
}

function XcodeLogo() {
  return (
    <svg viewBox="0 0 24 24" height="34" role="img" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#147efb" />
      <path d="M7 17l6.2-6.2" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
      <rect x="12.4" y="5.9" width="6" height="3.1" rx="1" transform="rotate(45 15.4 7.4)" fill="#fff" />
    </svg>
  )
}

const STEPS: Step[] = [
  {
    id: 'figma',
    name: 'Figma',
    kind: 'design',
    title: 'Design & frame',
    blurb:
      'Think the problem on canvas, lock the clay palette, and design the home screen by hand.',
    human: 'Product thesis, visual language, and the one screen that sets the rhythm.',
    machineLabel: 'AI explores',
    machine: 'Concept variations to pressure-test directions.',
    Logo: FigmaLogo,
  },
  {
    id: 'notion',
    name: 'Notion',
    kind: 'ai',
    title: 'Strategy via MCP',
    blurb:
      'Notion wired through MCP so the agent and I shape strategy, roadmap, and the MVP cut.',
    human: 'Product bets — what ships first, what waits.',
    machineLabel: 'Agent drafts',
    machine: 'Structures roadmap and open questions from the discussion.',
    Logo: NotionLogo,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    kind: 'ai',
    title: 'Rapid prototype',
    blurb:
      'The mood board becomes living context; the agent builds the rest of the screens from the home design.',
    human: 'Direction and the last-10% polish that reads as intentional.',
    machineLabel: 'Agent builds',
    machine: 'Generates secondary screens fast from the pattern.',
    Logo: CursorLogo,
  },
  {
    id: 'blender',
    name: 'Blender',
    kind: 'clay',
    title: 'Model & animate',
    parallel: true,
    blurb:
      'Running alongside — sculpt the clay tiles and stage their layered reveal animations.',
    human: 'Polygon budget, layer taxonomy, and color language.',
    machineLabel: 'Scripts render',
    machine: 'Batch-render the ground, pond, flora, and shadow layers.',
    Logo: BlenderLogo,
  },
  {
    id: 'github',
    name: 'GitHub',
    kind: 'ship',
    title: 'Land the code',
    blurb: 'Commit the real thing — versioned, reviewable, a legible history.',
    human: 'Review and the judgment on what is actually ready.',
    machineLabel: 'Agent wires',
    machine: 'Helps land and connect changes.',
    Logo: GitHubLogo,
  },
  {
    id: 'xcode',
    name: 'Xcode',
    kind: 'ship',
    title: 'Test on device',
    blurb: 'Build to a real iPhone and feel the timing a simulator lies about.',
    human: 'The felt-sense pass: what is a hair too slow, what breaks the spell.',
    Logo: XcodeLogo,
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

export function WorkflowFlow() {
  const [open, setOpen] = useState<number | null>(null)
  const last = STEPS.length - 1

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-eyebrow">Interactive · the workflow</span>
        <p className="wf-tagline">
          One director, many tools. Hover a logo to see the step it owns — and where
          AI is doing the labor.
        </p>
      </div>

      <div className="wf-rail">
        {STEPS.map((s, i) => {
          const align = i === 0 ? 'start' : i === last ? 'end' : 'center'
          return (
            <Fragment key={s.id}>
              <div
                className="wf-step"
                data-kind={s.kind}
                data-align={align}
                data-open={open === i}
              >
                <button
                  type="button"
                  className="wf-logo-btn"
                  aria-label={`${s.name}: ${s.title}`}
                  aria-expanded={open === i}
                  onClick={() => setOpen((o) => (o === i ? null : i))}
                  onFocus={() => setOpen(i)}
                  onBlur={() => setOpen((o) => (o === i ? null : o))}
                >
                  <span className="wf-logo">
                    <s.Logo />
                  </span>
                  <span className="wf-step-meta">
                    <span className="wf-num">{pad(i + 1)}</span>
                    <span className="wf-name">{s.name}</span>
                  </span>
                </button>

                <div className="wf-pop" role="group" aria-label={s.title}>
                  <span className="wf-pop-tool">
                    {s.name}
                    {s.parallel && <em className="wf-parallel"> · parallel</em>}
                  </span>
                  <h4 className="wf-pop-title">{s.title}</h4>
                  <p className="wf-pop-blurb">{s.blurb}</p>
                  <div className="wf-split" data-solo={!s.machine}>
                    <div className="wf-split-cell wf-split-human">
                      <span className="wf-split-label">I own</span>
                      <p>{s.human}</p>
                    </div>
                    {s.machine && (
                      <div className="wf-split-cell wf-split-machine">
                        <span className="wf-split-label">{s.machineLabel}</span>
                        <p>{s.machine}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {i < last && (
                <span className="wf-arrow" aria-hidden="true">
                  <svg viewBox="0 0 22 8" width="22" height="8">
                    <path
                      d="M0 4h19M15 1l4 3-4 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
