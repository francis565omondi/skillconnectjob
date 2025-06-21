"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Briefcase,
  LogOut,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function SeekerApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Get current user on component mount
  useEffect(() => {
    const userData = localStorage.getItem("skillconnect_user")
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)
    }
  }, [])

  // Fetch applications when user is loaded
  useEffect(() => {
    if (currentUser) {
      fetchApplications()
    }
  }, [currentUser])

  const fetchApplications = async () => {
    if (!currentUser) return

    try {
      setIsLoading(true)
      
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(title, company, location)
        `)
        .eq('applicant_id', currentUser.id)
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
        setApplications([])
      } else {
        const formattedApplications = applications.map(app => ({
          id: app.id,
          jobTitle: app.jobs.title,
          company: app.jobs.company,
          location: app.jobs.location,
          appliedDate: new Date(app.applied_at).toLocaleDateString(),
          status: app.status,
          coverLetter: app.cover_letter,
          experienceSummary: app.experience_summary,
          expectedSalary: app.expected_salary,
          availableStartDate: app.available_start_date,
          additionalInfo: app.additional_info,
          cvUrl: app.cv_url
        }))
        
        setApplications(formattedApplications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shortlisted":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <SeekerGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
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
                          <Link href="/dashboard/seeker">
                            <Home className="w-5 h-5" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
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
                            <span>Profile</span>
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
                    >
                      <Link href="/auth/login">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
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
                  <h1 className="text-lg font-semibold text-slate-900">My Applications</h1>
                </div>
                <Button className="btn-primary" asChild>
                  <Link href="/jobs">
                    <Search className="w-4 h-4 mr-2" />
                    Browse More Jobs
                  </Link>
                </Button>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                {/* Filters */}
                <Card className="simple-card">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search by job title or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Applications List */}
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="simple-card">
                          <CardContent className="p-4">
                            <div className="animate-pulse">
                              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <Card key={app.id} className="simple-card">
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg text-slate-800">{app.jobTitle}</h3>
                            <p className="text-slate-600">
                              {app.company} - {app.location}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              Applied on: {app.appliedDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <Badge className={`border-2 ${getStatusClass(app.status)}`}>
                              {app.status}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/jobs/${app.id}`}>
                                View Job
                                <Eye className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="simple-card">
                      <CardContent className="p-12 text-center">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
                        <p className="text-slate-600 mb-6">
                          {searchQuery || statusFilter !== "all" 
                            ? "No applications found that match your search criteria."
                            : "You haven't applied to any jobs yet. Start browsing and applying to opportunities!"
                          }
                        </p>
                        <Button className="btn-primary" asChild>
                          <Link href="/jobs">
                            <Search className="w-4 h-4 mr-2" />
                            Browse Jobs
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </SeekerGuard>
  )
}
