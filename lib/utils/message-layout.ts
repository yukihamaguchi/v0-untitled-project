import type { PageSizeValue } from "@/lib/constants"

interface LayoutArea {
  width: string
  height: string
  top: string
  left: string
}

export function getWritableArea(pageSize: PageSizeValue): LayoutArea {
  switch (pageSize) {
    case "sixteenth":
      // 4×4グリッドの左上の正方形（25%幅、25%高さ）
      return {
        width: "calc(25% - 32px)",
        height: "calc(25% - 32px)",
        top: "32px",
        left: "32px",
      }
    case "quarter":
      // 2×2グリッドの左上の正方形（50%幅、50%高さ）
      return {
        width: "calc(50% - 48px)",
        height: "calc(50% - 48px)",
        top: "32px",
        left: "32px",
      }
    case "full":
      // 正方形全体
      return {
        width: "calc(100% - 64px)",
        height: "calc(100% - 64px)",
        top: "32px",
        left: "32px",
      }
    default:
      return {
        width: "calc(100% - 64px)",
        height: "calc(100% - 64px)",
        top: "32px",
        left: "32px",
      }
  }
}

export function getFrameArea(pageSize: PageSizeValue): LayoutArea {
  switch (pageSize) {
    case "sixteenth":
      // 4×4グリッドの左上の正方形用フレーム
      return {
        width: "calc(25% - 24px)",
        height: "calc(25% - 24px)",
        top: "24px",
        left: "24px",
      }
    case "quarter":
      // 2×2グリッドの左上の正方形用フレーム
      return {
        width: "calc(50% - 36px)",
        height: "calc(50% - 36px)",
        top: "24px",
        left: "24px",
      }
    case "full":
      // 正方形全体用フレーム
      return {
        width: "calc(100% - 48px)",
        height: "calc(100% - 48px)",
        top: "24px",
        left: "24px",
      }
    default:
      return {
        width: "calc(100% - 48px)",
        height: "calc(100% - 48px)",
        top: "24px",
        left: "24px",
      }
  }
}
