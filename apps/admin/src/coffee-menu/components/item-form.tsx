"use client"

import type React from "react"
import { z } from "zod"
import { useEffect, useRef, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, UploadCloud, X } from "lucide-react"
import { Button as BaseButton } from "./ui/button"
import {
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogFooter as BaseDialogFooter,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogDescription as BaseDialogDescription,
} from "./ui/dialog"
import { Input as BaseInput } from "./ui/input"
import { Label as BaseLabel } from "./ui/label"
import { Textarea as BaseTextarea } from "./ui/textarea"
import { Select as BaseSelect, SelectContent as BaseSelectContent, SelectItem as BaseSelectItem, SelectTrigger as BaseSelectTrigger, SelectValue as BaseSelectValue } from "./ui/select"
import { Separator as BaseSeparator } from "./ui/separator"
import { Badge as BaseBadge } from "./ui/badge"
import { Checkbox as BaseCheckbox } from "./ui/checkbox"
import { useToast } from "./toast"
import { withInspector } from "../../lib/inspector"
import { CheckboxMultiSelect } from "./checkbox-multiselect"
import { loadItems } from "../lib/supabase-storage"

// Create inspectable versions of components
const Button = withInspector(BaseButton, 'Button')
const Dialog = withInspector(BaseDialog, 'Dialog')
const DialogContent = withInspector(BaseDialogContent, 'DialogContent')
const DialogFooter = withInspector(BaseDialogFooter, 'DialogFooter')
const DialogHeader = withInspector(BaseDialogHeader, 'DialogHeader')
const DialogTitle = withInspector(BaseDialogTitle, 'DialogTitle')
const DialogDescription = withInspector(BaseDialogDescription, 'DialogDescription')
const Input = withInspector(BaseInput, 'Input')
const Label = withInspector(BaseLabel, 'Label')
const Textarea = withInspector(BaseTextarea, 'Textarea')
const Select = withInspector(BaseSelect, 'Select')
const SelectContent = withInspector(BaseSelectContent, 'SelectContent')
const SelectItem = withInspector(BaseSelectItem, 'SelectItem')
const SelectTrigger = withInspector(BaseSelectTrigger, 'SelectTrigger')
const SelectValue = withInspector(BaseSelectValue, 'SelectValue')
const Separator = withInspector(BaseSeparator, 'Separator')
const Badge = withInspector(BaseBadge, 'Badge')
const Checkbox = withInspector(BaseCheckbox, 'Checkbox')
import { categories, type MenuItem, type MenuVariant } from "../types/menu"
import { cn } from "../lib/utils"

type ItemFormProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (item: MenuItem) => Promise<void>
  onDelete?: (id: string) => void
  initialItem?: MenuItem | null
}

const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  available: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  extras: z.array(z.string()).default([]),
  variants: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Variant name is required"),
        price: z.number().min(0, "Price must be positive"),
      }),
    )
    .min(1, "At least one variant is required"),
})

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function ItemForm({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
  onDelete = () => {},
  initialItem = null,
}: ItemFormProps) {
  const isEditing = Boolean(initialItem)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [extrasOptions, setExtrasOptions] = useState<string[]>([])
  const { showToast } = useToast()

  const form = useForm({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: initialItem?.name ?? "",
      description: initialItem?.description ?? "",
      category: initialItem?.category ?? "Coffee",
      image: initialItem?.imageUrl ?? "",
      available: initialItem?.available ?? true,
      tags: initialItem?.tags ?? [],
      platforms: initialItem?.platforms ?? [],
      extras: initialItem?.extras ?? [],
      variants: initialItem?.variants?.length
        ? initialItem.variants.map((v) => ({ ...v, price: Number(v.price) }))
        : [{ id: generateId(), name: "", price: 0 }],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  // Load extras options when component mounts
  useEffect(() => {
    const loadExtrasOptions = async () => {
      try {
        const allItems = await loadItems()
        const extrasItems = allItems
          .filter(item => item.category === "Extras")
          .map(item => item.name)
        setExtrasOptions(extrasItems)
      } catch (error) {
        console.error('Failed to load extras options:', error)
      }
    }
    loadExtrasOptions()
  }, [])

  useEffect(() => {
    if (initialItem) {
      form.reset({
        name: initialItem.name,
        description: initialItem.description ?? "",
        category: initialItem.category,
        image: initialItem.imageUrl ?? "",
        available: initialItem.available,
        tags: initialItem.tags ?? [],
        platforms: initialItem.platforms ?? [],
        extras: initialItem.extras ?? [],
        variants: initialItem.variants.map((v) => ({ ...v, price: Number(v.price) })),
      })
    } else {
      form.reset({
        name: "",
        description: "",
        category: "Coffee",
        image: "",
        available: true,
        tags: [],
        platforms: [],
        extras: [],
        variants: [{ id: generateId(), name: "", price: 0 }],
      })
    }
    // Only reset when modal opens/closes or when initialItem.id changes (different item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialItem?.id, open])

  function formatTwoDecimals(n: number | undefined) {
    if (typeof n !== "number" || !Number.isFinite(n)) return ""
    return n.toFixed(2)
  }

  function sanitizeTags(text: string): string[] {
    return text
      .split(/[,\n]/g)
      .map((t) => t.trim())
      .filter(Boolean)
  }

  function uniqueTags(tags: string[]): string[] {
    const seen = new Set<string>()
    const out: string[] = []
    for (const t of tags) {
      const key = t.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        out.push(t)
      }
    }
    return out
  }

  // Image handling
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  function pickFile() {
    fileInputRef.current?.click()
  }
  function loadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      form.setError("image", { message: "Please upload an image file." })
      return
    }
    if (file.size > MAX_SIZE) {
      form.setError("image", { message: "Image must be smaller than 5MB." })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : ""
      if (dataUrl) {
        form.clearErrors("image")
        form.setValue("image", dataUrl, { shouldValidate: true, shouldDirty: true })
      }
    }
    reader.readAsDataURL(file)
  }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
    e.currentTarget.value = ""
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) loadFile(file)
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  function clearImage() {
    form.clearErrors("image")
    form.setValue("image", "", { shouldValidate: true, shouldDirty: true })
  }

  const [tagsText, setTagsText] = useState("")
  useEffect(() => {
    setTagsText((form.getValues("tags") || []).join(", "))
  }, [open])

  function commitTagsText(text?: string) {
    const src = text ?? tagsText
    const parsed = uniqueTags(sanitizeTags(src))
    form.setValue("tags", parsed, { shouldValidate: true, shouldDirty: true })
    setTagsText(parsed.join(", "))
  }

  async function handleSubmit(values: any) {
    commitTagsText()
    const newItem: MenuItem = {
      id: initialItem?.id ?? `temp_${generateId()}`, // Use temp_ prefix for new items
      name: values.name,
      description: values.description,
      category: values.category,
      imageUrl: values.image, // Use imageUrl instead of image
      available: values.available,
      tags: values.tags,
      platforms: values.platforms,
      extras: values.extras,
      variants: values.variants.map((v: MenuVariant) => ({ ...v, price: Number.isFinite(v.price) ? v.price : 0 })),
      position: initialItem?.position ?? 0,
    }
    
    try {
      await onSubmit(newItem)
      showToast(`${newItem.name} has been ${isEditing ? 'updated' : 'added'} successfully.`, "success")
      onOpenChange(false)
    } catch (error) {
      showToast(`Failed to ${isEditing ? 'update' : 'create'} item. Please try again.`, "error")
    }
  }

  function addVariant() {
    append({ id: generateId(), name: "", price: 0 })
  }

  const imageUrl = form.watch("image")

  function handleDeleteConfirm() {
    if (!initialItem) return
    onDelete(initialItem.id)
    setShowDeleteModal(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the details of this menu item." : "Create a new menu item with details, pricing, and image."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
            aria-label={isEditing ? "Edit menu item form" : "Create menu item form"}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Flat White" {...form.register("name")} />
                {form.formState.errors.name ? (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(v) => form.setValue("category", v, { shouldValidate: true })}
                >
                  <SelectTrigger id="category" aria-label="Category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Short description" {...form.register("description")} />
              </div>

              {/* Image Upload Block */}
              <div className="sm:col-span-2 grid gap-2">
                <Label htmlFor="image-upload">Image</Label>
                <input ref={fileInputRef} id="image-upload" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload image"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      pickFile()
                    }
                  }}
                  onClick={pickFile}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragEnter={onDragOver}
                  onDragLeave={onDragLeave}
                  className={cn(
                    "relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-md border-2 border-dashed p-6 transition-colors",
                    dragActive ? "border-primary/70 bg-primary/5" : "border-muted-foreground/25",
                  )}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl || "/placeholder.svg?height=300&width=600&query=product%20image"}
                      alt="Uploaded preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : null}

                  <div
                    className={cn(
                      "relative z-10 flex w-full max-w-md flex-col items-center justify-center rounded-md p-4 text-center",
                      imageUrl ? "bg-background/60 backdrop-blur-md" : "",
                    )}
                  >
                    <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                    <div className="text-sm font-medium">Click to upload or drag and drop</div>
                    <div className="text-xs text-muted-foreground">PNG, JPG, or WEBP up to 5MB</div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={(e) => {
                          e.stopPropagation()
                          pickFile()
                        }} 
                        size="sm"
                      >
                        Replace
                      </Button>
                      {imageUrl ? (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation()
                            clearImage()
                          }} 
                          size="sm"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {form.formState.errors.image ? (
                  <p className="text-sm text-destructive">{form.formState.errors.image.message as string}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Optional. Looks great on the table and digital board.</p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sizes & Prices</Label>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add size
                </Button>
              </div>

              <div className="grid gap-3">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className={cn("grid items-end gap-3 rounded-md border border-gray-300 bg-white p-3 sm:grid-cols-[1fr,1fr,auto]")}
                  >
                    <div className="grid gap-2">
                      <Label htmlFor={`variants.${idx}.name`}>Size</Label>
                      <Input
                        id={`variants.${idx}.name`}
                        placeholder="Short or Tall"
                        {...form.register(`variants.${idx}.name` as const)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`variants.${idx}.price`}>Price (R)</Label>
                      <Controller
                        name={`variants.${idx}.price` as const}
                        control={form.control}
                        render={({ field }) => (
                          <div className="relative">
                            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                              R
                            </span>
                            <Input
                              id={`variants.${idx}.price`}
                              type="text"
                              inputMode="decimal"
                              className="pl-6"
                              value={field.value || ""}
                              onChange={(e) => {
                                const raw = e.currentTarget.value.replace(/[^\d.]/g, "")
                                const num = Number.parseFloat(raw)
                                field.onChange(Number.isFinite(num) ? num : "")
                              }}
                              placeholder="0"
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove size ${idx + 1}`}
                        onClick={() => remove(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {form.formState.errors.variants ? (
                  <p className="text-sm text-destructive">
                    {(form.formState.errors.variants as any)?.message ?? "Please check variant details"}
                  </p>
                ) : null}
              </div>
            </div>

            <Separator />

            {/* Extras Section */}
            <div className="space-y-3">
              <CheckboxMultiSelect
                label="Available Extras"
                options={extrasOptions}
                selectedValues={form.watch("extras")}
                onSelectionChange={(values) => form.setValue("extras", values)}
                htmlFor="extras-group"
              />
            </div>

            <Separator />

            <div className="space-y-6">
              <CheckboxMultiSelect
                label="Platforms"
                options={["Display Menu", "Mobile App", "Other"]}
                selectedValues={form.watch("platforms")}
                onSelectionChange={(values) => form.setValue("platforms", values)}
                htmlFor="platforms-group"
              />

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {form.watch("tags").map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const currentTags = form.getValues("tags")
                          form.setValue(
                            "tags",
                            currentTags.filter((_, i) => i !== index),
                          )
                        }}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter or comma to add)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value && !form.getValues("tags").includes(value)) {
                        form.setValue("tags", [...form.getValues("tags"), value])
                        e.currentTarget.value = ""
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.currentTarget.value.trim()
                    if (value && !form.getValues("tags").includes(value)) {
                      form.setValue("tags", [...form.getValues("tags"), value])
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 mt-2 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
              <div className="flex w-full items-center justify-between gap-2">
                {isEditing ? (
                  <Button type="button" variant="destructive" onClick={() => setShowDeleteModal(true)}>
                    Delete
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{isEditing ? "Save changes" : "Create item"}</Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "<strong>{initialItem?.name}</strong>"?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Create inspectable version of ItemForm  
export const InspectableItemForm = withInspector(
  ItemForm,
  'ItemForm',
  'item-form.tsx (coffee-menu component)',
  'apps/admin/src/coffee-menu/components/item-form.tsx',
  84
)
