"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Mail, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Admin credentials (in production, this would be in a secure database)
  const ADMIN_CREDENTIALS = {
    email: "admin@skillconnect.co.ke",
    password: "admin123!",
    // You can add more admin users here
    alternativeAdmins: [
      { email: "superadmin@skillconnect.co.ke", password: "super123!" },
      { email: "moderator@skillconnect.co.ke", password: "mod123!" },
    ],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check admin credentials
      const isMainAdmin = formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password

      const isAlternativeAdmin = ADMIN_CREDENTIALS.alternativeAdmins.some(
        (admin) => admin.email === formData.email && admin.password === formData.password,
      )

      if (isMainAdmin || isAlternativeAdmin) {
        // Create admin user data
        const adminUser = {
          id: `admin_${Date.now()}`,
          firstName: "Admin",
          lastName: "User",
          email: formData.email,
          role: "admin",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }

        // Store admin user data
        localStorage.setItem("skillconnect_user", JSON.stringify(adminUser))

        // Create admin session
        const session = {
          userId: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          loginTime: new Date().toISOString(),
        }
        
        sessionStorage.setItem("skillconnect_session", JSON.stringify(session))

        // Redirect to admin dashboard
        window.location.href = "/dashboard/admin"
      } else {
        setError("Invalid admin credentials. Access denied.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-25 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Administrator Login</h1>
          <p className="text-muted-foreground">Restricted access for authorized personnel only</p>
        </div>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Secure Login</CardTitle>
            <CardDescription>Enter your administrator credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@skillconnect.co.ke"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
              </Button>
            </form>

            {/* Demo Credentials for Testing */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-800 mb-2">🔐 Demo Admin Credentials:</p>
              <div className="text-xs text-red-700 space-y-1">
                <div>
                  <strong>Email:</strong> admin@skillconnect.co.ke
                </div>
                <div>
                  <strong>Password:</strong> admin123!
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">⚠️ For development/testing only. Change in production!</p>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Not an admin? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Regular Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Security Notice</p>
              <p>All admin access attempts are logged and monitored. Unauthorized access is prohibited.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/">← Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
