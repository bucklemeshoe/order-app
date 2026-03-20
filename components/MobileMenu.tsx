"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronRight, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-zinc-900 absolute right-4 transition-colors">
          <Menu className="w-6 h-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      {/* We use [&>button]:hidden to hide the default shadcn close button so we can render our own custom animated header instead */}
      <SheetContent side="right" className="w-full !max-w-full sm:w-full p-0 bg-white border-none [&>button]:hidden flex flex-col z-[100]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        
        {/* Header containing Logo and Custom Close Button */}
        <div className="w-full flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
          <SheetClose asChild>
            <Link href="/" aria-label="Home" className="pl-1">
              <Image 
                src="/O_App_logo_transparent.png" 
                alt="O.App Logo" 
                width={53} 
                height={53} 
                className="object-contain"
              />
            </Link>
          </SheetClose>
          <SheetClose className="rounded-full bg-zinc-100 p-2 text-zinc-600 active:scale-95 transition-all">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto w-full px-4 pt-3 pb-24 mx-auto max-w-lg">
          <nav className="flex flex-col">
            
            <div className="px-2 mt-1 mb-2">
              <SheetClose asChild>
                <Button asChild className="w-full justify-center bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-medium py-7 shadow-sm text-lg transition-all active:scale-[0.98]">
                  <Link href="/request-setup">Request Setup</Link>
                </Button>
              </SheetClose>
            </div>

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 mt-8 px-4">Main Navigation</div>
            
            <div className="flex flex-col border border-zinc-100 rounded-3xl overflow-hidden bg-white shadow-sm">
              <SheetClose asChild>
                <Link href="/" className="group flex flex-col justify-center px-5 py-4 font-medium text-[17px] text-zinc-600 active:text-zinc-900 border-b border-zinc-100 hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  <div className="flex items-center justify-between">
                    Home
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-active:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/documentation" className="group flex flex-col justify-center px-5 py-4 font-medium text-[17px] text-zinc-600 active:text-zinc-900 border-b border-zinc-100 hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  <div className="flex items-center justify-between">
                    Documentation
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-active:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/blog" className="group flex flex-col justify-center px-5 py-4 font-medium text-[17px] text-zinc-600 active:text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  <div className="flex items-center justify-between">
                    Blog
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-active:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              </SheetClose>
            </div>

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 mt-8 px-4">Live Demonstrations</div>
            
            <div className="flex flex-col border border-zinc-100 rounded-3xl overflow-hidden bg-white shadow-sm">
              <SheetClose asChild>
                <Link href="/order" className="group flex flex-col px-5 py-4 border-b border-zinc-100 hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[17px] text-zinc-600 group-active:text-zinc-900 transition-colors">Customer App</div>
                      <div className="text-zinc-400 font-normal text-sm mt-0.5 line-clamp-1">Experience a frictionless mock checkout.</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0 group-active:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link href="/admin/login" className="group flex flex-col px-5 py-4 hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[17px] text-zinc-600 group-active:text-zinc-900 transition-colors">Admin Dashboard</div>
                      <div className="text-zinc-400 font-normal text-sm mt-0.5 line-clamp-1">Explore order management controls.</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0 group-active:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              </SheetClose>
            </div>

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 mt-8 px-4">Legal</div>
            <div className="flex flex-col px-2">
              <SheetClose asChild>
                <Link href="/privacy-policy" className="flex items-center justify-between px-4 py-3 hover:bg-zinc-100/50 rounded-2xl font-semibold text-zinc-600 transition-colors">
                  Privacy Policy
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/terms-of-service" className="flex items-center justify-between px-4 py-3 hover:bg-zinc-100/50 rounded-2xl font-semibold text-zinc-600 transition-colors">
                  Terms of Service
                </Link>
              </SheetClose>
            </div>
            
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
