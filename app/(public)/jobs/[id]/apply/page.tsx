"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/footer"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building,
  Calendar,
  User,
  ArrowLeft,
  Upload,
  FileText,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { JobsService, type Job } from "@/lib/jobsService"
import { ApplicationsService, type CreateApplicationData } from "@/lib/applicationsService"
import { ApplyPostNavbar } from "@/components/apply-post-navbar"

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [hasApplied, setHasApplied] = useState(false)
  
  // Form fields
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
    experience_summary: '',
    expected_salary: '',
    available_start_date: '',
    additional_info: '',
    portfolio_url: '',
    linkedin_url: '',
  })
  
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUploading, setCvUploading] = useState(false)
  const [cvUrl, setCvUrl] = useState('')
  const [cvFilename, setCvFilename] = useState('')
  
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

  useEffect(() => {
    checkAuthAndFetchData()
  }, [jobId])

  const checkAuthAndFetchData = async () => {
    try {
      setIsLoading(true)
      
      // Check if user is logged in
      const session = sessionStorage.getItem("skillconnect_session")
      if (!session) {
        showError('Please log in to apply for this job')
        router.push(`/auth/login?redirect=/jobs/${jobId}/apply`)
        return
      }

      const sessionData = JSON.parse(session)
      if (!sessionData.isLoggedIn || sessionData.role !== 'seeker') {
        showError('You must be logged in as a job seeker to apply')
        router.push(`/auth/login?redirect=/jobs/${jobId}/apply`)
        return
      }

      setCurrentUser(sessionData)

      // Fetch job details
      const jobData = await JobsService.getJobById(jobId)
      setJob(jobData)

      // Check if user has already applied
      const applied = await ApplicationsService.hasUserAppliedToJob(sessionData.userId, jobId)
      setHasApplied(applied)

      if (applied) {
        showError('You have already applied for this job')
        router.push('/dashboard/seeker/applications')
        return
      }

      // Pre-fill form with user data
      const userData = localStorage.getItem("skillconnect_user")
      if (userData) {
        const user = JSON.parse(userData)
        setFormData(prev => ({
          ...prev,
          applicant_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          applicant_email: user.email || '',
          applicant_phone: user.phone || '',
        }))
      }

    } catch (error) {
      console.error('Error checking auth and fetching data:', error)
      showError('Failed to load job details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = async (file: File) => {
    if (!currentUser) {
      showError('Authentication required', 'Please log in to upload CV')
      return
    }

    try {
      // File validation
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      
      if (file.size > maxSize) {
        showError('File too large', 'CV must be less than 5MB')
        return
      }
      
      if (!allowedTypes.includes(file.type)) {
        showError('Invalid file type', 'Please upload PDF, DOC, or DOCX files only')
        return
      }

      console.log('Starting CV upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: currentUser.userId
      })

      setCvUploading(true)
      showLoading('Uploading CV...', 'Please wait while we upload your document')
      
      const result = await ApplicationsService.uploadCV(file, currentUser.userId)
      
      console.log('CV upload successful:', result)
      
      setCvUrl(result.url)
      setCvFilename(result.filename)
      showSuccess('CV uploaded successfully')
    } catch (error) {
      console.error('Error uploading CV:', error)
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage')) {
          showError('Upload failed', 'Storage service error. Please try again.')
        } else if (error.message.includes('permission')) {
          showError('Upload failed', 'Permission denied. Please check your account.')
        } else if (error.message.includes('network')) {
          showError('Upload failed', 'Network error. Please check your connection.')
        } else {
          showError('Upload failed', error.message)
        }
      } else {
        showError('Upload failed', 'An unexpected error occurred. Please try again.')
      }
    } finally {
      setCvUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      })
      setCvFile(file)
      handleFileUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser || !job) return

    try {
      setIsSubmitting(true)
      showLoading('Submitting your application...')

      const applicationData: CreateApplicationData = {
        job_id: jobId,
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone,
        cover_letter: formData.cover_letter,
        experience_summary: formData.experience_summary,
        expected_salary: formData.expected_salary ? parseInt(formData.expected_salary) : undefined,
        available_start_date: formData.available_start_date || undefined,
        additional_info: formData.additional_info || undefined,
        portfolio_url: formData.portfolio_url || undefined,
        linkedin_url: formData.linkedin_url || undefined,
        cv_url: cvUrl || undefined,
        cv_filename: cvFilename || undefined,
      }

      await ApplicationsService.createApplication(applicationData)
      
      showSuccess('Application submitted successfully!')
      
      // Redirect to applications dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard/seeker/applications')
      }, 2000)

    } catch (error) {
      console.error('Error submitting application:', error)
      showError('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSalaryDisplay = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `KSh ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
    } else if (job.salary_min) {
      return `KSh ${job.salary_min.toLocaleString()}+`
    }
    return "Salary not specified"
  }

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return <Badge className="bg-blue-100 text-blue-700 border-0 font-semibold">Full-time</Badge>
      case "part-time":
        return <Badge className="bg-purple-100 text-purple-700 border-0 font-semibold">Part-time</Badge>
      case "contract":
        return <Badge className="bg-orange-100 text-orange-700 border-0 font-semibold">Contract</Badge>
      case "internship":
        return <Badge className="bg-green-100 text-green-700 border-0 font-semibold">Internship</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        <div className="container mx-auto px-4 py-8 text-center">
          <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Job Not Found</h1>
          <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <ApplyPostNavbar backHref={`/jobs`} />
      <div className="min-h-screen bg-gray-50">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-4"
                asChild
              >
                <Link href={`/jobs/${jobId}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Job
                </Link>
              </Button>
            </div>
            
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Apply for {job.title}
              </h1>
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  {getJobTypeBadge(job.type)}
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-900 mb-1">Application Tips</h3>
                    <p className="text-orange-800 text-sm">
                      Make sure your cover letter is tailored to this specific role and company. 
                      Highlight relevant experience and explain why you're the perfect fit for this position.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="applicant_name" className="text-sm font-semibold text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="applicant_name"
                          value={formData.applicant_name}
                          onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="applicant_email" className="text-sm font-semibold text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="applicant_email"
                          type="email"
                          value={formData.applicant_email}
                          onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="applicant_phone" className="text-sm font-semibold text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="applicant_phone"
                        type="tel"
                        value={formData.applicant_phone}
                        onChange={(e) => handleInputChange('applicant_phone', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Application Details */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="cover_letter" className="text-sm font-semibold text-gray-700">
                        Cover Letter *
                      </Label>
                      <Textarea
                        id="cover_letter"
                        value={formData.cover_letter}
                        onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                        required
                        placeholder="Write a compelling cover letter explaining why you're the perfect candidate for this position..."
                        className="mt-2 min-h-[200px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience_summary" className="text-sm font-semibold text-gray-700">
                        Experience Summary *
                      </Label>
                      <Textarea
                        id="experience_summary"
                        value={formData.experience_summary}
                        onChange={(e) => handleInputChange('experience_summary', e.target.value)}
                        required
                        placeholder="Summarize your relevant experience and skills..."
                        className="mt-2 min-h-[150px]"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="expected_salary" className="text-sm font-semibold text-gray-700">
                          Expected Salary (KSh)
                        </Label>
                        <Input
                          id="expected_salary"
                          type="number"
                          value={formData.expected_salary}
                          onChange={(e) => handleInputChange('expected_salary', e.target.value)}
                          placeholder="e.g., 50000"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="available_start_date" className="text-sm font-semibold text-gray-700">
                          Available Start Date
                        </Label>
                        <Input
                          id="available_start_date"
                          type="date"
                          value={formData.available_start_date}
                          onChange={(e) => handleInputChange('available_start_date', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CV Upload */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">CV/Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      {cvUrl ? (
                        <div className="space-y-4">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">CV Uploaded Successfully</h3>
                            <p className="text-gray-600 text-sm">{cvFilename}</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCvFile(null)
                              setCvUrl('')
                              setCvFilename('')
                            }}
                          >
                            Upload Different File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Upload your CV/Resume</h3>
                            <p className="text-gray-600 text-sm mb-4">
                              PDF, DOC, or DOCX files up to 5MB
                            </p>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                              id="cv-upload"
                            />
                            <Label
                              htmlFor="cv-upload"
                              className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center"
                            >
                              {cvUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Choose File
                                </>
                              )}
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Information */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="additional_info" className="text-sm font-semibold text-gray-700">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additional_info"
                        value={formData.additional_info}
                        onChange={(e) => handleInputChange('additional_info', e.target.value)}
                        placeholder="Any additional information you'd like to share..."
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="portfolio_url" className="text-sm font-semibold text-gray-700">
                          Portfolio URL
                        </Label>
                        <Input
                          id="portfolio_url"
                          type="url"
                          value={formData.portfolio_url}
                          onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                          placeholder="https://your-portfolio.com"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin_url" className="text-sm font-semibold text-gray-700">
                          LinkedIn Profile
                        </Label>
                        <Input
                          id="linkedin_url"
                          type="url"
                          value={formData.linkedin_url}
                          onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                          placeholder="https://linkedin.com/in/your-profile"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                  >
                    <Link href={`/jobs/${jobId}`}>
                      Cancel
                    </Link>
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
} 