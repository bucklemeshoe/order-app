"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Smartphone } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })
        if (signUpError) throw signUpError
        setMessage("Check your email for a confirmation link!")
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        router.push("/")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-brand px-4 relative overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      {/* Desktop warning overlay */}
      <div className="hidden md:block relative z-10 bg-white p-10 rounded-[2rem] max-w-sm w-full shadow-2xl border border-zinc-200 text-center">
        <div className="mx-auto w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center shadow-inner mb-6">
          <Smartphone className="w-10 h-10 text-zinc-900" />
        </div>
        <h2 className="text-2xl font-black font-[family-name:var(--font-heading)] text-zinc-900 tracking-tight mb-4">
          Phone required
        </h2>
        <p className="text-zinc-600 font-medium leading-relaxed">
          The customer experience is built entirely for your mobile app. Please open this link on your smartphone to continue ordering.
        </p>
      </div>

      {/* Scattered food emoji background */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {[
          { emoji: "🍕", top: "4%",  left: "8%",   size: "2.2rem", rotate: "-15deg" },
          { emoji: "☕", top: "8%",  right: "12%",  size: "1.8rem", rotate: "20deg" },
          { emoji: "🍔", top: "18%", left: "75%",   size: "2.5rem", rotate: "-8deg" },
          { emoji: "🧁", top: "15%", left: "25%",   size: "1.6rem", rotate: "30deg" },
          { emoji: "🍩", top: "28%", right: "8%",   size: "2rem",   rotate: "-25deg" },
          { emoji: "🍟", top: "35%", left: "5%",    size: "1.7rem", rotate: "12deg" },
          { emoji: "🥤", top: "3%",  left: "50%",   size: "1.9rem", rotate: "-20deg" },
          { emoji: "🍰", top: "70%", left: "10%",   size: "2.3rem", rotate: "18deg" },
          { emoji: "🌮", top: "75%", right: "15%",  size: "2rem",   rotate: "-12deg" },
          { emoji: "🥐", top: "60%", left: "80%",   size: "1.8rem", rotate: "25deg" },
          { emoji: "🍦", top: "85%", left: "30%",   size: "2.1rem", rotate: "-30deg" },
          { emoji: "🥗", top: "90%", right: "10%",  size: "1.7rem", rotate: "10deg" },
          { emoji: "🍜", top: "55%", left: "3%",    size: "1.9rem", rotate: "-5deg" },
          { emoji: "🧃", top: "45%", right: "5%",   size: "1.6rem", rotate: "22deg" },
          { emoji: "🍪", top: "50%", left: "88%",   size: "1.5rem", rotate: "-18deg" },
          { emoji: "🥞", top: "92%", left: "70%",   size: "2rem",   rotate: "8deg" },
          { emoji: "🍿", top: "40%", left: "18%",   size: "1.8rem", rotate: "-22deg" },
          { emoji: "🥨", top: "65%", left: "55%",   size: "1.6rem", rotate: "15deg" },
        ].map((item, i) => (
          <span
            key={i}
            className="absolute opacity-55"
            style={{
              top: item.top,
              left: item.left,
              right: (item as any).right,
              fontSize: item.size,
              transform: `rotate(${item.rotate})`,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      <div className="md:hidden w-full max-w-sm space-y-6 relative z-10 bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/O_App_logo_transparent.png"
            alt="O App"
            width={56}
            height={56}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Sign up to start ordering"
              : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="h-11"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 shadow-sm transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
            }}
            className="font-medium text-primary hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </main>
  )
}
