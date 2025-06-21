"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  TrendingUp,
  TrendingDown,
  Clock,
  Eye,
  Calendar,
  MapPin,
  Briefcase,
  LogOut,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { supabase } from "@/lib/supabaseClient"
import { Logo } from "@/components/logo"

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

const getSessionData = () => {
  try {
    const sessionData = sessionStorage.getItem("skillconnect_session")
    return sessionData ? JSON.parse(sessionData) : null
  } catch (error) {
    console.error("Error getting session data:", error)
    return null
  }
}

const clearUserSession = () => {
  localStorage.removeItem("skillconnect_user")
  sessionStorage.removeItem("skillconnect_session")
}

const isSeeker = () => {
  const userData = getUserData()
  return userData?.role === "seeker"
}

const generateSeekerData = async (userData: any) => {
  try {
    // Fetch user's applications
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .select(`
        *,
        jobs!inner(title, company, location, salary)
      `)
      .eq('applicant_id', userData.id)
      .order('applied_at', { ascending: false })

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
    }

    // Fetch recent jobs for recommendations
    const { data: recentJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError)
    }

    const formattedApplications = applications?.map((app: any) => ({
      id: app.id,
      jobTitle: app.jobs.title,
      company: app.jobs.company,
      appliedDate: new Date(app.applied_at).toLocaleDateString(),
      status: app.status,
      lastUpdated: new Date(app.updated_at || app.applied_at).toLocaleDateString(),
    })) || []

    const recommendedJobs = recentJobs?.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || "Not specified",
      matchScore: Math.floor(Math.random() * 20) + 80, // Mock match score
    })) || []

    return {
      totalApplications: formattedApplications.length,
      pendingApplications: formattedApplications.filter((app: any) => app.status === 'pending').length,
      interviewsScheduled: formattedApplications.filter((app: any) => app.status === 'shortlisted').length,
      jobsSaved: 12, // Mock data for now
      recentApplications: formattedApplications.slice(0, 3),
      recommendedJobs: recommendedJobs.slice(0, 3),
      notifications: [],
    }
  } catch (error) {
    console.error('Error generating seeker data:', error)
    // Return default data on error
    return {
      totalApplications: 0,
      pendingApplications: 0,
      interviewsScheduled: 0,
      jobsSaved: 0,
      recentApplications: [],
      recommendedJobs: [],
      notifications: [],
    }
  }
}

function SeekerDashboardContent() {
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()
  // Mock: Track which applications have been contacted by employer
  const [contactedApplications, setContactedApplications] = useState<string[]>([])

  // Demo: Simulate being contacted for the first application after 5 seconds
  useEffect(() => {
    if (dashboardData && dashboardData.recentApplications.length > 0 && contactedApplications.length === 0) {
      const timer = setTimeout(() => {
        setContactedApplications([dashboardData.recentApplications[0].id])
        showSuccess('You have been contacted by an employer!', 'Check your email for details.')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [dashboardData, contactedApplications.length])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Check if user is actually a seeker
        if (!isSeeker()) {
          setTimeout(() => {
            window.location.href = "/auth/login"
          }, 2000)
          return
        }

        const userData = getUserData()
        const sessionData = getSessionData()
        
        if (!userData || !sessionData) {
          setTimeout(() => {
            clearUserSession()
            window.location.href = "/auth/login"
          }, 2000)
          return
        }

        // Generate seeker-specific data
        const seekerData = await generateSeekerData(userData)
        
        setUser(userData)
        setDashboardData(seekerData)
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = () => {
    clearUserSession()
    window.location.href = "/auth/login"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <Card className="simple-card w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-gradient">
      <StatusManager notifications={notifications} onRemove={removeNotification} />
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
                        isActive
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
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
                          <span>My Profile</span>
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
                        className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
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
                    onClick={handleLogout}
                    className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-xl">
              <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-slate-900">Job Seeker Dashboard</h1>
              </div>
              <div className="flex items-center space-x-3">
                {user && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-500">Job Seeker</p>
                    </div>
                  </div>
                )}
                <Badge className="bg-blue-500 text-white border-0 rounded-xl px-3 py-1">
                  <Briefcase className="w-3 h-3 mr-1" />
                  Job Seeker
                </Badge>
              </div>
            </header>

            <main className="flex-1 space-y-8 p-6 scroll-simple">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Welcome back, {user?.firstName || 'Job Seeker'}! 👋
                  </h2>
                  <p className="text-slate-600 text-lg">Track your applications and discover new opportunities</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button className="btn-primary" asChild>
                    <Link href="/jobs">
                      <Search className="w-4 h-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Total Applications",
                    value: dashboardData?.totalApplications || 0,
                    change: "+2 this week",
                    icon: FileText,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    title: "Pending Reviews",
                    value: dashboardData?.pendingApplications || 0,
                    change: "Awaiting response",
                    icon: Clock,
                    color: "from-orange-500 to-orange-600",
                  },
                  {
                    title: "Interviews Scheduled",
                    value: dashboardData?.interviewsScheduled || 0,
                    change: "+1 this month",
                    icon: Calendar,
                    color: "from-green-500 to-green-600",
                  },
                  {
                    title: "Saved Jobs",
                    value: dashboardData?.jobsSaved || 0,
                    change: "+3 this week",
                    icon: Briefcase,
                    color: "from-purple-500 to-purple-600",
                  },
                ].map((stat, index) => (
                  <Card key={index} className="simple-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                          <p className="text-sm text-green-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {stat.change}
                          </p>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Applications */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-orange-600" />
                      Recent Applications
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Your latest job applications and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData?.recentApplications && Array.isArray(dashboardData.recentApplications) && dashboardData.recentApplications.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.recentApplications.map((application: any) => (
                          <div
                            key={application.id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                              contactedApplications.includes(application.id)
                                ? "bg-green-50 border-green-200"
                                : "bg-orange-50 border-orange-100 hover:bg-orange-100"
                            }`}
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{application.jobTitle || 'Unknown Job'}</h4>
                              <p className="text-slate-600">{application.company || 'Unknown Company'}</p>
                              <p className="text-xs text-slate-500">Applied: {application.appliedDate || 'Date not available'}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={`${
                                  application.status === "pending"
                                    ? "bg-orange-500"
                                    : application.status === "reviewed"
                                      ? "bg-blue-500"
                                      : application.status === "shortlisted"
                                        ? "bg-purple-500"
                                        : application.status === "accepted"
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                } text-white border-0 rounded-xl`}
                              >
                                {application.status || 'pending'}
                              </Badge>
                              {contactedApplications.includes(application.id) && (
                                <Badge className="bg-green-500 text-white border-0 rounded-xl">
                                  Contacted!
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                        <p className="text-slate-600 mb-6">Start applying to jobs to track your progress here</p>
                        <Button asChild className="btn-primary">
                          <Link href="/jobs">Browse Jobs</Link>
                        </Button>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-6 btn-secondary" asChild>
                      <Link href="/dashboard/seeker/applications">View All Applications</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Recommended Jobs */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-orange-600" />
                      Recommended Jobs
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Jobs that match your profile and skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData?.recommendedJobs && Array.isArray(dashboardData.recommendedJobs) ? 
                        dashboardData.recommendedJobs.map((job: any) => (
                          <div
                            key={job.id}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{job.title || 'Untitled Job'}</h4>
                              <p className="text-slate-600">{job.company || 'Unknown Company'}</p>
                              <p className="text-slate-500 text-sm flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location || 'Location not specified'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{job.matchScore || 0}%</p>
                                <p className="text-xs text-slate-500">Match</p>
                              </div>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl" asChild>
                                <Link href={`/jobs/${job.id}/apply`}>Apply</Link>
                              </Button>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8 text-slate-500">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>No recommended jobs found</p>
                          </div>
                        )
                      }
                    </div>
                    <Button variant="outline" className="w-full mt-6 btn-secondary" asChild>
                      <Link href="/jobs">Browse More Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Application Progress */}
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    Application Progress
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Track your job search progress and success rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{dashboardData?.totalApplications || 0}</h3>
                      <p className="text-slate-600">Total Applications</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{dashboardData?.pendingApplications || 0}</h3>
                      <p className="text-slate-600">Under Review</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{dashboardData?.interviewsScheduled || 0}</h3>
                      <p className="text-slate-600">Interviews</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Application Success Rate</span>
                      <span className="text-sm text-slate-500">
                        {dashboardData?.totalApplications > 0 
                          ? Math.round((dashboardData.interviewsScheduled / dashboardData.totalApplications) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={dashboardData?.totalApplications > 0 
                        ? (dashboardData.interviewsScheduled / dashboardData.totalApplications) * 100
                        : 0} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default function SeekerDashboard() {
  return (
    <SeekerGuard>
      <SeekerDashboardContent />
    </SeekerGuard>
  )
}
