'use client'

import { Component, type ReactNode } from 'react'

/** Keep asset or WebGL failures local to an optional 3D illustration. */
export class ClayErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
