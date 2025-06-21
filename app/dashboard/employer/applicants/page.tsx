"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MoreHorizontal,
  FileDown,
  Search,
  Filter,
  Eye,
  Mail,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Briefcase,
  User,
  Settings,
  LogOut,
  Building,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmployerGuard } from "@/components/admin-auth-guard"
import { supabase } from "@/lib/supabaseClient"

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState([])
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
      
      // First get the employer's jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', currentUser.id)

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError)
        setApplicants([])
        return
      }

      if (!jobs || jobs.length === 0) {
        setApplicants([])
        setIsLoading(false)
        return
      }

      const jobIds = jobs.map(job => job.id)

      // Then get applications for those jobs
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(title, company),
          profiles!inner(first_name, last_name, email, phone)
        `)
        .in('job_id', jobIds)
        .order('applied_at', { ascending: false })

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError)
        setApplicants([])
      } else {
        const formattedApplications = applications.map(app => ({
          id: app.id,
          name: `${app.profiles.first_name} ${app.profiles.last_name}`,
          avatar: "/placeholder-user.jpg",
          jobTitle: app.jobs.title,
          appliedDate: new Date(app.applied_at).toLocaleDateString(),
          status: app.status,
          email: app.profiles.email,
          phone: app.profiles.phone,
          coverLetter: app.cover_letter,
          experienceSummary: app.experience_summary,
          expectedSalary: app.expected_salary,
          availableStartDate: app.available_start_date,
          additionalInfo: app.additional_info,
          cvUrl: app.cv_url
        }))
        
        setApplicants(formattedApplications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplicants([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "shortlisted":
        return "bg-purple-100 text-purple-800"
      case "accepted":
        return "bg-indigo-100 text-indigo-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         applicant.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <EmployerGuard>
      <div className="min-h-screen bg-light-gradient">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-orange-200 bg-white">
              <SidebarHeader>
                <div className="flex items-center space-x-3 px-4 py-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">
                    SkillConnect
                  </span>
                </div>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-slate-600 font-semibold uppercase tracking-wide text-xs">
                    Menu
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer">
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
                          <Link href="/dashboard/employer/jobs">
                            <Briefcase className="w-5 h-5" />
                            <span>Posted Jobs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-600 data-[active=true]:shadow-sm rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/applicants">
                            <Users className="w-5 h-5" />
                            <span>Applicants</span>
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
                          <Link href="/dashboard/employer/profile">
                            <User className="w-5 h-5" />
                            <span>Company Profile</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Link href="/dashboard/employer/settings">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
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
                  <h1 className="text-lg font-semibold text-slate-900">
                    Applicants
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </header>

              <main className="flex-1 space-y-8 p-6 scroll-simple">
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle>All Applicants</CardTitle>
                    <CardDescription>
                      Manage all candidates who have applied to your jobs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search by name or job title..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by Status" />
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
                    
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading applicants...</p>
                      </div>
                    ) : applicants.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No applicants yet</h3>
                        <p className="text-slate-600 mb-4">
                          When candidates apply to your jobs, they will appear here.
                        </p>
                        <Button asChild className="btn-primary">
                          <Link href="/dashboard/employer/jobs">
                            Post a Job
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Applied For</TableHead>
                            <TableHead>Date Applied</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredApplicants.map((applicant) => (
                            <TableRow key={applicant.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={applicant.avatar}
                                    alt={applicant.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <span className="font-medium">
                                    {applicant.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{applicant.jobTitle}</TableCell>
                              <TableCell>{applicant.appliedDate}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`border ${getStatusClass(
                                    applicant.status
                                  )}`}
                                >
                                  {applicant.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Toggle menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Contact Applicant
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileDown className="h-4 w-4 mr-2" />
                                      Download CV
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </EmployerGuard>
  )
} 