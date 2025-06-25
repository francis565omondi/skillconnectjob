"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Check session storage
    const session = sessionStorage.getItem("skillconnect_session")
    if (session) {
      setSessionData(JSON.parse(session))
    }

    // Check local storage
    const user = localStorage.getItem("skillconnect_user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const testRedirect = () => {
    const redirectUrl = "/jobs/test-job-id/apply"
    console.log('Testing redirect to:', redirectUrl)
    window.location.href = `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
  }

  const clearSession = () => {
    sessionStorage.removeItem("skillconnect_session")
    localStorage.removeItem("skillconnect_user")
    setSessionData(null)
    setUserData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Redirect Test Page</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {sessionData ? JSON.stringify(sessionData, null, 2) : 'No session data'}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {userData ? JSON.stringify(userData, null, 2) : 'No user data'}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 space-y-4">
          <Button onClick={testRedirect} className="mr-4">
            Test Redirect to Login
          </Button>
          
          <Button onClick={clearSession} variant="outline">
            Clear Session
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Test Redirect to Login" to simulate clicking Apply Now</li>
            <li>You should be redirected to login page with redirect parameter</li>
            <li>After login, you should be redirected back to the application form</li>
            <li>Check the browser console for debugging information</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 