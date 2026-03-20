"use client"

import type React from "react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { GlobalHoursBanner } from "@/components/admin/global-hours-banner"
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { ThemeProvider, useTheme } from "@/components/admin/theme-provider"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin", icon: ClipboardList },
  { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  async function handleSignOut() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <GlobalHoursBanner />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-200 lg:static lg:translate-x-0",
          collapsed ? "w-[68px]" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo + collapse toggle */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          {!collapsed && (
            <Image
              src="/O_App_logo_transparent.png"
              alt="Order App"
              width={63}
              height={22}
              className="object-contain"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              collapsed && "mx-auto"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className={cn("flex-1 py-4 space-y-1", collapsed ? "px-2" : "px-3")}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "flex w-full items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn("pb-4 space-y-1", collapsed ? "px-2" : "px-3")}>
          <button
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={collapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
          </button>
          <button
            onClick={handleSignOut}
            className={cn(
              "flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Mobile header */}
        <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card lg:hidden shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Image
              src="/O_App_logo_transparent.png"
              alt="Order App"
              width={56}
              height={20}
              className="object-contain"
            />
          </div>
        </header>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  </div>
)
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <ThemeProvider>
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  )
}
