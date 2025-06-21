"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, CheckCircle, AlertCircle, LogIn } from "lucide-react"

export default function FixAuthPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      const sessionData = sessionStorage.getItem("skillconnect_session")
      
      setAuthStatus({
        hasUser: !!userData,
        hasSession: !!sessionData,
        user: userData ? JSON.parse(userData) : null,
        session: sessionData ? JSON.parse(sessionData) : null
      })
    } catch (error) {
      setAuthStatus({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const fixAuth = (role: 'employer' | 'seeker' | 'admin') => {
    try {
      // Clear existing data
      localStorage.removeItem("skillconnect_user")
      sessionStorage.removeItem("skillconnect_session")
      
      // Create proper user data
      const userData = {
        id: `fixed-${role}-${Date.now()}`,
        firstName: "Fixed",
        lastName: "User",
        email: `fixed@${role}.com`,
        role: role,
        company_name: role === 'employer' ? "Fixed Company" : undefined,
        created_at: new Date().toISOString()
      }
      
      const sessionData = {
        loginTime: new Date().toISOString(),
        token: `fixed-token-${role}-${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      
      // Store the data
      localStorage.setItem("skillconnect_user", JSON.stringify(userData))
      sessionStorage.setItem("skillconnect_session", JSON.stringify(sessionData))
      
      // Update status
      setAuthStatus({
        hasUser: true,
        hasSession: true,
        user: userData,
        session: sessionData
      })
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = `/dashboard/${role}`
      }, 1500)
      
    } catch (error) {
      setAuthStatus({ error: error.message })
    }
  }

  const clearAuth = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
    checkAuthStatus()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <Card className="simple-card w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
      <Card className="simple-card w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-slate-900 flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-orange-600" />
            Authentication Fix Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Current Authentication Status:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={authStatus?.hasUser ? "bg-green-500" : "bg-red-500"} variant="secondary">
                  {authStatus?.hasUser ? "✓" : "✗"} User Data
                </Badge>
                <Badge className={authStatus?.hasSession ? "bg-green-500" : "bg-red-500"} variant="secondary">
                  {authStatus?.hasSession ? "✓" : "✗"} Session Data
                </Badge>
              </div>
              {authStatus?.user && (
                <div className="text-sm text-slate-600">
                  <p><strong>Role:</strong> {authStatus.user.role}</p>
                  <p><strong>Email:</strong> {authStatus.user.email}</p>
                </div>
              )}
              {authStatus?.error && (
                <div className="text-sm text-red-600">
                  <p><strong>Error:</strong> {authStatus.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fix Options */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Fix Authentication:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={() => fixAuth('employer')} 
                className="btn-primary"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Fix as Employer
              </Button>
              <Button 
                onClick={() => fixAuth('seeker')} 
                className="btn-primary"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Fix as Seeker
              </Button>
              <Button 
                onClick={() => fixAuth('admin')} 
                className="btn-primary"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Fix as Admin
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Click one of these buttons to create proper authentication data and redirect to the dashboard.
            </p>
          </div>

          {/* Clear Auth */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Clear Authentication:</h3>
            <Button 
              onClick={clearAuth} 
              variant="outline" 
              className="btn-secondary w-full"
            >
              Clear All Authentication Data
            </Button>
            <p className="text-sm text-slate-600 mt-2">
              This will remove all stored authentication data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Quick Access:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="outline" className="btn-secondary" asChild>
                <Link href="/auth/login">Go to Login</Link>
              </Button>
              <Button variant="outline" className="btn-secondary" asChild>
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">How to Fix Dashboard Access:</h4>
            <ol className="text-sm text-orange-800 space-y-1 list-decimal list-inside">
              <li>If you see red badges above, your authentication is broken</li>
              <li>Click one of the "Fix as..." buttons to create proper auth data</li>
              <li>You'll be automatically redirected to the dashboard</li>
              <li>All dashboard pages should now work properly</li>
              <li>If you still have issues, try clearing auth data first</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 