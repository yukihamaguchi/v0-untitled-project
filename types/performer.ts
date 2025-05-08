export interface Performer {
  id: number
  name: string
  occupation: string // ジャンルから職業に変更
  agency: string // 事務所名を追加
  image: string
  isFollowing?: boolean
  paypayId: string // PayPay ID
}
