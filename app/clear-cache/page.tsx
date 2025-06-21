"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Trash2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function ClearCachePage() {
  const [cleared, setCleared] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearAllData = () => {
    try {
      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Clear any other stored data
      if (typeof window !== 'undefined') {
        // Clear any cached data
        Object.keys(localStorage).forEach(key => {
          if (key.includes('skillconnect') || key.includes('cached')) {
            localStorage.removeItem(key)
          }
        })
      }
      
      setCleared(true)
      setError(null)
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      
    } catch (err) {
      setError(err.message)
      setCleared(false)
    }
  }

  const simulateLogin = (role: 'employer' | 'seeker' | 'admin') => {
    try {
      const mockUser = {
        id: `test-${role}-123`,
        firstName: "Test",
        lastName: "User",
        email: `test@${role}.com`,
        role: role,
        company_name: role === 'employer' ? "Test Company" : undefined
      }
      
      const mockSession = {
        loginTime: new Date().toISOString(),
        token: `mock-token-${role}-123`
      }
      
      localStorage.setItem("skillconnect_user", JSON.stringify(mockUser))
      sessionStorage.setItem("skillconnect_session", JSON.stringify(mockSession))
      
      setCleared(false)
      setError(null)
      
      // Redirect to appropriate dashboard
      setTimeout(() => {
        window.location.href = `/dashboard/${role}`
      }, 1000)
      
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
      <Card className="simple-card w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-slate-900 flex items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 text-orange-600" />
            Cache & Session Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          {cleared && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Cache cleared successfully! Page will reload in 2 seconds...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          )}

          {/* Clear Cache */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Clear All Data:</h3>
            <Button 
              onClick={clearAllData} 
              className="w-full btn-primary"
              disabled={cleared}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Cache & Session Data
            </Button>
            <p className="text-sm text-slate-600 mt-2">
              This will clear all stored data and reload the page. Use this if you're experiencing authentication issues.
            </p>
          </div>

          {/* Test Logins */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Test Login (for debugging):</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button 
                onClick={() => simulateLogin('employer')} 
                variant="outline" 
                className="btn-secondary"
              >
                Login as Employer
              </Button>
              <Button 
                onClick={() => simulateLogin('seeker')} 
                variant="outline" 
                className="btn-secondary"
              >
                Login as Seeker
              </Button>
              <Button 
                onClick={() => simulateLogin('admin')} 
                variant="outline" 
                className="btn-secondary"
              >
                Login as Admin
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              These buttons will create test user data and redirect you to the appropriate dashboard.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Quick Navigation:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="outline" className="btn-secondary" asChild>
                <Link href="/">Home Page</Link>
              </Button>
              <Button variant="outline" className="btn-secondary" asChild>
                <Link href="/auth/login">Login Page</Link>
              </Button>
              <Button variant="outline" className="btn-secondary" asChild>
                <Link href="/dashboard/employer">Employer Dashboard</Link>
              </Button>
              <Button variant="outline" className="btn-secondary" asChild>
                <Link href="/dashboard/seeker">Seeker Dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click "Clear All Cache & Session Data" to reset everything</li>
              <li>Use one of the test login buttons to simulate authentication</li>
              <li>Try accessing the dashboard pages again</li>
              <li>If issues persist, check the browser console for errors</li>
              <li>Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 