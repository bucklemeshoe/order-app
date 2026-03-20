'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
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
      payments: formData.getAll('payments').join(', ') || 'None',
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
Payments System: ${data.payments}
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
    <div className="container mx-auto px-4 max-w-3xl font-[family-name:var(--font-sans)] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Link>
      </div>
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 font-[family-name:var(--font-heading)] tracking-tight">Request Setup</h1>
          <p className="text-zinc-600 text-lg md:text-xl font-medium">
            Tell us a bit about your business, and we'll handle the <br className="hidden md:block" /> entire technical setup for you.
          </p>
        </div>
        
        <Card className="border-0 shadow-none sm:shadow-2xl rounded-none sm:rounded-[2rem] overflow-hidden -mx-4 sm:mx-0 sm:border">
          <CardContent className="px-6 py-8 sm:p-10 bg-white">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label htmlFor="restaurantName" className="text-base font-medium text-zinc-800">Restaurant / Business Name *</Label>
                <Input id="restaurantName" name="restaurantName" placeholder="E.g. The Daily Grind" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" required />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="ownerName" className="text-base font-medium text-zinc-800">Your Full Name *</Label>
                <Input id="ownerName" name="ownerName" placeholder="E.g. Sarah Smith" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" required />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium text-zinc-800">Email Address *</Label>
                <Input id="email" name="email" type="email" placeholder="sarah@example.com" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" required />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-medium text-zinc-800">WhatsApp Number *</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+27 82 000 0000" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" required />
              </div>

              <div className="space-y-4 pt-2">
                <Label className="text-base font-medium text-zinc-800">Do you currently use Yoco, Snapscan, or both for payments?</Label>
                <div className="flex flex-col gap-4 pl-1">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="payment-yoco" name="payments" value="Yoco" className="h-5 w-5 rounded-md border-zinc-300 data-[state=checked]:bg-brand data-[state=checked]:border-brand" />
                    <Label htmlFor="payment-yoco" className="font-medium cursor-pointer text-base text-zinc-700">Yoco</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="payment-snapscan" name="payments" value="SnapScan" className="h-5 w-5 rounded-md border-zinc-300 data-[state=checked]:bg-brand data-[state=checked]:border-brand" />
                    <Label htmlFor="payment-snapscan" className="font-medium cursor-pointer text-base text-zinc-700">SnapScan</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="payment-none" name="payments" value="None / Not yet" className="h-5 w-5 rounded-md border-zinc-300 data-[state=checked]:bg-brand data-[state=checked]:border-brand" />
                    <Label htmlFor="payment-none" className="font-medium cursor-pointer text-base text-zinc-700">Neither / Other</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="menuLink" className="text-base font-medium text-zinc-800">Link to your current menu (Website, Instagram, PDF)</Label>
                <Input id="menuLink" name="menuLink" type="url" placeholder="https://..." className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="apps" className="text-base font-medium text-zinc-800">Do you currently use delivery apps? (UberEats, MrD, etc.)</Label>
                <Input id="apps" name="apps" placeholder="E.g. Yes, we use UberEats and MrD" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-base font-medium text-zinc-800">Any special requirements or notes?</Label>
                <Textarea id="notes" name="notes" placeholder="Tell us if there's anything specific you need..." className="min-h-[120px] rounded-xl resize-y bg-zinc-50 border-zinc-200 focus-visible:ring-brand text-base" />
              </div>

              <div className="pt-8 border-t border-zinc-200 block w-full">
                <div className="flex items-start gap-4 w-full">
                  <Checkbox id="terms-ack" name="terms-ack" className="mt-1 h-5 w-5 rounded-md border-zinc-300 data-[state=checked]:bg-brand data-[state=checked]:border-brand shrink-0" required />
                  <div className="space-y-4 leading-relaxed w-full">
                    <Label htmlFor="terms-ack" className="font-bold text-base text-zinc-800 cursor-pointer pt-0.5 block select-none">
                      I have read and understand the setup terms *
                    </Label>
                    <div className="text-sm text-zinc-600 font-medium leading-relaxed bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-4 w-full block">
                      <p>
                        I have read and understand that O.App is a one-time setup service. The setup includes deploying and configuring the system, connecting payments, and preparing a working environment with a core menu so the business can start taking orders.
                      </p>
                      <p>
                        I understand that full menu population, ongoing updates, and custom development are not included. After setup, I will have full access to manage my system independently.
                      </p>
                      <p>
                        I understand that support is not included as a monthly service, but is available separately if needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 block w-full">
                <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-medium px-8 h-12 transition-all active:scale-[0.98]">
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  )
}
