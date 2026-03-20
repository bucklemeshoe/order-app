import Link from 'next/link'
import Image from 'next/image'
import { HeaderAction } from './header-action'

export default function SecondaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-5xl">
          <Link href="/" aria-label="Home" className="pl-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/O_App_logo_transparent.png" 
              alt="O.App Logo" 
              width={53} 
              height={53} 
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-4 pr-1">
            <HeaderAction />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-24">
        {children}
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-800 pt-20 pb-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div className="max-w-sm">
              <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                <Image 
                  src="/O_App_logo_transparent.png" 
                  alt="O.App Logo" 
                  width={65} 
                  height={65} 
                  className="object-contain"
                />
              </Link>
              <p className="text-zinc-400 text-lg leading-relaxed">
                The modern ordering system for South African food businesses. Take control of your digital storefront.
              </p>
            </div>
            
            <div className="flex flex-col md:items-end md:text-right">
              <h4 className="text-white font-bold text-lg mb-6 font-[family-name:var(--font-heading)]">Quick Links</h4>
              <ul className="space-y-4 text-left md:text-right">
                <li>
                  <Link href="/admin/login" className="text-zinc-400 hover:text-white transition-colors">Admin App</Link>
                </li>
                <li>
                  <Link href="/order" className="text-zinc-400 hover:text-white transition-colors">Customer App</Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-zinc-400 hover:text-white transition-colors">Documentation</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600 font-medium">
            <p>© {new Date().getFullYear()} O.App. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
