"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Contact, ContactGroup } from "@/lib/types"

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => void
  contact?: Contact | null
}

const groupOptions = [
  { value: "family", label: "가족" },
  { value: "friends", label: "친구" },
  { value: "work", label: "직장" },
  { value: "other", label: "기타" },
]

export function ContactForm({ isOpen, onClose, onSave, contact }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    group: "friends" as ContactGroup,
    notes: "",
    isFavorite: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        phone: contact.phone,
        email: contact.email || "",
        group: contact.group,
        notes: contact.notes || "",
        isFavorite: contact.isFavorite,
      })
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        group: "friends",
        notes: "",
        isFavorite: false,
      })
    }
    setErrors({})
  }, [contact, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "이름은 필수입니다"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호는 필수입니다"
    } else if (!/^[\d\s\-+$$$$]+$/.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        group: formData.group,
        notes: formData.notes.trim() || undefined,
        isFavorite: formData.isFavorite,
      })
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contact ? "연락처 편집" : "새 연락처 추가"}</DialogTitle>
          <DialogDescription>연락처 정보를 입력해주세요. 필수 항목은 이름과 전화번호입니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="홍길동"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호 *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="010-1234-5678"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">그룹</Label>
            <Select value={formData.group} onValueChange={(value) => handleInputChange("group", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groupOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">메모</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="추가 정보나 메모를 입력하세요"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorite"
              checked={formData.isFavorite}
              onCheckedChange={(checked) => handleInputChange("isFavorite", checked as boolean)}
            />
            <Label htmlFor="favorite">즐겨찾기에 추가</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">{contact ? "수정" : "추가"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
