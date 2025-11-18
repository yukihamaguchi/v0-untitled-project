"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { BanknoteIcon, SendIcon, BookOpenIcon, SparklesIcon, UserIcon } from "lucide-react"
import { RippleButton } from "./ripple-button"
import { savePaymentInfo } from "@/utils/payment"
import { PAGE_SIZES, FRAMES } from "@/lib/constants"
import { calculateTotalPoints } from "@/lib/utils/points"
import { getWritableArea } from "@/lib/utils/message-layout"

interface TipFormProps {
  eventId: number
  performerId: number
  performerName: string
  paypayId: string
}

export function TipForm({ eventId, performerId, performerName, paypayId }: TipFormProps) {
  const router = useRouter()
  const [pageSize, setPageSize] = useState<string>("sixteenth")
  const [selectedFrame, setSelectedFrame] = useState<string>("none")
  const [comment, setComment] = useState<string>("")
  const [selectedStamps, setSelectedStamps] = useState<string[]>([])
  const [stampQuantity, setStampQuantity] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [senderName, setSenderName] = useState<string>("")
  const [senderAvatar, setSenderAvatar] = useState<string>("/images/default-avatar.jpg")
  const [animatingStars, setAnimatingStars] = useState<number[]>([])

  const totalAmount = calculateTotalPoints(selectedStamps, selectedFrame as any)
  const selectedFrameData = FRAMES.find((f) => f.value === selectedFrame) || FRAMES[0]
  const currentPageSize = PAGE_SIZES.find((s) => s.value === pageSize) || PAGE_SIZES[0]

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= currentPageSize.maxLength) {
      setComment(newValue)
    }
  }

  const handleStampQuantityChange = (change: number) => {
    const newQuantity = Math.max(0, stampQuantity + change)
    setStampQuantity(newQuantity)
    setSelectedStamps(Array(newQuantity).fill("⭐"))

    if (change > 0) {
      const newStarIndices = Array.from({ length: change }, (_, i) => stampQuantity + i)
      setAnimatingStars(newStarIndices)
      setTimeout(() => setAnimatingStars([]), 600)
    }
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
      stampPoints: totalAmount - selectedFrameData.points,
      senderName,
      senderAvatar,
    }
    savePaymentInfo(paymentInfo)

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/events/${eventId}/performers/${performerId}/confirm`)
    }, 500)
  }

  const writableArea = getWritableArea(pageSize as any)

  const PageSizeIcon = ({ size }: { size: string }) => {
    if (size === "full") {
      return <div className="w-10 h-10 mx-auto mb-1.5 border-2 border-current rounded"></div>
    } else if (size === "quarter") {
      return (
        <div className="w-10 h-10 mx-auto mb-1.5 grid grid-cols-2 grid-rows-2 gap-0.5 border-2 border-current rounded p-0.5">
          <div className="bg-current"></div>
          <div className="border border-current/30"></div>
          <div className="border border-current/30"></div>
          <div className="border border-current/30"></div>
        </div>
      )
    } else {
      return (
        <div className="w-10 h-10 mx-auto mb-1.5 grid grid-cols-4 grid-rows-4 gap-0.5 border-2 border-current rounded p-0.5">
          <div className="bg-current"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
          <div className="border border-current/20"></div>
        </div>
      )
    }
  }

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
              <Label htmlFor="senderName" className="text-xs font-medium flex items-center gap-1">
                <UserIcon className="h-3 w-3 text-primary" />
                送り主の名前
              </Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="例: TOSHIYA"
                className="mt-1 bg-white text-sm h-9"
                maxLength={20}
              />
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
                        ? "border-primary bg-primary/10 shadow-md text-primary"
                        : "border-border bg-white/70 hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <PageSizeIcon size={size.value} />
                    <div className="text-xs font-medium mb-0.5">{size.label}</div>
                    <div className="text-[10px]">{size.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment" className="text-xs font-medium mb-2 block flex items-center justify-between">
                <span>メッセージを記入</span>
                <span className="text-muted-foreground">
                  {comment.length}/{currentPageSize.maxLength}文字
                </span>
              </Label>
              <Textarea
                id="comment"
                placeholder="応援メッセージを入力してください"
                value={comment}
                onChange={handleCommentChange}
                maxLength={currentPageSize.maxLength}
                className="w-full min-h-[120px] resize-none bg-white border-2 border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-base leading-relaxed p-3 rounded-lg"
                rows={6}
              />
            </div>

            <div>
              <Label className="text-xs font-medium mb-1.5 block flex items-center gap-1">
                <SparklesIcon className="h-3 w-3 text-primary" />
                スタンプ購入で貢献
              </Label>
              <div className="bg-white/70 border-2 border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div className="text-xs text-muted-foreground">500pt / 個</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStampQuantityChange(-1)}
                      disabled={stampQuantity === 0}
                      className="w-8 h-8 rounded-full border-2 border-primary bg-white hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-primary transition-all"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold min-w-[2rem] text-center">{stampQuantity}</span>
                    <button
                      type="button"
                      onClick={() => handleStampQuantityChange(1)}
                      className="w-8 h-8 rounded-full border-2 border-primary bg-white hover:bg-primary/10 flex items-center justify-center font-bold text-primary transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                {stampQuantity > 0 && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                      {Array.from({ length: stampQuantity }).map((_, index) => (
                        <span
                          key={index}
                          className={`text-2xl inline-block ${animatingStars.includes(index) ? "animate-pop-in" : ""}`}
                          style={{
                            animationDelay: animatingStars.includes(index)
                              ? `${(index - (stampQuantity - animatingStars.length)) * 100}ms`
                              : "0ms",
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-primary text-center">
                      合計: {(stampQuantity * 500).toLocaleString()}pt
                    </div>
                  </div>
                )}
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
