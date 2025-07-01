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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Info,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { JobsService, type Job } from "@/lib/jobsService"
import { ApplicationsService, type CreateApplicationData } from "@/lib/applicationsService"
import { ApplicationNavbar } from "@/components/apply-post-navbar"
import { supabase } from "@/lib/supabaseClient"

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

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  
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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
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

      // Fetch user profile and auto-fill form
      await loadUserProfileAndAutoFill()

    } catch (error) {
      console.error('Error checking auth and fetching data:', error)
      showError('Failed to load job details')
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserProfileAndAutoFill = async () => {
    try {
      const userData = localStorage.getItem("skillconnect_user")
      if (!userData) return

      const user = JSON.parse(userData)
      
      // Fetch complete profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Use localStorage data as fallback
        setUserProfile(user)
      } else {
        setUserProfile(profile)
      }

      // Auto-fill form with comprehensive user data
      const fullName = `${profile?.first_name || user.first_name || ''} ${profile?.last_name || user.last_name || ''}`.trim()
      const email = profile?.email || user.email || ''
      const phone = profile?.phone || user.phone || ''
      const location = profile?.location || user.location || ''
      const bio = profile?.bio || user.bio || ''
      const experience = profile?.experience || user.experience || ''
      const education = profile?.education || user.education || ''
      const skills = profile?.skills || user.skills || []
      const portfolio = profile?.portfolio_url || user.portfolio_url || ''
      const linkedin = profile?.linkedin_url || user.linkedin_url || ''
      const github = profile?.github_url || user.github_url || ''
      const resumeUrl = profile?.resume_url || user.resume_url || ''

      // Create comprehensive experience summary from available data
      let experienceSummary = experience
      if (bio && !experienceSummary.includes(bio)) {
        experienceSummary = bio + '\n\n' + experienceSummary
      }
      if (education && !experienceSummary.includes(education)) {
        experienceSummary = experienceSummary + '\n\nEducation:\n' + education
      }
      if (skills.length > 0) {
        const skillsText = 'Skills: ' + skills.join(', ')
        if (!experienceSummary.includes(skillsText)) {
          experienceSummary = experienceSummary + '\n\n' + skillsText
        }
      }

      setFormData(prev => ({
        ...prev,
        applicant_name: fullName,
        applicant_email: email,
        applicant_phone: phone,
        experience_summary: experienceSummary.trim(),
        portfolio_url: portfolio,
        linkedin_url: linkedin,
        additional_info: location ? `Location: ${location}` : '',
      }))

      // Auto-fill CV if available
      if (resumeUrl) {
        setCvUrl(resumeUrl)
        setCvFilename(resumeUrl.split('/').pop() || 'CV/Resume')
      }

      // Check for missing important fields and provide helpful feedback
      const missing: string[] = []
      const suggestions: string[] = []

      if (!fullName) {
        missing.push('Full Name')
        suggestions.push('Please enter your full name as it appears on official documents')
      }
      if (!email) {
        missing.push('Email Address')
        suggestions.push('Please provide a valid email address for communication')
      }
      if (!phone) {
        missing.push('Phone Number')
        suggestions.push('Please provide your phone number for urgent communications')
      }
      if (!experienceSummary.trim()) {
        missing.push('Experience Summary')
        suggestions.push('Please summarize your relevant experience and skills for this position')
      }
      if (!resumeUrl) {
        missing.push('CV/Resume')
        suggestions.push('Please upload your CV/Resume to complete your application')
      }

      setMissingFields(missing)

      // Show success message for auto-filled fields
      const autoFilledFields = []
      if (fullName) autoFilledFields.push('Full Name')
      if (email) autoFilledFields.push('Email Address')
      if (phone) autoFilledFields.push('Phone Number')
      if (experienceSummary.trim()) autoFilledFields.push('Experience Summary')
      if (portfolio) autoFilledFields.push('Portfolio URL')
      if (linkedin) autoFilledFields.push('LinkedIn Profile')

      if (autoFilledFields.length > 0) {
        showSuccess(
          'Profile data loaded', 
          `Auto-filled: ${autoFilledFields.join(', ')}. Please review and complete any missing information.`
        )
      }

      // Show warning for missing important fields
      if (missing.length > 0) {
        showError(
          'Missing Information', 
          `Please complete: ${missing.join(', ')}. ${suggestions.join(' ')}`
        )
      }

    } catch (error) {
      console.error('Error loading user profile:', error)
      showError('Profile loading failed', 'Please fill in your details manually')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Remove field from missing fields if it's now filled
    if (value.trim() && missingFields.includes(field.replace('applicant_', '').replace('_', ' '))) {
      setMissingFields(prev => prev.filter(field => field !== field.replace('applicant_', '').replace('_', ' ')))
    }
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

      // Remove CV from missing fields
      setMissingFields(prev => prev.filter(field => field !== 'CV/Resume'))
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

    // Check for required fields
    const requiredFields = ['applicant_name', 'applicant_email', 'cover_letter', 'experience_summary']
    const missingRequired = requiredFields.filter(field => !formData[field as keyof typeof formData]?.trim())
    
    if (missingRequired.length > 0) {
      showError('Missing required fields', 'Please fill in all required fields marked with *')
      return
    }

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
      
      showSuccess('Application submitted successfully!', 'Your application has been sent to the employer. You can track its status in your dashboard.')
      
      // Show success modal with navigation options
      setShowSuccessModal(true)

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
      <>
        <ApplicationNavbar backHref="/jobs" />
        <div className="min-h-screen bg-white pt-20">
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
      </>
    )
  }

  if (!job) {
    return (
      <>
        <ApplicationNavbar backHref="/jobs" />
        <div className="min-h-screen bg-white pt-20">
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
      </>
    )
  }

  return (
    <>
      <ApplicationNavbar 
        backHref={`/jobs/${jobId}`} 
        jobTitle={job?.title}
        companyName={job?.company}
      />
      <div className="min-h-screen bg-gray-50 pt-20">
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
              
              {/* Missing Fields Alert */}
              {missingFields.length > 0 && (
                <Alert className="bg-orange-50 border-orange-200 mb-6">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Please complete your profile:</strong> The following information is missing and will help improve your application: {missingFields.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
              
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
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-orange-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="applicant_name" className="text-sm font-semibold text-gray-700 flex items-center">
                          Full Name *
                          {formData.applicant_name && (
                            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Auto-filled
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id="applicant_name"
                          value={formData.applicant_name}
                          onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                          required
                          className="mt-2"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="applicant_email" className="text-sm font-semibold text-gray-700 flex items-center">
                          Email Address *
                          {formData.applicant_email && (
                            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Auto-filled
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id="applicant_email"
                          type="email"
                          value={formData.applicant_email}
                          onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                          required
                          className="mt-2"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="applicant_phone" className="text-sm font-semibold text-gray-700 flex items-center">
                        Phone Number
                        {formData.applicant_phone && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Auto-filled
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id="applicant_phone"
                        type="tel"
                        value={formData.applicant_phone}
                        onChange={(e) => handleInputChange('applicant_phone', e.target.value)}
                        className="mt-2"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Application Details */}
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-orange-600" />
                      Application Details
                    </CardTitle>
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
                      <Label htmlFor="experience_summary" className="text-sm font-semibold text-gray-700 flex items-center">
                        Experience Summary *
                        {formData.experience_summary && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Auto-filled
                          </Badge>
                        )}
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
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-orange-600" />
                      CV/Resume
                      {cvUrl && (
                        <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Auto-loaded
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      {cvUrl ? (
                        <div className="space-y-4">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">CV Already Uploaded</h3>
                            <p className="text-gray-600 text-sm break-all">{cvFilename}</p>
                            <a
                              href={cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-700 underline text-sm"
                            >
                              View/Download CV
                            </a>
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
                              required={!cvUrl}
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
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-orange-600" />
                      Additional Information
                    </CardTitle>
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
                        <Label htmlFor="portfolio_url" className="text-sm font-semibold text-gray-700 flex items-center">
                          Portfolio URL
                          {formData.portfolio_url && (
                            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Auto-filled
                            </Badge>
                          )}
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
                        <Label htmlFor="linkedin_url" className="text-sm font-semibold text-gray-700 flex items-center">
                          LinkedIn Profile
                          {formData.linkedin_url && (
                            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Auto-filled
                            </Badge>
                          )}
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
        
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Application Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your application has been successfully sent to {job?.company}. 
                  You can track its status in your dashboard.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push('/dashboard/seeker/applications')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View My Applications
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/dashboard/seeker/profile')}
                    variant="outline"
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Update My Profile
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/jobs')}
                    variant="outline"
                    className="w-full"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse More Jobs
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
      </div>
    </>
  )
} 