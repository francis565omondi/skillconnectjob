"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  MoreHorizontal, PlusCircle, Users, Eye, Edit, Trash, MapPin, DollarSign, Calendar, XCircle, CheckCircle, User,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar"
import {
  Home, Briefcase, Settings, Bell, LogOut, Building,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabaseClient"
import { EmployerGuard } from "@/components/admin-auth-guard"
import { Logo } from "@/components/logo"
import { ApplicationNavbar } from "@/components/apply-post-navbar"
import { JobsService } from "@/lib/jobsService"
import { useRouter } from "next/navigation"

/* -------------------------------------------------------------------------- */
/*  1.  SHARED DOMAIN MODELS                                                  */
/* -------------------------------------------------------------------------- */

export interface Employer {
  id: string
  company_name: string
  email: string
  first_name?: string
  last_name?: string
}

export interface Job {
  id: string
  title: string
  description: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  salary_min?: number
  salary_max?: number
  requirements: string[]
  benefits: string[]
  status: "active" | "inactive" | "draft" | "closed"
  applications_count?: number
  created_at: string
  updated_at: string
  employer_id: string
  experience_level?: "entry" | "mid" | "senior" | "lead"
  has_been_edited?: boolean
  contact_email?: string
  contact_phone?: string
  company_website?: string
  company_description?: string
  remote?: boolean
  category?: string
  visa_sponsorship?: boolean
  relocation_assistance?: boolean
}

interface JobFormState {
  title: string
  description: string
  company: string
  location: string
  salary_min: string
  salary_max: string
  job_type: "full-time" | "part-time" | "contract" | "internship"
  experience_level: "entry" | "mid" | "senior" | "lead"
  requirements: string
  benefits: string
  status: "active" | "inactive" | "draft" | "closed"
  contact_email: string
  contact_phone: string
  company_website: string
  company_description: string
  application_deadline: string
  remote_work: "remote" | "hybrid" | "on-site"
  category: string
  industry: string
  department: string
  team_size: string
  travel_requirements: string
  visa_sponsorship: boolean
  relocation_assistance: boolean
  additional_notes: string
}

/* -------------------------------------------------------------------------- */
/*  2.  COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function EmployerJobsPage() {
  /* ---------- 2.1  REACT STATE ------------------------------------------- */

  const [jobs, setJobs] = useState<Job[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentUser, setCurrentUser] = useState<Employer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState<JobFormState>({
    title: "",
    description: "",
    company: "",
    location: "",
    salary_min: "",
    salary_max: "",
    job_type: "full-time",
    experience_level: "mid",
    requirements: "",
    benefits: "",
    status: "active",
    contact_email: "",
    contact_phone: "",
    company_website: "",
    company_description: "",
    application_deadline: "",
    remote_work: "on-site",
    category: "",
    industry: "",
    department: "",
    team_size: "",
    travel_requirements: "",
    visa_sponsorship: false,
    relocation_assistance: false,
    additional_notes: "",
  })

  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const router = useRouter()

  /* ---------- 2.2  LOAD CURRENT USER ------------------------------------- */

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("skillconnect_user")
        if (userData) {
          const user = JSON.parse(userData) as Employer
          setCurrentUser(user)
          await fetchJobs(user)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  /* ---------- 2.3  FETCH JOBS WHEN USER IS READY ------------------------- */

  const fetchJobs = async (user: Employer) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("jobs")
        .select("*")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setJobs(data || [])
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to fetch jobs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  const openEditDialog = (job: Job) => {
    if (job.has_been_edited) {
      alert("This job has already been edited once. No further edits are allowed.")
      return
    }

    setForm({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      salary_min: job.salary_min?.toString() || "",
      salary_max: job.salary_max?.toString() || "",
      job_type: job.type,
      experience_level: job.experience_level || "mid",
      requirements: job.requirements.join("\n"),
      benefits: job.benefits.join("\n"),
      status: job.status,
      contact_email: job.contact_email || "",
      contact_phone: job.contact_phone || "",
      company_website: job.company_website || "",
      company_description: job.company_description || "",
      application_deadline: "",
      remote_work: job.remote ? "remote" : "on-site",
      category: job.category || "",
      industry: "",
      department: "",
      team_size: "",
      travel_requirements: "",
      visa_sponsorship: false,
      relocation_assistance: false,
      additional_notes: "",
    })
    setEditingJob(job)
    setShowDialog(true)
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      alert("User not found. Please log in again.")
      return
    }

    try {
      setIsSubmitting(true)

      const salary_min = form.salary_min ? parseInt(form.salary_min) : null
      const salary_max = form.salary_max ? parseInt(form.salary_max) : null

      const requirements = form.requirements
        .split("\n")
        .map((req) => req.trim())
        .filter((req) => req.length > 0)
      const benefits = form.benefits
        .split("\n")
        .map((benefit) => benefit.trim())
        .filter((benefit) => benefit.length > 0)

      const jobData = {
        title: form.title,
        description: form.description,
        company: form.company,
        location: form.location,
        type: form.job_type,
        salary_min: salary_min || undefined,
        salary_max: salary_max || undefined,
        requirements,
        benefits,
        status: (form.status === "inactive" ? "draft" : form.status) as "active" | "draft" | "closed",
        experience_level: form.experience_level as "entry" | "mid" | "senior" | "lead",
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        company_website: form.company_website,
        company_description: form.company_description,
        remote: form.remote_work === "remote",
        // category: form.category, // Temporarily commented out until column is added
        visa_sponsorship: form.visa_sponsorship,
        relocation_assistance: form.relocation_assistance,
      }

      if (editingJob) {
        // Update existing job using JobsService
        const updatedJob = await JobsService.updateJob(editingJob.id, jobData)

        setJobs(prev =>
          prev.map(job =>
            job.id === editingJob.id
              ? { 
                  ...job, 
                  ...updatedJob, 
                  has_been_edited: true, 
                  updated_at: new Date().toISOString(),
                  salary_min: salary_min || undefined,
                  salary_max: salary_max || undefined,
                  experience_level: form.experience_level as "entry" | "mid" | "senior" | "lead"
                } as Job
              : job
          )
        )
      } else {
        // Create new job using JobsService
        await JobsService.createJob(jobData, currentUser.id)

        // Refresh jobs list
        await fetchJobs(currentUser)
      }

      setShowDialog(false)
      setForm({
        title: "",
        description: "",
        company: "",
        location: "",
        salary_min: "",
        salary_max: "",
        job_type: "full-time",
        experience_level: "mid",
        requirements: "",
        benefits: "",
        status: "active",
        contact_email: "",
        contact_phone: "",
        company_website: "",
        company_description: "",
        application_deadline: "",
        remote_work: "on-site",
        category: "",
        industry: "",
        department: "",
        team_size: "",
        travel_requirements: "",
        visa_sponsorship: false,
        relocation_assistance: false,
        additional_notes: "",
      })
      setEditingJob(null)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error posting job:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      })
      
      // Provide more specific error messages
      let errorMessage = "Failed to post job. Please try again."
      if (error instanceof Error) {
        if (error.message.includes('User not authenticated')) {
          errorMessage = "Please log in again to post jobs."
        } else if (error.message.includes('User must be logged in as employer')) {
          errorMessage = "You must be logged in as an employer to post jobs."
        } else if (error.message.includes('Failed to create job')) {
          errorMessage = error.message
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again."
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    if (!currentUser) return

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)
      if (error) throw error

      await fetchJobs(currentUser)
      alert("Job deleted successfully!")
    } catch (err) {
      console.error("Error deleting job:", err)
      alert("Failed to delete job. Please try again.")
    }
  }

  const handleCloseJob = async (jobId: string) => {
    if (!currentUser) return
    try {
      const { error } = await supabase.from("jobs").update({ status: "closed" }).eq("id", jobId)
      if (error) throw error
      await fetchJobs(currentUser)
      alert("Job marked as filled (closed)!")
    } catch (err) {
      console.error("Error closing job:", err)
      alert("Failed to close job. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return <Badge className="bg-blue-100 text-blue-800">Full-time</Badge>
      case "part-time":
        return <Badge className="bg-purple-100 text-purple-800">Part-time</Badge>
      case "contract":
        return <Badge className="bg-orange-100 text-orange-800">Contract</Badge>
      case "internship":
        return <Badge className="bg-green-100 text-green-800">Internship</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getSalaryDisplay = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
    } else if (job.salary_min) {
      return `$${job.salary_min.toLocaleString()}+`
    } else if (job.salary_max) {
      return `Up to $${job.salary_max.toLocaleString()}`
    }
    return "Salary not specified"
  }

  /* ---------------------------------------------------------------------- */
  /*  3.  RENDER                                                            */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center p-4">
        <Card className="simple-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error Loading Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-600">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => currentUser && fetchJobs(currentUser)} className="btn-primary flex-1">
                Try Again
              </Button>
              <Button variant="outline" className="btn-secondary flex-1" asChild>
                <Link href="/fix-auth">Fix Auth</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <ApplicationNavbar backHref="/dashboard/employer" />
      <main className="min-h-screen bg-light-gradient p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">My Job Postings</h2>
                    <p className="text-slate-600 mt-1">
                      Manage your job postings and track applications
                    </p>
                  </div>
                  <Button onClick={() => setShowDialog(true)} className="btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                </div>

                {/* Jobs Table */}
        <Card className="simple-card mt-6">
                  <CardHeader>
                    <CardTitle>Job Postings ({jobs.length})</CardTitle>
                    <CardDescription>
                      All your posted jobs and their current status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-2 text-slate-600">Loading jobs...</span>
                      </div>
                    ) : jobs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Job Title</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Posted</TableHead>
                              <TableHead>Applications</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {jobs.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-slate-900">{job.title}</div>
                                    <div className="text-sm text-slate-500">{job.company}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm text-slate-600">
                                    <MapPin className="w-3 h-3" />
                                    {job.location}
                                  </div>
                                </TableCell>
                                <TableCell>{getJobTypeBadge(job.type)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getStatusBadge(job.status)}>
                                      {job.status}
                                    </Badge>
                                    {job.has_been_edited && (
                                      <Badge variant="outline" className="text-xs">
                                        Edited
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm text-slate-600">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(job.created_at).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-medium">{job.applications_count || 0}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/jobs/${job.id}`}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => openEditDialog(job)}
                                        disabled={job.has_been_edited}
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        {job.has_been_edited ? "Already Edited" : "Edit"}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleCloseJob(job.id)}
                                        disabled={job.status === "closed"}
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Close Job
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="text-red-600"
                                      >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
              <div className="text-center text-slate-500 py-8">No jobs posted yet.</div>
                    )}
                  </CardContent>
                </Card>

        {/* Post Job Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-white border-orange-200 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Post New Job</DialogTitle>
            </DialogHeader>

            <form onSubmit={handlePostJob} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Senior Frontend Developer"
                    required
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleFormChange}
                    placeholder={currentUser?.company_name || "Your company name"}
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleFormChange}
                    placeholder="e.g., Nairobi, Kenya"
                    required
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="salary_min" className="text-sm font-medium text-slate-700">
                    Minimum Salary
                  </Label>
                  <Input
                    id="salary_min"
                    name="salary_min"
                    value={form.salary_min}
                    onChange={handleFormChange}
                    placeholder="e.g., $50,000"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="salary_max" className="text-sm font-medium text-slate-700">
                    Maximum Salary
                  </Label>
                  <Input
                    id="salary_max"
                    name="salary_max"
                    value={form.salary_max}
                    onChange={handleFormChange}
                    placeholder="e.g., $70,000"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job_type" className="text-sm font-medium text-slate-700">
                    Job Type *
                  </Label>
                  <Select value={form.job_type} onValueChange={(value) => handleSelectChange("job_type", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience_level" className="text-sm font-medium text-slate-700">
                    Experience Level *
                  </Label>
                  <Select value={form.experience_level} onValueChange={(value) => handleSelectChange("experience_level", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                    Status *
                  </Label>
                  <Select value={form.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="remote_work" className="text-sm font-medium text-slate-700">
                    Remote Work *
                  </Label>
                  <Select value={form.remote_work} onValueChange={(value) => handleSelectChange("remote_work", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select remote work" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  required
                  className="mt-1 bg-white text-black border-gray-300"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email" className="text-sm font-medium text-slate-700">
                    Contact Email *
                  </Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={form.contact_email}
                    onChange={handleFormChange}
                    placeholder="hr@company.com"
                    required
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone" className="text-sm font-medium text-slate-700">
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={form.contact_phone}
                    onChange={handleFormChange}
                    placeholder="+254 700 000 000"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_website" className="text-sm font-medium text-slate-700">
                    Company Website
                  </Label>
                  <Input
                    id="company_website"
                    name="company_website"
                    value={form.company_website}
                    onChange={handleFormChange}
                    placeholder="https://company.com"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="application_deadline" className="text-sm font-medium text-slate-700">
                    Application Deadline
                  </Label>
                  <Input
                    id="application_deadline"
                    name="application_deadline"
                    type="date"
                    value={form.application_deadline}
                    onChange={handleFormChange}
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              {/* Company Description */}
              <div>
                <Label htmlFor="company_description" className="text-sm font-medium text-slate-700">
                  Company Description
                </Label>
                <Textarea
                  id="company_description"
                  name="company_description"
                  value={form.company_description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Brief description of your company, culture, and mission..."
                  className="mt-1 bg-white text-black border-gray-300"
                />
              </div>

              {/* Job Category and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-slate-700">
                    Job Category
                  </Label>
                  <Select value={form.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="human-resources">Human Resources</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="industry" className="text-sm font-medium text-slate-700">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={form.industry}
                    onChange={handleFormChange}
                    placeholder="e.g., Software Development"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-sm font-medium text-slate-700">
                    Department
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                    placeholder="e.g., Engineering"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              {/* Team and Travel Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_size" className="text-sm font-medium text-slate-700">
                    Team Size
                  </Label>
                  <Select value={form.team_size} onValueChange={(value) => handleSelectChange("team_size", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="1-5">1-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="11-25">11-25 people</SelectItem>
                      <SelectItem value="26-50">26-50 people</SelectItem>
                      <SelectItem value="51-100">51-100 people</SelectItem>
                      <SelectItem value="100+">100+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="travel_requirements" className="text-sm font-medium text-slate-700">
                    Travel Requirements
                  </Label>
                  <Select value={form.travel_requirements} onValueChange={(value) => handleSelectChange("travel_requirements", value)}>
                    <SelectTrigger className="mt-1 bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select travel requirements" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="none">No travel required</SelectItem>
                      <SelectItem value="occasional">Occasional travel</SelectItem>
                      <SelectItem value="frequent">Frequent travel</SelectItem>
                      <SelectItem value="extensive">Extensive travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="visa_sponsorship"
                    checked={form.visa_sponsorship}
                    onChange={(e) => setForm({ ...form, visa_sponsorship: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="visa_sponsorship" className="text-sm font-medium text-slate-700">
                    Visa Sponsorship Available
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="relocation_assistance"
                    checked={form.relocation_assistance}
                    onChange={(e) => setForm({ ...form, relocation_assistance: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="relocation_assistance" className="text-sm font-medium text-slate-700">
                    Relocation Assistance Available
                  </Label>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements" className="text-sm font-medium text-slate-700">
                  Requirements & Qualifications
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={form.requirements}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="List the key requirements, skills, and qualifications needed for this role..."
                  className="mt-1 bg-white text-black border-gray-300"
                />
              </div>

              {/* Benefits */}
              <div>
                <Label htmlFor="benefits" className="text-sm font-medium text-slate-700">
                  Benefits & Perks
                </Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  value={form.benefits}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Describe the benefits, perks, and what makes your company a great place to work..."
                  className="mt-1 bg-white text-black border-gray-300"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="additional_notes" className="text-sm font-medium text-slate-700">
                  Additional Notes
                </Label>
                <Textarea
                  id="additional_notes"
                  name="additional_notes"
                  value={form.additional_notes}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Any additional information about the role, application process, or company..."
                  className="mt-1 bg-white text-black border-gray-300"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="btn-secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Job Posted Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your job has been published and is now visible to job seekers. 
                  You can manage applications and track performance in your dashboard.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push('/dashboard/employer/applicants')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Applications
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/dashboard/employer/profile')}
                    variant="outline"
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Update Company Profile
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/jobs')}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Jobs
                  </Button>
                  
                  <Button 
                    onClick={() => setShowSuccessModal(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
   