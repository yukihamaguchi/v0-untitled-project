"use server"

import { getSupabaseServer } from "@/lib/supabase"
import type { GiftingData } from "@/lib/supabase"

// ギフティングデータを保存するアクション
export async function saveGifting(data: GiftingData) {
  try {
    const supabase = getSupabaseServer()

    const insertData = {
      user_id: data.user_id,
      user_name: data.user_name,
      artist_id: data.artist_id,
      artist_name: data.artist_name,
      event_id: data.event_id,
      event_name: data.event_name,
      amount: data.amount,
      comment: data.comment || null,
      page_size: data.page_size || "full",
      frame_type: data.frame_type || "none",
      frame_points: data.frame_points || 0,
      stamps: data.stamps && data.stamps.length > 0 ? data.stamps : null,
      stamp_points: data.stamp_points || 0,
    }

    console.log("[v0] Saving gifting data:", JSON.stringify(insertData, null, 2))

    const { data: insertedData, error } = await supabase.from("giftings").insert([insertData]).select()

    if (error) {
      console.error("[v0] Supabase error details:", JSON.stringify(error, null, 2))
      return {
        success: false,
        error: `データベースエラー: ${error.message}. コード: ${error.code}. 詳細: ${error.details || "なし"}`,
      }
    }

    console.log("[v0] Successfully saved gifting:", insertedData)
    return { success: true, data: insertedData[0] }
  } catch (error) {
    console.error("[v0] Error in saveGifting:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: `ギフティングの保存中にエラーが発生しました: ${errorMessage}`,
    }
  }
}

// ユーザーのギフティング履歴を取得するアクション
export async function getUserGiftings(userId: string) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("giftings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user giftings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getUserGiftings:", error)
    return { success: false, error: "ギフティング履歴の取得中にエラーが発生しました" }
  }
}

// アーティストのギフティング履歴を取得するアクション
export async function getArtistGiftings(artistId: string) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("giftings")
      .select("*")
      .eq("artist_id", artistId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching artist giftings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getArtistGiftings:", error)
    return { success: false, error: "ギフティング履歴の取得中にエラーが発生しました" }
  }
}

// イベントごとのギフティング履歴を取得するアクション
export async function getEventGiftings(eventId: number) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from("giftings")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching event giftings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getEventGiftings:", error)
    return { success: false, error: "イベントのギフティング履歴の取得中にエラーが発生しました" }
  }
}
