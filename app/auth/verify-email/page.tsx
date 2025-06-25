"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { supabase } from "@/lib/supabaseClient"
import { Logo } from "@/components/logo"

export default function VerifyEmailPage() {
  const [pendingVerification, setPendingVerification] = useState<any>(null)
  const [isResending, setIsResending] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending')
  
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  useEffect(() => {
    // Check if user is coming from signup
    const stored = sessionStorage.getItem("pending_verification")
    if (stored) {
      setPendingVerification(JSON.parse(stored))
    }

    // Check URL parameters for email verification
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const type = urlParams.get('type')

    if (token && type === 'signup') {
      handleEmailVerification(token)
    }
  }, [])

  const handleEmailVerification = async (token: string) => {
    showLoading("Verifying your email...", "Please wait while we confirm your account")
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })

      if (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
        showError("Verification failed", error.message)
        return
      }

      if (data.user) {
        setVerificationStatus('verified')
        showSuccess("Email verified successfully!", "Your account is now active. You can now log in.")
        
        // Create user profile
        await createUserProfile(data.user)
        
        // Get redirect URL from stored data
        const stored = sessionStorage.getItem("pending_verification")
        let redirectUrl = "/auth/login"
        
        if (stored) {
          const userData = JSON.parse(stored)
          if (userData.redirectUrl) {
            redirectUrl = `/auth/login?redirect=${encodeURIComponent(userData.redirectUrl)}`
          }
        }
        
        // Clear pending verification
        sessionStorage.removeItem("pending_verification")
        
        // Redirect to login (with redirect URL if available) after 3 seconds
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 3000)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
      showError("Verification failed", "An unexpected error occurred. Please try again.")
    }
  }

  const createUserProfile = async (user: any) => {
    try {
      console.log('Creating profile for user:', user.id)
      
      const stored = sessionStorage.getItem("pending_verification")
      if (!stored) {
        console.error('No pending verification data found in sessionStorage')
        throw new Error('No user data found for profile creation')
      }

      const userData = JSON.parse(stored)
      console.log('User data from sessionStorage:', userData)
      
      const profileData = {
        id: user.id,
        first_name: userData.firstName || user.user_metadata?.first_name || '',
        last_name: userData.lastName || user.user_metadata?.last_name || '',
        email: userData.email || user.email || '',
        phone: userData.phone || user.user_metadata?.phone || "",
        role: userData.role || user.user_metadata?.role || 'seeker',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        // Role-specific fields
        ...(userData.role === "seeker" && {
          skills: [],
          experience: "",
          education: "",
          location: "",
          bio: "",
        }),
        ...(userData.role === "employer" && {
          company_name: "",
          company_size: "",
          industry: "",
          website: "",
          description: "",
        }),
      }

      console.log('Profile data to insert:', profileData)

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()

      if (error) {
        console.error('Error creating profile:', error.message || error)
        // If it's a duplicate key error, the profile might already exist
        if (error.code === '23505') {
          console.log('Profile already exists, continuing...')
          return
        }
        throw error
      }

      console.log('Profile created successfully:', data)
      
      // Clear the pending verification data
      sessionStorage.removeItem("pending_verification")
      
    } catch (error) {
      console.error('Error creating user profile:', error instanceof Error ? error.message : error)
      // Don't throw the error, just log it and continue
      // The user can still log in and we can handle missing profile in the login flow
    }
  }

  const handleResendVerification = async () => {
    if (!pendingVerification?.email) {
      showError("No email found", "Please go back to signup and try again.")
      return
    }

    setIsResending(true)
    showLoading("Resending verification email...", "Please wait")

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingVerification.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      })

      if (error) {
        showError("Failed to resend email", error.message)
      } else {
        showSuccess("Verification email sent!", "Please check your inbox and spam folder.")
      }
    } catch (error) {
      showError("Failed to resend email", "An unexpected error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (verificationStatus === 'verified') {
    // Get redirect URL from stored data
    const stored = sessionStorage.getItem("pending_verification")
    let loginUrl = "/auth/login"
    
    if (stored) {
      const userData = JSON.parse(stored)
      if (userData.redirectUrl) {
        loginUrl = `/auth/login?redirect=${encodeURIComponent(userData.redirectUrl)}`
      }
    }

    return (
      <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        
        <div className="section-simple flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <Card className="simple-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                  Email Verified Successfully!
                </CardTitle>
                <CardDescription className="text-gray-600 mb-6">
                  Your account has been activated. You can now log in to access your dashboard.
                </CardDescription>
                <Button className="w-full btn-primary" asChild>
                  <Link href={loginUrl}>
                    Continue to Login
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        
        <div className="section-simple flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <Card className="simple-card text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                  Verification Failed
                </CardTitle>
                <CardDescription className="text-gray-600 mb-6">
                  There was an issue verifying your email. Please try signing up again or contact support.
                </CardDescription>
                <div className="space-y-3">
                  <Button className="w-full btn-primary" asChild>
                    <Link href="/auth/signup">
                      Try Again
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login">
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-gradient">
      <StatusManager notifications={notifications} onRemove={removeNotification} />
      
      <div className="section-simple flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="simple-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
              <CardDescription className="text-gray-600">
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pendingVerification && (
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Check your email at <strong>{pendingVerification.email}</strong> and click the verification link to activate your account.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Check your inbox and spam folder</p>
                  <p>• Click the verification link in the email</p>
                  <p>• Return here to complete your registration</p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full"
                    variant="outline"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>

                  <Button className="w-full btn-primary" asChild>
                    <Link href="/auth/login">
                      I've Verified My Email
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                </div>

                <div className="text-center">
                  <Link href="/auth/signup" className="text-sm text-orange-600 hover:text-orange-700">
                    ← Back to Sign Up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
} 