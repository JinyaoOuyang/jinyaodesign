import { WorkGallery } from '@/components/WorkGallery'
import { Reveal } from '@/components/Reveal'
import type { Work } from '@/lib/types'

interface FeaturedWorkSectionProps {
  works: Work[]
}

export function FeaturedWorkSection({ works }: FeaturedWorkSectionProps) {
  return (
    <Reveal>
      <WorkGallery works={works} />
    </Reveal>
  )
}
