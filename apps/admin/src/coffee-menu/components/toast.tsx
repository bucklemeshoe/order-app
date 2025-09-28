"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const toast = { id, message, type }

    setToasts((prev) => [...prev, toast])

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center justify-between p-4 rounded-lg shadow-lg min-w-80 max-w-md
              ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : ""}
              ${toast.type === "error" ? "bg-red-50 border border-red-200 text-red-800" : ""}
              ${toast.type === "info" ? "bg-blue-50 border border-blue-200 text-blue-800" : ""}
              animate-in slide-in-from-right duration-300
            `}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-3 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
