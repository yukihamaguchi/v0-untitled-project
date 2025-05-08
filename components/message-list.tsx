import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { BanknoteIcon } from "lucide-react"

interface Message {
  id: number
  user: {
    name: string
  }
  performer: {
    name: string
  }
  amount: number
  comment: string
  createdAt: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">メッセージはありません</CardContent>
      </Card>
    )
  }

  // 総ギフティング金額を計算
  const totalGifting = messages.reduce((sum, message) => sum + message.amount, 0)

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">総ギフティング</p>
              <p className="text-2xl font-bold">¥{totalGifting.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">メッセージ数</p>
              <p className="text-2xl font-bold">{messages.length}件</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    <p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString("ja-JP")}</p>
                    <p className="mt-2 text-sm">{message.comment}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <BanknoteIcon className="h-3 w-3 text-primary" />
                    <p className="font-bold text-primary text-xs">¥{message.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}