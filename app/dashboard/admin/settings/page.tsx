"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Users, Shield, Briefcase, Brain, BarChart3, Settings, LogOut, Save, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { AdminGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { AdminService, SystemSettings } from "@/lib/adminService"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    aiEnabled: true,
    autoModeration: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxApplicationsPerUser: 50,
    maxJobsPerEmployer: 20,
    requireEmailVerification: true,
    requireProfileCompletion: true,
    sessionTimeout: 24,
    storageLimit: 100
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeUsers: 0,
    pendingApplications: 0,
    systemUptime: '99.9%',
    lastBackup: new Date().toISOString(),
    databaseSize: '2.3 GB',
    storageUsed: '1.8 GB'
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const settings = await AdminService.loadSettings()
      setSettings(settings)

      // Load system statistics
      const stats = await AdminService.loadStats()
      setSystemStats({
        totalUsers: stats.totalUsers,
        totalJobs: stats.totalJobs,
        totalApplications: stats.totalApplications,
        activeUsers: stats.activeUsers,
        pendingApplications: stats.pendingApplications,
        systemUptime: '99.9%',
        lastBackup: new Date().toISOString(),
        databaseSize: '2.3 GB',
        storageUsed: '1.8 GB'
      })
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    
    try {
      await AdminService.updateSettings(settings)
      setSaveStatus('success')
      
      // Log the activity
      await AdminService.logActivity('settings_updated', 'system', undefined, settings)
      
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-light-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Settings...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-red-200 bg-white shadow-lg">
              <SidebarHeader>
                <div className="px-4 py-4">
                  <Logo showTagline={false} />
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    Administration
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
                          <Link href="/dashboard/admin">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
                          <Link href="/dashboard/admin/users">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">User Management</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
                          <Link href="/dashboard/admin/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Job Moderation</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
                          <Link href="/dashboard/admin/ai">
                            <Brain className="w-5 h-5" />
                            <span className="font-medium">AI Insights</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
                          <Link href="/dashboard/admin/analytics">
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Analytics</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    System
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive className="text-gray-700 hover:text-red-600 hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 rounded-xl transition-all duration-200 font-medium">
                          <Link href="/dashboard/admin/settings">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
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
                    <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
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
              <main className="flex-1 space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
                    <p className="text-slate-600 mt-1">Configure platform settings and security parameters</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {saveStatus === 'success' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Saved successfully</span>
                      </div>
                    )}
                    {saveStatus === 'error' && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Save failed</span>
                      </div>
                    )}
                    <Button onClick={saveSettings} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* AI & Security Settings */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900">AI & Security</CardTitle>
                      <CardDescription className="text-slate-600">
                        Configure AI moderation and security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>AI Content Moderation</Label>
                          <p className="text-sm text-slate-500">
                            Automatically flag inappropriate content
                          </p>
                        </div>
                        <Switch
                          checked={settings.aiEnabled}
                          onCheckedChange={(checked) => handleSettingChange('aiEnabled', checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Auto Moderation</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Enable automatic content moderation</p>
                            <p className="text-xs text-slate-500">
                              Automatically flag suspicious content using AI
                            </p>
                          </div>
                          <Switch
                            checked={settings.autoModeration}
                            onCheckedChange={(checked) => handleSettingChange('autoModeration', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Max Applications Per User</Label>
                        <Input
                          type="number"
                          min="1"
                          max="1000"
                          value={settings.maxApplicationsPerUser}
                          onChange={(e) => handleSettingChange('maxApplicationsPerUser', parseInt(e.target.value))}
                        />
                        <p className="text-sm text-slate-500">
                          Maximum number of job applications a user can submit
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Settings */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900">System Configuration</CardTitle>
                      <CardDescription className="text-slate-600">
                        Platform configuration and maintenance settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Session Timeout (hours)</Label>
                        <Select
                          value={settings.sessionTimeout.toString()}
                          onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="6">6 hours</SelectItem>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="48">48 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-slate-500">
                          How long user sessions remain active
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Email Notifications</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Send email notifications</p>
                            <p className="text-xs text-slate-500">
                              Notify users about important events
                            </p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Maintenance Mode</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Enable maintenance mode</p>
                            <p className="text-xs text-slate-500">
                              Temporarily disable the platform for maintenance
                            </p>
                          </div>
                          <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Require Email Verification</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Force email verification</p>
                            <p className="text-xs text-slate-500">
                              Require users to verify their email address
                            </p>
                          </div>
                          <Switch
                            checked={settings.requireEmailVerification}
                            onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Require Profile Completion</Label>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Force profile completion</p>
                            <p className="text-xs text-slate-500">
                              Require users to complete their profiles
                            </p>
                          </div>
                          <Switch
                            checked={settings.requireProfileCompletion}
                            onCheckedChange={(checked) => handleSettingChange('requireProfileCompletion', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Max Jobs Per Employer</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={settings.maxJobsPerEmployer}
                          onChange={(e) => handleSettingChange('maxJobsPerEmployer', parseInt(e.target.value))}
                        />
                        <p className="text-sm text-slate-500">
                          Maximum number of jobs an employer can post
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Storage Limit (MB)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10000"
                          value={settings.storageLimit}
                          onChange={(e) => handleSettingChange('storageLimit', parseInt(e.target.value))}
                        />
                        <p className="text-sm text-slate-500">
                          Maximum file storage per user in megabytes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Information */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900">System Information</CardTitle>
                    <CardDescription className="text-slate-600">
                      Platform version and system details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Platform Version</p>
                        <p className="text-sm text-slate-900">v1.0.0</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Database</p>
                        <p className="text-sm text-slate-900">Supabase</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">AI Engine</p>
                        <p className="text-sm text-slate-900">Hugging Face</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Last Updated</p>
                        <p className="text-sm text-slate-900">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Environment</p>
                        <p className="text-sm text-slate-900">Production</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Status</p>
                        <p className="text-sm text-green-600">Healthy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Quick Actions</CardTitle>
                    <CardDescription className="text-slate-600">
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Button variant="outline" className="justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Run Security Scan
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Brain className="w-4 h-4 mr-2" />
                        Update AI Models
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
} 