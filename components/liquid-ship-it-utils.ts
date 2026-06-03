export const LIQUID_TEXT = 'I ship it.'
export const HERO_BG = '#f5f3ee'

/** Extra room on the right for italic overshoot + the trailing period. */
export const LIQUID_TEXT_PAD_RIGHT = 20

export function measureLiquidTextBox(font: string, fallbackH: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return { w: 1, h: fallbackH }

  ctx.font = font
  const m = ctx.measureText(LIQUID_TEXT)
  const textW =
    (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? m.width)
  const ascent = m.actualBoundingBoxAscent ?? fallbackH * 0.8
  const descent = m.actualBoundingBoxDescent ?? fallbackH * 0.2

  return {
    w: Math.ceil(textW) + LIQUID_TEXT_PAD_RIGHT,
    h: Math.ceil(ascent + descent + 4),
  }
}

export function buildTextMask(
  text: string,
  cssW: number,
  cssH: number,
  font: string,
  dpr: number
) {
  const canvas = document.createElement('canvas')
  const w = Math.round(cssW * dpr)
  const h = Math.round(cssH * dpr)
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, w, h)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'alphabetic'
  ctx.font = font
  ctx.fillText(text, 0, cssH * 0.8)

  return canvas.toDataURL('image/png')
}
