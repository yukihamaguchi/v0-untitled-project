"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SendIcon, ChevronLeft, Music } from "lucide-react"
import { RippleButton } from "@/components/ripple-button"
import type { Recipient } from "@/types/recipient"
import type { RecipientMessage } from "@/types/message"
import { RecipientMessageForm } from "@/components/recipient-message-form"
import { STAMPS } from "@/lib/constants"

interface SendPageProps {
  params: {
    id: string
  }
}

export default function SendPage({ params }: SendPageProps) {
  const router = useRouter()
  const eventId = Number.parseInt(params.id)
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([])
  const [organizer, setOrganizer] = useState<Recipient | null>(null)
  const [messages, setMessages] = useState<Record<string, RecipientMessage>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    const organizerData: Recipient = {
      id: "organizer-1",
      name: "ジャパン・アーツ",
      role: "organizer",
      occupation: "イベント主催者",
      agency: "",
      image: "/images/image.png",
    }
    setOrganizer(organizerData)

    const performers: Recipient[] = [
      {
        id: "performer-1",
        name: "ヴィンセント・オン",
        role: "performer",
        occupation: "ピアニスト",
        agency: "",
        image: "/images/vincent-ong.png",
      },
    ]

    setSelectedRecipients(performers)
  }, [eventId, router])

  const handleMessageChange = useCallback((message: RecipientMessage) => {
    setMessages((prev) => ({
      ...prev,
      [message.recipientId]: message,
    }))
  }, [])

  const totalAmount = Object.values(messages).reduce((total, message) => {
    let stampPoints = 0
    if (message.stampCart) {
      for (const [stampId, quantity] of Object.entries(message.stampCart)) {
        const stamp = STAMPS.find((s) => s.id === stampId)
        if (stamp) {
          stampPoints += stamp.points * quantity
        }
      }
    }
    return total + stampPoints
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
    <div className="min-h-screen elegant-gradient pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 right-10 text-primary text-6xl sakura-float">🌸</div>
        <div className="absolute top-32 left-16 text-primary text-4xl sakura-float" style={{ animationDelay: "2s" }}>
          🌸
        </div>
        <div
          className="absolute bottom-24 right-24 text-primary text-5xl sakura-float"
          style={{ animationDelay: "4s" }}
        >
          🌸
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-md border-b border-primary/30 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-4">
          <Link href="/events">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-primary/20 border border-primary/30"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-serif font-bold text-primary tracking-wider">
              クラシック音楽への
              <br />
              ご支援のお願い
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              本日のご感想と、アーティストへのご支援をお届けください。
            </p>
          </div>
          <Music className="h-7 w-7 text-primary/60" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8 relative z-10">
        <div className="text-center mb-8 space-y-3">
          <p className="text-base text-foreground/90 leading-relaxed">本日の演奏はいかがでしたでしょうか。</p>
          <p className="text-base text-foreground/90 leading-relaxed">皆様の温かいご支援が、未来の芸術を育みます。</p>
          <p className="text-base text-foreground/90 leading-relaxed">
            心ばかりの贈り物として、アーティストへの感謝をお届けいただければ幸いです。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {organizer && (
            <div className="relative">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-serif font-bold text-primary tracking-wider">主催へのご支援</h2>
                <p className="text-sm text-muted-foreground mt-1">イベント運営へのご支援をお願いいたします</p>
              </div>
              <RecipientMessageForm recipient={organizer} onChange={handleMessageChange} />
            </div>
          )}

          <div className="border-t border-primary/30 pt-8">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-serif font-bold text-primary tracking-wider">アーティストへのご支援</h2>
              <p className="text-sm text-muted-foreground mt-1">演奏者への感謝の気持ちをお届けください</p>
            </div>
          </div>

          {selectedRecipients.map((recipient) => (
            <div key={recipient.id} className="relative">
              <RecipientMessageForm recipient={recipient} onChange={handleMessageChange} />
            </div>
          ))}

          <Card className="overflow-hidden border-2 border-primary/40 shadow-2xl bg-gradient-to-br from-card via-secondary to-card backdrop-blur-md">
            <CardContent className="p-8">
              <div className="space-y-5">
                <div className="text-center border-b border-primary/30 pb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">ご支援合計額</div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-primary tracking-tight">
                      ¥{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    アーティストへ心を込めたメッセージをお届けいたします
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <RippleButton
              type="submit"
              className="w-full gap-3 rounded-xl h-16 text-lg font-medium shadow-2xl hover:shadow-primary/50 transition-all bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary/50"
              disabled={isSubmitting}
            >
              <SendIcon className="h-6 w-6" />
              {isSubmitting ? "処理中..." : "送信"}
            </RippleButton>
            <p className="text-sm text-center text-muted-foreground mt-4 leading-relaxed">
              次のページでご支援内容をご確認いただけます
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
