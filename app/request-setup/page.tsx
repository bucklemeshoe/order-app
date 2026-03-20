'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RequestSetupPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Grab the form data to compose a beautiful email draft
    const formData = new FormData(e.currentTarget)
    const data = {
      restaurant: formData.get('restaurantName'),
      owner: formData.get('ownerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      menu: formData.get('menuLink') || 'Not provided',
      apps: formData.get('apps') || 'None',
      notes: formData.get('notes') || 'None',
    }

    const subject = `App Setup Request: ${data.restaurant}`
    const body = `Hi MakeFriendlyApps team,

I'd like to request a setup for my ordering app! Here are my details:

BUSINESS DETAILS
---------------------------
Restaurant Name: ${data.restaurant}
Owner Name: ${data.owner}
Email: ${data.email}
WhatsApp: ${data.phone}

CURRENT SETUP
---------------------------
Menu Link: ${data.menu}
Current Delivery Apps: ${data.apps}

REQUIREMENTS / NOTES
---------------------------
${data.notes}

Looking forward to hearing from you!`

    // Trigger the device's native email client
    window.location.href = `mailto:jared@makefriendly.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 flex items-center justify-center font-[family-name:var(--font-sans)]">
      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-6 ml-2">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
          </Link>
        </div>
        
        <Card className="border-0 shadow-2xl rounded-[2rem] overflow-hidden py-0 gap-0">
          <div className="bg-zinc-950 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
            <CardTitle className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-heading)] mb-2 relative z-10 tracking-tight">Request Setup</CardTitle>
            <CardDescription className="text-zinc-400 text-lg sm:text-xl relative z-10 font-medium">
              Tell us a bit about your business, and we'll handle the entire technical setup for you.
            </CardDescription>
          </div>
          
          <CardContent className="p-8 sm:p-10 bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName" className="font-semibold text-zinc-900">Restaurant / Business Name *</Label>
                  <Input id="restaurantName" name="restaurantName" placeholder="E.g. The Daily Grind" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="font-semibold text-zinc-900">Your Full Name *</Label>
                  <Input id="ownerName" name="ownerName" placeholder="E.g. Sarah Smith" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand" required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-zinc-900">Email Address *</Label>
                  <Input id="email" name="email" type="email" placeholder="sarah@example.com" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold text-zinc-900">WhatsApp Number *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+27 82 000 0000" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menuLink" className="font-semibold text-zinc-900">Link to your current menu (Website, Instagram, PDF)</Label>
                <Input id="menuLink" name="menuLink" type="url" placeholder="https://..." className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apps" className="font-semibold text-zinc-900">Do you currently use delivery apps? (UberEats, MrD, etc.)</Label>
                <Input id="apps" name="apps" placeholder="E.g. Yes, we use UberEats and MrD" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-semibold text-zinc-900">Any special requirements or notes?</Label>
                <Textarea id="notes" name="notes" placeholder="Tell us if there's anything specific you need..." className="min-h-[120px] rounded-xl resize-y bg-zinc-50 border-zinc-200 focus-visible:ring-brand" />
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white rounded-full h-14 text-lg font-medium shadow-[0_8px_30px_rgb(248,61,96,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                  Submit Request
                </Button>
                <p className="text-center text-zinc-500 text-sm mt-5 font-medium">
                  No credit card required. We usually set up your mockups within 24 hours.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
