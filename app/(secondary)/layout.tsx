import Link from 'next/link'
import Image from 'next/image'
import { HeaderAction } from './header-action'
import { MobileMenu } from '@/components/MobileMenu'

export default function SecondaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 bg-white border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full">
        <div className="px-6 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" aria-label="Home" className="pl-2">
            <Image 
              src="/O_App_logo_transparent.png" 
              alt="O.App Logo" 
              width={53} 
              height={53} 
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-4 pr-1">
            <div className="hidden md:block">
              <HeaderAction />
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-40 md:pt-48 pb-24">
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
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex gap-6">
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
              <div className="flex gap-4 md:border-l md:border-zinc-800 md:pl-6 text-zinc-500">
                <a href="https://x.com/makefriendly" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <span className="sr-only">X (Twitter)</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.922H5.078z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
