import { FRAMES, STAMPS } from "@/lib/constants"
import type { FrameValue, StampId } from "@/lib/constants"

export function calculateStampPoints(stampCart: Record<StampId, number>): number {
  let total = 0
  for (const [stampId, quantity] of Object.entries(stampCart)) {
    const stamp = STAMPS.find((s) => s.id === stampId)
    if (stamp) {
      total += stamp.points * quantity
    }
  }
  return total
}

export function calculateTotalPoints(stampCart: Record<StampId, number>, selectedFrame: FrameValue): number {
  const stampPoints = calculateStampPoints(stampCart)
  const frameData = FRAMES.find((f) => f.value === selectedFrame) || FRAMES[0]
  return stampPoints + frameData.points
}
