"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError

      // Check admin role
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin privileges required.")
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Left Side - Image & Testimonial (Hidden on smaller screens) */}
      <div className="hidden lg:flex flex-1 relative bg-zinc-950 flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Background Image using standard img to bypass next.config domain restrictions */}
        <img
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2670&auto=format&fit=crop"
          alt="Restaurant interior"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/O_App_logo_transparent.png"
            alt="O App"
            width={72}
            height={72}
            className="w-16 h-16 object-contain drop-shadow-md"
          />
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 mt-auto max-w-2xl">
          <blockquote className="space-y-6">
            <p className="text-3xl xl:text-4xl font-medium leading-relaxed drop-shadow-sm text-zinc-100">
              "This platform has completely transformed how we manage our incoming orders. The simplicity, speed, and reliability are unmatched."
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-14 w-14 xl:h-16 xl:w-16 rounded-full overflow-hidden border-2 border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop" 
                  alt="Client avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-white text-base xl:text-lg">Sofia Rivers</div>
                <div className="text-zinc-400 text-sm xl:text-base">Owner, The Daily Grind</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:max-w-[480px] xl:max-w-[560px] items-center justify-center p-8 sm:p-12 relative bg-neutral-900 border-l border-neutral-800">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col gap-2 relative z-10">
            <div className="lg:hidden flex items-center justify-center mb-6">
              <Image
                src="/O_App_logo_transparent.png"
                alt="O App"
                width={80}
                height={80}
                className="w-20 h-20 object-contain drop-shadow"
              />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-white lg:text-left text-center">
              Admin Login
            </h1>
            <p className="text-neutral-400 lg:text-left text-center">
              Sign in with your secure admin credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300 font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-neutral-800 border-neutral-700 text-white shadow-sm placeholder:text-neutral-500 transition-colors focus-visible:ring-1 focus-visible:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-neutral-800 border-neutral-700 text-white shadow-sm placeholder:text-neutral-500 transition-colors focus-visible:ring-1 focus-visible:ring-white/50"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 font-medium flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 shadow-md transition-all active:scale-[0.98] bg-white text-neutral-900 hover:bg-neutral-200 font-semibold text-base mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </div>
        
        {/* Mobile Background Elements (So right side isn't totally blank) */}
        <div className="absolute inset-0 pointer-events-none select-none lg:hidden opacity-10">
           <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-[100px]" />
        </div>
      </div>
    </main>
  )
}
