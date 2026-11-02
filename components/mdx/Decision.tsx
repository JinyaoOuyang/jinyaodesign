'use client'

import { useState } from 'react'
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'

interface DecisionSide {
  label: string
  text: string
}

interface DecisionProps {
  ai: DecisionSide
  human: DecisionSide
}

const MIN_PCT = 22
const MAX_PCT = 78
const STEP = 4

/** Draggable AI / human comparison split — visitor resizes the two panes. */
export function Decision({ ai, human }: DecisionProps) {
  const [pct, setPct] = useState(50)

  const onHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const root = e.currentTarget.parentElement as HTMLElement
    e.currentTarget.setPointerCapture(e.pointerId)

    const move = (ev: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      const next = ((ev.clientX - rect.left) / rect.width) * 100
      setPct(Math.min(MAX_PCT, Math.max(MIN_PCT, next)))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const onHandleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setPct((p) => Math.max(MIN_PCT, p - STEP))
    if (e.key === 'ArrowRight') setPct((p) => Math.min(MAX_PCT, p + STEP))
  }

  return (
    <div
      className="decision-split"
      role="note"
      style={{ gridTemplateColumns: `${pct}% 22px 1fr` }}
    >
      <div className="decision-side decision-ai">
        <span className="decision-label">{ai.label}</span>
        <p>{ai.text}</p>
      </div>

      <div
        className="decision-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare AI and human ownership"
        aria-valuemin={MIN_PCT}
        aria-valuemax={MAX_PCT}
        aria-valuenow={Math.round(pct)}
        onPointerDown={onHandlePointerDown}
        onKeyDown={onHandleKeyDown}
      >
        <span className="decision-handle-grip" aria-hidden="true" />
      </div>

      <div className="decision-side decision-human">
        <span className="decision-label">{human.label}</span>
        <p>{human.text}</p>
      </div>

      <span className="decision-hint" aria-hidden="true">
        ↔ drag
      </span>
    </div>
  )
}
