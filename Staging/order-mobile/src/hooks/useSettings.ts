import { useState, useEffect } from 'react'
import { useSupabase } from '../lib/useSupabase'

interface AppSettings {
  taxesEnabled: boolean
  taxRate: number
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    taxesEnabled: true, // Default to enabled
    taxRate: 0.085 // Default 8.5%
  })
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', ['taxes_enabled', 'tax_rate'])

        if (error) throw error

        const settingsMap = data.reduce((acc: Record<string, any>, setting: any) => {
          acc[setting.key] = setting.value
          return acc
        }, {} as Record<string, any>)

        setSettings({
          taxesEnabled: settingsMap.taxes_enabled === true || settingsMap.taxes_enabled === 'true',
          taxRate: Number(settingsMap.tax_rate) || 0.085
        })
      } catch (error) {
        console.error('Error loading settings:', error)
        // Keep defaults on error
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [supabase])

  return { settings, loading }
}

// Helper functions for tax calculations
export const useTaxCalculations = () => {
  const { settings } = useSettings()

  const calculateSubtotal = (items: any[]) => {
    if (!items || !Array.isArray(items)) return 0
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 1
      return sum + (price * quantity)
    }, 0)
  }

  const calculateTax = (subtotal: number) => {
    return settings.taxesEnabled ? subtotal * settings.taxRate : 0
  }

  const calculateTotal = (items: any[]) => {
    const subtotal = calculateSubtotal(items)
    const tax = calculateTax(subtotal)
    return subtotal + tax
  }

  return {
    settings,
    calculateSubtotal,
    calculateTax,
    calculateTotal
  }
}
