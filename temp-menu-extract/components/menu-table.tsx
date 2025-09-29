"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Pencil, Search, Filter, Coffee, MouseIcon as Mug, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/toast"
import type { MenuItem, Category } from "@/types/menu"
import { categories } from "@/types/menu"
import { cn } from "@/lib/utils"

type MenuTableProps = {
  items?: MenuItem[]
  onEdit?: (item: MenuItem) => void
  onDelete?: (id: string) => void
  onToggleAvailability?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onReorder?: (orderedIds: string[]) => void
}

export function MenuTable({
  items = [],
  onEdit = () => {},
  onDelete = () => {},
  onToggleAvailability = () => {},
  onBulkDelete = (ids: string[]) => {
    ids.forEach((id) => onDelete(id))
  },
  onReorder = () => {},
}: MenuTableProps) {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<"All" | Category>("All")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const { showToast } = useToast()

  const [deleteModal, setDeleteModal] = useState<
    | {
        type: "single"
        item: MenuItem
      }
    | {
        type: "bulk"
        ids: string[]
        count: number
      }
    | null
  >(null)

  const [dragId, setDragId] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{ id: string; where: "above" | "below" } | null>(null)

  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [query, cat, pageSize])

  const formatPrice = (p: unknown) => (typeof p === "number" && Number.isFinite(p) ? `R ${p.toFixed(2)}` : "-")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((it) => {
        const qMatch =
          !q ||
          it.name.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q) ||
          it.tags?.some((t) => t.toLowerCase().includes(q))
        const cMatch = cat === "All" ? true : it.category === cat
        return qMatch && cMatch
      })
      .sort((a, b) => {
        if (a.category === b.category) {
          const ap = typeof a.position === "number" ? a.position : 0
          const bp = typeof b.position === "number" ? b.position : 0
          if (ap !== bp) return ap - bp
          return a.name.localeCompare(b.name)
        }
        return a.category.localeCompare(b.category)
      })
  }, [items, query, cat])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const clampedPage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (clampedPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, total)
  const pageItems = filtered.slice(startIndex, endIndex)

  const selectedCount = useMemo(() => {
    const ids = new Set(items.map((i) => i.id))
    return Array.from(selected).filter((id) => ids.has(id)).length
  }, [selected, items])

  const allFilteredIds = filtered.map((i) => i.id)
  const allFilteredSelected = pageItems.length > 0 && pageItems.every((i) => selected.has(i.id))
  const someFilteredSelected = pageItems.some((i) => selected.has(i.id))

  function toggleSelect(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function toggleSelectAllForPage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) {
        for (const it of pageItems) next.add(it.id)
      } else {
        for (const it of pageItems) next.delete(it.id)
      }
      return next
    })
  }

  function handleBulkDelete() {
    const ids = Array.from(selected)
    if (!ids.length) return
    setDeleteModal({
      type: "bulk",
      ids,
      count: ids.length,
    })
  }

  function reorderIds(list: string[], fromId: string, toId: string, where: "above" | "below") {
    if (fromId === toId) return list
    const next = list.slice()
    const fromIndex = next.indexOf(fromId)
    let toIndex = next.indexOf(toId)
    if (fromIndex === -1 || toIndex === -1) return list
    if (where === "below") toIndex = toIndex + 1
    next.splice(fromIndex, 1)
    const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
    next.splice(adjustedIndex, 0, fromId)
    return next
  }

  function onRowDragStart(e: React.DragEvent<HTMLTableRowElement>, id: string) {
    setDragId(id)
    e.dataTransfer.setData("text/plain", id)
    e.dataTransfer.effectAllowed = "move"
  }

  function onRowDragOver(e: React.DragEvent<HTMLTableRowElement>, overId: string) {
    if (!dragId || dragId === overId) return

    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    const rect = e.currentTarget.getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    const where: "above" | "below" = e.clientY < midpoint ? "above" : "below"

    setDropIndicator({ id: overId, where })
  }

  function onRowDrop(e: React.DragEvent<HTMLTableRowElement>, dropOnId: string) {
    e.preventDefault()
    e.stopPropagation()

    const srcId = dragId
    if (!srcId || !dropOnId || srcId === dropOnId || !dropIndicator) {
      resetDragState()
      return
    }

    const newIds = reorderIds(allFilteredIds, srcId, dropOnId, dropIndicator.where)
    onReorder(newIds)
    showToast("Item order updated successfully.", "success")
    resetDragState()
  }

  function onRowDragEnd() {
    resetDragState()
  }

  function onRowDragLeave(e: React.DragEvent<HTMLTableRowElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const { clientX, clientY } = e

    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      setDropIndicator(null)
    }
  }

  function resetDragState() {
    setDragId(null)
    setDropIndicator(null)
  }

  function goPrev() {
    setPage((p) => Math.max(1, p - 1))
  }
  function goNext() {
    setPage((p) => Math.min(totalPages, p + 1))
  }

  function handleDeleteConfirm() {
    if (!deleteModal) return

    if (deleteModal.type === "single") {
      onDelete(deleteModal.item.id)
    } else if (deleteModal.type === "bulk") {
      onBulkDelete(deleteModal.ids)
      setSelected(new Set())
    }

    setDeleteModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search by name, description, or tag"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              aria-label="Search"
            />
          </div>
          <Select value={cat} onValueChange={(v) => setCat(v as any)}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by category">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCount > 0 ? (
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary">{selectedCount} selected</Badge>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[100px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableCaption className="sr-only">Coffee Menu Items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all on page"
                  checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                  onCheckedChange={(v) => toggleSelectAllForPage(Boolean(v))}
                />
              </TableHead>
              <TableHead className="w-[56px]">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead className="w-[160px] sm:w-[200px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((it) => {
              const isChecked = selected.has(it.id)
              const isDragging = dragId === it.id
              const showDropAbove = dropIndicator?.id === it.id && dropIndicator.where === "above"
              const showDropBelow = dropIndicator?.id === it.id && dropIndicator.where === "below"
              return (
                <TableRow
                  key={it.id}
                  draggable={true}
                  onDragStart={(e) => onRowDragStart(e, it.id)}
                  onDragOver={(e) => onRowDragOver(e, it.id)}
                  onDrop={(e) => onRowDrop(e, it.id)}
                  onDragEnd={onRowDragEnd}
                  onDragLeave={onRowDragLeave}
                  className={cn(
                    !it.available && "opacity-70",
                    "cursor-grab active:cursor-grabbing transition-all",
                    isDragging && "opacity-50 scale-[0.98]",
                    showDropAbove && "border-t-4 border-primary",
                    showDropBelow && "border-b-4 border-primary",
                  )}
                  style={{
                    transform: isDragging ? "rotate(2deg)" : undefined,
                  }}
                >
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${it.name}`}
                      checked={isChecked}
                      onCheckedChange={(v) => toggleSelect(it.id, Boolean(v))}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      {it.imageUrl ? (
                        <Image
                          src={it.imageUrl || "/placeholder.svg"}
                          alt={`${it.name} image`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image src="/placeholder-0taew.png" alt="Placeholder coffee" fill className="object-cover" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[160px] sm:max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                    title={it.name}
                  >
                    {it.name}
                  </TableCell>
                  <TableCell>{it.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {(it.variants || []).map((v: any) => `${v.name} ${formatPrice(v?.price)}`).join(" • ")}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {(it.tags ?? []).length ? (
                        (it.tags ?? []).map((t) => (
                          <Badge key={`${it.id}-${t}`} variant="secondary">
                            {t}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {it.available ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Coffee className="h-4 w-4" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600">
                        <Mug className="h-4 w-4" /> Unavailable
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Toggle availability for ${it.name}`}
                        title={it.available ? "Mark unavailable" : "Mark available"}
                        onClick={() => onToggleAvailability(it.id)}
                      >
                        {it.available ? <Coffee className="h-4 w-4" /> : <Mug className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Edit ${it.name}`} onClick={() => onEdit(it)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No items found. Try adjusting filters or add a new item.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {total} of {items.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={clampedPage <= 1} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {clampedPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={clampedPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteModal?.type === "single" ? (
                <>
                  Are you sure you want to delete "<strong>{deleteModal.item.name}</strong>"?
                  <br />
                  This action cannot be undone.
                </>
              ) : deleteModal?.type === "bulk" ? (
                <>
                  Are you sure you want to delete <strong>{deleteModal.count}</strong> selected item
                  {deleteModal.count > 1 ? "s" : ""}?
                  <br />
                  This action cannot be undone.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {deleteModal?.type === "single" ? "Delete Item" : `Delete ${deleteModal?.count || 0} Items`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
