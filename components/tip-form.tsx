"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { BanknoteIcon, SendIcon, BookOpenIcon, SparklesIcon, UserIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { RippleButton } from "./ripple-button"
import { savePaymentInfo } from "@/utils/payment"
import { STAMPS, MAX_MESSAGE_LENGTH } from "@/lib/constants"
import { calculateTotalPoints } from "@/lib/utils/points"
import type { StampId } from "@/lib/constants"

interface TipFormProps {
  eventId: number
  performerId: number
  performerName: string
  paypayId: string
}

export function TipForm({ eventId, performerId, performerName, paypayId }: TipFormProps) {
  const router = useRouter()
  const [selectedFrame, setSelectedFrame] = useState<"none" | "with">("none")
  const [comment, setComment] = useState<string>("")
  const [stampCart, setStampCart] = useState<Record<StampId, number>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [senderName, setSenderName] = useState<string>("")
  const [senderAvatar] = useState<string>("/images/default-avatar.jpg")

  const framePoints = selectedFrame === "with" ? 500 : 0
  const stampPoints = Object.entries(stampCart).reduce((sum, [stampId, qty]) => {
    const stamp = STAMPS.find(s => s.id === stampId)
    return sum + (stamp ? stamp.points * qty : 0)
  }, 0)
  const totalAmount = stampPoints + framePoints

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= MAX_MESSAGE_LENGTH) {
      setComment(newValue)
    }
  }

  const handleStampClick = (stampId: StampId) => {
    setStampCart(prev => {
      if (!prev[stampId]) {
        return { ...prev, [stampId]: 1 }
      }
      return prev
    })
  }

  const updateStampQuantity = (stampId: StampId, change: number) => {
    setStampCart(prev => {
      const currentQty = prev[stampId] || 0
      const newQty = Math.max(0, currentQty + change)
      
      if (newQty === 0) {
        const { [stampId]: _, ...rest } = prev
        return rest
      }
      
      return { ...prev, [stampId]: newQty }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedStamps: string[] = []
    for (const [stampId, quantity] of Object.entries(stampCart)) {
      const stamp = STAMPS.find((s) => s.id === stampId)
      if (stamp) {
        for (let i = 0; i < quantity; i++) {
          selectedStamps.push(stamp.emoji)
        }
      }
    }

    const paymentInfo = {
      eventId,
      performerId,
      performerName,
      amount: totalAmount.toString(),
      comment,
      frameType: selectedFrame,
      framePoints: framePoints,
      stamps: selectedStamps,
      stampPoints: stampPoints,
      senderName,
      senderAvatar,
      stampCart,
    }
    savePaymentInfo(paymentInfo)

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/events/${eventId}/performers/${performerId}/confirm`)
    }, 500)
  }

  const totalItems = Object.values(stampCart).reduce((sum, qty) => sum + qty, 0)

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
              <Label htmlFor="comment" className="text-sm font-semibold mb-2 block flex items-center justify-between">
                <span>メッセージを記入</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {comment.length}/{MAX_MESSAGE_LENGTH}文字
                </span>
              </Label>
              <Textarea
                id="comment"
                placeholder="応援メッセージを入力してください"
                value={comment}
                onChange={handleCommentChange}
                maxLength={MAX_MESSAGE_LENGTH}
                className="w-full min-h-[160px] resize-none bg-white border-2 border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-base leading-relaxed p-3 rounded-lg"
                rows={8}
              />
            </div>

            <div className="border-t pt-3">
              <Label className="text-[10px] font-normal mb-2 block flex items-center gap-1 text-muted-foreground">
                <SparklesIcon className="h-2.5 w-2.5" />
                スタンプ購入で応援（任意）
              </Label>
              <div className="flex flex-col gap-2">
                {STAMPS.map((stamp) => {
                  const quantity = stampCart[stamp.id] || 0
                  const isSelected = quantity > 0
                  return (
                    <div
                      key={stamp.id}
                      onClick={() => !isSelected && handleStampClick(stamp.id)}
                      className={`
                        relative rounded-lg border p-2.5 transition-all cursor-pointer
                        ${isSelected 
                          ? "bg-primary/5 border-primary/50 shadow-sm" 
                          : "bg-muted/20 border-border/50 hover:border-primary/30 hover:bg-muted/30"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{stamp.emoji}</span>
                          <div>
                            <div className="text-sm font-medium">{stamp.label}</div>
                            <div className="text-xs text-muted-foreground">{stamp.points.toLocaleString()}円</div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStampQuantity(stamp.id, -1)
                              }}
                              className="w-6 h-6 rounded-full border border-primary bg-white hover:bg-primary/10 flex items-center justify-center transition-colors"
                              aria-label="減らす"
                            >
                              <MinusIcon className="h-3 w-3 text-primary" />
                            </button>
                            <span className="text-sm font-semibold min-w-[1.5rem] text-center text-primary">{quantity}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStampQuantity(stamp.id, 1)
                              }}
                              className="w-6 h-6 rounded-full border border-primary bg-white hover:bg-primary/10 flex items-center justify-center transition-colors"
                              aria-label="増やす"
                            >
                              <PlusIcon className="h-3 w-3 text-primary" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t pt-3">
              <Label className="text-xs font-medium mb-2 block">
                フレームを購入して主催者を応援
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFrame("none")}
                  className={`
                    flex-1 rounded-lg border p-3 transition-all
                    ${selectedFrame === "none"
                      ? "bg-primary/5 border-primary/50 shadow-sm"
                      : "bg-muted/20 border-border/50 hover:border-primary/30"
                    }
                  `}
                >
                  <div className="text-sm font-medium">なし</div>
                  <div className="text-xs text-muted-foreground">0円</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFrame("with")}
                  className={`
                    flex-1 rounded-lg border p-3 transition-all
                    ${selectedFrame === "with"
                      ? "bg-primary/5 border-primary/50 shadow-sm"
                      : "bg-muted/20 border-border/50 hover:border-primary/30"
                    }
                  `}
                >
                  <div className="text-sm font-medium">あり</div>
                  <div className="text-xs text-muted-foreground">500円</div>
                </button>
              </div>
            </div>

            {(totalItems > 0 || selectedFrame === "with") && (
              <div className="bg-primary/5 px-2 py-1.5 rounded border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">合計</span>
                  <div className="flex items-center gap-1">
                    <BanknoteIcon className="h-3 w-3 text-primary" />
                    <span className="text-sm font-bold text-primary">{totalAmount.toLocaleString()}円</span>
                  </div>
                </div>
              </div>
            )}
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
