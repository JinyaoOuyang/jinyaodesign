import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Jinyao Ouyang — I design it. I build it. I ship it.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const HERO_BG = '#f5f3ee'
const INK = '#1a1535'
const PURPLE = '#a78bfa'

export default async function Image() {
  const [playfairBold, playfairItalic] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.ttf'
    ).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFnD-vYSZviVYUb_rj3ij__anPXDzMezMBO5YQ.ttf'
    ).then((res) => res.arrayBuffer()),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: HERO_BG,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orbital decoration — right side */}
        <svg
          width="720"
          height="630"
          viewBox="0 0 720 630"
          style={{ position: 'absolute', right: 0, top: 0 }}
        >
          <defs>
            <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="orbitMask">
              <rect x="0" y="0" width="720" height="630" fill="url(#fade)" />
            </mask>
          </defs>
          <g mask="url(#orbitMask)" opacity="0.9">
            <ellipse
              cx="360"
              cy="300"
              rx="300"
              ry="120"
              fill="none"
              stroke={INK}
              strokeWidth="1"
              opacity="0.12"
              transform="rotate(-20 360 300)"
            />
            <ellipse
              cx="380"
              cy="310"
              rx="220"
              ry="88"
              fill="none"
              stroke={INK}
              strokeWidth="1"
              opacity="0.12"
              transform="rotate(15 380 310)"
            />
            <ellipse
              cx="340"
              cy="290"
              rx="350"
              ry="72"
              fill="none"
              stroke={INK}
              strokeWidth="1"
              opacity="0.12"
              transform="rotate(-45 340 290)"
            />
            <path
              d="M 520 180 L 526 192 L 538 198 L 526 204 L 520 216 L 514 204 L 502 198 L 514 192 Z"
              fill={PURPLE}
              opacity="0.65"
            />
            <path
              d="M 620 420 L 624 428 L 632 432 L 624 436 L 620 444 L 616 436 L 608 432 L 616 428 Z"
              fill={INK}
              opacity="0.4"
            />
            <path
              d="M 480 80 L 483 86 L 489 89 L 483 92 L 480 98 L 477 92 L 471 89 L 477 86 Z"
              fill={INK}
              opacity="0.35"
            />
          </g>
        </svg>

        {/* Hero copy */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 72px 72px',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: INK,
            }}
          >
            I design it.
          </div>
          <div
            style={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: INK,
            }}
          >
            I build it.
          </div>
          <div
            style={{
              fontFamily: 'Playfair Display',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: PURPLE,
            }}
          >
            I ship it.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfairBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Playfair Display',
          data: playfairItalic,
          weight: 400,
          style: 'italic',
        },
      ],
    }
  )
}
