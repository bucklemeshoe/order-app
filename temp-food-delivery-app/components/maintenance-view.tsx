"use client"

const UI = {
  text: "text-neutral-900",
  muted: "text-neutral-600",
  subtle: "text-neutral-500",
  border: "border-neutral-200",
  surface: "bg-white",
  surfaceAlt: "bg-neutral-50",
  accentBg: "bg-yellow-500",
  accentText: "text-yellow-600",
}

export interface MaintenanceViewProps {
  title?: string
  message?: string
  estimatedTime?: string
  supportContact?: string
  onRefresh?: () => void
  className?: string
}

export function MaintenanceView({
  title = "Under maintenance",
  message = "We're making some improvements to serve you better. We'll be back shortly!",
  estimatedTime,
  supportContact,
  onRefresh,
  className = "",
}: MaintenanceViewProps) {
  return (
    <section className={`grid gap-6 py-8 px-4 ${UI.text} ${className}`}>
      <div className="mt-8" />

      <div className={`rounded-xl border p-8 text-center ${UI.surface} ${UI.border}`}>
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
          <span className="text-3xl" aria-hidden="true">
            🔧
          </span>
        </div>

        {/* Title */}
        <div className="mt-6 text-xl font-semibold">{title}</div>

        {/* Message */}
        <p className={`mt-2 text-sm ${UI.muted} max-w-sm mx-auto`}>{message}</p>

        {/* Estimated Time */}
        {estimatedTime && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-neutral-900">
            <span className="text-blue-600" aria-hidden="true">
              ⏱️
            </span>
            <span className="font-medium">Estimated time: {estimatedTime}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 grid gap-3">
          {onRefresh && (
            <button
              type="button"
              className={`h-10 rounded-full font-medium transition-colors ${UI.accentBg} text-neutral-900 hover:bg-yellow-600 hover:text-white`}
              onClick={onRefresh}
            >
              Try Again
            </button>
          )}

          {supportContact && (
            <button
              type="button"
              className="h-10 rounded-full font-medium border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 transition-colors"
              onClick={() => window.open(`tel:${supportContact}`, "_self")}
            >
              Contact Support
            </button>
          )}
        </div>
      </div>

      {/* Status Updates */}
      <div className={`rounded-xl border p-4 ${UI.surface} ${UI.border}`}>
        <div className="text-sm font-medium mb-2">What's happening</div>
        <div className={`text-sm ${UI.muted} space-y-1`}>
          <div>• System updates in progress</div>
          <div>• Improving app performance</div>
          <div>• Adding new features</div>
        </div>
      </div>

      <div className="mb-12" />
    </section>
  )
}

export default MaintenanceView
