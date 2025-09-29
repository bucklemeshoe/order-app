import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {showText ? <span className="font-semibold tracking-tight">Menu Builder</span> : null}
    </div>
  )
}
