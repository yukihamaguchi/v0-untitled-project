"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SparklesIcon, UserIcon, ShoppingCartIcon } from 'lucide-react'
import Image from "next/image"
import type { Recipient } from "@/types/recipient"
import type { RecipientMessage } from "@/types/message"
import { STAMPS, MAX_MESSAGE_LENGTH } from "@/lib/constants"
import { calculateTotalPoints } from "@/lib/utils/points"
import type { StampId } from "@/lib/constants"

interface RecipientMessageFormProps {
  recipient: Recipient
  onChange: (message: RecipientMessage) => void
  defaultSenderName?: string
  defaultSenderAvatar?: string
}

export function RecipientMessageForm({
  recipient,
  onChange,
  defaultSenderName = "",
  defaultSenderAvatar = "/images/default-avatar.jpg",
}: RecipientMessageFormProps) {
  const [comment, setComment] = useState<string>("")
  const [stampCart, setStampCart] = useState<Record<StampId, number>>({})
  const [senderName, setSenderName] = useState<string>(defaultSenderName)
  const [senderAvatar] = useState<string>(defaultSenderAvatar)

  const totalPoints = calculateTotalPoints(stampCart, "none")

  useEffect(() => {
    const message: RecipientMessage = {
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientRole: recipient.role,
      recipientImage: recipient.image || "",
      selectedFrame: "none",
      comment,
      selectedStamps: [],
      stampCart,
      senderName,
      senderAvatar,
    }
    onChange(message)
  }, [
    recipient.id,
    recipient.name,
    recipient.role,
    recipient.image,
    comment,
    stampCart,
    senderName,
    senderAvatar,
  ])

  const updateStampQuantity = useCallback((stampId: StampId, change: number) => {
    setStampCart(prev => {
      const currentQty = prev[stampId] || 0
      const newQty = Math.max(0, currentQty + change)
      
      if (newQty === 0) {
        const { [stampId]: _, ...rest } = prev
        return rest
      }
      
      return { ...prev, [stampId]: newQty }
    })
  }, [])

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }, [])

  const totalItems = Object.values(stampCart).reduce((sum, qty) => sum + qty, 0)

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-3 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          {recipient.role === "organizer" ? (
            <div className="rounded-full h-8 w-8 bg-blue-500 border-2 border-primary/20 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
          ) : (
            <Image
              src={recipient.image || "/placeholder.svg"}
              alt={recipient.name}
              width={32}
              height={32}
              className="rounded-full object-cover h-8 w-8 border-2 border-primary/20"
            />
          )}
          <div className="flex-1">
            <div className="font-bold">{recipient.name}</div>
            {recipient.role === "performer" && recipient.occupation && (
              <div className="text-xs text-muted-foreground font-normal">
                {recipient.occupation}（{recipient.agency}）
              </div>
            )}
            {recipient.role === "organizer" && <div className="text-xs text-muted-foreground font-normal">主催者</div>}
          </div>
          <div className="text-sm font-bold text-primary">{totalPoints.toLocaleString()}pt</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div>
          <Label htmlFor={`senderName-${recipient.id}`} className="text-xs font-medium flex items-center gap-1">
            <UserIcon className="h-3 w-3 text-primary" />
            送り主の名前
          </Label>
          <Input
            id={`senderName-${recipient.id}`}
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="例: TOSHIYA"
            className="mt-1 bg-white text-sm h-9"
            maxLength={20}
          />
        </div>

        <div>
          <Label
            htmlFor={`comment-${recipient.id}`}
            className="text-xs font-medium mb-2 block flex items-center justify-between"
          >
            <span>メッセージを記入</span>
            <span className="text-muted-foreground">
              {comment.length}/{MAX_MESSAGE_LENGTH}文字
            </span>
          </Label>
          <Textarea
            id={`comment-${recipient.id}`}
            placeholder="応援メッセージを入力してください"
            value={comment}
            onChange={handleCommentChange}
            maxLength={MAX_MESSAGE_LENGTH}
            className="w-full min-h-[120px] resize-none bg-white border-2 border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-base leading-relaxed p-3 rounded-lg"
            rows={6}
          />
        </div>

        <div>
          <Label className="text-xs font-medium mb-2 block flex items-center gap-1">
            <SparklesIcon className="h-3 w-3 text-primary" />
            スタンプをオーダーして貢献
          </Label>
          <div className="bg-white/70 border border-border rounded-lg p-2">
            <div className="space-y-1.5">
              {STAMPS.map((stamp) => {
                const quantity = stampCart[stamp.id] || 0
                return (
                  <div key={stamp.id} className="flex items-center justify-between p-2 bg-white rounded border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stamp.emoji}</span>
                      <div>
                        <div className="font-medium text-xs">{stamp.label}</div>
                        <div className="text-xs text-muted-foreground">{stamp.points.toLocaleString()}pt</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateStampQuantity(stamp.id, -1)}
                        disabled={quantity === 0}
                        className="w-6 h-6 rounded-full border border-primary bg-white hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold text-primary transition-all"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold min-w-[1.5rem] text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateStampQuantity(stamp.id, 1)}
                        className="w-6 h-6 rounded-full border border-primary bg-white hover:bg-primary/10 flex items-center justify-center text-xs font-bold text-primary transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {totalItems > 0 && (
              <div className="pt-2 mt-2 border-t border-border">
                <div className="flex items-center gap-1.5 mb-1.5 text-xs font-medium text-muted-foreground">
                  <ShoppingCartIcon className="h-3 w-3" />
                  カート内容
                </div>
                <div className="space-y-0.5 mb-1.5">
                  {Object.entries(stampCart).map(([stampId, qty]) => {
                    const stamp = STAMPS.find((s) => s.id === stampId)
                    if (!stamp) return null
                    return (
                      <div key={stampId} className="flex justify-between text-[10px]">
                        <span>
                          {stamp.emoji} {stamp.label} × {qty}
                        </span>
                        <span className="font-medium">{(stamp.points * qty).toLocaleString()}pt</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {totalItems > 0 && (
              <div className="pt-2 border-t border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">合計</span>
                  <span className="text-base font-bold text-primary">{totalPoints.toLocaleString()}pt</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
