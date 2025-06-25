"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Shield, LogIn } from "lucide-react"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "seeker" | "employer" | "admin"
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isRedirecting) return

    const checkAuth = async () => {
      try {
        const session = sessionStorage.getItem("skillconnect_session")
        const userData = localStorage.getItem("skillconnect_user")
        
        if (session && userData) {
          const sessionData = JSON.parse(session)
          const user = JSON.parse(userData)
          
          // Check if session is valid (not expired)
          const sessionTime = new Date(sessionData.loginTime)
          const now = new Date()
          const sessionAge = now.getTime() - sessionTime.getTime()
          const maxSessionAge = 24 * 60 * 60 * 1000 // 24 hours
          
          if (sessionAge < maxSessionAge) {
            setIsAuthenticated(true)
            setUserRole(user.role)
            
            // Check if user has the required role
            if (requiredRole && user.role !== requiredRole) {
              setIsRedirecting(true)
              // Redirect to appropriate dashboard based on user's actual role
              if (user.role === "employer") {
                await router.push("/dashboard/employer")
              } else if (user.role === "seeker") {
                await router.push("/dashboard/seeker")
              } else if (user.role === "admin") {
                await router.push("/dashboard/admin")
              }
              // No need to return or do anything else, effect will re-run and exit
              return
            }
          } else {
            // Session expired, clear it
            sessionStorage.removeItem("skillconnect_session")
            localStorage.removeItem("skillconnect_user")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear invalid session data
        sessionStorage.removeItem("skillconnect_session")
        localStorage.removeItem("skillconnect_user")
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [requiredRole, router, isRedirecting])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <Card className="simple-card w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <Card className="simple-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-slate-900">Authentication Required</CardTitle>
            <CardDescription className="text-slate-600">
              {requiredRole 
                ? `You need to be logged in as a ${requiredRole} to access this page.`
                : "You need to be logged in to access this page."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-primary" asChild>
              <Link href="/auth/login">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Specific guards for different user types
export function SeekerGuard({ children, fallback }: Omit<AuthGuardProps, "requiredRole">) {
  return <AuthGuard requiredRole="seeker" fallback={fallback}>{children}</AuthGuard>
}

export function EmployerGuard({ children, fallback }: Omit<AuthGuardProps, "requiredRole">) {
  return <AuthGuard requiredRole="employer" fallback={fallback}>{children}</AuthGuard>
}

export function AdminGuard({ children, fallback }: Omit<AuthGuardProps, "requiredRole">) {
  return <AuthGuard requiredRole="admin" fallback={fallback}>{children}</AuthGuard>
}
