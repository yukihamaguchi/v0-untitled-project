import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BanknoteIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface Message {
  id: number
  amount: number
  comment: string
  createdAt: string
  user: {
    name: string
  }
}

interface MessageListProps {
  eventId?: number;
  performerId?: number;
}

export function MessageList({ eventId, performerId }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const params = new URLSearchParams()
        if (eventId) params.append("eventId", eventId.toString())
        if (performerId) params.append("performerId", performerId.toString())

        const response = await fetch(`/api/giftings/history?${params}`)
        const data = await response.json()
        if (response.ok) {
          setMessages(data)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [eventId, performerId])

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (messages.length === 0) {
    return <div className="text-center text-muted-foreground py-8">まだメッセージはありません</div>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className="overflow-hidden shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{message.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{message.user.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <BanknoteIcon className="h-3 w-3 text-primary" />
                    <p className="font-bold text-primary text-xs">{message.amount.toLocaleString()}円</p>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">{message.comment}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}