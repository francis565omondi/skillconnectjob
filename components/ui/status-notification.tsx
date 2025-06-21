"use client"

import { useState, useEffect, useCallback } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, AlertTriangle, Loader2 } from "lucide-react"

// Local type definitions
export type StatusType = "success" | "error" | "warning" | "loading"

export interface StatusMessage {
  type: StatusType
  message: string
  details?: string
  duration?: number
}

interface StatusNotificationProps {
  status: StatusType
  message: string
  details?: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
  className?: string
}

export function StatusNotification({
  status,
  message,
  details,
  onClose,
  autoClose = true,
  duration = 5000,
  className = "",
}: StatusNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose && status !== "loading") {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose, status])

  if (!isVisible) return null

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "loading":
        return "bg-orange-50 border-orange-200 text-orange-800"
      default:
        return "bg-slate-50 border-slate-200 text-slate-800"
    }
  }

  return (
    <Alert className={`${getStatusStyles()} shadow-lg border-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <AlertDescription className="font-medium text-sm">
            {message}
          </AlertDescription>
          {details && (
            <p className="mt-1 text-xs opacity-90">
              {details}
            </p>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="flex-shrink-0 h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-black/10 rounded-full transition-all duration-200"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  )
}

interface StatusManagerProps {
  notifications: StatusMessage[]
  onRemove: (index: number) => void
  className?: string
}

export function StatusManager({ notifications, onRemove, className = "" }: StatusManagerProps) {
  // Only show the most recent notification
  const currentNotification = notifications[notifications.length - 1]

  if (!currentNotification) return null

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-sm transition-all duration-300 ease-in-out ${className}`}>
      <StatusNotification
        status={currentNotification.type}
        message={currentNotification.message}
        details={currentNotification.details}
        onClose={() => onRemove(notifications.length - 1)}
        autoClose={currentNotification.type !== "loading"}
        duration={currentNotification.duration}
      />
    </div>
  )
}

// Hook for managing status notifications
export function useStatusManager() {
  const [notifications, setNotifications] = useState<StatusMessage[]>([])

  const addNotification = useCallback((notification: StatusMessage) => {
    setNotifications(prev => [...prev, notification])
  }, [])

  const removeNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const showSuccess = useCallback((message: string, details?: string, duration?: number) => {
    // Clear any existing notifications first
    setNotifications([])
    // Add new notification after a brief delay
    setTimeout(() => {
      addNotification({
        type: "success",
        message,
        details,
        duration
      })
    }, 100)
  }, [addNotification])

  const showError = useCallback((message: string, details?: string, duration?: number) => {
    // Clear any existing notifications first
    setNotifications([])
    // Add new notification after a brief delay
    setTimeout(() => {
      addNotification({
        type: "error",
        message,
        details,
        duration
      })
    }, 100)
  }, [addNotification])

  const showWarning = useCallback((message: string, details?: string, duration?: number) => {
    // Clear any existing notifications first
    setNotifications([])
    // Add new notification after a brief delay
    setTimeout(() => {
      addNotification({
        type: "warning",
        message,
        details,
        duration
      })
    }, 100)
  }, [addNotification])

  const showLoading = useCallback((message: string, details?: string) => {
    // Clear any existing notifications first
    setNotifications([])
    // Add new notification after a brief delay
    setTimeout(() => {
      addNotification({
        type: "loading",
        message,
        details
      })
    }, 100)
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showLoading
  }
} 