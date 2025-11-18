export const PAGE_SIZES = [
  { value: "sixteenth", label: "1/16ページ", description: "40文字まで", maxLength: 40 },
  { value: "quarter", label: "1/4ページ", description: "200文字まで", maxLength: 200 },
  { value: "full", label: "1ページ", description: "1000文字まで", maxLength: 1000 },
] as const

export const FRAMES = [
  {
    value: "none",
    label: "フレームなし",
    points: 0,
    image: null,
  },
] as const

export const STAMPS = [{ emoji: "⭐", points: 500 }] as const

export type PageSizeValue = (typeof PAGE_SIZES)[number]["value"]
export type FrameValue = (typeof FRAMES)[number]["value"]
export type StampEmoji = (typeof STAMPS)[number]["emoji"]
