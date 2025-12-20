"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Recipient } from "@/types/recipient"

interface RecipientsPageProps {
  params: {
    id: string
  }
}

export default function RecipientsPage({ params }: RecipientsPageProps) {
  const router = useRouter()
  const eventId = Number.parseInt(params.id)
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])

  // イベント主催者と出演者データ
  const recipients: Recipient[] = [
    {
      id: "organizer-1",
      name: "イベント主催者",
      role: "organizer",
      image: "/images/organizer.jpg",
    },
    {
      id: "performer-1",
      name: "ヴィンセント・オン",
      role: "performer",
      occupation: "ピアニスト",
      agency: "ジャパン・アーツ",
      image: "/images/vincent-ong.png",
    },
  ]

  const toggleRecipient = (recipientId: string) => {
    setSelectedRecipients((prev) => {
      if (prev.includes(recipientId)) {
        return prev.filter((id) => id !== recipientId)
      } else {
        return [...prev, recipientId]
      }
    })
  }

  const handleNext = () => {
    if (selectedRecipients.length === 0) return

    // Save selected recipients to sessionStorage
    sessionStorage.setItem("selectedRecipients", JSON.stringify(selectedRecipients))
    router.push(`/events/${eventId}/send`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center mb-2">
        <Link href={`/events/${eventId}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-1">送り先を選択</h1>
      </div>

      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">メッセージを送りたい方を選択してください（複数選択可）</p>
          </div>

          <div className="space-y-3">
            {recipients.map((recipient) => (
              <button
                key={recipient.id}
                type="button"
                onClick={() => toggleRecipient(recipient.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  selectedRecipients.includes(recipient.id)
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedRecipients.includes(recipient.id)}
                    onCheckedChange={() => toggleRecipient(recipient.id)}
                    className="pointer-events-none"
                  />
                  {recipient.role === "organizer" ? (
                    <div className="rounded-full h-12 w-12 bg-blue-500 border-2 border-background flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  ) : (
                    <Image
                      src={recipient.image || "/placeholder.svg"}
                      alt={recipient.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover h-12 w-12 border-2 border-background"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{recipient.name}</div>
                    {recipient.role === "performer" && recipient.occupation && (
                      <div className="text-xs text-muted-foreground">
                        {recipient.occupation}（{recipient.agency}）
                      </div>
                    )}
                    {recipient.role === "organizer" && <div className="text-xs text-muted-foreground">主催者</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedRecipients.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-center">{selectedRecipients.length}人を選択中</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleNext}
        disabled={selectedRecipients.length === 0}
        className="w-full gap-2 rounded-full h-11"
      >
        次へ
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
