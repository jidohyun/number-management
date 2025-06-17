"use client"

import { Phone, Mail, MoreVertical, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Contact } from "@/lib/types"

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

const groupLabels = {
  family: "가족",
  friends: "친구",
  work: "직장",
  other: "기타",
}

const groupColors = {
  family: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  friends: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  work: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function ContactCard({ contact, onEdit, onDelete, onToggleFavorite }: ContactCardProps) {
  const handleCall = () => {
    window.open(`tel:${contact.phone}`)
  }

  const handleEmail = () => {
    window.open(`mailto:${contact.email}`)
  }

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{contact.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{contact.name}</h3>
            <Badge className={`text-xs ${groupColors[contact.group]}`}>{groupLabels[contact.group]}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {contact.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(contact)}>
                <Edit className="h-4 w-4 mr-2" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(contact.id)}>
                <Star className="h-4 w-4 mr-2" />
                {contact.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(contact.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">{contact.phone}</span>
            <Button variant="ghost" size="sm" onClick={handleCall} className="h-6 w-6 p-0">
              <Phone className="h-3 w-3" />
            </Button>
          </div>
          {contact.email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{contact.email}</span>
              <Button variant="ghost" size="sm" onClick={handleEmail} className="h-6 w-6 p-0">
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        {contact.notes && <div className="text-xs text-muted-foreground bg-muted p-2 rounded">{contact.notes}</div>}
      </CardContent>
    </Card>
  )
}
