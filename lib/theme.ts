// ── UI theme constants ──
// Centralised design tokens used across customer and admin components

export const UI = {
  text: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-muted-foreground/80",
  border: "border-border",
  surface: "bg-card text-card-foreground",
  surfaceAlt: "bg-muted text-muted-foreground",
  accentBg: "bg-brand text-primary-foreground",
  accentText: "text-brand",
} as const

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string; topBorder: string }> = {
  // Neutral - Pending / Awaiting Payment
  pending:            { label: "Pending",         color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-500/10", border: "border-slate-200 dark:border-slate-500/30", dot: "bg-slate-500", topBorder: "border-t-slate-500 dark:border-t-slate-600" },
  awaiting_payment:   { label: "Awaiting Pay",    color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-500/10", border: "border-slate-200 dark:border-slate-500/30", dot: "bg-slate-500", topBorder: "border-t-slate-500 dark:border-t-slate-600" },
  
  // Active/Progress - Paid / Preparing / Out for Delivery
  paid:               { label: "Paid",            color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/30", dot: "bg-blue-500", topBorder: "border-t-blue-500 dark:border-t-blue-600" },
  preparing:          { label: "Preparing",       color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/30", dot: "bg-blue-500", topBorder: "border-t-blue-500 dark:border-t-blue-600" },
  out_for_delivery:   { label: "Out for Delivery",color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/30", dot: "bg-blue-500", topBorder: "border-t-blue-500 dark:border-t-blue-600" },

  // Success/Ready - Ready
  ready:              { label: "Ready",           color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/30", dot: "bg-emerald-500", topBorder: "border-t-emerald-500 dark:border-t-emerald-600" },
  
  // Done/Archived - Collected / Delivered
  collected:          { label: "Collected",       color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-500/10", border: "border-slate-200 dark:border-slate-500/30", dot: "bg-slate-400", topBorder: "border-t-slate-400 dark:border-t-slate-700" },
  delivered:          { label: "Delivered",       color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-500/10", border: "border-slate-200 dark:border-slate-500/30", dot: "bg-slate-400", topBorder: "border-t-slate-400 dark:border-t-slate-700" },
  
  // Exception - Cancelled
  cancelled:          { label: "Cancelled",       color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/30", dot: "bg-red-500", topBorder: "border-t-red-500 dark:border-t-red-600" },
}
