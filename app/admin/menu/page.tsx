"use client"

import { useEffect, useState } from "react"
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/api/menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/helpers/formatting"
import {
  AdminPage,
  AdminHeader,
  AdminCard,
  AdminFormGroup,
  AdminToggleRow
} from "@/components/admin/admin-ui"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  UtensilsCrossed,
  Package,
  Star,
  X,
} from "lucide-react"
import type { Product } from "@/types"

type FormState = {
  name: string
  description: string
  price: string
  category: string
  image_url: string
  is_active: boolean
  variants: string
  extras: string
  is_featured: boolean
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  is_active: true,
  variants: "[]",
  extras: "[]",
  is_featured: false,
}

export default function AdminMenuPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [isNewCategory, setIsNewCategory] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadItems() {
    try {
      const data = await getAllMenuItems()
      setItems(data)
    } catch {
      toast({ title: "Failed to load menu", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(items.map((i: any) => i.category).filter(Boolean))]

  function openCreateDialog() {
    setEditingItem(null)
    setForm(emptyForm)
    setIsNewCategory(false)
    setDialogOpen(true)
  }

  function openEditDialog(item: Product) {
    setEditingItem(item)
    const existingCats = [...new Set(items.map((i: any) => i.category).filter(Boolean))]
    setIsNewCategory(item.category ? !existingCats.includes(item.category) : false)
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category: item.category || "",
      image_url: (item as any).image_url || "",
      is_active: (item as any).is_active !== false,
      is_featured: item.is_featured || false,
      variants: JSON.stringify((item as any).variants || [], null, 2),
      extras: JSON.stringify((item as any).extras || [], null, 2),
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" })
      return
    }
    const price = parseFloat(form.price)
    if (isNaN(price) || price < 0) {
      toast({ title: "Valid price is required", variant: "destructive" })
      return
    }

    let variants: any[] = []
    let extras: any[] = []
    try { variants = JSON.parse(form.variants || "[]") } catch { toast({ title: "Invalid variants JSON", variant: "destructive" }); return }
    try { extras = JSON.parse(form.extras || "[]") } catch { toast({ title: "Invalid extras JSON", variant: "destructive" }); return }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        image_url: form.image_url.trim() || undefined,
        is_active: form.is_active,
        is_featured: form.is_featured,
        variants,
        extras,
      }

      if (editingItem) {
        await updateMenuItem(editingItem.id, payload)
        toast({ title: "Item updated" })
      } else {
        await createMenuItem(payload)
        toast({ title: "Item created" })
      }

      setDialogOpen(false)
      await loadItems()
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMenuItem(deleteTarget.id)
      toast({ title: "Item deleted" })
      setDeleteTarget(null)
      await loadItems()
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggleActive(item: Product) {
    try {
      await updateMenuItem(item.id, { is_active: !(item as any).is_active })
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_active: !(i as any).is_active } as any : i
        )
      )
    } catch {
      toast({ title: "Failed to update", variant: "destructive" })
    }
  }

  return (
    <AdminPage>
      <Toaster />

      <AdminHeader
        title="Menu Management"
        description={`${items.length} items total`}
        actions={
          <Button onClick={openCreateDialog} className="font-medium bg-foreground text-background hover:bg-foreground/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading menu items...</div>
      ) : filteredItems.length === 0 ? (
        <AdminCard className="text-center py-16 flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border mb-4">
            <UtensilsCrossed className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="text-muted-foreground text-sm">No items found</div>
          <Button onClick={openCreateDialog} variant="outline" className="mt-4 border-border text-muted-foreground hover:bg-accent">
            Add your first item
          </Button>
        </AdminCard>
      ) : (
        <AdminCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left font-medium text-muted-foreground px-5 py-4">Item</th>
                  <th className="text-left font-medium text-muted-foreground px-5 py-4 hidden sm:table-cell">Category</th>
                  <th className="text-right font-medium text-muted-foreground px-5 py-4">Price</th>
                  <th className="text-center font-medium text-muted-foreground px-5 py-4">Active</th>
                  <th className="text-right font-medium text-muted-foreground px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item: any) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                          ) : (
                            <Package className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className={cn("text-sm font-semibold truncate", item.is_active !== false ? "text-foreground" : "text-muted-foreground line-through")}>{item.name}</div>
                            {item.is_featured && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-[10px] px-1.5 py-0 border-none">Featured</Badge>}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-[240px] mt-0.5">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1.5 rounded-md border border-border/50">{item.category}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="font-semibold text-foreground">{formatCurrency(item.price)}</div>
                      {item.variants?.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.variants.length} sizes</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Switch
                        checked={item.is_active !== false}
                        onCheckedChange={() => handleToggleActive(item)}
                        className="data-[state=checked]:bg-foreground"
                      />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <AdminFormGroup label="Name *">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-background border-border text-foreground"
                placeholder="e.g. Americano"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-background border-border text-foreground resize-none"
                placeholder="Short description"
                rows={2}
              />
            </AdminFormGroup>

            <div className="grid grid-cols-2 gap-4">
              <AdminFormGroup label="Price (R) *">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="bg-background border-border text-foreground"
                  placeholder="0.00"
                />
              </AdminFormGroup>
              
              <AdminFormGroup label="Category">
                {isNewCategory || categories.length === 0 ? (
                  <div className="flex gap-2">
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="bg-background border-border text-foreground flex-1"
                      placeholder="e.g. Burgers"
                      autoFocus
                    />
                    {categories.length > 0 && (
                      <Button variant="outline" size="icon" onClick={() => { setIsNewCategory(false); setForm({...form, category: categories[0] || ""}) }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <Select
                    value={categories.includes(form.category) ? form.category : ""}
                    onValueChange={(v) => {
                      if (v === "NEW_CATEGORY") {
                        setIsNewCategory(true)
                        setForm({ ...form, category: "" })
                      } else {
                        setForm({ ...form, category: v })
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      <SelectItem value="NEW_CATEGORY" className="text-brand font-medium">
                        + Add new category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </AdminFormGroup>
            </div>

            <AdminFormGroup label="Image URL">
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="bg-background border-border text-foreground"
                placeholder="https://..."
              />
            </AdminFormGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminToggleRow label="Active" className="bg-card shadow-sm col-span-1">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted"
                />
              </AdminToggleRow>
              <AdminToggleRow label="Featured" description="Show in carousel" className="bg-card shadow-sm col-span-1">
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                  className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted"
                />
              </AdminToggleRow>
            </div>

            <AdminFormGroup label="Variants (JSON)">
              <Textarea
                value={form.variants}
                onChange={(e) => setForm({ ...form, variants: e.target.value })}
                className="bg-background border-border text-foreground font-mono text-xs resize-none"
                rows={3}
                placeholder='[{"id":"sm","name":"Small","price":25},{"id":"lg","name":"Large","price":35}]'
              />
            </AdminFormGroup>

            <AdminFormGroup label="Extras (JSON)">
              <Textarea
                value={form.extras}
                onChange={(e) => setForm({ ...form, extras: e.target.value })}
                className="bg-background border-border text-foreground font-mono text-xs resize-none"
                rows={3}
                placeholder='["extra_shot","oat_milk"]'
              />
            </AdminFormGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border text-muted-foreground hover:bg-accent">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-foreground text-background hover:bg-foreground/90">
              {saving ? "Saving..." : editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="text-foreground font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-border text-muted-foreground hover:bg-accent">
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white hover:bg-red-700">
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  )
}
