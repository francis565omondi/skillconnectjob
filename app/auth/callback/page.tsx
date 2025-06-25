"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { supabase } from "@/lib/supabaseClient"
import { Footer } from "@/components/footer"
import { AuthNavbar } from "@/components/auth-navbar"
import { 
  Users, 
  Building, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Sparkles,
  User,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"

export default function OAuthCallbackPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState("seeker")
  const [additionalInfo, setAdditionalInfo] = useState({
    phone: "",
    companyName: "",
  })
  const [redirectUrl, setRedirectUrl] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get redirect URL from search parameters
        const redirect = searchParams.get('redirect')
        if (redirect) {
          setRedirectUrl(redirect)
        }

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('OAuth callback error:', error)
          showError("Authentication Failed", error.message || "Failed to complete authentication")
          setIsLoading(false)
          return
        }

        if (!data.session) {
          console.error('No session found after OAuth')
          showError("Authentication Failed", "No session found after authentication")
          setIsLoading(false)
          return
        }

        const currentUser = data.session.user
        setUser(currentUser)

        // Check if user already has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, show role selection
          setShowRoleSelection(true)
          setIsLoading(false)
        } else if (profileError) {
          console.error('Error checking profile:', profileError)
          showError("Profile Error", "Error checking user profile")
          setIsLoading(false)
        } else {
          // Profile exists, complete login
          await completeLogin(profile)
        }

      } catch (error) {
        console.error('OAuth callback error:', error)
        showError("Authentication Failed", "An unexpected error occurred")
        setIsLoading(false)
      }
    }

    handleOAuthCallback()
  }, [searchParams, showError])

  const completeLogin = async (profile: any) => {
    try {
      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profile.id)

      // Create session data
      const session = {
        userId: profile.id,
        id: profile.id,
        email: profile.email,
        role: profile.role,
        firstName: profile.first_name,
        lastName: profile.last_name,
        loginTime: new Date().toISOString(),
        isLoggedIn: true,
      }

      // Store session and user data
      sessionStorage.setItem("skillconnect_session", JSON.stringify({ ...session, lastLogin: Date.now() }))
      localStorage.setItem("skillconnect_user", JSON.stringify(profile))

      showSuccess("Login successful!", "Redirecting...")

      // Redirect based on role or redirect URL
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl)
        } else if (profile.role === "admin") {
          router.push("/dashboard/admin")
        } else if (profile.role === "employer") {
          router.push("/dashboard/employer")
        } else {
          router.push("/dashboard/seeker")
        }
      }, 2000)

    } catch (error) {
      console.error('Error completing login:', error)
      showError("Login Failed", "Error completing login process")
    }
  }

  const handleRoleSelection = async () => {
    if (!user) return

    showLoading("Creating your profile...", "Please wait while we set up your account")

    try {
      // Extract user info from Google OAuth
      const userMetadata = user.user_metadata || {}
      const email = user.email || userMetadata.email
      const firstName = userMetadata.full_name?.split(' ')[0] || userMetadata.first_name || ''
      const lastName = userMetadata.full_name?.split(' ').slice(1).join(' ') || userMetadata.last_name || ''

      // Create profile based on selected role
      const profileData = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: additionalInfo.phone,
        role: selectedRole,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        // Role-specific fields
        ...(selectedRole === "seeker" && {
          skills: [],
          experience: "",
          education: "",
          location: "",
          bio: "",
        }),
        ...(selectedRole === "employer" && {
          company_name: additionalInfo.companyName,
          company_size: "",
          industry: "",
          website: "",
          description: "",
        }),
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()

      if (profileError) {
        console.error('Error creating profile:', profileError)
        showError("Profile Creation Failed", profileError.message || "Failed to create user profile")
        return
      }

      // Complete login with new profile
      await completeLogin(profile)

    } catch (error) {
      console.error('Error creating profile:', error)
      showError("Profile Creation Failed", "An unexpected error occurred")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        <AuthNavbar />
        
        <div className="section-simple flex items-center justify-center px-4">
          <Card className="simple-card w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Completing Authentication</h2>
              <p className="text-slate-600 text-center">Please wait while we verify your account...</p>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    )
  }

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        <AuthNavbar />
        
        <div className="section-simple flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 simple-card-orange px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800 text-sm font-medium">Complete Your Profile</span>
              </div>

              <h1 className="text-2xl font-semibold text-center mb-4">Welcome to SkillConnect!</h1>
              <p className="text-simple text-slate-600">Tell us about yourself to complete your account setup</p>
            </div>

            <Card className="simple-card">
              <CardHeader className="text-center">
                <CardTitle className="text-slate-900">Complete Registration</CardTitle>
                <CardDescription className="text-slate-600">Choose your role and provide additional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info Display */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {user?.user_metadata?.full_name || user?.email}
                      </p>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">I am a:</Label>
                  <RadioGroup
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value)}
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

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                      value={additionalInfo.phone}
                      onChange={(e) => setAdditionalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Company Name (for employers) */}
                {selectedRole === "employer" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-slate-700 font-medium">
                      Company Name
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="companyName"
                        type="text"
                        placeholder="Enter your company name"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                        value={additionalInfo.companyName}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, companyName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleRoleSelection}
                  className="w-full btn-primary h-12 text-base font-semibold"
                >
                  Complete Registration
                </Button>
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
      <AuthNavbar />
      
      <div className="section-simple flex items-center justify-center px-4">
        <Card className="simple-card w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Error</h2>
            <p className="text-slate-600 text-center mb-6">Something went wrong during authentication</p>
            <Button asChild>
              <Link href="/auth/login">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
} 