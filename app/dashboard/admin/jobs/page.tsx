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
  LogOut,
  Eye,
  Ban,
  CheckCircle,
  Building,
  FileText,
  MapPin,
  Calendar,
  Filter,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { AdminGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch jobs data
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!inner(first_name, last_name, email, company)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching jobs:', error)
        setJobs([])
      } else {
        const formattedJobs = jobsData.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary || 'Not specified',
          status: job.status || 'active',
          postedDate: new Date(job.created_at).toLocaleDateString(),
          employer: `${job.profiles?.first_name || 'Unknown'} ${job.profiles?.last_name || 'User'}`,
          employerEmail: job.profiles?.email || 'No email',
          applications: job.applications_count || 0,
          description: job.description,
        }))
        
        setJobs(formattedJobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobAction = async (jobId: string, action: "approve" | "remove") => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: action === 'approve' ? 'active' : 'removed',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (error) {
        console.error('Error updating job status:', error)
        return
      }

      // Refresh jobs list
      fetchJobs()
    } catch (error) {
      console.error('Error handling job action:', error)
    }
  }

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 rounded-xl transition-all duration-200 font-medium"
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
                  <h1 className="text-lg font-semibold text-slate-900">Job Management</h1>
                  <p className="text-sm text-slate-600">Monitor and manage job postings</p>
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Job Management</h2>
                    <p className="text-slate-600 text-lg">Monitor and manage all job postings</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="btn-secondary">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Jobs
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <Card className="simple-card">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search jobs by title, company, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                          <SelectItem value="pending" className="text-slate-900 hover:bg-orange-50">
                            Pending
                          </SelectItem>
                          <SelectItem value="removed" className="text-slate-900 hover:bg-orange-50">
                            Removed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Jobs Table */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-orange-600" />
                      Job Postings ({filteredJobs.length})
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage job postings, approve or remove listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-slate-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-orange-50 rounded-2xl border border-orange-100 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-orange-100 hover:bg-orange-100">
                              <TableHead className="text-slate-700">Job</TableHead>
                              <TableHead className="text-slate-700">Employer</TableHead>
                              <TableHead className="text-slate-700">Status</TableHead>
                              <TableHead className="text-slate-700">Posted</TableHead>
                              <TableHead className="text-slate-700">Applications</TableHead>
                              <TableHead className="text-slate-700">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredJobs.map((job: any) => (
                              <TableRow key={job.id} className="border-orange-100 hover:bg-orange-100">
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-slate-900">{job.title}</div>
                                    <div className="text-sm text-slate-600">{job.company}</div>
                                    <div className="text-xs text-slate-500 flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {job.location}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center">
                                      <DollarSign className="w-3 h-3 mr-1" />
                                      {job.salary}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-slate-900">{job.employer}</div>
                                    <div className="text-sm text-slate-600">{job.employerEmail}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`${
                                      job.status === "active"
                                        ? "bg-green-500"
                                        : job.status === "pending"
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                    } text-white border-0 rounded-xl`}
                                  >
                                    {job.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600">{job.postedDate}</TableCell>
                                <TableCell className="text-slate-600">{job.applications}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    {job.status === "pending" ? (
                                      <Button
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                                        onClick={() => handleJobAction(job.id, "approve")}
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                        onClick={() => handleJobAction(job.id, "remove")}
                                      >
                                        <Ban className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
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