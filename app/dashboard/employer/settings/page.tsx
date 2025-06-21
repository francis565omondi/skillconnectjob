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
  Briefcase,
  Users,
  User,
  Settings,
  Bell,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  Lock,
  Building,
  Check,
  X,
  AlertTriangle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { EmployerGuard } from "@/components/admin-auth-guard"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"

type SettingsSection = "account" | "password" | "notifications" | "privacy" | "deactivate"

// Local utility functions
const getUserData = () => {
  try {
    const userData = localStorage.getItem("skillconnect_user")
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

const updateUserData = (newData: any) => {
  try {
    const userData = getUserData()
    if (userData) {
      const updatedUser = { ...userData, ...newData }
      localStorage.setItem("skillconnect_user", JSON.stringify(updatedUser))
      return true
    }
    return false
  } catch (error) {
    console.error("Error updating user data:", error)
    return false
  }
}

const clearUserSession = () => {
  localStorage.removeItem("skillconnect_user")
  sessionStorage.removeItem("skillconnect_session")
}

const simulateApiCall = async (callback: () => any, delay: number = 1000) => {
  try {
    await new Promise(resolve => setTimeout(resolve, delay))
    const result = callback()
    return { status: "success", data: result }
  } catch (error) {
    return { status: "error", message: error.message }
  }
}

function SettingsPageContent() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { notifications: statusNotifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  // Account Information State
  const [accountInfo, setAccountInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    industry: "",
    website: "",
    description: "",
  })

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailApplications: true,
    emailJobUpdates: true,
    emailNewsletter: false,
    pushApplications: true,
    pushJobUpdates: true,
    pushNewsletter: false,
    smsApplications: false,
    smsJobUpdates: false,
  })

  // Privacy Settings State
  const [privacy, setPrivacy] = useState({
    companyVisibility: "public",
    showContactInfo: true,
    allowMessages: true,
    allowProfileViews: true,
    allowJobRecommendations: true,
  })

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        showLoading("Loading settings...", "Please wait")
        
        const userData = getUserData()
        if (userData) {
          setAccountInfo({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            companyName: userData.companyName || "",
            companySize: userData.companySize || "",
            industry: userData.industry || "",
            website: userData.website || "",
            description: userData.description || "",
          })
        }
        
        showSuccess("Settings loaded successfully")
      } catch (error) {
        showError("Failed to load settings", "Please refresh the page")
      }
    }

    loadUserData()
  }, [showLoading, showSuccess, showError])

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
    showLoading("Updating account information...", "Please wait")

    const result = await simulateApiCall(() => {
      const success = updateUserData(accountInfo)
      if (!success) {
        throw new Error("Failed to update account information")
      }
      return accountInfo
    }, 1500)

    if (result.status === "success") {
      showSuccess("Account information updated successfully!")
    } else {
      showError("Update failed", result.message)
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Passwords do not match", "Please ensure both passwords are identical")
      return
    }

    if (!passwordValidation.isValid) {
      showError("Password is too weak", "Please ensure your password meets all requirements")
      return
    }

    showLoading("Updating password...", "Please wait")

    const result = await simulateApiCall(() => {
      const userData = getUserData()
      if (!userData) {
        throw new Error("User data not found")
      }
      
      userData.password = passwordData.newPassword
      const success = updateUserData(userData)
      if (!success) {
        throw new Error("Failed to update password")
      }
      
      return { success: true }
    }, 1500)

    if (result.status === "success") {
      showSuccess("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } else {
      showError("Password update failed", result.message)
    }
  }

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    showLoading("Updating notification settings...", "Please wait")

    const result = await simulateApiCall(() => {
      localStorage.setItem("skillconnect_employer_notifications", JSON.stringify(notificationSettings))
      return notificationSettings
    }, 1000)

    if (result.status === "success") {
      showSuccess("Notification settings updated successfully!")
    } else {
      showError("Update failed", result.message)
    }
  }

  // Handle privacy settings update
  const handlePrivacyUpdate = async () => {
    showLoading("Updating privacy settings...", "Please wait")

    const result = await simulateApiCall(() => {
      localStorage.setItem("skillconnect_employer_privacy", JSON.stringify(privacy))
      return privacy
    }, 1000)

    if (result.status === "success") {
      showSuccess("Privacy settings updated successfully!")
    } else {
      showError("Update failed", result.message)
    }
  }

  // Handle account deactivation
  const handleAccountDeactivation = async () => {
    showLoading("Deactivating account...", "This may take a moment")

    const result = await simulateApiCall(() => {
      clearUserSession()
      return { success: true }
    }, 2000)

    if (result.status === "success") {
      showSuccess("Account deactivated successfully", "Redirecting to home page...")
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } else {
      showError("Deactivation failed", result.message)
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-600" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your company information and contact details.
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
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={accountInfo.companyName}
                  onChange={(e) => setAccountInfo({ ...accountInfo, companyName: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={accountInfo.companySize}
                    onValueChange={(value) => setAccountInfo({ ...accountInfo, companySize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={accountInfo.industry}
                    onChange={(e) => setAccountInfo({ ...accountInfo, industry: e.target.value })}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={accountInfo.website}
                  onChange={(e) => setAccountInfo({ ...accountInfo, website: e.target.value })}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={accountInfo.description}
                  onChange={(e) => setAccountInfo({ ...accountInfo, description: e.target.value })}
                  placeholder="Tell us about your company..."
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleAccountUpdate} 
                className="btn-primary"
              >
                Save Changes
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
                disabled={!passwordValidation.isValid || passwordData.newPassword !== passwordData.confirmPassword}
                className="btn-primary"
              >
                Update Password
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
                Choose how you want to be notified about applications and job updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">New Applications</Label>
                      <p className="text-sm text-slate-600">Get notified about new job applications via email.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailApplications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailApplications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Job Updates</Label>
                      <p className="text-sm text-slate-600">Receive email updates on your job postings.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailJobUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailJobUpdates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Newsletter</Label>
                      <p className="text-sm text-slate-600">Receive our weekly newsletter with hiring tips.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNewsletter}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNewsletter: checked })
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
                      <Label className="font-medium">New Applications</Label>
                      <p className="text-sm text-slate-600">Get instant notifications about new applications.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushApplications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushApplications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Job Updates</Label>
                      <p className="text-sm text-slate-600">Get notified when your job status changes.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushJobUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushJobUpdates: checked })
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
                      <Label className="font-medium">Urgent Applications</Label>
                      <p className="text-sm text-slate-600">Receive SMS for high-priority applications.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsApplications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsApplications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="font-medium">Critical Updates</Label>
                      <p className="text-sm text-slate-600">Get SMS for critical job posting changes.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsJobUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsJobUpdates: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleNotificationUpdate} 
                className="btn-primary"
              >
                Save Notification Settings
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
                Manage how your company profile is seen by job seekers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Visibility</Label>
                  <Select
                    value={privacy.companyVisibility}
                    onValueChange={(value) => setPrivacy({ ...privacy, companyVisibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can find your company</SelectItem>
                      <SelectItem value="private">Private - Only you can share your company</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-600">
                    Public companies can be found by job seekers searching for opportunities.
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Show Contact Information</Label>
                    <p className="text-sm text-slate-600">Allow job seekers to see your contact details.</p>
                  </div>
                  <Switch
                    checked={privacy.showContactInfo}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showContactInfo: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Allow Messages</Label>
                    <p className="text-sm text-slate-600">Allow job seekers to send you direct messages.</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Profile View Notifications</Label>
                    <p className="text-sm text-slate-600">Get notified when someone views your company profile.</p>
                  </div>
                  <Switch
                    checked={privacy.allowProfileViews}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowProfileViews: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Job Recommendations</Label>
                    <p className="text-sm text-slate-600">Allow us to recommend job seekers based on your needs.</p>
                  </div>
                  <Switch
                    checked={privacy.allowJobRecommendations}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowJobRecommendations: checked })}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handlePrivacyUpdate} 
                className="btn-primary"
              >
                Save Privacy Settings
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
                      <li>• Permanently delete your company profile and all data</li>
                      <li>• Remove all your job postings</li>
                      <li>• Delete all application data</li>
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
      <StatusManager notifications={statusNotifications} onRemove={removeNotification} />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-orange-200 bg-white">
            <SidebarHeader>
              <div className="flex items-center space-x-3 px-4 py-4">
                <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">SkillConnect</span>
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
                        <Link href="/dashboard/employer">
                          <Home className="w-5 h-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/employer/jobs">
                          <Briefcase className="w-5 h-5" />
                          <span className="font-medium">Posted Jobs</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/employer/applicants">
                          <Users className="w-5 h-5" />
                          <span className="font-medium">Applicants</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/employer/profile">
                          <User className="w-5 h-5" />
                          <span className="font-medium">Company Profile</span>
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
                        <Link href="/dashboard/employer/settings">
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
                        <Link href="/dashboard/employer/notifications">
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
                      clearUserSession()
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
                        <Building className="w-4 h-4 mr-2" />
                        Company Information
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

export default function EmployerSettingsPage() {
  return (
    <EmployerGuard>
      <SettingsPageContent />
    </EmployerGuard>
  )
} 