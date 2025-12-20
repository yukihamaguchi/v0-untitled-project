"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserIcon, Gift } from "lucide-react"
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
  }, [recipient.id, recipient.name, recipient.role, recipient.image, comment, stampCart, senderName, senderAvatar])

  const selectGiftOption = useCallback((stampId: StampId) => {
    setStampCart({ [stampId]: 1 })
  }, [])

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }, [])

  const selectedStampId = Object.keys(stampCart)[0] as StampId | undefined

  return (
    <Card className="overflow-hidden border-2 border-primary/40 shadow-xl bg-card/80 backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-primary/40 py-5 px-6">
        <CardTitle className="flex items-center gap-4 text-lg">
          <Image
            src={recipient.image || "/placeholder.svg"}
            alt={recipient.name}
            width={56}
            height={56}
            className="rounded-full object-cover h-14 w-14 border-3 border-primary/50 shadow-lg"
          />
          <div className="flex-1">
            <div className="font-semibold text-xl text-foreground">{recipient.name}</div>
            {recipient.occupation && (
              <div className="text-sm text-muted-foreground font-normal mt-1">{recipient.occupation}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">¥{totalPoints.toLocaleString()}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <Label htmlFor={`senderName-${recipient.id}`} className="text-sm font-medium flex items-center gap-2 mb-3">
            <UserIcon className="h-4 w-4 text-primary" />
            お名前
          </Label>
          <Input
            id={`senderName-${recipient.id}`}
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="例: 山田 太郎"
            className="bg-background/50 border-primary/30 text-base h-12 rounded-lg focus-visible:ring-primary focus-visible:border-primary"
            maxLength={20}
          />
        </div>

        <div>
          <Label
            htmlFor={`comment-${recipient.id}`}
            className="text-sm font-medium mb-3 block flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              応援メッセージ
            </span>
            <span className="text-muted-foreground text-xs">
              {comment.length}/{MAX_MESSAGE_LENGTH}文字
            </span>
          </Label>
          <Textarea
            id={`comment-${recipient.id}`}
            placeholder="応援メッセージをお願いします"
            value={comment}
            onChange={handleCommentChange}
            maxLength={MAX_MESSAGE_LENGTH}
            className="w-full min-h-[160px] resize-none bg-background/50 border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-base leading-relaxed p-4 rounded-lg"
            rows={7}
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-4 block text-center text-lg">ご支援の選択</Label>
          <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto">
            {STAMPS.map((stamp) => {
              const isSelected = selectedStampId === stamp.id

              if (stamp.id === "none") {
                return (
                  <button
                    key={stamp.id}
                    type="button"
                    onClick={() => selectGiftOption(stamp.id)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-3 transition-all duration-300 ${
                      isSelected
                        ? "border-muted-foreground bg-muted shadow-xl scale-105"
                        : "border-muted/30 bg-card/50 hover:border-muted hover:bg-muted/10 shadow-md"
                    }`}
                  >
                    <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground font-light">－</span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground text-center leading-tight">
                      {stamp.label}
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-muted-foreground rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-background text-sm font-bold">✓</span>
                      </div>
                    )}
                  </button>
                )
              }

              return (
                <button
                  key={stamp.id}
                  type="button"
                  onClick={() => selectGiftOption(stamp.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-3 transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/20 shadow-xl scale-105"
                      : "border-primary/30 bg-card/50 hover:border-primary/50 hover:bg-primary/10 shadow-md"
                  }`}
                >
                  <div className="relative w-16 h-16 mb-2">
                    <Image src={stamp.image || "/placeholder.svg"} alt={stamp.label} fill className="object-contain" />
                  </div>
                  <div className="text-lg font-bold text-primary mb-0.5">{stamp.label}</div>
                  <div className="text-xs font-medium text-foreground">¥{stamp.points.toLocaleString()}</div>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-primary-foreground text-sm font-bold">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
            いずれかのご支援をお選びください
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
