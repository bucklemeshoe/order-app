import { useState, useEffect, useMemo } from 'react'
import { 
  Switch as BaseSwitch, 
  Button as BaseButton, 
  Dialog as BaseDialog, 
  DialogContent as BaseDialogContent, 
  DialogHeader as BaseDialogHeader, 
  DialogTitle as BaseDialogTitle, 
  DialogDescription as BaseDialogDescription, 
  DialogFooter as BaseDialogFooter, 
  Badge as BaseBadge, 
  Separator as BaseSeparator, 
  Label as BaseLabel, 
  Input as BaseInput 
} from '@order-app/design-system'
import { AlertTriangle } from 'lucide-react'
import { createSupabaseClient } from '@order-app/core-lib'
import { withInspector } from '../lib/inspector'

// Wrap all imported design system components with inspector
const Switch = withInspector(BaseSwitch, 'Switch', '@order-app/design-system')
const Button = withInspector(BaseButton, 'Button', '@order-app/design-system')
const Dialog = withInspector(BaseDialog, 'Dialog', '@order-app/design-system')
const DialogContent = withInspector(BaseDialogContent, 'DialogContent', '@order-app/design-system')
const DialogHeader = withInspector(BaseDialogHeader, 'DialogHeader', '@order-app/design-system')
const DialogTitle = withInspector(BaseDialogTitle, 'DialogTitle', '@order-app/design-system')
const DialogDescription = withInspector(BaseDialogDescription, 'DialogDescription', '@order-app/design-system')
const DialogFooter = withInspector(BaseDialogFooter, 'DialogFooter', '@order-app/design-system')
const Badge = withInspector(BaseBadge, 'Badge', '@order-app/design-system')
const Separator = withInspector(BaseSeparator, 'Separator', '@order-app/design-system')
const Label = withInspector(BaseLabel, 'Label', '@order-app/design-system')
const Input = withInspector(BaseInput, 'Input', '@order-app/design-system')

// Create TaxToggle as inspectable component
const TaxToggle = withInspector(
  ({ taxesEnabled, handleTaxToggle, loading }: {
    taxesEnabled: boolean;
    handleTaxToggle: (enabled: boolean) => void;
    loading: boolean;
  }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <label htmlFor="taxes-toggle" className="text-sm font-medium text-foreground cursor-pointer">
          Enable Taxes
        </label>
        <p className="text-xs text-muted-foreground">
          Apply tax calculations to orders
        </p>
      </div>
      <Switch
        id="taxes-toggle"
        checked={taxesEnabled}
        onCheckedChange={handleTaxToggle}
        disabled={loading}
      />
    </div>
  ),
  'TaxToggle',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  8
)

// Create EmergencyControls as inspectable component
const EmergencyControls = withInspector(
  ({ appUnavailable, handleUnavailableToggle }: {
    appUnavailable: boolean;
    handleUnavailableToggle: (enabled: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <label htmlFor="unavailable-toggle" className="text-sm font-medium text-foreground cursor-pointer">
          Make App Unavailable
        </label>
        <p className="text-xs text-muted-foreground">
          Immediately stop accepting new orders
        </p>
      </div>
      <Switch
        id="unavailable-toggle"
        checked={appUnavailable}
        onCheckedChange={handleUnavailableToggle}
      />
    </div>
  ),
  'EmergencyControls',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  35
)

// Create WeeklyHoursForm as inspectable component
const WeeklyHoursForm = withInspector(
  ({ weeklyHours, handleWeeklyHoursChange, daysOfWeek }: {
    weeklyHours: any;
    handleWeeklyHoursChange: (day: string, field: string, value: any) => void;
    daysOfWeek: Array<{key: string, label: string}>;
  }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        {daysOfWeek.map((day) => (
          <div key={day.key} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between gap-6">
              {/* Toggle + Day grouped together */}
              <div className="flex items-center gap-3 min-w-0">
                <Switch
                  checked={weeklyHours[day.key]?.enabled}
                  onCheckedChange={(enabled) => handleWeeklyHoursChange(day.key, 'enabled', enabled)}
                />
                <div className="text-sm text-foreground font-medium">
                  {day.label}
                </div>
              </div>
              
              {/* Time pickers with better spacing */}
              <div className="flex items-center gap-6 flex-1 justify-end">
                {/* From Time */}
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">From:</Label>
                  <Input
                    type="time"
                    value={weeklyHours[day.key]?.startTime || ''}
                    onChange={(e) => handleWeeklyHoursChange(day.key, 'startTime', e.target.value)}
                    className="w-36 text-center"
                    disabled={!weeklyHours[day.key]?.enabled}
                  />
                </div>
                
                {/* To Time */}
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">To:</Label>
                  <Input
                    type="time"
                    value={weeklyHours[day.key]?.endTime || ''}
                    onChange={(e) => handleWeeklyHoursChange(day.key, 'endTime', e.target.value)}
                    className="w-36 text-center"
                    disabled={!weeklyHours[day.key]?.enabled}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  'WeeklyHoursForm',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  68
)

// Create SpecialHoursForm as inspectable component
const SpecialHoursForm = withInspector(
  ({ newSpecialDate, setNewSpecialDate, newSpecialStartTime, setNewSpecialStartTime, newSpecialEndTime, setNewSpecialEndTime, addSpecialHours }: {
    newSpecialDate: string;
    setNewSpecialDate: (value: string) => void;
    newSpecialStartTime: string;
    setNewSpecialStartTime: (value: string) => void;
    newSpecialEndTime: string;
    setNewSpecialEndTime: (value: string) => void;
    addSpecialHours: () => void;
  }) => (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label htmlFor="special-date" className="text-xs text-muted-foreground">Date</Label>
          <Input
            id="special-date"
            type="date"
            value={newSpecialDate}
            onChange={(e) => setNewSpecialDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="special-start" className="text-xs text-muted-foreground">Start Time</Label>
          <Input
            id="special-start"
            type="time"
            value={newSpecialStartTime}
            onChange={(e) => setNewSpecialStartTime(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="special-end" className="text-xs text-muted-foreground">End Time</Label>
          <Input
            id="special-end"
            type="time"
            value={newSpecialEndTime}
            onChange={(e) => setNewSpecialEndTime(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={addSpecialHours}
            disabled={!newSpecialDate || !newSpecialStartTime || !newSpecialEndTime}
            size="sm"
            className="w-full"
          >
            Add Special Hours
          </Button>
        </div>
      </div>
    </div>
  ),
  'SpecialHoursForm',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  98
)

// Create SpecialHoursList as inspectable component
const SpecialHoursList = withInspector(
  ({ specialHours, removeSpecialHours }: {
    specialHours: Array<{id: string, date: string, startTime: string, endTime: string}>;
    removeSpecialHours: (id: string) => void;
  }) => {
    const getDayName = (dateString: string) => {
      const date = new Date(dateString)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[date.getDay()]
    }

    return (
      <div className="space-y-2">
        {specialHours.map((special) => (
          <div key={special.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-foreground">
                ({getDayName(special.date)}) {new Date(special.date).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {special.startTime} - {special.endTime}
              </div>
              <Badge variant="yellow">
                once-off
              </Badge>
            </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => removeSpecialHours(special.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      ))}
      {specialHours.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No special hours configured
        </p>
      )}
    </div>
    )
  },
  'SpecialHoursList',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  125
)

// Create ConfirmationModal as inspectable component
const ConfirmationModal = withInspector(
  ({ showUnavailableModal, setShowUnavailableModal, confirmUnavailable }: {
    showUnavailableModal: boolean;
    setShowUnavailableModal: (show: boolean) => void;
    confirmUnavailable: () => void;
  }) => (
    <Dialog open={showUnavailableModal} onOpenChange={setShowUnavailableModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make App Unavailable?</DialogTitle>
          <DialogDescription>
            Are you sure you want to make the app unavailable? This will prevent customers from placing new orders.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowUnavailableModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={confirmUnavailable}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  'ConfirmationModal',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  175
)

// Create OrderNumberSettings component with inspector support
const OrderNumberSettings = withInspector(
  ({ orderNumberStart, setOrderNumberStart, currentOrderNumber, handleOrderNumberUpdate }: {
    orderNumberStart: string;
    setOrderNumberStart: (value: string) => void;
    currentOrderNumber: string;
    handleOrderNumberUpdate: () => void;
  }) => {
    const hasExistingOrders = parseInt(currentOrderNumber) > parseInt(orderNumberStart)
    
    return (
      <div className="space-y-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="order-start" className="text-sm font-medium">
              Starting Number
            </Label>
            <div className="flex gap-2">
              <Input
                id="order-start"
                type="number"
                value={orderNumberStart}
                onChange={(e) => setOrderNumberStart(e.target.value)}
                placeholder="1001"
                className="flex-1"
                min="1"
                disabled={hasExistingOrders}
              />
              <Button 
                size="sm" 
                onClick={handleOrderNumberUpdate}
                disabled={hasExistingOrders}
              >
                Update
              </Button>
            </div>
            {hasExistingOrders ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <div className="text-xs text-amber-700">
                    <p className="font-medium mb-1">Starting number is locked</p>
                    <p>To choose a new starting number you must contact support.</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                New orders will start from this number and count up sequentially
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Current Number
            </Label>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-foreground">#{currentOrderNumber}</span>
                <span className="text-sm text-muted-foreground">(next order number)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This will be assigned to the next order
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  'OrderNumberSettings',
  'Settings.tsx (local component)',
  'apps/admin/src/pages/Settings.tsx',
  235
)

// Create Settings as a proper React component with inspector support
const Settings = withInspector(
  () => {
    const [taxesEnabled, setTaxesEnabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [appUnavailable, setAppUnavailable] = useState(false)
    const [showUnavailableModal, setShowUnavailableModal] = useState(false)
    const [specialHours, setSpecialHours] = useState<Array<{id: string, date: string, startTime: string, endTime: string}>>([])
    const [newSpecialDate, setNewSpecialDate] = useState('')
    const [newSpecialStartTime, setNewSpecialStartTime] = useState('')
    const [newSpecialEndTime, setNewSpecialEndTime] = useState('')
    
    // Weekly hours - days of the week
    const [weeklyHours, setWeeklyHours] = useState({
      monday: { startTime: '08:00', endTime: '17:00', enabled: true },
      tuesday: { startTime: '08:00', endTime: '17:00', enabled: true },
      wednesday: { startTime: '08:00', endTime: '17:00', enabled: true },
      thursday: { startTime: '08:00', endTime: '17:00', enabled: true },
      friday: { startTime: '08:00', endTime: '17:00', enabled: true },
      saturday: { startTime: '09:00', endTime: '15:00', enabled: true },
      sunday: { startTime: '09:00', endTime: '15:00', enabled: false }
    })
    
    // Order numbering state
    const [orderNumberStart, setOrderNumberStart] = useState('1001')
    const [currentOrderNumber, setCurrentOrderNumber] = useState('1001')
    
    const supabase = useMemo(() => createSupabaseClient(), [])
    
    const daysOfWeek = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' }
    ]

    // Load settings from database
    useEffect(() => {
      const loadSettings = async () => {
        try {
          // Load both taxes and unavailable settings
          const { data: taxesData, error: taxesError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'taxes_enabled')
            .single()

          const { data: unavailableData, error: unavailableError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'app_unavailable')
            .single()

          const { data: weeklyHoursData, error: weeklyHoursError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'weekly_hours')
            .single()

          const { data: specialHoursData, error: specialHoursError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'special_hours')
            .single()

          const { data: orderStartData, error: orderStartError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'order_number_start')
            .single()
          const { data: currentOrderData, error: currentOrderError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'current_order_number')
            .single()

          if (taxesError && taxesError.code !== 'PGRST116') throw taxesError
          if (unavailableError && unavailableError.code !== 'PGRST116') throw unavailableError
          if (weeklyHoursError && weeklyHoursError.code !== 'PGRST116') throw weeklyHoursError
          if (specialHoursError && specialHoursError.code !== 'PGRST116') throw specialHoursError
          if (orderStartError && orderStartError.code !== 'PGRST116') throw orderStartError
          if (currentOrderError && currentOrderError.code !== 'PGRST116') throw currentOrderError

          // Set taxes setting
          setTaxesEnabled(taxesData?.value === true || taxesData?.value === 'true')
          
          // Set unavailable setting
          setAppUnavailable(unavailableData?.value === true || unavailableData?.value === 'true')

          // Set weekly hours setting
          if (weeklyHoursData?.value) {
            setWeeklyHours(weeklyHoursData.value)
          }

          // Set special hours setting
          if (specialHoursData?.value && Array.isArray(specialHoursData.value)) {
            setSpecialHours(specialHoursData.value)
          }

          // Set order numbering settings
          if (orderStartData?.value) {
            setOrderNumberStart(String(orderStartData.value))
          }
          if (currentOrderData?.value) {
            setCurrentOrderNumber(String(currentOrderData.value))
          }
        } catch (error) {
          console.error('Error loading settings:', error)
          // Default values if we can't load
          setTaxesEnabled(true)
          setAppUnavailable(false)
        } finally {
          setLoading(false)
        }
      }

      loadSettings()
    }, [supabase])

    // Save setting when changed
    const handleTaxToggle = async (enabled: boolean) => {
      setTaxesEnabled(enabled)
      
      try {
        const { error } = await supabase
          .from('app_settings')
          .update({ value: enabled })
          .eq('key', 'taxes_enabled')

        if (error) throw error
      } catch (error) {
        console.error('Error saving setting:', error)
        // Revert the toggle if save failed
        setTaxesEnabled(!enabled)
      }
    }

    // Handle order number update
    const handleOrderNumberUpdate = async () => {
      try {
        const startNumber = parseInt(orderNumberStart)
        if (isNaN(startNumber) || startNumber < 1) {
          console.error('Invalid order number start value')
          return
        }

        // Update order_number_start setting
        const { error: startError } = await supabase
          .from('app_settings')
          .upsert({ 
            key: 'order_number_start', 
            value: startNumber,
            description: 'The starting number for the order numbering sequence'
          })

        if (startError) throw startError

        // Reset current_order_number to the start number
        const { error: currentError } = await supabase
          .from('app_settings')
          .upsert({ 
            key: 'current_order_number', 
            value: startNumber,
            description: 'The current order number counter - next order will use this number then increment'
          })

        if (currentError) throw currentError

        // Update local state
        setCurrentOrderNumber(String(startNumber))
        
        console.log('Order numbering settings updated successfully')
      } catch (error) {
        console.error('Error updating order number settings:', error)
      }
    }

    // Handle weekly hours changes
    const handleWeeklyHoursChange = async (day: string, field: 'startTime' | 'endTime' | 'enabled', value: string | boolean) => {
      const updatedHours = {
        ...weeklyHours,
        [day]: {
          ...weeklyHours[day as keyof typeof weeklyHours],
          [field]: value
        }
      }
      
      setWeeklyHours(updatedHours)
      
      try {
        const { error: updateError } = await supabase
          .from('app_settings')
          .update({ value: updatedHours })
          .eq('key', 'weekly_hours')
        
        if (updateError && updateError.code !== 'PGRST116') {
          // If the setting doesn't exist, create it
          const { error: insertError } = await supabase
            .from('app_settings')
            .insert({
              key: 'weekly_hours',
              value: updatedHours,
              description: 'Weekly operating hours for the application'
            })
          
          if (insertError) throw insertError
        }
      } catch (error) {
        console.error('Error saving weekly hours:', error)
        // Revert on error
        setWeeklyHours(weeklyHours)
      }
    }

    const handleUnavailableToggle = async (enabled: boolean) => {
      if (enabled) {
        // Show confirmation modal
        setShowUnavailableModal(true)
      } else {
        // Directly disable without confirmation
        setAppUnavailable(false)
        setShowUnavailableModal(false) // Reset modal state
        
        try {
          const { error: updateError } = await supabase
            .from('app_settings')
            .update({ value: false })
            .eq('key', 'app_unavailable')
          
          if (updateError && updateError.code !== 'PGRST116') {
            // If the setting doesn't exist, create it
            const { error: insertError } = await supabase
              .from('app_settings')
              .insert({
                key: 'app_unavailable',
                value: false,
                description: 'Whether the app is unavailable for orders'
              })
            
            if (insertError) throw insertError
          }
        } catch (error) {
          console.error('Error saving unavailable setting:', error)
          // Revert on error
          setAppUnavailable(true)
        }
      }
    }

    const confirmUnavailable = async () => {
      setAppUnavailable(true)
      setShowUnavailableModal(false)
      
      try {
        const { error: updateError } = await supabase
          .from('app_settings')
          .update({ value: true })
          .eq('key', 'app_unavailable')
        
        if (updateError && updateError.code !== 'PGRST116') {
          // If the setting doesn't exist, create it
          const { error: insertError } = await supabase
            .from('app_settings')
            .insert({
              key: 'app_unavailable',
              value: true,
              description: 'Whether the app is unavailable for orders'
            })
          
          if (insertError) throw insertError
        }
        
        console.log('App marked as unavailable')
      } catch (error) {
        console.error('Error saving unavailable setting:', error)
        // Revert on error
        setAppUnavailable(false)
      }
    }

    // Add special hours
    const addSpecialHours = async () => {
      if (newSpecialDate && newSpecialStartTime && newSpecialEndTime) {
        const id = Date.now().toString()
        const newSpecial = {
          id,
          date: newSpecialDate,
          startTime: newSpecialStartTime,
          endTime: newSpecialEndTime
        }
        
        const updatedSpecialHours = [...specialHours, newSpecial]
        setSpecialHours(updatedSpecialHours)
        
        try {
          const { error: updateError } = await supabase
            .from('app_settings')
            .update({ value: updatedSpecialHours })
            .eq('key', 'special_hours')
          
          if (updateError && updateError.code !== 'PGRST116') {
            // If the setting doesn't exist, create it
            const { error: insertError } = await supabase
              .from('app_settings')
              .insert({
                key: 'special_hours',
                value: updatedSpecialHours,
                description: 'Special hours that override regular weekly hours'
              })
            
            if (insertError) throw insertError
          }
          
          // Clear form
          setNewSpecialDate('')
          setNewSpecialStartTime('')
          setNewSpecialEndTime('')
          
          console.log('Special hours added successfully')
        } catch (error) {
          console.error('Error saving special hours:', error)
          // Revert on error
          setSpecialHours(specialHours)
        }
      }
    }

    // Remove special hours
    const removeSpecialHours = async (id: string) => {
      const updatedSpecialHours = specialHours.filter(sh => sh.id !== id)
      setSpecialHours(updatedSpecialHours)
      
      try {
        const { error } = await supabase
          .from('app_settings')
          .update({ value: updatedSpecialHours })
          .eq('key', 'special_hours')
        
        if (error) throw error
        console.log('Special hours updated successfully')
      } catch (error) {
        console.error('Error removing special hours:', error)
        // Revert on error
        setSpecialHours(specialHours)
      }
    }

    return (
      <div className="grid gap-6">
        <section className="grid gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your application preferences</p>
        </section>

        {/* General Settings */}
        <section className="max-w-4xl">
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-medium text-foreground mb-4">General</h2>
                <TaxToggle 
                  taxesEnabled={taxesEnabled} 
                  handleTaxToggle={handleTaxToggle} 
                  loading={loading} 
                />
              </div>

              <Separator />

              {/* Emergency Toggle */}
              <div>
                <h2 className="text-base font-medium text-foreground mb-4">Emergency Controls</h2>
                <EmergencyControls 
                  appUnavailable={appUnavailable} 
                  handleUnavailableToggle={handleUnavailableToggle} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Order Numbers */}
        <section className="max-w-4xl">
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-medium text-foreground">Order Numbers</h2>
                  <p className="text-xs text-muted-foreground">Configure how order numbers are displayed to customers and admin</p>
                </div>
                <OrderNumberSettings
                  orderNumberStart={orderNumberStart}
                  setOrderNumberStart={setOrderNumberStart}
                  currentOrderNumber={currentOrderNumber}
                  handleOrderNumberUpdate={handleOrderNumberUpdate}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Available Times - App Hours */}
        <section className="max-w-4xl">
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-medium text-foreground">Available Times</h2>
                  <p className="text-xs text-muted-foreground">Configure when the app accepts orders</p>
                </div>
                
                {/* App Section - Weekly Hours */}
                <WeeklyHoursForm 
                  weeklyHours={weeklyHours} 
                  handleWeeklyHoursChange={handleWeeklyHoursChange} 
                  daysOfWeek={daysOfWeek} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Special Hours */}
        <section className="max-w-4xl">
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-medium text-foreground">Special Hours</h2>
                  <p className="text-xs text-muted-foreground">Override regular hours for specific dates</p>
                </div>
                
                {/* Add Special Hours Form */}
                <SpecialHoursForm 
                  newSpecialDate={newSpecialDate}
                  setNewSpecialDate={setNewSpecialDate}
                  newSpecialStartTime={newSpecialStartTime}
                  setNewSpecialStartTime={setNewSpecialStartTime}
                  newSpecialEndTime={newSpecialEndTime}
                  setNewSpecialEndTime={setNewSpecialEndTime}
                  addSpecialHours={addSpecialHours}
                />

                {/* Special Hours List */}
                <SpecialHoursList 
                  specialHours={specialHours}
                  removeSpecialHours={removeSpecialHours}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation Modal */}
        <ConfirmationModal 
          showUnavailableModal={showUnavailableModal}
          setShowUnavailableModal={setShowUnavailableModal}
          confirmUnavailable={confirmUnavailable}
        />
      </div>
    )
  },
  'Settings',
  'Settings.tsx (page component)', 
  'apps/admin/src/pages/Settings.tsx',
  7
)

export default Settings