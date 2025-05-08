import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GiftingStatsProps {
  data: {
    totalAmount: number
    averageAmount: number
    messageCount: number
    topAmount: number
    amountByTime: Array<{ time: string; amount: number }>
    amountByCategory: Array<{ category: string; count: number }>
  }
}

export function GiftingStats({ data }: GiftingStatsProps) {
  // 最も多い金額を見つける（グラフの最大値を決めるため）
  const maxTimeAmount = Math.max(...data.amountByTime.map((item) => item.amount))
  const maxCategoryCount = Math.max(...data.amountByCategory.map((item) => item.count))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均ギフティング</CardTitle>
            <CardDescription>1メッセージあたりの平均金額</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{data.averageAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">最高ギフティング</CardTitle>
            <CardDescription>単一メッセージの最高金額</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{data.topAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">時間帯別ギフティング</CardTitle>
          <CardDescription>時間帯ごとのギフティング金額</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end justify-between gap-2">
            {data.amountByTime.map((item) => {
              const heightPercentage = (item.amount / maxTimeAmount) * 100
              return (
                <div key={item.time} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-primary/80 rounded-t-sm" style={{ height: `${heightPercentage}%` }}></div>
                  <span className="text-xs">{item.time}</span>
                  <span className="text-xs text-muted-foreground">¥{item.amount.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">金額別ギフティング</CardTitle>
          <CardDescription>金額ごとのギフティング数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.amountByCategory.map((item) => {
              const widthPercentage = (item.count / maxCategoryCount) * 100
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{item.category}</span>
                    <span>{item.count}件</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${widthPercentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
