import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isWithinBusinessHours, type WeeklyHours, type SpecialHour } from '../utils/businessHours'
import { createSupabaseClient } from '@order-app/lib'

// Use centralized supabase client to avoid multiple instances
let supabaseClient: any = null

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient()
  }
  return Promise.resolve(supabaseClient)
}

interface UnavailableState {
  isUnavailable: boolean
  lastChecked: number
  manuallyUnavailable: boolean
  outsideBusinessHours: boolean
  weeklyHours: WeeklyHours | null
  specialHours: SpecialHour[]
  setUnavailable: (unavailable: boolean) => void
  checkUnavailableStatus: () => Promise<void>
  forceCheckStatus: () => Promise<void>
}

export const useUnavailableStore = create<UnavailableState>()(
  persist(
    (set, get) => ({
      isUnavailable: false,
      lastChecked: 0,
      manuallyUnavailable: false,
      outsideBusinessHours: false,
      weeklyHours: null,
      specialHours: [],

      setUnavailable: (unavailable: boolean) => {
        set({ isUnavailable: unavailable, lastChecked: Date.now() })
      },

      checkUnavailableStatus: async () => {
        try {
          // Don't check too frequently (every 10 seconds max for real-time updates)
          const now = Date.now()
          const { lastChecked } = get()
          if (now - lastChecked < 10000) {
            return
          }

          const currentTime = new Date()
          console.log('🕐 Checking unavailable status at:', currentTime.toString())
          console.log('📅 Current day:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentTime.getDay()])
          
          const supabase = await getSupabaseClient()
          
          // Check manual unavailable setting
          const { data: unavailableData, error: unavailableError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'app_unavailable')
            .single()

          // Check weekly hours setting
          const { data: weeklyHoursData, error: weeklyHoursError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'weekly_hours')
            .single()

          // Check special hours setting
          const { data: specialHoursData, error: specialHoursError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'special_hours')
            .single()

          if (unavailableError && unavailableError.code !== 'PGRST116') {
            console.error('Error checking unavailable status:', unavailableError)
            return
          }

          if (weeklyHoursError && weeklyHoursError.code !== 'PGRST116') {
            console.error('Error checking weekly hours:', weeklyHoursError)
          }

          if (specialHoursError && specialHoursError.code !== 'PGRST116') {
            console.error('Error checking special hours:', specialHoursError)
          }

          const manuallyUnavailable = unavailableData?.value === true || unavailableData?.value === 'true'
          let outsideBusinessHours = false
          let weeklyHours = null
          let specialHours: SpecialHour[] = []

          // Get special hours data
          if (specialHoursData?.value && Array.isArray(specialHoursData.value)) {
            specialHours = specialHoursData.value as SpecialHour[]
          }

          // Check business hours if we have the data (now includes special hours)
          if (weeklyHoursData?.value) {
            weeklyHours = weeklyHoursData.value as WeeklyHours
            outsideBusinessHours = !isWithinBusinessHours(weeklyHours, currentTime, specialHours)
          }

          // App is unavailable if either manually set OR outside business hours
          const isUnavailable = manuallyUnavailable || outsideBusinessHours

          set({ 
            isUnavailable, 
            manuallyUnavailable,
            outsideBusinessHours,
            weeklyHours,
            specialHours,
            lastChecked: now 
          })
          
          console.log('🏪 App availability status:', {
            isUnavailable,
            manuallyUnavailable, 
            outsideBusinessHours,
            currentTime: currentTime.toString()
          })
        } catch (error) {
          console.error('Error checking unavailable status:', error)
        }
      },

      forceCheckStatus: async () => {
        // Force immediate check regardless of timing
        const state = get()
        set({ lastChecked: 0 }) // Reset lastChecked to force immediate check
        await state.checkUnavailableStatus()
      },
    }),
    {
      name: 'unavailable-store',
      // Persist the state and last checked time
      partialize: (state) => ({ 
        isUnavailable: state.isUnavailable, 
        manuallyUnavailable: state.manuallyUnavailable,
        outsideBusinessHours: state.outsideBusinessHours,
        weeklyHours: state.weeklyHours,
        specialHours: state.specialHours,
        lastChecked: state.lastChecked 
      }),
    }
  )
)
