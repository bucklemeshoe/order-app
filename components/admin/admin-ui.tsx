import React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// ==========================================
// 1. Layout Components
// ==========================================

export function AdminPage({
  children,
  className,
  layout = "fluid",
}: {
  children: React.ReactNode
  className?: string
  layout?: "fluid" | "left-aligned" | "centered"
}) {
  const layoutClass =
    layout === "fluid" ? "w-full" :
    layout === "left-aligned" ? "max-w-[1200px] w-full" :
    "max-w-[1200px] mx-auto w-full"

  return (
    <div className={cn("p-6 md:p-8 flex-1 flex flex-col", layoutClass, className)}>
      {children}
    </div>
  )
}

interface AdminHeaderProps {
  title: string
  description?: string
  backRoute?: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function AdminHeader({ title, description, backRoute, onBack, actions, className }: AdminHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      <div className="flex flex-col gap-2">
        {(backRoute || onBack) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight leading-8">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ==========================================
// 2. Surface Components
// ==========================================

export function AdminCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  )
}

export function AdminInnerCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/50 bg-background/50 p-4", className)}>
      {children}
    </div>
  )
}

type ColorTheme = "blue" | "green" | "amber" | "purple" | "sky" | "rose" | "emerald"

const colorStyles: Record<ColorTheme, { wrapper: string; icon: string }> = {
  blue: { wrapper: "bg-primary/10", icon: "text-primary" },
  green: { wrapper: "bg-primary/10", icon: "text-primary" },
  amber: { wrapper: "bg-primary/10", icon: "text-primary" },
  purple: { wrapper: "bg-primary/10", icon: "text-primary" },
  sky: { wrapper: "bg-primary/10", icon: "text-primary" },
  rose: { wrapper: "bg-primary/10", icon: "text-primary" },
  emerald: { wrapper: "bg-primary/10", icon: "text-primary" },
}

interface AdminSectionHeaderProps {
  icon: LucideIcon
  title: string
  description?: string
  colorTheme?: ColorTheme
  className?: string
}

export function AdminSectionHeader({
  icon: Icon,
  title,
  description,
  colorTheme = "blue",
  className,
}: AdminSectionHeaderProps) {
  const styles = colorStyles[colorTheme] || colorStyles.blue

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5", className)}>
      <div className="flex items-start gap-3">
        <div className={cn("h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center", styles.wrapper)}>
          <Icon className={cn("h-5 w-5", styles.icon)} />
        </div>
        <div className="pt-0.5">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. Form Components
// ==========================================

interface AdminFormGroupProps {
  label: React.ReactNode
  description?: React.ReactNode
  htmlFor?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function AdminFormGroup({
  label,
  description,
  htmlFor,
  children,
  className,
  action,
}: AdminFormGroupProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
          </label>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

// Specifically for Switch/Toggle rows
export function AdminToggleRow({
  label,
  description,
  children,
  className,
}: {
  label: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg border border-border p-3 gap-4", className)}>
      <div className="min-w-0">
        <div className="text-sm text-foreground font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5 truncate whitespace-normal">{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
