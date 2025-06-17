export type ContactGroup = "family" | "friends" | "work" | "other"

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  group: ContactGroup
  notes?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}
