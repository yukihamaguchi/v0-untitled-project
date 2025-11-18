import { FRAMES } from "@/lib/constants"
import type { FrameValue } from "@/lib/constants"

export function calculateStampPoints(selectedStamps: string[]): number {
  // Each stamp is 500pt, count all occurrences
  return selectedStamps.length * 500
}

export function calculateTotalPoints(selectedStamps: string[], selectedFrame: FrameValue): number {
  const stampPoints = calculateStampPoints(selectedStamps)
  const frameData = FRAMES.find((f) => f.value === selectedFrame) || FRAMES[0]
  return stampPoints + frameData.points
}
