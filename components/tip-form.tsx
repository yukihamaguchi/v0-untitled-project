"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { BanknoteIcon, SendIcon, BookOpenIcon, SparklesIcon, FrameIcon } from "lucide-react"
import { RippleButton } from "./ripple-button"
import { savePaymentInfo } from "@/utils/payment"

interface TipFormProps {
  eventId: number
  performerId: number
  performerName: string
  paypayId: string
}

const PAGE_SIZES = [
  { value: "full", label: "1ページ", description: "150文字まで", maxLength: 150 },
  { value: "half", label: "1/2ページ", description: "64文字まで", maxLength: 64 },
  { value: "quarter", label: "1/4ページ", description: "20文字まで", maxLength: 20 },
] as const

const FRAMES = [
  {
    value: "none",
    label: "フレームなし",
    points: 0,
    image: null,
  },
  {
    value: "flower",
    label: "フラワーフレーム",
    points: 500,
    image: "/images/frame-flower.png",
  },
  {
    value: "autumn",
    label: "オータムフレーム",
    points: 500,
    image: "/images/frame-autumn.png",
  },
] as const

const STAMPS = [
  { emoji: "👏", label: "拍手", points: 500 },
  { emoji: "⭐", label: "スター", points: 1000 },
  { emoji: "❤️", label: "ハート", points: 2000 },
  { emoji: "🎉", label: "クラッカー", points: 5000 },
] as const

export function TipForm({ eventId, performerId, performerName, paypayId }: TipFormProps) {
  const router = useRouter()
  const [pageSize, setPageSize] = useState<string>("full")
  const [selectedFrame, setSelectedFrame] = useState<string>("none")
  const [comment, setComment] = useState<string>("")
  const [selectedStamps, setSelectedStamps] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const stampPoints = selectedStamps.reduce((total, stampEmoji) => {
    const stamp = STAMPS.find((s) => s.emoji === stampEmoji)
    return total + (stamp?.points || 0)
  }, 0)

  const selectedFrameData = FRAMES.find((f) => f.value === selectedFrame) || FRAMES[0]
  const totalAmount = stampPoints + selectedFrameData.points
  const currentPageSize = PAGE_SIZES.find((s) => s.value === pageSize) || PAGE_SIZES[0]

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value
    setComment(newComment)
  }

  const toggleStamp = (stampEmoji: string) => {
    setSelectedStamps((prev) => {
      if (prev.includes(stampEmoji)) {
        return prev.filter((s) => s !== stampEmoji)
      } else {
        return [...prev, stampEmoji]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const paymentInfo = {
      eventId,
      performerId,
      performerName,
      amount: totalAmount.toString(),
      comment,
      pageSize,
      frameType: selectedFrame,
      framePoints: selectedFrameData.points,
      stamps: selectedStamps,
      stampPoints,
    }
    savePaymentInfo(paymentInfo)

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/events/${eventId}/performers/${performerId}/confirm`)
    }, 500)
  }

  const getFrameArea = () => {
    switch (pageSize) {
      case "full":
        return { width: "calc(100% - 48px)", height: "calc(100% - 48px)", top: "24px", left: "24px" }
      case "half":
        return { width: "calc(100% - 48px)", height: "calc(50% - 36px)", top: "24px", left: "24px" }
      case "quarter":
        return { width: "calc(50% - 36px)", height: "calc(50% - 36px)", top: "24px", left: "24px" }
      default:
        return { width: "calc(100% - 48px)", height: "calc(100% - 48px)", top: "24px", left: "24px" }
    }
  }

  const getWritableArea = () => {
    switch (pageSize) {
      case "full":
        return { width: "calc(100% - 96px)", height: "calc(100% - 96px)", top: "48px", left: "48px" }
      case "half":
        return { width: "calc(100% - 96px)", height: "calc(50% - 72px)", top: "48px", left: "48px" }
      case "quarter":
        return { width: "calc(50% - 72px)", height: "calc(50% - 72px)", top: "48px", left: "48px" }
      default:
        return { width: "calc(100% - 96px)", height: "calc(100% - 96px)", top: "48px", left: "48px" }
    }
  }

  const frameArea = getFrameArea()
  const writableArea = getWritableArea()

  return (
    <div>
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="bg-primary/5 border-b border-primary/10 py-3 px-4">
          <CardTitle className="flex items-center gap-1 text-base">
            <BookOpenIcon className="h-4 w-4 text-primary" />
            デジタルメッセージブックを送る
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-4">
            <div>
              <Label htmlFor="performer" className="text-xs font-medium">
                出演者
              </Label>
              <Input id="performer" value={performerName} disabled className="mt-1 bg-white text-sm h-9" />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">ページサイズ</Label>
              <div className="grid grid-cols-3 gap-2">
                {PAGE_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setPageSize(size.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      pageSize === size.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-white/70 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-medium">{size.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{size.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium mb-1.5 block flex items-center gap-1">
                <FrameIcon className="h-3 w-3 text-primary" />
                フレームを選択
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {FRAMES.map((frame) => (
                  <button
                    key={frame.value}
                    type="button"
                    onClick={() => setSelectedFrame(frame.value)}
                    className={`p-2.5 rounded-lg border-2 transition-all ${
                      selectedFrame === frame.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-white/70 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{frame.label}</div>
                    <div className="text-[10px] font-bold text-primary">{frame.points}pt</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block flex items-center justify-between">
                <span>メッセージを記入</span>
                <span className="text-muted-foreground">
                  {comment.length}/{currentPageSize.maxLength}文字
                </span>
              </Label>
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div
                  className="absolute inset-0 rounded-lg shadow-2xl border-2 border-gray-200"
                  style={{
                    backgroundImage: "url(/images/page-background.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Left binding effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-200/50 to-transparent"></div>

                  {selectedFrameData.image && (
                    <div
                      className="absolute pointer-events-none rounded-lg overflow-hidden transition-all duration-300 z-10"
                      style={{
                        width: frameArea.width,
                        height: frameArea.height,
                        top: frameArea.top,
                        left: frameArea.left,
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${selectedFrameData.image})`,
                          backgroundSize: "100% 100%",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="absolute border-2 border-dashed border-primary/40 bg-white rounded transition-all duration-300"
                    style={{
                      width: writableArea.width,
                      height: writableArea.height,
                      top: writableArea.top,
                      left: writableArea.left,
                    }}
                  >
                    <div className="absolute top-1 left-1 text-[10px] text-primary/60 font-medium bg-white/80 px-1 rounded">
                      記入エリア
                    </div>
                  </div>

                  <div
                    className="absolute p-3 overflow-hidden z-20"
                    style={{
                      width: writableArea.width,
                      height: writableArea.height,
                      top: writableArea.top,
                      left: writableArea.left,
                    }}
                  >
                    <Textarea
                      id="comment"
                      placeholder="応援メッセージを入力してください"
                      value={comment}
                      onChange={handleCommentChange}
                      maxLength={currentPageSize.maxLength}
                      className="w-full h-full resize-none bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed font-serif overflow-hidden"
                      style={{
                        textShadow: "0 0 1px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>

                  {selectedStamps.length > 0 && (
                    <div
                      className="absolute z-30 flex gap-1 items-center justify-center flex-wrap px-2"
                      style={{
                        width: writableArea.width,
                        left: writableArea.left,
                        bottom: `calc(100% - ${writableArea.top} - ${writableArea.height} + 8px)`,
                      }}
                    >
                      {selectedStamps.map((stampEmoji, i) => (
                        <div
                          key={i}
                          className="text-xl drop-shadow-lg animate-fade-in"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          {stampEmoji}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Page size label */}
                  <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-serif">
                    {PAGE_SIZES.find((s) => s.value === pageSize)?.label}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium mb-1.5 block flex items-center gap-1">
                <SparklesIcon className="h-3 w-3 text-primary" />
                ギフティングスタンプ
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp.emoji}
                    type="button"
                    onClick={() => toggleStamp(stamp.emoji)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      selectedStamps.includes(stamp.emoji)
                        ? "border-primary bg-primary/10 shadow-md scale-105"
                        : "border-border bg-white/70 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xl mb-0.5">{stamp.emoji}</div>
                    <div className="text-[10px] font-bold text-primary">{stamp.points}pt</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">合計ポイント</span>
                <div className="flex items-center gap-1">
                  <BanknoteIcon className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{totalAmount.toLocaleString()}pt</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-3">
            <RippleButton type="submit" className="w-full gap-1 rounded-full h-9 text-sm" disabled={isSubmitting}>
              <SendIcon className="h-3 w-3" />
              {isSubmitting ? "処理中..." : "確認画面へ"}
            </RippleButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
