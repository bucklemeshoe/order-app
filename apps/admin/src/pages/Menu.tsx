import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import { loadItems, saveItem, deleteItem, toggleItemAvailability, updateItemPositions, applyReorderByIds } from '../coffee-menu/lib/supabase-storage'
import type { MenuItem } from '../coffee-menu/types/menu'
import { MenuTable } from '../coffee-menu/components/menu-table'
import { ItemForm } from '../coffee-menu/components/item-form'
import { Logo } from '../coffee-menu/components/logo'
import { 
  Button as BaseButton, 
  Card as BaseCard, 
  CardContent as BaseCardContent, 
  CardHeader as BaseCardHeader, 
  CardTitle as BaseCardTitle, 
  CardDescription as BaseCardDescription,
  Separator as BaseSeparator 
} from '@order-app/design-system'
import { withInspector } from '../lib/inspector'

// Create inspectable versions of components
const Button = withInspector(BaseButton, 'Button', '@order-app/design-system')
const Separator = withInspector(BaseSeparator, 'Separator', '@order-app/design-system')

// Create StatsCard component with original padding for Menu stats
const StatsCard = withInspector(
  ({ children, className = "", ...props }: React.ComponentProps<typeof BaseCard>) => (
    <BaseCard className={`py-6 ${className}`} {...props}>
      {children}
    </BaseCard>
  ),
  'StatsCard',
  'Menu.tsx (local component)',
  'apps/admin/src/pages/Menu.tsx',
  32
)

const StatsCardContent = withInspector(BaseCardContent, 'StatsCardContent', '@order-app/design-system')
const StatsCardHeader = withInspector(BaseCardHeader, 'StatsCardHeader', '@order-app/design-system')
const StatsCardTitle = withInspector(BaseCardTitle, 'StatsCardTitle', '@order-app/design-system')
const StatsCardDescription = withInspector(BaseCardDescription, 'StatsCardDescription', '@order-app/design-system')

// Create MenuPage as a proper React component with inspector support
const MenuPage = withInspector(
  () => {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)

  // Load items from database on mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await loadItems()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu items')
        console.error('Failed to load menu items:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMenuItems()
  }, [])

  const stats = useMemo(() => {
    const total = items.length
    const available = items.filter((i) => i.available).length
    const categories = new Set(items.map((i) => i.category)).size
    return { total, available, categories }
  }, [items])

  async function upsertItem(item: MenuItem) {
    try {
      const savedItem = await saveItem(item)
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === savedItem.id)
        return idx >= 0 
          ? [...prev.slice(0, idx), savedItem, ...prev.slice(idx + 1)]
          : [savedItem, ...prev]
      })
    } catch (err) {
      console.error('Failed to save item:', err)
      setError(err instanceof Error ? err.message : 'Failed to save item')
      throw err // Re-throw the error so ItemForm can handle it for toast
    }
  }

  function onCreateClick() {
    setEditing(null)
    setOpen(true)
  }

  function onEdit(item: MenuItem) {
    setEditing(item)
    setOpen(true)
  }

  async function onDelete(id: string) {
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      console.error('Failed to delete item:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }

  async function onBulkDelete(ids: string[]) {
    try {
      // Delete items one by one (could be optimized with batch delete)
      await Promise.all(ids.map(id => deleteItem(id)))
      setItems((prev) => {
        const toDelete = new Set(ids)
        return prev.filter((i) => !toDelete.has(i.id))
      })
    } catch (err) {
      console.error('Failed to delete items:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete items')
    }
  }

  async function onToggleAvailability(id: string) {
    try {
      const item = items.find(i => i.id === id)
      if (!item) return
      
      const newAvailability = !item.available
      await toggleItemAvailability(id, newAvailability)
      
      setItems((prev) => 
        prev.map((i) => (i.id === id ? { ...i, available: newAvailability } : i))
      )
    } catch (err) {
      console.error('Failed to toggle availability:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle availability')
    }
  }

  async function onReorder(orderedIds: string[]) {
    try {
      setItems((prev) => {
        const next = applyReorderByIds(prev, orderedIds)
        
        // Prepare position updates for database
        const positionUpdates: Array<{ id: string; position: number }> = []
        next.forEach(item => {
          const originalItem = prev.find(p => p.id === item.id)
          if (originalItem && originalItem.position !== item.position) {
            positionUpdates.push({ id: item.id, position: item.position })
          }
        })
        
        // Save position changes to database
        if (positionUpdates.length > 0) {
          updateItemPositions(positionUpdates).catch(err => {
            console.error('Failed to persist position changes:', err)
            setError(err instanceof Error ? err.message : 'Failed to save item order')
          })
        }
        
        return next
      })
    } catch (err) {
      console.error('Failed to reorder items:', err)
      setError(err instanceof Error ? err.message : 'Failed to reorder items')
    }
  }

  if (loading) {
    return (
      <div className="coffee-menu-admin">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          <span className="ml-3">Loading menu items...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="coffee-menu-admin">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="coffee-menu-admin">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link to="/menu-display">
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
        <StatsCard>
          <StatsCardHeader className="pb-2">
            <StatsCardTitle>Total items</StatsCardTitle>
            <StatsCardDescription>Count of menu entries</StatsCardDescription>
          </StatsCardHeader>
          <StatsCardContent>
            <div className="text-3xl font-semibold">{stats.total}</div>
          </StatsCardContent>
        </StatsCard>
        <StatsCard>
          <StatsCardHeader className="pb-2">
            <StatsCardTitle>Available</StatsCardTitle>
            <StatsCardDescription>Currently for sale</StatsCardDescription>
          </StatsCardHeader>
          <StatsCardContent>
            <div className="text-3xl font-semibold">{stats.available}</div>
          </StatsCardContent>
        </StatsCard>
        <StatsCard>
          <StatsCardHeader className="pb-2">
            <StatsCardTitle>Categories</StatsCardTitle>
            <StatsCardDescription>Unique categories</StatsCardDescription>
          </StatsCardHeader>
          <StatsCardContent>
            <div className="text-3xl font-semibold">{stats.categories}</div>
          </StatsCardContent>
        </StatsCard>
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
    </div>
  )
  },
  'MenuPage',
  'Menu.tsx (page component)',
  'apps/admin/src/pages/Menu.tsx',
  29
)

export default MenuPage


