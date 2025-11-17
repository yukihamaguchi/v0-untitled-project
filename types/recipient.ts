export interface Recipient {
  id: string
  name: string
  role: "organizer" | "performer"
  occupation?: string
  agency?: string
  image: string
}
