"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Briefcase, Mail, Lock, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { supabase } from "@/lib/supabaseClient"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  const clearUserSession = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    showLoading("Signing you in...", "Please wait while we verify your credentials")

    try {
      // Check if user exists in database
      const { data: users, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', formData.email.toLowerCase().trim())
        .limit(1)

      if (checkError) {
        console.error('Error checking user:', checkError)
        showError("Login failed", "An error occurred while checking your credentials")
        return
      }

      if (!users || users.length === 0) {
        showError("Account not found", "No account found with this email address. Please check your email or create a new account.")
        return
      }

      const user = users[0]

      // For now, we'll use a simple password check (in production, use proper hashing)
      // This is a temporary solution - in a real app, you'd use Supabase Auth or proper password hashing
      if (formData.password !== user.password) {
        showError("Invalid credentials", "The email or password you entered is incorrect. Please try again.")
        return
      }

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)

      // Create session data
      const session = {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        loginTime: new Date().toISOString(),
      }
      
      // Store session in sessionStorage (for auth guard)
      sessionStorage.setItem("skillconnect_session", JSON.stringify(session))
      
      // Store user data in localStorage (for dashboard data)
      localStorage.setItem("skillconnect_user", JSON.stringify(user))
      
      showSuccess("Login successful!", "Redirecting to your dashboard...")
      
      // Redirect based on user role
      setTimeout(() => {
        if (user.role === "admin") {
          window.location.href = "/dashboard/admin"
        } else if (user.role === "employer") {
          window.location.href = "/dashboard/employer"
        } else {
          window.location.href = "/dashboard/seeker"
        }
      }, 2000)
    } catch (error) {
      console.error('Error during login:', error)
      showError("Login failed", "An unexpected error occurred. Please try again.")
    }
  }

  const handleGoogleLogin = () => {
    showError("Google Login", "Google OAuth integration is not available in this demo")
  }

  return (
    <div className="min-h-screen bg-light-gradient">
      <StatusManager notifications={notifications} onRemove={removeNotification} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <Link href="/auth/signup" className="btn-secondary px-6 py-2">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="section-simple flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 simple-card-orange px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-orange-800 text-sm font-medium">Welcome Back</span>
            </div>

            <h1 className="heading-lg text-slate-900 mb-2">Sign in to your account</h1>
            <p className="text-simple text-slate-600">Continue your journey to find amazing opportunities</p>
          </div>

          <Card className="simple-card">
            <CardHeader className="text-center">
              <CardTitle className="text-slate-900">Sign In</CardTitle>
              <CardDescription className="text-slate-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-700 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full btn-primary h-12 text-base font-semibold">
                  Sign In
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 h-12 text-base font-semibold"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
