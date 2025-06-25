"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("overview")
  const [timeRange, setTimeRange] = useState("30days")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    pendingVerifications: 0,
    flaggedContent: 0,
  })

  // Fetch report data
  useEffect(() => {
    fetchReportData()
  }, [timeRange])

  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch basic stats
      const [usersResult, jobsResult, applicationsResult, pendingVerificationsResult, flaggedContentResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('jobs').select('*', { count: 'exact' }),
        supabase.from('applications').select('*', { count: 'exact' }),
        supabase.from('verifications').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('flagged_content').select('*', { count: 'exact' }).in('status', ['pending', 'reviewed']),
      ])

      setStats({
        totalUsers: usersResult.data?.length || 0,
        totalJobs: jobsResult.data?.length || 0,
        totalApplications: applicationsResult.data?.length || 0,
        activeJobs: jobsResult.data?.filter((job: any) => job.status === 'active').length || 0,
        pendingVerifications: pendingVerificationsResult.data?.length || 0,
        flaggedContent: flaggedContentResult.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = () => {
    // Mock report generation
    console.log(`Generating ${reportType} report for ${timeRange}`)
  }

  const exportReport = () => {
    // Mock export functionality
    console.log(`Exporting ${reportType} report`)
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
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
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
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/settings">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                          </Link>
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
                  <h1 className="text-lg font-semibold text-slate-900">Reports & Analytics</h1>
                  <p className="text-sm text-slate-600">Generate and view system reports</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-orange-500 text-white border-0 rounded-xl px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h2>
                    <p className="text-slate-600 text-lg">Generate comprehensive reports and view platform analytics</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="btn-secondary" onClick={generateReport}>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" size="sm" className="btn-secondary" onClick={exportReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>

                {/* Report Controls */}
                <Card className="simple-card">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-48 form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-orange-200">
                          <SelectItem value="overview" className="text-slate-900 hover:bg-orange-50">
                            Platform Overview
                          </SelectItem>
                          <SelectItem value="users" className="text-slate-900 hover:bg-orange-50">
                            User Analytics
                          </SelectItem>
                          <SelectItem value="jobs" className="text-slate-900 hover:bg-orange-50">
                            Job Analytics
                          </SelectItem>
                          <SelectItem value="applications" className="text-slate-900 hover:bg-orange-50">
                            Application Analytics
                          </SelectItem>
                          <SelectItem value="moderation" className="text-slate-900 hover:bg-orange-50">
                            Moderation Report
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-32 form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-orange-200">
                          <SelectItem value="7days" className="text-slate-900 hover:bg-orange-50">
                            Last 7 Days
                          </SelectItem>
                          <SelectItem value="30days" className="text-slate-900 hover:bg-orange-50">
                            Last 30 Days
                          </SelectItem>
                          <SelectItem value="90days" className="text-slate-900 hover:bg-orange-50">
                            Last 90 Days
                          </SelectItem>
                          <SelectItem value="1year" className="text-slate-900 hover:bg-orange-50">
                            Last Year
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Overview Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "Total Users",
                      value: stats.totalUsers.toLocaleString(),
                      change: "+12% this month",
                      icon: Users,
                      color: "from-blue-400 to-cyan-500",
                    },
                    {
                      title: "Active Jobs",
                      value: stats.activeJobs.toLocaleString(),
                      change: "+8% this week",
                      icon: Briefcase,
                      color: "from-green-400 to-emerald-500",
                    },
                    {
                      title: "Total Applications",
                      value: stats.totalApplications.toLocaleString(),
                      change: "+15% this month",
                      icon: FileText,
                      color: "from-purple-400 to-pink-500",
                    },
                    {
                      title: "Pending Verifications",
                      value: stats.pendingVerifications.toString(),
                      change: "Requires attention",
                      icon: Shield,
                      color: "from-orange-400 to-red-500",
                    },
                  ].map((stat, index) => (
                    <Card key={index} className="simple-card hover-lift">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          <span className="text-green-500">{stat.change}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts and Analytics */}
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* User Growth Chart */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                        User Growth
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        User registration trends over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-500">Chart visualization would go here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Categories Distribution */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-orange-600" />
                        Job Categories
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Distribution of jobs by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-500">Pie chart visualization would go here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Application Success Rate */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-orange-600" />
                        Application Success Rate
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Success rate of job applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-500">Line chart visualization would go here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Activity */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                        Platform Activity
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Daily active users and engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-500">Activity chart visualization would go here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
} 