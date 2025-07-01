"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Users, Shield, Briefcase, Brain, BarChart3, Settings, LogOut, Eye, AlertTriangle, CheckCircle, XCircle, Search, Filter, RefreshCw, Building, MapPin, DollarSign, Calendar, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminService, AdminJob } from "@/lib/adminService"
import { AdminGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import Link from "next/link"

interface Job extends AdminJob {
  // Additional properties specific to this page if needed
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [filteredJobs, setFilteredJobs] = useState<AdminJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterModeration, setFilterModeration] = useState("all")

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchQuery, filterStatus, filterModeration])

  const loadJobs = async () => {
    setIsLoading(true)
    try {
      const jobs = await AdminService.loadJobs()
      setJobs(jobs)
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions for jobs page...')
    
    // Subscribe to jobs changes
    const jobsSubscription = AdminService.subscribeToJobs((updatedJobs) => {
      console.log('Jobs updated via subscription:', updatedJobs.length)
      setJobs(updatedJobs)
    })

    // Cleanup subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time subscriptions...')
      AdminService.unsubscribeFromAll()
    }
  }, [])

  const filterJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || job.status === filterStatus
      const matchesModeration = filterModeration === 'all' || job.aiModerationStatus === filterModeration
      return matchesSearch && matchesStatus && matchesModeration
    })
    setFilteredJobs(filtered)
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

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      ))

      setShowJobModal(false)
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-light-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading Jobs...</p>
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
                        <SidebarMenuButton asChild isActive className="text-gray-700 hover:text-red-600 hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 rounded-xl transition-all duration-200 font-medium">
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
                    <h1 className="text-3xl font-bold text-slate-900">Job Moderation</h1>
                    <p className="text-slate-600 mt-1">Review and moderate job postings</p>
                  </div>
                  <Button onClick={loadJobs} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Jobs</p>
                          <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Jobs</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {jobs.filter(j => j.status === 'active').length}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="simple-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Flagged Jobs</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {jobs.filter(j => j.aiModerationStatus === 'flagged').length}
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
                          <p className="text-sm font-medium text-slate-600">Total Applications</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {jobs.reduce((sum, job) => sum + job.applications_count, 0)}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters and Search */}
                <Card className="simple-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search by title, company, or location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filterModeration} onValueChange={setFilterModeration}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="AI Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All AI Status</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="flagged">Flagged</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Jobs Table */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Jobs ({filteredJobs.length} found)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Job</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>AI Status</TableHead>
                            <TableHead>Applications</TableHead>
                            <TableHead>Posted</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobs.slice(0, 20).map((job) => (
                            <TableRow key={job.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{job.title}</p>
                                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                                    <span className="flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {job.location}
                                    </span>
                                    <span className="flex items-center">
                                      <DollarSign className="w-3 h-3 mr-1" />
                                      {job.salary_min && job.salary_max 
                                        ? `${job.salary_min}-${job.salary_max}`
                                        : 'Not specified'
                                      }
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">{job.company}</p>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                                  job.status === 'closed' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  job.aiModerationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                  job.aiModerationStatus === 'flagged' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {job.aiModerationStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm font-medium">{job.applications_count}</p>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-slate-600">
                                  {new Date(job.created_at).toLocaleDateString()}
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
                                      setSelectedJob(job)
                                      setShowJobModal(true)
                                    }}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {job.status === 'active' ? (
                                      <DropdownMenuItem onClick={() => handleJobAction(job.id, 'reject')}>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Close Job
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleJobAction(job.id, 'approve')}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Activate Job
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
                  </CardContent>
                </Card>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>

        {/* Job Details Modal */}
        <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Title</p>
                    <p className="text-sm">{selectedJob.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Company</p>
                    <p className="text-sm">{selectedJob.company}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Location</p>
                    <p className="text-sm">{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Type</p>
                    <p className="text-sm">{selectedJob.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Status</p>
                    <Badge className={
                      selectedJob.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedJob.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {selectedJob.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">AI Status</p>
                    <Badge className={
                      selectedJob.aiModerationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedJob.aiModerationStatus === 'flagged' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {selectedJob.aiModerationStatus}
                    </Badge>
                  </div>
                </div>
                
                {selectedJob.aiFlags && selectedJob.aiFlags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-600">AI Flags</p>
                    <div className="space-y-2 mt-2">
                      {selectedJob.aiFlags.map((flag, index) => (
                        <div key={index} className="p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-800">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  {selectedJob.status === 'active' ? (
                    <Button variant="destructive" onClick={() => handleJobAction(selectedJob.id, 'reject')}>
                      Close Job
                    </Button>
                  ) : (
                    <Button onClick={() => handleJobAction(selectedJob.id, 'approve')}>
                      Activate Job
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