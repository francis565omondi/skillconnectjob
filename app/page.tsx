"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Briefcase,
  Shield,
  Target,
  Award,
  Users,
  TrendingUp,
  Building,
  Zap,
  Menu,
  Newspaper,
  Calendar,
  Bell,
  Home,
  Network,
  Info,
  MessageSquare,
  Code,
  Hammer,
  Utensils,
  Heart,
  Car,
  GraduationCap,
  DollarSign,
  Eye,
  Plus,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fetch recent jobs from database
  useEffect(() => {
    fetchRecentJobs()
  }, [])

  const fetchRecentJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching recent jobs:', error)
        setRecentJobs([])
      } else {
        setRecentJobs(data || [])
      }
    } catch (error) {
      console.error('Error fetching recent jobs:', error)
      setRecentJobs([])
    } finally {
      setIsLoadingJobs(false)
    }
  }

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

  const jobCategories = [
    { icon: Code, name: "Technology", count: "2,500+", color: "bg-blue-500", jobs: "Software, IT, Data" },
    { icon: Hammer, name: "Construction", count: "1,800+", color: "bg-orange-500", jobs: "Building, Engineering" },
    { icon: Utensils, name: "Hospitality", count: "1,200+", color: "bg-green-500", jobs: "Hotels, Restaurants" },
    { icon: Heart, name: "Healthcare", count: "900+", color: "bg-red-500", jobs: "Medical, Nursing" },
    { icon: Car, name: "Transportation", count: "750+", color: "bg-purple-500", jobs: "Logistics, Driving" },
    { icon: GraduationCap, name: "Education", count: "600+", color: "bg-indigo-500", jobs: "Teaching, Training" },
  ]

  const employerFeatures = [
    {
      icon: Eye,
      title: "Reach Qualified Candidates",
      description: "Access our pool of verified professionals with detailed profiles and skill assessments.",
      metric: "15,000+ Active Job Seekers"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track application performance, candidate engagement, and hiring success rates.",
      metric: "95% Success Rate"
    },
    {
      icon: Plus,
      title: "Easy Job Posting",
      description: "Post jobs in minutes with our streamlined process and AI-powered optimization.",
      metric: "5-Minute Setup"
    },
    {
      icon: DollarSign,
      title: "Cost-Effective Hiring",
      description: "Reduce hiring costs with our competitive pricing and efficient matching system.",
      metric: "40% Cost Reduction"
    },
  ]

  const featuredJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechKE Solutions",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 150K - 250K",
      posted: "2 days ago",
      verified: true,
      initials: "TS"
    },
    {
      id: 2,
      title: "Construction Project Manager",
      company: "BuildRight Kenya",
      location: "Mombasa, Kenya",
      type: "Contract",
      salary: "KES 180K - 300K",
      posted: "3 days ago",
      verified: true,
      initials: "BK"
    },
    {
      id: 3,
      title: "Hotel Operations Manager",
      company: "Serena Hotels",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 120K - 200K",
      posted: "1 day ago",
      verified: true,
      initials: "SH"
    }
  ]

  const testimonials = [
    {
      name: "Mary Wanjiku",
      role: "Software Developer",
      content: "SkillConnect helped me find my dream job in tech. The platform is so easy to use!",
      rating: 5,
      initials: "MW",
    },
    {
      name: "John Ochieng",
      role: "Construction Manager",
      content: "As an employer, I love how simple it is to find qualified candidates. Highly recommended!",
      rating: 5,
      initials: "JO",
    },
    {
      name: "Grace Akinyi",
      role: "Hotel Supervisor",
      content: "Found my perfect job within two weeks. The mobile app works great even with slow internet!",
      rating: 5,
      initials: "GA",
    },
  ]

  const services = [
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "Smart algorithms match your skills with the most relevant job opportunities.",
    },
    {
      icon: Shield,
      title: "Verified Employers",
      description: "All employers are verified to ensure legitimate opportunities and safe working environments.",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Get real-time alerts for new job matches and application updates.",
    },
    {
      icon: Award,
      title: "Career Development",
      description: "Access resources and training programs to advance your professional growth.",
    },
  ]

  const stats = [
    { number: "5,000+", label: "Active Jobs", icon: Briefcase },
    { number: "15,000+", label: "Job Seekers", icon: Users },
    { number: "2,500+", label: "Employers", icon: Building },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
  ]

  const features = [
    {
      icon: Newspaper,
      title: "Local News",
      description: "Get the latest news and updates from your local area, keeping you informed on what matters most.",
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with your neighbors, share information, and build a stronger community together.",
    },
    {
      icon: Calendar,
      title: "Events Calendar",
      description: "Discover local events, from community gatherings to markets, and never miss out on what's happening.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                About
              </Link>
              <Link href="/jobs" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
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
                  className="text-orange-600 font-semibold py-2"
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
                  className="text-slate-700 hover:text-orange-600 transition-colors py-2"
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Search Bar - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Job title, skills, or company"
                  className="pl-7 bg-white/95 border-0 text-gray-900 placeholder-gray-500 rounded-lg w-32 sm:w-40 md:w-48 text-xs sm:text-sm shadow-lg"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Location"
                  className="pl-7 bg-white/95 border-0 text-gray-900 placeholder-gray-500 rounded-lg w-24 sm:w-28 md:w-32 text-xs sm:text-sm shadow-lg"
                />
              </div>
              <Button className="bg-white text-orange-600 hover:bg-orange-50 border-0 rounded-lg px-2 sm:px-3 text-xs sm:text-sm font-medium shadow-lg">
                <Search className="h-3 w-3 mr-1" />
                Search
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2 text-yellow-300" />
                Trusted by 15,000+ professionals
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Connect with Your Next<br />
                <span className="text-orange-100 bg-gradient-to-r from-orange-100 to-yellow-100 bg-clip-text text-transparent">Opportunity</span> in Kenya
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-orange-100 leading-relaxed max-w-lg lg:max-w-none">
                Join thousands of skilled professionals and verified employers. Our platform matches you with perfect opportunities in IT, construction, hospitality, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm" asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5,000+</div>
                  <div className="text-sm text-orange-100">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15,000+</div>
                  <div className="text-sm text-orange-100">Job Seekers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-orange-100">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-4">
                    {featuredJobs.slice(0, 2).map((job) => (
                      <div key={job.id} className="bg-white/90 rounded-2xl p-4 text-gray-900 shadow-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-sm">{job.initials}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{job.title}</h3>
                              <p className="text-xs text-gray-600">{job.company}</p>
                            </div>
                          </div>
                          {job.verified && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {job.type}
                            </span>
                          </div>
                          <span className="font-semibold text-orange-600">{job.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-simple py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{stat.number}</span>
                </div>
                <p className="text-sm sm:text-base text-orange-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="section-simple bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">Explore Job Categories</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Find opportunities in your field with our comprehensive job categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {jobCategories.map((category, index) => (
              <Link key={index} href={`/jobs?category=${category.name.toLowerCase()}`} className="group">
                <Card className="simple-card hover-lift text-center transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{category.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{category.jobs}</p>
                    <p className="text-xs text-orange-600 font-medium">{category.count} jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" className="btn-secondary" asChild>
              <Link href="/jobs">
                Browse All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Job Postings Section */}
      <section className="section-simple bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">Recently Posted Jobs</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Latest opportunities from verified employers across Kenya
            </p>
          </div>
          
          {isLoadingJobs ? (
            <div className="grid-responsive-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="simple-card">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid-responsive-3">
              {recentJobs.map((job) => (
                <Card key={job.id} className="simple-card hover-lift">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {job.company?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{job.title}</CardTitle>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(job.created_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.job_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-orange-600">{job.salary_range || 'Competitive'}</span>
                      <span className="text-xs text-gray-500">{job.category}</span>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl" asChild>
                      <Link href={`/jobs/${job.id}/apply`}>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Jobs</h3>
              <p className="text-gray-600 mb-6">Check back soon for new opportunities!</p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href="/jobs">Browse All Jobs</Link>
              </Button>
            </div>
          )}
          
          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" className="btn-secondary" asChild>
              <Link href="/jobs">
                View All Recent Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-simple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">Why Choose SkillConnect?</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Our platform is designed to make job hunting and hiring seamless, efficient, and successful
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="simple-card text-center hover-lift">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <service.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{service.title}</CardTitle>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Features Section */}
      <section className="section-simple bg-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">For Employers</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Find the perfect candidates for your organization with our powerful hiring tools
            </p>
          </div>
          
          <div className="grid-responsive-2">
            {employerFeatures.map((feature, index) => (
              <Card key={index} className="simple-card hover-lift border-orange-200">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{feature.description}</p>
                      <Badge className="bg-orange-100 text-orange-700 border-0 font-medium">
                        {feature.metric}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href="/auth/signup">
                  <Plus className="mr-2 h-5 w-5" />
                  Post a Job
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary" asChild>
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-simple bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-lg mb-4">What Our Users Say</h2>
            <p className="text-simple max-w-2xl mx-auto">
              Join thousands of satisfied users who have found their dream jobs through SkillConnect
            </p>
          </div>
          
          <div className="grid-responsive-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card hover-lift">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-orange-100 max-w-2xl mx-auto">
            Join thousands of professionals and employers who trust SkillConnect for their career and hiring needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 w-full sm:w-auto" asChild>
              <Link href="/auth/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
