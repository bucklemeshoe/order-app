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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/O_App_logo_transparent.png" 
              alt="O.App Logo" 
              width={42} 
              height={42} 
              className="object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="/order" className="hover:text-primary transition-colors">Try Demo</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild className="transition-all active:scale-[0.98] bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg font-medium px-6 shadow-md">
              <Link href="#contact">Request Setup</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 px-4">
          <div className="container mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-medium mb-8 text-zinc-800 shadow-sm ring-1 ring-zinc-900/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for South African businesses</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 max-w-4xl mx-auto leading-[1.05] tracking-tight font-[family-name:var(--font-heading)] text-slate-900 drop-shadow-sm">
              Your own ordering system. <br className="hidden md:block" />
              <span className="text-primary">No commissions.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Let your customers order online, pay securely with SnapScan or Yoco, and choose delivery or collection — all managed from one simple dashboard.
            </p>
            


            {/* Video Container (The Hero piece) */}
            <div id="demo" className="mt-20 relative mx-auto max-w-5xl rounded-2xl md:rounded-[2.5rem] border border-slate-200 bg-slate-50 p-2 md:p-4 shadow-2xl">
              <div className="aspect-video relative rounded-xl md:rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-200/50 group cursor-pointer flex items-center justify-center shadow-inner">
                {/* Fallback image if no video yet */}
                <Image 
                  src="/images/admin-login-bg.png" 
                  alt="Dashboard Preview" 
                  fill 
                  className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                {/* Play Button */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Play className="w-10 h-10 text-white ml-2 fill-white" />
                </div>
                
                <div className="absolute bottom-8 left-10 z-10 hidden sm:block">
                  <p className="text-base font-medium text-white shadow-sm">See how O.App works in 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Blocks */}
        <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 font-[family-name:var(--font-heading)] text-slate-900">
                Everything you need to sell online
              </h2>
              <p className="text-slate-500 text-lg">
                Stop paying 30% to delivery apps. Take back control of your customers and your margin with a beautiful system built just for you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: <ShoppingBag className="w-7 h-7 text-primary" />,
                  title: "Online ordering",
                  description: "A beautiful, lightning-fast mobile menu that makes ordering from your store completely effortless."
                },
                {
                  icon: <Truck className="w-7 h-7 text-blue-500" />,
                  title: "Delivery & Collection",
                  description: "Offer both options. Set custom delivery fees based on exact areas and zip codes."
                },
                {
                  icon: <CreditCard className="w-7 h-7 text-green-500" />,
                  title: "SnapScan & Yoco",
                  description: "Built-in, secure integrations with South Africa's favorite local payment providers."
                },
                {
                  icon: <LayoutDashboard className="w-7 h-7 text-purple-500" />,
                  title: "Live Order Dashboard",
                  description: "Hear a loud ping and see orders arrive instantly on your admin screen without refreshing."
                },
                {
                  icon: <Percent className="w-7 h-7 text-orange-500" />,
                  title: "0% Marketplace Fees",
                  description: "Keep 100% of your revenue. You just pay a flat monthly software fee to keep running."
                }
              ].map((feature, i) => (
                <div key={i} className="group px-8 py-10 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800 font-[family-name:var(--font-heading)]">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-white relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 font-[family-name:var(--font-heading)] text-slate-900">
                Setup is effortless
              </h2>
              <p className="text-slate-500 text-lg">
                Get up and running in days, not weeks. We handle the technical heavy lifting so you can focus entirely on making great food.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center max-w-6xl mx-auto gap-8 md:gap-6 lg:gap-8">
              {[
                {
                  step: "01",
                  title: "We build it for you",
                  desc: "Send us your menu. We upload your items with photos, connect your SnapScan or Yoco, and configure your delivery areas.",
                  icon: <Wrench className="w-7 h-7 text-slate-600" />
                },
                {
                  step: "02",
                  title: "Customers order",
                  desc: "Share your unique app link on Instagram, WhatsApp, or Facebook. Customers browse natively and pay securely.",
                  icon: <Smartphone className="w-7 h-7 text-slate-600" />
                },
                {
                  step: "03",
                  title: "Manage in one place",
                  desc: "Incoming orders trigger an alert on your dashboard. Accept them, mark them as ready, and complete the sale.",
                  icon: <Monitor className="w-7 h-7 text-slate-600" />
                }
              ].map((item, i, arr) => (
                <div key={i} className="relative flex-1 bg-slate-50/50 rounded-3xl p-8 lg:p-10 border border-slate-200">
                  {i !== arr.length - 1 && (
                    <div className="hidden md:block absolute top-[50%] -right-4 lg:-right-6 -translate-y-1/2 z-20 bg-white rounded-full p-2 border border-slate-200 shadow-sm">
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div className="text-6xl font-black text-brand opacity-20 mb-6 font-[family-name:var(--font-heading)]">{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800 font-[family-name:var(--font-heading)]">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Preview / Images */}
        <section className="py-24 bg-slate-950 text-white rounded-t-[3rem] md:rounded-t-[5rem] mt-12 px-4 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
              <div className="space-y-8 lg:pr-12 order-2 lg:order-1">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] text-white">
                  Looking sharp, <br/>selling more.
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Your brand takes the spotlight. The O.App interface is minimal, fast, and aggressively optimized for high conversion rates.
                </p>
                
                <ul className="space-y-5 pt-4">
                  {[
                    "No annoying app downloads required for customers",
                    "Lightning-fast digital cart system",
                    "Beautiful image-first product displays"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-200 font-medium text-lg">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-6">
                  <Button size="lg" asChild className="transition-all active:scale-[0.98] bg-white hover:bg-zinc-200 text-zinc-900 rounded-xl h-14 px-8 text-lg font-medium shadow-md">
                    <Link href="/order">
                      Try the Customer Demo
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 order-1 lg:order-2">
                <div className="space-y-4 pt-12">
                   <div className="rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/5] relative bg-slate-900 shadow-2xl">
                     <Image src="/images/hero-banner.png" alt="App interface" fill className="object-cover" />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="rounded-[2rem] overflow-hidden border border-white/10 aspect-[4/5] relative bg-slate-900 shadow-2xl">
                     <Image src="/images/default-product.png" alt="Product interface" fill className="object-cover" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Positioning */}
        <section className="py-32 bg-slate-100 flex items-center justify-center text-center px-4">
          <div className="container mx-auto max-w-4xl">
            <Store className="w-16 h-16 mx-auto text-slate-300 mb-8" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-10 font-[family-name:var(--font-heading)] text-slate-900">
              Built for small food businesses
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-lg font-bold text-slate-600">
              <span className="px-8 py-4 rounded-full bg-white border border-slate-200 shadow-sm">Takeaway shops</span>
              <span className="px-8 py-4 rounded-full bg-white border border-slate-200 shadow-sm">Cafes / Coffee bars</span>
              <span className="px-8 py-4 rounded-full bg-white border border-slate-200 shadow-sm">Bakeries</span>
              <span className="px-8 py-4 rounded-full bg-white border border-slate-200 shadow-sm">Meal prep brands</span>
            </div>
          </div>
        </section>

        {/* CTA Section (Featuring the Emoji Pattern on Accent Color) */}
        <section id="contact" className="py-32 bg-brand relative overflow-hidden flex items-center min-h-[500px]">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          {/* Scattered food emoji background (matches auth bg) */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            {[
              { emoji: "🍕", top: "10%", left: "8%",   size: "2.2rem", rotate: "-15deg" },
              { emoji: "☕", top: "15%", right: "12%", size: "1.8rem", rotate: "20deg" },
              { emoji: "🍔", top: "30%", left: "85%",  size: "2.5rem", rotate: "-8deg" },
              { emoji: "🧁", top: "25%", left: "25%",  size: "1.6rem", rotate: "30deg" },
              { emoji: "🍩", top: "45%", right: "18%", size: "2rem",   rotate: "-25deg" },
              { emoji: "🍟", top: "60%", left: "5%",   size: "1.7rem", rotate: "12deg" },
              { emoji: "🥤", top: "8%",  left: "50%",  size: "1.9rem", rotate: "-20deg" },
              { emoji: "🍰", top: "80%", left: "15%",  size: "2.3rem", rotate: "18deg" },
              { emoji: "🌮", top: "85%", right: "15%", size: "2rem",   rotate: "-12deg" },
              { emoji: "🥐", top: "70%", left: "80%",  size: "1.8rem", rotate: "25deg" },
              { emoji: "🍦", top: "85%", left: "40%",  size: "2.1rem", rotate: "-30deg" },
              { emoji: "🥗", top: "90%", right: "30%", size: "1.7rem", rotate: "10deg" },
              { emoji: "🍜", top: "50%", left: "12%",  size: "1.9rem", rotate: "-5deg" },
              { emoji: "🧃", top: "40%", right: "5%",  size: "1.6rem", rotate: "22deg" },
              { emoji: "🍪", top: "50%", left: "68%",  size: "1.5rem", rotate: "-18deg" },
              { emoji: "🥞", top: "92%", left: "60%",  size: "2rem",   rotate: "8deg" },
              { emoji: "🍿", top: "40%", left: "38%",  size: "1.8rem", rotate: "-22deg" },
              { emoji: "🥨", top: "75%", left: "55%",  size: "1.6rem", rotate: "15deg" },
              { emoji: "🍕", top: "15%", left: "70%",  size: "2.0rem", rotate: "14deg" },
              { emoji: "🍔", top: "90%", left: "85%",  size: "2.2rem", rotate: "-11deg" }
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

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 font-[family-name:var(--font-heading)] drop-shadow-sm">
              Get your own ordering system set up
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-12 drop-shadow-sm">
              We&apos;ll handle the technical setup. You start taking your orders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="transition-all active:scale-[0.98] bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl w-full sm:w-auto h-16 px-10 text-xl font-medium shadow-xl">
                Request Setup
              </Button>
              <Button size="lg" variant="outline" asChild className="transition-all active:scale-[0.98] border-white/40 text-white hover:bg-white/10 rounded-xl w-full sm:w-auto h-16 px-10 text-xl font-medium bg-white/5 backdrop-blur-sm shadow-md">
                <Link href="mailto:jared@makefriendly.co.za">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                <Image 
                  src="/O_App_logo_transparent.png" 
                  alt="O.App Logo" 
                  width={52} 
                  height={52} 
                  className="object-contain"
                />
              </Link>
              <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
                The modern ordering system for South African food businesses. Take control of your digital storefront.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6 font-[family-name:var(--font-heading)]">Product Options</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/admin/login" className="text-slate-400 hover:text-white transition-colors">Admin Dashboard</Link>
                </li>
                <li>
                  <Link href="/order" className="text-slate-400 hover:text-white transition-colors">Customer Demo</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6 font-[family-name:var(--font-heading)]">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="mailto:jared@makefriendly.co.za" className="text-slate-400 hover:text-white transition-colors">
                    jared@makefriendly.co.za
                  </Link>
                </li>
                <li className="text-slate-400">
                  Cape Town, South Africa
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium">
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
