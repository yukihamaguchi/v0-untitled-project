import type { StampId } from "@/lib/constants"

export interface RecipientMessage {
  recipientId: string
  recipientName: string
  recipientRole: "organizer" | "performer"
  recipientImage: string
  selectedFrame: string
  comment: string
  selectedStamps: string[] // Kept for backwards compatibility
  stampCart?: Record<StampId, number> // Added stampCart to store quantity data
  senderName: string
  senderAvatar: string
}
