"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/footer"
import { ApplyPostNavbar } from "@/components/apply-post-navbar"
import { GoogleMap } from "@/components/ui/map"
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building,
  Calendar,
  User,
  ArrowLeft,
  Bookmark,
  Share2,
  Mail,
  Phone,
  Globe,
  FileText,
  CheckCircle,
  UserPlus,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { JobsService, type Job } from "@/lib/jobsService"
import { ApplicationsService } from "@/lib/applicationsService"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetchJobDetails()
    checkUserSession()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true)
      const jobData = await JobsService.getJobById(jobId)
      setJob(jobData)
      
      // Check if user has already applied
      const session = localStorage.getItem("skillconnect_session")
      if (session) {
        const sessionData = JSON.parse(session)
        if (sessionData.isLoggedIn && sessionData.role === 'seeker') {
          const applied = await ApplicationsService.hasUserAppliedToJob(sessionData.userId, jobId)
          setHasApplied(applied)
        }
      }
    } catch (error) {
      console.error("Error fetching job details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkUserSession = () => {
    const session = localStorage.getItem("skillconnect_session")
    if (session) {
      const sessionData = JSON.parse(session)
      if (sessionData.isLoggedIn) {
        setCurrentUser(sessionData)
      }
    }
  }

  const handleApplyNow = () => {
    if (!currentUser) {
      // User not logged in, redirect to signup
      router.push(`/auth/signup?redirect=/jobs/${jobId}/apply`)
      return
    }

    if (currentUser.role !== 'seeker') {
      // User logged in but not as seeker, redirect to login
      router.push(`/auth/login?redirect=/jobs/${jobId}/apply`)
      return
    }

    if (hasApplied) {
      // User has already applied, redirect to applications dashboard
      router.push('/dashboard/seeker/applications')
      return
    }

    // User is logged in as seeker and hasn't applied, redirect to application form
    router.push(`/jobs/${jobId}/apply`)
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "1 day ago"
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ApplyPostNavbar backHref="/jobs" />
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
        <ApplyPostNavbar backHref="/jobs" />
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
    <div className="min-h-screen bg-white">
      <ApplyPostNavbar backHref="/jobs" />
      
      {/* Job Header */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mr-4"
              asChild
            >
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
            <Badge className="bg-white/20 backdrop-blur-sm border border-white/30">
              <Clock className="w-3 h-3 mr-1" />
              Posted {getTimeAgo(job.created_at)}
            </Badge>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {job.title}
            </h1>
            <div className="flex items-center space-x-6 text-orange-100 mb-6">
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
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className={`text-lg font-semibold px-8 py-4 rounded-xl ${
                  hasApplied 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                }`}
                onClick={handleApplyNow}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Already Applied
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Apply Now
                  </>
                )}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {job.description}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && (
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {job.requirements}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && (
                <Card className="simple-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {job.benefits}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Summary */}
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-semibold text-gray-900">{getSalaryDisplay(job)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-semibold text-gray-900 capitalize">{job.type}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-gray-900">{job.location}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-semibold text-gray-900">{getTimeAgo(job.created_at)}</span>
                  </div>
                  {job.category && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Category</span>
                        <span className="font-semibold text-gray-900 capitalize">{job.category}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">About {job.company}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.company_description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {job.company_description}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    {job.company_website && (
                      <a 
                        href={job.company_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-orange-600 hover:text-orange-700 text-sm"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                    
                    {job.contact_email && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Mail className="w-4 h-4 mr-2" />
                        {job.contact_email}
                      </div>
                    )}
                    
                    {job.contact_phone && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Phone className="w-4 h-4 mr-2" />
                        {job.contact_phone}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location Map */}
              <Card className="simple-card">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                    Job Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 rounded-lg overflow-hidden border">
                    <GoogleMap
                      center={job.location}
                      zoom={13}
                      markers={[
                        {
                          position: job.location,
                          title: job.title,
                          info: `${job.company} - ${job.location}`
                        }
                      ]}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    {job.location}
                  </p>
                </CardContent>
              </Card>

              {/* Apply Button */}
              <Card className="simple-card">
                <CardContent className="p-6">
                  <Button 
                    className={`w-full text-lg font-semibold py-4 rounded-xl ${
                      hasApplied 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                    onClick={handleApplyNow}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Already Applied
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Apply Now
                      </>
                    )}
                  </Button>
                  
                  {hasApplied && (
                    <p className="text-center text-sm text-gray-600 mt-3">
                      You can track your application in your dashboard
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 