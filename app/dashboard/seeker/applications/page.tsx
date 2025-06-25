"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  Building,
  DollarSign,
  CalendarDays,
  FileText as FileTextIcon,
  Star,
  Clock as ClockIcon,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Share,
  Bookmark,
  BookmarkPlus,
  MessageSquare,
  Download as DownloadIcon,
  ExternalLink as ExternalLinkIcon,
  Heart,
  HeartOff,
  Archive,
  ArchiveRestore,
} from "lucide-react"
import Link from "next/link"
import { SeekerGuard } from "@/components/admin-auth-guard"
import { useStatusManager, StatusManager } from "@/components/ui/status-notification"
import { ApplicationsService, type Application, type ApplicationStats } from "@/lib/applicationsService"
import { Logo } from "@/components/logo"

export default function SeekerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "status" | "company">("recent")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set())
  const [showArchived, setShowArchived] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
    archived: 0
  })
  const { notifications, removeNotification, showSuccess, showError, showLoading } = useStatusManager()

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
      fetchApplicationStats()
    }
  }, [currentUser])

  // Real-time updates setup
  useEffect(() => {
    if (!currentUser?.id) return

    const subscription = ApplicationsService.subscribeToApplicationUpdates(
      currentUser.id,
      (payload) => {
        console.log('Application change detected:', payload)
        fetchApplications()
        fetchApplicationStats()
      }
    )

    return () => {
      ApplicationsService.unsubscribeFromApplicationUpdates(subscription)
    }
  }, [currentUser?.id])

  const fetchApplications = async () => {
    if (!currentUser) return

    try {
      setIsLoading(true)
      const apps = await ApplicationsService.getUserApplications(currentUser.id)
      setApplications(apps)
    } catch (error) {
      console.error('Error fetching applications:', error)
      showError('Failed to load applications')
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchApplicationStats = async () => {
    if (!currentUser) return

    try {
      const stats = await ApplicationsService.getUserApplicationStats(currentUser.id)
      setApplicationStats(stats)
    } catch (error) {
      console.error('Error fetching application stats:', error)
    }
  }

  const refreshApplications = async () => {
    setIsRefreshing(true)
    await fetchApplications()
    await fetchApplicationStats()
    setIsRefreshing(false)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    setIsUpdatingStatus(applicationId)
    try {
      await ApplicationsService.updateApplicationStatus(applicationId, newStatus)
      showSuccess('Application status updated successfully')
      await fetchApplications()
      await fetchApplicationStats()
    } catch (error) {
      console.error('Error updating application status:', error)
      showError('Failed to update application status')
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'accepted':
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'reviewed':
        return <Eye className="w-3 h-3" />
      case 'shortlisted':
        return <Star className="w-3 h-3" />
      case 'accepted':
      case 'hired':
        return <CheckCircle className="w-3 h-3" />
      case 'rejected':
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const toggleApplicationExpansion = (applicationId: string) => {
    const newExpanded = new Set(expandedApplications)
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId)
    } else {
      newExpanded.add(applicationId)
    }
    setExpandedApplications(newExpanded)
  }

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job?.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Sort applications
    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case 'status':
        return filtered.sort((a, b) => a.status.localeCompare(b.status))
      case 'company':
        return filtered.sort((a, b) => (a.job?.company || '').localeCompare(b.job?.company || ''))
      default:
        return filtered
    }
  }, [applications, searchQuery, statusFilter, sortBy])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Copied to clipboard')
    } catch (error) {
      showError('Failed to copy to clipboard')
    }
  }

  const shareApplication = async (application: Application) => {
    const shareText = `I applied for ${application.job?.title} at ${application.job?.company}`
    const shareUrl = `${window.location.origin}/jobs/${application.job_id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Job Application',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      copyToClipboard(`${shareText} - ${shareUrl}`)
    }
  }

  const downloadCV = async (cvUrl: string, filename: string) => {
    try {
      showLoading('Downloading CV...', 'Please wait while we prepare your document')
      
      // Check if URL is valid
      if (!cvUrl || !cvUrl.startsWith('http')) {
        throw new Error('Invalid CV URL')
      }

      // Get authenticated URL for downloading
      const authenticatedUrl = await ApplicationsService.getCVDownloadUrl(cvUrl)

      // Try to fetch the CV with proper headers
      const response = await fetch(authenticatedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*',
        },
        // Include credentials if needed for authenticated requests
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch CV: ${response.status} ${response.statusText}`)
      }

      // Check if the response is actually a file
      const contentType = response.headers.get('content-type')
      if (!contentType || (!contentType.includes('pdf') && !contentType.includes('word') && !contentType.includes('document'))) {
        console.warn('Response might not be a document file:', contentType)
      }

      const blob = await response.blob()
      
      // Check if blob is empty
      if (blob.size === 0) {
        throw new Error('CV file is empty')
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'cv.pdf'
      a.style.display = 'none'
      
      // Add to DOM, click, and cleanup
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
      
      showSuccess('CV downloaded successfully')
    } catch (error) {
      console.error('CV download error:', error)
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          showError('Download failed', 'Cannot download CV due to security restrictions. Try opening in a new tab.')
        } else if (error.message.includes('Failed to fetch')) {
          showError('Download failed', 'CV file not accessible. It may have been moved or deleted.')
        } else if (error.message.includes('Invalid CV URL')) {
          showError('Download failed', 'Invalid CV URL. Please contact support.')
        } else {
          showError('Download failed', error.message)
        }
      } else {
        showError('Download failed', 'An unexpected error occurred while downloading the CV.')
      }
      
      // Fallback: try to open in new tab
      try {
        window.open(cvUrl, '_blank', 'noopener,noreferrer')
        showSuccess('Opened CV in new tab')
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
      }
    }
  }

  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `KSh ${min.toLocaleString()} - ${max.toLocaleString()}`
    } else if (min) {
      return `KSh ${min.toLocaleString()}+`
    }
    return 'Competitive'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <SeekerGuard>
      <div className="min-h-screen bg-light-gradient">
        <StatusManager notifications={notifications} onRemove={removeNotification} />
        
        {/* Unique Applications Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-orange-200 sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-slate-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  My Applications
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Track and manage your job applications ({applicationStats.total} total)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={refreshApplications}
                  disabled={isRefreshing}
                  className="btn-secondary"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button className="btn-primary" asChild>
                  <Link href="/jobs">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Application Dashboard</h2>
              <p className="text-slate-600 mt-1">
                Monitor your job applications and track their progress
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowArchived(!showArchived)}
                className="btn-secondary"
              >
                {showArchived ? <ArchiveRestore className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
            </div>
          </div>

          {/* Application Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{applicationStats.total}</div>
                <div className="text-sm text-slate-600">Total</div>
              </CardContent>
            </Card>
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{applicationStats.pending}</div>
                <div className="text-sm text-slate-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{applicationStats.reviewed}</div>
                <div className="text-sm text-slate-600">Reviewed</div>
              </CardContent>
            </Card>
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{applicationStats.shortlisted}</div>
                <div className="text-sm text-slate-600">Shortlisted</div>
              </CardContent>
            </Card>
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{applicationStats.accepted}</div>
                <div className="text-sm text-slate-600">Accepted</div>
              </CardContent>
            </Card>
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{applicationStats.rejected}</div>
                <div className="text-sm text-slate-600">Rejected</div>
              </CardContent>
            </Card>
            <Card className="simple-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{applicationStats.archived}</div>
                <div className="text-sm text-slate-600">Archived</div>
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
                    placeholder="Search by job title, company, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-[180px]">
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
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="status">By Status</SelectItem>
                      <SelectItem value="company">By Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="simple-card">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedApplications.length > 0 ? (
              filteredAndSortedApplications.map((app) => (
                <Card key={app.id} className="simple-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-xl text-slate-900 mb-2">{app.job?.title || 'Unknown Job'}</h3>
                              <div className="flex items-center space-x-4 text-slate-600 mb-2">
                                <div className="flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  <span>{app.job?.company || 'Unknown Company'}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>{app.job?.location || 'Unknown Location'}</span>
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span>{formatSalary(app.job?.salary_min, app.job?.salary_max)}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-slate-500">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Applied: {formatDate(app.created_at)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>Updated: {formatDate(app.updated_at)}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {app.job?.type || 'full-time'}
                                </Badge>
                              </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`border-2 ${getStatusClass(app.status)} flex items-center`}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1 capitalize">{app.status}</span>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleApplicationExpansion(app.id)}
                            >
                              {expandedApplications.has(app.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedApplications.has(app.id) && (
                          <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Application Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="font-medium">Expected Salary:</span> {app.expected_salary ? `KSh ${app.expected_salary.toLocaleString()}` : 'Not specified'}
                                    </div>
                                    <div>
                                      <span className="font-medium">Available Start Date:</span> {app.available_start_date || 'Not specified'}
                                    </div>
                                    <div>
                                      <span className="font-medium">CV:</span> {app.cv_url ? (
                                        <div className="flex items-center gap-2 mt-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              try {
                                                // Try to open in new tab first
                                                window.open(app.cv_url!, '_blank', 'noopener,noreferrer')
                                              } catch (error) {
                                                console.error('Error opening CV:', error)
                                                showError('Cannot open CV', 'Try downloading instead')
                                              }
                                            }}
                                            className="text-orange-600 hover:text-orange-700"
                                          >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View CV
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => downloadCV(app.cv_url!, app.cv_filename || 'cv.pdf')}
                                            className="text-orange-600 hover:text-orange-700"
                                          >
                                            <DownloadIcon className="w-4 h-4 mr-1" />
                                            Download
                                          </Button>
                                          <span className="text-xs text-slate-500">
                                            ({app.cv_filename || 'cv.pdf'})
                                          </span>
                                        </div>
                                      ) : 'Not uploaded'}
                                    </div>
                                    {app.portfolio_url && (
                                      <div>
                                        <span className="font-medium">Portfolio:</span> 
                                        <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline ml-1">
                                          View Portfolio
                                        </a>
                                      </div>
                                    )}
                                    {app.linkedin_url && (
                                      <div>
                                        <span className="font-medium">LinkedIn:</span> 
                                        <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline ml-1">
                                          View Profile
                                        </a>
                                      </div>
                                    )}
                                  </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Cover Letter</h4>
                                <div className="text-sm text-slate-600 max-h-32 overflow-y-auto">
                                  {app.cover_letter || 'No cover letter provided'}
                                </div>
                              </div>
                            </div>
                            
                            {app.experience_summary && (
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Experience Summary</h4>
                                <div className="text-sm text-slate-600">
                                  {app.experience_summary}
                                </div>
                              </div>
                            )}

                            {app.additional_info && (
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Additional Information</h4>
                                <div className="text-sm text-slate-600">
                                  {app.additional_info}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => shareApplication(app)}
                                >
                                  <Share className="w-4 h-4 mr-1" />
                                  Share
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => copyToClipboard(`${window.location.origin}/jobs/${app.job_id}`)}
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy Link
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/jobs/${app.job_id}`}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Job
                                  </Link>
                                </Button>
                                <Button size="sm" className="btn-primary">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Contact Employer
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="simple-card">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Found</h3>
                  <p className="text-slate-600 mb-6">
                    {searchQuery || statusFilter !== "all" 
                      ? "No applications found that match your search criteria."
                      : "You haven't applied to any jobs yet. Start browsing and applying to opportunities!"
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Button className="btn-primary" asChild>
                      <Link href="/jobs">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </Link>
                    </Button>
                    {(searchQuery || statusFilter !== "all") && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery("")
                          setStatusFilter("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination or Load More */}
          {filteredAndSortedApplications.length > 10 && (
            <div className="flex items-center justify-center">
              <Button variant="outline" className="btn-secondary">
                Load More Applications
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </SeekerGuard>
  )
}
