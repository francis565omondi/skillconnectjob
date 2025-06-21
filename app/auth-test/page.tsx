"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AuthTestPage() {
  const [userData, setUserData] = useState<any>(null)
  const [sessionData, setSessionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem("skillconnect_user")
        const session = sessionStorage.getItem("skillconnect_session")
        
        if (user) {
          setUserData(JSON.parse(user))
        }
        
        if (session) {
          setSessionData(JSON.parse(session))
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const clearAuth = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
    setUserData(null)
    setSessionData(null)
  }

  const simulateLogin = () => {
    const mockUser = {
      id: "test-user-123",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      role: "employer",
      company_name: "Test Company"
    }
    
    const mockSession = {
      loginTime: new Date().toISOString(),
      token: "mock-token-123"
    }
    
    localStorage.setItem("skillconnect_user", JSON.stringify(mockUser))
    sessionStorage.setItem("skillconnect_session", JSON.stringify(mockSession))
    
    setUserData(mockUser)
    setSessionData(mockSession)
  }

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

  return (
    <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
      <Card className="simple-card w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-slate-900">Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Data */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">User Data:</h3>
            {userData ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> 
                  <Badge className="ml-2 bg-orange-500 text-white border-0 rounded-xl">
                    {userData.role}
                  </Badge>
                </p>
                {userData.company_name && (
                  <p><strong>Company:</strong> {userData.company_name}</p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">No user data found</p>
              </div>
            )}
          </div>

          {/* Session Data */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Session Data:</h3>
            {sessionData ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p><strong>Login Time:</strong> {new Date(sessionData.loginTime).toLocaleString()}</p>
                <p><strong>Token:</strong> {sessionData.token}</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">No session data found</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={simulateLogin} className="btn-primary">
              Simulate Login
            </Button>
            <Button onClick={clearAuth} variant="outline" className="btn-secondary">
              Clear Auth
            </Button>
            <Button variant="outline" className="btn-secondary" asChild>
              <Link href="/auth/login">Go to Login</Link>
            </Button>
            <Button variant="outline" className="btn-secondary" asChild>
              <Link href="/test">Go to Test Page</Link>
            </Button>
          </div>

          {/* Dashboard Links */}
          {userData && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Dashboard Access:</h3>
              <div className="flex flex-wrap gap-2">
                {userData.role === "employer" && (
                  <Button variant="outline" className="btn-secondary" asChild>
                    <Link href="/dashboard/employer">Employer Dashboard</Link>
                  </Button>
                )}
                {userData.role === "seeker" && (
                  <Button variant="outline" className="btn-secondary" asChild>
                    <Link href="/dashboard/seeker">Seeker Dashboard</Link>
                  </Button>
                )}
                {userData.role === "admin" && (
                  <Button variant="outline" className="btn-secondary" asChild>
                    <Link href="/dashboard/admin">Admin Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 