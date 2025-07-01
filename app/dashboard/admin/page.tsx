"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home, Users, Briefcase, FileText, Settings, Bell, LogOut, Shield,
  TrendingUp, Eye, AlertTriangle, CheckCircle, XCircle, Clock, 
  BarChart3, Activity, UserCheck, UserX, Building, MapPin, DollarSign,
  Calendar, Search, Filter, Plus, Edit, Trash, MoreHorizontal,
  RefreshCw, Download, Upload, Zap, Brain, Target, Award
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"
import { AIServices } from "@/lib/aiServices"
import { AdminGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import { AdminService, AdminStats, AdminUser, AdminJob, AdminApplication, AIInsight } from "@/lib/adminService"
import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

interface RecentActivity {
  id: string
  type: string
  title: string
  description?: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeUsers: 0,
    pendingApplications: 0,
    suspiciousActivities: 0,
    aiInsights: 0,
    systemHealth: 'good'
  })
  const [users, setUsers] = useState<AdminUser[]>([])
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadJobs(),
        loadApplications(),
        loadAIInsights()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const stats = await AdminService.loadStats()
      setStats(stats)

      // Load recent activities
      const { data: recentActivities } = await supabase
        .from('applications')
        .select(`
          *,
          jobs(title, company),
          profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Set recent activities
      if (recentActivities) {
        const activities = recentActivities.map(activity => ({
          id: activity.id,
          type: 'application',
          title: 'New application submitted',
          description: `${activity.profiles?.first_name} ${activity.profiles?.last_name} applied to ${activity.jobs?.title} at ${activity.jobs?.company}`,
          created_at: activity.created_at
        }))
        setRecentActivities(activities)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const users = await AdminService.loadUsers()
      setUsers(users)
    } catch (error) {
      console.error('Error loading users:', error)
      // Handle RLS policy errors gracefully
      if (error?.message?.includes('infinite recursion') || error?.message?.includes('row-level security')) {
        setUsers([])
        // Show a helpful message in the UI
        console.warn('RLS policy error detected. Please run the SQL fix in Supabase dashboard.')
      }
    }
  }

  const loadJobs = async () => {
    try {
      const jobs = await AdminService.loadJobs()
      setJobs(jobs)
    } catch (error) {
      console.error('Error loading jobs:', error)
    }
  }

  const loadApplications = async () => {
    try {
      const applications = await AdminService.loadApplications()
      setApplications(applications)
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  const loadAIInsights = async () => {
    try {
      const insights = await AdminService.loadAIInsights(50)
      setAiInsights(insights)
    } catch (error) {
      console.error('Error loading AI insights:', error)
      setAiInsights([])
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions...')
    
    // Subscribe to users changes
    const usersSubscription = AdminService.subscribeToUsers((updatedUsers) => {
      console.log('Users updated via subscription:', updatedUsers.length)
      setUsers(updatedUsers)
    })

    // Subscribe to jobs changes
    const jobsSubscription = AdminService.subscribeToJobs((updatedJobs) => {
      console.log('Jobs updated via subscription:', updatedJobs.length)
      setJobs(updatedJobs)
    })

    // Subscribe to applications changes
    const applicationsSubscription = AdminService.subscribeToApplications((updatedApplications) => {
      console.log('Applications updated via subscription:', updatedApplications.length)
      setApplications(updatedApplications)
    })

    // Subscribe to stats changes
    const statsSubscription = AdminService.subscribeToStats((updatedStats) => {
      console.log('Stats updated via subscription')
      setStats(updatedStats)
    })

    // Subscribe to AI insights changes
    const insightsSubscription = AdminService.subscribeToAIInsights((updatedInsights) => {
      console.log('AI Insights updated via subscription:', updatedInsights.length)
      setAiInsights(updatedInsights)
    })

    // Cleanup subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time subscriptions...')
      AdminService.unsubscribeFromAll()
    }
  }, [])

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    try {
      const status = action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'banned'
      
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)

      if (error) throw error

      // Refresh users list
      await loadUsers()
      setShowUserModal(false)
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleJobAction = async (jobId: string, action: 'approve' | 'reject' | 'feature') => {
    try {
      let status = 'active'
      if (action === 'reject') status = 'closed'

      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', jobId)

      if (error) throw error

      // Refresh jobs list
      await loadJobs()
      setShowJobModal(false)
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-light-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Admin Dashboard...</p>
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
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/users">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">User Management</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Job Moderation</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/admin/ai">
                            <Brain className="w-5 h-5" />
                            <span className="font-medium">AI Insights</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
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
                        <SidebarMenuButton
                          asChild
                          className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
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
                    <SidebarMenuButton
                      asChild
                      className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
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
              <main className="flex-1 space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-1">Monitor and manage the platform</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={loadDashboardData} 
                      variant="outline" 
                      disabled={isLoading}
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh All Data</span>
                    </Button>
                    <Badge variant="outline" className="text-sm">
                      {users.length} Users • {jobs.length} Jobs • {applications.length} Applications
                    </Badge>
                  </div>
                </div>

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome to Admin Dashboard
                      </h2>
                      <p className="text-red-100">
                        Monitor platform activity, manage users, and leverage AI insights
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <Shield className="w-16 h-16 text-red-200" />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Users</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Jobs</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalJobs}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Applications</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalApplications}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">System Health</p>
                          <p className={`text-2xl font-bold ${getSystemHealthColor(stats.systemHealth)}`}>
                            {stats.systemHealth}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* AI Insights */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-red-600" />
                        AI Insights
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Recent AI-powered security and content insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiInsights.slice(0, 5).map((insight) => (
                          <div
                            key={insight.id}
                            className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50"
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              insight.severity === 'critical' ? 'bg-red-500' :
                              insight.severity === 'high' ? 'bg-orange-500' :
                              insight.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{insight.title}</h4>
                              <p className="text-sm text-slate-600">{insight.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getSeverityColor(insight.severity)}>
                                  {insight.severity}
                                </Badge>
                                <Badge variant="outline">{insight.status}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4 btn-secondary" asChild>
                        <Link href="/dashboard/admin/ai">View All Insights</Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-red-600" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        Latest platform activities and user actions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.length > 0 ? (
                          recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                                <p className="text-xs text-slate-500">
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                                {activity.description && (
                                  <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-slate-500">
                            <p className="text-sm">No recent activity</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Management Section */}
                <Card className="simple-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-slate-900">User Management</CardTitle>
                        <CardDescription className="text-slate-600">
                          Monitor and manage platform users
                        </CardDescription>
                      </div>
                      <Button onClick={loadUsers} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Search and Filters */}
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-grow">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-slate-500" />
                          <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              <SelectItem value="seeker">Seekers</SelectItem>
                              <SelectItem value="employer">Employers</SelectItem>
                              <SelectItem value="admin">Admins</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Users Table */}
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>AI Risk</TableHead>
                              <TableHead>Joined</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.slice(0, 10).map((user) => (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    user.role === 'admin' ? 'border-red-200 text-red-700' :
                                    user.role === 'employer' ? 'border-blue-200 text-blue-700' :
                                    'border-green-200 text-green-700'
                                  }>
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                                    user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {user.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      (user.aiRiskScore || 0) > 70 ? 'bg-red-500' :
                                      (user.aiRiskScore || 0) > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></div>
                                    <span className="text-sm">{user.aiRiskScore || 0}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <p className="text-sm text-slate-600">
                                    {new Date(user.created_at).toLocaleDateString()}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedUser(user)
                                        setShowUserModal(true)
                                      }}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      {user.status === 'active' ? (
                                        <>
                                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Suspend
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'ban')}>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Ban
                                          </DropdownMenuItem>
                                        </>
                                      ) : (
                                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Activate
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-red-600" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">
                        Run comprehensive AI analysis on platform content and user behavior
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="/dashboard/admin/ai">
                          <Brain className="w-4 h-4 mr-2" />
                          Run AI Scan
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
                        Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">
                        View detailed platform analytics and performance metrics
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="/dashboard/admin/analytics">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Analytics
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-red-600" />
                        System Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">
                        Configure platform settings and security parameters
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="/dashboard/admin/settings">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Settings
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Debug Panel - Only show in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="space-y-4">
                    <SupabaseConnectionTest />
                    
                    <Card className="simple-card border-orange-200 bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-orange-900 flex items-center">
                          <Zap className="w-5 h-5 mr-2" />
                          Debug Panel (Development Only)
                        </CardTitle>
                        <CardDescription className="text-orange-700">
                          Real-time data monitoring and subscription status
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-white p-3 rounded-lg border">
                            <p className="font-medium text-orange-900">Users Loaded</p>
                            <p className="text-2xl font-bold text-orange-600">{users.length}</p>
                            <p className="text-xs text-orange-600">Real-time</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <p className="font-medium text-orange-900">Jobs Loaded</p>
                            <p className="text-2xl font-bold text-orange-600">{jobs.length}</p>
                            <p className="text-xs text-orange-600">Real-time</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <p className="font-medium text-orange-900">Applications</p>
                            <p className="text-2xl font-bold text-orange-600">{applications.length}</p>
                            <p className="text-xs text-orange-600">Real-time</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border">
                            <p className="font-medium text-orange-900">AI Insights</p>
                            <p className="text-2xl font-bold text-orange-600">{aiInsights.length}</p>
                            <p className="text-xs text-orange-600">Real-time</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded-lg border">
                          <p className="font-medium text-orange-900 mb-2">Subscription Status</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Users: Active
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Jobs: Active
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Applications: Active
                            </span>
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Stats: Active
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>

        {/* User Details Modal */}
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge variant="outline">{selectedUser.role}</Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={
                      selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedUser.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>AI Risk Score</Label>
                    <p className="text-sm font-medium">{selectedUser.aiRiskScore || 0}%</p>
                  </div>
                  <div>
                    <Label>Joined</Label>
                    <p className="text-sm font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedUser.aiFlags && selectedUser.aiFlags.length > 0 && (
                  <div>
                    <Label>AI Flags</Label>
                    <div className="space-y-2">
                      {selectedUser.aiFlags.map((flag, index) => (
                        <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {flag}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  {selectedUser.status === 'active' ? (
                    <>
                      <Button variant="outline" onClick={() => handleUserAction(selectedUser.id, 'suspend')}>
                        Suspend User
                      </Button>
                      <Button variant="destructive" onClick={() => handleUserAction(selectedUser.id, 'ban')}>
                        Ban User
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleUserAction(selectedUser.id, 'activate')}>
                      Activate User
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
} 