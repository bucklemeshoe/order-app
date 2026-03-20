"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User, MapPin, FileText, Headphones, LogOut, ChevronRight, ChevronLeft, ChevronDown, X, Search, MessageCircle, Send, Mail, Phone } from "lucide-react"
import { getCurrentUser, updateProfile, signOut, type UserProfile } from "@/lib/api/users"
import { getAllSettings } from "@/lib/api/settings"
import { COUNTRY_CODES } from "@/lib/data/country-codes"

export type AccountSection = "menu" | "profile" | "address" | "notes" | "support"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm text-neutral-500 font-medium">{label}</Label>
      {children}
    </div>
  )
}


export function ProfileView({ section, setSection }: { section: AccountSection, setSection: (s: AccountSection) => void }) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Editable fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+27")
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [dietary, setDietary] = useState("")
  const [profileAddress, setProfileAddress] = useState("")
  const [profileDeliveryNotes, setProfileDeliveryNotes] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [supportChannels, setSupportChannels] = useState<{ whatsapp?: string, telegram?: string, sms?: string, email?: string }>({})

  useEffect(() => {
    async function load() {
      try {
        const [user, settings] = await Promise.all([
          getCurrentUser(),
          getAllSettings()
        ])

        const settingsMap: Record<string, any> = {}
        settings.forEach((s: any) => { settingsMap[s.key] = s.value })
        setSupportChannels({
          whatsapp: settingsMap.support_whatsapp,
          telegram: settingsMap.support_telegram,
          sms: settingsMap.support_sms,
          email: settingsMap.support_email
        })

        if (user) {
          setProfile(user)
          setName(user.name || "")
          const existingPhone = user.phone || ""
          const matchedCode = COUNTRY_CODES.find(c => existingPhone.startsWith(c.dial))
          if (matchedCode) {
            setCountryCode(matchedCode.dial)
            setPhone(existingPhone.slice(matchedCode.dial.length).trim())
          } else {
            setPhone(existingPhone)
          }
          setDietary(user.dietary_prefs || "")
          setProfileAddress(user.delivery_address || "")
          setProfileDeliveryNotes(user.delivery_notes || "")
        }
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  // Change detection
  const originalPhone = useMemo(() => {
    if (!profile) return ""
    return profile.phone || ""
  }, [profile])

  const currentPhone = useMemo(() => {
    return phone ? `${countryCode} ${phone}`.trim() : ""
  }, [countryCode, phone])

  const profileChanged = useMemo(() => {
    if (!profile) return false
    return name !== (profile.name || "") || currentPhone !== originalPhone
  }, [profile, name, currentPhone, originalPhone])

  const addressChanged = useMemo(() => {
    if (!profile) return false
    return profileAddress !== (profile.delivery_address || "") || profileDeliveryNotes !== (profile.delivery_notes || "")
  }, [profile, profileAddress, profileDeliveryNotes])

  const notesChanged = useMemo(() => {
    if (!profile) return false
    return dietary !== (profile.dietary_prefs || "")
  }, [profile, dietary])

  async function handleSave(fields: Partial<{ name: string; phone: string; dietary_prefs: string; delivery_address: string; delivery_notes: string }>) {
    setSaving(true)
    setMessage(null)
    try {
      const updated = await updateProfile(fields)
      setProfile(updated)
      // Re-sync local state with saved data
      setName(updated.name || "")
      const existingPhone = updated.phone || ""
      const matchedCode = COUNTRY_CODES.find(c => existingPhone.startsWith(c.dial))
      if (matchedCode) {
        setCountryCode(matchedCode.dial)
        setPhone(existingPhone.slice(matchedCode.dial.length).trim())
      } else {
        setPhone(existingPhone)
      }
      setDietary(updated.dietary_prefs || "")
      setProfileAddress(updated.delivery_address || "")
      setMessage("Saved!")
      setTimeout(() => setMessage(null), 2000)
    } catch (err: any) {
      setMessage(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const filteredCodes = countrySearch
    ? COUNTRY_CODES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dial.includes(countrySearch) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : COUNTRY_CODES

  if (loading) {
    return (
      <section className="grid gap-4">
        <Skeleton className="h-8 w-24" />
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (!profile) {
    return (
      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <div className={cn("rounded-xl border p-8 text-center", UI.surface, UI.border)}>
          <p className={cn("text-sm", UI.muted)}>Please sign in to view your account.</p>
          <div className="mt-4">
            <Button
              className="h-10 px-6 font-medium transition-all shadow-sm active:scale-[0.98]"
              onClick={() => { router.push("/auth/login") }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // ── Sub-view: Profile (name, email, phone) ──
  if (section === "profile") {
    return (
      <section className="grid gap-4 mt-2">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-4">
            <Field label="Email">
              <Input value={profile.email} disabled className="h-10 bg-neutral-50" />
            </Field>
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
            </Field>
            <Field label="Phone">
              <div className="flex gap-0">
                <button
                  type="button"
                  onClick={() => { setShowCountryPicker(true); setCountrySearch("") }}
                  className="h-10 px-3 rounded-l-md border border-r-0 border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-700 flex items-center gap-1.5 flex-shrink-0 active:bg-neutral-100 transition-colors"
                >
                  <span className="text-base leading-none">{COUNTRY_CODES.find(c => c.dial === countryCode)?.flag}</span>
                  <span>{countryCode}</span>
                  <ChevronDown className="h-3 w-3 text-neutral-400" />
                </button>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="71 234 5678"
                  className="h-10 rounded-l-none border-l-0 flex-1"
                  type="tel"
                />
              </div>
            </Field>
          </div>
          {profileChanged && (
            <div className="p-4 pt-0">
              <Button
                className="w-full h-11 font-medium transition-all shadow-md active:scale-[0.98]"
                onClick={() => handleSave({ name, phone: currentPhone })}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
          {message && (
            <div className={cn("mx-4 mb-4 rounded-lg p-3 text-sm",
              message === "Saved!" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            )}>
              {message}
            </div>
          )}
        </div>

        {/* Country Code Bottom Sheet */}
        {showCountryPicker && (
          <>
            <div className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200" onClick={() => setShowCountryPicker(false)} />
            <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col" style={{ maxHeight: "70vh" }}>
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
                <h3 className="text-base font-semibold">Select Country Code</h3>
                <button onClick={() => setShowCountryPicker(false)} className="p-1 rounded-full hover:bg-neutral-100 transition-colors">
                  <X className="h-5 w-5 text-neutral-500" />
                </button>
              </div>
              <div className="px-4 py-3 border-b border-neutral-100 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 bg-neutral-50"
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {filteredCodes.length === 0 ? (
                  <div className="p-6 text-center text-sm text-neutral-500">No countries found</div>
                ) : (
                  filteredCodes.map((c) => {
                    const isSelected = countryCode === c.dial
                    return (
                      <button
                        key={c.code}
                        onClick={() => { setCountryCode(c.dial); setShowCountryPicker(false) }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-neutral-100 border-b border-neutral-100 last:border-0",
                          isSelected ? "bg-neutral-50" : ""
                        )}
                      >
                        <span className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                          isSelected ? "border-neutral-900" : "border-neutral-300"
                        )}>
                          {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />}
                        </span>
                        <span className="text-xl leading-none">{c.flag}</span>
                        <span className="flex-1 text-sm font-medium text-neutral-800">{c.name}</span>
                        <span className="text-sm text-neutral-500 font-mono">{c.dial}</span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}
      </section>
    )
  }

  // ── Sub-view: Delivery address ──
  if (section === "address") {
    return (
      <section className="grid gap-4 mt-2">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-4">
            <Field label="Address">
              <Input
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                placeholder="e.g. 10 Main Road, Cape Town"
                className="h-10"
              />
            </Field>
            <Field label="Delivery notes">
              <Input
                value={profileDeliveryNotes}
                onChange={(e) => setProfileDeliveryNotes(e.target.value)}
                placeholder="e.g. Gate code 1234, ring twice"
                className="h-10"
              />
            </Field>
          </div>
          {addressChanged && (
            <div className="p-4 pt-0">
              <Button
                className="w-full h-11 font-medium transition-all shadow-md active:scale-[0.98]"
                onClick={() => handleSave({ delivery_address: profileAddress, delivery_notes: profileDeliveryNotes })}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
          {message && (
            <div className={cn("mx-4 mb-4 rounded-lg p-3 text-sm",
              message === "Saved!" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            )}>
              {message}
            </div>
          )}
        </div>
      </section>
    )
  }

  // ── Sub-view: Extra notes (dietary) ──
  if (section === "notes") {
    return (
      <section className="grid gap-4 mt-2">
        <h2 className="text-xl font-semibold">Extra Notes</h2>
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-4">
            <Field label="Dietary preferences / notes">
              <Input
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Oat milk, no sugar, vegan"
                className="h-10"
              />
            </Field>
            <p className="text-xs text-neutral-400">These notes will be applied to your orders by default.</p>
          </div>
          {notesChanged && (
            <div className="p-4 pt-0">
              <Button
                className="w-full h-11 font-medium transition-all shadow-md active:scale-[0.98]"
                onClick={() => handleSave({ dietary_prefs: dietary })}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
          {message && (
            <div className={cn("mx-4 mb-4 rounded-lg p-3 text-sm",
              message === "Saved!" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            )}>
              {message}
            </div>
          )}
        </div>
      </section>
    )
  }

  // ── Sub-view: Support ──
  if (section === "support") {
    return (
      <section className="grid gap-4 mt-2">
        <h2 className="text-xl font-semibold">Support</h2>
        <div className={cn("rounded-xl border py-2", UI.surface, UI.border)}>
          <div className="p-4 grid gap-5">
            <div>
              <p className="text-sm font-medium text-neutral-800">Need help?</p>
              <p className="text-sm text-neutral-500 mt-1">Contact us if you have any issues with your order or account.</p>
            </div>
            <div className="grid gap-5 pt-2 border-t border-neutral-100">
              {supportChannels.whatsapp && (
                <a href={`https://wa.me/${supportChannels.whatsapp.replace(/\+/g, '').replace(/ /g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-brand font-medium hover:underline">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12.031 0C5.405 0 .025 5.378.025 12.005c0 2.126.554 4.2 1.607 6.02L0 24l6.126-1.606a11.96 11.96 0 0 0 5.905 1.558c6.626 0 12.006-5.378 12.006-12.006C24.037 5.378 18.657 0 12.031 0zm6.544 17.185c-.277.781-1.611 1.503-2.22 1.583-.605.08-1.37.288-4.321-.933-3.626-1.493-5.912-5.187-6.09-5.424-.179-.238-1.455-1.936-1.455-3.692 0-1.756.915-2.617 1.252-2.975.318-.337.818-.475 1.253-.475.434 0 .573.02.83.635.257.615.89 2.18.968 2.338.077.159.176.417.039.694-.138.277-.215.436-.433.693-.217.257-.453.554-.652.752-.218.217-.453.454-.216.85.237.396 1.047 1.716 2.245 2.784 1.54 1.375 2.827 1.8 3.223 1.958.396.16.634.138.871-.12.237-.257.99-1.147 1.267-1.543.277-.396.535-.316.89-.198.356.119 2.254 1.07 2.65 1.268.396.198.653.298.752.476.099.178.099 1.03-.178 1.81z" />
                  </svg>
                  WhatsApp ({supportChannels.whatsapp})
                </a>
              )}
              {supportChannels.telegram && (
                <a href={supportChannels.telegram.startsWith('@') ? `https://t.me/${supportChannels.telegram.replace('@', '')}` : `https://t.me/${supportChannels.telegram.replace(/\+/g, '').replace(/ /g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-brand font-medium hover:underline">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-17.027c.32-1.371-.518-1.936-1.494-1.558L1.135 10.375C-.214 10.908-.18 11.666.866 11.996L6.2 13.639l12.424-7.834c.582-.387 1.116-.174.664.227l-9.871 8.9v.249z" />
                  </svg>
                  Telegram ({supportChannels.telegram})
                </a>
              )}
              {supportChannels.sms && (
                <a href={`sms:${supportChannels.sms.replace(/ /g, '')}`} className="flex items-center gap-3 text-sm text-brand font-medium hover:underline">
                  <Phone className="h-5 w-5" /> SMS ({supportChannels.sms})
                </a>
              )}
              {supportChannels.email && (
                <a href={`mailto:${supportChannels.email}`} className="flex items-center gap-3 text-sm text-brand font-medium hover:underline">
                  <Mail className="h-5 w-5" /> {supportChannels.email}
                </a>
              )}
              {!supportChannels.whatsapp && !supportChannels.telegram && !supportChannels.sms && !supportChannels.email && (
                <p className="text-sm text-neutral-500">No support channels currently configured.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── Main Account Menu ──
  const menuItems: { key: AccountSection; label: string; icon: React.ReactNode; subtitle?: string; danger?: boolean }[] = [
    {
      key: "profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      subtitle: profile.name || profile.email,
    },
    {
      key: "address",
      label: "Delivery address",
      icon: <MapPin className="h-5 w-5" />,
      subtitle: profileAddress || "Not set",
    },
    {
      key: "notes",
      label: "Extra notes",
      icon: <FileText className="h-5 w-5" />,
      subtitle: dietary || "None",
    },
    {
      key: "support",
      label: "Support",
      icon: <Headphones className="h-5 w-5" />,
    },
  ]

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-semibold">Account</h2>

      <div className="grid gap-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => { setSection(item.key); setMessage(null) }}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] active:shadow-sm",
              "bg-card border border-border hover:bg-accent hover:shadow-md hover:border-brand/40"
            )}
          >
            <span className="text-neutral-500">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-neutral-900 block">{item.label}</span>
              {item.subtitle && (
                <span className="text-xs text-neutral-400 block truncate">{item.subtitle}</span>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-300 flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Sign Out — separate at bottom */}
      <button
        onClick={handleSignOut}
        className={cn(
          "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] active:shadow-sm",
          "bg-card border border-border hover:bg-red-50/50 hover:shadow-md hover:border-red-200"
        )}
      >
        <span className="text-red-500"><LogOut className="h-5 w-5" /></span>
        <span className="text-sm font-medium text-red-600">Sign out</span>
      </button>
    </section>
  )
}
