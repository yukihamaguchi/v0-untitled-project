export const FRAMES = [
  {
    value: "none",
    label: "フレームなし",
    points: 0,
    image: null,
  },
] as const

export const STAMPS = [
  { id: "none", image: null, label: "支援しない", points: 0 },
  { id: "ume", image: "/images/ume-plum.png", label: "梅", points: 3000 },
  { id: "take", image: "/images/take-bamboo.png", label: "竹", points: 5000 },
  { id: "matsu", image: "/images/matsu-pine.png", label: "松", points: 10000 },
] as const

export type FrameValue = (typeof FRAMES)[number]["value"]
export type StampId = (typeof STAMPS)[number]["id"]
export type StampImage = (typeof STAMPS)[number]["image"]

export const MAX_MESSAGE_LENGTH = 500
