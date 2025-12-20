import type { PageSizeValue } from "@/lib/constants"

interface LayoutArea {
  width: string
  height: string
  top: string
  left: string
}

export function getWritableArea(): LayoutArea {
  return {
    width: "calc(100% - 64px)",
    height: "calc(100% - 64px)",
    top: "32px",
    left: "32px",
  }
}
