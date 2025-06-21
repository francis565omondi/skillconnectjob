"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { Search, MapPin, Clock, CheckCircle, Filter, Briefcase, Building, Home, Network, Menu, Info, MessageSquare } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fetch jobs from Supabase on component mount
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Check cache first
      const cachedJobs = localStorage.getItem('cached_public_jobs')
      const cacheTime = localStorage.getItem('cached_public_jobs_time')
      
      // Use cache if it's less than 5 minutes old
      if (cachedJobs && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
        setJobs(JSON.parse(cachedJobs))
        setIsLoading(false)
        return
      }

      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const fetchPromise = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        console.error('Error fetching jobs:', error)
        // Try to use cached data if available
        if (cachedJobs) {
          setJobs(JSON.parse(cachedJobs))
        } else {
          setJobs([])
        }
      } else {
        const jobsData = data || []
        setJobs(jobsData)
        // Cache the data
        localStorage.setItem('cached_public_jobs', JSON.stringify(jobsData))
        localStorage.setItem('cached_public_jobs_time', Date.now().toString())
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Try to use cached data if available
      const cachedJobs = localStorage.getItem('cached_public_jobs')
      if (cachedJobs) {
        setJobs(JSON.parse(cachedJobs))
      } else {
        setJobs([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Technology", label: "Technology" },
    { value: "Construction", label: "Construction" },
    { value: "Hospitality", label: "Hospitality" },
    { value: "Marketing", label: "Marketing" },
    { value: "Engineering", label: "Engineering" },
    { value: "Healthcare", label: "Healthcare" },
  ]

  const jobTypes = [
    { value: "all", label: "All Types" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
  ]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = location === "" || job.location.toLowerCase().includes(location.toLowerCase())
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    const matchesType = selectedType === "all" || job.job_type === selectedType

    return matchesSearch && matchesLocation && matchesCategory && matchesType
  })

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 48) {
      return "1 day ago"
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                About
              </Link>
              <Link href="/jobs" className="text-orange-600 font-semibold">
                Jobs
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="bg-orange-600 text-white hover:bg-orange-700" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                <Link 
                  href="/" 
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/jobs" 
                  className="text-orange-600 font-semibold py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link 
                  href="/contact" 
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" asChild>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button className="bg-orange-600 text-white hover:bg-orange-700" asChild>
                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Search Bar */}
      <section className="bg-orange-gradient text-white py-12 sm:py-16 md:py-20 relative">
        {/* Search Bar - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Job title, skills, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 bg-white/95 border-0 text-gray-900 placeholder-gray-500 rounded-lg w-32 sm:w-40 md:w-48 text-xs sm:text-sm shadow-lg"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-7 bg-white/95 border-0 text-gray-900 placeholder-gray-500 rounded-lg w-24 sm:w-28 md:w-32 text-xs sm:text-sm shadow-lg"
              />
            </div>
            <Button className="bg-white text-orange-600 hover:bg-orange-50 border-0 rounded-lg px-2 sm:px-3 text-xs sm:text-sm font-medium shadow-lg">
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Find Your Perfect<br />
              <span className="text-orange-100">Opportunity</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-orange-100 leading-relaxed">
              Discover amazing opportunities from verified employers across Kenya
            </p>

            {/* Mobile Search Bar */}
            <div className="lg:hidden bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Job title, skills, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500 rounded-xl"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500 rounded-xl"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="section-simple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-6">
            <Button 
              variant="outline" 
              className="w-full btn-secondary flex items-center justify-center"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Filters - Hidden on mobile by default */}
            <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="simple-card-orange">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-orange-200 bg-white text-slate-800"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Job Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-orange-200 bg-white text-slate-800"
                    >
                      {jobTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full btn-secondary"
                    onClick={() => {
                      setSearchTerm("")
                      setLocation("")
                      setSelectedCategory("all")
                      setSelectedType("all")
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  {isLoading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  {isLoading ? "Fetching the latest job opportunities..." : "Showing the best matches for your search"}
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="simple-card">
                      <CardContent className="p-4 sm:p-6">
                        <div className="animate-pulse">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 rounded-2xl"></div>
                              <div className="space-y-2 flex-1">
                                <div className="h-5 sm:h-6 bg-slate-200 rounded w-32 sm:w-48"></div>
                                <div className="h-4 bg-slate-200 rounded w-24 sm:w-32"></div>
                                <div className="h-3 bg-slate-200 rounded w-20 sm:w-24"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-5 sm:h-6 bg-slate-200 rounded w-16 sm:w-20"></div>
                              <div className="h-4 bg-slate-200 rounded w-20 sm:w-24"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <div className="h-6 bg-slate-200 rounded w-16"></div>
                            <div className="flex gap-2">
                              <div className="h-8 bg-slate-200 rounded w-16"></div>
                              <div className="h-8 bg-slate-200 rounded w-20"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="simple-card hover-lift">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-sm sm:text-lg font-bold flex-shrink-0">
                              {job.company ? job.company.substring(0, 2).toUpperCase() : "CO"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 line-clamp-2">{job.title}</h3>
                              <div className="flex items-center text-slate-600 mb-2">
                                <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{job.company}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-slate-500 space-y-1 sm:space-y-0">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{job.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span>{getTimeAgo(job.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <Badge className="bg-orange-100 text-orange-700 border-0 mb-2 capitalize text-xs">
                              {job.job_type?.replace('-', ' ')}
                            </Badge>
                            <div className="text-base sm:text-lg font-semibold text-orange-600">
                              {job.salary || "Salary not specified"}
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 mb-4 text-sm sm:text-base line-clamp-3">
                          {job.description?.length > 200 
                            ? `${job.description.substring(0, 200)}...` 
                            : job.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <Badge variant="outline" className="border-orange-200 text-orange-700 w-fit">
                            {job.category || "General"}
                          </Badge>
                          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-3">
                            <Button variant="outline" className="btn-secondary text-sm">
                              Save Job
                            </Button>
                            <Button className="btn-primary text-sm" asChild>
                              <Link href={`/jobs/${job.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoading && filteredJobs.length === 0 && (
                <Card className="simple-card text-center py-8 sm:py-12">
                  <CardContent>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
                    <p className="text-slate-600 mb-6 text-sm sm:text-base">Try adjusting your search criteria or filters</p>
                    <Button
                      className="btn-primary"
                      onClick={() => {
                        setSearchTerm("")
                        setLocation("")
                        setSelectedCategory("all")
                        setSelectedType("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
