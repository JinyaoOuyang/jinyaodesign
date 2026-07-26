// Generates lib/aboutFaceCloud.ts — a typographic portrait where words trace
// the tonal structure of the About sketch (hair dense/dark, skin open, the
// features drawn by darker word runs), in the style of classic word-portraits.
//
// Source: /tmp/portrait-clean.png (RGBA re-encode of public/about-portrait.png;
// regenerate via `sips -s format png public/about-portrait.png --out /tmp/portrait-clean.png`).
// Run: node scripts/generate-about-face.mjs

import fs from 'node:fs'
import zlib from 'node:zlib'

// ---------- minimal PNG decode (non-interlaced RGBA) ----------
function decodePNG(buf) {
  let pos = 8
  const idat = []
  let w = 0
  let h = 0
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.slice(pos + 4, pos + 8).toString()
    const data = buf.slice(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
    }
    if (type === 'IDAT') idat.push(data)
    if (type === 'IEND') break
    pos += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const st = w * 4
  const o = Buffer.alloc(h * st)
  let p = 0
  for (let y = 0; y < h; y++) {
    const f = raw[p++]
    for (let x = 0; x < st; x++) {
      const cur = raw[p++]
      const a = x >= 4 ? o[y * st + x - 4] : 0
      const b = y > 0 ? o[(y - 1) * st + x] : 0
      const c = x >= 4 && y > 0 ? o[(y - 1) * st + x - 4] : 0
      let v
      if (f === 0) v = cur
      else if (f === 1) v = cur + a
      else if (f === 2) v = cur + b
      else if (f === 3) v = cur + ((a + b) >> 1)
      else {
        const pa = Math.abs(b - c)
        const pb = Math.abs(a - c)
        const pc = Math.abs(a + b - 2 * c)
        v = cur + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
      }
      o[y * st + x] = v & 255
    }
  }
  return { w, h, o, st }
}

const { w, h, o, st } = decodePNG(fs.readFileSync('/tmp/portrait-clean.png'))

// Ink density 0..1 at a pixel — transparent and colored (baked text) pixels count as 0.
function ink(x, y) {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0
  const i = y * st + x * 4
  const a = o[i + 3]
  if (a < 60) return 0
  const r = o[i]
  const g = o[i + 1]
  const b = o[i + 2]
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (sat > 42) return 0
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  return lum < 205 ? (205 - lum) / 205 : 0
}

// Figure bbox (left 46% of the art excludes the baked title text on the right)
let minX = w
let maxX = 0
let minY = h
let maxY = 0
for (let y = 0; y < h; y += 2)
  for (let x = 0; x < Math.floor(w * 0.46); x++) {
    if (ink(x, y) > 0.05) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

const SRC_W = maxX - minX
const SRC_H = maxY - minY
const ASPECT = SRC_W / SRC_H

// ---------- virtual layout canvas ----------
const W = 560
const H = Math.round(W / ASPECT)
const PITCH = 13 // row pitch px
const ROWS = Math.floor(H / PITCH)

// avg ink over a virtual-canvas rect
function tone(x0, x1, y0, y1) {
  const sx0 = minX + (x0 / W) * SRC_W
  const sx1 = minX + (x1 / W) * SRC_W
  const sy0 = minY + (y0 / H) * SRC_H
  const sy1 = minY + (y1 / H) * SRC_H
  let s = 0
  let n = 0
  const vals = []
  const stepX = Math.max(1, Math.floor((sx1 - sx0) / 14))
  const stepY = Math.max(1, Math.floor((sy1 - sy0) / 8))
  for (let y = sy0; y < sy1; y += stepY)
    for (let x = sx0; x < sx1; x += stepX) {
      const v = ink(Math.floor(x), Math.floor(y))
      s += v
      vals.push(v)
      n++
    }
  if (!n) return 0
  vals.sort((a, b) => a - b)
  const p90 = vals[Math.min(vals.length - 1, Math.floor(vals.length * 0.9))]
  const avg = s / n
  return Math.max(avg, p90 * 0.72)
}

// ---------- vocabulary ----------
const KEY = [
  { w: 'FLEXI-CASA', c: 'c1' },
  { w: 'Design Engineer', c: 'c1' },
  { w: 'Trail', c: 'c2' },
  { w: 'AI-Native', c: 'c1' },
  { w: 'Growth & Tooling', c: 'c2' },
  { w: 'University of Washington', c: 'c2' },
  { w: 'Imagine Cup', c: 'c3' },
  { w: 'TEAGUE', c: 'c3' },
  { w: 'Silkroad', c: 'c3' },
  { w: 'Grand Rapids', c: 'c2' },
  { w: 'Medium', c: 'c3' },
  { w: 'Mandarin & English', c: 'c3' },
  { w: 'Strength Training', c: 'c3' },
  { w: 'Cursor & Claude', c: 'c2' },
]

const FILLER = [
  'Product Strategy', 'System Architecture', 'Conversion Funnel', 'Experimentation',
  'Shopify', 'Next.js', 'Amazon', 'Etsy', 'Ownership', 'Craft', 'Ship Fast',
  'Judgment Over Process', 'Consumer AI', 'Prototyping', 'Design Systems',
  'Interaction Design', 'UX Research', 'Figma', 'Framer', 'Supabase', 'TypeScript',
  'React', 'HCI', 'Regional Champion', 'Job Search Copilot', 'Full Stack',
  'Multi-Channel DTC', 'Solo Build', 'Four Days', 'Pixel to Production',
  'WebVR', 'Automotive UX', 'Enterprise SaaS', 'Willing to Relocate', 'H-1B Ready',
  'PM', 'AI', 'UX', 'Ship', 'Build', 'Design', 'Systems', 'Product', 'Growth',
  'Taste', 'Judgment', 'Solo', 'Craft', 'Notion', 'Cursor', 'Claude', 'Blender',
]

// text width estimate (Inter-ish metrics), px at given font size
function textW(t, size) {
  let u = 0
  for (const ch of t) {
    if (ch === ' ') u += 0.3
    else if (ch === '.') u += 0.3
    else if (ch === '-') u += 0.42
    else if (ch === '&') u += 0.72
    else if (/[A-Z0-9]/.test(ch)) u += 0.68
    else u += 0.54
  }
  return u * size
}

// tone level → filler style
function fillerStyle(t) {
  if (t < 0.26) return { s: 7.5, l: 1 }
  if (t < 0.42) return { s: 9, l: 2 }
  if (t < 0.60) return { s: 11, l: 3 }
  if (t < 0.78) return { s: 13.5, l: 4 }
  return { s: 16, l: 5 }
}

const KEY_SIZE = { c1: 18, c2: 16, c3: 14.5 }

// ---------- row-run packing ----------
const CUTOFF = 0.16
const SLICE = 4
const placed = [] // {t, x, y, s, l | k}
let keyIdx = 0
let lastKeyRow = -9
let fillerIdx = 0

// fillers sorted by length for gap best-fit
const byLen = [...new Set(FILLER)].sort((a, b) => textW(a, 10) - textW(b, 10))

function nextFiller(maxWpx, size) {
  // prefer stream order, fall back to best-fit shorter word
  for (let tries = 0; tries < FILLER.length; tries++) {
    const cand = FILLER[(fillerIdx + tries) % FILLER.length]
    if (textW(cand, size) <= maxWpx) {
      fillerIdx = (fillerIdx + tries + 1) % FILLER.length
      return cand
    }
  }
  for (let i = byLen.length - 1; i >= 0; i--) {
    if (textW(byLen[i], size) <= maxWpx) return byLen[i]
  }
  return null
}

for (let r = 0; r < ROWS; r++) {
  const y0 = r * PITCH
  const y1 = y0 + PITCH
  // slice tones across the row
  const nSlices = Math.floor(W / SLICE)
  const tones = []
  for (let i = 0; i < nSlices; i++) {
    tones.push(tone(i * SLICE, (i + 1) * SLICE, y0, y1))
  }
  // runs of tone ≥ CUTOFF, closing gaps < 2 slices
  const runs = []
  let start = -1
  let gap = 0
  for (let i = 0; i <= nSlices; i++) {
    const on = i < nSlices && tones[i] >= CUTOFF
    if (on) {
      if (start < 0) start = i
      gap = 0
    } else if (start >= 0) {
      if (i < nSlices && gap < 2) {
        gap++
        continue
      }
      runs.push([start * SLICE, (i - gap) * SLICE])
      start = -1
      gap = 0
    }
  }
  // pack words into runs
  for (const [rx0, rx1] of runs) {
    let x = rx0
    while (x < rx1 - 14) {
      const remain = rx1 - x
      // try a key word first: needs room + solid tone under it
      if (keyIdx < KEY.length && r - lastKeyRow >= 3) {
        const kw = KEY[keyIdx]
        const kwW = textW(kw.w, KEY_SIZE[kw.c])
        if (kwW <= remain) {
          const t = tone(x, x + kwW, y0, y1)
          if (t >= 0.34) {
            placed.push({ t: kw.w, x, y: y0, s: KEY_SIZE[kw.c], k: keyIdx, c: kw.c })
            x += kwW + 12
            keyIdx++
            lastKeyRow = r
            continue
          }
        }
      }
      // filler sized/colored by local tone
      const probe = tone(x, Math.min(x + 60, rx1), y0, y1)
      const st = fillerStyle(probe)
      const word = nextFiller(remain - 4, st.s)
      if (!word) break
      const ww = textW(word, st.s)
      const t = tone(x, x + ww, y0, y1)
      const st2 = fillerStyle(t)
      placed.push({ t: word, x, y: y0, s: st2.s, l: st2.l })
      x += ww + 11
    }
  }
}

// key words that never found a slot: force into the densest remaining rows
while (keyIdx < KEY.length) {
  const kw = KEY[keyIdx]
  placed.push({ t: kw.w, x: 40, y: (ROWS - 2 - (KEY.length - keyIdx)) * PITCH, s: KEY_SIZE[kw.c], k: keyIdx, c: kw.c })
  keyIdx++
}

const out = placed.map((p) => ({
  t: p.t,
  x: +((p.x / W) * 100).toFixed(2),
  y: +((p.y / H) * 100).toFixed(2),
  s: +((p.s / W) * 100).toFixed(3), // font-size as % of container width (cqw)
  ...(p.k !== undefined ? { k: p.k, c: p.c } : { l: p.l }),
}))

const ts = `// Auto-generated by scripts/generate-about-face.mjs — do not edit by hand.
// A typographic portrait: words trace the sketch's tonal structure.
export type FaceWord = {
  t: string
  x: number
  y: number
  s: number
  l?: number
  k?: number
  c?: 'c1' | 'c2' | 'c3'
}
export const ABOUT_FACE_ASPECT = ${ASPECT.toFixed(4)}
export const ABOUT_FACE_WORDS: FaceWord[] = ${JSON.stringify(out)}
`
fs.writeFileSync('lib/aboutFaceCloud.ts', ts)
console.log('words placed:', out.length, '| keys:', out.filter((p) => p.k !== undefined).length, '| aspect:', ASPECT.toFixed(4))

// ---------- debug render: rect per word, colored by level ----------
const CRC = (() => {
  const t = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
function crc32(b) {
  let c = 0xffffffff
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8)
  return c ^ 0xffffffff
}
function encPNG(pw, ph, rgba) {
  const stw = pw * 4
  const raw = Buffer.alloc(ph * (stw + 1))
  for (let y = 0; y < ph; y++) rgba.copy(raw, y * (stw + 1) + 1, y * stw, y * stw + stw)
  const idat = zlib.deflateSync(raw, { level: 9 })
  function chunk(type, data) {
    const b = Buffer.alloc(12 + data.length)
    b.writeUInt32BE(data.length, 0)
    b.write(type, 4)
    data.copy(b, 8)
    b.writeUInt32BE(crc32(b.slice(4, 8 + data.length)) >>> 0, 8 + data.length)
    return b
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(pw, 0)
  ihdr.writeUInt32BE(ph, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
const LEVELS = {
  1: [201, 194, 217],
  2: [168, 157, 194],
  3: [111, 98, 150],
  4: [61, 49, 99],
  5: [26, 16, 51],
}
const KEYCOL = { c1: [26, 16, 51], c2: [109, 76, 255], c3: [245, 158, 11] }
const dbg = Buffer.alloc(W * H * 4)
for (let i = 0; i < W * H; i++) {
  dbg[i * 4] = 245
  dbg[i * 4 + 1] = 243
  dbg[i * 4 + 2] = 238
  dbg[i * 4 + 3] = 255
}
for (const p of placed) {
  const col = p.k !== undefined ? KEYCOL[p.c] : LEVELS[p.l]
  const ww = Math.min(W - 1, p.x + textW(p.t, p.s))
  for (let y = Math.floor(p.y + 2); y < Math.min(H, p.y + p.s); y++)
    for (let x = Math.floor(p.x); x < ww; x++) {
      const i = (y * W + x) * 4
      dbg[i] = col[0]
      dbg[i + 1] = col[1]
      dbg[i + 2] = col[2]
    }
}
fs.writeFileSync('/tmp/face-cloud-debug.png', encPNG(W, H, dbg))
console.log('debug: /tmp/face-cloud-debug.png')
