import { ClayStage } from '@/components/clay/ClayStage'
import type { Work } from '@/lib/types'

interface FeaturedWorkSectionProps {
  works: Work[]
}

export function FeaturedWorkSection({ works }: FeaturedWorkSectionProps) {
  // No Reveal wrapper — CSS filter on .reveal breaks WebGL canvas clipping.
  return <ClayStage works={works} />
}
