"use client"

import { useEffect, useState } from "react"
import { getAllSettings, updateSetting } from "@/lib/api/settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  AdminPage,
  AdminHeader,
  AdminCard,
  AdminSectionHeader,
  AdminToggleRow,
  AdminInnerCard,
  AdminFormGroup
} from "@/components/admin/admin-ui"
import {
  Clock,
  Percent,
  Power,
  Save,
  Loader2,
  Truck,
  CreditCard,
  Link as LinkIcon,
  Package,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  Send,
} from "lucide-react"

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

const TIME_OPTIONS = [
  "closed",
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
  "23:00",
]

type WeeklyHoursState = Record<string, { open: string; close: string }>

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState("general")
  const [taxRate, setTaxRate] = useState("15")
  const [appUnavailable, setAppUnavailable] = useState(false)
  const [taxesEnabled, setTaxesEnabled] = useState(true)
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursState>({})
  const [savingTax, setSavingTax] = useState(false)
  const [savingAvailability, setSavingAvailability] = useState(false)
  const [savingHours, setSavingHours] = useState(false)
  const [savingTaxesEnabled, setSavingTaxesEnabled] = useState(false)

  // Fulfilment & payment
  const [collectionEnabled, setCollectionEnabled] = useState(true)
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState("0")
  const [yocoEnabled, setYocoEnabled] = useState(false)
  const [yocoSecretKey, setYocoSecretKey] = useState("")
  const [yocoMaskedKey, setYocoMaskedKey] = useState<string | null>(null)
  const [yocoHasKey, setYocoHasKey] = useState(false)
  const [yocoEnvironment, setYocoEnvironment] = useState("test")
  const [snapscanEnabled, setSnapscanEnabled] = useState(false)
  const [snapscanLink, setSnapscanLink] = useState("")
  const [savingFulfilment, setSavingFulfilment] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)

  // Support Channels
  const [supportWhatsapp, setSupportWhatsapp] = useState("")
  const [supportTelegram, setSupportTelegram] = useState("")
  const [supportSms, setSupportSms] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [savingSupport, setSavingSupport] = useState(false)
  const [initialConfig, setInitialConfig] = useState<Record<string, any>>({})

  useEffect(() => {
    async function load() {
      try {
        const settings = await getAllSettings()
        const settingsMap: Record<string, any> = {}
        settings.forEach((s: any) => { settingsMap[s.key] = s.value })

        if (settingsMap.tax_rate !== undefined) {
          setTaxRate(String(parseFloat(String(settingsMap.tax_rate)) * 100))
        }
        if (settingsMap.app_unavailable !== undefined) {
          setAppUnavailable(settingsMap.app_unavailable === true || settingsMap.app_unavailable === "true")
        }
        if (settingsMap.taxes_enabled !== undefined) {
          setTaxesEnabled(settingsMap.taxes_enabled === true || settingsMap.taxes_enabled === "true")
        }
        if (settingsMap.weekly_hours) {
          setWeeklyHours(settingsMap.weekly_hours)
        } else {
          const defaultHours: WeeklyHoursState = {}
          DAYS.forEach((d) => { defaultHours[d.key] = { open: "08:00", close: "17:00" } })
          setWeeklyHours(defaultHours)
        }
        // Fulfilment & payment
        if (settingsMap.collection_enabled !== undefined) setCollectionEnabled(settingsMap.collection_enabled === true || settingsMap.collection_enabled === "true")
        if (settingsMap.delivery_enabled !== undefined) setDeliveryEnabled(settingsMap.delivery_enabled === true || settingsMap.delivery_enabled === "true")
        if (settingsMap.delivery_fee !== undefined) setDeliveryFee(String(settingsMap.delivery_fee || "0"))
        if (settingsMap.yoco_enabled !== undefined) setYocoEnabled(settingsMap.yoco_enabled === true || settingsMap.yoco_enabled === "true")
        // Load Yoco credentials from secure API
        try {
          const res = await fetch("/api/admin/payment-config")
          if (res.ok) {
            const creds = await res.json()
            setYocoHasKey(creds.hasSecretKey)
            setYocoMaskedKey(creds.maskedSecretKey)
            const env = creds.environment || "test"
            setYocoEnvironment(env)
            setInitialConfig(prev => ({ ...prev, yocoEnvironment: env }))
          }
        } catch {}
        if (settingsMap.snapscan_enabled !== undefined) setSnapscanEnabled(settingsMap.snapscan_enabled === true || settingsMap.snapscan_enabled === "true")
        if (settingsMap.snapscan_link !== undefined) setSnapscanLink(String(settingsMap.snapscan_link || ""))

        // Support
        if (settingsMap.support_whatsapp !== undefined) setSupportWhatsapp(settingsMap.support_whatsapp)
        if (settingsMap.support_telegram !== undefined) setSupportTelegram(settingsMap.support_telegram)
        if (settingsMap.support_sms !== undefined) setSupportSms(settingsMap.support_sms)
        if (settingsMap.support_email !== undefined) setSupportEmail(settingsMap.support_email)

          let initCollection = settingsMap.collection_enabled === true || settingsMap.collection_enabled === "true"
          let initDelivery = settingsMap.delivery_enabled === true || settingsMap.delivery_enabled === "true"

          if (initCollection && initDelivery) {
            initDelivery = false // Enforce either/or logic
          }

          setCollectionEnabled(initCollection)
          setDeliveryEnabled(initDelivery)
          
          setInitialConfig({
            taxRate: settingsMap.tax_rate !== undefined ? String(parseFloat(String(settingsMap.tax_rate)) * 100) : "15",
            weeklyHours: JSON.stringify(settingsMap.weekly_hours || (() => {
              const h: WeeklyHoursState = {}
              DAYS.forEach((d) => { h[d.key] = { open: "08:00", close: "17:00" } })
              return h
            })()),
            collectionEnabled: initCollection,
            deliveryEnabled: initDelivery,
          deliveryFee: String(settingsMap.delivery_fee || "0"),
          yocoEnabled: settingsMap.yoco_enabled === true || settingsMap.yoco_enabled === "true",
          snapscanEnabled: settingsMap.snapscan_enabled === true || settingsMap.snapscan_enabled === "true",
          snapscanLink: String(settingsMap.snapscan_link || ""),
          supportWhatsapp: settingsMap.support_whatsapp || "",
          supportTelegram: settingsMap.support_telegram || "",
          supportSms: settingsMap.support_sms || "",
          supportEmail: settingsMap.support_email || ""
        })

      } catch {
        toast({ title: "Failed to load settings", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function saveTaxRate() {
    const rate = parseFloat(taxRate) / 100
    if (isNaN(rate) || rate < 0 || rate > 1) {
      toast({ title: "Tax rate must be between 0 and 100", variant: "destructive" })
      return
    }
    setSavingTax(true)
    try {
      await updateSetting("tax_rate", rate)
      setInitialConfig(prev => ({ ...prev, taxRate }))
      toast({ title: "Tax rate saved", description: `${taxRate}%` })
    } catch {
      toast({ title: "Failed to save", variant: "destructive" })
    } finally {
      setSavingTax(false)
    }
  }

  async function saveAvailability(value: boolean) {
    setSavingAvailability(true)
    try {
      await updateSetting("app_unavailable", value)
      setAppUnavailable(value)
      toast({ title: value ? "App marked unavailable" : "App is now available" })
    } catch {
      toast({ title: "Failed to save", variant: "destructive" })
    } finally {
      setSavingAvailability(false)
    }
  }

  async function saveTaxesEnabled(value: boolean) {
    setSavingTaxesEnabled(true)
    try {
      await updateSetting("taxes_enabled", value)
      setTaxesEnabled(value)
      toast({ title: value ? "Taxes enabled" : "Taxes disabled" })
    } catch {
      toast({ title: "Failed to save", variant: "destructive" })
    } finally {
      setSavingTaxesEnabled(false)
    }
  }

  function updateDayHours(day: string, field: "open" | "close", value: string) {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  async function saveHours() {
    setSavingHours(true)
    try {
      await updateSetting("weekly_hours", weeklyHours)
      setInitialConfig(prev => ({ ...prev, weeklyHours: JSON.stringify(weeklyHours) }))
      toast({ title: "Business hours saved" })
    } catch {
      toast({ title: "Failed to save hours", variant: "destructive" })
    } finally {
      setSavingHours(false)
    }
  }

  async function saveFulfilmentSettings() {
    setSavingFulfilment(true)
    try {
      await updateSetting("collection_enabled", collectionEnabled)
      await updateSetting("delivery_enabled", deliveryEnabled)
      await updateSetting("delivery_fee", parseFloat(deliveryFee) || 0)
      setInitialConfig(prev => ({ ...prev, collectionEnabled, deliveryEnabled, deliveryFee }))
      toast({ title: "Fulfilment settings saved" })
    } catch {
      toast({ title: "Failed to save", variant: "destructive" })
    } finally {
      setSavingFulfilment(false)
    }
  }

  async function savePaymentSettings() {
    setSavingPayment(true)
    try {
      await updateSetting("yoco_enabled", yocoEnabled)
      // Save Yoco credentials via secure API (only if a new key was entered)
      if (yocoSecretKey) {
        const res = await fetch("/api/admin/payment-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secretKey: yocoSecretKey,
            environment: yocoEnvironment,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setYocoMaskedKey(data.maskedSecretKey)
          setYocoHasKey(true)
          setYocoSecretKey("") // Clear the input after saving
        } else {
          const err = await res.json()
          toast({ title: `Failed to save Yoco key: ${err.error}`, variant: "destructive" })
          setSavingPayment(false)
          return
        }
      }
      await updateSetting("snapscan_enabled", snapscanEnabled)
      await updateSetting("snapscan_link", snapscanLink)
      setInitialConfig(prev => ({ ...prev, yocoEnabled, yocoEnvironment, snapscanEnabled, snapscanLink }))
      toast({ title: "Payment settings saved" })
    } catch {
      toast({ title: "Failed to save", variant: "destructive" })
    } finally {
      setSavingPayment(false)
    }
  }

  async function saveSupportSettings() {
    setSavingSupport(true)
    try {
      await updateSetting("support_whatsapp", supportWhatsapp.trim())
      await updateSetting("support_telegram", supportTelegram.trim())
      await updateSetting("support_sms", supportSms.trim())
      await updateSetting("support_email", supportEmail.trim())
      setInitialConfig(prev => ({ ...prev, supportWhatsapp: supportWhatsapp.trim(), supportTelegram: supportTelegram.trim(), supportSms: supportSms.trim(), supportEmail: supportEmail.trim() }))
      toast({ title: "Support settings saved" })
    } catch {
      toast({ title: "Failed to save support settings", variant: "destructive" })
    } finally {
      setSavingSupport(false)
    }
  }

  if (loading) {
    return (
      <AdminPage className="flex items-center justify-center py-20 bg-transparent">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </AdminPage>
    )
  }

  return (
    <AdminPage layout="left-aligned">
      <Toaster />

      <AdminHeader 
        title="Settings" 
        description="Configure your store" 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <TabsList className="flex flex-row overflow-x-auto w-full md:w-48 md:flex-col h-auto bg-transparent p-0 gap-2 items-start justify-start flex-shrink-0 border-none no-scrollbar">
          <TabsTrigger value="general" className="w-full justify-start text-left data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-lg px-4 py-2.5 transition-all whitespace-nowrap">General</TabsTrigger>
          <TabsTrigger value="fulfilment" className="w-full justify-start text-left data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-lg px-4 py-2.5 transition-all whitespace-nowrap">Fulfilment</TabsTrigger>
          <TabsTrigger value="payment" className="w-full justify-start text-left data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-lg px-4 py-2.5 transition-all whitespace-nowrap">Payment</TabsTrigger>
          <TabsTrigger value="hours" className="w-full justify-start text-left data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-lg px-4 py-2.5 transition-all whitespace-nowrap">Business Hours</TabsTrigger>
          <TabsTrigger value="support" className="w-full justify-start text-left data-[state=active]:bg-card data-[state=active]:border-border border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-lg px-4 py-2.5 transition-all whitespace-nowrap">Support</TabsTrigger>
        </TabsList>
        <div className="flex-1 w-full min-w-0">
          <TabsContent value="general" className="m-0 focus-visible:outline-none grid gap-6">
            {/* App Availability */}
            <AdminCard>
              <AdminSectionHeader 
                icon={Power} 
                title="App Availability" 
                description="When disabled, customers cannot place orders" 
                colorTheme="green" 
              />
              <AdminToggleRow 
                label="Accept Orders" 
                description={appUnavailable ? "Store is currently closed" : "Store is accepting orders"}
              >
                <Switch
                  checked={!appUnavailable}
                  onCheckedChange={(checked) => saveAvailability(!checked)}
                  disabled={savingAvailability}
                  className="data-[state=checked]:bg-foreground"
                />
              </AdminToggleRow>
            </AdminCard>

            {/* Tax Settings */}
            <AdminCard>
              <AdminSectionHeader 
                icon={Percent} 
                title="Tax Configuration" 
                description="Set the tax rate applied to all orders" 
                colorTheme="blue" 
              />
              <div className="grid gap-4">
                <AdminToggleRow 
                  label="Taxes Enabled" 
                  description="Apply tax to orders"
                >
                  <Switch
                    checked={taxesEnabled}
                    onCheckedChange={saveTaxesEnabled}
                    disabled={savingTaxesEnabled}
                    className="data-[state=checked]:bg-foreground"
                  />
                </AdminToggleRow>

                {taxesEnabled && (
                  <div className="flex items-end gap-3 px-1">
                    <AdminFormGroup label="Tax Rate (%)" className="flex-1">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        className="bg-background border-border text-foreground"
                      />
                    </AdminFormGroup>
                    <Button
                      onClick={saveTaxRate}
                      disabled={savingTax || taxRate === initialConfig.taxRate}
                      className="bg-foreground text-background hover:bg-foreground/90 h-10"
                    >
                      {savingTax ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </AdminCard>
          </TabsContent>

          <TabsContent value="fulfilment" className="m-0 focus-visible:outline-none grid gap-6">
            <AdminCard>
              <div className="flex items-start sm:items-center justify-between mb-4">
                <AdminSectionHeader 
                  icon={Package} 
                  title="Fulfilment Methods" 
                  description="Choose how customers can receive their orders" 
                  colorTheme="sky" 
                  className="mb-0" 
                />
                <Button onClick={saveFulfilmentSettings} disabled={savingFulfilment || (collectionEnabled === initialConfig.collectionEnabled && deliveryEnabled === initialConfig.deliveryEnabled && deliveryFee === initialConfig.deliveryFee)} size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  {savingFulfilment ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                  Save
                </Button>
              </div>
              <div className="grid gap-3 mt-4">
                {/* Warning: neither enabled */}
                {!collectionEnabled && !deliveryEnabled && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      No fulfilment method is enabled. Customers will not be able to place orders.
                    </div>
                  </div>
                )}
                
                <AdminToggleRow label="Collection" description="Customers collect from your location">
                  <Switch 
                    checked={collectionEnabled} 
                    onCheckedChange={(checked) => {
                      setCollectionEnabled(checked)
                      if (checked) setDeliveryEnabled(false)
                    }} 
                    className="data-[state=checked]:bg-foreground" 
                  />
                </AdminToggleRow>
                
                <AdminToggleRow label="Delivery" description="Orders delivered to customer address">
                  <Switch 
                    checked={deliveryEnabled} 
                    onCheckedChange={(checked) => {
                      setDeliveryEnabled(checked)
                      if (checked) setCollectionEnabled(false)
                    }} 
                    className="data-[state=checked]:bg-foreground" 
                  />
                </AdminToggleRow>

                {deliveryEnabled && (
                  <div className="px-1 mt-2">
                    <AdminFormGroup label="Delivery Fee (R)">
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        className="bg-background border-border text-foreground"
                      />
                    </AdminFormGroup>
                  </div>
                )}
              </div>
            </AdminCard>
          </TabsContent>

          <TabsContent value="payment" className="m-0 focus-visible:outline-none grid gap-6">
            <AdminCard>
              <div className="flex items-start sm:items-center justify-between mb-4">
                <AdminSectionHeader 
                  icon={CreditCard} 
                  title="Payment Methods" 
                  description="Configure online payment options" 
                  colorTheme="purple" 
                  className="mb-0" 
                />
                <Button onClick={savePaymentSettings} disabled={savingPayment || (yocoEnabled === initialConfig.yocoEnabled && yocoSecretKey === "" && yocoEnvironment === initialConfig.yocoEnvironment && snapscanEnabled === initialConfig.snapscanEnabled && snapscanLink === initialConfig.snapscanLink)} size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  {savingPayment ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                  Save
                </Button>
              </div>
              <div className="grid gap-4 border-t border-border pt-4">
                {/* Yoco */}
                <AdminInnerCard className="bg-transparent border-border/70 p-0 overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <img src="/images/yoco-logo.png" alt="Yoco" className="h-6 w-auto object-contain dark:invert shrink-0" />
                      <div>
                        <div className="text-sm text-foreground font-medium">Yoco Payments</div>
                        <div className="text-xs text-muted-foreground">Dynamic payment links via Yoco API</div>
                      </div>
                    </div>
                    <Switch checked={yocoEnabled} onCheckedChange={setYocoEnabled} className="data-[state=checked]:bg-foreground" />
                  </div>
                  {yocoEnabled && (
                    <div className="grid gap-3 p-4 border-t border-border/50">
                      <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/50 p-2.5 mb-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Your secret key is stored securely and used only on the server. It is never exposed to customers.
                        </p>
                      </div>
                      
                      {yocoHasKey && yocoMaskedKey && (
                        <div className="flex items-center gap-2 rounded-lg border border-border/50 p-2.5 mb-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">Current key</div>
                            <div className="text-sm font-mono text-foreground">{yocoMaskedKey}</div>
                          </div>
                        </div>
                      )}
                      
                      <AdminFormGroup label={yocoHasKey ? "Replace Secret Key" : "Secret Key"}>
                        <Input
                          type="password"
                          placeholder={yocoHasKey ? "Enter new key to replace" : "sk_test_... or sk_live_..."}
                          value={yocoSecretKey}
                          onChange={(e) => setYocoSecretKey(e.target.value)}
                          className="bg-background border-border text-foreground text-sm font-mono"
                        />
                      </AdminFormGroup>
                      
                      <AdminFormGroup label="Environment">
                        <Select value={yocoEnvironment} onValueChange={setYocoEnvironment}>
                          <SelectTrigger className="bg-background border-border text-foreground text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="test">Test</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                          </SelectContent>
                        </Select>
                      </AdminFormGroup>
                    </div>
                  )}
                </AdminInnerCard>
                
                {/* SnapScan */}
                <AdminInnerCard className="bg-transparent border-border/70 p-0 overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <img src="/images/snapscan-logo.png" alt="SnapScan" className="h-8 w-8 object-contain rounded-md shrink-0" />
                      <div>
                        <div className="text-sm text-foreground font-medium">SnapScan</div>
                        <div className="text-xs text-muted-foreground">Customers pay via SnapScan QR</div>
                      </div>
                    </div>
                    <Switch checked={snapscanEnabled} onCheckedChange={setSnapscanEnabled} className="data-[state=checked]:bg-foreground" />
                  </div>
                  {snapscanEnabled && (
                    <div className="p-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                          type="url"
                          placeholder="https://pos.snapscan.io/qr/your-code"
                          value={snapscanLink}
                          onChange={(e) => setSnapscanLink(e.target.value)}
                          className="bg-background border-border text-foreground text-sm"
                        />
                      </div>
                    </div>
                  )}
                </AdminInnerCard>
              </div>
            </AdminCard>
          </TabsContent>

          <TabsContent value="hours" className="m-0 focus-visible:outline-none grid gap-6">
            <AdminCard>
              <div className="flex items-start sm:items-center justify-between mb-4">
                <AdminSectionHeader 
                  icon={Clock} 
                  title="Business Hours" 
                  description="Set when customers can order" 
                  colorTheme="amber" 
                  className="mb-0" 
                />
                <Button
                  onClick={saveHours}
                  disabled={savingHours || JSON.stringify(weeklyHours) === initialConfig.weeklyHours}
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  {savingHours ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                  Save
                </Button>
              </div>

              <div className="grid gap-2 border-t border-border pt-4">
                {DAYS.map(({ key, label }) => {
                  const day = weeklyHours[key] || { open: "closed", close: "closed" }
                  const isClosed = day.open === "closed" || day.close === "closed"
                  return (
                    <div key={key} className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border border-border/50 px-4 py-3 bg-muted/10">
                      <div className="w-24 text-sm text-foreground font-medium flex-shrink-0">{label}</div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Select
                          value={day.open}
                          onValueChange={(v) => {
                            if (v === "closed") {
                              updateDayHours(key, "open", "closed")
                              updateDayHours(key, "close", "closed")
                            } else {
                              updateDayHours(key, "open", v)
                              if (day.close === "closed") updateDayHours(key, "close", "17:00")
                            }
                          }}
                        >
                          <SelectTrigger className="w-[110px] bg-background border-border text-foreground text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>{t === "closed" ? "Closed" : t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {!isClosed && (
                          <>
                            <span className="text-xs text-muted-foreground flex-shrink-0">to</span>
                            <Select value={day.close} onValueChange={(v) => updateDayHours(key, "close", v)}>
                              <SelectTrigger className="w-[110px] bg-background border-border text-foreground text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_OPTIONS.filter((t) => t !== "closed").map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </>
                        )}
                        {isClosed && <span className="text-xs text-muted-foreground ml-2">Closed all day</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </AdminCard>
          </TabsContent>

          <TabsContent value="support" className="m-0 focus-visible:outline-none grid gap-6">
            <AdminCard>
              <div className="flex items-start sm:items-center justify-between mb-4">
                <AdminSectionHeader 
                  icon={MessageCircle} 
                  title="Support Channels" 
                  description="Contact methods shown in customer app" 
                  colorTheme="emerald" 
                  className="mb-0" 
                />
                <Button onClick={saveSupportSettings} disabled={savingSupport || (supportWhatsapp.trim() === initialConfig.supportWhatsapp && supportTelegram.trim() === initialConfig.supportTelegram && supportSms.trim() === initialConfig.supportSms && supportEmail.trim() === initialConfig.supportEmail)} size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  {savingSupport ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                  Save
                </Button>
              </div>
              <div className="grid gap-4 border-t border-border pt-4">
                
                <AdminFormGroup label="WhatsApp Number">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#25D366] flex-shrink-0">
                      <path d="M12.031 0C5.405 0 .025 5.378.025 12.005c0 2.126.554 4.2 1.607 6.02L0 24l6.126-1.606a11.96 11.96 0 0 0 5.905 1.558c6.626 0 12.006-5.378 12.006-12.006C24.037 5.378 18.657 0 12.031 0zm6.544 17.185c-.277.781-1.611 1.503-2.22 1.583-.605.08-1.37.288-4.321-.933-3.626-1.493-5.912-5.187-6.09-5.424-.179-.238-1.455-1.936-1.455-3.692 0-1.756.915-2.617 1.252-2.975.318-.337.818-.475 1.253-.475.434 0 .573.02.83.635.257.615.89 2.18.968 2.338.077.159.176.417.039.694-.138.277-.215.436-.433.693-.217.257-.453.554-.652.752-.218.217-.453.454-.216.85.237.396 1.047 1.716 2.245 2.784 1.54 1.375 2.827 1.8 3.223 1.958.396.16.634.138.871-.12.237-.257.99-1.147 1.267-1.543.277-.396.535-.316.89-.198.356.119 2.254 1.07 2.65 1.268.396.198.653.298.752.476.099.178.099 1.03-.178 1.81z" />
                    </svg>
                    <Input
                      placeholder="e.g. +27601234567"
                      value={supportWhatsapp}
                      onChange={(e) => setSupportWhatsapp(e.target.value)}
                      className="bg-background border-border text-foreground w-full max-w-sm"
                    />
                  </div>
                </AdminFormGroup>

                <AdminFormGroup label="Telegram Number / Link">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#0088cc] flex-shrink-0">
                      <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-17.027c.32-1.371-.518-1.936-1.494-1.558L1.135 10.375C-.214 10.908-.18 11.666.866 11.996L6.2 13.639l12.424-7.834c.582-.387 1.116-.174.664.227l-9.871 8.9v.249z" />
                    </svg>
                    <Input
                      placeholder="e.g. +27601234567 or @username"
                      value={supportTelegram}
                      onChange={(e) => setSupportTelegram(e.target.value)}
                      className="bg-background border-border text-foreground w-full max-w-sm"
                    />
                  </div>
                </AdminFormGroup>

                <AdminFormGroup label="SMS Number">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Input
                      placeholder="e.g. +27601234567"
                      value={supportSms}
                      onChange={(e) => setSupportSms(e.target.value)}
                      className="bg-background border-border text-foreground w-full max-w-sm"
                    />
                  </div>
                </AdminFormGroup>

                <AdminFormGroup label="Email Address">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Input
                      type="email"
                      placeholder="e.g. support@example.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="bg-background border-border text-foreground w-full max-w-sm"
                    />
                  </div>
                </AdminFormGroup>

              </div>
            </AdminCard>
          </TabsContent>
        </div>
      </Tabs>
    </AdminPage>
  )
}
