import type { Contact } from "@/lib/types"
import { ContactCard } from "./contact-card"

interface ContactListProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function ContactList({ contacts, onEdit, onDelete, onToggleFavorite }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">연락처가 없습니다</div>
        <div className="text-sm text-muted-foreground mt-2">새 연락처를 추가해보세요</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
