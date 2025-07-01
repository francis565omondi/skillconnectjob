"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { GoogleMap } from "@/components/ui/map"
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building,
  Filter,
  ArrowRight,
  Eye,
  Bookmark,
  Share2,
  ChevronDown,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { JobsService, type Job } from "@/lib/jobsService"

const SESSION_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours in ms
const JOBS_PER_PAGE = 8

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchQuery, locationFilter, typeFilter])

  useEffect(() => {
    const startIndex = 0
    const endIndex = currentPage * JOBS_PER_PAGE
    setDisplayedJobs(filteredJobs.slice(startIndex, endIndex))
  }, [filteredJobs, currentPage])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      // Only fetch first 20 jobs initially for faster loading
      const jobsData = await JobsService.getJobs(undefined, undefined, 20)
      setJobs(jobsData)
      setFilteredJobs(jobsData)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreJobs = async () => {
    try {
      setIsLoadingMore(true)
      const moreJobs = await JobsService.getJobs(undefined, undefined, 20)
      setJobs(prev => [...prev, ...moreJobs])
      setFilteredJobs(prev => [...prev, ...moreJobs])
    } catch (error) {
      console.error("Error loading more jobs:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (typeFilter) {
      filtered = filtered.filter(job => job.type === typeFilter)
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFilteredJobs(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocationFilter("")
    setTypeFilter("")
  }

  const loadMore = () => {
    if (displayedJobs.length < filteredJobs.length) {
      setCurrentPage(prev => prev + 1)
    } else {
      loadMoreJobs()
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

  function handleApplyNow(jobId) {
    const session = sessionStorage.getItem("skillconnect_session");
    if (!session) {
      // Not logged in, redirect to signup
      window.location.href = `/auth/signup?redirect=/jobs/${jobId}/apply`;
      return;
    }
    const sessionData = JSON.parse(session);
    if (!sessionData.isLoggedIn || sessionData.role !== 'seeker') {
      // Not a seeker, redirect to login
      window.location.href = `/auth/login?redirect=/jobs/${jobId}/apply`;
      return;
    }
    // Check session age
    if (!sessionData.lastLogin || (Date.now() - sessionData.lastLogin > SESSION_TIMEOUT)) {
      // Session is old, force re-login
      window.location.href = `/auth/login?redirect=/jobs/${jobId}/apply`;
      return;
    }
    // All good, go to apply page
    window.location.href = `/jobs/${jobId}/apply`;
  }

  // Loading skeleton component
  const JobSkeleton = () => (
    <Card className="simple-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.15)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-md"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full shadow-lg">
              <Briefcase className="w-4 h-4 mr-2" />
              Find Your Next Job
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              Discover <span className="text-orange-100 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-50 bg-clip-text text-transparent">Amazing Jobs</span> in Kenya
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-orange-100 leading-relaxed max-w-3xl mx-auto font-medium">
              Browse thousands of opportunities and find the perfect match for your skills and career goals.
            </p>
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <form className="flex flex-col sm:flex-row items-stretch gap-3 bg-white/95 rounded-2xl shadow-xl p-2 sm:p-3 md:p-4 backdrop-blur-sm border border-orange-100">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-transparent border-0 text-gray-900 placeholder-gray-500 rounded-xl py-4 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6 py-4 text-lg font-semibold flex items-center gap-2 shadow-md transition-all duration-200"
                  onClick={e => { e.preventDefault(); /* trigger search/filter if needed */ }}
                >
                  <Search className="h-5 w-5 mr-1" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-simple bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{jobs.length}</div>
              <div className="text-sm text-gray-600 font-medium">Active Jobs</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Building className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {new Set(jobs.map(job => job.company)).size}
              </div>
              <div className="text-sm text-gray-600 font-medium">Companies</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {new Set(jobs.map(job => job.location)).size}
              </div>
              <div className="text-sm text-gray-600 font-medium">Locations</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">12.5K</div>
              <div className="text-sm text-gray-600 font-medium">Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="section-simple bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <Card className="simple-card rounded-2xl border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gray-900 flex items-center justify-between">
                    <span className="flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      Filters
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Location</label>
                    <Input
                      placeholder="Enter location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Job Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Job Locations Map */}
              <Card className="simple-card rounded-2xl border-0 shadow-lg mt-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                    Job Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <GoogleMap
                      center="Nairobi, Kenya"
                      zoom={8}
                      markers={jobs.slice(0, 10).map(job => ({
                        position: job.location,
                        title: job.title,
                        info: `${job.company}<br/>${job.location}<br/>${job.type}`
                      }))}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Click on markers to see job details
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Jobs List */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {filteredJobs.length} Jobs Found
                  </h2>
                  <p className="text-gray-600">
                    Showing {displayedJobs.length} of {filteredJobs.length} jobs
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="simple-card animate-pulse rounded-2xl border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : displayedJobs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedJobs.map((job) => (
                      <Card key={job.id} className="simple-card hover-lift rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-orange-600 font-bold text-sm">
                                  {job.company.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">{job.title}</CardTitle>
                                <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs font-semibold">
                                <Clock className="w-3 h-3 mr-1" />
                                {getTimeAgo(job.created_at)}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center font-medium">
                              <MapPin className="w-4 h-4 mr-2" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              {getJobTypeBadge(job.type)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-orange-600 text-lg">{getSalaryDisplay(job)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-semibold hover:scale-105 transition-all duration-300"
                              onClick={() => handleApplyNow(job.id)}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Apply Now
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* See More Jobs Button */}
                  {filteredJobs.length > JOBS_PER_PAGE && (
                    <div className="text-center mt-8">
                      <Button 
                        onClick={loadMore}
                        variant="outline" 
                        size="lg"
                        className="px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                      >
                        {isLoadingMore ? (
                          <Skeleton className="h-4 w-20" />
                        ) : (
                          "Load More Jobs"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card className="simple-card rounded-2xl border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Try adjusting your search criteria or filters to find more opportunities
                    </p>
                    <Button onClick={clearFilters} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full-width CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Find Your Dream Job?
            </h3>
            <p className="text-orange-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their perfect match through SkillConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                asChild 
                variant="secondary" 
                className="bg-white text-orange-600 hover:bg-orange-50 text-lg font-semibold px-8 py-4"
              >
                <Link href="/auth/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-orange-600 text-lg font-semibold px-8 py-4"
              >
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 