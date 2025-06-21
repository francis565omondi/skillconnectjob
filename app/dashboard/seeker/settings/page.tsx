"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home,
  FileText,
  User,
  Settings,
  Bell,
  Search,
  Briefcase,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  Lock,
  Save,
  Check,
  X,
  AlertTriangle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"

type SettingsSection = "account" | "password" | "notifications" | "privacy" | "deactivate"

function SettingsPageContent() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Account Information State
  const [accountInfo, setAccountInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailApplicationUpdates: true,
    emailNewsletter: false,
    pushJobAlerts: true,
    pushApplicationUpdates: true,
    pushNewsletter: false,
    smsJobAlerts: false,
    smsApplicationUpdates: false,
  })

  // Privacy Settings State
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowProfileViews: true,
    allowJobRecommendations: true,
  })

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("skillconnect_user")
        if (!userData) return
        
        const user = JSON.parse(userData)
        
        // Fetch user profile from database
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          // Use localStorage data as fallback
          setAccountInfo({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
            bio: user.bio || "",
          })
        } else {
          // Use database data
          setAccountInfo({
            firstName: profileData.first_name || user.firstName || "",
            lastName: profileData.last_name || user.lastName || "",
            email: profileData.email || user.email || "",
            phone: profileData.phone || user.phone || "",
            location: profileData.location || user.location || "",
            bio: profileData.bio || user.bio || "",
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [])

  // Password validation
  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    
    const strength = Object.values(checks).filter(Boolean).length
    return { checks, strength, isValid: strength >= 4 }
  }

  const passwordValidation = validatePassword(passwordData.newPassword)

  // Handle account information update
  const handleAccountUpdate = async () => {
    setIsLoading(true)
    setSaveStatus("saving")
    
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) {
        throw new Error("User not found")
      }
      
      const user = JSON.parse(userData)
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: accountInfo.firstName,
          last_name: accountInfo.lastName,
          email: accountInfo.email,
          phone: accountInfo.phone,
          location: accountInfo.location,
          bio: accountInfo.bio,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        throw error
      }
      
      // Update localStorage
      const updatedUser = { ...user, ...accountInfo }
      localStorage.setItem("skillconnect_user", JSON.stringify(updatedUser))
      
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      console.error('Error updating account:', error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    if (!passwordValidation.isValid) {
      alert("Password is too weak. Please ensure it meets all requirements.")
      return
    }

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user = localStorage.getItem("skillconnect_user")
      if (user) {
        const userData = JSON.parse(user)
        userData.password = passwordData.newPassword
        localStorage.setItem("skillconnect_user", JSON.stringify(userData))
      }
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      alert("Password updated successfully!")
    } catch (error) {
      alert("Failed to update password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    setIsLoading(true)
    setSaveStatus("saving")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem("skillconnect_notifications", JSON.stringify(notifications))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle privacy settings update
  const handlePrivacyUpdate = async () => {
    setIsLoading(true)
    setSaveStatus("saving")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem("skillconnect_privacy", JSON.stringify(privacy))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle account deactivation
  const handleAccountDeactivation = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      localStorage.removeItem("skillconnect_session")
      localStorage.removeItem("skillconnect_user")
      localStorage.removeItem("skillconnect_notifications")
      localStorage.removeItem("skillconnect_privacy")
      window.location.href = "/"
    } catch (error) {
      alert("Failed to deactivate account. Please try again.")
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                Account Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={accountInfo.firstName}
                    onChange={(e) => setAccountInfo({ ...accountInfo, firstName: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={accountInfo.lastName}
                    onChange={(e) => setAccountInfo({ ...accountInfo, lastName: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountInfo.email}
                  onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={accountInfo.phone}
                  onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
                  placeholder="+254 700 000 000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={accountInfo.location}
                  onChange={(e) => setAccountInfo({ ...accountInfo, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={accountInfo.bio}
                  onChange={(e) => setAccountInfo({ ...accountInfo, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleAccountUpdate} 
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        )

      case "password":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-orange-600" />
                Change Password
              </CardTitle>
              <CardDescription>
                For security, please choose a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {passwordData.newPassword && (
                  <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Password strength:</span>
                      <span className={`font-medium ${
                        passwordValidation.strength >= 4 ? 'text-green-600' : 
                        passwordValidation.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordValidation.strength >= 4 ? 'Strong' : 
                         passwordValidation.strength >= 2 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(passwordValidation.checks).map(([key, passed]) => (
                        <div key={key} className="flex items-center space-x-2 text-xs">
                          {passed ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <X className="w-3 h-3 text-red-500" />
                          )}
                          <span className={passed ? 'text-green-600' : 'text-red-600'}>
                            {key === 'length' && 'At least 8 characters'}
                            {key === 'uppercase' && 'One uppercase letter'}
                            {key === 'lowercase' && 'One lowercase letter'}
                            {key === 'number' && 'One number'}
                            {key === 'special' && 'One special character'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>
              
              <Button 
                onClick={handlePasswordChange} 
                disabled={isLoading || !passwordValidation.isValid || passwordData.newPassword !== passwordData.confirmPassword}
                className="btn-primary"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        )

      case "notifications":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about job opportunities and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Job Alerts</Label>
                      <p className="text-sm text-slate-600">Get notified about new job matches via email.</p>
                    </div>
                    <Switch
                      checked={notifications.emailJobAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailJobAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Application Updates</Label>
                      <p className="text-sm text-slate-600">Receive email updates on your applications.</p>
                    </div>
                    <Switch
                      checked={notifications.emailApplicationUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailApplicationUpdates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Newsletter</Label>
                      <p className="text-sm text-slate-600">Receive our weekly newsletter with career tips.</p>
                    </div>
                    <Switch
                      checked={notifications.emailNewsletter}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNewsletter: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Push Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Job Alerts</Label>
                      <p className="text-sm text-slate-600">Get instant notifications about new job matches.</p>
                    </div>
                    <Switch
                      checked={notifications.pushJobAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushJobAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Application Updates</Label>
                      <p className="text-sm text-slate-600">Get notified when your application status changes.</p>
                    </div>
                    <Switch
                      checked={notifications.pushApplicationUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushApplicationUpdates: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">SMS Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Job Alerts</Label>
                      <p className="text-sm text-slate-600">Receive SMS notifications for urgent job opportunities.</p>
                    </div>
                    <Switch
                      checked={notifications.smsJobAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, smsJobAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Application Updates</Label>
                      <p className="text-sm text-slate-600">Get SMS updates on critical application changes.</p>
                    </div>
                    <Switch
                      checked={notifications.smsApplicationUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, smsApplicationUpdates: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleNotificationUpdate} 
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        )

      case "privacy":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Manage how your profile is seen by employers and control your privacy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can find your profile</SelectItem>
                      <SelectItem value="private">Private - Only you can share your profile</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-600">
                    Public profiles can be found by employers searching for candidates.
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Show Email Address</Label>
                    <p className="text-sm text-slate-600">Allow employers to see your email address.</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Show Phone Number</Label>
                    <p className="text-sm text-slate-600">Allow employers to see your phone number.</p>
                  </div>
                  <Switch
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Allow Messages</Label>
                    <p className="text-sm text-slate-600">Allow employers to send you direct messages.</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Profile View Notifications</Label>
                    <p className="text-sm text-slate-600">Get notified when someone views your profile.</p>
                  </div>
                  <Switch
                    checked={privacy.allowProfileViews}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowProfileViews: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Job Recommendations</Label>
                    <p className="text-sm text-slate-600">Allow us to recommend jobs based on your profile.</p>
                  </div>
                  <Switch
                    checked={privacy.allowJobRecommendations}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowJobRecommendations: checked })}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handlePrivacyUpdate} 
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </CardContent>
          </Card>
        )

      case "deactivate":
        return (
          <Card className="simple-card border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Deactivate Account
              </CardTitle>
              <CardDescription>
                This action is irreversible. All your data will be permanently deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Warning</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Deactivating your account will:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• Permanently delete your profile and all data</li>
                      <li>• Remove all your job applications</li>
                      <li>• Cancel any active subscriptions</li>
                      <li>• This action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deactivate My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAccountDeactivation}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, deactivate my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-light-gradient">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-orange-200 bg-white">
            <SidebarHeader>
              <div className="px-4 py-4">
                <Logo showTagline={false} />
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                  Main Menu
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker">
                          <Home className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker/applications">
                          <FileText className="w-5 h-5" />
                          <span>My Applications</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/jobs">
                          <Search className="w-5 h-5" />
                          <span>Browse Jobs</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker/profile">
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                  Account
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker/settings">
                          <Settings className="w-5 h-5" />
                          <span>Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker/notifications">
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                          <Badge className="ml-auto bg-orange-500 text-white border-0 rounded-full text-xs">2</Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                    onClick={() => {
                      localStorage.removeItem("skillconnect_session")
                      window.location.href = "/auth/login"
                    }}
                  >
                    <div>
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-xl">
              <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
              </div>
              {saveStatus === "saved" && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Saved!</span>
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center space-x-2 text-red-600">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Error saving</span>
                </div>
              )}
            </header>

            <main className="flex-1 space-y-8 p-6 scroll-simple">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Navigation */}
                <div className="lg:col-span-1">
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account, privacy, and notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant={activeSection === "account" ? "default" : "ghost"} 
                        className={`w-full justify-start ${activeSection === "account" ? "bg-orange-100 text-orange-700" : ""}`}
                        onClick={() => setActiveSection("account")}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Account Information
                      </Button>
                      <Button 
                        variant={activeSection === "password" ? "default" : "ghost"} 
                        className={`w-full justify-start ${activeSection === "password" ? "bg-orange-100 text-orange-700" : ""}`}
                        onClick={() => setActiveSection("password")}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Password
                      </Button>
                      <Button 
                        variant={activeSection === "notifications" ? "default" : "ghost"} 
                        className={`w-full justify-start ${activeSection === "notifications" ? "bg-orange-100 text-orange-700" : ""}`}
                        onClick={() => setActiveSection("notifications")}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </Button>
                      <Button 
                        variant={activeSection === "privacy" ? "default" : "ghost"} 
                        className={`w-full justify-start ${activeSection === "privacy" ? "bg-orange-100 text-orange-700" : ""}`}
                        onClick={() => setActiveSection("privacy")}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy
                      </Button>
                      <Button 
                        variant={activeSection === "deactivate" ? "default" : "ghost"} 
                        className={`w-full justify-start ${activeSection === "deactivate" ? "bg-red-100 text-red-700" : "text-red-600 hover:text-red-700"}`}
                        onClick={() => setActiveSection("deactivate")}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deactivate Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Settings Details */}
                <div className="lg:col-span-2">
                  {renderSection()}
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default function SeekerSettingsPage() {
  return (
    <SeekerGuard>
      <SettingsPageContent />
    </SeekerGuard>
  )
}
