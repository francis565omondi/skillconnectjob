"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {}

      // Check localStorage
      try {
        const userData = localStorage.getItem("skillconnect_user")
        const sessionData = sessionStorage.getItem("skillconnect_session")
        results.localStorage = {
          userData: userData ? JSON.parse(userData) : null,
          sessionData: sessionData ? JSON.parse(sessionData) : null,
          hasUser: !!userData,
          hasSession: !!sessionData
        }
      } catch (error) {
        results.localStorage = { error: error.message }
      }

      // Check window object
      try {
        results.window = {
          userAgent: navigator.userAgent,
          location: window.location.href,
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight
        }
      } catch (error) {
        results.window = { error: error.message }
      }

      // Check if components are available
      try {
        results.components = {
          Card: typeof Card !== 'undefined',
          Button: typeof Button !== 'undefined',
          Badge: typeof Badge !== 'undefined'
        }
      } catch (error) {
        results.components = { error: error.message }
      }

      // Check CSS classes
      try {
        const testElement = document.createElement('div')
        testElement.className = 'bg-light-gradient simple-card btn-primary'
        results.css = {
          bgLightGradient: testElement.classList.contains('bg-light-gradient'),
          simpleCard: testElement.classList.contains('simple-card'),
          btnPrimary: testElement.classList.contains('btn-primary')
        }
      } catch (error) {
        results.css = { error: error.message }
      }

      setDiagnostics(results)
      setIsLoading(false)
    }

    runDiagnostics()
  }, [])

  const testDashboardAccess = async (dashboardType: string) => {
    try {
      const response = await fetch(`/dashboard/${dashboardType}`)
      return {
        status: response.status,
        ok: response.ok,
        url: response.url
      }
    } catch (error) {
      return { error: error.message }
    }
  }

  const [testResults, setTestResults] = useState<any>({})

  const runTests = async () => {
    const results: any = {}
    
    results.employer = await testDashboardAccess('employer')
    results.seeker = await testDashboardAccess('seeker')
    results.admin = await testDashboardAccess('admin')
    
    setTestResults(results)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <Card className="simple-card w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Running diagnostics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-gradient p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Card className="simple-card">
          <CardHeader>
            <CardTitle className="text-slate-900">System Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* LocalStorage */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">LocalStorage Status:</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(diagnostics.localStorage, null, 2)}
                </pre>
              </div>
            </div>

            {/* Window Info */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Window Info:</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(diagnostics.window, null, 2)}
                </pre>
              </div>
            </div>

            {/* Components */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Component Availability:</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(diagnostics.components, null, 2)}
                </pre>
              </div>
            </div>

            {/* CSS */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">CSS Classes:</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(diagnostics.css, null, 2)}
                </pre>
              </div>
            </div>

            {/* Test Dashboard Access */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Dashboard Access Tests:</h3>
              <Button onClick={runTests} className="btn-primary mb-4">
                Run Dashboard Tests
              </Button>
              {Object.keys(testResults).length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Quick Actions:</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="btn-secondary" asChild>
                  <Link href="/">Home</Link>
                </Button>
                <Button variant="outline" className="btn-secondary" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="outline" className="btn-secondary" asChild>
                  <Link href="/dashboard/employer">Employer Dashboard</Link>
                </Button>
                <Button variant="outline" className="btn-secondary" asChild>
                  <Link href="/dashboard/seeker">Seeker Dashboard</Link>
                </Button>
                <Button variant="outline" className="btn-secondary" asChild>
                  <Link href="/dashboard/admin">Admin Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 