"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Users, Shield, Briefcase, Brain, BarChart3, Settings, LogOut, AlertTriangle, CheckCircle, XCircle, Zap, Target, Activity } from "lucide-react"
import { AdminGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { AdminService, AIInsight } from "@/lib/adminService"

export default function AdminAIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [filteredInsights, setFilteredInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)
  const [showInsightModal, setShowInsightModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadAIInsights()
  }, [])

  const loadAIInsights = async () => {
    setIsLoading(true)
    try {
      const insights = await AdminService.loadAIInsights()
      setInsights(insights)
    } catch (error) {
      console.error('Error loading AI insights:', error)
      setInsights([])
    } finally {
      setIsLoading(false)
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions for AI insights page...')
    
    // Subscribe to AI insights changes
    const insightsSubscription = AdminService.subscribeToAIInsights((updatedInsights) => {
      console.log('AI Insights updated via subscription:', updatedInsights.length)
      setInsights(updatedInsights)
    })

    // Cleanup subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time subscriptions...')
      AdminService.unsubscribeFromAll()
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return Shield
      case 'content_moderation': return AlertTriangle
      case 'user_behavior': return Users
      case 'performance': return Activity
      default: return Brain
    }
  }

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-light-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading AI Insights...</p>
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
                        <SidebarMenuButton asChild isActive className="text-gray-700 hover:text-red-600 hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 rounded-xl transition-all duration-200 font-medium">
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
                        <SidebarMenuButton asChild className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
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
                    <h1 className="text-3xl font-bold text-slate-900">AI Insights</h1>
                    <p className="text-slate-600 mt-1">AI-powered security and content insights</p>
                  </div>
                  <Button onClick={loadAIInsights} variant="outline" disabled={isLoading}>
                    <Zap className="w-4 h-4 mr-2" />
                    Run AI Scan
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Insights</p>
                          <p className="text-2xl font-bold text-slate-900">{insights.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Critical Alerts</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {insights.filter(i => i.severity === 'critical').length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">High Priority</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {insights.filter(i => i.severity === 'high').length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Resolved</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {insights.filter(i => i.status === 'resolved').length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights List */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Recent AI Insights</CardTitle>
                    <CardDescription className="text-slate-600">
                      Latest AI-powered security and content insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.map((insight) => {
                        const IconComponent = getTypeIcon(insight.type)
                        return (
                          <div
                            key={insight.id}
                            className="flex items-start space-x-4 p-4 rounded-lg border bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              insight.severity === 'critical' ? 'bg-red-100' :
                              insight.severity === 'high' ? 'bg-orange-100' :
                              insight.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                insight.severity === 'critical' ? 'text-red-600' :
                                insight.severity === 'high' ? 'text-orange-600' :
                                insight.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-slate-900">{insight.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getSeverityColor(insight.severity)}>
                                    {insight.severity}
                                  </Badge>
                                  <Badge variant="outline">{insight.status}</Badge>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{new Date(insight.created_at).toLocaleString()}</span>
                                <div className="flex items-center space-x-4">
                                  {insight.affectedUsers && (
                                    <span>{insight.affectedUsers} users affected</span>
                                  )}
                                  {insight.affectedJobs && (
                                    <span>{insight.affectedJobs} jobs affected</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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