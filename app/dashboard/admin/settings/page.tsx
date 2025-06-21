"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
  Users,
  Briefcase,
  Flag,
  Shield,
  Settings,
  Bell,
  Search,
  LogOut,
  Save,
  Globe,
  Mail,
  Lock,
  Database,
  AlertTriangle,
  CheckCircle,
  X,
  Server,
  HardDrive,
  Activity,
  Zap,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  Key,
  Clock,
  ShieldCheck,
  FileText,
  Palette,
  Languages,
  Monitor,
  Cpu,
  Memory,
  HardDrive as Storage,
  Network,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"

type SettingsSection = "general" | "security" | "notifications" | "integrations" | "maintenance" | "users" | "system" | "backup" | "advanced"

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general")
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "SkillConnect",
    siteDescription: "Connecting skilled professionals with great opportunities",
    contactEmail: "admin@skillconnect.co.ke",
    supportEmail: "support@skillconnect.co.ke",
    timezone: "Africa/Nairobi",
    language: "en",
    maintenanceMode: false,
    siteTheme: "light",
    enableRegistration: true,
    requireApproval: false,
  })

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requirePhoneVerification: false,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    enableTwoFactor: false,
    passwordMinLength: 8,
    requireStrongPasswords: true,
    enableCaptcha: true,
    enableRateLimiting: true,
    allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png"],
    maxFileSize: 5,
  })

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    adminAlerts: true,
    userAlerts: true,
    systemAlerts: true,
    emailTemplate: "default",
    notificationFrequency: "immediate",
  })

  // Integration Settings State
  const [integrationSettings, setIntegrationSettings] = useState({
    enableEmailService: true,
    enableSmsService: false,
    enableAnalytics: true,
    enableBackup: true,
    backupFrequency: "daily",
    enableApiAccess: false,
    apiRateLimit: 1000,
    enableWebhooks: false,
  })

  // User Management Settings
  const [userSettings, setUserSettings] = useState({
    defaultUserRole: "seeker",
    autoApproveUsers: false,
    requireProfileCompletion: true,
    allowProfileEditing: true,
    maxApplicationsPerJob: 50,
    jobPostingLimit: 10,
    enableUserDeletion: false,
    dataRetentionDays: 365,
  })

  // System Monitoring
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    storageUsage: 78,
    networkUsage: 23,
    activeUsers: 1250,
    totalJobs: 3420,
    totalApplications: 15600,
    systemUptime: "99.8%",
  })

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 30,
    includeFiles: true,
    includeDatabase: true,
    backupLocation: "cloud",
    encryptionEnabled: true,
    lastBackup: "2024-01-15 02:30:00",
    nextBackup: "2024-01-16 02:30:00",
  })

  // Advanced Settings
  const [advancedSettings, setAdvancedSettings] = useState({
    debugMode: false,
    logLevel: "info",
    cacheEnabled: true,
    cacheDuration: 3600,
    enableCdn: true,
    enableCompression: true,
    enableGzip: true,
    maxUploadSize: 10,
    sessionStorage: "database",
    enableAuditLog: true,
  })

  const handleSave = async (section: SettingsSection) => {
    setIsLoading(true)
    setSaveStatus("saving")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackup = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      // Simulate backup completion
    } catch (error) {
      console.error('Backup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-orange-600" />
                General Settings
              </CardTitle>
              <CardDescription className="text-slate-600">
                Configure basic platform settings and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  className="form-input"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="siteTheme">Site Theme</Label>
                  <Select value={generalSettings.siteTheme} onValueChange={(value) => setGeneralSettings({...generalSettings, siteTheme: value})}>
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}>
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableRegistration"
                    checked={generalSettings.enableRegistration}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableRegistration: checked})}
                  />
                  <Label htmlFor="enableRegistration">Enable User Registration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireApproval"
                    checked={generalSettings.requireApproval}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, requireApproval: checked})}
                  />
                  <Label htmlFor="requireApproval">Require Admin Approval for New Users</Label>
                </div>
              </div>

              <Button 
                onClick={() => handleSave("general")} 
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save General Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )

      case "security":
        return (
          <Card className="simple-card">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-slate-600">
                Configure platform security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={securitySettings.maxFileSize}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxFileSize: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireEmailVerification"
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireEmailVerification: checked})}
                  />
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requirePhoneVerification"
                    checked={securitySettings.requirePhoneVerification}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requirePhoneVerification: checked})}
                  />
                  <Label htmlFor="requirePhoneVerification">Require Phone Verification</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
                  />
                  <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireStrongPasswords"
                    checked={securitySettings.requireStrongPasswords}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireStrongPasswords: checked})}
                  />
                  <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableCaptcha"
                    checked={securitySettings.enableCaptcha}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableCaptcha: checked})}
                  />
                  <Label htmlFor="enableCaptcha">Enable CAPTCHA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableRateLimiting"
                    checked={securitySettings.enableRateLimiting}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableRateLimiting: checked})}
                  />
                  <Label htmlFor="enableRateLimiting">Enable Rate Limiting</Label>
                </div>
              </div>

              <Button 
                onClick={() => handleSave("security")} 
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )

      case "system":
        return (
          <div className="space-y-6">
            {/* System Overview */}
            <Card className="simple-card">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-600" />
                  System Overview
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Real-time system performance and resource usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">CPU Usage</span>
                      <span className="text-sm font-bold text-slate-900">{systemStats.cpuUsage}%</span>
                    </div>
                    <Progress value={systemStats.cpuUsage} className="h-2" />
                    <div className="flex items-center text-xs text-slate-500">
                      <Cpu className="w-3 h-3 mr-1" />
                      Processor
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Memory Usage</span>
                      <span className="text-sm font-bold text-slate-900">{systemStats.memoryUsage}%</span>
                    </div>
                    <Progress value={systemStats.memoryUsage} className="h-2" />
                    <div className="flex items-center text-xs text-slate-500">
                      <Memory className="w-3 h-3 mr-1" />
                      RAM
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Storage Usage</span>
                      <span className="text-sm font-bold text-slate-900">{systemStats.storageUsage}%</span>
                    </div>
                    <Progress value={systemStats.storageUsage} className="h-2" />
                    <div className="flex items-center text-xs text-slate-500">
                      <Storage className="w-3 h-3 mr-1" />
                      Disk Space
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Network Usage</span>
                      <span className="text-sm font-bold text-slate-900">{systemStats.networkUsage}%</span>
                    </div>
                    <Progress value={systemStats.networkUsage} className="h-2" />
                    <div className="flex items-center text-xs text-slate-500">
                      <Network className="w-3 h-3 mr-1" />
                      Bandwidth
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Statistics */}
            <Card className="simple-card">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                  Platform Statistics
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Current platform usage and activity metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{systemStats.activeUsers.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">Active Users</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{systemStats.totalJobs.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">Total Jobs</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{systemStats.totalApplications.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">Applications</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{systemStats.systemUptime}</div>
                    <div className="text-sm text-slate-600">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Stats
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        )

      case "backup":
        return (
          <div className="space-y-6">
            <Card className="simple-card">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-orange-600" />
                  Backup Configuration
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Configure automated backup settings and manage data protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={backupSettings.backupFrequency} onValueChange={(value) => setBackupSettings({...backupSettings, backupFrequency: value})}>
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={backupSettings.retentionPeriod}
                      onChange={(e) => setBackupSettings({...backupSettings, retentionPeriod: parseInt(e.target.value)})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoBackup"
                      checked={backupSettings.autoBackup}
                      onCheckedChange={(checked) => setBackupSettings({...backupSettings, autoBackup: checked})}
                    />
                    <Label htmlFor="autoBackup">Enable Automatic Backups</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeFiles"
                      checked={backupSettings.includeFiles}
                      onCheckedChange={(checked) => setBackupSettings({...backupSettings, includeFiles: checked})}
                    />
                    <Label htmlFor="includeFiles">Include File Uploads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeDatabase"
                      checked={backupSettings.includeDatabase}
                      onCheckedChange={(checked) => setBackupSettings({...backupSettings, includeDatabase: checked})}
                    />
                    <Label htmlFor="includeDatabase">Include Database</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encryptionEnabled"
                      checked={backupSettings.encryptionEnabled}
                      onCheckedChange={(checked) => setBackupSettings({...backupSettings, encryptionEnabled: checked})}
                    />
                    <Label htmlFor="encryptionEnabled">Enable Backup Encryption</Label>
                  </div>
                </div>

                <Separator />

                <div className="bg-slate-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-slate-900 mb-2">Backup Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Backup:</span>
                      <span className="text-slate-900">{backupSettings.lastBackup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Next Backup:</span>
                      <span className="text-slate-900">{backupSettings.nextBackup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Backup Location:</span>
                      <span className="text-slate-900 capitalize">{backupSettings.backupLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleBackup} 
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Create Manual Backup
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="btn-secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Download Latest Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <Card className="simple-card">
            <CardContent className="p-6">
              <div className="text-center">
                <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Settings Section</h3>
                <p className="text-slate-600">This section is under development.</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">Admin Panel</span>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Dashboard
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin">
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Overview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Management
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/users">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Users</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/verifications">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Verifications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Moderation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/moderation">
                            <Flag className="w-5 h-5" />
                            <span className="font-medium">Flagged Content</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/reports">
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Reports</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    System
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Settings className="w-5 h-5" />
                          <span className="font-medium">Settings</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/notifications">
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">Notifications</span>
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
                    >
                      <Link href="/auth/login">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-xl">
                <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-slate-900">Admin Settings</h1>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-orange-500 text-white border-0 rounded-xl px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {/* Settings Navigation */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "general", label: "General", icon: Globe },
                    { id: "security", label: "Security", icon: Shield },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "integrations", label: "Integrations", icon: Zap },
                    { id: "system", label: "System", icon: Activity },
                    { id: "backup", label: "Backup", icon: Database },
                    { id: "users", label: "Users", icon: Users },
                    { id: "maintenance", label: "Maintenance", icon: Server },
                    { id: "advanced", label: "Advanced", icon: Settings },
                  ].map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveSection(section.id as SettingsSection)}
                      className={`${
                        activeSection === section.id
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "border-orange-200 text-slate-700 hover:bg-orange-50"
                      }`}
                    >
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.label}
                    </Button>
                  ))}
                </div>

                {/* Save Status */}
                {saveStatus !== "idle" && (
                  <div className={`p-4 rounded-xl ${
                    saveStatus === "saved" ? "bg-green-50 border border-green-200" :
                    saveStatus === "error" ? "bg-red-50 border border-red-200" :
                    "bg-blue-50 border border-blue-200"
                  }`}>
                    <div className="flex items-center">
                      {saveStatus === "saved" ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : saveStatus === "error" ? (
                        <X className="w-5 h-5 text-red-600 mr-2" />
                      ) : (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                      )}
                      <span className={`font-medium ${
                        saveStatus === "saved" ? "text-green-800" :
                        saveStatus === "error" ? "text-red-800" :
                        "text-blue-800"
                      }`}>
                        {saveStatus === "saved" ? "Settings saved successfully!" :
                         saveStatus === "error" ? "Failed to save settings. Please try again." :
                         "Saving settings..."}
                      </span>
                    </div>
                  </div>
                )}

                {/* Settings Content */}
                {renderSection()}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
} 