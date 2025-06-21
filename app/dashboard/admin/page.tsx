"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"
import { Logo } from "@/components/logo"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
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

  // Fetch admin dashboard data
  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
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

      // Race against timeout
      const [jobsResult, applicationsResult, usersResult, recentUsersResult] = await Promise.race([
        Promise.all([jobsPromise, applicationsPromise, usersPromise, recentUsersPromise]),
        timeoutPromise
      ]) as any

      // Calculate stats
      const activeJobs = jobsResult.data?.length || 0
      const successfulMatches = applicationsResult.data?.length || 0
      const totalUsers = usersResult.data?.length || 0

      setSystemStats({
        totalUsers,
        activeJobs,
        pendingVerifications: 12, // Mock data for now
        flaggedContent: 8, // Mock data for now
        monthlyGrowth: 15.3, // Mock data for now
        successfulMatches,
      })

      // Format recent users from database
      const formattedRecentUsers = recentUsersResult.data?.map((user: any, index: number) => ({
        id: user.id,
        name: `${user.first_name || 'Unknown'} ${user.last_name || 'User'}`,
        email: user.email,
        role: user.role,
        joinDate: new Date(user.created_at).toLocaleDateString(),
        status: user.status || 'active',
        applications: user.role === 'seeker' ? Math.floor(Math.random() * 10) + 1 : undefined,
        jobsPosted: user.role === 'employer' ? Math.floor(Math.random() * 5) + 1 : undefined,
      })) || []

      setRecentUsers(formattedRecentUsers)

      // Mock pending verifications for now
      setPendingVerifications([
        {
          id: 1,
          companyName: "TechStart Solutions",
          contactPerson: "Jane Doe",
          email: "jane@techstart.co.ke",
          submittedDate: "2024-01-15",
          documentType: "Business License",
          status: "pending",
        },
        {
          id: 2,
          companyName: "BuildCorp Kenya",
          contactPerson: "John Smith",
          email: "john@buildcorp.co.ke",
          submittedDate: "2024-01-14",
          documentType: "Business License",
          status: "pending",
        },
      ])

      // Mock flagged jobs for now
      setFlaggedJobs([
        {
          id: 1,
          title: "High Paying Remote Work",
          company: "QuickMoney Ltd",
          reportedBy: "user123",
          reason: "Suspicious salary claims",
          reportedDate: "2024-01-16",
          status: "pending",
        },
        {
          id: 2,
          title: "Easy Money Online",
          company: "FastCash Inc",
          reportedBy: "user456",
          reason: "Potential scam",
          reportedDate: "2024-01-15",
          status: "pending",
        },
      ])

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
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationAction = (id: number, action: "approve" | "reject") => {
    console.log(`${action} verification for ID: ${id}`)
    // Implement verification logic
  }

  const handleJobModeration = (id: number, action: "approve" | "remove") => {
    console.log(`${action} job for ID: ${id}`)
    // Implement job moderation logic
  }

  const handleUserAction = (id: number, action: "suspend" | "activate" | "ban") => {
    console.log(`${action} user for ID: ${id}`)
    // Implement user management logic
  }

  return (
    <AdminGuard>
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
                    Dashboard
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
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
                            <Badge className="ml-auto bg-orange-500 text-white border-0 rounded-full text-xs">
                              {pendingVerifications.length}
                            </Badge>
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
                            <Badge className="ml-auto bg-orange-500 text-white border-0 rounded-full text-xs">
                              {flaggedJobs.length}
                            </Badge>
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
                  <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-slate-900">Administrator</p>
                      <p className="text-xs text-slate-500">System Admin</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-500 text-white border-0 rounded-xl px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">System Overview</h2>
                    <p className="text-slate-600 text-lg">Monitor and manage the SkillConnect platform</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="btn-secondary">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="simple-card">
                          <CardContent className="p-6">
                            <div className="animate-pulse">
                              <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                              <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
                              <div className="h-3 bg-slate-200 rounded w-32"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                      {[1, 2].map((i) => (
                        <Card key={i} className="simple-card">
                          <CardContent className="p-6">
                            <div className="animate-pulse">
                              <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
                              <div className="space-y-3">
                                {[1, 2, 3].map((j) => (
                                  <div key={j} className="h-16 bg-slate-200 rounded"></div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* System Metrics */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {[
                        {
                          title: "Total Users",
                          value: systemStats.totalUsers.toLocaleString(),
                          change: `+${systemStats.monthlyGrowth}% this month`,
                          icon: Users,
                        },
                        {
                          title: "Active Jobs",
                          value: systemStats.activeJobs.toLocaleString(),
                          change: "+8% from last week",
                          icon: Briefcase,
                        },
                        {
                          title: "Pending Verifications",
                          value: systemStats.pendingVerifications.toString(),
                          change: "Requires attention",
                          icon: Clock,
                        },
                        {
                          title: "Flagged Content",
                          value: systemStats.flaggedContent.toString(),
                          change: "Needs review",
                          icon: Flag,
                        },
                      ].map((metric, index) => (
                        <Card key={index} className="simple-card hover-lift">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">{metric.title}</CardTitle>
                            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                              <metric.icon className="h-5 w-5 text-orange-600" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{metric.value}</div>
                            <div className="flex items-center text-sm">
                              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                              <span className="text-green-500">{metric.change}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                      {/* Pending Verifications */}
                      <Card className="simple-card">
                        <CardHeader>
                          <CardTitle className="text-slate-900 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-orange-600" />
                            Pending Company Verifications
                          </CardTitle>
                          <CardDescription className="text-slate-600">
                            Review and approve company verification requests
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
                                  <h4 className="font-medium text-slate-900">{verification.companyName}</h4>
                                  <p className="text-slate-600">{verification.contactPerson}</p>
                                  <p className="text-xs text-slate-500">Submitted: {verification.submittedDate}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Badge
                                    className={`${verification.status === "pending" ? "bg-orange-500" : "bg-blue-500"} text-white border-0 rounded-xl`}
                                  >
                                    {verification.status.replace("_", " ")}
                                  </Badge>
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
                      <Card className="simple-card">
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
                                  <h4 className="font-medium text-slate-900">{job.title}</h4>
                                  <p className="text-slate-600">{job.company}</p>
                                  <p className="text-xs text-slate-500">Reason: {job.reason}</p>
                                  <p className="text-xs text-slate-500">Reported: {job.reportedDate}</p>
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
                    <Card className="simple-card">
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
                                      <div className="font-medium text-slate-900">{user.name}</div>
                                      <div className="text-sm text-slate-600">{user.email}</div>
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
                                      {user.role}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-slate-600">{user.joinDate}</TableCell>
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
                                      {user.status}
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
