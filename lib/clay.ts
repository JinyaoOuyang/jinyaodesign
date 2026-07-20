export type ClaySlug =
  | 'isleo'
  | 'trail'
  | 'listing-image-pipeline'
  | 'tesla-charging'

export type ClayAsset = {
  slug: ClaySlug
  glb: string
  /** Uniform scale after centering — tuned per export bbox. */
  scale: number
  /** Y of the soft contact shadow plane (≈ model bottom after centering). */
  shadowY: number
}

/** Bump when GLBs are re-exported so cached assets refresh. */
const CLAY_V = '?v=13'

/** GLB map for homepage Selected Work dioramas (plinth-free, pastel). */
export const clayBySlug: Record<string, ClayAsset> = {
  isleo: { slug: 'isleo', glb: `/work/clay/isleo.glb${CLAY_V}`, scale: 0.84, shadowY: -0.44 },
  trail: { slug: 'trail', glb: `/work/clay/trail.glb${CLAY_V}`, scale: 1.55, shadowY: -0.5 },
  'listing-image-pipeline': {
    slug: 'listing-image-pipeline',
    glb: `/work/clay/listing-pipeline.glb${CLAY_V}`,
    scale: 0.98,
    shadowY: -0.48,
  },
  'tesla-charging': {
    slug: 'tesla-charging',
    glb: `/work/clay/tesla-charging.glb${CLAY_V}`,
    scale: 0.92,
    shadowY: -0.62,
  },
}

export function getClayAsset(slug: string): ClayAsset | null {
  return clayBySlug[slug] ?? null
}
