"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  TrendingUp,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  LogOut,
  FileText,
  Building,
  UserCheck,
  Ban,
  User,
  ChevronDown,
  Activity,
  AlertTriangle,
  UserX,
  Monitor,
  Database,
  Server,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"
import { UserActivityService } from "@/lib/userActivityService"
import type { UserSession, UserActivity, AdminAction, UserWarning, SuspiciousActivity, DashboardStats } from "@/lib/userActivityService"
import { Logo } from "@/components/logo"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    active_sessions: 0,
    logins_24h: 0,
    activities_24h: 0,
    pending_alerts: 0,
    warnings_24h: 0
  })
  
  // Data for different tabs
  const [userSessions, setUserSessions] = useState<UserSession[]>([])
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([])
  const [adminActions, setAdminActions] = useState<AdminAction[]>([])
  const [userWarnings, setUserWarnings] = useState<UserWarning[]>([])
  
  // Legacy data (keeping for backward compatibility)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    pendingVerifications: 0,
    flaggedContent: 0,
    monthlyGrowth: 0,
    successfulMatches: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [flaggedJobs, setFlaggedJobs] = useState<any[]>([])
  const [adminUser, setAdminUser] = useState<any>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Admin user info
  const adminName = adminUser?.first_name && adminUser?.last_name 
    ? `${adminUser.first_name} ${adminUser.last_name}` 
    : adminUser?.email || 'Admin User'
  const adminRole = adminUser?.role || 'Administrator'

  // Fetch admin dashboard data
  useEffect(() => {
    fetchAdminData()
    fetchMonitoringData()

    // Set up automatic refresh every 30 seconds
    const adminDataInterval = setInterval(fetchAdminData, 30000)
    const monitoringDataInterval = setInterval(fetchMonitoringData, 30000)

    // Subscribe to real-time changes in relevant tables
    const channel = supabase
      .channel('admin_dashboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        console.log('Profiles updated, refreshing admin data...')
        fetchAdminData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        console.log('Jobs updated, refreshing admin data...')
        fetchAdminData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        console.log('Applications updated, refreshing admin data...')
        fetchAdminData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'verifications' }, () => {
        console.log('Verifications updated, refreshing admin data...')
        fetchAdminData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flagged_content' }, () => {
        console.log('Flagged content updated, refreshing admin data...')
        fetchAdminData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_sessions' }, () => {
        console.log('User sessions updated, refreshing monitoring data...')
        fetchMonitoringData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_activities' }, () => {
        console.log('User activities updated, refreshing monitoring data...')
        fetchMonitoringData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suspicious_activities' }, () => {
        console.log('Suspicious activities updated, refreshing monitoring data...')
        fetchMonitoringData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_actions' }, () => {
        console.log('Admin actions updated, refreshing monitoring data...')
        fetchMonitoringData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_warnings' }, () => {
        console.log('User warnings updated, refreshing monitoring data...')
        fetchMonitoringData();
      })
      .subscribe((status) => {
        console.log('Real-time subscription status:', status)
      });

    return () => {
      clearInterval(adminDataInterval)
      clearInterval(monitoringDataInterval)
      supabase.removeChannel(channel);
    };
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem("skillconnect_user")
        setAdminUser(data ? JSON.parse(data) : null)
      } catch (error) {
        setAdminUser(null)
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const fetchAdminData = async () => {
    try {
      if (!isRefreshing) setIsLoading(true)
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )

      // Fetch jobs count
      const jobsPromise = supabase
        .from('jobs')
        .select('*', { count: 'exact' })

      // Fetch applications count
      const applicationsPromise = supabase
        .from('applications')
        .select('*', { count: 'exact' })

      // Fetch users count and recent users
      const usersPromise = supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      const recentUsersPromise = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch pending verifications
      const verificationsPromise = supabase
        .from('verifications')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_date', { ascending: false })
        .limit(5)

      // Fetch flagged content
      const flaggedContentPromise = supabase
        .from('flagged_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch monthly growth data
      const monthlyGrowthPromise = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      // Execute all promises with timeout
      const [jobsResult, applicationsResult, usersResult, recentUsersResult, verificationsResult, flaggedContentResult, monthlyGrowthResult] = await Promise.all([
        Promise.race([jobsPromise, timeoutPromise]),
        Promise.race([applicationsPromise, timeoutPromise]),
        Promise.race([usersPromise, timeoutPromise]),
        Promise.race([recentUsersPromise, timeoutPromise]),
        Promise.race([verificationsPromise, timeoutPromise]),
        Promise.race([flaggedContentPromise, timeoutPromise]),
        Promise.race([monthlyGrowthPromise, timeoutPromise])
      ]) as any[]

      // Calculate monthly growth percentage
      const totalUsers = usersResult?.count || 0
      const monthlyNewUsers = monthlyGrowthResult?.count || 0
      const monthlyGrowth = totalUsers > 0 ? Math.round((monthlyNewUsers / totalUsers) * 100) : 0

      // Update state with results
      setSystemStats({
        totalUsers: totalUsers,
        activeJobs: jobsResult?.count || 0,
        pendingVerifications: verificationsResult?.data?.length || 0,
        flaggedContent: flaggedContentResult?.data?.length || 0,
        monthlyGrowth: monthlyGrowth,
        successfulMatches: applicationsResult?.count || 0,
      })

      setRecentUsers(recentUsersResult?.data || [])
      setPendingVerifications(verificationsResult?.data || [])
      setFlaggedJobs(flaggedContentResult?.data || [])
      
      setLastUpdated(new Date())

    } catch (error) {
      console.error('Error fetching admin data:', error)
      // Set default values on error
      setSystemStats({
        totalUsers: 0,
        activeJobs: 0,
        pendingVerifications: 0,
        flaggedContent: 0,
        monthlyGrowth: 0,
        successfulMatches: 0,
      })
      setRecentUsers([])
      setPendingVerifications([])
      setFlaggedJobs([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const fetchMonitoringData = async () => {
    try {
      // Fetch dashboard stats
      const stats = await UserActivityService.getDashboardStats()
      setDashboardStats(stats)

      // Fetch data for different tabs - handle each individually to prevent one failure from breaking all
      let sessions: UserSession[] = []
      let activities: UserActivity[] = []
      let alerts: SuspiciousActivity[] = []
      let actions: AdminAction[] = []
      let warnings: UserWarning[] = []

      try {
        sessions = await UserActivityService.getUserSessions()
      } catch (error) {
        console.warn('Error fetching user sessions:', error)
      }

      try {
        activities = await UserActivityService.getUserActivities()
      } catch (error) {
        console.warn('Error fetching user activities:', error)
      }

      try {
        alerts = await UserActivityService.getSuspiciousActivities(false)
      } catch (error) {
        console.warn('Error fetching suspicious activities:', error)
      }

      try {
        actions = await UserActivityService.getAdminActions()
      } catch (error) {
        console.warn('Error fetching admin actions:', error)
      }

      try {
        warnings = await UserActivityService.getUserWarnings()
      } catch (error) {
        console.warn('Error fetching user warnings:', error)
      }

      setUserSessions(sessions)
      setUserActivities(activities)
      setSuspiciousActivities(alerts)
      setAdminActions(actions)
      setUserWarnings(warnings)
      
      setLastUpdated(new Date())

    } catch (error) {
      console.error('Error fetching monitoring data:', error)
      // Set default values on error
      setDashboardStats({
        active_sessions: 0,
        logins_24h: 0,
        activities_24h: 0,
        pending_alerts: 0,
        warnings_24h: 0
      })
      setUserSessions([])
      setUserActivities([])
      setSuspiciousActivities([])
      setAdminActions([])
      setUserWarnings([])
    }
  }

  const handleVerificationAction = (id: number, action: "approve" | "reject") => {
    console.log(`Verification ${action}:`, id)
    // Implement verification action logic
  }

  const handleJobModeration = (id: number, action: "approve" | "remove") => {
    console.log(`Job moderation ${action}:`, id)
    // Implement job moderation logic
  }

  const handleUserAction = (id: number, action: "suspend" | "activate" | "ban") => {
    console.log(`User action ${action}:`, id)
    // Implement user action logic
  }

  const handleLogout = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
    window.location.href = "/auth/login"
  }

  const handleAdminAction = async (targetUserId: string, actionType: AdminAction['action_type'], reason: string) => {
    try {
      if (!adminUser?.id) return
      
      await UserActivityService.takeAdminAction(
        adminUser.id,
        targetUserId,
        actionType,
        reason
      )
      
      // Refresh data
      fetchMonitoringData()
    } catch (error) {
      console.error('Error taking admin action:', error)
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      if (!adminUser?.id) return
      
      await UserActivityService.resolveSuspiciousActivity(alertId, adminUser.id)
      
      // Refresh data
      fetchMonitoringData()
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const handleIssueWarning = async (userId: string, warningType: string, message: string, severity: UserWarning['severity'] = 'medium') => {
    try {
      if (!adminUser?.id) return
      
      await UserActivityService.issueWarning(
        adminUser.id,
        userId,
        warningType,
        message,
        severity
      )
      
      // Refresh data
      fetchMonitoringData()
    } catch (error) {
      console.error('Error issuing warning:', error)
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white">
        <SidebarProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar>
              <SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="flex items-center gap-2">
                      <Logo className="w-8 h-8" noLink={true} showTagline={false} />
                      <span className="font-bold text-xl">Admin Panel</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin" className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin/users" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Users</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin/jobs" className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin/verifications" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Verifications</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin/moderation" className="flex items-center gap-2">
                            <Flag className="w-4 h-4" />
                            <span>Moderation</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarGroup>
                  <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin/monitoring" className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            <span>System Monitoring</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard/admin/logs" className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            <span>Activity Logs</span>
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
                    <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            {/* Main Content */}
            <SidebarInset>
              <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600">Monitor and manage your platform</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-500">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsRefreshing(true)
                        fetchAdminData()
                        fetchMonitoringData()
                      }}
                      disabled={isRefreshing}
                      className="flex items-center space-x-2"
                    >
                      <div className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </Button>
                    <div className="relative" ref={dropdownRef}>
                      <Button
                        variant="outline"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>{adminName}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                          <div className="py-1">
                            <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                              <div className="font-medium">{adminName}</div>
                              <div className="text-slate-500">{adminRole}</div>
                            </div>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                              <LogOut className="w-4 h-4 inline mr-2" />
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="p-6 space-y-6">
                    {/* Loading skeleton for stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      {[...Array(5)].map((_, i) => (
                        <Card key={i} className="bg-orange-50 border-orange-100">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 bg-orange-200 rounded w-24 animate-pulse"></div>
                            <div className="h-4 w-4 bg-orange-200 rounded animate-pulse"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-8 bg-orange-200 rounded w-16 animate-pulse mb-2"></div>
                            <div className="h-3 bg-orange-200 rounded w-20 animate-pulse"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Loading skeleton for system stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="bg-orange-50 border-orange-100">
                          <CardHeader>
                            <div className="h-6 bg-orange-200 rounded w-32 animate-pulse mb-2"></div>
                            <div className="h-4 bg-orange-200 rounded w-48 animate-pulse"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-10 bg-orange-200 rounded w-20 animate-pulse mb-2"></div>
                            <div className="h-4 bg-orange-200 rounded w-24 animate-pulse"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Monitoring Dashboard with Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="px-6 pt-6">
                        <TabsList className="grid w-full grid-cols-7">
                          <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="sessions" className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Sessions
                          </TabsTrigger>
                          <TabsTrigger value="activities" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Activities
                          </TabsTrigger>
                          <TabsTrigger value="alerts" className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Alerts
                          </TabsTrigger>
                          <TabsTrigger value="actions" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin Actions
                          </TabsTrigger>
                          <TabsTrigger value="warnings" className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Warnings
                          </TabsTrigger>
                          <TabsTrigger value="system" className="flex items-center gap-2">
                            <Server className="w-4 h-4" />
                            System
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="w-full">
                        <div className="p-6">
                          <Card className="w-full">
                            <CardHeader>
                              <CardTitle className="flex items-center text-slate-900">
                                <Home className="w-5 h-5 mr-2 text-orange-600" />
                                Dashboard Overview
                              </CardTitle>
                              <CardDescription className="text-slate-600">
                                Real-time monitoring and system statistics
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
                                {/* Stat Cards - Consistent Styling */}
                                <Card className="rounded-xl border border-orange-100 bg-white shadow-sm transition-all">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-900">Active Sessions</CardTitle>
                                    <Clock className="h-5 w-5 text-orange-600" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">{dashboardStats.active_sessions}</div>
                                    <p className="text-xs text-muted-foreground">Current</p>
                                  </CardContent>
                                </Card>
                                <Card className="rounded-xl border border-blue-100 bg-white shadow-sm transition-all">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-900">Logins (24h)</CardTitle>
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">{dashboardStats.logins_24h}</div>
                                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                                  </CardContent>
                                </Card>
                                <Card className="rounded-xl border border-green-100 bg-white shadow-sm transition-all">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-900">Activities (24h)</CardTitle>
                                    <Activity className="h-5 w-5 text-green-600" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">{dashboardStats.activities_24h}</div>
                                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                                  </CardContent>
                                </Card>
                                <Card className="rounded-xl border border-red-100 bg-white shadow-sm transition-all">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-900">Pending Alerts</CardTitle>
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{dashboardStats.pending_alerts}</div>
                                    <p className="text-xs text-muted-foreground">Unresolved</p>
                                  </CardContent>
                                </Card>
                                <Card className="rounded-xl border border-yellow-100 bg-white shadow-sm transition-all">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-900">Warnings (24h)</CardTitle>
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">{dashboardStats.warnings_24h}</div>
                                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Sessions Tab */}
                      <TabsContent value="sessions" className="w-full">
                        <Card>
                          <CardHeader>
                            <CardTitle>User Sessions</CardTitle>
                            <CardDescription>Monitor active user sessions and login activity</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User ID</TableHead>
                                  <TableHead>IP Address</TableHead>
                                  <TableHead>Device</TableHead>
                                  <TableHead>Browser</TableHead>
                                  <TableHead>Login Time</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userSessions.map((session) => (
                                  <TableRow key={session.id}>
                                    <TableCell>{session.user_id}</TableCell>
                                    <TableCell>{session.ip_address}</TableCell>
                                    <TableCell>{session.device_type}</TableCell>
                                    <TableCell>{session.browser}</TableCell>
                                    <TableCell>{new Date(session.login_time).toLocaleString()}</TableCell>
                                    <TableCell>
                                      <Badge variant={session.is_active ? "default" : "secondary"}>
                                        {session.is_active ? "Active" : "Inactive"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAdminAction(session.user_id, 'suspend', 'Suspicious session activity')}
                                      >
                                        <Ban className="w-3 h-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Activities Tab */}
                      <TabsContent value="activities" className="w-full">
                        <Card>
                          <CardHeader>
                            <CardTitle>User Activities</CardTitle>
                            <CardDescription>Track user behavior and page interactions</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User ID</TableHead>
                                  <TableHead>Activity Type</TableHead>
                                  <TableHead>Page URL</TableHead>
                                  <TableHead>IP Address</TableHead>
                                  <TableHead>Time</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userActivities.map((activity) => (
                                  <TableRow key={activity.id}>
                                    <TableCell>{activity.user_id}</TableCell>
                                    <TableCell>{activity.activity_type}</TableCell>
                                    <TableCell>{activity.page_url}</TableCell>
                                    <TableCell>{activity.ip_address}</TableCell>
                                    <TableCell>{new Date(activity.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleIssueWarning(activity.user_id, 'Suspicious Activity', 'Unusual activity pattern detected')}
                                      >
                                        <AlertTriangle className="w-3 h-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Alerts Tab */}
                      <TabsContent value="alerts" className="w-full">
                        <Card>
                          <CardHeader>
                            <CardTitle>Suspicious Activities</CardTitle>
                            <CardDescription>Security alerts and suspicious behavior detection</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User ID</TableHead>
                                  <TableHead>Alert Type</TableHead>
                                  <TableHead>Severity</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Created</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {suspiciousActivities.map((alert) => (
                                  <TableRow key={alert.id}>
                                    <TableCell>{alert.user_id}</TableCell>
                                    <TableCell>{alert.alert_type}</TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        alert.severity === 'critical' ? 'destructive' :
                                        alert.severity === 'high' ? 'default' :
                                        alert.severity === 'medium' ? 'secondary' : 'outline'
                                      }>
                                        {alert.severity}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={alert.is_resolved ? "secondary" : "default"}>
                                        {alert.is_resolved ? "Resolved" : "Pending"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        {!alert.is_resolved && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleResolveAlert(alert.id)}
                                          >
                                            <CheckCircle className="w-3 h-3" />
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleAdminAction(alert.user_id, 'warn', `Alert: ${alert.alert_type}`)}
                                        >
                                          <AlertTriangle className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Admin Actions Tab */}
                      <TabsContent value="actions" className="w-full">
                        <Card>
                          <CardHeader>
                            <CardTitle>Admin Actions</CardTitle>
                            <CardDescription>History of administrative actions taken</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Admin ID</TableHead>
                                  <TableHead>Target User</TableHead>
                                  <TableHead>Action</TableHead>
                                  <TableHead>Reason</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Created</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {adminActions.map((action) => (
                                  <TableRow key={action.id}>
                                    <TableCell>{action.admin_id}</TableCell>
                                    <TableCell>{action.target_user_id}</TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        action.action_type === 'ban' ? 'destructive' :
                                        action.action_type === 'suspend' ? 'default' :
                                        action.action_type === 'warn' ? 'secondary' : 'outline'
                                      }>
                                        {action.action_type}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{action.reason}</TableCell>
                                    <TableCell>
                                      <Badge variant={action.is_active ? "default" : "secondary"}>
                                        {action.is_active ? "Active" : "Expired"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(action.created_at).toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Warnings Tab */}
                      <TabsContent value="warnings" className="w-full">
                        <Card>
                          <CardHeader>
                            <CardTitle>User Warnings</CardTitle>
                            <CardDescription>Warnings issued to users for policy violations</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>User ID</TableHead>
                                  <TableHead>Warning Type</TableHead>
                                  <TableHead>Message</TableHead>
                                  <TableHead>Severity</TableHead>
                                  <TableHead>Acknowledged</TableHead>
                                  <TableHead>Created</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {userWarnings.map((warning) => (
                                  <TableRow key={warning.id}>
                                    <TableCell>{warning.user_id}</TableCell>
                                    <TableCell>{warning.warning_type}</TableCell>
                                    <TableCell>{warning.message}</TableCell>
                                    <TableCell>
                                      <Badge variant={
                                        warning.severity === 'critical' ? 'destructive' :
                                        warning.severity === 'high' ? 'default' :
                                        warning.severity === 'medium' ? 'secondary' : 'outline'
                                      }>
                                        {warning.severity}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={warning.is_acknowledged ? "default" : "secondary"}>
                                        {warning.is_acknowledged ? "Yes" : "No"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(warning.created_at).toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* System Tab */}
                      <TabsContent value="system" className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Pending Verifications */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-slate-900 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                                Pending Verifications
                              </CardTitle>
                              <CardDescription className="text-slate-600">
                                Review and approve user verification requests
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {pendingVerifications.map((verification) => (
                                  <div
                                    key={verification.id}
                                    className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <h4 className="font-medium text-slate-900">{verification.user_name || 'N/A'}</h4>
                                      <p className="text-slate-600">{verification.document_type || 'N/A'}</p>
                                      <p className="text-xs text-slate-500">Submitted: {verification.submitted_date || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <Badge className="bg-orange-500 text-white border-0 rounded-xl">Pending</Badge>
                                      <div className="flex space-x-2">
                                        <Button
                                          size="sm"
                                          className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                          onClick={() => handleVerificationAction(verification.id, "approve")}
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                          onClick={() => handleVerificationAction(verification.id, "reject")}
                                        >
                                          <XCircle className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Button variant="outline" className="w-full mt-6 btn-secondary" asChild>
                                <Link href="/dashboard/admin/verifications">View All Verifications</Link>
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Flagged Jobs */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-slate-900 flex items-center">
                                <Flag className="w-5 h-5 mr-2 text-orange-600" />
                                Flagged Job Postings
                              </CardTitle>
                              <CardDescription className="text-slate-600">
                                Review reported job postings for policy violations
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {flaggedJobs.map((job) => (
                                  <div
                                    key={job.id}
                                    className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors"
                                  >
                                    <div className="flex-1">
                                      <h4 className="font-medium text-slate-900">{job.title || 'N/A'}</h4>
                                      <p className="text-slate-600">{job.company || 'N/A'}</p>
                                      <p className="text-xs text-slate-500">Reason: {job.reason || 'N/A'}</p>
                                      <p className="text-xs text-slate-500">Reported: {job.reportedDate || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <Badge className="bg-red-500 text-white border-0 rounded-xl">Flagged</Badge>
                                      <div className="flex space-x-2">
                                        <Button
                                          size="sm"
                                          className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                          onClick={() => handleJobModeration(job.id, "approve")}
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                          onClick={() => handleJobModeration(job.id, "remove")}
                                        >
                                          <Ban className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Button variant="outline" className="w-full mt-6 btn-secondary" asChild>
                                <Link href="/dashboard/admin/moderation">View All Flagged Content</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Recent Users */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-slate-900 flex items-center">
                                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                                  Recent User Activity
                                </CardTitle>
                                <CardDescription className="text-slate-600">
                                  Monitor new user registrations and activity
                                </CardDescription>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                  <Input
                                    placeholder="Search users..."
                                    className="pl-8 w-64 form-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                  />
                                </div>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                  <SelectTrigger className="w-32 form-input">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-orange-200">
                                    <SelectItem value="all" className="text-slate-900 hover:bg-orange-50">
                                      All Status
                                    </SelectItem>
                                    <SelectItem value="active" className="text-slate-900 hover:bg-orange-50">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="suspended" className="text-slate-900 hover:bg-orange-50">
                                      Suspended
                                    </SelectItem>
                                    <SelectItem value="banned" className="text-slate-900 hover:bg-orange-50">
                                      Banned
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-orange-50 rounded-2xl border border-orange-100 overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-orange-100 hover:bg-orange-100">
                                    <TableHead className="text-slate-700">User</TableHead>
                                    <TableHead className="text-slate-700">Role</TableHead>
                                    <TableHead className="text-slate-700">Join Date</TableHead>
                                    <TableHead className="text-slate-700">Activity</TableHead>
                                    <TableHead className="text-slate-700">Status</TableHead>
                                    <TableHead className="text-slate-700">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {recentUsers.map((user) => (
                                    <TableRow key={user.id} className="border-orange-100 hover:bg-orange-100">
                                      <TableCell>
                                        <div>
                                          <div className="font-medium text-slate-900">{user.name || user.email || 'N/A'}</div>
                                          <div className="text-sm text-slate-600">{user.email || 'N/A'}</div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={`${user.role === "seeker" ? "bg-blue-500" : "bg-green-500"} text-white border-0 rounded-xl`}
                                        >
                                          {user.role === "seeker" ? (
                                            <Users className="w-3 h-3 mr-1" />
                                          ) : (
                                            <Building className="w-3 h-3 mr-1" />
                                          )}
                                          {user.role || 'N/A'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-slate-600">{user.joinDate || 'N/A'}</TableCell>
                                      <TableCell className="text-slate-600">
                                        {user.role === "seeker"
                                          ? `${user.applications} applications`
                                          : `${user.jobsPosted} jobs posted`}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={`${
                                            user.status === "active"
                                              ? "bg-green-500"
                                              : user.status === "suspended"
                                                ? "bg-red-500"
                                                : "bg-gray-500"
                                          } text-white border-0 rounded-xl`}
                                        >
                                          {user.status || 'N/A'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex space-x-2">
                                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                            <Eye className="w-3 h-3" />
                                          </Button>
                                          {user.status === "active" ? (
                                            <Button
                                              size="sm"
                                              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                                              onClick={() => handleUserAction(user.id, "suspend")}
                                            >
                                              <Ban className="w-3 h-3" />
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                              onClick={() => handleUserAction(user.id, "activate")}
                                            >
                                              <UserCheck className="w-3 h-3" />
                                            </Button>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminGuard>
  )
}
