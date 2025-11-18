"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { BanknoteIcon, SendIcon, ChevronLeft, PlusIcon } from 'lucide-react'
import { RippleButton } from "@/components/ripple-button"
import type { Recipient } from "@/types/recipient"
import type { RecipientMessage } from "@/types/message"
import { RecipientMessageForm } from "@/components/recipient-message-form"

interface SendPageProps {
  params: {
    id: string
  }
}

const FRAME_POINTS: Record<string, number> = {
  none: 0,
  flower: 500,
  autumn: 500,
}

const STAMP_POINTS: Record<string, number> = {
  "👏": 500,
  "⭐": 1000,
  "❤️": 2000,
  "🎉": 5000,
}

export default function SendPage({ params }: SendPageProps) {
  const router = useRouter()
  const eventId = Number.parseInt(params.id)
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([])
  const [availablePerformers, setAvailablePerformers] = useState<Recipient[]>([])
  const [messages, setMessages] = useState<Record<string, RecipientMessage>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    const organizer: Recipient = {
      id: "organizer-1",
      name: "イベント主催者",
      role: "organizer",
      image: "/images/organizer.jpg",
    }

    const performers: Recipient[] = [
      {
        id: "performer-1",
        name: "天野 しずく",
        role: "performer",
        occupation: "声優",
        agency: "ドリームボイス",
        image: "/images/performer-1.jpeg",
      },
      {
        id: "performer-2",
        name: "早乙女 みなと",
        role: "performer",
        occupation: "声優",
        agency: "ステラボイス",
        image: "/images/performer-2.jpeg",
      },
      {
        id: "performer-3",
        name: "有栖川 りお",
        role: "performer",
        occupation: "声優",
        agency: "ムーンライト",
        image: "/images/performer-3.jpeg",
      },
      {
        id: "performer-4",
        name: "白石 ほのか",
        role: "performer",
        occupation: "声優",
        agency: "サンシャイン",
        image: "/images/performer-4.jpeg",
      },
    ]

    setSelectedRecipients([organizer])
    setAvailablePerformers(performers)
  }, [eventId, router])

  const handleMessageChange = useCallback((recipientId: string, message: RecipientMessage) => {
    setMessages((prev) => ({
      ...prev,
      [recipientId]: message,
    }))
  }, [])

  const handleAddPerformer = (performer: Recipient) => {
    setSelectedRecipients((prev) => [...prev, performer])
    setAvailablePerformers((prev) => prev.filter((p) => p.id !== performer.id))
  }

  const handleRemoveRecipient = (recipientId: string) => {
    const recipient = selectedRecipients.find((r) => r.id === recipientId)
    if (recipient && recipient.role === "performer") {
      setAvailablePerformers((prev) => [...prev, recipient])
    }
    setSelectedRecipients((prev) => prev.filter((r) => r.id !== recipientId))
    setMessages((prev) => {
      const newMessages = { ...prev }
      delete newMessages[recipientId]
      return newMessages
    })
  }

  const totalAmount = Object.values(messages).reduce((total, message) => {
    const framePoints = FRAME_POINTS[message.selectedFrame] || 0
    const stampPoints = message.selectedStamps.reduce((sum, emoji) => sum + (STAMP_POINTS[emoji] || 0), 0)
    return total + framePoints + stampPoints
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const paymentInfo = {
      eventId,
      messages: Object.values(messages),
      totalAmount,
    }
    sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo))

    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/events/${eventId}/confirm`)
    }, 500)
  }

  if (selectedRecipients.length === 0) {
    return null
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href="/events">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">メッセージを作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedRecipients.map((recipient) => (
          <div key={recipient.id} className="relative">
            <RecipientMessageForm
              recipient={recipient}
              onChange={(message) => handleMessageChange(recipient.id, message)}
            />
            {recipient.role !== "organizer" && (
              <button
                type="button"
                onClick={() => handleRemoveRecipient(recipient.id)}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {availablePerformers.length > 0 && (
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">出演者を追加</h3>
              <div className="space-y-2">
                {availablePerformers.map((performer) => (
                  <button
                    key={performer.id}
                    type="button"
                    onClick={() => handleAddPerformer(performer)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-border bg-white hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <PlusIcon className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{performer.name}</div>
                      {performer.occupation && (
                        <div className="text-xs text-muted-foreground">
                          {performer.occupation}（{performer.agency}）
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">合計ポイント</span>
                <div className="flex items-center gap-1">
                  <BanknoteIcon className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}pt</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {selectedRecipients.length}人にメッセージを送信
              </p>
            </div>
          </CardContent>
        </Card>

        <RippleButton type="submit" className="w-full gap-2 rounded-full h-11" disabled={isSubmitting}>
          <SendIcon className="h-4 w-4" />
          {isSubmitting ? "処理中..." : "確認画面へ"}
        </RippleButton>
      </form>
    </div>
  )
}
