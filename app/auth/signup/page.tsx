"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Users,
  Building,
  Check,
  X,
} from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { supabase } from "@/lib/supabaseClient"
import { Logo } from "@/components/logo"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "seeker",
    agreeToTerms: false,
  })
  const [redirectUrl, setRedirectUrl] = useState("")

  const searchParams = useSearchParams()
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  useEffect(() => {
    // Get redirect URL from search parameters
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(redirect)
    }
  }, [searchParams])

  // Password strength validation
  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasNoSpaces = !/\s/.test(password)

    const requirements = {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      hasNoSpaces,
    }

    const isValid = Object.values(requirements).every(Boolean)

    return {
      isValid,
      requirements,
      strength: calculatePasswordStrength(password),
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
    if (password.length >= 12) score += 1
    
    if (score <= 2) return "weak"
    if (score <= 4) return "medium"
    if (score <= 5) return "strong"
    return "very-strong"
  }

  const passwordValidation = validatePassword(formData.password)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // Basic phone validation for Kenyan numbers
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email format
    if (!validateEmail(formData.email)) {
      showError("Invalid email format", "Please enter a valid email address")
      return
    }

    // Validate phone format
    if (!validatePhone(formData.phone)) {
      showError("Invalid phone number", "Please enter a valid Kenyan phone number (e.g., +254 700 000 000)")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match", "Please ensure both passwords are identical")
      return
    }

    if (!passwordValidation.isValid) {
      showError("Password is too weak", "Please ensure your password meets all requirements")
      return
    }

    if (!formData.agreeToTerms) {
      showError("Terms and Conditions", "Please agree to the terms and conditions")
      return
    }

    showLoading("Creating your account...", "Please wait while we set up your profile")

    try {
      // Use Supabase Auth to create user with email verification
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone.replace(/\s/g, ''),
            role: formData.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        if (authError.message.includes('already registered')) {
          showError("Email already registered", "This email address is already associated with an account. Please use a different email or try logging in.")
        } else {
          showError("Registration failed", `Error: ${authError.message}`)
        }
        return
      }

      if (authData.user && !authData.user.email_confirmed_at) {
        // User created but email not confirmed
        showSuccess(
          "Account created successfully!", 
          "Please check your email and click the verification link to activate your account before logging in."
        )
        
        // Store user data temporarily for email verification page
        sessionStorage.setItem("pending_verification", JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          redirectUrl: redirectUrl // Store redirect URL for after verification
        }))
        
        // Redirect to email verification page
        setTimeout(() => {
          window.location.href = "/auth/verify-email"
        }, 2000)
      } else {
        // Email already confirmed (unlikely but possible)
        showSuccess("Account created successfully!", "Redirecting...")
        
        // Create profile in profiles table
        await createUserProfile(authData.user!)
        
        // After successful signup, update sessionStorage
        sessionStorage.setItem("skillconnect_session", JSON.stringify({ ...sessionData, lastLogin: Date.now() }));
        
        setTimeout(() => {
          if (redirectUrl) {
            window.location.href = redirectUrl
          } else if (formData.role === "admin") {
            window.location.href = "/dashboard/admin"
          } else if (formData.role === "employer") {
            window.location.href = "/dashboard/employer"
          } else {
            window.location.href = "/dashboard/seeker"
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Error during registration:', error)
      showError("Registration failed", "An unexpected error occurred. Please try again.")
    }
  }

  const createUserProfile = async (user: any) => {
    try {
      const profileData = {
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\s/g, ''),
        role: formData.role,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        // Role-specific fields
        ...(formData.role === "seeker" && {
          skills: [],
          experience: "",
          education: "",
          location: "",
          bio: "",
        }),
        ...(formData.role === "employer" && {
          company_name: "",
          company_size: "",
          industry: "",
          website: "",
          description: "",
        }),
      }

      const { error } = await supabase
        .from('profiles')
        .insert([profileData])

      if (error) {
        console.error('Error creating profile:', error.message || error)
        throw error
      }
    } catch (error) {
      console.error('Error creating user profile:', error instanceof Error ? error.message : error)
      throw error
    }
  }

  const handleGoogleSignup = async () => {
    showLoading("Connecting to Google...", "Please wait while we authenticate with Google")

    try {
      // Start Google OAuth flow with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl || '')}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) {
        console.error('Google OAuth error:', error)
        showError("Google Signup Failed", error.message || "Failed to connect with Google. Please try again.")
        return
      }

      // The user will be redirected to Google for authentication
      // After successful authentication, they'll be redirected back to /auth/callback
      console.log('Google OAuth initiated:', data)
      
    } catch (error) {
      console.error('Google signup error:', error)
      showError("Google Signup Failed", "An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-light-gradient">
      <StatusManager notifications={notifications} onRemove={removeNotification} />
      
      <div className="section-simple flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 simple-card-orange px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-orange-800 text-sm font-medium">Join Our Community</span>
            </div>

            <h1 className="text-2xl font-semibold text-center mb-4">Create Your Account</h1>
            <p className="text-simple text-slate-600">Join thousands of professionals in Kenya</p>
          </div>

          <Card className="simple-card">
            <CardHeader className="text-center">
              <CardTitle className="text-slate-900">Sign Up</CardTitle>
              <CardDescription className="text-slate-600">Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">I am a:</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 simple-card-orange hover-lift cursor-pointer">
                      <RadioGroupItem value="seeker" id="seeker" className="border-orange-400 text-orange-500" />
                      <Label htmlFor="seeker" className="text-orange-800 cursor-pointer flex items-center font-medium">
                        <Users className="w-4 h-4 mr-2" />
                        Job Seeker
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 simple-card-orange hover-lift cursor-pointer">
                      <RadioGroupItem value="employer" id="employer" className="border-orange-400 text-orange-500" />
                      <Label
                        htmlFor="employer"
                        className="text-orange-800 cursor-pointer flex items-center font-medium"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Employer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        className="pl-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        className="pl-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl ${
                        formData.email && !validateEmail(formData.email) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    {formData.email && (
                      <div className="absolute right-3 top-3">
                        {validateEmail(formData.email) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="text-xs text-red-600">Please enter a valid email address</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      className={`pl-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl ${
                        formData.phone && !validatePhone(formData.phone) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                    {formData.phone && (
                      <div className="absolute right-3 top-3">
                        {validatePhone(formData.phone) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.phone && !validatePhone(formData.phone) && (
                    <p className="text-xs text-red-600">Please enter a valid Kenyan phone number</p>
                  )}
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Password strength:</span>
                          <span className={`font-medium ${
                            passwordValidation.strength === "strong" ? 'text-green-600' : 
                            passwordValidation.strength === "medium" ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {passwordValidation.strength === "strong" ? 'Strong' : 
                             passwordValidation.strength === "medium" ? 'Medium' : 'Weak'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(passwordValidation.requirements).map(([key, passed]) => (
                            <div key={key} className="flex items-center space-x-2 text-xs">
                              {passed ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <X className="w-3 h-3 text-red-500" />
                              )}
                              <span className={passed ? 'text-green-600' : 'text-red-600'}>
                                {key === 'minLength' && 'At least 8 characters'}
                                {key === 'hasUpperCase' && 'One uppercase letter'}
                                {key === 'hasLowerCase' && 'One lowercase letter'}
                                {key === 'hasNumbers' && 'One number'}
                                {key === 'hasSpecialChar' && 'One special character'}
                                {key === 'hasNoSpaces' && 'No spaces'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-slate-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full btn-primary h-12 text-base font-semibold">
                  Create Account
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
                  onClick={handleGoogleSignup}
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
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium">
                    Sign in here
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
