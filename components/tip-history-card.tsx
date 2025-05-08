import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BanknoteIcon } from "lucide-react"

interface TipHistoryItem {
  id: number
  performer: string
  event: string
  amount: number
  date: string
}

interface TipHistoryCardProps {
  tipHistory: TipHistoryItem[]
}

export function TipHistoryCard({ tipHistory }: TipHistoryCardProps) {
  if (tipHistory.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">ギフティング履歴はありません</CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden shadow-md">
      {tipHistory.map((tip, index) => (
        <div key={tip.id}>
          <CardContent className="py-3 px-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{tip.performer}</p>
                <p className="text-xs text-muted-foreground">{tip.event}</p>
                <p className="text-xs text-muted-foreground">{new Date(tip.date).toLocaleDateString("ja-JP")}</p>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                <BanknoteIcon className="h-3 w-3 text-primary" />
                <p className="font-bold text-primary text-xs">{tip.amount.toLocaleString()}円</p>
              </div>
            </div>
          </CardContent>
          {index < tipHistory.length - 1 && <Separator />}
        </div>
      ))}
    </Card>
  )
}
