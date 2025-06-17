import type { Contact } from "./types"

const STORAGE_KEY = "contacts"

export function getContacts(): Contact[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load contacts:", error)
    return []
  }
}

export function saveContacts(contacts: Contact[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  } catch (error) {
    console.error("Failed to save contacts:", error)
  }
}

export function exportToCSV(contacts: Contact[]): void {
  const headers = ["이름", "전화번호", "이메일", "그룹", "메모", "즐겨찾기", "생성일", "수정일"]
  const csvContent = [
    headers.join(","),
    ...contacts.map((contact) =>
      [
        `"${contact.name}"`,
        `"${contact.phone}"`,
        `"${contact.email || ""}"`,
        `"${contact.group}"`,
        `"${contact.notes || ""}"`,
        contact.isFavorite ? "예" : "아니오",
        `"${new Date(contact.createdAt).toLocaleDateString()}"`,
        `"${new Date(contact.updatedAt).toLocaleDateString()}"`,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `연락처_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function importFromCSV(file: File, onSuccess: (contacts: Contact[]) => void): void {
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const csv = e.target?.result as string
      const lines = csv.split("\n")
      const headers = lines[0].split(",")

      const contacts: Contact[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(",").map((value) => value.replace(/^"|"$/g, ""))

        if (values.length >= 2 && values[0] && values[1]) {
          const now = new Date().toISOString()
          const contact: Contact = {
            id: Date.now().toString() + i,
            name: values[0],
            phone: values[1],
            email: values[2] || undefined,
            group: (values[3] as any) || "other",
            notes: values[4] || undefined,
            isFavorite: values[5] === "예",
            createdAt: now,
            updatedAt: now,
          }
          contacts.push(contact)
        }
      }

      onSuccess(contacts)
    } catch (error) {
      console.error("Failed to import CSV:", error)
      alert("CSV 파일을 가져오는 중 오류가 발생했습니다.")
    }
  }

  reader.readAsText(file, "UTF-8")
}
