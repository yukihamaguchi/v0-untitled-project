import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BanknoteIcon } from "lucide-react"

interface Message {
  id: number
  userName: string
  message: string
  amount: number
  date: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">メッセージはまだありません</CardContent>
      </Card>
    )
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
                <AvatarFallback>{message.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{message.userName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(message.date)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <BanknoteIcon className="h-3 w-3 text-primary" />
                    <p className="font-bold text-primary text-xs">{message.amount.toLocaleString()}円</p>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
