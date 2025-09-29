import { cn } from "@/lib/utils"
import { withInspector } from "../../lib/inspector"

type LogoProps = {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {showText ? <span className="text-lg font-semibold tracking-tight">Menu Builder</span> : null}
    </div>
  )
}

// Create inspectable version of Logo
export const InspectableLogo = withInspector(
  Logo,
  'Logo',
  'logo.tsx (coffee-menu component)',
  'apps/admin/src/coffee-menu/components/logo.tsx',
  8
)
