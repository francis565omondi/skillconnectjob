"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, Briefcase, Building, MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function JobApplicationPage() {
  const params = useParams()
  const jobId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    coverLetter: "",
    experienceSummary: "",
    expectedSalary: "",
    availableStartDate: "",
    additionalInfo: "",
  })

  // Fetch job details from Supabase
  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const fetchPromise = supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        console.error('Error fetching job:', error)
        setJob(null)
      } else {
        setJob(data)
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      setJob(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB")
        return
      }
      setCvFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!cvFile) {
      alert("Please upload your CV")
      setIsSubmitting(false)
      return
    }

    if (!formData.coverLetter.trim()) {
      alert("Please write a cover letter")
      setIsSubmitting(false)
      return
    }

    if (!formData.experienceSummary.trim()) {
      alert("Please provide your experience summary")
      setIsSubmitting(false)
      return
    }

    try {
      // For now, we'll store the file name instead of uploading to storage
      // In a real app, you'd upload to Supabase Storage
      const applicationData = {
        job_id: jobId,
        applicant_name: "John Doe", // This should come from user profile
        applicant_email: "john@example.com", // This should come from user profile
        cover_letter: formData.coverLetter,
        experience_summary: formData.experienceSummary,
        expected_salary: formData.expectedSalary,
        available_start_date: formData.availableStartDate,
        additional_info: formData.additionalInfo,
        cv_filename: cvFile.name,
        status: "pending"
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()

      if (error) {
        console.error('Error submitting application:', error)
        alert("Failed to submit application. Please try again.")
      } else {
        setApplicationSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading job details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button className="w-full" asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully
              submitted.
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/seeker">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs">Browse More Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">SkillConnect</span>
            </Link>
            <Button variant="outline" asChild>
              <Link href={`/jobs/${job.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Job Summary */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {job.salary || "Salary not specified"}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2 capitalize">
                    {job.job_type?.replace('-', ' ')}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                  <CardDescription>Fill out the form below to submit your application</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CV Upload */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Upload Your CV <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label htmlFor="cv-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Click to upload your CV (PDF only, max 5MB)
                          </p>
                          {cvFile && (
                            <div className="flex items-center justify-center mt-2">
                              <FileText className="w-4 h-4 mr-2 text-green-600" />
                              <span className="text-sm text-green-600">{cvFile.name}</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <Label htmlFor="coverLetter" className="text-sm font-medium mb-3 block">
                        Cover Letter <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                        className="min-h-32"
                        value={formData.coverLetter}
                        onChange={(e) => setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">{formData.coverLetter.length}/500 characters</p>
                    </div>

                    {/* Experience Summary */}
                    <div>
                      <Label htmlFor="experienceSummary" className="text-sm font-medium mb-3 block">
                        Experience Summary <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="experienceSummary"
                        placeholder="Briefly describe your relevant work experience and achievements..."
                        className="min-h-24"
                        value={formData.experienceSummary}
                        onChange={(e) => setFormData((prev) => ({ ...prev, experienceSummary: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Expected Salary */}
                    <div>
                      <Label htmlFor="expectedSalary" className="text-sm font-medium mb-3 block">
                        Expected Salary (KES)
                      </Label>
                      <Input
                        id="expectedSalary"
                        type="text"
                        placeholder="e.g., 120,000"
                        value={formData.expectedSalary}
                        onChange={(e) => setFormData((prev) => ({ ...prev, expectedSalary: e.target.value }))}
                      />
                    </div>

                    {/* Available Start Date */}
                    <div>
                      <Label htmlFor="availableStartDate" className="text-sm font-medium mb-3 block">
                        Available Start Date
                      </Label>
                      <Input
                        id="availableStartDate"
                        type="date"
                        value={formData.availableStartDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, availableStartDate: e.target.value }))}
                      />
                    </div>

                    {/* Additional Information */}
                    <div>
                      <Label htmlFor="additionalInfo" className="text-sm font-medium mb-3 block">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Any additional information you'd like to share..."
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Job Information Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Company</h4>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Location</h4>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Job Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">{job.job_type?.replace('-', ' ')}</p>
                    </div>
                    {job.salary && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Salary</h4>
                        <p className="text-sm text-muted-foreground">{job.salary}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Posted</h4>
                      <p className="text-sm text-muted-foreground">{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Application Tips:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Tailor your cover letter to the specific role</li>
                    <li>• Highlight relevant experience and skills</li>
                    <li>• Keep your CV updated and professional</li>
                    <li>• Follow up after submitting your application</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
