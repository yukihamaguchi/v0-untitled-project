// Supabaseクライアントは lib/supabase/client.ts と lib/supabase/server.ts を使用してください

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
  frame_type?: string
  frame_points?: number
  stamps?: string[] | null
  stamp_points?: number
  sender_name?: string
  sender_avatar?: string
  created_at?: string
}
