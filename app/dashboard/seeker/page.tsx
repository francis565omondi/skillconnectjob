"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Home, FileText, User, Settings, Bell, Search, Briefcase, LogOut,
  TrendingUp, TrendingDown, Clock, Eye, Calendar, MapPin, DollarSign,
  Building, Plus, Edit, Trash, MoreHorizontal, RefreshCw, Download,
  Upload, Zap, Target, Award, Star, Filter, Bookmark, CheckCircle,
  XCircle, AlertTriangle, Info, ExternalLink, Phone, Mail, Globe,
  Linkedin, Github, ExternalLink as ExternalLinkIcon, Camera, Save,
  Share, Heart, MessageSquare, Users, BarChart3, Activity, Target as TargetIcon
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"
import { AIServices } from "@/lib/aiServices"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"

interface SeekerStats {
  totalApplications: number
  pendingApplications: number
  interviewsScheduled: number
  jobsSaved: number
  profileCompleteness: number
  averageMatchScore: number
  recentActivity: number
}

interface JobApplication {
  id: string
  job_title: string
  company: string
  location: string
  status: string
  applied_date: string
  last_updated: string
  match_score: number
  salary_range?: string
  job_type: string
}

interface RecommendedJob {
  id: string
  title: string
  company: string
  location: string
  salary_range?: string
  job_type: string
  match_score: number
  requirements: string[]
  description: string
  posted_date: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  created_at: string
  is_read: boolean
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  bio: string
  skills: string[]
  experience: string
  education: string
  location: string
  profile_image_url?: string
  resume_url?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
}

export default function SeekerDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<SeekerStats>({
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    jobsSaved: 0,
    profileCompleteness: 0,
    averageMatchScore: 0,
    recentActivity: 0
  })
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  const { notifications: statusNotifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  useEffect(() => {
    loadDashboardData()
    setupRealTimeSubscriptions()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        loadUserProfile(),
        loadApplications(),
        loadRecommendedJobs(),
        loadNotifications(),
        loadStats(),
        loadRecentActivities()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      showError("Failed to load dashboard", "Please refresh the page and try again")
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) {
        showError("User not found", "Please log in again")
        return
      }

      const user = JSON.parse(userData)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setUserProfile(profile)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const loadApplications = async () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) return

      const user = JSON.parse(userData)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs(title, company, location, salary_min, salary_max, type, requirements)
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedApplications = (data || []).map(app => ({
      id: app.id,
        job_title: app.jobs?.title || 'Unknown Job',
      company: app.jobs?.company || 'Unknown Company',
      location: app.jobs?.location || 'Unknown Location',
      status: app.status || 'pending',
        applied_date: new Date(app.created_at).toLocaleDateString(),
        last_updated: new Date(app.updated_at || app.created_at).toLocaleDateString(),
        match_score: app.match_score || 0,
        salary_range: app.jobs?.salary_min && app.jobs?.salary_max 
        ? `$${app.jobs.salary_min.toLocaleString()} - $${app.jobs.salary_max.toLocaleString()}`
          : undefined,
        job_type: app.jobs?.type || 'full-time'
      }))

      setApplications(formattedApplications)
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  const loadRecommendedJobs = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Calculate match scores using AI
      const jobsWithScores = await Promise.all(
        (jobs || []).map(async (job) => {
      let matchScore = 70 // Base score
      
      if (userProfile?.skills && job.requirements) {
        try {
          const userSkills = Array.isArray(userProfile.skills) ? userProfile.skills : JSON.parse(userProfile.skills || '[]')
          const jobRequirements = Array.isArray(job.requirements) ? job.requirements : JSON.parse(job.requirements || '[]')
          
          const matchingSkills = userSkills.filter((skill: string) => 
            jobRequirements.some((req: string) => 
              req.toLowerCase().includes(skill.toLowerCase()) || 
              skill.toLowerCase().includes(req.toLowerCase())
            )
          )
          
          if (userSkills.length > 0) {
            matchScore = Math.min(95, 70 + (matchingSkills.length / userSkills.length) * 25)
          }
        } catch (error) {
          console.error('Error calculating match score:', error)
        }
      }
      
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
            salary_range: job.salary_min && job.salary_max 
          ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
              : undefined,
            job_type: job.type,
            match_score: Math.round(matchScore),
            requirements: Array.isArray(job.requirements) ? job.requirements : JSON.parse(job.requirements || '[]'),
            description: job.description,
            posted_date: new Date(job.created_at).toLocaleDateString()
          }
        })
      )

      // Sort by match score and take top 6
      const sortedJobs = jobsWithScores.sort((a, b) => b.match_score - a.match_score).slice(0, 6)
      setRecommendedJobs(sortedJobs)
  } catch (error) {
      console.error('Error loading recommended jobs:', error)
    }
  }

  const loadNotifications = async () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) return

      const user = JSON.parse(userData)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const loadStats = async () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) return

      const user = JSON.parse(userData)
      
      // Calculate profile completeness
      const profileFields = ['bio', 'skills', 'experience', 'education', 'location']
      const completedFields = profileFields.filter(field => userProfile?.[field as keyof UserProfile])
      const profileCompleteness = Math.round((completedFields.length / profileFields.length) * 100)

      // Calculate average match score
      const averageMatchScore = applications.length > 0 
        ? Math.round(applications.reduce((sum, app) => sum + app.match_score, 0) / applications.length)
        : 0

      const newStats: SeekerStats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        interviewsScheduled: applications.filter(app => app.status === 'shortlisted').length,
        jobsSaved: 0, // TODO: Implement saved jobs functionality
        profileCompleteness,
        averageMatchScore,
        recentActivity: recentActivities.length
      }

      setStats(newStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadRecentActivities = async () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) return

      const user = JSON.parse(userData)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs(title, company)
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      const activities = (data || []).map(activity => ({
        id: activity.id,
        type: 'application',
        title: 'Application submitted',
        description: `Applied to ${activity.jobs?.title} at ${activity.jobs?.company}`,
        created_at: activity.created_at
      }))

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading recent activities:', error)
    }
  }

  const setupRealTimeSubscriptions = () => {
    const userData = localStorage.getItem("skillconnect_user")
    if (!userData) return

    const user = JSON.parse(userData)

    // Subscribe to applications changes
    const applicationsSubscription = supabase
      .channel('applications_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: `applicant_id=eq.${user.id}`
      }, () => {
        loadApplications()
        loadStats()
      })
      .subscribe()

    // Subscribe to notifications
    const notificationsSubscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadNotifications()
      })
      .subscribe()

    return () => {
      applicationsSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }

  const handleApplyToJob = (job: RecommendedJob) => {
    // Navigate to the enhanced application page
    router.push(`/jobs/${job.id}/apply`)
  }

  const handleLogout = () => {
    localStorage.removeItem("skillconnect_user")
    sessionStorage.removeItem("skillconnect_session")
    window.location.href = "/auth/login"
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shortlisted': return 'bg-blue-100 text-blue-800'
      case 'interviewed': return 'bg-purple-100 text-purple-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <SeekerGuard>
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Seeker Dashboard...</p>
      </div>
        </div>
      </SeekerGuard>
    )
  }

  return (
    <SeekerGuard>
    <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={statusNotifications} onRemove={removeNotification} />
        
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white shadow-lg">
            <SidebarHeader>
              <div className="px-4 py-4">
                <Logo showTagline={false} />
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                    Dashboard
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker">
                          <Home className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker/applications">
                          <FileText className="w-5 h-5" />
                            <span className="font-medium">Applications</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/profile">
                            <User className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/seeker/notifications">
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">Notifications</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-4">
                  Account
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                          className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <Link href="/dashboard/seeker/settings">
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
                    onClick={handleLogout}
                      className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                <header className="border-b border-orange-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                      <SidebarTrigger className="-ml-1" />
                  <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Seeker Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome back, {userProfile?.first_name}!</p>
                  </div>
                </div>
                    <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                        size="sm"
                        onClick={loadDashboardData}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                  </Button>
                </div>
              </div>
                </header>

                <main className="flex-1 p-6">
              {/* Stats Overview */}
                  <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="simple-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
                        <FileText className="h-4 w-4 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalApplications}</div>
                        <p className="text-xs text-slate-500">All time applications</p>
                    </CardContent>
                  </Card>

                    <Card className="simple-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.pendingApplications}</div>
                        <p className="text-xs text-slate-500">Awaiting response</p>
                      </CardContent>
                    </Card>

                    <Card className="simple-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Interviews</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.interviewsScheduled}</div>
                        <p className="text-xs text-slate-500">Scheduled interviews</p>
                      </CardContent>
                    </Card>

                    <Card className="simple-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Profile Complete</CardTitle>
                        <Target className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.profileCompleteness}%</div>
                        <p className="text-xs text-slate-500">Profile completeness</p>
                      </CardContent>
                    </Card>
              </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Applications */}
                <Card className="simple-card">
                  <CardHeader>
                        <CardTitle className="text-slate-900 flex items-center justify-between">
                          <span>Recent Applications</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/seeker/applications">
                              <Eye className="w-4 h-4 mr-2" />
                              View All
                            </Link>
                          </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {applications.slice(0, 5).map((application) => (
                            <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-900">{application.job_title}</h4>
                                <p className="text-sm text-slate-600">{application.company}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                                  <span className="text-xs text-slate-500">{application.applied_date}</span>
                            </div>
                          </div>
                              <div className="text-right">
                                <div className={`text-sm font-medium ${getMatchScoreColor(application.match_score)}`}>
                                  {application.match_score}% match
                      </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedApplication(application)
                                    setShowApplicationModal(true)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                        </Button>
                              </div>
                            </div>
                          ))}
                          {applications.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                              <p>No applications yet</p>
                              <p className="text-sm">Start applying to jobs to see them here</p>
                      </div>
                    )}
                        </div>
                  </CardContent>
                </Card>

                {/* Recommended Jobs */}
                <Card className="simple-card">
                  <CardHeader>
                        <CardTitle className="text-slate-900 flex items-center justify-between">
                          <span>Recommended Jobs</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/jobs">
                              <Search className="w-4 h-4 mr-2" />
                              Browse Jobs
                            </Link>
                          </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                          {recommendedJobs.map((job) => (
                            <div key={job.id} className="p-3 border rounded-lg hover:bg-slate-50">
                              <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{job.title}</h4>
                                  <p className="text-sm text-slate-600">{job.company}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs text-slate-500">{job.location}</span>
                                    {job.salary_range && (
                                      <>
                                        <DollarSign className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500">{job.salary_range}</span>
                                      </>
                                    )}
                              </div>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {job.job_type}
                                    </Badge>
                                    <div className={`text-xs font-medium ${getMatchScoreColor(job.match_score)}`}>
                                      {job.match_score}% match
                            </div>
                              </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyToJob(job)}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  Apply
                              </Button>
                            </div>
                          </div>
                          ))}
                          {recommendedJobs.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                              <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                              <p>No recommendations yet</p>
                              <p className="text-sm">Complete your profile to get job recommendations</p>
                          </div>
                          )}
                    </div>
                  </CardContent>
                </Card>
              </div>

                  {/* Recent Activity */}
                  <Card className="simple-card mt-6">
                <CardHeader>
                      <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                              <p className="text-xs text-slate-600">{activity.description}</p>
                  </div>
                            <span className="text-xs text-slate-500">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                        {recentActivities.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <Activity className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p>No recent activity</p>
                            <p className="text-sm">Your activity will appear here</p>
                          </div>
                        )}
                  </div>
                </CardContent>
              </Card>
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>

        {/* Application Details Modal */}
        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Job Title</Label>
                    <p className="text-sm text-slate-600">{selectedApplication.job_title}</p>
                      </div>
                  <div>
                    <Label className="text-sm font-medium">Company</Label>
                    <p className="text-sm text-slate-600">{selectedApplication.company}</p>
                    </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-slate-600">{selectedApplication.location}</p>
                      </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                    </div>
                  <div>
                    <Label className="text-sm font-medium">Applied Date</Label>
                    <p className="text-sm text-slate-600">{selectedApplication.applied_date}</p>
                      </div>
                  <div>
                    <Label className="text-sm font-medium">Match Score</Label>
                    <p className={`text-sm font-medium ${getMatchScoreColor(selectedApplication.match_score)}`}>
                      {selectedApplication.match_score}%
                    </p>
                    </div>
                  </div>
                {selectedApplication.salary_range && (
                  <div>
                    <Label className="text-sm font-medium">Salary Range</Label>
                    <p className="text-sm text-slate-600">{selectedApplication.salary_range}</p>
                    </div>
                )}
                  </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SeekerGuard>
  )
}