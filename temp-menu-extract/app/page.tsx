"use client"

import { useMemo, useState } from "react"
import { Plus, Eye } from "lucide-react" // Added Eye icon
import Link from "next/link" // Added Link for navigation
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/toast"
import { Logo } from "@/components/logo"
import { MenuTable } from "@/components/menu-table"
import { ItemForm } from "@/components/item-form"
import type { MenuItem } from "@/types/menu"
import { loadItems, saveItems, applyReorderByIds } from "@/lib/storage"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  const [items, setItems] = useState<MenuItem[]>(() => loadItems())
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const { showToast } = useToast()

  const stats = useMemo(() => {
    const total = items.length
    const available = items.filter((i) => i.available).length
    const categories = new Set(items.map((i) => i.category)).size
    return { total, available, categories }
  }, [items])

  function upsertItem(item: MenuItem) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id)
      const next = idx >= 0 ? [...prev.slice(0, idx), item, ...prev.slice(idx + 1)] : [item, ...prev]
      saveItems(next)
      return next
    })
    const isEditing = items.some((i) => i.id === item.id)
    showToast(`"${item.name}" has been ${isEditing ? "updated" : "created"}.`, "success")
  }

  function onCreateClick() {
    setEditing(null)
    setOpen(true)
  }

  function onEdit(item: MenuItem) {
    setEditing(item)
    setOpen(true)
  }

  function onDelete(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      const next = prev.filter((i) => i.id !== id)
      saveItems(next)
      if (item) {
        showToast(`"${item.name}" was deleted.`, "success")
      }
      return next
    })
  }

  function onBulkDelete(ids: string[]) {
    setItems((prev) => {
      const toDelete = new Set(ids)
      const removed = prev.filter((i) => toDelete.has(i.id))
      const next = prev.filter((i) => !toDelete.has(i.id))
      saveItems(next)
      const message =
        removed.length === 1 ? `"${removed[0]?.name}" was deleted.` : `${removed.length} items were deleted.`
      showToast(message, "success")
      return next
    })
  }

  function onToggleAvailability(id: string) {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
      saveItems(next)
      const changed = next.find((i) => i.id === id)
      if (changed) {
        const status = changed.available ? "available" : "unavailable"
        showToast(`"${changed.name}" is now ${status}.`, "success")
      }
      return next
    })
  }

  function onReorder(orderedIds: string[]) {
    setItems((prev) => {
      const next = applyReorderByIds(prev, orderedIds)
      saveItems(next)
      return next
    })
  }

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href="/display-menu">
              <Eye className="mr-2 h-4 w-4" />
              View Menu
            </Link>
          </Button>
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total items</CardTitle>
            <CardDescription>Count of menu entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Available</CardTitle>
            <CardDescription>Currently for sale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Categories</CardTitle>
            <CardDescription>Unique categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.categories}</div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-6" />

      <section>
        <MenuTable
          items={items}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailability={onToggleAvailability}
          onBulkDelete={onBulkDelete}
          onReorder={onReorder}
        />
      </section>

      <ItemForm open={open} onOpenChange={setOpen} initialItem={editing} onSubmit={upsertItem} onDelete={onDelete} />
    </main>
  )
}
