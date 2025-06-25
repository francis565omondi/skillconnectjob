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
  MoreHorizontal, PlusCircle, Users, Eye, Edit, Trash, MapPin, DollarSign, Calendar,
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
  Home, Briefcase, User, Settings, Bell, LogOut, Building,
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
import { ApplyPostNavbar } from "@/components/apply-post-navbar"

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
}

interface JobFormState {
  title: string
  description: string
  company: string
  location: string
  salary: string
  job_type: "full-time" | "part-time" | "contract" | "internship"
  experience_level: "entry" | "mid" | "senior" | "lead"
  requirements: string
  benefits: string
  status: "active" | "inactive" | "draft"
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
    salary: "",
    job_type: "full-time",
    experience_level: "mid",
    requirements: "",
    benefits: "",
    status: "active",
  })

  const [editingJob, setEditingJob] = useState<Job | null>(null)

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
    setForm({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      salary: job.salary_min && job.salary_max
        ? `${job.salary_min} - ${job.salary_max}`
        : job.salary_min
        ? `${job.salary_min}+`
        : job.salary_max
        ? `Up to ${job.salary_max}`
        : "",
      job_type: job.type,
      experience_level: job.experience_level || "mid",
      requirements: job.requirements.join("\n"),
      benefits: job.benefits.join("\n"),
      status: job.status,
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

      // Parse salary range - improved parsing logic
      let salaryMin = null
      let salaryMax = null
      if (form.salary && form.salary.trim()) {
        const salaryText = form.salary.trim()
        
        // Handle different salary formats
        if (salaryText.includes('-')) {
          // Format: "50000 - 70000" or "$50,000 - $70,000"
          const parts = salaryText.split('-').map(part => part.trim())
          if (parts.length >= 2) {
            const minStr = parts[0].replace(/[^0-9]/g, '')
            const maxStr = parts[1].replace(/[^0-9]/g, '')
            
            if (minStr && maxStr) {
              salaryMin = parseInt(minStr)
              salaryMax = parseInt(maxStr)
              
              // Ensure min <= max for database constraint
              if (salaryMin > salaryMax) {
                [salaryMin, salaryMax] = [salaryMax, salaryMin]
              }
            }
          }
        } else if (salaryText.includes('+')) {
          // Format: "50000+" or "$50,000+"
          const minStr = salaryText.replace(/[^0-9]/g, '')
          if (minStr) {
            salaryMin = parseInt(minStr)
          }
        } else if (salaryText.toLowerCase().includes('up to')) {
          // Format: "Up to 70000" or "Up to $70,000"
          const maxStr = salaryText.replace(/[^0-9]/g, '')
          if (maxStr) {
            salaryMax = parseInt(maxStr)
          }
        } else {
          // Single number format: "50000" or "$50,000"
          const numStr = salaryText.replace(/[^0-9]/g, '')
          if (numStr) {
            salaryMin = parseInt(numStr)
          }
        }
      }

      // Convert form data to match database schema
      const jobData = {
        employer_id: currentUser.id,
        title: form.title.trim(),
        company: (currentUser.company_name || form.company).trim(),
        location: form.location.trim(),
        type: form.job_type,
        salary_min: salaryMin,
        salary_max: salaryMax,
        description: form.description.trim(),
        requirements: form.requirements ? form.requirements.split('\n').filter(req => req.trim()) : [],
        benefits: form.benefits ? form.benefits.split('\n').filter(benefit => benefit.trim()) : [],
        status: form.status,
        experience_level: form.experience_level,
      }

      console.log("Posting job data:", jobData)
      console.log("Current user:", currentUser)

      let result
      if (editingJob) {
        // Update existing job
        result = await supabase.from("jobs").update(jobData).eq("id", editingJob.id)
      } else {
        // Insert new job
        result = await supabase.from("jobs").insert(jobData).select()
      }

      if (result.error) {
        console.error("Supabase error details:", {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code
        })
        
        // Handle specific error cases
        if (result.error.code === '42501') {
          // Permission denied - RLS policy issue
          throw new Error("Permission denied. This might be due to Row Level Security policies. Please contact support.")
        } else if (result.error.code === '23514') {
          throw new Error("Salary range constraint violation. Please check your salary input.")
        } else if (result.error.code === '23503') {
          throw new Error("Foreign key constraint violation. Please check your user ID.")
        } else if (result.error.code === '23505') {
          throw new Error("Duplicate entry. This job already exists.")
        } else if (result.error.message) {
          throw new Error(`Database error: ${result.error.message}`)
        } else {
          throw new Error("Failed to post/update job. Please check your input and try again.")
        }
      }

      console.log("Job posted/updated successfully:", result.data)

      // Refresh jobs list
      await fetchJobs(currentUser)

      // Reset form
      setForm({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        job_type: "full-time",
        experience_level: "mid",
        requirements: "",
        benefits: "",
        status: "active",
      })

      setShowDialog(false)
      setEditingJob(null)
      alert(editingJob ? "Job updated successfully!" : "Job posted successfully!")
    } catch (err) {
      console.error("Error posting/updating job:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to post/update job. Please try again."
      alert(errorMessage)
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
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
      <ApplyPostNavbar backHref="/dashboard/employer" />
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
                                <TableCell>{getStatusBadge(job.status)}</TableCell>
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
                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/jobs/${job.id}`}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Job
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/employer/applicants`}>
                                          <Users className="w-4 h-4 mr-2" />
                                          View Applications
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => openEditDialog(job)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Job
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCloseJob(job.id)}>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                        Mark as Filled
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="text-red-600"
                                      >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete Job
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
                  <Label htmlFor="salary" className="text-sm font-medium text-slate-700">
                    Salary Range
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    value={form.salary}
                    onChange={handleFormChange}
                    placeholder="e.g., $50,000 - $70,000"
                    className="mt-1 bg-white text-black border-gray-300"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </main>
    </>
  )
}
   