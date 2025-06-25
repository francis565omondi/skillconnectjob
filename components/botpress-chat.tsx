"use client"

import { useEffect } from "react"

export function BotpressChat() {
  useEffect(() => {
    // Load Botpress webchat script
    const script1 = document.createElement('script')
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js'
    script1.async = true
    document.head.appendChild(script1)

    // Load your custom configuration script
    const script2 = document.createElement('script')
    script2.src = 'https://files.bpcontent.cloud/2025/06/24/13/20250624132644-YDRBM1DG.js'
    script2.async = true
    document.head.appendChild(script2)

    // Cleanup function to remove scripts when component unmounts
    return () => {
      if (document.head.contains(script1)) {
        document.head.removeChild(script1)
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2)
      }
    }
  }, [])

  return null // This component doesn't render anything visible
} 