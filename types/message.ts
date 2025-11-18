export interface RecipientMessage {
  recipientId: string
  recipientName: string
  recipientRole: "organizer" | "performer"
  recipientImage: string
  pageSize: string
  selectedFrame: string
  comment: string
  selectedStamps: string[]
  senderName: string
  senderAvatar: string
}
