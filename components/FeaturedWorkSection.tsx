import Link from 'next/link'
import { ClayStage } from '@/components/clay/ClayStage'
import type { Work } from '@/lib/types'

interface FeaturedWorkSectionProps {
  works: Work[]
}

export function FeaturedWorkSection({ works }: FeaturedWorkSectionProps) {
  return (
    <>
      {/* Header sits in the same 64rem gutter as .clay-stage's --clay-edge. */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="section-head">
          <div>
            <div className="num">01 / Work</div>
            <h2 className="mt-2">
              Selected <em>design engineering</em> work
            </h2>
          </div>
          <Link href="/work" className="view-all">
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="-mt-2 mb-2 max-w-[560px] text-[15px] leading-[1.6] text-muted-foreground">
          Products I designed, built, and shipped end to end.
        </p>
      </div>

      {/* No Reveal wrapper — CSS filter on .reveal breaks WebGL canvas clipping. */}
      <ClayStage works={works} />
    </>
  )
}
