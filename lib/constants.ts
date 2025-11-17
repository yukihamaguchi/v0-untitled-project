export const FRAMES = [
  {
    value: "none",
    label: "フレームなし",
    points: 0,
    image: null,
  },
] as const

export const STAMPS = [
  { id: "coffee", emoji: "☕", label: "コーヒー", points: 500 },
  { id: "softcream", emoji: "🍦", label: "ソフトクリーム", points: 800 },
  { id: "melonsoda", emoji: "🍹", label: "メロンソーダ", points: 1000 },
  { id: "pancake", emoji: "🥞", label: "パンケーキ", points: 2000 },
  { id: "parfait", emoji: "🍨", label: "パフェ", points: 3000 },
] as const

export type FrameValue = (typeof FRAMES)[number]["value"]
export type StampId = (typeof STAMPS)[number]["id"]
export type StampEmoji = (typeof STAMPS)[number]["emoji"]

export const MAX_MESSAGE_LENGTH = 500
