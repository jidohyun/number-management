"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Users, Star, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContactList } from "@/components/contact-list"
import { ContactForm } from "@/components/contact-form"
import type { Contact, ContactGroup } from "@/lib/types"
import { getContacts, saveContacts, exportToCSV, importFromCSV } from "@/lib/storage"

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | "all">("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  useEffect(() => {
    const loadedContacts = getContacts()
    setContacts(loadedContacts)
  }, [])

  const handleSaveContact = (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()

    if (editingContact) {
      const updatedContact: Contact = {
        ...editingContact,
        ...contact,
        updatedAt: now,
      }
      const updatedContacts = contacts.map((c) => (c.id === editingContact.id ? updatedContact : c))
      setContacts(updatedContacts)
      saveContacts(updatedContacts)
    } else {
      const newContact: Contact = {
        ...contact,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      }
      const updatedContacts = [...contacts, newContact]
      setContacts(updatedContacts)
      saveContacts(updatedContacts)
    }

    setIsFormOpen(false)
    setEditingContact(null)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setIsFormOpen(true)
  }

  const handleDeleteContact = (id: string) => {
    const updatedContacts = contacts.filter((c) => c.id !== id)
    setContacts(updatedContacts)
    saveContacts(updatedContacts)
  }

  const handleToggleFavorite = (id: string) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === id
        ? { ...contact, isFavorite: !contact.isFavorite, updatedAt: new Date().toISOString() }
        : contact,
    )
    setContacts(updatedContacts)
    saveContacts(updatedContacts)
  }

  const handleExport = () => {
    exportToCSV(contacts)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      importFromCSV(file, (importedContacts) => {
        const updatedContacts = [...contacts, ...importedContacts]
        setContacts(updatedContacts)
        saveContacts(updatedContacts)
      })
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGroup = selectedGroup === "all" || contact.group === selectedGroup
    const matchesFavorites = !showFavoritesOnly || contact.isFavorite

    return matchesSearch && matchesGroup && matchesFavorites
  })

  const groupCounts = contacts.reduce(
    (acc, contact) => {
      acc[contact.group] = (acc[contact.group] || 0) + 1
      return acc
    },
    {} as Record<ContactGroup, number>,
  )

  const favoriteCount = contacts.filter((c) => c.isFavorite).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">연락처 관리</h1>
              <p className="text-muted-foreground">총 {contacts.length}개의 연락처</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                가져오기
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  내보내기
                </Button>
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                연락처 추가
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="이름, 전화번호, 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                즐겨찾기 ({favoriteCount})
              </Button>
            </div>
          </div>

          {/* Group Tabs */}
          <Tabs value={selectedGroup} onValueChange={(value) => setSelectedGroup(value as ContactGroup | "all")}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                전체 ({contacts.length})
              </TabsTrigger>
              <TabsTrigger value="family">가족 ({groupCounts.family || 0})</TabsTrigger>
              <TabsTrigger value="friends">친구 ({groupCounts.friends || 0})</TabsTrigger>
              <TabsTrigger value="work">직장 ({groupCounts.work || 0})</TabsTrigger>
              <TabsTrigger value="other">기타 ({groupCounts.other || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedGroup} className="mt-6">
              <ContactList
                contacts={filteredContacts}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                onToggleFavorite={handleToggleFavorite}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingContact(null)
        }}
        onSave={handleSaveContact}
        contact={editingContact}
      />
    </div>
  )
}
