import Image from "next/image"
import Link from "next/link"
import { 
  Play, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  LayoutDashboard, 
  Percent,
  Smartphone,
  CheckCircle2,
  Wrench,
  Monitor,
  Store
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-primary/30">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/O_App_logo_transparent.png" 
              alt="O.App Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="font-bold text-lg tracking-tight">O.App</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild className="bg-white text-black hover:bg-zinc-200 rounded-full font-semibold px-6">
              <Link href="#contact">Request Setup</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
          
          {/* Emoji Pattern Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
            <div className="grid grid-cols-6 md:grid-cols-12 gap-8 md:gap-16 text-4xl rotate-12 scale-150">
              {Array.from({ length: 144 }).map((_, i) => (
                <span key={i}>
                  {["🍔", "🍕", "☕️", "⚡️", "🛍️", "🛵", "💳", "🌶️"][i % 8]}
                </span>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 text-zinc-300">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Available for South African businesses
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
              Your own ordering system. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">No commissions.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Let your customers order online, pay with SnapScan or Yoco, and choose delivery or collection — all managed from one simple dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-[0_0_40px_-10px_rgba(248,61,96,0.5)]">
                <Link href="#demo">
                  <Play className="w-5 h-5 mr-2 fill-current" /> Watch Demo
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-semibold border-white/10 bg-white/5 hover:bg-white/10 text-white">
                <Link href="#contact">
                  Get this for my business
                </Link>
              </Button>
            </div>

            {/* Video Container (The Hero piece) */}
            <div id="demo" className="mt-20 relative mx-auto max-w-5xl rounded-2xl md:rounded-[2rem] border border-white/10 bg-zinc-900/50 p-2 md:p-4 backdrop-blur-sm shadow-2xl">
              <div className="aspect-video relative rounded-xl md:rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 group relative cursor-pointer flex items-center justify-center">
                {/* Fallback image if no video yet */}
                <Image 
                  src="/images/admin-login-bg.png" 
                  alt="Dashboard Preview" 
                  fill 
                  className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                
                {/* Fake Play Button */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Play className="w-8 h-8 text-white ml-2 fill-white" />
                </div>
                
                <div className="absolute bottom-6 left-8 z-10 hidden sm:block">
                  <p className="text-sm font-medium text-white/80">See how O.App works in 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Blocks */}
        <section id="features" className="py-24 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to sell online</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Stop paying 30% to delivery apps. Take back control of your customers and your margin with a system built for you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: <ShoppingBag className="w-6 h-6 text-primary" />,
                  title: "Online ordering for your customers",
                  description: "A beautiful, mobile-first menu that makes ordering effortless."
                },
                {
                  icon: <Truck className="w-6 h-6 text-blue-400" />,
                  title: "Delivery & collection support",
                  description: "Offer both options and set custom delivery fees based on areas."
                },
                {
                  icon: <CreditCard className="w-6 h-6 text-green-400" />,
                  title: "SnapScan & Yoco payments",
                  description: "Built-in integration with South Africa's favorite payment providers."
                },
                {
                  icon: <LayoutDashboard className="w-6 h-6 text-purple-400" />,
                  title: "Live order dashboard",
                  description: "Hear a ping and see orders arrive in real-time on your admin screen."
                },
                {
                  icon: <Percent className="w-6 h-6 text-orange-400" />,
                  title: "No marketplace commissions",
                  description: "Keep 100% of your revenue. Just a flat monthly software fee."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-zinc-100">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-zinc-950 to-zinc-900/40 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Get up and running in days, not weeks. We handle the technical heavy lifting so you can focus on making great food.</p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center max-w-5xl mx-auto gap-8 md:gap-4 lg:gap-8">
              {[
                {
                  step: "01",
                  title: "We set it up for you",
                  desc: "Send us your menu. We upload your items, connect your payment methods, and configure your store.",
                  icon: <Wrench className="w-8 h-8 text-zinc-300" />
                },
                {
                  step: "02",
                  title: "Customers order",
                  desc: "Share your unqiue link on strict Instagram, WhatsApp, or Facebook. Customers browse and pay instantly.",
                  icon: <Smartphone className="w-8 h-8 text-zinc-300" />
                },
                {
                  step: "03",
                  title: "Manage in one place",
                  desc: "Incoming orders ping your dashboard. Accept them, mark as ready, and complete the sale.",
                  icon: <Monitor className="w-8 h-8 text-zinc-300" />
                }
              ].map((item, i, arr) => (
                <div key={i} className="relative flex-1 bg-zinc-950 rounded-2xl p-8 border border-white/5 shadow-xl">
                  {i !== arr.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 -translate-y-1/2 z-20">
                      <ArrowRight className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                  <div className="text-5xl font-extrabold text-white/5 mb-6">{item.step}</div>
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Preview / Images */}
        <section className="py-24 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
              <div className="space-y-6 md:pr-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Looking sharp, <br/>selling more.</h2>
                <p className="text-zinc-400 text-lg">Your brand takes the spotlight. The O.App interface is minimal, fast, and optimized for high conversion.</p>
                
                <ul className="space-y-4 pt-4">
                  {[
                    "No app downloads required for customers",
                    "Lightning-fast cart system",
                    "Beautiful image-first product displays"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] relative bg-zinc-900">
                     <Image src="/images/hero-banner.png" alt="App interface" fill className="object-cover" />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] relative bg-zinc-900">
                     <Image src="/images/default-product.png" alt="Product interface" fill className="object-cover" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Positioning */}
        <section className="py-32 relative overflow-hidden flex items-center justify-center min-h-[500px]">
          <Image 
            src="/images/admin-login-bg.png" 
            alt="Restaurant background" 
            fill 
            className="object-cover opacity-20 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Store className="w-12 h-12 mx-auto text-primary mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Built for small food businesses</h2>
            <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl font-medium text-zinc-300">
              <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">Takeaway shops</span>
              <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">Cafes</span>
              <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">Bakeries</span>
              <span className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">Meal prep brands</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Get your own ordering system set up
            </h2>
            <p className="text-xl text-primary-foreground/90 font-medium mb-10">
              We&apos;ll handle the setup. You start taking orders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-zinc-100 rounded-full w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-xl">
                Request Setup
              </Button>
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 hover:text-white rounded-full w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/90">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image 
                  src="/O_App_logo_transparent.png" 
                  alt="O.App Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
                <span className="font-bold text-xl tracking-tight text-white">O.App</span>
              </div>
              <p className="text-zinc-500 max-w-sm mb-6">
                The modern ordering system for South African food businesses. Take control of your digital storefront.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Product Options</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/admin/login" className="text-zinc-400 hover:text-white transition-colors">Admin Dashboard</Link>
                </li>
                <li>
                  <Link href="/order" className="text-zinc-400 hover:text-white transition-colors">Customer Demo</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="text-zinc-400">
                  hello@orderapp.pro
                </li>
                <li className="text-zinc-400">
                  Cape Town, South Africa
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} O.App. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
