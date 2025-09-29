// Clerk imports removed - vanilla admin uses no auth
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { CircleUserRound, Settings, Eye } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  TooltipProvider,
  cn
} from '@order-app/design-system'
import { InspectContext } from '../contexts/InspectContext'

// Inspector functionality is used in the Eye button click handler



export default function AdminLayout({ children }: React.PropsWithChildren) {
  const { pathname } = useLocation()
  const [inspectMode, setInspectMode] = useState(false)

  const navItems = [
    { name: 'Dashboard', to: '/', current: pathname === '/' },
    { name: 'Menu', to: '/menu', current: pathname === '/menu' },
  ] as const

  const navbar = (
    <nav className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link to="/" className="flex items-center py-2">
                <img 
                  src="/O_App_logo_transparent.png" 
                  alt="O App Logo" 
                  className="h-6 w-auto max-w-[130px]"
                />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    aria-current={item.current ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      item.current 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center gap-2 md:ml-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setInspectMode(!inspectMode)}
                title={inspectMode ? "Disable component inspection" : "Enable component inspection"}
              >
                <Eye className={cn("h-5 w-5 transition-colors", inspectMode && "text-primary")} />
                {inspectMode && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
                <span className="sr-only">Toggle component inspection</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5" />
                <span className="sr-only">View notifications</span>
              </Button>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <CircleUserRound className="h-5 w-5" />
                      <span className="sr-only">Open user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon">
              <Bars3Icon className="h-6 w-6" />
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu - simplified for now, could be enhanced with Sheet component */}
    </nav>
  )

  return (
    <TooltipProvider>
      <InspectContext.Provider value={{ inspectMode, setInspectMode }}>
        <div className="min-h-screen bg-background">
          {inspectMode && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-primary/10 border-b border-primary/20 px-4 py-1 text-center">
              <div className="text-sm text-primary font-medium">
                🔍 Component Inspection Mode Active - Hover over components to see details
              </div>
            </div>
          )}
          <div className={inspectMode ? "pt-10" : ""}>
            {navbar}
            <main>
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </InspectContext.Provider>
    </TooltipProvider>
  )
}

