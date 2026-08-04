export interface TocHeading {
  title: string
  slug: string
  index: number // 1-based
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extract level-2 (`## …`) headings from an MDX source string, ignoring
 * any occurrences inside fenced code blocks. Returns ordered TOC items
 * with 1-based index.
 */
export function extractHeadings(source: string): TocHeading[] {
  const lines = source.split(/\r?\n/)
  const out: TocHeading[] = []
  let inFence = false
  let fenceMarker: string | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[1]
      if (!inFence) {
        inFence = true
        fenceMarker = marker
      } else if (fenceMarker && trimmed.startsWith(fenceMarker)) {
        inFence = false
        fenceMarker = null
      }
      continue
    }
    if (inFence) continue

    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (m) {
      const title = m[1].trim()
      out.push({
        title,
        slug: slugify(title),
        index: out.length + 1,
      })
    }
  }
  return out
}
