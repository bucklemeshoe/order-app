// ── Formatting helpers for Order App ──

/** Format a number as South African Rand: R12.50 */
export function formatCurrency(amount: number): string {
  return `R${amount.toFixed(2)}`
}

/** Format order number: #1001 */
export function formatOrderNumber(num: number | null | undefined): string {
  if (!num) return "#—"
  return `#${num}`
}

/** Format a date string for display: "17 Mar 2026" */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Format a date string for date+time display: "17 Mar 2026, 14:30" */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Format time only: "14:30" */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
