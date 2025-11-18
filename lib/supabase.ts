// Supabaseクライアントは lib/supabase/client.ts と lib/supabase/server.ts を使用してください

// ギフティングデータの型定義
export interface GiftingData {
  id?: number
  user_id: string
  user_name: string
  artist_id: string
  artist_name: string
  event_id: number
  event_name: string
  amount: number
  comment?: string
  page_size?: string // 'sixteenth' | 'quarter' | 'full'
  frame_type?: string // 'none' | 'flower' | 'autumn'
  frame_points?: number
  stamps?: string[] | null // Array of stamp emojis or null
  stamp_points?: number
  sender_name?: string
  sender_avatar?: string
  created_at?: string
}
